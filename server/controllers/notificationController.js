import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel.js';
import { NOTIFICATION_LIMIT_PER_PAGE } from '../utils/constants.js';

const getAdminNotifications = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const notifications = await Notification.find({
		type: 'admin',
	})
		.skip((page - 1) * NOTIFICATION_LIMIT_PER_PAGE)
		.limit(NOTIFICATION_LIMIT_PER_PAGE)
		.sort({ createdAt: -1 })
        .populate('customer', 'name image');
	res.status(200).json({
		notifications,
		page: page,
		limit: NOTIFICATION_LIMIT_PER_PAGE,
		total: await Notification.countDocuments(),
		success: true,
	});
});

const markAdminNotificationAsRead = asyncHandler(async (req, res) => {
	const { ids } = req.body;
	if (!ids || !Array.isArray(ids)) {
		res.status(400);
		throw new Error('Invalid request: ids must be an array');
	}
	const notifications = await Notification.updateMany(
		{ _id: { $in: ids } },
		{ $set: { read: true } }
	);
	res.status(200).json({
		notifications,
		success: true,
	});
});

const getCustomerNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const notifications = await Notification.find({
        customer: req.customer._id,
        type: 'customer',
    })
        .skip((page - 1) * NOTIFICATION_LIMIT_PER_PAGE)
        .limit(NOTIFICATION_LIMIT_PER_PAGE)
        .sort({ createdAt: -1 });
    res.status(200).json({
        notifications,
        page: page,
        limit: NOTIFICATION_LIMIT_PER_PAGE,
        total: await Notification.countDocuments(),
        success: true,
    });
});

const markCustomerNotificationAsRead = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        res.status(400);
        throw new Error('Invalid request: ids must be an array');
    }
    const notifications = await Notification.updateMany(
        { _id: { $in: ids }, customer: req.customer._id },
        { $set: { read: true } }
    );
    res.status(200).json({
        notifications,
        success: true,
    });
});

const getBusinessNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const notifications = await Notification.find({
        business: req.business._id,
        type: 'business',
    })
        .skip((page - 1) * NOTIFICATION_LIMIT_PER_PAGE)
        .limit(NOTIFICATION_LIMIT_PER_PAGE)
        .sort({ createdAt: -1 });
    res.status(200).json({
        notifications,
        page: page,
        limit: NOTIFICATION_LIMIT_PER_PAGE,
        total: await Notification.countDocuments(),
        success: true,
    });
});

const markBusinessNotificationAsRead = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        res.status(400);
        throw new Error('Invalid request: ids must be an array');
    }
    const notifications = await Notification.updateMany(
        { _id: { $in: ids }, business: req.business._id },
        { $set: { read: true } }
    );
    res.status(200).json({
        notifications,
        success: true,
    });
});

export { getAdminNotifications, markAdminNotificationAsRead, getCustomerNotifications, markCustomerNotificationAsRead, getBusinessNotifications, markBusinessNotificationAsRead };
