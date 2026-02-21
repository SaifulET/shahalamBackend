import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    /* AUTH */
    password: {
      type: String,
      required: true,
      select: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiry: {
      type: Date,
      select: false,
    },

    /* PROFILE */
    profileImage: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    instagramLink: {
      type: String,
      trim: true,
    },

    /* ADDRESS INFO */
    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    postalCode: {
      type: String,
      trim: true,
      maxlength: 20,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    /* SYSTEM */
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
      index: true,
    },

    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
