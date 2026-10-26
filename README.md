# Tamim Rupo — personal website

A one-page personal portfolio for **Tamim Rupo**, a web developer in Dhaka, Bangladesh.

**Domain:** [tamimrupo.com](https://tamimrupo.com)

No framework. No runtime build. No database. No analytics.

---

## Pages

| Page | File |
| --- | --- |
| Home / work / services / about / notes / contact | `index.html` |
| Contact form | `contact.html` |
| Case study: LankaBangla Investments | `work/lankabangla.html` |
| Case study: 0xprial | `work/0xprial.html` |
| Case study: InkPark Tattoo | `work/inkpark.html` |
| Case study: EsferaSoft | `work/esferasoft.html` |
| Note: WordPress security | `writing/wordpress-security.html` |
| Note: WordPress architecture | `writing/wordpress-architecture.html` |
| Note: performance | `writing/performance-checklist.html` |
| RSS feed | `writing/feed.xml` |
| 404 | `404.html` |

`work.html`, `about.html`, and `writing.html` are redirects to the matching home sections. They are excluded from the sitemap. `concept.html` now redirects to the homepage.

---

## Run it locally

From this folder:

```bash
python -m http.server 4173
```

Open <http://127.0.0.1:4173>.

---

## Design

- Warm paper, black ink, and a yellow highlighter
- Instrument Serif for display, Manrope for body, IBM Plex Mono for metadata
- Hand-built SVG line work: the crowd in the contact section, coffee, plants, cats, stars, tape, and torn-paper details
- One-page home with a portrait and browser/phone collage, selected work, about, services, notes, and a yellow contact panel
- Case studies and notes use the same paper system, with screenshot and article sheets
- Hand-written CSS and JavaScript; no framework or component library
- The contact form opens the visitor's email app; nothing is stored on the site

---

## Edit your details

The following appear across the site. Search and replace:

- `tamim@tamimrupo.com`
- `+8801792102049` / `+880 1792 102049`
- `github.com/tamimrupo`
- `linkedin.com/in/tamimrupo`
- `behance.net/tamimrupo`

The header and footer are duplicated across pages. If you change them, update the home, contact, 404, case-study, and note pages.

### Portrait

The current portrait is the illustration from GitHub (`assets/img/tamim-github.png`). It is used in the About polaroid and the social card. The hero uses the transparent sticker version (`assets/img/tamim-cutout.png`).

Replace both with a real portrait when available. A square or portrait crop works for the About frame; a cut-out version is ideal for the hero.

### Work images

Project screenshots live in `assets/screens/` at **1440 × 810**. The home and case-study pages use the full screenshots inside paper browser frames.

### Case studies and notes

Case studies are in `work/`; notes are in `writing/`. The case-study years, client names, and roles are based on the public profile and portfolio. Confirm them before publishing.

---

## Contact form

The form currently opens the visitor's email app:

1. Fill in the fields.
2. JavaScript builds a `mailto:` link.
3. The fallback `action` is also `mailto:`.

The form handler is `assets/js/paper-contact.js`. To use a real form service, replace the form action in `contact.html` and remove that script.

---

## SEO and assets

- Canonical and Open Graph URLs point to `https://tamimrupo.com/`.
- Social preview: `assets/img/og-paper.png` (1200 × 630).
- Favicon: `assets/img/favicon.svg`.
- Apple touch icon: `assets/img/apple-touch-icon.png`.
- Sitemap: `sitemap.xml`.
- Robots: `robots.txt`.
- RSS: `writing/feed.xml`.
- Structured data: Person on the home page, BlogPosting on each note, CreativeWork on each case study.

---

## Deploy

This is a static site, deployed with **GitHub Pages**.

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

Remove the old WordPress A/AAAA records for `tamimrupo.com` first. Leave MX/TXT records alone; email is separate. After the DNS records resolve, enable **Enforce HTTPS** in GitHub Pages.

---

## Notes

- Fonts are loaded from Google Fonts (Instrument Serif, Manrope, IBM Plex Mono).
- Case study live links point to client sites. Remove a link if a project is no longer public.
- Confirm the four headline numbers (years, projects, companies, industries) before publishing.
- The portrait is still a placeholder illustration; a real photo is the next upgrade.
