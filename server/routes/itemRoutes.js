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
import { authCustomer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authBusiness, upload.single('image'), createItem);
router.put('/:id',authBusiness ,upload.single('image'), updateItem);
router.get('/business/:id', authBusiness, getItemById);
router.get('/', getItems);
router.get('/:id',authCustomer ,getItemById);
router.delete('/:id',authBusiness , deleteItem);

export default router;
