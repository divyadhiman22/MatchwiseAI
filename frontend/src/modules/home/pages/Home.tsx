import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BadgeCheck,
  Sparkle,
  CheckCircle,
  Rocket,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleUploadClick = () => {
    navigate(isLoggedIn ? "/add-content" : "/login");
  };

  const features = [
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Smart Matching",
      description:
        "Get a compatibility score between your resume and job description.",
    },
    {
      icon: <BadgeCheck className="h-8 w-8" />,
      title: "Actionable Feedback",
      description:
        "Receive clear insights and suggestions to improve your resume impact.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white">
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-pink-300 border-pink-400/30 hover:bg-white/20 backdrop-blur-sm">
            <Sparkle className="h-4 w-4 mr-2" />
            AI-powered Matching Engine
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Power Your Career with{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              MATCHWISE AI
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Upload your resume and job description to receive AI-powered match
            analysis, insights, and improvement suggestions in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Upload Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Why Choose MATCHWISE AI
            </h3>
            <p className="text-lg text-white/80">
              Let the power of AI elevate your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-pink-500/20"
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center text-pink-300 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="h-6 w-6 text-pink-400 mr-2" />
            <span className="text-xl font-bold text-white">MATCHWISE AI</span>
          </div>
          <p className="text-white/60">
            © {new Date().getFullYear()} MATCHWISE AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
