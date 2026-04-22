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

    var embedContain = document.querySelector(".features_first-contain-embed");
    if (embedContain) gsap.set(embedContain, { opacity: 1 });

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


$('.features_item-contain.is-2').each(function () {
  var scope = this;

  (function () {
    "use strict";

    gsap.registerPlugin(ScrollTrigger);

    function q(el, sel) { return el.querySelector(sel); }
    function qa(el, sel) { return el.querySelectorAll(sel); }

    // ---------- SCALE (Webflow container aware) ----------
    function applySceneScale() {
      var base = 588;

      // ton “gros” container avec aspect-ratio + padding
      var box = scope.querySelector(".features_contain-embed.is-2") || scope;
      var scaleWrap = scope.querySelector(".bluesand-scene-scale");
      if (!scaleWrap || !box) return;

      var cs = getComputedStyle(box);
      var padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      var padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

      var availW = Math.max(0, box.clientWidth - padX);
      var availH = Math.max(0, box.clientHeight - padY);

      var scale = Math.min(1, availW / base, availH / base);
      scaleWrap.style.setProperty("--scene-scale", String(scale));
    }

    // ---------- PULSE ----------
    function animatePulse(dotEl) {
      gsap.to(dotEl, {
        scale: 1.4,
        opacity: 0.5,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // ---------- COUNTER ----------
    function animateCounter(el) {
      var raw = (el.textContent || "").replace(/[^0-9]/g, "");
      if (!raw) return;
      var target = parseInt(raw, 10);
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = Math.round(obj.val).toString();
        },
      });
    }

    // ---------- CARD POSITIONING ----------
    var ACT  = { xPercent: -50, x: -83, yPercent: -50, y:  39 };
    var CTRL = { xPercent: -50, x:  84, yPercent: -50, y: -49 };

    function buildActivityTimeline(card) {
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      var header    = q(card, ".card-activity__header");
      var alertRow  = q(card, ".alert-row");
      var stepRows  = qa(card, ".step-row");
      var stepLines = qa(card, ".step-line");
      var glTag     = q(card, ".gl-tag");
      var footer    = q(card, ".card-activity__footer");

      gsap.set(card, { xPercent: ACT.xPercent, x: ACT.x, yPercent: ACT.yPercent, y: ACT.y + 50, opacity: 0 });
      if (header) gsap.set(header, { opacity: 0, y: -8 });
      if (alertRow) gsap.set(alertRow, { opacity: 0, scale: 0.94, y: 6 });
      if (stepRows.length) gsap.set(stepRows, { opacity: 0, x: -14 });
      if (stepLines.length) gsap.set(stepLines, { scaleY: 0, transformOrigin: "top center" });
      if (footer) gsap.set(footer, { opacity: 0, y: 10 });
      if (glTag) gsap.set(glTag, { opacity: 0, scale: 0.85 });

      tl.to(card, { y: ACT.y, opacity: 1, duration: 0.65 });

      if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.35 }, "-=0.3");
      if (alertRow) tl.to(alertRow, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }, "-=0.15");

      if (stepRows.length) {
        tl.to(stepRows, {
          opacity: 1, x: 0, duration: 0.35,
          stagger: { each: 0.14, ease: "power1.out" },
        }, "-=0.1");
      }

      if (stepLines.length) {
        tl.to(stepLines, {
          scaleY: 1, duration: 0.3, ease: "power1.inOut",
          stagger: 0.14,
        }, "<0.1");
      }

      if (glTag) tl.to(glTag, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }, "-=0.25");
      if (footer) tl.to(footer, { opacity: 1, y: 0, duration: 0.35 }, "-=0.1");

      tl.call(function () {
        var orangeDot = q(card, ".step-dot--orange");
        if (orangeDot) animatePulse(orangeDot);
      });

      return tl;
    }

    function buildControllerTimeline(card) {
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      var badge    = q(card, ".controller-badge");
      var items    = qa(card, ".ctrl-item");
      var dividers = qa(card, ".ctrl-divider");
      var buttons  = qa(card, ".ctrl-btn");
      var numbers  = qa(card, ".ctrl-text--orange");

      gsap.set(card, { xPercent: CTRL.xPercent, x: CTRL.x, yPercent: CTRL.yPercent, y: CTRL.y + 50, opacity: 0 });
      if (badge) gsap.set(badge, { opacity: 0, scale: 0.75, x: -10 });
      if (items.length) gsap.set(items, { opacity: 0, y: 18 });
      if (dividers.length) gsap.set(dividers, { scaleX: 0, transformOrigin: "left center" });
      if (buttons.length) gsap.set(buttons, { opacity: 0, y: 6 });

      tl.to(card, { y: CTRL.y, opacity: 1, duration: 0.65 });

      if (badge) tl.to(badge, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.3");

      if (items.length) {
        tl.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: { each: 0.15 } }, "-=0.2");
      }

      if (dividers.length) {
        tl.to(dividers, { scaleX: 1, duration: 0.45, ease: "power2.inOut", stagger: 0.12 }, "<0.05");
      }

      if (buttons.length) {
        tl.to(buttons, { opacity: 1, y: 0, duration: 0.25, stagger: { each: 0.05 } }, "-=0.35");
      }

      if (numbers.length) tl.call(function () { numbers.forEach(animateCounter); }, [], "-=0.5");
      return tl;
    }

    function initScene(scene) {
      var actCard  = q(scene, ".card-activity");
      var ctrlCard = q(scene, ".card-controller");
      if (!actCard || !ctrlCard) return;

      var embedContain = scope.querySelector(".features_second-contain-embed");
      if (embedContain) gsap.set(embedContain, { opacity: 1 });

      var master = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "top 60%",
          once: true,
        },
      });

      var bg = q(scene, ".scene-bg");
      if (bg) {
        gsap.set(bg, { scale: 1.04 });
        master.to(bg, { scale: 1, duration: 1.2, ease: "power2.out" }, 0);
      }

      master
        .add(buildActivityTimeline(actCard), 0)
        .add(buildControllerTimeline(ctrlCard), 0.12);
    }

    function init() {
      applySceneScale();
      window.addEventListener("resize", function () {
        applySceneScale();
        if (window.ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
      }, { passive: true });

      scope.querySelectorAll(".bluesand-scene").forEach(initScene);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  })();
});


$('.features_item-contain.is-3').each(function() {

    (function () {
  "use strict";

  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────
     UTILITIES
  ───────────────────────────────────────────── */
  function q(el, sel)  { return el.querySelector(sel); }
  function qa(el, sel) { return el.querySelectorAll(sel); }

  /* ─────────────────────────────────────────────
     PULSE – dashed orange ring on active step
  ───────────────────────────────────────────── */
  function animatePulse(el) {
    gsap.to(el, {
      scale: 1.12,
      duration: 1.0,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
  }

  /* ─────────────────────────────────────────────
     SPIN – loading spinners on in-progress sub-lines
  ───────────────────────────────────────────── */
  function animateSpinners(card) {
    qa(card, ".agent-spinner").forEach(function (spin) {
      gsap.to(spin, {
        rotation: 360,
        duration: 1.4,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });
    });
  }

  /* ─────────────────────────────────────────────
     BACKGROUND APP LIST TIMELINE
  ───────────────────────────────────────────── */
  function buildListTimeline(list) {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    var sidebar  = q(list, ".app-list__sidebar");
    var topbar   = q(list, ".al-topbar");
    var searchR  = q(list, ".al-searchrow");
    var thead    = q(list, ".al-thead");
    var rows     = qa(list, ".al-row");
    var groups   = qa(list, ".al-group__header");

    gsap.set(list,    { y: 30, opacity: 0, scale: 0.985, transformOrigin: "50% 50%" });
    gsap.set(sidebar, { opacity: 0, x: -14 });
    gsap.set(topbar,  { opacity: 0, y: -6 });
    gsap.set(searchR, { opacity: 0, y: -6 });
    gsap.set(thead,   { opacity: 0, y: 6 });
    gsap.set(groups,  { opacity: 0, x: -8 });
    gsap.set(rows,    { opacity: 0, y: 8 });

    tl
      .to(list,    { y: 0, opacity: 1, scale: 1, duration: 0.7 })
      .to(sidebar, { opacity: 1, x: 0, duration: 0.45 }, "-=0.45")
      .to(topbar,  { opacity: 1, y: 0, duration: 0.35 }, "-=0.35")
      .to(searchR, { opacity: 1, y: 0, duration: 0.35 }, "-=0.25")
      .to(thead,   { opacity: 1, y: 0, duration: 0.3 },  "-=0.2")
      .to(groups,  { opacity: 1, x: 0, duration: 0.3, stagger: 0.08 }, "-=0.2")
      .to(rows,    { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, "-=0.25");

    return tl;
  }

  /* ─────────────────────────────────────────────
     AGENT CARD TIMELINE
  ───────────────────────────────────────────── */
  function buildAgentTimeline(card) {
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    var badge     = q(card, ".agent-badge");
    var steps     = qa(card, ".agent-step");
    var activeDot = q(card, ".agent-step__dot--active");
    var sublines  = qa(card, "[data-subline]");

    // Card anchored via CSS left/top; starts slightly down + transparent
    gsap.set(card, { y: 40, opacity: 0 });
    gsap.set(badge,    { opacity: 0, scale: 0.8, x: -10 });
    gsap.set(steps,    { opacity: 0, y: 14 });
    gsap.set(sublines, { opacity: 0, x: -10 });

    tl
      .to(card,  { y: 0, opacity: 1, duration: 0.7 })
      .to(badge, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.35")
      .to(steps, {
        opacity: 1, y: 0, duration: 0.4,
        stagger: { each: 0.14 },
      }, "-=0.2")
      .to(sublines, {
        opacity: 1, x: 0, duration: 0.32,
        stagger: { each: 0.08, ease: "power1.out" },
      }, "-=0.35");

    tl.call(function () {
      if (activeDot) animatePulse(activeDot);
      animateSpinners(card);
    });

    return tl;
  }

  /* ─────────────────────────────────────────────
     SCENE ORCHESTRATOR
  ───────────────────────────────────────────── */
  function initScene(scene) {
    var list  = q(scene, ".app-list");
    var agent = q(scene, ".card-agent");
    if (!list || !agent) return;

    var master = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top 50%",
        once: true,
        // markers: true, // uncomment to debug
      },
    });

    // Background subtle zoom-in
    var bg = q(scene, ".scene2-bg");
    if (bg) {
      gsap.set(bg, { scale: 1.04 });
      master.to(bg, { scale: 1, duration: 1.2, ease: "power2.out" }, 0);
    }

    // List first (behind), Agent card slightly delayed on top
    master
      .add(buildListTimeline(list), 0)
      .add(buildAgentTimeline(agent), 0.25);
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() {
    // Optional responsive scaling for scenes wrapped in .bluesand-scene-2-scale
    function applyScale() {
      document.querySelectorAll(".bluesand-scene-2-scale > .bluesand-scene-2").forEach(function (scene) {
        var wrap = scene.parentElement;
        if (!wrap) return;

        var baseW = 694;
        var baseH = 575;

        var cs = getComputedStyle(wrap);
        var padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);

        // Important: do NOT use wrap.clientHeight here.
        // The wrapper's height depends on the scale itself (CSS), which would
        // "lock" the scale at the smallest value seen. Width is the stable input.
        var availW = Math.max(0, (wrap.clientWidth || baseW) - padX);

        var scale = Math.min(1, availW / baseW);
        wrap.style.setProperty("--scene2-scale", String(scale));
      });

      if (ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
    }

    applyScale();
    window.addEventListener("resize", applyScale, { passive: true });

    document.querySelectorAll(".bluesand-scene-2").forEach(initScene);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

})



});
