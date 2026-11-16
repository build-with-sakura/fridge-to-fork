/* ============================================================
   DISH DRAWINGS
   Each recipe has its own drawn dish, keyed by recipe id.
   These show whenever a real photo is missing or cannot load.
   Every dish is drawn inside a 200 x 200 box.
   ============================================================ */
import { createElement as h, cloneElement } from 'react';

export function C(x, y, r, f) { return h('circle', { cx: x, cy: y, r: r, fill: f }); }
function E(x, y, rx, ry, f, rot) { return h('ellipse', { cx: x, cy: y, rx: rx, ry: ry, fill: f, transform: 'rotate(' + (rot || 0) + ' ' + x + ' ' + y + ')' }); }
function B(x, y, w, ht, f, rot, rad) { return h('rect', { x: x - w / 2, y: y - ht / 2, width: w, height: ht, rx: rad == null ? 3 : rad, fill: f, transform: 'rotate(' + (rot || 0) + ' ' + x + ' ' + y + ')' }); }
function P(d, f) { return h('path', { d: d, fill: f }); }
function S(d, c, w) { return h('path', { d: d, fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' }); }
function O(x, y, r, c, w) { return h('circle', { cx: x, cy: y, r: r, fill: 'none', stroke: c, strokeWidth: w }); }
function each(pts, fn) { return pts.map(function (q) { return fn(q[0], q[1], q[2]); }); }
export function plate() { return [C(100, 100, 90, '#FFFFFF'), O(100, 100, 89, '#E6DAE8', 2.5), O(100, 100, 68, '#F3ECF4', 2)]; }
function oval() { return [E(100, 100, 94, 74, '#FFFFFF'), h('ellipse', { cx: 100, cy: 100, rx: 93, ry: 73, fill: 'none', stroke: '#E6DAE8', strokeWidth: 2.5 })]; }
function bowl(rim, inside) { return [C(100, 100, 90, rim), C(100, 100, 78, inside)]; }
function greens(pts) { return each(pts, function (x, y, r) { return B(x, y, 9, 4, '#3FA34D', r, 2); }); }

export const DISH = {
  'chicken-adobo': function () { return [bowl('#FFFFFF', '#5B2F16'), E(100, 100, 70, 66, '#6E3A1C'),
    E(76, 90, 27, 19, '#A8622E', -20), E(70, 84, 11, 4, '#D49257', -20), E(122, 84, 25, 18, '#9A5526', 25), E(118, 78, 10, 4, '#C98448', 25), E(104, 126, 29, 19, '#B06A32', 8), E(98, 120, 12, 4, '#D99A5E', 8),
    P('M128 116c14-12 30-10 36 0-12 12-28 12-36 0z', '#4E8B4A'), S('M130 116c12-3 24-3 32 0', '#2F6B33', 1.5),
    each([[60, 120], [86, 58], [140, 108], [92, 150], [132, 142], [54, 98]], function (x, y) { return C(x, y, 3.5, '#24120B'); })]; },
  'tortang-talong': function () { return [oval(),
    P('M34 104c4-26 40-40 72-34 30 5 48 22 44 40-5 22-44 32-76 26-26-5-43-14-40-32z', '#F2B632'),
    E(74, 96, 20, 10, '#DE9A2B', -15), E(112, 116, 22, 9, '#DE9A2B', 10), E(98, 90, 12, 5, '#FBD46B', 0),
    P('M146 88l24-16c7 7 7 17 0 24z', '#5B8F3A'), S('M168 76c5 3 6 10 2 16', '#3E6B26', 2),
    C(60, 136, 11, '#D8262B'), C(57, 133, 3, '#F0655F'), greens([[92, 104, 20], [120, 96, -30], [70, 112, 60], [104, 124, -10]])]; },
  'ginisang-repolyo': function () { return [plate(),
    S('M52 96c14-18 30 14 46-4s26 10 44-6', '#CDE89A', 11), S('M56 118c16-14 28 12 44-2s28 8 42-8', '#E3F3BD', 11), S('M66 74c12-10 26 10 38 0s22 6 34-4', '#B7DB7E', 10), S('M70 138c12-10 24 8 36 0s18-2 26-8', '#CDE89A', 10),
    each([[78, 92], [122, 110], [100, 132], [130, 80], [66, 120]], function (x, y) { return [C(x, y, 9, '#FF8A2A'), C(x, y, 4.5, '#FFB267')]; }),
    B(96, 104, 18, 11, '#C98B6B', 20, 4), B(112, 88, 16, 10, '#B97858', -25, 4), B(84, 126, 16, 10, '#C98B6B', -10, 4), B(118, 128, 15, 9, '#B97858', 35, 4)]; },
  'sinangag': function () { return [plate(), C(100, 104, 60, '#FFF6DF'), C(100, 104, 60, 'none'),
    each([[66, 92, 20], [78, 128, -30], [124, 136, 40], [140, 100, -10], [118, 66, 60], [84, 70, -40], [62, 114, 10], [102, 150, 0], [136, 122, 70], [74, 104, 80], [96, 62, 15]], function (x, y, r) { return E(x, y, 6, 2.6, '#E9D8AE', r); }),
    each([[70, 80], [130, 84], [142, 114], [88, 144], [116, 148], [60, 104], [108, 58]], function (x, y) { return C(x, y, 3.2, '#D39A2E'); }),
    P('M70 100c-4-20 16-34 36-30 22 3 36 16 32 34-4 20-22 28-40 26-16-2-25-12-28-30z', '#FFFFFF'), S('M70 100c-4-20 16-34 36-30 22 3 36 16 32 34-4 20-22 28-40 26-16-2-25-12-28-30z', '#F0E4CC', 2),
    C(104, 98, 16, '#FFB81C'), C(98, 92, 4.5, '#FFE08A'), greens([[84, 118, 30], [126, 112, -20]])]; },
  'oyakodon': function () { return [bowl('#1F3D73', '#FFF6DF'), C(100, 100, 66, '#FFD54A'),
    S('M58 96c18-22 60-26 84-2', '#FFE98A', 9), S('M62 120c20 16 56 16 76-2', '#FFE98A', 8), S('M80 78c14-6 30-6 42 2', '#FFF4BF', 5),
    E(74, 98, 17, 12, '#EDBE90', -20), E(126, 96, 16, 11, '#E3B080', 25), E(98, 128, 18, 12, '#EDBE90', 5), E(108, 72, 14, 10, '#E3B080', -10),
    S('M84 112c8-6 18-6 28 0', '#FFF8E1', 4), S('M112 110c8 4 14 10 16 18', '#FFF8E1', 4),
    B(96, 98, 22, 4, '#1F3A2A', 20, 2), B(104, 104, 22, 4, '#1F3A2A', -25, 2), B(100, 94, 18, 4, '#1F3A2A', 70, 2), greens([[90, 86, 0], [118, 114, 40], [80, 120, -30]])]; },
  'japanese-curry': function () { return [oval(),
    P('M100 34c-42 2-78 28-78 66s36 64 78 66c-12-40-12-92 0-132z', '#FFF6DF'), P('M100 34c42 2 78 28 78 66s-36 64-78 66c-12-40-12-92 0-132z', '#8A4B1F'),
    P('M100 44c-10 36-10 76 0 112 8-4 14-10 18-18-8-24-8-52 0-76-4-8-10-14-18-18z', '#9C5B2A'),
    B(128, 78, 18, 18, '#FF8A2A', 15, 4), B(150, 110, 16, 16, '#FF8A2A', -20, 4), B(124, 134, 15, 15, '#FF8A2A', 30, 4),
    B(146, 84, 17, 17, '#F4D27A', -10, 4), B(128, 106, 18, 18, '#F4D27A', 25, 4), B(144, 136, 15, 15, '#F4D27A', 5, 4),
    E(112, 90, 13, 9, '#D9A679', 30), E(136, 122, 13, 9, '#D9A679', -30),
    each([[56, 62], [64, 56], [62, 68], [70, 63]], function (x, y) { return C(x, y, 5, '#D8262B'); })]; },
  'miso-soup': function () { return [C(100, 100, 90, '#B3261E'), C(100, 100, 80, '#1E1414'), C(100, 100, 72, '#D9A455'), E(90, 92, 44, 30, '#E6BE78', -15), E(118, 122, 30, 18, '#E0B46A', 10),
    B(78, 84, 20, 20, '#FFFFFF', 12, 3), B(120, 80, 19, 19, '#FBF7EE', -18, 3), B(104, 112, 20, 20, '#FFFFFF', 30, 3), B(72, 122, 18, 18, '#FBF7EE', -8, 3), B(134, 116, 18, 18, '#FFFFFF', 20, 3),
    P('M52 100c8-8 18-6 20 4-6 8-16 8-20-4z', '#1F5A3A'), P('M112 142c10-6 20-2 22 6-8 6-18 4-22-6z', '#1F5A3A'), P('M96 58c8-6 16-2 18 4-6 6-14 4-18-4z', '#27704A'),
    each([[94, 74], [140, 96], [88, 138], [112, 96], [60, 112], [124, 136]], function (x, y) { return O(x, y, 5, '#3FA34D', 3); })]; },
  'gyudon': function () { return [C(100, 100, 90, '#FFFFFF'), O(100, 100, 84, '#2F6FD0', 4), C(100, 100, 76, '#FFF6DF'),
    S('M48 92c16-16 30 8 46-6s24 8 40-4', '#7A4526', 14), S('M52 116c16-12 28 10 44-2s26 6 42-8', '#955A34', 14), S('M62 70c14-10 26 8 40 0s22 4 34-2', '#8A4E2C', 12), S('M66 138c14-8 24 8 38 0s20-2 30-8', '#7A4526', 12),
    S('M58 104c12-6 22 4 34-2', '#F3DDB0', 5), S('M108 124c10-6 20 2 30-6', '#F3DDB0', 5), S('M96 82c10-4 18 4 28-2', '#F7E7C4', 5),
    each([[94, 98, 20], [102, 104, -30], [108, 96, 60], [98, 108, 80], [106, 110, 10], [112, 102, -60], [100, 94, 40]], function (x, y, r) { return B(x, y, 16, 4, '#E6246E', r, 2); })]; },
  'tomato-egg': function () { return [plate(),
    E(78, 88, 26, 18, '#FFD23F', -20), E(122, 84, 24, 17, '#FFE27A', 20), E(100, 118, 30, 19, '#FFD23F', 5), E(66, 118, 20, 14, '#FFE27A', 30), E(134, 116, 20, 14, '#FFD23F', -25), E(100, 70, 20, 12, '#FFE27A', 0),
    each([[92, 96, -20], [126, 102, 40], [78, 132, 10], [116, 136, -35], [64, 98, 60]], function (x, y, r) { return h('g', { transform: 'rotate(' + r + ' ' + x + ' ' + y + ')' }, P('M' + (x - 16) + ' ' + y + 'c4-14 28-14 32 0-8 8-24 8-32 0z', '#E6392B'), P('M' + (x - 10) + ' ' + (y - 1) + 'c4-7 16-7 20 0-6 4-14 4-20 0z', '#FF7A66')); }),
    greens([[104, 104, 20], [84, 112, -40], [118, 120, 70], [110, 84, 0], [72, 104, 30], [128, 130, -10]])]; },
  'spanish-omelette': function () { return [plate(), C(100, 104, 64, '#D9982B'), C(100, 100, 64, '#F0B63A'), C(100, 98, 56, '#F7CB5A'),
    E(80, 84, 16, 9, '#E5A736', -20), E(124, 110, 18, 9, '#E5A736', 25), E(96, 126, 14, 7, '#E5A736', 0), E(120, 78, 10, 6, '#FBDD8A', 10), E(76, 112, 10, 5, '#FBDD8A', -30),
    S('M100 98V40M100 98l50 30M100 98l-50 30', '#C58A1E', 3), greens([[100, 98, 0], [94, 92, 60], [108, 102, -40]])]; }
};
export const TINTS = [['#FFE3EE', '#FF8FB8'], ['#FFF1BF', '#FFC928'], ['#D6F5F5', '#5DD9DC'], ['#FFE2CC', '#FFA45C']];
function flat(list, out) { out = out || []; list.forEach(function (x) { if (Array.isArray(x)) flat(x, out); else if (x) out.push(x); }); return out; }
export function keyed(list) { return flat(list).map(function (el, i) { return cloneElement(el, { key: i }); }); }
