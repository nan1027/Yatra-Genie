import "dotenv/config";
import express from "express";
import cors from "cors";
import { planTrip } from "./planTrip.js";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "8787", 10);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8787"
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/plan-trip", async (req, res) => {
  try {
    const itinerary = await planTrip(req.body);
    res.json(itinerary);
  } catch (error) {
    console.error("plan-trip failed", error);

    const message =
      error instanceof Error ? error.message : "Trip planning failed";

    res.status(500).json({
      error: message,
    });
  }
});

app.listen(port, () => {
  console.log(`Yatra Genie API listening on http://localhost:${port}`);
});
