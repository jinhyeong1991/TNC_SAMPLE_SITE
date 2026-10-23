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
    fx.innerHTML =
      '<button class="fx-toggle" type="button" aria-expanded="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></svg><span class="fx-lbl"></span></button>' +
      '<div class="fx-body"><p class="fx-t">렌탈 조건</p><p class="fx-s">의무사용기간</p><div class="fx-chips">' +
      PERIODS.map(function (n) { return '<button type="button" data-p="' + n + '"' + (n === S.period ? ' class="on"' : '') + '>' + n + '개월</button>'; }).join('') +
      '</div><p class="fx-s">가격 기준</p><div class="fx-seg"><button type="button" data-m="card"' + (S.mode === 'card' ? ' class="on"' : '') + '>제휴카드 적용</button><button type="button" data-m="rental"' + (S.mode === 'rental' ? ' class="on"' : '') + '>월 렌탈료</button></div>' +
      '<p class="fx-n">선택하면 페이지의 모든 가격이 바로 바뀌어요.</p></div>' +
      /* quick menu under the filter (sk.tncrental.co.kr style): phone + 간편상담, 제휴카드 banner, back to top.
         Wide screens show full blocks; narrower screens show three round buttons above the filter pill. */
      '<div class="fx-q">' +
        '<div class="fx-call"><a class="fx-tel" href="tel:16704113">상담문의<b>1670-4113</b></a>' +
          '<button class="fx-consult" type="button" data-open-consult aria-label="간편상담 바로가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.6"/><path d="M19 19c0 1.4-1.6 2.2-4 2.2h-2"/><circle cx="9" cy="10.6" r=".2" fill="currentColor"/><circle cx="12" cy="10.6" r=".2" fill="currentColor"/><circle cx="15" cy="10.6" r=".2" fill="currentColor"/></svg><span>간편상담<br>바로가기</span></button></div>' +
        '<a class="fx-card" href="https://sk.tncrental.co.kr/shop/card.php" aria-label="제휴카드 혜택 보기"><svg class="fx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6.5 15h4"/></svg>' +
          '<span class="t">제휴카드<br>사용시 최대</span><b>최대 2만3천원 할인</b><img loading="lazy" alt="" src="https://devadmin.tncrental.co.kr//uploads/card/1007/card_190_dndmh.png"></a>' +
        '<button class="fx-top" type="button" aria-label="맨 위로"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>' +
      '</div>';
    document.body.appendChild(fx);
    $('.fx-top', fx).addEventListener('click', function () {
      var r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: r ? 'auto' : 'smooth' });
    });
    var lbl = $('.fx-lbl', fx), tg = $('.fx-toggle', fx);
    function label() { lbl.textContent = S.period + '개월 · ' + (S.mode === 'card' ? '제휴카드' : '월 렌탈료'); }
    label();
    function fire() {
      label();
      try { sessionStorage.setItem('tnc-fx', JSON.stringify(S)); } catch (e) { /* ignore */ }
      document.dispatchEvent(new CustomEvent('tnc-filter'));
    }
    $('.fx-chips', fx).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('.fx-chips button', fx).forEach(function (x) { x.classList.toggle('on', x === b); });
      S.period = +b.getAttribute('data-p'); fire();
    });
    $('.fx-seg', fx).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('.fx-seg button', fx).forEach(function (x) { x.classList.toggle('on', x === b); });
      S.mode = b.getAttribute('data-m'); fire();
    });
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
