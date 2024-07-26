import express from "express";
import {
  forgetPassword,
  getAllUsers,
  login,
  resetPassword,
  signUp,
} from "../controllers/auth.js";
import { authenticateUser } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/reset-password/:token").post(resetPassword);
// testing route
router.route("/all").get(authenticateUser, getAllUsers);

export default router;
