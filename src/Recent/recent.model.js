// models/Recent.js
import mongoose from "mongoose";

const recentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }
);

recentSchema.index({ userId: 1, viewedAt: -1 });

export default mongoose.model("Recent", recentSchema);
