import express from 'express';
import {
	getBusinessTransactions,
	getCustomerTransactions,
	getTransactionByCustomer,
	getTransactionByBusiness,
	createTransaction,
	releaseDeposit,
	getTransactionAdmin,
	getCustomerTransactionsAdmin,
	getBusinessTransactionsAdmin,
	createTransactionFromItem,
	getTransactionById,
	closeTransactionById,
	captureDeposit
} from '../controllers/transactionController.js';
import {
	authAdmin,
	authBusiness,
	authCustomer,
	authAny,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// TODO: add middleware business to protect routes
router.get('/business', authBusiness, getBusinessTransactions);
router.get('/business/:id', authBusiness, getTransactionByBusiness);
router.put('/release/:id', authBusiness, releaseDeposit);
router.put('/charge/:id', authBusiness, captureDeposit);


// TODO: add middleware customer to protect routes
router.get('/customer', authCustomer, getCustomerTransactions);
router.get('/customer/:id', authCustomer, getTransactionByCustomer);
router.post('/', authCustomer, createTransaction);
router.post('/:id', authCustomer, createTransactionFromItem);

//! Admin routes
router.get('/admin/:id', authAdmin, getTransactionAdmin);
router.get('/admin/customer/:id', authAdmin, getCustomerTransactionsAdmin);
router.get('/admin/business/:id', authAdmin, getBusinessTransactionsAdmin);


router.get('/transaction/:id', authAny, getTransactionById);
router.put('/close/:id', authAny, closeTransactionById);


export default router;
