/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-toastify";
import { useState } from "react";
import { matchResumeAndJD } from "../api/match-api";
import { BadgeCheck, AlertCircle } from "lucide-react";

export const AddContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resumeSelected, setResumeSelected] = useState(false);
  const [jobSelected, setJobSelected] = useState(false);

  const onSubmit = async (data: any) => {
    const resumeFile = data.resume?.[0];
    const jobFile = data.job?.[0];

    if (!resumeFile || !jobFile) {
      toast.error("Both Resume and Job PDFs are required.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024 || jobFile.size > 5 * 1024 * 1024) {
      toast.error("Each file must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job", jobFile);

    try {
      setLoading(true);

      const response = await matchResumeAndJD(formData);
      const { matchScore, insights, suggestions } = response.data;

      setMatchScore(typeof matchScore === "number" ? matchScore : 0);
      setInsights(Array.isArray(insights) ? insights : []);
      setSuggestions(Array.isArray(suggestions) ? suggestions : []);

      toast.success("Match analyzed successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error uploading match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <Card className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="text-center text-white">
          <CardTitle className="text-3xl font-bold">
            Resume Match Analysis
          </CardTitle>
          <p className="text-sm text-white/70 mt-1">
            Upload your resume and job description for an AI-powered analysis
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`rounded-xl border-2 border-dashed p-6 text-white transition duration-300 ${
                  resumeSelected
                    ? "bg-green-400/10 border-green-300"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <h4 className="text-lg font-semibold mb-2">Resume (PDF)</h4>
                <p className="text-sm text-white/70 mb-2">
                  Upload your resume file
                </p>
                <Input
                  {...register("resume", { required: true })}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeSelected(!!e.target.files?.[0])}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.resume && (
                  <span className="text-red-400 text-sm mt-2 block">
                    Resume is required
                  </span>
                )}
              </div>

              <div
                className={`rounded-xl border-2 border-dashed p-6 text-white transition duration-300 ${
                  jobSelected
                    ? "bg-green-400/10 border-green-300"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <h4 className="text-lg font-semibold mb-2">
                  Job Description (PDF)
                </h4>
                <p className="text-sm text-white/70 mb-2">
                  Upload the job description
                </p>
                <Input
                  {...register("job", { required: true })}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setJobSelected(!!e.target.files?.[0])}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.job && (
                  <span className="text-red-400 text-sm mt-2 block">
                    Job description is required
                  </span>
                )}
              </div>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-48 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold"
              >
                {loading ? "Analyzing..." : "Analyze Match"}
              </Button>
            </div>
          </form>

          {matchScore !== null && (
            <div className="mt-10 bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10 text-white">
              <h4 className="text-xl font-semibold text-center mb-4">
                Match Score
              </h4>

              <div className="text-center text-5xl font-bold text-yellow-400">
                {matchScore}%
              </div>
              <p className="text-center text-base mt-2">
                {matchScore >= 70 ? (
                  <span className="text-green-400">Great Match!</span>
                ) : (
                  <span className="text-red-400">Needs Improvement</span>
                )}
              </p>

              <Progress value={matchScore} className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
                  <h5 className="flex items-center gap-2 text-green-300 font-semibold mb-2">
                    <BadgeCheck className="w-5 h-5" />
                    Key Insights
                  </h5>
                  {insights.length ? (
                    <ul className="list-disc list-inside text-sm text-white/90 space-y-1">
                      {insights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/70">No insights found.</p>
                  )}
                </div>

                <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
                  <h5 className="flex items-center gap-2 text-yellow-300 font-semibold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Suggestions
                  </h5>
                  {suggestions.length ? (
                    <ul className="list-disc list-inside text-sm text-white/90 space-y-1">
                      {suggestions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/70">
                      No suggestions found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddContent;
