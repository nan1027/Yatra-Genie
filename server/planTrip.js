import { orchestrate } from "./orchestrator.js";

const validateInput = (input) => {
  if (!input?.destination || !input?.days || !input?.travelType || !input?.budgetLevel) {
    throw new Error("Destination, days, travel type, and budget level are required.");
  }
  if (typeof input.days !== "number" || input.days < 1 || input.days > 14) {
    throw new Error("Days must be a number between 1 and 14.");
  }
};

export const planTrip = async (input) => {
  validateInput(input);
  return orchestrate(input);
};
