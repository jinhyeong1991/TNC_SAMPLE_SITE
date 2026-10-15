/* Main slide: looping card strip (several cards visible), autoplay, drag/swipe, arrows, counter. No library needed.
   Slides with a product number (g) show the product name and a rental price that follows the floating "렌탈 조건" panel. */
(function () {
  'use strict';
  var S = window.TNC_HERO || [], root = document.getElementById('hero2');
  if (!root || !S.length) return;
  var track = root.querySelector('.h2-track'), cnt = root.querySelector('.h2-cnt'),
      prev = root.querySelector('.h2-prev'), next = root.querySelector('.h2-next'), play = root.querySelector('.h2-play');
  var N = S.length, K = Math.min(N, 6), GAP = 0, idx = 0, w = 0, auto = N > 1, hover = false, dragging = false, timer = null, endT = null;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) auto = false;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function slide(s, i) {
    var cap = '';
    if (s.g) {
      cap = '<div class="h2-cap"><span class="h2-s">' + esc(s.sub || '') + '</span><span class="h2-n">' + esc(s.title) + '</span>' +
        '<span class="h2-p">월 <b data-hg>0</b>원~</span><span class="h2-m" data-hm></span></div>';
    } else if (s.title) {
      cap = '<div class="h2-txt"><strong>' + esc(s.title) + '</strong>' + (s.desc || []).map(function (d) { return '<span>' + esc(d) + '</span>'; }).join('') + '</div>';
    }
    return '<a class="h2-slide"' + (s.g ? ' data-g="' + esc(s.g) + '"' : '') + ' href="' + esc(s.href || '#') + '" draggable="false"><span class="h2-img"><img draggable="false" alt="' + esc(s.alt || s.title || '') + '" ' + (i < 6 ? '' : 'loading="lazy" ') + 'src="' + esc(s.img) + '"></span>' + cap + '</a>';
  }
  var list = S.slice(N - K).concat(S, S.slice(0, K));       /* clones on both ends -> seamless loop */
  track.innerHTML = list.map(slide).join('');

  /* ---- price on the cards (follows period + price basis) ---- */
  function findItem(g) {
    var SK = window.TNC_SK || {};
    for (var k in SK) { var a = SK[k].items; for (var i = 0; i < a.length; i++) if (a[i].g === g) return a[i]; }
    return null;
  }
  function priceFor(g) {
    var it = findItem(g), st = window.TNC_STATE || { period: 60, mode: 'card' };
    if (!it) return null;
    var kinds = it.kinds || {}, names = Object.keys(kinds).filter(function (n) { return Object.keys(kinds[n].by || {}).length; });
    if (!names.length || !window.TNC_pick) return { v: it.c || it.p, m: '제휴카드 적용 시' };
    var name = names.filter(function (n) { return /^셀프/.test(n); })[0] || names[0];
    var pk = window.TNC_pick(kinds[name].by, st.period), row = pk.row;
    return { v: st.mode === 'card' ? row[2] : row[1], m: (st.mode === 'card' ? '제휴카드 적용' : '월 렌탈료') + ' · 의무 ' + pk.k + '개월' };
  }
  function paintPrices() {
    Array.prototype.forEach.call(track.querySelectorAll('.h2-slide[data-g]'), function (el) {
      var r = priceFor(el.getAttribute('data-g')); if (!r) return;
      el.querySelector('[data-hg]').textContent = Number(r.v).toLocaleString('ko-KR');
      el.querySelector('[data-hm]').textContent = r.m;
    });
  }
  document.addEventListener('tnc-filter', paintPrices); paintPrices();

  function measure() { GAP = parseFloat(getComputedStyle(track).columnGap) || 0; w = track.children[0].offsetWidth + GAP; }
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
  function restart() { clearInterval(timer); timer = setInterval(tick, 4500); }
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
    var steps = Math.abs(dx) > w * 0.18 ? Math.max(1, Math.round(Math.abs(dx) / w)) : 0;
    go(steps ? idx + (dx < 0 ? steps : -steps) : idx); restart();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  window.addEventListener('resize', function () { measure(); pos(idx, false); });
  measure(); pos(0, false); label(); restart();
  window.addEventListener('load', function () { measure(); pos(idx, false); });
})();
