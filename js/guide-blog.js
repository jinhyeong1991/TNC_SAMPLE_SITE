/* =========================================================
   가이드 카드 → 블로그형 팝업
   - 메인 "선택이 어려운 당신을 위한 가이드" 카드(data-blog)를 누르면 팝업으로 제품 이야기를 보여 준다.
   - 글은 티앤씨 에디터가 정리한 가이드 형식이다. 실제 고객 후기처럼 꾸미지 않는다.
   - 제품 정보(크기·기능·관리 방식)는 각 상품 상세페이지의 공식 소개 내용 기준.
   - 가격은 js/data-sk.js의 기본 월 렌탈료 / 제휴카드 할인가 (조건에 따라 달라짐).
   ========================================================= */
(function () {
  var GIMG = 'https://devadmin.tncrental.co.kr//uploads/goods/';
  var SHOP = 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=';

  var POSTS = {
    onecock: {
      g: 'G050304', color: '#E8F0FF', tag: 'ICE & WATER', read: 3,
      name: 'SK매직 원코크 플러스 얼음물 정수기', model: 'WPU-IAC425',
      title: '버튼 한 번이면, 얼음과 물이 한 잔에 같이 담겨요',
      lead: '얼음 따로, 물 따로 받던 습관을 바꿔 주는 정수기예요. 원코크 플러스는 버튼 하나로 얼음과 물을 동시에 내려 줍니다.',
      cover: GIMG + 'G050304/6gRgb3IuDJ.png',
      blocks: [
        { h: '컵 하나, 버튼 하나', p: '퇴근하고 들어와 시원한 물 한 잔이 생각날 때, 얼음칸을 열고 다시 물을 받을 필요가 없어요. 원코크 플러스는 <b>버튼 한 번으로 얼음과 물을 함께 출수</b>해서 바로 시원한 한 잔이 완성돼요.' },
        { imgs: [[GIMG + 'G050304/4nOax0scy1.png', '그레이 컬러, 따뜻한 원목 주방에도 잘 어울려요'], [GIMG + 'G050304/uyU4gOLTvb.png', '화이트 컬러는 밝은 주방에 깔끔하게']] },
        { h: '얼음은 취향대로 단단하게, 넉넉하게', p: '얼음이 빨리 녹는 게 싫은 날엔 <b>단단 모드</b>, 손님이 와서 얼음이 많이 필요한 날엔 <b>넉넉 모드</b>. 그날 쓰임에 맞춰 제빙 방식을 고를 수 있어요.' },
        { h: '얼음정수기인데 자리는 적게', p: '크기는 <b>245 × 482 × 515mm</b>의 데스크형이에요. 얼음정수기는 크다는 생각과 달리 조리대 한쪽에 자연스럽게 놓이는 크기예요.' },
        { quote: '얼음과 물을 한 번에. 매일 쓰는 동작 하나를 줄여 주는 정수기예요.' }
      ],
      fit: ['아이스 음료를 자주 마시는 집', '손님이 자주 오는 집, 얼음이 넉넉해야 하는 날이 많은 집', '얼음정수기는 갖고 싶지만 주방이 넓지 않은 집'],
      chips: ['데스크형', '245×482×515mm', '셀프 필터 4개월', '방문 케어 6개월'],
      price: 39000, card: 16000
    },
    newmini: {
      g: 'G050306', color: '#FFE8EC', tag: 'SLIM OBJET', read: 2,
      name: 'SK매직 뉴미니 정수기', model: 'WPU-PBC204',
      title: '폭 9cm, 주방에 놓는 작은 오브제',
      lead: '정수기가 주방 풍경을 바꿀 수도 있어요. 뉴미니는 폭 9cm의 초슬림 몸체와 부드러운 컬러로 인테리어 소품처럼 자리 잡는 정수기예요.',
      cover: GIMG + 'G050306/R7qRXVz87V.png',
      blocks: [
        { h: '자리를 거의 차지하지 않는 9cm', p: '조리대가 좁아서 정수기를 망설였다면 뉴미니를 먼저 보세요. <b>폭 9cm의 초슬림 디자인</b>이라 커피머신 옆, 싱크대 한쪽 같은 틈새에도 들어가요.' },
        { imgs: [[GIMG + 'G050306/gxiRfsuPsu.png', '소프트 핑크'], [GIMG + 'G050306/e6Ur3AoLfg.png', '파스텔 블루'], [GIMG + 'G050306/vNGyRRZhCo.png', '내추럴 화이트']] },
        { h: '우리 집에 맞는 컬러를 고르는 재미', p: '<b>파스텔 블루, 소프트 핑크, 내추럴 화이트</b> 세 가지 컬러가 있어요. 주방 타일이나 소품 색에 맞춰 고르면 정수기가 하나의 포인트가 돼요.' },
        { h: '부담 없이 시작하기', p: '72개월 계약 시 <b>등록비와 설치비가 전액 면제</b>돼요. 첫 정수기, 자취 첫 집처럼 가볍게 시작하고 싶을 때 잘 맞아요.' },
        { quote: '작아서 좋은 정수기. 공간도, 시작하는 마음도 가볍게.' }
      ],
      fit: ['조리대가 좁은 원룸·오피스텔', '인테리어 톤을 맞추고 싶은 신혼집', '깨끗한 정수만 있으면 충분한 1~2인 가구'],
      chips: ['폭 9cm 초슬림', '컬러 3종', '정수 전용', '72개월 등록·설치비 면제'],
      price: 13900, card: 0
    },
    wiggle: {
      g: 'G050303', color: '#FFF1DC', tag: 'DAISY KITCHEN', read: 2,
      name: 'SK매직X위글위글 초소형 직수 냉온정수기', model: 'WPU-JAC104',
      title: '아침마다 데이지가 반겨 주는 주방',
      lead: '위글위글과 함께 만든 초소형 직수 냉온정수기예요. 기능은 그대로, 주방에 웃음 한 송이를 더해 줘요.',
      cover: 'images/slides/slide-03.jpg',
      blocks: [
        { h: '보기만 해도 기분 좋아지는 디자인', p: '라이프스타일 브랜드 <b>위글위글과 협업한 데이지 디자인</b>이에요. 물 마시러 갈 때마다 눈에 들어오는 작은 꽃 한 송이가 주방 분위기를 밝게 바꿔 줘요.' },
        { imgs: [[GIMG + 'G050303/6Q3HoTGrFU.png', '파스텔 톤 공간과 특히 잘 어울려요'], [GIMG + 'G050303/49jYhlnaWF.gif', '정면에서 보이는 데이지 포인트']] },
        { h: '폭 164mm, 작지만 냉수·온수까지', p: '폭 <b>164mm</b>의 초소형 크기라 공간 활용도가 높아요. 작은 몸체에 <b>직수 방식의 냉수·온수·정수</b>를 모두 담았어요.' },
        { h: '관리는 내 생활에 맞게', p: '<b>4개월 주기 셀프 필터 관리</b>와 <b>12개월 방문 관리</b> 중에서 고를 수 있어요. 직접 챙기는 게 편한 분도, 맡기는 게 편한 분도 맞춰 쓸 수 있어요.' },
        { quote: '매일 보는 물건이라면, 볼 때마다 기분 좋은 쪽으로.' }
      ],
      fit: ['주방을 밝고 귀엽게 꾸미고 싶은 집', '작은 크기에 냉온수까지 원하는 집', '주방이 작은 1~2인 가구'],
      chips: ['직수 냉온정', '폭 164mm', '셀프 필터 4개월', '방문 관리 12개월 선택'],
      price: 26000, card: 3000
    },
    twowater: {
      g: 'G050263', color: '#E3F5EB', tag: 'TWO WATER', read: 2,
      name: 'SK매직 투워터 냉온정수기', model: 'WPU-MAC306S',
      title: '한 대로 두 가지 물을 즐기는 방법',
      lead: '깔끔한 스프링 화이트 디자인의 냉온정수기예요. 컴팩트한 크기에 냉수와 온수를 모두 담아 주방을 단정하게 지켜 줘요.',
      cover: 'images/slides/slide-04.jpg',
      blocks: [
        { h: '스프링 화이트, 어디에 두어도 단정하게', p: '<b>스프링 화이트</b> 컬러의 둥근 실루엣이라 주방, 거실, 사무실 어디에 두어도 튀지 않아요. 크기도 <b>컴팩트</b>해서 공간 활용도가 좋아요.' },
        { imgs: [[GIMG + 'G050263/UMgWImN3RS.png', '테이블 위에 두어도 부담 없는 크기'], [GIMG + 'G050263/pIPXgwiST5.png', '옆에서 본 모습, 깊이도 컴팩트하게']] },
        { h: '한 대로 시원한 물, 따뜻한 물', p: '한여름엔 시원한 냉수, 아침엔 따뜻한 차 한 잔. <b>냉수·온수·정수</b>를 한 대로 해결해요.' },
        { h: '위생 관리는 두 겹으로', p: '<b>4개월 주기 셀프 필터 교체</b>와 <b>6개월 방문 케어</b>를 함께 받아요. 6년 약정 시에는 <b>설치비와 등록비가 면제</b>돼요.' },
        { quote: '눈에 띄지 않게, 그러나 매일 든든하게.' }
      ],
      fit: ['깔끔한 화이트 인테리어를 좋아하는 집', '냉수와 온수를 모두 자주 쓰는 집', '셀프 관리와 방문 관리를 함께 받고 싶은 분'],
      chips: ['냉온정', '스프링 화이트', '셀프 필터 4개월', '방문 케어 6개월'],
      price: 32900, card: 9900
    },
    megamini: {
      g: 'G050262', color: '#E8F0FF', tag: 'MEGA ICE', read: 3,
      name: 'SK매직 MEGA ICE 얼음 정수기 mini', model: 'WPU-IAC606S',
      title: '작은 몸에 담은, 크고 단단한 얼음',
      lead: '얼음은 커야 맛있다고 생각하는 분께. MEGA ICE mini는 슬림한 데스크형 몸체에서 동급 최대 크기의 얼음을 만들어요.',
      cover: 'images/slides/slide-01.jpg',
      blocks: [
        { h: '동급 최대 11g, 천천히 녹는 얼음', p: 'SK매직 기술로 만든 <b>크고 단단한 고퀄리티 얼음</b>이에요. MEGA ICE mini는 <b>동급 최대 11g</b> 얼음을 만들어서 아이스 아메리카노 한 잔을 끝까지 시원하게 즐길 수 있어요.' },
        { imgs: [[GIMG + 'G050262/BYAodqydGm.png', '타일 주방에 놓은 모습'], [GIMG + 'G050262/f6gDLv63H2.png', '베이지 톤 공간과도 잘 어울려요']] },
        { h: '폭 195mm, 얼음정수기의 크기를 줄이다', p: '얼음정수기는 크다는 공식을 깬 <b>195mm의 슬림한 데스크형</b>이에요. 작은 주방에서도 얼음정수기를 들일 수 있어요.' },
        { h: '깨끗함은 필터부터', p: '<b>복합나노PAC필터</b>를 적용했어요. 관리는 <b>셀프관리</b>와 <b>방문 서비스</b> 중에서 고를 수 있어요.' },
        { quote: '작지만 시원하게, 얼음은 더 가까이.' }
      ],
      fit: ['얼음 크기와 단단함이 중요한 분', '홈카페를 즐기는 집', '주방은 작지만 얼음정수기를 원하는 집'],
      chips: ['얼음 11g (동급 최대)', '폭 195mm 데스크형', '복합나노PAC필터', '셀프·방문 관리 선택'],
      price: 36900, card: 13900
    }
  };

  var ORDER = ['onecock', 'newmini', 'wiggle', 'twowater', 'megamini'];
  function won(n) { return n.toLocaleString('ko-KR'); }

  /* ---------- 팝업 틀 ---------- */
  var modal = document.createElement('div');
  modal.className = 'gb';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="gb-dim" data-x></div>' +
    '<article class="gb-box" role="dialog" aria-modal="true" aria-labelledby="gbTitle" tabindex="-1">' +
      '<button class="gb-x" type="button" data-x aria-label="닫기"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="gb-scroll"><div class="gb-progress"><i></i></div><div class="gb-body"></div></div>' +
    '</article>';
  document.body.appendChild(modal);
  var box = modal.querySelector('.gb-box'), scroller = modal.querySelector('.gb-scroll'), body = modal.querySelector('.gb-body'), bar = modal.querySelector('.gb-progress i');
  var lastFocus = null;

  function render(key) {
    var p = POSTS[key];
    var html =
      '<header class="gb-hero" style="--gb-bg:' + p.color + '">' +
        '<img class="gb-cover" src="' + p.cover + '" alt="">' +
        '<div class="gb-hero-tx">' +
          '<span class="gb-tag">' + p.tag + '</span>' +
          '<h2 id="gbTitle">' + p.title + '</h2>' +
          '<div class="gb-meta"><span class="gb-av">T</span><span><b>티앤씨 렌탈 가이드</b><small>에디터 노트 · ' + p.read + '분 읽기</small></span></div>' +
        '</div>' +
      '</header>' +
      '<div class="gb-content">' +
        '<p class="gb-lead">' + p.lead + '</p>' +
        '<div class="gb-prod"><img src="' + document.querySelector('[data-blog="' + key + '"] .pi img').src + '" alt=""><div><small>오늘의 제품</small><b>' + p.name + '</b><span>' + p.model + '</span></div></div>';
    p.blocks.forEach(function (b) {
      if (b.h) html += '<h3>' + b.h + '</h3>';
      if (b.p) html += '<p>' + b.p + '</p>';
      if (b.imgs) html += '<div class="gb-gal n' + b.imgs.length + '">' + b.imgs.map(function (im) { return '<figure><img loading="lazy" src="' + im[0] + '" alt=""><figcaption>' + im[1] + '</figcaption></figure>'; }).join('') + '</div>';
      if (b.quote) html += '<blockquote>' + b.quote + '</blockquote>';
    });
    html +=
        '<section class="gb-fit"><h4>이런 집에 잘 맞아요</h4><ul>' + p.fit.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul></section>' +
        '<div class="gb-chips">' + p.chips.map(function (c) { return '<span>#' + c.replace(/\s+/g, '') + '</span>'; }).join('') + '</div>' +
        '<section class="gb-price">' +
          '<div><small>월 렌탈료</small><b>' + won(p.price) + '<em>원</em></b></div>' +
          '<div class="hl"><small>제휴카드 할인 시</small><b>' + won(p.card) + '<em>원</em></b></div>' +
          '<p>의무사용기간·관리 방식·카드 실적에 따라 금액이 달라져요. 정확한 금액은 상세페이지에서 확인해 주세요.</p>' +
          '<div class="gb-cta"><a class="gb-go" href="' + SHOP + p.g + '" target="_blank" rel="noopener">상세페이지 보기</a><button class="gb-consult" type="button">간편상담 신청</button></div>' +
        '</section>' +
        '<nav class="gb-more"><h4>다른 가이드도 읽어 보세요</h4><div>' +
          ORDER.filter(function (k) { return k !== key; }).map(function (k) {
            return '<button type="button" data-go="' + k + '" style="--gb-bg:' + POSTS[k].color + '"><img src="' + document.querySelector('[data-blog="' + k + '"] .pi img').src + '" alt=""><span><small>' + POSTS[k].tag + '</small>' + POSTS[k].title + '</span></button>';
          }).join('') +
        '</div></nav>' +
      '</div>';
    body.innerHTML = html;
    scroller.scrollTop = 0;
    bar.style.width = '0%';
  }

  function open(key) {
    if (!POSTS[key]) return;
    lastFocus = document.activeElement;
    render(key);
    modal.classList.add('on');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { box.focus(); }, 50);
  }
  function close() {
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* 카드 클릭 → 팝업 (새 탭으로 열기·가운데 클릭은 그대로 상세페이지) */
  document.querySelectorAll('[data-blog]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(a.getAttribute('data-blog'));
    });
  });
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-x]')) { close(); return; }
    var go = e.target.closest('[data-go]');
    if (go) { render(go.getAttribute('data-go')); return; }
    if (e.target.closest('.gb-consult')) {
      close();
      var c = document.querySelector('.hd [data-open-consult]');
      if (c) setTimeout(function () { c.click(); }, 150);
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('on')) close(); });
  /* 읽은 만큼 위쪽 진행 막대 */
  scroller.addEventListener('scroll', function () {
    var max = scroller.scrollHeight - scroller.clientHeight;
    bar.style.width = (max > 0 ? scroller.scrollTop / max * 100 : 0) + '%';
  }, { passive: true });
})();
