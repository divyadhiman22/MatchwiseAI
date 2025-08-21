/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { loginSchema, type LoginSchema } from "../validations/resgister-validation";
import { doLogin, doGoogleLogin } from "../api/user-api";

import { auth, provider, signInWithPopup } from "@/firebase";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });


  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await doLogin(data);
      const { token, role, message } = res.data;

      if (!token || !role || !message) throw new Error("Invalid email or password");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setSuccessMessage(message);
      setServerError("");
      reset();
      window.dispatchEvent(new Event("storage"));
      toast.success(message);
      navigate("/");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setServerError(errorMsg);
      setSuccessMessage("");
      toast.error(errorMsg);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const res = await doGoogleLogin({ idToken: token });
      const { token: jwtToken, message } = res.data;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("role", "user");
      toast.success(message);
      navigate("/");
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error("Google Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="text" {...register("email")} className="bg-white/10 border-white/20 text-white placeholder-white" />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="bg-white/10 border-white/20 text-white placeholder-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white focus:outline-none"
              >
                {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && <p className="text-sm text-red-400">{serverError}</p>}
            {successMessage && <p className="text-sm text-green-400">{successMessage}</p>}

            <Link to="/forgot-password" className="text-sm text-pink-300 underline hover:text-pink-400">
              Forgot Password?
            </Link>

            <Button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white">
              Login
            </Button>
          </form>

          <h1 className="text-center text-white my-4">or</h1>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium shadow-sm transition hover:bg-gray-50 hover:shadow-md active:scale-95"
          >
            <FcGoogle size={22} />
            Continue with Google
          </Button>

          <p className="text-sm text-white text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-300 underline hover:text-pink-400">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
