/* Test-6 · Editorial + corporate: page-specific behaviour.
   Fills the Status column of the CRA calendar and runs the
   running-head indicator that names the section you're reading. */
(function () {
  'use strict';

  // ---------- Cover headline: drop the rise-in clip once the words have landed ----------
  var title = document.querySelector('.cover-title');
  if (title) {
    var spans = title.querySelectorAll('.line > span');
    var last = spans[spans.length - 1];
    var reveal = function () { title.classList.add('revealed'); };
    if (!document.documentElement.classList.contains('anim')) reveal();
    else {
      title.addEventListener('animationend', function (e) { if (e.target === last) reveal(); });
      setTimeout(reveal, 2500); // fallback if the animation event never fires
    }
  }

  // ---------- Calendar status labels (site.js has already marked past / next) ----------
  Array.prototype.forEach.call(document.querySelectorAll('.dates tbody tr'), function (tr) {
    var cell = tr.querySelector('.status');
    if (!cell) return;
    var b = document.createElement('b');
    b.textContent = tr.classList.contains('is-next') ? 'Next' : (tr.classList.contains('is-past') ? 'Passed' : 'Upcoming');
    cell.appendChild(b);
  });

  // ---------- Running head: "03 — The Process" while you read that section ----------
  var indicator = document.querySelector('.section-indicator');
  var label = document.getElementById('si-label');
  var sections = document.querySelectorAll('[data-label]');
  if (!indicator || !sections.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { label.textContent = e.target.getAttribute('data-label'); indicator.classList.add('show'); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Array.prototype.forEach.call(sections, function (s) { io.observe(s); });
  // Hide it over the cover and the footer.
  var hideOver = function (el, threshold) {
    if (el) new IntersectionObserver(function (e) { if (e[0].isIntersecting) indicator.classList.remove('show'); }, { threshold: threshold }).observe(el);
  };
  hideOver(document.querySelector('.cover'), .3);
  hideOver(document.querySelector('.site-footer'), .2);
})();
