const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType
} = require('docx');

const data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));
const CIRC = ['①','②','③','④','⑤'];
const SUBJECTS = [
  { key: 'kor', name: '국어' },
  { key: 'eng', name: '영어' },
  { key: 'math', name: '수학' },
];

const children = [];

// ── 제목 ──
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: '기초학력 진단 평가', bold: true, size: 40 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '333333', space: 6 } },
  children: [new TextRun({ text: '대상: 고등학교 1학년  ·  출제 수준: 중3 기본 + 고1 초반  ·  국어 · 영어 · 수학', size: 22, color: '444444' })],
}));

// ── 인적사항 표 ──
function infoCell(text, w, shaded) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: shaded ? { type: ShadingType.CLEAR, fill: 'F0F0F0' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: !!shaded, size: 20 })] })],
  });
}
children.push(new Table({
  columnWidths: [1400, 3000, 1400, 3000],
  width: { size: 8800, type: WidthType.DXA },
  rows: [
    new TableRow({ children: [ infoCell('학년/반/번호', 1400, true), infoCell('        학년   반   번', 3000, false), infoCell('이름', 1400, true), infoCell('', 3000, false) ] }),
    new TableRow({ children: [ infoCell('점수', 1400, true), infoCell('             / 36', 3000, false), infoCell('걸린 시간', 1400, true), infoCell('        분', 3000, false) ] }),
  ],
}));
children.push(new Paragraph({
  spacing: { before: 120, after: 200 },
  children: [new TextRun({ text: '※ 안내: 모든 문항은 객관식입니다. 각 문항에서 알맞은 답 하나를 골라 번호를 답안지에 표시하세요. (과목별 12문항 = 중3 기본 10문항 + 고1 초반 2문항, 총 36문항)', size: 18, color: '666666' })],
}));

// ── 문항 렌더 ──
function renderQuestion(n, item) {
  // 질문 텍스트: 줄바꿈(지문) 처리
  const lines = String(item.q).split(/\n+/).map(s => s.trim()).filter(Boolean);
  const qRuns = [new TextRun({ text: n + '. ', bold: true, size: 22 })];
  lines.forEach((ln, i) => {
    if (i > 0) qRuns.push(new TextRun({ text: '', break: 1 }));
    qRuns.push(new TextRun({ text: ln, size: 22 }));
  });
  children.push(new Paragraph({ spacing: { before: 120, after: 40 }, children: qRuns }));

  // 보기
  const chRuns = [];
  item.choices.forEach((c, i) => {
    if (i > 0) chRuns.push(new TextRun({ text: '    ', size: 22 }));
    chRuns.push(new TextRun({ text: CIRC[i] + ' ' + c, size: 22 }));
  });
  children.push(new Paragraph({ spacing: { after: 40 }, indent: { left: 200 }, children: chRuns }));
}

// ── 과목별 섹션 ──
SUBJECTS.forEach((sub, si) => {
  if (si > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { type: ShadingType.CLEAR, fill: 'E8E8E8' },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: '555555', space: 8 } },
    children: [new TextRun({ text: '【 ' + sub.name + ' 】  (중3 기본 10문항 + 고1 초반 2문항)', bold: true, size: 26 })],
  }));
  data[sub.key].ms3.forEach((item, i) => renderQuestion(i + 1, item));
  // 고1 초반 구분선
  children.push(new Paragraph({
    spacing: { before: 160, after: 80 },
    border: { bottom: { style: BorderStyle.DASHED, size: 8, color: '999999', space: 4 } },
    children: [new TextRun({ text: '── 고1 초반 도전 문항 ──', bold: true, size: 20, color: '777777' })],
  }));
  data[sub.key].hs1.forEach((item, i) => renderQuestion(11 + i, item));
});

// ── 정답표 ──
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  spacing: { after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '333333', space: 6 } },
  children: [new TextRun({ text: '정답표 (교사용)', bold: true, size: 30 })],
}));
SUBJECTS.forEach(sub => {
  children.push(new Paragraph({
    spacing: { before: 140, after: 60 },
    children: [new TextRun({ text: '■ ' + sub.name, bold: true, size: 24 })],
  }));
  const ansRuns = [];
  const allItems = data[sub.key].ms3.concat(data[sub.key].hs1);
  allItems.forEach((item, i) => {
    if (i > 0) ansRuns.push(new TextRun({ text: '    ', size: 20 }));
    if (i === 10) ansRuns.push(new TextRun({ text: '| (고1) ', size: 20, color: '777777' }));
    ansRuns.push(new TextRun({ text: (i + 1) + '.', size: 20 }));
    ansRuns.push(new TextRun({ text: CIRC[item.answer], bold: true, size: 20 }));
  });
  children.push(new Paragraph({ spacing: { after: 60 }, children: ansRuns }));
});

const doc = new Document({
  styles: { default: { document: { run: { font: 'Malgun Gothic' } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(__dirname + '/기초학력_진단평가_중3+고1_국영수_12문항.docx', buf);
  console.log('done:', buf.length, 'bytes');
});
