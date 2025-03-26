import express from 'express';
import {
	getBusinessTransactions,
	getCustomerTransactions,
	getTransactionByCustomer,
	getTransactionByBusiness,
	createTransaction,
	releaseDeposit,
	chargeDeposit,
	getTransactionAdmin,
	getCustomerTransactionsAdmin,
	getBusinessTransactionsAdmin,
} from '../controllers/transactionController.js';
import { authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// TODO: add middleware business to protect routes
router.get('/business', getBusinessTransactions);
router.get('/business/:id', getTransactionByBusiness);
router.put('/release/:id', releaseDeposit);
router.put('/charge/:id', chargeDeposit);

// TODO: add middleware customer to protect routes
router.get('/customer', getCustomerTransactions);
router.get('/customer/:id', getTransactionByCustomer);
router.post('/', createTransaction);

//! Admin routes
router.get('/admin/:id', authAdmin, getTransactionAdmin);
router.get('/admin/customer/:id', authAdmin, getCustomerTransactionsAdmin);
router.get('/admin/business/:id', authAdmin, getBusinessTransactionsAdmin);

export default router;
