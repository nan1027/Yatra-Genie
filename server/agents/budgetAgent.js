import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const baseDailyBudgets = { low: 2400, medium: 6200, high: 14000 };
const fallbackWeights = {
  low:    { accommodation: 0.28, food: 0.24, transport: 0.2,  activities: 0.18, shopping: 0.1 },
  medium: { accommodation: 0.32, food: 0.22, transport: 0.18, activities: 0.18, shopping: 0.1 },
  high:   { accommodation: 0.38, food: 0.2,  transport: 0.16, activities: 0.16, shopping: 0.1 },
};

export const budgetAgent = async (input) => {
  console.log("[BudgetAgent] Starting for:", input.destination);

  const dailyBudget = baseDailyBudgets[input.budgetLevel];
  const totalBudget = dailyBudget * input.days;

  const prompt = `You are a travel budget expert for India. A ${input.travelType} group is visiting ${input.destination} for ${input.days} days with a ${input.budgetLevel} budget.
Total estimated budget: INR ${totalBudget}
Interests: ${(input.interests ?? []).join(", ") || "general"}

Based on the destination, group type, and interests, allocate the total budget (INR ${totalBudget}) across these 5 categories: accommodation, food, transport, activities, shopping.

Rules:
- All 5 values must add up to EXACTLY ${totalBudget}
- If interests include "food", increase food allocation
- If interests include "shopping", increase shopping allocation  
- If interests include "adventure", increase activities allocation
- Family trips need slightly higher food and transport
- Solo trips can reduce accommodation
- High budget trips should allocate more to accommodation

Respond ONLY with a valid JSON object. No markdown, no explanation.
Format: { "accommodation": 12000, "food": 8000, "transport": 6000, "activities": 5000, "shopping": 3000 }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    const raw = response.text?.trim().replace(/^```json|^```|```$/gm, "").trim();
    const parsed = JSON.parse(raw);

    const keys = ["accommodation", "food", "transport", "activities", "shopping"];
    if (keys.every((k) => typeof parsed[k] === "number")) {
      const sum = keys.reduce((s, k) => s + parsed[k], 0);
      const diff = totalBudget - sum;

      const breakdown = { ...parsed };
      breakdown.accommodation += diff;

      console.log("[BudgetAgent] Done — AI breakdown");
      return { totalBudget, breakdown };
    }
  } catch (err) {
    console.warn("[BudgetAgent] Gemini failed, using rule-based fallback:", err.message);
  }

  const weights = fallbackWeights[input.budgetLevel];
  const breakdown = {
    accommodation: Math.round(totalBudget * weights.accommodation),
    food: Math.round(totalBudget * weights.food),
    transport: Math.round(totalBudget * weights.transport),
    activities: Math.round(totalBudget * weights.activities),
    shopping: Math.round(totalBudget * weights.shopping),
  };

  console.log("[BudgetAgent] Done — fallback breakdown");
  return { totalBudget, breakdown };
};
