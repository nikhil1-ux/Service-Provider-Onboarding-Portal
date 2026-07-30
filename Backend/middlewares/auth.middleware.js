import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded._id);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};

const isProvider = (req, res, next) => {
  if (req.user?.role !== "provider") {
    throw new ApiError(403, "Provider access required");
  }
  next();
};

export { verifyJWT, isAdmin, isProvider };