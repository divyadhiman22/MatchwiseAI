/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { doVerifyOtp } from "../api/user-api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email, name, password } = (location.state as { email?: string; name?: string; password?: string }) || {};

  if (!email || !name || !password) {
    navigate("/register");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await doVerifyOtp({ email, otp, name, password }); 

      if (res.data.success) {
        toast.success("Registration successful");
        setServerError("");
        navigate("/login");
      } else {
        const errorMsg = res.data.error || "Invalid OTP";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 px-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardContent className="p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Verify OTP</h2>
          <p className="mb-4">
            Enter the OTP sent to <strong>{email}</strong>
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="otp" className="text-white">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className="bg-white/10 border-white/20 text-white placeholder-white"
              />
            </div>

            {serverError && (
              <p className="text-sm text-red-400 text-center">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
            >
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
