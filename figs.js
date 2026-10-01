/* ══════════════════════════════════════════════════════════════
   기초학력 마스터 — 그림 모음 (보조08 · 2026-10-01)
   공용 그리기 도우미 links/fig.js 를 쓴다. index.html(배우기) · lesson.js(수업 슬라이드)가 함께 부른다.

   한 칸의 모양
     키: { cap:'캡션 한 줄', cards:['공식노트 카드 제목'…], chips:['국어·영어 칩 key'…], draw:function(){ … } }
       cards — index.html 의 MATH_FORMULA_SETS 카드 title 과 **똑같이**. 그 카드 안 예시 아래에 그림이 붙는다
       chips — STUDY_CATEGORIES 의 key. 그 칩 화면 맨 위 「🖼️ 그림으로 먼저 보기」에 나온다
     순서 = 화면에 나오는 순서.

   수치·예문은 카드 본문·예시(index.html)와 슬라이드(lesson.js)에 있는 것만 썼다.
   카드에 예가 없어 새로 만든 예문은 캡션에 「(예시)」라고 적었다.
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, poly = F.poly;

  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4) + '" fill="' + (c || C.ink) + '"/>'; }
  function ring(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 5) + '" fill="#fff" stroke="' + (c || C.ink) + '" stroke-width="2.2"/>'; }
  function rect(x, y, w, h, fill, c, sw) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" stroke="' + (c || C.ink) + '" stroke-width="' + (sw || 1.6) + '"/>';
  }
  /* 곡선 화살표 (위로 볼록한 호) */
  function hop(x1, x2, y, hgt, c, lab, o) {
    o = o || {};
    var mx = (x1 + x2) / 2, d = 'M' + x1 + ',' + y + ' Q' + mx + ',' + (y - hgt * 2) + ' ' + x2 + ',' + y;
    var ang = Math.atan2(y - (y - hgt * 2), x2 - mx), hs = 10;
    var s = F.path(d, { c: c, w: 2 });
    s += '<polygon points="' + x2 + ',' + y + ' ' + (x2 + hs * Math.cos(ang + Math.PI * 0.85)) + ',' + (y + hs * Math.sin(ang + Math.PI * 0.85)) +
      ' ' + (x2 + hs * Math.cos(ang - Math.PI * 0.85)) + ',' + (y + hs * Math.sin(ang - Math.PI * 0.85)) + '" fill="' + c + '"/>';
    if (lab) s += t(mx, y - hgt - 12, lab, { a: 'm', c: c, b: 1, size: o.size || 15 });
    return s;
  }

  /* 수직선: 값 a~b 를 픽셀 x0~x1 에. show = 숫자를 적을 값들(없으면 전부) */
  function numline(x0, x1, y, a, b, show) {
    var X = function (v) { return x0 + (v - a) * (x1 - x0) / (b - a); };
    var s = arrow(x0 - 14, y, x1 + 22, y, { w: 1.8, head: 10 });
    for (var v = a; v <= b; v++) {
      s += line(X(v), y - 6, X(v), y + 6, { w: 1.4 });
      if (!show || show.indexOf(v) >= 0)
        s += t(X(v), y + 22, v < 0 ? '−' + (-v) : String(v), { a: 'm', size: 14, c: v === 0 ? C.ink : C.sub, b: v === 0 });
    }
    return { s: s, X: X };
  }

  /* 좌표평면: 원점 픽셀(ox,oy), 한 칸 ux·uy, 범위 x:a~b · y:c~d */
  function plane(ox, oy, ux, uy, a, b, c, d, o) {
    o = o || {};
    var X = function (v) { return ox + v * ux; }, Y = function (v) { return oy - v * uy; };
    var s = '', st = o.step || 1;
    for (var v = a; v <= b; v += st) if (v) s += line(X(v), Y(c), X(v), Y(d), { c: C.edge, w: 1 });
    for (var w = c; w <= d; w += st) if (w) s += line(X(a), Y(w), X(b), Y(w), { c: C.edge, w: 1 });
    s += arrow(X(a) - 6, oy, X(b) + 18, oy, { w: 1.6, head: 9 }) + arrow(ox, Y(c) + 6, ox, Y(d) - 18, { w: 1.6, head: 9 });
    s += t(X(b) + 16, oy + 16, 'x', { a: 'm', size: 15, c: C.sub }) + t(ox - 14, Y(d) - 14, 'y', { a: 'm', size: 15, c: C.sub }) +
      t(ox - 11, oy + 14, 'O', { a: 'm', size: 14, c: C.sub });
    (o.xt || []).forEach(function (v) { s += line(X(v), oy - 4, X(v), oy + 4, { w: 1.2 }) + t(X(v), oy + 17, String(v), { a: 'm', size: 13, c: C.sub }); });
    (o.yt || []).forEach(function (v) { s += line(ox - 4, Y(v), ox + 4, Y(v), { w: 1.2 }) + t(ox - 9, Y(v), String(v), { a: 'e', size: 13, c: C.sub }); });
    return { s: s, X: X, Y: Y };
  }
  function curve(P, fn, x0, x1, o) {
    var pts = [];
    for (var i = 0; i <= 60; i++) { var x = x0 + (x1 - x0) * i / 60; pts.push([P.X(x), P.Y(fn(x))]); }
    return poly(pts, o);
  }

  return {

  /* ═══════════ 수학 — 공식노트 ═══════════ */

  /* ── 중1 ── */
  intadd: { cards: ['정수의 사칙연산'],
    cap: '(−5) + 3 — 수직선의 −5 에서 오른쪽으로 3칸 가면 −2',
    draw: function () {
      var N = numline(40, 440, 150, -6, 2);
      var s = N.s + hop(N.X(-5), N.X(-2), 150, 34, C.blue, '+3 → 오른쪽으로 3칸');
      s += dot(N.X(-5), 150, 7, C.ink) + dot(N.X(-2), 150, 7, C.blue);
      s += t(N.X(-5), 120, '출발', { a: 'm', size: 13, c: C.sub });
      s += t(240, 34, '(−5) + 3 = −2', { a: 'm', b: 1, size: 20 });
      s += t(240, 210, '더하면 오른쪽, 빼면 왼쪽으로 간다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 236, s);
    } },

  abs: { cards: ['절댓값'],
    cap: '절댓값 = 수직선에서 0 까지의 거리 — |−7| = 7, |5| = 5',
    draw: function () {
      var N = numline(36, 444, 150, -8, 6, [-8, -7, -4, 0, 4, 5, 6]);
      var s = N.s;
      s += F.dim(N.X(-7), 150, N.X(0), 150, '', { off: 34, c: C.red }) + t((N.X(-7) + N.X(0)) / 2, 100, '거리 7', { a: 'm', b: 1, c: C.red });
      s += F.dim(N.X(0), 150, N.X(5), 150, '', { off: 34, c: C.blue }) + t((N.X(0) + N.X(5)) / 2, 100, '거리 5', { a: 'm', b: 1, c: C.blue });
      s += dot(N.X(-7), 150, 7, C.red) + dot(N.X(5), 150, 7, C.blue) + dot(N.X(0), 150, 5);
      s += t(150, 34, '|−7| = 7', { a: 'm', b: 1, size: 20, c: C.red }) + t(330, 34, '|5| = 5', { a: 'm', b: 1, size: 20, c: C.blue });
      s += t(240, 210, '거리이므로 절댓값은 항상 0 이상', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 236, s);
    } },

  power: { cards: ['거듭제곱'],
    cap: '2³ = 2 × 2 × 2 — 한 모서리에 2개씩, 쌓기나무 8개',
    draw: function () {
      var a = 34, cx = 150, cy = 92, k = Math.cos(Math.PI / 6), h = 0.5;
      function P(x, y, z) { return [cx + (x - y) * a * k, cy + (x + y) * a * h - z * a]; }
      var s = '';
      function face(p0, p1, p2, p3, fill) { s += poly([p0, p1, p2, p3], { close: 1, fill: fill, w: 1.6 }); }
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
        face(P(i, j, 2), P(i + 1, j, 2), P(i + 1, j + 1, 2), P(i, j + 1, 2), C.blueL);   /* 윗면 */
        face(P(2, i, j), P(2, i + 1, j), P(2, i + 1, j + 1), P(2, i, j + 1), C.grayL);   /* 오른쪽 */
        face(P(i, 2, j), P(i + 1, 2, j), P(i + 1, 2, j + 1), P(i, 2, j + 1), C.grayM);   /* 왼쪽 앞 */
      }
      var b1 = P(2, 2, 0), b2 = P(2, 0, 0), b3 = P(0, 2, 0);
      s += t((b1[0] + b2[0]) / 2 + 16, (b1[1] + b2[1]) / 2 + 12, '2', { a: 'm', b: 1, c: C.blue });
      s += t((b1[0] + b3[0]) / 2 - 16, (b1[1] + b3[1]) / 2 + 12, '2', { a: 'm', b: 1, c: C.blue });
      var u = P(2, 0, 1); s += t(u[0] + 18, u[1] - 14, '2', { a: 'm', b: 1, c: C.blue });
      s += t(355, 100, '2³', { a: 'm', b: 1, size: 30 });
      s += t(355, 146, '= 2 × 2 × 2', { a: 'm', size: 18 });
      s += t(355, 182, '= 8', { a: 'm', b: 1, size: 20, c: C.blue });
      s += t(355, 222, '오른쪽 위 작은 수 = 곱한 횟수', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 250, s);
    } },

  distrib: { cards: ['분배법칙'],
    cap: '분배법칙 — 세로 2, 가로 (x + 3) 직사각형의 넓이는 2x + 6',
    draw: function () {
      var x0 = 70, y0 = 70, wx = 190, w3 = 96, hh = 90;
      var s = rect(x0, y0, wx, hh, C.blueL, C.ink, 2) + rect(x0 + wx, y0, w3, hh, C.orangeL, C.ink, 2);
      s += t(x0 + wx / 2, y0 + hh / 2, '2x', { a: 'm', b: 1, size: 24, c: C.blue });
      s += t(x0 + wx + w3 / 2, y0 + hh / 2, '6', { a: 'm', b: 1, size: 24, c: C.orange });
      s += F.dim(x0, y0, x0 + wx, y0, 'x', { off: 22 }) + F.dim(x0 + wx, y0, x0 + wx + w3, y0, '3', { off: 22 });
      s += arrow(x0 - 22, y0 + hh / 2 - 6, x0 - 22, y0, { w: 1, head: 9 }) + arrow(x0 - 22, y0 + hh / 2 + 6, x0 - 22, y0 + hh, { w: 1, head: 9 }) +
        t(x0 - 22, y0 + hh / 2, '2', { a: 'm', size: 15 });
      s += t(240, 200, '2(x + 3) = 2x + 6', { a: 'm', b: 1, size: 22 });
      s += t(240, 232, '괄호 밖의 수를 괄호 안 모든 항에 곱한다', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 256, s);
    } },

  eqbal: { cards: ['일차방정식'],
    cap: '방정식은 저울 — 양쪽에서 똑같이 5를 빼도 균형은 그대로 (x + 5 = 12 → x = 7)',
    draw: function () {
      function scale(cx, L, R, Lc) {
        var y = 110, s = poly([[cx, y], [cx - 16, y + 88], [cx + 16, y + 88]], { close: 1, fill: C.grayM, w: 1.6 });
        s += line(cx - 92, y, cx + 92, y, { w: 3 });
        [[cx - 72, L, Lc], [cx + 72, R, C.blue]].forEach(function (p) {
          s += line(p[0] - 28, y + 46, p[0], y, { c: C.sub, w: 1.2 }) + line(p[0] + 28, y + 46, p[0], y, { c: C.sub, w: 1.2 });
          s += F.path('M' + (p[0] - 36) + ',' + (y + 46) + ' Q' + p[0] + ',' + (y + 66) + ' ' + (p[0] + 36) + ',' + (y + 46) + ' Z', { fill: C.grayL, w: 1.6 });
          s += t(p[0], y + 30, p[1], { a: 'm', b: 1, size: 18, c: p[2] });
        });
        return s;
      }
      var s = scale(118, 'x + 5', '12', C.ink) + scale(362, 'x', '7', C.green);
      s += t(118, 34, 'x + 5 = 12', { a: 'm', b: 1, size: 19 }) + t(362, 34, 'x = 7', { a: 'm', b: 1, size: 19, c: C.green });
      s += arrow(212, 70, 268, 70, { c: C.red }) + t(240, 50, '양쪽 −5', { a: 'm', b: 1, size: 15, c: C.red });
      s += t(240, 232, '옮기면 부호가 반대: +5 를 넘기면 −5', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 256, s);
    } },

  ftree: { cards: ['소인수분해'],
    cap: '인수 나무 — 12 를 더 쪼갤 수 없는 소수(동그라미)까지 나누면 12 = 2² × 3',
    draw: function () {
      function nd(x, y, v, prime) {
        return prime ? F.circle(x, y, 22, { fill: C.blueL, c: C.blue, w: 2, label: v, lc: C.blue, size: 18 })
          : t(x, y, v, { a: 'm', b: 1, size: 22 });
      }
      var s = line(130, 52, 86, 98, { w: 1.6 }) + line(150, 52, 194, 98, { w: 1.6 }) +
        line(184, 132, 140, 178, { w: 1.6 }) + line(204, 132, 248, 178, { w: 1.6 });
      s += nd(140, 36, '12') + nd(76, 116, '2', 1) + nd(194, 116, '6') + nd(130, 196, '2', 1) + nd(258, 196, '3', 1);
      s += t(100, 74, '×', { a: 'm', size: 15, c: C.sub }) + t(194, 156, '×', { a: 'm', size: 15, c: C.sub });
      s += t(380, 98, '12 = 2 × 2 × 3', { a: 'm', size: 18 });
      s += t(380, 140, '= 2² × 3', { a: 'm', b: 1, size: 22, c: C.blue });
      s += F.circle(330, 186, 11, { fill: C.blueL, c: C.blue, w: 2 }) + t(348, 186, '= 소수', { a: 's', size: 14, c: C.blue, b: 1 }) +
        t(380, 212, '1과 자기 자신만 약수', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 236, s);
    } },

  /* ── 중2 ── */
  monomul: { cards: ['단항식의 곱셈'],
    cap: '2x × 3x — 가로 2x, 세로 3x 직사각형 안에 x² 조각이 6개 → 6x²',
    draw: function () {
      var u = 56, x0 = 70, y0 = 46, s = '';
      for (var i = 0; i < 2; i++) for (var j = 0; j < 3; j++) {
        s += rect(x0 + i * u, y0 + j * u, u, u, C.blueL, C.ink, 1.6) + t(x0 + i * u + u / 2, y0 + j * u + u / 2, 'x²', { a: 'm', size: 16, c: C.blue });
      }
      s += t(x0 + u / 2, y0 - 14, 'x', { a: 'm', size: 14, c: C.sub }) + t(x0 + u * 1.5, y0 - 14, 'x', { a: 'm', size: 14, c: C.sub });
      for (var k = 0; k < 3; k++) s += t(x0 - 14, y0 + u * k + u / 2, 'x', { a: 'm', size: 14, c: C.sub });
      s += t(x0 + u, y0 + 3 * u + 22, '가로 2x', { a: 'm', b: 1, size: 15 });
      s += t(x0 - 40, y0 + 1.5 * u, '세로\n3x', { a: 'm', b: 1, size: 15 });
      s += t(340, 90, '2x × 3x', { a: 'm', b: 1, size: 22 });
      s += t(340, 130, '계수: 2 × 3 = 6', { a: 'm', size: 15 }) + t(340, 156, '문자: x × x = x²', { a: 'm', size: 15 });
      s += t(340, 196, '= 6x²', { a: 'm', b: 1, size: 24, c: C.blue });
      return F.svg(480, 260, s);
    } },

  ineq1: { cards: ['일차부등식'],
    cap: '일차부등식 — 양수로 나누면 방향 그대로, 음수로 나누면 방향이 뒤집힌다 (아래 줄은 예시)',
    draw: function () {
      var s = '';
      [[76, '2x > 6', '÷ 2', 'x > 3', 1, C.blue], [186, '−2x > −6', '÷ (−2)', 'x < 3', -1, C.red]].forEach(function (r) {
        var y = r[0], N = numline(250, 450, y, 0, 6, [0, 3, 6]);
        s += t(18, y - 22, r[1], { size: 17, b: 1 }) + t(18, y + 4, r[2] + ' →', { size: 14, c: r[5] }) + t(108, y + 4, r[3], { size: 20, b: 1, c: r[5] });
        s += N.s;
        var x3 = N.X(3);
        s += line(x3, y - 16, r[4] > 0 ? 452 : 248, y - 16, { c: r[5], w: 4 }) + ring(x3, y - 16, 7, r[5]);
        s += arrow(r[4] > 0 ? 440 : 260, y - 16, r[4] > 0 ? 462 : 238, y - 16, { c: r[5], w: 4 });
      });
      s += line(18, 130, 462, 130, { c: C.edge, w: 1 });
      s += t(18, 232, '빈 동그라미 ○ = 3 은 들어가지 않는다', { size: 13, c: C.sub });
      return F.svg(480, 250, s);
    } },

  linear: { cards: ['일차함수 y=ax+b'],
    cap: 'y = 2x + 3 — y절편 3 에서 출발해 오른쪽 1칸 갈 때마다 위로 2칸 (기울기 2)',
    draw: function () {
      var P = plane(90, 236, 40, 18, -1, 4, -1, 11, { xt: [1, 2, 3], yt: [3, 5, 7, 9] });
      var s = P.s + line(P.X(-1), P.Y(1), P.X(4), P.Y(11), { c: C.blue, w: 2.6 });
      [[0, 3], [1, 5]].forEach(function (p) {
        s += line(P.X(p[0]), P.Y(p[1]), P.X(p[0] + 1), P.Y(p[1]), { c: C.orange, w: 2.4 }) +
          line(P.X(p[0] + 1), P.Y(p[1]), P.X(p[0] + 1), P.Y(p[1] + 2), { c: C.red, w: 2.4 });
      });
      s += dot(P.X(0), P.Y(3), 6, C.blue);
      s += t(P.X(0.5), P.Y(3) + 16, '1', { a: 'm', size: 14, b: 1, c: C.orange }) + t(P.X(1) + 12, P.Y(4), '2', { a: 's', size: 14, b: 1, c: C.red });
      s += t(310, 64, 'y = 2x + 3', { size: 20, b: 1, c: C.blue });
      s += t(310, 104, '기울기 2', { size: 16, b: 1 }) + t(310, 126, '→ 오른쪽 1, 위로 2', { size: 14, c: C.sub });
      s += t(310, 164, 'y절편 3', { size: 16, b: 1 }) + t(310, 186, '→ y축과 만나는 점', { size: 14, c: C.sub });
      return F.svg(480, 270, s);
    } },

  simul: { cards: ['연립방정식'],
    cap: '연립방정식의 해 = 두 직선이 만나는 점 — x + y = 5, x − y = 1 → (3, 2)',
    draw: function () {
      var P = plane(70, 200, 30, 25, -1, 6, -2, 6, { xt: [3], yt: [2] });
      var s = P.s + line(P.X(-1), P.Y(6), P.X(6), P.Y(-1), { c: C.blue, w: 2.4 }) + line(P.X(-1), P.Y(-2), P.X(6), P.Y(5), { c: C.orange, w: 2.4 });
      s += line(P.X(3), P.Y(2), P.X(3), P.Y(0), { c: C.sub, w: 1, dash: '4 3' }) + line(P.X(3), P.Y(2), P.X(0), P.Y(2), { c: C.sub, w: 1, dash: '4 3' });
      s += dot(P.X(3), P.Y(2), 7, C.red) + t(P.X(3) + 12, P.Y(2) - 16, '(3, 2)', { a: 's', b: 1, c: C.red });
      s += t(300, 60, 'x + y = 5', { size: 18, b: 1, c: C.blue }) + t(300, 92, 'x − y = 1', { size: 18, b: 1, c: C.orange });
      s += t(300, 132, '두 식을 더하면', { size: 14, c: C.sub }) + t(300, 156, '2x = 6 → x = 3', { size: 16 });
      s += t(300, 190, 'x = 3, y = 2', { size: 19, b: 1, c: C.red });
      return F.svg(480, 268, s);
    } },

  /* ── 중3 ── */
  sqrt: { cards: ['제곱근'],
    cap: '넓이가 16 인 정사각형의 한 변 = √16 = 4',
    draw: function () {
      var u = 36, x0 = 60, y0 = 40, s = '';
      for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) s += rect(x0 + i * u, y0 + j * u, u, u, C.blueL, C.blue, 1);
      s += rect(x0, y0, 4 * u, 4 * u, 'none', C.ink, 2.4);
      s += F.dim(x0, y0 + 4 * u, x0 + 4 * u, y0 + 4 * u, '한 변 4', { off: 24, side: -1 });
      s += t(x0 + 2 * u, y0 + 2 * u, '넓이 16', { a: 'm', b: 1, size: 18 });
      s += t(350, 80, '4² = 16', { a: 'm', size: 20 });
      s += t(350, 124, '√16 = 4', { a: 'm', b: 1, size: 24, c: C.blue });
      s += t(350, 170, '제곱하여 16 이 되는 수', { a: 'm', size: 14, c: C.sub }) + t(350, 194, '4 와 −4  (√16 은 양수 4)', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 250, s);
    } },

  ftiles: { cards: ['인수분해', '인수분해 공식'],
    cap: 'x² + 5x + 6 — x² 1개 · x 5개 · 1 6개를 직사각형으로 모으면 가로 (x + 3), 세로 (x + 2)',
    draw: function () {
      var X = 96, u = 26, x0 = 50, y0 = 50, s = '';
      s += rect(x0, y0, X, X, C.blueL) + t(x0 + X / 2, y0 + X / 2, 'x²', { a: 'm', b: 1, c: C.blue });
      for (var i = 0; i < 3; i++) s += rect(x0 + X + i * u, y0, u, X, C.greenL) + t(x0 + X + i * u + u / 2, y0 + X / 2, 'x', { a: 'm', size: 14, c: C.green });
      for (var j = 0; j < 2; j++) s += rect(x0, y0 + X + j * u, X, u, C.greenL) + t(x0 + X / 2, y0 + X + j * u + u / 2, 'x', { a: 'm', size: 14, c: C.green });
      for (i = 0; i < 3; i++) for (j = 0; j < 2; j++) s += rect(x0 + X + i * u, y0 + X + j * u, u, u, C.orangeL) + t(x0 + X + i * u + u / 2, y0 + X + j * u + u / 2, '1', { a: 'm', size: 13, c: C.orange });
      s += t(x0 + X / 2, y0 - 16, 'x', { a: 'm', b: 1 }) + t(x0 + X + 1.5 * u, y0 - 16, '3', { a: 'm', b: 1 });
      s += t(x0 - 16, y0 + X / 2, 'x', { a: 'm', b: 1 }) + t(x0 - 16, y0 + X + u, '2', { a: 'm', b: 1 });
      s += t(x0 + (X + 3 * u) / 2, y0 + X + 2 * u + 24, '가로 x + 3', { a: 'm', size: 14, c: C.sub });
      s += t(350, 70, 'x² + 5x + 6', { a: 'm', b: 1, size: 19 });
      s += t(350, 100, '더해서 5, 곱해서 6 → 2 와 3', { a: 'm', size: 13, c: C.sub });
      s += t(350, 140, '= (x + 2)(x + 3)', { a: 'm', b: 1, size: 20, c: C.blue });
      s += F.box(258, 178, 184, 46, { fill: C.grayL, w: 1, label: 'x 조각 3 + 2 = 5개\n1 조각 3 × 2 = 6개', size: 13, b: 0 });
      return F.svg(480, 260, s);
    } },

  vertex: { cards: ['이차함수 꼭짓점'],
    cap: 'y = (x − 1)² + 2 — y = x² 를 오른쪽 1, 위로 2 옮긴 것, 꼭짓점 (1, 2)',
    draw: function () {
      var P = plane(110, 230, 34, 22, -2, 4, -1, 8, { xt: [1], yt: [2] });
      var s = P.s + curve(P, function (x) { return x * x; }, -2.8, 2.8, { c: C.sub, w: 1.8, dash: '6 5' });
      s += curve(P, function (x) { return (x - 1) * (x - 1) + 2; }, -1.4, 3.4, { c: C.blue, w: 2.6 });
      s += arrow(P.X(0), P.Y(0), P.X(1) - 4, P.Y(2) + 6, { c: C.red, w: 2 });
      s += dot(P.X(1), P.Y(2), 6, C.blue) + t(P.X(1) + 12, P.Y(2) + 12, '(1, 2)', { a: 's', b: 1, c: C.blue });
      s += t(P.X(-2.2), P.Y(7.6), 'y = x²', { size: 14, c: C.sub });
      s += t(316, 70, 'y = (x − p)² + q', { size: 17, b: 1 });
      s += t(316, 104, '꼭짓점 (p, q)', { size: 16, c: C.blue, b: 1 });
      s += t(316, 152, 'p = 1 → 오른쪽 1', { size: 14, c: C.red }) + t(316, 176, 'q = 2 → 위로 2', { size: 14, c: C.red });
      return F.svg(480, 262, s);
    } },

  spectri: { cards: ['삼각비(특수각)', '삼각함수(특수각)'],
    cap: '특수각 삼각형 두 개 — 30°·60° 는 변의 비 1 : 2 : √3, 45° 는 1 : 1 : √2',
    draw: function () {
      var s = '', u = 74;
      /* 30-60-90: 직각 왼쪽 아래 */
      var A = [40, 170], B = [40 + u * Math.sqrt(3), 170], Cc = [40, 170 - u];
      s += poly([A, B, Cc], { close: 1, fill: C.blueL, w: 2.2 }) + box(A[0], A[1] - 12, 12, 12, { fill: 'none', w: 1.2, r: 0 });
      s += t((A[0] + B[0]) / 2, A[1] + 18, '√3', { a: 'm', b: 1 }) + t(A[0] - 14, (A[1] + Cc[1]) / 2, '1', { a: 'm', b: 1 });
      s += t((B[0] + Cc[0]) / 2 + 12, (B[1] + Cc[1]) / 2 - 12, '2', { a: 'm', b: 1, c: C.blue });
      s += t(B[0] - 36, B[1] - 10, '30°', { a: 'm', size: 14, c: C.red }) + t(Cc[0] + 14, Cc[1] + 24, '60°', { a: 'm', size: 14, c: C.red });
      /* 45-45-90 */
      var v = 92, D = [300, 170], E = [300 + v, 170], G = [300, 170 - v];
      s += poly([D, E, G], { close: 1, fill: C.orangeL, w: 2.2 }) + box(D[0], D[1] - 12, 12, 12, { fill: 'none', w: 1.2, r: 0 });
      s += t((D[0] + E[0]) / 2, D[1] + 18, '1', { a: 'm', b: 1 }) + t(D[0] - 14, (D[1] + G[1]) / 2, '1', { a: 'm', b: 1 });
      s += t((E[0] + G[0]) / 2 + 14, (E[1] + G[1]) / 2 - 10, '√2', { a: 'm', b: 1, c: C.orange });
      s += t(E[0] - 26, E[1] - 10, '45°', { a: 'm', size: 14, c: C.red }) + t(G[0] + 13, G[1] + 30, '45°', { a: 'm', size: 14, c: C.red });
      s += t(140, 222, 'sin30° = 1/2 · cos30° = √3/2', { a: 'm', size: 14 }) + t(140, 244, 'tan60° = √3', { a: 'm', size: 14 });
      s += t(370, 222, 'tan45° = 1', { a: 'm', size: 14 });
      s += t(240, 30, 'sin = 높이/빗변 · cos = 밑변/빗변 · tan = 높이/밑변', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 262, s);
    } },

  pyth: { cards: ['피타고라스 정리'],
    cap: '피타고라스 정리 — 빗변 위 정사각형(25) = 다른 두 변 위 정사각형의 합(9 + 16)',
    draw: function () {
      var u = 22, A = [120, 196], B = [120 + 4 * u, 196], Cc = [120, 196 - 3 * u];
      var s = poly([A, B, [B[0], B[1] + 4 * u], [A[0], A[1] + 4 * u]], { close: 1, fill: C.blueL, w: 1.6 });
      s += poly([A, Cc, [Cc[0] - 3 * u, Cc[1]], [A[0] - 3 * u, A[1]]], { close: 1, fill: C.orangeL, w: 1.6 });
      var dx = 3 * u, dy = -4 * u;
      s += poly([Cc, B, [B[0] + dx, B[1] + dy], [Cc[0] + dx, Cc[1] + dy]], { close: 1, fill: C.greenL, w: 1.6 });
      s += poly([A, B, Cc], { close: 1, fill: '#fff', w: 2.4 }) + box(A[0], A[1] - 11, 11, 11, { fill: 'none', w: 1.2, r: 0 });
      s += t(A[0] + 2 * u, A[1] + 2 * u, '4² = 16', { a: 'm', b: 1, c: C.blue });
      s += t(A[0] - 1.5 * u, A[1] - 1.5 * u, '9', { a: 'm', b: 1, c: C.orange });
      s += t((Cc[0] + B[0]) / 2 + dx / 2, (Cc[1] + B[1]) / 2 + dy / 2, '5² = 25', { a: 'm', b: 1, c: C.green });
      s += t(A[0] + 2 * u, A[1] - 12, '4', { a: 'm', size: 14 }) + t(A[0] + 10, A[1] - 1.5 * u, '3', { a: 'm', size: 14 });
      s += t((Cc[0] + B[0]) / 2 - 10, (Cc[1] + B[1]) / 2 + 8, '5', { a: 'm', size: 14, b: 1 });
      s += t(380, 150, '3² + 4² = 5²', { a: 'm', b: 1, size: 19 });
      s += t(380, 184, '9 + 16 = 25', { a: 'm', size: 17 });
      s += t(380, 226, '빗변² = 밑변² + 높이²', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 300, s);
    } },

  /* ── 고1 ── */
  perfsq: { cards: ['완전제곱식'],
    cap: '(x + 3)² — 한 변이 x + 3 인 정사각형 = x² + 3x + 3x + 9',
    draw: function () {
      var X = 100, u = 26, x0 = 54, y0 = 44, s = '';
      s += rect(x0, y0, X, X, C.blueL) + t(x0 + X / 2, y0 + X / 2, 'x²', { a: 'm', b: 1, c: C.blue });
      s += rect(x0 + X, y0, 3 * u, X, C.greenL) + t(x0 + X + 1.5 * u, y0 + X / 2, '3x', { a: 'm', b: 1, c: C.green });
      s += rect(x0, y0 + X, X, 3 * u, C.greenL) + t(x0 + X / 2, y0 + X + 1.5 * u, '3x', { a: 'm', b: 1, c: C.green });
      s += rect(x0 + X, y0 + X, 3 * u, 3 * u, C.orangeL) + t(x0 + X + 1.5 * u, y0 + X + 1.5 * u, '9', { a: 'm', b: 1, c: C.orange });
      s += t(x0 + X / 2, y0 - 14, 'x', { a: 'm', b: 1 }) + t(x0 + X + 1.5 * u, y0 - 14, '3', { a: 'm', b: 1 });
      s += t(x0 - 14, y0 + X / 2, 'x', { a: 'm', b: 1 }) + t(x0 - 14, y0 + X + 1.5 * u, '3', { a: 'm', b: 1 });
      s += t(360, 76, '(x + 3)²', { a: 'm', b: 1, size: 21 });
      s += t(360, 116, '= x² + 6x + 9', { a: 'm', b: 1, size: 19, c: C.blue });
      s += t(360, 162, '가운데 6x = 3x 두 개', { a: 'm', size: 14, c: C.sub });
      s += t(360, 186, '끝 9 = 3²', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 236, s);
    } },

  discrim: { cards: ['이차방정식의 판별식'],
    cap: '판별식 D = b² − 4ac — 포물선이 x축과 몇 번 만나는가 (두 점 · 한 점 · 안 만남)',
    draw: function () {
      var s = '';
      [[80, 30, 'D > 0', '서로 다른 두 실근', C.blue], [240, 0, 'D = 0', '중근 (한 점)', C.green], [400, -26, 'D < 0', '실근 없음', C.red]].forEach(function (p) {
        var cx = p[0], ay = 140;
        s += arrow(cx - 70, ay, cx + 72, ay, { w: 1.4, head: 8 });
        var pts = [];
        for (var i = 0; i <= 40; i++) { var x = -1.6 + 3.2 * i / 40; pts.push([cx + x * 40, ay + p[1] - x * x * 34]); }
        s += poly(pts, { c: p[4], w: 2.6 });
        if (p[1] > 0) { var r = Math.sqrt(p[1] / 34) * 40; s += dot(cx - r, ay, 6, p[4]) + dot(cx + r, ay, 6, p[4]); }
        if (p[1] === 0) s += dot(cx, ay, 6, p[4]);
        s += t(cx, 200, p[2], { a: 'm', b: 1, size: 18, c: p[4] }) + t(cx, 226, p[3], { a: 'm', size: 14 });
      });
      return F.svg(480, 248, s);
    } },

  quadineq: { cards: ['이차부등식의 해'],
    cap: '(x − 2)(x − 5) < 0 — 포물선이 x축 아래에 있는 구간 2 < x < 5',
    draw: function () {
      var P = plane(50, 150, 52, 20, 0, 7, -3, 5, { xt: [2, 5] });
      var s = P.s + curve(P, function (x) { return (x - 2) * (x - 5); }, 0.9, 6.1, { c: C.ink, w: 2.4 });
      s += line(P.X(2), 150, P.X(5), 150, { c: C.red, w: 5 });
      s += line(P.X(0), 150, P.X(2), 150, { c: C.green, w: 5 }) + line(P.X(5), 150, P.X(7), 150, { c: C.green, w: 5 });
      s += ring(P.X(2), 150, 6, C.red) + ring(P.X(5), 150, 6, C.red);
      s += t(P.X(3.5), 232, '< 0 (x축 아래) : 2 < x < 5', { a: 'm', b: 1, c: C.red, size: 15 });
      s += t(P.X(3.5), 258, '> 0 (x축 위) : x < 2 또는 x > 5', { a: 'm', b: 1, c: C.green, size: 15 });
      return F.svg(480, 276, s);
    } },

  dist: { cards: ['두 점 사이의 거리'],
    cap: '두 점 사이의 거리 — 가로 3, 세로 4 인 직각삼각형의 빗변 = √(9 + 16) = 5',
    draw: function () {
      var P = plane(70, 214, 40, 40, 0, 4, 0, 4.6, { xt: [3], yt: [4] });
      var s = P.s + poly([[P.X(0), P.Y(0)], [P.X(3), P.Y(0)], [P.X(3), P.Y(4)]], { close: 1, fill: C.blueL, c: C.sub, w: 1.4 });
      s += line(P.X(0), P.Y(0), P.X(3), P.Y(4), { c: C.blue, w: 3 });
      s += dot(P.X(0), P.Y(0), 6, C.blue) + dot(P.X(3), P.Y(4), 6, C.blue) + t(P.X(3) + 10, P.Y(4) - 4, '(3, 4)', { a: 's', b: 1 });
      s += t(P.X(1.5), P.Y(0) - 14, '가로 3', { a: 'm', size: 14, c: C.orange, b: 1 }) + t(P.X(3) + 10, P.Y(2), '세로 4', { a: 's', size: 14, c: C.orange, b: 1 });
      s += t(P.X(1.2), P.Y(2.4), '5', { a: 'm', size: 18, b: 1, c: C.blue });
      s += t(350, 90, '√((x₂−x₁)² + (y₂−y₁)²)', { a: 'm', size: 14 });
      s += t(350, 130, '√(3² + 4²) = √25', { a: 'm', size: 17 });
      s += t(350, 166, '= 5', { a: 'm', b: 1, size: 22, c: C.blue });
      return F.svg(480, 250, s);
    } },

  midpt: { cards: ['두 점의 중점'],
    cap: '중점 — (0, 0) 과 (4, 6) 의 가운데는 x, y 를 각각 반으로: (2, 3)',
    draw: function () {
      var P = plane(70, 226, 32, 30, 0, 4, 0, 6.4, { xt: [2, 4], yt: [3, 6] });
      var s = P.s + line(P.X(0), P.Y(0), P.X(4), P.Y(6), { c: C.blue, w: 2.6 });
      s += line(P.X(2), P.Y(3), P.X(2), P.Y(0), { c: C.sub, w: 1, dash: '4 3' }) + line(P.X(2), P.Y(3), P.X(0), P.Y(3), { c: C.sub, w: 1, dash: '4 3' });
      s += dot(P.X(0), P.Y(0), 6, C.blue) + dot(P.X(4), P.Y(6), 6, C.blue) + dot(P.X(2), P.Y(3), 7, C.red);
      s += t(P.X(4) + 10, P.Y(6), '(4, 6)', { a: 's', b: 1 }) + t(P.X(2) + 12, P.Y(3) + 6, '(2, 3)', { a: 's', b: 1, c: C.red });
      s += t(340, 90, '((x₁+x₂)/2, (y₁+y₂)/2)', { a: 'm', size: 14 });
      s += t(340, 132, '((0+4)/2, (0+6)/2)', { a: 'm', size: 16 });
      s += t(340, 170, '= (2, 3)', { a: 'm', b: 1, size: 21, c: C.red });
      return F.svg(480, 262, s);
    } },

  slope: { cards: ['직선의 기울기'],
    cap: '기울기 = 세로 변화 ÷ 가로 변화 — (0, 0) 에서 (2, 4) 로: 4 ÷ 2 = 2',
    draw: function () {
      var P = plane(70, 222, 46, 42, 0, 3, 0, 4.4, { xt: [2], yt: [4] });
      var s = P.s + line(P.X(0), P.Y(0), P.X(2.2), P.Y(4.4), { c: C.blue, w: 2.6 });
      s += line(P.X(0), P.Y(0), P.X(2), P.Y(0), { c: C.orange, w: 3 }) + line(P.X(2), P.Y(0), P.X(2), P.Y(4), { c: C.red, w: 3 });
      s += dot(P.X(2), P.Y(4), 6, C.blue) + t(P.X(2) - 12, P.Y(4) - 4, '(2, 4)', { a: 'e', b: 1 });
      s += t(P.X(1), P.Y(0) - 14, '가로 2', { a: 'm', b: 1, size: 14, c: C.orange }) + t(P.X(2) + 10, P.Y(2), '세로 4', { a: 's', b: 1, size: 14, c: C.red });
      s += t(350, 96, '(y₂ − y₁) ÷ (x₂ − x₁)', { a: 'm', size: 15 });
      s += t(350, 138, '4 ÷ 2', { a: 'm', size: 18 });
      s += t(350, 176, '기울기 2', { a: 'm', b: 1, size: 21, c: C.blue });
      return F.svg(480, 254, s);
    } },

  circstd: { cards: ['원의 방정식(표준형)'],
    cap: '원 x² + y² = 3² — 원 위 어느 점 (x, y) 든 원점까지 거리가 반지름 3',
    draw: function () {
      var P = plane(150, 140, 34, 34, -3.6, 3.6, -3.4, 3.4, { step: 1 });
      var s = P.s + '<circle cx="150" cy="140" r="102" fill="none" stroke="' + C.blue + '" stroke-width="2.6"/>';
      var px = 3 * Math.cos(0.9), py = 3 * Math.sin(0.9);
      s += poly([[P.X(0), P.Y(0)], [P.X(px), P.Y(0)], [P.X(px), P.Y(py)]], { close: 1, fill: C.blueL, c: C.sub, w: 1.2 });
      s += line(P.X(0), P.Y(0), P.X(px), P.Y(py), { c: C.red, w: 2.6 });
      s += dot(P.X(px), P.Y(py), 6, C.red) + t(P.X(px) + 10, P.Y(py) - 10, '(x, y)', { a: 's', b: 1, c: C.red });
      s += t(P.X(px / 2), P.Y(0) + 14, 'x', { a: 'm', size: 14, b: 1, c: C.orange }) + t(P.X(px) + 10, P.Y(py / 2), 'y', { a: 's', size: 14, b: 1, c: C.orange });
      s += t(P.X(px / 2) - 12, P.Y(py / 2) - 8, '3', { a: 'm', size: 16, b: 1, c: C.red });
      s += t(370, 90, '피타고라스로', { a: 'm', size: 14, c: C.sub });
      s += t(370, 124, 'x² + y² = 3²', { a: 'm', b: 1, size: 19, c: C.blue });
      s += t(370, 160, '= 9', { a: 'm', size: 18 });
      s += t(370, 204, '중심 원점 · 반지름 3', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 280, s);
    } },

  abseq: { cards: ['절댓값 방정식'],
    cap: '|x − 3| = 5 — 3 에서 거리가 5 인 점: 오른쪽 8, 왼쪽 −2',
    draw: function () {
      var N = numline(36, 444, 160, -3, 9, [-3, -2, 0, 3, 8, 9]);
      var s = N.s + hop(N.X(3), N.X(8), 160, 30, C.blue, '+5') + hop(N.X(3), N.X(-2), 160, 30, C.red, '−5');
      s += dot(N.X(3), 160, 6, C.ink) + dot(N.X(8), 160, 7, C.blue) + dot(N.X(-2), 160, 7, C.red);
      s += t(240, 32, '|x − 3| = 5', { a: 'm', b: 1, size: 20 });
      s += t(240, 220, 'x = 8 또는 x = −2', { a: 'm', b: 1, size: 18 });
      return F.svg(480, 246, s);
    } },

  /* ── 고2 ── */
  seqs: { cards: ['등차수열', '등비수열'],
    cap: '등차수열은 같은 수를 더하고(+2), 등비수열은 같은 수를 곱한다(×3)',
    draw: function () {
      var s = t(120, 30, '등차 1, 3, 5, …', { a: 'm', b: 1, size: 16, c: C.blue }) + t(360, 30, '등비 2, 6, 18, …', { a: 'm', b: 1, size: 16, c: C.orange });
      var base = 220;
      [1, 3, 5, 7, 9].forEach(function (v, i) {
        var h = v * 15, x = 30 + i * 38;
        s += box(x, base - h, 28, h, { fill: C.blueL, c: C.blue, r: 2, w: 1.4 }) + t(x + 14, base - h - 12, String(v), { a: 'm', size: 14, b: 1 });
        if (i) s += t(x - 5, base + 16, '+2', { a: 'm', size: 13, c: C.blue });
      });
      [2, 6, 18, 54].forEach(function (v, i) {
        var h = v * 2.6, x = 270 + i * 48;
        s += box(x, base - h, 32, h, { fill: C.orangeL, c: C.orange, r: 2, w: 1.4 }) + t(x + 16, base - h - 12, String(v), { a: 'm', size: 14, b: 1 });
        if (i) s += t(x - 8, base + 16, '×3', { a: 'm', size: 13, c: C.orange });
      });
      s += line(20, base, 220, base, { w: 1.4 }) + line(260, base, 464, base, { w: 1.4 }) + line(240, 20, 240, 250, { c: C.edge, w: 1.4, dash: '6 5' });
      s += t(120, 252, '제5항 = 9', { a: 'm', size: 14 }) + t(360, 252, '제4항 = 54', { a: 'm', size: 14 });
      return F.svg(480, 270, s);
    } },

  /* ── 고3 ── */
  deriv: { cards: ['미분계수'],
    cap: 'f(x) = x² 의 x = 3 에서 접선 — 오른쪽 1 에 위로 6, f′(3) = 6',
    draw: function () {
      var P = plane(60, 246, 56, 12.5, 0, 4, 0, 17, { xt: [3], yt: [9] });
      var s = P.s + curve(P, function (x) { return x * x; }, 0, 4, { c: C.blue, w: 2.6 });
      s += line(P.X(1.6), P.Y(0.6), P.X(4.2), P.Y(16.2), { c: C.red, w: 2 });
      s += line(P.X(3), P.Y(9), P.X(4), P.Y(9), { c: C.orange, w: 2.4 }) + line(P.X(4), P.Y(9), P.X(4), P.Y(15), { c: C.orange, w: 2.4 });
      s += t(P.X(3.5), P.Y(9) + 14, '1', { a: 'm', size: 14, b: 1, c: C.orange }) + t(P.X(4) + 10, P.Y(12), '6', { a: 's', size: 14, b: 1, c: C.orange });
      s += dot(P.X(3), P.Y(9), 6, C.red) + line(P.X(3), P.Y(9), P.X(3), P.Y(0), { c: C.sub, w: 1, dash: '4 3' });
      s += t(P.X(1.2), P.Y(5.4), 'y = x²', { a: 'm', size: 14, c: C.blue, b: 1 });
      s += t(380, 96, '접선의 기울기', { a: 'm', size: 15 });
      s += t(380, 130, "f′(3) = 6", { a: 'm', b: 1, size: 21, c: C.red });
      s += t(380, 170, "f′(x) = 2x", { a: 'm', size: 14, c: C.sub }) + t(380, 192, '→ 2 × 3 = 6', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 270, s);
    } },

  integ: { cards: ['정적분'],
    cap: '∫(0→2) x dx — y = x 아래, 0 부터 2 까지의 넓이 = 밑변 2 · 높이 2 삼각형 = 2',
    draw: function () {
      var P = plane(70, 214, 56, 56, 0, 3, 0, 3, { xt: [2], yt: [2] });
      var s = P.s + poly([[P.X(0), P.Y(0)], [P.X(2), P.Y(0)], [P.X(2), P.Y(2)]], { close: 1, fill: C.blueL, c: C.blue, w: 1.4 });
      s += line(P.X(0), P.Y(0), P.X(3), P.Y(3), { c: C.blue, w: 2.6 });
      s += t(P.X(1.35), P.Y(0.5), '넓이 2', { a: 'm', b: 1, size: 15, c: C.blue });
      s += t(P.X(2.7), P.Y(3) + 2, 'y = x', { a: 'e', size: 14, b: 1, c: C.blue });
      s += t(360, 86, '∫(0→2) x dx', { a: 'm', size: 18, b: 1 });
      s += t(360, 124, '= 2² / 2 = 2', { a: 'm', size: 17 });
      s += t(360, 168, '½ × 2 × 2 = 2', { a: 'm', size: 15, c: C.sub });
      s += t(360, 192, '(삼각형 넓이와 같다)', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 246, s);
    } },

  pascal: { cards: ['이항정리'],
    cap: '파스칼의 삼각형 — (a + b)⁴ 의 계수는 1, 4, 6, 4, 1. a²b² 의 계수 6 = ₄C₂',
    draw: function () {
      var rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]], s = '';
      rows.forEach(function (r, n) {
        var y = 40 + n * 42;
        s += t(30, y, 'n = ' + n, { size: 13, c: C.sub });
        r.forEach(function (v, k) {
          var x = 240 + (k - (r.length - 1) / 2) * 56, hot = n === 4 && k === 2;
          s += F.circle(x, y, 17, { fill: hot ? C.redL : (n === 4 ? C.blueL : C.grayL), c: hot ? C.red : C.sub, w: hot ? 2.4 : 1.2, label: String(v), lc: hot ? C.red : C.ink, size: 16 });
        });
      });
      s += t(240, 248, '위 두 수를 더하면 아래 수 — 3 + 3 = 6', { a: 'm', size: 14, c: C.sub });
      s += t(420, 208, '← (a+b)⁴', { a: 'm', size: 13, c: C.blue, b: 1 });
      return F.svg(480, 266, s);
    } },

  /* ═══════════ 국어 ═══════════ */

  sentstruct: { chips: ['sentstruct'],
    cap: '문장의 짜임 — 주어·서술어가 한 번이면 홑문장, 두 번 이상이면 이어진문장·안은문장',
    draw: function () {
      var s = '';
      s += t(16, 40, '홑문장', { b: 1, size: 17, c: C.blue });
      s += box(130, 22, 300, 38, { fill: C.blueL, c: C.blue, label: '나는  밥을  먹었다.', size: 17, b: 0 });
      s += t(440, 40, '1번', { size: 14, c: C.sub, b: 1 });
      s += t(16, 120, '이어진\n문장', { b: 1, size: 17, c: C.green });
      s += box(108, 100, 132, 40, { fill: C.greenL, c: C.green, label: '비가 와서', size: 17, b: 0 });
      s += box(262, 100, 168, 40, { fill: C.greenL, c: C.green, label: '소풍이 취소되었다.', size: 17, b: 0 });
      s += t(251, 120, '+', { a: 'm', b: 1, size: 18, c: C.green }) + t(440, 120, '2번', { size: 14, c: C.sub, b: 1 });
      s += t(174, 158, '-아서 로 이어짐', { a: 'm', size: 13, c: C.sub });
      s += t(16, 218, '안은\n문장', { b: 1, size: 17, c: C.orange });
      s += box(108, 190, 322, 56, { fill: '#fff', c: C.orange, w: 2 });
      s += t(124, 218, '나는', { size: 17 }) + box(170, 200, 112, 36, { fill: C.orangeL, c: C.orange, label: '네가 오기', size: 16, b: 1, lc: C.orange });
      s += t(288, 218, '를 기다린다.', { size: 17 }) + t(440, 218, '2번', { size: 14, c: C.sub, b: 1 });
      s += t(226, 266, '문장 속에 작은 문장이 들어 있다', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 284, s);
    } },

  phon: { chips: ['phon'],
    cap: '음운 변동 다섯 가지 — 글자와 달리 소리 나는 까닭',
    draw: function () {
      var rows = [['비음화', '국물', '[궁물]', 'ㄱ → ㅇ  (ㅁ 앞)'], ['유음화', '신라', '[실라]', 'ㄴ → ㄹ  (ㄹ 옆)'],
        ['구개음화', '해돋이', '[해도지]', 'ㄷ → ㅈ  (ㅣ 앞)'], ['거센소리되기', '좋고', '[조코]', 'ㅎ + ㄱ → ㅋ'],
        ['된소리되기', '국밥', '[국빱]', 'ㅂ → ㅃ  (ㄱ 뒤)']], s = '';
      var cols = [C.blue, C.green, C.orange, C.purple, C.red];
      rows.forEach(function (r, i) {
        var y = 36 + i * 48;
        s += box(12, y - 18, 118, 36, { fill: '#fff', c: cols[i], w: 1.8, label: r[0], lc: cols[i], size: 15 });
        s += t(178, y, r[1], { a: 'm', size: 18, b: 1 }) + arrow(214, y, 244, y, { c: C.sub, w: 1.6, head: 9 });
        s += t(290, y, r[2], { a: 'm', size: 18, b: 1, c: cols[i] }) + t(340, y, r[3], { size: 13, c: C.sub });
        if (i) s += line(12, y - 24, 468, y - 24, { c: C.edge, w: 1 });
      });
      return F.svg(480, 270, s);
    } },

  pidong: { chips: ['pidong3'],
    cap: '피동은 주어가 당하고, 사동은 주어가 남에게 시킨다',
    draw: function () {
      var s = t(120, 30, '피동 — 당한다', { a: 'm', b: 1, size: 17, c: C.blue }) + t(360, 30, '사동 — 시킨다', { a: 'm', b: 1, size: 17, c: C.orange });
      s += line(240, 16, 240, 230, { c: C.edge, w: 1.4, dash: '6 5' });
      /* 피동 */
      s += F.circle(70, 104, 26, { fill: C.grayL, c: C.sub, w: 1.2, label: '경찰', size: 14 }) + F.circle(176, 104, 30, { fill: C.blueL, c: C.blue, w: 2.2, label: '도둑', size: 16, lc: C.blue });
      s += arrow(98, 104, 144, 104, { c: C.blue }) + t(176, 150, '주어', { a: 'm', size: 13, b: 1, c: C.blue });
      s += t(120, 186, '도둑이 경찰에게 잡혔다.', { a: 'm', size: 15 });
      s += t(120, 214, '-이- -히- -리- -기-', { a: 'm', size: 13, c: C.sub });
      /* 사동 */
      s += F.circle(296, 104, 30, { fill: C.orangeL, c: C.orange, w: 2.2, label: '엄마', size: 16, lc: C.orange }) + F.circle(410, 104, 26, { fill: C.grayL, c: C.sub, w: 1.2, label: '아기', size: 14 });
      s += arrow(328, 104, 382, 104, { c: C.orange }) + t(355, 88, '시킴', { a: 'm', size: 13, c: C.orange, b: 1 });
      s += t(296, 150, '주어', { a: 'm', size: 13, b: 1, c: C.orange }) + t(410, 150, '옷을 입다', { a: 'm', size: 13, c: C.sub });
      s += t(360, 186, '엄마가 아기에게 옷을 입혔다.', { a: 'm', size: 15 });
      s += t(360, 214, '-이- -히- -리- -기- -우- -구- -추-', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 236, s);
    } },

  skeleton: { chips: ['sentcomp'],
    cap: '문장의 뼈대 — 누가(주어) · 무엇을(목적어) · 어찌한다(서술어)',
    draw: function () {
      var cols = [[30, '주어', '누가 / 무엇이', C.blue, C.blueL, '동생이'], [180, '목적어', '무엇을', C.orange, C.orangeL, '밥을'],
        [330, '서술어', '어찌한다 / 어떠하다', C.green, C.greenL, '먹는다.']], s = '';
      cols.forEach(function (c) {
        s += box(c[0], 26, 120, 48, { fill: c[4], c: c[3], w: 2, label: c[1], lc: c[3], size: 19 });
        s += t(c[0] + 60, 92, c[2], { a: 'm', size: 13, c: C.sub });
        s += t(c[0] + 60, 134, c[5], { a: 'm', size: 22, b: 1 });
      });
      s += line(30, 160, 450, 160, { c: C.edge, w: 1 });
      s += t(240, 186, '주어와 서술어의 짝이 맞아야 한다', { a: 'm', size: 14, b: 1 });
      s += t(240, 212, '내 꿈은 요리사가 되고 싶다 (×)', { a: 'm', size: 14, c: C.red });
      s += t(240, 236, '내 꿈은 요리사가 되는 것이다 (○)', { a: 'm', size: 14, c: C.green });
      return F.svg(480, 256, s);
    } },

  modifier: { chips: ['sentcomp'],
    cap: '꾸미는 말 — 관형어는 명사(체언)를, 부사어는 서술어를 꾸민다',
    draw: function () {
      var s = '';
      s += t(70, 76, '예쁜', { a: 'm', size: 22, b: 1, c: C.blue }) + t(160, 76, '꽃이', { a: 'm', size: 22 }) + t(250, 76, '피었다.', { a: 'm', size: 22 });
      s += F.route([[70, 58], [70, 40], [160, 40], [160, 56]], { c: C.blue, w: 2 });
      s += box(320, 54, 140, 42, { fill: C.blueL, c: C.blue, label: '관형어 → 명사', lc: C.blue, size: 15 });
      s += t(80, 176, '동생이', { a: 'm', size: 22 }) + t(180, 176, '크게', { a: 'm', size: 22, b: 1, c: C.orange }) + t(266, 176, '웃었다.', { a: 'm', size: 22 });
      s += F.route([[180, 158], [180, 140], [266, 140], [266, 156]], { c: C.orange, w: 2 });
      s += box(320, 154, 140, 42, { fill: C.orangeL, c: C.orange, label: '부사어 → 서술어', lc: C.orange, size: 15 });
      s += line(16, 122, 464, 122, { c: C.edge, w: 1 });
      s += t(240, 226, '빼도 문장은 된다 — 뼈대가 아니라 살', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 248, s);
    } },

  honor: { chips: ['honortype'],
    cap: '높임법 세 가지 — 누구를 높이나: 주어(주체) · 목적어·부사어(객체) · 듣는 사람(상대) (예문은 예시)',
    draw: function () {
      var s = '';
      [[30, '할머니께서'], [138, '선생님께'], [228, '선물을'], [296, '드리셨습니다.']].forEach(function (w) { s += t(w[0], 36, w[1], { size: 18, b: 1 }); });
      s += line(30, 54, 120, 54, { c: C.blue, w: 3 }) + line(138, 54, 210, 54, { c: C.orange, w: 3 }) + line(350, 54, 412, 54, { c: C.green, w: 3 });
      s += arrow(75, 60, 75, 102, { c: C.blue }) + arrow(174, 60, 214, 160, { c: C.orange }) + arrow(381, 60, 400, 102, { c: C.green });
      s += box(14, 106, 130, 60, { fill: C.blueL, c: C.blue, label: '주체 높임\n주어를', lc: C.blue, size: 15 });
      s += t(79, 184, '께서 · -시-', { a: 'm', size: 13, c: C.sub });
      s += box(150, 164, 140, 60, { fill: C.orangeL, c: C.orange, label: '객체 높임\n받는 사람을', lc: C.orange, size: 15 });
      s += t(220, 242, '께 · 드리다 · 모시다', { a: 'm', size: 13, c: C.sub });
      s += box(330, 106, 140, 60, { fill: C.greenL, c: C.green, label: '상대 높임\n듣는 사람을', lc: C.green, size: 15 });
      s += t(400, 184, '-습니다 · -요', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 262, s);
    } },

  wordform: { chips: ['wordform2'],
    cap: '단어 형성 — 하나로 된 단일어, 둘 이상이 모인 합성어·파생어',
    draw: function () {
      var s = box(190, 16, 100, 38, { fill: C.grayL, label: '단어', size: 17 });
      s += F.route([[240, 54], [240, 70], [90, 70], [90, 88]], { w: 1.6, head: 9 }) + F.route([[240, 70], [350, 70], [350, 88]], { w: 1.6, head: 9 });
      s += box(30, 90, 120, 40, { fill: C.blueL, c: C.blue, label: '단일어', lc: C.blue });
      s += t(90, 152, '하늘 · 바다', { a: 'm', size: 15 }) + t(90, 176, '더 쪼갤 수 없다', { a: 'm', size: 13, c: C.sub });
      s += box(290, 90, 120, 40, { fill: C.grayL, label: '복합어' });
      s += F.route([[350, 130], [350, 144], [270, 144], [270, 160]], { w: 1.6, head: 9 }) + F.route([[350, 144], [420, 144], [420, 160]], { w: 1.6, head: 9 });
      s += box(214, 162, 112, 38, { fill: C.greenL, c: C.green, label: '합성어', lc: C.green, size: 15 });
      s += box(364, 162, 112, 38, { fill: C.orangeL, c: C.orange, label: '파생어', lc: C.orange, size: 15 });
      s += t(270, 222, '돌 + 다리', { a: 'm', size: 15 }) + t(270, 244, '어근 + 어근', { a: 'm', size: 13, c: C.sub });
      s += t(420, 222, '풋- + 사과', { a: 'm', size: 15 }) + t(420, 244, '접사 + 어근', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 262, s);
    } },

  /* ═══════════ 영어 ═══════════ */

  tense: { chips: ['past'],
    cap: '시제 — “언제”를 나타내는 말과 동사 모양이 짝을 이룬다',
    draw: function () {
      var y = 96, s = arrow(30, y, 458, y, { w: 2 });
      [[110, '과거', 'I went', 'yesterday', C.orange, 1], [240, '현재', 'I go', 'every day', C.blue, 0], [370, '미래', 'I will go', 'tomorrow', C.green, 0]].forEach(function (p) {
        s += dot(p[0], y, 7, p[4]) + t(p[0], y - 28, p[1], { a: 'm', b: 1, size: 17, c: p[4] });
        s += t(p[0], y + 30, p[2], { a: 'm', size: 18, b: 1, ans: !!p[5] }) + t(p[0], y + 54, p[3], { a: 'm', size: 13, c: C.sub });
      });
      s += line(30, 174, 450, 174, { c: C.edge, w: 1 });
      s += t(36, 200, '규칙', { size: 14, b: 1, c: C.sub }) + t(100, 200, 'play → played  (+ed)', { size: 15 });
      s += t(36, 230, '불규칙', { size: 14, b: 1, c: C.red }) + t(100, 230, 'go → ', { size: 15 }) + t(146, 230, 'went', { size: 15, b: 1, c: C.red, ans: 1 }) +
        t(200, 230, '  통째로 외운다', { size: 13, c: C.sub });
      return F.svg(480, 252, s);
    } },

  comp: { chips: ['comp'],
    cap: '비교급 — 둘을 견줄 때 -er + than (good → better 처럼 불규칙도 있다) (예문은 예시)',
    draw: function () {
      var s = '', g = 210;
      function person(x, h, c, n) {
        return F.circle(x, g - h - 14, 14, { fill: '#fff', c: c, w: 2 }) + box(x - 16, g - h, 32, h, { fill: c === C.blue ? C.blueL : C.grayL, c: c, w: 1.6, r: 10 }) +
          t(x, g + 18, n, { a: 'm', b: 1, size: 17, c: c });
      }
      s += line(30, g, 250, g, { w: 1.4 }) + person(90, 130, C.blue, 'A') + person(190, 88, C.sub, 'B');
      s += line(110, g - 144, 210, g - 144, { c: C.blue, w: 1, dash: '4 3' }) + line(190, g - 144, 190, g - 104, { c: C.blue, w: 1, dash: '4 3' });
      s += t(370, 56, 'A is taller', { a: 'm', b: 1, size: 19 }) + t(370, 84, 'than B.', { a: 'm', b: 1, size: 19 });
      s += line(290, 112, 452, 112, { c: C.edge, w: 1 });
      s += t(300, 140, 'tall → taller', { size: 15 }) + t(300, 166, 'big → bigger', { size: 15 }) + t(300, 192, 'good → better', { size: 15, c: C.red, b: 1 });
      s += t(240, 252, '‘~보다 더’ = 비교급 + than', { a: 'm', size: 14, c: C.sub });
      return F.svg(480, 270, s);
    } },

  perfect: { chips: ['pp'],
    cap: '현재완료 have + 과거분사 — 과거에 시작된 일이 지금까지 이어진다 (예문은 예시)',
    draw: function () {
      var y = 110, s = arrow(30, y, 458, y, { w: 2 });
      s += t(120, y - 30, '과거', { a: 'm', b: 1, size: 15, c: C.sub }) + t(330, y - 30, '지금', { a: 'm', b: 1, size: 15, c: C.blue });
      s += line(330, y - 16, 330, y + 16, { c: C.blue, w: 3 });
      s += box(120, y - 10, 210, 20, { fill: C.blueL, c: C.blue, r: 10, w: 1.6 }) + dot(120, y, 7, C.blue);
      s += t(225, y + 38, 'have + 과거분사(p.p.)', { a: 'm', b: 1, size: 16, c: C.blue });
      s += t(240, 186, 'I have seen it.', { a: 'm', b: 1, size: 19 });
      s += t(240, 216, 'see – saw – seen   ·   eat – ate – eaten', { a: 'm', size: 14, c: C.sub });
      s += t(240, 240, '원형 – 과거형 – 과거분사', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 258, s);
    } },

  passive: { chips: ['passiveH1'],
    cap: '수동태 — 목적어가 주어 자리로, 동사는 be + 과거분사, 원래 주어는 by 뒤로',
    draw: function () {
      var s = t(16, 40, '능동', { b: 1, size: 15, c: C.sub }) + t(16, 190, '수동', { b: 1, size: 15, c: C.sub });
      s += box(70, 20, 90, 40, { fill: C.blueL, c: C.blue, label: 'Tom', lc: C.blue }) + box(176, 20, 100, 40, { fill: C.grayL, label: 'wrote' }) +
        box(292, 20, 150, 40, { fill: C.orangeL, c: C.orange, label: 'this book.', lc: C.orange });
      s += box(70, 170, 130, 40, { fill: C.orangeL, c: C.orange, label: 'This book', lc: C.orange }) + box(214, 170, 130, 40, { fill: C.grayL, label: 'was written' }) +
        box(358, 170, 104, 40, { fill: C.blueL, c: C.blue, label: 'by Tom.', lc: C.blue });
      s += arrow(367, 62, 140, 166, { c: C.orange }) + arrow(115, 62, 405, 166, { c: C.blue }) + arrow(226, 62, 279, 166, { c: C.sub, w: 1.6 });
      s += t(240, 236, 'be + 과거분사(p.p.)', { a: 'm', b: 1, size: 15 }) + t(240, 258, 'write – wrote – written', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 274, s);
    } }

  };
})();
