/* Story section: sets #story[data-chapter] from the chapter nearest the viewport middle. */
(function () {
  var story = document.getElementById('story');
  if (!story || !('IntersectionObserver' in window)) return;
  if (window.LNL && window.LNL.onReducedMotion()) return; // static full orbit, chapters stack
  var chapters = story.querySelectorAll('.chapter');
  story.classList.add('js-story');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) story.setAttribute('data-chapter', e.target.getAttribute('data-index'));
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  Array.prototype.forEach.call(chapters, function (c) { io.observe(c); });
})();
