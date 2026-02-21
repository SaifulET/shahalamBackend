import Recent from "./recent.model.js";

// ✅ Create or Update Recent Project
export const createRecentService = async (userId, projectId) => {
  return await Recent.findOneAndUpdate(
    { userId, projectId },
    { viewedAt: new Date() },
    { new: true, upsert: true } // create if not exists
  );
};

// ✅ Get Recent Projects By UserId
export const getRecentByUserService = async (userId) => {
  return await Recent.find({ userId })
    .populate("projectId")
    .sort({ viewedAt: -1 });
};

// ✅ Delete Recent Project
export const deleteRecentService = async (recentId) => {
  return await Recent.findByIdAndDelete(recentId);
};
