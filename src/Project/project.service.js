import Project from "./Project.model.js";

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