import Folder from "./folder.model.js";

// Create Folder
export const createFolderService = async (data) => {
  return await Folder.create(data);
};

// Add Project to Folder
export const addProjectToFolderService = async (folderId, projectId) => {
  return await Folder.findByIdAndUpdate(
    folderId,
    {
      $addToSet: { projects: projectId } // prevents duplicate projectId
    },
    { new: true }
  );
};







// Get All Folders
export const getAllFoldersService = async () => {
  return await Folder.find()
    .populate("projects");
};

// Get Folder By ID
export const getFolderByIdService = async (folderId) => {
  return await Folder.findById(folderId)
    .populate("projects");
};




export const getFoldersByUserIdService = async (userId) => {
  return await Folder.find({ userId })
    .populate("projects")
    .sort({ createdAt: -1 });
};