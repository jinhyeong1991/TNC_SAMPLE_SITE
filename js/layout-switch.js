/* =========================================================
   레이아웃 전환 (2단 / 4단 / 6단, 모바일 1단 / 2단 / 3단)
   사용법: <div class="lsw" data-target="#lpGrid" data-key="list" data-pc="4" data-m="2"></div>
     data-pc / data-m : 처음 기본값 (생략하면 PC 4단, 모바일 2단)
   - 선택값은 브라우저에 저장되어 다시 와도 유지된다.
   - 바꿀 때 카드가 새 자리로 미끄러지듯 이동한다 (FLIP 애니메이션).
   - 그리드에서 'lsw-change' 이벤트가 발생한다 (detail.cols = 지금 화면 기준 열 수).
   ========================================================= */
(function () {
  var PC = [2, 4, 6], M = [1, 2, 3];
  var mq = window.matchMedia('(max-width:900px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function icon(n) {
    // n열 그리드 모양 아이콘 (1열은 가로 리스트 모양)
    var s = '<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">';
    if (n === 1) {
      s += '<rect x="1" y="2" width="5" height="5" rx="1.2"/><rect x="8" y="3" width="9" height="1.6" rx=".8"/><rect x="8" y="5.4" width="6" height="1.6" rx=".8"/>' +
           '<rect x="1" y="11" width="5" height="5" rx="1.2"/><rect x="8" y="12" width="9" height="1.6" rx=".8"/><rect x="8" y="14.4" width="6" height="1.6" rx=".8"/>';
    } else {
      // 열 수 그대로 그린다 (2단 = 2열, 4단 = 4열, 6단 = 6열 / 모바일 3단 = 3열)
      var cols = n, rows = n === 3 ? 3 : 2;
      var g = n >= 4 ? 1.2 : 1.6, w = (16 - g * (cols - 1)) / cols, h = (16 - g * (rows - 1)) / rows;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
        s += '<rect x="' + (1 + c * (w + g)).toFixed(2) + '" y="' + (1 + r * (h + g)).toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '" rx="1.2"/>';
    }
    return s + '</svg>';
  }
  function load(key, def) { try { var v = localStorage.getItem('lsw:' + key); return v ? +v : def; } catch (e) { return def; } }
  function save(key, v) { try { localStorage.setItem('lsw:' + key, v); } catch (e) {} }

  /* FLIP: 바뀌기 전 위치·크기 → 바뀐 뒤 위치·크기로 부드럽게 이동 */
  function flip(grid, change) {
    var kids = Array.prototype.slice.call(grid.children);
    if (reduce || !kids.length) { change(); return; }
    var first = kids.map(function (k) { return k.getBoundingClientRect(); });
    // 카드 등장 애니메이션(cardIn)은 이미 끝났으므로 꺼 둔다. 다시 켜면 처음부터 재생되어 깜빡인다.
    kids.forEach(function (k) { k.style.animation = 'none'; k.style.transition = 'none'; k.style.transform = ''; });
    change();
    var vh = window.innerHeight;
    kids.forEach(function (k, i) {
      var a = first[i], b = k.getBoundingClientRect();
      // 화면 밖 카드는 계산 생략 (성능)
      if ((a.bottom < -200 && b.bottom < -200) || (a.top > vh + 200 && b.top > vh + 200)) return;
      // 크기 비율로 늘리면 글자가 찌그러져 보여서, 위치만 옮기고 살짝 작게 시작해 부드럽게 커지게 한다
      var dx = a.left - b.left, dy = a.top - b.top;
      k.style.transformOrigin = '0 0';
      k.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.94)';
      k.style.opacity = '.35';
    });
    void grid.offsetWidth;
    kids.forEach(function (k) {
      k.style.transition = 'transform .5s cubic-bezier(.22,.8,.24,1), opacity .5s ease';
      k.style.transform = '';
      k.style.opacity = '';
    });
    setTimeout(function () {
      kids.forEach(function (k) { k.style.transition = ''; k.style.transformOrigin = ''; });
    }, 560);
  }

  function init(box) {
    var grid = document.querySelector(box.getAttribute('data-target'));
    if (!grid) return;
    var key = box.getAttribute('data-key') || grid.id;
    var pc = load(key + ':pc', +(box.getAttribute('data-pc') || 4));
    var m = load(key + ':m', +(box.getAttribute('data-m') || 2));
    grid.classList.add('lsw-grid');
    grid.setAttribute('data-cols', pc);
    grid.setAttribute('data-mcols', m);

    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', '상품 보기 방식');
    box.innerHTML =
      PC.map(function (n) { return '<button type="button" class="pc" data-n="' + n + '" aria-label="' + n + '단으로 보기" title="' + n + '단">' + icon(n) + '</button>'; }).join('') +
      M.map(function (n) { return '<button type="button" class="m" data-n="' + n + '" aria-label="' + (n === 1 ? '1단 리스트로' : n + '단으로') + ' 보기" title="' + n + '단">' + icon(n) + '</button>'; }).join('');

    function current() { return mq.matches ? +grid.getAttribute('data-mcols') : +grid.getAttribute('data-cols'); }
    function sync() {
      var pcv = grid.getAttribute('data-cols'), mv = grid.getAttribute('data-mcols');
      box.querySelectorAll('button.pc').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-n') === pcv ? 'true' : 'false'); });
      box.querySelectorAll('button.m').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-n') === mv ? 'true' : 'false'); });
    }
    function emit() { grid.dispatchEvent(new CustomEvent('lsw-change', { detail: { cols: current() } })); }

    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var n = b.getAttribute('data-n'), isM = b.classList.contains('m'), attr = isM ? 'data-mcols' : 'data-cols';
      if (grid.getAttribute(attr) === n) return;
      flip(grid, function () { grid.setAttribute(attr, n); });
      save(key + (isM ? ':m' : ':pc'), n);
      sync(); emit();
    });
    mq.addEventListener ? mq.addEventListener('change', emit) : mq.addListener(emit);
    sync();
  }

  /* 다른 스크립트가 지금 열 수를 물어볼 때 사용 */
  window.TNC_LSW = {
    cols: function (grid) { return mq.matches ? +(grid.getAttribute('data-mcols') || 2) : +(grid.getAttribute('data-cols') || 4); }
  };

  document.querySelectorAll('.lsw[data-target]').forEach(init);
})();
