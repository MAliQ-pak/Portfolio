# Portfolio

My personal portfolio website — live at **https://maliq-pak.github.io/portfolio/**.

## Features

- Responsive single-page layout (About, Skills, Projects, Contact)
- Light / dark theme toggle (remembers your choice)
- Projects section loads my public repositories live from the GitHub API
- Plain HTML, CSS and JavaScript — no build step

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save — the site will be live at https://maliq-pak.github.io/portfolio/ within a minute or two.

## Customize

- Edit text, skills and links in `index.html`
- Change colors in the `:root` variables at the top of `style.css`
- Hide repos from the projects grid via `HIDDEN_REPOS` in `script.js`
