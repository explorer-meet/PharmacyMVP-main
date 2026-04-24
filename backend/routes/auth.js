const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { signUp, signIn, forgotPassword, fetchData, updateStoreProfile, uploadStorePhoto, getStoreSettings, updateStoreSettings, uploadStaffPhoto, AdminfetchData, adminsignIn, uploadPrescriptionFile, UpdatePatientProfile, getFamilyProfiles, createFamilyProfile, updateFamilyProfile, deleteFamilyProfile, fetchpharmacymedicines, updateorderedmedicines, updatecartquantity, addmedicinetodb, decreaseupdatecartquantity, deletemedicine, finalitems, finaladdress, finalpayment, deletecartItems, createStoreApprovalRequest, getStoreApprovalRequests, reviewStoreApprovalRequest, getAllStores, updateStoreStatus, addStore, getUserNotificationPreferences, updateUserNotificationPreferences, uploadPrescriptionRequest, reuploadPrescriptionRequest, getMyPrescriptionRequests, getStorePrescriptionRequests, reviewPrescriptionRequest, getPrescriptionCheckout, placePrescriptionOrder, getStoreOrders, updateOrderTrackingStatus, getMyOrders, getOrderById, getStoreStaffMembers, createStoreStaffMember, updateStoreStaffMember, updateStoreStaffStatus, deleteStoreStaffMember, getCart, seedVaccinationMasterIfEmpty, upsertUserVaccination, getUserVaccinations, getVaccinationMaster, getUserVaccinationsForDashboard, updateUserVaccinationByMasterId, createUserQuery, getUserQueries, getStoreQueries, answerStoreQuery, importPatientsFromCsv, getMedicinesByStore, getProviders, createProvider, updateProvider, deleteProvider, getStoreInventory, createStoreInventoryMedicine, updateStoreInventoryMedicine, deleteStoreInventoryMedicine, createReview, updateReview, deleteReview, getPublicReviews, getStoreReviews, getMyReviews, getMyStoreReviews, replyToReview, uploadPrescriptionForAutoFill, extractMedicinesFromUploadedPrescription, getUserPrescriptionUploads, addExtractedMedicinesToCart, getWishlist, addToWishlist, removeFromWishlist, createMedicineTracker, getMedicineTrackers, logMedicineIntake, checkDrugInteractions, askHealthAssistant, getMedicalTimeline, exportHealthRecordsPdf, getPublicPromotionalCampaigns, validatePublicCoupon, getStoreAuditLogs, exportStoreAuditLogsCsv, getDailyCloseReport, getPrescriptionTurnaroundReport, getInventoryRiskReport, getMyInsurancePolicies, addInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy, downloadInsurancePolicyPdf, checkInsuranceExpiryReminders } = require("../controllers/auth");
const {
  getStoreRolePermissions,
  createStaffPerformanceRecord,
  getStaffPerformanceRecords,
  createStaffAttendanceRecord,
  getStaffAttendanceRecords,
  checkInStaffAttendance,
  checkOutStaffAttendance,
  createStaffTrainingRecord,
  getStaffTrainingRecords,
  createComplianceChecklistItem,
  getComplianceChecklistItems,
  updateComplianceChecklistItem,
  getComplianceReminders,
  createInvoice,
  getStoreInvoices,
  reconcileInvoicePayment,
  getPaymentReconciliationReport,
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  addSupplierPayment,
  getProfitMarginReport,
  getTaxReport,
  createPromotionalCampaign,
  getPromotionalCampaigns,
  updatePromotionalCampaignStatus,
  deletePromotionalCampaign,
} = require("../controllers/auth");
const { getCountries, getStatesByCountry, createCountry, createState } = require("../controllers/locationMaster");
const { getPincodeDetails } = require("../controllers/pincodeLookup");
const {
  createReturnRequest,
  getMyReturnRequests,
  getReturnRequestById,
  getStoreReturnRequests,
  reviewReturnRequest,
  submitReturnEvidence,
} = require("../controllers/returnController");
const verifyToken  = require("../middleware/authMiddleware");  

const uploadsDir = process.env.UPLOADS_DIR || path.join(os.tmpdir(), "medvision-uploads");
const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const prescriptionUpload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const isPdf = file.mimetype === 'application/pdf' || (file.mimetype === 'application/octet-stream' && String(file.originalname || '').toLowerCase().endsWith('.pdf'));
    if (file.mimetype.startsWith('image/') || isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const prescriptionUploadSingle = (req, res, next) => {
  prescriptionUpload.single('prescription')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Invalid prescription file upload' });
    }
    next();
  });
};

const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile picture'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const profileImageUploadSingle = (req, res, next) => {
  profileImageUpload.single('profileImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Invalid profile image upload' });
    }
    next();
  });
};

const storeRequestStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-store-' + file.originalname);
  }
});

const storeRequestUpload = multer({
  storage: storeRequestStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const patientsCsvUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const isCsvMime = ['text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/plain'].includes(file.mimetype);
    const isCsvExt = String(file.originalname || '').toLowerCase().endsWith('.csv');
    if (isCsvMime || isCsvExt) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const insuranceDocStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-insurance-' + file.originalname);
  }
});

const insuranceDocUpload = multer({
  storage: insuranceDocStorage,
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, images, and Word documents are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const patientsCsvUploadSingle = (req, res, next) => {
  patientsCsvUpload.single('patientsCsv')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Invalid CSV upload' });
    }
    next();
  });
};

// Define routes for authentication
router.post("/login", signIn);
router.post("/forgot-password", forgotPassword);
router.post("/signup", signUp);
router.post("/patientprofile", verifyToken(["User"]), profileImageUploadSingle, UpdatePatientProfile);
router.get("/fetchdata", verifyToken(["User", "Store"]), fetchData);
router.put("/store-profile", verifyToken(["Store"]), updateStoreProfile);
router.post("/store/photo", verifyToken(["Store"]), profileImageUploadSingle, uploadStorePhoto);
router.get("/store/settings", verifyToken(["Store"]), getStoreSettings);
router.put("/store/settings", verifyToken(["Store"]), updateStoreSettings);
router.post("/store-staff/:staffId/photo", verifyToken(["Store"]), profileImageUploadSingle, uploadStaffPhoto);
router.get("/user-notifications", verifyToken(["User"]), getUserNotificationPreferences);
router.put("/user-notifications", verifyToken(["User"]), updateUserNotificationPreferences);
router.post("/queries", verifyToken(["User"]), createUserQuery);
router.get("/queries", verifyToken(["User"]), getUserQueries);
router.get("/queries/store", verifyToken(["Store"]), getStoreQueries);
router.patch("/queries/:id/answer", verifyToken(["Store"]), answerStoreQuery);
router.get("/adminfetchdata", verifyToken(["admin"]), AdminfetchData);
router.post("/uploadpres", prescriptionUpload.single('prescription'), uploadPrescriptionFile);
router.post("/prescriptions/upload", verifyToken(["User"]), prescriptionUploadSingle, uploadPrescriptionRequest);
router.patch("/prescriptions/:id/reupload", verifyToken(["User"]), prescriptionUploadSingle, reuploadPrescriptionRequest);
router.get("/prescriptions/me", verifyToken(["User"]), getMyPrescriptionRequests);
router.get("/prescriptions/:id/checkout", verifyToken(["User"]), getPrescriptionCheckout);
router.post("/prescriptions/:id/place-order", verifyToken(["User"]), placePrescriptionOrder);
router.get("/prescriptions/store", verifyToken(["Store"]), getStorePrescriptionRequests);
router.patch("/prescriptions/:id/review", verifyToken(["Store"]), reviewPrescriptionRequest);
router.post("/updateorderedmedicines", updateorderedmedicines);
router.post("/updatecartquantity", updatecartquantity);
router.post("/addmedicine", verifyToken(["Store"]), addmedicinetodb);
router.post("/decreaseupdatecartquantity", decreaseupdatecartquantity);
router.post("/deletemedicine", deletemedicine);
router.get("/allmedicines", fetchpharmacymedicines);
router.post("/additemstocart", finalitems);
router.post("/addaddress", finaladdress);
router.post("/addpayment", finalpayment);
router.get("/cart", verifyToken(["User", "Store"]), getCart);
router.get("/orders/me", verifyToken(["User"]), getMyOrders);
router.get("/orders/:orderId", verifyToken(["User", "Store"]), getOrderById);
router.post("/deletefullcart", deletecartItems)
router.post("/store-requests", storeRequestUpload.single('storeLicenceFile'), createStoreApprovalRequest);
router.get("/store-requests", verifyToken(["admin"]), getStoreApprovalRequests);
router.patch("/store-requests/:id/review", verifyToken(["admin"]), reviewStoreApprovalRequest);
router.patch("/stores/:id/status", verifyToken(["admin"]), updateStoreStatus);
router.get("/allstores",getAllStores);
router.post("/stores", verifyToken(["admin"]), addStore);
router.get("/store-orders", verifyToken(["Store"]), getStoreOrders);
router.post("/patients/import-csv", verifyToken(["Store"]), patientsCsvUploadSingle, importPatientsFromCsv);
router.get("/store-staff", verifyToken(["Store"]), getStoreStaffMembers);
router.post("/store-staff", verifyToken(["Store"]), createStoreStaffMember);
router.put("/store-staff/:id", verifyToken(["Store"]), updateStoreStaffMember);
router.patch("/store-staff/:id/status", verifyToken(["Store"]), updateStoreStaffStatus);
router.delete("/store-staff/:id", verifyToken(["Store"]), deleteStoreStaffMember);
router.get("/store-staff/permissions", verifyToken(["Store"]), getStoreRolePermissions);

// Staff Performance
router.post("/staff/performance", verifyToken(["Store"]), createStaffPerformanceRecord);
router.get("/staff/performance", verifyToken(["Store"]), getStaffPerformanceRecords);

// Attendance & Shift Management
router.post("/staff/attendance", verifyToken(["Store"]), createStaffAttendanceRecord);
router.get("/staff/attendance", verifyToken(["Store"]), getStaffAttendanceRecords);
router.patch("/staff/attendance/:id/check-in", verifyToken(["Store"]), checkInStaffAttendance);
router.patch("/staff/attendance/:id/check-out", verifyToken(["Store"]), checkOutStaffAttendance);

// Staff Training
router.post("/staff/training", verifyToken(["Store"]), createStaffTrainingRecord);
router.get("/staff/training", verifyToken(["Store"]), getStaffTrainingRecords);

// Compliance Checklist
router.post("/compliance/checklist", verifyToken(["Store"]), createComplianceChecklistItem);
router.get("/compliance/checklist", verifyToken(["Store"]), getComplianceChecklistItems);
router.put("/compliance/checklist/:id", verifyToken(["Store"]), updateComplianceChecklistItem);
router.get("/compliance/reminders", verifyToken(["Store"]), getComplianceReminders);

// Financial Management
router.post("/finance/invoices", verifyToken(["Store"]), createInvoice);
router.get("/finance/invoices", verifyToken(["Store"]), getStoreInvoices);
router.patch("/finance/invoices/:invoiceId/payments", verifyToken(["Store"]), reconcileInvoicePayment);
router.get("/finance/reconciliation", verifyToken(["Store"]), getPaymentReconciliationReport);
router.get("/finance/profit-margin", verifyToken(["Store"]), getProfitMarginReport);
router.get("/finance/tax-report", verifyToken(["Store"]), getTaxReport);

// Promotional Campaign Management
router.post("/marketing/campaigns", verifyToken(["Store"]), createPromotionalCampaign);
router.get("/marketing/campaigns", verifyToken(["Store"]), getPromotionalCampaigns);
router.patch("/marketing/campaigns/:campaignId/status", verifyToken(["Store"]), updatePromotionalCampaignStatus);
router.delete("/marketing/campaigns/:campaignId", verifyToken(["Store"]), deletePromotionalCampaign);
router.get('/marketing/campaigns/public', getPublicPromotionalCampaigns);
router.post('/marketing/campaigns/validate-coupon', validatePublicCoupon);
router.get('/locations/pincode/:pincode', getPincodeDetails);

// Supplier Management
router.post("/suppliers", verifyToken(["Store"]), createSupplier);
router.get("/suppliers", verifyToken(["Store"]), getSuppliers);
router.put("/suppliers/:supplierId", verifyToken(["Store"]), updateSupplier);
router.delete("/suppliers/:supplierId", verifyToken(["Store"]), deleteSupplier);
router.patch("/suppliers/:supplierId/payments", verifyToken(["Store"]), addSupplierPayment);

// Order tracking status update
router.patch("/orders/:orderId/tracking", verifyToken(["Store"]), updateOrderTrackingStatus);
router.get('/audit/logs', verifyToken(['Store']), getStoreAuditLogs);
router.get('/audit/logs/export', verifyToken(['Store']), exportStoreAuditLogsCsv);
router.get('/reports/daily-close', verifyToken(['Store']), getDailyCloseReport);
router.get('/reports/prescription-turnaround', verifyToken(['Store']), getPrescriptionTurnaroundReport);
router.get('/reports/inventory-risk', verifyToken(['Store']), getInventoryRiskReport);

// Vaccination routes
router.post("/vaccinations", verifyToken(["User"]), upsertUserVaccination);
router.get("/vaccinations", verifyToken(["User"]), getUserVaccinations);
router.get("/vaccination-master", verifyToken(["User"]), getVaccinationMaster);
router.get("/user-vaccinations", verifyToken(["User"]), getUserVaccinationsForDashboard);
router.put("/user-vaccinations/:vaccinationId", verifyToken(["User"]), updateUserVaccinationByMasterId);
router.get('/medicines-by-store/:storeId', getMedicinesByStore);
router.get('/locations/countries', getCountries);
router.post('/locations/countries', verifyToken(['admin']), createCountry);
router.get('/locations/states', getStatesByCountry);
router.post('/locations/states', verifyToken(['admin']), createState);
router.get('/providers', verifyToken(['Store', 'admin']), getProviders);
router.post('/providers', verifyToken(['admin']), createProvider);
router.put('/providers/:providerId', verifyToken(['admin']), updateProvider);
router.delete('/providers/:providerId', verifyToken(['admin']), deleteProvider);
router.get('/store-inventory', verifyToken(['Store']), getStoreInventory);
router.post('/store-inventory', verifyToken(['Store']), createStoreInventoryMedicine);
router.put('/store-inventory/:medicineId', verifyToken(['Store']), updateStoreInventoryMedicine);
router.delete('/store-inventory/:medicineId', verifyToken(['Store']), deleteStoreInventoryMedicine);

// Prescription Upload for Auto-Fill Feature
router.post('/prescriptions/auto-fill/upload', verifyToken(['User']), prescriptionUploadSingle, uploadPrescriptionForAutoFill);
router.post('/prescriptions/auto-fill/:prescriptionId/extract', verifyToken(['User']), extractMedicinesFromUploadedPrescription);
router.get('/prescriptions/auto-fill', verifyToken(['User']), getUserPrescriptionUploads);
router.post('/prescriptions/auto-fill/:prescriptionId/add-to-cart', verifyToken(['User']), addExtractedMedicinesToCart);

// Wishlist
router.get('/wishlist', verifyToken(['User']), getWishlist);
router.post('/wishlist', verifyToken(['User']), addToWishlist);
router.delete('/wishlist/:medicineId', verifyToken(['User']), removeFromWishlist);

// Health Management
router.get('/health/trackers', verifyToken(['User']), getMedicineTrackers);
router.post('/health/trackers', verifyToken(['User']), createMedicineTracker);
router.patch('/health/trackers/:id/intake', verifyToken(['User']), logMedicineIntake);
router.post('/health/interactions/check', verifyToken(['User']), checkDrugInteractions);
router.post('/health/assistant', verifyToken(['User']), askHealthAssistant);
router.get('/health/timeline', verifyToken(['User']), getMedicalTimeline);
router.get('/health/export/pdf', verifyToken(['User']), exportHealthRecordsPdf);
router.get('/family-profiles', verifyToken(['User']), getFamilyProfiles);
router.post('/family-profiles', verifyToken(['User']), createFamilyProfile);
router.put('/family-profiles/:profileId', verifyToken(['User']), updateFamilyProfile);
router.delete('/family-profiles/:profileId', verifyToken(['User']), deleteFamilyProfile);

// Reviews
router.get('/reviews', getPublicReviews);
router.get('/reviews/store/me', verifyToken(['Store']), getMyStoreReviews);
router.get('/reviews/store/:storeId', getStoreReviews);
router.post('/reviews', verifyToken(['User']), createReview);
router.put('/reviews/:id', verifyToken(['User']), updateReview);
router.patch('/reviews/:id/reply', verifyToken(['Store']), replyToReview);
router.delete('/reviews/:id', verifyToken(['User']), deleteReview);
router.get('/reviews/me', verifyToken(['User']), getMyReviews);

// Insurance
router.get('/insurance', verifyToken(['User']), getMyInsurancePolicies);
router.post('/insurance', verifyToken(['User']), insuranceDocUpload.single('policyDocument'), addInsurancePolicy);
router.put('/insurance/:id', verifyToken(['User']), insuranceDocUpload.single('policyDocument'), updateInsurancePolicy);
router.delete('/insurance/:id', verifyToken(['User']), deleteInsurancePolicy);
router.get('/insurance/:id/download', verifyToken(['User']), downloadInsurancePolicyPdf);
router.post('/insurance/check-reminders', verifyToken(['User']), checkInsuranceExpiryReminders);

// Returns & Refunds
router.post('/returns', verifyToken(['User']), createReturnRequest);
router.get('/returns/me', verifyToken(['User']), getMyReturnRequests);
router.get('/returns/:id', verifyToken(['User', 'Store']), getReturnRequestById);
router.post('/returns/:id/evidence', verifyToken(['User']), submitReturnEvidence);
router.get('/returns/store/queue', verifyToken(['Store']), getStoreReturnRequests);
router.patch('/returns/:id/review', verifyToken(['Store']), reviewReturnRequest);

module.exports = router;
