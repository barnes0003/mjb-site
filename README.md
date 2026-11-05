# mjb-site

MichaelOS 98: the personal site at michaelbarnes.xyz. Static files, no build step, hosted on Cloudflare Pages.

## Files

- `data.js` — all the content (about text, projects, builds, trash, error popups). Edit this one.
- `app.js` — window manager, boot screen, popups, screensaver. Pixel icons are embedded at the top.
- `styles.css` — the look.
- `_headers` — security headers for Cloudflare Pages.

## Photos

Drop a photo at `images/projects/<id>.jpg` or `images/builds/<id>.jpg`, using the `id` from `data.js`,
and it shows up automatically. Anything without a photo gets a "Cannot find" placeholder.
For a different name or format, add `photo: "images/builds/whatever.png"` to that item.

## Run it locally

Any static server works, for example `python -m http.server 8000`, then open http://localhost:8000.
The boot screen only plays once per browser tab; open a new tab to see it again.

Fonts: Pixelify Sans and Atkinson Hyperlegible, both under the SIL Open Font License (see `fonts/`).
