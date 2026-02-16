import express from "express";
import {
  createModel,
  getAllModels,
  getModelById,
  updateModel,
  deleteModel
} from "./model.controller.js";

const modelRouter = express.Router();

modelRouter.post("/", createModel);
modelRouter.get("/:projectid", getAllModels);
modelRouter.get("/model/:id", getModelById);
modelRouter.patch("/:id", updateModel);
modelRouter.delete("/:id", deleteModel);

export default modelRouter;
