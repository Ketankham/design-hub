# design-hub: logistics landing page template

A single-page marketing site for a freight / logistics company. The layout and interaction patterns are modelled on modern logistics sites; the brand ("Northwind Freight"), copy, icons and illustrations are **original placeholders** to replace with your own.

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html      All sections, top to bottom
css/styles.css  Design tokens (:root) + component styles
js/main.js      Interactions (vanilla JS, no dependencies)
```

## Sections

| # | Section | Behaviour |
|---|---------|-----------|
| 1 | Preloader | Counts 00→100 then fades; capped at 3 s; skipped with reduced motion |
| 2 | Header | Transparent → solid on scroll, hides on scroll down; full-screen mobile menu (Esc closes, scroll locked) |
| 3 | Hero | Animated SVG route map, rotating "now routing via" city ticker, service marquee |
| 4 | About + stats | Count-up numbers when scrolled into view (once) |
| 5 | Road scene | Sticky section; truck drives across as you scroll, wheels spin, km/h readout reflects scroll speed |
| 6 | Services | 6 cards with hover invert |
| 7 | Promises | 3 numbered features on a dark band |
| 8 | Why us | Sticky intro + numbered list |
| 9 | Testimonials | Slider: buttons, arrow keys, swipe, autoplay that pauses on hover/focus |
| 10 | Partners | Infinite logo marquee (pauses on hover) |
| 11 | Insights | 3 article cards |
| 12 | FAQ | Native `<details>` accordion, one open at a time |
| 13 | Contact | Form with client-side validation (not wired to a backend) |
| 14 | Footer | Links, offices, contact, auto year |

## Re-branding checklist

- [ ] Replace "Northwind Freight" (search all files) and the CSS logo mark in `.logo__mark`
- [ ] Colours and fonts: edit tokens at the top of `css/styles.css`
- [ ] Copy: every heading, paragraph, stat and FAQ answer is placeholder text
- [ ] Testimonials: only real, permissioned customer quotes
- [ ] Partner logos: replace `.logo-chip` placeholders with logos you're licensed to show
- [ ] Insight thumbnails: replace gradient blocks with images
- [ ] Hero ticker cities: `cities` array in `js/main.js`
- [ ] Contact form: hook the `submit` handler in `js/main.js` to your backend or a form service
- [ ] Footer offices, email, phone, legal links

## Accessibility & edge cases covered

- Content visible without JS (reveal/preloader styles only apply under `.js`)
- `prefers-reduced-motion`: no preloader, marquees/animations stop, truck parks centre-screen, counters show final values
- Skip link, visible focus rings, `aria-expanded` on menu toggle, live region for slider and form status
- Slides wrap both directions; autoplay pauses when the tab is hidden
- Layout tested from 360 px mobile to wide desktop with no horizontal scroll
