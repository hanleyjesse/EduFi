# Simple Deployment Guide - No Tech Jargon!

Follow these steps IN ORDER. Don't skip ahead.

---

## PART 1: Download Your Code

**What you're doing:** Getting all your app files ready to upload to the internet.

### Steps:

1. **Click the "Export" or "Download" button** in Figma Make (wherever you see the option to download your project)
2. **Save the ZIP file** to your Downloads folder
3. **Unzip the file** (double-click it on Windows, or use "Extract All")
4. You should now have a folder with all your app files inside

✅ **You're done with Part 1!** Take a break if you need to.

---

## PART 2: Put Your App on the Internet (Netlify)

**What you're doing:** Making your app available online so anyone can visit it.

### Steps:

1. **Go to:** [https://www.netlify.com](https://www.netlify.com)

2. **Click** the "Sign up" button (top right corner)
   - Sign up with Google, GitHub, or email (your choice)
   - Complete the sign-up process

3. **You're now on your Netlify dashboard.** Click the big button that says:
   - **"Add new site"** or **"Sites"** → **"Add new site"**

4. **You'll see options.** Click:
   - **"Deploy manually"** or **"Drag and drop your site folder here"**

5. **Find your project folder** (the one you unzipped in Part 1)
   - Open that folder
   - Look for a folder called **`dist`** (this might be inside a "build" or main folder)
   - If you DON'T see a `dist` folder, you need to build it first:
     - **STOP HERE** and tell me "I don't have a dist folder" and I'll help you create it

6. **Drag the `dist` folder** onto the Netlify page
   - Wait for it to upload (you'll see a progress bar)
   - When it's done, you'll see "Site is live!"

7. **Copy your website URL:**
   - You'll see something like: `https://cheerful-unicorn-abc123.netlify.app`
   - **COPY THIS URL** - you'll need it in a minute
   - You can also rename it: Click "Site settings" → "Change site name"

✅ **You're done with Part 2!** Your app is now on the internet at that URL.

---

## PART 3: Make Your App Secure (CORS Configuration)

**What you're doing:** Making sure only YOUR website can talk to your database (not hackers).

### Steps:

1. **Open this file in Figma Make:**
   - `/supabase/functions/server/index.tsx`

2. **Find line 17.** It looks like this:
   ```
   origin: "*",
   ```

3. **Change that line to:**
   ```
   origin: "YOUR_NETLIFY_URL_HERE",
   ```
   - Replace `YOUR_NETLIFY_URL_HERE` with the URL you copied in Part 2
   - Example: `origin: "https://cheerful-unicorn-abc123.netlify.app",`
   - ⚠️ **IMPORTANT:** Keep the quotes and comma!

4. **Save the file** (Ctrl+S or Cmd+S)

✅ **You're done with Part 3!** Now let's upload this change to Supabase.

---

## PART 4: Upload Your Backend to Supabase

**What you're doing:** Putting your database code online so your app can save user data.

### Method A: Using Supabase Dashboard (Easiest)

1. **Go to:** [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Log in** (same account you used to set up Supabase originally)

3. **Click on your project** (it should be in the list)

4. **On the left sidebar, click:**
   - "Edge Functions" (has a ⚡ icon)

5. **Click** the function named:
   - `make-server-e7c89057`

6. **Click** "Edit function" or "Code" button

7. **You need to copy ALL the code from these files:**
   - Open `/supabase/functions/server/index.tsx` in Figma Make
   - Copy EVERYTHING in that file
   - Paste it into the Supabase editor
   - Click "Deploy" or "Save"

8. **Repeat step 7 for these files:**
   - `/supabase/functions/server/auth.tsx`
   - `/supabase/functions/server/net-worth.tsx`
   - (Don't edit `kv_store.tsx` - leave that alone)

⚠️ **NOTE:** This manual method works but is tedious. If you're comfortable with command line, see Method B below.

### Method B: Using Command Line (Faster but more technical)

**Only do this if you're comfortable typing commands.**

1. **Open Terminal** (Mac) or **Command Prompt** (Windows)

2. **Type this and press Enter:**
   ```
   npm install -g supabase
   ```
   Wait for it to finish.

3. **Type this and press Enter:**
   ```
   supabase login
   ```
   A browser window will open. Click "Authorize" or "Allow"

4. **Navigate to your project folder:**
   ```
   cd path/to/your/project/folder
   ```
   (Replace `path/to/your/project/folder` with the actual location)

5. **Link to your Supabase project:**
   ```
   supabase link --project-ref YOUR_PROJECT_ID
   ```
   - Find YOUR_PROJECT_ID: In Supabase dashboard → Project Settings → General → Reference ID
   - Copy it and replace YOUR_PROJECT_ID

6. **Deploy the function:**
   ```
   supabase functions deploy make-server-e7c89057
   ```
   Wait for "Deployed successfully!"

✅ **You're done with Part 4!** Your backend is now online.

---

## PART 5: Test Everything

**What you're doing:** Making sure everything works correctly.

### Steps:

1. **Open your Netlify URL** (the one from Part 2)
   - Example: `https://cheerful-unicorn-abc123.netlify.app`

2. **Try these things:**
   - ✅ Click "Continue Anonymously" - does it work?
   - ✅ Go back and click "Create Account" - can you sign up?
   - ✅ Sign in with your new account - does it work?
   - ✅ Click on roadmap steps - do modals open?
   - ✅ Try the Net Worth Tracker - can you save data?

3. **Open the browser console** to check for errors:
   - **Windows:** Press F12
   - **Mac:** Press Cmd+Option+I
   - Look at the "Console" tab
   - **You should see NO red errors**
   - If you see CORS errors, something went wrong in Part 3

4. **If everything works:** 🎉 YOU'RE DONE!

5. **If something doesn't work:**
   - Tell me exactly what error you see
   - Tell me which step failed
   - I'll help you fix it

---

## PART 6: Update Your App Later (When You Make Changes)

**What you're doing:** Uploading new versions of your app.

### When you change the FRONTEND (design, buttons, pages):

1. **Build your project** (in Figma Make or your code editor)
2. **Go to Netlify** → Your site → "Deploys"
3. **Drag the new `dist` folder** to the page
4. Done! Changes are live in 1-2 minutes

### When you change the BACKEND (database, authentication):

1. Use Method B from Part 4 (command line)
2. Run: `supabase functions deploy make-server-e7c89057`
3. Done! Changes are live immediately

---

## Quick Reference - URLs You Need

Write these down somewhere safe:

- **Your Netlify App:** `https://your-app-name.netlify.app` (from Part 2)
- **Supabase Dashboard:** `https://supabase.com/dashboard`
- **Netlify Dashboard:** `https://app.netlify.com`

---

## Help! Something Went Wrong

### "I don't have a dist folder"

You need to build your project first.

**In Figma Make:** Look for an "Export" or "Build" option
**OR in your terminal:**
```
npm install
npm run build
```

### "CORS error in the browser console"

You didn't update the CORS configuration correctly in Part 3.

1. Double-check line 17 in `/supabase/functions/server/index.tsx`
2. Make sure your Netlify URL is EXACTLY correct (no typos, keep the https://)
3. Redeploy the Supabase function (Part 4)

### "Site not found" on Netlify

1. Make sure you dragged the `dist` folder (not the whole project folder)
2. Make sure the `dist` folder has an `index.html` file inside it
3. If not, you need to build your project first (see "I don't have a dist folder" above)

### "Function not found" error

The Supabase function didn't deploy correctly.

1. Go back to Part 4
2. Try Method A (manual) if Method B didn't work
3. Make sure the function name is EXACTLY: `make-server-e7c89057`

---

## Done!

Your app is now:
- ✅ Live on the internet
- ✅ Secure (only your domain can access the database)
- ✅ Ready for users to sign up and use

**Share your Netlify URL with others to let them use your app!**
