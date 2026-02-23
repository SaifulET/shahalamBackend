import express from "express";
import {
  getAdminsByRole,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getBlockedAdmins,
  getAdminStatistics,
} from "./AdminController.js";

const AdminRouter = express.Router();

// Get all admins by role
AdminRouter.get("/role", getAdminsByRole);

// Get blocked admins
AdminRouter.get("/blocked", getBlockedAdmins);

// Get admin by ID
AdminRouter.get("/:id", getAdminById);

// Update admin
AdminRouter.patch("/:id", updateAdmin);

// Delete admin
AdminRouter.delete("/:id", deleteAdmin);

AdminRouter.get("/get/statistics", getAdminStatistics);

export default AdminRouter;
