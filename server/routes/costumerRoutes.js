import express from 'express';
import {
    registerCustomer,
    loginCustomer,
    googleLoginCustomer,
    updateCustomer,
    deleteCustomer,
} from '../controllers/costumerController.js';
import { authCostumer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerCustomer);  // Customer Registration
router.post('/login', loginCustomer);        // Customer Login
router.post('/google-login', googleLoginCustomer); // Google OAuth Login

// Protected Routes (Requires Authentication)
router.put('/update', authCostumer, updateCustomer);  // Update Customer Profile
router.delete('/delete', authCostumer, deleteCustomer);  // Delete Customer Account

export default router;
