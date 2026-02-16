import { createProjectService, getProjectsByUserService } from "./project.service.js";

export const createProject = async (req, res) => {
  try {
    const { userId, name, location, address, image } = req.body;

    const project = await createProjectService({
      userId,
      name,
      location,
      address,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyProjects = async (req, res) => {
  try {
    const userId = req.params.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getProjectsByUserService(
      userId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};