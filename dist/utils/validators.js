"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusUpdateSchema = exports.contactSchema = exports.quoteSchema = exports.productSchema = exports.categorySchema = exports.adminLoginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.adminLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.categorySchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    slug: joi_1.default.string().required(),
    description: joi_1.default.string().allow("").optional(),
    thumbnailImage: joi_1.default.string().allow("").optional(),
    bannerImage: joi_1.default.string().allow("").optional(),
    seoTitle: joi_1.default.string().allow("").optional(),
    seoDescription: joi_1.default.string().allow("").optional(),
    featured: joi_1.default.boolean().optional(),
    status: joi_1.default.string().valid("published", "hidden", "draft").optional(),
    displayOrder: joi_1.default.number().optional(),
});
exports.productSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    slug: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    brand: joi_1.default.string().allow("").optional(),
    price: joi_1.default.number().min(0).allow(null).optional(),
    salePrice: joi_1.default.number().min(0).allow(null).optional(),
    sku: joi_1.default.string().allow("").optional(),
    stock: joi_1.default.number().min(0).optional(),
    dimensions: joi_1.default.object({
        length: joi_1.default.string().allow("").optional(),
        width: joi_1.default.string().allow("").optional(),
        height: joi_1.default.string().allow("").optional(),
    }).optional(),
    weight: joi_1.default.string().allow("").optional(),
    material: joi_1.default.string().allow("").optional(),
    colors: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        hex: joi_1.default.string().required(),
    })).optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
    shortDescription: joi_1.default.string().allow("").optional(),
    description: joi_1.default.string().required(),
    images: joi_1.default.array().items(joi_1.default.string()).optional(),
    featured: joi_1.default.boolean().optional(),
    newArrival: joi_1.default.boolean().optional(),
    bestSeller: joi_1.default.boolean().optional(),
    isFeatured: joi_1.default.boolean().optional(),
    isNewArrival: joi_1.default.boolean().optional(),
    isBestSeller: joi_1.default.boolean().optional(),
    status: joi_1.default.string().valid("published", "hidden", "draft").optional(),
    stockStatus: joi_1.default.string().valid("in_stock", "made_to_order", "out_of_stock").optional(),
    seoTitle: joi_1.default.string().allow("").optional(),
    seoDescription: joi_1.default.string().allow("").optional(),
    deliveryEstimate: joi_1.default.string().allow("").optional(),
    showPrice: joi_1.default.boolean().optional(),
});
exports.quoteSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    message: joi_1.default.string().required(),
    productName: joi_1.default.string().required(),
    productId: joi_1.default.string().allow("").optional(),
    productImage: joi_1.default.string().allow("").optional(),
});
exports.contactSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().allow("").optional(),
    subject: joi_1.default.string().allow("").optional(),
    message: joi_1.default.string().required(),
});
exports.statusUpdateSchema = joi_1.default.object({
    status: joi_1.default.string().required(),
});
