import Folder from "./folder.model.js";
import Project from "../Project/Project.model.js"
import mongoose from "mongoose";
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




export const getProjectsByFolderId = async (folderId) => {
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    throw new Error("Invalid folderId");
  }

  // Find folder
  const folder = await Folder.findById(folderId).select("projects");

  if (!folder) {
    const error = new Error("Folder not found");
    error.statusCode = 404;
    throw error;
  }

  // Get projects inside folder
  const projects = await Project.find({
    _id: { $in: folder.projects },
  }).sort({ createdAt: -1 });

  return {
    projects,
    total: projects.length,
  };
};

export const deleteFolderService = async (folderId) => {
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const error = new Error("Invalid folderId");
    error.statusCode = 400;
    throw error;
  }

  return await Folder.findByIdAndDelete(folderId);
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
