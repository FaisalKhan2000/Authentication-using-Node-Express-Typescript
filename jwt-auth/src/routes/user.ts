import express from "express";
import { getAllUsers, login, register } from "../controllers/user.js";
import { authenticateUser } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
// testing route
router.route("/all").get(authenticateUser, getAllUsers);

export default router;
