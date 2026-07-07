/* ── Theme ──────────────────────────────────────────── */
const THEME_KEY = "eliyas-theme";
const CYCLE = ["system", "light", "dark"];

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(pref) {
  const resolved = pref === "system" ? getSystemTheme() : pref;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-theme-pref", pref);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.title = `Theme: ${pref} (click to cycle)`;
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY) || "system";
  applyTheme(stored);
}

function cycleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "system";
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

initTheme();

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const pref = localStorage.getItem(THEME_KEY) || "system";
  if (pref === "system") applyTheme("system");
});

const themeBtn = document.getElementById("themeToggle");
if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

/* ── Cursor glow ───────────────────────────────────── */
const glow = document.getElementById("cursorGlow");

document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
  glow.style.opacity = "1";
});

document.addEventListener("mouseleave", () => {
  glow.style.opacity = "0";
});

/* ── Scroll reveal ─────────────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".project-card, .stat, .about__text, .social-link").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

/* ── Smooth nav scroll ─────────────────────────────── */
document.querySelectorAll('.nav__links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

/* ── Games Count Loader ────────────────────────────── */
async function loadGamesCount() {
  let count = 26; // Default fallback count of directories in Games
  try {
    const response = await fetch('../Games/script.js');
    if (response.ok) {
      const scriptText = await response.text();
      const matches = scriptText.match(/const\s+GAMES\s*=\s*\[([\s\S]*?)\];/);
      if (matches && matches[1]) {
        const idMatches = matches[1].match(/id\s*:\s*['"`]/g);
        if (idMatches && idMatches.length > 0) {
          count = idMatches.length;
        }
      }
    }
  } catch (error) {
    console.warn("Could not dynamically load games count from script.js, using fallback:", error);
  }

  document.querySelectorAll('.games-count-val').forEach(el => {
    el.textContent = count;
  });
}

loadGamesCount();
