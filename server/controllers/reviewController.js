import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import Transaction from '../models/transactionModel.js';
import Business from '../models/businessModel.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary, deleteImage } from '../utils/cloudinary.js';
import {
	CHARGED_SCORE,
	CHARGED_WEIGHT,
	REVIEW_WEIGHT,
} from '../utils/constants.js';

const addToAvg = (oldValue, newValue, count) => {
	return (oldValue * count + newValue) / (count + 1);
};

const updateAvg = (avg, oldValue, newValue, count) => {
	return (avg * count - oldValue + newValue) / count;
};

const removeFromAvg = (avg, oldValue, count) => {
	return (avg * count - oldValue) / (count - 1 || 1);
};

const generateReviewScores = async (content) => {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
	const reviewModel = genAI.getGenerativeModel({
		model: 'gemini-2.0-flash',
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: SchemaType.OBJECT,
				properties: {
					scores: {
						type: SchemaType.OBJECT,
						properties: {
							quality: { type: SchemaType.NUMBER },
							reliability: { type: SchemaType.NUMBER },
							price: { type: SchemaType.NUMBER },
						},
					},
				},
			},
		},
	});

	const reviewPrompt = `Analyze the following customer review and assign category scores based **only on this review**:

	"${content}"
	
	Give scores from 1 to 5 for:
	- Price
	- Reliability
	- Quality
	
	if the review does not mention a category, return 0 for that category.
	`;

	const reviewResult = await reviewModel.generateContent(reviewPrompt);
	console.log('Review Result:', reviewResult.response.text());

	const reviewObject = JSON.parse(reviewResult.response.text());
	const scores = reviewObject.scores;

	console.log('review:', reviewObject);

	let countScored = 0;
	if (scores.quality) countScored++;
	if (scores.reliability) countScored++;
	if (scores.price) countScored++;

	const quality = scores.quality ?? 0;
	const reliability = scores.reliability ?? 0;
	const price = scores.price ?? 0;
	const sumCategories = quality + reliability + price;

	countScored = countScored || 1; // Avoid division by zero

	const overallScore = sumCategories / countScored;

	return {
		overall: overallScore ?? 0,
		quality,
		reliability,
		price,
	};
};

const generateReviewSummary = async (countReviews, content, oldReview) => {
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

	const summaryModel = genAI.getGenerativeModel({
		model: 'gemini-2.0-flash',
		generationConfig: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: SchemaType.OBJECT,
				properties: {
					summary: { type: SchemaType.STRING },
					insights: {
						type: SchemaType.OBJECT,
						properties: {
							quality: { type: SchemaType.STRING },
							reliability: { type: SchemaType.STRING },
							price: { type: SchemaType.STRING },
						},
					},
				},
			},
		},
	});
	const summaryPrompt = `You previously reviewed ${countReviews} reviews of this business and gave the following summary:
"${oldReview}"

Now, a new review has been added:
"${content}"

Update the business summary and insights based on all reviews, including this new one. make the summary more concise and insightful. The summary should be a short sentence that captures the essence of the reviews. If there are no insights for each one return an empty string for each insight`;
	const summaryResult = await summaryModel.generateContent(summaryPrompt);
	console.log('Summary Result:', summaryResult.response.text());

	const summaryObject = JSON.parse(summaryResult.response.text());
	console.log('summary:', summaryObject);
	const summary = summaryObject.summary ?? '';
	const insights = summaryObject.insights
		? summaryObject.insights
		: { quality: '', reliability: '', price: '' };
	insights.quality = insights.quality ?? '';
	insights.reliability = insights.reliability ?? '';
	insights.price = insights.price ?? '';

	return { summary, insights };
};

const createReview = asyncHandler(async (req, res) => {
	const { transaction, content } = req.body;

	if (!transaction || !content) {
		res.status(400);
		throw new Error('Please provide business, customer, and rating');
	}

	const transactionObject = await Transaction.findById(transaction).populate(
		'business'
	);

	if (!transactionObject) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	if (transactionObject.customer.toString() !== req.customer._id.toString()) {
		res.status(403);
		throw new Error(
			'Not authorized to create a review for this transaction'
		);
	}

	if (transactionObject.review) {
		res.status(400);
		throw new Error('Transaction already has a review');
	}

	const businessReviews = await Review.find({
		business: transactionObject.business._id,
	});

	const business = await Business.findById(transactionObject.business._id);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	const { insights, summary } = await generateReviewSummary(
		businessReviews.length,
		content,
		transactionObject.business.reviewSummary
	);

	const scores = await generateReviewScores(content);

	if (!business.rating) {
		business.rating = {
			overall: 0,
			quality: 0,
			reliability: 0,
			price: 0,
			reviewOverall: 0,
			charged: 0,
		};
	}

	if (!business.insights) {
		business.insights = {
			quality: '',
			reliability: '',
			price: '',
		};
	}

	const businessOverallScore = business.rating.reviewOverall ?? 0;
	const businessQualityScore = business.rating.quality ?? 0;
	const businessReliabilityScore = business.rating.reliability ?? 0;
	const businessPriceScore = business.rating.price ?? 0;
	const reviewsCount = businessReviews.length ?? 0;

	const overallScore = scores.overall ?? businessOverallScore;
	const qualityScore = scores.quality ?? businessQualityScore;
	const reliabilityScore = scores.reliability ?? businessReliabilityScore;
	const priceScore = scores.price ?? businessPriceScore;

	const newReviewOverallScore = addToAvg(
		businessOverallScore,
		overallScore,
		reviewsCount
	);

	const chargedScore = business.rating.charged ?? CHARGED_SCORE;
	const reviewScoreWeight = newReviewOverallScore * REVIEW_WEIGHT;
	const chargedScoreWeight = chargedScore * CHARGED_WEIGHT;
	let overAllScore = reviewScoreWeight + chargedScoreWeight;
	if (!reviewScoreWeight && !chargedScoreWeight) {
		overAllScore = 5;
	} else if (!reviewScoreWeight) {
		overAllScore = chargedScore;
	}
	if (!chargedScoreWeight) {
		overAllScore = newReviewOverallScore;
	}

	business.rating.overall = overAllScore;
	business.rating.charged = chargedScore;
	business.rating.reviewOverall = newReviewOverallScore;
	business.rating.quality = addToAvg(
		businessQualityScore,
		qualityScore,
		reviewsCount
	);
	business.rating.reliability = addToAvg(
		businessReliabilityScore,
		reliabilityScore,
		reviewsCount
	);
	business.rating.price = addToAvg(
		businessPriceScore,
		priceScore,
		reviewsCount
	);
	business.reviewSummary = summary ?? business.reviewSummary;
	business.insights.quality = insights.quality ?? business.insights.quality;
	business.insights.reliability =
		insights.reliability ?? business.insights.reliability;
	business.insights.price = insights.price ?? business.insights.price;
	await business.save();

	let images = [];
	if (req.files) {
		images = await uploadReviewImages(req.files);
	}

	const review = await Review.create({
		transaction: transactionObject._id,
		customer: req.customer.id,
		business: transactionObject.business._id,
		rating: {
			overall: overallScore,
			quality: qualityScore,
			reliability: reliabilityScore,
			price: priceScore,
		},
		content,
		images,
	});

	transactionObject.review = review._id;
	await transactionObject.save();

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
	const review = await Review.findById(id).populate('customer', 'name image');

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

	const imagesDeletedArray = JSON.parse(imagesDeleted || '[]');
	if (!Array.isArray(imagesDeletedArray)) {
		res.status(400);
		throw new Error('Invalid imagesDeleted format');
	}

	console.log('imagesDeletedArray:', imagesDeletedArray);

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

	const transactionObject = await Transaction.findById(
		review.transaction._id
	).populate('business');

	if (!transactionObject) {
		res.status(404);
		throw new Error('Transaction not found');
	}

	const businessReviews = await Review.find({
		business: transactionObject.business._id,
	});
	const business = await Business.findById(transactionObject.business._id);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	let images = review.images || [];
	for (let i = 0; i < imagesDeletedArray.length; i++) {
		const imageUrl = imagesDeletedArray[i];
		if (imageUrl && imageUrl !== '' && review.images.includes(imageUrl)) {
			console.log('Deleting image:', imageUrl);
			await deleteImage(imageUrl, false);
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

	review.images = images;

	if (review.content !== content) {
		review.content = content;

		const scores = await generateReviewScores(content);

		console.log('scores:', scores);

		const businessOverallScore = business.rating.reviewOverall ?? 0;
		const businessQualityScore = business.rating.quality ?? 0;
		const businessReliabilityScore = business.rating.reliability ?? 0;
		const businessPriceScore = business.rating.price ?? 0;
		const reviewsCount = businessReviews.length ?? 0;

		const overallScore = scores.overall ?? businessOverallScore;
		const qualityScore = scores.quality ?? businessQualityScore;
		const reliabilityScore = scores.reliability ?? businessReliabilityScore;
		const priceScore = scores.price ?? businessPriceScore;

		const newReviewOverallScore = updateAvg(
			businessOverallScore,
			review.rating.reviewOverall,
			overallScore,
			reviewsCount
		);

		const chargedScore = business.rating.charged ?? CHARGED_SCORE;
		const reviewScoreWeight = newReviewOverallScore * REVIEW_WEIGHT;
		const chargedScoreWeight = chargedScore * CHARGED_WEIGHT;
		let overAllScore = reviewScoreWeight + chargedScoreWeight;
		if (!reviewScoreWeight && !chargedScoreWeight) {
			overAllScore = 5;
		} else if (!reviewScoreWeight) {
			overAllScore = chargedScore;
		}
		if (!chargedScoreWeight) {
			overAllScore = newReviewOverallScore;
		}

		business.rating.overall = overAllScore;
		business.rating.charged = chargedScore;
		business.rating.reviewOverall = newReviewOverallScore;

		business.rating.quality = updateAvg(
			businessQualityScore,
			review.rating.quality,
			qualityScore,
			reviewsCount
		);
		business.rating.reliability = updateAvg(
			businessReliabilityScore,
			review.rating.reliability,
			reliabilityScore,
			reviewsCount
		);
		business.rating.price = updateAvg(
			businessPriceScore,
			review.rating.price,
			priceScore,
			reviewsCount
		);
		await business.save();

		review.rating.overall = overallScore;
		review.rating.quality = qualityScore;
		review.rating.reliability = reliabilityScore;
		review.rating.price = priceScore;
	}

	await review.save();

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

	const transactionObject = await Transaction.findById(
		review.transaction._id
	).populate('business');

	if (!transactionObject) {
		res.status(404);
		throw new Error('Transaction not found');
	}
	const businessReviews = await Review.find({
		business: transactionObject.business._id,
	});
	const business = await Business.findById(transactionObject.business._id);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	const promises = [];

	for (let i = 0; i < review.images.length; i++) {
		const imageUrl = review.images[i];
		if (imageUrl && imageUrl !== '') {
			promises.push(deleteImage(imageUrl, true));
		}
	}

	await Promise.all(promises);

	const newReviewOverallScore =
		removeFromAvg(
			business.rating.reviewOverall ?? 0,
			review.rating.reviewOverall ?? 0,
			businessReviews.length
		) ?? 0;

	const chargedScore = business.rating.charged ?? CHARGED_SCORE;
	const reviewScoreWeight = newReviewOverallScore * REVIEW_WEIGHT;
	const chargedScoreWeight = chargedScore * CHARGED_WEIGHT;
	let overAllScore = reviewScoreWeight + chargedScoreWeight;
	if (!reviewScoreWeight && !chargedScoreWeight) {
		overAllScore = 5;
	} else if (!reviewScoreWeight) {
		overAllScore = chargedScore;
	}
	if (!chargedScoreWeight) {
		overAllScore = newReviewOverallScore;
	}

	business.rating.overall = overAllScore;
	business.rating.charged = chargedScore;
	business.rating.reviewOverall = newReviewOverallScore;

	business.rating.quality = removeFromAvg(
		business.rating.quality,
		review.rating.quality,
		businessReviews.length
	);
	business.rating.reliability = removeFromAvg(
		business.rating.reliability,
		review.rating.reliability,
		businessReviews.length
	);
	business.rating.price = removeFromAvg(
		business.rating.price,
		review.rating.price,
		businessReviews.length
	);

	business.reviewSummary =
		businessReviews.length > 1 ? business.reviewSummary : '';
	business.insights.quality =
		businessReviews.length > 1 ? business.insights.quality : '';
	business.insights.reliability =
		businessReviews.length > 1 ? business.insights.reliability : '';
	business.insights.price =
		businessReviews.length > 1 ? business.insights.price : '';

	await business.save();

	transactionObject.review = null;
	await transactionObject.save();

	await Review.findByIdAndDelete(id);

	res.status(200).json({
		success: true,
		message: 'Review deleted successfully',
	});
});
export { createReview, getReviews, getReviewById, updateReview, deleteReview };
