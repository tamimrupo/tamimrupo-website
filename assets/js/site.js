/* ==========================================================================
   Tamim Rupo — site.js
   Header behaviour, mobile menu, scroll reveals, hero character field,
   keyboard decoration, Dhaka clock, year, and the two mailto forms.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------------- header */
  var header = document.querySelector(".site-header");
  if (header) {
    var lastY = window.scrollY || 0;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY || 0;
      header.classList.toggle("is-scrolled", y > 8);
      if (!header.classList.contains("is-open")) {
        if (y > lastY && y > 260) {
          header.classList.add("is-hidden");
        } else if (y < lastY || y < 120) {
          header.classList.remove("is-hidden");
        }
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    }, { passive: true });

    var toggle = header.querySelector(".menu-toggle");
    if (toggle) {
      var closeMenu = function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      };

      // mirror the header CTA inside the mobile menu panel
      var nav = header.querySelector(".header-nav");
      var headerCta = header.querySelector(".header-actions .btn--lime");
      if (nav && headerCta && !nav.querySelector(".header-nav__cta")) {
        var navCta = document.createElement("a");
        navCta.className = "header-nav__cta btn btn--lime";
        navCta.href = headerCta.getAttribute("href");
        navCta.innerHTML = headerCta.innerHTML;
        nav.appendChild(navCta);
      }

      toggle.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) header.classList.remove("is-hidden");
      });

      header.querySelectorAll(".header-nav a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
      });

      document.addEventListener("click", function (event) {
        if (!header.contains(event.target)) closeMenu();
      });
    }
  }

  /* --------------------------------------------------------------- reveals */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------------------------------------------------------- hero cipher */
  /* Reference-style cipher field: an aligned grid of small monospace glyphs
     that glows lavender out of the dark. Nearly invisible at the top, pooled
     toward the foot of the hero, and lit by a pointer-following light. */
  (function heroField() {
    var canvas = document.getElementById("hero-field");
    var hero = document.querySelector(".hero");
    if (!canvas || !hero) return;

    var ctx = canvas.getContext("2d");
    var baseCanvas = document.createElement("canvas");
    var bctx = baseCanvas.getContext("2d");
    if (!ctx || !bctx) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var CELL_W = 26, CELL_H = 27;
    var FONT = '400 11px "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\|=+-*#%&@$?!:;.,~^";
    var W = 0, H = 0, cells = [], frame = 0, running = true, churnTimer = 0;
    var light = { x: 0, y: 0, tx: 0, ty: 0, on: false };
    var idlePhase = 0, t0 = performance.now();

    function glyph() {
      return GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
    }

    function paintCell(c) {
      if (c.a < 0.015) return;
      bctx.fillStyle = "rgba(152, 136, 188, " + c.a.toFixed(3) + ")";
      bctx.fillText(c.ch, c.x, c.y);
    }

    function redrawBase() {
      bctx.clearRect(0, 0, W, H);
      bctx.font = FONT;
      bctx.textAlign = "center";
      bctx.textBaseline = "middle";
      for (var i = 0; i < cells.length; i++) paintCell(cells[i]);
    }

    function build() {
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      var pw = Math.floor(W * DPR), ph = Math.floor(H * DPR);
      canvas.width = pw;
      canvas.height = ph;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      baseCanvas.width = pw;
      baseCanvas.height = ph;
      bctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      cells = [];
      var cols = Math.ceil(W / CELL_W);
      var rows = Math.ceil(H / CELL_H);
      var copyX = W * 0.5, copyY = H * 0.47;
      var copyRX = Math.max(320, W * 0.46), copyRY = Math.max(260, H * 0.44);

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = c * CELL_W + CELL_W * 0.5;
          var y = r * CELL_H + CELL_H * 0.5;

          /* gentle undulation across the rows, like the reference field */
          var wave = Math.sin(x * 0.0085 + r * 0.55) * 5 + Math.sin(x * 0.019 - r * 0.3) * 2;

          /* resting floor: a faint grid everywhere, pooled at the foot */
          var ny = y / H;
          var a = 0.045 + Math.pow(ny, 3) * 0.28;

          /* the violet glow at the foot of the hero lights the glyphs too */
          var gx = (x - W * 0.5) / (W * 0.82);
          var gy = (y - H * 1.03) / (H * 0.78);
          var g = Math.max(0, 1 - Math.sqrt(gx * gx + gy * gy));
          a += g * g * 0.12;

          /* the sides of the field fall away so the centre reads */
          var edge = Math.min(x / W, 1 - x / W);
          a *= 0.5 + 0.5 * Math.min(1, edge / 0.18);

          /* keep the copy readable: the grid fades away behind the headline */
          var ex = (x - copyX) / copyRX;
          var ey = (y - copyY) / copyRY;
          var ed = Math.sqrt(ex * ex + ey * ey);
          if (ed < 1.35) a *= 0.12 + 0.88 * Math.min(1, ed);

          /* uneven glyph weights, like the reference field */
          a *= 0.55 + Math.random() * 0.45;

          a = Math.min(a, 0.42);
          cells.push({ x: x, y: y + wave, a: a, ch: glyph() });
        }
      }

      redrawBase();
      /* paint the resting field straight away so it is there before the
         first animation frame (and if scripting is throttled) */
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(baseCanvas, 0, 0, W, H);
      light.x = light.tx = W * 0.5;
      light.y = light.ty = H * 0.72;
    }

    function churn() {
      if (!running || reduce || document.hidden) return;
      var n = Math.min(cells.length, 10);
      bctx.font = FONT;
      for (var i = 0; i < n; i++) {
        var c = cells[(Math.random() * cells.length) | 0];
        bctx.clearRect(c.x - 9, c.y - 11, 18, 22);
        c.ch = glyph();
        paintCell(c);
      }
    }

    function drawLit(lx, ly, drift) {
      var R = Math.max(150, Math.min(W, H) * 0.36);
      var R2 = R * R;
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        var dx = c.x - lx;
        var dy = c.y + drift - ly;
        var d2 = dx * dx + dy * dy;
        if (d2 > R2) continue;
        var k = 1 - Math.sqrt(d2) / R;
        k = k * k;
        var a = Math.min(0.8, c.a * 1.6 + k * 0.55);
        ctx.fillStyle = "rgba(224, 211, 255, " + a.toFixed(3) + ")";
        ctx.fillText(c.ch, c.x, c.y + drift);
      }
    }

    function render(time) {
      if (!running) return;
      var t = (time - t0) / 1000;

      light.x += (light.tx - light.x) * 0.16;
      light.y += (light.ty - light.y) * 0.16;

      var lx, ly;
      if (light.on) {
        lx = light.x;
        ly = light.y;
      } else {
        idlePhase += 0.008;
        lx = W * (0.5 + Math.sin(idlePhase) * 0.26);
        ly = H * (0.76 + Math.cos(idlePhase * 0.75) * 0.1);
      }

      var drift = Math.sin(t * 0.22) * 2;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(baseCanvas, 0, drift, W, H);
      drawLit(lx, ly, drift);

      frame = window.requestAnimationFrame(render);
    }

    function paintStill() {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(baseCanvas, 0, 0, W, H);
      light.on = true;
      light.x = W * 0.5;
      light.y = H * 0.72;
      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      drawLit(light.x, light.y, 0);
    }

    function startLoop() {
      if (running || reduce) return;
      running = true;
      frame = window.requestAnimationFrame(render);
    }

    function stopLoop() {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      light.tx = event.clientX - rect.left;
      light.ty = event.clientY - rect.top;
      light.on = true;
    });
    hero.addEventListener("pointerleave", function () { light.on = false; });

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        build();
        if (reduce) paintStill(); else { ctx.clearRect(0, 0, W, H); }
      }, 160);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopLoop(); else startLoop();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) startLoop(); else stopLoop();
        });
      }, { threshold: 0 }).observe(hero);
    }

    build();
    if (reduce) {
      paintStill();
    } else {
      startLoop();
      churnTimer = window.setInterval(churn, 2600);
      window.addEventListener("pagehide", function () {
        window.clearInterval(churnTimer);
      });
    }

    /* lay the grid out again once Geist Mono has actually loaded */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        build();
        if (reduce) paintStill();
      });
    }
  })();

  /* ------------------------------------------------------------ keyboard */
  (function keyboard() {
    var decks = Array.prototype.slice.call(document.querySelectorAll("[data-keyboard]"));
    if (!decks.length) return;

    decks.forEach(function (deck) {
      var rows = parseInt(deck.getAttribute("data-keyboard"), 10) || 3;
      var cols = 14;
      var total = rows * cols;
      var html = "";

      for (var i = 0; i < total; i++) {
        var roll = Math.random();
        var cls = "key";
        if (roll > 0.94) cls += " key--accent";
        else if (roll > 0.88) cls += " key--violet";
        html += '<i class="' + cls + '"></i>';
      }
      deck.innerHTML = html;
    });
  })();

  /* -------------------------------------------------------- year & clock */
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = year;
  });

  var timeNodes = document.querySelectorAll("[data-dhaka-time]");
  if (timeNodes.length) {
    var formatter;
    try {
      formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", hour12: false
      });
    } catch (err) {
      formatter = null;
    }
    if (formatter) {
      var updateTime = function () {
        var value = formatter.format(new Date());
        timeNodes.forEach(function (node) { node.textContent = value; });
      };
      updateTime();
      window.setInterval(updateTime, 30000);
    }
  }

  /* ------------------------------------------------------------- forms */
  document.querySelectorAll("[data-join-form]").forEach(function (joinForm) {
    var joinInput = joinForm.querySelector("[data-join-email]");
    var joinStatus = joinForm.querySelector("[data-join-status]");

    joinForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!joinForm.reportValidity()) return;
      var email = String((joinInput && joinInput.value) || "").trim();
      if (!email) return;

      var subject = "Add me to the Tamim Rupo updates list";
      var body = "Please add this email to the list: " + email;
      window.location.href = "mailto:tamim@tamimrupo.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (joinStatus) {
        joinStatus.textContent = "Your email app should open with the message filled in. If not, email tamim@tamimrupo.com.";
      }
    });
  });

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var contactStatus = document.getElementById("form-status");
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      var data = new FormData(contactForm);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var message = String(data.get("message") || "").trim();

      var subject = "Website inquiry from " + (name || "the site");
      var body = [
        "Name: " + name,
        "Email: " + email,
        "",
        message
      ].join("\n");

      window.location.href = "mailto:tamim@tamimrupo.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (contactStatus) {
        contactStatus.textContent = "Your email app should open with the message filled in. If it doesn't, email tamim@tamimrupo.com directly.";
      }
    });
  }
})();
