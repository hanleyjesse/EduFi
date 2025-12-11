# Deployment Guide - Personal Finance Roadmap PWA

## 🚀 Pre-Deployment Checklist

### 1. Supabase Configuration (CRITICAL)

#### A. Enable Row Level Security (RLS)
**This is the MOST CRITICAL security step!**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ahlblqmjsgwtawxhnixr
2. Navigate to **Table Editor** → `kv_store_e7c89057`
3. Click on the **RLS** tab
4. Click **Enable RLS**
5. Click **New Policy** and add these 4 policies:

**Policy 1: SELECT (Read)**
```sql
Policy Name: Users can read own data
Policy Command: SELECT
Target Roles: authenticated
USING expression:
key LIKE 'net_worth:' || auth.uid() || '%'
```

**Policy 2: INSERT (Create)**
```sql
Policy Name: Users can insert own data
Policy Command: INSERT
Target Roles: authenticated
WITH CHECK expression:
key LIKE 'net_worth:' || auth.uid() || '%'
```

**Policy 3: UPDATE (Modify)**
```sql
Policy Name: Users can update own data
Policy Command: UPDATE
Target Roles: authenticated
USING expression:
key LIKE 'net_worth:' || auth.uid() || '%'
WITH CHECK expression:
key LIKE 'net_worth:' || auth.uid() || '%'
```

**Policy 4: DELETE (Remove)**
```sql
Policy Name: Users can delete own data
Policy Command: DELETE
Target Roles: authenticated
USING expression:
key LIKE 'net_worth:' || auth.uid() || '%'
```

6. Click **Save** on each policy
7. **Test:** Try accessing another user's data - it should be blocked

#### B. Configure Auth Settings
1. Go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: Set to your Netlify URL (e.g., `https://your-app.netlify.app`)
   - **Redirect URLs**: Add `https://your-app.netlify.app/**`
   - **JWT expiry**: Keep at 3600 (1 hour) or adjust as needed
   - **Disable signups**: Leave OFF (you want users to sign up)
   - **Password requirements**: Minimum 8 characters (already enforced in code)

#### C. Review Auth Email Templates (Optional - for future)
1. Go to **Authentication** → **Email Templates**
2. Review templates for:
   - Confirmation email
   - Magic link
   - Password reset
3. Customize branding if desired

---

### 2. Update CORS Configuration

**Before deploying, you MUST update the CORS origin!**

1. Get your Netlify URL (e.g., `https://finance-roadmap.netlify.app`)
2. Open `/supabase/functions/server/index.tsx`
3. Replace this:
   ```typescript
   origin: "*", // SECURITY WARNING: Change this to your Netlify domain before production!
   ```
   
   With:
   ```typescript
   origin: "https://your-actual-netlify-url.netlify.app",
   ```

4. If you want to allow both production and preview deploys:
   ```typescript
   origin: (origin) => {
     const allowed = [
       "https://your-app.netlify.app",
       /https:\/\/.*--your-app\.netlify\.app$/, // Preview deploys
     ];
     return allowed.some(pattern => 
       typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
     ) ? origin : false;
   },
   ```

---

### 3. PWA Assets

#### A. Generate App Icons
You need to create icons in multiple sizes. Use a tool like:
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Figma Icon Export](https://www.figma.com/community/plugin/751045404441915219/Favicon)

**Required sizes:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Save to:** `/public/icons/` directory

#### B. Create Screenshots (Optional but recommended)
Take screenshots of your app for the install prompt:
- Mobile: 540x720px (portrait)
- Desktop: 1280x720px (landscape)

**Save to:** `/public/screenshots/` directory

#### C. Add manifest to HTML
Make sure your `index.html` includes:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#d4e8c1">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
```

---

### 4. Netlify Configuration

#### A. Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

#### B. Deploy to Netlify
1. **Option 1: Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

2. **Option 2: Git Integration**
   - Push code to GitHub
   - Connect repo to Netlify
   - Netlify auto-deploys on push

---

### 5. Register Service Worker

Add this to your `index.html` before closing `</body>`:
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
</script>
```

---

## 🧪 Testing Your PWA

### 1. Test Locally
```bash
# Build the app
npm run build

# Serve the build locally
npx serve dist
```

### 2. Test PWA Features
- **Chrome DevTools** → **Application** tab
  - Check Manifest is loaded
  - Check Service Worker is active
  - Test offline mode (Network tab → Offline)
  - Check Cache Storage

### 3. Test on Mobile Devices
- **Android (Chrome):**
  1. Visit your site on mobile Chrome
  2. Look for "Add to Home Screen" prompt
  3. Test installation and offline functionality

- **iOS (Safari):**
  1. Visit your site on mobile Safari
  2. Tap Share → "Add to Home Screen"
  3. Test app from home screen

### 4. Run Lighthouse Audit
1. Open Chrome DevTools → **Lighthouse** tab
2. Select **Progressive Web App**
3. Run audit
4. Fix any issues (aim for 90+ score)

---

## 🔒 Security Testing

### 1. Test Authentication
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out properly clears session
- [ ] Can't access protected data without auth
- [ ] Can't access other users' data

### 2. Test Rate Limiting
- [ ] Try 6+ signups from same IP → Should be blocked
- [ ] Try 11+ login attempts → Should be blocked
- [ ] Wait and try again → Should work

### 3. Test RLS Policies
```javascript
// In browser console after signing in:
const userId = localStorage.getItem('access_token');
// Try to access another user's data via API
// Should fail with 403 or return empty
```

### 4. Test CORS
- Open browser console from different domain
- Try to call your API → Should be blocked

---

## 📊 Monitoring & Analytics

### 1. Supabase Dashboard
Monitor:
- **Database** → Check row counts, storage usage
- **Auth** → Track user signups, login activity
- **API** → Monitor request volume, errors
- **Logs** → Review error logs

### 2. Netlify Analytics
- Enable Netlify Analytics for traffic insights
- Monitor deploy status and build logs
- Check bandwidth usage

### 3. Error Tracking (Recommended)
Consider adding error tracking:
- [Sentry](https://sentry.io/) - Free tier available
- [LogRocket](https://logrocket.com/) - Session replay
- [Rollbar](https://rollbar.com/) - Error monitoring

---

## 🚨 Post-Launch Monitoring

### Daily (First Week)
- [ ] Check Supabase error logs
- [ ] Monitor user signups
- [ ] Review failed login attempts
- [ ] Check database storage usage

### Weekly
- [ ] Review Lighthouse scores
- [ ] Check for dependency updates
- [ ] Monitor API performance
- [ ] Review user feedback

### Monthly
- [ ] Security audit
- [ ] Backup database
- [ ] Review access logs
- [ ] Update dependencies

---

## 🆘 Troubleshooting

### Service Worker Not Updating
1. Increment version in `service-worker.js`:
   ```javascript
   const CACHE_NAME = 'finance-roadmap-v2'; // increment
   ```
2. Clear browser cache
3. Unregister old service worker in DevTools

### PWA Not Installable
- Check manifest.json is valid (use Chrome DevTools)
- Ensure HTTPS is enabled (Netlify does this automatically)
- Verify service worker is registered
- Check start_url is accessible

### Authentication Not Working
- Verify Supabase URL and keys in `/utils/supabase/info.tsx`
- Check CORS is configured correctly
- Review Supabase auth logs
- Ensure Site URL is set in Supabase settings

### Users Can See Other Users' Data
- **CRITICAL:** RLS is not enabled or policies are wrong
- Go back to Supabase Dashboard → Enable RLS immediately
- Test policies with different user accounts

---

## 📝 Environment Variables

Make sure these are set in your deployment:

**Supabase (Already configured):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

**Future additions:**
- `SENTRY_DSN` (if using error tracking)
- `ANALYTICS_ID` (if using analytics)

---

## ✅ Final Pre-Launch Checklist

- [ ] RLS enabled on all tables
- [ ] CORS updated to production domain
- [ ] PWA icons generated and added
- [ ] Service worker registered
- [ ] Manifest.json configured
- [ ] Netlify.toml created
- [ ] Rate limiting tested
- [ ] Password validation tested
- [ ] Mobile installation tested (iOS & Android)
- [ ] Lighthouse PWA score 90+
- [ ] All authentication flows tested
- [ ] Privacy policy added (if collecting user data)
- [ ] Terms of service added
- [ ] Error monitoring configured
- [ ] Backup strategy planned
- [ ] Domain configured (if using custom domain)

---

## 🎉 You're Ready to Launch!

Once all items are checked, you're ready to allow users to download and create accounts. Good luck with your launch! 🚀
