# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Copy the example file and add your API keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual keys:

```env
# Supabase (get from https://app.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Geoapify (get from https://www.geoapify.com)
NEXT_PUBLIC_GEOAPIFY_KEY=your_geoapify_key_here

# OpenRouter (get from https://openrouter.ai)
OPENROUTER_API_KEY=your_openrouter_key_here
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click **Run**

This creates:
- ✅ `incidents` table with proper schema
- ✅ Row-Level Security policies
- ✅ 20 seed incidents across Toronto

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Where to Get API Keys

### Supabase
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project (free tier is fine)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Geoapify
1. Sign up at [geoapify.com](https://www.geoapify.com)
2. Go to **My Projects**
3. Create a new project
4. Copy the **API Key** → `NEXT_PUBLIC_GEOAPIFY_KEY`
5. Free tier: 3,000 requests/day

### OpenRouter
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to **Keys** in your account
3. Create a new API key → `OPENROUTER_API_KEY`
4. Free tier available for some models (like Llama 3.1 8B)

---

## ✅ Verify Setup

After running `npm run dev`, you should see:

1. **Homepage** with Toronto map
2. **Incident markers** (if seed data was loaded)
3. **"Report an Emergency"** button working
4. **Category selection** page navigable

---

## 🐛 Troubleshooting

### Map not loading
- Check console for Leaflet errors
- Ensure you're using a browser with good JavaScript support
- Clear browser cache and reload

### "Missing Supabase environment variables"
- Double-check `.env.local` file exists
- Ensure all variables are filled in
- Restart dev server (`npm run dev`)

### Database policies not working
- Verify RLS is enabled: `ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;`
- Check policies in Supabase dashboard under **Authentication** → **Policies**

### AI Guidance not responding
- Check OpenRouter API key is valid
- Check browser console for errors
- Fallback guidance should still work even if API fails

---

## 📱 Test the App

1. **Report an Incident**
   - Click "Report an Emergency"
   - Select a category
   - Add optional description
   - Confirm location
   - View confirmation page

2. **View Incidents**
   - See seed data on homepage map
   - Click markers to view details
   - Test AI guidance button

3. **Find Emergency Services**
   - After submitting a report
   - Click "Find Nearby Services"
   - See hospitals, police, fire stations

---

## 🎨 Customization

Want to customize the app?

- **Colors**: Edit `tailwind.config.ts`
- **Categories**: Update `types/index.ts` and database migration
- **Map Center**: Change `TORONTO_CENTER` in map components
- **AI Model**: Update model in `app/api/guidance/route.ts`

---

## 📚 Next Steps

Read the full [README.md](./README.md) for:
- Architecture decisions
- Security considerations
- Design system documentation
- Interview talking points

---

**Need help?** Check the README or open an issue in the project repository.
