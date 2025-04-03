import express from "express";
import {
  registerCustomer,
  loginCustomer,
  googleLoginCustomer,
  updateCustomer,
  deleteCustomer,
  updateCustomerPassword,
  getCustomerById,
  refreshTokens,
  updateCustomerCreditCard,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/customerController.js";
import { authCustomer } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", upload.single("image"), registerCustomer); // Customer Registration
router.post("/login", loginCustomer); // Customer Login
router.post("/google-login", googleLoginCustomer); // Google OAuth Login
router.post("/refresh-token", refreshTokens); // Refresh Customer Tokens

// Protected Routes (Requires Authentication)
router.put("/update-password", authCustomer, updateCustomerPassword); // Update Customer Password
router.put("/update", authCustomer, upload.single("image"), updateCustomer); // Update Customer Profile
router.delete("/delete", authCustomer, deleteCustomer); // Delete Customer Account
router.get("/:id", authCustomer, getCustomerById); // Get Customer by ID3
router.put("/update/credit-card", authCustomer, updateCustomerCreditCard); // Update Customer Credit Card
router.post("/verify-email", authCustomer, verifyEmail); // Verify Customer Email
router.post("/resend-code", authCustomer, resendVerificationCode); // Resend Verification Code
export default router;
