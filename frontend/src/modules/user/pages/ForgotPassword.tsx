/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { doForgotPassword } from "../api/user-api";
import { forgotPasswordSchema } from "../validations/resgister-validation";
import z from "zod";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    forgotPasswordSchema.parse({ email });
    const res = await doForgotPassword({ email });
    toast.success(res.data.message);
    navigate("/login");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      toast.error(err.issues[0].message);
    } else {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    }
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="email" className="text-white">Enter your email</Label>
            <Input
              id="email"
              type="email"
              className="bg-white/10 border-white/20 text-white placeholder-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
