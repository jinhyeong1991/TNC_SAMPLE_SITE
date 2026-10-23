/* Main banner data (Coway-style big slide at the top of the page).
   pc   = PC image 1320 x 462  (shown at 462px high, cropped from the center on narrower screens)
   mo   = mobile image 670 x 864 (shown at about 335 x 432)
   video = optional mp4 instead of the PC image (pc is used as its poster)
   sub / title = HTML copy on top of the image (title may contain <br>) -> keep that area of the image empty
                 PC: left 120px, vertically centered, about 420px wide / mobile: top-left 70 x 60 (in the 670 x 864 file)
   theme: 'white' for white copy on dark images (default: dark copy)
   Placeholders live in images/main-banner/ - replace pc-0N / mo-0N with the real files (jpg/png/gif all fine). */
window.TNC_MAIN_BANNER = [
  { pc: 'images/main-banner/pc-01.svg', mo: 'images/main-banner/mo-01.svg', sub: '10월 가을 가전 특별전', title: '렌탈료 할인 · 면제<br>사은품까지 한 번에!', href: 'https://sk.tncrental.co.kr/shop/event.php' },
  { pc: 'images/main-banner/pc-02.svg', mo: 'images/main-banner/mo-02.svg', sub: '25g, 크고 단단한 얼음', title: 'MEGA ICE 얼음정수기<br>월 42,500원부터', href: 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=G050261' },
  { pc: 'images/main-banner/pc-03.svg', mo: 'images/main-banner/mo-03.svg', sub: '제휴카드 혜택', title: '제휴카드 하나로<br>월 렌탈료를 더 가볍게', href: 'https://sk.tncrental.co.kr/shop/card.php' },
  { pc: 'images/main-banner/pc-04.svg', mo: 'images/main-banner/mo-04.svg', sub: '올클린 디아트 공기청정기', title: '사계절 내내<br>우리 집 공기를 쾌적하게', href: 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=G036226' },
  { pc: 'images/main-banner/pc-05.svg', mo: 'images/main-banner/mo-05.svg', sub: '풀스텐 케어 비데', title: '매일이 상쾌한<br>우리 집 화장실', href: 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=G049786' },
  { pc: 'images/main-banner/pc-06.svg', mo: 'images/main-banner/mo-06.svg', sub: '사업자 전용관', title: '오직 사장님만을 위한<br>사업자 전용 렌탈 혜택', href: 'https://sk.tncrental.co.kr/shop/goods.php?cate1=CA0361&depth=1' }
];
