# Portfolio

Interactive 3D developer portfolio of **Muhammad Ali Qureshi**, CRM, AI Automation & Software Solutions Specialist.
Live at **https://maliq-pak.github.io/portfolio/**.

## Features

- **3D hero (Three.js):** a low-poly avatar that follows your cursor, blinks and waves when clicked, surrounded by orbiting integration nodes (GHL, AI, n8n, API, Make, Zapier, code, data) with live data pulses. Drag to rotate; hover a node for details; click a node to jump to that section.
- **Interactive SVG avatar** used as the logo and favicon; its eyes follow the mouse and it blinks.
- **Working terminal:** type `help`, `whoami`, `skills`, `projects`, `contact`, `wave`, `sudo hire-ali`… (press <kbd>`</kbd> anywhere to open it). Supports history (↑/↓) and Tab completion.
- Developer styling: editor windows, `skills.json`, `git log --career`, GitHub repos rendered as `ls -la`, 3D-tilt cards with a cursor spotlight, scroll progress bar.
- SEO and social previews (Open Graph, Twitter, schema.org `Person`).
- Falls back to the 2D avatar when WebGL isn't available; respects `prefers-reduced-motion`; on touch screens the 3D scene doesn't hijack scrolling.
- No build step. Three.js is bundled in `vendor/three/` so the site never depends on a CDN.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Content and structure |
| `style.css` | Theme (colors are CSS variables at the top) |
| `script.js` | Avatar eyes, terminal commands, project cards, GitHub listing, tilt effects |
| `scene.js` | The Three.js 3D scene |
| `assets/avatar.svg` | The avatar (logo + favicon); `avatar-512.png` is a PNG export for social previews |

## Customize

| What | Where |
| --- | --- |
| Featured projects | `FEATURED` array in `script.js` |
| Rotating "building …" phrases | `ROLES` array in `script.js` |
| Terminal commands | `COMMANDS` object in `script.js` |
| 3D orbit nodes and avatar speech lines | `NODES` and `LINES` in `scene.js` |
| Repos hidden from the listing | `HIDDEN_REPOS` in `script.js` |

**Download CV:** add `resume.pdf` to the repo root. A `$ wget cv.pdf` button appears automatically and the terminal's `cv` command downloads it.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly as a file won't load the 3D scene, because browsers block ES modules on `file://`.)

## Deploy

Settings → Pages → **Deploy from a branch** → `main` / `(root)`.

## Credits

[Three.js](https://threejs.org/) r160 (MIT, see `vendor/three/LICENSE`).
