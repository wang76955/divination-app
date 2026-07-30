const { hexagrams } = require("../data/hexagrams");
const { trigrams, getTrigram } = require("../data/trigrams");

function findHexagramByLines(lineValues) {
  if (!lineValues || lineValues.length !== 6) return null;
  const key = lineValues.map(v => v === 9 || v === 7 ? 1 : 0).join(",");
  for (const h of hexagrams) {
    if (h.binary.join(",") === key) return h;
  }
  return null;
}

function getTrigramsFromHexagram(hex) {
  if (!hex || !hex.binary || hex.binary.length !== 6) return { lower: null, upper: null };
  const lower = getTrigram(hex.binary.slice(0, 3));
  const upper = getTrigram(hex.binary.slice(3, 6));
  return { lower, upper };
}

const categoryKeywords = {
  career: ["事业", "工作", "创业", "求职", "生意", "职场", "跳槽", "升职", "加薪", "项目", "老板", "同事", "辞职", "投资", "公司", "经营", "发展", "前景", "转行", "副业", "招聘", "入职", "裁员"],
  relationship: ["感情", "婚姻", "恋爱", "复合", "伴侣", "对象", "结婚", "分手", "相亲", "女友", "男友", "老婆", "老公", "离婚", "追求", "表白", "暧昧", "配偶", "夫妻", "姻缘"],
  health: ["健康", "疾病", "身体", "养生", "看病", "手术", "康复", "锻炼", "体检", "病情", "治疗", "医院", "生病", "调理", "中药", "医生"],
  wealth: ["财运", "赚钱", "收入", "理财", "财务", "债务", "股票", "基金", "破产", "盈利", "亏损", "资金", "还债", "攒钱", "投资回报"],
  study: ["学业", "考试", "学习", "考研", "高考", "升学", "留学", "毕业", "论文", "成绩", "面试", "技能", "读书", "考公", "考证"],
  travel: ["出行", "旅行", "迁移", "搬家", "出差", "旅游", "远行", "旅途", "出发", "行程", "自驾", "航班", "签证"],
  social: ["人际", "社交", "合作", "团队", "朋友", "合伙", "沟通", "矛盾", "误会", "信任", "得罪", "关系", "交友", "人脉"],
  legal: ["诉讼", "纠纷", "官司", "法律", "仲裁", "起诉", "辩护", "合同", "协议", "上诉", "律师", "法庭"]
};

function categorizeQuestion(question) {
  if (!question || !question.trim()) return "general";
  const q = question.trim();
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    for (const kw of keywords) {
      if (q.indexOf(kw) >= 0) return cat;
    }
  }
  return "general";
}

const categoryLabels = {
  career: "事业", relationship: "感情", health: "健康", wealth: "财运",
  study: "学业", travel: "出行", social: "人际", legal: "诉讼", general: "综合"
};

const positionMeanings = [
  "初爻代表事物的根基与开始阶段，此爻动提示事情正在萌发，应谨慎起步",
  "二爻代表事物的发展与内在状态，此爻动提示内在正在变化，宜沉着应对",
  "三爻代表事物的关键节点与考验，此爻动提示面临重要选择，需审慎决策",
  "四爻代表事物的进阶与外部环境，此爻动提示进入新阶段，外部因素开始发挥作用",
  "五爻代表事物的核心与鼎盛之位，此爻动提示到达关键位置，决策影响重大",
  "上爻代表事物的终末与转折，此爻动提示事情即将告一段落，需善始善终"
];

const tendencyJudgment = {
  positive: "较为有利", negative: "宜谨慎行事", neutral: "吉凶参半"
};

function generateAdviceBody(hexName, hexModern, hexAdvice, hexLines, hexJudgment, changingLines, futureHex, isPure, category, question) {
  const label = categoryLabels[category] || "综合";
  let text = "";
  const q = question && question.trim() ? question.trim() : "";

  // 1. 针对所问之事的分析
  if (q) {
    text += `您所问的是关于「${label}」方面的事：「${q}」。\n\n`;
  }

  // 2. 卦象对该领域的含义
  text += `【${label}格局分析】\n`;
  text += `卜得「${hexName}」卦，此卦对「${label}」之事：${hexModern}\n\n`;

  // 3. 判断卦辞倾向
  const posWords = ["吉", "亨", "利", "元吉", "贞吉", "大吉", "吉无不利", "有庆", "有喜", "有福", "可贞"];
  const negWords = ["凶", "不利", "悔", "吝", "厉", "贞凶", "终凶", "有凶", "有灾", "有眚", "勿用"];
  let pos = 0, neg = 0;
  posWords.forEach(w => { if (hexJudgment.indexOf(w) >= 0) pos++; });
  negWords.forEach(w => { if (hexJudgment.indexOf(w) >= 0) neg++; });
  const tendency = pos > neg ? "positive" : neg > pos ? "negative" : "neutral";

  // 4. 动爻/静爻针对性分析
  if (!isPure && changingLines.length > 0) {
    const posNames = ["初", "二", "三", "四", "五", "上"];
    text += `【关键变化点】本卦有 ${changingLines.length} 处动爻，提示「${label}」方面正在发生以下变化：\n`;
    changingLines.forEach(cl => {
      const posName = posNames[cl.position - 1];
      const meaning = positionMeanings[cl.position - 1];
      const changeType = cl.value === 6 ? "阴转阳（弱转强）" : "阳转阴（强转弱）";
      text += `▲ ${posName}爻动（${changeType}）：${meaning}。`;
      if (hexLines && hexLines[cl.position - 1]) {
        const rawLine = hexLines[cl.position - 1];
        const brief = rawLine.indexOf("：") >= 0 ? rawLine.substring(rawLine.indexOf("：") + 1) : rawLine;
        text += ` 该爻爻辞提示：「${brief}」。`;
      }
      text += "\n";
    });
    text += "\n";

    if (futureHex) {
      text += `【发展趋势】此事正由「${hexName}」向「${futureHex.name}」演化。变卦「${futureHex.name}」的含义：${futureHex.modernInterpretation}。`;
      text += ` 提示您此事的发展趋向和最终可能的走向。\n\n`;
    }
  } else {
    text += `【当前状态】此卦六爻不动，为静卦。「${label}」之事当前处于相对稳定的状态，未有明显变化之兆。宜以卦辞为鉴，静待时机。\n\n`;
  }

  // 5. 该领域行动指南
  text += `【行动指南】\n`;
  text += `总体来看，此卦对「${label}」之事的影响为「${tendencyJudgment[tendency]}」。\n`;
  text += `? ${hexAdvice}\n`;

  if (tendency === "positive") {
    text += `? 当前契机有利，宜积极把握，顺势推进。但日中则昃、盛极必衰，需防乐极生悲。建议稳扎稳打，步步为营。\n`;
    if (!isPure) text += `? 虽有动爻变化，但总体向好，变化之中藏有机遇。建议灵活应对，顺势调整。\n`;
  } else if (tendency === "negative") {
    text += `? 当前环境偏紧，此事上需多加谨慎。以退为进、以静制动为上策。困难是暂时的，耐心等待转机。\n`;
    if (!isPure) text += `? 动爻显示变化正在发生，虽有不利因素，但变化本身即是转机。注意观察变化方向，及时调整策略。\n`;
  } else {
    text += `? 此事吉凶尚未分明，关键在于您如何应对。保持平常心，做好分内之事，不骄不躁，不卑不亢。\n`;
    if (!isPure) text += `? 动爻提示变化正在酝酿，建议密切关注事态发展，谋定而后动。\n`;
  }

  if (futureHex) {
    text += `? 变卦「${futureHex.name}」是最终趋向，可参考其卦义为长远规划做调整。${futureHex.advice}\n`;
  }

  text += `\n【温馨提示】卜卦旨在明理，而非定命。卦象所示仅为天时与趋势，最终结果仍取决于您的智慧与行动。`;
  return text;
}

function interpret(lines, question) {
  if (!lines || !Array.isArray(lines)) {
    throw new Error("请提供数组格式的爻数据");
  }
  if (lines.length !== 6) {
    throw new Error("需要6条爻的数据");
  }
  const validValues = lines.every(v => [6, 7, 8, 9].indexOf(v) >= 0);
  if (!validValues) {
    throw new Error("爻的值只能为6(老阴)、7(少阳)、8(少阴)、9(老阳)");
  }

  const currentHex = findHexagramByLines(lines);
  if (!currentHex) {
    throw new Error("无法识别卦象");
  }

  const changingLines = [];
  lines.forEach((val, idx) => {
    if (val === 6 || val === 9) {
      changingLines.push({ position: idx + 1, value: val });
    }
  });

  let futureHex = null;
  if (changingLines.length > 0) {
    const futureLines = lines.map(v => {
      if (v === 6) return 7;
      if (v === 9) return 8;
      return v;
    });
    futureHex = findHexagramByLines(futureLines);
  }

  const relevantLines = changingLines.length > 0
    ? changingLines.map(cl => {
        const idx = cl.position - 1;
        return { position: cl.position, value: cl.value, text: currentHex.lines[idx] };
      })
    : [];

  const judgmentLines = changingLines.length === 0
    ? [{ type: "卦辞", text: currentHex.judgment }]
    : relevantLines.map(rl => ({
        type: rl.value === 6 ? "老阴" : "老阳",
        position: rl.position,
        text: rl.text
      }));

  const currentTrigrams = getTrigramsFromHexagram(currentHex);
  let futureTrigrams = null;
  if (futureHex) {
    futureTrigrams = getTrigramsFromHexagram(futureHex);
  }

  const isPure = changingLines.length === 0;
  const category = categorizeQuestion(question);
  const categoryLabel = categoryLabels[category] || "综合";

  // 精简卦象总览
  let analysis = "";
  if (question && question.trim()) {
    analysis += `您所问：「${question.trim()}」\n`;
  }
  analysis += `◆ 起得「${currentHex.name}（${currentHex.pinyin}）」`;
  if (!isPure && futureHex) {
    analysis += `，之「${futureHex.name}（${futureHex.pinyin}）」`;
  }
  analysis += "。";
  if (category !== "general") {
    analysis += ` 此事归属「${categoryLabel}」类。`;
  }
  analysis += `\n\n【本卦概要】${currentHex.modernInterpretation}\n`;
  if (!isPure && changingLines.length > 0) {
    const posNames = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
    const desc = changingLines.map(cl => {
      const yt = cl.value === 6 ? "阴变阳" : "阳变阴";
      return `${posNames[cl.position - 1]}（${yt}）`;
    }).join("，");
    analysis += `\n【动爻】${changingLines.length} 处：${desc}。此事正在变化之中。`;
    if (futureHex) {
      analysis += `\n【变卦】趋向「${futureHex.name}」：${futureHex.modernInterpretation}。`;
    }
  } else {
    analysis += `\n【静卦】六爻不动，局势稳定。`;
  }

  // 生成针对性应对建议
  const personalizedAdvice = generateAdviceBody(
    currentHex.name, currentHex.modernInterpretation, currentHex.advice,
    currentHex.lines, currentHex.judgment,
    changingLines, futureHex, isPure, category, question
  );

  return {
    currentHexagram: {
      id: currentHex.id,
      name: currentHex.name,
      pinyin: currentHex.pinyin,
      judgment: currentHex.judgment,
      image: currentHex.image,
      modernInterpretation: currentHex.modernInterpretation || "",
      advice: currentHex.advice || "",
      lowerTrigram: currentTrigrams.lower,
      upperTrigram: currentTrigrams.upper,
      lines: lines.map((v, i) => ({
        position: i + 1,
        value: v,
        type: v === 6 ? "老阴" : v === 7 ? "少阳" : v === 8 ? "少阴" : "老阳",
        text: currentHex.lines[i],
        isChanging: (v === 6 || v === 9)
      }))
    },
    changingLines,
    judgmentLines,
    futureHexagram: futureHex ? {
      id: futureHex.id,
      name: futureHex.name,
      pinyin: futureHex.pinyin,
      judgment: futureHex.judgment,
      image: futureHex.image,
      modernInterpretation: futureHex.modernInterpretation || "",
      advice: futureHex.advice || "",
      binary: futureHex.binary,
      lowerTrigram: futureTrigrams.lower,
      upperTrigram: futureTrigrams.upper
    } : null,
    isPure,
    category: categoryLabel,
    analysis,
    personalizedAdvice
  };
}

module.exports = { interpret };
