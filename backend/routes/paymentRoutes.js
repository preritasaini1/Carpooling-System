import express from "express";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createPayment);
router.post("/verify", protect, verifyPayment);

export default router;