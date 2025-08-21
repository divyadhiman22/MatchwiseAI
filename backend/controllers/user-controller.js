import { 
    register as registerUser, 
    login as loginUser,
    verifyOTP as verifyOTPService,
    googleLogin as googleLoginService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService
} from "../services/user-service.js";


export const home = async (req, res) => {
    try {
        res.status(200).send("Welcome Divya");
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


export const register = async (req, res) => {
    const userObject = req.body;
    try {
        const message = await registerUser(userObject);
        res.status(200).json({ success:true, message });
    } catch (err) {
        const statusCode = err.statusCode || 500;

        res.status(statusCode).json({
            success:false,
            error: true,
            message: err.message || "Something went wrong during registration"
        });
    }
};



export const login = async (req, res) => {
    const userObject = req.body;
    try {
        const obj = await loginUser(userObject);
        res.status(200).json(obj);
    } catch (err) {
        res.status(500).json({ message: "Login Fail, Server Crash..." });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const result = await verifyOTPService(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "OTP Verification Failed" });
    }
};


export const googleLogin = async (req, res) => {
    try {
        const result = await googleLoginService(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Google Login Failed" });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const result = await forgotPasswordService(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Forgot Password Failed" });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const result = await resetPasswordService(token, newPassword);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};


export const profile = (req, res) => {
    res.json({ message: "Profile" });
};

