// import { UserModel } from "../models/user-model.js";
// import { compareHash, encryptPassword } from "../utils/services/password-hash.js";
// import { generateToken } from "../utils/services/token.js";

// export const register = async (userObject)=>{
//     try{
//         userObject.password = encryptPassword(userObject.password);
//     const doc = await UserModel.create(userObject);
//     if(doc && doc._id){
//         return "User Register SuccessFully";
//     }
// }
// catch(err){
//     throw err;
// }
// }
// export const login = async (userObject)=>{
//    try{
//     const doc =  await UserModel.findOne({email:userObject.email}).exec();
//    if(doc && doc.email){
//         if(compareHash(userObject.password, doc.password)){
//             const token = generateToken(doc.email);
//             return {message:"Welcome "+doc.name,role:doc.role, token : token};
//         }
//         else{
//             return {message:"Invalid Email or Password"};
//         }
//    }
//    else{
//          return "Invalid Email or Password";
//    }
// }
// catch(err){
//     throw new Error("Invalid User Credentials");
// }
// }


// *******************************************************************************
import { UserModel } from "../models/user-model.js";
import { compareHash, encryptPassword } from "../utils/services/password-hash.js";
import { generateToken } from "../utils/services/token.js";
import OTPModel from "../models/otp-model.js";
import sendOTP from "../utils/services/sendOTP.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import admin from "../firebase-config.js";

const auth = admin.auth();

//___________________________
// REGISTER
//___________________________
export const register = async (userObject) => {
  try {
    // check if email already exists
    const existing = await UserModel.findOne({ email: userObject.email }).exec();
    if (existing) {
      throw new Error("Email already exists");
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTPModel.create({ email: userObject.email, otp });
    await sendOTP(userObject.email, otp);

    return "OTP sent to your email";
  } catch (err) {
    throw err;
  }
};

//___________________________
// VERIFY OTP
//___________________________
export const verifyOTP = async ({ email, otp, name, password }) => {
  try {
    const validOTP = await OTPModel.findOne({ email, otp });
    if (!validOTP) {
      throw new Error("Invalid or expired OTP");
    }

    // Hash password
    const encryptedPass = await encryptPassword(password);

    // ✅ Use correct fields
    const userDoc = await UserModel.create({
      name,          // from request
      email,
      password: encryptedPass,
      role: "user",
    });

    // Delete OTP after success
    await OTPModel.deleteOne({ email });

    return {
      success: true,
      message: "Registration successful",
      token: generateToken(userDoc.email),
      userId: userDoc._id.toString(),
    };
  } catch (err) {
    throw err;
  }
};


//___________________________
// LOGIN
//___________________________
export const login = async (userObject) => {
  try {
    const doc = await UserModel.findOne({ email: userObject.email }).exec();
    if (doc && doc.email) {
      if (compareHash(userObject.password, doc.password)) {
        const token = generateToken(doc.email);
        return { message: "Welcome " + doc.name, role: doc.role, token };
      } else {
        return { message: "Invalid Email or Password" };
      }
    } else {
      return { message: "Invalid Email or Password" };
    }
  } catch (err) {
    throw new Error("Invalid User Credentials");
  }
};

//___________________________
// GOOGLE LOGIN
//___________________________
export const googleLogin = async ({ idToken }) => {
  try {
    if (!idToken) {
      throw new Error("No ID token provided");
    }

    const decoded = await auth.verifyIdToken(idToken);
    const { email, name } = decoded;

    if (!email || !name) {
      throw new Error("Invalid Firebase token");
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        role: "user",
        isGoogleUser: true,
      });
    }

    const token = generateToken(user.email);

    return {
      message: "Google login successful",
      token,
      userId: user._id.toString(),
    };
  } catch (err) {
    throw err;
  }
};

//___________________________
// FORGOT PASSWORD
//___________________________
export const forgotPassword = async ({ email }) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"MatchwiseAI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { message: "Password reset email sent successfully" };
  } catch (err) {
    throw err;
  }
};

//___________________________
// RESET PASSWORD
//___________________________
export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found or token expired");
    }

    user.password = encryptPassword(newPassword);
    await user.save();

    return { message: "Password reset successful" };
  } catch (err) {
    throw err;
  }
};

