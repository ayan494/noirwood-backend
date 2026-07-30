"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const colorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    hex: { type: String, required: true },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    brand: { type: String, trim: true, default: "Noirwood" },
    price: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    sku: { type: String, trim: true },
    stock: { type: Number, default: 10 },
    dimensions: {
        length: { type: String, default: "" },
        width: { type: String, default: "" },
        height: { type: String, default: "" },
    },
    weight: { type: String, default: "" },
    material: { type: String, default: "" },
    colors: [colorSchema],
    tags: [{ type: String }],
    shortDescription: { type: String, default: "" },
    description: { type: String, required: true },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["published", "hidden", "draft"],
        default: "published",
    },
    stockStatus: {
        type: String,
        enum: ["in_stock", "made_to_order", "out_of_stock"],
        default: "in_stock",
    },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    deliveryEstimate: { type: String, default: "2-3 weeks" },
    showPrice: { type: Boolean, default: true },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Product", productSchema);
