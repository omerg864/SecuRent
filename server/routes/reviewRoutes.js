import express from 'express';
import {
	createReview,
	getReviews,
	getReviewById,
	updateReview,
	deleteReview,
} from '../controllers/reviewController.js';
import { authCustomer } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authCustomer, upload.array('images'), createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.put('/:id', authCustomer,  upload.array('images'), updateReview);
router.delete('/:id', authCustomer, deleteReview);

export default router;
