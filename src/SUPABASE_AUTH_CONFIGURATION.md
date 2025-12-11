# Supabase Auth URL Configuration Guide

## 🎯 What Are Auth URLs?

Supabase Auth URLs control where users are redirected after authentication events like:
- Email confirmation
- Password reset
- OAuth sign-in
- Magic link sign-in

Currently, these are likely set to default values or localhost, which won't work in production.

---

## ⚠️ Current Issue

If your Supabase Auth URLs aren't configured for your production domain, users will experience:
- ❌ Broken email confirmation links
- ❌ Password reset links going to the wrong domain
- ❌ OAuth redirects failing
- ❌ General authentication errors

---

## ✅ Step 1: Access Supabase Auth Settings

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**

---

## ✅ Step 2: Configure Auth URLs

Update these settings with your Netlify domain:

### Site URL
**What it is:** The main URL of your application.

**Set to:** `https://your-app-name.netlify.app`

### Redirect URLs (Allowlist)
**What it is:** URLs that Supabase is allowed to redirect to after authentication.

**Add these:**
```
https://your-app-name.netlify.app
https://your-app-name.netlify.app/**
http://localhost:5173
http://localhost:5173/**
```

> **Note:** The `/**` wildcard allows redirects to any page in your app.

---

## ✅ Step 3: Email Template Configuration

If you plan to use email-based authentication (sign up, password reset), you need to configure email templates:

1. Go to: **Authentication** → **Email Templates**
2. Update these templates:

### Confirm Signup Template
**Default:** `{{ .ConfirmationURL }}`
**Update to:** `https://your-app-name.netlify.app/auth/confirm?token={{ .Token }}`

> **Note:** You'll need to create an `/auth/confirm` page in your app to handle this.

### Reset Password Template
**Default:** `{{ .ResetPasswordURL }}`
**Update to:** `https://your-app-name.netlify.app/auth/reset-password?token={{ .Token }}`

> **Note:** You'll need to create an `/auth/reset-password` page in your app to handle this.

---

## ✅ Step 4: Test Authentication

After configuring Auth URLs:

### Test Sign Up
1. Create a new account on your Netlify app
2. Check your email for confirmation
3. Click the confirmation link
4. Verify you're redirected to your app (not an error page)

### Test Sign In
1. Sign in with your test account
2. Verify no redirect errors
3. Check browser console for any auth errors

### Test Sign Out
1. Sign out of your account
2. Verify you're redirected to the sign-in page
3. No errors should appear

---

## 🔧 Advanced: OAuth Configuration

If you plan to use social login (Google, GitHub, etc.):

### Configure OAuth Provider

1. Go to: **Authentication** → **Providers**
2. Enable your desired provider (e.g., Google)
3. **Redirect URL:** Use the one provided by Supabase
4. **Site URL:** `https://your-app-name.netlify.app`

### Update Your Code

The OAuth redirect is already configured in your app, but verify it's using the correct URLs:

**File:** `/components/SignInPage.tsx` (if you add OAuth)

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://your-app-name.netlify.app'
  }
});
```

---

## 🔍 Troubleshooting

### Issue: "Invalid redirect URL"

**Problem:** The redirect URL isn't in your allowlist.

**Solution:** 
1. Check the exact URL in the error message
2. Add it to **Redirect URLs** in Supabase dashboard
3. Make sure to include both `http://localhost:5173` AND your Netlify domain

### Issue: Email links redirect to localhost

**Problem:** Site URL is still set to localhost.

**Solution:**
1. Update **Site URL** to your Netlify domain
2. Update **Email Templates** as described in Step 3
3. Send a new test email (old emails will still have the old URL)

### Issue: "Email already registered" but I can't sign in

**Problem:** User was created but email wasn't confirmed.

**Solution:**
1. Go to: **Authentication** → **Users**
2. Find your user
3. Click the **"..."** menu → **Confirm email**
4. Or delete the user and try signing up again

---

## 🌐 Custom Domain (Optional)

If you want to use a custom domain instead of `.netlify.app`:

### Step 1: Add Custom Domain in Netlify
1. Go to your Netlify site → **Domain management**
2. Click **"Add custom domain"**
3. Follow Netlify's instructions to configure DNS
4. Wait for SSL certificate to be issued (automatic)

### Step 2: Update Supabase Auth URLs
Replace `https://your-app-name.netlify.app` with your custom domain:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/**`

### Step 3: Update CORS Configuration
Update `/supabase/functions/server/index.tsx`:
```typescript
origin: "https://yourdomain.com",
```

### Step 4: Redeploy
- Deploy updated CORS config to Supabase
- Netlify will automatically rebuild

---

## ✅ Security Checklist

Before going to production:

- [ ] Site URL is set to your production domain
- [ ] Redirect URLs include your production domain
- [ ] Email templates use production domain URLs
- [ ] Tested sign up flow end-to-end
- [ ] Tested sign in flow
- [ ] Tested sign out flow
- [ ] OAuth providers configured (if using)
- [ ] Email confirmation works correctly
- [ ] Password reset works correctly

---

## 📋 Development vs Production

### Development (localhost)
```
Site URL: http://localhost:5173
Redirect URLs: 
  - http://localhost:5173/**
CORS origin: "http://localhost:5173"
```

### Production (Netlify)
```
Site URL: https://your-app-name.netlify.app
Redirect URLs: 
  - https://your-app-name.netlify.app/**
  - http://localhost:5173/** (keep for local development)
CORS origin: "https://your-app-name.netlify.app"
```

---

## 🆘 Need Help?

- [Supabase Auth Configuration Docs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Netlify Custom Domains](https://docs.netlify.com/domains-https/custom-domains/)

---

## 📝 Quick Reference

| Setting | Location | Value |
|---------|----------|-------|
| Site URL | Auth → URL Configuration | `https://your-app-name.netlify.app` |
| Redirect URLs | Auth → URL Configuration | `https://your-app-name.netlify.app/**` |
| CORS Origin | Edge Function code | `"https://your-app-name.netlify.app"` |
| Email Templates | Auth → Email Templates | Update all `{{ .URL }}` variables |

---

**✅ Once you complete these steps, your authentication will work correctly in production!**
