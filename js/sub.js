/* Sub pages: 이벤트 / 카드혜택 / 공지사항. body[data-page] picks the page.
   Data copied from sk.tncrental.co.kr (event.php · card.php + card_view.php · notice.php + notice_view.php), 2026-10-23.
   Detail pages (이벤트 상세, 카드 상세) still open on the shop; 공지 bodies are shown here in an accordion. */
(function () {
  'use strict';
  var SHOP = 'https://sk.tncrental.co.kr/shop/', UP = 'https://devadmin.tncrental.co.kr//uploads/';
  var page = document.body.getAttribute('data-page');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function won(n) { return n.toLocaleString('ko-KR'); }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function day(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  /* reveal: add .seen once an element scrolls into view (bars fill, etc.) */
  function onSeen(els) {
    if (!('IntersectionObserver' in window) || reduced) { els.forEach(function (e) { e.classList.add('seen'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('seen'); io.unobserve(x.target); } }); }, { threshold: .3 });
    els.forEach(function (e) { io.observe(e); });
  }
  function stagger(els) { els.forEach(function (e, i) { e.classList.add('sp-in'); e.style.animationDelay = Math.min(i, 11) * 45 + 'ms'; }); }

  /* ================= 카드혜택 ================= */
  /* tiers = [[전월 실적(만원), 월 할인한도(원), 기본(원) or 0 when no promo split]] */
  var CARDS = [
    { c: 190, n: '현대카드', img: 'card_190_dndmh.png', apply: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc?cardflag=RC&cardWcd=SKIHC', t: [[40, 13000, 8000], [80, 16000, 12000], [120, 19000, 16000]] },
    { c: 180, n: '신한카드', img: 'card_180_KNKe2.png', apply: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1236413_2207.html', t: [[30, 15000, 12000], [70, 18000, 15000], [150, 28000, 25000]] },
    { c: 130, n: '우리카드', img: 'card_130_3mimQ.png', apply: 'https://m.wooricard.com/dcmw/yh1/crd/crd01/M1CRD101S02.do?recomNo=102859', t: [[30, 22000, 10000], [70, 22000, 15000], [120, 25000, 20000]] },
    { c: 125, n: '플러스 하나카드', img: 'card_125_8E1aE.png', apply: 'https://www.hanacard.co.kr/OPI42000000D.web?schID=pcd&mID=PI41015414P&CD_PD_SEQ=17400', t: [[30, 13000, 0], [100, 18000, 0], [150, 25000, 0]] },
    { c: 208, n: '롯데카드', img: 'card_208_coAtE.png', apply: 'https://www.lottecard.co.kr/app/LPCDADB_V100.lc?vtCdKndC=P15883-A15883', t: [[40, 23000, 8000], [80, 25000, 12000], [160, 27000, 24000]] },
    { c: 51, n: 'KJ카드', img: 'card_51_peuHe.png', apply: 'https://www.kjbank.com/ib20/mnu/FPMCARD020103?ib20_wc=FPMCARD050102V10:FPMCARD050102V20&ib20_cur_mnu=FPMCARD020101&ib20_cur_wgt=FPMCARD020101V10&INBN_GDS_NO=CDR20201221001', t: [[30, 10000, 0], [70, 16000, 0], [120, 23000, 0]] },
    { c: 49, n: '삼성카드', img: 'card_49_aR75Q.png', apply: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1686&alncmpC=QISKMAGIC&affcode=QISKMAGIC1&webViewFirstPage=true', t: [[30, 20000, 7000], [70, 22000, 10000], [120, 24000, 13000]] },
    { c: 46, n: 'KB국민 올림카드', img: 'card_46_zu54O.png', apply: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=04418&solicitorcode=7024418000', t: [[30, 22000, 11000], [70, 22000, 15000], [100, 22000, 20000]] }
  ];
  var SPENDS = [0, 30, 40, 70, 80, 100, 120, 150, 160];   /* slider stops = every threshold that changes something */
  function maxOf(k) { return k.t[k.t.length - 1][1]; }
  function at(k, s) { var v = 0, hit = -1; k.t.forEach(function (r, i) { if (s >= r[0]) { v = r[1]; hit = i; } }); return { v: v, i: hit }; }
  function cardImg(k) { return UP + 'card/1007/' + k.img; }

  function cardPage() {
    var top = CARDS.reduce(function (a, k) { return Math.max(a, maxOf(k)); }, 0);
    $('#cbMax').innerHTML = won(top) + '<em>원</em>';
    $('#cbCount').innerHTML = CARDS.length + '<em>종</em>';
    $('#cbFan').innerHTML = [1, 4, 0, 6].map(function (i) { return '<img alt="" src="' + cardImg(CARDS[i]) + '">'; }).join('');

    var grid = $('#cbGrid'), rank = $('#cbRank'), range = $('#cbRange'), out = $('#cbOut');
    grid.innerHTML = CARDS.map(function (k) {
      var mx = maxOf(k), promo = k.t.some(function (r) { return r[2]; });
      return '<article class="cb-card" data-c="' + k.c + '"><div class="im"><img loading="lazy" alt="SK인텔릭스 ' + esc(k.n) + '" src="' + cardImg(k) + '"></div>' +
        '<p class="br">SK인텔릭스</p><h3>' + esc(k.n) + '</h3>' +
        '<p class="mx">월 최대 청구할인<b>' + won(mx) + '원</b></p>' + (promo ? '<span class="pm">10월 추가 프로모션 포함</span>' : '') +
        '<div class="cb-tiers">' + k.t.map(function (r) {
          return '<div class="cb-tier"><span>전월 ' + r[0] + '만원↑</span><i><span style="--w:' + (r[1] / top).toFixed(3) + '"></span></i><b>' + won(r[1]) + '원</b></div>';
        }).join('') + '</div>' +
        '<div class="cb-btns"><a href="card_view.html?code=' + k.c + '">상세보기</a><a class="ap" href="' + esc(k.apply) + '" target="_blank" rel="noopener">온라인신청</a></div></article>';
    }).join('');
    stagger($$('.cb-card', grid)); onSeen($$('.cb-card', grid));

    $('#cbTicks').innerHTML = SPENDS.map(function (s) { return '<span>' + (s ? s + '만' : '0') + '</span>'; }).join('');
    range.max = SPENDS.length - 1;
    function sim() {
      var s = SPENDS[+range.value];
      range.style.setProperty('--p', (+range.value / (SPENDS.length - 1) * 100) + '%');
      out.innerHTML = s ? '월 ' + s + '만원<small> 이상 사용 시</small>' : '실적을 선택하세요';
      var rows = CARDS.map(function (k) { return { k: k, r: at(k, s) }; }).sort(function (a, b) { return b.r.v - a.r.v; });
      var best = rows[0].r.v;
      rank.innerHTML = rows.map(function (x) {
        var b = best > 0 && x.r.v === best;
        return '<div class="cb-rk' + (b ? ' best' : '') + '">' + (b ? '<span class="crown">BEST</span>' : '') + '<img alt="" src="' + cardImg(x.k) + '"><div><span class="n">' + esc(x.k.n) + '</span>' +
          (x.r.v ? '<span class="v">월 ' + won(x.r.v) + '원</span>' : '<span class="v zero">실적 미달</span>') + '</div></div>';
      }).join('');
      $$('.cb-card', grid).forEach(function (el) {
        var k = CARDS.filter(function (x) { return x.c === +el.getAttribute('data-c'); })[0], h = at(k, s).i;
        $$('.cb-tier', el).forEach(function (t, i) { t.classList.toggle('hit', i === h); });
      });
    }
    range.value = 2; range.addEventListener('input', sim); sim();
  }

  /* ================= 이벤트 ================= */
  /* [code, title, start, end, image path under uploads/event/] */
  var EVENTS = [
    [690, 'SK매직 10월 프로모션', '2026-09-29', '2026-10-29', 'EV00690/20UVNmjZJD.png'], [683, 'SK매직 9월 프로모션', '2026-08-31', '2026-09-28', 'EV00683/B0F4TPBYMA.png'],
    [667, 'SK매직 8월 프로모션', '2026-07-30', '2026-08-30', 'EV00667/TWD2aRde1H.png'], [657, 'SK매직 7월 프로모션', '2026-06-29', '2026-07-29', 'EV00657/D43OPupumQ.png'],
    [645, 'SK매직 6월 프로모션', '2026-05-28', '2026-06-29', 'EV00645/f2L72Q8tD6.png'], [637, 'SK매직 MEGA ICE 얼음 정수기', '2026-04-29', '2026-07-31', 'EV00637/W8DK1D5hVn.png'],
    [636, 'SK매직 5월 프로모션', '2026-04-28', '2026-05-29', 'EV00636/5ujzMEV2FG.png'], [630, 'SK매직 사업자전용', '2026-04-01', '2026-05-31', 'EV00630/rPqkcv9jIW.png'],
    [627, 'SK매직 4월 프로모션', '2026-03-30', '2026-04-28', 'EV00627/epGuffwfFm.png'], [618, 'SK매직 3월 프로모션', '2026-02-27', '2026-03-31', 'EV00618/8Frd0NZdFX.png'],
    [603, 'SK매직 2월 프로모션', '2026-01-30', '2026-02-28', 'EV00603/5uGFy416ba.png'], [590, 'SK매직 1월 프로모션', '2025-12-31', '2026-01-31', 'EV00590/VW7KVLilMH.png'],
    [578, 'SK매직 12월 프로모션', '2025-11-28', '2025-12-31', 'EV00578/DqcCoKdW4R.png'], [566, 'SK매직 11월 프로모션', '2025-10-31', '2025-11-30', 'EV00566/C5eXakdnaa.png'],
    [559, 'SK매직 10월 프로모션', '2025-09-29', '2025-10-31', 'EV00559/bWSlT8MglR.png'], [549, 'SK매직 9월 프로모션', '2025-08-29', '2025-09-30', 'EV00549/gonhN9XzSg.png'],
    [540, 'SK매직 8월 프로모션', '2025-07-31', '2025-08-31', 'EV00540/ba2MhC1jHc.png'], [526, 'SK매직 7월 프로모션', '2025-06-30', '2025-07-31', 'EV00526/zjGjXCmpIH.png'],
    [518, 'SK매직 6월 프로모션', '2025-05-30', '2025-06-30', 'EV00518/wSZXXdFYee.png'], [509, 'SK매직 5월 봄맞이 프로모션', '2025-04-30', '2025-05-31', 'EV00509/NfQ0MoLbd3.png'],
    [500, 'SK매직 4월 봄맞이 프로모션', '2025-03-31', '2025-04-30', 'EV00500/akX1Pzppe5.png'], [493, 'SK매직 봄맞이 꽃을 피우는 혜택', '2025-02-28', '2025-03-31', 'EV00493/LgSBZ7NGrZ.png'],
    [481, 'SK매직 02월 겨울 프로모션', '2025-01-31', '2025-02-28', 'EV00481/bQyaG3BCGq.png'], [471, 'SK매직 01월 겨울 프로모션', '2024-12-31', '2025-01-31', 'EV00471/5XeUXld6lt.png'],
    [461, 'SK매직 12월 겨울 프로모션', '2024-11-29', '2024-12-31', 'EV00461/D6wy9x6fUN.png'], [448, 'SK매직 11월 가을 프로모션', '2024-10-31', '2024-11-30', 'EV00448/EsD8I0Yogs.png'],
    [436, 'SK매직 10월 가을 프로모션', '2024-09-30', '2024-10-31', 'EV00436/hlSAtR5x4z.png'], [420, 'SK매직 9월 여름 프로모션', '2024-08-30', '2024-09-30', 'EV00420/qE4Z8Fwyi3.png'],
    [404, 'SK매직 8월 여름 프로모션', '2024-07-31', '2024-08-31', 'EV00404/YWKNtIluh1.png'], [396, 'SK매직 7월 결합할인', '2024-07-01', '2024-07-31', 'EV00396/AezxPzS2yD.png'],
    [386, 'SK매직 7월 여름 프로모션', '2024-06-28', '2024-07-31', 'EV00386/wu1KmGsAOw.png'], [362, 'SK매직 6월 여름 프로모션', '2024-05-31', '2024-06-30', 'EV00362/jvBDLgUSAG.png'],
    [342, 'SK매직 5월 봄 프로모션', '2024-04-30', '2024-05-31', 'EV00342/nSXSFKuqJh.png'], [322, 'SK매직 4월 봄 프로모션', '2024-03-29', '2024-04-30', 'EV00322/y8T384AXr6.png'],
    [303, 'SK매직 3월 봄 프로모션', '2024-02-29', '2024-03-31', 'EV00303/P9RM8yzFed.png'], [291, 'SK매직 2월 설 명절 프로모션', '2024-01-31', '2024-02-29', 'EV00291/TtZp8AZlUs.png'],
    [275, 'SK매직 희망찬 새해 1월 프로모션', '2023-12-29', '2024-01-31', 'EV00275/Ofc7ADHcFo.png'], [262, 'SK매직 12월 스스로 플러스 프로모션', '2023-11-30', '2023-12-31', 'EV00262/3HstZjXGVS.png'],
    [246, 'SK매직 11월 스스로 플러스 프로모션', '2023-10-31', '2023-11-30', 'EV00246/nX2hMNrvfD.png'], [237, 'SK매직 10월 스스로 플러스 프로모션', '2023-09-27', '2023-10-31', 'EV00237/w1kdOF93jH.png'],
    [226, 'SK매직 9월 스스로 플러스 프로모션', '2023-09-01', '2023-09-30', 'EV00226/FaRwdcDw8h.png'], [181, 'SK매직 7월 보상판매 혜택', '2023-07-01', '2023-07-31', 'EV00181/AtK7JIPTls.png'],
    [180, 'SK매직 7월 스스로 플러스 프로모션', '2023-07-01', '2023-07-31', 'EV00180/5nsZBE1OBW.png'], [173, 'SK매직 6월 보상판매 혜택', '2023-06-01', '2023-06-30', 'EV00173/ZWpvIX9pg9.jpg'],
    [172, 'SK매직 6월 스스로 플러스 프로모션', '2023-06-01', '2023-06-30', 'EV00172/Cy1DAjagUK.png'], [171, 'SK매직 5월 보상판매 혜택', '2023-05-01', '2023-05-31', 'EV00171/WOE34flGQH.jpg'],
    [149, 'SK매직 2월 핵심모델 할인 프로모션', '2023-02-01', '2023-02-28', 'EV00149/F3lcIv8aDv.jpg'], [148, 'SK매직 1월 핵심모델 할인 프로모션', '2023-01-01', '2023-01-31', 'EV00148/r66qNB9bkX.jpg'],
    [89, 'SK매직 12월 프로모션', '2022-12-01', '2022-12-31', 'EV00089/ImZwKQZnKj.jpg'], [88, 'SK매직 국민 직수 프로젝트', '2022-10-01', '2022-10-31', 'EV00088/ArIvQgmQ0f.png'],
    [87, 'SK매직 특별 사은품 증정 이벤트', '2023-01-01', '2023-01-31', 'EV00087/Tn62Rpieq3.png'], [86, 'SK매직 제휴카드 이벤트', '2023-01-01', '2023-01-31', 'EV00086/kPIyk5Ody6.png']
  ].map(function (r) { return { c: r[0], t: r[1], s: r[2], e: r[3], img: UP + 'event/' + r[4] }; });

  function eventPage() {
    var now = today(), STEP = 9;
    EVENTS.forEach(function (v) { v.live = day(v.s) <= now && now <= day(v.e); v.y = v.e.slice(0, 4); });
    function href(v) { return SHOP + 'event_view.php?code=' + v.c; }
    function pd(v) { return v.s.replace(/-/g, '.') + ' ~ ' + v.e.replace(/-/g, '.'); }

    /* featured = the live event ending soonest (falls back to the latest one) */
    var live = EVENTS.filter(function (v) { return v.live; }).sort(function (a, b) { return day(a.e) - day(b.e); });
    var f = live[0] || EVENTS[0], feat = $('#evFeat');
    if (live.length) {
      var left = Math.round((day(f.e) - now) / 864e5), total = Math.max(1, Math.round((day(f.e) - day(f.s)) / 864e5) + 1);
      feat.innerHTML = '<a class="im" href="' + href(f) + '"><img alt="' + esc(f.t) + '" src="' + f.img + '"></a><div class="tx"><span class="ev-live"><i></i>진행 중인 이벤트</span>' +
        '<h2>' + esc(f.t) + '</h2><p class="pd">' + pd(f) + '</p>' +
        '<div class="ev-dday"><b>' + (left ? 'D-' + left : 'D-DAY') + '</b><span>' + (left ? left + '일 후 종료돼요' : '오늘 마감이에요') + '</span></div>' +
        '<div class="ev-bar"><i style="--w:' + Math.min(1, (total - left) / total).toFixed(3) + '"></i></div>' +
        '<a class="go" href="' + href(f) + '">이벤트 자세히 보기 →</a></div>';
      onSeen([feat]);
    } else feat.hidden = true;

    var state = { tab: 'all', y: 'all', n: STEP }, grid = $('#evGrid'), more = $('#evMore');
    var years = EVENTS.reduce(function (a, v) { if (a.indexOf(v.y) < 0) a.push(v.y); return a; }, []);
    function count(fn) { return EVENTS.filter(fn).length; }
    $('#evTabs').innerHTML = [['all', '전체', count(function () { return true; })], ['live', '진행중', count(function (v) { return v.live; })], ['end', '종료', count(function (v) { return !v.live; })]]
      .map(function (t, i) { return '<button type="button" data-t="' + t[0] + '"' + (i ? '' : ' class="on"') + '>' + t[1] + '<em>' + t[2] + '</em></button>'; }).join('');
    $('#evYears').innerHTML = '<button type="button" data-y="all" class="on">모든 연도</button>' + years.map(function (y) { return '<button type="button" data-y="' + y + '">' + y + '</button>'; }).join('');
    function list() { return EVENTS.filter(function (v) { return (state.tab === 'all' || (state.tab === 'live') === v.live) && (state.y === 'all' || v.y === state.y); }); }
    function draw() {
      var all = list(), shown = all.slice(0, state.n);
      grid.innerHTML = shown.length ? shown.map(function (v) {
        return '<a class="ev-card' + (v.live ? '' : ' end') + '" href="' + href(v) + '"><span class="im"><img loading="lazy" alt="' + esc(v.t) + '" src="' + v.img + '"><span class="st">' + (v.live ? '진행중' : '종료') + '</span></span>' +
          '<h3>' + esc(v.t) + '</h3><p class="pd">' + pd(v) + '</p></a>';
      }).join('') : '<p class="ev-empty">조건에 맞는 이벤트가 없어요.</p>';
      stagger($$('.ev-card', grid));
      more.hidden = all.length <= state.n;
    }
    function chips(el, key, attr) {
      el.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', el).forEach(function (x) { x.classList.toggle('on', x === b); });
        state[key] = b.getAttribute(attr); state.n = STEP; draw();
      });
    }
    chips($('#evTabs'), 'tab', 'data-t'); chips($('#evYears'), 'y', 'data-y');
    $('button', more).addEventListener('click', function () { state.n += STEP; draw(); });
    draw();
  }

  /* ================= 공지사항 ================= */
  var NOTICES = [
    { c: 19, cat: '공지', pin: true, t: '법인/비영리/개인 사업자 렌탈 제한의 건', d: '2020-03-24', v: 1580,
      b: '<p><b>대상</b> : 사업체의 고유번호(등록번호)가 부여된 모든 사업장 (예: 병원, 임대업, 비영리단체, 종교시설, 숙박업소, 대학교 등)</p>' +
         '<p><b>1. 개인명의를 렌탈 계약자로 하여 사업장 내 설치 제한</b> (사업자등록상의 사업자명의가 아닌 정보)</p><ul>' +
         '<li class="no-ok">부동산 사무실에 대표 개인명의로 정수기 설치</li><li class="no-ok">교회와 직접적인 연관이 없는 외부인(신도)의 정수기 기증</li>' +
         '<li class="no-ok">학교 및 부대시설(체육관, 동아리방) 개인명의의 정수기 설치</li><li class="no-ok">아파트 관리사무실에 관리소장 개인명의로 설치</li></ul>' +
         '<p><b>2. 사업장명의를 렌탈 계약자로 한 사업장이 아닌 곳에 설치 제한</b></p><ul>' +
         '<li class="no-ok">사업자 지정 기숙시설 내 직원명의로 정수기 설치</li><li class="no-ok">사업자명의의 다중이용시설 안마의자를 자택 설치</li></ul>' +
         '<p>개업일 전 개인명의 선 설치 후 사업자로 명의이전 가능 · 기존 사업자 고객의 추가 렌탈 시를 제외한 예외 없음 (해약방어)</p>' },
    { c: 40, cat: '안내', t: '제휴카드 신청 방법', d: '2022-09-28', v: 12751,
      b: '<p>제휴카드를 활용하시면 렌탈사별로 제휴가 맺어진 신용카드 이용실적에 따라 <b>렌탈료의 일부를 할인</b> 받을 수 있어요. 렌탈사별 제휴카드 종류는 <b>카드혜택</b> 메뉴에서 확인하실 수 있습니다.</p>' +
         '<div class="nt-flow c3"><div><small>STEP 1</small><b>제휴카드 확인</b><p>신청할 제품의 렌탈사 제휴카드를 확인해요.</p></div>' +
         '<div><small>STEP 2</small><b>카드 신청 · 발급</b><p>카드사에 전화로 제휴카드를 신청하고 발급받아요.</p></div>' +
         '<div><small>STEP 3</small><b>렌탈사에 등록</b><p>렌탈사 콜센터로 전화해 결제카드 등록을 요청하면 끝!</p></div></div>' +
         '<a class="nt-link" href="card.html">제휴카드 혜택 보러가기 →</a>' },
    { c: 39, cat: '안내', t: '렌탈절차 안내', d: '2022-09-28', v: 7297,
      b: '<p>렌탈을 처음 이용하시는 분들을 위해 렌탈 절차를 안내해 드려요.</p><div class="nt-flow">' +
         '<div><small>01</small><b>상담 및 접수</b><p>전화 또는 상담요청으로 상담받고 원하는 모델을 신청해요.</p></div>' +
         '<div><small>02</small><b>해피콜 및 계약</b><p>렌탈사의 해피콜로 계약 내용을 확인해요.</p></div>' +
         '<div><small>03</small><b>설치</b><p>예정된 날짜에 배송 또는 설치기사님이 설치해 드려요.</p></div>' +
         '<div><small>04</small><b>렌탈료 수납</b><p>매월 신청하신 날짜에 자동이체로 수납돼요.</p></div>' +
         '<div><small>05</small><b>사후관리</b><p>A/S, 수납 문의는 해당 렌탈사로 연락해 주세요.</p></div></div>' },
    { c: 33, cat: '영상', t: 'SK매직 자가관리 스스로 정수기', d: '2020-11-03', v: 12412, yt: 'nkZprRv1caU' },
    { c: 23, cat: '영상', t: 'SK매직 TV광고영상', d: '2020-07-17', v: 1401, yt: 'G42lCfC5eWc' }
  ];

  function noticePage() {
    var state = { cat: '전체', q: '' }, list = $('#ntList');
    var cats = ['전체', '공지', '안내', '영상'];
    $('#ntCats').innerHTML = cats.map(function (c, i) {
      var n = c === '전체' ? NOTICES.length : NOTICES.filter(function (x) { return x.cat === c; }).length;
      return '<button type="button" data-c="' + c + '"' + (i ? '' : ' class="on"') + '>' + c + '<em>' + n + '</em></button>';
    }).join('');
    function body(x) {
      return x.yt ? '<div class="nt-video" data-yt="' + x.yt + '"></div>' : x.b;
    }
    function draw() {
      var q = state.q.trim().toLowerCase(), total = NOTICES.length;
      var rows = NOTICES.filter(function (x) { return (state.cat === '전체' || x.cat === state.cat) && (!q || x.t.toLowerCase().indexOf(q) >= 0); });
      list.innerHTML = rows.length ? rows.map(function (x) {
        var no = total - NOTICES.indexOf(x);
        return '<div class="nt-item" id="n' + x.c + '"><button class="nt-q" type="button" aria-expanded="false">' +
          '<span class="no">' + (x.pin ? '<span class="pin">공지</span>' : no) + '</span>' +
          '<span class="tt"><em>' + x.cat + '</em><b>' + esc(x.t) + '</b></span>' +
          '<span class="nt-meta"><span>' + x.d.replace(/-/g, '.') + '</span><span>조회 ' + won(x.v) + '</span></span>' +
          '<span class="ar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span></button>' +
          '<div class="nt-a"><div><div class="nt-body">' + body(x) + '</div></div></div></div>';
      }).join('') : '<p class="nt-empty">“' + esc(state.q) + '”에 해당하는 공지가 없어요.</p>';
      stagger($$('.nt-item', list));
    }
    function toggle(item, force) {
      var open = force !== undefined ? force : !item.classList.contains('open');
      item.classList.toggle('open', open); $('.nt-q', item).setAttribute('aria-expanded', open ? 'true' : 'false');
      var v = $('.nt-video', item);                          /* load the YouTube player only when opened */
      if (v) v.innerHTML = open ? '<iframe src="https://www.youtube.com/embed/' + v.getAttribute('data-yt') + '?rel=0" title="SK매직 영상" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>' : '';
    }
    list.addEventListener('click', function (e) { var q = e.target.closest('.nt-q'); if (q) toggle(q.parentElement); });
    $('#ntCats').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', $('#ntCats')).forEach(function (x) { x.classList.toggle('on', x === b); });
      state.cat = b.getAttribute('data-c'); draw();
    });
    $('#ntSearch').addEventListener('input', function (e) { state.q = e.target.value; draw(); });
    draw();
    var m = /^#n(\d+)$/.exec(location.hash), it = m && document.getElementById('n' + m[1]);   /* deep link: notice.html#n40 */
    if (it) { toggle(it, true); setTimeout(function () { it.scrollIntoView({ block: 'center' }); }, 60); }
  }

  /* ================= 카드 상세 (card_view.html?code=…) ================= */
  /* one guide/notice line -> HTML: [라벨] = chip, * = 계산 줄, ①②③ = 조건, ※ = 참고 */
  function guideLine(s) {
    var t = s.replace(/^ㆍ\s*/, ''), m;
    if ((m = /^\[([^\]]+)\]\s*(.*)$/.exec(t))) return '<p class="cv-l lb"><em>' + esc(m[1]) + '</em>' + esc(m[2]) + '</p>';
    if (/^\*\s/.test(t)) return '<p class="cv-l calc">' + esc(t.replace(/^\*\s*/, '')) + '</p>';
    if (/^[①-⑨]/.test(t)) return '<p class="cv-l cond">' + esc(t) + '</p>';
    if (/^※/.test(t)) return '<p class="cv-l note">' + esc(t) + '</p>';
    return '<p class="cv-l">' + esc(t) + '</p>';
  }
  function cardViewPage() {
    var code = +new URLSearchParams(location.search).get('code'), D = window.TNC_CARD_DETAIL || {};
    var k = CARDS.filter(function (x) { return x.c === code; })[0], d = D[code], hero = $('#cvHero');
    if (!k || !d) {
      hero.innerHTML = '<div class="cv-none"><b>카드 정보를 찾을 수 없어요.</b><a href="card.html">제휴카드 목록으로 →</a></div>';
      $$('.cv-only').forEach(function (e) { e.hidden = true; }); return;
    }
    document.title = 'SK인텔릭스 ' + k.n + ' | 티앤씨렌탈';
    $('#cvCrumb').textContent = k.n;
    var all = [].concat.apply([], d.sections.map(function (s) { return s.l; }));
    function info(re) { for (var i = 0; i < all.length; i++) { var m = re.exec(all[i].replace(/^ㆍ\s*/, '')); if (m) return m[1].trim(); } return ''; }
    var ars = info(/^ARS\s*:\s*(.+)$/), fee = info(/^연회비\s*:\s*(.+)$/);
    var pre = (d.pre[0] || '').replace(/^ㆍ\s*/, ''), promo = k.t.some(function (r) { return r[2]; });

    hero.innerHTML = '<div class="cv-visual"><img alt="SK인텔릭스 ' + esc(k.n) + '" src="' + UP + 'card/1007/' + d.img + '"></div>' +
      '<div class="cv-info"><p class="cv-br">SK인텔릭스 제휴카드</p><h1>' + esc(k.n) + '</h1>' +
      '<p class="cv-max">월 최대 청구할인<b>' + won(maxOf(k)) + '<small>원</small></b></p>' +
      (pre ? '<p class="cv-pm"><i></i>' + esc(pre) + '</p>' : (promo ? '<p class="cv-pm"><i></i>10월 추가 프로모션 포함</p>' : '')) +
      ((ars || fee) ? '<dl class="cv-kv">' + (fee ? '<div><dt>연회비</dt><dd>' + esc(fee) + '</dd></div>' : '') + (ars ? '<div><dt>카드사 ARS</dt><dd>' + esc(ars) + '</dd></div>' : '') + '</dl>' : '') +
      '<div class="cv-btns"><a class="ap" href="' + esc(k.apply) + '" target="_blank" rel="noopener">온라인신청<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>' +
      '<button type="button" class="ct" data-open-consult>카드 상담 신청</button></div></div>';

    /* tiers: total = base + promo, bars scaled to the card's top tier */
    var top = maxOf(k);
    $('#cvTiers').innerHTML = k.t.map(function (r, i) {
      var base = r[2] || r[1], add = r[2] ? r[1] - r[2] : 0;
      return '<div class="cv-tier"><span class="st">' + (i + 1) + '구간</span><p class="th">전월 실적 <b>' + r[0] + '만원</b> 이상</p>' +
        '<p class="tv">월 <b>' + won(r[1]) + '</b>원 할인</p>' +
        '<div class="cv-bar" style="--w:' + (r[1] / top).toFixed(3) + '"><i class="b" style="flex:' + base + '"></i>' + (add ? '<i class="p" style="flex:' + add + '"></i>' : '') + '</div>' +
        '<p class="tb">' + (add ? '<span class="k1">기본 ' + won(base) + '원</span><span class="k2">추가 프로모션 ' + won(add) + '원</span>' : '<span class="k1">기본 할인 ' + won(base) + '원</span>') + '</p></div>';
    }).join('');
    onSeen([$('#cvTiers')]);

    var g = $('#cvGuideSec');
    if (d.guide.length) $('#cvGuide').innerHTML = d.guide.map(guideLine).join(''); else g.hidden = true;

    $('#cvNotice').innerHTML = d.sections.map(function (s) {
      return '<details class="cv-acc"' + '><summary><b>' + esc(s.t) + '</b><span>' + s.l.length + '개 항목 · 눌러서 펼치기</span><i></i></summary><div class="cv-acc-b">' + s.l.map(guideLine).join('') + '</div></details>';
    }).join('');

    $('#cvOthers').innerHTML = CARDS.filter(function (x) { return x.c !== code; }).map(function (x) {
      return '<a class="cv-oc" href="card_view.html?code=' + x.c + '"><img loading="lazy" alt="" src="' + cardImg(x) + '"><span><b>' + esc(x.n) + '</b><em>월 최대 ' + won(maxOf(x)) + '원</em></span></a>';
    }).join('');
    stagger($$('.cv-oc'));
  }

  if (page === 'card') cardPage(); else if (page === 'cardview') cardViewPage(); else if (page === 'event') eventPage(); else if (page === 'notice') noticePage();
})();
