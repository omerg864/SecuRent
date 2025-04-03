import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
} from '../controllers/ItemController.js';
import { authBusiness } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authBusiness, upload.single('image'), createItem);
router.put('/:id',authBusiness ,upload.single('image'), updateItem);
router.get('/', getItems);
router.get('/:id',authBusiness ,getItemById);
router.delete('/:id',authBusiness , deleteItem);

export default router;
