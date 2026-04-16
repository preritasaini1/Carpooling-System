import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);