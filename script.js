const GITHUB_USER = "MAliQ-pak";
// Repos to hide from the "More on GitHub" grid (e.g. the profile README and this site)
const HIDDEN_REPOS = [GITHUB_USER, "portfolio"].map((n) => n.toLowerCase());

// Hand-picked projects shown first. Add an entry per project:
// { title, description, tags: [...], link, linkLabel, repo }
const FEATURED = [
  {
    title: "This Portfolio",
    description:
      "A fast, responsive personal site with light/dark themes, scroll animations and a live GitHub feed, built through AI-assisted development with Claude Code.",
    tags: ["Claude Code", "HTML", "CSS", "JavaScript"],
    link: "https://maliq-pak.github.io/portfolio/",
    linkLabel: "Live site",
    repo: "https://github.com/MAliQ-pak/portfolio",
  },
];

const ROLES = [
  "AI voice agents",
  "CRM automations",
  "API & webhook integrations",
  "n8n workflows",
  "AI-powered web apps",
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Theme toggle (initial theme is set inline in <head>)
const root = document.documentElement;
document.getElementById("theme-toggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

document.getElementById("year").textContent = new Date().getFullYear();

// Typewriter effect cycling through ROLES
(function typewriter() {
  const el = document.getElementById("typed");
  if (reduceMotion) return;
  let roleIndex = 0;
  let charIndex = ROLES[0].length;
  let deleting = true;

  function tick() {
    const role = ROLES[roleIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = role.slice(0, charIndex);

    let delay = deleting ? 40 : 80;
    if (!deleting && charIndex === role.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
})();

// Reveal sections as they scroll into view
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
})();

// Show the "Download CV" button only if resume.pdf exists in the repo
(async function showCvButton() {
  const btn = document.getElementById("cv-btn");
  try {
    const res = await fetch(btn.getAttribute("href"), { method: "HEAD" });
    if (res.ok) btn.hidden = false;
  } catch {}
})();

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderFeatured() {
  document.getElementById("featured-grid").innerHTML = FEATURED.map(
    (p) => `
    <article class="card">
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      <div class="links">
        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${escapeHtml(p.linkLabel || "View")} ↗</a>` : ""}
        ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">Code ↗</a>` : ""}
      </div>
    </article>`
  ).join("");
}

// Load public repositories from the GitHub API
async function loadRepos() {
  const grid = document.getElementById("repo-grid");
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = (await res.json()).filter(
      (r) => !r.fork && !HIDDEN_REPOS.includes(r.name.toLowerCase())
    );

    if (repos.length === 0) {
      grid.innerHTML = '<p class="muted">New projects coming soon!</p>';
      return;
    }

    grid.innerHTML = repos
      .slice(0, 6)
      .map(
        (r) => `
        <a class="card" href="${r.html_url}" target="_blank" rel="noopener">
          <h3>${escapeHtml(r.name)}</h3>
          <p>${escapeHtml(r.description || "No description yet.")}</p>
          <div class="meta">
            ${r.language ? `<span>● ${escapeHtml(r.language)}</span>` : ""}
            <span>★ ${r.stargazers_count}</span>
          </div>
        </a>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="muted">Couldn't load repositories right now.
      <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">See them on GitHub</a>.</p>`;
  }
}

renderFeatured();
loadRepos();
