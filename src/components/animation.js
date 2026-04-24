import { lenis } from './smoothScroll';

window.Webflow ||= [];
window.Webflow.push(() => {
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
      .to(h1Glow, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.8);

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

        if (counter) animateCounter(counter, 92, 1.2, 0.4);

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

              var baseW = 694;
              var baseH = 575;

              var cs = getComputedStyle(wrap);
              var padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);

              // Important: do NOT use wrap.clientHeight here.
              // The wrapper's height depends on the scale itself (CSS), which would
              // "lock" the scale at the smallest value seen. Width is the stable input.
              var availW = Math.max(0, (wrap.clientWidth || baseW) - padX);

              var scale = availW / baseW;
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
});
