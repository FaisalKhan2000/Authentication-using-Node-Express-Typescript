import "http-status-codes";
import express from "express";
const app = express();

// routes
import authRoute from "./routes/auth.js";
import { errorMiddleware } from "./middlewares/error.js";

app.use("/api/v1/auth", authRoute);

// error middleware
app.use(errorMiddleware);

const port = 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
