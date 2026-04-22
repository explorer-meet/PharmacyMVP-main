const ReturnRequest = require("../models/returnRequest");
const Order = require("../models/order");
const { StatusCodes } = require("http-status-codes");

// ─── Helpers ────────────────────────────────────────────────────────────────

const SLA_FIRST_RESPONSE_HOURS = 4;
const SLA_DECISION_HOURS = 24;

const addEvent = (timeline, actor, actorId, action, note = "") =>
  timeline.push({ actor, actorId, action, note, timestamp: new Date() });

const populateReturn = (query) =>
  query
    .populate("userId", "name email mobile")
    .populate("storeId", "storeName name email")
    .lean();

// ─── Patient: create return request ─────────────────────────────────────────

const createReturnRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, items, reason, description } = req.body;

    if (!orderId || !reason || !description || !String(description).trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "orderId, reason and description are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "At least one item must be selected for return",
      });
    }

    const allowedReasons = [
      "wrong_item",
      "damaged_pack",
      "delayed_delivery",
      "other",
    ];
    if (!allowedReasons.includes(reason)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid return reason",
      });
    }

    const order = await Order.findOne({ _id: orderId, userId }).lean();
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    // Prevent duplicate open/in-progress returns for same order
    const existing = await ReturnRequest.findOne({
      orderId,
      userId,
      status: {
        $nin: ["rejected", "refunded", "closed"],
      },
    }).lean();
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "An active return request already exists for this order",
        returnRequestId: existing._id,
      });
    }

    const now = new Date();
    const timeline = [];
    addEvent(timeline, "user", userId, "Return request created", reason);

    const returnReq = await ReturnRequest.create({
      orderId,
      orderRefId: order.orderId || String(orderId),
      userId,
      storeId: order.storeId,
      items: items.map((i) => ({
        itemId: i.itemId || "",
        name: i.name,
        quantity: Number(i.quantity) || 1,
      })),
      reason,
      description: String(description).trim(),
      status: "open",
      assignedToRole: "store",
      slaFirstResponseDeadline: new Date(
        now.getTime() + SLA_FIRST_RESPONSE_HOURS * 60 * 60 * 1000
      ),
      slaDecisionDeadline: new Date(
        now.getTime() + SLA_DECISION_HOURS * 60 * 60 * 1000
      ),
      timeline,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Return request submitted successfully",
      returnRequest: returnReq,
    });
  } catch (error) {
    console.error("createReturnRequest error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to submit return request" });
  }
};

// ─── Patient: get own return requests ───────────────────────────────────────

const getMyReturnRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const returns = await populateReturn(
      ReturnRequest.find(filter).sort({ createdAt: -1 })
    );

    return res.status(StatusCodes.OK).json({ success: true, returns });
  } catch (error) {
    console.error("getMyReturnRequests error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch return requests" });
  }
};

// ─── Shared: get single return by id ────────────────────────────────────────

const getReturnRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user?.roleLabel || "";
    const userId = req.user._id;

    const filter = { _id: id };
    if (role === "Patient") filter.userId = userId;
    else if (role === "Store") filter.storeId = userId;

    const returnReq = await populateReturn(ReturnRequest.findOne(filter));
    if (!returnReq) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Return request not found" });
    }

    return res.status(StatusCodes.OK).json({ success: true, returnRequest: returnReq });
  } catch (error) {
    console.error("getReturnRequestById error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch return request" });
  }
};

// ─── Store: get their return queue ──────────────────────────────────────────

const getStoreReturnRequests = async (req, res) => {
  try {
    const storeId = req.user._id;
    const { status } = req.query;

    const filter = { storeId };
    if (status) filter.status = status;

    const returns = await populateReturn(
      ReturnRequest.find(filter).sort({ createdAt: -1 })
    );

    return res.status(StatusCodes.OK).json({ success: true, returns });
  } catch (error) {
    console.error("getStoreReturnRequests error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch return requests" });
  }
};

// ─── Store: review return lifecycle (store-owned) ───────────────────────────

const reviewReturnRequest = async (req, res) => {
  try {
    const storeId = req.user._id;
    const { id } = req.params;
    const { action, note, refundMode, refundAmount } = req.body;

    const allowedActions = [
      "request_evidence",
      "approve",
      "reject",
      "mark_refunded",
      "close",
    ];
    if (!allowedActions.includes(action)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid action" });
    }

    const returnReq = await ReturnRequest.findOne({ _id: id, storeId });
    if (!returnReq) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Return request not found" });
    }

    const now = new Date();

    if (action === "request_evidence") {
      returnReq.status = "evidence_requested";
      returnReq.storeNote = note || "";
      if (!returnReq.slaFirstResponseAt) returnReq.slaFirstResponseAt = now;
      addEvent(
        returnReq.timeline,
        "store",
        storeId,
        "Evidence requested from customer",
        note || ""
      );
    } else if (action === "approve") {
      returnReq.status = "approved";
      returnReq.storeNote = note || "";
      returnReq.refundMode = refundMode || "wallet_credit";
      returnReq.refundAmount = Number(refundAmount) || 0;
      returnReq.slaDecisionAt = now;
      if (!returnReq.slaFirstResponseAt) returnReq.slaFirstResponseAt = now;
      addEvent(
        returnReq.timeline,
        "store",
        storeId,
        "Return approved",
        note || ""
      );
    } else if (action === "reject") {
      if (!note || !String(note).trim()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Rejection reason (note) is required",
        });
      }
      returnReq.status = "rejected";
      returnReq.rejectionReason = String(note).trim();
      returnReq.storeNote = String(note).trim();
      returnReq.slaDecisionAt = now;
      if (!returnReq.slaFirstResponseAt) returnReq.slaFirstResponseAt = now;
      addEvent(
        returnReq.timeline,
        "store",
        storeId,
        "Return rejected",
        note
      );
    } else if (action === "mark_refunded") {
      returnReq.status = "refunded";
      returnReq.refundMode = refundMode || returnReq.refundMode || "wallet_credit";
      returnReq.refundAmount = Number(refundAmount) || returnReq.refundAmount || 0;
      returnReq.storeNote = note || returnReq.storeNote || "";
      returnReq.slaDecisionAt = now;
      if (!returnReq.slaFirstResponseAt) returnReq.slaFirstResponseAt = now;
      addEvent(
        returnReq.timeline,
        "store",
        storeId,
        "Refund processed by store",
        note || ""
      );
    } else if (action === "close") {
      returnReq.status = "closed";
      returnReq.storeNote = note || returnReq.storeNote || "";
      returnReq.slaDecisionAt = now;
      if (!returnReq.slaFirstResponseAt) returnReq.slaFirstResponseAt = now;
      addEvent(
        returnReq.timeline,
        "store",
        storeId,
        "Return request closed by store",
        note || ""
      );
    }

    await returnReq.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Return request ${action.replace("_", " ")} successful`,
      returnRequest: returnReq,
    });
  } catch (error) {
    console.error("reviewReturnRequest error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update return request" });
  }
};

// ─── Patient: submit evidence ────────────────────────────────────────────────

const submitReturnEvidence = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { evidenceUrls, note } = req.body;

    if (!Array.isArray(evidenceUrls) || evidenceUrls.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "At least one evidence URL is required",
      });
    }

    const returnReq = await ReturnRequest.findOne({
      _id: id,
      userId,
      status: "evidence_requested",
    });
    if (!returnReq) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Return request not found or not awaiting evidence",
      });
    }

    returnReq.evidenceUrls = [
      ...returnReq.evidenceUrls,
      ...evidenceUrls.map((u) => String(u).trim()),
    ];
    returnReq.status = "store_review";
    addEvent(
      returnReq.timeline,
      "user",
      userId,
      "Evidence submitted",
      note || ""
    );

    await returnReq.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Evidence submitted successfully",
      returnRequest: returnReq,
    });
  } catch (error) {
    console.error("submitReturnEvidence error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to submit evidence" });
  }
};

module.exports = {
  createReturnRequest,
  getMyReturnRequests,
  getReturnRequestById,
  getStoreReturnRequests,
  reviewReturnRequest,
  submitReturnEvidence,
};
