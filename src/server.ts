import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

// Config & DB
dotenv.config();
import connectDB from "./config/db";
import { seedAdmin, clearDummyData } from "./utils/seeder";

// Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware";

// Routes
import adminRoutes from "./routes/adminRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import quoteRoutes from "./routes/quoteRoutes";
import contactRoutes from "./routes/contactRoutes";
import uploadRoutes from "./routes/uploadRoutes";

const app: Application = express();

// Connect to MongoDB
connectDB().then(async () => {
  await seedAdmin();
  if (process.env.CLEAR_DUMMY_DATA === "true") {
    await clearDummyData();
  }
});

// Middleware setup
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(morgan(":method :url :status"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
});
app.use("/api", limiter);

// Static folder for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Noirwood API",
      version: "1.0.0",
      description: "Backend API for Noirwood Admin and Client",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Root route check
app.get("/", (req, res) => {
  res.json({ message: "Noirwood Backend API is running" });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
