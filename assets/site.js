// all of this is extra, the page still works with js turned off
const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

// theme toggle, dark is default, choice is saved
const themeBtn = document.querySelector(".theme-btn");
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme) {
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  const isLight = theme === "light";
  themeBtn?.setAttribute("aria-pressed", String(isLight));
  themeBtn?.setAttribute("aria-label", themeBtn.dataset[isLight ? "toDark" : "toLight"]);
  themeMeta?.setAttribute("content", getComputedStyle(document.body).backgroundColor);
}
applyTheme(root.dataset.theme);
themeBtn?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch { /* localStorage blocked (private mode), ignore */ }
});

// nav gets more solid after scrolling a bit
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// highlight the nav link for whatever section is on screen
const links = [...document.querySelectorAll(".links a, .menu a")];
const list = document.querySelector(".links");
const pill = document.querySelector(".pill");
function movePill(link) {
  if (!link || !list.offsetParent) { pill.style.setProperty("--pill-o", 0); return; }
  const a = link.getBoundingClientRect(), b = list.getBoundingClientRect();
  pill.style.setProperty("--pill-x", `${a.left - b.left}px`);
  pill.style.setProperty("--pill-w", `${a.width}px`);
  pill.style.setProperty("--pill-o", 1);
}
let current = null;
function setCurrent(id) {
  current = id;
  for (const a of links) {
    if (a.hash === `#${id}`) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  }
  movePill(id && list.querySelector(`a[href="#${id}"]`));
}
const sections = [...document.querySelectorAll("main section[id]")];
const seen = new Map();
const sectionObserver = new IntersectionObserver((entries) => {
  for (const e of entries) seen.set(e.target.id, e.isIntersecting);
  const visible = sections.find((s) => seen.get(s.id));
  setCurrent(visible ? visible.id : null);
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => sectionObserver.observe(s));
addEventListener("resize", () => setCurrent(current));
// pill follows the mouse along the links, then goes back to the current section
if (finePointer.matches) {
  list.addEventListener("pointerover", (e) => { const a = e.target.closest("a"); if (a) movePill(a); });
  list.addEventListener("pointerleave", () => setCurrent(current));
}

// close the mobile menu when a link is tapped
const menu = document.getElementById("menu");
menu?.addEventListener("click", (e) => { if (e.target.closest("a")) menu.hidePopover?.(); });

// fade things in on scroll
const revealObserver = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add("in");
    revealObserver.unobserve(e.target);
  }
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// shine that follows the mouse on glass + service cards
if (finePointer.matches) {
  let frame = 0;
  addEventListener("pointermove", (e) => {
    const el = e.target.closest?.(".glass, .services li");
    if (!el || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }, { passive: true });
}

// glass refraction, only chrome/edge desktop support an svg filter inside backdrop-filter
// (maps only update on resize, good enough for this page)
if ("userAgentData" in navigator && finePointer.matches && !reduceMotion.matches
    && !matchMedia("(prefers-reduced-transparency: reduce)").matches) {
  const NS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(NS, "svg");
  defs.setAttribute("width", "0"); defs.setAttribute("height", "0");
  defs.setAttribute("aria-hidden", "true");
  defs.style.position = "absolute";
  document.body.append(defs);

  // red = x shift, green = y shift, the grey middle doesn't move so only the edges bend
  function lensMap(w, h) {
    const rx = Math.min(h / 2, w / 2, 40) / w, ry = Math.min(h / 2, 40) / h;
    const svg = `<svg xmlns="${NS}" width="${w}" height="${h}"><defs>`
      + `<linearGradient id="x"><stop offset="0" stop-color="#000"/><stop offset="${rx}" stop-color="#800000"/><stop offset="${1 - rx}" stop-color="#800000"/><stop offset="1" stop-color="#f00"/></linearGradient>`
      + `<linearGradient id="y" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="${ry}" stop-color="#008000"/><stop offset="${1 - ry}" stop-color="#008000"/><stop offset="1" stop-color="#0f0"/></linearGradient>`
      + `</defs><rect width="100%" height="100%" fill="url(#x)"/><rect width="100%" height="100%" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  let n = 0;
  function lens(el) {
    const id = `lens-${n++}`;
    const filter = document.createElementNS(NS, "filter");
    filter.id = id;
    for (const [k, v] of Object.entries({ x: 0, y: 0, width: "100%", height: "100%", "color-interpolation-filters": "sRGB" })) filter.setAttribute(k, v);
    const img = document.createElementNS(NS, "feImage");
    img.setAttribute("preserveAspectRatio", "none");
    img.setAttribute("result", "map");
    const disp = document.createElementNS(NS, "feDisplacementMap");
    disp.setAttribute("in", "SourceGraphic");
    disp.setAttribute("in2", "map");
    disp.setAttribute("xChannelSelector", "R");
    disp.setAttribute("yChannelSelector", "G");
    filter.append(img, disp);
    defs.append(filter);
    const size = () => {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      img.setAttribute("width", w); img.setAttribute("height", h);
      img.setAttribute("href", lensMap(w, h));
      disp.setAttribute("scale", String(-Math.min(h, 90) * 0.45));
    };
    size();
    new ResizeObserver(size).observe(el);
    el.dataset.lens = "";
    el.style.setProperty("--lens", `url(#${id})`);
  }
  document.querySelectorAll(".glass:not(.menu)").forEach(lens);
  root.classList.add("lg");
}
