import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", trim: true, maxlength: 3000 },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });
export default mongoose.model("Product", productSchema);