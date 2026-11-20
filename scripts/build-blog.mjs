/*
  MichaelOS 98 blog builder. Turns posts/*.md into real pages under blog/.
  No dependencies. Runs automatically on every deploy (see wrangler.jsonc).

  Run it yourself to preview:   node scripts/build-blog.mjs
  Include draft posts:          node scripts/build-blog.mjs --drafts

  A post is a file like  posts/2026-11-20-my-post.md  (date + slug in the name):

    ---
    title: My post
    summary: Optional one-liner for link previews (otherwise the first paragraph)
    image: Optional preview picture, e.g. cover.jpg (otherwise the first picture in the post)
    draft: true      <- optional; drafts are skipped on the live site
    ---
    Write the post in Markdown here. Pictures: ![what it shows](photo.jpg)
    looks in images/blog/ for photo.jpg.

  Anything wrong with a post stops the build, so a broken post never goes live.
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://michaelbarnes.xyz";
const AUTHOR = "Michael Barnes (Papabread)";
const BLOG_TITLE = "Michael's Blog";
const BLOG_DESC = "Project updates and commentary on life from Michael Barnes (Papabread).";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "posts");
const OUT = process.env.BLOG_OUT || path.join(ROOT, "blog");
const IMG_DIR = "/images/blog/";
const withDrafts = process.argv.includes("--drafts");

/* ---------- Helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const plain = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);
const abs = (u) => (u.startsWith("/") ? SITE + u : u);
const dateObj = (d) => new Date(d + "T12:00:00Z");
const niceDate = (d) => dateObj(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

// Links: allow web, email and on-site links only (no javascript: and friends)
function linkUrl(u) {
  if (/^(https?:|mailto:)/i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null;
  return u;
}
// Pictures: a bare file name means images/blog/<name>
function imgUrl(u) {
  if (/^https?:/i.test(u) || u.startsWith("/")) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null;
  return IMG_DIR + u.replace(/^\.?\/?(images\/blog\/)?/, "");
}

/* ---------- Markdown (the useful parts) ---------- */
// The text is HTML-escaped first, so nothing in a post can inject markup or scripts.
function inline(src) {
  const stash = [];
  const keep = (html) => `\u0000${stash.push(html) - 1}\u0000`;
  let s = src.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${esc(c)}</code>`));
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => {
    const u = imgUrl(url);
    return u ? keep(`<img src="${u}" alt="${alt}" loading="lazy" decoding="async">`) : alt;
  });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
    const u = linkUrl(url);
    if (!u) return text;
    const ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "";
    return `${keep(`<a href="${u}"${ext}>`)}${text}${keep("</a>")}`;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/(^|[^_\w])_(?!\s)(.+?)_(?!\w)/g, "$1<em>$2</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[i]);
}

const BLOCK_START = /^(```|#{1,4}\s|>|\s*[-*+]\s+|\s*\d+[.)]\s+|(-{3,}|\*{3,})\s*$)/;

function markdown(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0, m;
  const collect = (test, strip) => {
    const buf = [];
    while (i < lines.length && test.test(lines[i])) buf.push(lines[i++].replace(strip, ""));
    return buf;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^```/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
    } else if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      const n = Math.max(2, m[1].length); // the post title is the page's h1, so # and ## are both h2
      out.push(`<h${n}>${inline(m[2])}</h${n}>`);
      i++;
    } else if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      out.push("<hr>");
      i++;
    } else if (/^>/.test(line)) {
      out.push(`<blockquote>${markdown(collect(/^>/, /^>\s?/).join("\n"))}</blockquote>`);
    } else if (/^\s*[-*+]\s+/.test(line)) {
      out.push(`<ul>${collect(/^\s*[-*+]\s+/, /^\s*[-*+]\s+/).map((t) => `<li>${inline(t)}</li>`).join("")}</ul>`);
    } else if (/^\s*\d+[.)]\s+/.test(line)) {
      out.push(`<ol>${collect(/^\s*\d+[.)]\s+/, /^\s*\d+[.)]\s+/).map((t) => `<li>${inline(t)}</li>`).join("")}</ol>`);
    } else {
      const buf = [];
      while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) buf.push(lines[i++].trim());
      // A picture on its own line becomes a captioned figure
      const pic = buf.length === 1 && buf[0].match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (pic) {
        out.push(`<figure>${inline(buf[0])}${pic[1] ? `<figcaption>${esc(pic[1])}</figcaption>` : ""}</figure>`);
      } else {
        out.push(`<p>${buf.map(inline).join("<br>\n")}</p>`); // a new line in the file = a new line on the page
      }
    }
  }
  return out.join("\n");
}

/* ---------- Read posts ---------- */
function readPost(file) {
  let raw = fs.readFileSync(path.join(SRC, file), "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const meta = {};
  const fm = raw.match(/^---\n([\s\S]*?)\n---[ \t]*(\n|$)/);
  if (fm) {
    raw = raw.slice(fm[0].length);
    fm[1].split("\n").forEach((l) => {
      const kv = l.match(/^\s*(\w+)\s*:\s*(.*?)\s*$/);
      if (kv) meta[kv[1].toLowerCase()] = kv[2].replace(/^(["'])(.*)\1$/, "$2");
    });
  }
  const base = path.basename(file, ".md");
  const named = base.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  const date = meta.date || (named && named[1]) || "";
  const slug = (meta.slug || (named ? named[2] : base)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const problem = (msg) => { throw new Error(`posts/${file}: ${msg}`); };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(dateObj(date))) problem('needs a date: start the file name with YYYY-MM-DD- or add a "date: YYYY-MM-DD" line');
  if (!meta.title) problem('needs a "title:" line between the --- lines at the top');
  if (!slug) problem("the file name needs some words after the date");

  const html = markdown(raw.trim());
  const firstP = (html.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || "";
  const firstImg = (html.match(/<img src="([^"]+)"/) || [])[1];
  return {
    slug, date, title: meta.title,
    draft: /^(true|yes)$/i.test(meta.draft || ""),
    summary: meta.summary || clip(plain(firstP), 160),
    image: meta.image ? imgUrl(meta.image) : firstImg || null,
    html,
  };
}

/* ---------- Page templates ---------- */
function page({ title, desc, url, image, type = "website", date, nav, body }) {
  const img = abs(image || "/images/mjb-logo.png");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="author" content="${esc(AUTHOR)}">
  <meta name="theme-color" content="#8c3a12">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="MichaelOS 98">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">${date ? `
  <meta property="article:published_time" content="${date}">` : ""}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="alternate" type="application/rss+xml" title="${esc(BLOG_TITLE)}" href="/blog/rss.xml">
  <link rel="stylesheet" href="/blog.css">
</head>
<body>
  <div class="bp-win">
    <header class="bp-titlebar">
      <span>${esc(nav.windowTitle)}</span>
      <a class="bp-x" href="/" aria-label="Close and go to the MichaelOS desktop">&times;</a>
    </header>
    <nav class="bp-menubar" aria-label="Blog">
      <a href="/blog/">All posts</a>
      <a href="${nav.desktop}">Open in MichaelOS</a>
      <a href="/blog/rss.xml">RSS</a>
    </nav>
    <main class="bp-body">
${body}
    </main>
    <footer class="bp-status">
      <span>${esc(AUTHOR)}</span>
      <a href="/">michaelbarnes.xyz</a>
    </footer>
  </div>
</body>
</html>
`;
}

function postPage(p, newer, older) {
  const pager = (newer || older) ? `
      <nav class="bp-pager" aria-label="More posts">
        ${older ? `<a href="/blog/${older.slug}/" rel="prev">&larr; ${esc(older.title)}</a>` : "<span></span>"}
        ${newer ? `<a href="/blog/${newer.slug}/" rel="next">${esc(newer.title)} &rarr;</a>` : "<span></span>"}
      </nav>` : "";
  return page({
    title: `${p.title} | ${BLOG_TITLE}`, desc: p.summary, url: `${SITE}/blog/${p.slug}/`,
    image: p.image, type: "article", date: p.date,
    nav: { windowTitle: `${p.slug}.txt - Breadpad`, desktop: `/#blog/${p.slug}` },
    body: `      <article class="bp-post">
        <h1>${esc(p.title)}</h1>
        <p class="bp-date"><time datetime="${p.date}">${niceDate(p.date)}</time></p>
${p.html}
      </article>${pager}`,
  });
}

function indexPage(posts) {
  const list = posts.length
    ? `<ul class="bp-list">\n${posts.map((p) => `        <li>
          <time datetime="${p.date}">${niceDate(p.date)}</time>
          <a href="/blog/${p.slug}/">${esc(p.title)}</a>
          <p>${esc(p.summary)}</p>
        </li>`).join("\n")}\n      </ul>`
    : `<p>No posts yet. Michael is "working on it."</p>`;
  return page({
    title: BLOG_TITLE, desc: BLOG_DESC, url: `${SITE}/blog/`,
    nav: { windowTitle: "C:\\Blog - Explorer", desktop: "/#blog" },
    body: `      <h1>${esc(BLOG_TITLE)}</h1>\n      ${list}`,
  });
}

function rss(posts) {
  const absolute = (html) => html.replace(/(src|href)="\//g, `$1="${SITE}/`);
  const items = posts.slice(0, 30).map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}/</guid>
      <pubDate>${dateObj(p.date).toUTCString()}</pubDate>
      <description>${esc(absolute(p.html))}</description>
    </item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(BLOG_TITLE)}</title>
    <link>${SITE}/blog/</link>
    <description>${esc(BLOG_DESC)}</description>
    <language>en-us</language>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

/* ---------- Build ---------- */
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".md")) : [];
const posts = files.map(readPost).filter((p) => withDrafts || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

const seen = new Set();
posts.forEach((p) => {
  if (seen.has(p.slug)) throw new Error(`Two posts use the address /blog/${p.slug}/. Rename one of the files.`);
  seen.add(p.slug);
});

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), indexPage(posts));
fs.writeFileSync(path.join(OUT, "rss.xml"), rss(posts));
// For the desktop Blog folder (app.js)
fs.writeFileSync(path.join(OUT, "posts.json"), JSON.stringify(posts.map((p) => ({
  slug: p.slug, title: p.title, date: p.date, dateText: niceDate(p.date), summary: p.summary, html: p.html,
}))));
posts.forEach((p, n) => {
  fs.mkdirSync(path.join(OUT, p.slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, p.slug, "index.html"), postPage(p, posts[n - 1], posts[n + 1]));
});

const drafts = files.length - posts.length;
console.log(`Blog: built ${posts.length} post${posts.length === 1 ? "" : "s"}${drafts ? `, skipped ${drafts} draft${drafts === 1 ? "" : "s"}` : ""}.`);
