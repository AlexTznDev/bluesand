import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis({
  duration: 0.8,
  smoothWheel: true,
  autoRaf: false,
});

// Sync Lenis scroll with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// GSAP gère la boucle RAF
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Data attribute controls
$('[data-lenis-start]').on('click', () => lenis.start());
$('[data-lenis-stop]').on('click', () => lenis.stop());
