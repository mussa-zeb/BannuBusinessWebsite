import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "easypaisa", "jazzcash"],
      default: "cod",
    },
    paymentDetails: {
      mobileAccount: { type: String, default: "" },
      transactionId: { type: String, default: "" },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);