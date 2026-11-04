# Tamim Rupo — personal website

**Domain:** [tamimrupo.com](https://tamimrupo.com)

A static site for **Tamim Rupo**, a web developer in Dhaka, Bangladesh. No framework, no build step,
no database, no analytics.

The design language is a dark violet / lime "AI-era" system adapted from
[livingwithprompts.com](https://livingwithprompts.com): Bricolage Grotesque display type, Geist body
text, Geist Mono labels, floating pill header, lime highlights, soft purple glows, and a footer with
a giant wordmark.

---

## Pages

| Page | File |
| --- | --- |
| Home — newsletter landing ("I run a web agency with AI") | `index.html` |
| Portfolio — work, about, services, notes | `portfolio.html` |
| Contact + brief form | `contact.html` |
| Case study: LankaBangla Investments | `work/lankabangla.html` |
| Case study: 0xprial | `work/0xprial.html` |
| Case study: InkPark Tattoo | `work/inkpark.html` |
| Case study: EsferaSoft | `work/esferasoft.html` |
| Note: WordPress security | `writing/wordpress-security.html` |
| Note: WordPress architecture | `writing/wordpress-architecture.html` |
| Note: performance | `writing/performance-checklist.html` |
| RSS feed | `writing/feed.xml` |
| 404 | `404.html` |

`about.html`, `work.html`, and `writing.html` are styled redirects to the matching sections of
`portfolio.html`. `concept.html` redirects home. They are excluded from `sitemap.xml`.

---

## Run it locally

From this folder:

```bash
python -m http.server 4173
```

Open <http://127.0.0.1:4173>.

There is nothing to install or compile. `assets/css/site.css` and `assets/js/site.js` are the whole
front end.

---

## Design system

### Colour

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#0d0b14` | dark sections, text |
| Paper | `#fbfaff` | light sections |
| Lavender paper | `#f3ecff` / `#ede9f6` | soft panels, chips |
| Violet | `#7946e3` / `#5f2ec7` | links, labels, buttons |
| Lime | `#c8f136` | highlights, badges, checks |
| Body text | `#544e60`, muted `#766e80` | copy |
| On-dark text | `#fbfaff`, `#c7bed7` | copy on ink |

### Type

- Display: **Bricolage Grotesque** 700–800, tight tracking (`-0.035em` … `-0.05em`)
- Body: **Geist** 400–600
- Labels / meta: **Geist Mono**, uppercase, wide tracking
- Hand notes: **Caveat**

All fonts load from Google Fonts in each page's `<head>`.

### Components (all in `assets/css/site.css`)

- Floating white pill header with lime CTA and mobile menu (`.site-header`, `.header-pill`)
- Arrow buttons whose violet circle expands on hover (`.btn-arrow`, `--light`, `--dark`, `--lime`)
- Lime badges, violet tags, mono eyebrows
- Work cards with browser-framed screenshots (`.work-card`, `.browser`)
- Numbered lists, lime check lists, stats, quotes
- Portrait card with sticker badge and live Dhaka clock
- 3D fan of project screenshots (`.fan`)
- Dark feature sections with violet glow (`.section--dark`, `.section--glow`)
- CTA band with a CSS keyboard that fades into the section
- Giant footer wordmark with lime chip
- Case-study / note article layout (`.page-hero`, `.article-cover`, `.article-grid`, `.prose`, `.facts`)
- Contact form card (`.contact-grid`, `.form-card`, `.field`)

### Motion

`assets/js/site.js` adds:

- the animated character field behind the hero (canvas, pointer-reactive, off-screen pause,
  `prefers-reduced-motion` aware)
- scroll-triggered reveals (`.reveal` → `.is-visible`)
- a header that hides on scroll down and returns on scroll up
- the mobile menu, live Dhaka clock, current year, the generated keyboard keys
- the two mailto forms

---

## Edit your details

Search and replace across the site:

- `tamim@tamimrupo.com`
- `+8801792102049` / `+880 1792 102049`
- `github.com/tamimrupo`
- `linkedin.com/in/tamimrupo`
- `behance.net/tamimrupo`

The header and footer are duplicated in every page. If you change them, update the home, portfolio,
contact, 404, case-study, and note pages (subfolder pages use `../` paths).

### Portrait

- `assets/img/tamim-portrait.jpg` — real headshot, background replaced with the dark violet studio
  backdrop. Used in the homepage portrait card (1000 × 1100, exactly the card ratio).
- `assets/img/tamim-standing.jpg` — full-length photo on the light lavender backdrop. Used in the
  portfolio about card (1000 × 1100).
- `assets/img/tamim-github.png` — square head-and-shoulders avatar used in note author cards
  (320 × 320).

All three are generated from the source photos in `.ref/art/` by
`.ref/qa/make_portraits.py` (both paths are local-only and git-ignored). To swap in a new photo,
replace the source files and re-run the script; it removes the studio background, clears colour
spill from the edges, upscales/sharpens, and composes the photo onto the site's backdrops.

### Work images

Project screenshots live in `assets/screens/` at **1440 × 810** (`*.jpg`). The home, portfolio and
case-study pages show them inside browser frames. That is the only image set the site needs now.

---

## Forms

Both forms open the visitor's email app — nothing is stored on the site.

- Newsletter (`[data-join-form]` on the homepage): `site.js` builds a `mailto:` with the email.
- Contact (`#contact-form` in `contact.html`): `site.js` builds a `mailto:` with name, email and
  message. The form fallback `action` is also `mailto:`.

To use a real form/newsletter service (Buttondown, Kit, Formspree, etc.), replace the form `action`
and remove the matching handler from `assets/js/site.js`.

---

## SEO and assets

- Canonical and Open Graph URLs point at `https://tamimrupo.com/`.
- Social preview: `assets/img/og-ai.png` (1200 × 630). Source lives in `.ref/og-source.html`
  (not deployed) if you need to regenerate it.
- Favicon: `assets/img/favicon.svg`; Apple touch icon: `assets/img/apple-touch-icon.png`.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `writing/feed.xml`.
- Structured data: Person on the home/portfolio pages, CreativeWork on each case study,
  BlogPosting on each note.
- The site ships `.nojekyll` for GitHub Pages.

---

## Deploy

Static site, deployed with **GitHub Pages**.

- Repository: `tamimrupo/tamimrupo-website`
- Branch: `main`
- Publish directory: `/` (project root)
- Custom domain: `tamimrupo.com` (`CNAME`)
- GitHub Pages URL: <https://tamimrupo.github.io/tamimrupo-website/>

### Cloudflare DNS

The domain uses Cloudflare nameservers. To point the apex at GitHub Pages:

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| AAAA | `@` | `2606:50c0:8000::153` | DNS only |
| AAAA | `@` | `2606:50c0:8001::153` | DNS only |
| AAAA | `@` | `2606:50c0:8002::153` | DNS only |
| AAAA | `@` | `2606:50c0:8003::153` | DNS only |
| CNAME | `www` | `tamimrupo.github.io` | DNS only |

Remove any old WordPress A/AAAA records for `tamimrupo.com` first. Leave MX/TXT records alone;
email is separate. After the records resolve, enable **Enforce HTTPS** in GitHub Pages.

---

## Notes

- Confirm the four headline numbers (years, projects, ventures, industries) before publishing.
- Case-study years, client names, and roles come from the public profile and portfolio — confirm
  them before publishing.
- The portrait is still a placeholder illustration; a real photo is the next upgrade.
- The newsletter is a `mailto:` form, not a real list. Connect a provider when the list actually
  launches.
- Design reference: [livingwithprompts.com](https://livingwithprompts.com) — the layout language is
  borrowed, not the content or assets.
