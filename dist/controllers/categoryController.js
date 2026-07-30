"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategoryById = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const getCategories = async (req, res) => {
    try {
        const { status, featured } = req.query;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (featured === "true") {
            filter.featured = true;
        }
        const categories = await Category_1.default.find(filter).sort({ displayOrder: 1, createdAt: -1 });
        res.json({ success: true, count: categories.length, categories });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch categories" });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }
        res.json({ success: true, category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch category" });
    }
};
exports.getCategoryById = getCategoryById;
const getCategoryBySlug = async (req, res) => {
    try {
        const slugParam = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
        const category = await Category_1.default.findOne({ slug: slugParam.toLowerCase() });
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }
        res.json({ success: true, category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch category" });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
const createCategory = async (req, res) => {
    try {
        const { name, slug, description, thumbnailImage, bannerImage, seoTitle, seoDescription, featured, status, displayOrder, } = req.body;
        const formattedSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        const categoryExists = await Category_1.default.findOne({ slug: formattedSlug });
        if (categoryExists) {
            res.status(409).json({ success: false, message: "Category with this slug already exists" });
            return;
        }
        const category = await Category_1.default.create({
            name,
            slug: formattedSlug,
            description: description || "",
            thumbnailImage: thumbnailImage || "",
            bannerImage: bannerImage || "",
            seoTitle: seoTitle || name,
            seoDescription: seoDescription || description || "",
            featured: Boolean(featured),
            status: status || "published",
            displayOrder: typeof displayOrder === "number" ? displayOrder : 0,
        });
        res.status(201).json({ success: true, message: "Category created successfully", category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to create category" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }
        const { name, slug, description, thumbnailImage, bannerImage, seoTitle, seoDescription, featured, status, displayOrder, } = req.body;
        if (slug && slug.toLowerCase() !== category.slug) {
            const existing = await Category_1.default.findOne({ slug: slug.toLowerCase() });
            if (existing && existing._id.toString() !== req.params.id) {
                res.status(409).json({ success: false, message: "Category with this slug already exists" });
                return;
            }
            category.slug = slug.toLowerCase();
        }
        if (name)
            category.name = name;
        if (description !== undefined)
            category.description = description;
        if (thumbnailImage !== undefined)
            category.thumbnailImage = thumbnailImage;
        if (bannerImage !== undefined)
            category.bannerImage = bannerImage;
        if (seoTitle !== undefined)
            category.seoTitle = seoTitle;
        if (seoDescription !== undefined)
            category.seoDescription = seoDescription;
        if (featured !== undefined)
            category.featured = Boolean(featured);
        if (status)
            category.status = status;
        if (displayOrder !== undefined)
            category.displayOrder = displayOrder;
        const updatedCategory = await category.save();
        res.json({ success: true, message: "Category updated successfully", category: updatedCategory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to update category" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await Category_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }
        await category.deleteOne();
        res.json({ success: true, message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to delete category" });
    }
};
exports.deleteCategory = deleteCategory;
const reorderCategories = async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, displayOrder }
        if (!Array.isArray(orders)) {
            res.status(400).json({ success: false, message: "Orders array is required" });
            return;
        }
        const promises = orders.map((item) => Category_1.default.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder }));
        await Promise.all(promises);
        res.json({ success: true, message: "Category display order updated successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to reorder categories" });
    }
};
exports.reorderCategories = reorderCategories;
