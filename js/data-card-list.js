/* SK인텔릭스 제휴카드 목록 - card.html · card_view.html(js/sub.js) 과 메인 제휴카드 슬라이드(js/card-rail.js)가 함께 씀.
   sk.tncrental.co.kr card.php 에서 옮겨 온 값, 2026-10-23. 카드 이미지 = devadmin …/uploads/card/1007/ + img
   t = [[전월 실적(만원), 월 할인한도(원), 기본(원) or 0 when no promo split]] */
window.TNC_CARDS = [
  { c: 190, n: '현대카드', img: 'card_190_dndmh.png', apply: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc?cardflag=RC&cardWcd=SKIHC', t: [[40, 13000, 8000], [80, 16000, 12000], [120, 19000, 16000]] },
  { c: 180, n: '신한카드', img: 'card_180_KNKe2.png', apply: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1236413_2207.html', t: [[30, 15000, 12000], [70, 18000, 15000], [150, 28000, 25000]] },
  { c: 130, n: '우리카드', img: 'card_130_3mimQ.png', apply: 'https://m.wooricard.com/dcmw/yh1/crd/crd01/M1CRD101S02.do?recomNo=102859', t: [[30, 22000, 10000], [70, 22000, 15000], [120, 25000, 20000]] },
  { c: 125, n: '플러스 하나카드', img: 'card_125_8E1aE.png', apply: 'https://www.hanacard.co.kr/OPI42000000D.web?schID=pcd&mID=PI41015414P&CD_PD_SEQ=17400', t: [[30, 13000, 0], [100, 18000, 0], [150, 25000, 0]] },
  { c: 208, n: '롯데카드', img: 'card_208_coAtE.png', apply: 'https://www.lottecard.co.kr/app/LPCDADB_V100.lc?vtCdKndC=P15883-A15883', t: [[40, 23000, 8000], [80, 25000, 12000], [160, 27000, 24000]] },
  { c: 51, n: 'KJ카드', img: 'card_51_peuHe.png', apply: 'https://www.kjbank.com/ib20/mnu/FPMCARD020103?ib20_wc=FPMCARD050102V10:FPMCARD050102V20&ib20_cur_mnu=FPMCARD020101&ib20_cur_wgt=FPMCARD020101V10&INBN_GDS_NO=CDR20201221001', t: [[30, 10000, 0], [70, 16000, 0], [120, 23000, 0]] },
  { c: 49, n: '삼성카드', img: 'card_49_aR75Q.png', apply: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1686&alncmpC=QISKMAGIC&affcode=QISKMAGIC1&webViewFirstPage=true', t: [[30, 20000, 7000], [70, 22000, 10000], [120, 24000, 13000]] },
  { c: 46, n: 'KB국민 올림카드', img: 'card_46_zu54O.png', apply: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=04418&solicitorcode=7024418000', t: [[30, 22000, 11000], [70, 22000, 15000], [100, 22000, 20000]] }
];
