/*
  MichaelOS 98 gallery builder. Lists the pictures in images/gallery/ and writes gallery.json,
  which the desktop's Artwork folder reads (app.js). Browsers can't list a folder on the web
  server, so this runs on every deploy (see wrangler.jsonc). No dependencies.

  Run it yourself to preview:   node scripts/build-gallery.mjs

  Name pictures like  images/gallery/2026-11-21-sunset-toast.jpg
    - The date is optional. Dated pictures come first, newest first; undated ones follow, A to Z.
    - The rest of the name becomes the title: "sunset-toast" -> "Sunset toast".
    - jpg, jpeg, png, gif, webp and avif are picked up. Anything else in the folder is ignored.

  A bad date (like 2026-13-40-x.jpg) or two pictures with the same title stops the build,
  so a mistake never goes live.
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "images", "gallery");
const OUT = process.env.GALLERY_OUT || path.join(ROOT, "gallery.json");
const URL_DIR = "/images/gallery/";
const EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);
const BIG = 1024 * 1024; // warn (don't fail) above 1 MB

const niceDate = (d) => new Date(d + "T12:00:00Z")
  .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

function readPicture(file) {
  const ext = path.extname(file).toLowerCase();
  const stem = path.basename(file, path.extname(file));
  const m = stem.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  const date = m ? m[1] : null;
  const rest = m ? m[2] : stem;

  if (date) {
    const d = new Date(date + "T12:00:00Z");
    if (isNaN(d) || d.toISOString().slice(0, 10) !== date) {
      throw new Error(`images/gallery/${file}: "${date}" isn't a real date. Use YYYY-MM-DD.`);
    }
  }

  const words = rest.replace(/[-_]+/g, " ").trim();
  if (!words) throw new Error(`images/gallery/${file}: needs a name after the date.`);
  const title = words.charAt(0).toUpperCase() + words.slice(1);

  const size = fs.statSync(path.join(SRC, file)).size;
  if (size > BIG) console.warn(`Gallery: warning, ${file} is ${(size / BIG).toFixed(1)} MB. Aim for a few hundred KB.`);

  return {
    src: URL_DIR + encodeURIComponent(file),
    file: rest.replace(/-/g, "_").toLowerCase() + ext, // fake file name shown in the folder
    title,
    date,
    dateText: date ? niceDate(date) : null,
  };
}

/* ---------- Build ---------- */
const files = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter((f) => !f.startsWith(".") && EXTS.has(path.extname(f).toLowerCase()))
  : [];

const pics = files.map(readPicture).sort((a, b) =>
  (a.date && b.date) ? b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
  : a.date ? -1 : b.date ? 1
  : a.title.localeCompare(b.title));

const seen = new Set();
pics.forEach((p) => {
  if (seen.has(p.file)) throw new Error(`Two gallery pictures would both show as ${p.file}. Rename one.`);
  seen.add(p.file);
});

fs.writeFileSync(OUT, JSON.stringify(pics));
console.log(`Gallery: listed ${pics.length} picture${pics.length === 1 ? "" : "s"}.`);
