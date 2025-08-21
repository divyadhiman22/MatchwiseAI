import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getMatchReport = async (resumeText, jobText) => {
const prompt = `
You are an expert technical recruiter.

Compare the RESUME and JOB DESCRIPTION provided below and give a structured comparison in this exact format:

Match Score: <score out of 100>
Strengths (only three points):
- <very short point 1>
- <very short point 2>
- <very short point 3>

Areas of Improvement(onlt three points):
- <very short point 1>
- <very short point 2>
- <very short point 3>

Rules:
- Use only bullet points.
- Keep each bullet point under 1 line.
- Do NOT use any markdown (** or *).
- Be concise and to the point.
-provide only three points for each section not more than that

RESUME:
${resumeText?.toString().trim()}

JOB DESCRIPTION:
${jobText?.toString().trim()}
`;


  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || text.trim() === '') {
      console.error('Gemini returned empty response:', response.data);
      return 'No response generated from AI';
    }

  
    text = text
      .replace(/\*\*/g, '') 
      .replace(/\*/g, '') 
      .replace(/#+\s*/g, '') 

    return text.trim();
  } catch (err) {
    console.error('Gemini API Error:', err?.response?.data || err.message);
    return `AI Service Error: ${err?.response?.data?.error?.message || err.message}`;
  }
};
