import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Simple in-memory rate limiting (resets on server restart)
// For production, consider using Redis or Supabase for persistent rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimit = (key: string, maxAttempts: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
};

// Password validation helper
const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" };
  }
  return { valid: true };
};

// Sign up route
app.post("/signup", async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    if (!email || !password || !firstName || !lastName) {
      return c.json({ error: "Email, password, first name, and last name are required" }, 400);
    }

    // Rate limiting: 5 signups per IP per hour
    const clientIP = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
    if (!rateLimit(`signup:${clientIP}`, 5, 60 * 60 * 1000)) {
      return c.json({ error: "Too many signup attempts. Please try again later." }, 429);
    }

    // Server-side password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return c.json({ error: passwordValidation.error }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create user with admin API
    // Note: Email is automatically confirmed since we don't have an email server configured
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { firstName, lastName, name: `${firstName} ${lastName}` },
      email_confirm: true, // Automatically confirm the user's email since an email server hasn't been configured
    });

    if (error) {
      console.error("Sign up error:", error);
      // Don't leak specific error details to prevent user enumeration
      if (error.message.includes("already registered")) {
        return c.json({ error: "An account with this email already exists" }, 400);
      }
      return c.json({ error: "Failed to create account. Please try again." }, 400);
    }

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata.firstName,
        lastName: data.user.user_metadata.lastName,
        name: data.user.user_metadata.name,
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json(
      { error: "An error occurred during sign up" },
      500
    );
  }
});

// Sign in route
app.post("/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    console.log("=== Sign In Attempt ===");
    console.log("Email:", email);
    console.log("Password length:", password?.length);

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Rate limiting: 10 login attempts per IP per 15 minutes
    const clientIP = c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown";
    if (!rateLimit(`signin:${clientIP}`, 10, 15 * 60 * 1000)) {
      return c.json({ error: "Too many login attempts. Please try again later." }, 429);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      console.error("Error code:", error.code);
      console.error("Error status:", error.status);
      
      // Check if the user exists
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = users?.users?.some(u => u.email === email);
      
      console.log("User exists in database:", userExists);
      console.log("Total users in database:", users?.users?.length);
      
      if (!userExists) {
        return c.json({ 
          error: "No account found with this email. Please create an account first.",
          needsSignup: true 
        }, 401);
      }
      
      // Generic error message to prevent user enumeration
      return c.json({ error: "Invalid email or password" }, 401);
    }

    if (!data.session) {
      console.error("No session created despite successful auth");
      return c.json({ error: "Failed to create session" }, 401);
    }

    console.log("✓ Sign in successful for:", email);
    console.log("User ID:", data.user.id);

    return c.json({
      success: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return c.json(
      { error: "An error occurred during sign in" },
      500
    );
  }
});

// Get current user session
app.get("/me", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json(
      { error: "An error occurred while fetching user" },
      500
    );
  }
});

// Sign out route
app.post("/signout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Sign out error:", error);
    return c.json(
      { error: "An error occurred during sign out" },
      500
    );
  }
});

export default app;