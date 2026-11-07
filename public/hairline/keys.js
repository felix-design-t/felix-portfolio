/**
 * Three key faces in one row. No tray, no logos.
 * A lift walks left to right, then right to left, one second per step.
 * A real pointer pauses that walk and takes the key under it.
 */
const {
  Cam, fit, proj, unproj, facing, rings, prism,
  tween, tset, tval, reducedMotion, disposer, pointer, register, solid, put,
} = HL;

const TW = 16, TD = 14, STEP = 18;
const FACE = 2.2, CORNER = 2.1, CREASE = 0.85;
const NUDGE = 4.2;
/* One second to travel from the key that is up to the next one. */
const TRAVEL = 1000;
/* Left, middle, right, then back through the middle. Repeats. */
const ORDER = [0, 1, 2, 1];

const seats = [0, 1, 2].map((i) => ({
  id: i,
  x: i * STEP,
  y: -i * STEP,
}));

function mount({ stage, svg }) {
  const bag = disposer();
  const fitPts = [];
  for (const seat of seats) {
    const z = FACE + NUDGE + 1.2;
    fitPts.push([seat.x, seat.y, 0], [seat.x + TW, seat.y + TD, z]);
  }
  const C = Cam(45, 0.5, 1.55);
  fit(C, fitPts, 200, 160);
  const P = proj(C), front = facing(C);

  const paint = seats.map((seat) => ({
    ...seat,
    zTop: FACE,
    tw: tween(0),
    drawn: -1,
    el: solid(svg),
  }));

  /* Which stop of the walk is showing, and when that step began. */
  let step = 0;
  let legStart = 0;
  let pointerOn = false;

  function draw(key, now) {
    const w = tval(key.tw, now);
    const rise = w * NUDGE;
    const stamp = Math.round(rise * 40);
    if (stamp === key.drawn) return;
    key.drawn = stamp;
    const z0 = Math.max(0, rise);
    const [ring, innerRing] = rings(key.x, key.y, key.x + TW, key.y + TD, CORNER, CREASE);
    put(key.el, prism(P, front, ring, innerRing, z0, z0 + FACE));
  }

  let act = -1;
  let pumpId = 0;

  /* Raise one key and lower the others. dur is how long that move takes. */
  function liftKey(id, now, dur) {
    for (const key of paint) {
      key.tw.dur = dur;
      const dist = id < 0 ? 0 : Math.abs(key.id - id);
      const lift = id < 0 ? 0 : dist === 0 ? 1 : pointerOn && dist === 1 ? 0.28 : 0;
      tset(key.tw, lift, now, 0);
      key.el.sil.classList.toggle("hi", id >= 0 && key.id === id);
    }
  }

  function pump(now) {
    pumpId = 0;
    if (!pointerOn && !reducedMotion()) {
      if (!legStart || now - legStart >= TRAVEL) {
        if (legStart) step = (step + 1) % ORDER.length;
        legStart = now;
        liftKey(ORDER[step], now, TRAVEL);
      }
    }
    for (const key of paint) draw(key, now);
    pumpId = requestAnimationFrame(pump);
  }
  function wake() {
    if (!pumpId) pumpId = requestAnimationFrame(pump);
  }
  const loop = register(stage, (_dt, now) => {
    for (const key of paint) draw(key, now);
    return true;
  });
  bag.add(loop.unregister);
  bag.add(() => { if (pumpId) cancelAnimationFrame(pumpId); });
  setTimeout(() => { pumpId = 0; wake(); }, 0);

  function hit(pt) {
    let best = -1, bestD = 1e9;
    for (const key of paint) {
      const [x, y] = unproj(C, pt[0], pt[1], key.zTop);
      const dx = x - (key.x + TW / 2), dy = y - (key.y + TD / 2);
      if (Math.abs(dx) > TW / 2 + 2 || Math.abs(dy) > TD / 2 + 2) continue;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = key.id; }
    }
    return best;
  }

  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    pointerOn = a >= 0;
    if (pointerOn) {
      liftKey(a, now, 700);
    } else {
      /* The walk starts again from the key it had reached. */
      legStart = now;
      liftKey(ORDER[step], now, TRAVEL);
    }
    wake();
    loop.wake();
  }

  bag.add(pointer(stage, {
    move: (pt) => setActive(hit(pt)),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set() {}, destroy: bag.dispose };
}

hairline({
  name: "keys",
  means: "Three keys in a row. A lift walks left to right, then back.",
  rules: [1, 2],
  range: [2, 4, 6],
  mount,
});
