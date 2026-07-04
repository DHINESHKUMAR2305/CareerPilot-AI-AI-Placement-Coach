import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: (process.env.GROQ_API_KEY || '').trim()
});

// Helper to handle JSON generation via Groq
const generateJson = async (prompt) => {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant that outputs only valid JSON. The output MUST be a JSON object." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile", // Fast and free model
    temperature: 0.5,
    response_format: { type: "json_object" }
  });
  return JSON.parse(completion.choices[0].message.content);
};

const generateText = async (prompt) => {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });
  return completion.choices[0].message.content;
};

export const analyzeResume = async (resumeText, role) => {
  const prompt = `
    You are an expert AI Resume Analyzer for the role of ${role}.
    Analyze the following resume text and provide a comprehensive evaluation.
    
    Resume Text:
    ${resumeText}
    
    Please provide the output STRICTLY in the following JSON format without any other text:
    {
      "score": <number between 0 and 100>,
      "matchPercentage": <number between 0 and 100>,
      "strongSkills": ["skill1", "skill2"],
      "missingSkills": ["skill1", "skill2"],
      "missingSections": ["section1", "section2"],
      "positivePoints": ["point1", "point2"],
      "areasToImprove": ["area1", "area2"],
      "aiSuggestions": ["suggestion1", "suggestion2"],
      "learningRecommendations": ["rec1", "rec2"]
    }
  `;

  try {
    return await generateJson(prompt);
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to analyze resume");
  }
};

export const generateMockInterviewQuestion = async (role, difficulty, previousQuestions = []) => {
  const prompt = `
    You are an expert Technical Interviewer for the role of ${role}.
    The difficulty level is ${difficulty}.
    Previous questions asked: ${JSON.stringify(previousQuestions)}.
    
    Please generate ONE new, relevant interview question. Make sure it is different from the previous questions.
    The question MUST be simple, easy to understand, and a very important foundational concept for this role.
    Keep the question very short, preferably a simple one-liner.
    Return ONLY the question string, nothing else.
  `;

  try {
    const text = await generateText(prompt);
    return text.trim();
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to generate question");
  }
};

export const evaluateMockInterviewAnswer = async (role, question, answer) => {
  const prompt = `
    You are an expert Technical Interviewer for the role of ${role}.
    Evaluate the following user answer to the interview question.
    
    Question: ${question}
    User Answer: ${answer}
    
    Provide your evaluation STRICTLY in the following JSON format without any other text:
    {
      "technicalAccuracy": "Feedback on technical accuracy",
      "communication": "Feedback on communication skills",
      "confidence": "Feedback on perceived confidence (based on text phrasing)",
      "grammar": "Feedback on grammar",
      "score": <number between 0 and 10>,
      "correctAnswer": "A brief correct answer",
      "betterAnswer": "How the user could improve their specific answer. You MUST provide the correct definition with a simple real-time example here.",
      "suggestions": "Overall suggestions for improvement"
    }
  `;

  try {
    return await generateJson(prompt);
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to evaluate answer");
  }
};

export const generateMCQs = async (topic, difficulty, numQuestions = 20) => {
  const prompt = `
    You are an expert technical evaluator. Generate ${numQuestions} multiple choice questions (MCQs) for the topic of ${topic} at the ${difficulty} level.
    
    Provide the output STRICTLY in the following JSON format:
    {
      "questions": [
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "Explanation of why Option A is correct"
        }
      ]
    }
  `;

  try {
    const result = await generateJson(prompt);
    return result.questions || result; // Ensure we return the array
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to generate MCQs");
  }
};

export const generateStudyPlan = async (topic, numWeeks = 4) => {
  const prompt = `
    You are an expert technical instructor. Generate a comprehensive ${numWeeks}-week study plan for the topic: ${topic}.
    
    For each week, break down the syllabus into specific subjects (e.g., Week 1 might cover Variables, Data Types, Syntax).
    Crucially, for each subject, try to provide a relevant w3schools.com link. If w3schools doesn't cover it, provide a link from another highly reputed tutorial site (like MDN, GeeksforGeeks, tutorialspoint). If no reliable link exists, you can leave the link as an empty string "".
    
    Provide the output STRICTLY in the following JSON format:
    {
      "topic": "${topic}",
      "duration": "${numWeeks} Weeks",
      "weeks": [
        {
          "weekNumber": 1,
          "title": "Week 1 Title",
          "description": "Brief description of what will be covered",
          "topics": [
            {
              "name": "Topic Name (e.g., Variables & Data Types)",
              "w3schoolsLink": "https://www.w3schools.com/..." 
            }
          ]
        }
      ]
    }
  `;

  try {
    return await generateJson(prompt);
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to generate study plan");
  }
};
