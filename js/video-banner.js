/* =========================================================
   영상 띠배너 (SK매직 MEGA ICE 얼음정수기)
   - 화면에 들어오면 천천히 등장
   - PC: 마우스 오버(0.5초 유지) → 커지며 영상 + 제품 포인트 패널이 펼쳐지고 재생
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
     제품 포인트 ("이런 점이 좋아요" 패널)
     [아이콘, 제목, 설명, 강조]  — 배너·제품 정보에 있는 내용만 쓴다
     --------------------------------------------------------- */
  var POINTS = [
    ['🧊', '25g 큰 얼음', '한 알 25g, 크고 단단한 얼음이 나와요'],
    ['⏳', '쉽게 녹지 않아요', '단단한 얼음이라 음료가 오래 시원해요'],
    ['☕', '홈카페에 딱', '아이스 아메리카노부터 하이볼까지'],
    ['💳', '제휴카드 할인', '할인 적용 시 월 19,500원부터', true],
    ['📅', '기간별 요금 비교', '의무사용기간별 월 렌탈료를 한눈에 비교해 보세요'],
    ['📞', '간편 상담', '1670-4113 · 상담 후 바로 신청할 수 있어요', true]
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

  /* ---------- 제품 포인트 ---------- */
  function addMsg() {
    var r = POINTS[chatIdx % POINTS.length]; chatIdx++;
    var el = document.createElement('div');
    el.className = 'vb-msg' + (r[3] ? ' hot' : '');
    el.innerHTML =
      '<span class="vb-av" style="background:' + AV_COLORS[chatIdx % AV_COLORS.length] + '">' + r[0] + '</span>' +
      '<div class="vb-bub"><div class="nm"><span></span></div><p></p></div>';
    el.querySelector('.nm span').textContent = r[1];
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

})();
