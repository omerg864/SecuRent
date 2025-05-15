import express from 'express';
import {
	createReview,
	getReviews,
	getReviewById,
	updateReview,
	deleteReview,
	getAllReviewsByCustomerId
} from '../controllers/reviewController.js';
import { authAdmin, authCustomer } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authCustomer, upload.array('images'), createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.put('/:id', authCustomer,  upload.array('images'), updateReview);
router.delete('/:id', authCustomer, deleteReview);
router.get('/customer/:id',authAdmin, getAllReviewsByCustomerId);

export default router;
