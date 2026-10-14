# Portfolio

Personal portfolio of **Muhammad Ali Qureshi**, CRM, AI Automation & Software Solutions Specialist.
Live at **https://maliq-pak.github.io/portfolio/**.

## Features

- Animated hero with rotating "I build…" roles, scroll-reveal sections and a scrolling toolkit marquee
- Sections: About, What I build, Featured automation, Certifications & honors, Experience timeline, Toolkit, Contact
- Light / dark theme (follows your OS, remembers your choice)
- "More on GitHub" grid loads public repositories live from the GitHub API
- SEO and social previews: Open Graph / Twitter tags and schema.org `Person` data
- Respects `prefers-reduced-motion`; plain HTML, CSS and JavaScript with no build step

## Customize

| What | Where |
| --- | --- |
| Bio, services, experience, toolkit, contact links | `index.html` |
| Hand-picked featured projects | `FEATURED` array in `script.js` |
| Rotating hero phrases | `ROLES` array in `script.js` |
| Repos hidden from the GitHub grid | `HIDDEN_REPOS` in `script.js` |
| Colors | CSS variables at the top of `style.css` |

**Images:** put these in an `assets/` folder and they appear automatically (fallbacks show until then):

| File | Used for |
| --- | --- |
| `assets/logo.png` | Navbar logo (replaces the text logo) |
| `assets/profile.png` | Hero photo (replaces the GitHub avatar) |
| `assets/ghl-badge.png` | GHL Certified Admin card |
| `assets/achiever_receiving.png` | Achiever Award card |
| `assets/rockstar.png` | Rockstar Employee 2025 card |

**Download CV button:** add a file named `resume.pdf` to the repo root. The button appears automatically once that file exists.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Settings → Pages → **Deploy from a branch** → `main` / `(root)`.
