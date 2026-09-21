const { GoogleGenAI } = require("@google/genai");
const env = require("../config/env");

/**
 * AI Service for MediConsult Symptom Analysis
 * Isolated module interacting with Google Gemini API
 * Model: gemini-3.5-flash-lite
 */

const FALLBACK_RESPONSE = {
  possibleCauses: [],
  urgencyLevel: "moderate",
  generalGuidance: [
    "We could not safely complete the automated analysis at this time.",
    "Consider consulting a qualified healthcare professional for medical evaluation.",
  ],
  doctorRecommendation: true,
  urgentWarning: null,
};

const SYSTEM_INSTRUCTION = `You are a health information assistant inside MediConsult.
Your task is to provide general health information based on symptoms supplied by the user.
You are not a doctor and must not provide a definitive diagnosis.
Identify only possible causes using cautious phrasing like "Possible causes may include...".
Never claim certainty.
Never say "you have" or "you definitely have".
Never prescribe medications.
Never provide medication dosage as a prescription.
Do not tell users to stop or change prescribed medicines.
Clearly communicate urgency when symptoms may require professional medical attention.
Return only valid JSON matching the required schema.
If symptoms could indicate an emergency (e.g., severe chest pain, shortness of breath, sudden numbness, severe head trauma), set urgencyLevel to "urgent" and provide an urgentWarning instructing the user to seek urgent professional medical attention immediately.
Allowed urgencyLevel values: "low", "moderate", "high", "urgent".
Use cautious, understandable language.`;

let aiClient = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[AIService] Warning: GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy_key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * Validates and cleans raw AI output against required schema & safety rules
 */
function validateAndNormalizeAiResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return { ...FALLBACK_RESPONSE };
  }

  const allowedUrgencies = ["low", "moderate", "high", "urgent"];
  let urgency = "moderate";
  if (parsed.urgencyLevel && allowedUrgencies.includes(String(parsed.urgencyLevel).toLowerCase())) {
    urgency = String(parsed.urgencyLevel).toLowerCase();
  }

  // Sanitize possible causes: must be array of strings, max 5, cautious phrasing
  let possibleCauses = [];
  if (Array.isArray(parsed.possibleCauses)) {
    possibleCauses = parsed.possibleCauses
      .filter((item) => typeof item === "string" && item.trim().length > 0)
      .slice(0, 5)
      .map((item) => item.trim());
  }

  // Sanitize general guidance: array of strings
  let generalGuidance = [];
  if (Array.isArray(parsed.generalGuidance)) {
    generalGuidance = parsed.generalGuidance
      .filter((item) => typeof item === "string" && item.trim().length > 0)
      .slice(0, 6)
      .map((item) => item.trim());
  }

  if (generalGuidance.length === 0) {
    generalGuidance = [
      "Rest and monitor whether symptoms improve or worsen.",
      "Seek medical advice if your condition does not improve.",
    ];
  }

  let doctorRecommendation = true;
  if (typeof parsed.doctorRecommendation === "boolean") {
    doctorRecommendation = parsed.doctorRecommendation;
  }

  let urgentWarning = null;
  if (parsed.urgentWarning && typeof parsed.urgentWarning === "string") {
    urgentWarning = parsed.urgentWarning.trim();
  }

  // Safety rule: if urgent, enforce warning and recommendation
  if (urgency === "urgent") {
    urgentWarning = urgentWarning || "Seek urgent professional medical attention immediately.";
    doctorRecommendation = true;
  }

  return {
    possibleCauses,
    urgencyLevel: urgency,
    generalGuidance,
    doctorRecommendation,
    urgentWarning,
  };
}

/**
 * Analyzes symptoms via Gemini model: gemini-3.5-flash-lite
 */
async function analyzeSymptoms({ symptoms, duration, severity }) {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "dummy_key") {
    console.warn("[AIService] No valid GEMINI_API_KEY present; utilizing safe medical fallback.");
    return { ...FALLBACK_RESPONSE };
  }

  try {
    const ai = getAiClient();
    const prompt = `Patient reported the following:
- Symptoms: ${symptoms.join(", ")}
- Duration: ${duration}
- Stated Severity: ${severity}

Analyze these symptoms and provide potential health causes (not a diagnosis), general guidance, urgency level, and whether a doctor consultation is recommended.
Output ONLY valid JSON with this exact schema:
{
  "possibleCauses": ["Possible cause 1", "Possible cause 2"],
  "urgencyLevel": "low" | "moderate" | "high" | "urgent",
  "generalGuidance": ["Guidance point 1", "Guidance point 2"],
  "doctorRecommendation": true,
  "urgentWarning": null or "Seek urgent professional medical attention."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const rawText = response.text ? response.text.trim() : "";
    if (!rawText) {
      console.warn("[AIService] Empty response from Gemini API, returning fallback.");
      return { ...FALLBACK_RESPONSE };
    }

    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      // Attempt clean markdown json block if present
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return validateAndNormalizeAiResponse(parsed);
  } catch (error) {
    console.error("[AIService] Error during Gemini API invocation:", error.message || error);
    // Never crash the server or expose raw model errors to the client
    return { ...FALLBACK_RESPONSE };
  }
}

module.exports = {
  analyzeSymptoms,
  FALLBACK_RESPONSE,
};
