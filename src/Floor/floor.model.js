// models/Floor.js
import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
    },
  },
  { _id: true } // keep _id for each unit (important)
);

const floorSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    unitName: {
      type: String,
      trim: true,
    },

    units: [unitSchema], // 🔥 embedded units
  },
  { timestamps: true }
);

const Floor = mongoose.model("Floor", floorSchema);
export default Floor;
