/* TNC rental - product list page (list.html?c=water|air|bidet|mat|namuh|biz[&sub=...])
   Livart-style list: breadcrumb, sub-category chips, left filters, sort, product grid, "더보기".
   Prices follow the floating "렌탈 조건" panel (period + price basis) with count animation. */
(function () {
  'use strict';
  var SK = window.TNC_SK || {}, S = window.TNC_STATE;
  var IMG = 'https://devadmin.tncrental.co.kr//uploads/goods/', SHOP = 'https://sk.tncrental.co.kr/shop/';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function won(n) { return Math.round(n).toLocaleString('ko-KR'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  /* model code (js/data-models.js), shown at the right end of the line above the product name */
  function mdl(g) { var m = window.TNC_model ? window.TNC_model(g) : ''; return m ? '<span class="md" title="' + esc(m) + '">' + esc(m) + '</span>' : ''; }

  var qs = new URLSearchParams(location.search), key = qs.get('c');
  if (!SK[key]) key = 'water';
  var cat = SK[key];
  var DESC = {
    water: '얼음 · 냉온 · 직수까지, 의무사용기간별 월 렌탈료를 한눈에 비교해 보세요.',
    air: '평형과 관리 방식에 맞는 공기청정기를 골라 보세요.',
    bidet: '방문관리 주기별로 비교하는 SK매직 비데 렌탈.',
    mat: '사이즈와 헤드보드 스타일별 프레임 · 매트리스 렌탈.',
    namuh: 'SK인텔릭스 나무엑스, 관리 방식별로 선택하세요.',
    biz: '매장 · 사무실 · 학원 · 병원 업종별 맞춤 렌탈 견적을 도와드려요.'
  };
  var state = { sub: qs.get('sub') || 'all', kinds: {}, range: 'all', promo: false, zero: false, sort: 'rec', shown: 12 };
  if (state.sub !== 'all' && !cat.subs.some(function (s) { return s.k === state.sub; })) state.sub = 'all';

  /* ---------- number animation ---------- */
  function setNum(el, to, animate) {
    var from = parseFloat(el.getAttribute('data-v'));
    if (isNaN(from)) from = to;
    el.setAttribute('data-v', to);
    if (el._raf) cancelAnimationFrame(el._raf);
    if (el._end) clearTimeout(el._end);
    if (!animate || reduced || from === to) { el.textContent = won(to); return; }
    var t0 = performance.now(), dur = 620;
    el._end = setTimeout(function () { el.textContent = won(to); }, dur + 80);
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = won(from + (to - from) * e);
      if (p < 1) el._raf = requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- data prep ---------- */
  function cleanName(n) {
    return String(n).replace(/^((?:인기|베스트|추천|신규)\s*)+/, '').replace(/^[A-Z0-9][A-Za-z0-9\-\/,\.]{4,}\s+/, '').trim();
  }
  function grpOf(k) {
    if (k.grp === '셀프관리' || /^셀프/.test(k.cyc)) return '셀프관리';
    if (/방문/.test(k.grp) || /방문/.test(k.cyc)) return '방문관리';
    return '기본';
  }
  cat.items.forEach(function (it) {
    it.name = cleanName(it.n);
    it.kl = Object.keys(it.kinds || {}).map(function (c) { var k = { cyc: c, grp: it.kinds[c].grp, by: it.kinds[c].by }; k.g = grpOf(k); return k; })
      .filter(function (k) { return Object.keys(k.by).length; });
    it.groups = it.kl.map(function (k) { return k.g; });
    it.isNew = (it.bd || []).indexOf('신규') >= 0; it.isBest = (it.bd || []).some(function (b) { return b === '인기' || b === '베스트' || b === '추천'; });
  });
  var GROUPS = ['셀프관리', '방문관리'].filter(function (g) { return cat.items.some(function (it) { return it.groups.indexOf(g) >= 0; }); });

  function promoText(s) { return String(s || '').replace('개월반값', '개월 반값').replace(/개월간(?=\S)/, '개월간 ').replace(/^인기신규\s*|^추천신규\s*|^인기\s*|^추천\s*/, ''); }
  function pickKind(it) {
    if (!it.kl.length) return null;
    var want = Object.keys(state.kinds).filter(function (g) { return state.kinds[g]; });
    if (want.length) { for (var i = 0; i < it.kl.length; i++) if (want.indexOf(it.kl[i].g) >= 0) return it.kl[i]; }
    for (var j = 0; j < it.kl.length; j++) if (it.kl[j].g === '셀프관리') return it.kl[j];
    return it.kl[0];
  }
  /* price rules: card mode -> headline = 제휴카드 적용가, struck = 월 렌탈료 / rental mode -> headline = 월 렌탈료, struck = 정상가 (when there is one) */
  function calc(it) {
    var k = pickKind(it), r = { none: false, st: 0, mp: 0, pct: 0, pm: promoText(it.pm), cdn: '', stl: '월 렌탈료', near: false, kind: '', card: 0 };
    if (!k) { r.none = true; r.card = it.c || 0; return r; }
    var pk = window.TNC_pick(k.by, S.period), row = pk.row, normal = row[0], month = row[1], card = row[2];
    r.near = pk.k !== S.period; r.card = card; if (row[3]) r.pm = promoText(row[3]);
    r.kind = k.cyc === '기본' || k.cyc === '-' ? '' : k.cyc.replace(/\s+/g, ' ');
    r.cdn = '의무 ' + pk.k + '개월' + (S.mode === 'card' ? ' · 제휴카드 적용' : ' · 월 렌탈료');
    if (S.mode === 'card') { r.mp = card; r.st = month; r.stl = '월 렌탈료'; } else { r.mp = month; r.st = normal > month ? normal : 0; r.stl = '정상가'; }
    r.pct = r.st > r.mp ? Math.round((r.st - r.mp) / r.st * 100) : 0;
    return r;
  }

  var RANGES = [['all', '전체', 0, 1e12], ['u1', '1만원 이하', 0, 10000], ['r2', '1만원 ~ 2만원', 10000, 20000], ['r3', '2만원 ~ 3만원', 20000, 30000], ['r5', '3만원 ~ 5만원', 30000, 50000], ['o5', '5만원 이상', 50000, 1e12]];
  function view() {
    var rg = RANGES.filter(function (x) { return x[0] === state.range; })[0], want = Object.keys(state.kinds).filter(function (g) { return state.kinds[g]; });
    var out = [];
    cat.items.forEach(function (it) {
      if (state.sub !== 'all' && it.sub.indexOf(state.sub) < 0) return;
      if (want.length && !want.some(function (g) { return it.groups.indexOf(g) >= 0; })) return;
      var r = calc(it);
      if (state.range !== 'all') { if (r.none) return; if (r.mp < rg[2] || r.mp >= rg[3]) { if (!(r.mp === 0 && rg[2] === 0)) return; } }
      if (state.promo && !r.pm) return;
      if (state.zero && !(!r.none && r.card === 0)) return;
      out.push({ it: it, r: r });
    });
    var s = state.sort;
    if (s === 'low') out.sort(function (a, b) { return (a.r.none ? 1e9 : a.r.mp) - (b.r.none ? 1e9 : b.r.mp); });
    else if (s === 'high') out.sort(function (a, b) { return (b.r.none ? -1 : b.r.mp) - (a.r.none ? -1 : a.r.mp); });
    else if (s === 'disc') out.sort(function (a, b) { return b.r.pct - a.r.pct; });
    return out;
  }

  /* ---------- rendering ---------- */
  var grid = $('#lpGrid'), sig = '';
  function cardHtml(o, i) {
    var it = o.it, r = o.r;
    var badge = it.isNew ? '신규' : it.isBest ? '추천' : '';
    return '<a class="ac" style="animation-delay:' + Math.min(i, 11) * 40 + 'ms" data-g="' + it.g + '" href="' + (it.g === 'G050304' ? 'view.html?goods=' : SHOP + 'goods_view.php?goods=') + it.g + '">' +
      '<div class="im">' + (badge ? '<span class="rk top" style="background:var(--red)">' + badge + '</span>' : '') +
      '<img loading="lazy" alt="" src="' + IMG + it.i + '"><span class="dc" hidden>카드할인 시 0원</span></div>' +
      '<p class="br"><span class="bn">SK매직</span>' + mdl(it.g) + '</p><p class="nm">' + esc(it.name) + '</p>' +
      (r.none ? '' :
        '<s class="st"><span data-r="stl">월 렌탈료</span> <span data-r="st">0</span>원</s>' +
        '<div class="pl"><b class="pct"><span data-r="pct">0</span>%</b><strong class="mp">월 <span data-r="mp">0</span><small>원</small></strong></div>' +
        '<span class="cdn"></span>') +
      '<div class="tg"><span class="pm" hidden></span><span class="kd" hidden></span></div></a>';
  }
  function paint(el, r, animate) {
    if (r.none) return;
    setNum($('[data-r=mp]', el), r.mp, animate);
    setNum($('[data-r=st]', el), r.st, animate);
    setNum($('[data-r=pct]', el), r.pct, animate);
    $('[data-r=stl]', el).textContent = r.stl;
    el.classList.toggle('nodc', !(r.st > 0 && r.pct > 0));
    $('.cdn', el).textContent = r.cdn; el.classList.toggle('near', r.near);
    $('.dc', el).hidden = !(S.mode === 'card' && r.mp === 0);
  }
  function paintTags(el, r) {
    var pm = $('.pm', el), kd = $('.kd', el);
    pm.textContent = r.pm; pm.hidden = !r.pm; kd.textContent = r.kind; kd.hidden = !r.kind;
  }
  function render(animateNums) {
    var list = view(), shown = list.slice(0, state.shown);
    var nsig = shown.map(function (o) { return o.it.g; }).join(',');
    $('#lpCount').textContent = list.length;
    $('#lpMore').parentNode.hidden = list.length <= state.shown;
    $('#lpEmpty').hidden = list.length > 0;
    if (nsig === sig && animateNums) {                 /* same products: just re-price with animation */
      $$('.ac', grid).forEach(function (el, i) { paint(el, shown[i].r, true); paintTags(el, shown[i].r); });
      return;
    }
    sig = nsig;
    grid.innerHTML = shown.map(cardHtml).join('');
    $$('.ac', grid).forEach(function (el, i) { paint(el, shown[i].r, false); paintTags(el, shown[i].r); });
  }

  /* ---------- page chrome ---------- */
  document.title = cat.t + ' 렌탈 | 티앤씨렌탈';
  $('#lpTitle').textContent = cat.t;
  $('#lpCrumb').textContent = cat.t;
  $('#lpDesc').textContent = DESC[key] || '';
  $$('.cat-list a.t').forEach(function (a) { a.classList.remove('on'); });
  var navA = $('[data-mega="' + key + '"] a.t'); if (navA) navA.classList.add('on');

  /* sub-category chips */
  var subs = $('#lpSubs');
  if (cat.subs.length) {
    subs.innerHTML = [{ k: 'all', t: '전체' }].concat(cat.subs).map(function (s) {
      return '<button type="button" data-s="' + s.k + '"' + (s.k === state.sub ? ' class="on"' : '') + '>' + s.t + '</button>';
    }).join('');
    subs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', subs).forEach(function (x) { x.classList.toggle('on', x === b); });
      state.sub = b.getAttribute('data-s'); state.shown = 12; render(false);
      history.replaceState(null, '', 'list.html?c=' + key + (state.sub !== 'all' ? '&sub=' + state.sub : ''));
    });
  } else subs.hidden = true;

  /* sidebar filters */
  var side = $('#lpFilters');
  side.innerHTML =
    (GROUPS.length > 1 ? '<div class="fg"><h4>관리 방법</h4>' + GROUPS.map(function (g) { return '<label class="ck"><input type="checkbox" data-k="' + g + '"><span>' + g + '</span></label>'; }).join('') + '</div>' : '') +
    '<div class="fg"><h4>월 렌탈료</h4>' + RANGES.map(function (x) { return '<label class="ck"><input type="radio" name="rg" value="' + x[0] + '"' + (x[0] === 'all' ? ' checked' : '') + '><span>' + x[1] + '</span></label>'; }).join('') + '</div>' +
    '<div class="fg"><h4>혜택</h4><label class="ck"><input type="checkbox" data-f="promo"><span>프로모션 진행중</span></label><label class="ck"><input type="checkbox" data-f="zero"><span>제휴카드 적용 시 0원</span></label></div>' +
    '<button class="fg-reset" type="button">필터 초기화</button>';
  side.addEventListener('change', function (e) {
    var t = e.target;
    if (t.getAttribute('data-k')) state.kinds[t.getAttribute('data-k')] = t.checked;
    else if (t.name === 'rg') state.range = t.value;
    else if (t.getAttribute('data-f') === 'promo') state.promo = t.checked;
    else if (t.getAttribute('data-f') === 'zero') state.zero = t.checked;
    state.shown = 12; render(false);
  });
  side.addEventListener('click', function (e) {
    if (!e.target.classList.contains('fg-reset')) return;
    state.kinds = {}; state.range = 'all'; state.promo = false; state.zero = false; state.shown = 12;
    $$('input', side).forEach(function (i) { if (i.type === 'radio') i.checked = i.value === 'all'; else i.checked = false; });
    render(false);
  });
  $('#lpSort').addEventListener('change', function () { state.sort = this.value; state.shown = 12; render(false); });
  $('#lpMore').addEventListener('click', function () { state.shown += 12; render(false); });
  /* mobile filter sheet */
  var sheet = $('#lpSheet');
  $('#lpFbtn').addEventListener('click', function () { sheet.classList.add('open'); document.documentElement.style.overflow = 'hidden'; });
  function closeSheet() { sheet.classList.remove('open'); document.documentElement.style.overflow = ''; }
  $('#lpSheetX').addEventListener('click', closeSheet); $('#lpSheetDim').addEventListener('click', closeSheet); $('#lpSheetOk').addEventListener('click', closeSheet);

  document.addEventListener('tnc-filter', function () { render(true); });
  render(false);
})();
