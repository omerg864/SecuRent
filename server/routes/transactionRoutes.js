import express from 'express';
import {
    getBusinessTransactions,
    getCostumerTransactions,
    getTransactionByCostumer,
    getTransactionByBusiness,
    createTransaction,
    releaseDeposit,
    chargeDeposit,
    getTransactionAdmin,
    getCostumerTransactionsAdmin,
    getBusinessTransactionsAdmin,
} from '../controllers/transactionController.js';
import { authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// TODO: add middleware business to protect routes
router.get('/business', getBusinessTransactions);
router.get('/business/:id', getTransactionByBusiness);
router.put('/release/:id', releaseDeposit);
router.put('/charge/:id', chargeDeposit);

// TODO: add middleware costumer to protect routes
router.get('/costumer', getCostumerTransactions);
router.get('/costumer/:id', getTransactionByCostumer);
router.post('/', createTransaction);

//! Admin routes
router.get('/admin/:id', authAdmin, getTransactionAdmin);
router.get('/admin/costumer/:id', authAdmin, getCostumerTransactionsAdmin);
router.get('/admin/business/:id', authAdmin, getBusinessTransactionsAdmin);

export default router;