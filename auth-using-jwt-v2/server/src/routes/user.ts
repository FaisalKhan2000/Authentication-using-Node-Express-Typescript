import express from "express";
import {
  emailVerification,
  forgetPassword,
  getAllUsers,
  login,
  logout,
  resetPassword,
  sendOtp,
  signUp,
} from "../controllers/auth.js";
import { authenticateUser } from "../middlewares/auth-middleware.js";
const router = express.Router();

// sign up
router.route("/signup").post(signUp);

// otp will be valid for 5 minutes suppose you haven't verified otp
// then request  another otp
router.route("/email-verification").post(sendOtp);

// verify email
router.route("/verify").post(emailVerification);

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgetPassword").post(forgetPassword);
router.route("/reset-password/:token").post(resetPassword);
// testing route
router.route("/all").get(authenticateUser, getAllUsers);

export default router;
