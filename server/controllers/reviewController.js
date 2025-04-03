import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const createReview = asyncHandler(async (req, res) => {
	const { business, content } = req.body;

	if (!business || !content) {
		res.status(400);
		throw new Error('Please provide business, customer, and rating');
	}

	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

	const model = genAI.getGenerativeModel({
		model: 'gemini-2.0-flash',
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: SchemaType.STRING,
			},
		},
	});
	const prompt = `Give me a rating between 1 and 5 for this business, according to my experience: ${content}. return only the rating number.`;
	const result = await model.generateContent(prompt);

	const rating = parseInt(result.data[0].text);

	let images = [];
	if (req.files) {
		images = await uploadReviewImages(req.files);
	}

	const review = await Review.create({
		business,
		customer: req.customer.id,
		rating,
		content,
		images,
	});

	res.status(201).json({
		success: true,
		review,
	});
});

const getReviews = asyncHandler(async (req, res) => {
	const reviews = await Review.find().populate('customer', 'name image');
	res.status(200).json({
		success: true,
		reviews,
	});
});

const getReviewById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const review = await Review.findById(id)
		.populate('business', 'name image rating')
		.populate('customer', 'name image');

	if (!review) {
		res.status(404);
		throw new Error('Review not found');
	}

	res.status(200).json({
		success: true,
		review,
	});
});

const uploadReviewImages = async (images) => {
	const promises = [];
	for (let i = 0; i < images.length; i++) {
		const imageID = uuidv4();
		promises.push(
			uploadToCloudinary(
				images[i].buffer,
				`${process.env.CLOUDINARY_BASE_FOLDER}/reviews`,
				imageID
			)
		);
	}
	return await Promise.all(promises);
};

const updateReview = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { content, imagesDeleted } = req.body;

	const review = await Review.findById(id);
	if (!review) {
		res.status(404);
		throw new Error('Review not found');
	}

	if (!content) {
		res.status(400);
		throw new Error('Please provide content');
	}

	if (review.customer.toString() !== req.customer._id.toString()) {
		res.status(403);
		throw new Error('Not authorized to update this review');
	}

	let images = review.images || [];
	for (let i = 0; i < imagesDeleted.length; i++) {
		const imageUrl = imagesDeleted[i];
		if (imageUrl && imageUrl !== '' && review.images.includes(imageUrl)) {
			await deleteImage(imageUrl, true);
			images = images.filter((img) => img !== imageUrl);
		}
	}

	let imagesAdded = [];

	if (req.files) {
		imagesAdded = await uploadReviewImages(req.files);
	}

	if (imagesAdded.length > 0) {
		images = [...images, ...imagesAdded];
	}

	if (review.content !== content) {
		review.content = content;

		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: {
					type: SchemaType.STRING,
				},
			},
		});
		const prompt = `Give me a rating between 1 and 5 for this business, according to my experience: ${content}. return only the rating number.`;
		const result = await model.generateContent(prompt);

		const rating = parseInt(result.data[0].text);

		review.rating = rating ?? review.rating;

		await review.save();
	}
	res.status(200).json({
		success: true,
		review,
	});
});

const deleteReview = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const review = await Review.findById(id);

	if (!review) {
		res.status(404);
		throw new Error('Review not found');
	}

	if (review.customer._id.toString() !== req.customer._id.toString()) {
		res.status(403);
		throw new Error('Not authorized to delete this review');
	}

	const promises = [];

	for (let i = 0; i < review.images.length; i++) {
		const imageUrl = review.images[i];
		if (imageUrl && imageUrl !== '') {
			promises.push(deleteImage(imageUrl, true));
		}
	}

	await Promise.all(promises);

	await review.deleteOne();
	res.status(200).json({
		success: true,
		message: 'Review deleted successfully',
	});
});
export { createReview, getReviews, getReviewById, updateReview, deleteReview };
