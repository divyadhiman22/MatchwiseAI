/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { doResetPassword } from "../api/user-api";
import { resetPasswordSchema } from "../validations/resgister-validation";
import z from "zod";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    resetPasswordSchema.parse({ newPassword });
    const res = await doResetPassword(token!, { newPassword });
    toast.success(res.data.message);
    navigate("/login");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      toast.error(err.issues[0].message);
    } else {
      toast.error(err.response?.data?.message || "Password reset failed");
    }
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="password" className="text-white">New Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-white/10 border-white/20 text-white placeholder-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
