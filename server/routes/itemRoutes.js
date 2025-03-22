import express from 'express';
import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
} from '../controllers/ItemController.js';
import { authBusiness } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',authBusiness , createItem);
router.get('/', getItems);
router.get('/:id',authBusiness ,getItemById);
router.put('/:id',authBusiness , updateItem);
router.delete('/:id',authBusiness , deleteItem);

export default router;
