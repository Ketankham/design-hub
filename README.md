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

## Look & feel

Monospace type throughout (JetBrains Mono), uppercase headings, black starfield sections alternating with light (#f5f5f5) sections, orange (#ff6b00) and blue (#1e90ff) accents, 5px button radius. All tokens live at the top of `css/styles.css`.

## Sections

| # | Section | Behaviour |
|---|---------|-----------|
| 1 | Preloader | Dotted map + 00→100 counter, then fades; capped at 3 s; skipped with reduced motion |
| 2 | Header | News ticker strip + nav; solid on scroll, hides on scroll down; full-screen mobile menu (Esc closes, scroll locked) |
| 3 | Hero (dark) | Huge uppercase headline, glowing SVG globe with route pins, rotating "routing via" city, service strip |
| 4 | About (light) | Animated highway illustration + text |
| 5 | Statement (light) | Words fill from grey to black as you scroll |
| 6 | Stats (light) | Count-up numbers when scrolled into view (once) |
| 7 | Road scene (dark) | Sticky; truck drives across on scroll, wheels spin, km/h follows scroll speed |
| 8 | Services (dark) | Sticky intro + numbered list with blur/tilt reveal; 3 feature cards |
| 9 | Why us (light) | Sticky intro + numbered list |
| 10 | Testimonials (light) | Slider: buttons, arrow keys, swipe, autoplay that pauses on hover/focus |
| 11 | Partners (dark) | Two logo marquees (airlines / shipping lines) in opposite directions |
| 12 | Insights (light) | 3 article cards |
| 13 | FAQ (light) | Native `<details>` accordion, one open at a time |
| 14 | Contact (dark) | Form with client-side validation (not wired to a backend) |
| 15 | Footer | Newsletter, Industries/Services tabs (arrow keys), contact, offices, socials, giant wordmark, legal |

## Re-branding checklist

- [ ] Replace "Northwind Freight" (search all files) and the CSS logo mark in `.logo__mark`
- [ ] Colours and fonts: edit tokens at the top of `css/styles.css`
- [ ] Copy: every heading, paragraph, stat and FAQ answer is placeholder text
- [ ] Testimonials: only real, permissioned customer quotes
- [ ] Partner logos: replace `.logo-chip` placeholders with logos you're licensed to show
- [ ] Insight thumbnails: replace gradient blocks with images
- [ ] Hero ticker cities: `cities` array in `js/main.js`
- [ ] Contact + newsletter forms: hook the `submit` handlers in `js/main.js` to your backend / mailing list
- [ ] Ticker headlines in the header
- [ ] Footer offices, email, phone, legal links

## Accessibility & edge cases covered

- Content visible without JS (reveal/preloader styles only apply under `.js`)
- `prefers-reduced-motion`: no preloader, marquees/animations stop, truck parks centre-screen, counters show final values
- Skip link, visible focus rings, `aria-expanded` on menu toggle, live region for slider and form status
- Slides wrap both directions; autoplay pauses when the tab is hidden
- Layout tested from 360 px mobile to wide desktop with no horizontal scroll
