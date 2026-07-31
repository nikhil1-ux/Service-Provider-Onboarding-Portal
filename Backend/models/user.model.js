import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Aadhar Card", "PAN Card"
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["provider", "admin"],
      default: "provider",
    },
    refreshToken: { type: String, select: false },

    // Provider profile fields
    phone: { type: String, trim: true },
    profilePhoto: {
      url: String,
      publicId: String,
    },
    serviceCategories: [{ type: String }], // e.g. ["Plumbing", "Electrician"]
    skills: [{ type: String }],
    experienceYears: { type: Number, min: 0, default: 0 },
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    documents: [documentSchema],

    applicationStatus: {
      type: String,
      enum: ["incomplete", "pending", "approved", "rejected"],
      default: "incomplete",
    },
    rejectionRemarks: { type: String, default: "" },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
    }
  );
};


userSchema.methods.isProfileComplete = function () {
  return !!(
    this.phone &&
    this.serviceCategories?.length &&
    this.skills?.length &&
    this.location?.city &&
    this.location?.address &&
    this.profilePhoto?.url &&
    this.documents?.length
  );
};

const User = mongoose.model("User", userSchema);

export default User;