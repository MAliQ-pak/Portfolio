const GITHUB_USER = "MAliQ-pak";
// Repos to hide from the projects grid (e.g. the profile README and this site)
const HIDDEN_REPOS = [GITHUB_USER, "portfolio"];

// Theme toggle: remembers the choice, otherwise follows the OS setting
const root = document.documentElement;
function getSavedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = getSavedTheme() || (prefersDark ? "dark" : "light");

document.getElementById("theme-toggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

document.getElementById("year").textContent = new Date().getFullYear();

// Load public repositories from the GitHub API
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadRepos() {
  const grid = document.getElementById("repo-grid");
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = (await res.json()).filter(
      (r) => !r.fork && !HIDDEN_REPOS.includes(r.name)
    );

    if (repos.length === 0) {
      grid.innerHTML = '<p class="muted">New projects coming soon!</p>';
      return;
    }

    grid.innerHTML = repos
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
    grid.innerHTML = `<p class="muted">Couldn't load projects right now —
      <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">see them on GitHub</a>.</p>`;
  }
}

loadRepos();
