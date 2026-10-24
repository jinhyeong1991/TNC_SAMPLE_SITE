/* Floating "렌탈 조건" filter shared by every page.
   - window.TNC_STATE = { period, mode }   mode: 'card' = 제휴카드 적용가, 'rental' = 월 렌탈료
   - changing it fires the document event "tnc-filter"; pages listen and re-price themselves
   - the choice is remembered for the browser session, so it follows the visitor from page to page */
(function () {
  'use strict';
  var PERIODS = [36, 48, 60, 72, 84];
  var S = window.TNC_STATE = { period: 60, mode: 'card' };
  try {
    var saved = JSON.parse(sessionStorage.getItem('tnc-fx') || 'null');
    if (saved && PERIODS.indexOf(saved.period) >= 0) S.period = saved.period;
    if (saved && (saved.mode === 'card' || saved.mode === 'rental')) S.mode = saved.mode;
  } catch (e) { /* storage unavailable: keep defaults */ }

  /* nearest available contract period for a product (ties go to the longer one) */
  window.TNC_pick = function (by, p) {
    var ks = Object.keys(by).map(Number), best = ks[0];
    if (by[p]) return { k: p, row: by[p] };
    ks.forEach(function (k) { var d = Math.abs(k - p), bd = Math.abs(best - p); if (d < bd || (d === bd && k > best)) best = k; });
    return { k: best, row: by[best] };
  };

  function build() {
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var always = document.body.hasAttribute('data-fx-always');
    var fx = document.createElement('aside');
    fx.className = 'fx'; fx.id = 'fx'; fx.setAttribute('aria-label', '렌탈 조건');
    if (document.body.hasAttribute('data-fx-quick')) fx.classList.add('fx-quick');   /* pages without prices: quick menu only */
    fx.innerHTML =
      '<button class="fx-toggle" type="button" aria-expanded="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></svg><span class="fx-lbl"></span></button>' +
      '<div class="fx-body"><p class="fx-t">렌탈 조건</p><p class="fx-s">의무사용기간</p><div class="fx-chips">' +
      PERIODS.map(function (n) { return '<button type="button" data-p="' + n + '"' + (n === S.period ? ' class="on"' : '') + '>' + n + '개월</button>'; }).join('') +
      '</div><p class="fx-s">가격 기준</p><div class="fx-seg"><button type="button" data-m="card"' + (S.mode === 'card' ? ' class="on"' : '') + '>제휴카드 적용</button><button type="button" data-m="rental"' + (S.mode === 'rental' ? ' class="on"' : '') + '>월 렌탈료</button></div>' +
      '<p class="fx-n">선택하면 페이지의 모든 가격이 바로 바뀌어요.<span class="fx-n-m"> 선택한 버튼을 한 번 더 누르면 닫혀요.</span></p></div>' +
      /* quick menu under the filter (sk.tncrental.co.kr style): phone + 간편상담, 제휴카드 banner, back to top.
         Wide screens show full blocks; narrower screens show three round buttons above the filter pill. */
      '<div class="fx-q">' +
        '<div class="fx-call"><a class="fx-tel" href="tel:16704113">상담문의<b>1670-4113</b></a>' +
          '<button class="fx-consult" type="button" data-open-consult aria-label="간편상담 바로가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.6"/><path d="M19 19c0 1.4-1.6 2.2-4 2.2h-2"/><circle cx="9" cy="10.6" r=".2" fill="currentColor"/><circle cx="12" cy="10.6" r=".2" fill="currentColor"/><circle cx="15" cy="10.6" r=".2" fill="currentColor"/></svg><span>간편상담<br>바로가기</span></button></div>' +
        '<a class="fx-card" href="card.html" aria-label="제휴카드 혜택 보기"><svg class="fx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6.5 15h4"/></svg>' +
          '<span class="t">제휴카드<br>사용시 최대</span><b>최대 2만3천원 할인</b><img loading="lazy" alt="" src="https://devadmin.tncrental.co.kr//uploads/card/1007/card_190_dndmh.png"></a>' +
        '<button class="fx-top" type="button" aria-label="맨 위로"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>' +
      '</div>';
    document.body.appendChild(fx);
    $('.fx-top', fx).addEventListener('click', function () {
      var r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: r ? 'auto' : 'smooth' });
    });

    /* mobile bottom bar: 홈 · 메뉴(+검색 at the top of the drawer) · 상담(raised center → 전화 / 간편상담 / AI 상담 sheet) · 렌탈료(the filter above as a bottom sheet) · 제휴카드. Hidden on PC by CSS. */
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var ICON = {
      home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
      menu: '<path d="M4.5 7h15M4.5 12h15M4.5 17h15"/>',
      rent: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/>',
      card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6.5 15h4"/>',
      phone: '<path d="M6.6 4h2.6l1.4 4-2 1.3a10 10 0 0 0 4.1 4.1l1.3-2 4 1.4v2.6A2 2 0 0 1 16 19.4 14.4 14.4 0 0 1 4.6 8 2 2 0 0 1 6.6 4z"/>',
      form: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"/>',
      ai: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>'
    };
    function ic(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>'; }
    /* 상담 icon: the official SK magic logo (images/sk-magic.svg), untouched, with a light sheen now and then (css/main.css) */
    var BFLY = '<span class="bfly" aria-hidden="true"><img src="images/sk-magic.svg" alt=""><span class="bf-sheen"></span></span>';
    var nav = document.createElement('nav');
    nav.className = 'mnav'; nav.setAttribute('aria-label', '하단 메뉴');
    nav.innerHTML =
      '<a href="index.html" data-n="home"' + (page === 'index.html' ? ' class="on" aria-current="page"' : '') + '>' + ic('home') + '<span>홈</span></a>' +
      '<button type="button" data-n="menu" aria-label="메뉴 · 검색">' + ic('menu') + '<span>메뉴</span></button>' +
      '<button type="button" data-n="talk" class="talk" aria-expanded="false" aria-controls="mcs"><i>' + BFLY + '</i><span>상담</span></button>' +
      '<button type="button" data-n="rent" class="rent" aria-expanded="false">' + '<i>' + ic('rent') + '</i><span class="mnav-rl"></span></button>' +
      '<a href="card.html" data-n="card"' + (page === 'card.html' || page === 'card_view.html' ? ' class="on" aria-current="page"' : '') + '>' + ic('card') + '<span>제휴카드</span></a>';
    var mdim = document.createElement('div'); mdim.className = 'mnav-dim';
    /* 상담 sheet: phone first (biggest), then 간편상담 (header.js handles [data-open-consult] by delegation), then AI 상담 */
    var mcs = document.createElement('div'); mcs.className = 'mcs'; mcs.id = 'mcs';
    mcs.setAttribute('role', 'dialog'); mcs.setAttribute('aria-label', '상담 방법 선택');
    mcs.innerHTML =
      '<div class="mcs-h"><b>어떻게 상담해 드릴까요?</b><button type="button" class="mcs-x" aria-label="닫기"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<a class="mcs-call" href="tel:16704113"><i>' + ic('phone') + '</i><span><b>1670-4113</b><small>지금 바로 전화 상담</small></span></a>' +
      '<button type="button" class="mcs-row" data-open-consult><i>' + ic('form') + '</i><span><b>간편상담 신청</b><small>이름 · 연락처만 남기면 전화드려요</small></span></button>' +
      '<button type="button" class="mcs-row" data-n="ai"><i>' + ic('ai') + '</i><span><b>AI 상담</b><small>제품 추천 · 견적을 바로 물어보세요</small></span></button>';
    document.body.appendChild(mdim); document.body.appendChild(mcs); document.body.appendChild(nav); document.body.classList.add('has-mnav');
    var talkBtn = $('[data-n=talk]', nav);
    function talk(open) {
      mcs.classList.toggle('on', open); talkBtn.classList.toggle('on', open); talkBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mdim.classList.toggle('on', open || fx.classList.contains('msheet'));
    }
    talkBtn.addEventListener('click', function (e) { e.stopPropagation(); sheet(false); talk(!mcs.classList.contains('on')); });
    mcs.addEventListener('click', function (e) { if (e.target.closest('a,button')) talk(false); });
    var rentBtn = $('[data-n=rent]', nav), rl = $('.mnav-rl', nav);
    function rentLabel() { rl.textContent = '렌탈료'; rentBtn.setAttribute('aria-label', '렌탈료 조건 (현재 ' + S.period + '개월)'); }
    rentLabel(); document.addEventListener('tnc-filter', rentLabel);
    function sheet(open) {
      if (open) talk(false);
      fx.classList.toggle('msheet', open); mdim.classList.toggle('on', open);
      rentBtn.classList.toggle('on', open); rentBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    rentBtn.addEventListener('click', function (e) { e.stopPropagation(); sheet(!fx.classList.contains('msheet')); });
    mdim.addEventListener('click', function () { sheet(false); talk(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sheet(false); talk(false); } });
    $('[data-n=menu]', nav).addEventListener('click', function () { sheet(false); var b = document.getElementById('openDrawer'); if (b) b.click(); });
    /* AI 상담 reuses the header's own control (bound by header.js before this bar exists); 검색 lives at the top of the menu drawer */
    $('[data-n=ai]', mcs).addEventListener('click', function () { var a = document.querySelector('#hd .btn-ai'); if (a) a.click(); });
    var lbl = $('.fx-lbl', fx), tg = $('.fx-toggle', fx);
    function label() { lbl.textContent = S.period + '개월 · ' + (S.mode === 'card' ? '제휴카드' : '월 렌탈료'); }
    label();
    function fire() {
      label();
      try { sessionStorage.setItem('tnc-fx', JSON.stringify(S)); } catch (e) { /* ignore */ }
      document.dispatchEvent(new CustomEvent('tnc-filter'));
    }
    /* mobile sheet: tapping the option that is already selected (i.e. select, then tap again / double-tap) closes the sheet */
    function reTapClose(b) { if (fx.classList.contains('msheet') && b.classList.contains('on')) { sheet(false); return true; } return false; }
    $('.fx-chips', fx).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || reTapClose(b)) return;
      $$('.fx-chips button', fx).forEach(function (x) { x.classList.toggle('on', x === b); });
      S.period = +b.getAttribute('data-p'); fire();
    });
    $('.fx-seg', fx).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || reTapClose(b)) return;
      $$('.fx-seg button', fx).forEach(function (x) { x.classList.toggle('on', x === b); });
      S.mode = b.getAttribute('data-m'); fire();
    });
    /* ✕ in the sheet's corner (shown only in the mobile sheet by CSS) */
    var fxX = document.createElement('button'); fxX.type = 'button'; fxX.className = 'fx-x'; fxX.setAttribute('aria-label', '렌탈 조건 닫기');
    fxX.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    $('.fx-body', fx).appendChild(fxX);
    fxX.addEventListener('click', function () { sheet(false); });
    tg.addEventListener('click', function (e) { e.stopPropagation(); var o = fx.classList.toggle('open'); tg.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    document.addEventListener('click', function (e) { if (fx.classList.contains('open') && !fx.contains(e.target)) { fx.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fx.classList.remove('open'); });
    var tick = false;
    function onScroll() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { fx.classList.toggle('on', always || (window.scrollY || 0) > 360); tick = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
