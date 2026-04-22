import { lenis } from './smoothScroll';
window.Webflow ||= [];
window.Webflow.push(() => {

    console.log('Animation component loaded');

$('.features_item-contain.is-1').each(function() {
(function () {
  "use strict";
  if (!window.gsap) return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ─────────────────────────────────────────────
     UTILITIES
  ───────────────────────────────────────────── */
  function q(el, sel)  { return el.querySelector(sel); }
  function qa(el, sel) { return Array.from(el.querySelectorAll(sel)); }
  /* ─────────────────────────────────────────────
     COUNTER – animate number from 0 to target
  ───────────────────────────────────────────── */
  function animateCounter(el, finalVal, duration, delay) {
    if (!el) return;
    var obj = { v: 0 };
    gsap.to(obj, {
      v: finalVal,
      duration: duration,
      delay: delay,
      ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(obj.v); },
    });
  }
  /* ─────────────────────────────────────────────
     PULSE – send button pulse loop
  ───────────────────────────────────────────── */
  function animateSendPulse(btn) {
    if (!btn || prefersReducedMotion) return;
    gsap.to(btn, {
      scale: 1.12,
      duration: 1.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "50% 50%",
    });
  }
  /* ─────────────────────────────────────────────
     PLANNING BACKGROUND TIMELINE
  ───────────────────────────────────────────── */
  function buildPlanTimeline(scene) {
    var plan = q(scene, ".plan-bg");
    if (!plan) return gsap.timeline();
    var tl = gsap.timeline();
    gsap.set(plan, { opacity: 0, y: 10, scale: 1.02, transformOrigin: "0% 50%" });
    tl.to(plan, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power2.out" });
    return tl;
  }
  /* ─────────────────────────────────────────────
     PACING CHART TIMELINE
  ───────────────────────────────────────────── */
  function buildPacingTimeline(scene) {
    var card = q(scene, ".card-pacing");
    if (!card) return gsap.timeline();
    var lineExp  = q(card, "[data-line-exp]");
    var lineAct  = q(card, "[data-line-act]");
    var areaExp  = q(card, "[data-area-exp]");
    var areaAct  = q(card, "[data-area-act]");
    var grids    = qa(card, "[data-grid]");
    var today    = q(card, "[data-pacing-today]");
    var badge    = q(card, "[data-pacing-badge]");
    var dots     = qa(card, "[data-pacing-dot]");
    var counter  = q(card, "[data-counter]");
    var headBits = qa(card, ".pacing-title, .pacing-stat, .pacing-legend__item, .pacing-y, .pacing-x span");
    // ── Initial states ──
    gsap.set(card, { y: 30, opacity: 0, scale: 0.985, transformOrigin: "50% 100%" });
    if (headBits.length) gsap.set(headBits, { opacity: 0, y: 6 });
    if (grids.length)    gsap.set(grids, { scaleX: 0, transformOrigin: "0% 50%" });
    [lineExp, lineAct].forEach(function (el) {
      if (!el) return;
      var len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    if (areaExp) gsap.set(areaExp, { opacity: 0 });
    if (areaAct) gsap.set(areaAct, { opacity: 0 });
    if (today)   gsap.set(today, { scaleY: 0, transformOrigin: "50% 0%", opacity: 0 });
    if (badge)   gsap.set(badge, { opacity: 0, y: -4 });
    if (dots.length) gsap.set(dots, { opacity: 0, scale: 0 });
    // ── Timeline ──
    var tl = gsap.timeline();
    tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0);
    if (headBits.length) {
      tl.to(headBits, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" }, 0.25);
    }
    if (grids.length) {
      tl.to(grids, { scaleX: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 }, 0.35);
    }
    if (counter) animateCounter(counter, 92, 1.2, 0.4);
    if (lineExp) tl.to(lineExp, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }, 0.55);
    if (lineAct) tl.to(lineAct, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }, 0.75);
    if (areaExp) tl.to(areaExp, { opacity: 0.28, duration: 0.8, ease: "power1.out" }, 1.4);
    if (areaAct) tl.to(areaAct, { opacity: 0.9,  duration: 0.8, ease: "power1.out" }, 1.55);
    if (today)   tl.to(today,   { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 1.7);
    if (badge)   tl.to(badge,   { opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 1.9);
    if (dots.length) {
      tl.to(dots, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(2.5)" }, 1.95);
    }
    return tl;
  }
  /* ─────────────────────────────────────────────
     CHAT MODAL TIMELINE
  ───────────────────────────────────────────── */
  function buildChatTimeline(scene) {
    var card = q(scene, ".card-chat");
    if (!card) return gsap.timeline();
    var header  = q(card, ".chat-header");
    var msgs    = qa(card, "[data-chat-msg]");
    var input   = q(card, ".chat-input");
    var sendBtn = q(card, "[data-chat-send]");
    // ── Initial states ──
    gsap.set(card, { y: 40, opacity: 0, scale: 0.96, transformOrigin: "50% 0%" });
    if (header)     gsap.set(header, { opacity: 0, y: -6 });
    if (input)      gsap.set(input,  { opacity: 0, y: 6 });
    if (msgs.length) gsap.set(msgs,  { opacity: 0, y: 12 });
    // ── Timeline ──
    var tl = gsap.timeline();
    tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power3.out" }, 0);
    if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.2);
    if (input)  tl.to(input,  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.25);
    if (sendBtn) tl.add(function () { animateSendPulse(sendBtn); }, 0.3);
    if (msgs.length) {
      tl.to(msgs, { opacity: 1, y: 0, duration: 0.55, stagger: 0.22, ease: "power2.out" }, 0.5);
    }
    return tl;
  }
  /* ─────────────────────────────────────────────
     SCENE ORCHESTRATOR
  ───────────────────────────────────────────── */
  function initScene(scene) {
    if (scene.dataset.bsScene3Inited === "1") return;
    scene.dataset.bsScene3Inited = "1";
    var master = gsap.timeline({ paused: true });
    master
      .add(buildPlanTimeline(scene), 0)
      .add(buildPacingTimeline(scene), 0.1)
      .add(buildChatTimeline(scene), 1.9);
    if (prefersReducedMotion) {
      master.progress(1);
      return;
    }
    if (window.ScrollTrigger) {
      window.ScrollTrigger.create({
        trigger: scene,
        markers: false,
        start: "top 50%",
        once: true,
        onEnter: function () { master.play(); },
      });
    } else {
      master.play();
    }
  }
  /* ─────────────────────────────────────────────
     INIT ALL SCENES ON PAGE
  ───────────────────────────────────────────── */
  function init() {
    document.querySelectorAll(".bluesand-scene-3").forEach(initScene);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

})




});
