import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config({
  path: "./.env",
});
const app = express();

// importing middlewares
import { errorHandlerMiddleware } from "./middlewares/error-middleware.js";
import userRoutes from "./routes/user.js";

// environment variables
const port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV || "development";
const mongo_url = process.env.MONGODB_URI as string;

// packages
if (node_env === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// middlewares
app.use("/api/v1/user", userRoutes);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    const connection = await mongoose.connect(mongo_url!, {
      dbName: "Jwt_Auth",
    });
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    console.log(`DB Connected to ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

startServer();
