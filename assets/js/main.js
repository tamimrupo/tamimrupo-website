(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = year;
  });

  /* ---------- Dhaka time ---------- */
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

  /* ---------- Scroll progress ---------- */
  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
      ticking = false;
    };
    const requestProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };
    updateProgress();
    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const status = document.getElementById("form-status");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = `Website inquiry from ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n");

      window.location.href = `mailto:tamim@tamimrupo.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      if (status) {
        status.textContent =
          "Your email app should open with the message filled in. If it does not, email tamim@tamimrupo.com directly.";
        status.classList.add("is-visible");
      }
    });
  }

  /* ---------- Work preview ---------- */
  const projects = Array.from(document.querySelectorAll(".project[data-image]"));
  const preview = document.querySelector(".preview-image");
  const previewDomain = document.querySelector(".preview-domain");
  const previewIndex = document.querySelector(".preview-index");

  if (projects.length && preview) {
    // Warm the cache so changing projects feels immediate.
    projects.forEach((project) => {
      const img = new Image();
      img.src = project.dataset.image;
    });

    const activateProject = (project) => {
      projects.forEach((item) => {
        item.classList.toggle("is-active", item === project);
      });

      if (previewDomain) previewDomain.textContent = project.dataset.domain || "";
      if (previewIndex) previewIndex.textContent = project.dataset.index || "";

      const nextImage = project.dataset.image;
      if (!nextImage) return;

      if (reduceMotion) {
        preview.src = nextImage;
        return;
      }

      preview.classList.add("is-switching");
      window.setTimeout(() => {
        preview.src = nextImage;
        preview.classList.remove("is-switching");
      }, 160);
    };

    projects.forEach((project) => {
      project.addEventListener("mouseenter", () => activateProject(project));
      project.addEventListener("focus", () => activateProject(project));
    });
  }

})();
