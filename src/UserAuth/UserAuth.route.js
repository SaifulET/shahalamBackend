import express from "express";
import {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  verifyOtpController,
  setNewPasswordController,
  getUserById,
  editProfile,
  loginCompanyController,
} from "./UserAuth.controller.js";

const Authrouter = express.Router();

Authrouter.post("/signup", signup);
  Authrouter.post("/login", login);
  Authrouter.post("/login-company", loginCompanyController);
  
Authrouter.post("/refresh", refresh);
Authrouter.post("/logout", logout);
Authrouter.post("/forgot-password", forgotPassword);
Authrouter.post("/verify-otp", verifyOtpController);
Authrouter.post("/set-new-password", setNewPasswordController);



Authrouter.get("/:userId", getUserById);
Authrouter.patch("/:userId", editProfile);

export default Authrouter;
