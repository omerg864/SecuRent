import express from 'express';
import {
	registerCustomer,
	loginCustomer,
	googleLoginCustomer,
	updateCustomer,
	deleteCustomer,
	updateCustomerPassword,
	getCustomerById,
	refreshTokens,
	updateCustomerCreditCard,
	verifyEmail,
} from '../controllers/customerController.js';
import { authCustomer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerCustomer); // Customer Registration
router.post('/login', loginCustomer); // Customer Login
router.post('/google-login', googleLoginCustomer); // Google OAuth Login
router.post('/refresh-token', refreshTokens); // Refresh Customer Tokens

// Protected Routes (Requires Authentication)
router.put('/update-password', authCustomer, updateCustomerPassword); // Update Customer Password
router.put('/update', authCustomer, updateCustomer); // Update Customer Profile
router.delete('/delete', authCustomer, deleteCustomer); // Delete Customer Account
router.get('/:id', authCustomer, getCustomerById); // Get Customer by ID3
router.put('/update/credit-card', authCustomer, updateCustomerCreditCard); // Update Customer Credit Card
router.post('/verify-email', authCustomer, verifyEmail); // Verify Customer Email

export default router;