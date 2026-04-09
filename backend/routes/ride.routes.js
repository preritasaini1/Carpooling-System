import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  createRide,
  getRideById,
  getMyRides,
  searchRides,
} from "../controllers/ride.controller.js";

const router = express.Router();

router.post("/", protect, createRide);
router.get("/search", searchRides);
router.get("/my-rides", protect, getMyRides);
router.get("/:id", getRideById);

export default router;