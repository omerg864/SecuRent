import express from 'express';
import {
	googleLogin,
	login,
	register,
	deleteAdmin,
	updateAdmin,
	verifyAdmin,
} from '../controllers/adminController.js';
import { authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/login', login);
router.get('/register', register);
router.get('/google', googleLogin);

//! protected routes
router.put('/update', authAdmin, updateAdmin);
router.delete('/:id', authAdmin, deleteAdmin);
router.put('/verify/:id', authAdmin, verifyAdmin);

export default router;
