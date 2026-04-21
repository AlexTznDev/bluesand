import Lenis from 'lenis';

// Register GSAP ScrollTrigger plugin for scroll-based animations
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Lenis smooth scroll instance
 * Lenis provides smooth, momentum-based scrolling behavior
 *
 * @see https://github.com/studio-freight/lenis
 */
export const lenis = new Lenis({
  duration: 0.8,
  smoothWheel: true,
  autoRaf: true,
});

// ================================================
// REQUEST ANIMATION FRAME LOOP
// ================================================
/**
 * Update Lenis on every frame for smooth scrolling
 * This creates a continuous loop that updates the scroll position
 *
 * @param {number} time - Current timestamp from requestAnimationFrame
 */
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

// Start the animation loop
requestAnimationFrame(raf);

// ================================================
// LENIS + GSAP SCROLLTRIGGER SYNCHRONIZATION
// ================================================
/**
 * Sync Lenis scroll with GSAP ScrollTrigger
 * This ensures ScrollTrigger-based animations respond to Lenis scroll updates
 */
lenis.on('scroll', ScrollTrigger.update);

/**
 * Add Lenis updates to GSAP's ticker for better synchronization
 * Multiply time by 1000 to convert seconds to milliseconds
 */
gsap.ticker.add((time) => lenis.raf(time * 1000));

/**
 * Disable lag smoothing to prevent GSAP from skipping frames
 * This ensures consistent scroll behavior even if frames are dropped
 */
gsap.ticker.lagSmoothing(0);

// ================================================
// DATA ATTRIBUTE CONTROLS
// ================================================
/**
 * Enable manual control of smooth scrolling via data attributes
 * Usage: Add data-lenis-start or data-lenis-stop to buttons
 *
 * Example: <button data-lenis-start>Enable Scroll</button>
 */
$('[data-lenis-start]').on('click', () => lenis.start());
$('[data-lenis-stop]').on('click', () => lenis.stop());
