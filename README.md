# mjb-site

MichaelOS 98: the personal site at michaelbarnes.xyz. Static files with no build step, served by a Cloudflare Worker
(`mjb-site`) that auto-deploys on every push to `main`.

## Files

- `data.js` — all the content (about text, projects, builds, trash, error popups). Edit this one.
- `app.js` — window manager, boot screen, popups, screensaver. Pixel icons are embedded at the top.
- `styles.css` — the look.
- `_headers` — security headers (served by the Worker).
- `worker/index.js` — the only server code: handles `/api/contact`, checks Turnstile, and emails the message.
- `wrangler.jsonc` — Worker settings: the email binding (locked to Michael's verified Gmail) and the site folder.
- `.assetsignore` — files that must never be served as web pages (config, worker code, this README).

## Contact form

The form posts to `/api/contact`. It needs:
- `turnstileSiteKey` in `data.js` (public).
- `TURNSTILE_SECRET` saved as a **Secret** in the Worker's Variables and Secrets (never in a file).
- `michaelbarnes0@gmail.com` verified under Email Routing for michaelbarnes.xyz.

The Turnstile widget only allows michaelbarnes.xyz, so the form fails on the workers.dev address. That's expected.

## Photos

Drop a photo at `images/projects/<id>.jpg` or `images/builds/<id>.jpg`, using the `id` from `data.js`,
and it shows up automatically. Anything without a photo gets a "Cannot find" placeholder.
For a different name or format, add `photo: "images/builds/whatever.png"` to that item.

## Run it locally

Any static server works, for example `python -m http.server 8000`, then open http://localhost:8000.
The contact form can't send from there (no Worker), but everything else works.
The boot screen only plays once per browser tab; open a new tab to see it again.

Fonts: Pixelify Sans and Atkinson Hyperlegible, both under the SIL Open Font License (see `fonts/`).
