import express from 'express';
import {
	getReports,
	getReportById,
	resolveReport,
	createReport,
} from '../controllers/reportController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', upload.single('image'), createReport);
router.put('/:id/resolve', resolveReport);

export default router;
