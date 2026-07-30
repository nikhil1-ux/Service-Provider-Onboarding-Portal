import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// GET /api/provider/profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  res.status(200).json(new ApiResponse(200, provider, "Profile fetched"));
});

// PUT /api/provider/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id);

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  if (provider.applicationStatus === "approved") {
    throw new ApiError(
      403,
      "Profile cannot be edited after approval. Contact admin for changes."
    );
  }

  const {
    name,
    phone,
    serviceCategories,
    skills,
    experienceYears,
    location,
  } = req.body;

  if (name) provider.name = name;
  if (phone) provider.phone = phone;
  if (serviceCategories) provider.serviceCategories = serviceCategories;
  if (skills) provider.skills = skills;
  if (experienceYears !== undefined) {
    provider.experienceYears = experienceYears;
  }
  if (location) {
    provider.location = {
      ...provider.location,
      ...location,
    };
  }

  await provider.save();

  const safe = await User.findById(provider._id).select(
    "-password -refreshToken"
  );

  res.status(200).json(new ApiResponse(200, safe, "Profile updated"));
});

// POST /api/provider/profile-photo
export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Photo file is required");
  }

  const provider = await User.findById(req.user._id);

  if (provider.applicationStatus === "approved") {
    throw new ApiError(403, "Cannot edit profile after approval");
  }

  const result = await uploadToCloudinary(
    req.file.buffer,
    `onboarding-portal/providers/${provider._id}/photo`,
    "image"
  );

  provider.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await provider.save();

  res
    .status(200)
    .json(new ApiResponse(200, provider.profilePhoto, "Photo uploaded"));
});

// POST /api/provider/documents
export const uploadDocuments = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one document is required");
  }

  const provider = await User.findById(req.user._id);

  if (provider.applicationStatus === "approved") {
    throw new ApiError(403, "Cannot edit profile after approval");
  }

  let names = req.body.documentNames;

  if (!names) {
    names = req.files.map((_, i) => `Document ${i + 1}`);
  }

  if (!Array.isArray(names)) {
    names = [names];
  }

  const uploaded = [];

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    const result = await uploadToCloudinary(
      file.buffer,
      `onboarding-portal/providers/${provider._id}/documents`,
      "auto"
    );

    uploaded.push({
      name: names[i] || `Document ${i + 1}`,
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  provider.documents.push(...uploaded);
  await provider.save();

  res
    .status(200)
    .json(new ApiResponse(200, provider.documents, "Documents uploaded"));
});

// DELETE /api/provider/documents/:publicId
export const deleteDocument = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id);

  if (provider.applicationStatus === "approved") {
    throw new ApiError(403, "Cannot edit profile after approval");
  }

  const { publicId } = req.params;

  provider.documents = provider.documents.filter(
    (doc) => doc.publicId !== decodeURIComponent(publicId)
  );

  await provider.save();

  res
    .status(200)
    .json(new ApiResponse(200, provider.documents, "Document removed"));
});

// POST /api/provider/submit
export const submitApplication = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id);

  if (provider.applicationStatus === "approved") {
    throw new ApiError(400, "Application already approved");
  }

  if (provider.applicationStatus === "pending") {
    throw new ApiError(400, "Application already submitted and pending review");
  }

  if (!provider.isProfileComplete()) {
    throw new ApiError(
      400,
      "Profile incomplete. Please fill all required fields, upload a photo and at least one document."
    );
  }

  provider.applicationStatus = "pending";
  provider.submittedAt = new Date();
  provider.rejectionRemarks = "";

  await provider.save();

  res
    .status(200)
    .json(new ApiResponse(200, provider, "Application submitted for review"));
});

// GET /api/provider/status
export const getApplicationStatus = asyncHandler(async (req, res) => {
  const provider = await User.findById(req.user._id).select(
    "applicationStatus rejectionRemarks submittedAt reviewedAt"
  );

  res.status(200).json(new ApiResponse(200, provider, "Status fetched"));
});