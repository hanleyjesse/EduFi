import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// GET /wealth-multiplier-tracker - Load user's net worth history
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
      console.error("Authorization error while loading wealth multiplier tracker data:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    // Load net worth history from KV store
    const historyKey = `wealth_multiplier_history:${user.id}`;
    const historyData = await kv.get(historyKey);

    if (!historyData) {
      // Return empty array if nothing saved yet
      return c.json([]);
    }

    return c.json(historyData);
  } catch (error) {
    console.error("Error loading wealth multiplier tracker data:", error);
    return c.json({ error: "Failed to load wealth multiplier tracker data" }, 500);
  }
});

// POST /wealth-multiplier-tracker - Save new snapshot
app.post("/", async (c) => {
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
      console.error("Authorization error while saving wealth multiplier tracker data:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    // Get the snapshot data from request body
    const newSnapshot = await c.req.json();

    // Validate the data structure
    if (typeof newSnapshot.netWorth !== 'number' || 
        typeof newSnapshot.month !== 'number' || 
        typeof newSnapshot.year !== 'number') {
      return c.json({ error: "Invalid data structure" }, 400);
    }

    // Load existing history
    const historyKey = `wealth_multiplier_history:${user.id}`;
    const existingHistory = await kv.get(historyKey) || [];

    // Add new snapshot with ID and timestamp
    const snapshotWithId = {
      ...newSnapshot,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    const updatedHistory = [...existingHistory, snapshotWithId];

    // Save to KV store
    await kv.set(historyKey, updatedHistory);

    return c.json(snapshotWithId);
  } catch (error) {
    console.error("Error saving wealth multiplier tracker data:", error);
    return c.json({ error: "Failed to save wealth multiplier tracker data" }, 500);
  }
});

// DELETE /wealth-multiplier-tracker/:id - Delete specific snapshot
app.delete("/:id", async (c) => {
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
      console.error("Authorization error while deleting wealth multiplier tracker snapshot:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    const snapshotId = c.req.param("id");

    // Load existing history
    const historyKey = `wealth_multiplier_history:${user.id}`;
    const existingHistory = await kv.get(historyKey) || [];

    // Filter out the snapshot with the given ID
    const updatedHistory = existingHistory.filter((snapshot: any) => snapshot.id !== snapshotId);

    // Save updated history
    await kv.set(historyKey, updatedHistory);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting wealth multiplier tracker snapshot:", error);
    return c.json({ error: "Failed to delete wealth multiplier tracker snapshot" }, 500);
  }
});

// DELETE /wealth-multiplier-tracker - Clear all history
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
      console.error("Authorization error while clearing wealth multiplier tracker history:", error);
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    // Delete from KV store
    const historyKey = `wealth_multiplier_history:${user.id}`;
    await kv.del(historyKey);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error clearing wealth multiplier tracker history:", error);
    return c.json({ error: "Failed to clear wealth multiplier tracker history" }, 500);
  }
});

export default app;
