import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = API_BASE_URL;


export const doRegister = (userData: unknown) => {
  console.log("API_BASE_URL ", API_BASE_URL, "User Data is ", userData);
  return axios.post("register", userData);
};


export const doLogin = (userData: unknown) => {
  console.log("Login API_BASE_URL ", API_BASE_URL, "User Data is ", userData);
  return axios.post("login", userData);
};


export const doVerifyOtp = (otpData: unknown) => {
  console.log("Verify OTP API ", otpData);
  return axios.post("verify-otp", otpData);
};


export const doGoogleLogin = (data: unknown) => {
  console.log("Google Login API", data);
  return axios.post("google-login", data);
};


export const doForgotPassword = (data: unknown) => {
  console.log("Forgot Password API", data);
  return axios.post("forgot-password", data);
};


export const doResetPassword = (token: string, data: unknown) => {
  console.log("Reset Password API", { token, data });
  return axios.post(`reset-password/${token}`, data);
};
