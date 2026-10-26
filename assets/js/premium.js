(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Dhaka time */
  const timeTargets = document.querySelectorAll("[data-dhaka-time]");
  if (timeTargets.length) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const tick = () => {
      const now = new Date();
      const value = formatter.format(now);
      timeTargets.forEach((el) => {
        el.textContent = value;
        el.setAttribute("datetime", now.toISOString());
      });
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* Gentle pointer parallax on the hero cards */
  const hero = document.querySelector(".hero");
  const floats = Array.from(document.querySelectorAll(".hero__visual .float"));
  if (hero && floats.length && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let raf = 0;
    const move = (event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        floats.forEach((el, index) => {
          const strength = 5 + index * 2;
          el.style.translate = `${x * strength}px ${y * strength}px`;
        });
        raf = 0;
      });
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", () => {
      floats.forEach((el) => {
        el.style.translate = "0 0";
      });
    });
  }
})();
