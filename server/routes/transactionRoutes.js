import express from "express";
import {
  getBusinessTransactions,
  getCustomerTransactions,
  getTransactionByCustomer,
  getTransactionByBusiness,
  createTransaction,
  getTransactionAdmin,
  getCustomerTransactionsAdmin,
  getBusinessTransactionsAdmin,
  createTransactionFromItem,
  getTransactionById,
  closeTransactionById,
  captureDeposit,
  confirmTransactionPayment,
  deleteIntentTransaction,
} from "../controllers/transactionController.js";
import {
  authAdmin,
  authBusiness,
  authCustomer,
  authAny,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// TODO: add middleware business to protect routes
router.get("/business", authBusiness, getBusinessTransactions);
router.get("/business/:id", authBusiness, getTransactionByBusiness);
router.put("/close/:id", authBusiness, closeTransactionById);
router.put("/charge/:id", authBusiness, captureDeposit);

// TODO: add middleware customer to protect routes
router.get("/customer", authCustomer, getCustomerTransactions);
router.get("/customer/:id", authCustomer, getTransactionByCustomer);
router.post("/", authCustomer, createTransaction);
router.get("/:id", authCustomer, createTransactionFromItem);
router.post("/confirm/:id", authCustomer, confirmTransactionPayment);
router.delete("/customer/delete/:id", authCustomer, deleteIntentTransaction);

//! Admin routes
router.get("/admin/:id", authAdmin, getTransactionAdmin);
router.get("/admin/customer/:id", authAdmin, getCustomerTransactionsAdmin);
router.get("/admin/business/:id", authAdmin, getBusinessTransactionsAdmin);

router.get("/transaction/:id", authAny, getTransactionById);

export default router;
