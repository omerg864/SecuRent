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
} from '../controllers/adminController.js';
import { authAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';


const router = express.Router();

router.post('/login', login);
router.post('/register',upload.single('image') , register);
router.post('/google', googleLogin);
router.post('/login/client', loginClient);
router.get('/identify-user', identifyUser);

//! protected routes
router.put('/update', authAdmin, upload.single('Image'), updateAdmin);
router.delete('/:id', authAdmin, deleteAdmin);
router.put('/verify/:id', authAdmin, verifyAdmin);

export default router;