import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { OK } from "./constants/http";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/health", (req, res, next) => {
  return res.status(OK).json({
    status: "healthy",
  });
});

// auth routes
app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`server is running on ${PORT} in ${NODE_ENV} environment.`);

  await connectToDatabase();
});
