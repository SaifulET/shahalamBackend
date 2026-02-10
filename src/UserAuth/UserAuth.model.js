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
      sparse: true, // allow multiple null values
    },

    /* AUTH */
    password: {
      type: String,
      required: true,
      select: false, // 🔐 never expose
    },

    /* PROFILE */
    profileImage: {
      type: String, // image URL (S3, Cloudinary, etc.)
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    website: {
      type: String,
      trim: true,
    },

    instagramLink: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    /* SYSTEM */
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    refreshToken: {
      type: String,
      select: false,
    },
    otp: { type: String, select: false },
    
    otpExpiry: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
