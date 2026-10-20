/* 렌탈신청(order.html): 상품 상세(view.html)의 렌탈신청에서 넘어온 값으로 주문확인 박스를 채우고,
   실제 사이트(order.php)와 같은 순서로 입력값을 확인한다. 샘플이라 실제 주문은 접수하지 않는다. */
(function () {
  var q = new URLSearchParams(location.search);
  // 바로 들어온 경우(값 없음)에는 원코크 플러스 84개월 셀프관리 조건을 예시로 보여 준다
  var D = {
    goods: 'G050304', name: 'SK매직 원코크 플러스 얼음물 정수기', model: 'WPU-IAC425', option: '내추럴 화이트(NW)',
    period: '84 / 셀프관리', price: '46,900', brand: '1007', card_price: '23,900', cmp_mtype: '셀프관리', cmp_mcycle: '',
    cmp_label: '84개월', cmp_sub: '7년', cmp_con: '84_8,000원할인+반값', cmp_brand: 'SK매직',
    color_hex: '#F5F5F5', thumb: 'https://devadmin.tncrental.co.kr//uploads/goods/G050304/color_0_F4HjJiSJbY.png'
  };
  var fromView = q.has('goods');
  var v = function (k) { return fromView ? (q.get(k) || '') : D[k]; };
  var num = function (s) { return Number(String(s || '').replace(/[^\d]/g, '')) || 0; };
  var won = function (n) { return n.toLocaleString('ko-KR'); };
  var $ = function (id) { return document.getElementById(id); };
  var set = function (id, t) { var el = $(id); if (el) el.textContent = t; };
  var val = function (name, t) { var el = document.querySelector('#inputForm [name="' + name + '"]'); if (el) el.value = t; };

  var price = num(v('price')), est = num(v('card_price')), disc = Math.max(price - est, 0);
  var option = v('option'), colorName = option.replace(/\s*\([^)]*\)\s*$/, '');
  var con = v('cmp_con'), contract = (con.match(/^(\d+)/) || [])[1];
  var thumb = v('thumb') || D.thumb;

  // 실제 페이지가 서버로 보내는 숨은 값
  val('goods_code', v('goods')); val('goods_name', v('name')); val('goods_period', v('period'));
  val('goods_price', v('price')); val('goods_option', option); val('goods_brand', v('brand'));
  val('goods_thum', thumb.split('/').pop());

  // 주문확인 박스
  $('ocImg').src = thumb;
  set('ocModel', [v('model'), v('cmp_brand')].filter(Boolean).join(' · '));
  set('ocName', v('name'));
  if (colorName) { $('ocColorDot').style.background = v('color_hex') || '#ddd'; set('ocColorName', colorName); }
  else { $('ocColor').hidden = true; }
  set('ocMtype', v('cmp_mtype') || '-');
  set('ocMcycle', v('cmp_mcycle') || '-');
  set('ocLabel', v('cmp_label') || (v('period').split('/')[0].trim() + '개월'));
  set('ocSub', v('cmp_sub') ? '(' + v('cmp_sub') + ')' : '');
  set('ocContract', contract ? contract + '개월' : (v('cmp_label') || '-'));
  set('ocPrice', won(price) + '원');
  if (disc > 0) { set('ocDisc', '-' + won(disc) + '원'); set('ocEst', won(est)); }
  else { $('ocDiscRow').hidden = true; $('ocEstRow').hidden = true; }

  // 주민번호 뒷자리 첫글자: 열고 닫기·글자 바꾸기는 실제 사이트 common.js 가 하고, 고른 값만 저장한다
  document.querySelectorAll('.rental .select .item').forEach(function (it) {
    it.addEventListener('click', function () { $('order_sn2').value = it.textContent.trim(); });
  });

  // 연락처: 숫자만 입력하면 010-0000-0000 형태로
  var tel = document.querySelector('#inputForm [name=order_tel]');
  tel.addEventListener('input', function () {
    var d = tel.value.replace(/\D/g, '').slice(0, 11);
    tel.value = d.length > 7 ? d.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3') : d.length > 3 ? d.replace(/(\d{3})(\d+)/, '$1-$2') : d;
  });

  // 우편번호 검색: 다음(카카오) 우편번호 서비스. 스크립트를 못 불러오면 직접 입력할 수 있게 연다
  window.searchZip = function () {
    var f = document.inputForm;
    if (window.daum && daum.Postcode) {
      new daum.Postcode({ oncomplete: function (d) {
        f.order_zip.value = d.zonecode;
        f.order_address1.value = d.userSelectedType === 'R' ? d.roadAddress : d.jibunAddress;
        f.order_address2.focus();
      } }).open();
    } else {
      f.order_zip.readOnly = false; f.order_address1.readOnly = false; f.order_zip.focus();
      toast('우편번호 서비스를 불러오지 못해 직접 입력할 수 있게 열었습니다');
    }
  };

  function toast(t) {
    var el = $('toast'); if (!el) return alert(t);
    el.textContent = t; el.classList.add('on'); clearTimeout(toast.tm); toast.tm = setTimeout(function () { el.classList.remove('on'); }, 2600);
  }
  // 주문하기: 실제 order.php 와 같은 순서로 확인하고, 통과하면 샘플 완료 안내를 띄운다 (서버로 보내지 않음)
  window.ActionCheck = function () {
    var f = document.inputForm;
    if (!f.order_name.value.trim()) { toast('신청자명을 입력하세요'); f.order_name.focus(); return false; }
    if (f.order_tel.value.replace(/\D/g, '').length < 10) { toast('연락처를 입력하세요'); f.order_tel.focus(); return false; }
    if (!f.order_zip.value.trim()) { toast('우편번호를 입력하세요'); return false; }
    if (!f.order_agree_1.checked) { toast('주문제품 정보확인에 동의해주세요'); return false; }
    if (!f.order_agree_2.checked) { toast('소유권이전 정보확인에 동의해주세요'); return false; }
    $('ocDoneName').textContent = f.order_name.value.trim();
    $('ocDone').hidden = false;
    return false;
  };
  $('ocDoneClose').addEventListener('click', function () { $('ocDone').hidden = true; });
})();
