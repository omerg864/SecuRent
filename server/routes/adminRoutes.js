import express from 'express';
import {
	googleLogin,
	login,
	register,
	deleteAdmin,
	updateAdmin,
	verifyAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/login', login);
router.get('/register', register);
router.get('/google', googleLogin);
// TODO: add middleware to protect routes
router.put('/update', updateAdmin);
router.delete('/:id', deleteAdmin);
router.put('/verify/:id', verifyAdmin);

export default router;
