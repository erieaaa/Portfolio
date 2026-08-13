/*
=================================================================
  ERIKA MAE GUIDO — Portfolio scripts
  No external libraries.
=================================================================
*/
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Mobile menu ---------- */
  var burger = $('#burger');
  var menu = $('#menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. Scroll: progress, nav state, active link, to-top ---------- */
  var progress = $('#progress');
  var nav = $('#nav');
  var toTop = $('#toTop');
  var sections = $$('main section[id]');
  var navLinks = $$('#menu a');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.pageYOffset;

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    if (nav) nav.classList.toggle('stuck', y > 10);
    if (toTop) toTop.classList.toggle('on', y > 500);

    var current = '';
    for (var i = 0; i < sections.length; i++) {
      if (y >= sections[i].offsetTop - 160) current = sections[i].id;
    }
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 4. Reveal on scroll ---------- */
  var revealables = $$('.reveal').filter(function (el) { return !el.closest('.hero'); });
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target.parentElement;
        var siblings = group ? $$('.reveal', group) : [];
        var idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx > 0 ? Math.min(idx, 6) * 70 : 0) + 'ms';
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Media modal (video + image lightbox) ---------- */
  var modal = $('#modal');
  if (modal) {
    var frame = $('#modal-iframe');
    var img = $('#modal-img');
    var cap = $('#modal-cap');

    function openModal(kind) {
      modal.classList.remove('video', 'image');
      modal.classList.add('on', kind);
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('on', 'video', 'image', 'vertical');
      frame.setAttribute('src', '');
      img.setAttribute('src', '');
      cap.textContent = '';
      document.body.style.overflow = '';
    }

    $$('.video-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        frame.setAttribute('src', link.getAttribute('href'));
        var title = $('h4', link.closest('.work'));
        cap.textContent = title ? title.textContent : '';
        modal.classList.toggle('vertical', link.dataset.ratio === 'vertical');
        openModal('video');
      });
    });

    $$('.shot').forEach(function (shot) {
      shot.addEventListener('click', function (e) {
        e.preventDefault();
        img.setAttribute('src', shot.getAttribute('href'));
        img.setAttribute('alt', shot.dataset.caption || '');
        cap.textContent = shot.dataset.caption || '';
        openModal('image');
      });
    });

    $('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('modal-inner')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('on')) closeModal();
    });
  }

  /* ---------- 6. Cursor-follow mesh reveal ---------- */
  var aura = $('#aura');
  if (aura && !coarse) {
    var pending = false, px = 0, py = 0;
    window.addEventListener('mousemove', function (e) {
      px = e.clientX; py = e.clientY;
      if (!pending) {
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          aura.style.setProperty('--mx', px + 'px');
          aura.style.setProperty('--my', py + 'px');
        });
      }
    }, { passive: true });
  }

  /* ---------- 7. Floating dust canvas ---------- */
  var canvas = $('#dust');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, motes = [], live = true;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      var count = Math.min(70, Math.max(24, Math.round((w * h) / 26000)));
      motes = [];
      for (var i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.7,
          vy: -(0.08 + Math.random() * 0.28),
          vx: (Math.random() - 0.5) * 0.16,
          a: 0.15 + Math.random() * 0.45,
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    function frame() {
      if (!live) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y += m.vy; m.x += m.vx; m.tw += 0.02;
        if (m.y < -12) { m.y = h + 12; m.x = Math.random() * w; }
        if (m.x < -12) m.x = w + 12;
        if (m.x > w + 12) m.x = -12;
        var alpha = m.a * (0.65 + 0.35 * Math.sin(m.tw));
        ctx.fillStyle = 'rgba(201, 184, 255,' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { size(); seed(); }, 200);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { live = false; }
      else if (!reduce) { live = true; frame(); }
    });

    size(); seed();
    if (reduce) { live = false; } else { frame(); }
  }


  /* ---------- 8. Page-load sequence for the hero ---------- */
  var heroBits = $$('.hero .reveal');
  function runHero() {
    document.body.classList.add('go');
    heroBits.forEach(function (el, i) {
      el.style.transitionDelay = (reduce ? 0 : 120 + i * 95) + 'ms';
      el.classList.add('in');
    });
  }
  if (document.readyState === 'complete') runHero();
  else window.addEventListener('load', runHero);
  setTimeout(runHero, 1200); // safety net if a font or image stalls

  /* ---------- 9. Stat count-up ---------- */
  var counters = $$('.stats strong[data-count]');
  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      // leave the static values in place
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var target = parseInt(el.dataset.count, 10) || 0;
          var suffix = el.dataset.suffix || '';
          var dur = 1100, t0 = null;
          function tick(ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
          }
          el.textContent = '0';
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- 10. Toolkit chip cascade ---------- */
  var kitGroups = $$('.kit-group');
  if (kitGroups.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      kitGroups.forEach(function (g) { g.classList.add('in'); });
    } else {
      var kio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          kio.unobserve(entry.target);
        });
      }, { threshold: 0.15 });
      kitGroups.forEach(function (g) { kio.observe(g); });
    }
  }

  /* ---------- 11. Timeline progress line ---------- */
  var timeline = $('.timeline');
  var tlFill = $('.tl-fill');
  if (timeline && tlFill && !reduce) {
    var tlItems = $$('li', timeline);
    var tlPending = false;
    function tlUpdate() {
      tlPending = false;
      var rect = timeline.getBoundingClientRect();
      var mid = window.innerHeight * 0.55;
      var travelled = mid - rect.top;
      var pct = Math.max(0, Math.min(travelled / rect.height, 1));
      tlFill.style.height = (pct * 100) + '%';
      tlItems.forEach(function (li) {
        li.classList.toggle('lit', li.getBoundingClientRect().top < mid);
      });
    }
    window.addEventListener('scroll', function () {
      if (!tlPending) { tlPending = true; requestAnimationFrame(tlUpdate); }
    }, { passive: true });
    window.addEventListener('resize', tlUpdate);
    tlUpdate();
  }

  /* ---------- 12. Card spotlight ---------- */
  if (!coarse) {
    $$('.panel, .work').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--px', (e.clientX - r.left) + 'px');
        card.style.setProperty('--py', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- 13. Cursor ring ---------- */
  var ring = $('#ring');
  if (ring && !coarse && !reduce) {
    var rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    var tx = rx, ty = ry, shown = false;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; ring.classList.add('on'); }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      shown = false; ring.classList.remove('on');
    });

    (function follow() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(follow);
    })();

    var hotspots = 'a, button, .chip, .shot, .work-media, input, textarea';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(hotspots)) ring.classList.add('grow');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(hotspots)) ring.classList.remove('grow');
    });
  }

  /* ---------- 14. Magnetic buttons ---------- */
  if (!coarse && !reduce) {
    $$('.mag').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.22) + 'px,' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- 15. Hero portrait drift on scroll ---------- */
  var portrait = $('.portrait-img');
  if (portrait && !reduce) {
    var pPending = false;
    window.addEventListener('scroll', function () {
      if (pPending) return;
      pPending = true;
      requestAnimationFrame(function () {
        pPending = false;
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.4) {
          portrait.style.transform = 'translateY(' + (y * 0.07) + 'px)';
        }
      });
    }, { passive: true });
  }

})();
