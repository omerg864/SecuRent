import asyncHandler from "express-async-handler";
import Item from "../models/itemModel.js";
import { uploadToCloudinary, deleteImage } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

const createItem = asyncHandler(async (req, res) => {
  const { description, amount, price, currency } = req.body;

  if (!description || !amount || !price || !currency) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  let imageUrl = "";

  if (req.file) {
    const imageID = uuidv4();
    imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/items`,
      imageID
    );
  }

  const item = await Item.create({
    business: req.business._id,
    description,
    amount,
    price,
    currency,
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    item,
  });
});

const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find().populate("business", "name image rating");
  res.status(200).json({
    success: true,
    items,
  });
});

const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id).populate(
    "business",
    "name image rating"
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.status(200).json({
    success: true,
    item,
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, amount, price, currency } = req.body;

  const item = await Item.findById(id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.business.toString() !== req.business._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this item");
  }

  if (req.file) {
    if (item.image) {
      await deleteImage(item.image, true);
    }
    const imageID = uuidv4();
    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/items`,
      imageID
    );
    item.image = imageUrl;
  }

  item.description = description || item.description;
  item.amount = amount ?? item.amount;
  item.price = price ?? item.price;
  item.currency = currency || item.currency;

  await item.save();
  res.status(200).json({
    success: true,
    item,
  });
});

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.business.toString() !== req.business._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this item");
  }

  if (item.image) {
    await deleteImage(item.image, true);
  }

  await item.deleteOne();
  res.status(200).json({
    success: true,
    message: "Item deleted successfully",
  });
});

const deleteItemImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (!item.business.equals(req.business._id)) {
    res.status(403);
    throw new Error("Not authorized to delete this item image");
  }

  if (!item.image) {
    res.status(404);
    throw new Error("Item image not found");
  }

  await deleteImage(item.image, true);
  item.image = "";
  await item.save();

  res.status(200).json({
    success: true,
    message: "Item image deleted successfully",
  });
});

export {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  deleteItemImage,
};
