import { createProjectService, deleteProjectByIdWithDetailsService, getDashboardService, getProjectByIdWithDetailsService, getProjectsByUserService } from "./project.service.js";

export const createProject = async (req, res) => {
  try {
    const { userId, name, location, address } = req.body;
    let image;

      
    if (req.file) {
      image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;
    }
    
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

    const page = parseInt(req.query.page) ;
    const limit = parseInt(req.query.limit);

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







// GET project + models + floors + folders
export const getProjectByIdWithDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await getProjectByIdWithDetailsService(projectId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE project + models + floors + folders cleanup
export const deleteProjectByIdWithDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deleted = await deleteProjectByIdWithDetailsService(projectId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Project + related models + floors removed & folder references cleaned",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getCompanyDashboard = async (req, res) => {
  try {
    const { companyId } = req.params;

    const data = await getDashboardService(companyId);

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};