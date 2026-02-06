# GTA Watch

**Anonymous emergency awareness and guidance tool for the Greater Toronto Area**

---

## 🎯 Purpose

GTA Watch is a portfolio-quality, production-ready demo showcasing:

- **Frontend Architecture** – Clean separation of concerns, reusable components
- **UX Under Stress** – Calm, accessible interface designed for users in emergencies
- **Pragmatic API Integration** – OpenRouter (AI), Supabase (data), Geoapify (maps)
- **Accessibility** – WCAG AA compliance, keyboard navigation, screen reader support
- **Anonymous by Default** – No authentication, no tracking, no user accounts

This project is intended for **mid-to-senior frontend engineering interviews** at startups and agencies. It demonstrates technical depth, design thinking, and real-world tradeoffs.

---

## 🏗️ Architecture

### Tech Stack

| Layer           | Technology                    |
| --------------- | ----------------------------- |
| **Framework**   | Next.js 14 (App Router)       |
| **Language**    | TypeScript                    |
| **Styling**     | Tailwind CSS                  |
| **Maps**        | Leaflet + react-leaflet       |
| **Database**    | Supabase (PostgreSQL + RLS)   |
| **AI**          | OpenRouter (Llama 3.1)        |
| **Geocoding**   | Geoapify                      |
| **Deployment**  | Vercel-ready (not included)   |

### Data Flow

```
User Browser
    ↓
Next.js Frontend (Client-Side)
    ↓
├─→ Supabase (Anonymous Read/Write)
├─→ Geoapify API (Geocoding, POI)
└─→ Next.js API Route (/api/guidance)
        ↓
    OpenRouter API (AI Guidance)
```

### Key Design Decisions

#### 1. Why Anonymous?
Users under stress may fear identification or retaliation. Removing authentication reduces friction and increases trust.

#### 2. Why 24-Hour Incident Window?
Emergency context changes rapidly. Stale incidents can misinform users. The 24-hour window enforced via RLS ensures data relevance.

#### 3. Why Row-Level Security (RLS)?
Defense-in-depth. Even with anonymous access, RLS prevents:
- Incidents older than 24 hours from being read
- Any updates or deletes to existing incidents
- Unauthorized writes (only INSERT allowed)

#### 4. Why Server-Side AI Route?
Prevents API key exposure. Allows rate limiting and logging. Keeps sensitive credentials out of client bundles.

#### 5. Why Leaflet Instead of Google Maps?
- Open-source
- No usage limits or billing surprises
- Full control over styling and markers
- Suitable for portfolio projects

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Geoapify API key (free tier: 3,000 requests/day)
- OpenRouter API key (free tier available for some models)

### Installation

1. **Clone and Install**

```bash
cd gta-watch
npm install
```

2. **Configure Environment Variables**

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your actual API keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

NEXT_PUBLIC_GEOAPIFY_KEY=your_geoapify_key_here

OPENROUTER_API_KEY=your_openrouter_key_here
```

3. **Run Database Migration**

In your Supabase dashboard:
- Go to **SQL Editor**
- Create a new query
- Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
- Run the migration

This will:
- Create the `incidents` table
- Set up Row-Level Security policies
- Seed 20 mock incidents across Toronto

4. **Start Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
gta-watch/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata
│   ├── page.tsx                # Homepage with map + CTAs
│   ├── globals.css             # Global styles + Leaflet overrides
│   ├── api/
│   │   └── guidance/route.ts   # Server-only OpenRouter integration
│   └── report/
│       ├── page.tsx            # Step 1: Category selection
│       ├── description/page.tsx # Step 2: Optional description
│       ├── location/page.tsx    # Step 3: Location confirmation
│       └── confirmation/page.tsx # Step 4: Submit + guidance
├── components/
│   ├── map/
│   │   ├── incident-map.tsx    # Main Leaflet map with markers
│   │   └── location-picker.tsx # Draggable pin for location
│   └── guidance/
│       └── ai-guidance-panel.tsx # AI response modal
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client (anon key)
│   │   ├── server.ts           # Server client (service role)
│   │   └── types.ts            # Generated database types
│   ├── geoapify.ts             # Geocoding + POI search
│   └── utils.ts                # Date formatting, coord rounding
├── types/
│   └── index.ts                # Incident, Category, Location types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # DB schema + RLS + seed
├── tailwind.config.ts          # Design tokens (colors from spec)
├── .env.local.example          # Template for API keys
└── README.md                   # This file
```

---

## 🔐 Security Considerations

This is a **portfolio project**, not a production system. However, best practices are followed:

### Implemented
✅ API keys stored in environment variables  
✅ Server-side AI route (no client-side API key exposure)  
✅ Row-Level Security on Supabase  
✅ Coordinate rounding (privacy via precision reduction)  
✅ No user tracking or cookies  
✅ Input validation (max description length)  

### Not Implemented (Intentional Omissions)
❌ Rate limiting (would require Redis or serverless KV)  
❌ CAPTCHA (would harm UX under stress)  
❌ IP geolocation blocking (out of scope)  
❌ Content moderation (AI or human review)  

---

## 🎨 Design System

### Colors

```typescript
{
  background: "#0F1722",    // Dark navy
  surface: "#0B1220",       // Darker surface
  "text-main": "#E6EEF6",   // Light gray
  muted: "#9AA4B2",         // Muted gray
  primary: "#0EA5A4",       // Teal (calm, trustworthy)
  accent: "#7C3AED",        // Purple
  success: "#16A34A",       // Green
  warning: "#F59E0B",       // Amber
  danger: "#DC2626",        // Red
}
```

### Typography

- **Font**: Inter (Google Fonts)
- **H1**: 32px (2xl) - Page titles
- **H2**: 20px (xl) - Section headers
- **Body**: 16px (base) - Main text
- **Small**: 13px (sm) - Metadata, labels

### Accessibility

- ✅ Keyboard navigable (all interactive elements)
- ✅ Focus-visible rings (2px primary outline)
- ✅ ARIA labels on buttons and inputs
- ✅ `aria-live` regions for AI responses
- ✅ `role="radio"` for category tiles
- ✅ Semantic HTML (`<main>`, `<nav>`, `<article>`)
- ✅ Color contrast > 4.5:1 (WCAG AA)

---

## 🤖 AI Guidance

### Model

**OpenRouter**: `meta-llama/llama-3.1-8b-instruct:free`

- Fast inference (<2s)
- Free tier available
- Suitable for structured output

### Prompt Design

```
System: You are an emergency guidance assistant for GTA Watch.

Rules:
- Provide CALM, structured, actionable guidance
- NEVER claim to contact authorities
- NEVER ask follow-up questions
- Keep responses under 300 words
- Always suggest calling 911 if life-threatening
```

### Fallback Guidance

If OpenRouter is unavailable, hardcoded fallback guidance is returned based on incident category. This ensures the app remains functional even if the AI API fails.

---

## 🗺️ Map Implementation

### Leaflet Configuration

- **Center**: Toronto (43.6532, -79.3832)
- **Zoom**: 11 (city-wide view)
- **Tiles**: OpenStreetMap (free, no API key)
- **Markers**: Small circular dots (12px) with category colors
- **Clustering**: Disabled (clarity over performance)

### Category Colors

| Category      | Color   | Hex       |
| ------------- | ------- | --------- |
| Shooting      | Red     | `#DC2626` |
| Medical       | Orange  | `#F59E0B` |
| Fire          | Red     | `#EF4444` |
| Accident      | Yellow  | `#FBBF24` |
| Assault       | Purple  | `#7C3AED` |
| Suspicious    | Blue    | `#3B82F6` |
| Theft         | Purple  | `#8B5CF6` |
| Other         | Gray    | `#6B7280` |

---

## 📊 Database Schema

### Table: `incidents`

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN (
    'shooting', 'medical', 'fire', 'accident',
    'assault', 'suspicious', 'theft', 'other'
  )),
  description TEXT CHECK (length(description) <= 200),
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(11, 7) NOT NULL,
  location_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Allow anonymous INSERT
CREATE POLICY "Allow anonymous insert"
ON incidents FOR INSERT TO anon
WITH CHECK (true);

-- Allow SELECT for last 24 hours only
CREATE POLICY "Allow read incidents from last 24h"
ON incidents FOR SELECT TO anon, authenticated
USING (created_at > NOW() - INTERVAL '24 hours');

-- No UPDATE or DELETE allowed
```

---

## 🚧 Known Limitations

### By Design
- **No Authentication** – Intentional for anonymity
- **No Real-Time 911 Integration** – This is a community awareness tool, not an emergency service dispatcher
- **No User Profiles** – Contradicts anonymous design
- **24-Hour Data Retention** – Older incidents auto-expire via RLS

### Technical Constraints
- **Leaflet SSR** – Requires `dynamic` import with `ssr: false`
- **Geoapify Rate Limits** – Free tier: 3,000 requests/day
- **OpenRouter Free Tier** – May have rate limits or queue times

---

## 🎯 Interview Talking Points

When presenting this project in an interview, highlight:

1. **UX Under Stress**
   - Calm color palette (teal, not red)
   - Large touch targets (44px+)
   - Clear CTAs ("Call 911 Now" vs "Get Guidance")

2. **Architectural Decisions**
   - Why anonymous (trust + friction reduction)
   - Why RLS (defense-in-depth)
   - Why server-side AI route (security)

3. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Focus-visible rings
   - Screen reader support

4. **Pragmatic Tradeoffs**
   - No clustering (clarity over performance)
   - No real-time (24-hour window sufficient)
   - Fallback guidance (degrades gracefully)

5. **Production Readiness**
   - TypeScript for type safety
   - Environment variables for secrets
   - Error boundaries (implicit in Next.js)
   - Responsive design (mobile-first)

---

## 📝 License

This is a portfolio project. Feel free to use it as reference material for your own work.

**NOT FOR PRODUCTION USE** without proper legal review, liability disclaimers, and content moderation systems.

---

## 🙏 Acknowledgments

- OpenStreetMap contributors for map tiles
- Supabase for anonymous data storage
- OpenRouter for accessible AI APIs
- Geoapify for geocoding services

---

## 📧 Contact

Built as a portfolio demonstration of frontend engineering best practices.

**Key Features:**
- Next.js 14 App Router
- TypeScript + Tailwind CSS
- Supabase RLS + OpenRouter AI
- Leaflet maps + Geoapify geocoding
- Fully accessible (WCAG AA)
- Anonymous by design

---

**⚠️ Disclaimer:** This is NOT a replacement for 911. In a life-threatening emergency, always call your local emergency services immediately.
