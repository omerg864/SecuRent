import express from "express";
import {
  registerBusiness,
  loginBusiness,
  googleLoginBusiness,
  updateBusiness,
  deleteBusiness,
  refreshTokens,
  getBusinessById,
  verifyAndUpdateCompanyNumber,
  verifyBank,
  verifyEmail,
  updateBusinessPassword,
  resendVerificationCode,
  deleteBusinessImage
} from "../controllers/businessController.js";
import { authBusiness } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", upload.single("image"), registerBusiness);
router.post("/login", loginBusiness);
router.post("/google-login", googleLoginBusiness);
router.post("/refresh-token", refreshTokens);
router.post(
  "/verify-company-number",
  authBusiness,
  verifyAndUpdateCompanyNumber
);
router.post("/verify-bank", authBusiness, verifyBank);
router.post("/verify-email", authBusiness, verifyEmail);

// Protected Routes (Requires Authentication)
router.put("/update", authBusiness, upload.single("image"), updateBusiness);
router.delete("/image", authBusiness, deleteBusinessImage);
router.delete("/delete", authBusiness, deleteBusiness);
router.get("/:id", authBusiness, getBusinessById);
router.put("/update-password", authBusiness, updateBusinessPassword);
router.post("/resend-code", authBusiness, resendVerificationCode);

export default router;
