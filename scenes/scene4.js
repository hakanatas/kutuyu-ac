/* SAHNE 4 — HESAPLA (46–64 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 64, name: "Calculate", nameTr: "Hesapla", concept: "2·12 + 2·8 + 2·6 = 52", conceptTr: "2·12 + 2·8 + 2·6 = 52", render });
})(window.LI = window.LI || {});
