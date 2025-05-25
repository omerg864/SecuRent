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
	getStripeOnboardingLink,
	getNearbyBusinesses,
	getBusinessProfile,
	getBusinessData,
	toggleBusinessActivation,
	updateBusinessAccount,
} from '../controllers/businessController.js';
import {
	authAny,
	authBusiness,
	authCustomer,
	authSuspendedBusiness,
} from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', upload.single('image'), registerBusiness);
router.post('/login', loginBusiness);
router.post('/google-login', googleLoginBusiness);
router.post('/refresh-token', refreshTokens);
router.put('/', authBusiness, upload.single('image'), updateBusinessDetails);
router.get('/verify-bank', authBusiness, verifyBank);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendVerificationCode);

// protected routes customer
router.get('/nearby', authCustomer, getNearbyBusinesses);

// Protected Routes (Requires Authentication)
router.put('/update', authBusiness, upload.single('image'), updateBusiness);
router.put(
	'/update/account',
	authBusiness,
	upload.single('image'),
	updateBusinessAccount
);
router.delete('/delete', authBusiness, deleteBusiness);
router.put('/update-password', authBusiness, updateBusinessPassword);
router.get('/stripe-onboarding', authBusiness, getStripeOnboardingLink);
router.get('/me', authSuspendedBusiness, getBusinessData);
router.get('/activation', authSuspendedBusiness, toggleBusinessActivation);
router.get('/:id', authAny, getBusinessById);
router.get('/business-profile/:id', authAny, getBusinessProfile);

export default router;
