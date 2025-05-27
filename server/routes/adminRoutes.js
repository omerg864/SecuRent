import express from 'express';
import {
	googleLogin,
	login,
	register,
	deleteAdmin,
	updateAdmin,
	verifyAdmin,
	loginClient,
	identifyUser,
	adminAnalytics,
	refreshTokens,
	getAllBusinesses,
	getAllCustomers,
	toggleCustomerSuspension,
	toggleBusinessSuspension,
	getAdminById,
} from '../controllers/adminController.js';
import { authAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', upload.single('image'), register);
router.post('/google', googleLogin);
router.post('/login/client', loginClient);
router.post('/refresh-token', refreshTokens);
//! security vulnerability: this route should be protected
router.get('/identify-user', identifyUser);

//! protected routes
router.put('/update', authAdmin, upload.single('Image'), updateAdmin);
router.delete('/:id', authAdmin, deleteAdmin);
router.put('/verify/:id', authAdmin, verifyAdmin);
router.get('/analytics', authAdmin, adminAnalytics);
router.get('/get-all-businesses', authAdmin, getAllBusinesses); // Get all businesses
router.get('/get-all-customers', authAdmin, getAllCustomers); // Get all customers
router.put('/suspend/customer/:id', authAdmin, toggleCustomerSuspension); // Toggle customer suspension
router.put('/suspend/business/:id', authAdmin, toggleBusinessSuspension); // Toggle business suspension
router.get('/:id', authAdmin, getAdminById); // Get admin by ID

export default router;
