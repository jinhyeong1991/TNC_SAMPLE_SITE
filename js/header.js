/* TNC rental header behaviour: sticky/collapse, consult sheet, mega menu, search overlay, drawer */
(function(){
  var hd=document.getElementById('hd'), pop=document.getElementById('pop'), scrim=document.getElementById('scrim');
  var drawer=document.getElementById('drawer'), dScrim=document.getElementById('dScrim');
  /* ---- PC mega menu: category -> circle cut-out images + AI keyword column ---- */
  var SHOP='https://sk.tncrental.co.kr/shop/', UP='https://devadmin.tncrental.co.kr//uploads/';
  var G=function(id,f){return UP+'goods/'+id+'/'+f};
  var BN=function(f){return UP+'banner_main/sk/'+f};
  var V=function(id){return 'goods_view.php?goods='+id};
  var MEGA={
    water:{t:'정수기',href:'goods.php?cate1=CA0087&depth=1',
      items:[{n:'얼음정수기',p:'39,000',img:G('G050305','Kfa9Zuk79g.gif'),bd:'추천',h:'goods.php?cate1=CA0087&cate2=CA0095&depth=2'},
             {n:'냉온정수기',p:'26,000',img:G('G050303','yckQ7nbMuC.png'),h:'goods.php?cate1=CA0087&cate2=CA0094&depth=2'},
             {n:'냉정수기',p:'26,900',img:G('G050307','mj6mLYUQJo.png'),bd:'인기',h:'goods.php?cate1=CA0087&cate2=CA0096&depth=2'},
             {n:'일반정수기',p:'13,900',img:G('G050306','8iKt4EbOQV.gif'),h:'goods.php?cate1=CA0087&cate2=CA0097&depth=2'}],
      kw:['얼음정수기 렌탈료 비교','직수 정수기 추천','1인 가구 미니 정수기','렌탈료 저렴한 정수기','필터 관리 쉬운 정수기','제휴카드 할인 정수기','냉온정수기 신제품','사무실 정수기 추천']},
    air:{t:'공기청정기',href:'goods.php?cate1=CA0088&depth=1',sm:1,
      items:[{n:'올클린 25평형',p:'22,900',img:G('G050310','ziz3CkCS2y.png'),h:V('G050310')},
             {n:'올클린 20평형',p:'18,900',img:G('G050309','6rOXPGDqUb.png'),bd:'인기',h:V('G050309')},
             {n:'올클린 15평형',p:'16,900',img:G('G050308','U7tn5W18Cc.jpg'),h:V('G050308')},
             {n:'XPSG 코어 13평형 Basic',p:'22,900',img:G('G044678','5CTxXqwnfj.png'),bd:'추천',h:V('G044678')},
             {n:'XPSG 코어 13평형 Lite',p:'12,900',img:G('G044677','h5UWLG24U6.png'),h:V('G044677')},
             {n:'올클린 디아트 22평 펫',p:'26,900',img:G('G043352','lNHDcZRALe.png'),bd:'인기',h:V('G043352')},
             {n:'올클린 디아트 22평 알러지',p:'26,900',img:G('G043351','5nLpr7CcIC.png'),h:V('G043351')},
             {n:'올클린 디아트 16평',p:'22,900',img:G('G036227','rqDMg3F5Y7.png'),h:V('G036227')}],
      kw:['펫 공기청정기 추천','알러지 공기청정기','원룸 공기청정기 평수','거실용 25평 공기청정기','렌탈료 저렴한 공기청정기','필터 교체 주기','반값 할인 공기청정기','아기방 공기청정기']},
    bidet:{t:'비데',href:'goods.php?cate1=CA0089&depth=1',
      items:[{n:'풀스텐 케어 비데 Basic (2개월)',p:'26,900',img:G('G049786','TVXcfQKY18.png'),bd:'추천',h:V('G049786')},
             {n:'올클린 케어 비데 Basic (4개월)',p:'23,900',img:G('G046609','36L4AAePhx.png'),bd:'반값',h:V('G046609')},
             {n:'풀스텐 케어 비데 Lite (12개월)',p:'15,900',img:G('G042682','qckRlvHhF5.png'),h:V('G042682')},
             {n:'위글위글 스파 비데 Basic',p:'19,900',img:G('G041469','0hFeTwjgaQ.png'),h:V('G041469')}],
      kw:['풀스텐 비데 추천','방문관리 없는 비데','비데 렌탈료 비교','아이 있는 집 비데','비데 렌탈 vs 구매','노즐 자동세척 비데']},
    mat:{t:'매트리스/프레임',href:'goods.php?cate1=CA0092&depth=1',
      items:[{n:'수납형 패브릭 프레임 SS',p:'17,900',img:G('G045672','NFXiitHFLk.png'),h:V('G045672')},
             {n:'수납형 패브릭 프레임 Q',p:'19,900',img:G('G045673','tC27QUAZuy.png'),bd:'추천',h:V('G045673')},
             {n:'PVC레더 헤드보드 프레임 K',p:'20,900',img:G('G045671','TXitiJcQOH.png'),h:V('G045671')},
             {n:'패브릭 헤드보드 프레임 K',p:'21,900',img:G('G045670','aLmo7egj8m.png'),h:V('G045670')}],
      kw:['퀸 사이즈 프레임 추천','신혼 침대 렌탈','수납형 침대 프레임','매트리스 렌탈 후기','슈퍼싱글 프레임 가격','가죽 헤드보드 침대']},
    namuh:{t:'NAMUH',href:'goods.php?cate1=CA0357&depth=1',
      items:[{n:'나무엑스 A1 무방문형',p:'53,900',img:G('G047713','iIpUb0ij1S.gif'),bd:'신규',h:V('G047713')},
             {n:'나무엑스 A1 셀프관리',p:'55,900',img:G('G047716','GAEqGKKat7.gif'),bd:'인기',h:V('G047716')},
             {n:'나무엑스 A1 4개월 방문',p:'56,900',img:G('G047715','wA6edChL1u.gif'),h:V('G047715')},
             {n:'나무엑스 A1 2개월 방문',p:'63,900',img:G('G047714','P8reKOJyei.gif'),h:V('G047714')}],
      kw:['나무엑스 A1 후기','나무엑스 에어센서 증정','신제품 공기케어 렌탈','나무엑스 렌탈료','무방문 관리 가전']},
    biz:{t:'사업자전용',href:'goods.php?cate1=CA0361&depth=1',
      items:[{n:'숙박업소/병원/종교시설',p:'',img:G('G048305','4pkKVPByz6.png'),h:V('G048305')},
             {n:'학교/학원',p:'',img:G('G048304','eMpXWFppUS.png'),h:V('G048304')},
             {n:'매장/식당',p:'',img:G('G048303','lW32ttB1oV.png'),bd:'인기',h:V('G048303')},
             {n:'법인/관공서/사무실',p:'',img:G('G048302','CDcYAfKrFG.png'),h:V('G048302')}],
      kw:['식당 정수기 렌탈','사무실 정수기 추천','학원 공기청정기','대량 렌탈 견적','사업자 렌탈 비용처리','병원 정수기 렌탈']}
  };
  var root=document.getElementById('megaRoot'), dim=document.createElement('div'); dim.className='dim'; document.body.appendChild(dim);
  var panels={}, items={}, openKey=null, timer=null, kwState={};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]})}
  var SPARK='<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z"/></svg>';
  /* red ring drawn around a product circle on hover (starts at 12 o'clock, runs counter-clockwise 12 -> 9 -> 6 -> 3) */
  var RING='<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49" pathLength="100"/></svg>';

  /* AI keyword column. SAMPLE: keywords rotate on a timer. Real version = search logs + LLM on the server. */
  function kwHtml(k){
    var pool=MEGA[k].kw, off=kwState[k]||0, out='';
    for(var i=0;i<5;i++){
      var w=pool[(off+i)%pool.length], tg=(i===0)?'HOT':((off+i)%3===0?'NEW':'');
      out+='<a href="#" data-kw style="animation-delay:'+(i*60)+'ms"><span class="r">'+(i+1)+'</span>'+esc(w)+(tg?'<span class="tg">'+tg+'</span>':'')+'</a>';
    }
    return out;
  }
  function paintKw(k){var el=panels[k].querySelector('.kw');if(el)el.innerHTML=kwHtml(k)}

  Object.keys(MEGA).forEach(function(k){
    var m=MEGA[k], el=document.createElement('div'); el.className='mega';
    el.innerHTML='<div class="mw mega-in"><div class="mega-main"><div class="mega-title"><h4>'+esc(m.t)+'</h4><a href="'+SHOP+m.href+'">전체 보기 →</a></div>'+
      '<div class="circles'+(m.sm?' sm':'')+'">'+
      m.items.map(function(p){return '<a class="ci" href="'+SHOP+p.h+'">'+(p.bd?'<span class="bd">'+p.bd+'</span>':'')+
        '<div class="c"><img loading="lazy" alt="" src="'+p.img+'">'+RING+'</div><b>'+esc(p.n)+'</b>'+
        '<em>'+(p.p?'월 <strong>'+p.p+'원</strong>~':'<strong>상담 문의</strong>')+'</em></a>'}).join('')+
      '</div></div>'+
      '<aside class="mega-ai"><div class="ai-h"><span class="sp">'+SPARK+'</span>AI 추천 검색<span class="live"><i></i>실시간</span></div>'+
      '<p class="ai-sub">지금 많이 찾는 <b>'+esc(m.t)+'</b> 키워드를 AI가 분석했어요.</p><div class="kw">'+'</div>'+
      '<button class="ask" type="button" data-ai>'+SPARK+' AI에게 직접 물어보기</button></aside></div>';
    root.appendChild(el); panels[k]=el; kwState[k]=0; paintKw(k);
  });

  /* all-category panel (LG style) */
  var allEl=document.createElement('div'); allEl.className='mega all';
  function L(t,h){return '<a class="l" href="'+(/\.html/.test(h)?h:SHOP+h)+'">'+t+'</a>'}   /* .html = page on this site */
  allEl.innerHTML='<div class="mw"><div class="all-tabs"><button class="on" data-tab="0">렌탈 상품</button><button data-tab="1">혜택·안내</button><i class="sep"></i><button data-tab="2">고객센터</button></div>'+
    '<div class="all-body on" data-body="0">'+
      '<div><div class="grp"><h5><a href="'+SHOP+'goods.php?cate1=CA0087&depth=1">정수기</a></h5>'+L('얼음정수기','goods.php?cate1=CA0087&cate2=CA0095&depth=2')+L('냉온정수기','goods.php?cate1=CA0087&cate2=CA0094&depth=2')+L('냉정수기','goods.php?cate1=CA0087&cate2=CA0096&depth=2')+L('일반정수기','goods.php?cate1=CA0087&cate2=CA0097&depth=2')+'</div>'+
        '<div class="grp"><h5><a href="'+SHOP+'goods.php?cate1=CA0088&depth=1">공기청정기</a></h5>'+L('25평형','goods.php?cate1=CA0088&depth=1')+L('20평형 · 15평형','goods.php?cate1=CA0088&depth=1')+L('13평형 (XPSG 코어)','goods.php?cate1=CA0088&depth=1')+L('펫 · 알러지 케어','goods.php?cate1=CA0088&depth=1')+'</div></div>'+
      '<div><div class="grp"><h5><a href="'+SHOP+'goods.php?cate1=CA0092&depth=1">매트리스/프레임</a></h5>'+L('SS (슈퍼싱글)','goods.php?cate1=CA0092&cate2=CA0333&depth=2')+L('Q (퀸)','goods.php?cate1=CA0092&cate2=CA0334&depth=2')+L('K (킹)','goods.php?cate1=CA0092&cate2=CA0335&depth=2')+'</div>'+
        '<div class="grp"><h5><a href="'+SHOP+'goods.php?cate1=CA0089&depth=1">비데</a></h5>'+L('Lite (12개월 방문)','goods.php?cate1=CA0089&depth=1')+L('Basic (4개월 방문)','goods.php?cate1=CA0089&depth=1')+L('스파 · 케어 비데','goods.php?cate1=CA0089&depth=1')+'</div></div>'+
      '<div><div class="grp"><h5><a href="'+SHOP+'goods.php?cate1=CA0357&depth=1">NAMUH</a></h5>'+L('무방문형','goods.php?cate1=CA0357&depth=1')+L('셀프관리','goods.php?cate1=CA0357&depth=1')+L('4개월 · 2개월 방문관리','goods.php?cate1=CA0357&depth=1')+'</div>'+
        '<div class="grp"><h5><a href="'+SHOP+'goods.php?cate1=CA0361&depth=1">사업자전용</a></h5>'+L('숙박업소/병원/종교시설','goods.php?cate1=CA0361&depth=1')+L('학교/학원','goods.php?cate1=CA0361&depth=1')+L('매장/식당','goods.php?cate1=CA0361&depth=1')+L('법인/관공서/사무실','goods.php?cate1=CA0361&depth=1')+'</div>'+
        '<div class="tags"><a href="#" data-kw>#가을가전특별전</a><a href="#" data-kw>#반값할인</a><a href="#" data-kw>#제휴카드혜택</a></div></div>'+
      '<div class="tiles"><a class="tile" href="event.html"><img loading="lazy" alt="" src="'+BN('sk_318_IvGs2.png')+'"><span>10월 가을 가전 특별전</span></a>'+
        '<a class="tile" href="card.html"><img loading="lazy" alt="" src="'+BN('sk_398_i1i4X.png')+'"><span>제휴카드 혜택</span></a>'+
        '<a class="tile" href="event.html"><img loading="lazy" alt="" src="'+BN('sk_326_WLF35.png')+'"><span>반값 프로모션</span></a>'+
        '<a class="tile" href="event.html"><img loading="lazy" alt="" src="'+BN('sk_233_d1P2b.png')+'"><span>이달의 이벤트</span></a></div></div>'+
    '<div class="all-body" data-body="1"><div><div class="grp"><h5><a href="card.html">혜택</a></h5>'+L('제휴카드 할인','card.html')+L('반값 프로모션','event.html')+L('사은품 · 설치 혜택','event.html')+'</div></div>'+
      '<div><div class="grp"><h5><a href="notice.html">안내</a></h5>'+L('공지사항','notice.html')+L('렌탈 이용 방법','notice.html#n39')+L('설치 · 관리 안내','notice.html#n39')+'</div></div><div></div>'+
      '<div class="tiles"><a class="tile" href="card.html"><img alt="" src="'+BN('sk_398_i1i4X.png')+'"><span>제휴카드 혜택</span></a><a class="tile" href="event.html"><img alt="" src="'+BN('sk_318_IvGs2.png')+'"><span>진행중 이벤트</span></a></div></div>'+
    '<div class="all-body" data-body="2"><div><div class="grp"><h5><a href="tel:16704113">전화 상담</a></h5>'+'<a class="l" href="tel:16704113">1670-4113</a></div></div>'+
      '<div><div class="grp"><h5><a href="#" data-open-consult>간편상담 신청</a></h5><a class="l" href="#" data-open-consult>이름 · 연락처 남기기</a></div></div>'+
      '<div><div class="grp"><h5><a href="#" data-ai>AI 상담</a></h5><a class="l" href="#" data-ai>제품 추천 · 견적 문의</a></div></div><div></div></div></div>';
  root.appendChild(allEl); panels.all=allEl;
  allEl.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){
    allEl.querySelectorAll('[data-tab]').forEach(function(x){x.classList.toggle('on',x===b)});
    allEl.querySelectorAll('[data-body]').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-body')===b.getAttribute('data-tab'))});
  })});

  /* one dropdown shell (#megaRoot) slides down once; moving to another category keeps it open,
     eases its height to the new panel and crossfades the contents (Samsung style) */
  var allBtn=document.getElementById('allBtn'); items.all=allBtn; var sticky=false, swT=null;
  function fit(){root.style.height=openKey?panels[openKey].offsetHeight+'px':'0px'}
  function showMega(k,stick){
    clearTimeout(timer);clearTimeout(swT);
    if(openKey===k){sticky=!!stick;return}
    if(openKey){panels[openKey].classList.remove('open');items[openKey].classList.remove('hot')}
    openKey=k;sticky=!!stick;panels[k].classList.add('open');items[k].classList.add('hot');
    root.classList.add('on');dim.classList.add('on');fit();
  }
  function hideMega(now){
    clearTimeout(timer);clearTimeout(swT);
    var run=function(){if(openKey){panels[openKey].classList.remove('open');items[openKey].classList.remove('hot');openKey=null}sticky=false;fit();root.classList.remove('on');dim.classList.remove('on')};
    if(now){run();return}
    timer=setTimeout(function(){if(!sticky)run()},160);
  }
  /* small hover intent: sweeping the mouse across the row doesn't flash every panel on the way */
  function hoverMega(k){clearTimeout(timer);clearTimeout(swT);swT=setTimeout(function(){showMega(k)},openKey?70:50)}
  allEl.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',fit)});
  window.addEventListener('resize',function(){if(openKey)fit()});
  document.querySelectorAll('[data-mega]').forEach(function(li){
    var k=li.getAttribute('data-mega'); items[k]=li;
    li.addEventListener('mouseenter',function(){if(window.innerWidth>900)hoverMega(k)});
    li.addEventListener('mouseleave',function(){hideMega()});
    li.addEventListener('focusin',function(){if(window.innerWidth>900)showMega(k)});
    panels[k].addEventListener('mouseenter',function(){clearTimeout(timer)});
    panels[k].addEventListener('mouseleave',function(){hideMega()});
  });
  allBtn.addEventListener('click',function(e){e.stopPropagation();openKey==='all'?hideMega(true):showMega('all',true)});
  document.addEventListener('click',function(e){if(openKey&&!panels[openKey].contains(e.target)&&!items[openKey].contains(e.target))hideMega(true)});
  document.querySelector('.cat').addEventListener('mouseleave',function(){hideMega()});
  window.addEventListener('scroll',function(){hideMega(true)},{passive:true});
  dim.addEventListener('click',function(){hideMega(true)});
  /* rotate AI keywords every 6s for whichever category panel is open */
  setInterval(function(){if(openKey&&openKey!=='all'){kwState[openKey]=(kwState[openKey]||0)+1;paintKw(openKey)}},6000);
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-kw]');if(a){e.preventDefault();hideMega(true);openSearch(a.textContent.replace(/^\d+|HOT|NEW/g,'').trim())}});

  /* ---- search overlay (Kurly style, text only): 최근 검색어 · 추천 검색어 · 급상승 검색어; typing shows 연관 검색어 + product names ---- */
  var sEl=document.getElementById('srch'), sDim=document.getElementById('sDim'), sIn=document.getElementById('sInput');
  var sBody=sEl.querySelector('.srch-body');
  sBody.innerHTML='<div class="s-col"><section class="s-sec" id="sRecentSec"><div class="s-h"><h6>최근 검색어</h6><button type="button" class="s-clear">전체 삭제</button></div><div class="s-chips" id="sRecent"></div></section>'+
    '<section class="s-sec"><div class="s-h"><h6>추천 검색어</h6></div><div class="s-chips" id="sReco"></div></section></div>'+
    '<div class="s-col"><section class="s-sec"><div class="s-h"><h6>급상승 검색어</h6></div><p class="s-note">최근 1시간 동안 검색 횟수가 급상승했어요</p><ol class="s-rank" id="sRank"></ol></section></div>';
  var sTyp=document.createElement('div'); sTyp.className='srch-typing'; sTyp.hidden=true; sBody.parentNode.insertBefore(sTyp,sBody.nextSibling);
  /* 추천 = our own curated keywords; 급상승 = category keywords (sample ranking) */
  var POP=['얼음정수기','올클린 공기청정기','풀스텐 비데','수납형 침대 프레임','나무엑스 A1','반값 프로모션','제휴카드 혜택'];
  var PRODS=[];
  /* model name (js/data-models.js) for items that link to a single product page */
  function mdlOf(h){var g=/goods=(G\d+)/.exec(h||'');return g&&window.TNC_model?window.TNC_model(g[1]):''}
  Object.keys(MEGA).forEach(function(k){MEGA[k].items.forEach(function(p){PRODS.push({n:p.n,cat:MEGA[k].t,p:p.p,h:p.h,m:mdlOf(p.h)})})});
  var KWALL=POP.slice(); Object.keys(MEGA).forEach(function(k){MEGA[k].kw.forEach(function(w){if(KWALL.indexOf(w)<0)KWALL.push(w)})});
  var RANK=KWALL.filter(function(w){return POP.indexOf(w)<0}).slice(0,10);
  /* 최근 검색어: kept in this browser only (localStorage), newest first, max 10 */
  var RKEY='tnc-recent';
  function recent(){try{var a=JSON.parse(localStorage.getItem(RKEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
  function saveRecent(a){try{localStorage.setItem(RKEY,JSON.stringify(a.slice(0,10)))}catch(e){/* storage blocked: keep going without history */}}
  function addRecent(w){w=String(w||'').trim();if(!w)return;saveRecent([w].concat(recent().filter(function(x){return x!==w})))}
  function hl(s,q){if(!q)return esc(s);var i=s.toLowerCase().indexOf(q.toLowerCase());return i<0?esc(s):esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length))}
  function chip(w,x){return '<span class="s-chip"><a href="#" data-sq="'+esc(w)+'">'+esc(w)+'</a>'+(x?'<button type="button" data-rm="'+esc(w)+'" aria-label="'+esc(w)+' 삭제">×</button>':'')+'</span>'}
  function renderSearch(q){
    q=(q||'').trim();
    sBody.hidden=!!q; sTyp.hidden=!q;
    if(!q){
      var r=recent();
      document.getElementById('sRecentSec').hidden=!r.length;
      document.getElementById('sRecent').innerHTML=r.map(function(w){return chip(w,true)}).join('');
      document.getElementById('sReco').innerHTML=POP.map(function(w){return chip(w,false)}).join('');
      document.getElementById('sRank').innerHTML=RANK.map(function(w,i){return '<li><a href="#" data-sq="'+esc(w)+'"><span class="n">'+(i+1)+'</span>'+esc(w)+'</a></li>'}).join('');
      return;
    }
    var low=q.toLowerCase();
    var kws=KWALL.filter(function(w){return w.toLowerCase().indexOf(low)>=0}).slice(0,8);
    var res=PRODS.filter(function(p){return (p.n+' '+p.cat+' '+(p.m||'')).toLowerCase().indexOf(low)>=0||(p.m&&p.m.replace(/-/g,'').toLowerCase().indexOf(low.replace(/-/g,''))>=0)});
    sTyp.innerHTML=(kws.length?'<ul class="s-sug">'+kws.map(function(w){return '<li><a href="#" data-sq="'+esc(w)+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'+hl(w,q)+'</a></li>'}).join('')+'</ul>':'')+
      (res.length?'<div class="s-h"><h6>상품 '+res.length+'개</h6></div><ul class="s-res">'+res.map(function(p){return '<li><a href="'+SHOP+p.h+'" data-go="'+esc(q)+'"><b>'+hl(p.n,q)+'</b><span>'+esc(p.cat)+(p.m?' · '+esc(p.m):'')+' · '+(p.p?'월 '+p.p+'원~':'상담 문의')+'</span></a></li>'}).join('')+'</ul>':'')+
      (!kws.length&&!res.length?'<div class="s-empty">“'+esc(q)+'”와 일치하는 결과가 없어요.<br>다른 검색어로 찾아보거나 상담사에게 물어보세요.<br><button type="button" data-open-consult>간편상담 신청</button></div>':'');
  }
  function openSearch(q){
    hideMega(true); closeDrawer();
    sEl.classList.add('open'); sDim.classList.add('on');
    sIn.value=q||''; renderSearch(q);
    setTimeout(function(){sIn.focus()},60);
  }
  function closeSearch(){sEl.classList.remove('open');sDim.classList.remove('on');sIn.blur()}
  document.getElementById('hSearch').addEventListener('focus',function(){openSearch();this.blur()});
  document.getElementById('hSearch').addEventListener('click',function(){openSearch()});
  document.getElementById('mSearch').addEventListener('click',function(){openSearch()});
  /* mobile home: no category tab is underlined (the markup marks 정수기 for the PC home);
     the search pill gets a short placeholder that fits beside the logo */
  if(window.matchMedia('(max-width:900px)').matches){
    if((location.pathname.split('/').pop()||'index.html').toLowerCase()==='index.html')
      hd.querySelectorAll('.cat-list a.t.on').forEach(function(a){a.classList.remove('on')});
    document.getElementById('hSearch').placeholder='제품 검색';
  }
  document.getElementById('sClose').addEventListener('click',closeSearch);
  sDim.addEventListener('click',closeSearch);
  sIn.addEventListener('input',function(){renderSearch(sIn.value)});
  sIn.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();var v=sIn.value.trim();if(v){addRecent(v);toast('“'+v+'” 검색 결과 페이지로 이동합니다 (샘플)')}}});
  sEl.addEventListener('click',function(e){
    var rm=e.target.closest('[data-rm]');
    if(rm){e.preventDefault();var w=rm.getAttribute('data-rm');saveRecent(recent().filter(function(x){return x!==w}));renderSearch('');return}
    if(e.target.closest('.s-clear')){saveRecent([]);renderSearch('');return}
    var go=e.target.closest('[data-go]'); if(go){addRecent(go.getAttribute('data-go'));return}
    var a=e.target.closest('[data-sq]');if(a){e.preventDefault();var v=a.getAttribute('data-sq');addRecent(v);sIn.value=v;renderSearch(v);sIn.focus()}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSearch()});

  /* The header is position:fixed and a spacer holds its full (un-collapsed) height,
     so collapsing rows never changes the page height -> no scroll jitter at the top. */
  var space=document.getElementById('hdSpace');
  function measure(){
    var was=hd.classList.contains('scrolled');
    hd.classList.add('measuring'); hd.classList.remove('scrolled');
    space.style.height=hd.offsetHeight+'px';           /* forced layout without transitions */
    if(was)hd.classList.add('scrolled');
    void hd.offsetHeight; hd.classList.remove('measuring');
  }
  measure(); window.addEventListener('resize',measure); window.addEventListener('load',measure);
  /* hysteresis: collapse past 80px, expand only when back under 10px.
     Mobile: once collapsed, row 1 (logo · phone · search) hides; a small scroll up (12px) brings it back (.hd-peek), scrolling down 12px hides it again */
  var ticking=false, lastY=window.scrollY||0, travel=0;
  function onScroll(){
    if(ticking)return; ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY||0, on=hd.classList.contains('scrolled'), dy=y-lastY; lastY=y;
      if(!on&&y>80)hd.classList.add('scrolled'); else if(on&&y<10)hd.classList.remove('scrolled');
      travel=(dy<0)===(travel<0)?travel+dy:dy;           /* distance moved in the current direction */
      if(travel<=-12)hd.classList.add('hd-peek'); else if(travel>=12||y<10)hd.classList.remove('hd-peek');
      ticking=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* the consult sheet lives inside the fixed header (z-index 100) but the mobile scrim is z-index 150:
     lift the header above the scrim while the sheet is open, otherwise the scrim covers the name/phone fields */
  function openPop(){pop.classList.add('open');scrim.classList.add('on');hd.classList.add('pop-on')}
  function closePop(){pop.classList.remove('open');scrim.classList.remove('on');hd.classList.remove('pop-on')}
  /* delegated so buttons added later (e.g. the floating quick menu in js/fx.js) open it too;
     registered before the outside-click closer below, so stopImmediatePropagation keeps it open */
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-open-consult]'); if(!b)return;
    e.stopImmediatePropagation(); if(b.tagName==='A')e.preventDefault();
    closeDrawer(); pop.classList.contains('open')?closePop():openPop();
  });
  scrim.addEventListener('click',closePop);
  document.addEventListener('click',function(e){if(pop.classList.contains('open')&&!pop.contains(e.target))closePop()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closePop();closeDrawer()}});

  function openDrawer(){drawer.classList.add('open');dScrim.classList.add('on')}
  function closeDrawer(){drawer.classList.remove('open');dScrim.classList.remove('on')}
  document.getElementById('openDrawer').addEventListener('click',openDrawer);
  /* search box at the top of the drawer: closes the menu and opens the search page with the cursor in the field */
  var dBody=drawer.querySelector('.body');
  if(dBody){
    var dS=document.createElement('button'); dS.type='button'; dS.className='msrch-in d-srch';
    dS.innerHTML='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span>어떤 제품을 찾으세요?</span>';
    dBody.insertBefore(dS,dBody.firstChild);
    dS.addEventListener('click',function(){closeDrawer();openSearch()});
  }
  document.getElementById('closeDrawer').addEventListener('click',closeDrawer);
  dScrim.addEventListener('click',closeDrawer);

  function toast(t){var el=document.getElementById('toast');el.textContent=t;el.classList.add('on');setTimeout(function(){el.classList.remove('on')},2400)}
  document.querySelectorAll('[data-ai]').forEach(function(b){b.addEventListener('click',function(){toast('AI 상담이 연결됩니다 (샘플)')})});
  document.querySelectorAll('[data-terms]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();toast('약관 팝업이 열립니다 (샘플)')})});

  function fmt(el){
    var v=el.value.replace(/\D/g,'').slice(0,11);
    el.value=v.length>7?v.replace(/(\d{3})(\d{3,4})(\d{0,4})/,'$1-$2-$3'):v.length>3?v.replace(/(\d{3})(\d+)/,'$1-$2'):v;
  }
  /* works for both the popover/sheet form and the mobile inline form */
  document.querySelectorAll('form[id=consultForm],form.cform').forEach(function(f){
    var n=f.querySelector('[name=n],#cName'), t=f.querySelector('[name=t],#cTel'), a=f.querySelector('[name=a],#cAgree');
    t.addEventListener('input',function(){fmt(t)});
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!n.value.trim()) return toast('이름을 입력해 주세요');
      if(t.value.replace(/\D/g,'').length<10) return toast('연락처를 정확히 입력해 주세요');
      if(!a.checked) return toast('개인정보 수집·이용에 동의해 주세요');
      closePop(); f.reset(); toast('상담 신청이 접수되었습니다 (샘플)');
    });
  });

  /* ---------- category links -> the local list page (list.html?c=...&sub=...) ---------- */
  var CATK = { CA0087: 'water', CA0088: 'air', CA0089: 'bidet', CA0092: 'mat', CA0357: 'namuh', CA0361: 'biz' };
  var SUBK = { CA0095: 'ice', CA0094: 'hotcold', CA0096: 'cold', CA0097: 'basic', CA0333: 'ss', CA0334: 'q', CA0335: 'k' };
  function localHref(h) {
    var m = String(h || '').match(/cate1=(CA\d+)/); if (!m || !CATK[m[1]]) return null;
    var s = String(h).match(/cate2=(CA\d+)/);
    return 'list.html?c=' + CATK[m[1]] + (s && SUBK[s[1]] ? '&sub=' + SUBK[s[1]] : '');
  }
  function localize(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a[href*="cate1="]'), function (a) {
      var l = localHref(a.getAttribute('href')); if (l) { a.setAttribute('href', l); a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
  }
  localize(document);
  /* links created later (hero slides, tabs ...) are fixed right before the click */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="cate1="]');
    if (a) { var l = localHref(a.getAttribute('href')); if (l) { a.setAttribute('href', l); a.removeAttribute('target'); } }
  }, true);
  /* mobile drawer links (they only have a label) */
  var DRAWER = {
    '얼음정수기': 'list.html?c=water&sub=ice', '냉온정수기': 'list.html?c=water&sub=hotcold', '냉정수기': 'list.html?c=water&sub=cold', '일반정수기': 'list.html?c=water&sub=basic',
    '공기청정기': 'list.html?c=air', '비데': 'list.html?c=bidet',
    'SS (슈퍼싱글)': 'list.html?c=mat&sub=ss', 'Q (퀸)': 'list.html?c=mat&sub=q', 'K (킹)': 'list.html?c=mat&sub=k',
    'NAMUH': 'list.html?c=namuh', '사업자전용': 'list.html?c=biz'
  };
  Array.prototype.forEach.call(document.querySelectorAll('.drawer a'), function (a) {
    var t = a.textContent.trim();
    if (DRAWER[t] && a.getAttribute('href') === '#') a.setAttribute('href', DRAWER[t]);
  });
})();
