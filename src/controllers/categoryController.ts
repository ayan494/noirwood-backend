import { Request, Response } from "express";
import Category from "../models/Category";

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, featured } = req.query;
    const filter: any = {};

    if (status) {
      filter.status = status;
    }
    if (featured === "true") {
      filter.featured = true;
    }

    const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch categories" });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    res.json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch category" });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slugParam = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const category = await Category.findOne({ slug: slugParam.toLowerCase() });
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    res.json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch category" });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      description,
      thumbnailImage,
      bannerImage,
      seoTitle,
      seoDescription,
      featured,
      status,
      displayOrder,
    } = req.body;

    const formattedSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    const categoryExists = await Category.findOne({ slug: formattedSlug });
    if (categoryExists) {
      res.status(409).json({ success: false, message: "Category with this slug already exists" });
      return;
    }

    const category = await Category.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to create category" });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    const {
      name,
      slug,
      description,
      thumbnailImage,
      bannerImage,
      seoTitle,
      seoDescription,
      featured,
      status,
      displayOrder,
    } = req.body;

    if (slug && slug.toLowerCase() !== category.slug) {
      const existing = await Category.findOne({ slug: slug.toLowerCase() });
      if (existing && existing._id.toString() !== req.params.id) {
        res.status(409).json({ success: false, message: "Category with this slug already exists" });
        return;
      }
      category.slug = slug.toLowerCase();
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (thumbnailImage !== undefined) category.thumbnailImage = thumbnailImage;
    if (bannerImage !== undefined) category.bannerImage = bannerImage;
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;
    if (featured !== undefined) category.featured = Boolean(featured);
    if (status) category.status = status;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    const updatedCategory = await category.save();
    res.json({ success: true, message: "Category updated successfully", category: updatedCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    await category.deleteOne();
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to delete category" });
  }
};

export const reorderCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orders } = req.body; // Array of { id, displayOrder }
    if (!Array.isArray(orders)) {
      res.status(400).json({ success: false, message: "Orders array is required" });
      return;
    }

    const promises = orders.map((item: { id: string; displayOrder: number }) =>
      Category.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(promises);

    res.json({ success: true, message: "Category display order updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to reorder categories" });
  }
};
