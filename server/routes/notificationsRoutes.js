import express from "express";
import { authAdmin, authCustomer, authSuspendedBusiness } from '../middleware/authMiddleware.js';
import { getAdminNotifications, markAdminNotificationAsRead, getCustomerNotifications, markBusinessNotificationAsRead, markCustomerNotificationAsRead, getBusinessNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/admin", authAdmin, getAdminNotifications);
router.put("/admin/read", authAdmin, markAdminNotificationAsRead);
router.get("/customer", authCustomer, getCustomerNotifications);
router.put("/customer/read", authCustomer, markCustomerNotificationAsRead);
router.get("/business", authSuspendedBusiness, getBusinessNotifications);
router.put("/business/read", authSuspendedBusiness, markBusinessNotificationAsRead);

export default router;