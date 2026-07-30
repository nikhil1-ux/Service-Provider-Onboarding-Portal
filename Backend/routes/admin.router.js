import express from "express";

import {
  getAllProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  getDashboardStats,
} from "../controllers/admin.controller.js";

import {
  verifyJWT,
  isAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/providers", getAllProviders);
router.get("/providers/:id", getProviderById);
router.patch("/providers/:id/approve", approveProvider);
router.patch("/providers/:id/reject", rejectProvider);

export default router;