import paymentRoutes from "./routes/paymentRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

app.use("/api/payments", paymentRoutes);
app.use("/api/bookings", bookingRoutes);