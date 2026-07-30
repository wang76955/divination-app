// 八卦基础数据
// 每条线: 1=阳(—), 0=阴(- -)
const trigrams = [
  { id: 1, name: "乾", symbol: "☰", pinyin: "qián", nature: "天", lines: [1,1,1], attribute: "健" },
  { id: 2, name: "兑", symbol: "☱", pinyin: "duì", nature: "泽", lines: [0,1,1], attribute: "说" },
  { id: 3, name: "离", symbol: "☲", pinyin: "lí", nature: "火", lines: [1,0,1], attribute: "丽" },
  { id: 4, name: "震", symbol: "☳", pinyin: "zhèn", nature: "雷", lines: [0,0,1], attribute: "动" },
  { id: 5, name: "巽", symbol: "☴", pinyin: "xùn", nature: "风", lines: [1,1,0], attribute: "入" },
  { id: 6, name: "坎", symbol: "☵", pinyin: "kǎn", nature: "水", lines: [0,1,0], attribute: "陷" },
  { id: 7, name: "艮", symbol: "☶", pinyin: "gèn", nature: "山", lines: [1,0,0], attribute: "止" },
  { id: 8, name: "坤", symbol: "☷", pinyin: "kūn", nature: "地", lines: [0,0,0], attribute: "顺" }
];

// 根据下三爻(内卦)和上三爻(外卦)查找对应的八卦
function getTrigram(lines) {
  if (!lines || !Array.isArray(lines) || lines.length !== 3) return null;
  const key = lines.join(",");
  for (const t of trigrams) {
    if (t.lines.join(",") === key) return t;
  }
  return null;
}

module.exports = { trigrams, getTrigram };