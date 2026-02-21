import Model from "./model.model.js";

// Create
export const createModelService = async (data) => {
  return await Model.create(data);
};

// Get All
export const getAllModelsService = async (id) => {
  return await Model.find({ projectId: id });
};

// Get By ID
export const getModelByIdService = async (id) => {
  return await Model.findById(id);
};

// Update
export const updateModelService = async (id, updateData) => {
  return await Model.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
};

// Delete
export const deleteModelService = async (id) => {
  return await Model.findByIdAndDelete(id);
};
