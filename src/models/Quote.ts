import mongoose, { Document, Schema } from "mongoose";

export interface IQuote extends Document {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  productName: string;
  productId?: string;
  productImage?: string;
  status: "pending" | "contacted" | "quoted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    productId: { type: String, trim: true, default: "" },
    productImage: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "contacted", "quoted", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuote>("Quote", quoteSchema);
