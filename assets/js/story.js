/* Story section: sets #story[data-chapter] from the chapter nearest the viewport middle. */
(function () {
  var story = document.getElementById('story');
  if (!story || !('IntersectionObserver' in window)) return;
  var chapters = story.querySelectorAll('.chapter');
  var io = null;
  function start() {
    if (io) return;
    story.classList.add('js-story');
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) story.setAttribute('data-chapter', e.target.getAttribute('data-index'));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    Array.prototype.forEach.call(chapters, function (c) { io.observe(c); });
  }
  function stop() {
    if (io) { io.disconnect(); io = null; }
    story.classList.remove('js-story'); // static full orbit, chapters stack
  }
  function sync() { if (window.LNL && window.LNL.onReducedMotion()) stop(); else start(); }
  sync();
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync); }
})();
