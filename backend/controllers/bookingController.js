import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { rideId, paymentOrderId } = req.body;

    const payment = await Payment.findOne({ orderId: paymentOrderId });

    if (!payment || payment.status !== "SUCCESS") {
      return res.status(400).json({
        message: "Payment not completed"
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      rideId
    });

    res.json({
      message: "Booking confirmed 🎉",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};