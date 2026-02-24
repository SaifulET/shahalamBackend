import Floor from "./floor.model.js";


/* =========================================
   CREATE FLOOR
========================================= */
export const createFloorService = async (data) => {
  try {
     
  return await Floor.create(data);
  } catch (error) {
    console.error("Error creating floor:", error);
  }
 
};

/* =========================================
   GET FLOORS BY PROJECT
========================================= */
export const getFloorsByProjectService = async (projectId) => {
  return await Floor.find({ projectId }).sort({ createdAt: -1 });
};

/* =========================================
   GET SINGLE FLOOR
========================================= */
export const getSingleFloorService = async (floorId) => {
  return await Floor.findById(floorId);
};

/* =========================================
   UPDATE FLOOR
========================================= */
export const updateUnitService = async (
  floorId,
  unitId,
  updateData
) => {

  const setData = {};

  if (updateData.name !== undefined) {
    setData["units.$.name"] = updateData.name;
  }

  if (updateData.status !== undefined) {
    setData["units.$.status"] = updateData.status;
  }

  const updatedFloor = await Floor.findOneAndUpdate(
    { _id: floorId, "units._id": unitId },
    { $set: setData },
    { new: true }
  );
  return updatedFloor;
};





export const updateFloorNameService = async (floorId, name) => {
  return await Floor.findByIdAndUpdate(
    floorId,
    { name },
    { new: true, runValidators: true }
  );
};

/* =========================================
   DELETE FLOOR
========================================= */
export const deleteFloorService = async (floorId) => {
  return await Floor.findByIdAndDelete(floorId);
};



export const deleteUnitService = async (floorId, unitId) => {
  return await Floor.findByIdAndUpdate(
    floorId,
    {
      $pull: {
        units: { _id: unitId }
      }
    },
    { new: true }
  );
};





export const addUnitService = async (floorId, unitData) => {
  // Find floor first
  const floor = await Floor.findById(floorId);
  if (!floor) {
    throw new Error("Floor not found");
  }

  // Check for duplicate unit name
  const duplicate = floor.units.find(
    (u) => u.name.toLowerCase() === unitData.name.toLowerCase()
  );
  if (duplicate) {
    throw new Error("Unit name already exists in this floor");
  }

  // Add unit
  floor.units.push(unitData);
  await floor.save(); // runValidators ensures schema validation

  return floor;
};