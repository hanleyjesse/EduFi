# CORS Configuration Guide

## 🎯 What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature that controls which websites can access your API. Currently, your server allows requests from ANY domain (`origin: "*"`), which is a **security risk** in production.

## ⚠️ Current Security Issue

**File:** `/supabase/functions/server/index.tsx`  
**Line 17:** `origin: "*"`

This allows ANY website on the internet to make requests to your API, which could lead to:
- Unauthorized access to your data
- Cross-site request forgery (CSRF) attacks
- Data theft or manipulation

---

## ✅ Step 1: Deploy to Netlify

Before you can update CORS, you need to deploy your app and get your production domain.

### Deploy Steps:

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - Build command: `npm run build` or leave empty if using Vite
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Get your Netlify domain**:
   - After deployment, you'll get a domain like: `https://your-app-name.netlify.app`
   - You can customize this in Site settings → Domain management

---

## ✅ Step 2: Update CORS Origin

Once you have your Netlify domain, update the server code:

**File:** `/supabase/functions/server/index.tsx`

**Change this:**
```typescript
app.use(
  "/*",
  cors({
    origin: "*", // ❌ INSECURE - allows any website
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
```

**To this:**
```typescript
app.use(
  "/*",
  cors({
    origin: "https://your-app-name.netlify.app", // ✅ SECURE - only your domain
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
```

**Replace `your-app-name.netlify.app` with your actual Netlify domain!**

### Multiple Domains (Optional)

If you need to allow multiple domains (e.g., staging + production):

```typescript
app.use(
  "/*",
  cors({
    origin: [
      "https://your-app-name.netlify.app",
      "https://staging-app-name.netlify.app",
      "http://localhost:5173" // For local development
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
```

---

## ✅ Step 3: Deploy Updated Server Code

After updating the CORS configuration, you need to deploy the changes to Supabase:

### Using Supabase CLI:

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. **Deploy the edge function**:
   ```bash
   supabase functions deploy make-server-e7c89057
   ```

### Using Supabase Dashboard:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: **Edge Functions** → **make-server-e7c89057**
3. Click **"Edit function"**
4. Update the code manually
5. Click **"Deploy"**

---

## ✅ Step 4: Test CORS Configuration

After deploying, test that CORS is working correctly:

### Test 1: Your App Should Work

1. Visit your Netlify app: `https://your-app-name.netlify.app`
2. Sign in to your account
3. Try these features:
   - ✅ Net Worth Tracker (save data)
   - ✅ Sign out and sign in again
   - ✅ Navigate between pages
4. Open browser console (F12) - there should be NO CORS errors

### Test 2: Other Domains Should Be Blocked

1. Open browser console on ANY other website (e.g., google.com)
2. Paste this code:
   ```javascript
   fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e7c89057/health', {
     headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```
3. You should see a CORS error - this is GOOD! It means your API is protected.

---

## 🔍 Troubleshooting

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Problem:** You're testing from `localhost` but CORS is set to your Netlify domain.

**Solution:** Add `http://localhost:5173` to the allowed origins array:
```typescript
origin: [
  "https://your-app-name.netlify.app",
  "http://localhost:5173"
],
```

### Issue: App works on localhost but not on Netlify

**Problem:** You forgot to update CORS after deploying.

**Solution:** Follow Step 2 and Step 3 again, make sure you're using your actual Netlify domain.

### Issue: Changes not taking effect

**Problem:** Browser is caching old CORS headers.

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try incognito/private browsing window

---

## ✅ Security Checklist

Before going to production, verify:

- [ ] CORS origin is set to your Netlify domain (NOT `"*"`)
- [ ] Server code is deployed to Supabase
- [ ] App works correctly on your Netlify domain
- [ ] CORS errors appear when accessing from other domains
- [ ] Row Level Security (RLS) is enabled on `kv_store_e7c89057` table
- [ ] Supabase Auth URLs are configured for your domain

---

## 📋 Next Steps

After completing CORS configuration:

1. **Configure Supabase Auth URLs** (see `SUPABASE_AUTH_CONFIGURATION.md`)
2. **Enable Row Level Security** on your database
3. **Test all functionality** on your production domain
4. **Set up custom domain** (optional)
5. **Enable HTTPS** (Netlify does this automatically)

---

## 🆘 Need Help?

- [Supabase CORS Documentation](https://supabase.com/docs/guides/functions/cors)
- [Netlify Deployment Docs](https://docs.netlify.com/site-deploys/overview/)
- Check browser console for specific error messages
