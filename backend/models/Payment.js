import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride"
  },
  amount: Number,
  status: {
    type: String,
    enum: ["INITIATED", "SUCCESS", "FAILED"],
    default: "INITIATED"
  },
  orderId: String,
  paymentId: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);