# J. Joseph Salon Website Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild jjosephsalon.com from WordPress to a scroll-driven, cinematic Astro 5 site with GSAP animations, Lenis smooth scroll, and Boulevard booking integration.

**Architecture:** Astro 5 with React islands for interactive components. Content lives in JSON/Markdown via Astro Content Collections. GSAP + ScrollTrigger powers all scroll-pinned scenes and animations. Lenis provides smooth scroll globally. Tailwind CSS 4 for styling with custom design tokens. Deployed to Vercel.

**Tech Stack:** Astro 5, React 19, GSAP + ScrollTrigger, Lenis, Tailwind CSS 4, TypeScript, Vercel

**Spec:** `docs/2026-04-16-jjs-redesign-spec.md`

---

## File Structure

```
jjosephsalon/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   ├── fonts/                          # Self-hosted Space Grotesk + Instrument Sans
│   │   ├── SpaceGrotesk-Variable.woff2
│   │   └── InstrumentSans-Variable.woff2
│   ├── images/
│   │   ├── hero-placeholder.jpg        # Placeholder until real photography
│   │   ├── locations/                   # Per-location photos
│   │   └── services/                    # Per-service photos
│   └── favicon.svg
├── src/
│   ├── content.config.ts               # Collection definitions
│   ├── styles/
│   │   └── global.css                  # Tailwind + @theme design tokens + base styles
│   ├── layouts/
│   │   └── Layout.astro                # Base layout: meta, fonts, Lenis init, grain overlay, cursor
│   ├── pages/
│   │   ├── index.astro                 # Homepage — orchestrates the 6 scenes
│   │   ├── services.astro
│   │   ├── locations.astro
│   │   ├── level-system.astro
│   │   ├── about.astro
│   │   ├── book.astro
│   │   ├── connect.astro
│   │   ├── gift-cards.astro
│   │   ├── salon-policies.astro
│   │   ├── privacy-policy.astro
│   │   ├── cookies-policy.astro
│   │   └── services/
│   │       ├── curly-hair-experience.astro
│   │       └── cutting-specialist.astro
│   ├── components/
│   │   ├── Nav.astro                   # Persistent minimal nav bar (static — no JS)
│   │   ├── MenuOverlay.tsx             # Full-screen menu overlay (React island)
│   │   ├── BookButton.tsx              # Sacred "Book" CTA — triggers Boulevard
│   │   ├── MobileBookBar.tsx           # Fixed bottom bar on mobile
│   │   ├── Cursor.tsx                  # Custom cursor (React island, desktop only)
│   │   ├── GrainOverlay.astro          # SVG noise texture overlay (static)
│   │   ├── FooterMinimal.astro         # One-line footer (static)
│   │   ├── home/
│   │   │   ├── Scene1Hero.tsx          # Hero scene — text reveal, video bg
│   │   │   ├── Scene2Pinned.tsx        # Scroll-pinned brand narrative
│   │   │   ├── Scene3Services.tsx      # Horizontal scroll services
│   │   │   ├── Scene4Locations.tsx     # Interactive location index
│   │   │   ├── Scene5Quote.tsx         # Single testimonial moment
│   │   │   └── Scene6CTA.astro        # "It's You Time" close (static)
│   │   ├── services/
│   │   │   └── ServiceList.astro       # Service category with pricing
│   │   ├── locations/
│   │   │   └── LocationSection.astro   # Full location section
│   │   └── level-system/
│   │       └── LevelTrack.tsx          # Interactive level progression
│   ├── data/
│   │   ├── services.json               # All services with pricing
│   │   ├── locations.json              # All 5 locations with details
│   │   ├── levels.json                 # 9+1 stylist levels
│   │   └── site.json                   # Global site config (phone, email, social links)
│   ├── content/
│   │   ├── policies/
│   │   │   ├── salon-policies.md
│   │   │   ├── privacy-policy.md
│   │   │   └── cookies-policy.md
│   │   └── about/
│   │       └── about.md
│   └── lib/
│       ├── boulevard.ts                # Boulevard overlay trigger helper
│       └── reviews.ts                  # Google Reviews fetch + cache (future)
├── docs/
│   └── 2026-04-16-jjs-redesign-spec.md
└── vercel.json                         # Redirect rules (old WP URLs → new)
```

---

## Phase 1: Project Foundation

### Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/layouts/Layout.astro`, `src/pages/index.astro`

- [ ] **Step 1: Create Astro project**

```bash
cd /c/Users/cnacc
npm create astro@latest jjosephsalon-new -- --template minimal --typescript strict --install --git
cd jjosephsalon-new
```

Select: Empty project, Strict TypeScript, Install dependencies, Initialize git.

- [ ] **Step 2: Add React integration and install dependencies**

```bash
npx astro add react
npm install tailwindcss @tailwindcss/vite
npm install gsap @gsap/react
npm install lenis
```

- [ ] **Step 3: Configure `astro.config.mjs`**

Replace the contents with:

```js
// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Update `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@data/*": ["src/data/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

- [ ] **Step 5: Create `src/styles/global.css` with design tokens**

```css
@import "tailwindcss";

@theme {
  --color-black: #0C0B09;
  --color-black-warm: #141210;
  --color-surface: #1C1A17;
  --color-gold: #AF831A;
  --color-gold-soft: #C4A044;
  --color-cream: #F4F1EB;
  --color-cream-dark: #E8E3DA;

  --font-heading: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Instrument Sans", system-ui, sans-serif;
}

@font-face {
  font-family: "Space Grotesk";
  src: url("/fonts/SpaceGrotesk-Variable.woff2") format("woff2");
  font-weight: 300 700;
  font-display: swap;
}

@font-face {
  font-family: "Instrument Sans";
  src: url("/fonts/InstrumentSans-Variable.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Instrument Sans";
  src: url("/fonts/InstrumentSans-Italic-Variable.woff2") format("woff2");
  font-weight: 400 700;
  font-style: italic;
  font-display: swap;
}

/* Base resets */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-black);
  color: var(--color-cream);
  overflow-x: hidden;
  line-height: 1.55;
}

/* Lenis base styles */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

/* Custom cursor — desktop only */
@media (pointer: fine) {
  body { cursor: none; }
  a, button, [role="button"] { cursor: none; }
}
```

- [ ] **Step 6: Download and place font files**

```bash
mkdir -p public/fonts public/images/locations public/images/services
```

Download the variable font files from Google Fonts:
- Space Grotesk Variable: `public/fonts/SpaceGrotesk-Variable.woff2`
- Instrument Sans Variable: `public/fonts/InstrumentSans-Variable.woff2`
- Instrument Sans Italic Variable: `public/fonts/InstrumentSans-Italic-Variable.woff2`

```bash
# Use google-webfonts-helper or fontsource
npm install @fontsource-variable/space-grotesk @fontsource-variable/instrument-sans
```

Then copy the woff2 files from `node_modules/@fontsource-variable/*/files/` to `public/fonts/`, or import directly in global.css:

```css
/* Alternative: import from fontsource instead of @font-face */
/* @import "@fontsource-variable/space-grotesk"; */
/* @import "@fontsource-variable/instrument-sans"; */
```

- [ ] **Step 7: Create base `Layout.astro`**

Create `src/layouts/Layout.astro`:

```astro
---
import "@/styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "J. Joseph Salon — Upscale hair salons in Tampa Bay. Voted Best in Tampa Bay." } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" href="/fonts/SpaceGrotesk-Variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/InstrumentSans-Variable.woff2" as="font" type="font/woff2" crossorigin />
  </head>
  <body>
    <!-- Grain overlay -->
    <div class="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03]"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;); background-repeat: repeat; background-size: 200px;"
      aria-hidden="true">
    </div>

    <slot />

    <!-- Lenis smooth scroll init -->
    <script>
      import Lenis from "lenis";
      import gsap from "gsap";
      import { ScrollTrigger } from "gsap/ScrollTrigger";

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis();

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    </script>
  </body>
</html>
```

- [ ] **Step 8: Create placeholder `index.astro`**

Create `src/pages/index.astro`:

```astro
---
import Layout from "@/layouts/Layout.astro";
---

<Layout title="J. Joseph Salon — Voted Best in Tampa Bay">
  <main>
    <section class="flex h-screen items-center justify-center">
      <h1 class="font-heading text-6xl font-bold tracking-tight text-cream">
        J. Joseph Salon
      </h1>
    </section>
  </main>
</Layout>
```

- [ ] **Step 9: Verify dev server runs**

```bash
npm run dev
```

Expected: Site loads at `http://localhost:4321` showing "J. Joseph Salon" centered on a dark background with smooth scroll active and grain overlay visible.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro 5 project with React, Tailwind 4, GSAP, Lenis

- Astro 5 with React islands integration
- Tailwind CSS 4 via Vite plugin with JJS design tokens
- GSAP + ScrollTrigger registered globally
- Lenis smooth scroll synced to GSAP ticker
- Self-hosted Space Grotesk + Instrument Sans fonts
- Grain overlay and custom cursor styles
- Base Layout with meta, font preloads, Lenis init"
```

---

### Task 2: Data Layer — Content Collections + JSON Data

**Files:**
- Create: `src/data/services.json`, `src/data/locations.json`, `src/data/levels.json`, `src/data/site.json`
- Create: `src/content.config.ts`

- [ ] **Step 1: Create `src/data/site.json`**

```json
{
  "name": "J. Joseph Salon",
  "tagline": "Where Artistry Meets Excellence.",
  "phone": "813-235-6848",
  "email": "info@jjosephsalon.com",
  "social": {
    "instagram": "https://www.instagram.com/jjosephsalon/",
    "tiktok": "https://www.tiktok.com/@jjosephsalon",
    "facebook": "https://www.facebook.com/jjosephsalon/"
  },
  "careers_url": "https://careers.jjosephsalon.com",
  "google_rating": "5.0",
  "google_review_count": "789+",
  "google_maps_url": "https://maps.google.com/?cid=YOUR_CID"
}
```

- [ ] **Step 2: Create `src/data/locations.json`**

```json
[
  {
    "id": "land-o-lakes",
    "name": "Land O' Lakes",
    "tag": "Original",
    "address": "5132 Land O' Lakes Blvd",
    "city": "Land O' Lakes",
    "state": "FL",
    "zip": "34639",
    "phone": "813-235-6848 ext 1",
    "email": "info@jjosephsalon.com",
    "instagram": "@jjosephsalon",
    "hours": {
      "monday": "9:00AM - 6:00PM",
      "tuesday": "9:00AM - 7:00PM",
      "wednesday": "9:00AM - 7:00PM",
      "thursday": "9:00AM - 7:00PM",
      "friday": "9:00AM - 7:00PM",
      "saturday": "9:00AM - 6:00PM",
      "sunday": "11:00AM - 5:00PM"
    },
    "description": "Welcome to the original J. Joseph Salon. Located in the Dupree Plaza at the intersection of Dupree Drive and Land O'Lakes Boulevard. This salon houses high level stylists who specialize and teach innovative haircuts, advanced hair color techniques, and hair extensions.",
    "image": "/images/locations/land-o-lakes.webp",
    "mapEmbed": ""
  },
  {
    "id": "lutz",
    "name": "Lutz",
    "tag": "As Seen on Daytime TV",
    "address": "18861 FL-54",
    "city": "Lutz",
    "state": "FL",
    "zip": "33558",
    "phone": "813-235-6848 ext 2",
    "email": "info@jjosephsalon.com",
    "instagram": "@jjosephsalon",
    "hours": {
      "monday": "9:00AM - 6:00PM",
      "tuesday": "9:00AM - 8:00PM",
      "wednesday": "9:00AM - 8:00PM",
      "thursday": "9:00AM - 8:00PM",
      "friday": "9:00AM - 8:00PM",
      "saturday": "9:00AM - 6:00PM",
      "sunday": "11:00AM - 5:00PM"
    },
    "description": "Our Lutz location is well-known for the Monday Makeovers on the syndicated television talk show \"Daytime\". Our talented hair stylists have been featured in national and international hair shows.",
    "image": "/images/locations/lutz.webp",
    "mapEmbed": ""
  },
  {
    "id": "citrus-park",
    "name": "Citrus Park",
    "tag": "Creative Hub",
    "address": "8616 Citrus Park Dr",
    "city": "Tampa",
    "state": "FL",
    "zip": "33625",
    "phone": "813-235-6848 ext 3",
    "email": "info@jjosephsalon.com",
    "instagram": "@jjosephsalon",
    "hours": {
      "monday": "9:00AM - 6:00PM",
      "tuesday": "9:00AM - 8:00PM",
      "wednesday": "9:00AM - 8:00PM",
      "thursday": "9:00AM - 8:00PM",
      "friday": "9:00AM - 8:00PM",
      "saturday": "9:00AM - 6:00PM",
      "sunday": "11:00AM - 5:00PM"
    },
    "description": "This vibrant modern salon is home to some of J. Joseph's most talented and world-traveled stylists, housing many of J. Joseph's creative team. Located in front of Citrus Park Mall off Citrus Park Drive.",
    "image": "/images/locations/citrus-park.webp",
    "mapEmbed": ""
  },
  {
    "id": "odessa",
    "name": "Odessa",
    "tag": "Tampa A-List Winner",
    "address": "13541 FL-54",
    "city": "Odessa",
    "state": "FL",
    "zip": "33556",
    "phone": "813-235-6848 ext 4",
    "email": "info@jjosephsalon.com",
    "instagram": "@jjosephsalon",
    "hours": {
      "monday": "9:00AM - 6:00PM",
      "tuesday": "9:00AM - 8:00PM",
      "wednesday": "9:00AM - 8:00PM",
      "thursday": "9:00AM - 8:00PM",
      "friday": "9:00AM - 8:00PM",
      "saturday": "9:00AM - 6:00PM",
      "sunday": "11:00AM - 5:00PM"
    },
    "description": "One of our most highly decorated locations in Starkey Ranch Town Square. Named best hair salon by Tampa A-List. An upscale salon offering stylish haircuts, award-winning color and highlights, professional hair extensions, and Keratin treatments.",
    "image": "/images/locations/odessa.webp",
    "mapEmbed": ""
  },
  {
    "id": "wesley-chapel",
    "name": "Wesley Chapel",
    "tag": "Newest",
    "address": "1738 Bruce B Downs Blvd",
    "city": "Wesley Chapel",
    "state": "FL",
    "zip": "33544",
    "phone": "813-235-6848 ext 5",
    "email": "info@jjosephsalon.com",
    "instagram": "@jjosephsalon",
    "hours": {
      "monday": "9:00AM - 6:00PM",
      "tuesday": "9:00AM - 8:00PM",
      "wednesday": "9:00AM - 8:00PM",
      "thursday": "9:00AM - 8:00PM",
      "friday": "9:00AM - 8:00PM",
      "saturday": "9:00AM - 6:00PM",
      "sunday": "11:00AM - 5:00PM"
    },
    "description": "Our Wesley Chapel branch at the Shops at New Tampa is renowned for its modern elegance. Expert hair stylists celebrated in local and international styling circles. Houses J. Joseph Salon's most senior stylists with a combined experience of over 30 years.",
    "image": "/images/locations/wesley-chapel.webp",
    "mapEmbed": ""
  }
]
```

- [ ] **Step 3: Create `src/data/services.json`**

```json
{
  "categories": [
    {
      "id": "hair",
      "name": "Hair",
      "services": [
        { "name": "Women's Haircut & Style", "price": "$51" },
        { "name": "Men's Haircut & Style", "price": "$41" },
        { "name": "Shampoo & Finish", "price": "$46" },
        { "name": "Bang Trim", "price": "$23" },
        { "name": "Beard Trim", "price": "$18" },
        { "name": "Special Occasion Hair", "price": "$67" },
        { "name": "Updo", "price": "$82" },
        { "name": "Flat Iron", "price": "$15" },
        { "name": "Curling Iron", "price": "$15" }
      ]
    },
    {
      "id": "color",
      "name": "Color",
      "services": [
        { "name": "Color Retouch", "price": "$75" },
        { "name": "Full Color", "price": "$120" },
        { "name": "Gels", "price": "$82" },
        { "name": "Shades EQ", "price": "$79" },
        { "name": "Men's Color Camo", "price": "$58" },
        { "name": "Face Framing Highlights", "price": "$88" },
        { "name": "Partial Highlights", "price": "$99" },
        { "name": "¾ Highlights", "price": "$115" },
        { "name": "Full Highlights", "price": "$127" },
        { "name": "Face Framing Balayage", "price": "$110" },
        { "name": "Partial Balayage", "price": "$125" },
        { "name": "¾ Balayage", "price": "$135" },
        { "name": "Full Balayage", "price": "$151" },
        { "name": "Wet Balayage", "price": "$52" },
        { "name": "Additional Colors", "price": "$43" },
        { "name": "Accent Foils (Per Foil)", "price": "$20" },
        { "name": "Cap Highlights", "price": "$95" },
        { "name": "Glaze", "price": "$51" },
        { "name": "Corrective Color (hour)", "price": "$100" },
        { "name": "Brow Tint", "price": "$30" }
      ]
    },
    {
      "id": "texture",
      "name": "Texture",
      "services": [
        { "name": "Keratin", "price": "Consultation" },
        { "name": "Perm", "price": "$130" }
      ]
    },
    {
      "id": "treatments",
      "name": "Treatments",
      "services": [
        { "name": "Deep Conditioning", "price": "$42" },
        { "name": "Clarifying Treatment", "price": "$34" },
        { "name": "Redken Pre-Art", "price": "$35" },
        { "name": "K-18 Treatment", "price": "$65" }
      ]
    },
    {
      "id": "waxing",
      "name": "Waxing",
      "services": [
        { "name": "Brow Shaping", "price": "$25" },
        { "name": "Lip Wax", "price": "$20" },
        { "name": "Chin Wax", "price": "$20" },
        { "name": "Brow / Lip Combo", "price": "$34" },
        { "name": "Brow Threading", "price": "$25" },
        { "name": "Lip or Chin Threading", "price": "$20" },
        { "name": "Full Face Threading", "price": "$48" }
      ]
    }
  ],
  "pricing_note": "Our prices vary based on the stylist level. The prices shown are for Foundation stylists only. We aim to offer competitive prices across all levels. For any questions about our pricing or services, please contact us.",
  "homepage_services": [
    {
      "id": "cut-style",
      "name": "Cut & Style",
      "description": "Custom precision haircuts tailored to your features, lifestyle, and maintenance routine.",
      "price_from": "$41",
      "image": "/images/services/cut-style.webp"
    },
    {
      "id": "color-balayage",
      "name": "Color & Balayage",
      "description": "From retouches to our signature balayage techniques — premiered at fashion shows worldwide.",
      "price_from": "$75",
      "image": "/images/services/color-balayage.webp"
    },
    {
      "id": "treatments",
      "name": "Treatments",
      "description": "Deep conditioning, K-18, Keratin, and clarifying treatments for healthier hair.",
      "price_from": "$34",
      "image": "/images/services/treatments.webp"
    },
    {
      "id": "extensions",
      "name": "Extensions",
      "description": "JJS-certified installations for volume and length that complement your features.",
      "price_from": "Consultation",
      "image": "/images/services/extensions.webp"
    },
    {
      "id": "curly-hair",
      "name": "Curly Hair Experience",
      "description": "A transformative service designed to elevate your curls to their full potential.",
      "price_from": "$50 deposit",
      "image": "/images/services/curly.webp"
    },
    {
      "id": "cutting-specialist",
      "name": "Cutting Specialist",
      "description": "Our elite team of cutting specialists — the ultimate precision haircutting experience.",
      "price_from": "By level",
      "image": "/images/services/cutting-specialist.webp"
    }
  ]
}
```

- [ ] **Step 4: Create `src/data/levels.json`**

```json
[
  {
    "id": "apprentice",
    "name": "Apprentice",
    "rank": 1,
    "summary": "Recent graduates in our 6-12 month Apprenticeship Program, training under certified educators.",
    "description": "Apprentice team members are recent graduates currently undergoing our 6-12 month Apprenticeship Program. During this period, they are assisting Certified J. Joseph Salon Educators to advance their skills, improve efficiency and learn our specific procedures."
  },
  {
    "id": "foundation",
    "name": "Foundation",
    "rank": 2,
    "summary": "Completed JJS training. Beautiful, budget-friendly services.",
    "description": "Foundation team members have completed their initial J. Joseph Salon Training under our certified salon educators. After completing our Apprenticeship Program, these stylists offer beautiful and budget-friendly services for their guests."
  },
  {
    "id": "junior",
    "name": "Junior",
    "rank": 3,
    "summary": "1-2 years at JJS. Developing artistry in all techniques.",
    "description": "Junior team members are developing their artistry in all Principle Based Design haircuts and color techniques, and have completed at least one year at the Foundation Level. Stylists at this level typically have been in our salons for 1-2 years."
  },
  {
    "id": "advanced",
    "name": "Advanced",
    "rank": 4,
    "summary": "2-3 years at JJS. Producing outcomes out of artistry.",
    "description": "Advanced Stylists have developed their design and coloring skills, and are working to produce outcomes out of artistry. These stylists have been with J. Joseph Salons for 2-3 years and are close to mastering all educational classes."
  },
  {
    "id": "senior",
    "name": "Senior",
    "rank": 5,
    "summary": "3-4 years. 250+ hours continuing education. Certified in all principles.",
    "description": "Senior Stylists have completed at least 250 hours of continuing education through in-salon training, and have been certified in all of J. Joseph Salon's Principle-Based Training. At senior level, stylists have been with JJS for 3-4 years."
  },
  {
    "id": "master",
    "name": "Master",
    "rank": 6,
    "summary": "4-5 years. Certified specialists in cut, color, and styling. Mentors to new team members.",
    "description": "Master Stylists are considered Advanced Artists. They have been part of our salon family for 4-5 years, are certified as specialists in all three principles, and help to train and mentor new team members."
  },
  {
    "id": "specialist",
    "name": "Specialist",
    "rank": 7,
    "summary": "6-7 years. Management positions. Mastery in specialized areas.",
    "description": "Specialist team members typically hold management positions within our salons and have mastery and specialization in an area within our three principles. They have been with JJS for at least 6-7 years."
  },
  {
    "id": "elite",
    "name": "Elite",
    "rank": 8,
    "summary": "10+ years. By appointment only. Salon Directors and part-owners.",
    "description": "The promotion to Elite Level is reserved for the most experienced and highly sought-after stylists. This exclusive group has traveled the world styling for major fashion houses. They are Salon Directors and part-owners in our company."
  },
  {
    "id": "artistic-director",
    "name": "Artistic Director",
    "rank": 9,
    "summary": "Visionary leaders shaping the creative direction of the salon.",
    "description": "Artistic Directors shape the creative direction of the salon. They set the highest artistic standards, mentor Master Stylists, lead new techniques, and collaborate with industry leaders."
  },
  {
    "id": "visionary",
    "name": "Visionary Director",
    "rank": 10,
    "summary": "The pinnacle. Defining the future of hairstyling and our company.",
    "description": "The Visionary Director level represents the pinnacle of accomplishment. These individuals drive innovation, set global trends, and inspire the entire salon team. They shape our philosophy, artistic direction, and business strategy."
  }
]
```

- [ ] **Step 5: Create `src/content.config.ts`**

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const policies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/policies" }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string().optional(),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { policies, about };
```

- [ ] **Step 6: Verify data loads in index.astro**

Update `src/pages/index.astro` temporarily:

```astro
---
import Layout from "@/layouts/Layout.astro";
import siteData from "@/data/site.json";
import locationsData from "@/data/locations.json";
import servicesData from "@/data/services.json";
---

<Layout title={`${siteData.name} — Voted Best in Tampa Bay`}>
  <main>
    <section class="flex h-screen flex-col items-center justify-center gap-4">
      <h1 class="font-heading text-6xl font-bold tracking-tight">{siteData.name}</h1>
      <p class="text-cream-dark/60">{locationsData.length} Locations · {servicesData.categories.length} Service Categories</p>
    </section>
  </main>
</Layout>
```

Run: `npm run dev`
Expected: Page shows "J. Joseph Salon" with "5 Locations · 5 Service Categories".

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add data layer — services, locations, levels, site config

- JSON data for all 5 locations with hours, addresses, descriptions
- Complete service menu with pricing across 5 categories
- 10 stylist levels with summaries and descriptions
- Site-wide config (phone, email, social links)
- Astro content collections for markdown-based pages (policies, about)"
```

---

### Task 3: Shared Components — Nav, Menu Overlay, Book Button, Footer

**Files:**
- Create: `src/components/Nav.astro`, `src/components/MenuOverlay.tsx`, `src/components/BookButton.tsx`, `src/components/MobileBookBar.tsx`, `src/components/Cursor.tsx`, `src/components/FooterMinimal.astro`
- Create: `src/lib/boulevard.ts`

- [ ] **Step 1: Create Boulevard helper `src/lib/boulevard.ts`**

```typescript
/**
 * Triggers the Boulevard self-booking overlay.
 * Boulevard's injector.min.js must be loaded globally.
 * The overlay is triggered by clicking elements with `#book-now` hash or
 * by dispatching a custom event that Boulevard listens for.
 */
export function openBooking(): void {
  // Boulevard's overlay listens for clicks on links with href="#book-now"
  // We simulate this by dispatching a click on a hidden anchor
  const trigger = document.querySelector<HTMLAnchorElement>('a[href="#book-now"]');
  if (trigger) {
    trigger.click();
  } else {
    // Fallback: try the Boulevard global API
    const w = window as any;
    if (w.Boulevard?.openBookingOverlay) {
      w.Boulevard.openBookingOverlay();
    } else {
      // Final fallback: redirect to booking page
      window.location.href = "/book";
    }
  }
}
```

- [ ] **Step 2: Add Boulevard script to Layout.astro**

In `src/layouts/Layout.astro`, add before the closing `</body>`:

```html
<!-- Boulevard Self-Booking overlay -->
<script is:inline>
  !function(){ var e=document.createElement("script"); e.type="text/javascript"; e.async=true;
  e.src="https://static.joinboulevard.com/injector.min.js"; var t=document.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(e,t); }();
</script>
<!-- Hidden trigger for Boulevard -->
<a href="#book-now" id="boulevard-trigger" class="hidden" aria-hidden="true">Book</a>
```

- [ ] **Step 3: Create `src/components/BookButton.tsx`**

```tsx
import { openBooking } from "@/lib/boulevard";

interface Props {
  variant?: "nav" | "mobile" | "inline";
  className?: string;
}

export default function BookButton({ variant = "nav", className = "" }: Props) {
  const baseStyles = "font-heading font-semibold uppercase tracking-widest transition-all duration-300";

  const variants = {
    nav: `${baseStyles} text-[0.65rem] border border-[var(--color-gold)] text-[var(--color-gold)] px-6 py-2.5 hover:bg-[var(--color-gold)] hover:text-[var(--color-black)]`,
    mobile: `${baseStyles} text-[0.7rem] bg-[var(--color-gold)] text-[var(--color-black)] px-8 py-4 w-full text-center`,
    inline: `${baseStyles} text-[0.68rem] bg-[var(--color-gold)] text-[var(--color-black)] px-8 py-4 hover:bg-[var(--color-gold-soft)]`,
  };

  return (
    <button
      onClick={openBooking}
      className={`${variants[variant]} ${className}`}
      aria-label="Book an appointment"
    >
      Book Now
    </button>
  );
}
```

- [ ] **Step 4: Create `src/components/Nav.astro`**

```astro
---
import BookButton from "./BookButton";
---

<nav
  id="main-nav"
  class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-difference md:px-12 transition-all duration-400"
>
  <a href="/" class="font-heading text-[0.8rem] font-semibold tracking-[0.14em] uppercase text-white">
    J. Joseph Salon
  </a>

  <div class="flex items-center gap-6">
    <BookButton client:load variant="nav" className="hidden md:inline-flex" />

    <!-- Menu toggle -->
    <button
      id="menu-toggle"
      class="relative z-[60] flex flex-col items-end gap-[5px] p-2"
      aria-label="Open menu"
      aria-expanded="false"
    >
      <span class="block h-[1.5px] w-6 bg-white transition-all duration-300" id="menu-line-1"></span>
      <span class="block h-[1.5px] w-4 bg-white transition-all duration-300" id="menu-line-2"></span>
    </button>
  </div>
</nav>

<script>
  const toggle = document.getElementById("menu-toggle");
  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    document.dispatchEvent(new CustomEvent("menu-toggle", { detail: { open: !expanded } }));
  });
</script>
```

- [ ] **Step 5: Create `src/components/MenuOverlay.tsx`**

```tsx
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { openBooking } from "@/lib/boulevard";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations" },
  { label: "Level System", href: "/level-system" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Connect", href: "/connect" },
];

const locations = [
  { name: "Land O' Lakes", href: "/locations#land-o-lakes" },
  { name: "Lutz", href: "/locations#lutz" },
  { name: "Citrus Park", href: "/locations#citrus-park" },
  { name: "Odessa", href: "/locations#odessa" },
  { name: "Wesley Chapel", href: "/locations#wesley-chapel" },
];

export default function MenuOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(detail.open);
    };
    document.addEventListener("menu-toggle", handler);
    return () => document.removeEventListener("menu-toggle", handler);
  }, []);

  useGSAP(() => {
    if (!overlayRef.current) return;

    tl.current = gsap.timeline({ paused: true });
    tl.current
      .to(overlayRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.6,
        ease: "power3.inOut",
      })
      .from(".menu-link", {
        y: 60,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2")
      .from(".menu-meta", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.3");
  }, { scope: overlayRef });

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current?.reverse();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[55] bg-[var(--color-black)] flex flex-col justify-between px-6 py-24 md:px-16 md:py-32"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      aria-hidden={!isOpen}
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
        {/* Main navigation */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="menu-link block font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-[var(--color-cream)] transition-colors duration-300 hover:text-[var(--color-gold)] leading-[1.15]"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={openBooking}
            className="menu-link mt-4 self-start font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-[var(--color-gold)] leading-[1.15] hover:text-[var(--color-gold-soft)] transition-colors duration-300"
          >
            Book Now
          </button>
        </nav>

        {/* Side info */}
        <div className="flex flex-col justify-between">
          <div className="menu-meta">
            <h3 className="mb-4 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]/40">
              Locations
            </h3>
            <div className="flex flex-col gap-2">
              {locations.map((loc) => (
                <a
                  key={loc.href}
                  href={loc.href}
                  className="text-sm text-[var(--color-cream)]/60 transition-colors hover:text-[var(--color-cream)]"
                >
                  {loc.name}
                </a>
              ))}
            </div>
          </div>

          <div className="menu-meta mt-12 md:mt-0">
            <div className="flex flex-col gap-2 text-sm text-[var(--color-cream)]/50">
              <a href="tel:8132356848" className="hover:text-[var(--color-cream)] transition-colors">
                813-235-6848
              </a>
              <a href="mailto:info@jjosephsalon.com" className="hover:text-[var(--color-cream)] transition-colors">
                info@jjosephsalon.com
              </a>
              <div className="mt-4 flex gap-6">
                <a href="https://www.instagram.com/jjosephsalon/" target="_blank" rel="noopener" className="text-[0.65rem] uppercase tracking-widest hover:text-[var(--color-cream)] transition-colors">Instagram</a>
                <a href="https://www.tiktok.com/@jjosephsalon" target="_blank" rel="noopener" className="text-[0.65rem] uppercase tracking-widest hover:text-[var(--color-cream)] transition-colors">TikTok</a>
                <a href="https://www.facebook.com/jjosephsalon/" target="_blank" rel="noopener" className="text-[0.65rem] uppercase tracking-widest hover:text-[var(--color-cream)] transition-colors">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-meta text-[0.6rem] text-[var(--color-cream)]/20 tracking-wider">
        <a href="https://careers.jjosephsalon.com" target="_blank" rel="noopener" className="hover:text-[var(--color-cream)]/50 transition-colors">
          Careers
        </a>
        <span className="mx-3">·</span>
        <a href="/salon-policies" className="hover:text-[var(--color-cream)]/50 transition-colors">
          Policies
        </a>
        <span className="mx-3">·</span>
        <a href="/privacy-policy" className="hover:text-[var(--color-cream)]/50 transition-colors">
          Privacy
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `src/components/Cursor.tsx`**

```tsx
import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ cx: 0, cy: 0, tx: 0, ty: 0 });
  const isHover = useRef(false);

  useEffect(() => {
    // Only show on devices with fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };

    const interactiveSelectors = "a, button, [role='button'], .service-slide, .loc-item, input, textarea";

    const onEnter = () => { isHover.current = true; };
    const onLeave = () => { isHover.current = false; };

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf: number;
    function animate() {
      const p = pos.current;
      p.cx += (p.tx - p.cx) * 0.12;
      p.cy += (p.ty - p.cy) * 0.12;
      if (cursor) {
        cursor.style.left = `${p.cx}px`;
        cursor.style.top = `${p.cy}px`;
        cursor.style.transform = `translate(-50%, -50%) scale(${isHover.current ? 3.5 : 1})`;
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-3 w-3 rounded-full bg-[var(--color-gold)] mix-blend-difference transition-transform duration-150 ease-out"
      style={{ transform: "translate(-50%, -50%)" }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 7: Create `src/components/FooterMinimal.astro`**

```astro
---
import siteData from "@/data/site.json";
---

<footer class="border-t border-white/[0.04] px-6 py-8 md:px-12">
  <div class="flex flex-col items-center justify-between gap-4 text-[0.65rem] text-white/20 tracking-wider md:flex-row">
    <span>&copy; {new Date().getFullYear()} {siteData.name}</span>
    <div class="flex gap-6">
      <a href={siteData.social.instagram} target="_blank" rel="noopener" class="hover:text-white/50 transition-colors">Instagram</a>
      <a href={siteData.social.tiktok} target="_blank" rel="noopener" class="hover:text-white/50 transition-colors">TikTok</a>
      <a href={siteData.social.facebook} target="_blank" rel="noopener" class="hover:text-white/50 transition-colors">Facebook</a>
    </div>
    <div class="flex gap-3">
      <a href="/privacy-policy" class="hover:text-white/50 transition-colors">Privacy</a>
      <span>·</span>
      <a href="/cookies-policy" class="hover:text-white/50 transition-colors">Cookies</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 8: Update Layout.astro with shared components**

Update `src/layouts/Layout.astro` to include Nav, MenuOverlay, Cursor:

```astro
---
import "@/styles/global.css";
import Nav from "@/components/Nav.astro";
import MenuOverlay from "@/components/MenuOverlay";
import Cursor from "@/components/Cursor";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "J. Joseph Salon — Upscale hair salons in Tampa Bay. Voted Best in Tampa Bay." } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preload" href="/fonts/SpaceGrotesk-Variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/InstrumentSans-Variable.woff2" as="font" type="font/woff2" crossorigin />
  </head>
  <body>
    <!-- Grain overlay -->
    <div class="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03]"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;); background-repeat: repeat; background-size: 200px;"
      aria-hidden="true">
    </div>

    <!-- Custom cursor (desktop only) -->
    <Cursor client:load />

    <!-- Navigation -->
    <Nav />
    <MenuOverlay client:load />

    <slot />

    <!-- Boulevard Self-Booking overlay -->
    <script is:inline>
      !function(){ var e=document.createElement("script"); e.type="text/javascript"; e.async=true;
      e.src="https://static.joinboulevard.com/injector.min.js"; var t=document.getElementsByTagName("script")[0];
      t.parentNode.insertBefore(e,t); }();
    </script>
    <a href="#book-now" id="boulevard-trigger" class="hidden" aria-hidden="true">Book</a>

    <!-- Lenis smooth scroll + GSAP sync -->
    <script>
      import Lenis from "lenis";
      import gsap from "gsap";
      import { ScrollTrigger } from "gsap/ScrollTrigger";

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    </script>
  </body>
</html>
```

- [ ] **Step 9: Verify everything renders**

Run: `npm run dev`

Expected: Page loads with:
- Grain texture visible
- Custom gold cursor following mouse (desktop)
- Nav bar with "J. JOSEPH SALON" left, "Book Now" + hamburger right
- Clicking hamburger opens full-screen menu overlay with animated link reveals
- Clicking "Book Now" attempts Boulevard overlay (may not work locally without Boulevard account)

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: shared components — Nav, MenuOverlay, BookButton, Cursor, Footer

- Persistent minimal nav with mix-blend-difference
- Full-screen animated menu overlay (GSAP clip-path + stagger)
- BookButton triggers Boulevard self-booking overlay
- Custom cursor with hover scaling (desktop only)
- Minimal one-line footer
- Boulevard script integration in Layout"
```

---

## Phase 2: Homepage Scenes

> Remaining tasks (Tasks 4-11) cover the 6 homepage scenes, inner pages, and deployment. These will be detailed when Phase 1 is complete and verified, to keep the plan actionable and avoid premature specificity. Each task follows the same structure: Files → Steps → Verify → Commit.

### Task 4: Scene 1 — Hero (text reveal + video background)
**Files:** Create `src/components/home/Scene1Hero.tsx`
Build: Full-viewport hero with word-by-word GSAP text reveal animation, video/image background with gradient overlay, scroll indicator.

### Task 5: Scene 2 — Scroll-Pinned Brand Narrative
**Files:** Create `src/components/home/Scene2Pinned.tsx`
Build: ScrollTrigger-pinned section where scrolling crossfades 3-4 brand statements with images. ~300vh scroll space, 100vh viewport.

### Task 6: Scene 3 — Horizontal Scroll Services
**Files:** Create `src/components/home/Scene3Services.tsx`
Build: ScrollTrigger-pinned horizontal scroll. 6 service panels with image + text. Progress indicator. "View Full Menu" link.

### Task 7: Scene 4 — Interactive Location Index
**Files:** Create `src/components/home/Scene4Locations.tsx`
Build: Stacked text links for 5 locations. Hover/tap reveals photo + details sliding in from side.

### Task 8: Scene 5 — Testimonial Moment
**Files:** Create `src/components/home/Scene5Quote.tsx`
Build: Single centered quote, giant "5.0" background, parallax on scroll.

### Task 9: Scene 6 — CTA Close + Homepage Assembly
**Files:** Create `src/components/home/Scene6CTA.astro`, update `src/pages/index.astro`
Build: "It's You Time." CTA, FooterMinimal. Wire all 6 scenes into index.astro.

## Phase 3: Inner Pages

### Task 10: Services + Service Detail Pages
**Files:** `src/pages/services.astro`, `src/pages/services/curly-hair-experience.astro`, `src/pages/services/cutting-specialist.astro`, `src/components/services/ServiceList.astro`

### Task 11: Locations Page
**Files:** `src/pages/locations.astro`, `src/components/locations/LocationSection.astro`

### Task 12: Level System Page
**Files:** `src/pages/level-system.astro`, `src/components/level-system/LevelTrack.tsx`

### Task 13: About Page
**Files:** `src/pages/about.astro`, `src/content/about/about.md`

### Task 14: Booking, Connect, Gift Cards, Policy Pages
**Files:** `src/pages/book.astro`, `src/pages/connect.astro`, `src/pages/gift-cards.astro`, `src/pages/salon-policies.astro`, `src/pages/privacy-policy.astro`, `src/pages/cookies-policy.astro`

## Phase 4: Polish & Deploy

### Task 15: Mobile Optimization
Mobile Book bar, scroll behavior adjustments, touch interactions, performance optimization.

### Task 16: SEO + Redirects
**Files:** `vercel.json`, sitemap config, meta tags, structured data

### Task 17: Deployment to Vercel
**Files:** `vercel.json`
Build, deploy, verify all pages, test Boulevard integration in production.

---

## Verification (end-to-end)

1. `npm run build` succeeds with zero errors
2. Lighthouse mobile score 90+ on homepage
3. All 6 homepage scenes scroll smoothly on Chrome, Safari, Firefox
4. Menu overlay opens/closes with animation
5. "Book Now" triggers Boulevard overlay
6. All inner pages render with correct content from JSON/markdown
7. Mobile: all interactions work with touch, no scroll jank
8. All old WordPress URLs redirect to new equivalents
