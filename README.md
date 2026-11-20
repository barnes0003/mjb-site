<p align="center">
  <img src="images/mjb-logo.png" width="160" alt="MJB logo">
</p>

# mjb-site

MichaelOS 98: the personal site at michaelbarnes.xyz. Static files with no build step, served by a Cloudflare Worker
(`mjb-site`) that auto-deploys on every push to `main`.

## Files

- `data.js` — all the content (about text, projects, builds, trash, error popups). Edit this one.
- `app.js` — window manager, boot screen, popups, screensaver. Pixel icons are embedded at the top.
- `styles.css` — the look.
- `blog.css` — the look of blog posts (shareable pages and desktop windows).
- `posts/` — blog posts in Markdown. Write here.
- `images/blog/` — pictures for blog posts.
- `scripts/build-blog.mjs` — turns `posts/` into `blog/` on every deploy. `blog/` is generated: never edit it, never commit it.
- `_headers` — security headers (served by the Worker).
- `worker/index.js` — the only server code: handles `/api/contact`, checks Turnstile, and emails the message.
- `wrangler.jsonc` — Worker settings: the blog build step, the email binding (locked to Michael's verified Gmail) and the site folder.
- `.assetsignore` — files that must never be served as web pages (config, worker code, this README).

## Contact form

The form posts to `/api/contact`. It needs:
- `turnstileSiteKey` in `data.js` (public).
- `TURNSTILE_SECRET` saved as a **Secret** in the Worker's Variables and Secrets (never in a file).
- `michaelbarnes0@gmail.com` verified under Email Routing for michaelbarnes.xyz.

The Turnstile widget only allows michaelbarnes.xyz, so the form fails on the workers.dev address. That's expected.

## Blog

1. Make a file in `posts/` named `YYYY-MM-DD-short-name.md`, e.g. `posts/2026-11-20-new-synth.md`.
   The short name becomes the address: `michaelbarnes.xyz/blog/new-synth/`.
2. Start it with:
   ```
   ---
   title: The title people see
   ---
   ```
   Optional lines between the `---` lines: `summary:` (text for link previews, otherwise the first paragraph),
   `image:` (preview picture, otherwise the first picture in the post), `draft: true` (keeps it off the live site).
3. Write the post in Markdown below that. A new line in the file is a new line on the page.
   `**bold**`, `*italic*`, `[link text](https://...)`, `## heading`, `- list item`, `> quote`.
4. Pictures go in `images/blog/`. In the post, just use the file name: `![caption shown under it](photo.jpg)`.
   Pictures from other websites won't show (the security headers block them), so always save them here.
5. Commit and push. Cloudflare builds and deploys it.

Each post gets a shareable page with link previews, opens in a Breadpad window from the desktop's Blog folder,
and shows up in the RSS feed at `/blog/rss.xml`. `michaelbarnes.xyz/#blog/<short-name>` opens a post on the desktop.

A post with a problem (no title, bad date, two posts with the same short name) stops the deploy on purpose,
so the live site stays on the last good version. The error is in the Cloudflare build log.

## Photos

Drop a photo at `images/projects/<id>.jpg` or `images/builds/<id>.jpg`, using the `id` from `data.js`,
and it shows up automatically. Anything without a photo gets a "Cannot find" placeholder.
For a different name or format, add `photo: "images/builds/whatever.png"` to that item.

## Run it locally

Build the blog first (needs Node; `--drafts` includes draft posts): `node scripts/build-blog.mjs --drafts`

Then any static server works, for example `python -m http.server 8000`, then open http://localhost:8000.
The contact form can't send from there (no Worker), but everything else works.
The boot screen only plays once per browser tab; open a new tab to see it again.

Fonts: Pixelify Sans and Atkinson Hyperlegible, both under the SIL Open Font License (see `fonts/`).
