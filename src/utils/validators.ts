import Joi from "joi";

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  thumbnailImage: Joi.string().allow("").optional(),
  bannerImage: Joi.string().allow("").optional(),
  seoTitle: Joi.string().allow("").optional(),
  seoDescription: Joi.string().allow("").optional(),
  featured: Joi.boolean().optional(),
  status: Joi.string().valid("published", "hidden", "draft").optional(),
  displayOrder: Joi.number().optional(),
});

export const productSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  category: Joi.string().required(),
  brand: Joi.string().allow("").optional(),
  price: Joi.number().min(0).allow(null).optional(),
  salePrice: Joi.number().min(0).allow(null).optional(),
  sku: Joi.string().allow("").optional(),
  stock: Joi.number().min(0).optional(),
  dimensions: Joi.object({
    length: Joi.string().allow("").optional(),
    width: Joi.string().allow("").optional(),
    height: Joi.string().allow("").optional(),
  }).optional(),
  weight: Joi.string().allow("").optional(),
  material: Joi.string().allow("").optional(),
  colors: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      hex: Joi.string().required(),
    })
  ).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  shortDescription: Joi.string().allow("").optional(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
  featured: Joi.boolean().optional(),
  newArrival: Joi.boolean().optional(),
  bestSeller: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  isNewArrival: Joi.boolean().optional(),
  isBestSeller: Joi.boolean().optional(),
  status: Joi.string().valid("published", "hidden", "draft").optional(),
  stockStatus: Joi.string().valid("in_stock", "made_to_order", "out_of_stock").optional(),
  seoTitle: Joi.string().allow("").optional(),
  seoDescription: Joi.string().allow("").optional(),
  deliveryEstimate: Joi.string().allow("").optional(),
  showPrice: Joi.boolean().optional(),
});

export const quoteSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  message: Joi.string().required(),
  productName: Joi.string().required(),
  productId: Joi.string().allow("").optional(),
  productImage: Joi.string().allow("").optional(),
});

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("").optional(),
  subject: Joi.string().allow("").optional(),
  message: Joi.string().required(),
});

export const statusUpdateSchema = Joi.object({
  status: Joi.string().required(),
});
