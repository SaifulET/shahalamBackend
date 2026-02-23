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
  changePasswordController,
  loginAdmin,
} from "./UserAuth.controller.js";
import { SingleuploadMiddleware } from "../Middleware/aws.middleware.js";

const Authrouter = express.Router();

Authrouter.post("/signup",SingleuploadMiddleware, signup);
  Authrouter.post("/login", login);
  Authrouter.post("/superadmin-login", loginAdmin);

  Authrouter.post("/login-company", loginCompanyController);
  
Authrouter.post("/refresh", refresh);
Authrouter.post("/logout", logout);
Authrouter.post("/forgot-password", forgotPassword);
Authrouter.post("/verify-otp", verifyOtpController);
Authrouter.post("/set-new-password", setNewPasswordController);


Authrouter.patch("/change-password", changePasswordController);



Authrouter.get("/:userId", getUserById);
Authrouter.patch("/:userId",SingleuploadMiddleware, editProfile);

export default Authrouter;
