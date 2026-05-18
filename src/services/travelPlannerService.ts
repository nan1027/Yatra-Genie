import { Itinerary, TripFormData } from "@/types/travel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const generateLiveItinerary = async (formData: TripFormData): Promise<Itinerary> => {
  const response = await fetch(`${API_BASE_URL}/api/plan-trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: "Trip planning failed." }));
    throw new Error(data.error ?? "Trip planning failed.");
  }

  return response.json();
};
