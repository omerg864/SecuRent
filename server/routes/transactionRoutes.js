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

// TODO: add middleware admin to protect routes
router.get('/admin/:id', getTransactionAdmin);
router.get('/admin/costumer/:id', getCostumerTransactionsAdmin);
router.get('/admin/business/:id', getBusinessTransactionsAdmin);

export default router;