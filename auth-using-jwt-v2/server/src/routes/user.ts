import express, { Request } from "express";
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
import { rateLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

// Helper function to extract email from the request
const getEmailFromRequest = (req: Request) => {
  return req.body?.email;
};

// Sign up with rate limit
router.route("/signup").post(
  rateLimiter({
    allowedHits: 10,
    secondsWindow: 24 * 60 * 60, // 24 hours
    type: "ip-based",
  }),
  signUp
);

// Send OTP with rate limit
router.route("/email-verification").post(
  rateLimiter({
    allowedHits: 3,
    secondsWindow: 15 * 60, // 15 minutes
    type: "key-based",
    getKey: getEmailFromRequest,
  }),
  sendOtp
);

// Verify email with rate limit
router.route("/verify").post(
  rateLimiter({
    allowedHits: 4,
    secondsWindow: 15 * 60, // 15 minutes
    type: "key-based",
    getKey: getEmailFromRequest,
  }),
  emailVerification
);

// Login with rate limit
router.route("/login").post(
  rateLimiter({
    allowedHits: 5,
    secondsWindow: 15 * 60, // 15 minutes
    type: "ip-based",
  }),
  login
);

// Logout with rate limit
router.route("/logout").get(
  rateLimiter({
    allowedHits: 5,
    secondsWindow: 15 * 60, // 15 minutes
    type: "ip-based",
  }),
  logout
);

// Forget password with rate limit
router.route("/forgetPassword").post(
  rateLimiter({
    allowedHits: 5,
    secondsWindow: 24 * 60 * 60, // 24 hours
    type: "key-based",
    getKey: getEmailFromRequest,
  }),
  forgetPassword
);

// Reset password with rate limit
router.route("/reset-password/:token").post(
  rateLimiter({
    allowedHits: 3,
    secondsWindow: 60 * 60, // 1 hour
    type: "ip-based",
  }),
  resetPassword
);

// Get all users with rate limit
router.route("/all").get(
  authenticateUser,
  rateLimiter({
    allowedHits: 10,
    secondsWindow: 60, // 1 minute
    type: "ip-based",
  }),
  getAllUsers
);

export default router;
