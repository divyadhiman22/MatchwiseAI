import { Route, Routes } from "react-router-dom";

import Login from "../../modules/user/pages/Login";
import Register from "../../modules/user/pages/Register";
import Home from "@/modules/home/pages/Home";
import AddContent from "@/modules/match/pages/AddContent";
import VerifyOTP from "@/modules/user/pages/VerifyOTP";
import ForgotPassword from "@/modules/user/pages/ForgotPassword";
import ResetPassword from "@/modules/user/pages/ResetPassword";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/" element={<Home />} />
        <Route path="/add-content" element={<AddContent />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
