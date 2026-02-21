// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: { type: String, required: true },
    location: String,
    address: String,
    image: String
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
