import express from "express";
import { 
    home,
    register, 
    login, 
    profile, 
    verifyOTP, 
    googleLogin, 
    forgotPassword, 
    resetPassword 
} from "../controllers/user-controller.js"; 

const router = express.Router();

router.get("/", home);

router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);

router.post("/verify-otp", verifyOTP);

router.post("/google-login", googleLogin);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

