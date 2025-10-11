import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import itemRoutes from "./routes/ItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// ✅ Base route
app.get("/", (req, res) => {
  res.send("Backend is working fine ✅");
});

// ✅ Routes
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);      // keep this as 'users'
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
