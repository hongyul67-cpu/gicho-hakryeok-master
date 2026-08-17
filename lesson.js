/* ══════════════════════════════════════════════════════════════
   기초학력 전자칠판 수업자료 — 슬라이드 원고
   board.html 에서 window.LESSON / window.UNITS 로 읽는다.

   진단도구(index.html)가 실제로 묻는 것들 중,
   학생이 가장 많이 틀리고 한 번 잡아 두면 오래 가는 것만 골랐다.
   ══════════════════════════════════════════════════════════════ */

var HOME = 'https://hongyul67-cpu.github.io/gicho-hakryeok-master/';

var C = { ink:'#111827', dim:'#6b7280', red:'#dc2626', blue:'#2563eb',
          green:'#059669', gold:'#b45309', pu:'#7c3aed' };

function svg(w, h, body){
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-height:38vh" '
       + 'xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
       + '<defs><marker id="ar" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">'
       + '<path d="M0,0 L8,3 L0,6 z" fill="' + C.ink + '"/></marker></defs>' + body + '</svg>';
}
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 13) + '" fill="'
       + (o.c || C.ink) + '" text-anchor="' + (o.a || 'start') + '"'
       + (o.b ? ' font-weight="700"' : '') + '>' + s + '</text>';
}
function box(x, y, w, h, fill, stroke){
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="'
       + (fill || '#f3f4f6') + '" stroke="' + (stroke || C.dim) + '" stroke-width="1.6"/>';
}
/* O / X 표시 */
function ox(x, y, ok){
  return ok ? '<circle cx="' + x + '" cy="' + (y-5) + '" r="9" fill="none" stroke="' + C.green + '" stroke-width="2.6"/>'
            : '<path d="M' + (x-8) + ',' + (y-13) + ' L' + (x+8) + ',' + (y+3) + ' M' + (x+8) + ',' + (y-13)
              + ' L' + (x-8) + ',' + (y+3) + '" stroke="' + C.red + '" stroke-width="2.6"/>';
}

var LESSON = [

/* ═══════════ 국어 ═══════════ */
{
  u:'📖 국어', t:'문장의 뼈대 — 누가 / 무엇을 / 어찌한다',
  svg: svg(520, 225,
    box(30, 45, 130, 52, '#eff6ff', C.blue) + tx(95, 77, '주어', {a:'middle', b:1, size:20, c:C.blue}) +
    box(185, 45, 130, 52, '#fff7ed', C.gold) + tx(250, 77, '목적어', {a:'middle', b:1, size:20, c:C.gold}) +
    box(340, 45, 150, 52, '#f0fdf4', C.green) + tx(415, 77, '서술어', {a:'middle', b:1, size:20, c:C.green}) +
    tx(95, 118, '누가 / 무엇이', {a:'middle', size:13, c:C.dim}) +
    tx(250, 118, '무엇을', {a:'middle', size:13, c:C.dim}) +
    tx(415, 118, '어찌한다 / 어떠하다', {a:'middle', size:13, c:C.dim}) +
    tx(260, 160, '동생이      밥을      먹는다.', {a:'middle', size:24, b:1}) +
    tx(260, 196, '주어를 빼먹거나 서술어와 짝이 안 맞으면 문장이 어색해진다', {a:'middle', size:13, c:C.dim}) +
    tx(260, 218, '“내 꿈은 요리사가 되고 싶다” → “내 꿈은 요리사가 되는 것이다”', {a:'middle', size:13, c:C.red})),
  cap:'모든 문장은 이 뼈대 위에 살이 붙는다',
  pts:[
    '문장의 기본 뼈대는 <b>주어(누가) + 목적어(무엇을) + 서술어(어찌한다)</b>다.',
    '가장 흔한 실수는 <b>주어와 서술어가 짝이 안 맞는 것</b> — “내 꿈은 요리사가 <b>되고 싶다</b>” (×) → “내 꿈은 요리사가 <b>되는 것이다</b>” (○).',
    '주어를 빼먹어도 어색해진다 — “어제 학교에 갔는데 재미있었다”는 <b>무엇이</b> 재미있었는지 없다.',
    '자소서·보고서를 쓸 때 문장이 길어지면, <b>주어와 서술어만 남기고 읽어 보는 습관</b>을 들이면 어색한 문장이 바로 보인다.'
  ],
  ask:'“이 제품의 장점은 값이 싸고 튼튼합니다.” 어디가 어색할까요? 어떻게 고치면 될까요?',
  ansq:'주어와 서술어의 짝이 맞는 문장은?',
  anso:['내 취미는 축구를 한다.','내 목표는 취업하고 싶다.',
        '이 기계의 특징은 소음이 적다는 것이다.','우리 반의 자랑은 성실합니다.'],
  ansa:2,
  anse:'“특징은 ~ 것이다”가 짝이 맞습니다. 나머지는 “취미는 축구<b>다</b>”, “목표는 취업<b>이다</b>”, “자랑은 성실하다<b>는 점이다</b>”로 고쳐야 합니다.',
  go:['📖 국어 진단 문제 풀기', HOME]
},
{
  u:'📖 국어', t:'맞춤법 — 이 네 가지만 잡아도 절반은 준다',
  svg: svg(520, 250,
    box(25, 30, 230, 96, '#f0fdf4', C.green) +
    tx(140, 55, '되 / 돼', {a:'middle', b:1, size:19, c:C.green}) +
    tx(140, 80, '“하”를 넣어 말이 되면 → 되', {a:'middle', size:13}) +
    tx(140, 101, '“해”를 넣어 말이 되면 → 돼', {a:'middle', size:13}) +
    tx(140, 120, '안 돼요(안 해요) · 되고(하고)', {a:'middle', size:12, c:C.dim}) +
    box(270, 30, 225, 96, '#eff6ff', C.blue) +
    tx(382, 55, '안 / 않', {a:'middle', b:1, size:19, c:C.blue}) +
    tx(382, 80, '안 = 아니 (띄어 쓴다)', {a:'middle', size:13}) +
    tx(382, 101, '않 = 아니하 (붙여 쓴다)', {a:'middle', size:13}) +
    tx(382, 120, '안 먹는다 / 먹지 않는다', {a:'middle', size:12, c:C.dim}) +
    box(25, 140, 230, 96, '#fff7ed', C.gold) +
    tx(140, 165, '왠 / 웬', {a:'middle', b:1, size:19, c:C.gold}) +
    tx(140, 190, '왠지 = 왜인지 (이것뿐)', {a:'middle', size:13}) +
    tx(140, 211, '나머지는 전부 웬', {a:'middle', size:13}) +
    tx(140, 230, '웬일 · 웬만하면 · 웬 사람', {a:'middle', size:12, c:C.dim}) +
    box(270, 140, 225, 96, '#faf5ff', C.pu) +
    tx(382, 165, '로서 / 로써', {a:'middle', b:1, size:19, c:C.pu}) +
    tx(382, 190, '로서 = 자격 · 신분', {a:'middle', size:13}) +
    tx(382, 211, '로써 = 수단 · 도구', {a:'middle', size:13}) +
    tx(382, 230, '학생으로서 / 대화로써', {a:'middle', size:12, c:C.dim})),
  cap:'시험에도 나오고 자소서에서도 눈에 띄는 네 가지',
  pts:[
    '<b>되 / 돼</b> — 자리에 <b>“하”</b>를 넣어 말이 되면 <b>되</b>, <b>“해”</b>를 넣어 말이 되면 <b>돼</b>. “안 <b>돼</b>요”(안 <b>해</b>요 ○), “<b>되</b>고”(<b>하</b>고 ○).',
    '<b>안 / 않</b> — <b>안</b>은 “아니”라서 <b>띄어 쓰고</b>, <b>않</b>은 “아니하”라서 <b>붙여 쓴다</b>. “<b>안</b> 먹는다” / “먹지 <b>않</b>는다”.',
    '<b>왠 / 웬</b> — <b>왠지</b>(=왜인지) 하나만 ‘왠’이고 <b>나머지는 전부 웬</b>. 웬일·웬만하면·웬 사람.',
    '<b>로서 / 로써</b> — <b>로서</b>는 자격·신분(학생<b>으로서</b>), <b>로써</b>는 수단·도구(대화<b>로써</b> 해결).',
    '헷갈리면 <b>소리 내어 바꿔 읽어 보는 것</b>이 가장 빠르다.'
  ],
  ask:'“오늘은 왠지 일이 잘 안되네요.” 여기서 맞춤법이 틀린 곳이 있을까요?',
  ansq:'맞춤법이 <b>바르게</b> 쓰인 것은?',
  anso:['그렇게 하면 안되요.','웬지 기분이 좋다.',
        '학생으로써 지켜야 할 일','대화로써 문제를 풀었다.'],
  ansa:3,
  anse:'수단이므로 <b>대화로써</b>가 맞습니다. 나머지는 “안 <b>돼</b>요”, “<b>왠</b>지”, “학생<b>으로서</b>”로 고쳐야 합니다.',
  go:['📖 국어 진단 문제 풀기', HOME]
},
{
  u:'📖 국어', t:'글 읽기 — 중심 문장을 찾는 법',
  svg: svg(520, 235,
    box(35, 30, 450, 44, '#fff7ed', C.gold) +
    tx(60, 58, '① 우리 학교는 실습 장비가 잘 갖춰져 있다.', {size:15, b:1, c:C.gold}) +
    tx(495, 58, '중심', {a:'end', size:12, c:C.gold, b:1}) +
    box(35, 84, 450, 40, '#f9fafb', C.dim) +
    tx(60, 110, '② 최신 CNC 선반이 여섯 대 있다.', {size:14}) +
    box(35, 134, 450, 40, '#f9fafb', C.dim) +
    tx(60, 160, '③ 3D프린터도 학급마다 두 대씩 있다.', {size:14}) +
    box(35, 184, 450, 40, '#f9fafb', C.dim) +
    tx(60, 210, '④ 용접 실습실도 따로 마련되어 있다.', {size:14}) +
    '<path d="M25,52 L25,204" stroke="' + C.gold + '" stroke-width="2"/>' +
    tx(505, 105, '뒷', {size:11, c:C.dim}) + tx(505, 122, '받', {size:11, c:C.dim}) +
    tx(505, 139, '침', {size:11, c:C.dim})),
  cap:'중심 문장은 “묶는 말”, 뒷받침 문장은 “예를 드는 말”이다',
  pts:[
    '<b>중심 문장</b>은 문단 전체를 <b>묶어 주는</b> 문장이다. 나머지는 그 말을 <b>뒷받침</b>하는 예·이유·설명이다.',
    '찾는 요령 — <b>가장 넓게 말하는 문장</b>을 고른다. 구체적인 숫자·이름이 나오면 대개 뒷받침 문장이다.',
    '중심 문장은 <b>맨 앞이나 맨 뒤</b>에 오는 경우가 많다. 가운데 있는 경우는 드물다.',
    '<b>그러나 · 하지만 · 따라서 · 즉</b> 뒤에 오는 문장은 특히 중요하다. 글쓴이가 진짜 하고 싶은 말이 그 뒤에 있다.',
    '시험 지문이든 안전 지침서든 방법은 같다 — <b>묶는 말 하나</b>를 찾고 나머지는 예시로 넘긴다.'
  ],
  ask:'설명서에서 “따라서”라는 말이 나오면, 그 앞과 뒤 중 어디가 더 중요할까요?',
  ansq:'다음 중 뒷받침 문장의 특징으로 알맞은 것은?',
  anso:['문단 전체를 묶어 준다','구체적인 예나 숫자를 든다',
        '항상 맨 앞에 온다','접속어를 쓸 수 없다'],
  ansa:1,
  anse:'뒷받침 문장은 <b>구체적인 예·이유·숫자</b>로 중심 문장을 받쳐 줍니다. 전체를 묶어 주는 것은 중심 문장입니다.',
  go:['📖 국어 진단 문제 풀기', HOME]
},

/* ═══════════ 영어 ═══════════ */
{
  u:'🔤 영어', t:'be동사와 일반동사 — 둘을 섞지 않는다',
  svg: svg(520, 240,
    box(25, 30, 230, 100, '#eff6ff', C.blue) +
    tx(140, 55, 'be동사 (am / are / is)', {a:'middle', b:1, size:16, c:C.blue}) +
    tx(140, 80, '“~이다 / ~에 있다”', {a:'middle', size:13.5}) +
    tx(140, 103, 'I am · You are · He is', {a:'middle', size:13.5}) +
    tx(140, 124, '부정 : I am not / He is not', {a:'middle', size:12.5, c:C.dim}) +
    box(270, 30, 225, 100, '#f0fdf4', C.green) +
    tx(382, 55, '일반동사 (go, like, have…)', {a:'middle', b:1, size:16, c:C.green}) +
    tx(382, 80, '“~한다”', {a:'middle', size:13.5}) +
    tx(382, 103, '3인칭 단수면 <tspan font-weight="700">-s</tspan> : He like<tspan font-weight="700">s</tspan>', {a:'middle', size:13.5}) +
    tx(382, 124, '부정 : do not / does not + 원형', {a:'middle', size:12.5, c:C.dim}) +
    ox(60, 175, false) + tx(80, 175, 'He is like soccer.', {size:16, c:C.red}) +
    ox(60, 210, true) + tx(80, 210, 'He likes soccer.  /  He is a soccer player.', {size:16, c:C.green}) +
    tx(260, 235, 'be동사와 일반동사는 한 문장에 같이 오지 않는다', {a:'middle', size:13.5, b:1})),
  cap:'가장 많이 틀리는 것 — be동사와 일반동사를 겹쳐 쓰는 것',
  pts:[
    '<b>be동사</b>(am·are·is)는 <b>“~이다 / ~에 있다”</b>. <b>일반동사</b>(go·like·have…)는 <b>“~한다”</b>.',
    '둘은 <b>한 문장에 같이 오지 않는다</b>. “He <b>is like</b> soccer.” (×) → “He <b>likes</b> soccer.” (○)',
    '주어가 <b>3인칭 단수</b>(He·She·It·단수 명사)면 일반동사에 <b>-s</b>를 붙인다.',
    '부정문 — be동사는 <b>뒤에 not</b>(He is <b>not</b>), 일반동사는 <b>앞에 do/does not</b>을 놓고 동사는 <b>원형</b>으로(He <b>does not like</b>).',
    '의문문도 같다 — <b>Is</b> he a student? / <b>Does</b> he like soccer?'
  ],
  ask:'“She doesn’t likes math.” 무엇이 틀렸을까요? 왜 그럴까요?',
  ansq:'빈칸에 알맞은 것은?  “He ___ two dogs.”',
  anso:['have','has','is have','are'],
  ansa:1,
  anse:'주어 He 는 3인칭 단수이므로 <b>has</b>입니다. be동사(is·are)를 함께 쓰면 안 됩니다.',
  go:['🔤 영어 진단 문제 풀기', HOME]
},
{
  u:'🔤 영어', t:'시제 — 언제 일어난 일인가',
  svg: svg(520, 235,
    '<line x1="40" y1="105" x2="480" y2="105" stroke="' + C.ink + '" stroke-width="2" marker-end="url(#ar)"/>' +
    '<circle cx="130" cy="105" r="7" fill="' + C.gold + '"/>' +
    '<circle cx="260" cy="105" r="7" fill="' + C.blue + '"/>' +
    '<circle cx="395" cy="105" r="7" fill="' + C.green + '"/>' +
    tx(130, 78, '과거', {a:'middle', b:1, size:17, c:C.gold}) +
    tx(260, 78, '현재', {a:'middle', b:1, size:17, c:C.blue}) +
    tx(395, 78, '미래', {a:'middle', b:1, size:17, c:C.green}) +
    tx(130, 138, 'I went', {a:'middle', size:16}) + tx(130, 160, 'yesterday', {a:'middle', size:12, c:C.dim}) +
    tx(260, 138, 'I go', {a:'middle', size:16}) + tx(260, 160, 'every day', {a:'middle', size:12, c:C.dim}) +
    tx(395, 138, 'I will go', {a:'middle', size:16}) + tx(395, 160, 'tomorrow', {a:'middle', size:12, c:C.dim}) +
    tx(260, 198, '불규칙 과거형은 통째로 외운다', {a:'middle', size:14.5, b:1, c:C.red}) +
    tx(260, 224, 'go–went · eat–ate · see–saw · buy–bought · take–took · come–came', {a:'middle', size:13, c:C.dim})),
  cap:'시제는 “언제”를 나타내는 말과 짝이 맞아야 한다',
  pts:[
    '<b>과거</b>는 보통 <b>-ed</b>를 붙이지만, 자주 쓰는 동사일수록 <b>불규칙</b>이다 — go–<b>went</b>, eat–<b>ate</b>, see–<b>saw</b>, buy–<b>bought</b>.',
    '<b>미래</b>는 <b>will + 동사원형</b>. will 뒤에는 절대 -s나 -ed가 붙지 않는다.',
    '문장 안의 <b>시간 표현</b>과 시제가 맞아야 한다 — <b>yesterday</b>면 과거, <b>tomorrow</b>면 미래, <b>every day</b>면 현재.',
    '<b>과거 부정·의문</b>에서는 did가 시제를 맡으므로 동사는 <b>원형</b>이다 — “I <b>didn’t go</b>” (didn’t went ×).',
    '불규칙 동사는 이해할 게 없다 — <b>소리 내어 세 번씩 읽는 것</b>이 가장 빠르다.'
  ],
  ask:'“I didn’t went there.” 어디가 틀렸을까요? did가 이미 무엇을 하고 있나요?',
  ansq:'빈칸에 알맞은 것은?  “I ___ to the museum yesterday.”',
  anso:['go','goes','went','will go'],
  ansa:2,
  anse:'yesterday(어제)가 있으므로 <b>과거형 went</b>입니다. go의 과거형은 goed가 아니라 <b>went</b>인 불규칙 동사입니다.',
  go:['🔤 영어 진단 문제 풀기', HOME]
},
{
  u:'🔤 영어', t:'전치사 in · on · at — 넓은 것부터 좁은 것으로',
  svg: svg(520, 245,
    box(25, 30, 230, 96, '#eff6ff', C.blue) +
    tx(140, 54, '장소', {a:'middle', b:1, size:17, c:C.blue}) +
    tx(45, 78, 'in', {b:1, size:15}) + tx(80, 78, '안 (넓은 공간) — in Korea, in the box', {size:12.5}) +
    tx(45, 100, 'on', {b:1, size:15}) + tx(80, 100, '표면에 붙어 — on the wall, on the desk', {size:12.5}) +
    tx(45, 120, 'at', {b:1, size:15}) + tx(80, 120, '한 지점 — at the door, at school', {size:12.5}) +
    box(270, 30, 225, 96, '#f0fdf4', C.green) +
    tx(382, 54, '시간', {a:'middle', b:1, size:17, c:C.green}) +
    tx(288, 78, 'in', {b:1, size:15}) + tx(320, 78, '연·월·계절 — in 2012, in May', {size:12.5}) +
    tx(288, 100, 'on', {b:1, size:15}) + tx(320, 100, '요일·날짜 — on Monday', {size:12.5}) +
    tx(288, 120, 'at', {b:1, size:15}) + tx(320, 120, '시각 — at 9 o’clock', {size:12.5}) +
    tx(260, 170, 'in  →  on  →  at    넓은 것에서 좁은 것으로', {a:'middle', size:18, b:1, c:C.gold}) +
    tx(260, 205, '“한국에서(in) 월요일에(on) 9시에(at) 만나자”', {a:'middle', size:14}) +
    tx(260, 235, '시간도 장소도 순서가 똑같다 — 이 하나만 기억하면 된다', {a:'middle', size:13, c:C.dim})),
  cap:'in → on → at 은 넓은 것에서 좁은 것으로 가는 순서다',
  pts:[
    '<b>장소</b> — <b>in</b>(넓은 공간 안) → <b>on</b>(표면에 붙어) → <b>at</b>(한 지점).',
    '<b>시간</b>도 순서가 같다 — <b>in</b>(연·월·계절) → <b>on</b>(요일·날짜) → <b>at</b>(시각).',
    '한 문장에 다 나오면 순서가 눈에 보인다 — “<b>in</b> Korea, <b>on</b> Monday, <b>at</b> 9 o’clock”.',
    '예외처럼 보이는 것도 원리는 같다 — <b>at school</b>은 “학교라는 지점”, <b>in the school</b>은 “학교 건물 안”이다.',
    '<b>at night</b> / <b>in the morning</b> 처럼 굳어진 표현 몇 개만 따로 외워 두면 된다.'
  ],
  ask:'“나는 3층에서 일한다”를 영어로 하면 in·on·at 중 무엇을 쓸까요? 왜 그럴까요?',
  ansq:'빈칸에 알맞은 것은?  “The class starts ___ 9 o’clock.”',
  anso:['in','on','at','to'],
  ansa:2,
  anse:'<b>시각</b> 앞에는 <b>at</b>을 씁니다. 요일·날짜는 on, 연·월·계절은 in 입니다.',
  go:['🔤 영어 진단 문제 풀기', HOME]
},

/* ═══════════ 수학 ═══════════ */
{
  u:'🔢 수학', t:'분수 · 소수 · 백분율 — 같은 값의 세 얼굴',
  svg: svg(520, 245,
    /* 원 그래프 1/4 */
    '<circle cx="95" cy="95" r="55" fill="#f3f4f6" stroke="' + C.ink + '" stroke-width="2"/>' +
    '<path d="M95,95 L95,40 A55,55 0 0,1 150,95 z" fill="#bfdbfe" stroke="' + C.blue + '" stroke-width="2"/>' +
    tx(95, 172, '색칠한 부분', {a:'middle', size:13, c:C.dim}) +
    tx(240, 62, '분수', {b:1, size:17}) + tx(320, 62, '1 / 4', {b:1, size:20, c:C.blue}) +
    tx(240, 100, '소수', {b:1, size:17}) + tx(320, 100, '0.25', {b:1, size:20, c:C.green}) +
    tx(240, 138, '백분율', {b:1, size:17}) + tx(320, 138, '25 %', {b:1, size:20, c:C.gold}) +
    tx(415, 100, '←  전부', {size:14, c:C.dim}) + tx(415, 122, '같은 값', {size:14, c:C.dim}) +
    tx(260, 200, '분수 → 소수 : 위 ÷ 아래     소수 → % : × 100', {a:'middle', size:16, b:1}) +
    tx(260, 232, '1/2 = 0.5 = 50%   ·   1/4 = 0.25 = 25%   ·   3/4 = 0.75 = 75%', {a:'middle', size:14, c:C.dim})),
  cap:'모양만 다를 뿐 같은 값이다 — 서로 바꿀 줄 알면 끝이다',
  pts:[
    '<b>분수 → 소수</b>는 <b>위 ÷ 아래</b>. 1/4 = 1 ÷ 4 = <b>0.25</b>.',
    '<b>소수 → 백분율</b>은 <b>× 100</b>. 0.25 × 100 = <b>25%</b>.',
    '자주 쓰는 것은 외워 두면 계산기가 필요 없다 — <b>1/2=50%, 1/4=25%, 1/5=20%, 3/4=75%</b>.',
    '현장에서 그대로 쓴다 — 불량률 3%, 인필 20%, 할인 15%는 전부 이 변환이다.',
    '<b>“몇 %인가”는 (부분 ÷ 전체) × 100</b>. 100개 중 3개 불량이면 (3 ÷ 100) × 100 = <b>3%</b>.'
  ],
  ask:'200개를 만들었는데 8개가 불량이었다. 불량률은 몇 %일까요?',
  ansq:'3/5 을 백분율로 바꾸면?',
  anso:['35%','53%','60%','65%'],
  ansa:2,
  anse:'3 ÷ 5 = 0.6 이고, 0.6 × 100 = <b>60%</b> 입니다.',
  go:['🔢 수학 진단 문제 풀기', HOME]
},
{
  u:'🔢 수학', t:'일차방정식 — 모르는 것을 한쪽으로 몰아낸다',
  svg: svg(520, 245,
    tx(260, 45, '3x + 5 = 20', {a:'middle', b:1, size:26}) +
    '<line x1="150" y1="62" x2="370" y2="62" stroke="' + C.dim + '" stroke-width="1"/>' +
    tx(260, 92, '양쪽에서 5를 뺀다', {a:'middle', size:14, c:C.blue}) +
    tx(260, 124, '3x = 15', {a:'middle', b:1, size:24, c:C.blue}) +
    tx(260, 156, '양쪽을 3으로 나눈다', {a:'middle', size:14, c:C.green}) +
    tx(260, 188, 'x = 5', {a:'middle', b:1, size:26, c:C.green}) +
    box(30, 205, 460, 32, '#fff7ed', C.gold) +
    tx(260, 227, '양쪽에 똑같이 하면 등호는 깨지지 않는다 — 이것이 전부다',
       {a:'middle', size:15, b:1, c:C.gold})),
  cap:'저울의 양쪽에 똑같이 더하고 빼고 나누면 균형은 그대로다',
  pts:[
    '방정식은 <b>저울</b>이다. <b>양쪽에 똑같이</b> 더하거나 빼거나 곱하거나 나누면 균형이 안 깨진다.',
    '푸는 순서는 언제나 같다 — ① <b>x가 없는 항</b>을 반대쪽으로 넘긴다 ② <b>x 앞의 수</b>로 양쪽을 나눈다.',
    '넘길 때 <b>부호가 바뀐다</b>. +5를 넘기면 −5가 된다. 여기서 실수가 가장 많다.',
    '검산은 <b>구한 값을 원래 식에 넣어 보는 것</b>. 3×5+5 = 20 ✓ — 20초면 확인된다.',
    '실습에서도 그대로 쓴다 — “전체 길이 200에서 양끝 20씩 빼고 <b>n등분</b>” 같은 계산이 전부 일차방정식이다.'
  ],
  ask:'2x − 7 = 9 를 풀어 봅시다. 첫 번째로 무엇을 해야 할까요?',
  ansq:'4x − 3 = 17 일 때 x 의 값은?',
  anso:['3','4','5','6'],
  ansa:2,
  anse:'4x = 17 + 3 = 20, x = 20 ÷ 4 = <b>5</b> 입니다. 검산하면 4×5−3 = 17 ✓',
  go:['🔢 수학 진단 문제 풀기', HOME]
},
{
  u:'🔢 수학', t:'비례식과 단위 — 실습에서 매일 쓰는 계산',
  svg: svg(520, 250,
    tx(260, 42, 'a : b  =  c : d      →      a × d  =  b × c', {a:'middle', b:1, size:20, c:C.blue}) +
    tx(260, 70, '바깥끼리 곱한 것 = 안쪽끼리 곱한 것', {a:'middle', size:13, c:C.dim}) +
    box(30, 88, 460, 52, '#f0fdf4', C.green) +
    tx(260, 110, '“3분에 12개를 만들면, 20분에는 몇 개?”', {a:'middle', size:15, b:1}) +
    tx(260, 132, '3 : 12 = 20 : x   →   3x = 240   →   x = 80개', {a:'middle', size:14, c:C.green}) +
    tx(70, 175, '길이', {b:1, size:15}) + tx(140, 175, '1 m = 100 cm = 1000 mm', {size:14}) +
    tx(70, 202, '무게', {b:1, size:15}) + tx(140, 202, '1 kg = 1000 g   ·   1 t = 1000 kg', {size:14}) +
    tx(70, 229, '넓이', {b:1, size:15}) + tx(140, 229, '1 m² = 10,000 cm²   (100 × 100)', {size:14, c:C.red}) +
    tx(400, 229, '← 자주 틀림', {size:12.5, c:C.red, b:1})),
  cap:'비례식은 “바깥끼리 = 안쪽끼리”만 알면 끝난다',
  pts:[
    '<b>a : b = c : d</b> 이면 <b>a × d = b × c</b>. 바깥끼리 곱한 것과 안쪽끼리 곱한 것이 같다.',
    '문장을 식으로 옮길 때는 <b>단위를 같은 자리에 맞춰</b> 쓴다 — “분 : 개 = 분 : 개”.',
    '<b>도면 척도</b>도 비례식이다. 1:2 로 그린 도면에서 40mm로 재졌다면 실물은 80mm.',
    '단위환산에서 <b>넓이·부피는 제곱·세제곱만큼</b> 커진다 — 1 m² = <b>10,000</b> cm² (100×100), 1 m³ = 1,000,000 cm³.',
    '가장 흔한 실수 — 1 m² 를 100 cm² 로 잘못 계산하는 것. <b>길이는 100배, 넓이는 10,000배</b>.'
  ],
  ask:'1:5 축척으로 그린 도면에서 어떤 부분이 30mm로 재졌다. 실물은 몇 mm일까요?',
  ansq:'1 m² 는 몇 cm² 인가?',
  anso:['100 cm²','1,000 cm²','10,000 cm²','100,000 cm²'],
  ansa:2,
  anse:'1 m = 100 cm 이므로 100 × 100 = <b>10,000 cm²</b> 입니다. 길이는 100배지만 넓이는 10,000배가 됩니다.',
  go:['🔢 수학 진단 문제 풀기', HOME]
}
];

var UNITS = (function(){
  var order = [], map = {};
  LESSON.forEach(function(s, i){
    if(!map[s.u]){ map[s.u] = { name: s.u, idx: [] }; order.push(map[s.u]); }
    map[s.u].idx.push(i);
  });
  return order;
})();

window.LESSON = LESSON;
window.UNITS  = UNITS;
