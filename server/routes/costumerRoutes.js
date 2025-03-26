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
} from '../controllers/costumerController.js';
import { authCostumer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerCustomer); // Customer Registration
router.post('/login', loginCustomer); // Customer Login
router.post('/google-login', googleLoginCustomer); // Google OAuth Login
router.post('/refresh-token', refreshTokens); // Refresh Customer Tokens

// Protected Routes (Requires Authentication)
router.put('/update/password', authCostumer, updateCustomerPassword); // Update Customer Password
router.put('/update', authCostumer, updateCustomer); // Update Customer Profile
router.delete('/delete', authCostumer, deleteCustomer); // Delete Customer Account
router.get('/:id', authCostumer, getCustomerById); // Get Customer by ID3
router.put('/update/credit-card', authCostumer, updateCustomerCreditCard); // Update Customer Credit Card
router.post('/verify-email', authCostumer, verifyEmail); // Verify Customer Email

export default router;
