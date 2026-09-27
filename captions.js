/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Kutuyu kaç cm² kâğıt kaplar?', en: 'How much paper covers the box?',
      note: 'Ayrıtları 4 cm, 3 cm ve 2 cm olan bir hediye kutusunu kâğıtla kaplayacağız. Kaç santimetrekare kâğıt gerekir?' },
    { scene: 2, start: 10.8, end: 19.4, tr: 'Kutuyu açalım: yüzey açınımı', en: 'Unfold the box: a net',
      note: 'Kutuyu ayrıtlarından kesip düz bir kâğıt gibi açalım. Bu şekle yüzey açınımı denir. Altı dikdörtgen yüz var: iki tane 4’e 3, iki tane 4’e 2, iki tane 3’e 2.' },
    { scene: 2, start: 19.6, end: 27.8, tr: 'Farklı açınım, aynı yüzler', en: 'A different net, the same faces',
      note: 'Kutu başka biçimde de açılabilir. Yüzler aynı, yalnızca yerleri farklı. Her açınım katlanınca aynı kutuyu verir.' },
    { scene: 3, start: 28.8, end: 35.6, tr: 'Yüzey alanı: dikdörtgenlerin toplamı', en: 'Surface area: the sum of the rectangles',
      note: 'Kutunun yüzey alanı, açınımdaki dikdörtgenlerin alanlarının toplamıdır. Birim karelerle sayalım: 12, 8 ve 6.' },
    { scene: 3, start: 35.8, end: 45.8, tr: 'Karşılıklı yüzler eş', en: 'Opposite faces are equal',
      note: 'Karşılıklı yüzler eştir: 12 ile 12, 8 ile 8, 6 ile 6. Her yüz çiftinin alanı iki kez sayılır.' },
    { scene: 4, start: 46.8, end: 56.8, tr: '2·12 + 2·8 + 2·6', en: '2·12 + 2·8 + 2·6',
      note: 'Hesaplayalım: 2 çarpı 4 çarpı 3, artı 2 çarpı 4 çarpı 2, artı 2 çarpı 3 çarpı 2. Yani 24 artı 16 artı 12.' },
    { scene: 4, start: 57.2, end: 63.8, tr: 'Yüzey alanı 52 cm²', en: 'The surface area is 52 cm²',
      note: 'Toplam 52 santimetrekare. Kutuyu kaplamak için 52 santimetrekare kâğıt gerekir.' },
    { scene: 5, start: 64.8, end: 71.8, tr: 'Üstü açık kutu: 5 yüz', en: 'An open box: 5 faces',
      note: 'Şimdi üstü açık bir kutu: 5 cm, 4 cm, 3 cm. Kapağı olmadığı için açınımında yalnızca 5 yüz var.' },
    { scene: 5, start: 72.0, end: 79.8, tr: '20 + 30 + 24 = 74 cm²', en: '20 + 30 + 24 = 74 cm²',
      note: 'Taban 20, ön ve arka yüzler 15’er, yan yüzler 12’şer. 20 artı 30 artı 24, yüzey alanı 74 santimetrekare.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Açınımdan yüzey alanı', en: 'Surface area from a net',
      note: 'Aklında kalsın: yüzey alanı, açınımdaki yüzlerin alanlarının toplamıdır.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Karşılıklı yüzler eş!', en: 'Opposite faces are equal!',
      note: 'Karşılıklı yüzler eş olduğu için her alan iki kez sayılır!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
