import express from 'express';
import {
    registerBusiness,
    loginBusiness,
    googleLoginBusiness,
    updateBusiness,
    deleteBusiness,
    refreshTokens,
    getBusinessById,
} from '../controllers/businessController.js';
import { authBusiness } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerBusiness);
router.post('/login', loginBusiness);
router.post('/google-login', googleLoginBusiness);
router.post('/refresh-token', refreshTokens);


// Protected Routes (Requires Authentication)
router.put('/update', authBusiness, updateBusiness);
router.delete('/delete', authBusiness, deleteBusiness);
router.get('/:id', authBusiness, getBusinessById);

export default router;
