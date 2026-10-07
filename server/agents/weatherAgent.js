import { GoogleGenAI } from "@google/genai";

const OPEN_METEO_GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const mapWeatherCode = (code) => {
  if ([0].includes(code))
    return { condition: "Clear", icon: "sun" };
  if ([1, 2, 3].includes(code))
    return { condition: "Partly Cloudy", icon: "cloud" };
  if ([45, 48].includes(code))
    return { condition: "Cloudy", icon: "cloud" };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return { condition: "Rainy", icon: "cloud-rain" };
  return { condition: "Pleasant", icon: "sun" };
};

const fetchLiveWeather = async (destination) => {
  const geocode = await fetch(
    `${OPEN_METEO_GEOCODE_URL}?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`
  ).then((r) => r.json());

  const result = geocode?.results?.[0];
  if (!result) throw new Error("Could not geocode destination");

  const forecast = await fetch(
    `${OPEN_METEO_FORECAST_URL}?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
  ).then((r) => r.json());

  const current = forecast.current ?? {};
  const mapped = mapWeatherCode(current.weather_code ?? -1);

  return {
    temperature: Math.round(current.temperature_2m ?? 26),
    humidity: Math.round(current.relative_humidity_2m ?? 50),
    condition: mapped.condition,
    icon: mapped.icon,
  };
};

export const weatherAgent = async (input) => {
  console.log("[WeatherAgent] Starting for:", input.destination);

  let liveWeather;
  try {
    liveWeather = await fetchLiveWeather(input.destination);
  } catch {
    liveWeather = { temperature: 26, humidity: 50, condition: "Pleasant", icon: "sun" };
  }

  const prompt = `You are a travel weather advisor. A traveller is visiting ${input.destination}, India on a ${input.days}-day ${input.travelType} trip with a ${input.budgetLevel} budget.

Current weather data:
- Temperature: ${liveWeather.temperature}°C
- Humidity: ${liveWeather.humidity}%
- Condition: ${liveWeather.condition}

Write a SHORT, practical weather description (1 sentence, max 20 words) that tells the traveller how this weather affects their trip activities.

Respond with ONLY the description sentence. No preamble, no punctuation beyond the sentence itself.`;

  let description = `${liveWeather.condition} skies — a solid day for ${liveWeather.condition === "Rainy" ? "indoor sightseeing" : "outdoor exploration"}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    const text = response.text?.trim();
    if (text && text.length > 10) description = text;
  } catch (err) {
    console.warn("[WeatherAgent] Gemini call failed, using fallback description:", err.message);
  }

  console.log("[WeatherAgent] Done");
  return { ...liveWeather, description };
};
