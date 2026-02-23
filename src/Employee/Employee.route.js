import express from "express";
import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
  getAllEmployeesByCompany,
  deleteEmployee,
  getAllBlockedEmployeesByCompany,
} from "./Employee.controller.js";
import { SingleuploadMiddleware } from "../Middleware/aws.middleware.js";


const EmployeeRouter = express.Router();

/* Company must be logged in */

EmployeeRouter.post("/",SingleuploadMiddleware,  createEmployee);

EmployeeRouter.get("/allemployee/:id",getAllEmployeesByCompany);

EmployeeRouter.get("/allblockedemployee/:id",getAllBlockedEmployeesByCompany);

EmployeeRouter.get("/:employeeId", getEmployeeById);

EmployeeRouter.patch("/:employeeId",  updateEmployee);

EmployeeRouter.delete("/:employeeId",  deleteEmployee);

export default EmployeeRouter;
