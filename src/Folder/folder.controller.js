import {
  createFolderService,
  addProjectToFolderService,
  getFoldersByUserIdService,
  getFolderByIdService,
  getAllFoldersService
} from "./folder.service.js";

// ✅ Create Folder
export const createFolder = async (req, res) => {
  try {
    const { userId, name, description, color } = req.body;

    const folder = await createFolderService({
      userId,
      name,
      description,
      color
    });

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: folder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Add Project to Folder
export const addProjectToFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { projectId } = req.body;

    const updatedFolder = await addProjectToFolderService(
      folderId,
      projectId
    );

    if (!updatedFolder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project added to folder successfully",
      data: updatedFolder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};







// ✅ Get All Folders
export const getAllFolders = async (req, res) => {
  try {
    const folders = await getAllFoldersService();

    res.status(200).json({
      success: true,
      count: folders.length,
      data: folders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get Single Folder
export const getFolderById = async (req, res) => {
  try {
    const folder = await getFolderByIdService(req.params.folderId);

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found"
      });
    }

    res.status(200).json({
      success: true,
      data: folder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};









export const getFoldersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const folders = await getFoldersByUserIdService(userId);

    res.status(200).json({
      success: true,
      count: folders.length,
      data: folders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};