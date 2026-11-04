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

  /* ---------------------------------------------------------- hero canvas */
  (function heroField() {
    var canvas = document.getElementById("hero-field");
    var hero = document.querySelector(".hero");
    if (!canvas || !hero) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var CELL = 30;
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\|=+-*#%&@$?!:;.,~^✦";
    var W = 0, H = 0, cells = [], frame = 0, running = true;
    var pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    var idlePhase = 0;
    var start = Date.now();

    function glyph() {
      return CHARS.charAt((Math.random() * CHARS.length) | 0);
    }

    function build() {
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cells = [];
      for (var y = CELL * 0.6; y < H; y += CELL) {
        for (var x = CELL * 0.6; x < W; x += CELL) {
          cells.push({
            hx: x + (Math.random() - 0.5) * 16,
            hy: y + (Math.random() - 0.5) * 14,
            ch: glyph(),
            rot: (Math.random() - 0.5) * 0.5,
            size: 10 + Math.random() * 5,
            amp: 2 + Math.random() * 5,
            spd: 0.5 + Math.random() * 1.1,
            ph: Math.random() * Math.PI * 2
          });
        }
      }
      pointer.x = pointer.tx = W * 0.5;
      pointer.y = pointer.ty = H * 0.4;
    }

    function draw(time) {
      ctx.clearRect(0, 0, W, H);

      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;

      var lx, ly;
      if (pointer.active) {
        lx = pointer.x;
        ly = pointer.y;
      } else {
        idlePhase += 0.021;
        lx = W * 0.5 + Math.sin(idlePhase) * W * 0.2;
        ly = H * 0.42 + Math.cos(idlePhase * 0.7) * H * 0.1;
      }

      var R = Math.max(160, Math.min(W, H) * 0.4);
      var base = 0.14;
      var t = time * 0.001;

      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        var x = c.hx + Math.sin(t * c.spd + c.ph) * c.amp;
        var y = c.hy + Math.cos(t * c.spd * 0.8 + c.ph) * c.amp;
        var dx = x - lx, dy = y - ly;
        var d = Math.sqrt(dx * dx + dy * dy);
        var lit = 0;
        if (d < R) {
          lit = 1 - d / R;
          lit = lit * lit * 0.85;
        }
        var alpha = base + lit;
        if (alpha < 0.02) continue;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(c.rot);
        ctx.font = c.size + "px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (lit > 0.05) {
          ctx.fillStyle = "rgba(203, 184, 255, " + alpha.toFixed(3) + ")";
        } else {
          ctx.fillStyle = "rgba(139, 124, 176, " + alpha.toFixed(3) + ")";
        }
        ctx.fillText(c.ch, 0, 0);
        ctx.restore();
      }
    }

    function loop(time) {
      if (!running) return;
      draw(time);
      frame = window.requestAnimationFrame(loop);
    }

    function startLoop() {
      if (running || reduce) return;
      running = true;
      frame = window.requestAnimationFrame(loop);
    }

    function stopLoop() {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      pointer.active = true;
    });
    hero.addEventListener("pointerleave", function () { pointer.active = false; });

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        build();
        if (reduce) { draw(performance.now()); }
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
      draw(2000);
    } else {
      startLoop();
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
