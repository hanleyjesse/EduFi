import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import authRoutes from "./auth.tsx";
import netWorthRoutes from "./net-worth.tsx";
import netWorthHistoryRoutes from "./net-worth-history.tsx";
import wealthMultiplierTrackerRoutes from "./wealth-multiplier-tracker.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS - IMPORTANT: Update allowed origins before production deployment
// TODO: Replace "*" with your Netlify domain, e.g., "https://your-app.netlify.app"
app.use(
  "/*",
  cors({
    origin: "*", // SECURITY WARNING: Change this to your Netlify domain before production!
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e7c89057/health", (c) => {
  return c.json({ status: "ok" });
});

// Mount auth routes
app.route("/make-server-e7c89057/auth", authRoutes);

// Mount net worth routes
app.route("/make-server-e7c89057/net-worth", netWorthRoutes);

// Mount net worth history routes
app.route("/make-server-e7c89057/net-worth-history", netWorthHistoryRoutes);

// Mount wealth multiplier tracker routes
app.route("/make-server-e7c89057/wealth-multiplier-tracker", wealthMultiplierTrackerRoutes);

Deno.serve(app.fetch);