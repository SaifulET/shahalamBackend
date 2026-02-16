import express from "express";
import {
  addUnit,
  createFloor,
  deleteFloor,
  deleteUnit,
  getFloorsByProject,
  getSingleFloor,
 
  updateFloorName,
 
  updateUnit,
} from "./floor.controller.js";


const FloorRouter = express.Router();

// Create
FloorRouter.post("/", createFloor);

// Read
FloorRouter.get("/project/:projectId", getFloorsByProject);

FloorRouter.get("/:floorId", getSingleFloor);

// Update
FloorRouter.patch("/:floorId/:unitId", updateUnit);



FloorRouter.patch("/:floorId", updateFloorName);

FloorRouter.post("/:floorId/unit", addUnit);


// Delete floor
FloorRouter.delete("/:floorId", deleteFloor);



FloorRouter.delete("/:floorId/:unitId", deleteUnit);


export default FloorRouter;
