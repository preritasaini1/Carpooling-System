import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Ride from "../models/ride.model.js";

export const createBooking = async (req, res) => {
  try {
    const { rideId, paymentOrderId } = req.body;

    const payment = await Payment.findOne({ orderId: paymentOrderId });

    if (!payment || payment.status !== "SUCCESS") {
      return res.status(400).json({
        message: "Payment not completed"
      });
    }

    // ✅ Check ride seats
    const ride = await Ride.findById(rideId);

    if (!ride || ride.seats <= 0) {
      return res.status(400).json({
        message: "No seats available"
      });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      rideId
    });

    // ✅ Reduce seat
    ride.seats -= 1;
    await ride.save();

    res.json({
      message: "Booking confirmed 🎉",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};