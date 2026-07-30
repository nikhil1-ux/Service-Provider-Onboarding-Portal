import express from "express";

import {
  getMyProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadDocuments,
  deleteDocument,
  submitApplication,
  getApplicationStatus,
} from "../controllers/provider.controller.js";

import {
  verifyJWT,
  isProvider,
} from "../middlewares/auth.middleware.js";

import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(verifyJWT, isProvider);

router.get("/profile", getMyProfile);
router.put("/profile", updateProfile);

router.post(
  "/profile-photo",
  upload.single("photo"),
  uploadProfilePhoto
);

router.post(
  "/documents",
  upload.array("documents", 5),
  uploadDocuments
);

router.delete("/documents/:publicId", deleteDocument);

router.post("/submit", submitApplication);

router.get("/status", getApplicationStatus);

export default router;