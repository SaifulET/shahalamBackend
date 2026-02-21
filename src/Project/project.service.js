import Floor from "../Floor/floor.model.js";
import Model from "../Model/model.model.js";
import Project from "./Project.model.js";
import Folder from "../Folder/folder.model.js";
import mongoose from "mongoose";
import Employee from "../Employee/Employee.model.js";
export const createProjectService = async (data) => {
  return await Project.create(data);
};


export const getProjectsByUserService = async (
  userId,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const projects = await Project.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Project.countDocuments({ userId });

  return {
    projects,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};





// Get project by ID with models, floors, folders
export const getProjectByIdWithDetailsService = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const [models, floors, folders] = await Promise.all([
    Model.find({ projectId }),
    Floor.find({ projectId }), 
    
    Folder.find({ projects: projectId }).select("name description color").lean().limit(1)
  ]);
const floorWithUnitCounts = await Floor.aggregate([
  { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },

  {
    $addFields: {
      unitCount: { $size: "$units" }
    }
  }
]);
  return {
    project,
    models,
    floors,
    folders,
    floorsCount: floors.length,
    floorWithUnitCounts
  };
};

// Delete project by ID with cleanup
export const deleteProjectByIdWithDetailsService = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  await Promise.all([
    Model.deleteMany({ projectId }),
    Floor.deleteMany({ projectId }),
    Folder.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    ),
  ]);

  await Project.findByIdAndDelete(projectId);

  return true;
};




export const getDashboardService = async (companyId) => {

  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  // 1️⃣ Get last 3 projects with unit count
  const recentProjects = await Project.aggregate([
    {
      $match: { userId: companyObjectId },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 3 },
    {
      $lookup: {
        from: "units",
        localField: "_id",
        foreignField: "project",
        as: "units",
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        unitCount: { $size: "$units" },
      },
    },
  ]);

  // 2️⃣ Total active employees
  const totalActiveEmployees = await Employee.countDocuments({
    company: companyId,
    status: "active", // assuming you store status
  });

  // 3️⃣ Total projects
  const totalProjects = await Project.countDocuments({
    userId: companyObjectId,
  });

  return {
    totalActiveEmployees,
    totalProjects,
    recentProjects,
  };
};