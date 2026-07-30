import mongoose, { Document, Schema } from "mongoose";

export interface IProductColor {
  name: string;
  hex: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  brand?: string;
  price?: number;
  salePrice?: number;
  sku?: string;
  stock?: number;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  weight?: string;
  material?: string;
  colors?: IProductColor[];
  tags?: string[];
  shortDescription?: string;
  description: string;
  images: string[];
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  status: "published" | "hidden" | "draft";
  stockStatus: "in_stock" | "made_to_order" | "out_of_stock";
  seoTitle?: string;
  seoDescription?: string;
  deliveryEstimate?: string;
  showPrice?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const colorSchema = new Schema<IProductColor>(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", productSchema);
