/* Main banner data (Coway-style big slide at the top of the page).
   pc   = PC image 1320 x 462  (shown at 462px high, cropped from the center on narrower screens)
   mo   = mobile image 670 x 864 (shown at about 335 x 432)
   video = optional mp4 instead of the PC image (pc is used as its poster)
   sub / title = HTML copy on top of the image (title may contain <br>; each line fades in on its own)
                 -> keep that area of the image empty. Leave both out for an image that already has its text.
                 PC: left 120px, vertically centered, about 420px wide / mobile: top-left 70 x 60 (in the 670 x 864 file)
   theme: 'white' for white copy and controls on dark images (default: dark)
   Images live in images/main-banner/ (pc-0N.jpg / mo-0N.jpg). */
window.TNC_MAIN_BANNER = [
  { pc: 'images/main-banner/pc-01.jpg', mo: 'images/main-banner/mo-01.jpg', theme: 'white', alt: '난 쉽게 녹지 않아 MEGA ICE - SK매직 MEGA ICE 얼음정수기', href: 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=G050261' },
  { pc: 'images/main-banner/pc-02.jpg', mo: 'images/main-banner/mo-02.jpg', sub: '하나의 정수기 두개의 물', title: '오늘은, 미네랄 진하게<br>SK매직 투워터 정수기', href: 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=G050263' },
  { pc: 'images/main-banner/pc-03.jpg', mo: 'images/main-banner/mo-03.jpg', sub: '원코크 플러스 얼음물 정수기', title: '고이는 물 없이 100% 직수<br>SK매직이 만든 직수 얼음', href: 'https://sk.tncrental.co.kr/shop/goods_view.php?goods=G050304' },
  { pc: 'images/main-banner/pc-04.jpg', mo: 'images/main-banner/mo-04.jpg', sub: '오래 앉아 일하는 직장인 주목!', title: '뒤! 확실히<br>봐드릴게여', href: 'https://sk.tncrental.co.kr/shop/goods.php?cate1=CA0089&depth=1' },
  { pc: 'images/main-banner/pc-05.jpg', mo: 'images/main-banner/mo-05.jpg', sub: '환기가 어려운 겨울철', title: '우리 아이 웃게하는<br>실내 안심 공기', href: 'https://sk.tncrental.co.kr/shop/goods.php?cate1=CA0088&depth=1' }
];
