import asyncHandler from 'express-async-handler';
import Report from '../models/reportModel.js';
import Business from '../models/businessModel.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {
	REPORT_RESOLUTION,
	REPORT_STATUS,
	REPORT_LIMIT_PER_PAGE,
} from '../utils/constants.js';

const createReport = asyncHandler(async (req, res) => {
	const { businessId, content, title } = req.body;
	const customerId = req.customer._id;

	if (!businessId || !content || !title) {
		res.status(400);
		throw new Error('Please add all fields');
	}

	const business = await Business.findById(businessId);
	if (!business) {
		res.status(404);
		throw new Error('Business not found');
	}

	if (business.suspended) {
		res.status(403);
		throw new Error('Business is suspended');
	}

	const reportInTheLast24Hours = await Report.findOne({
		customer: customerId,
		business: businessId,
		createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
	});

	if (reportInTheLast24Hours) {
		res.status(400);
		throw new Error(
			'You can only create one report for a business every 24 hours'
		);
	}

	let images = [];

	if (req.files) {
		if (req.files.length > 5) {
			res.status(400);
			throw new Error('You can only upload up to 5 images');
		}
		for (const file of req.files) {
			const imageID = uuidv4();
			const imageUrl = await uploadToCloudinary(
				file.buffer,
				`${process.env.CLOUDINARY_BASE_FOLDER}/reports`,
				imageID
			);
			images.push(imageUrl);
		}
	}

	const report = await Report.create({
		business: businessId,
		customer: customerId,
		content,
		images,
		title,
	});

	res.status(201).json({
		report,
		success: true,
	});
});

const getReports = asyncHandler(async (req, res) => {
	const status = req.query.status || REPORT_STATUS.OPEN;
	const page = parseInt(req.query.page) || 1;
	const reports = await Report.find({ status })
		.skip((page - 1) * REPORT_LIMIT_PER_PAGE)
		.populate('business', 'name address phone email rating image suspended')
		.populate('customer', 'name phone email image suspended')
		.populate('resolutionBy', 'name email')
		.sort({ createdAt: -1 })
		.limit(REPORT_LIMIT_PER_PAGE);

	res.status(200).json({
		reports,
		page: parseInt(page),
		limit: REPORT_LIMIT_PER_PAGE,
		total: await Report.countDocuments({ status }),
		success: true,
	});
});

const getReportById = asyncHandler(async (req, res) => {
	const report = await Report.findById(req.params.id)
		.populate('business', 'name address phone email rating image suspended')
		.populate('customer', 'name phone email image suspended')
		.populate('resolutionBy', 'name');

	if (!report) {
		res.status(404);
		throw new Error('Report not found');
	}

	res.status(200).json({
		report,
		success: true,
	});
});

const getCustomerReports = asyncHandler(async (req, res) => {
	const reports = await Report.find({ customer: req.customer._id })
		.populate('business', 'name address phone email rating image suspended')
		.populate('resolutionBy', 'name')
		.sort({ createdAt: -1 });

	res.status(200).json({
		reports,
		success: true,
	});
});

const getCustomerReportById = asyncHandler(async (req, res) => {
	const report = await Report.findById(req.params.id)
		.populate('business', 'name address phone email rating image suspended')
		.populate('resolutionBy', 'name');

	if (!report) {
		res.status(404);
		throw new Error('Report not found');
	}

	if (report.customer.toString() !== req.customer._id.toString()) {
		res.status(403);
		throw new Error('Not authorized to view this report');
	}

	res.status(200).json({
		report,
		success: true,
	});
});

const resolveReport = asyncHandler(async (req, res) => {
	const { status, resolution } = req.body;

	if (!status && !resolution) {
		res.status(400);
		throw new Error('Please provide status and resolution');
	}

	if (REPORT_RESOLUTION[status.toUpperCase()] === undefined) {
		res.status(400);
		throw new Error('Invalid status');
	}

	const report = await Report.findById(req.params.id);

	if (!report) {
		res.status(404);
		throw new Error('Report not found');
	}

	report.status = status;
	report.resolution = resolution;
	report.resolutionDate = new Date();
	report.resolutionBy = req.admin._id;

	await report.save();

	const updatedReport = await Report.findById(report._id).populate(
		'resolutionBy',
		'name _id'
	);

	res.status(200).json({
		report: updatedReport,
		success: true,
	});
});

const getAllReportsByCustomerId = asyncHandler(async (req, res) => {
	const customerId = req.params.id;
	const reports = await Report.find({ customer: customerId })
		.populate('business', 'name email rating image suspended')
		.populate('resolutionBy', 'name')
		.sort({ createdAt: -1 });

	if (!reports) {
		res.status(404);
		throw new Error('No reports found for this customer');
	}

	res.status(200).json({
		reports,
		success: true,
	});
});

const getAllReportsByBusinessId = asyncHandler(async (req, res) => {
	const businessId = req.params.id;

	const reports = await Report.find({ business: businessId })
		.populate('customer', 'name email phone image suspended')
		.populate('resolutionBy', 'name')
		.sort({ createdAt: -1 });

	if (!reports || reports.length === 0) {
		res.status(404);
		throw new Error('No reports found for this business');
	}

	res.status(200).json({
		reports,
		success: true,
	});
});

const getAllResolvedReportsByAdminId = asyncHandler(async (req, res) => {
	const adminId = req.params.id;
	const reports = await Report.find({ resolutionBy: adminId })
		.populate('business', 'name email rating image suspended')
		.populate('customer', 'name phone email image suspended')
		.populate('resolutionBy', 'name')
		.sort({ resolutionDate: -1 }); // or createdAt: -1 if you prefer

	if (!reports || reports.length === 0) {
		res.status(404);
		throw new Error('No  resolve reports found for this admin');
	}

	res.status(200).json({
		reports,
		success: true,
	});
});

export {
	createReport,
	getReports,
	getReportById,
	resolveReport,
	getCustomerReports,
	getCustomerReportById,
	getAllReportsByCustomerId,
	getAllReportsByBusinessId,
	getAllResolvedReportsByAdminId,
};
