import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { getMatchReport } from "../services/match-service.js";
import { MatchModel } from "../models/match-model.js";

export const matchResume = async (req, res) => {
  try {
    const resumeFile = req.files?.resume;
    const jobFile = req.files?.job;

    if (!resumeFile || !jobFile) {
      return res
        .status(400)
        .json({ message: "Both resume and job description are required." });
    }

    const uploadDir = path.resolve("upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const resumePath = path.join(uploadDir, resumeFile.name);
    const jobPath = path.join(uploadDir, jobFile.name);

    fs.writeFileSync(resumePath, resumeFile.data);
    fs.writeFileSync(jobPath, jobFile.data);

    const resumeText = (await pdfParse(resumeFile.data)).text;
    const jobText = (await pdfParse(jobFile.data)).text;

    const result = await getMatchReport(resumeText, jobText);
    console.log("Result from getMatchReport:", result);

    if (!result || typeof result !== "string" || result.trim() === "") {
      return res
        .status(500)
        .json({ message: "Invalid response from Gemini API" });
    }

    if (
      result.startsWith("AI Service Error:") ||
      result.startsWith("No response generated")
    ) {
      return res.status(500).json({ message: result });
    }

    const matchScoreMatch = result.match(/match\s*score\s*[:\-]?\s*(\d{1,3})/i);
    const matchScore = matchScoreMatch ? parseInt(matchScoreMatch[1]) : null;

    console.log("Extracted Match Score:", matchScore);

    if (matchScore === null || isNaN(matchScore)) {
      console.error("Unable to extract match score from result.");
      return res
        .status(500)
        .json({ message: "Failed to extract match score from AI response." });
    }

    await MatchModel.create({
      resumeText,
      jobText,
      result: matchScore.toString(),
    });

    const lines = result.trim().split("\n");
    const scoreLine = lines.find((line) =>
      line.toLowerCase().includes("match score")
    );
    const strengthsStart = lines.findIndex((line) =>
      line.toLowerCase().includes("strengths")
    );
    const improvementsStart = lines.findIndex((line) =>
      line.toLowerCase().includes("areas of improvement")
    );

    const score = parseInt(scoreLine?.match(/\d+/)?.[0]) || 0;
    const strengths = lines
      .slice(strengthsStart + 1, improvementsStart)
      .filter(Boolean);
    const improvements = lines.slice(improvementsStart + 1).filter(Boolean);

    res.json({
      matchScore: score,
      insights: strengths,
      suggestions: improvements,
    });
  } catch (err) {
    console.error("Error in matchResume:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
