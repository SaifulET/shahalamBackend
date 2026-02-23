import User from "../UserAuth/UserAuth.model.js";


// 1️⃣ Get all admins by role
export const getAdminsByRoleService = async () => {
  return await User.find({ role:"admin" });
};

// 2️⃣ Get admin by ID
export const getAdminByIdService = async (id) => {
  return await User.findOne({
    _id: id,
    role: { $in: ["admin", "superadmin"] },
  });
};

// 3️⃣ Update admin by ID
export const updateAdminService = async (id, updateData) => {
  return await User.findOneAndUpdate(
    { _id: id, role: "admin" },
    updateData,
    { new: true, runValidators: true }
  );
};

// 4️⃣ Delete admin by ID
export const deleteAdminService = async (id) => {
  return await User.findOneAndDelete({
    _id: id,
    role: { $in: ["admin", "superadmin"] },
  });
};

// 5️⃣ Get all blocked admins
export const getBlockedAdminsService = async () => {
  return await User.find({
    role: { $in: ["admin", "superadmin"] },
    status: "blocked",
  });
};


export const getAdminStatisticsService = async () => {
  const totalAdmins = await User.countDocuments({
    role:"admin",
  });

  const totalActiveAdmins = await User.countDocuments({
    role: "admin",
    status: "active",
  });

  return {
    totalAdmins,
    totalActiveAdmins,
  };
};
