/* Hero reactivity: sets --px/--py (-1..1) on #hero from pointer, touch drag and device orientation. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var reduced = window.LNL && window.LNL.onReducedMotion && window.LNL.onReducedMotion();
  if (reduced) return;

  var tx = 0, ty = 0, cx = 0, cy = 0;
  var visible = true, running = false, raf = 0, last = 0;

  function clamp(v) { return v < -1 ? -1 : v > 1 ? 1 : v; }

  function frame(t) {
    raf = 0;
    if (!visible) { running = false; return; }
    if (t - last < 14) { raf = requestAnimationFrame(frame); return; } // ~60 fps cap
    last = t;
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    if (Math.abs(tx - cx) < 0.001 && Math.abs(ty - cy) < 0.001) { cx = tx; cy = ty; running = false; }
    hero.style.setProperty('--px', cx.toFixed(4));
    hero.style.setProperty('--py', cy.toFixed(4));
    if (running) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (running || !visible) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function setTarget(x, y) { if (x !== x || y !== y) return; tx = clamp(x); ty = clamp(y); kick(); }

  // Pointer (mouse / pen only; touch is handled by the drag listeners below)
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    setTarget((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  // Touch drag
  function touchPos(e) {
    var t = e.touches && e.touches[0];
    if (t) setTarget((t.clientX / window.innerWidth) * 2 - 1, (t.clientY / window.innerHeight) * 2 - 1);
  }
  hero.addEventListener('touchstart', touchPos, { passive: true });
  hero.addEventListener('touchmove', touchPos, { passive: true });
  function easeHome() { setTarget(0, 0); }
  hero.addEventListener('touchend', easeHome, { passive: true });
  hero.addEventListener('touchcancel', easeHome, { passive: true });
  hero.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') easeHome(); }, { passive: true });

  // Device orientation
  var orientationOn = false;
  function onOrient(e) {
    if (e.gamma == null || e.beta == null) return;
    setTarget(e.gamma / 30, (e.beta - 45) / 25);
  }
  function listenOrientation() {
    if (orientationOn) return;
    orientationOn = true;
    window.addEventListener('deviceorientation', onOrient, { passive: true });
  }

  var btn = document.getElementById('motion-btn');
  if (typeof window.DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS: permission only from an explicit tap, and only on touch devices
      if (btn && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        btn.hidden = false;
        btn.addEventListener('click', function () {
          DeviceOrientationEvent.requestPermission().then(function (res) {
            if (res === 'granted') listenOrientation();
            btn.hidden = true;
          }, function () { btn.hidden = true; });
        });
      }
    } else {
      listenOrientation();
    }
  }

  // Pause when hero is off screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      hero.classList.toggle('hero-paused', !visible);
      if (visible) { if (cx !== tx || cy !== ty) kick(); }
      else if (raf) { cancelAnimationFrame(raf); raf = 0; running = false; }
    }).observe(hero);
  }
})();
