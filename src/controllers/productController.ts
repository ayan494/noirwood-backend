import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import mongoose from "mongoose";

// Resolve category input (could be ObjectId or Category Slug) to ObjectId
const resolveCategoryId = async (categoryInput: string): Promise<mongoose.Types.ObjectId | null> => {
  if (!categoryInput) return null;
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return new mongoose.Types.ObjectId(categoryInput);
  }
  const category = await Category.findOne({ slug: categoryInput.toLowerCase() });
  return category ? (category._id as mongoose.Types.ObjectId) : null;
};

// Get all products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, status, featured, newArrival, bestSeller, sort } = req.query;
    
    let filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
        { sku: { $regex: search as string, $options: "i" } },
        { brand: { $regex: search as string, $options: "i" } },
      ];
    }
    
    if (category) {
      const catId = await resolveCategoryId(category as string);
      if (catId) {
        filter.category = catId;
      } else {
        // Return empty if specified category doesn't exist
        res.json({ success: true, count: 0, products: [] });
        return;
      }
    }

    if (status) {
      filter.status = status;
    }
    if (featured === "true") {
      filter.featured = true;
    }
    if (newArrival === "true") {
      filter.newArrival = true;
    }
    if (bestSeller === "true") {
      filter.bestSeller = true;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "name-asc") sortOption = { name: 1 };
    if (sort === "name-desc") sortOption = { name: -1 };

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOption);

    res.json({ success: true, count: products.length, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch product" });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slugParam = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const product = await Product.findOne({ slug: slugParam.toLowerCase() }).populate("category", "name slug");
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      category,
      brand,
      price,
      salePrice,
      sku,
      stock,
      dimensions,
      weight,
      material,
      colors,
      tags,
      shortDescription,
      description,
      images,
      featured,
      newArrival,
      bestSeller,
      isFeatured,
      isNewArrival,
      isBestSeller,
      status,
      stockStatus,
      seoTitle,
      seoDescription,
      deliveryEstimate,
      showPrice,
    } = req.body;

    const formattedSlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    const productExists = await Product.findOne({ slug: formattedSlug });
    if (productExists) {
      res.status(409).json({ success: false, message: "Product with this slug already exists" });
      return;
    }

    const catId = await resolveCategoryId(category);
    if (!catId) {
      res.status(400).json({ success: false, message: "Invalid or non-existent category" });
      return;
    }

    const product = await Product.create({
      name,
      slug: formattedSlug,
      category: catId,
      brand: brand || "Noirwood",
      price: price !== undefined ? Number(price) : 0,
      salePrice: salePrice !== undefined ? Number(salePrice) : 0,
      sku: sku || `NW-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: stock !== undefined ? Number(stock) : 10,
      dimensions: dimensions || { length: "", width: "", height: "" },
      weight: weight || "",
      material: material || "",
      colors: colors || [],
      tags: tags || [],
      shortDescription: shortDescription || "",
      description,
      images: Array.isArray(images) ? images : [],
      featured: featured !== undefined ? Boolean(featured) : Boolean(isFeatured),
      newArrival: newArrival !== undefined ? Boolean(newArrival) : Boolean(isNewArrival),
      bestSeller: bestSeller !== undefined ? Boolean(bestSeller) : Boolean(isBestSeller),
      status: status || "published",
      stockStatus: stockStatus || "in_stock",
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || shortDescription || description.slice(0, 150),
      deliveryEstimate: deliveryEstimate || "2-3 weeks",
      showPrice: showPrice !== undefined ? Boolean(showPrice) : true,
    });

    const populated = await Product.findById(product._id).populate("category", "name slug");

    res.status(201).json({ success: true, message: "Product created successfully", product: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const {
      name,
      slug,
      category,
      brand,
      price,
      salePrice,
      sku,
      stock,
      dimensions,
      weight,
      material,
      colors,
      tags,
      shortDescription,
      description,
      images,
      featured,
      newArrival,
      bestSeller,
      isFeatured,
      isNewArrival,
      isBestSeller,
      status,
      stockStatus,
      seoTitle,
      seoDescription,
      deliveryEstimate,
      showPrice,
    } = req.body;

    if (slug && slug.toLowerCase() !== product.slug) {
      const existing = await Product.findOne({ slug: slug.toLowerCase() });
      if (existing && existing._id.toString() !== req.params.id) {
        res.status(409).json({ success: false, message: "Product with this slug already exists" });
        return;
      }
      product.slug = slug.toLowerCase();
    }

    if (category) {
      const catId = await resolveCategoryId(category);
      if (catId) {
        product.category = catId;
      }
    }

    if (name) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (price !== undefined) product.price = Number(price);
    if (salePrice !== undefined) product.salePrice = Number(salePrice);
    if (sku !== undefined) product.sku = sku;
    if (stock !== undefined) product.stock = Number(stock);
    if (dimensions) product.dimensions = dimensions;
    if (weight !== undefined) product.weight = weight;
    if (material !== undefined) product.material = material;
    if (colors !== undefined) product.colors = colors;
    if (tags !== undefined) product.tags = tags;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (description) product.description = description;
    if (images !== undefined) product.images = Array.isArray(images) ? images : [];
    if (featured !== undefined || isFeatured !== undefined) product.featured = Boolean(featured !== undefined ? featured : isFeatured);
    if (newArrival !== undefined || isNewArrival !== undefined) product.newArrival = Boolean(newArrival !== undefined ? newArrival : isNewArrival);
    if (bestSeller !== undefined || isBestSeller !== undefined) product.bestSeller = Boolean(bestSeller !== undefined ? bestSeller : isBestSeller);
    if (status) product.status = status;
    if (stockStatus) product.stockStatus = stockStatus;
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;
    if (deliveryEstimate !== undefined) product.deliveryEstimate = deliveryEstimate;
    if (showPrice !== undefined) product.showPrice = Boolean(showPrice);

    await product.save();
    const updated = await Product.findById(product._id).populate("category", "name slug");

    res.json({ success: true, message: "Product updated successfully", product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to delete product" });
  }
};

export const duplicateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const original = await Product.findById(req.params.id);
    if (!original) {
      res.status(404).json({ success: false, message: "Original product not found" });
      return;
    }

    const { _id, createdAt, updatedAt, __v, ...copyObj } = original.toObject() as any;

    copyObj.name = `${original.name} (Copy)`;
    copyObj.slug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    copyObj.sku = `${(original as any).sku || "NW"}-COPY`;
    copyObj.status = "draft";

    const duplicated = await Product.create(copyObj);
    const populated = await Product.findById(duplicated._id).populate("category", "name slug");

    res.status(201).json({ success: true, message: "Product duplicated successfully", product: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to duplicate product" });
  }
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "published",
    }).populate("category", "name slug").limit(4);
    
    res.json({ success: true, count: related.length, products: related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch related products" });
  }
};
