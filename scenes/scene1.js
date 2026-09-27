/* SAHNE 1 — HEDİYE KUTUSU (0–10 s)  4 × 3 × 2 cm’lik bir kutu.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** the six faces of an L × W × H box: corners BL, BR, TR, TL seen from outside */
  function faces(L, W, H) {
    return {
      back: { k: 'fb', P: [[L, W, 0], [0, W, 0], [0, W, H], [L, W, H]], d: [L, H] },
      left: { k: 'lr', P: [[0, W, 0], [0, 0, 0], [0, 0, H], [0, W, H]], d: [W, H] },
      bottom: { k: 'tb', P: [[0, W, 0], [L, W, 0], [L, 0, 0], [0, 0, 0]], d: [L, W] },
      front: { k: 'fb', P: [[0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]], d: [L, H] },
      right: { k: 'lr', P: [[L, 0, 0], [L, W, 0], [L, W, H], [L, 0, H]], d: [W, H] },
      top: { k: 'tb', P: [[0, 0, H], [L, 0, H], [L, W, H], [0, W, H]], d: [L, W] },
    };
  }
  const ORDER = ['back', 'left', 'bottom', 'front', 'right', 'top'];
  const tint = { tb: (a) => amber(a * 0.34), fb: (a) => amber(a * 0.13), lr: (a) => `rgba(${LI.INK_RGB},${a * 0.1})` };
  /** a net rectangle in units, with the corner permutation that keeps the shared edges together */
  const R = (x, y, w, h, perm = [0, 1, 2, 3]) => { const b = [[x, y + h], [x + w, y + h], [x + w, y], [x, y]]; return { P: perm.map((i) => b[i]), r: [x, y, w, h] }; };
  const NET1 = { W: 14, H: 8, left: R(0, 3, 3, 2), front: R(3, 3, 4, 2), right: R(7, 3, 3, 2), back: R(10, 3, 4, 2), top: R(3, 0, 4, 3), bottom: R(3, 5, 4, 3) };
  const NET2 = { W: 8, H: 10, back: R(2, 0, 4, 2, [2, 3, 0, 1]), top: R(2, 2, 4, 3), front: R(2, 5, 4, 2), bottom: R(2, 7, 4, 3), left: R(0, 2, 2, 3, [3, 0, 1, 2]), right: R(6, 2, 2, 3, [1, 2, 3, 0]) };
  const NET3 = { W: 11, H: 10, bottom: R(3, 3, 5, 4, [3, 2, 1, 0]), front: R(3, 7, 5, 3, [3, 2, 1, 0]), back: R(3, 0, 5, 3, [1, 0, 3, 2]), left: R(0, 3, 3, 4, [2, 1, 0, 3]), right: R(8, 3, 3, 4, [0, 3, 2, 1]) };
  const netPt = (N, T, u, q) => [T.x - N.W * u / 2 + q[0] * u, T.y + q[1] * u];
  /**
   * draw a box whose faces travel to a net.
   * m(name) → [netA, netB, k] : k = 0 at netA … 1 at netB; netA = null means the folded box
   */
  function boxNet(ctx, env, B, t, a, m, look, seed) {
    if (a <= 0) return;
    const L = KD.L(env), F6 = faces(B.L, B.W, B.H), s = L.G.s;
    ORDER.forEach((name, i) => {
      if (B.open && name === 'top') return;
      const f = F6[name], [nA, nB, k] = m(name);
      const pos = (N, j) => (N ? netPt(N, B.T, B.u, N[name].P[j]) : Pj(B.O, B.c, ...f.P[j]));
      const P = f.P.map((_, j) => { const p = pos(nA, j), q = pos(nB, j), e = inOut(k); return [lerp(p[0], q[0], e), lerp(p[1], q[1], e)]; });
      const hot = look.hot ? look.hot(name, f.k) : 0;
      poly(ctx, P, a, [tint[f.k](a), hot > 0 ? amber(a * 0.5 * hot) : null], seed + i * 7);
      const N = k > 0.99 ? nB : k < 0.01 ? nA : null;
      if (!N) return;
      const [x, y, w, h] = N[name].r, c0 = netPt(N, B.T, B.u, [x, y]), cx = c0[0] + w * B.u / 2, cy = c0[1] + h * B.u / 2;
      const g = look.grid || 0;
      if (g > 0) {
        ctx.strokeStyle = `rgba(${LI.INK_RGB},${a * g * 0.28})`; ctx.lineWidth = 1.5; ctx.beginPath();
        for (let ix = 1; ix < w; ix++) { ctx.moveTo(c0[0] + ix * B.u, c0[1]); ctx.lineTo(c0[0] + ix * B.u, c0[1] + h * B.u); }
        for (let iy = 1; iy < h; iy++) { ctx.moveTo(c0[0], c0[1] + iy * B.u); ctx.lineTo(c0[0] + w * B.u, c0[1] + iy * B.u); }
        ctx.stroke();
      }
      const d = F6[name].d, dimA = look.dims || 0, arA = look.area || 0, sz = s * (B.u < 38 ? 0.56 : 0.66);
      if (dimA > 0) F().T(ctx, `${d[0]}×${d[1]}`, cx, cy, { size: sz, alpha: a * dimA, halo: true });
      if (arA > 0) F().T(ctx, String(d[0] * d[1]), cx, cy, { size: sz * 1.15, alpha: a * arA, halo: true, color: hot > 0.3 ? A.amber : undefined });
    });
  }
  /** a faint wire of the folded box, left behind as its faces fly out */
  function ghost(ctx, B, a, seed) {
    if (a <= 0) return;
    const E = [[[0, 0, 0], [B.L, 0, 0]], [[B.L, 0, 0], [B.L, 0, B.H]], [[B.L, 0, B.H], [0, 0, B.H]], [[0, 0, B.H], [0, 0, 0]], [[B.L, 0, 0], [B.L, B.W, 0]], [[B.L, B.W, 0], [B.L, B.W, B.H]], [[B.L, B.W, B.H], [B.L, 0, B.H]], [[0, 0, B.H], [0, B.W, B.H]], [[0, B.W, B.H], [B.L, B.W, B.H]]];
    E.forEach(([p, q], i) => Ink.path(ctx, [Pj(B.O, B.c, ...p), Pj(B.O, B.c, ...q)], { w: 2, alpha: a * 0.3, seed: seed + i, taper: [0, 0] }));
  }
  function dims(ctx, env, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(B.O, B.c, ...p), Q = Pj(B.O, B.c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    let q = m([0, 0, 0], [B.L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([B.L, 0, 0], [B.L, B.W, 0]); F().T(ctx, labels[1], q[0] + 52, q[1] + 10, o);
    q = m([B.L, B.W, 0], [B.L, B.W, B.H]); F().T(ctx, labels[2], q[0] + 50, q[1], o);
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bir hediye kutusunu kâğıtla kaplayalım'],
      [10.6, 27.8, 'Kutuyu açalım: yüzey açınımı'],
      [28.4, 45.8, 'Açınım ile yüzey alanı arasındaki ilişki'],
      [46.4, 63.8, 'Açınımdan yüzey alanını hesaplayalım'],
      [64.4, 79.8, 'Üstü açık bir kutu'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), a = END(t), c = L.ST.c, u = L.NT.u;
    // the 4 × 3 × 2 box
    const B = { L: 4, W: 3, H: 2, O: [L.ST.x, L.ST.y], c, T: L.NT, u };
    const a1 = win(t, 4.6, 63.8) * a;
    if (a1 > 0) {
      ghost(ctx, B, a1 * seg(t, 11.0, 11.6), 20000);
      const st = { back: 0, left: 1, bottom: 2, front: 3, right: 4, top: 5 };
      const m = (n) => {
        const i = st[n];
        if (t < 19.4) return [null, NET1, seg(t, 11.0 + i * 0.35, 12.4 + i * 0.35)];
        if (t < 28.4) return [NET1, NET2, seg(t, 19.6 + i * 0.2, 21.2 + i * 0.2)];
        return [NET2, NET1, seg(t, 29.0 + i * 0.15, 30.6 + i * 0.15)];
      };
      const hot = (n, k) => (k === 'tb' ? win(t, 36.0, 38.2) + win(t, 50.4, 52.4) : 0) + (k === 'fb' ? win(t, 38.4, 40.6) + win(t, 52.6, 54.6) : 0) + (k === 'lr' ? win(t, 40.8, 43.0) + win(t, 54.8, 56.8) : 0);
      boxNet(ctx, env, B, t, a1 * seg(t, 4.8, 5.6), m, { hot, dims: win(t, 15.2, 33.8), grid: seg(t, 31.4, 33.4), area: seg(t, 34.0, 34.6) }, 21000);
      dims(ctx, env, B, a1 * win(t, 6.4, 10.8), ['4 cm', '3 cm', '2 cm']);
    }
    // the open 5 × 4 × 3 box
    const k2 = 0.8, B2 = { L: 5, W: 4, H: 3, open: true, O: [L.ST.x, L.ST.y], c: c * k2, T: L.NT, u: Math.round(u * k2) };
    const a2 = win(t, 64.8, 79.8) * a;
    if (a2 > 0) {
      ghost(ctx, Object.assign({}, B2, { H: B2.H }), a2 * seg(t, 67.4, 68.0), 22000);
      const st = { back: 0, left: 1, bottom: 2, front: 3, right: 4 };
      boxNet(ctx, env, B2, t, a2 * seg(t, 65.0, 65.8), (n) => [null, NET3, seg(t, 67.4 + st[n] * 0.35, 68.8 + st[n] * 0.35)],
        { hot: (n, k) => (k === 'tb' ? win(t, 72.0, 73.6) : 0) + (k === 'fb' ? win(t, 73.6, 75.2) : 0) + (k === 'lr' ? win(t, 75.2, 76.8) : 0), area: seg(t, 70.6, 71.2) }, 23000);
      dims(ctx, env, B2, a2 * win(t, 65.8, 68.2), ['5 cm', '4 cm', '3 cm']);
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.0, 10.2, 'Kutunun ayrıtları 4 cm, 3 cm ve 2 cm'],
      [11.0, 15.0, 'Kutuyu ayrıtlarından kesip açalım'], [15.2, 19.4, 'Altı dikdörtgen yüz: 4×3, 4×2 ve 3×2'], [19.6, 27.8, 'Başka biçimde de açılabilir: farklı bir açınım'],
      [29.4, 45.8, 'Yüzey alanı = açınımdaki dikdörtgenlerin alanları toplamı'],
      [47.4, 63.8, 'Yüzey alanı = 2·(4·3) + 2·(4·2) + 2·(3·2)'],
      [65.4, 69.8, 'Üstü açık kutu: 5 cm, 4 cm, 3 cm'], [70.0, 79.8, 'Açınımda kapak yok: 5 yüz']]);
    exprs(ctx, t, at(W, 1), [[23.0, 27.8, 'Aynı altı yüz, yalnızca yerleri farklı'],
      [35.8, 45.8, 'Karşılıklı yüzler eş: 12 ile 12, 8 ile 8, 6 ile 6'],
      [50.4, 63.8, '= 24 + 16 + 12'],
      [72.0, 79.8, '20 + 2·15 + 2·12 = 20 + 30 + 24']]);
    exprs(ctx, t, at(W, 2), [[8.6, 10.2, 'Kaç cm² kâğıt gerekir?', true], [24.4, 27.8, 'Her açınım katlanınca aynı kutu olur', true],
      [43.0, 45.8, 'Her yüz çiftinin alanı iki kez sayılır', true],
      [57.2, 63.8, '= 52 cm²: kutuyu 52 cm² kâğıt kaplar', true],
      [77.0, 79.8, '= 74 cm²', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Açınım: kutunun açılmış hâli', 80.6], ['Farklı açınımlar, aynı yüzler', 81.6], ['Yüzey alanı = yüzlerin alanları toplamı', 82.6], ['Karşılıklı yüzler eş: her alan iki kez!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A gift box', nameTr: 'Hediye kutusu', concept: '4 × 3 × 2 cm', conceptTr: '4 × 3 × 2 cm', render });
})(window.LI = window.LI || {});
