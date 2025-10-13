import express from "express";
import Booking from "../models/Booking.js";
import Item from "../models/Item.js";
import protect from "../middleware/authMiddleware.js";
import QRCode from "qrcode";

const router = express.Router();

// Create a new booking
router.post("/", protect, async (req, res) => {
  const { items } = req.body;

  try {
    // ✅ Step 1: Check if user already has a pending booking
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      status: "pending" || "approved",
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "You already have a pending/approved booking. Please return the items or wait for autocancellation before creating a new one.",
      });
    }

    // ✅ Step 2: Check stock availability
    for (let i of items) {
      const dbItem = await Item.findById(i.item);
      if (!dbItem || dbItem.available < i.quantity) {
        return res
          .status(400)
          .json({ message: `Item ${dbItem?.name || i.item} not enough stock` });
      }
    }

    // ✅ Step 3: Deduct stock immediately when booking is created
    for (let i of items) {
      const dbItem = await Item.findById(i.item);
      dbItem.available -= i.quantity;
      await dbItem.save();
    }

    // ✅ Step 4: Create booking
    const booking = await Booking.create({
      user: req.user._id,
      items,
      status: "pending", // ensure it's pending initially
    });

    // ✅ Step 5: Generate QR code
    const qrData = JSON.stringify({ bookingId: booking._id });
    const qrCode = await QRCode.toDataURL(qrData);
    booking.qrCode = qrCode;
    await booking.save();

    // ✅ Step 6: Auto-delete timer (2 minutes)
    setTimeout(async () => {
      try {
        const bookingCheck = await Booking.findById(booking._id).populate("items.item");

        // If still pending after 2 minutes, delete and restore stock
        if (bookingCheck && bookingCheck.status === "pending") {
          for (let i of bookingCheck.items) {
            i.item.available += i.quantity;
            await i.item.save();
          }

          await Booking.findByIdAndDelete(booking._id);
          console.log(`⏰ Auto-deleted pending booking ${booking._id}`);
        }
      } catch (err) {
        console.error("Auto-delete error:", err);
      }
    }, 2 * 60 * 1000); // 2 minutes

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Server error while creating booking" });
  }
});

// Manager approves/rejects
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id).populate("items.item");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // If rejecting or returning, restore stock
  if (status === "rejected" || status === "returned") {
    for (let i of booking.items) {
      i.item.available += i.quantity;
      await i.item.save();
    }
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
});

// Get all bookings (for manager)
router.get("/", async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("items.item");
  res.json(bookings);
});

// Get single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.item");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking" });
  }
});

export default router;
