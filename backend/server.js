const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./config/config"); //connecting to the database
const authRouter = require("./routes/auth");
const path = require("path");
const os = require("os");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const cors = require("cors");

const allowedOrigins = String(
  process.env.CORS_ALLOWED_ORIGINS || "http://localhost:3000,https://main-frontend-iota.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  compression({
    threshold: 1024,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX || 500),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests from this IP. Please try again later." },
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
const uploadsDir = process.env.UPLOADS_DIR || path.join(os.tmpdir(), 'medvision-uploads');
app.use('/uploads', express.static(uploadsDir));

// app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api", apiLimiter);
app.use("/api", authRouter);


const start = async () => {
  try {
    const dbconnectstatus = await connectDB(process.env.MONGO_URL);
    if (dbconnectstatus) {
      console.log("Database Connected");
      // Seed vaccination master data
      const { seedVaccinationMasterIfEmpty } = require("./controllers/auth");
      await seedVaccinationMasterIfEmpty();
      const { seedLocationMasterIfEmpty } = require("./controllers/locationMaster");
      await seedLocationMasterIfEmpty();
    }
    else {
      console.log("Error connecting to database");
    }
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("error =>", err);
  }
};

app.use('/', (req, res) => {
  res.send('Not Found!');
});

app.use((err, req, res, next) => {
  if (err && /Not allowed by CORS/i.test(err.message || "")) {
    return res.status(403).json({ message: "Request origin is not allowed." });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({ message: "Internal server error" });
});

start();