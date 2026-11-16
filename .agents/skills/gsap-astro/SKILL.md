---
name: gsap-astro
description: How this project wires GSAP, ScrollTrigger and Lenis into Astro static pages — script placement, reduced-motion handling, no-JS fallback, cleanup, and SEO/LCP-safe reveals. Use whenever writing or editing client-side animation code, scroll effects, smooth scroll, or anything importing gsap or lenis. Decide WHETHER and HOW something should move with the `animate` skill first; this skill is the implementation layer.
---

# GSAP + Lenis in Astro

Order of work: `animate` skill decides whether/why/which curve → this skill implements → `animation-performance` if it janks → `review-animations` (invoke explicitly) before shipping.

## Where code lives

- One entry: `src/scripts/motion.ts`, imported once from `BaseLayout.astro`:
  ```astro
  <script>import '../scripts/motion';</script>
  ```
  Astro bundles and dedupes processed `<script>` tags; they run as modules once per page load. Don't use `is:inline` for GSAP code.
- Component-specific motion goes in `src/scripts/motion/*.ts` modules registered from `motion.ts`, keyed by a `data-motion="name"` attribute on the root element. Components don't import GSAP directly unless the effect is truly local.
- Cheap effects (hover, focus, color, a single fade) are CSS transitions using tokens from `tokens.css`. Reach for GSAP for sequences, scroll-linked motion, SplitText, or interruptible timelines.

## motion.ts template

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    motionOK: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
  },
  (ctx) => {
    const { motionOK } = ctx.conditions as { motionOK: boolean };

    if (!motionOK) {
      // Show everything in its final state; no smooth scroll.
      gsap.set('[data-reveal]', { clearProps: 'all', autoAlpha: 1 });
      return;
    }

    // Smooth scroll synced to ScrollTrigger
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Generic reveal: below-the-fold elements only
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });

    // Cleanup runs when the media query stops matching
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  },
);
```

Durations/eases above are placeholders; once `tokens.css` has `--dur-*` / `--ease-*`, mirror them in a small `src/scripts/motion/tokens.ts` and use those instead of literals.

## No-JS and SEO safety

```css
/* global.css — hide only when JS is running, so crawlers and no-JS users see content */
html.js [data-reveal] { visibility: hidden; }
@media (prefers-reduced-motion: reduce) {
  html.js [data-reveal] { visibility: visible; }
}
```

`autoAlpha` sets `visibility` back, so this pairs with GSAP correctly. The `js` class is added by the inline script in `BaseLayout` `<head>` (see `astro-seo`).

Never put `data-reveal` on the hero / LCP element or anything above the fold. For a hero entrance, animate decorative layers or use a short (≤ 400ms) transform-only motion on elements that are already visible.

Text must exist in the HTML. If you split text (SplitText), split at runtime from the existing text node; never build text in JS.

## Page transitions

Default is CSS-only cross-document view transitions in `global.css`:

```css
@view-transition { navigation: auto; }
@media (prefers-reduced-motion: reduce) {
  @view-transition { navigation: none; }
}
```

This keeps a full page load per navigation, so `motion.ts` simply runs again. Only if the user asks for Astro's `<ClientRouter />`: wrap initialization in `document.addEventListener('astro:page-load', init)`, call `mm.revert()` and `ScrollTrigger.getAll().forEach(t => t.kill())` on `astro:before-swap`, and verify with the `astro-docs` MCP that those event names are still current.

## Islands

If a React/Svelte island needs motion, keep GSAP inside the island and use `gsap.context()` (or `@gsap/react`'s `useGSAP` for React) so it reverts on unmount. Hydrate with `client:visible`, not `client:load`.

## Checks before done

- [ ] Reduced motion: toggle OS setting (or DevTools emulation) → everything visible, no Lenis
- [ ] JS disabled → all content visible
- [ ] Only `transform` / `opacity` / `visibility` animated
- [ ] No ScrollTrigger on above-the-fold content
- [ ] `npm run build` passes, Lighthouse CLS ≈ 0 (see `web-perf`)
