import express from "express";
import { createProject, createProjectAndAddtoFolder, deleteProjectByIdWithDetails, editProjectNameController, getCompanyDashboard, getProjectByIdWithDetails } from "./Project.controller.js";
import { getMyProjects } from "./Project.controller.js";
import { SingleuploadMiddleware } from "../Middleware/aws.middleware.js";


const ProjectRouter = express.Router();

ProjectRouter.post("/",SingleuploadMiddleware,createProject);
ProjectRouter.post("/createproject/addtoFolder/",SingleuploadMiddleware,createProjectAndAddtoFolder);

ProjectRouter.get("/my-projects/:userId", getMyProjects);
ProjectRouter.patch("/update/projectname/project", editProjectNameController);


ProjectRouter.get("/:projectId", getProjectByIdWithDetails);
ProjectRouter.delete("/:projectId", deleteProjectByIdWithDetails);
ProjectRouter.get("/dashboard/:companyId", getCompanyDashboard);

export default ProjectRouter;
