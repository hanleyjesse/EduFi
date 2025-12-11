import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// GET /net-worth-history - Get all snapshots for authenticated user
app.get("/", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error("Authorization error while fetching net worth history snapshots:", authError);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const key = `net_worth_history:${user.id}`;
    const snapshots = await kv.get(key);

    if (!snapshots) {
      return c.json([]);
    }

    return c.json(snapshots);
  } catch (error) {
    console.error("Error fetching net worth history snapshots:", error);
    return c.json({ error: "Failed to fetch snapshots" }, 500);
  }
});

// POST /net-worth-history - Save a new snapshot
app.post("/", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error("Authorization error while saving net worth history snapshot:", authError);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const body = await c.req.json();
    const { netWorth, month, year } = body;

    if (netWorth === undefined || !month || !year) {
      return c.json({ error: "Missing required fields: netWorth, month, year" }, 400);
    }

    const key = `net_worth_history:${user.id}`;
    const existingSnapshots = await kv.get(key) || [];

    // Create new snapshot with unique ID and timestamp
    const newSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      netWorth,
      month,
      year,
      timestamp: Date.now(),
    };

    // Add to array and sort by timestamp
    const updatedSnapshots = [...existingSnapshots, newSnapshot].sort((a, b) => a.timestamp - b.timestamp);

    await kv.set(key, updatedSnapshots);

    return c.json(newSnapshot);
  } catch (error) {
    console.error("Error saving net worth history snapshot:", error);
    return c.json({ error: "Failed to save snapshot" }, 500);
  }
});

// DELETE /net-worth-history/:id - Delete a specific snapshot
app.delete("/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error("Authorization error while deleting net worth history snapshot:", authError);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const snapshotId = c.req.param("id");
    const key = `net_worth_history:${user.id}`;
    const existingSnapshots = await kv.get(key) || [];

    // Filter out the snapshot to delete
    const updatedSnapshots = existingSnapshots.filter((s: any) => s.id !== snapshotId);

    await kv.set(key, updatedSnapshots);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting net worth history snapshot:", error);
    return c.json({ error: "Failed to delete snapshot" }, 500);
  }
});

// DELETE /net-worth-history - Clear all snapshots
app.delete("/", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error("Authorization error while clearing net worth history:", authError);
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const key = `net_worth_history:${user.id}`;
    await kv.del(key);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error clearing net worth history:", error);
    return c.json({ error: "Failed to clear history" }, 500);
  }
});

export default app;
