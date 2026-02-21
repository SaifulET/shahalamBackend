import bcrypt from "bcryptjs";
import EmployeeModel from "./Employee.model.js";

/* ==============================
   CREATE EMPLOYEE
============================== */
export const createEmployeeService = async (companyId, data) => {
  const { name, email, password, phone } = data;

  const existing = await EmployeeModel.findOne({
    company: companyId,
    email: email.toLowerCase(),
  });

  if (existing) {
    throw new Error("Employee already exists in this company");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const employee = await EmployeeModel.create({
    company: companyId,
    name,
    email,
    password: hashedPassword,
    phone,
  });

  return employee;
};

/* ==============================
   UPDATE EMPLOYEE
============================== */
export const updateEmployeeService = async (
  employeeId,
  data
) => {
  const employee = await EmployeeModel.findOne({
    _id: employeeId,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(employee, data);

  await employee.save();

  return employee;
};

/* ==============================
   GET EMPLOYEE BY ID
============================== */
export const getEmployeeByIdService = async (
  employeeId
) => {
  const employee = await EmployeeModel.findOne({
     _id:employeeId
    
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

/* ==============================
   GET ALL EMPLOYEES BY COMPANY
============================== */
export const getAllEmployeesByCompanyService = async (
  companyId
) => {
  return await EmployeeModel.find({ company: companyId });
};


export const getAllBlockedEmployeesByCompanyService = async (
  companyId
) => {
  return await EmployeeModel.find({ company: companyId,status:"blocked" });
};
/* ==============================
   DELETE EMPLOYEE
============================== */
export const deleteEmployeeService = async (
  companyId,
  employeeId
) => {
  const employee = await EmployeeModel.findOneAndDelete({
    _id: employeeId,
    company: companyId,
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};
