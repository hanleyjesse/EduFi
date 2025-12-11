import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// GET /net-worth - Load user's net worth data
app.get("/", async (c) => {
  try {
    // Get access token from Authorization header
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - no access token" }, 401);
    }

    // Verify the user with Supabase auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Authorization error while loading net worth data:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    // Load net worth data from KV store
    const netWorthKey = `net_worth:${user.id}`;
    const netWorthData = await kv.get(netWorthKey);

    if (!netWorthData) {
      // Return empty data if nothing saved yet
      return c.json({ assets: [], liabilities: [] });
    }

    return c.json(netWorthData);
  } catch (error) {
    console.error("Error loading net worth data:", error);
    return c.json({ error: "Failed to load net worth data" }, 500);
  }
});

// POST /net-worth - Save user's net worth data
app.post("/", async (c) => {
  try {
    // Get access token from Authorization header
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    console.log("=== Save Net Worth Data ===");
    console.log("Has access token:", !!accessToken);
    
    if (!accessToken) {
      console.error("No access token provided");
      return c.json({ error: "Unauthorized - no access token" }, 401);
    }

    // Verify the user with Supabase auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Authorization error while saving net worth data:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    console.log("User authenticated:", user.id);

    // Get the net worth data from request body
    const netWorthData = await c.req.json();

    console.log("Net worth data received:", {
      hasPresetAssets: !!netWorthData.presetAssets,
      hasPresetLiabilities: !!netWorthData.presetLiabilities,
      hasCustomAssets: !!netWorthData.customAssets,
      hasCustomLiabilities: !!netWorthData.customLiabilities,
    });

    // Validate the data structure - updated to match the actual structure sent from frontend
    if (!netWorthData.presetAssets && !netWorthData.presetLiabilities) {
      console.error("Invalid data structure - missing required fields");
      return c.json({ error: "Invalid data structure - missing presetAssets or presetLiabilities" }, 400);
    }

    // Save to KV store
    const netWorthKey = `net_worth:${user.id}`;
    await kv.set(netWorthKey, netWorthData);

    console.log("✓ Net worth data saved successfully for user:", user.id);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving net worth data:", error);
    return c.json({ error: `Failed to save net worth data: ${error.message}` }, 500);
  }
});

// DELETE /net-worth - Reset user's net worth data
app.delete("/", async (c) => {
  try {
    // Get access token from Authorization header
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - no access token" }, 401);
    }

    // Verify the user with Supabase auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Authorization error while resetting net worth data:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    // Delete from KV store
    const netWorthKey = `net_worth:${user.id}`;
    await kv.del(netWorthKey);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error resetting net worth data:", error);
    return c.json({ error: "Failed to reset net worth data" }, 500);
  }
});

export default app;