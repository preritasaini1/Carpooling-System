import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickup: {
      type: locationSchema,
      required: true,
    },
    drop: {
      type: locationSchema,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    vehicleDetails: {
      model: { type: String, trim: true },
      plateNumber: { type: String, trim: true },
      color: { type: String, trim: true },
    },
    preferences: {
      smokingAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      musicAllowed: { type: Boolean, default: true },
      femaleOnly: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["open", "full", "completed", "cancelled"],
      default: "open",
    },
    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;