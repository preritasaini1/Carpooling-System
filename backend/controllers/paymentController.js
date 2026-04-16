import razorpay from "../utils/razorpay.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";

export const createPayment = async (req, res) => {
  try {
    const { amount, rideId } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    await Payment.create({
      userId: req.user._id,
      rideId,
      amount,
      orderId: order.id
    });

    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      rideId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // ✅ Update payment
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        status: "SUCCESS"
      },
      { new: true }
    );

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};