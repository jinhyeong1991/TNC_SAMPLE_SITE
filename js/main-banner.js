/* Main banner (Coway-style): PC = one wide slide centered with both neighbours peeking, arrows on the slide edges,
   progress bar + pause at the bottom center. Mobile = card aligned left with the next one peeking, progress bar bottom-left.
   The copy (sub / title / button) is HTML on top of the image and fades in on the active slide. No library needed. */
(function () {
  'use strict';
  var S = window.TNC_MAIN_BANNER || [], root = document.getElementById('mbanner');
  if (!root || !S.length) return;
  var track = root.querySelector('.mb-track'), fill = root.querySelector('.mb-fill'),
      prev = root.querySelector('.mb-prev'), next = root.querySelector('.mb-next'), play = root.querySelector('.mb-play');
  var N = S.length, K = N > 1 ? Math.min(N, 2) : 0, idx = 0, w = 0, off = 0, auto = N > 1, dragging = false, timer = null, endT = null;
  var mq = window.matchMedia('(max-width:900px)');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) auto = false;
  if (N < 2) root.classList.add('single');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function lines(s) {                                        /* split the title on <br>: each line fades in one after another */
    return esc(s).split(/&lt;br\s*\/?&gt;/i).map(function (t, i) {
      return '<span class="mb-ln mb-fade" style="--d:' + (0.45 + i * 0.15).toFixed(2) + 's">' + t + '</span>';
    }).join('');
  }
  function plain(s) { return String(s).replace(/<br\s*\/?>/gi, ' '); }
  function slide(s, i) {
    var lazy = i < K + 2 ? '' : 'loading="lazy" ';
    var media = s.video
      ? '<video src="' + esc(s.video) + '" poster="' + esc(s.pc) + '" muted playsinline loop preload="metadata"></video>'
      : '<picture>' + (s.mo ? '<source media="(max-width:900px)" srcset="' + esc(s.mo) + '">' : '') +
        '<img draggable="false" ' + lazy + 'alt="' + esc(s.alt || plain(s.title || '')) + '" src="' + esc(s.pc) + '"></picture>';
    var copy = (s.sub || s.title) ? '<div class="mb-copy">' +
      (s.sub ? '<p class="mb-sub mb-fade">' + esc(s.sub) + '</p>' : '') +
      (s.title ? '<p class="mb-tit">' + lines(s.title) + '</p>' : '') +
      '<p class="mb-btn mb-fade"><span>자세히 보기</span></p></div>' : '';
    return '<a class="mb-slide' + (s.theme === 'white' ? ' white' : '') + '" data-i="' + i + '" href="' + esc(s.href || '#') + '" draggable="false">' +
      '<span class="mb-media">' + media + '</span>' + copy + '</a>';
  }
  var list = K ? S.slice(N - K).concat(S, S.slice(0, K)) : S.slice();   /* clones on both ends -> seamless loop */
  track.innerHTML = list.map(slide).join('');
  var els = track.children;

  function norm(i) { return ((i % N) + N) % N; }
  function measure() {
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0, sw = els[0].offsetWidth;
    w = sw + gap;
    off = mq.matches ? 20 : (root.clientWidth - sw) / 2;      /* mobile: 20px from the left / PC: centered */
  }
  function setX(px, anim) { track.style.transition = anim ? 'transform .6s cubic-bezier(.25,.8,.25,1)' : 'none'; track.style.transform = 'translate3d(' + px + 'px,0,0)'; }
  function pos(i, anim) { setX(off - (i + K) * w, anim); }
  function mark() {                                          /* active class, controls color, progress, video */
    var a = idx + K;
    for (var j = 0; j < els.length; j++) {
      var on = j === a, v = els[j].querySelector('video');
      els[j].classList.toggle('on', on);
      els[j].setAttribute('aria-hidden', on ? 'false' : 'true');
      els[j].tabIndex = on ? 0 : -1;
      if (v) { if (on) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
    }
    root.classList.toggle('mb-white', S[norm(idx)].theme === 'white');
    fill.style.transform = 'scaleX(' + (norm(idx) + 1) / N + ')';
  }
  function settle() {                                        /* jump (no animation) back into the real range */
    clearTimeout(endT);
    if (idx < 0 || idx >= N) {
      idx = norm(idx); track.classList.add('jump'); pos(idx, false); mark();
      void track.offsetWidth; track.classList.remove('jump');
    }
  }
  function go(n) {
    if (N < 2) return;
    idx = n; pos(idx, true); mark();
    clearTimeout(endT); endT = setTimeout(settle, 660);       /* safety net when transitionend is throttled */
  }
  track.addEventListener('transitionend', function (e) { if (e.target === track && e.propertyName === 'transform') settle(); });

  function tick() { if (auto && !dragging && !document.hidden) go(idx + 1); }
  function restart() { clearInterval(timer); timer = setInterval(tick, 5000); }
  prev.addEventListener('click', function () { go(idx - 1); restart(); });
  next.addEventListener('click', function () { go(idx + 1); restart(); });
  play.addEventListener('click', function () {
    auto = !auto; play.classList.toggle('off', !auto); play.setAttribute('aria-label', auto ? '일시정지' : '재생'); restart();
  });

  /* drag / swipe */
  var sx = 0, sy = 0, dx = 0, moved = false;
  track.addEventListener('pointerdown', function (e) {
    if (N < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dragging = true; moved = false; sx = e.clientX; sy = e.clientY; dx = 0; track.style.transition = 'none';
  });
  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    dx = e.clientX - sx;
    if (!moved && Math.abs(e.clientY - sy) > Math.abs(dx) && Math.abs(e.clientY - sy) > 8) { dragging = false; return; }   /* vertical scroll */
    if (Math.abs(dx) > 6) moved = true;
    if (moved) { setX(off - (idx + K) * w + dx, false); track.classList.add('drag'); }
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; track.classList.remove('drag');
    if (!moved) return;
    go(Math.abs(dx) > w * 0.15 ? idx + (dx < 0 ? 1 : -1) : idx); restart();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  track.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
    var a = e.target.closest('.mb-slide');                    /* a peeking neighbour -> slide to it instead of opening the link */
    if (a && !a.classList.contains('on')) { e.preventDefault(); go(+a.getAttribute('data-i') - K); restart(); }
  }, true);

  function refresh() { measure(); pos(idx, false); }
  window.addEventListener('resize', refresh);
  if (mq.addEventListener) mq.addEventListener('change', refresh);
  window.addEventListener('load', refresh);
  measure(); pos(0, false); mark(); restart();
})();
