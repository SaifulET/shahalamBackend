import express from "express";
import {
  createFolder,
  addProjectToFolder,
  getFoldersByUserId,
  getFolderById,
  getAllFolders,
  getFolderProjects
} from "./folder.controller.js";

const FolderRouter = express.Router();

FolderRouter.post("/", createFolder); // create folder
FolderRouter.patch("/:folderId/add-project", addProjectToFolder); // add project
FolderRouter.get("/", getAllFolders); // ✅ get all
FolderRouter.get("/:folderId", getFolderById); 
FolderRouter.get("/user/:userId", getFoldersByUserId);
FolderRouter.get("/folder/project/:folderId",getFolderProjects);

export default FolderRouter;
