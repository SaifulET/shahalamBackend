import {
  getAdminsByRoleService,
  getAdminByIdService,
  updateAdminService,
  deleteAdminService,
  getBlockedAdminsService,
  getAdminStatisticsService,
} from "./AdminService.js";

// 1️⃣ Get all admins by role
export const getAdminsByRole = async (req, res) => {
  try {
   

    const admins = await getAdminsByRoleService();

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Get specific admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await getAdminByIdService(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3️⃣ Update admin by ID
export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await updateAdminService(
      req.params.id,
      req.body
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4️⃣ Delete admin by ID
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await deleteAdminService(req.params.id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5️⃣ Get all blocked admins
export const getBlockedAdmins = async (req, res) => {
  try {
    const admins = await getBlockedAdminsService();

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAdminStatistics = async (req, res) => {
  try {
   
    const stats = await getAdminStatisticsService();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
   
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};