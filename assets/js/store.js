/* Store section: featured carousel + horizontal rows. Plain script; no dependencies beyond site.js (optional). */
(function () {
  var ROWS = [
    { key: 'browser', heading: 'Play in browser' },
    { key: 'download', heading: 'Download' },
    { key: 'app', heading: 'Apps' }
  ];
  var MAX_SLIDES = 5;
  var INTERVAL = 6000;
  var DRAG_THRESHOLD = 40;

  function reduced() {
    return !!(window.LNL && window.LNL.onReducedMotion && window.LNL.onReducedMotion());
  }

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }

  function src(file) { return encodeURI(file); }

  function isExternal(url) { return /^https?:/i.test(url); }

  function initial(t) { return (t.name || '?').trim().charAt(0).toUpperCase(); }

  function fallbackArt(t, cls) {
    var d = el('div', 'art-fallback ' + (cls || ''), { 'aria-hidden': 'true' });
    d.style.setProperty('--accent', t.accent);
    var s = el('span');
    s.textContent = initial(t);
    d.appendChild(s);
    return d;
  }

  // Image with explicit size, lazy loading, alt = title name; falls back to accent art on error.
  function art(t, file, w, h, cls, eager) {
    var img = el('img', cls, { alt: t.name, width: w, height: h, decoding: 'async' });
    if (!eager) img.loading = 'lazy';
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.replaceChild(fallbackArt(t, cls), img);
    });
    img.src = src(file);
    return img;
  }

  function badges(t) {
    if (Array.isArray(t.platforms) && t.platforms.length) return t.platforms.slice();
    // Fallback heuristic for titles without explicit platforms.
    var list = [];
    if (t.row === 'browser') list.push('Browser');
    if (t.kind === 'app') list.push('App');
    var sec = t.secondary || [];
    var all = [t.primary].concat(sec);
    var txt = all.map(function (c) { return ((c && c.label) || '') + ' ' + ((c && c.url) || ''); }).join(' ');
    if (/windows|microsoft/i.test(txt)) list.push('Windows');
    if (!list.length) list.push(t.row === 'download' ? 'Download' : 'Game');
    return list;
  }

  function badgeEls(t) {
    var wrap = el('span', 'badges');
    badges(t).forEach(function (b) {
      var s = el('span', 'badge');
      s.textContent = b;
      wrap.appendChild(s);
    });
    return wrap;
  }

  // Primary CTA; primary.live === false (store page not published yet) renders a disabled button.
  function primaryCta(t) {
    var p = t.primary;
    if (p.live === false) {
      var s = el('span', 'btn btn-primary is-disabled', { 'aria-disabled': 'true' });
      s.textContent = p.soonLabel || 'Coming soon';
      return s;
    }
    var a = el('a', 'btn btn-primary', { href: p.url });
    a.textContent = p.label;
    if (isExternal(p.url)) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  function pickFeatured(titles) {
    var withCover = titles.filter(function (t) { return t.cover; });
    var rest = titles.filter(function (t) { return !t.cover; });
    return withCover.concat(rest).slice(0, MAX_SLIDES);
  }

  function hasTitles(titles) { return Array.isArray(titles) && titles.length > 0; }

  /* ---------- Featured carousel ---------- */
  function renderFeatured(titles) {
    var host = document.getElementById('featured');
    if (!host || !hasTitles(titles)) return;
    host.textContent = '';
    var slidesData = pickFeatured(titles);

    var h2 = el('h2', 'store-heading', { id: 'featured-heading' });
    h2.textContent = 'Featured';
    host.setAttribute('aria-labelledby', 'featured-heading');

    var fc = el('div', 'fc', { role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Featured games', tabindex: '0' });
    var viewport = el('div', 'fc-viewport');
    var track = el('div', 'fc-track', { 'aria-live': 'off' });
    var slides = [];

    slidesData.forEach(function (t, i) {
      var s = el('article', 'fc-slide', { role: 'group', 'aria-roledescription': 'slide', 'aria-label': (i + 1) + ' of ' + slidesData.length });
      s.style.setProperty('--accent', t.accent);
      var media = el('div', 'fc-media');
      var file = t.cover || (t.shots && t.shots[0]) || t.icon;
      if (file) media.appendChild(art(t, file, 960, 540, 'fc-img', i === 0));
      else media.appendChild(fallbackArt(t, 'fc-img'));
      s.appendChild(media);
      s.appendChild(el('div', 'fc-glow'));

      var body = el('div', 'fc-body');
      body.appendChild(badgeEls(t));
      var h3 = el('h3', 'fc-title');
      h3.textContent = t.name;
      body.appendChild(h3);
      var p = el('p', 'fc-tag');
      p.textContent = t.tagline;
      body.appendChild(p);
      var cta = el('div', 'fc-cta');
      var play = primaryCta(t);
      var more = el('a', 'btn', { href: t.slug + '.html' });
      more.textContent = 'Details';
      more.setAttribute('aria-label', 'Details: ' + t.name);
      cta.appendChild(play);
      cta.appendChild(more);
      body.appendChild(cta);
      s.appendChild(body);
      track.appendChild(s);
      slides.push(s);
    });

    viewport.appendChild(track);
    fc.appendChild(viewport);

    var prev = el('button', 'fc-nav fc-prev', { type: 'button', 'aria-label': 'Previous' });
    var next = el('button', 'fc-nav fc-next', { type: 'button', 'aria-label': 'Next' });
    prev.innerHTML = '<span aria-hidden="true"></span>';
    next.innerHTML = '<span aria-hidden="true"></span>';
    var dotsWrap = el('div', 'fc-dots');
    var dots = slidesData.map(function (t, i) {
      var d = el('button', 'fc-dot', { type: 'button', 'aria-label': 'Go to slide ' + (i + 1) });
      d.appendChild(el('span'));
      d.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(d);
      return d;
    });
    if (slidesData.length > 1) { fc.appendChild(prev); fc.appendChild(next); }

    host.appendChild(h2);
    host.appendChild(fc);
    if (slidesData.length > 1) host.appendChild(dotsWrap);

    var index = 0, dragX = 0, dragging = false, startX = 0, startY = 0, pid = null, moved = false, axis = null;
    var timer = null;
    var pause = { hover: false, focus: false, touch: false, hidden: document.hidden, offscreen: false };

    function paint() {
      track.style.transform = 'translate3d(calc(' + (-index * 100) + '% + ' + dragX + 'px),0,0)';
    }
    function render() {
      slides.forEach(function (s, i) {
        var on = i === index;
        s.classList.toggle('is-active', on);
        if (on) { s.removeAttribute('inert'); s.removeAttribute('aria-hidden'); }
        else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
      });
      dots.forEach(function (d, i) {
        if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      fc.style.setProperty('--accent', slidesData[index].accent);
      paint();
    }
    function go(i) {
      index = (i + slides.length) % slides.length;
      render();
      schedule();
    }

    function paused() {
      for (var k in pause) if (pause[k]) return true;
      return dragging;
    }
    function schedule() {
      clearTimeout(timer);
      if (reduced() || slides.length < 2 || paused()) return;
      timer = setTimeout(function () { go(index + 1); }, INTERVAL);
    }
    function setPause(k, v) { pause[k] = v; schedule(); }

    fc.addEventListener('mouseenter', function () { setPause('hover', true); });
    fc.addEventListener('mouseleave', function () { setPause('hover', false); });
    fc.addEventListener('focusin', function () { setPause('focus', true); });
    fc.addEventListener('focusout', function () { setPause('focus', false); });
    document.addEventListener('visibilitychange', function () { setPause('hidden', document.hidden); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        setPause('offscreen', !es[es.length - 1].isIntersecting);
      }, { threshold: 0.25 }).observe(fc);
    }
    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });
    fc.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { go(index + 1); e.preventDefault(); }
    });

    // Pointer drag (mouse + touch). Vertical intent is released to the browser (touch-action: pan-y).
    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = false; axis = null; pid = e.pointerId;
      startX = e.clientX; startY = e.clientY; dragX = 0;
      if (e.pointerType !== 'mouse') pause.touch = true;
      clearTimeout(timer);
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pid) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      if (axis !== 'x') return;
      if (!moved) {
        moved = true;
        try { viewport.setPointerCapture(pid); } catch (err) { /* ignore */ }
        track.classList.add('is-dragging');
      }
      dragX = dx;
      paint();
    });
    function end(e) {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false;
      pause.touch = false;
      track.classList.remove('is-dragging');
      var dx = dragX;
      dragX = 0;
      if (moved && Math.abs(dx) > DRAG_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
      else { paint(); schedule(); }
    }
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
    // A drag must not activate the link under the pointer.
    viewport.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    render();
    schedule();
  }

  /* ---------- Rows ---------- */
  function tile(t) {
    var a = el('a', 'tile store-tile', { href: t.slug + '.html', 'aria-label': t.name });
    a.style.setProperty('--accent', t.accent);
    var artBox = el('div', 'tile-art');
    var file = t.cover || t.icon;
    if (file) artBox.appendChild(art(t, file, 560, 420, 'tile-img'));
    else artBox.appendChild(fallbackArt(t, 'tile-img'));
    var media = el('div', 'tile-media');
    media.appendChild(artBox);
    if (t.cover && t.icon) {
      var chip = el('span', 'tile-chip');
      chip.appendChild(art(t, t.icon, 64, 64, 'tile-chip-img'));
      media.appendChild(chip);
    }
    a.appendChild(media);
    var body = el('div', 'tile-body');
    var h3 = el('h3');
    h3.textContent = t.name;
    body.appendChild(h3);
    body.appendChild(badgeEls(t));
    a.appendChild(body);
    if (window.LNL && window.LNL.enableTilt) window.LNL.enableTilt(a);
    return a;
  }

  function renderRows(titles) {
    var host = document.getElementById('rows');
    if (!host || !hasTitles(titles)) return;
    host.textContent = '';
    ROWS.forEach(function (r) {
      var items = titles.filter(function (t) { return t.row === r.key; });
      if (!items.length) return;
      var group = el('div', 'store-row');
      var h2 = el('h2', 'store-heading', { id: 'row-' + r.key });
      h2.textContent = r.heading;
      var list = el('div', 'row', { role: 'group', 'aria-labelledby': 'row-' + r.key });
      items.forEach(function (t) { list.appendChild(tile(t)); });
      group.appendChild(h2);
      group.appendChild(list);
      host.appendChild(group);
    });
  }

  window.LNL_STORE = {
    renderFeatured: renderFeatured, renderRows: renderRows,
    tile: tile, badges: badges, badgeEls: badgeEls, art: art, fallbackArt: fallbackArt, primaryCta: primaryCta
  };

  function init() {
    var titles = window.LNL_TITLES;
    if (!hasTitles(titles)) return;
    renderFeatured(titles);
    renderRows(titles);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
