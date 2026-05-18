import { GoogleGenAI } from "@google/genai";
import { getCityProfile } from "../cityData.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const budgetMultipliers = { low: 0.8, medium: 1, high: 1.35 };
const baseCosts = { monument: 700, food: 900, nature: 500, adventure: 1800, culture: 800, shopping: 1400 };
const durations = {
  relaxed: { monument: "2-3 hours", food: "1-2 hours", nature: "2-3 hours", adventure: "3-4 hours", culture: "2 hours", shopping: "1-2 hours" },
  packed:  { monument: "1-2 hours", food: "1 hour",    nature: "1-2 hours", adventure: "2-3 hours", culture: "1-2 hours", shopping: "1-2 hours" },
};

const inferCost = (category, budgetLevel) =>
  Math.round(baseCosts[category] * budgetMultipliers[budgetLevel]);

const inferDuration = (category, tripPace) =>
  (durations[tripPace] ?? durations.relaxed)[category] ?? "1-2 hours";

const buildPlacePool = (input, profile) => {
  const allCategories = ["monument", "food", "nature", "adventure", "culture", "shopping"];
  const pool = {};
  allCategories.forEach((cat) => {
    const places = profile.places[cat] ?? [];
    pool[cat] = places.map((p, i) => ({
      id: `${input.destination}-${cat}-${i + 1}`,
      name: p.name,
      category: cat,
      description: p.description,
      budgetTier: input.budgetLevel,
      estimatedCost: inferCost(cat, input.budgetLevel),
      duration: inferDuration(cat, input.tripPace),
      rating: cat === "adventure" ? 4.4 : 4.6,
      familyFriendly: cat !== "adventure" || input.travelType === "friends",
      indoor: ["food", "culture"].includes(cat) || p.name.toLowerCase().includes("museum") || p.name.toLowerCase().includes("palace"),
      nearbyAlternatives: places.filter((c) => c.name !== p.name).slice(0, 2).map((c) => c.name),
    }));
  });
  return pool;
};

export const itineraryAgent = async (input, weather) => {
  console.log("[ItineraryAgent] Starting for:", input.destination);

  const profile = getCityProfile(input.destination);
  const placePool = buildPlacePool(input, profile);
  const today = new Date();
  const activitiesPerDay = input.tripPace === "packed" ? 3 : 2;
  const timeSlots = ["morning", "afternoon", "evening"];

  const placePoolSummary = Object.entries(placePool)
    .map(([cat, places]) => `${cat}: ${places.map((p) => p.name).join(", ")}`)
    .join("\n");

  const prompt = `You are an expert India travel planner. Generate a ${input.days}-day itinerary for ${input.destination} for a ${input.travelType} group with ${input.budgetLevel} budget and ${input.tripPace} pace.

Interests: ${(input.interests ?? []).join(", ") || "general sightseeing"}
Weather: ${weather.condition}, ${weather.temperature}°C
Activities per day: ${activitiesPerDay}

Available places (use ONLY these exact names, grouped by category):
${placePoolSummary}

Rules:
- Assign ${activitiesPerDay} activities per day using the time slots: ${timeSlots.slice(0, activitiesPerDay).join(", ")}
- Prioritise interests: if interests include "food", include more food places; if "adventure", include more adventure etc.
- If weather is Rainy, prioritise indoor places (food, culture, monument types)
- For family trips, avoid adventure activities
- Vary categories across days — don't repeat same category on consecutive days if possible
- Each activity needs 1 practical tip (15-25 words)

Respond ONLY with a valid JSON array. No markdown, no explanation.
Format:
[
  {
    "day": 1,
    "activities": [
      { "time": "morning", "placeName": "ExactPlaceName", "category": "monument", "tip": "Arrive early to beat the crowds and get the best light for photos." }
    ]
  }
]`;

  let aiDays = null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const raw = response.text?.trim().replace(/^```json|^```|```$/gm, "").trim();
    aiDays = JSON.parse(raw);
  } catch (err) {
    console.warn("[ItineraryAgent] Gemini failed, falling back to rule-based plan:", err.message);
  }

  const dailyBudget = { low: 2400, medium: 6200, high: 14000 }[input.budgetLevel];

  const days = Array.from({ length: input.days }, (_, dayIndex) => {
    const dateStr = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayIndex)
      .toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" });

    let activities;
    const aiDay = aiDays?.[dayIndex];

    if (aiDay?.activities?.length > 0) {
      activities = aiDay.activities.map((act) => {
        const categoryPool = placePool[act.category] ?? placePool["monument"];
        const place = categoryPool.find((p) => p.name === act.placeName) ?? categoryPool[0];
        return {
          time: act.time ?? timeSlots[0],
          place,
          tips: [act.tip ?? "Explore at your own pace and enjoy the experience."],
        };
      }).filter((a) => a.place);
    }

    if (!activities || activities.length === 0) {
      const fallbackCategories = ["monument", "food", "nature", "adventure", "culture", "shopping"];
      activities = timeSlots.slice(0, activitiesPerDay).map((slot, i) => {
        const cat = fallbackCategories[(dayIndex + i) % fallbackCategories.length];
        const pool = placePool[cat] ?? placePool["monument"];
        const place = pool[dayIndex % pool.length];
        return { time: slot, place, tips: ["Enjoy this stop at a comfortable pace."] };
      });
    }

    return { day: dayIndex + 1, date: dateStr, dailyBudget, activities };
  });

  console.log("[ItineraryAgent] Done — generated", days.length, "days");
  return days;
};
