/* Northwind Freight (placeholder): page interactions.
   Every feature is optional: if an element is missing, its block exits early. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Preloader: count 00 → 100, then fade ---------- */
  const preloader = $('.preloader');
  if (preloader) {
    const countEl = $('[data-preloader-count]', preloader);
    const done = () => preloader.classList.add('is-done');
    if (reduceMotion) {
      done();
    } else {
      const start = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        countEl.textContent = String(Math.round(p * 100)).padStart(2, '0');
        if (p < 1) requestAnimationFrame(tick);
        else setTimeout(done, 150);
      };
      requestAnimationFrame(tick);
    }
    // Safety net: never leave the page covered (e.g. throttled background tab).
    setTimeout(done, 3000);
  }

  /* ---------- Header: solid after scrolling, hides on scroll down ---------- */
  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const toggle = $('[data-nav-toggle]');
  let lastY = window.scrollY;

  const onScrollHeader = () => {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    const menuOpen = nav && nav.classList.contains('is-open');
    header.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 400);
    lastY = y;
  };

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.sr-only', toggle).textContent = open ? 'Close menu' : 'Open menu';
    document.body.classList.toggle('is-locked', open);
    if (open) $('a', nav)?.focus();
  };
  if (nav && toggle) {
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    // Close after following a link, on Escape, or when growing back to desktop width.
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Reveal on scroll + count-up stats ---------- */
  const countUp = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const start = performance.now();
    const duration = 1600;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const reveals = $$('.reveal');
  const counters = $$('[data-count-to]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.hasAttribute('data-count-to')) countUp(el);
        else el.classList.add('is-visible');
        io.unobserve(el); // animate once only
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
    counters.forEach((el) => io.observe(el));
  } else {
    // Old browsers: just show everything with final values.
    reveals.forEach((el) => el.classList.add('is-visible'));
    counters.forEach((el) => { el.textContent = el.dataset.countTo; });
  }

  /* ---------- Hero ticker: cycle through city names ---------- */
  const tickerCity = $('[data-ticker-city]');
  if (tickerCity && !reduceMotion) {
    const cities = ['Sydney', 'Auckland', 'Hong Kong', 'Shanghai', 'Ho Chi Minh City', 'Los Angeles', 'Bangkok', 'Hamburg', 'London'];
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      tickerCity.classList.add('is-swapping');
      setTimeout(() => {
        i = (i + 1) % cities.length;
        tickerCity.textContent = cities[i];
        tickerCity.classList.remove('is-swapping');
      }, 300);
    }, 2200);
  }

  /* ---------- Road scene: truck position + speed tied to scroll ---------- */
  const road = $('[data-road]');
  const truck = $('[data-truck]');
  const speedEl = $('[data-speed]');
  const wheels = $$('[data-wheel]');
  let prevProgress = 0;
  let speedDecay;

  const onScrollRoad = () => {
    if (!road || !truck || reduceMotion) return;
    const rect = road.getBoundingClientRect();
    const total = road.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);

    // Drive from off-screen left to off-screen right.
    const vw = window.innerWidth;
    const w = truck.getBoundingClientRect().width;
    const x = -w + progress * (vw + w);
    truck.style.transform = `translateX(${x}px)`;
    wheels.forEach((wheel) => { wheel.style.transform = `rotate(${progress * 2160}deg)`; });

    // "Speed" = how fast the user is scrolling through the scene, then eases back to 00.
    if (speedEl) {
      const kmh = Math.min(Math.round(Math.abs(progress - prevProgress) * 6000), 120);
      speedEl.textContent = String(kmh).padStart(2, '0');
      clearTimeout(speedDecay);
      speedDecay = setTimeout(() => { speedEl.textContent = '00'; }, 180);
    }
    prevProgress = progress;
  };

  /* ---------- One rAF-throttled scroll handler ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScrollHeader(); onScrollRoad(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Testimonials slider ---------- */
  const slider = $('[data-slider]');
  if (slider) {
    const track = $('[data-slider-track]', slider);
    const slides = $$('[data-slide]', slider);
    const status = $('[data-slider-status]', slider);
    let index = 0;
    let autoplay;

    const go = (n) => {
      index = (n + slides.length) % slides.length; // wrap both ways
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== index)));
      if (status) status.textContent = `${index + 1} / ${slides.length}`;
    };
    const restart = () => {
      clearInterval(autoplay);
      if (!reduceMotion) autoplay = setInterval(() => { if (!document.hidden) go(index + 1); }, 7000);
    };

    $('[data-slider-prev]', slider)?.addEventListener('click', () => { go(index - 1); restart(); });
    $('[data-slider-next]', slider)?.addEventListener('click', () => { go(index + 1); restart(); });
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { go(index - 1); restart(); }
      if (e.key === 'ArrowRight') { go(index + 1); restart(); }
    });
    // Pause while the user is reading or interacting.
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', () => clearInterval(autoplay));

    // Basic touch swipe.
    let touchX = null;
    slider.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      touchX = null;
    });

    go(0);
    restart();
  }

  /* ---------- FAQ: keep only one item open at a time ---------- */
  const accordion = $('[data-accordion]');
  if (accordion) {
    const items = $$('details', accordion);
    items.forEach((d) => d.addEventListener('toggle', () => {
      if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
    }));
  }

  /* ---------- Contact form: client-side validation only (no backend yet) ---------- */
  const form = $('[data-form]');
  if (form) {
    const statusEl = $('[data-form-status]', form);
    const setStatus = (msg, type) => {
      statusEl.textContent = msg;
      statusEl.className = `form__status ${type ? `is-${type}` : ''}`;
    };
    form.addEventListener('input', (e) => e.target.removeAttribute('aria-invalid'));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = $$('input, select, textarea', form).filter((f) => {
        const bad = !f.checkValidity() || (f.required && !f.value.trim());
        f.toggleAttribute('aria-invalid', bad);
        if (bad) f.setAttribute('aria-invalid', 'true');
        return bad;
      });
      if (invalid.length) {
        setStatus('Please complete the highlighted fields with valid details.', 'error');
        invalid[0].focus();
        return;
      }
      // TODO: send to your backend / form service here.
      setStatus('Thanks! This demo form isn’t connected yet, but your enquiry would be on its way.', 'success');
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
