import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Turf from "./models/Turf.js";

dotenv.config();

const seedTurfs = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Connected!");

    await Turf.deleteMany();
    console.log("🧹 Cleared old turf data...");

    const turfs = [];

    // Badminton Courts
    for (let i = 1; i <= 10; i++) {
      turfs.push({ 
        name: `Badminton Court ${i}`, 
        type: "badminton", 
        available: true,
        bookings: []
      });
    }

    // Tennis Courts
    for (let i = 1; i <= 6; i++) {
      turfs.push({ 
        name: `Tennis Court ${i}`, 
        type: "tennis", 
        available: true,
        bookings: []
      });
    }

    // Cricket Fields
    for (let i = 1; i <= 3; i++) {
      turfs.push({ 
        name: `Cricket Field ${i}`, 
        type: "cricket", 
        available: true,
        bookings: []
      });
    }

    // Football Fields
    for (let i = 1; i <= 2; i++) {
      turfs.push({ 
        name: `Football Field ${i}`, 
        type: "football", 
        available: true,
        bookings: []
      });
    }

    // Volleyball Courts
    for (let i = 1; i <= 4; i++) {
      turfs.push({ 
        name: `Volleyball Court ${i}`, 
        type: "volleyball", 
        available: true,
        bookings: []
      });
    }

    await Turf.insertMany(turfs);
    console.log("🏟️  Inserted all turfs!");
    console.log(`Total turfs: ${turfs.length}`);

    process.exit();
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
};

seedTurfs();