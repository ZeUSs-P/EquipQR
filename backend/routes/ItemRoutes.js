import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Add a new item
router.post("/", async (req, res) => {
  const { name, quantity, available, category } = req.body;
  const newItem = new Item({ name, quantity, available, category });
  await newItem.save();
  res.json(newItem);
});

// Update item stock
router.put("/:id", async (req, res) => {
  const { available } = req.body;
  const updated = await Item.findByIdAndUpdate(
    req.params.id,
    { available },
    { new: true }
  );
  res.json(updated);
});

export default router;
