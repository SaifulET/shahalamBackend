import express from "express";
import { createProject } from "./Project.controller.js";
import { getMyProjects } from "./Project.controller.js";


const ProjectRouter = express.Router();

ProjectRouter.post("/",createProject);
ProjectRouter.get("/my-projects/:userId", getMyProjects);

export default ProjectRouter;
