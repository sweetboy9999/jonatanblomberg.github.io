const progressBar = document.querySelector(".scroll-progress__bar");
const reveals = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("section[id]");
const trailDots = document.querySelectorAll(".cursor-trail span");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.4,
};

const setScrollProgress = () => {
  if (!progressBar) return;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

setScrollProgress();
window.addEventListener("scroll", () => requestAnimationFrame(setScrollProgress));
window.addEventListener("resize", setScrollProgress);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((el) => revealObserver.observe(el));

const setActiveLink = (id) => {
  const target = document.querySelector(`.nav a[href="#${id}"]`);
  if (!target) return;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
  });
};

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

if (trailDots.length > 0 && !prefersReducedMotion.matches) {
  const positions = Array.from(trailDots, () => ({ x: pointer.x, y: pointer.y }));
  const easeBase = 0.18;
  const easeStep = 0.015;

  const animateTrail = () => {
    let x = pointer.x;
    let y = pointer.y;
    positions.forEach((pos, index) => {
      const ease = Math.max(0.08, easeBase - index * easeStep);
      pos.x += (x - pos.x) * ease;
      pos.y += (y - pos.y) * ease;
      trailDots[index].style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      x = pos.x;
      y = pos.y;
    });
    requestAnimationFrame(animateTrail);
  };

  animateTrail();

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    document.body.classList.add("has-pointer");
  });

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("has-pointer");
  });
}
