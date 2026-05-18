import { weatherAgent } from "./agents/weatherAgent.js";
import { itineraryAgent } from "./agents/itineraryAgent.js";
import { budgetAgent } from "./agents/budgetAgent.js";
import { tipsAgent } from "./agents/tipsAgent.js";

export const orchestrate = async (input) => {
  console.log("[Orchestrator] Starting multi-agent trip planning for:", input.destination);
  const startTime = Date.now();

  const weatherResult = await weatherAgent(input);

  console.log("[Orchestrator] Weather ready — launching itinerary, budget, and tips agents in parallel");

  const [itineraryResult, budgetResult, tipsResult] = await Promise.all([
    itineraryAgent(input, weatherResult),
    budgetAgent(input),
    tipsAgent(input, weatherResult),
  ]);

  console.log(`[Orchestrator] All agents complete in ${Date.now() - startTime}ms — aggregating`);

  return {
    destination: input.destination,
    totalDays: input.days,
    travelType: input.travelType,
    weather: weatherResult,
    totalBudget: budgetResult.totalBudget,
    days: itineraryResult,
    tips: tipsResult.tips,
    imageUrl: "",
    budgetBreakdown: budgetResult.breakdown,
    packingChecklist: tipsResult.packingChecklist,
    travelChecklist: tipsResult.travelChecklist,
    assistantHighlights: tipsResult.assistantHighlights,
  };
};
