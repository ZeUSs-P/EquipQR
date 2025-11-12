import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import itemRoutes from "./routes/ItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import turfRoutes from "./routes/TurfRoutes.js"; // ✨ NEW
import "./jobs/autoCleanup.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: `${process.env.CORS_ORIGIN}`,
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working fine ✅");
});

app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/turfs", turfRoutes); // ✨ NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));