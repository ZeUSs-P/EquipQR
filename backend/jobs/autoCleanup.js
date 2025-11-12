import cron from "node-cron";
import Booking from "../models/Booking.js";
import Item from "../models/Item.js";

// Runs every minute
cron.schedule("* * * * *", async () => {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  const expiredBookings = await Booking.find({
    status: "pending",
    createdAt: { $lt: twoMinutesAgo },
  }).populate("items.item");

  for (let booking of expiredBookings) {
    for (let i of booking.items) {
      i.item.available += i.quantity;
      await i.item.save();
    }

    await Booking.findByIdAndDelete(booking._id);
    console.log(`⏰ Auto-deleted expired booking ${booking._id}`);
  }
});
