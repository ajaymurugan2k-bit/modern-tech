document.body.classList.add("preload");

const navbar = document.getElementById("mainNavbar");
const scrollProgress = document.getElementById("scrollProgress");
const toTopBtn = document.getElementById("toTopBtn");
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;
const preloader = document.getElementById("preloader");

const typingWords = ["Modern Skills", "Future Careers", "Tech Excellence"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
const typingTarget = document.getElementById("typingText");

function typeEffect() {
  if (!typingTarget) return;
  const currentWord = typingWords[wordIndex];
  typingTarget.textContent = currentWord.slice(0, charIndex);

  if (!deleting && charIndex < currentWord.length) {
    charIndex += 1;
    setTimeout(typeEffect, 90);
  } else if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeEffect, 45);
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % typingWords.length;
    setTimeout(typeEffect, deleting ? 950 : 250);
  }
}

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;

  if (scrollTop > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");

  if (scrollTop > 420) toTopBtn.classList.add("show");
  else toTopBtn.classList.remove("show");

  const parallax = scrollTop * 0.12;
  document.querySelectorAll(".orb").forEach((orb, i) => {
    orb.style.transform = `translateY(${parallax * (0.3 + i * 0.08)}px)`;
  });
}

function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 40, 280)}ms`;
    observer.observe(el);
  });
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  let started = false;
  const aboutSection = document.getElementById("about");

  const countObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        counters.forEach((counter) => {
          const target = parseInt(counter.dataset.target || "0", 10);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 80));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              counter.textContent = target.toString();
              clearInterval(timer);
            } else {
              counter.textContent = current.toString();
            }
          }, 20);
        });
      }
    },
    { threshold: 0.3 }
  );

  if (aboutSection) countObserver.observe(aboutSection);
}

function initTheme() {
  const saved = localStorage.getItem("mt-theme");
  if (saved) htmlEl.setAttribute("data-theme", saved);
  updateThemeIcon();
  themeToggle.addEventListener("click", () => {
    const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", next);
    localStorage.setItem("mt-theme", next);
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  themeToggle.innerHTML =
    htmlEl.getAttribute("data-theme") === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
}

function initLightbox() {
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const source = item.getAttribute("data-img");
      lightboxImage.setAttribute("src", source || "");
      lightbox.classList.add("active");
    });
  });

  const closeLightbox = () => lightbox.classList.remove("active");
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.classList.add("loading");
    setTimeout(() => {
      submitBtn.classList.remove("loading");
      form.reset();
      alert("Thanks! Your enquiry has been submitted.");
    }, 1300);
  });
}

function initFloatingCards() {
  const cards = document.querySelectorAll(".float-card[data-jump]");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = card.getAttribute("data-jump");
      const target = document.getElementById(targetId || "");
      if (!target) return;

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 14;
      window.scrollTo({ top: y, behavior: "smooth" });

      card.classList.add("active-jump");
      setTimeout(() => card.classList.remove("active-jump"), 700);
    });
  });
}

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let particles = [];
  let width = 0;
  let height = 0;
  const maxParticles = 54;

  const rootStyles = getComputedStyle(document.documentElement);
  const color = `rgba(${rootStyles.getPropertyValue("--brand-rgb").trim()}, 0.38)`;
  const lineColor = `rgba(${rootStyles.getPropertyValue("--brand-rgb").trim()}, 0.14)`;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particles = Array.from({ length: maxParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 1.9 + 0.6,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 125) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1 - dist / 125;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hide");
    document.body.classList.remove("preload");
  }, 650);
});

typeEffect();
initReveal();
initCounters();
initTheme();
initLightbox();
initContactForm();
initFloatingCards();
initParticles();
onScroll();
