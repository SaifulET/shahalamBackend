import {
  createRecentService,
  getRecentByUserService,
  deleteRecentService
} from "./recent.service.js";

// ✅ Create / Update Recent
export const createRecent = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    const recent = await createRecentService(userId, projectId);

    res.status(200).json({
      success: true,
      message: "Recent project saved",
      data: recent
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get Recent By User
export const getRecentByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const recents = await getRecentByUserService(userId);

    res.status(200).json({
      success: true,
      count: recents.length,
      data: recents
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Delete Recent
export const deleteRecent = async (req, res) => {
  try {
    const deleted = await deleteRecentService(req.params.recentId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Recent project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Recent project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
