import express from 'express';
import {
	registerBusiness,
	loginBusiness,
	googleLoginBusiness,
	updateBusiness,
	deleteBusiness,
	refreshTokens,
	getBusinessById,
	updateBusinessDetails,
	verifyBank,
	verifyEmail,
	updateBusinessPassword,
	resendVerificationCode,
} from '../controllers/businessController.js';
import { authBusiness } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', upload.single('image'), registerBusiness);
router.post('/login', loginBusiness);
router.post('/google-login', googleLoginBusiness);
router.post('/refresh-token', refreshTokens);
router.put('/', authBusiness, updateBusinessDetails);
router.post('/verify-bank', authBusiness, upload.single('image'), verifyBank);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendVerificationCode);

// Protected Routes (Requires Authentication)
router.put('/update', authBusiness, upload.single('image'), updateBusiness);
router.delete('/delete', authBusiness, deleteBusiness);
router.get('/:id', authBusiness, getBusinessById);
router.put('/update-password', authBusiness, updateBusinessPassword);

export default router;
