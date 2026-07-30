"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
// Config & DB
dotenv_1.default.config();
const db_1 = __importDefault(require("./config/db"));
const seeder_1 = require("./utils/seeder");
// Middleware
const errorMiddleware_1 = require("./middleware/errorMiddleware");
// Routes
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const quoteRoutes_1 = __importDefault(require("./routes/quoteRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const app = (0, express_1.default)();
// Connect to MongoDB
(0, db_1.default)().then(async () => {
    await (0, seeder_1.seedAdmin)();
    if (process.env.CLEAR_DUMMY_DATA === "true") {
        await (0, seeder_1.clearDummyData)();
    }
});
// Middleware setup
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "25mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "25mb" }));
app.use((0, morgan_1.default)(":method :url :status"));
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs
});
app.use("/api", limiter);
// Static folder for uploads
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Mount Routes
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/quote", quoteRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
// Root route check
app.get("/", (req, res) => {
    res.json({ message: "Noirwood Backend API is running" });
});
// Error Handling
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
