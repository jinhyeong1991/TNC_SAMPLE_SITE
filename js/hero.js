/* Main slide: full-width looping carousel (one banner at a time), autoplay, drag/swipe, arrows, counter. No library needed. */
(function () {
  'use strict';
  var S = window.TNC_HERO || [], root = document.getElementById('hero2');
  if (!root || !S.length) return;
  var track = root.querySelector('.h2-track'), cnt = root.querySelector('.h2-cnt'),
      prev = root.querySelector('.h2-prev'), next = root.querySelector('.h2-next'), play = root.querySelector('.h2-play');
  var N = S.length, K = Math.min(N, 2), GAP = 0, idx = 0, w = 0, auto = N > 1, hover = false, dragging = false, timer = null, endT = null;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) auto = false;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function slide(s, i) {
    return '<a class="h2-slide" href="' + esc(s.href || '#') + '" draggable="false"><span class="h2-img"><img draggable="false" alt="' + esc(s.alt || s.title || '') + '" ' + (i < 2 ? '' : 'loading="lazy" ') + 'src="' + esc(s.img) + '"></span>' +
      (s.title ? '<div class="h2-txt"><strong>' + esc(s.title) + '</strong>' + (s.desc || []).map(function (d) { return '<span>' + esc(d) + '</span>'; }).join('') + '</div>' : '') + '</a>';
  }
  var list = S.slice(N - K).concat(S, S.slice(0, K));       /* clones on both ends -> seamless loop */
  track.innerHTML = list.map(slide).join('');

  function measure() { w = track.children[0].offsetWidth + GAP; }
  function setX(px, anim) { track.style.transition = anim ? 'transform .7s cubic-bezier(.22,.8,.24,1)' : 'none'; track.style.transform = 'translate3d(' + px + 'px,0,0)'; }
  function pos(i, anim) { setX(-(i + K) * w, anim); }
  function norm(i) { return ((i % N) + N) % N; }
  function label() { var n = norm(idx) + 1; cnt.textContent = (n < 10 ? '0' : '') + n + ' / ' + (N < 10 ? '0' : '') + N; }
  function settle() {                                        /* jump (no animation) back into the real range */
    clearTimeout(endT);
    if (idx < 0 || idx >= N) { idx = norm(idx); pos(idx, false); }
  }
  function go(n) {
    idx = n; pos(idx, true); label();
    clearTimeout(endT); endT = setTimeout(settle, 760);       /* safety net when transitionend is throttled */
  }
  track.addEventListener('transitionend', function (e) { if (e.target === track && e.propertyName === 'transform') settle(); });

  function tick() { if (auto && !hover && !dragging && !document.hidden) go(idx + 1); }
  function restart() { clearInterval(timer); timer = setInterval(tick, 5000); }
  prev.addEventListener('click', function () { go(idx - 1); restart(); });
  next.addEventListener('click', function () { go(idx + 1); restart(); });
  play.addEventListener('click', function () {
    auto = !auto; play.classList.toggle('off', !auto); play.setAttribute('aria-label', auto ? '일시정지' : '재생'); restart();
  });
  root.addEventListener('mouseenter', function () { hover = true; });
  root.addEventListener('mouseleave', function () { hover = false; });

  /* drag / swipe */
  var sx = 0, dx = 0, moved = false;
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; moved = false; sx = e.clientX; dx = 0; track.style.transition = 'none';
  });
  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true;
    if (moved) { setX(-(idx + K) * w + dx, false); track.classList.add('drag'); }
  });
  function endDrag() {
    if (!dragging) return; dragging = false; track.classList.remove('drag');
    if (!moved) return;
    var steps = Math.abs(dx) > w * 0.15 ? Math.max(1, Math.round(Math.abs(dx) / w)) : 0;
    go(steps ? idx + (dx < 0 ? steps : -steps) : idx); restart();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  window.addEventListener('resize', function () { measure(); pos(idx, false); });
  measure(); pos(0, false); label(); restart();
  window.addEventListener('load', function () { measure(); pos(idx, false); });
})();
