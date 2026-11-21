/* Title page renderer: renderTitle(slug) fills <main id="title-root"> from window.LNL_TITLES.
   Plain script. Uses LNL (site.js) and LNL_STORE (store.js: art, fallbackArt, primaryCta, badges, tile); store.js must load first.
   DOM is built with textContent/setAttribute only. Animations touch transform/opacity only. */
(function () {
  var CYCLE_MS = 3800;
  var FRAMES = {
    phone: 'assets/svg/frame-phone.svg',
    desktop: 'assets/svg/frame-desktop.svg'
  };

  function el(tag, cls, attrs, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function src(file) { return encodeURI(file); }
  function isExternal(url) { return /^https?:/i.test(url); }
  function isDownload(url) { return /\.(exe|zip|msi|apk)(\?|$)/i.test(url); }
  function reduced() { return !!(window.LNL && window.LNL.onReducedMotion && window.LNL.onReducedMotion()); }
  function initial(t) { return (t.name || '?').trim().charAt(0).toUpperCase(); }
  function list(x) { return Array.isArray(x) ? x : []; }

  function findTitle(slug) {
    if (window.LNL && window.LNL.getTitle) return window.LNL.getTitle(slug);
    return list(window.LNL_TITLES).filter(function (t) { return t.slug === slug; })[0];
  }

  var STORE = window.LNL_STORE || {};
  var fallbackArt = STORE.fallbackArt;
  function img(t, file, alt, w, h, cls, eager) {
    var i = STORE.art(t, file, w, h, cls, eager);
    i.alt = alt;
    return i;
  }

  function link(c, cls) {
    var a = el('a', cls, { href: c.url }, c.label);
    if (isExternal(c.url) && !isDownload(c.url)) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  var primaryCta = STORE.primaryCta;

  function ctaGroup(t, withSecondary) {
    var wrap = el('div', 't-cta');
    wrap.appendChild(primaryCta(t));
    if (withSecondary) list(t.secondary).forEach(function (c) { wrap.appendChild(link(c, 'btn')); });
    return wrap;
  }

  var cleanups = [];
  var lightboxEl = null;
  function runCleanups() {
    cleanups.forEach(function (fn) { try { fn(); } catch (err) { /* ignore */ } });
    cleanups = [];
    if (lightboxEl && lightboxEl.parentNode) lightboxEl.parentNode.removeChild(lightboxEl);
    lightboxEl = null;
  }

  function platformBadges(t) {
    return STORE.badgeEls(t, true);
  }

  function deviceOf(t) {
    if (t.device === 'phone' || t.device === 'desktop') return t.device;
    return t.kind === 'app' ? 'phone' : 'desktop';
  }

  /* ---------- Hero device with cycling screenshots ---------- */
  function buildStage(t) {
    var kind = deviceOf(t);
    var shots = list(t.shots);
    var stage = el('div', 't-stage t-stage--' + kind);
    stage.appendChild(el('div', 't-orbit', { 'aria-hidden': 'true' }));
    var device = el('div', 'device device--' + kind);
    device.appendChild(el('div', 'device-glow', { 'aria-hidden': 'true' }));
    var screen = el('div', 'device-screen');
    device.appendChild(screen);
    device.appendChild(el('img', 'device-frame', { src: FRAMES[kind], alt: '', 'aria-hidden': 'true', width: kind === 'phone' ? 300 : 640, height: kind === 'phone' ? 620 : 372 }));
    if (t.icon) {
      var chip = el('span', 'device-chip', { 'aria-hidden': 'true' });
      chip.appendChild(img(t, t.icon, '', 64, 64, 'device-chip-img', true));
      device.appendChild(chip);
    }
    stage.appendChild(device);

    if (!shots.length) {
      var soon = el('div', 'device-soon art-fallback');
      soon.appendChild(el('span', null, { 'aria-hidden': 'true' }, initial(t)));
      soon.appendChild(el('p', null, null, 'Coming soon'));
      screen.appendChild(soon);
      if (window.LNL && window.LNL.enableTilt) window.LNL.enableTilt(stage);
      return stage;
    }

    var slides = shots.map(function (file, i) {
      var s = el('figure', 'shot' + (i === 0 ? ' is-active' : ''));
      s.appendChild(img(t, file, t.name + ' screenshot ' + (i + 1), kind === 'phone' ? 268 : 512, kind === 'phone' ? 588 : 288, 'shot-img', i === 0));
      if (i !== 0) s.setAttribute('aria-hidden', 'true');
      screen.appendChild(s);
      return s;
    });

    var index = 0, timer = null;
    var pause = { hover: false, focus: false, hidden: document.hidden, offscreen: false };
    var dots = el('div', 't-dots', { role: 'group', 'aria-label': 'Screenshots' });
    var dotEls = shots.map(function (f, i) {
      var d = el('button', 't-dot', { type: 'button', 'aria-label': 'Show screenshot ' + (i + 1) + ' of ' + shots.length });
      d.appendChild(el('span'));
      d.addEventListener('click', function () { go(i); });
      dots.appendChild(d);
      return d;
    });

    function go(i) {
      var prev = index;
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === index);
        s.classList.toggle('is-prev', k === prev && k !== index);
        if (k === index) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      dotEls.forEach(function (d, k) {
        if (k === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      schedule();
    }
    function paused() { for (var k in pause) if (pause[k]) return true; return false; }
    function schedule() {
      clearTimeout(timer);
      if (reduced() || slides.length < 2 || paused()) return;
      timer = setTimeout(function () { go(index + 1); }, CYCLE_MS);
    }
    function setPause(k, v) { pause[k] = v; schedule(); }

    stage.addEventListener('mouseenter', function () { setPause('hover', true); });
    stage.addEventListener('mouseleave', function () { setPause('hover', false); });
    dots.addEventListener('focusin', function (e) {
      var f = true;
      try { f = !e.target.matches || e.target.matches(':focus-visible'); } catch (err) { /* keep true */ }
      if (f) setPause('focus', true);
    });
    dots.addEventListener('focusout', function () { setPause('focus', false); });
    function onVis() { setPause('hidden', document.hidden); }
    document.addEventListener('visibilitychange', onVis);
    cleanups.push(function () { document.removeEventListener('visibilitychange', onVis); clearTimeout(timer); timer = null; pause.hidden = true; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        setPause('offscreen', !es[es.length - 1].isIntersecting);
      }, { threshold: 0.2 });
      io.observe(stage);
      cleanups.push(function () { io.disconnect(); });
    }
    if (slides.length > 1) stage.appendChild(dots);
    if (window.LNL && window.LNL.enableTilt) window.LNL.enableTilt(stage);
    go(0);
    return stage;
  }

  function buildHero(t) {
    var hero = el('section', 't-hero', { 'aria-labelledby': 't-name' });
    var copy = el('div', 't-hero-copy');
    var id = el('div', 't-id');
    var icon = el('span', 't-icon', { 'aria-hidden': 'true' });
    if (t.icon) icon.appendChild(img(t, t.icon, '', 72, 72, 't-icon-img', true));
    else icon.appendChild(fallbackArt(t, 't-icon-img'));
    id.appendChild(icon);
    var pb = platformBadges(t);
    if (pb) id.appendChild(pb);
    copy.appendChild(id);
    copy.appendChild(el('h1', 't-name', { id: 't-name' }, t.name));
    copy.appendChild(el('p', 't-tagline', null, t.tagline));
    copy.appendChild(ctaGroup(t, true));
    if (t.primary.live === false && t.primary.note) copy.appendChild(el('p', 't-cta-note', null, t.primary.note));
    if (list(t.tags).length) {
      var tags = el('ul', 't-tags', { 'aria-label': 'Tags' });
      t.tags.forEach(function (x) { tags.appendChild(el('li', null, null, x)); });
      copy.appendChild(tags);
    }
    hero.appendChild(copy);
    hero.appendChild(buildStage(t));
    return hero;
  }

  /* ---------- Content blocks ---------- */
  function block(heading, cls) {
    var s = el('section', 't-block' + (cls ? ' ' + cls : ''));
    if (heading) s.appendChild(el('h2', 't-h2', null, heading));
    return s;
  }
  function paras(parent, arr) { list(arr).forEach(function (p) { parent.appendChild(el('p', null, null, p)); }); }

  function buildStats(t) {
    var dl = el('dl', 't-stats');
    t.stats.forEach(function (s) {
      var d = el('div', 't-stat');
      d.appendChild(el('dt', null, null, s.label));
      d.appendChild(el('dd', null, null, s.value));
      dl.appendChild(d);
    });
    return dl;
  }

  function buildFeatures(f) {
    var s = block(f.heading);
    paras(s, f.text);
    if (list(f.items).length) {
      var grid = el('div', 't-features');
      f.items.forEach(function (it) {
        var a = el('article', 't-feature');
        if (it.title) a.appendChild(el('h3', null, null, it.title));
        a.appendChild(el('p', null, null, it.text));
        grid.appendChild(a);
      });
      s.appendChild(grid);
    }
    return s;
  }

  function buildControls(c) {
    var s = block('Controls');
    if (c.intro) s.appendChild(el('p', null, null, c.intro));
    var dl = el('dl', 't-controls');
    list(c.rows).forEach(function (r) {
      var row = el('div', 't-control');
      var dt = el('dt');
      dt.appendChild(el('kbd', null, null, r.keys));
      row.appendChild(dt);
      var dd = el('dd');
      dd.appendChild(el('strong', null, null, r.title));
      dd.appendChild(document.createTextNode(r.text ? ': ' + r.text : ''));
      row.appendChild(dd);
      dl.appendChild(row);
    });
    s.appendChild(dl);
    return s;
  }

  /* ---------- Gallery + lightbox ---------- */
  function buildGallery(t) {
    var files = list(t.shots).slice();
    if (t.cover && files.indexOf(t.cover) < 0) files.push(t.cover);
    if (!files.length) return null;
    var kind = deviceOf(t);
    var s = block('Gallery', 't-gallery-block');
    if (t.showcase) s.appendChild(el('p', null, null, t.showcase));
    var row = el('div', 'row t-gallery t-gallery--' + kind, { role: 'group', 'aria-label': t.name + ' gallery' });
    var box = lightbox(t, files);
    files.forEach(function (file, i) {
      var label = file === t.cover ? t.name + ' key art' : t.name + ' screenshot ' + (i + 1);
      var a = el('a', 't-shot', { href: src(file), 'aria-label': 'Open ' + label });
      a.appendChild(img(t, file, label, kind === 'phone' ? 240 : 520, kind === 'phone' ? 480 : 293, 't-shot-img'));
      if (box) a.addEventListener('click', function (e) { e.preventDefault(); box.open(i); });
      row.appendChild(a);
    });
    s.appendChild(row);
    return s;
  }

  function lightbox(t, files) {
    var dlg = el('dialog', 't-lightbox', { 'aria-label': t.name + ' gallery' });
    if (typeof dlg.showModal !== 'function') return null;
    var big = el('img', 't-lightbox-img', { alt: '' });
    var count = el('p', 't-lightbox-count');
    var close = el('button', 't-lb-btn t-lb-close', { type: 'button', 'aria-label': 'Close' }, '×');
    var prev = el('button', 't-lb-btn t-lb-prev', { type: 'button', 'aria-label': 'Previous image' }, '‹');
    var next = el('button', 't-lb-btn t-lb-next', { type: 'button', 'aria-label': 'Next image' }, '›');
    dlg.appendChild(big);
    dlg.appendChild(count);
    dlg.appendChild(close);
    if (files.length > 1) { dlg.appendChild(prev); dlg.appendChild(next); }
    var cur = 0;
    function show(i) {
      cur = (i + files.length) % files.length;
      big.src = src(files[cur]);
      big.alt = files[cur] === t.cover ? t.name + ' key art' : t.name + ' screenshot ' + (cur + 1);
      count.textContent = (cur + 1) + ' / ' + files.length;
    }
    close.addEventListener('click', function () { dlg.close(); });
    prev.addEventListener('click', function () { show(cur - 1); });
    next.addEventListener('click', function () { show(cur + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
    document.body.appendChild(dlg);
    lightboxEl = dlg;
    return { open: function (i) { show(i); dlg.showModal(); close.focus(); } };
  }

  function buildClosing(t) {
    var s = el('section', 't-closing');
    s.appendChild(el('h2', 't-h2', null, t.closing.heading));
    s.appendChild(el('p', null, null, t.closing.text));
    s.appendChild(ctaGroup(t, true));
    return s;
  }

  function buildNotes(t) {
    if (!list(t.notes).length && !list(t.checksums).length && !t.privacy) return null;
    var s = block('Good to know', 't-notes');
    if (list(t.notes).length) {
      var ul = el('ul', 't-note-list');
      t.notes.forEach(function (n) { ul.appendChild(el('li', null, null, n)); });
      s.appendChild(ul);
    }
    if (list(t.checksums).length) {
      var dl = el('dl', 't-checksums');
      t.checksums.forEach(function (c) {
        dl.appendChild(el('dt', null, null, c.label));
        var dd = el('dd');
        dd.appendChild(el('code', null, null, c.value));
        dl.appendChild(dd);
      });
      s.appendChild(dl);
    }
    if (t.privacy) {
      var p = el('p', 't-privacy');
      p.appendChild(el('a', null, { href: t.privacy.url }, t.privacy.label));
      s.appendChild(p);
    }
    return s;
  }

  function buildCredits(t) {
    var s = block('The Team', 't-credits');
    t.credits.forEach(function (c) {
      var a = el('article', 't-member');
      var head = el('div', 't-member-head');
      head.appendChild(el('h3', null, null, c.name));
      head.appendChild(el('span', 't-member-role', null, c.role));
      a.appendChild(head);
      a.appendChild(el('p', null, null, c.bio));
      if (c.quote) a.appendChild(el('blockquote', null, null, '“' + c.quote + '”'));
      s.appendChild(a);
    });
    return s;
  }

  /* ---------- More titles ---------- */
  function buildMore(exceptSlug) {
    var others = list(window.LNL_TITLES).filter(function (t) { return t.slug !== exceptSlug && !t.hidden; });
    if (!others.length) return null;
    var s = el('section', 'section t-more store-row', { 'aria-labelledby': 't-more-heading' });
    s.appendChild(el('h2', 'store-heading', { id: 't-more-heading' }, 'More titles'));
    var row = el('div', 'row', { role: 'group', 'aria-labelledby': 't-more-heading' });
    var make = STORE.tile;
    if (!make) return null;
    others.forEach(function (t) { row.appendChild(make(t)); });
    s.appendChild(row);
    return s;
  }

  function notFound(root, slug) {
    document.title = 'Title not found - Later Night Lab';
    document.documentElement.style.removeProperty('--accent');
    root.style.removeProperty('--accent');
    var s = el('section', 'section t-missing', { 'aria-labelledby': 't-missing-heading' });
    s.appendChild(el('h1', 't-name', { id: 't-missing-heading' }, 'Title not found'));
    s.appendChild(el('p', 't-tagline', null, slug
      ? 'There is no game or app called “' + slug + '” here. It may have moved or been renamed.'
      : 'This page does not say which game or app to show.'));
    var cta = el('div', 't-cta');
    cta.appendChild(el('a', 'btn btn-primary', { href: 'index.html' }, 'Back to all titles'));
    s.appendChild(cta);
    root.appendChild(s);
    var more = buildMore(null);
    if (more) root.appendChild(more);
  }

  function renderTitle(slug) {
    var root = document.getElementById('title-root');
    if (!root) {
      root = el('main', null, { id: 'title-root' });
      document.body.appendChild(root);
    }
    runCleanups();
    root.textContent = '';
    var t = slug ? findTitle(slug) : undefined;
    if (!t) { notFound(root, slug); return; }

    document.documentElement.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent', t.accent);
    root.appendChild(buildHero(t));

    var body = el('div', 'section t-body');
    if (list(t.stats).length) body.appendChild(buildStats(t));
    if (list(t.about).length) {
      var about = block(t.aboutHeading || 'About', 't-about');
      paras(about, t.about);
      body.appendChild(about);
    }
    list(t.features).forEach(function (f) { body.appendChild(buildFeatures(f)); });
    if (t.controls && list(t.controls.rows).length) body.appendChild(buildControls(t.controls));
    var gallery = buildGallery(t);
    if (gallery) body.appendChild(gallery);
    if (list(t.credits).length) body.appendChild(buildCredits(t));
    if (t.closing) body.appendChild(buildClosing(t));
    var notes = buildNotes(t);
    if (notes) body.appendChild(notes);
    root.appendChild(body);

    var more = buildMore(t.slug);
    if (more) root.appendChild(more);
  }

  window.LNL_TITLE = { renderTitle: renderTitle };
  window.renderTitle = renderTitle;

  function init() {
    var root = document.getElementById('title-root');
    if (root) renderTitle(root.getAttribute('data-slug'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
