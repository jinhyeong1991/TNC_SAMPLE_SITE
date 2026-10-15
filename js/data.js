/* TNC rental main page - sample product data
   Source: sk.tncrental.co.kr product pages (as of 2026-10-15).
   by[period] = [정상가(list price, 0 = none), 월 렌탈료, 제휴카드 적용가, 프로모션]
   by = null  -> only a fixed monthly price is known (fixed) and no period options. */
window.TNC = {
  SHOP: 'https://sk.tncrental.co.kr/shop/',
  IMG: 'https://devadmin.tncrental.co.kr//uploads/goods/',
  PERIODS: [36, 48, 60, 72, 84],
  CATS: [
    { k: 'all',   t: '전체' },
    { k: 'water', t: '정수기' },
    { k: 'air',   t: '공기청정기' },
    { k: 'bidet', t: '비데' },
    { k: 'mat',   t: '매트리스/프레임' },
    { k: 'namuh', t: 'NAMUH' }
  ],
  /* optional: your own 9:16 poster images for the SHORTS rail, keyed by product id. e.g. { G050305: 'images/shorts/01.jpg' } */
  POSTERS: {},
  /* SHORTS (YouTube popup). yt = YouTube Shorts URL (or 11-char id). Leave '' until the video is uploaded.
     g = product id used for the card design / "제품 보러가기" link. title = optional card title override.
     YT_CHANNEL = your channel URL (shows a "YouTube 채널 →" link above the rail when filled). */
  YT_CHANNEL: 'https://www.youtube.com/@SKmagic_',
  SHORTS: [
    { yt: 'UopFLzx-lY4', g: 'G050305', title: 'MEGA ICE & mini 얼음정수기 × 변우석 메이킹필름' },
    { yt: 'up_D8IwjrzU', g: 'G050305', title: '원코크 플러스, 가장 건강한 얼음은 누구?' },
    { yt: 'ByFo9NSE-TU', g: 'G050305', title: '원코크 플러스, 얼음 공장의 비밀 30s' },
    { yt: '9PeKGk4YijI', g: 'G050305', title: '원코크 얼음물 정수기 · 겨울에도 얼음은 필수니까 (혼술편)' },
    { yt: 'BBMfQ86RdI4', g: 'G050305', title: '원코크 얼음물 정수기 · 겨울에도 얼음은 필수니까 (아아편)' },
    { yt: 'v27oGxrjFNA', g: 'G050307', title: '세상에 없던 혁신의 탄생, 초소형 직수 정수기' },
    { yt: 'hVdX5vmOsAY', g: 'G050307', title: '초소형 직수 정수기 출시' },
    { yt: '7gzNuhJjLb0', g: 'G050307', title: '세상이 인정한 사이즈의 혁신, 초소형 직수 정수기' },
    { yt: '2cJYn0mBD4g', g: 'G050307', title: '하나의 정수기, 두 개의 물 · 투워터 정수기' },
    { yt: 'PcxdBm7vjhw', g: 'G050303', title: '이렇게 작은 정수기 봤어? 초소형 직수정수기 탄생!' },
    { yt: '8l8WCbrg2-k', g: 'G050303', title: '10ml 원터치의 혁신, 초소형 직수 정수기' },
    { yt: 'FB6mOtZ2ajk', g: 'G050303', title: 'SK매직 × 위글위글 · 종로에 나타난 정수기?' },
    { yt: '2GrVz39xhNw', g: 'G050306', title: '실속 있는 혁신의 완성, 뉴미니 정수기' },
    { yt: 'OSFgz34wLgI', g: 'G050306', title: '실속 있는 위생의 완성, 뉴미니 정수기' },
    { yt: 'noYDORDldIQ', g: 'G050305', title: 'SK매직 × PSG · 그 순간 정수기 EP.6' }
  ],
  PRODUCTS: [
    { id: 'G050305', cat: 'water', f: 1, name: 'SK매직 원코크 플러스 얼음물 정수기', kind: '셀프관리', bd: '추천', img: 'G050305/Kfa9Zuk79g.gif',
      by: { 36: [59900, 54900, 31900, ''], 60: [56900, 49400, 26400, '6개월 반값'], 72: [55900, 47900, 24900, '15개월 반값'], 84: [54900, 46900, 23900, '15개월 반값'] } },
    { id: 'G050303', cat: 'water', f: 1, name: 'SK매직×위글위글 초소형 직수 냉온정수기', kind: '셀프관리', img: 'G050303/yckQ7nbMuC.png',
      by: { 36: [43900, 36900, 13900, ''], 60: [40900, 31400, 8400, '6개월 반값'], 72: [39900, 29900, 6900, '12개월 반값'], 84: [38900, 28400, 5400, '12개월 반값'] } },
    { id: 'G050307', cat: 'water', f: 1, name: 'SK매직 초소형 직수 냉정수기', kind: '셀프관리', bd: '인기', img: 'G050307/mj6mLYUQJo.png',
      by: { 36: [39900, 35900, 12900, ''], 60: [36900, 29400, 6400, '6개월 반값'], 72: [35900, 27900, 4900, '12개월 반값'], 84: [34900, 26900, 3900, '12개월 반값'] } },
    { id: 'G050306', cat: 'water', f: 1, name: 'SK매직 뉴미니 정수기', kind: '셀프관리', img: 'G050306/8iKt4EbOQV.gif',
      by: { 36: [0, 20900, 0, ''], 60: [0, 17900, 0, ''], 72: [0, 16900, 0, ''], 84: [0, 15900, 0, ''] } },
    { id: 'G050310', cat: 'air', f: 1, name: 'SK매직 올클린 25평형 공기청정기', kind: '셀프관리', bd: '인기', img: 'G050310/ziz3CkCS2y.png',
      by: { 36: [0, 33900, 10900, ''], 48: [0, 32900, 9900, ''], 60: [29900, 25900, 2900, '6개월 반값'], 72: [27900, 23900, 900, '6개월 반값'], 84: [26900, 22900, 0, '6개월 반값'] } },
    { id: 'G050309', cat: 'air', f: 1, name: 'SK매직 올클린 20평형 공기청정기', kind: '셀프관리', img: 'G050309/6rOXPGDqUb.png',
      by: { 36: [0, 29900, 6900, ''], 48: [0, 28900, 5900, ''], 60: [25900, 21900, 0, '6개월 반값'], 72: [23900, 19900, 0, '6개월 반값'], 84: [22900, 18900, 0, '6개월 반값'] } },
    { id: 'G050308', cat: 'air', f: 1, name: 'SK매직 올클린 15평형 공기청정기', kind: '셀프관리', img: 'G050308/U7tn5W18Cc.jpg',
      by: { 36: [0, 27900, 4900, ''], 48: [0, 26900, 3900, ''], 60: [23900, 19900, 0, '6개월 반값'], 72: [21900, 17900, 0, '6개월 반값'], 84: [20900, 16900, 0, '6개월 반값'] } },
    { id: 'G043352', cat: 'air', name: 'SK매직 올클린 디아트 22평형 펫 공기청정기', kind: '방문관리', img: 'G043352/lNHDcZRALe.png',
      by: { 36: [0, 39900, 16900, ''], 60: [0, 31900, 8900, ''], 72: [0, 29900, 6900, ''], 84: [0, 26900, 3900, ''] } },
    { id: 'G049786', cat: 'bidet', f: 1, name: 'SK매직 풀스텐 케어 비데 Basic (2개월 방문)', kind: '방문관리', bd: '추천', img: 'G049786/TVXcfQKY18.png',
      by: { 36: [0, 29900, 6900, ''], 60: [0, 26900, 3900, ''] } },
    { id: 'G046609', cat: 'bidet', name: 'SK매직 올클린 케어 비데 Basic (4개월 방문)', kind: '방문관리', bd: '반값', img: 'G046609/36L4AAePhx.png',
      by: { 36: [0, 26900, 3900, ''], 60: [0, 23900, 900, '6개월 반값'] } },
    { id: 'G042682', cat: 'bidet', f: 1, name: 'SK매직 풀스텐 케어 비데 Lite (12개월 방문)', kind: '방문관리', img: 'G042682/qckRlvHhF5.png',
      by: { 36: [0, 19900, 0, ''], 48: [0, 18900, 0, ''], 60: [0, 16900, 0, ''], 72: [0, 15900, 0, ''] } },
    { id: 'G045673', cat: 'mat', f: 1, name: 'SK매직 수납형 패브릭 프레임 Q', kind: '', bd: '추천', img: 'G045673/tC27QUAZuy.png', by: null, fixed: 19900 },
    { id: 'G045672', cat: 'mat', name: 'SK매직 수납형 패브릭 프레임 SS', kind: '', img: 'G045672/NFXiitHFLk.png', by: null, fixed: 17900 },
    { id: 'G045671', cat: 'mat', name: 'SK매직 PVC레더 헤드보드 프레임 K', kind: '', img: 'G045671/TXitiJcQOH.png', by: null, fixed: 20900 },
    { id: 'G047716', cat: 'namuh', name: 'SK인텔릭스 나무엑스 A1 + 에어센서 증정 (셀프관리)', kind: '셀프관리', bd: '신규', img: 'G047716/GAEqGKKat7.gif',
      by: { 36: [128900, 118900, 95900, ''], 48: [84900, 74900, 51900, ''], 60: [70900, 60900, 37900, ''], 72: [63900, 55900, 32900, ''] } }
  ]
};
