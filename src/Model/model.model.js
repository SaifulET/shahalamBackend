// models/Model.js
import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    name: { type: String, required: true },
    area: { type: Number },
    face: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Model", modelSchema);
