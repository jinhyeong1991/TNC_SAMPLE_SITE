/* =========================================================
   영상 띠배너 (SK매직 MEGA ICE 얼음정수기)
   - 화면에 들어오면 천천히 등장
   - PC: 마우스 오버(0.5초 유지) → 커지며 영상 + 라이브 리뷰 패널이 펼쳐지고 재생
         마우스가 떠나면 오버로 연 경우에만 닫힘 / 클릭하면 고정
   - 모바일: 탭하면 열리고 소리와 함께 재생, 다시 탭·닫기로 닫힘
   - 소리: 브라우저 정책상 사용자가 페이지를 한 번이라도 클릭·터치한 뒤에만
           소리 있는 자동 재생이 가능하다. 그 전에는 음소거로 재생하고 "소리 켜기" 버튼을 띄운다.
   ========================================================= */
(function () {
  var root = document.getElementById('vbanner');
  if (!root) return;

  var VIDEO_ID = root.getAttribute('data-video');
  var bar = root.querySelector('.vb-bar');
  var closeBtn = root.querySelector('.vb-close');
  var unmuteBtn = root.querySelector('.vb-unmute');
  var likeBtn = root.querySelector('.vb-like');
  var msgsBox = root.querySelector('.vb-msgs');
  var track = document.createElement('div');
  track.className = 'vb-track';
  msgsBox.appendChild(track);
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     라이브 리뷰 데이터
     ※ 지금은 화면 확인용 예시 문구다. 실제 오픈 전에는 반드시
       사이트의 실제 구매 후기(리뷰 게시판/DB)로 교체하고 SAMPLE을 false로 바꾼다.
       실제 고객이 쓰지 않은 후기를 진짜처럼 보여 주면 표시광고법 위반 소지가 있다.
     --------------------------------------------------------- */
  var SAMPLE = true;
  var REVIEWS = [
    ['김**', 5, '얼음 크기가 진짜 커요. 아이스 아메리카노 만들 때 최고예요'],
    ['이**', 5, '설치 기사님이 친절하게 설명해 주셨어요'],
    ['박**', 4, '디자인이 깔끔해서 주방이 넓어 보여요'],
    ['최**', 5, '얼음이 단단해서 금방 안 녹아요 👍'],
    ['정**', 5, '아이들이 얼음 꺼내 먹는 재미에 물을 더 많이 마셔요'],
    ['강**', 4, '제휴카드 할인 받으니 월 부담이 확 줄었어요'],
    ['조**', 5, '여름 지나도 계속 잘 쓰고 있어요'],
    ['윤**', 5, '렌탈 상담 받고 바로 신청했어요!'],
    ['장**', 4, '얼음 나오는 속도가 생각보다 빨라요'],
    ['임**', 5, '방문 관리 날짜 알림 와서 신경 쓸 게 없어요'],
    ['한**', 5, '냉수 온도 조절돼서 좋아요'],
    ['오**', 4, '소음이 거의 없어서 거실에 둬도 괜찮아요'],
    ['서**', 5, '부모님 댁에도 하나 더 신청하려고요'],
    ['신**', 5, '얼음 정수기 중에 제일 만족스러워요'],
    ['권**', 4, '처음엔 고민했는데 쓰면 쓸수록 좋네요'],
    ['황**', 5, '얼음 25g 진짜 크고 맛있어요 ㅎㅎ'],
    ['안**', 5, '상담원분이 기간별 요금 차이를 잘 알려 주셨어요'],
    ['송**', 4, '물맛이 깔끔해요'],
    ['류**', 5, '이번 달 행사가로 바로 신청 완료!'],
    ['홍**', 5, '홈카페 하시는 분들께 강추합니다'],
    ['전**', 4, '얼음통 청소가 편해요'],
    ['고**', 5, '이사하면서 새로 들였는데 대만족이에요'],
    ['문**', 5, '디자인 보고 반해서 신청했어요'],
    ['양**', 4, '배송이랑 설치가 빨랐어요'],
    ['손**', 5, '아침마다 얼음물 한 잔으로 시작해요'],
    ['배**', 5, '가족 모두 만족하는 제품이에요'],
    ['백**', 4, '렌탈 조건 비교해 보니 여기가 제일 좋았어요'],
    ['허**', 5, '친구 추천으로 왔는데 역시 좋네요']
  ];
  var AV_COLORS = ['#EA002C', '#F47725', '#3D7BF7', '#14A38B', '#8A5CF6', '#E8A013', '#5B616E'];

  var player = null, playerReady = null, hoverTimer = 0, pinned = false;
  var chatTimer = 0, chatIdx = 0;

  /* ---------- 등장 애니메이션 ---------- */
  if (!reduce) {
    root.classList.add('vb-anim');
    var reveal = function () {
      root.classList.add('vb-ready');
      setTimeout(function () { root.classList.remove('vb-anim', 'vb-ready'); }, 3000);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); reveal(); }
      }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
      io.observe(root);
    } else { reveal(); }
  }

  /* ---------- 소리 정책 ---------- */
  // 사용자가 페이지를 한 번이라도 클릭/터치/키 입력했으면 소리 있는 자동 재생이 허용된다
  var activated = false;
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, function () { activated = true; }, { capture: true, once: true, passive: true });
  });
  function hasActivation() {
    return activated || !!(navigator.userActivation && navigator.userActivation.hasBeenActive);
  }

  /* ---------- YouTube 플레이어 ---------- */
  function loadPlayer() {
    if (playerReady) return playerReady;
    playerReady = new Promise(function (resolve) {
      function create() {
        var vars = { autoplay: 0, mute: 1, playsinline: 1, rel: 0, modestbranding: 1, controls: 1 };
        if (/^https?:/.test(location.protocol)) vars.origin = location.origin;
        player = new YT.Player('vbPlayer', {
          videoId: VIDEO_ID,
          playerVars: vars,
          events: {
            onReady: function () { resolve(player); },
            onStateChange: function (e) {
              if (e.data === YT.PlayerState.PLAYING) { root.classList.add('is-playing'); syncMuted(); }
              if (e.data === YT.PlayerState.ENDED) { player.seekTo(0); player.playVideo(); } // 반복 재생
            }
          }
        });
      }
      if (window.YT && window.YT.Player) { create(); return; }
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () { if (prev) prev(); create(); };
      var s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return playerReady;
  }
  function syncMuted() {
    if (!player || !player.isMuted) return;
    root.classList.toggle('is-muted', player.isMuted());
  }
  function play(withSound) {
    loadPlayer().then(function (p) {
      if (!root.classList.contains('is-open')) return;
      if (withSound) { p.unMute(); p.setVolume(80); } else { p.mute(); }
      p.playVideo();
      // 일부 브라우저는 소리 재생을 막고 음소거로 되돌린다 → 버튼 표시 갱신
      setTimeout(syncMuted, 600);
    });
  }

  /* ---------- 라이브 리뷰 ---------- */
  function addMsg() {
    var r = REVIEWS[chatIdx % REVIEWS.length]; chatIdx++;
    var el = document.createElement('div');
    el.className = 'vb-msg' + (/신청/.test(r[2]) ? ' hot' : '');
    el.innerHTML =
      '<span class="vb-av" style="background:' + AV_COLORS[chatIdx % AV_COLORS.length] + '">' + r[0].charAt(0) + '</span>' +
      '<div class="vb-bub"><div class="nm"><span>' + r[0] + '</span><span class="st">' + '★★★★★'.slice(0, r[1]) + '</span><span>방금</span></div>' +
      '<p></p></div>';
    el.querySelector('p').textContent = r[2];
    track.appendChild(el);
    // 채팅창 높이는 그대로 두고, 목록 전체를 새 메시지 높이만큼 아래로 내렸다가 부드럽게 끌어올린다
    if (!reduce) {
      var shift = el.offsetHeight + 8;
      track.style.transition = 'none';
      track.style.transform = 'translateY(' + shift + 'px)';
      void track.offsetHeight;
      track.style.transition = 'transform .6s cubic-bezier(.22,.8,.24,1)';
      track.style.transform = 'translateY(0)';
    }
    // 위로 밀려 보이지 않게 된 오래된 메시지는 정리 (아래 기준 정렬이라 화면이 흔들리지 않는다)
    while (track.children.length > 14) track.removeChild(track.firstChild);
  }
  function startChat() {
    if (chatTimer) return;
    if (!track.children.length) { for (var i = 0; i < 4; i++) addMsg(); }
    (function loop() { chatTimer = setTimeout(function () { addMsg(); loop(); }, 1600 + Math.random() * 1400); })();
  }
  function stopChat() { clearTimeout(chatTimer); chatTimer = 0; }

  likeBtn.addEventListener('click', function () {
    for (var i = 0; i < 3; i++) {
      var h = document.createElement('span');
      h.className = 'vb-heart';
      h.textContent = ['❤️', '🧡', '💗'][i];
      h.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      h.style.animationDelay = (i * 0.15) + 's';
      likeBtn.appendChild(h);
      setTimeout(function (n) { n.remove(); }.bind(null, h), 2200);
    }
  });

  /* ---------- 열기 / 닫기 ---------- */
  function open(withSound) {
    root.classList.add('is-open');
    bar.setAttribute('aria-expanded', 'true');
    startChat();
    play(withSound);
  }
  function close() {
    clearTimeout(hoverTimer);
    pinned = false;
    root.classList.remove('is-open', 'is-hover');
    bar.setAttribute('aria-expanded', 'false');
    stopChat();
    if (player && player.pauseVideo) player.pauseVideo();
  }

  if (canHover) {
    root.addEventListener('mouseenter', function () {
      root.classList.add('is-hover');
      loadPlayer();
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { open(hasActivation()); }, 500);
    });
    root.addEventListener('mouseleave', function () {
      clearTimeout(hoverTimer);
      root.classList.remove('is-hover');
      if (!pinned) close();
    });
  }

  // 클릭/탭은 사용자 동작이므로 항상 소리와 함께 재생
  bar.addEventListener('click', function () {
    if (pinned) { close(); return; }
    pinned = true;
    open(true);
  });
  unmuteBtn.addEventListener('click', function () {
    pinned = true;
    loadPlayer().then(function (p) { p.unMute(); p.setVolume(80); p.playVideo(); setTimeout(syncMuted, 300); });
  });
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('is-open')) { close(); bar.focus(); }
  });

  if (!SAMPLE) { var tag = root.querySelector('.vb-sample'); if (tag) tag.remove(); }
})();
