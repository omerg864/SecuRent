import express from 'express';
import {
	getReports,
	getReportById,
	resolveReport,
	createReport,
    getCustomerReports,
    getCustomerReportById,
   getAllReportsByCustomerId,
} from '../controllers/reportController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authCustomer, authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authAdmin, getReports);
router.get('/customer', authCustomer, getCustomerReports);
router.get('/:id', authAdmin, getReportById);
router.get('/:id/customer', authCustomer, getCustomerReportById);
router.post('/', authCustomer, upload.array('images'), createReport);
router.put('/:id', authAdmin, resolveReport);
router.get('/customer/:id', authAdmin, getAllReportsByCustomerId);

export default router;
