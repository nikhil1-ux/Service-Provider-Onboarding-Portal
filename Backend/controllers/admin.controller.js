import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

// GET /api/admin/providers?search=&status=&category=&page=&limit=
export const getAllProviders = asyncHandler(async (req, res) => {
  const {
    search = "",
    status = "",
    category = "",
    page = 1,
    limit = 10,
  } = req.query;

  const query = { role: "provider" };

  if (status) query.applicationStatus = status;
  if (category) query.serviceCategories = category;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const [providers, total] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        providers,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Providers fetched"
    )
  );
});

// GET /api/admin/providers/:id
export const getProviderById = asyncHandler(async (req, res) => {
  const provider = await User.findOne({
    _id: req.params.id,
    role: "provider",
  }).select("-password -refreshToken");

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  res.status(200).json(new ApiResponse(200, provider, "Provider fetched"));
});

// PATCH /api/admin/providers/:id/approve
export const approveProvider = asyncHandler(async (req, res) => {
  const provider = await User.findOne({
    _id: req.params.id,
    role: "provider",
  });

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  if (provider.applicationStatus !== "pending") {
    throw new ApiError(400, "Only pending applications can be approved");
  }

  provider.applicationStatus = "approved";
  provider.rejectionRemarks = "";
  provider.reviewedAt = new Date();

  await provider.save();

  res.status(200).json(new ApiResponse(200, provider, "Provider approved"));
});

// PATCH /api/admin/providers/:id/reject
export const rejectProvider = asyncHandler(async (req, res) => {
  const { remarks } = req.body;

  if (!remarks || !remarks.trim()) {
    throw new ApiError(400, "Rejection remarks are required");
  }

  const provider = await User.findOne({
    _id: req.params.id,
    role: "provider",
  });

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  if (provider.applicationStatus !== "pending") {
    throw new ApiError(400, "Only pending applications can be rejected");
  }

  provider.applicationStatus = "rejected";
  provider.rejectionRemarks = remarks;
  provider.reviewedAt = new Date();

  await provider.save();

  res.status(200).json(new ApiResponse(200, provider, "Provider rejected"));
});

// GET /api/admin/dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [total, pending, approved, rejected, incomplete] = await Promise.all([
    User.countDocuments({ role: "provider" }),
    User.countDocuments({
      role: "provider",
      applicationStatus: "pending",
    }),
    User.countDocuments({
      role: "provider",
      applicationStatus: "approved",
    }),
    User.countDocuments({
      role: "provider",
      applicationStatus: "rejected",
    }),
    User.countDocuments({
      role: "provider",
      applicationStatus: "incomplete",
    }),
  ]);

  const categoryAgg = await User.aggregate([
    { $match: { role: "provider" } },
    {
      $unwind: {
        path: "$serviceCategories",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$serviceCategories",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        pending,
        approved,
        rejected,
        incomplete,
        byCategory: categoryAgg.map((c) => ({
          category: c._id,
          count: c.count,
        })),
      },
      "Dashboard stats fetched"
    )
  );
});