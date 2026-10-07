import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const tipsAgent = async (input, weather) => {
  console.log("[TipsAgent] Starting for:", input.destination);

  const prompt = `You are an expert India travel advisor. A traveller is going to ${input.destination} for ${input.days} days.
Trip type: ${input.travelType} | Budget: ${input.budgetLevel} | Pace: ${input.tripPace}
Interests: ${(input.interests ?? []).join(", ") || "general sightseeing"}
Weather: ${weather.condition}, ${weather.temperature}°C, humidity ${weather.humidity}%

Generate personalised, specific travel content for this exact trip. Respond ONLY with valid JSON, no markdown.

Format:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "packingChecklist": ["item1", "item2", "item3", "item4", "item5", "item6"],
  "travelChecklist": ["task1", "task2", "task3", "task4", "task5"],
  "assistantHighlights": {
    "summary": "One sentence describing this specific trip plan.",
    "weatherNote": "One sentence about how today's weather affects the trip.",
    "paceNote": "One sentence about the trip pace.",
    "interestNote": "One sentence about how interests shaped the itinerary."
  }
}

Rules for tips: destination-specific, practical, not generic. Each tip 15-25 words.
Rules for packingChecklist: real items suited to weather + destination + activities. 6 items.
Rules for travelChecklist: pre-trip tasks. 5 items.
Rules for assistantHighlights: short sentences, specific to THIS trip's data — mention destination, pace, interests.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    const raw = response.text?.trim().replace(/^```json|^```|```$/gm, "").trim();
    const parsed = JSON.parse(raw);

    if (parsed.tips && parsed.packingChecklist && parsed.travelChecklist && parsed.assistantHighlights) {
      console.log("[TipsAgent] Done — AI content");
      return parsed;
    }
  } catch (err) {
    console.warn("[TipsAgent] Gemini failed, using rule-based fallback:", err.message);
  }

  const tips = [
    `Explore ${input.destination} with a focus on ${(input.interests?.[0] ?? "sightseeing")} for a memorable experience.`,
    input.tripPace === "packed"
      ? "Pre-book top attractions to avoid queues and keep your packed schedule on time."
      : "Build in buffer time between stops — a relaxed pace reveals more than a rushed one.",
    weather.condition === "Rainy"
      ? "Keep a compact umbrella handy and always have an indoor backup plan for each day."
      : "Schedule open-air stops in the cooler morning hours for the best experience.",
    input.interests?.includes("food")
      ? `Set aside one meal slot per day for a local ${input.destination} specialty you haven't tried before.`
      : "Ask locals for restaurant recommendations — the best places rarely show up on tourist maps.",
    input.travelType === "family"
      ? "Keep travel gaps short and plan rest stops between major attractions for a smoother family trip."
      : "Stay flexible — some of the best travel moments come from unplanned detours.",
  ];

  const packingChecklist = [
    "Government ID and all booking confirmations",
    "Phone charger and a reliable power bank",
    "Comfortable walking shoes for full-day outings",
    weather.condition === "Rainy" ? "Compact umbrella or light rain jacket" : "Sunscreen and sunglasses",
    input.interests?.includes("adventure") ? "Sportswear and a quick-dry outfit" : "Light layers for indoor venues",
    input.travelType === "family" ? "Snacks, wipes, and a basic family comfort kit" : "Small day bag for daily essentials",
  ];

  const travelChecklist = [
    "Confirm all transport and hotel bookings",
    "Save your hotel address and key maps offline",
    "Share itinerary with a trusted contact back home",
    input.tripPace === "packed" ? "Pre-book entry tickets to top attractions" : "Check venue opening hours in advance",
    input.travelType !== "solo" ? "Share the daily plan with your travel group" : "Keep emergency contacts accessible",
  ];

  const assistantHighlights = {
    summary: `A ${input.tripPace} ${input.days}-day ${input.travelType} trip in ${input.destination} built around your top interests.`,
    weatherNote: weather.description ?? `${weather.condition} conditions at ${weather.temperature}°C — plan accordingly.`,
    paceNote: input.tripPace === "packed"
      ? "High-density schedule — start mornings early and keep transfers tight."
      : "Relaxed pacing with breathing room between stops for a stress-free experience.",
    interestNote: `Itinerary weighted towards ${(input.interests ?? []).slice(0, 2).join(" and ") || "balanced sightseeing"} based on your preferences.`,
  };

  console.log("[TipsAgent] Done — fallback content");
  return { tips, packingChecklist, travelChecklist, assistantHighlights };
};
