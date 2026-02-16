import express from "express";
import {
  createRecent,
  getRecentByUser,
  deleteRecent
} from "./recent.controller.js";

const RecentRouter = express.Router();

RecentRouter.post("/", createRecent); // add recent
RecentRouter.get("/user/:userId", getRecentByUser); // get by user
RecentRouter.delete("/:recentId", deleteRecent); // delete recent

export default RecentRouter ;
