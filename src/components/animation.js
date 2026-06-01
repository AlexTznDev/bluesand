import { lenis } from './smoothScroll';
import * as THREE from 'three';

window.Webflow ||= [];
window.Webflow.push(() => {
  let mm = gsap.matchMedia();
  $('.home-hero_section').each(function () {
    const el = $(this)[0];

    const bg = el.querySelector('.home-hero_bg-wrap');
    const headline = el.querySelector('.home-hero_headline');
    const h1 = el.querySelector('h1');
    const subtitle = el.querySelector('.home-hero_subtitile');
    const form = el.querySelector('.form_newsletter');
    const h1Glow = el.querySelector('.h1-glow');
    gsap.set(h1Glow, { opacity: 0 });
    gsap.set(el, { opacity: 1 });
    gsap.set(bg, { scale: 1.02, opacity: 0 });
    gsap.set([headline, h1, subtitle, form], { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(bg, { scale: 1, opacity: 1, duration: 1.2 }, 0)
      .to(headline, { opacity: 1, y: 0, duration: 0.55 }, 0.2)
      .to(h1, { opacity: 1, y: 0, duration: 0.65 }, 0.38)
      .to(subtitle, { opacity: 1, y: 0, duration: 0.55 }, 0.55)
      .to(form, { opacity: 1, y: 0, duration: 0.5 }, 0.7)
      .to(h1Glow, { opacity: 0.8, duration: 1.2, ease: 'power2.out' }, 0.8);

    if (h1Glow) {
      gsap.to(h1Glow, {
        '--glow-x': 90,
        '--glow-y': 100,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    const svg = el.querySelector('.home-hero_circle');
    if (svg) {
      const outerRing = svg.querySelector('#circle');
      const innerRing = svg.querySelector('#circle_2');
      const glowCore = svg.querySelector('#Ellipse\\ 633');

      // quickTo setters — one per axis per layer, ease baked in
      const outerX = gsap.quickTo(outerRing, 'x', { duration: 1.8, ease: 'power3.out' });
      const outerY = gsap.quickTo(outerRing, 'y', { duration: 1.8, ease: 'power3.out' });
      const innerX = gsap.quickTo(innerRing, 'x', { duration: 2.6, ease: 'power3.out' });
      const innerY = gsap.quickTo(innerRing, 'y', { duration: 2.6, ease: 'power3.out' });
      const glowX = gsap.quickTo(glowCore, 'x', { duration: 1.2, ease: 'power3.out' });
      const glowY = gsap.quickTo(glowCore, 'y', { duration: 1.2, ease: 'power3.out' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Normalized offset from center [-1, 1]
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        outerX(nx * 18);
        outerY(ny * 12);
        innerX(nx * -10);
        innerY(ny * -7);
        glowX(nx * 28);
        glowY(ny * 18);
      });

      const outerXBack = gsap.quickTo(outerRing, 'x', { duration: 2.0, ease: 'power2.inOut' });
      const outerYBack = gsap.quickTo(outerRing, 'y', { duration: 2.0, ease: 'power2.inOut' });
      const innerXBack = gsap.quickTo(innerRing, 'x', { duration: 2.0, ease: 'power2.inOut' });
      const innerYBack = gsap.quickTo(innerRing, 'y', { duration: 2.0, ease: 'power2.inOut' });
      const glowXBack = gsap.quickTo(glowCore, 'x', { duration: 2.0, ease: 'power2.inOut' });
      const glowYBack = gsap.quickTo(glowCore, 'y', { duration: 2.0, ease: 'power2.inOut' });
    }
  });

  $('.features_item-contain.is-1').each(function () {
    /* ══════════════════════════════════════════════════════
   BLUESAND – Scene 3  (Steer Activity + Pacing Chart)
   Requires: GSAP 3.12+ and ScrollTrigger
   ══════════════════════════════════════════════════════ */
    (function () {
      'use strict';

      if (typeof window === 'undefined' || !window.gsap) return;
      const gsap = window.gsap;
      if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

      const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ───────── helpers ───────── */
      function qs(root, sel) {
        return root.querySelector(sel);
      }
      function qsa(root, sel) {
        return Array.from(root.querySelectorAll(sel));
      }

      /* ───────── counter animation 0 → 92 ───────── */
      function animateCounter(el, finalVal, duration, delay) {
        if (!el) return;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: finalVal,
          duration: duration,
          delay: delay,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.v);
          },
        });
      }

      /* ───────── pulse send button ───────── */
      function animateSendPulse(btn) {
        if (!btn || prefersReducedMotion) return;
        gsap.to(btn, {
          scale: 1.12,
          duration: 1.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      /* ───────── Planning background timeline ───────── */
      function buildPlanTimeline(scene) {
        const plan = qs(scene, '.plan-bg');
        if (!plan) return gsap.timeline();

        const tl = gsap.timeline();
        gsap.set(plan, { opacity: 0, y: 10, scale: 1.02, transformOrigin: '0% 50%' });

        tl.to(plan, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: 'power2.out',
        });
        return tl;
      }

      /* ───────── Pacing chart timeline ───────── */
      function buildPacingTimeline(scene) {
        const card = qs(scene, '.card-pacing');
        if (!card) return gsap.timeline();

        const lineExp = qs(card, '[data-line-exp]');
        console.log(lineExp);
        const lineAct = qs(card, '[data-line-act]');
        const areaExp = qs(card, '[data-area-exp]');
        const areaAct = qs(card, '[data-area-act]');
        const grids = qsa(card, '[data-grid]');
        const today = qs(card, '[data-pacing-today]');
        const badge = qs(card, '[data-pacing-badge]');
        const dots = qsa(card, '[data-pacing-dot]');
        const counter = qs(card, '[data-counter]');
        const headBits = qsa(
          card,
          '.pacing-title, .pacing-stat, .pacing-legend__item, .pacing-y, .pacing-x span'
        );

        /* initial states ------------------------------------------------ */
        gsap.set(card, { y: 30, opacity: 0, scale: 0.985, transformOrigin: '50% 100%' });
        gsap.set(headBits, { opacity: 0, y: 6 });
        gsap.set(grids, { scaleX: 0, transformOrigin: '0% 50%' });

        [lineExp, lineAct].forEach((el) => {
          if (!el) return;
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set([areaExp, areaAct], { opacity: 0 });
        gsap.set(today, { scaleY: 0, transformOrigin: '50% 0%', opacity: 0 });
        gsap.set(badge, { opacity: 0, y: -4 });
        gsap.set(dots, { opacity: 0, scale: 0 });

        /* timeline ------------------------------------------------------ */
        const tl = gsap.timeline();

        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
          },
          0
        )
          .to(
            headBits,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.04,
              ease: 'power2.out',
            },
            0.25
          )
          .to(
            grids,
            {
              scaleX: 1,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.05,
            },
            0.35
          );

        if (counter) animateCounter(counter, 65, 1.2, 0.4);

        tl.to(
          lineExp,
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power1.inOut',
          },
          0.55
        )
          .to(
            lineAct,
            {
              strokeDashoffset: 0,
              duration: 1.6,
              ease: 'power1.inOut',
            },
            0.75
          )
          .to(
            areaExp,
            {
              opacity: 0.28,
              duration: 0.8,
              ease: 'power1.out',
            },
            1.4
          )
          .to(
            areaAct,
            {
              opacity: 0.9,
              duration: 0.8,
              ease: 'power1.out',
            },
            1.55
          )
          .to(
            today,
            {
              scaleY: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            },
            1.7
          )
          .to(
            badge,
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              ease: 'back.out(2)',
            },
            1.9
          )
          .to(
            dots,
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: 'back.out(2.5)',
            },
            1.95
          );

        return tl;
      }

      /* ───────── Chat modal timeline ───────── */
      function buildChatTimeline(scene) {
        const card = qs(scene, '.card-chat');
        if (!card) return gsap.timeline();

        const header = qs(card, '.chat-header');
        const msgs = qsa(card, '[data-chat-msg]');
        const input = qs(card, '.chat-input');
        const sendBtn = qs(card, '[data-chat-send]');

        /* initial states ----------------------------------------------- */
        gsap.set(card, { y: 40, opacity: 0, scale: 0.96, transformOrigin: '50% 0%' });
        gsap.set(header, { opacity: 0, y: -6 });
        gsap.set(input, { opacity: 0, y: 6 });
        gsap.set(msgs, { opacity: 0, y: 12 });

        /* timeline ------------------------------------------------------ */
        const tl = gsap.timeline();

        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          0
        )
          .to(
            header,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.2
          )
          .to(
            input,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.25
          )
          .add(() => animateSendPulse(sendBtn), 0.3)
          .to(
            msgs,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.22,
              ease: 'power2.out',
            },
            0.5
          );

        return tl;
      }

      /* ───────── Scene orchestration ───────── */
      function initScene(scene) {
        if (scene.dataset.bsScene3Inited === '1') return;
        scene.dataset.bsScene3Inited = '1';

        const embedContain = document.querySelector('.features_first-contain-embed');
        if (embedContain) gsap.set(embedContain, { opacity: 1 });

        const master = gsap.timeline({ paused: true });
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
            start: 'top 82%',
            once: true,
            onEnter: () => master.play(),
          });
        } else {
          master.play();
        }
      }

      function init() {
        // Optional responsive scaling for scenes wrapped in .bluesand-scene-3-scale
        function applyScale() {
          qsa(document, '.bluesand-scene-3-scale > .bluesand-scene-3').forEach((scene) => {
            const wrap = scene.parentElement;
            if (!wrap) return;

            const base = 745; // scene's natural width in px

            const cs = getComputedStyle(wrap);
            const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
            const availW = Math.max(0, (wrap.clientWidth || base) - padX);

            // Width-only to avoid "stuck at smallest scale" (wrapper height depends on scale).
            const scale = Math.min(1, availW / base);
            wrap.style.setProperty('--scene3-scale', String(scale));
          });

          if (window.ScrollTrigger && window.ScrollTrigger.refresh) window.ScrollTrigger.refresh();
        }

        applyScale();
        window.addEventListener('resize', applyScale, { passive: true });

        qsa(document, '.bluesand-scene-3').forEach(initScene);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
  });

  $('.features_item-contain.is-2').each(function () {
    var scope = this;

    (function () {
      'use strict';

      gsap.registerPlugin(ScrollTrigger);

      function q(el, sel) {
        return el.querySelector(sel);
      }
      function qa(el, sel) {
        return el.querySelectorAll(sel);
      }

      // ---------- SCALE (Webflow container aware) ----------
      function applySceneScale() {
        var base = 588;
        var scaleWrap = scope.querySelector('.bluesand-scene-scale');
        var box = scope.querySelector('.features_second-contain-embed') || scaleWrap.parentElement;
        if (!scaleWrap || !box) return;

        var cs = getComputedStyle(box);
        var padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        var padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);

        var availW = Math.max(0, box.clientWidth - padX);
        var availH = Math.max(0, box.clientHeight - padY);

        // Contraindre W ET H — la scène est carrée, le plus petit des deux gagne
        var scale = Math.min(availW / base, availH / base);
        scaleWrap.style.setProperty('--scene-scale', String(scale));
      }

      // ---------- PULSE ----------
      function animatePulse(dotEl) {
        gsap.to(dotEl, {
          scale: 1.4,
          opacity: 0.5,
          duration: 0.8,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // ---------- COUNTER ----------
      function animateCounter(el) {
        var raw = (el.textContent || '').replace(/[^0-9]/g, '');
        if (!raw) return;
        var target = parseInt(raw, 10);
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      }

      // ---------- CARD POSITIONING ----------
      var ACT = { xPercent: -50, x: -83, yPercent: -50, y: 19 };
      var CTRL = { xPercent: -50, x: 84, yPercent: -50, y: -39 };

      function buildActivityTimeline(card) {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        var header = q(card, '.card-activity__header');
        var alertRow = q(card, '.alert-row');
        var stepRows = qa(card, '.step-row');
        var stepLines = qa(card, '.step-line');
        var glTag = q(card, '.gl-tag');
        var footer = q(card, '.card-activity__footer');

        gsap.set(card, {
          xPercent: ACT.xPercent,
          x: ACT.x,
          yPercent: ACT.yPercent,
          y: ACT.y + 50,
          opacity: 0,
        });
        if (header) gsap.set(header, { opacity: 0, y: -8 });
        if (alertRow) gsap.set(alertRow, { opacity: 0, scale: 0.94, y: 6 });
        if (stepRows.length) gsap.set(stepRows, { opacity: 0, x: -14 });
        if (stepLines.length) gsap.set(stepLines, { scaleY: 0, transformOrigin: 'top center' });
        if (footer) gsap.set(footer, { opacity: 0, y: 10 });
        if (glTag) gsap.set(glTag, { opacity: 0, scale: 0.85 });

        tl.to(card, { y: ACT.y, opacity: 1, duration: 0.65 });

        if (header) tl.to(header, { opacity: 1, y: 0, duration: 0.35 }, '-=0.3');
        if (alertRow)
          tl.to(
            alertRow,
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' },
            '-=0.15'
          );

        if (stepRows.length) {
          tl.to(
            stepRows,
            {
              opacity: 1,
              x: 0,
              duration: 0.35,
              stagger: { each: 0.14, ease: 'power1.out' },
            },
            '-=0.1'
          );
        }

        if (stepLines.length) {
          tl.to(
            stepLines,
            {
              scaleY: 1,
              duration: 0.3,
              ease: 'power1.inOut',
              stagger: 0.14,
            },
            '<0.1'
          );
        }

        if (glTag)
          tl.to(glTag, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.25');
        if (footer) tl.to(footer, { opacity: 1, y: 0, duration: 0.35 }, '-=0.1');

        tl.call(function () {
          var orangeDot = q(card, '.step-dot--orange');
          if (orangeDot) animatePulse(orangeDot);
        });

        return tl;
      }

      function buildControllerTimeline(card) {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        var badge = q(card, '.controller-badge');
        var items = qa(card, '.ctrl-item');
        var dividers = qa(card, '.ctrl-divider');
        var buttons = qa(card, '.ctrl-btn');
        var numbers = qa(card, '.ctrl-text--orange');

        gsap.set(card, {
          xPercent: CTRL.xPercent,
          x: CTRL.x,
          yPercent: CTRL.yPercent,
          y: CTRL.y + 50,
          opacity: 0,
        });
        if (badge) gsap.set(badge, { opacity: 0, scale: 0.75, x: -10 });
        if (items.length) gsap.set(items, { opacity: 0, y: 18 });
        if (dividers.length) gsap.set(dividers, { scaleX: 0, transformOrigin: 'left center' });
        if (buttons.length) gsap.set(buttons, { opacity: 0, y: 6 });

        tl.to(card, { y: CTRL.y, opacity: 1, duration: 0.65 });

        if (badge)
          tl.to(
            badge,
            { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(1.7)' },
            '-=0.3'
          );

        if (items.length) {
          tl.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: { each: 0.15 } }, '-=0.2');
        }

        if (dividers.length) {
          tl.to(
            dividers,
            { scaleX: 1, duration: 0.45, ease: 'power2.inOut', stagger: 0.12 },
            '<0.05'
          );
        }

        if (buttons.length) {
          tl.to(buttons, { opacity: 1, y: 0, duration: 0.25, stagger: { each: 0.05 } }, '-=0.35');
        }

        if (numbers.length)
          tl.call(
            function () {
              numbers.forEach(animateCounter);
            },
            [],
            '-=0.5'
          );
        return tl;
      }

      function initScene(scene) {
        var actCard = q(scene, '.card-activity');
        var ctrlCard = q(scene, '.card-controller');
        if (!actCard || !ctrlCard) return;

        var embedContain = scope.querySelector('.features_second-contain-embed');
        if (embedContain) gsap.set(embedContain, { opacity: 1 });

        var master = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top 60%',
            once: true,
          },
        });

        var bg = q(scene, '.scene-bg');
        if (bg) {
          gsap.set(bg, { scale: 1.04 });
          master.to(bg, { scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
        }

        master.add(buildActivityTimeline(actCard), 0).add(buildControllerTimeline(ctrlCard), 0.12);
      }

      function init() {
        applySceneScale();
        window.addEventListener(
          'resize',
          function () {
            applySceneScale();
            if (window.ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
          },
          { passive: true }
        );

        scope.querySelectorAll('.bluesand-scene').forEach(initScene);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
      } else {
        init();
      }
    })();
  });

  $('.features_item-contain.is-3').each(function () {
    (function () {
      'use strict';

      if (typeof gsap === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);

      /* ─────────────────────────────────────────────
     UTILITIES
  ───────────────────────────────────────────── */
      function q(el, sel) {
        return el.querySelector(sel);
      }
      function qa(el, sel) {
        return el.querySelectorAll(sel);
      }

      /* ─────────────────────────────────────────────
     PULSE – dashed orange ring on active step
  ───────────────────────────────────────────── */
      function animatePulse(el) {
        gsap.to(el, {
          scale: 1.12,
          duration: 1.0,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: 'center center',
        });
      }

      /* ─────────────────────────────────────────────
     SPIN – loading spinners on in-progress sub-lines
  ───────────────────────────────────────────── */
      function animateSpinners(card) {
        qa(card, '.agent-spinner').forEach(function (spin) {
          gsap.to(spin, {
            rotation: 360,
            duration: 1.4,
            ease: 'none',
            repeat: -1,
            transformOrigin: 'center center',
          });
        });
      }

      /* ─────────────────────────────────────────────
     BACKGROUND APP LIST TIMELINE
  ───────────────────────────────────────────── */
      function buildListTimeline(list) {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        var sidebar = q(list, '.app-list__sidebar');
        var topbar = q(list, '.al-topbar');
        var searchR = q(list, '.al-searchrow');
        var thead = q(list, '.al-thead');
        var rows = qa(list, '.al-row');
        var groups = qa(list, '.al-group__header');

        gsap.set(list, { y: 30, opacity: 0, scale: 0.985, transformOrigin: '50% 50%' });
        gsap.set(sidebar, { opacity: 0, x: -14 });
        gsap.set(topbar, { opacity: 0, y: -6 });
        gsap.set(searchR, { opacity: 0, y: -6 });
        gsap.set(thead, { opacity: 0, y: 6 });
        gsap.set(groups, { opacity: 0, x: -8 });
        gsap.set(rows, { opacity: 0, y: 8 });

        tl.to(list, { y: 0, opacity: 1, scale: 1, duration: 0.7 })
          .to(sidebar, { opacity: 1, x: 0, duration: 0.45 }, '-=0.45')
          .to(topbar, { opacity: 1, y: 0, duration: 0.35 }, '-=0.35')
          .to(searchR, { opacity: 1, y: 0, duration: 0.35 }, '-=0.25')
          .to(thead, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
          .to(groups, { opacity: 1, x: 0, duration: 0.3, stagger: 0.08 }, '-=0.2')
          .to(rows, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, '-=0.25');

        return tl;
      }

      /* ─────────────────────────────────────────────
     AGENT CARD TIMELINE
  ───────────────────────────────────────────── */
      function buildAgentTimeline(card) {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        var badge = q(card, '.agent-badge');
        var steps = qa(card, '.agent-step');
        var activeDot = q(card, '.agent-step__dot--active');
        var sublines = qa(card, '[data-subline]');

        // Card anchored via CSS left/top; starts slightly down + transparent
        gsap.set(card, { y: 40, opacity: 0 });
        gsap.set(badge, { opacity: 0, scale: 0.8, x: -10 });
        gsap.set(steps, { opacity: 0, y: 14 });
        gsap.set(sublines, { opacity: 0, x: -10 });

        tl.to(card, { y: 0, opacity: 1, duration: 0.7 })
          .to(badge, { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.35')
          .to(
            steps,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: { each: 0.14 },
            },
            '-=0.2'
          )
          .to(
            sublines,
            {
              opacity: 1,
              x: 0,
              duration: 0.32,
              stagger: { each: 0.08, ease: 'power1.out' },
            },
            '-=0.35'
          );

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
        var list = q(scene, '.app-list');
        var agent = q(scene, '.card-agent');
        if (!list || !agent) return;

        var embedContain = document.querySelector('.features_third-contain-embed');
        if (embedContain) gsap.set(embedContain, { opacity: 1 });

        var master = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top 50%',
            once: true,
            // markers: true, // uncomment to debug
          },
        });

        // Background subtle zoom-in
        var bg = q(scene, '.scene2-bg');
        if (bg) {
          gsap.set(bg, { scale: 1.04 });
          master.to(bg, { scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
        }

        // List first (behind), Agent card slightly delayed on top
        master.add(buildListTimeline(list), 0).add(buildAgentTimeline(agent), 0.25);
      }

      /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
      function init() {
        // Optional responsive scaling for scenes wrapped in .bluesand-scene-2-scale
  function applyScale() {
  document
    .querySelectorAll('.bluesand-scene-2-scale > .bluesand-scene-2')
    .forEach(function (scene) {
      var wrap = scene.parentElement;
      if (!wrap) return;

      var baseW = 700;

      var cs = getComputedStyle(wrap);
      var padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);

      var availW = Math.max(0, (wrap.clientWidth || baseW) - padX);

      var scale = Math.min(1, availW / baseW); // ← ajout du Math.min(1, ...)
      wrap.style.setProperty('--scene2-scale', String(scale));
    });

  if (ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
}


        applyScale();
        window.addEventListener('resize', applyScale, { passive: true });

        document.querySelectorAll('.bluesand-scene-2').forEach(initScene);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
  });

  $('.nav_component').each(function () {
    const $nav = $(this);

    ScrollTrigger.create({
      trigger: 'body',
      start: '32px top',

      onEnter: () => $nav.addClass('is-scroll'),
      onLeaveBack: () => $nav.removeClass('is-scroll'),
    });
  });

  $('.features_item-contain.is-4').each(function () {
    (function () {
      'use strict';

      if (typeof window === 'undefined' || !window.gsap) return;
      const gsap = window.gsap;
      if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

      const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function qs(root, sel) {
        return root.querySelector(sel);
      }
      function qsa(root, sel) {
        return Array.from(root.querySelectorAll(sel));
      }

      /* ───────── Entry animation ───────── */
      function buildEntryTimeline(scene) {
        const table = qs(scene, '.variance-table');
        const popup = qs(scene, '.drill-popup');
        const badge = qs(scene, '.drill-badge');
        const title = qs(scene, '.drill-title');
        const sects = qsa(scene, '.drill-section');
        const listItems = qsa(scene, '.drill-list__item');
        const hlBtn = qs(scene, '.vt-highlight-btn');

        gsap.set(table, { opacity: 0, y: -20 });
        gsap.set(popup, { opacity: 0, y: 40, scale: 0.97, transformOrigin: '50% 0%' });
        gsap.set([badge, title, ...sects], { opacity: 0, y: 8 });
        gsap.set(listItems, { opacity: 0, x: -6 });
        if (hlBtn) gsap.set(hlBtn, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' });

        const tl = gsap.timeline();

        tl.to(
          table,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          0
        )
          .to(
            hlBtn,
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(2)',
            },
            0.55
          )
          .to(
            popup,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: 'power3.out',
            },
            0.4
          )
          .to(
            [badge, title, ...sects],
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.09,
              ease: 'power2.out',
            },
            0.7
          )
          .to(
            listItems,
            {
              opacity: 0.5,
              x: 0,
              duration: 0.45,
              stagger: 0.12,
              ease: 'power2.out',
            },
            '>-0.2'
          );

        return tl;
      }

      /* ───────── Custom cursor (hover interaction) ─────────
     - On mouseenter: hide native cursor, fade in custom cursor
     - On mousemove : smoothly track mouse position (gsap.quickTo)
     - On mouseleave: restore native cursor, fade out custom cursor
  ------------------------------------------------------- */
      function bindCustomCursor(scene) {
        const cursor = qs(scene, '[data-custom-cursor]');
        if (!cursor) return;

        /* Touch devices – skip (no hover) */
        const isTouch =
          window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
        if (isTouch) return;

        /* quickTo returns ultra-fast setters – one call per frame, ease baked in */
        const setX = gsap.quickTo(cursor, 'x', { duration: 0.28, ease: 'power3.out' });
        const setY = gsap.quickTo(cursor, 'y', { duration: 0.28, ease: 'power3.out' });

        let isInside = false;
        let pendingFirstMove = false;
        let lastClientX = 0;
        let lastClientY = 0;

        const hideCursor = () => {
          isInside = false;
          scene.classList.remove('is-cursor-active');
          gsap.to(cursor, { opacity: 0, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
        };

        scene.addEventListener('mouseenter', (ev) => {
          isInside = true;
          lastClientX = ev.clientX;
          lastClientY = ev.clientY;
          scene.classList.add('is-cursor-active');
          pendingFirstMove = true;

          const rect = scene.getBoundingClientRect();
          const x = ev.clientX - rect.left;
          const y = ev.clientY - rect.top;
          /* Jump instantly to the entry point to avoid the "flying in" effect */
          gsap.set(cursor, { x: x, y: y });

          gsap.to(cursor, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });

        scene.addEventListener('mousemove', (ev) => {
          if (!isInside) return;
          lastClientX = ev.clientX;
          lastClientY = ev.clientY;
          const rect = scene.getBoundingClientRect();
          const x = ev.clientX - rect.left;
          const y = ev.clientY - rect.top;

          if (pendingFirstMove) {
            gsap.set(cursor, { x: x, y: y });
            pendingFirstMove = false;
          } else {
            setX(x);
            setY(y);
          }
        });

        scene.addEventListener('mouseleave', hideCursor);

        window.addEventListener(
          'scroll',
          () => {
            if (!isInside) return;
            const rect = scene.getBoundingClientRect();
            const stillInside =
              lastClientX >= rect.left &&
              lastClientX <= rect.right &&
              lastClientY >= rect.top &&
              lastClientY <= rect.bottom;
            if (!stillInside) {
              hideCursor();
            } else {
              setX(lastClientX - rect.left);
              setY(lastClientY - rect.top);
            }
          },
          { passive: true }
        );
      }

      /* ───────── Scene orchestration ───────── */
      function initScene(scene) {
        if (scene.dataset.bsScene4Inited === '1') return;
        scene.dataset.bsScene4Inited = '1';

        const embedContain = document.querySelector('.features_fourth-contain-embed');
        if (embedContain) gsap.set(embedContain, { opacity: 1 });

        const master = gsap.timeline({ paused: true });
        master.add(buildEntryTimeline(scene), 0);

        if (prefersReducedMotion) {
          master.progress(1);
        } else if (window.ScrollTrigger) {
          window.ScrollTrigger.create({
            trigger: scene,
            start: 'top 50%',
            once: true,
            onEnter: () => master.play(),
          });
        } else {
          master.play();
        }

        bindCustomCursor(scene);
      }

      function init() {
        // Optional responsive scaling for scenes wrapped in .bluesand-scene-4-scale
        function applyScale() {
          qsa(document, '.bluesand-scene-4-scale > .bluesand-scene-4').forEach((scene) => {
            const wrap = scene.parentElement;
            if (!wrap) return;

            const base = 588;

            const cs = getComputedStyle(wrap);
            const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
            const availW = Math.max(0, (wrap.clientWidth || base) - padX);

            // Width-only to avoid "stuck at smallest scale" (wrapper height depends on scale).
            const scale = availW / base;
            wrap.style.setProperty('--scene4-scale', String(scale));
          });

          if (window.ScrollTrigger && window.ScrollTrigger.refresh) window.ScrollTrigger.refresh();
        }

        applyScale();
        window.addEventListener('resize', applyScale, { passive: true });

        qsa(document, '.bluesand-scene-4').forEach(initScene);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
  });

$('.feature_noise-particule').each(function () {
  const container = this;
  if (!window.gsap || !window.ScrollTrigger) return;
  const isAmbient = container.classList.contains('is-ambient');

  const DPR = Math.min(window.devicePixelRatio, 2);

  // ── Glow overlay ──────────────────────────────────────
  const glowEl = document.createElement('div');
  glowEl.style.cssText =
    'position:absolute;inset:0;pointer-events:none;opacity:0;' +
    'background:radial-gradient(ellipse 70% 55% at 50% 50%,' +
    'rgba(243,196,142,0.52) 0%,rgba(241,175,100,0.22) 45%,transparent 75%);';
  container.appendChild(glowEl);

  // ── Renderer ──────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(DPR);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.domElement.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(renderer.domElement);

  // ── Scene / Orthographic camera (pixel space) ─────────
  const scene = new THREE.Scene();
  let W = container.offsetWidth;
  let H = container.offsetHeight;

  const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 10);
  camera.position.z = 1;

  // ── Shaders ───────────────────────────────────────────
  const vertexShader = /* glsl */ `
    attribute vec3  aCircle;
    attribute float aPhase;
    attribute float aSpeed;
    attribute float aAmpX;
    attribute float aAmpY;
    attribute float aSize;
    attribute vec3  aColor;
    attribute float aHidden;

    uniform float uTime;
    uniform float uOpacity;
    uniform float uGather;
    uniform float uSettle;
    uniform float uRotation;

    varying vec3  vColor;
    varying float vAlpha;

    void main() {
      // Rotation du cercle avant explosion
      float cosR = cos(uRotation);
      float sinR = sin(uRotation);
      vec3 rotatedCircle = vec3(
        aCircle.x * cosR - aCircle.y * sinR,
        aCircle.x * sinR + aCircle.y * cosR,
        0.0
      );

      // All particles explode simultaneously — circle collapses on frame 1
      float drag   = 2.2 + (1.0 - aSpeed * 1.8) * 4.2;
      float tEased = 1.0 - pow(1.0 - uGather, drag);

      vec3 pos = mix(rotatedCircle, position, tEased);

      // Curved trajectory during flight — each grain curves along its own arc
      // sin/cos of static aPhase = deterministic direction, no oscillation
      float inFlight = tEased * (1.0 - tEased) * 4.0;
      pos.x += sin(aPhase * 7.3) * aAmpX * 0.28 * inFlight;
      pos.y += cos(aPhase * 5.1) * aAmpY * 0.20 * inFlight;

      // Gravity: grains settle slightly lower than their target — heavier feel
      float travelDist = length(position.xy - aCircle.xy);
      pos.y -= travelDist * 0.028 * tEased;

      // Phase 3 — léger mouvement organique autour de la position finale
      float slowX = aSpeed * 0.5 + 0.18;
      float slowY = aSpeed * 0.38 + 0.14;
      pos.x += sin(uTime * slowX + aPhase) * aAmpX * 0.38 * uSettle;
      pos.y += cos(uTime * slowY + aPhase * 1.3) * aAmpY * 0.28 * uSettle;

      // Particules cachées au départ : s'allument pendant le trajet
      float particleOpacity = mix(1.0, tEased, aHidden);
      vAlpha = uOpacity * particleOpacity;
      vColor = aColor;

      gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize;
    }
  `;

  const fragmentShader = /* glsl */ `
    varying vec3  vColor;
    varying float vAlpha;

    void main() {
      vec2  uv = gl_PointCoord - 0.5;
      float d  = length(uv);
      float a  = 1.0 - smoothstep(0.2, 0.5, d);
      if (a < 0.01) discard;
      gl_FragColor = vec4(vColor, a * vAlpha);
    }
  `;

  // ── Particles ─────────────────────────────────────────
  const isMobile  = window.innerWidth < 992;
  const COUNT      = isMobile ? 5000 : 7700;
  const maxOpacity = isMobile ? 0.8 : 1.0;
  const PALETTE = [
    new THREE.Color('#CEAA7E'),
    new THREE.Color('#D4A96A'),
    new THREE.Color('#F3C48E'),
    new THREE.Color('#F1BF85'),
  ];

  function gauss() {
    const u = 1 - Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  const aPos    = new Float32Array(COUNT * 3); // positions gaussiennes (cloud)
  const aCircle = new Float32Array(COUNT * 3); // positions sur le cercle
  const aColors = new Float32Array(COUNT * 3);
  const aPhases = new Float32Array(COUNT);
  const aSpeeds = new Float32Array(COUNT);
  const aAmpX   = new Float32Array(COUNT);
  const aAmpY   = new Float32Array(COUNT);
  const aSizes  = new Float32Array(COUNT);
  const aHidden = new Float32Array(COUNT);

  const circleR = Math.min(W, H) * 0.28; // rayon du cercle initial

  for (let i = 0; i < COUNT; i++) {
    // Nuage gaussien — destination finale
    aPos[i * 3]     = gauss() * W * 0.141;
    aPos[i * 3 + 1] = gauss() * H * 0.166;
    aPos[i * 3 + 2] = 0;

    // Cercle — anneau légèrement irrégulier, pas parfaitement mathématique
    const angle = Math.random() * Math.PI * 2;
    // Distribution gaussienne sur le rayon : dense au centre, queue qui s'étale
    const r = circleR + gauss() * circleR * 0.04;
    aCircle[i * 3]     = Math.cos(angle) * r;
    aCircle[i * 3 + 1] = Math.sin(angle) * r;
    aCircle[i * 3 + 2] = 0;

    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    aColors[i * 3] = c.r; aColors[i * 3 + 1] = c.g; aColors[i * 3 + 2] = c.b;

    aPhases[i] = Math.random() * Math.PI * 2;
    aSpeeds[i] = Math.random() * 0.3 + 0.08;
    aAmpX[i]   = (Math.random() * 0.6 + 0.4) * 22;
    aAmpY[i]   = (Math.random() * 0.6 + 0.4) * 16;
    aSizes[i]  = (Math.random() * 1.495 + 1.047) * DPR;
    aHidden[i] = Math.random() < 0.4 ? 1.0 : 0.0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(aPos,    3));
  geometry.setAttribute('aCircle',  new THREE.BufferAttribute(aCircle, 3));
  geometry.setAttribute('aColor',   new THREE.BufferAttribute(aColors, 3));
  geometry.setAttribute('aPhase',   new THREE.BufferAttribute(aPhases, 1));
  geometry.setAttribute('aSpeed',   new THREE.BufferAttribute(aSpeeds, 1));
  geometry.setAttribute('aAmpX',    new THREE.BufferAttribute(aAmpX,   1));
  geometry.setAttribute('aAmpY',    new THREE.BufferAttribute(aAmpY,   1));
  geometry.setAttribute('aSize',    new THREE.BufferAttribute(aSizes,  1));
  geometry.setAttribute('aHidden',  new THREE.BufferAttribute(aHidden, 1));

  const uniforms = {
    uTime:     { value: 0 },
    uOpacity:  { value: isAmbient ? maxOpacity : 0 },
    uGather:   { value: isAmbient ? 1 : 0 },
    uSettle:   { value: 0 },
    uRotation: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });

  scene.add(new THREE.Points(geometry, material));

  // ── Tick ──────────────────────────────────────────────
  let running = false;
  function tick() {
    if (!running) return;
    uniforms.uTime.value = gsap.ticker.time;
    renderer.render(scene, camera);
  }

  // ── Resize ────────────────────────────────────────────
  function onResize() {
    W = container.offsetWidth;
    H = container.offsetHeight;
    camera.left = -W / 2; camera.right  =  W / 2;
    camera.top  =  H / 2; camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // ── ScrollTrigger ─────────────────────────────────────
  ScrollTrigger.create({
    trigger: container,
    start: 'top 60%',
    end: 'bottom top',
    markers: false, // set to true to debug
    onEnter: () => {
      running = true;
      gsap.ticker.add(tick);

      const tl = gsap.timeline();

      if (isAmbient) {
        // Mode ambient : particules déjà en place dès le départ, juste glow + mouvement
        tl.to(glowEl,           { opacity: 1, duration: 1.8, ease: 'power2.out' })
          .to(uniforms.uSettle, { value: 1,   duration: 2.0, ease: 'power2.out' }, 0);
      } else {
        // Mode normal : cercle → rotation → explosion → mouvement
        tl.to(uniforms.uOpacity,  { value: maxOpacity,  duration: 0.35, ease: 'power2.out'  })
          .to(uniforms.uRotation, { value: Math.PI / 6, duration: 2.2,  ease: 'power2.inOut'}, 0.3)
          .to(uniforms.uGather,   { value: 1,            duration: 2.0,  ease: 'none'        }, 1.9)
          .to(glowEl,             { opacity: 1,          duration: 1.2,  ease: 'power2.out'  }, 1.9)
          .to(uniforms.uSettle,   { value: 1,            duration: 1.2,  ease: 'power2.out'  }, 3.5);
      }
    },
    onLeave:     () => { running = false; gsap.ticker.remove(tick); },
    onEnterBack: () => { running = true;  gsap.ticker.add(tick);    },
    onLeaveBack: () => { running = false; gsap.ticker.remove(tick); },
  });
})

  $('.home-hero_section-v2').each(function () {
    const el = $(this)[0];

    const bg = el.querySelector('.home-hero_bg-wrap');
    const headline = el.querySelector('.home-hero_headline');
    const h1 = el.querySelector('h1');
    const subtitle = el.querySelector('.home-hero_subtitile');
    const form = el.querySelector('.form_newsletter');
    const h1Glow = el.querySelector('.h1-glow');
    gsap.set(h1Glow, { opacity: 0 });
    gsap.set(el, { opacity: 1 });
    gsap.set(bg, { scale: 1.02, opacity: 0 });
    gsap.set([headline, h1, subtitle, form], { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(bg, { scale: 1, opacity: 1, duration: 1.2 }, 0)
      .to(headline, { opacity: 1, y: 0, duration: 0.55 }, 0.2)
      .to(h1, { opacity: 1, y: 0, duration: 0.65 }, 0.38)
      .to(subtitle, { opacity: 1, y: 0, duration: 0.55 }, 0.55)
      .to(form, { opacity: 1, y: 0, duration: 0.5 }, 0.7)
      .to(h1Glow, { opacity: 0.8, duration: 1.2, ease: 'power2.out' }, 0.8);

    if (h1Glow) {
      gsap.to(h1Glow, {
        '--glow-x': 90,
        '--glow-y': 100,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // ── Globe Particles ───────────────────────────────────
    (function () {
      const canvas = el.querySelector('.home-hero_anim-canvas');
      if (!canvas) return;

      const isMobile = window.innerWidth < 992;
      const DPR      = Math.min(window.devicePixelRatio, 2);
      const COUNT    = isMobile ? 25920 : 45360;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(DPR);
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      renderer.domElement.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
      canvas.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      let W = canvas.offsetWidth;
      let H = canvas.offsetHeight;

      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 10);
      camera.position.z = 1;

      // 5 ellipses du SVG symmetrical_globe.svg (viewBox 512×512, centre 256,256)
      const ELLIPSES = [
        { rx: 190, ry: 190 },
        { rx: 190, ry:  70 },
        { rx: 190, ry: 125 },
        { rx:  70, ry: 190 },
        { rx: 125, ry: 190 },
      ];
      // Cercle extérieur (rx=190, diameter=380) limité à 90% de H, min 1200px de hauteur
      const globeScale = Math.max(Math.min(W * 0.85, H * 0.90) / 380, 800 / 380);
      const perEllipse = Math.floor(COUNT / ELLIPSES.length);

      const startPos = new Float32Array(COUNT * 3);
      const shapePos        = new Float32Array(COUNT * 3);
      const aPhases         = new Float32Array(COUNT);
      const aSpeeds         = new Float32Array(COUNT);
      const aAmpX           = new Float32Array(COUNT);
      const aAmpY           = new Float32Array(COUNT);
      const aSizes          = new Float32Array(COUNT);
      const aColors         = new Float32Array(COUNT * 3);
      const aHidden         = new Float32Array(COUNT);
      const aOrbitRx        = new Float32Array(COUNT);
      const aOrbitRy        = new Float32Array(COUNT);
      const aOrbitAngle     = new Float32Array(COUNT);
      const aOrbitDir       = new Float32Array(COUNT);
      const shapeEllipseIdx = new Int32Array(COUNT);
      const shapeAngles     = new Float32Array(COUNT);
      const ORBIT_DIRS      = [-1, 1, -1, 1, -1];

      const PALETTE = [
        new THREE.Color('#CEAA7E'),
        new THREE.Color('#D4A96A'),
        new THREE.Color('#F3C48E'),
        new THREE.Color('#F1BF85'),
      ];

      for (let i = 0; i < COUNT; i++) {
        // Position de départ : étoiles dispersées sur tout le canvas
        const sAngle = Math.random() * Math.PI * 2;
        const sR     = Math.sqrt(Math.random()) * Math.min(W, H) * 0.55;
        startPos[i * 3]     = Math.cos(sAngle) * sR;
        startPos[i * 3 + 1] = Math.sin(sAngle) * sR;
        startPos[i * 3 + 2] = 0;

        // Destination : point sur l'une des 5 ellipses du globe
        const eIdx   = Math.min(Math.floor(i / perEllipse), ELLIPSES.length - 1);
        const e      = ELLIPSES[eIdx];
        const localI = i - eIdx * perEllipse;
        const t      = (localI / perEllipse) * Math.PI * 2;
        const svgX   = 256 + e.rx * Math.cos(t);
        const svgY   = 256 + e.ry * Math.sin(t);
        shapePos[i * 3]     = (svgX - 256) * globeScale;
        shapePos[i * 3 + 1] = -(svgY - 256) * globeScale;
        shapePos[i * 3 + 2] = 0;
        shapeEllipseIdx[i]  = eIdx;
        shapeAngles[i]      = t;

        aPhases[i] = Math.random() * Math.PI * 2;
        aSpeeds[i] = Math.random() * 0.3 + 0.06;
        aAmpX[i]   = (Math.random() * 0.5 + 0.5) * 30;
        aAmpY[i]   = (Math.random() * 0.5 + 0.5) * 30;
        aSizes[i]  = (Math.random() * 1.2 + 0.8) * DPR;
        aHidden[i] = Math.random() < 0.7 ? 1.0 : 0.0;
        const c    = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        aColors[i * 3] = c.r; aColors[i * 3 + 1] = c.g; aColors[i * 3 + 2] = c.b;
      }

      // Appairage angulaire : chaque particule va au point de forme à l'angle le plus proche
      const sortedStart = Array.from({ length: COUNT }, (_, i) => i)
        .sort((a, b) => Math.atan2(startPos[a*3+1], startPos[a*3]) - Math.atan2(startPos[b*3+1], startPos[b*3]));
      const sortedShape = Array.from({ length: COUNT }, (_, i) => i)
        .sort((a, b) => Math.atan2(shapePos[a*3+1], shapePos[a*3]) - Math.atan2(shapePos[b*3+1], shapePos[b*3]));

      const remappedShape = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const di   = sortedStart[i];
        const si   = sortedShape[i];
        remappedShape[di * 3]     = shapePos[si * 3];
        remappedShape[di * 3 + 1] = shapePos[si * 3 + 1];
        remappedShape[di * 3 + 2] = 0;
        const eIdx      = shapeEllipseIdx[si];
        const e         = ELLIPSES[eIdx];
        aOrbitRx[di]    = e.rx * globeScale;
        aOrbitRy[di]    = e.ry * globeScale;
        aOrbitAngle[di] = shapeAngles[si];
        aOrbitDir[di]   = ORBIT_DIRS[eIdx];
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(startPos, 3));
      geometry.setAttribute('aShape',   new THREE.BufferAttribute(remappedShape, 3));
      geometry.setAttribute('aPhase',   new THREE.BufferAttribute(aPhases,  1));
      geometry.setAttribute('aSpeed',   new THREE.BufferAttribute(aSpeeds,  1));
      geometry.setAttribute('aAmpX',    new THREE.BufferAttribute(aAmpX,    1));
      geometry.setAttribute('aAmpY',    new THREE.BufferAttribute(aAmpY,    1));
      geometry.setAttribute('aSize',    new THREE.BufferAttribute(aSizes,   1));
      geometry.setAttribute('aColor',      new THREE.BufferAttribute(aColors,     3));
      geometry.setAttribute('aHidden',     new THREE.BufferAttribute(aHidden,     1));
      geometry.setAttribute('aOrbitRx',    new THREE.BufferAttribute(aOrbitRx,    1));
      geometry.setAttribute('aOrbitRy',    new THREE.BufferAttribute(aOrbitRy,    1));
      geometry.setAttribute('aOrbitAngle', new THREE.BufferAttribute(aOrbitAngle, 1));
      geometry.setAttribute('aOrbitDir',   new THREE.BufferAttribute(aOrbitDir,   1));

      const vertexShader = /* glsl */ `
        attribute vec3  aShape;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aAmpX;
        attribute float aAmpY;
        attribute float aSize;
        attribute vec3  aColor;
        attribute float aHidden;
        attribute float aOrbitRx;
        attribute float aOrbitRy;
        attribute float aOrbitAngle;
        attribute float aOrbitDir;

        uniform float uTime;
        uniform float uGatherStart;
        uniform float uOpacity;
        uniform float uGather;
        uniform float uSettle;
        uniform float uPulse;
        uniform vec2  uMouse;
        uniform float uMouseActivity;
        uniform vec3  uTargetColor;

        varying vec3  vColor;
        varying float vAlpha;

        void main() {
          float drag   = 2.5 + (1.0 - aSpeed * 1.8) * 3.5;
          float tEased = 1.0 - pow(1.0 - uGather, drag);

          // Rotation du nuage de départ
          float rotSpeed = 0.06 + aSpeed * 0.02;
          float rotAngle = uTime * rotSpeed;
          float cosR = cos(rotAngle);
          float sinR = sin(rotAngle);
          vec3 rotatedStart = vec3(
            position.x * cosR - position.y * sinR,
            position.x * sinR + position.y * cosR,
            0.0
          );

          // Destination = position orbitale — temps relatif au démarrage du gather
          float orbitSpeed = 0.02 + aSpeed * 0.01;
          float orbitT     = aOrbitAngle + aOrbitDir * (uTime - uGatherStart) * orbitSpeed;
          float spreadPx = sin(aPhase * 5.3) * 3.5;
          vec3  orbitPos = vec3(
            (aOrbitRx + spreadPx) * cos(orbitT),
           -(aOrbitRy + spreadPx) * sin(orbitT),
            0.0
          );

          // Effet loupe : épaississement radial de l'anneau au passage de la souris
          float distToMouse = distance(orbitPos.xy, uMouse);
          float proximity   = 1.0 - smoothstep(20.0, 160.0, distToMouse);
          // Direction radiale depuis le centre de l'ellipse = direction d'épaississement
          vec2  radialDir   = length(orbitPos.xy) > 0.001 ? normalize(orbitPos.xy) : vec2(cos(aPhase), sin(aPhase));
          // Dispersion per-particule dans les deux sens (intérieur + extérieur)
          float thickness   = proximity * sin(aPhase * 4.7) * 55.0 * uMouseActivity;
          orbitPos.xy      += radialDir * thickness;

          vec3 pos = mix(rotatedStart, orbitPos, tEased);

          // Battement de coeur : impulsion radiale + turbulence per-particule
          float pulseLen  = length(rotatedStart.xy);
          vec2  pulseDir  = pulseLen > 0.001 ? normalize(rotatedStart.xy) : vec2(0.0);
          float pulseMod  = 0.4 + sin(aPhase * 3.7) * 0.6;
          float pulseForce = uPulse * pulseMod * (1.0 - tEased);
          pos.x += pulseDir.x * pulseLen * 1.6 * pulseForce;
          pos.y += pulseDir.y * pulseLen * 1.6 * pulseForce;
          pos.x += cos(aPhase * 7.3 + 1.2) * pulseLen * 0.35 * pulseForce;
          pos.y += sin(aPhase * 5.1 + 0.8) * pulseLen * 0.35 * pulseForce;

          // Mouvement étoile avant convergence
          float floatAmt = 1.0 - tEased * 0.85;
          pos.x += sin(uTime * aSpeed * 0.4 + aPhase)       * aAmpX * floatAmt * uSettle;
          pos.y += cos(uTime * aSpeed * 0.3 + aPhase * 1.2) * aAmpY * floatAmt * uSettle;

          float revealT = clamp((tEased - 0.90) / 0.10, 0.0, 1.0);
          float particleOpacity = mix(1.0, revealT, aHidden);
          vAlpha = uOpacity * particleOpacity;
          vColor = mix(aColor, uTargetColor, tEased * 0.7);

          gl_Position  = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = max(aSize, 1.5);
        }
      `;

      const fragmentShader = /* glsl */ `
        varying vec3  vColor;
        varying float vAlpha;

        void main() {
          vec2  uv = gl_PointCoord - 0.5;
          float d  = length(uv);
          float a  = 1.0 - smoothstep(0.38, 0.5, d);
          gl_FragColor = vec4(vColor, a * vAlpha);
        }
      `;

      const uniforms = {
        uTime:          { value: 0 },
        uGatherStart:   { value: 0 },
        uOpacity:       { value: 0 },
        uGather:        { value: 0 },
        uSettle:        { value: 0 },
        uPulse:         { value: 0 },
        uMouse:         { value: new THREE.Vector2(99999, 99999) },
        uMouseActivity: { value: 0 },
        uTargetColor:   { value: new THREE.Color('#F5D4A0') },
      };

      scene.add(new THREE.Points(geometry, new THREE.ShaderMaterial({
        vertexShader, fragmentShader, uniforms,
        transparent: true, depthWrite: false,
      })));

      const targetMouse = new THREE.Vector2(99999, 99999);

      gsap.ticker.add(function () {
        uniforms.uTime.value = gsap.ticker.time;
        // uMouse suit la souris avec un léger lag — retour progressif quand elle s'éloigne
        uniforms.uMouse.value.lerp(targetMouse, 0.07);
        renderer.render(scene, camera);
      });

      el.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetMouse.set(
           e.clientX - rect.left - rect.width  / 2,
          -(e.clientY - rect.top  - rect.height / 2)
        );
        gsap.killTweensOf(uniforms.uMouseActivity);
        gsap.to(uniforms.uMouseActivity, { value: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
        gsap.to(uniforms.uMouseActivity, { value: 0, duration: 1.4, ease: 'power2.out', delay: 0 });
      });
      el.addEventListener('mouseenter', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx =  e.clientX - rect.left - rect.width  / 2;
        const my = -(e.clientY - rect.top  - rect.height / 2);
        targetMouse.set(mx, my);
        uniforms.uMouse.value.set(mx, my);
      });
      el.addEventListener('mouseleave', () => {
        targetMouse.set(99999, 99999);
        gsap.to(uniforms.uMouseActivity, { value: 0, duration: 1.2, ease: 'power2.out', overwrite: true });
      });

      window.addEventListener('resize', () => {
        W = canvas.offsetWidth; H = canvas.offsetHeight;
        camera.left = -W / 2; camera.right  =  W / 2;
        camera.top  =  H / 2; camera.bottom = -H / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      }, { passive: true });

      // Phase 1 (t=1.2s) : étoiles apparaissent après le hero entrance
      // Phase 2 (t=3.0s) : convergence vers le globe
      const globeGradient = el.querySelector('.home-hero_anim-globe-gradient');
      if (globeGradient) gsap.set(globeGradient, { opacity: 0 });

      const ptl = gsap.timeline();
      ptl.to(uniforms.uOpacity, { value: 1,   duration: 1.0, ease: 'power2.out' })
         .to(uniforms.uSettle,  { value: 1,   duration: 1.0, ease: 'power2.out' }, 0)
         .to(uniforms.uPulse,   { value: 1.0, duration: 0.55, ease: 'sine.out' }, 1.3)
         .to(uniforms.uPulse,   { value: 0,   duration: 2.5,  ease: 'sine.in'    })
         .call(() => { uniforms.uGatherStart.value = gsap.ticker.time; }, null, 1.3)
         .to(uniforms.uGather,  { value: 1, duration: 5.0, ease: 'power3.out' }, 1.3)
         .to(globeGradient,     { opacity: 1, duration: 1.0, ease: 'power2.out' }, 1.3);
    })();

  });


});
