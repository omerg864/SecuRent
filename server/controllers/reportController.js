import asyncHandler from 'express-async-handler';
import Report from '../models/reportModel.js';
import Business from '../models/businessModel.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { REPORT_RESOLUTION } from '../utils/constants.js';

const createReport = asyncHandler(async (req, res) => {
	const { businessId, content } = req.body;
	const customerId = req.customer._id;

	if (!businessId || !content) {
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

	let imageUrl = '';

	if (req.file) {
		const imageID = uuidv4();
		imageUrl = await uploadToCloudinary(
			req.file.buffer,
			`${process.env.CLOUDINARY_BASE_FOLDER}/reports`,
			imageID
		);
	}

	const report = await Report.create({
		business: businessId,
		customer: customerId,
		content,
		image: imageUrl,
	});

	res.status(201).json({
		report,
		success: true,
	});
});

const getReports = asyncHandler(async (req, res) => {
	const reports = await Report.find()
		.populate('business')
		.populate('customer')
		.populate('resolutionBy')
		.sort({ createdAt: -1 });

	res.status(200).json({
		reports,
		success: true,
	});
});

const getReportById = asyncHandler(async (req, res) => {
	const report = await Report.findById(req.params.id)
		.populate('business')
		.populate('customer')
		.populate('resolutionBy');

	if (!report) {
		res.status(404);
		throw new Error('Report not found');
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

	res.status(200).json({
		report,
		success: true,
	});
});



export { createReport, getReports, getReportById, resolveReport };
