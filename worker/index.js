/*
  MichaelOS 98 server. Static files are served straight from the site folder;
  this code only runs for /api/contact, which emails form messages to Michael.

  Needs (see wrangler.jsonc):
    EMAIL            send_email binding, locked to Michael's verified inbox
    TURNSTILE_SECRET secret from the Turnstile widget (set in the Cloudflare dashboard)
*/
import { EmailMessage } from "cloudflare:email";

const FROM = "contact@michaelbarnes.xyz";
const LIMITS = { name: 100, email: 200, message: 5000 };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return json({ ok: false, error: "Use POST." }, 405);
      try {
        return await handleContact(request, env);
      } catch (err) {
        console.error("contact form failed:", err);
        return json({ ok: false, error: "The message didn't send. Try again in a minute." }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "That didn't look like a form." }, 400);
  }

  // Hidden "website" field: humans never see it, bots fill it in. Pretend it worked.
  if (data.website) return json({ ok: true });

  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const message = String(data.message || "").trim().slice(0, LIMITS.message);

  if (!name) return json({ ok: false, error: "Add your name." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "That email address doesn't look right." }, 400);
  if (message.length < 2) return json({ ok: false, error: "Write a message first." }, 400);

  const human = await checkTurnstile(data.token, request.headers.get("CF-Connecting-IP"), env.TURNSTILE_SECRET);
  if (!human) return json({ ok: false, error: "The spam check failed. Refresh the page and try again." }, 403);

  const raw = buildEmail({
    from: `MichaelOS Contact Form <${FROM}>`,
    to: env.EMAIL_TO,
    replyTo: email,
    subject: `michaelbarnes.xyz message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}\n\n--\nSent from the contact form on michaelbarnes.xyz`,
  });
  await env.EMAIL.send(new EmailMessage(FROM, env.EMAIL_TO, raw));
  return json({ ok: true });
}

async function checkTurnstile(token, ip, secret) {
  if (!token || !secret) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const out = await res.json();
  return out.success === true;
}

// One line, no control characters (stops header injection), capped length
function clean(value, max) {
  return String(value || "").replace(/[\r\n\t\0<>"]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

// Plain-text email built by hand, so there are no npm packages to install
function buildEmail({ from, to, replyTo, subject, text }) {
  const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const body = b64(text).replace(/.{76}/g, "$&\r\n");
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@michaelbarnes.xyz>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    body,
  ].join("\r\n");
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
