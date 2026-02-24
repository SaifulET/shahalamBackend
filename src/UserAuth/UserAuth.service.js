import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "./UserAuth.model.js";
import { createAccessToken, createRefreshToken } from "../Utils/token.js";
import { sendEmail } from "../Utils/mailer.js";
import EmployeeModel from "../Employee/Employee.model.js";
import mongoose from "mongoose";
import ProjectModel from "../Project/Project.model.js";

/* CREATE USER */
export const createUser = async (data) => {
  const exists = await User.findOne({ email: data.email,role: data.role });
  console.log(exists);
  if (exists) throw new Error("EMAIL_EXISTS");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return User.create({
    ...data,
    password: hashedPassword,
  });
  
};




/* LOGIN USER */
export const loginCompany = async (email, password,role) => {
  const user = await User.findOne({ email, role }).select("+password");
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("INVALID_CREDENTIALS");

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();
  return { user, accessToken, refreshToken };
};


export const loginUser = async (email, password, role) => {
  email = email.toLowerCase();

  let account;
  let companyData;
  let profileImage = null;
  let accountType;

  /* =========================
     1️⃣ TRY COMPANY LOGIN
  ========================== */
  const company = await User.findOne({ email }).select("+password");

  if (company) {
    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    if (company.status !== "active")
      throw new Error("ACCOUNT_INACTIVE");

    account = company;
    accountType = "company";
    companyData = {
      id: company._id,
      name: company.name,
      email: company.email,
      profileImage: company.profileImage || null,
    };
    profileImage = company.profileImage || null;
  }

  /* =========================
     2️⃣ TRY EMPLOYEE LOGIN
  ========================== */
  if (!account) {
    const employee = await EmployeeModel.findOne({ email })
      .select("+password")
      .populate("company");

    if (!employee) throw new Error("INVALID_CREDENTIALS");

    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    if (employee.status !== "active")
      throw new Error("ACCOUNT_BLOCKED");

    if (employee.company.status !== "active")
      throw new Error("COMPANY_INACTIVE");

    account = employee;
    accountType = "employee";
    companyData = {
      id: employee.company._id,
      name: employee.company.name,
      email: employee.company.email,
      profileImage: employee.company.profileImage || null,
    };
    profileImage = employee.profileImage || null;
  }

  /* =========================
     TOKEN
  ========================== */
  const payload = {
    id: account._id,
    companyId: companyData.id,
    type: accountType, // Add type to differentiate in token
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  
  // ✅ IMPORTANT: Save refresh token to database
  account.refreshToken = refreshToken;
  
  // If you want to track multiple sessions, you could use an array
  // account.refreshTokens = [...(account.refreshTokens || []), refreshToken].slice(-5); // Keep last 5
  
  await account.save();
  
  const jsonUserid = companyData.id.toString();
  
  const jsonUser = {
    id: jsonUserid,
    name: companyData.name, 
    email: companyData.email,
    profileImage: companyData.profileImage,
    type: accountType, // Include type in response if needed
  };

  return {
    user: jsonUser,
    accessToken,
    refreshToken,
  };
};



export const loginSuperAdmin = async (email, password,role) => {
  email = email.toLowerCase();

  let account;
  let companyData;

  /* =========================
     1️⃣ TRY COMPANY LOGIN
  ========================== */
if (role !== "superadmin") {
    throw new Error("UNAUTHORIZED");
}



  const company = await User.findOne({ email ,role: "superadmin"}).select("+password");

  if (company) {
    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    if (company.status !== "active")
      throw new Error("ACCOUNT_INACTIVE");

    account = company;
    companyData = {
      id: company._id.toString(),
      name: company.name,
      email: company.email,
      image:company.profileImage,
      phone:company.phone
    };
  }

  /* =========================
     2️⃣ TRY EMPLOYEE LOGIN
  ========================== */
  if (!account) {
    const employee = await EmployeeModel.findOne({ email })
      .select("+password")
      .populate("company");

    if (!employee) throw new Error("INVALID_CREDENTIALS");

    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    if (employee.status !== "active")
      throw new Error("ACCOUNT_BLOCKED");

    if (employee.company.status !== "active")
      throw new Error("COMPANY_INACTIVE");

    account = employee;

    companyData = {
      id: employee.company._id.toString(),
      name: employee.company.name,
      email: employee.company.email,
      phone:employee.company.phone,
      image:employee.company.profileImage
    };
  }

  /* =========================
     TOKEN
  ========================== */
  const payload = {
    id: account._id,
    companyId: companyData.id,
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  return {
    user: companyData,
    accessToken,
    refreshToken,
  };
};




/* REFRESH TOKEN */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("NO_TOKEN");

  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(payload.id).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken)
    throw new Error("FORBIDDEN");

  const accessToken = createAccessToken(user);
  
  return { user, accessToken };
};

/* LOGOUT */
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  const user = await User.findOne({ refreshToken }).select("+refreshToken");
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};






export const generateOTP = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("USER_NOT_FOUND");

  const otp = crypto.randomInt(1000, 9999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  // Send OTP via email
 await sendEmail({
  to: email,
  subject: "Password Reset Code",
  text: `Hello,\n\nYour YourApp password reset code is: ${otp}\n\nEnter this code to reset your password. The code expires in 10 minutes.\n\nIf you didn't request this, please secure your account.`,
  html: `<div style="font-family: Arial, sans-serif;">
           <h3>YourApp Password Reset</h3>
           <p>Hello,</p>
           <p>Your password reset code is:</p>
           <div style="background: #f0f0f0; padding: 15px; margin: 15px 0; font-size: 28px; font-weight: bold; text-align: center;">
             ${otp}
           </div>
           <p>Enter this code to reset your password. This code will expire in <strong>10 minutes</strong>.</p>
           <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
         </div>`,
});

  return otp; // optional, remove in production
};

/* Verify OTP */
export const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) throw new Error("USER_NOT_FOUND");

  if (user.otp !== otp) throw new Error("INVALID_OTP");
  if (user.otpExpiry < new Date()) throw new Error("OTP_EXPIRED");
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();
  return user;
};

/* Set New Password */
export const setNewPassword = async (email,  newPassword) => {

  const user = await User.findOne({ email })
  if (newPassword.length < 8) throw new Error("PASSWORD_TOO_SHORT");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};
export const setAdminNewPassword = async (email,  newPassword) => {

  const user = await User.findOne({ email,role:"superadmin" })
  if (newPassword.length < 8) throw new Error("PASSWORD_TOO_SHORT");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};





export const getUserByIdService = async (userId) => {
  return await User.findById(userId);
};



export const updateProfile = async (userId, profileData) => {
  try {
   
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: profileData },
      { new: true, runValidators: true } // return updated doc
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};





export const changePassword = async (userId, currentPassword, newPassword) => {
  // 1. Find user and include password
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found");

  // 2. Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  // 3. Hash new password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // 4. Update password
  user.password = hashedPassword;
  await user.save();

  return true;
};






export const getUserStatsService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const objectId = new mongoose.Types.ObjectId(userId);

  const [totalProjects, totalEmployees] = await Promise.all([
    ProjectModel.countDocuments({ userId: objectId }),
    EmployeeModel.countDocuments({ company: objectId }),
  ]);

  return {
    totalProjects,
    totalEmployees,
  };
};