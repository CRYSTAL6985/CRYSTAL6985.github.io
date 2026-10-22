// Site check: run with `npm run check`. Exits 1 and prints one line per problem.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const PAGES = { en: "index.html", fa: "fa/index.html" };
const LANG_LINK = { en: "fa/index.html", fa: "../index.html" };

const problems = [];
const sectionIds = {};

for (const [lang, page] of Object.entries(PAGES)) {
  const file = path.join(ROOT, page);
  if (!fs.existsSync(file)) {
    problems.push(`${page} missing`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);

  if (/[—–]/.test(html)) problems.push(`${page}: contains an em/en dash`);

  for (const [, ref] of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(ref)) continue;
    const target = path.join(dir, ref.split("#")[0]);
    const resolved = ref.endsWith("/") ? path.join(target, "index.html") : target;
    if (!fs.existsSync(resolved)) problems.push(`${page}: broken link ${ref}`);
  }

  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    for (const attr of ["alt", "width", "height"])
      if (!new RegExp(`\\s${attr}="`).test(img)) problems.push(`${page}: <img> without ${attr}: ${img.slice(0, 60)}`);
  }

  if (!html.includes(`href="${LANG_LINK[lang]}"`)) problems.push(`${page}: no language link to ${LANG_LINK[lang]}`);

  const visible = html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  if (/crystal/i.test(visible)) problems.push(`${page}: visible text mentions "crystal"`);

  sectionIds[lang] = [...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map((m) => m[1]).join(",");
}

if (sectionIds.en !== undefined && sectionIds.fa !== undefined && sectionIds.en !== sectionIds.fa)
  problems.push(`sections differ: en=[${sectionIds.en}] fa=[${sectionIds.fa}]`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("check passed");
