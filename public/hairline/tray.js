/**
 * Tray: nine plates, three by three. Each top face can wear one tool mark,
 * flush on the plate via the same isometric overlay. The plates rest in
 * one band. The pointer nudges the plate under it; neighbours rise
 * less, staggered outward. Hit testing uses each plate's resting top.
 *
 * TILE_MARKS is the only place logos are mapped to seats (row-major 0..8).
 * A null seat stays blank until its SVG lands in /public/toolkit/.
 */
const {
  Cam, fit, proj, unproj, facing, rings, prism, rrect, ringAt, run, hull, poly, open,
  tween, tset, tval, tdone, disposer, mk, pointer, register, solid, put,
} = HL;

const COLS = 3, ROWS = 3;
const TW = 32, TD = 28, GAP = 9, PAD = 12;
const FACE = 3.6, CORNER = 4.2, CREASE = 2.1;
const WALL = 10, WT = 3.6, WR = 8;
const SEAT = 0.5, SLIDE = 0.2;
const X0 = 0, Y0 = 0;
const X1 = PAD * 2 + COLS * TW + (COLS - 1) * GAP;
const Y1 = PAD * 2 + ROWS * TD + (ROWS - 1) * GAP;
const REST = [
  1.0, 3.2, 1.4,
  4.6, 5.4, 6.2,
  2.2, 5.0, 2.4,
];
/* The slider's far end. The fit uses it, so a full nudge still sits in the frame. */
const NUDGE_MAX = 16;
const MARK_INSET = 2.5;
/* Shared fit. Every file is the same 640×560 canvas (8:7, same shape as a tile),
   so one scale gives them the same weight. 0.9 leaves a margin inside the inset. */
const MARK_FIT = 0.9;
/* One loop of the lap, by seat. The last Mixpanel step returns to Github. */
const ROUTE = [0, 3, 6, 7, 4, 1, 2, 5, 8, 7, 4, 1];

/**
 * One entry per plate, left-to-right, top-to-bottom.
 * name: caption when the real pointer is on that plate
 * href: flat SVG under /toolkit/ — painted as-is, not redrawn
 * w/h: native viewBox, used to fit the mark on the top face
 * A null seat stays blank.
 */
const TILE_MARKS = [
  { name: "Github", href: "/toolkit/Github.svg", w: 640, h: 560 },
  { name: "Mixpanel", href: "/toolkit/Mixpanel.svg", w: 640, h: 560 },
  { name: "Vercel", href: "/toolkit/Vercel.svg", w: 640, h: 560 },
  { name: "Lovable", href: "/toolkit/Lovable.svg", w: 640, h: 560 },
  { name: "Cursor", href: "/toolkit/Cursor.svg", w: 640, h: 560 },
  { name: "Figma", href: "/toolkit/Figma.svg", w: 640, h: 560 },
  { name: "Notion", href: "/toolkit/Notion.svg", w: 640, h: 560 },
  { name: "Claude", href: "/toolkit/Claude.svg", w: 640, h: 560 },
  { name: "Dovetail", href: "/toolkit/Dovetail.svg", w: 640, h: 560 },
];

/** How much a plate answers, by its distance in seats from the one touched. The one under the pointer rises fully; the four beside it follow; a diagonal only shrugs. */
function influence(di, dj) {
  const u = Math.hypot(di, dj);
  if (u < 0.01) return 1;
  if (u < 1.2) return 0.32;
  if (u < 1.7) return 0.1;
  return 0;
}

/** The tray, still: far half before the plates, near half after, so the front wall covers what sits behind it. */
function tray(P, front, outer, inner) {
  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const far = [
    [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WALL)))), "sil"],
    [poly(ringAt(P, inner, WALL)), "nf"],
    [open(ringAt(P, run(inner, (q) => !front(q)), WALL - 1.6)), "nf lo"],
  ];
  const iF = LR(ringAt(P, run(inner, front), WALL));
  const oT = LR(ringAt(P, run(outer, front), WALL));
  const oB = LR(ringAt(P, run(outer, front), 0));
  const hx = (X0 + X1) / 2;
  const onFront = (ring) => ring.map((q) => P(q.u, Y1, q.v));
  const near = [
    [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), "fo"],
    [open(oT), "nf lo"],
    [open(iF), "nf"],
    [open([oT[0], ...oB, oT[oT.length - 1]]), "nf sil"],
    [poly(onFront(rrect(hx - 13, 2.6, hx + 13, 7.2, 2.4, 4))), "nf"],
    [poly(onFront(rrect(hx - 10.6, 3.6, hx + 10.6, 6.2, 1.4, 4))), "nf lo"],
  ];
  return { far, near };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let nudge = value;

  const fitPts = [[X0 - 2, Y0 - 2, 0], [X1 + 2, Y0 - 2, WALL], [X0 - 2, Y1 + 2, WALL], [X1 + 2, Y1 + 2, 0]];
  for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
    const slide = NUDGE_MAX * SLIDE;
    const z = WALL + SEAT + REST[row * COLS + col] + NUDGE_MAX + FACE;
    const x = PAD + col * (TW + GAP) + slide, y = PAD + row * (TD + GAP) + slide;
    fitPts.push([x, y, z], [x + TW, y + TD, z]);
  }
  const C = Cam(45, 0.5, 1.7);
  fit(C, fitPts, 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(X0, Y0, X1, Y1, WR, 6);
  const inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const paths = tray(P, front, outer, inner);

  const g = mk("g", {}, svg);
  /* Soft contact under the whole base. Drawn first so the tray covers it. */
  const blur = mk("filter", { id: "tray-ground", x: "-40%", y: "-40%", width: "180%", height: "180%" }, mk("defs", {}, svg));
  mk("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "3.2" }, blur);
  const shade = mk("g", { filter: "url(#tray-ground)", transform: "translate(0 4.5)" }, g);
  mk("path", { d: poly(ringAt(P, outer, 0)), fill: "#121211", "fill-opacity": "0.16", stroke: "none" }, shade);
  for (const [d, cls] of paths.far) mk("path", { d, class: cls }, g);

  const plates = [];
  const paint = [];
  for (let sum = 0; sum <= COLS + ROWS - 2; sum++) for (let col = 0; col < COLS; col++) {
    const row = sum - col;
    if (row < 0 || row >= ROWS) continue;
    const id = row * COLS + col;
    const x = PAD + col * (TW + GAP), y = PAD + row * (TD + GAP);
    const plate = {
      id, col, row, x, y,
      cx: x + TW / 2, cy: y + TD / 2,
      rest: REST[id],
      zTop: WALL + SEAT + REST[id] + FACE,
      peak: false,
      tw: tween(0),
      drawn: -1,
      el: solid(g),
    };
    plates[id] = plate;
    paint.push(plate);
  }

  for (const [d, cls] of paths.near) mk("path", { d, class: cls }, g);

  /** The plate whose resting top the pointer is over; -1 on the rim or off the tray. */
  function hit(pt) {
    let best = -1, bestD = 1e9;
    for (const plate of paint) {
      const [x, y] = unproj(C, pt[0], pt[1], plate.zTop);
      const dx = x - plate.cx, dy = y - plate.cy;
      if (Math.abs(dx) > TW / 2 + GAP / 2 || Math.abs(dy) > TD / 2 + GAP / 2) continue;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = plate.id; }
    }
    return best;
  }

  /*
   * Same overlay the center proof used. Each mark stays a flat SVG (an <image>
   * of the file, so nothing is redrawn or extruded). The host group's matrix
   * is the tile's top face through the tray camera, so the mark sits flush
   * and lifts with the plate. A null seat in TILE_MARKS stays blank.
   */
  const marks = TILE_MARKS.map((cfg, id) => {
    if (!cfg) return null;
    const host = mk("g", {}, plates[id].el.g);
    const svg = mk("svg", {
      viewBox: `0 0 ${cfg.w} ${cfg.h}`,
      preserveAspectRatio: "xMidYMid meet",
      "data-mark": cfg.name,
    }, host);
    mk("image", { href: cfg.href, width: cfg.w, height: cfg.h }, svg);
    return { cfg, host, svg };
  });

  function placeMark(mark, x, y, z) {
    const { cfg, host, svg } = mark;
    const availW = TW - MARK_INSET * 2, availH = TD - MARK_INSET * 2;
    const s = Math.min(availW / cfg.w, availH / cfg.h) * MARK_FIT;
    const w = cfg.w * s, h = cfg.h * s;
    svg.setAttribute("x", x + (TW - w) / 2);
    svg.setAttribute("y", y + (TD - h) / 2);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    const o = P(0, 0, z), ux = P(1, 0, z), uy = P(0, 1, z);
    const a = ux[0] - o[0], b = ux[1] - o[1], c = uy[0] - o[0], d = uy[1] - o[1];
    const n = (v) => Math.round(v * 1000) / 1000;
    host.setAttribute("transform", `matrix(${n(a)} ${n(b)} ${n(c)} ${n(d)} ${n(o[0])} ${n(o[1])})`);
  }

  function draw(plate, now) {
    const w = tval(plate.tw, now);
    const rise = plate.rest + w * nudge;
    const slide = w * nudge * SLIDE;
    const key = Math.round(rise * 40) + Math.round(slide * 40) * 1000;
    if (key === plate.drawn) return;
    plate.drawn = key;
    const x = plate.x + slide, y = plate.y + slide;
    const z0 = WALL + SEAT + rise;
    const [ring, innerRing] = rings(x, y, x + TW, y + TD, CORNER, CREASE);
    put(plate.el, prism(P, front, ring, innerRing, z0, z0 + FACE));
    const mark = marks[plate.id];
    if (mark) placeMark(mark, x, y, z0 + FACE);
  }

  const loop = register(stage, (_dt, now) => {
    let moving = false;
    for (const plate of paint) {
      draw(plate, now);
      if (!tdone(plate.tw, now)) moving = true;
    }
    return moving;
  });
  bag.add(loop.unregister);

  let act = -1;
  /** Nudges plate a up (-1 sets them back). Tool names show only for a real cursor, not the lap. */
  function setActive(a, fromCursor) {
    const mark = a >= 0 ? TILE_MARKS[a] : null;
    const name = a < 0
      ? "rest"
      : mark && fromCursor
        ? mark.name
        : `slot ${a + 1}`;
    if (a === act) {
      if (read.textContent !== name) read.textContent = name;
      return;
    }
    const now = performance.now(), from = a >= 0 ? a : act;
    const fromCol = from % COLS, fromRow = Math.floor(from / COLS);
    act = a;
    for (const plate of paint) {
      const di = plate.col - fromCol, dj = plate.row - fromRow;
      tset(plate.tw, a < 0 ? 0 : influence(di, dj), now, Math.round(Math.hypot(di, dj) * 50));
      plate.el.sil.classList.toggle("hi", a < 0 ? plate.peak : plate.id === a);
      plate.el.cr.classList.toggle("crease-lift", a >= 0 && plate.id === a);
    }
    read.textContent = name;
    loop.wake();
  }

  for (const plate of paint) plate.el.sil.classList.toggle("hi", plate.peak);
  read.textContent = "rest";

  bag.add(pointer(stage, {
    move: (pt, event) => setActive(hit(pt), !!(event && event.pointerType !== "ghost")),
    leave: () => setActive(-1, false),
  }));
  bag.add(() => svg.replaceChildren());

  /* The lap aims at the resting center of each seat, in camera space. */
  const tour = ROUTE.map((id) => P(plates[id].cx, plates[id].cy, plates[id].zTop));

  return {
    set(v) { nudge = v; for (const plate of paint) plate.drawn = -1; loop.wake(); },
    destroy: bag.dispose,
    tour,
  };
}

hairline({
  name: "tray",
  means: "Nine blank plates in a tray: the one under the pointer nudges up, and its neighbours rise after it.",
  rules: [1, 2, 5, 8],
  range: [6, 13, 16],
  mount,
});
