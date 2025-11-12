import express from "express";
import Turf from "../models/Turf.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all turfs
router.get("/", async (req, res) => {
  try {
    const turfs = await Turf.find().sort({ type: 1, name: 1 });
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching turfs" });
  }
});

// ✅ Get turfs by type
router.get("/type/:type", async (req, res) => {
  try {
    const turfs = await Turf.find({ type: req.params.type.toLowerCase() }).sort({ name: 1 });
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching turfs" });
  }
});

// ✅ Get single turf with bookings
router.get("/:id", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id).populate("bookings.user", "name email");
    if (!turf) return res.status(404).json({ message: "Turf not found" });
    res.json(turf);
  } catch (err) {
    res.status(500).json({ message: "Error fetching turf" });
  }
});

// ✅ Check availability for a specific turf
router.post("/:id/availability", protect, async (req, res) => {
  const { date, startTime, endTime } = req.body;
  
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    // Check for conflicts
    const conflict = turf.bookings.some(b => {
      if (b.date !== date) return false;
      
      // Convert times to comparable format
      const bookingStart = b.startTime;
      const bookingEnd = b.endTime;
      
      // Check if times overlap
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });

    if (conflict) {
      return res.json({ available: false, message: "Slot not available" });
    } else {
      return res.json({ available: true, message: "Slot available" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error checking availability" });
  }
});

// ✅ Book a slot
router.post("/:id/book", protect, async (req, res) => {
  const { date, startTime, endTime } = req.body;
  
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    // Check for conflicts
    const conflict = turf.bookings.some(b => {
      if (b.date !== date) return false;
      return (
        (startTime >= b.startTime && startTime < b.endTime) ||
        (endTime > b.startTime && endTime <= b.endTime) ||
        (startTime <= b.startTime && endTime >= b.endTime)
      );
    });

    if (conflict) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Add booking
    turf.bookings.push({
      user: req.user._id,
      date,
      startTime,
      endTime,
    });

    await turf.save();
    
    // Populate user info before sending response
    await turf.populate("bookings.user", "name email");
    
    res.json({ message: "Booking successful ✅", turf });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking" });
  }
});

// ✅ Get user's bookings
router.get("/user/bookings", protect, async (req, res) => {
  try {
    const turfs = await Turf.find({ "bookings.user": req.user._id })
      .populate("bookings.user", "name email");
    
    // Extract only user's bookings
    const userBookings = [];
    turfs.forEach(turf => {
      turf.bookings.forEach(booking => {
        if (booking.user._id.toString() === req.user._id.toString()) {
          userBookings.push({
            _id: booking._id,
            turfId: turf._id,
            turfName: turf.name,
            turfType: turf.type,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            createdAt: booking.createdAt
          });
        }
      });
    });
    
    res.json(userBookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Cancel booking
router.delete("/:id/cancel", protect, async (req, res) => {
  const { date, startTime, endTime } = req.body;
  
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    // Remove the booking
    const initialLength = turf.bookings.length;
    turf.bookings = turf.bookings.filter(
      b =>
        !(
          b.user.toString() === req.user._id.toString() &&
          b.date === date &&
          b.startTime === startTime &&
          b.endTime === endTime
        )
    );

    if (turf.bookings.length === initialLength) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await turf.save();
    res.json({ message: "Booking cancelled ✅", turf });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

export default router;