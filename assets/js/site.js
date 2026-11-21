/* LaterNightLab shared helpers. Plain script; exposes window.LNL. */
(function () {
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function getTitle(slug) {
    var list = window.LNL_TITLES || [];
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return undefined;
  }

  function onReducedMotion() {
    return !!(reduceQuery && reduceQuery.matches);
  }

  // Tilt via Pointer Events -> --rx/--ry. No-op under reduced motion or on touch-only devices.
  function enableTilt(el) {
    if (!el || onReducedMotion()) return;
    var touchOnly = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (touchOnly) return; // gyro tilt intentionally not implemented
    var max = 8;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (px * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-py * max * 2).toFixed(2) + 'deg');
    });
    function reset() {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }
    el.addEventListener('pointerleave', reset);
    el.addEventListener('pointercancel', reset);
  }

  window.LNL = { getTitle: getTitle, onReducedMotion: onReducedMotion, enableTilt: enableTilt };
})();
