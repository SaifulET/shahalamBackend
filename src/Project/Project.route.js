import express from "express";
import { createProject, deleteProjectByIdWithDetails, getProjectByIdWithDetails } from "./Project.controller.js";
import { getMyProjects } from "./Project.controller.js";


const ProjectRouter = express.Router();

ProjectRouter.post("/",createProject);
ProjectRouter.get("/my-projects/:userId", getMyProjects);

ProjectRouter.get("/:projectId", getProjectByIdWithDetails);
ProjectRouter.delete("/:projectId", deleteProjectByIdWithDetails);

export default ProjectRouter;
