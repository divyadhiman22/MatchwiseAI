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

import { registerSchema, type RegisterSchema } from "../validations/resgister-validation";
import { doRegister } from "../api/user-api";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Register() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await doRegister(data);

      if (res.data.success) {
        toast.success("OTP sent to your email");
        setServerError("");
        reset();

        navigate("/verify-otp", { state: { email: data.email, name: data.name, password: data.password } });
      } else {
        const errorMsg = res.data.error || "Registration failed";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Create an Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-white/10 border-white/20 text-white placeholder-white"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-white/10 border-white/20 text-white placeholder-white"
              />
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
                className="absolute right-3 top-9 text-white"
              >
                {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-400 text-center">{serverError}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
            >
              Register
            </Button>
          </form>

          <p className="text-sm text-white text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-300 underline hover:text-pink-400">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
