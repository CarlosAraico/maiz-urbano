// Animaciones básicas usando GSAP (CDN global)
if (window?.gsap) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin?.(ScrollTrigger);

  // Cambiar nav on scroll
  const nav = document.getElementById("mu-nav");
  window.addEventListener("scroll", () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  // Fade in elementos
  (window.gsap.utils?.toArray(".mu-animate") || []).forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      }
    );
  });
}
