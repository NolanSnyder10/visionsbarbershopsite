/* ==========================================================================
   VISIONS BARBERSHOP — behaviour
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.VISIONS || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     1. Wire every booking link to the configured URL
     ---------------------------------------------------------------------- */
  function wireBooking() {
    var url = CFG.BOOK || "#";
    document.querySelectorAll("[data-book]").forEach(function (a) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
    document.querySelectorAll("[data-link]").forEach(function (a) {
      var key = a.getAttribute("data-link");
      if (CFG[key]) {
        a.href = CFG[key];
        if (/^https?:/.test(CFG[key]) && !/^tel:/.test(CFG[key])) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
      }
    });
  }

  /* ----------------------------------------------------------------------
     2. Hero load-in — split the wordmark into animated characters
     ---------------------------------------------------------------------- */
  function buildWordmark() {
    var main = document.querySelector(".wordmark__main");
    if (!main) return;
    var word = main.getAttribute("data-word") || main.textContent.trim();
    main.textContent = "";
    word.split("").forEach(function (c, i) {
      var s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      s.style.animationDelay = (0.06 + i * 0.055).toFixed(3) + "s";
      main.appendChild(s);
    });
    main.setAttribute("aria-label", word);
  }

  function runHero() {
    var hero = document.querySelector(".hero");
    if (!hero) {
      document.body.classList.remove("is-loading");
      return;
    }
    // Give webfonts a beat to land so letters don't reflow mid-animation.
    var start = function () {
      hero.classList.add("is-ready");
      setTimeout(function () {
        document.body.classList.remove("is-loading");
      }, reduced ? 0 : 700);
    };
    if (document.fonts && document.fonts.ready) {
      var settled = false;
      var go = function () { if (!settled) { settled = true; start(); } };
      document.fonts.ready.then(go);
      setTimeout(go, 1200); // never let a slow font block the reveal
    } else {
      start();
    }
  }

  /* ----------------------------------------------------------------------
     3. Header: solid on scroll, hides on scroll-down (mobile)
     ---------------------------------------------------------------------- */
  function header() {
    var el = document.querySelector(".header");
    if (!el) return;
    var overHero = !!document.querySelector(".hero");
    var last = 0;
    var onScroll = function () {
      var y = window.pageYOffset;
      el.classList.toggle("is-stuck", overHero ? y > 40 : true);
      if (!document.body.classList.contains("menu-open")) {
        el.classList.toggle("is-hidden", y > 420 && y > last);
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     4. Mobile menu
     ---------------------------------------------------------------------- */
  function menu() {
    var burger = document.querySelector(".burger");
    var panel = document.querySelector(".menu");
    if (!burger || !panel) return;
    var toggle = function (force) {
      var open = force !== undefined ? force : !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      burger.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));
    };
    burger.addEventListener("click", function () { toggle(); });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") toggle(false);
    });
  }

  /* ----------------------------------------------------------------------
     5. Scroll reveals
     ---------------------------------------------------------------------- */
  function reveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     6. Sticky mobile book bar — appears once past the hero
     ---------------------------------------------------------------------- */
  function stickyBook() {
    var bar = document.querySelector(".stickybook");
    if (!bar) return;
    // Inner pages have no hero to clear — keep the bar up the whole time.
    if (!document.querySelector(".hero")) { bar.classList.add("in"); return; }
    var onScroll = function () {
      bar.classList.toggle("in", window.pageYOffset > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     7. Open / closed status + today's row, in shop-local time
     ---------------------------------------------------------------------- */
  function shopNow() {
    var tz = CFG.TIMEZONE || "America/Chicago";
    var now = new Date();
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, weekday: "short", hour: "numeric",
        minute: "numeric", hour12: false
      }).formatToParts(now);
    } catch (err) {
      return { dayIndex: now.getDay(), decimal: now.getHours() + now.getMinutes() / 60 };
    }
    var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ""; };
    var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var h = parseInt(get("hour"), 10);
    if (h === 24) h = 0;
    return {
      dayIndex: map[get("weekday")] !== undefined ? map[get("weekday")] : now.getDay(),
      decimal: h + parseInt(get("minute"), 10) / 60
    };
  }

  function fmt(t) {
    if (t === null) return "Closed";
    var h = Math.floor(t), m = Math.round((t - h) * 60);
    var ap = h >= 12 ? "PM" : "AM";
    var hh = h % 12 === 0 ? 12 : h % 12;
    return hh + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ap;
  }

  function status() {
    var hours = CFG.HOURS;
    if (!hours) return;
    var el = document.querySelector(".status");
    var t = shopNow();
    var today = hours[t.dayIndex];
    var open = today && today.open !== null && t.decimal >= today.open && t.decimal < today.close;

    // Highlight today's row in any hours table
    document.querySelectorAll(".hours tbody tr").forEach(function (tr, i) {
      tr.classList.toggle("today", i === t.dayIndex);
    });

    if (!el) return;
    var label = el.querySelector(".status__label");
    var next = el.querySelector(".status__next");
    el.classList.toggle("is-open", !!open);

    if (open) {
      if (label) label.textContent = "Open Now";
      if (next) next.textContent = "Closes " + fmt(today.close);
    } else {
      if (label) label.textContent = "Closed";
      if (next) {
        // find the next day the shop opens
        var msg = "";
        if (today && today.open !== null && t.decimal < today.open) {
          msg = "Opens " + fmt(today.open) + " today";
        } else {
          for (var i = 1; i <= 7; i++) {
            var d = hours[(t.dayIndex + i) % 7];
            if (d.open !== null) {
              msg = "Opens " + fmt(d.open) + " " + (i === 1 ? "tomorrow" : d.day);
              break;
            }
          }
        }
        next.textContent = msg;
      }
    }
  }

  /* ----------------------------------------------------------------------
     8. Photos: mark empty frames so missing files read as design, not error
     ---------------------------------------------------------------------- */
  function photos() {
    document.querySelectorAll(".shot img, .about__media img").forEach(function (img) {
      var mark = function () {
        img.classList.add("missing");
        if (img.parentElement) img.parentElement.classList.add("is-empty");
      };
      img.addEventListener("error", mark);
      if (img.complete && img.naturalWidth === 0) mark();
    });
  }

  /* ----------------------------------------------------------------------
     9. Lightbox for the work gallery
     ---------------------------------------------------------------------- */
  function lightbox() {
    var shots = document.querySelectorAll(".shot");
    if (!shots.length) return;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-hidden", "true");
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&#10005;</button>' +
      '<img alt="">';
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var close = function () {
      box.classList.remove("in");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    shots.forEach(function (shot) {
      shot.addEventListener("click", function () {
        var src = shot.querySelector("img");
        if (!src || src.classList.contains("missing")) return;
        img.src = src.currentSrc || src.src;
        img.alt = src.alt || "";
        box.classList.add("in");
        box.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.closest(".lightbox__close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ----------------------------------------------------------------------
     10. Footer year
     ---------------------------------------------------------------------- */
  function year() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    wireBooking();
    buildWordmark();
    header();
    menu();
    reveals();
    stickyBook();
    status();
    photos();
    lightbox();
    year();
    runHero();
    setInterval(status, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
