import express from 'express';
import {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
} from '../controllers/reviewController.js';
import { authCostumer } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/',authCostumer, createReview); 
router.get('/', getReviews); 
router.get('/:id', getReviewById); 
router.put('/:id', authCostumer, updateReview); 
router.delete('/:id', authCostumer, deleteReview); 

export default router;
