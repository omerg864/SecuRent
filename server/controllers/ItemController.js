import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';
import { uploadToCloudinary, deleteImage } from '../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

const createItem = asyncHandler(async (req, res) => {
	const { description, price, temporary } = req.body;

	if (!description || !price) {
		res.status(400);
		throw new Error('Please provide all required fields');
	}

	let imageUrl = '';

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
		price,
		currency: req.business.currency || 'USD',
		image: imageUrl,
		temporary,
	});

	res.status(201).json({
		success: true,
		item,
	});
});

const getItems = asyncHandler(async (req, res) => {
	const items = await Item.find().populate('business', 'name image rating');
	res.status(200).json({
		success: true,
		items,
	});
});

const getItemById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const item = await Item.findById(id).populate(
		'business',
		'name image rating'
	);

	if (!item) {
		res.status(404);
		throw new Error('Item not found');
	}

	res.status(200).json({
		success: true,
		item,
	});
});

const updateItem = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { description, price, imageDeleteFlag } = req.body;

	const item = await Item.findById(id);
	if (!item) {
		res.status(404);
		throw new Error('Item not found');
	}

	if (item.business.toString() !== req.business._id.toString()) {
		res.status(403);
		throw new Error('Not authorized to update this item');
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
	} else if (imageDeleteFlag) {
		if (item.image) {
			await deleteImage(item.image, true);
		}
		item.image = '';
	}

	item.description = description || item.description;
	item.price = price ?? item.price;

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
		throw new Error('Item not found');
	}

	if (item.business.toString() !== req.business._id.toString()) {
		res.status(403);
		throw new Error('Not authorized to delete this item');
	}

	if (item.image) {
		await deleteImage(item.image, true);
	}

	await item.deleteOne();
	res.status(200).json({
		success: true,
		message: 'Item deleted successfully',
	});
});

export { createItem, getItems, getItemById, updateItem, deleteItem };
