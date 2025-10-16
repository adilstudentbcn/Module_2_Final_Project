// ============================================
// Mobile Navigation Toggle
// ============================================
(function initMobileNav() {
  const mobileToggle = document.getElementById("mobileToggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!mobileToggle || !nav) return;

  // Toggle mobile menu
  mobileToggle.addEventListener("click", function () {
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", String(!isExpanded));
    nav.classList.toggle("active");
    document.body.style.overflow = isExpanded ? "" : "hidden"; // lock scroll
  });

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      nav.classList.contains("active") &&
      !nav.contains(event.target) &&
      !mobileToggle.contains(event.target)
    ) {
      nav.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  // ESC to close
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("active")) {
      nav.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      mobileToggle.focus();
    }
  });
})();

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector(".header");
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });

        target.setAttribute("tabindex", "-1");
        target.focus();
      }
    });
  });
})();

// ============================================
// Contact Form Handling
// ============================================
(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    console.log("Form submitted:", data);

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = "Message Sent!";
    button.style.backgroundColor = "var(--color-accent-green)";
    button.disabled = true;

    setTimeout(() => {
      form.reset();
      button.textContent = originalText;
      button.style.backgroundColor = "";
      button.disabled = false;
    }, 3000);
  });

  // Real-time validation feedback
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = "var(--color-accent-terra)";
      } else {
        this.style.borderColor = "";
      }
    });
    input.addEventListener("input", function () {
      if (this.style.borderColor) this.style.borderColor = "";
    });
  });
})();

// ============================================
// Header Shadow on Scroll
// ============================================
(function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  const onScroll = () => {
    const scrolled = window.pageYOffset > 50;
    header.classList.toggle("scrolled", scrolled);
  };

  // run once on load in case we refresh mid-page
  onScroll();

  // passive listener for perf
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ============================================
// Active Navigation Link Highlighting (ARIA)
// ============================================
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  function setActive(id) {
    links.forEach((a) => {
      a.removeAttribute("aria-current");
      if (a.getAttribute("href") === `#${id}`) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function onScroll() {
    let current = "";
    const y = window.pageYOffset;
    sections.forEach((s) => {
      const top = s.offsetTop - 120; // offset for sticky header
      const bottom = top + s.offsetHeight;
      if (y >= top && y < bottom) current = s.id;
    });
    if (current) setActive(current);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // initial state on load
})();

// ============================================
// Intersection Observer for Fade-in Animations
// ============================================
(function initAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targets = [
    ...document.querySelectorAll(".section"),
    ...document.querySelectorAll(".pricing-card"),
    ...document.querySelectorAll(".section-title"),
    ...document.querySelectorAll(".about-image"),
  ].filter(Boolean);

  targets.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = `opacity .6s ease ${i * 0.06}s, transform .6s ease ${
      i * 0.06
    }s`;
  });

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  // liquid water effect
  (function liquidMouseIntensity() {
    const img = document.querySelector(".about-image.liquid");
    const disp = document.getElementById("liquid-displace");
    if (!img || !disp) return;

    img.addEventListener("mousemove", (e) => {
      const r = img.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const dy = (e.clientY - r.top) / r.height - 0.5; // -0.5 .. 0.5
      const strength = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2); // 0..1+
      const scale = 6 + strength * 16; // 6..22
      disp.setAttribute("scale", scale.toFixed(1));
    });

    img.addEventListener("mouseleave", () => {
      disp.setAttribute("scale", "8"); // back to baseline
    });
  })();

  // --- Video Auto Play/Pause when in view ---
  (function videoAutoplayObserver() {
    const video = document.getElementById("backgroundVideo");
    if (!video) return;

    const handleVideo = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
          video.classList.add("playing");
        } else {
          video.pause();
          video.classList.remove("playing");
        }
      });
    };

    const videoObserver = new IntersectionObserver(handleVideo, {
      threshold: 0.5,
    });

    videoObserver.observe(video);
  })();

  targets.forEach((el) => obs.observe(el));
})();

console.log("✨ Modern website loaded successfully!");

// Prefill contact form with selected plan
(function initPricingPrefill() {
  const buttons = document.querySelectorAll(".choose-plan");
  const message = document.getElementById("message");
  const nameInput = document.getElementById("name");

  if (!buttons.length || !message) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.dataset.plan || "Starter";
      message.value = `Hi! I'm interested in the ${plan} plan. Please share more details.`;
      // Optional: move focus to name for a11y
      if (nameInput) nameInput.focus();
    });
  });
})();

// ============================================
// Dark / Light Theme Toggle with persistence
// ============================================
(function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = saved || (prefersDark ? "dark" : "light");

  applyTheme(theme);

  btn.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  });

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", (e) => {
    if (!localStorage.getItem("theme")) {
      theme = e.matches ? "dark" : "light";
      applyTheme(theme);
    }
  });

  function applyTheme(next) {
    document.documentElement.setAttribute("data-theme", next);
    btn.setAttribute("aria-pressed", String(next === "dark"));
    const icon = btn.querySelector(".theme-toggle-icon");
    if (icon) icon.textContent = next === "dark" ? "🌙" : "☀️";
    if (metaTheme) {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-background")
        .trim();
      metaTheme.setAttribute(
        "content",
        bg || (next === "dark" ? "#1A1614" : "#FAF8F6")
      );
    }
  }
})();
