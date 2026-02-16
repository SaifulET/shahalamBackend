import { addUnitService, createFloorService, deleteFloorService, deleteUnitService, getFloorsByProjectService, getSingleFloorService,  updateFloorNameService,  updateUnitService } from "./floor.service.js";


/* =========================================
   CREATE FLOOR
========================================= */
export const createFloor = async (req, res) => {
  try {
    console.log("Request Body:");
    const { projectId, name, unitName, units } = req.body;

    const floor = await createFloorService({
      projectId,
      name,
      unitName,
      units,
    });

    res.status(201).json({
      success: true,
      message: "Floor created successfully",
      data: floor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   GET FLOORS BY PROJECT
========================================= */
export const getFloorsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const floors = await getFloorsByProjectService(projectId);

    res.status(200).json({
      success: true,
      count: floors.length,
      data: floors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   GET SINGLE FLOOR
========================================= */
export const getSingleFloor = async (req, res) => {
  try {
    const { floorId } = req.params;

    const floor = await getSingleFloorService(floorId);

   

    res.status(200).json({
      success: true,
      data: floor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   UPDATE FLOOR
========================================= */
export const updateUnit = async (req, res) => {
  try {
    const { floorId, unitId } = req.params;

    const updateData = {};

    if (req.body.name !== undefined) {
      updateData.name = req.body.name;
    }

    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    const updatedFloor = await updateUnitService(
      floorId,
      unitId,
      updateData
    );

    if (!updatedFloor) {
      return res.status(404).json({
        success: false,
        message: "Floor or Unit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: updatedFloor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const updateFloorName = async (req, res) => {
  try {
    const { floorId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Floor name is required",
      });
    }

    const updatedFloor = await updateFloorNameService(
      floorId,
      name
    );

    if (!updatedFloor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Floor name updated successfully",
      data: updatedFloor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   DELETE FLOOR
========================================= */
export const deleteFloor = async (req, res) => {
  try {
    const { floorId } = req.params;

    const deletedFloor = await deleteFloorService(floorId);

    if (!deletedFloor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Floor deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const deleteUnit = async (req, res) => {
  try {
    const { floorId, unitId } = req.params;

    const updatedFloor = await deleteUnitService(floorId, unitId);

    if (!updatedFloor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
      data: updatedFloor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const addUnit = async (req, res) => {
  try {
    const { floorId } = req.params;
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Unit name is required",
      });
    }

    // Optional: validate status
    const validStatus = ["available", "reserved", "sold"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid unit status",
      });
    }

    const newUnit = {
      name,
      status: status || "available",
    };

    const updatedFloor = await addUnitService(floorId, newUnit);

    if (!updatedFloor) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unit added successfully",
      data: updatedFloor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};