import express from "express";
import { getAllUsers, login, signUp } from "../controllers/auth.js";
import { authenticateUser } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
// testing route
router.route("/all").get(authenticateUser, getAllUsers);

export default router;
