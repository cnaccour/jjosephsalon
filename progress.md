# J. Joseph Salon — Rebuild Progress

## Status: Phase 2 Complete ✓ — Ready for Phase 3 (Inner Pages)

---

## Phase 1: Project Foundation
- [x] Task 1: Scaffold Astro 5 project (React + Tailwind 4 + GSAP + Lenis)
- [x] Task 2: Data layer — services, locations, levels, site config JSON + Content Collections
- [x] Task 3: Shared components — Nav, MenuOverlay, BookButton, Cursor, Footer

## Phase 2: Homepage Scenes
- [x] Task 4: Scene 1 — Hero (text reveal + video background)
- [x] Task 5: Scene 2 — Scroll-pinned brand narrative
- [x] Task 6: Scene 3 — Horizontal scroll services
- [x] Task 7: Scene 4 — Interactive location index
- [x] Task 8: Scene 5 — Testimonial moment
- [x] Task 9: Scene 6 — CTA close + homepage assembly

## Phase 3: Inner Pages
- [ ] Task 10: Services + service detail pages
- [ ] Task 11: Locations page
- [ ] Task 12: Level System page
- [ ] Task 13: About page
- [ ] Task 14: Booking, Connect, Gift Cards, Policy pages

## Phase 4: Polish & Deploy
- [ ] Task 15: Mobile optimization
- [ ] Task 16: SEO + redirects
- [ ] Task 17: Deployment to Vercel

---

## Log

### 2026-04-16
- Crawled current WordPress site (10 pages)
- Design direction: 4 rounds of iteration → approved spec
- Locked in: Space Grotesk + Instrument Sans, warm blacks + gold + cream, scroll-driven architecture
- Moodboard finalized
- GitHub repo created: github.com/cnaccour/jjosephsalon
- Implementation plan written (17 tasks across 4 phases)
- Starting Phase 1 build
- **Task 1 complete**: Astro 5 scaffolded with React, Tailwind 4, GSAP, Lenis, self-hosted fonts
- **Task 2 complete**: Data layer — site.json, locations.json (5), services.json (42 services, 5 categories), levels.json (10), content collections config, placeholder markdown
- **Task 3 complete**: Nav (mix-blend-difference), MenuOverlay (GSAP clip-path animation), BookButton (Boulevard trigger), Cursor (gold, lerp, scale on hover), FooterMinimal (one-line)
- **Phase 1 complete** — build passes with zero errors
- **Task 4 complete**: Scene 1 Hero — full-viewport, word-by-word GSAP reveal, video placeholder, scroll indicator, sr-only H1 for SEO
- **Task 5 complete**: Scene 2 Pinned — 300vh scroll-driven crossfade between 3 brand statements with image placeholders
- **Task 6 complete**: Scene 3 Services — horizontal scroll with ScrollTrigger pin (desktop), native swipe (mobile), 6 service panels with progress bar
- **Task 7 complete**: Scene 4 Locations — interactive text index, hover reveals details + image preview, expandable rows on mobile
- **Task 8 complete**: Scene 5 Quote — auto-rotating testimonials, giant "5.0" parallax bg, gold stars, Google badge, navigation dots
- **Task 9 complete**: Scene 6 CTA — "It's You Time." with hover-fill booking button, minimal footer
- Homepage assembled in index.astro with HairSalon structured data (JSON-LD), SEO title/meta, all 6 scenes wired
- **Phase 2 complete** — build passes with zero errors
