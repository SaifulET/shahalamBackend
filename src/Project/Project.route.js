import express from "express";
import { createProject, deleteProjectByIdWithDetails, getCompanyDashboard, getProjectByIdWithDetails } from "./Project.controller.js";
import { getMyProjects } from "./Project.controller.js";


const ProjectRouter = express.Router();

ProjectRouter.post("/",createProject);
ProjectRouter.get("/my-projects/:userId", getMyProjects);

ProjectRouter.get("/:projectId", getProjectByIdWithDetails);
ProjectRouter.delete("/:projectId", deleteProjectByIdWithDetails);
ProjectRouter.get("/dashboard/:companyId", getCompanyDashboard);

export default ProjectRouter;
