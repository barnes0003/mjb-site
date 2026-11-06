/* MichaelOS 98 — window manager, boot, and general nonsense. No build step. */
(function () {
  "use strict";

  const D = window.MOS_DATA;
  const PIX = {"palette":{"k":"#1d140a","w":"#fffdf6","c":"#c0601c","d":"#8c3a12","l":"#f2b56b","y":"#ffd84a","o":"#e0892f","g":"#9b7a48","s":"#d9c7a0","b":"#2f4bff","r":"#b3123f","p":"#7b2cbf","t":"#3fb6a8","e":"#6b6b6b","h":"#c8c8c8","n":"#5fd35f"},"icons":{"bread":["................","................","................","....kkkkkkkk....","..kkllolloollkk.",".kllollollolllok",".kcllcllcllcllck","kccocccocccoccck","kcccccccccccccck","kcccccccccccccck","kdccccccccccccdk",".kddccccccccddk.","..kkddddddddkk..","....kkkkkkkk....","................","................"],"folder":["................","................",".kkkkkk.........","kyyyyyyk........","kyyyyyyykkkkkkk.","kyyyyyyyyyyyyyyk","kkkkkkkkkkkkkkkk","kwyyyyyyyyyyyyok","kyyyyyyyyyyyyyok","kyyyyyyyyyyyyyok","kyyyyyyyyyyyyyok","kyyyyyyyyyyyyyok","kyyyyyyyyyyyyyok","kooooooooooooook","kkkkkkkkkkkkkkkk","................"],"doc":["..kkkkkkkkk.....","..kwwwwwwwkk....","..kwwwwwwwkwk...","..kwwwwwwwkkkk..","..kwkkkkkwwwwk..","..kwwwwwwwwwwk..","..kwkkkkkkkwwk..","..kwwwwwwwwwwk..","..kwkkkkkkwwwk..","..kwwwwwwwwwwk..","..kwkkkkkkkkwk..","..kwwwwwwwwwwk..","..kwkkkkkwwwwk..","..kwwwwwwwwwwk..","..kkkkkkkkkkkk..","................"],"wrench":["................","..........kkk...",".........khhk...","........khhk..k.","........khhk.khk","........khhhkhhk",".......khhhhhhk.","......khhhhhkk..",".....khhhkkk....","....khhhk.......","...khhhk........","..khhhk.........",".khhhk..........","kkhhk...........","kekk............","kk.............."],"mail":["................","................","................","kkkkkkkkkkkkkkkk","kwkwwwwwwwwwwkwk","kwwkwwwwwwwwkwwk","kwwwkwwwwwwkwwwk","kwwwwkwwwwkwwwwk","kwwwwwkkkkwwwwwk","kwwwwkwwwwkwwwwk","kwwwkwwwwwwkwwwk","kwwkwwwwwwwwkwwk","kwkwwwwwwwwwwkwk","kkkkkkkkkkkkkkkk","................","................"],"trash":["................","......kkkk......","..kkkkkhhkkkkk..","..khhhhhhhhhhk..","..kkkkkkkkkkkk..","...khwhwhwhwk...","...khwhwhwhwk...","...khwhwhwhwk...","...khwhwhwhwk...","...khwhwhwhwk...","...khwhwhwhwk...","...khwhwhwhwk...","...khwhwhwhwk...","...kehehehehk...","....kkkkkkkk....","................"],"warn":[".......kk.......","......kyyk......","......kyyk......",".....kyyyyk.....",".....kykkyk.....","....kyykkyyk....","....kyykkyyk....","...kyyykkyyyk...","...kyyykkyyyk...","..kyyyykkyyyyk..","..kyyyyyyyyyyk..",".kyyyyykkyyyyyk.",".kyyyyykkyyyyyk.","kyyyyyyyyyyyyyyk","kkkkkkkkkkkkkkkk","................"],"power":["................",".......kk.......","...kk..kk..kk...","..kk...kk...kk..",".kk....kk....kk.",".kk....kk....kk.","kk.....kk.....kk","kk.....kk.....kk","kk............kk","kk............kk",".kk..........kk.",".kk..........kk.","..kk........kk..","...kkk....kkk...",".....kkkkkk.....","................"],"app":["kkkkkkkkkkkkkkkk","kbbbbbbbbbbbbbbk","kbwbbbbbbbbkwkwk","kkkkkkkkkkkkkkkk","kwwwwwwwwwwwwwwk","kwppwwwwwwwwwwwk","kwppwwkkkkkkwwwk","kwwwwwwwwwwwwwwk","kwttwwwwwwwwwwwk","kwttwwkkkkkkkwwk","kwwwwwwwwwwwwwwk","kwyywwwwwwwwwwwk","kwyywwkkkkkwwwwk","kwwwwwwwwwwwwwwk","kkkkkkkkkkkkkkkk","................"],"chip":["................","...k.k.k.k.k....","...k.k.k.k.k....","..kkkkkkkkkkk...","kkkeeeeeeeeekkk.","..keeeeeeeeek...","kkkeehhhhheekkk.","..keehnnnheek...","kkkeehnnnheekkk.","..keehhhhheek...","kkkeeeeeeeeekkk.","..kkkkkkkkkkk...","...k.k.k.k.k....","...k.k.k.k.k....","................","................"],"image":["kkkkkkkkkkkkkkkk","kbbbbbbbbbbbbbbk","kbbbbbbbbbyybbbk","kbbbbbbbbbyybbbk","kbbbbbbbbbbbbbbk","kbbbbbkbbbbbbbbk","kbbbbknkbbbbbbbk","kbbbknnnkbbbkbbk","kbbknnnnnkbknkbk","kbknnnnnnnknnnkk","kknnnnnnnnnnnnnk","knnnnnnnnnnnnnnk","kkkkkkkkkkkkkkkk","................","................","................"],"speaker":["................","......k.........",".....kk.........","....khk...k.....","kkkkhhk....k....","khhhhhk.k...k...","khhhhhk..k..k...","khhhhhk..k..k...","khhhhhk.k...k...","kkkkhhk....k....","....khk...k.....",".....kk.........","......k.........","................","................","................"],"link":["kkkkkkkkkkkkkkkk","kwwwwwwwwwwwwwwk","kwwwwwwwwwwwwwwk","kwwwwppppwwwwwwk","kwwwpwwwwpwwwwwk","kwwpwwppwwpwwwwk","kwwpwpwwpwpwwwwk","kwwpwpwwpwpwwwwk","kwwwpwppwwpwwwwk","kwwwwpwwwpwwwwwk","kwwwwwppppwwwwwk","kkkkkwwwwwwwwwwk","kwwkkwwwwwwwwwwk","kwkkkkkkkkkkkkkk","kkk.............","................"]}};

  const $ = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPhone = () => window.matchMedia("(max-width: 40rem)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  function store(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------- Pixel icons ---------- */
  const svgCache = {};
  function iconSVG(name) {
    if (svgCache[name]) return svgCache[name];
    const rows = PIX.icons[name] || PIX.icons.app;
    let rects = "";
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        let run = 1;
        while (x + run < row.length && row[x + run] === ch) run++;
        if (ch !== ".") rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PIX.palette[ch]}"/>`;
        x += run;
      }
    });
    svgCache[name] = `<svg viewBox="0 0 16 16" aria-hidden="true">${rects}</svg>`;
    return svgCache[name];
  }
  function icon(name) {
    const s = document.createElement("span");
    s.className = "ico";
    s.innerHTML = iconSVG(name);
    return s;
  }
  function paintIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach((el) => {
      el.innerHTML = iconSVG(el.dataset.icon);
    });
  }

  function el(tag, attrs = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    kids.flat().forEach((k) => k != null && n.append(k));
    return n;
  }

  /* ---------- Window manager ---------- */
  const winLayer = $("#windows");
  const taskBar = $("#task-buttons");
  const open = new Map(); // key -> { win, task }
  let zTop = 10;
  let cascade = 0;

  function focusWin(key) {
    open.forEach((o, k) => {
      const on = k === key;
      o.win.classList.toggle("active", on);
      o.task.setAttribute("aria-pressed", on && !o.win.hidden ? "true" : "false");
    });
    const o = open.get(key);
    if (o) o.win.style.zIndex = ++zTop;
  }

  function closeWin(key) {
    const o = open.get(key);
    if (!o) return;
    o.win.remove();
    o.task.remove();
    open.delete(key);
    const last = [...open.keys()].pop();
    if (last) focusWin(last);
  }

  function makeWindow(key, { title, iconName, body, width = 34, height, menubar, status, dialog }) {
    if (open.has(key)) {
      const o = open.get(key);
      o.win.hidden = false;
      focusWin(key);
      o.win.querySelector(".win-body").focus({ preventScroll: true });
      return o.win;
    }

    const titleId = "t-" + key.replace(/[^a-z0-9]/gi, "");
    const btnMin = el("button", { class: "tb-btn", "aria-label": "Minimize", text: "_" });
    const btnMax = el("button", { class: "tb-btn tb-max", "aria-label": "Maximize", text: "□" });
    const btnClose = el("button", { class: "tb-btn", "aria-label": "Close", text: "×" });
    const bar = el("div", { class: "titlebar" }, icon(iconName), el("h2", { id: titleId, text: title }),
      dialog ? null : btnMin, dialog ? null : btnMax, btnClose);

    const bodyEl = el("div", { class: "win-body" + (dialog ? "" : " sunken"), tabindex: "-1" }, body);
    const win = el("section", {
      class: "win" + (dialog ? " dialog-win" : ""),
      role: dialog ? "alertdialog" : "dialog",
      "aria-labelledby": titleId,
    }, bar,
      menubar ? el("div", { class: "menubar", "aria-hidden": "true" }, menubar.map((m) => el("span", { text: m }))) : null,
      bodyEl,
      status ? el("div", { class: "statusbar" }, status.map((s) => el("span", { text: s }))) : null);

    // Size and cascade position
    const deskW = winLayer.clientWidth, deskH = winLayer.clientHeight;
    const wPx = Math.min(width * 16, deskW - 16);
    win.style.width = wPx + "px";
    if (height) win.style.height = Math.min(height * 16, deskH - 16) + "px";
    const step = 28 * (cascade++ % 8);
    win.style.left = Math.max(8, Math.min(deskW - wPx - 8, (deskW - wPx) / 2 - 120 + step)) + "px";
    win.style.top = Math.max(8, Math.min(deskH * 0.45, 40 + step)) + "px";

    const task = el("button", { class: "task-btn", "aria-pressed": "true" }, icon(iconName), el("span", { text: title }));
    task.addEventListener("click", () => {
      const isActive = win.classList.contains("active") && !win.hidden;
      if (isActive) { win.hidden = true; task.setAttribute("aria-pressed", "false"); }
      else { win.hidden = false; focusWin(key); }
    });

    btnClose.addEventListener("click", () => closeWin(key));
    btnMin.addEventListener("click", () => { win.hidden = true; task.setAttribute("aria-pressed", "false"); });
    btnMax.addEventListener("click", () => win.classList.toggle("maxed"));
    bar.addEventListener("dblclick", (e) => { if (!dialog && (e.target === bar || e.target.tagName === "H2")) win.classList.toggle("maxed"); });
    win.addEventListener("pointerdown", () => focusWin(key));
    win.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); closeWin(key); } });

    makeDraggable(win, bar);
    winLayer.append(win);
    taskBar.append(task);
    open.set(key, { win, task });
    // Keep tall windows on screen: shift up, then cap the height
    if (win.offsetTop + win.offsetHeight > deskH - 8) {
      win.style.top = Math.max(8, deskH - win.offsetHeight - 8) + "px";
      if (win.offsetHeight > deskH - 16) win.style.height = deskH - 16 + "px";
    }
    focusWin(key);
    (win.querySelector(".dialog .btn") || bodyEl).focus({ preventScroll: true });
    return win;
  }

  function makeDraggable(win, handle) {
    let sx, sy, ox, oy, dragging = false;
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || isPhone() || win.classList.contains("maxed")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const maxX = winLayer.clientWidth - 60, maxY = winLayer.clientHeight - 30;
      win.style.left = Math.max(-win.offsetWidth + 80, Math.min(maxX, ox + e.clientX - sx)) + "px";
      win.style.top = Math.max(0, Math.min(maxY, oy + e.clientY - sy)) + "px";
    });
    const stop = () => { dragging = false; };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  /* ---------- Icon buttons (desktop + folders) ---------- */
  function iconButton({ label, iconName, onOpen }) {
    const b = el("button", { class: "icon-btn", "aria-selected": "false" }, icon(iconName), el("span", { class: "label", text: label }));
    b.addEventListener("click", () => {
      const scope = b.closest("ul");
      scope.querySelectorAll(".icon-btn").forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
      if (coarse) onOpen();
    });
    b.addEventListener("dblclick", onOpen);
    b.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(); } });
    return b;
  }

  /* ---------- Apps ---------- */
  const apps = {
    about() {
      const body = el("div", { class: "notepad" },
        D.about.map((p) => el("p", { text: p })),
        el("p", { class: "sig", text: "— " + D.handle }));
      makeWindow("about", {
        title: "about_me.txt - Breadpad", iconName: "doc", body, width: 38,
        menubar: ["File", "Edit", "Search", "Help"],
      });
    },

    projects() { folder("projects", "Software projects", D.projects, "app"); },
    builds() { folder("builds", "Real-life builds", D.builds, "chip"); },

    contact() {
      const body = el("div", { class: "mail" },
        el("div", { class: "mail-row" }, el("span", { text: "To:" }), el("output", { class: "sunken", text: D.email })),
        el("div", { class: "mail-row" }, el("span", { text: "Subject:" }), el("output", { class: "sunken", text: "I saw your website and I have questions" })),
        el("div", { class: "mail-body sunken" },
          el("p", { text: "Want help with a project, have a question about something I built, or just want to tell me the fart machine changed your life? Send me an email." }),
          el("p", { text: "For IT work, like computer repair, networks, apps, or getting off Windows, Tengu Solutions is the way to go." })),
        el("div", { class: "actions" },
          el("a", { class: "btn", href: "mailto:" + D.email }, icon("mail"), "Send email"),
          D.links.map((l) => el("a", { class: "btn", href: l.href, target: "_blank", rel: "noopener" }, icon("link"), l.label))));
      makeWindow("contact", { title: "New message", iconName: "mail", body, width: 34, menubar: ["File", "Edit", "Insert", "Help"] });
    },

    trash() {
      const body = el("ul", { class: "trash-list" },
        D.trash.map((t) => el("li", {}, icon("doc"), el("b", { text: t.name }), el("span", { text: t.note }))));
      makeWindow("trash", {
        title: "Trash", iconName: "trash", body, width: 30,
        status: [D.trash.length + " objects", "Will never be emptied"],
      });
    },
  };

  function folder(key, title, items, iconName) {
    const list = el("ul", { class: "explorer" },
      items.map((it) => el("li", {}, iconButton({ label: it.file, iconName, onOpen: () => openItem(key, it, iconName) }))));
    makeWindow(key, {
      title, iconName: "folder", body: list, width: 36, height: 24,
      menubar: ["File", "Edit", "View", "Help"],
      status: [items.length + " objects", coarse ? "Tap to open" : "Double-click to open"],
    });
  }

  function photoFor(group, it) {
    const src = it.photo || `images/${group}/${it.id}.jpg`;
    const missing = el("div", { class: "photo-missing", role: "img", "aria-label": "Photo coming soon" },
      icon("image"),
      el("span", { text: `Cannot find ${src.split("/").pop()}` }),
      el("small", { text: "Michael has the photo somewhere. Probably." }));
    const img = el("img", { class: "photo", src, alt: it.name, loading: "lazy", decoding: "async" });
    img.addEventListener("error", () => img.replaceWith(missing), { once: true });
    return img;
  }

  function openItem(group, it, iconName) {
    const facts = el("dl", { class: "facts sunken" },
      el("div", {}, el("dt", { text: "Type" }), el("dd", { text: it.kind })),
      el("div", {}, el("dt", { text: "Status" }), el("dd", { text: it.status })),
      it.madeWith ? el("div", {}, el("dt", { text: "Made with" }), el("dd", { text: it.madeWith.join(", ") })) : null);

    const body = el("div", { class: "props" },
      el("div", { class: "props-head" }, icon(iconName), el("div", {}, el("h3", { text: it.name }), el("p", { text: it.file }))),
      photoFor(group, it),
      el("p", { class: "blurb", text: it.blurb }),
      facts,
      el("div", { class: "actions" },
        it.href ? el("a", { class: "btn", href: it.href, target: "_blank", rel: "noopener" }, icon("link"), "Visit " + new URL(it.href).hostname) : null,
        el("button", { class: "btn", onclick: () => closeWin(group + ":" + it.id), text: "Close" })));

    makeWindow(group + ":" + it.id, { title: it.name + " Properties", iconName, body, width: 30 });
  }

  /* ---------- Error popups ---------- */
  let errCount = 0;
  function popError(err) {
    err = err || D.errors[Math.floor(Math.random() * D.errors.length)];
    const key = "err" + errCount++;
    const body = el("div", { class: "dialog" },
      el("div", { class: "dialog-msg" }, icon("warn"), el("p", { text: err.text })),
      el("div", { class: "actions" }, err.buttons.map((label) => el("button", {
        class: "btn", text: label,
        onclick: () => {
          closeWin(key);
          if (label === "Why?") popError({ title: "Why?", text: "Because.", buttons: ["Fair"] });
        },
      }))));
    const w = makeWindow(key, { title: err.title, iconName: "warn", body, width: 24, dialog: true, status: null });
    if (!reduceMotion) { w.classList.add("shake"); w.addEventListener("animationend", () => w.classList.remove("shake"), { once: true }); }
  }

  /* ---------- Desktop ---------- */
  const desktopIcons = [
    { label: "about_me.txt", iconName: "doc", app: "about" },
    { label: "Software projects", iconName: "folder", app: "projects" },
    { label: "Real-life builds", iconName: "folder", app: "builds" },
    { label: "Contact", iconName: "mail", app: "contact" },
    { label: "Trash", iconName: "trash", app: "trash" },
    { label: "DO NOT CLICK.exe", iconName: "warn", action: () => popError() },
  ];
  const iconList = $("#icons");
  desktopIcons.forEach((d) => iconList.append(el("li", {}, iconButton({
    label: d.label, iconName: d.iconName, onOpen: d.action || (() => apps[d.app]()),
  }))));
  $("#desktop").addEventListener("pointerdown", (e) => {
    if (e.target.closest(".icon-btn, .win")) return;
    iconList.querySelectorAll(".icon-btn").forEach((x) => x.setAttribute("aria-selected", "false"));
  });

  /* ---------- Bread menu ---------- */
  const breadBtn = $("#bread-btn"), breadMenu = $("#bread-menu");
  function setMenu(show) {
    breadMenu.hidden = !show;
    breadBtn.setAttribute("aria-expanded", String(show));
    if (show) breadMenu.querySelector("button").focus();
  }
  breadBtn.addEventListener("click", () => setMenu(breadMenu.hidden));
  document.addEventListener("pointerdown", (e) => {
    if (!breadMenu.hidden && !e.target.closest("#bread-menu, #bread-btn")) setMenu(false);
  });
  breadMenu.addEventListener("keydown", (e) => {
    const items = [...breadMenu.querySelectorAll("button")];
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === "Escape") { setMenu(false); breadBtn.focus(); }
  });
  breadMenu.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    setMenu(false);
    if (b.dataset.open) apps[b.dataset.open]();
    if (b.dataset.action === "error") popError();
    if (b.dataset.action === "screensaver") startSaver();
    if (b.dataset.action === "shutdown") shutdown();
  });

  /* ---------- Clock ---------- */
  const clock = $("#clock");
  function tick() {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    clock.dateTime = d.toISOString();
  }
  tick();
  setInterval(tick, 15000);

  /* ---------- Boot ---------- */
  const bootLines = [
    "PapaBIOS (C) 1979-2026 Quino Soyez, Inc.",
    "",
    "Main processor : 1x Michael @ 3 cups of coffee",
    "Memory test    : 640K OK (should be enough for anybody)",
    "",
    "Detecting IDE drives...",
    "  Primary master   : 25+ YEARS OF IT EXPERIENCE",
    "  Primary slave    : Unfinished projects (too many to count)",
    "  Secondary master : One (1) fart machine",
    "",
    "Checking bread......... 1 loaf found",
    "Loading MichaelOS 98...",
	"ERROR",
	"I am ERROR",
	"ERROR is a silly name",
	"Enough of this shenanigans, load the site already...",
  ];
  const boot = $("#boot"), bootText = $("#boot-text");
  let bootTimer = null;

  function runBoot(done) {
    if (reduceMotion) { done(); return; }
    boot.hidden = false;
    bootText.textContent = "";
    let i = 0;
    const finish = () => {
      clearTimeout(bootTimer);
      boot.hidden = true;
      document.removeEventListener("keydown", finish);
      boot.removeEventListener("pointerdown", finish);
      done();
    };
    document.addEventListener("keydown", finish, { once: true });
    boot.addEventListener("pointerdown", finish, { once: true });
    (function next() {
      if (i < bootLines.length) {
        bootText.textContent += bootLines[i++] + "\n";
        bootTimer = setTimeout(next, i < 4 ? 260 : 170);
      } else {
        bootTimer = setTimeout(finish, 900);
      }
    })();
  }

  function afterBoot() {
    store("mos-booted", "1");
    apps.about();
    // One unsolicited error per visit, once they've had a moment to look around
    setTimeout(() => { if (shutdownEl.hidden) popError(D.errors[0]); }, 25000);
  }

  /* ---------- Shut down ---------- */
  const shutdownEl = $("#shutdown");
  function shutdown() {
    [...open.keys()].forEach(closeWin);
    shutdownEl.hidden = false;
    shutdownEl.addEventListener("click", () => {
      shutdownEl.hidden = true;
      runBoot(() => apps.about());
    }, { once: true });
  }

  /* ---------- Screensaver: the loaf bounces after 90s idle ---------- */
  const saver = $("#screensaver"), loaf = $("#saver-loaf");
  let idleTimer, raf, sxp = 40, syp = 40, vx = 2.2, vy = 1.7;
  function startSaver() {
    if (reduceMotion || !boot.hidden || !shutdownEl.hidden) return;
    saver.hidden = false;
    const stepFn = () => {
      const maxX = window.innerWidth - loaf.offsetWidth, maxY = window.innerHeight - loaf.offsetHeight;
      sxp += vx; syp += vy;
      if (sxp <= 0 || sxp >= maxX) { vx = -vx; sxp = Math.max(0, Math.min(maxX, sxp)); loaf.style.color = randomColor(); }
      if (syp <= 0 || syp >= maxY) { vy = -vy; syp = Math.max(0, Math.min(maxY, syp)); loaf.style.color = randomColor(); }
      loaf.style.transform = `translate(${sxp}px, ${syp}px)`;
      raf = requestAnimationFrame(stepFn);
    };
    raf = requestAnimationFrame(stepFn);
  }
  function stopSaver() {
    if (saver.hidden) return;
    cancelAnimationFrame(raf);
    saver.hidden = true;
  }
  function randomColor() {
    return ["#ffd84a", "#ff8a3d", "#3fb6a8", "#f2b56b", "#e8d9ff", "#5fd35f"][Math.floor(Math.random() * 6)];
  }
  function resetIdle() {
    stopSaver();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startSaver, 90000);
  }
  ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, resetIdle, { passive: true }));

  /* ---------- Go ---------- */
  paintIcons();
  if (store("mos-booted")) afterBoot();
  else runBoot(afterBoot);
  resetIdle();
})();
