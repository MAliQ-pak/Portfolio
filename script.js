const GITHUB_USER = "MAliQ-pak";
// Repos to hide from the listing (e.g. the profile README and this site)
const HIDDEN_REPOS = [GITHUB_USER, "portfolio"].map((n) => n.toLowerCase());

// Hand-picked projects shown first. Add an entry per project:
// { title, description, tags: [...], link, linkLabel, repo }
const FEATURED = [
  {
    title: "Real Estate AI Concierge",
    description:
      "A fully automated booking system using GoHighLevel and Vapi.ai that screens leads and books appointments directly into the CRM calendar.",
    tags: ["GHL", "AI Voice Agent", "Vapi.ai"],
  },
  {
    title: "E-commerce Data Scraper",
    description:
      "Custom Python script that scrapes 10k+ products, cleans the data with Pandas and feeds insights into a Power BI dashboard.",
    tags: ["Python", "Selenium", "Pandas", "Power BI"],
  },
  {
    title: "Cross-Platform Sync Engine",
    description:
      "A Make.com scenario linking Shopify, Mailchimp and GoHighLevel for real-time inventory and customer data synchronization.",
    tags: ["Make.com", "Webhooks", "Shopify", "Mailchimp"],
  },
  {
    title: "3D Developer Portfolio",
    description:
      "This site: an interactive Three.js avatar, a working terminal and a live GitHub feed, built through AI-assisted development with Claude Code.",
    tags: ["Three.js", "JavaScript", "Claude Code"],
    link: "https://maliq-pak.github.io/portfolio/",
    linkLabel: "live",
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

const CONTACT = {
  email: "Mohammadaliqureshi2611@gmail.com",
  whatsapp: "https://wa.me/923102983030",
  linkedin: "https://www.linkedin.com/in/automatali/",
  github: "https://github.com/MAliQ-pak",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ---------- Scroll progress + cursor glow ----------
(function ambient() {
  const root = document.documentElement;
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty("--p", max > 0 ? scrollY / max : 0);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!finePointer) return;
  let frame = 0;
  addEventListener("pointermove", (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      root.style.setProperty("--cx", e.clientX + "px");
      root.style.setProperty("--cy", e.clientY + "px");
    });
  });
})();

// ---------- Typewriter ----------
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
    let delay = deleting ? 35 : 75;
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

// ---------- Reveal sections ----------
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    }),
    { threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
})();

// ---------- CV button: shown only if resume.pdf exists ----------
(async function showCvButton() {
  const btn = document.getElementById("cv-btn");
  try {
    const res = await fetch(btn.getAttribute("href"), { method: "HEAD" });
    if (res.ok) btn.hidden = false;
  } catch {}
})();

// ---------- Interactive 2D avatar (logo, about card, 3D fallback) ----------
const avatarApi = (function avatars() {
  const slots = [...document.querySelectorAll("[data-avatar]")];

  function wave() {
    document.querySelectorAll(".avatar-big").forEach((el) => {
      el.classList.remove("wave");
      void el.offsetWidth;
      el.classList.add("wave");
    });
    window.dispatchEvent(new CustomEvent("avatar:wave"));
  }

  fetch("assets/avatar.svg")
    .then((r) => (r.ok ? r.text() : Promise.reject()))
    .then((svg) => {
      slots.forEach((slot) => {
        const alt = slot.querySelector("img")?.getAttribute("alt") || "";
        slot.innerHTML = svg;
        const el = slot.querySelector("svg");
        if (alt) el.setAttribute("aria-label", alt);
        else el.setAttribute("aria-hidden", "true");
      });
      startEyes();
    })
    .catch(() => {}); // keep the <img> versions

  function startEyes() {
    const pupils = [...document.querySelectorAll("[data-avatar] .avatar-pupils")];
    const eyes = [...document.querySelectorAll("[data-avatar] .avatar-eyes")];

    addEventListener("pointermove", (e) => {
      pupils.forEach((p) => {
        const r = p.ownerSVGElement.getBoundingClientRect();
        if (!r.width) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.46);
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(dist / 140, 1) * 2.8;
        p.style.transform = `translate(${(dx / dist) * k}px, ${(dy / dist) * k * 0.7}px)`;
      });
    });

    if (reduceMotion) return;
    (function blinkLoop() {
      setTimeout(() => {
        eyes.forEach((e) => e.classList.add("blinking"));
        setTimeout(() => eyes.forEach((e) => e.classList.remove("blinking")), 130);
        blinkLoop();
      }, 2500 + Math.random() * 3000);
    })();
  }

  document.querySelectorAll(".avatar-big").forEach((el) => el.addEventListener("click", wave));
  return { wave };
})();

// ---------- 3D tilt + spotlight on cards ----------
function enableTilt(scope = document) {
  if (!finePointer || reduceMotion) return;
  scope.querySelectorAll(".tilt").forEach((card) => {
    if (card.dataset.tilt) return;
    card.dataset.tilt = "1";
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// ---------- Featured projects ----------
function renderFeatured() {
  document.getElementById("featured-grid").innerHTML = FEATURED.map(
    (p) => `
    <article class="card tilt">
      <span class="path">~/projects/${slug(p.title)}</span>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      ${p.link || p.repo ? `<div class="links mono">
        ${p.link ? `<a class="link" href="${p.link}" target="_blank" rel="noopener">${escapeHtml(p.linkLabel || "open")} →</a>` : ""}
        ${p.repo ? `<a class="link" href="${p.repo}" target="_blank" rel="noopener">source →</a>` : ""}
      </div>` : ""}
    </article>`
  ).join("");
}

// ---------- GitHub repos as `ls -la` ----------
let repoCache = [];
async function loadRepos() {
  const list = document.getElementById("repo-list");
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    repoCache = (await res.json()).filter((r) => !r.fork && !HIDDEN_REPOS.includes(r.name.toLowerCase()));
    if (!repoCache.length) {
      list.innerHTML = '<p class="muted">total 0 · new projects coming soon</p>';
      return;
    }
    list.innerHTML =
      `<p class="t-dim muted">total ${repoCache.length}</p>` +
      repoCache.slice(0, 8).map((r) => `
        <a class="repo" href="${r.html_url}" target="_blank" rel="noopener">
          <span class="perm">drwxr-xr-x</span>
          <span class="stars">★${r.stargazers_count}</span>
          <span class="lang">${escapeHtml(r.language || "—")}</span>
          <span class="name">${escapeHtml(r.name)}/</span>
          <span class="desc">${escapeHtml(r.description || "# no description yet")}</span>
        </a>`).join("");
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p class="muted">fatal: could not reach api.github.com · <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">browse on GitHub →</a></p>`;
  }
}

// ---------- Terminal ----------
(function terminal() {
  const out = document.getElementById("term-out");
  const form = document.getElementById("term-form");
  const input = document.getElementById("term-input");
  const body = document.getElementById("term-body");
  const history = [];
  let hIndex = 0;

  // A line is an array of parts: "text" | {t, c} (class) | {t, href}
  function print(...lines) {
    lines.forEach((line) => {
      const p = document.createElement("p");
      (Array.isArray(line) ? line : [line]).forEach((part) => {
        if (typeof part === "string") return p.append(part);
        const el = document.createElement(part.href ? "a" : "span");
        el.textContent = part.t;
        if (part.c) el.className = part.c;
        if (part.href) {
          el.href = part.href;
          if (!part.href.startsWith("mailto:") && !part.href.startsWith("#")) { el.target = "_blank"; el.rel = "noopener"; }
        }
        p.append(el);
      });
      out.append(p);
    });
    body.scrollTop = body.scrollHeight;
  }

  const go = (hash) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  const COMMANDS = {
    help: () => print(
      [{ t: "available commands:", c: "t-acc" }],
      "  whoami      who is Ali?",
      "  about       the short version",
      "  skills      toolkit as a tree",
      "  projects    featured automation",
      "  repos       latest GitHub repos",
      "  honors      certifications & awards",
      "  experience  git log --career",
      "  contact     ways to reach me",
      "  wave        make the avatar wave",
      "  cv          download my CV",
      "  ls · cat <file> · open <section> · echo · date · history · clear",
      [{ t: "tip: use ↑/↓ for history and Tab to autocomplete", c: "t-dim" }]
    ),
    whoami: () => print(
      [{ t: "Muhammad Ali Qureshi", c: "t-ok" }],
      "CRM, AI Automation & Software Solutions Specialist @ The Plum Tree Group",
      "GHL Certified Admin · builds AI voice agents, automations & integrations"
    ),
    about: () => print(
      "I build intelligent systems, custom web apps and integrations that solve",
      "real-world business problems: GoHighLevel, AI voice agents, n8n, Make,",
      "Zapier, APIs and webhooks, plus AI-assisted development with Claude Code.",
      "Background: Computer Science, data analytics, lead generation, client onboarding."
    ),
    skills: () => print(
      [{ t: "skills/", c: "t-acc" }],
      "├── automation_crm  GoHighLevel · n8n · Make.com · Zapier · Mailchimp · Apps Script",
      "├── ai_dev          AI voice agents · Conversational AI · Vapi.ai · Claude Code",
      "├── integration     Custom APIs · Webhooks · CRM integrations",
      "└── data            Python · Pandas · BeautifulSoup · Selenium · Power BI · Excel"
    ),
    projects: () => {
      print([{ t: "featured:", c: "t-acc" }]);
      FEATURED.forEach((p) => print(["  ▸ ", { t: p.title, c: "t-ok" }, ` [${p.tags.join(", ")}]`]));
      print([{ t: "→ opening ./projects", c: "t-dim" }]);
      go("#projects");
    },
    repos: () => {
      if (!repoCache.length) return print([{ t: "no repos loaded yet; try again in a moment", c: "t-dim" }]);
      repoCache.slice(0, 8).forEach((r) => print(["  ", { t: r.name + "/", href: r.html_url }, `  ${r.language || ""}`]));
    },
    honors: () => print(
      ["  ✓ ", { t: "GHL Certified Admin", c: "t-ok" }],
      ["  ★ ", { t: "Achiever Award", c: "t-ok" }, " (Jul 2025, The Plum Tree Group)"],
      ["  ★ ", { t: "Rockstar Employee 2025", c: "t-ok" }]
    ),
    experience: () => print(
      [{ t: "* (HEAD → now) ", c: "t-ok" }, "CRM, AI Automation & Software Solutions Specialist @ The Plum Tree Group"],
      [{ t: "* (earlier)    ", c: "t-acc" }, "Data Analytics, Lead Generation & Client Onboarding"],
      [{ t: "* (init)       ", c: "t-dim" }, "Computer Science · CS50x"]
    ),
    contact: () => print(
      ["  email     ", { t: CONTACT.email, href: "mailto:" + CONTACT.email }],
      ["  whatsapp  ", { t: "+92 310 2983030", href: CONTACT.whatsapp }],
      ["  linkedin  ", { t: "in/automatali", href: CONTACT.linkedin }],
      ["  github    ", { t: "MAliQ-pak", href: CONTACT.github }]
    ),
    wave: () => {
      avatarApi.wave();
      print([{ t: "👋 avatar.wave() executed", c: "t-ok" }]);
      if (document.getElementById("hero-3d").getBoundingClientRect().bottom < 0) print([{ t: "(scroll up to see the 3D one)", c: "t-dim" }]);
    },
    cv: async () => {
      try {
        const res = await fetch("resume.pdf", { method: "HEAD" });
        if (!res.ok) throw 0;
        print([{ t: "downloading resume.pdf…", c: "t-ok" }]);
        const a = Object.assign(document.createElement("a"), { href: "resume.pdf", download: "" });
        a.click();
      } catch {
        print([{ t: "resume.pdf: not published yet. Ask me by email: ", c: "t-dim" }, { t: CONTACT.email, href: "mailto:" + CONTACT.email }]);
      }
    },
    ls: () => print([{ t: "about.md  skills.json  projects/  honors/  experience.log  contact.ts", c: "t-acc" }]),
    cat: (arg) => {
      const map = { "about.md": "about", "skills.json": "skills", "experience.log": "experience", "contact.ts": "contact" };
      if (!arg) return print([{ t: "usage: cat <file>  (try: ls)", c: "t-dim" }]);
      const cmd = map[arg.replace(/^\.\//, "")];
      cmd ? COMMANDS[cmd]() : print([{ t: `cat: ${arg}: No such file or directory`, c: "t-err" }]);
    },
    open: (arg) => {
      const id = (arg || "").replace(/^\.?\/?/, "");
      if (document.getElementById(id)) { print([{ t: `→ opening ./${id}`, c: "t-dim" }]); go("#" + id); }
      else print([{ t: "usage: open about|services|projects|skills|honors|experience|contact", c: "t-dim" }]);
    },
    echo: (arg) => print(arg || ""),
    date: () => print(new Date().toString()),
    history: () => history.forEach((h, i) => print(`  ${i + 1}  ${h}`)),
    clear: () => { out.innerHTML = ""; },
    sudo: (arg) => {
      if (/^hire(-ali)?/.test(arg || "")) {
        print([{ t: "[sudo] permission granted ✅ opening your email client…", c: "t-ok" }]);
        setTimeout(() => { location.href = `mailto:${CONTACT.email}?subject=Let's%20work%20together`; }, 600);
      } else print([{ t: "nice try 😄 try: sudo hire-ali", c: "t-err" }]);
    },
    hire: () => COMMANDS.sudo("hire-ali"),
    exit: () => print([{ t: "there is no escape from good automation 😉", c: "t-dim" }]),
  };

  function run(raw) {
    const line = raw.trim();
    print([{ t: "ali@portfolio:~$ ", c: "t-ok" }, { t: line, c: "t-cmd" }]);
    if (!line) return;
    history.push(line);
    hIndex = history.length;
    const [name, ...rest] = line.split(/\s+/);
    const fn = COMMANDS[name.toLowerCase()];
    fn ? fn(rest.join(" ")) : print([{ t: `command not found: ${name}. Type 'help'.`, c: "t-err" }]);
  }

  print(
    [{ t: "MAQ OS v2.0 · interactive portfolio shell", c: "t-acc" }],
    [{ t: "type 'help' to see what I can do.", c: "t-dim" }]
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && history.length) {
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || "";
      e.preventDefault();
    } else if (e.key === "Tab") {
      const match = Object.keys(COMMANDS).filter((c) => c.startsWith(input.value.trim()));
      if (match.length === 1) input.value = match[0] + " ";
      else if (match.length > 1) print([{ t: match.join("  "), c: "t-dim" }]);
      e.preventDefault();
    }
  });

  document.getElementById("term").addEventListener("click", (e) => {
    if (!e.target.closest("a") && !getSelection().toString()) input.focus({ preventScroll: true });
  });
  document.getElementById("term-chips").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") run(e.target.textContent);
  });

  function openTerminal() {
    document.getElementById("terminal").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => input.focus({ preventScroll: true }), 500);
  }
  document.querySelectorAll("[data-open-terminal]").forEach((b) => b.addEventListener("click", openTerminal));
  addEventListener("keydown", (e) => {
    if (e.key === "`" && document.activeElement !== input) { e.preventDefault(); openTerminal(); }
  });
})();

renderFeatured();
enableTilt();
loadRepos();
