/* TNC rental - main page behaviour
   - hero dots (mobile swipe) / promo D-day / scroll reveal
   - product list: category tabs + contract-period chips + price mode, prices count up/down */
(function () {
  'use strict';
  var T = window.TNC, SHOP = T.SHOP, IMG = T.IMG;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function won(n) { return Math.round(n).toLocaleString('ko-KR'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  /* model code (js/data-models.js), shown at the right end of the line above the product name */
  function mdl(g) { var m = window.TNC_model ? window.TNC_model(g) : ''; return m ? '<span class="md" title="' + esc(m) + '">' + esc(m) + '</span>' : ''; }

  /* ---------- promo D-day (event end date) ---------- */
  (function () {
    var el = $('#dday'); if (!el) return;
    var end = new Date(2026, 9, 29, 23, 59, 59), now = new Date();   /* 2026-10-29 */
    var d = Math.ceil((end - now) / 86400000);
    el.textContent = d > 0 ? 'D-' + d : '상시 진행';
  })();

  /* ---------- scroll reveal ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  $$('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- number animation (count up / down) ---------- */
  function setNum(el, to, animate) {
    var from = parseFloat(el.getAttribute('data-v'));
    if (isNaN(from)) from = to;
    el.setAttribute('data-v', to);
    if (el._raf) cancelAnimationFrame(el._raf);
    if (el._end) clearTimeout(el._end);
    if (!animate || reduced || from === to) { el.textContent = won(to); return; }
    var t0 = performance.now(), dur = 620;
    el._end = setTimeout(function () { el.textContent = won(to); }, dur + 80);   /* safety net if rAF is throttled (background tab) */
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);       /* easeOutQuart */
      el.textContent = won(from + (to - from) * e);
      if (p < 1) el._raf = requestAnimationFrame(step);
    })(t0);
  }

  var S = window.TNC_STATE;   /* defined in js/fx.js */

  /* ---------- 가전종합몰 sections: MD rail / BEST rail (rank) / benefit grid / 3 curation grids.
     Prices follow the floating filter (period + price basis) with count animation. ---------- */
  (function () {
    var A = window.TNC_ALL; if (!A) return;
    var IMGB = T.IMG, DET = A.SHOP + 'goods_view.php?goods=';
    var KEYS = Object.keys(A.CATS), BYID = {};
    KEYS.forEach(function (k) { A.CATS[k].items.forEach(function (it) { BYID[it.g] = it; }); });
    function all(keys) { var o = []; keys.forEach(function (k) { A.CATS[k].items.forEach(function (it) { o.push(it); }); }); return o; }
    function mix(keys, n) {                       /* round-robin across categories so "전체" looks varied */
      var lists = keys.map(function (k) { return A.CATS[k].items.slice(); }), out = [], i = 0;
      while (out.length < n && lists.some(function (l) { return l.length; })) { var l = lists[i % lists.length]; if (l.length) out.push(l.shift()); i++; }
      return out;
    }
    function promoText(s) { return String(s || '').replace('개월반값', '개월 반값').replace(/개월간(?=\S)/, '개월간 '); }

    /* price rules: card mode -> headline = card price, struck = 월 렌탈료
                    rental mode -> headline = 월 렌탈료, struck = 정상가 (when there is one) */
    function calc(it) {
      var by = (window.TNC_PERIODS || {})[it.g], r = { st: 0, mp: 0, pct: 0, pm: '', cdn: '', stl: '월 렌탈료', near: false };
      var month, card, normal;
      if (by) {
        var pk = window.TNC_pick(by, S.period), row = pk.row;
        normal = row[0]; month = row[1]; card = row[2]; r.pm = promoText(row[3]); r.near = pk.k !== S.period;
        r.cdn = '의무 ' + pk.k + '개월' + (S.mode === 'card' ? ' · 제휴카드 적용' : ' · 월 렌탈료');
      } else { normal = 0; month = it.p; card = it.c; r.pm = it.pm; r.cdn = S.mode === 'card' ? '제휴카드 적용 시' : ''; }
      if (S.mode === 'card') { r.mp = card; r.st = month; r.stl = '월 렌탈료'; }
      else { r.mp = month; r.st = normal > month ? normal : 0; r.stl = '정상가'; }
      r.pct = r.st > r.mp ? Math.round((r.st - r.mp) / r.st * 100) : 0;
      return r;
    }
    function card(it, rank) {
      return '<a class="ac" data-g="' + it.g + '" href="' + DET + it.g + '">' +
        '<div class="im">' + (rank ? '<span class="rk' + (rank <= 3 ? ' top' : '') + '">' + rank + '</span>' : '') +
        '<img loading="lazy" alt="" src="' + IMGB + it.i + '"><span class="dc" hidden>카드할인 시 0원</span></div>' +
        '<p class="br"><span class="bn">' + esc(it.b) + '</span>' + mdl(it.g) + '</p><p class="nm">' + esc(it.n) + '</p>' +
        '<s class="st"><span data-r="stl">월 렌탈료</span> <span data-r="st">0</span>원</s>' +
        '<div class="pl"><b class="pct"><span data-r="pct">0</span>%</b><strong class="mp">월 <span data-r="mp">0</span><small>원</small></strong></div>' +
        '<span class="cdn"></span><span class="pm" hidden></span></a>';
    }
    function applyAll(animate) {
      $$('.ac[data-g]').forEach(function (el) {
        var it = BYID[el.getAttribute('data-g')]; if (!it) return;
        var r = calc(it);
        setNum($('[data-r=mp]', el), r.mp, animate);
        setNum($('[data-r=st]', el), r.st, animate);
        setNum($('[data-r=pct]', el), r.pct, animate);
        $('[data-r=stl]', el).textContent = r.stl;
        el.classList.toggle('nodc', !(r.st > 0 && r.pct > 0));
        $('.cdn', el).textContent = r.cdn; el.classList.toggle('near', r.near);
        $('.dc', el).hidden = !(S.mode === 'card' && r.mp === 0);
        var pm = $('.pm', el); pm.textContent = r.pm; pm.hidden = !r.pm;
      });
    }
    document.addEventListener('tnc-filter', function () { applyAll(true); });

    function tabs(el, spec, onPick) {
      el.innerHTML = spec.map(function (s, i) { return '<button type="button" data-i="' + i + '"' + (i === 0 ? ' class="on"' : '') + '>' + s.t + '</button>'; }).join('');
      el.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', el).forEach(function (x) { x.classList.toggle('on', x === b); });
        onPick(spec[+b.getAttribute('data-i')]);
      });
      onPick(spec[0]);
    }
    function bindRail(rail, prev, next) {
      function edge() { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8; }
      function step(d) { var c = $('.ac', rail); if (!c) return; rail.scrollBy({ left: d * (c.offsetWidth + 18) * 3, behavior: 'smooth' }); }
      prev.addEventListener('click', function () { step(-1); });
      next.addEventListener('click', function () { step(1); });
      rail.addEventListener('scroll', edge, { passive: true }); window.addEventListener('resize', edge);
      return edge;
    }
    function railSection(prefix, spec, rank) {
      var rail = $('#' + prefix + 'Rail'), edge = bindRail(rail, $('#' + prefix + 'Prev'), $('#' + prefix + 'Next'));
      tabs($('#' + prefix + 'Tabs'), spec, function (s) {
        rail.innerHTML = s.fn().map(function (it, i) { return card(it, rank ? i + 1 : 0); }).join('');
        applyAll(false); rail.scrollLeft = 0; edge();
      });
    }
    /* 레이아웃(단 수)에 맞춰 마지막 줄이 비지 않도록 보여 줄 개수를 정한다
       2·4단 → 8개, 6단 → 12개(모자라면 6개), 모바일 1·2단 → 8개, 3단 → 9개(모자라면 6개) */
    function fitCount(g, avail) {
      var cols = window.TNC_LSW ? window.TNC_LSW.cols(g) : 4;
      var want = cols === 6 ? 12 : cols === 3 ? 9 : 8;
      var n = Math.min(want, avail);
      if (cols > 1) n -= n % cols;
      return Math.max(n, Math.min(avail, cols));
    }
    function gridSection(prefix, spec) {
      var g = $('#' + prefix + 'Grid'), cur = null;
      function draw() {
        var list = cur.fn();
        g.innerHTML = list.slice(0, fitCount(g, list.length)).map(function (it) { return card(it, 0); }).join('');
        applyAll(false);
      }
      tabs($('#' + prefix + 'Tabs'), spec, function (s) { cur = s; draw(); });
      /* 단 수를 바꿨을 때 개수가 달라지면 다시 그린다 (같으면 카드 이동 애니메이션만) */
      g.addEventListener('lsw-change', function () {
        if (cur && fitCount(g, cur.fn().length) !== $$('.ac', g).length) setTimeout(draw, 520);
      });
      window.addEventListener('resize', function () {
        if (cur && fitCount(g, cur.fn().length) !== $$('.ac', g).length) draw();
      });
    }
    function listingBenefit(list) { return list.slice().sort(function (a, b) { return (b.p - b.c) - (a.p - a.c); }); }
    function catTab(k, n) { return { t: A.CATS[k].t, fn: function () { return A.CATS[k].items.slice(0, n || 10); } }; }

    /* MD 추천 */
    railSection('md', [{ t: '전체', fn: function () { return mix(KEYS, 10); } }]
      .concat(['water', 'env', 'kitchen', 'laundry', 'tv', 'beauty', 'furn'].map(function (k) { return catTab(k); })), false);
    /* BEST : biggest card discount first (ranking order is fixed) */
    railSection('best', [
      { t: '전체', fn: function () { return listingBenefit(all(KEYS)).slice(0, 10); } },
      { t: '정수기', fn: function () { return listingBenefit(A.CATS.water.items).slice(0, 10); } },
      { t: '환경가전', fn: function () { return listingBenefit(A.CATS.env.items).slice(0, 10); } },
      { t: 'TV&디지털', fn: function () { return listingBenefit(A.CATS.tv.items).slice(0, 10); } },
      { t: '세탁가전', fn: function () { return listingBenefit(A.CATS.laundry.items).slice(0, 10); } }
    ], true);
    /* SPECIAL BENEFIT */
    gridSection('bn', [
      { t: '전체', fn: function () { return listingBenefit(all(KEYS)).slice(0, 12); } },
      { t: '카드할인 시 0원', fn: function () { return all(KEYS).filter(function (i) { return i.c === 0; }); } },
      { t: '프로모션 진행중', fn: function () { return all(KEYS).filter(function (i) { return i.pm; }); } },
      { t: 'TV', fn: function () { return A.CATS.tv.items; } }
    ]);
    /* curations */
    gridSection('c1', [
      { t: '전체', fn: function () { return mix(['kitchen', 'laundry', 'living'], 12); } },
      catTab('kitchen', 12), catTab('laundry', 12), catTab('living', 12)
    ]);
    gridSection('c2', [
      { t: '전체', fn: function () { return mix(['env', 'season'], 12); } },
      catTab('env', 12), catTab('season', 12)
    ]);
    gridSection('c3', [
      { t: '전체', fn: function () { return mix(['beauty', 'furn'], 12); } },
      catTab('beauty', 12), catTab('furn', 12)
    ]);
  })();

  /* ---------- shorts rail + YouTube popup ----------
     Put your YouTube Shorts links in js/data.js -> TNC.SHORTS = [{ yt: 'https://youtube.com/shorts/xxxxxxxxxxx', g: 'G050305' }, ...]
     yt accepts a full Shorts / youtu.be / watch URL or the 11-character video id. Empty yt = "coming soon" popup. */
  (function () {
    var rail = $('#rail'); if (!rail) return;
    var byId = {}; T.PRODUCTS.forEach(function (p) { byId[p.id] = p; });
    var CATN = {}; T.CATS.forEach(function (c) { CATN[c.k] = c.t; });
    var PAL = [{ c: '#FFE8EC' }, { c: '#111318', dk: 1 }, { c: '#E8F0FF' }, { c: '#FFF1DC' }, { c: '#E3F5EB' }, { c: '#F0EAFD' }, { c: '#E1002A', dk: 1 }];
    function ytId(v) {
      if (!v) return '';
      var m = String(v).match(/(?:shorts\/|youtu\.be\/|[?&]v=|embed\/)([A-Za-z0-9_-]{11})/);
      if (m) return m[1];
      return /^[A-Za-z0-9_-]{11}$/.test(String(v).trim()) ? String(v).trim() : '';
    }
    function priceOf(p) {
      if (!p.by) return p.fixed;
      var row = p.by[60] || p.by[36] || p.by[Object.keys(p.by)[0]];
      return row[2] != null ? row[2] : row[1];
    }
    var items = (T.SHORTS || []).map(function (s) {
      var p = byId[s.g] || T.PRODUCTS[0];
      return { yt: ytId(s.yt), p: p, title: s.title || p.name, href: SHOP + 'goods_view.php?goods=' + p.id, thumb: s.thumb || (T.POSTERS || {})[p.id] || '' };
    });
    var PLAY = '<span class="play"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>';
    rail.innerHTML = items.map(function (it, i) {
      var pal = PAL[i % PAL.length], p = it.p;
      var cap = '<div class="cap"><em>' + esc(CATN[p.cat] || '') + (p.bd ? ' · ' + p.bd : '') + '</em><b>' + esc(it.title) + '</b><span>월 <strong>' + won(priceOf(p)) + '</strong>원~</span></div>';
      var thumb = it.thumb || (it.yt ? 'https://i.ytimg.com/vi/' + it.yt + '/maxresdefault.jpg' : '');
      if (thumb) return '<a class="sc ps dk" data-i="' + i + '" href="' + it.href + '" draggable="false"><img alt="" draggable="false" loading="lazy" src="' + thumb + '"' + (it.yt && !it.thumb ? ' onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + it.yt + '/hqdefault.jpg\'"' : '') + '><div class="top"><span class="sh">SHORTS</span>' + PLAY + '</div>' + cap + '</a>';
      return '<a class="sc' + (pal.dk ? ' dk' : '') + '" data-i="' + i + '" draggable="false" style="--c:' + pal.c + '" href="' + it.href + '"><div class="top"><span class="sh">SHORTS</span>' + PLAY + '</div>' +
        '<div class="disc"><img alt="" draggable="false" loading="lazy" src="' + IMG + p.img + '"></div>' + cap + '</a>';
    }).join('');

    /* rail arrows + mouse drag */
    var prev = $('#railPrev'), next = $('#railNext');
    function edge() { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8; }
    function step(d) { var c = $('.sc', rail); if (!c) return; rail.scrollBy({ left: d * (c.offsetWidth + 14) * 3, behavior: 'smooth' }); }
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

    /* popup */
    var yt = document.createElement('div');
    yt.className = 'yt'; yt.setAttribute('aria-hidden', 'true'); yt.setAttribute('role', 'dialog'); yt.setAttribute('aria-label', '쇼츠 영상');
    yt.innerHTML = '<div class="yt-dim" data-x></div><div class="yt-box">' +
      '<button class="yt-x" type="button" data-x aria-label="닫기"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<button class="yt-nav prev" type="button" aria-label="이전 영상"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg></button>' +
      '<div class="yt-frame"></div>' +
      '<button class="yt-nav next" type="button" aria-label="다음 영상"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></button>' +
      '<div class="yt-cap"><div><em></em><b></b></div><a class="btn btn-red" href="#">제품 보러가기</a></div></div>';
    document.body.appendChild(yt);
    var frame = $('.yt-frame', yt), cur = 0;
    function show(i) {
      cur = (i + items.length) % items.length;
      var it = items[cur];
      if (it.yt) {
        frame.innerHTML = '<iframe src="https://www.youtube.com/embed/' + it.yt + '?autoplay=1&playsinline=1&rel=0&loop=1&playlist=' + it.yt + '" title="' + esc(it.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      } else {
        frame.innerHTML = '<div class="yt-soon"><svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg><b>영상 준비 중이에요</b><span>곧 쇼츠로 만나보실 수 있어요.</span></div>';
      }
      $('.yt-cap em', yt).textContent = (CATN[it.p.cat] || '') + ' · ' + (it.p.name.length > 0 ? 'SHORTS' : '');
      $('.yt-cap b', yt).textContent = it.title;
      $('.yt-cap a', yt).href = it.href;
    }
    function open(i) { show(i); yt.classList.add('on'); yt.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden'; }
    function close() { yt.classList.remove('on'); yt.setAttribute('aria-hidden', 'true'); frame.innerHTML = ''; document.documentElement.style.overflow = ''; }
    rail.addEventListener('click', function (e) {
      var a = e.target.closest('.sc'); if (!a) return;
      e.preventDefault(); if (moved) { moved = false; return; }
      open(+a.getAttribute('data-i'));
    });
    yt.addEventListener('click', function (e) { if (e.target.closest('[data-x]')) close(); });
    $('.yt-nav.prev', yt).addEventListener('click', function () { show(cur - 1); });
    $('.yt-nav.next', yt).addEventListener('click', function () { show(cur + 1); });
    document.addEventListener('keydown', function (e) {
      if (!yt.classList.contains('on')) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
    });
    /* follow the floating filter (period + price basis) */
    document.addEventListener('tnc-filter', function () {
      $$('.sc', rail).forEach(function (c) {
        var it = items[+c.getAttribute('data-i')], p = it.p, v;
        if (!p.by) v = p.fixed; else { var row = window.TNC_pick(p.by, window.TNC_STATE.period).row; v = window.TNC_STATE.mode === 'card' ? row[2] : row[1]; }
        $('.cap strong', c).textContent = won(v);
      });
    });
    /* optional: channel link */
    var more = $('#ytMore'); if (more && T.YT_CHANNEL) { more.href = T.YT_CHANNEL; more.hidden = false; }
  })();

  /* ---------- product list (SK compare): category tabs here, period + price basis come from the floating filter ---------- */
  var grid = $('#pg'); if (!grid) return;
  var cat = 'all', started = false;

  function visible() { return T.PRODUCTS.filter(function (p) { return cat === 'all' ? p.f : p.cat === cat; }); }
  function cardHtml(p, i) {
    return '<a class="pcard" style="animation-delay:' + (i * 45) + 'ms" href="' + (p.id === 'G050304' ? 'view.html?goods=' : SHOP + 'goods_view.php?goods=') + p.id + '" data-id="' + p.id + '">' +
      '<div class="im">' + (p.bd ? '<span class="bd">' + p.bd + '</span>' : '') + '<img loading="lazy" alt="" src="' + IMG + p.img + '"></div>' +
      '<p class="br"><span class="bn"></span>' + mdl(p.id) + '</p><p class="nm"><em>[렌탈]</em>' + esc(p.name) + '</p>' +
      '<div class="pbox"><s class="st">월 <span data-r="st">0</span>원</s>' +
      '<div class="pl"><b class="pct"><span data-r="pct">0</span>%</b><strong class="mp">월 <span data-r="mp">0</span><small>원</small></strong></div></div>' +
      '<div class="tg"><span data-r="per"></span><span class="pm" data-r="pm" hidden></span>' + (p.kind ? '<span>' + p.kind + '</span>' : '') + '</div></a>';
  }
  function render() {
    grid.innerHTML = visible().map(cardHtml).join('');
    apply(false);
  }

  /* price rules
     card mode   : headline = 제휴카드 적용가, struck = 월 렌탈료, % = 월 렌탈료 대비 할인율
     rental mode : headline = 월 렌탈료,      struck = 정상가(있을 때),  % = 정상가 대비 할인율 */
  function calc(p) {
    var r = { st: 0, mp: 0, pct: 0, per: '', pm: '' };
    if (!p.by) { r.mp = p.fixed; r.per = '기간 상담'; r.noSt = true; r.noPct = true; return r; }
    var pk = window.TNC_pick(p.by, S.period), row = pk.row, normal = row[0], month = row[1], card = row[2];
    r.per = '의무 ' + pk.k + '개월'; r.pm = row[3];
    if (S.mode === 'card') { r.mp = card; r.st = month; r.pct = month ? Math.round((month - card) / month * 100) : 0; }
    else { r.mp = month; r.st = normal; r.pct = normal ? Math.round((normal - month) / normal * 100) : 0; }
    r.noSt = !r.st || r.st <= r.mp; r.noPct = r.noSt || r.pct <= 0;
    return r;
  }
  function apply(animate) {
    $$('.pcard', grid).forEach(function (el) {
      var p = T.PRODUCTS.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0], r = calc(p);
      el.classList.toggle('nost', !!r.noSt);
      el.classList.toggle('nopct', !!r.noPct);
      setNum($('[data-r=mp]', el), r.mp, animate);
      setNum($('[data-r=st]', el), r.st, animate);
      setNum($('[data-r=pct]', el), r.pct, animate);
      $('[data-r=per]', el).textContent = r.per;
      var pm = $('[data-r=pm]', el); pm.textContent = r.pm; pm.hidden = !r.pm;
    });
  }
  document.addEventListener('tnc-filter', function () { apply(true); });

  /* tabs */
  var tabs = $('#ptabs');
  tabs.innerHTML = T.CATS.map(function (c) { return '<button type="button" data-c="' + c.k + '"' + (c.k === 'all' ? ' class="on"' : '') + '>' + c.t + '</button>'; }).join('');
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.getAttribute('data-c') !== 'all') { location.href = 'list.html?c=' + b.getAttribute('data-c'); return; }   /* category tab -> its list page */
    $$('button', tabs).forEach(function (x) { x.classList.toggle('on', x === b); });
    cat = b.getAttribute('data-c'); render();
    $$('[data-v]', grid).forEach(function (n) { n.setAttribute('data-v', 0); });   /* new cards count up from 0 */
    apply(true);
  });

  render();
  /* first time the list scrolls into view: count up from 0 */
  if (io && 'IntersectionObserver' in window) {
    var once = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !started) {
        started = true; once.disconnect();
        $$('[data-v]', grid).forEach(function (n) { n.setAttribute('data-v', 0); });
        apply(true);
      }
    }, { threshold: .25 });
    once.observe(grid);
  }
})();
