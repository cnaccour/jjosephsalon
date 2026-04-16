# J. Joseph Salon — Website Redesign Spec

## Context

J. Joseph Salon is a group of 5 upscale hair salons across Tampa Bay (Land O' Lakes, Lutz, Citrus Park, Odessa, Wesley Chapel). Voted Best in Tampa Bay, 5.0 Google rating (789+ reviews), 9-level stylist career system, elite Redken salon.

The current site is WordPress + Elementor — bloated (400KB+ HTML per page), template-looking, and doesn't reflect the brand's actual positioning. The owner wants to move off WordPress entirely and build something that feels bold, modern, and fashion-forward — not like a salon template.

**4 rounds of design feedback established these constraints:**
- Colors LOCKED: warm blacks (#0C0B09, #141210, #1C1A17) + JJS Gold (#AF831A) + warm whites (#F4F1EB, #E8E3DA)
- Fonts LOCKED: Space Grotesk (headlines) + Instrument Sans (body)
- No traditional hero → sections → footer page architecture — that reads as template
- No gallery/portfolio page, no stylist profiles, no level system on homepage
- Careers is a separate site (careers.jjosephsalon.com) — just link to it
- Testimonials pull from Google Reviews API (4+ stars, most recent)
- Boulevard is the booking system (self-booking overlay)
- Balance wow-factor with usability — guests must find info and book fast

---

## Architecture: "Immersive but Functional"

### The Core Idea
The site feels like a **cinematic brand experience on first visit**, but every piece of content is findable in 2 clicks. Navigation and booking are always accessible. Inner pages use the same design language but prioritize information clarity.

### Navigation
- **Persistent minimal bar**: Logo (left) + hamburger/menu icon (right) + "Book" button (always visible, gold accent)
- **Menu opens as a full-screen overlay** with smooth animation — large type links, location quick-links, contact info. Not a dropdown. Not a sidebar. A takeover.
- **"Book" CTA is sacred** — always visible in top-right, never scrolls away, never hidden behind a menu. One tap → Boulevard overlay opens.

### Homepage — Scroll-Driven Narrative (Not Sections)
Instead of stacked sections, the homepage is a **continuous scroll story** with distinct "scenes" that transition cinematically:

**Scene 1: The Opening (100vh)**
- Full-viewport. Dark. 
- Background: slow-motion editorial video (stylist at work) or a single powerful photograph
- Text reveals on load: the headline in massive Space Grotesk, stagger-animated word by word
- Tagline and a single CTA ("Request Appointment") fade in after the headline
- Scroll indicator pulses at bottom
- The "Book" button and menu icon sit on top via the persistent nav

**Scene 2: The Scroll-Pinned Moment (~300vh scroll, 100vh viewport)**
- As user scrolls, the viewport stays pinned while content transforms inside it
- A sequence of 3-4 brand statements + accompanying images/short clips crossfade
- Example: "Five Salons" → image of interior → "World-Traveled Stylists" → image of stylist → "One Standard" → image of finished result
- This is the Apple product-page technique — scroll controls the narrative, not the layout
- On mobile: same concept but with swipe/scroll momentum, lighter assets

**Scene 3: Services (horizontal scroll, pinned)**
- As user continues scrolling vertically, the services section pins and scrolls horizontally
- Each service is a full-panel "card" — large photo on one side, service name + brief description + starting price on the other
- 6 panels: Cut & Style, Color & Balayage, Treatments, Extensions, Curly Hair Experience, Cutting Specialist
- A progress indicator shows where you are (dots or a thin line)
- "View Full Menu" link unpins and takes you to the services detail page
- On mobile: native horizontal swipe (no pin hijack — just a swipeable row)

**Scene 4: Locations (reveal)**
- Scrolling past services, locations fade in
- NOT a grid of cards. Instead: the 5 location names appear as large stacked text links
- Hover/tap on a location name → a photo of that salon slides in from the side, plus address and hours appear
- Feels like an interactive index, not a card layout
- "Explore All Locations" link goes to the full locations page

**Scene 5: Social Proof (single moment)**
- A centered, dramatic quote from Google Reviews
- Giant "5.0" as background element (low opacity)
- Gold stars. Author name. "789+ Google Reviews" badge
- This is ONE quote that rotates (pulls from API), not a carousel grid
- Minimal. Confident. One powerful statement.

**Scene 6: Close**
- "It's You Time." in massive type — the booking CTA
- Below it: a minimal footer line — just © 2026 J. Joseph Salon + Privacy + Instagram/TikTok/Facebook icons
- NOT a 4-column footer. One line. The full-screen menu overlay already has all the navigation.

### Inner Pages

**Services (/services)**
- Full service menu with pricing, organized by category (Hair, Color, Texture, Treatments, Waxing)
- Clean list format — service name + starting price + brief note
- Note about pricing varying by stylist level, with link to Level System page
- "Request Appointment" button persistent

**Locations (/locations)**
- Each location gets a full section: photo, description, address, phone, hours, Google Maps embed, "Book at This Location" button
- Locations stacked vertically, each filling ~80vh
- Scroll-snapping between locations feels natural

**Level System (/level-system)**
- Visual progression track — interactive horizontal visualization
- Click/tap a level → expands to show description and "Request Appointment" link
- Condensed, scannable — not walls of text
- Pricing context: "Our prices start at Foundation level. Higher levels reflect additional training and demand."

**About (/about)**
- Brand story told through scroll-driven narrative (similar to homepage technique but focused on mission, culture, academy)
- Who We Are → Our Mission → Our Culture → JJS Academy
- Ends with a link to careers.jjosephsalon.com

**Booking (/book)**
- Location selector → service category preview → Boulevard embed
- Context before handoff: which location, what to expect, cancellation policy summary
- Boulevard overlay handles the actual scheduling

**Other Pages:**
- /connect — contact form + location quick links
- /gift-cards — gift card purchase (Boulevard or existing widget)
- /salon-policies — clean text page (policies, cancellation, minors, returns)
- /privacy-policy, /cookies-policy — legal text pages

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Astro 5** | Content-first, zero-JS by default, islands architecture for interactive components. Deploys to CDN for pennies. Best performance for SEO-critical business site. |
| Interactive Islands | **React** (via Astro islands) | GSAP and scroll libraries integrate cleanly. Only loads JS where interactivity is needed. |
| Scroll Engine | **Lenis** | Smooth scroll normalization. The foundation that makes GSAP ScrollTrigger feel premium. |
| Animations | **GSAP + ScrollTrigger** | Industry standard for scroll-pinned sections, timeline animations, text splits. What Awwwards SOTD winners use. |
| Text Animations | **SplitType** (or custom) | Character/word/line splitting for stagger reveals. |
| Styling | **Tailwind CSS 4** | Utility-first, purged in production. Fast iteration, tiny output. |
| CMS (future) | **Astro Content Collections** (now), **Sanity or similar** (later) | Content lives in markdown/JSON for now. CMS can be layered in without architecture changes. |
| Deployment | **Vercel** or **Netlify** | Astro deploys natively. Global CDN, automatic HTTPS, preview deploys. |
| Booking | **Boulevard** self-booking overlay | Already in use. JS injector script, triggered by CTA clicks. |
| Reviews | **Google Places API** | Pull recent 4+ star reviews. Cache server-side, refresh daily. |
| Analytics | **Google Analytics 4** | Already in use. Minimal cookie consent needed. |
| Forms | **Astro + serverless function** or **Formspree** | Contact form on /connect page. |

---

## Design Tokens (Locked)

```
Colors:
  --black:        #0C0B09
  --black-warm:   #141210
  --surface:      #1C1A17
  --gold:         #AF831A
  --gold-soft:    #C4A044
  --cream:        #F4F1EB
  --cream-dark:   #E8E3DA

Fonts:
  Headings: Space Grotesk (weights: 500, 600, 700)
  Body:     Instrument Sans (weights: 400, 500, 600)

Interaction:
  Custom cursor (gold dot, mix-blend-mode: difference) — desktop only
  Film grain overlay (subtle SVG noise texture)
  Lenis smooth scroll on all pages
  GSAP-powered reveals, pins, and transitions
```

---

## Mobile Strategy

Mobile is not a "responsive version" — it's the **primary experience** (most salon guests search on phones).

- **No scroll hijacking on mobile** — pinned sections become normal scroll with parallax hints
- **Horizontal service panels** become native swipeable carousels (touch-friendly)
- **Full-screen menu overlay** works identically on mobile — large tap targets, thumb-friendly
- **"Book" button** is fixed at bottom of viewport on mobile (not top-right)
- **Custom cursor** is disabled (touch devices)
- **Video backgrounds** swap to static images on mobile (performance)
- **All text is readable without zooming** — minimum 16px body, generous line-height

---

## Pages Summary

| Page | Content Source | Interactive Elements |
|------|---------------|---------------------|
| Homepage | Curated content | Scroll-pinned narrative, horizontal services, interactive location index |
| /services | Pricing data (markdown/JSON) | Category tabs/filters, level pricing note |
| /locations | Location data (markdown/JSON) | Scroll-snap sections, embedded maps |
| /level-system | Level data (markdown/JSON) | Interactive progression track |
| /about | Brand copy | Scroll-driven narrative |
| /book | Boulevard integration | Location selector → Boulevard overlay |
| /connect | Contact form | Form submission, location quick-links |
| /gift-cards | Gift card widget | Boulevard/widget embed |
| /salon-policies | Policy text | Clean reading layout |
| /curly-hair-experience | Service detail | Service info + booking CTA |
| /cutting-specialist | Service detail | Service info + booking CTA |

---

## Verification Plan

After implementation:
1. **Performance**: Lighthouse score 90+ on all pages (mobile). Target < 50KB first paint on homepage.
2. **Booking flow**: Click "Book" from every page → Boulevard overlay opens correctly → can complete a booking.
3. **Mobile**: Full walkthrough on iPhone and Android — all interactions feel native, no scroll jank, text readable, buttons tappable.
4. **Content parity**: Every piece of information from the current WordPress site exists in the new site (or is intentionally removed per owner's direction).
5. **SEO**: All existing URLs have redirects. Meta titles/descriptions preserved. Sitemap generated. Google Search Console verified.
6. **Reviews**: Google Reviews pull correctly, display 4+ stars, update automatically.
7. **Cross-browser**: Chrome, Safari, Firefox, Edge on desktop and mobile.
8. **Accessibility**: Keyboard navigable, screen reader tested, WCAG 2.1 AA color contrast.
