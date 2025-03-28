import express from 'express';
import {
	createReview,
	getReviews,
	getReviewById,
	updateReview,
	deleteReview,
} from '../controllers/reviewController.js';
import { authCustomer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authCustomer, createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.put('/:id', authCustomer, updateReview);
router.delete('/:id', authCustomer, deleteReview);

export default router;
