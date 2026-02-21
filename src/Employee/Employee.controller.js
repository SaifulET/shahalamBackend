import {
  createEmployeeService,
  updateEmployeeService,
  getEmployeeByIdService,
  getAllEmployeesByCompanyService,
  deleteEmployeeService,
  getAllBlockedEmployeesByCompanyService,
} from "./Employee.service.js";

/* ==============================
   CREATE
============================== */
export const createEmployee = async (req, res) => {
  try {
    console.log("Creating employee with data:", req.body); // Debug log
    const employee = await createEmployeeService(
      req.body.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   UPDATE
============================== */
export const updateEmployee = async (req, res) => {
  try {
    console.log("Updating employee with ID:", req.params.employeeId); // Debug log
    console.log("Update data:", req.body); // Debug log
    const employee = await updateEmployeeService(
      req.params.employeeId,
      req.body
    );

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   GET BY ID
============================== */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await getEmployeeByIdService(
      req.params.employeeId
    );

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   GET ALL
============================== */
export const getAllEmployeesByCompany = async (
  req,
  res
) => {
  try {
    const employees =
      await getAllEmployeesByCompanyService(
        req.params.id
      );

    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllBlockedEmployeesByCompany = async (
  req,
  res
) => {
  try {
    const employees = await getAllBlockedEmployeesByCompanyService(
      req.params.id
    );
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ==============================
   DELETE
============================== */
export const deleteEmployee = async (req, res) => {
  try {
    await deleteEmployeeService(
      req.user.id,
      req.params.employeeId
    );

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
