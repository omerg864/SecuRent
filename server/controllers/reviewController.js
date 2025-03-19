import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';

const createReview = asyncHandler(async (req, res) => {
    const { business, customer, rating, content } = req.body;

    if (!business || !customer || !rating) {
        res.status(400);
        throw new Error('Please provide business, customer, and rating');
    }

    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    const review = await Review.create({
        business,
        customer,
        rating,
        content,
    });

    res.status(201).json({
        success: true,
        review,
    });
});

const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().populate('business').populate('customer');
    res.status(200).json({
        success: true,
        reviews,
    });
});

const getReviewById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id).populate('business').populate('customer');

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    res.status(200).json({
        success: true,
        review,
    });
});

const updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, content } = req.body;
    
    const review = await Review.findById(id);
    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    if (rating && (rating < 1 || rating > 5)) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    review.rating = rating ?? review.rating;
    review.content = content ?? review.content;
    
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

    await review.remove();
    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    });
});

export { createReview, getReviews, getReviewById, updateReview, deleteReview };