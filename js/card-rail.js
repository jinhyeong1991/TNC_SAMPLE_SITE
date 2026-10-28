/* 메인 "SK매직 제휴카드 혜택" 슬라이드 (index.html #pcards).
   카드 목록은 js/data-card-list.js (card.html 과 같은 값). 월 최대 할인이 큰 순서로 보여 주고,
   PC 는 한 줄에 4장 + 좌우 화살표, 모바일은 2장 남짓 보이게 해서 손가락으로 옆으로 넘긴다. 누르면 카드 상세(card_view.html). */
(function () {
  'use strict';
  var rail = document.getElementById('crRail');
  var CARDS = window.TNC_CARDS;
  if (!rail || !CARDS || !CARDS.length) return;
  var UP = 'https://devadmin.tncrental.co.kr//uploads/card/1007/';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function won(n) { return n.toLocaleString('ko-KR'); }
  function maxOf(k) { return k.t[k.t.length - 1][1]; }
  var IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6.5 15h4"/></svg>';

  rail.innerHTML = CARDS.slice().sort(function (a, b) { return maxOf(b) - maxOf(a); }).map(function (k) {
    var low = k.t[0], promo = k.t.some(function (r) { return r[2]; });
    return '<a class="cr" href="card_view.html?code=' + k.c + '" draggable="false">' +
      '<span class="cr-im">' + (promo ? '<span class="cr-tag">추가 프로모션</span>' : '') +
        '<img loading="lazy" draggable="false" alt="SK인텔릭스 ' + esc(k.n) + '" src="' + UP + k.img + '"></span>' +
      '<span class="cr-go">' + IC + '혜택 보기</span>' +
      '<span class="cr-nm">[SK인텔릭스] ' + esc(k.n) + '</span>' +
      '<span class="cr-pr"><em>월 최대</em><b>' + won(maxOf(k)) + '원</b> 할인</span>' +
      '<span class="cr-lo">전월 ' + low[0] + '만원↑ 사용 시 ' + won(low[1]) + '원부터</span>' +
      '<span class="cr-only">SK매직 렌탈 전용</span></a>';
  }).join('');

  /* arrows (PC) + mouse drag; touch swipes natively */
  var prev = document.getElementById('crPrev'), next = document.getElementById('crNext');
  function edge() { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8; }
  function step(d) { rail.scrollBy({ left: d * rail.clientWidth, behavior: 'smooth' }); }
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  rail.addEventListener('scroll', edge, { passive: true }); edge(); window.addEventListener('resize', edge);
  var down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  window.addEventListener('pointermove', function (e) {
    if (!down) return; var dx = e.clientX - sx;
    if (Math.abs(dx) > 5) { moved = true; rail.classList.add('drag'); }
    if (moved) rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { rail.classList.remove('drag'); }, 0); });
})();
