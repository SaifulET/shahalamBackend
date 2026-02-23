import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import cookieParser from "cookie-parser";

import mongoose from "mongoose";
import Authrouter from "./UserAuth/UserAuth.route.js";
import FloorRouter from "./Floor/floor.route.js";
import ProjectRouter from "./Project/Project.route.js";
import modelRouter from "./Model/model.route.js";
import FolderRouter from "./Folder/folder.route.js";
import RecentRouter from "./Recent/recent.route.js";
import EmployeeRouter from "./Employee/Employee.route.js";
import AdminRouter from "./Admin/AdminRoute.js";






const app = express();


// Middlewares

const allowedOrigins = [
  "*",
  "http://localhost:3000",

  "http://localhost:5173",
  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow the request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req, res) => {
 res.send("hellow");

});
app.use("/auth",Authrouter);
app.use("/floors",FloorRouter);
app.use("/projects",ProjectRouter);
app.use("/models",modelRouter);
app.use("/folders",FolderRouter);
app.use("/recents",RecentRouter);
app.use("/employees",EmployeeRouter);
app.use("/admins",AdminRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);