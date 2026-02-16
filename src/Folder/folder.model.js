// models/Folder.js
import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: { type: String, required: true },
    description: String,
    color: String,
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Folder", folderSchema);
