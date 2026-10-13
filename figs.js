// 問題用の図（SVG）
// 問題表示中は h に挙げた語句を「？」で隠し、解答後の解説では全部見せる。h が null の図は解答後だけ表示する。
let HIDE = new Set();
const T = s => HIDE.has(s) ? "？" : s;
const svg = (h, body) => `<svg viewBox="0 0 640 ${h}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#555"/></marker></defs>${body}</svg>`;
const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 16}" text-anchor="${o.anchor || "middle"}" fill="${s === "？" ? "#d9534f" : (o.color || "#222")}" font-weight="${o.bold || s === "？" ? "bold" : "normal"}" ${o.bg ? 'stroke="#fafcf8" stroke-width="5" paint-order="stroke"' : ""}>${s}</text>`;
const box = (x, y, w, h, lines, fill = "#fff", o = {}) => {
  const ls = [].concat(lines);
  const top = y + h / 2 - (ls.length - 1) * 11 + 6;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${o.stroke || "#7a9a6a"}" stroke-width="2" ${o.dash ? 'stroke-dasharray="6 4"' : ""}/>`
    + ls.map((l, i) => txt(x + w / 2, top + i * 22, l, { size: i === 0 ? (o.size || 17) : 13, bold: i === 0, color: i === 0 ? "#222" : "#555" })).join("");
};
const arrow = (x1, y1, x2, y2, label, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555" stroke-width="2" marker-end="url(#ah)" ${o.both ? 'marker-start="url(#ah)"' : ""}/>`
  + (label ? txt(o.lx ?? (x1 + x2) / 2, o.ly ?? (y1 + y2) / 2 - 6, label, { size: 14, bg: true }) : "");

// ---------- 図の定義 ----------
const F = {
  company: (extra) => svg(300,
    box(10, 110, 90, 60, ["株主"], "#fff4e0")
    + arrow(100, 140, 158, 140, "出席")
    + box(160, 95, 120, 90, [T("株主総会"), "基本方針を決定"], "#e8f2e2")
    + arrow(280, 120, 368, 65, "選任・解任", { lx: 318, ly: 80 })
    + arrow(280, 160, 368, 225, "選任・解任", { lx: 318, ly: 215 })
    + box(370, 30, 130, 70, [T("取締役会"), "業務執行を決定"], "#e8f2e2")
    + box(370, 195, 130, 70, [T("監査役"), "業務を監査"], "#f0e8f5")
    + arrow(435, 195, 435, 102, "監査", { lx: 460, ly: 152 })
    + arrow(500, 65, 538, 65, "")
    + box(540, 30, 95, 70, ["代表取締役", "社長など"], "#fff")
    + txt(520, 22, "選定・解職", { size: 13 })
    + `<path d="M220,185 V280 H55 V172" fill="none" stroke="#c0567a" stroke-width="2" marker-end="url(#ah)"/>` + txt(140, 275, "配当", { size: 14, color: "#c0567a", bg: true })
    + (extra ? box(540, 130, 95, 60, [T("社外取締役")], "#fff", { dash: 1, stroke: "#d9534f", size: 14 }) + arrow(540, 150, 502, 90, "監視", { lx: 512, ly: 135 }) : "")),

  kinds: () => svg(250,
    `<rect x="10" y="10" width="620" height="34" fill="#e3eedd"/>`
    + txt(90, 33, "会社の種類", { bold: 1 }) + txt(260, 33, "出資者の責任", { bold: 1 }) + txt(510, 33, "特徴", { bold: 1 })
    + [["株式会社", `${T("有限責任")}（株主）`, "株式を発行して広く資金を集める"],
       [T("合名会社"), T("無限責任社員"), ""],
       [T("合資会社"), `${T("無限責任社員")} と 有限責任社員`, ""],
       [T("合同会社"), "有限責任社員", "内部ルールを自由に決められる"]]
      .map((r, i) => { const y = 44 + i * 40; return `<line x1="10" y1="${y}" x2="630" y2="${y}" stroke="#cfdcc8"/>` + txt(90, y + 26, r[0], { bold: 1 }) + txt(260, y + 26, r[1], { size: 15 }) + txt(510, y + 26, r[2], { size: 13 }); }).join("")
    + txt(320, 228, "無限責任＝会社の借金にすべて責任を負う　有限責任＝出資した分だけ責任を負う", { size: 13, color: "#555" })
    + txt(320, 246, "※2006年施行の会社法で、有限会社は株式会社に統合された", { size: 12, color: "#777" })),

  bs: () => svg(290,
    txt(320, 24, T("バランスシート（貸借対照表）"), { bold: 1, size: 18 })
    + `<rect x="40" y="36" width="280" height="34" fill="#e3eedd"/><rect x="320" y="36" width="280" height="34" fill="#e3eedd"/>`
    + txt(180, 59, `${T("資産")}（資金の運用）`, { bold: 1 }) + txt(460, 59, `${T("負債・純資産")}（資金の集め方）`, { bold: 1 })
    + `<rect x="40" y="70" width="280" height="150" fill="#fdeee6" stroke="#ccc"/><rect x="320" y="70" width="280" height="150" fill="#fdeee6" stroke="#ccc"/><line x1="40" y1="145" x2="600" y2="145" stroke="#bbb" stroke-dasharray="4 3"/>`
    + txt(60, 98, T("流動資産"), { anchor: "start", bold: 1 }) + txt(60, 124, "現金・預金　30億円", { anchor: "start" })
    + txt(60, 173, T("固定資産"), { anchor: "start", bold: 1 }) + txt(60, 199, "土地・建物・機械　70億円", { anchor: "start" })
    + txt(340, 98, T("負債＝他人資本"), { anchor: "start", bold: 1 }) + txt(340, 124, "銀行借入　80億円", { anchor: "start" })
    + txt(340, 173, T("純資産＝自己資本"), { anchor: "start", bold: 1 }) + txt(340, 199, "株主の出資　20億円", { anchor: "start" })
    + txt(180, 244, "総資産　100億円", { bold: 1 }) + txt(460, 244, "総資本　100億円", { bold: 1 })
    + txt(320, 278, T("自己資本比率＝20÷100＝20％"), { color: "#4a7c3a", bold: 1 })),

  profit: () => svg(230,
    `<rect x="40" y="20" width="560" height="44" rx="6" fill="#cfe3c3"/>` + txt(320, 49, "売上高", { bold: 1, size: 18 })
    + `<rect x="40" y="80" width="380" height="60" rx="6" fill="#eee"/>` + txt(230, 104, T("経費"), { bold: 1 })
    + txt(230, 128, `${T("人件費・原材料費")}・${T("減価償却費")}など`, { size: 14 })
    + `<rect x="430" y="80" width="170" height="60" rx="6" fill="#fff4c0"/>` + txt(515, 116, "利潤", { bold: 1, size: 18 })
    + arrow(470, 140, 420, 170, "") + arrow(560, 140, 590, 170, "")
    + box(330, 172, 160, 50, [T("配当"), "株主に分配"], "#fff")
    + box(500, 172, 135, 50, [T("内部留保"), "将来のため蓄積"], "#fff")),

  capital: () => svg(190,
    box(10, 70, 120, 50, ["企業の資金"], "#fff4e0")
    + arrow(130, 85, 228, 45, "") + arrow(130, 105, 228, 145, "")
    + box(230, 15, 190, 60, ["株式の発行"], "#fff") + arrow(420, 45, 458, 45, "")
    + box(460, 15, 175, 60, [T("自己資本"), "返済の義務なし"], "#e8f2e2")
    + box(230, 115, 190, 60, ["社債・借入れ", "金融機関などから"], "#fff") + arrow(420, 145, 458, 145, "")
    + box(460, 115, 175, 60, [T("他人資本"), "返済の義務あり（負債）"], "#fbe3e2")),

  stake: () => svg(320,
    txt(320, 22, T("ステークホルダー（利害関係者）"), { bold: 1, size: 18 })
    + box(265, 140, 110, 50, ["企業"], "#cfe3c3")
    + [[20, 40, "株主", "金銭的収益（配当・株価）"], [240, 40, "金融機関", "融資への利子・円滑な返済"], [460, 40, "従業員", "給与・やりがい"],
       [20, 140, "取引先", "仕事・代金"], [445, 140, "顧客", "高品質な商品・サービス"],
       [130, 245, "行政・公共機関", ""], [350, 245, "地域社会", "NPO・環境への配慮など"]]
      .map(([x, y, n, s]) => {
        const [sx, sy] = y === 140 ? [x < 320 ? x + 175 : x, 169] : [x + 87, y < 140 ? 98 : 245];
        const ex = sx < 265 ? 263 : sx > 375 ? 377 : sx, ey = y === 140 ? 165 : y < 140 ? 138 : 192;
        return box(x, y, 175, 58, [n, s], "#fff") + arrow(sx, sy, ex, ey, "", { both: 1 });
      }).join("")),

  own: () => svg(230,
    txt(320, 24, T("所有（資本）と経営の分離"), { bold: 1, size: 18 })
    + box(30, 70, 170, 80, ["株主", "資本の所有者"], "#fff4e0")
    + box(440, 70, 170, 80, ["経営者", "会社の実権をにぎる"], "#e8f2e2")
    + arrow(200, 95, 438, 95, `${T("コーポレート・ガバナンス")}（監督）`)
    + arrow(440, 130, 202, 130, `${T("ディスクロージャー")}（情報開示）`, { ly: 152 })
    + txt(320, 205, "社外取締役・社外監査役で経営をチェックする会社も増えている", { size: 13, color: "#555" })),

  holding: () => svg(200,
    box(240, 15, 160, 55, [T("持株会社"), "株式を保有して支配"], "#cfe3c3")
    + ["A社", "B社", "C社"].map((n, i) => arrow(320, 70, 110 + i * 210, 128, "") + box(50 + i * 210, 130, 120, 50, [n], "#fff")).join("")),

  icons: (items, title) => svg(210,
    (title ? txt(320, 26, title, { bold: 1, size: 18 }) : "")
    + items.map(([emo, name, desc], i, a) => {
      const w = 600 / a.length, x = 20 + i * w;
      return `<rect x="${x + 6}" y="42" width="${w - 12}" height="155" rx="12" fill="#fff" stroke="#cfdcc8" stroke-width="2"/>`
        + txt(x + w / 2, 100, emo, { size: 40 }) + txt(x + w / 2, 140, name, { bold: 1, size: 17 }) + txt(x + w / 2, 170, desc, { size: 13, color: "#555" });
    }).join("")),

  // 需要・供給曲線
  sd: ({ shift, steep } = {}) => {
    const D = steep ? [[150, 30], [200, 270]] : [[70, 40], [310, 260]];
    const S = [[70, 260], [310, 40]];
    const mv = (l, dx) => l.map(([x, y]) => [x + dx, y]);
    const X = (a, b) => { const [[x1, y1], [x2, y2]] = a, [[x3, y3], [x4, y4]] = b; const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4); const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d; return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]; };
    const line = (l, c, dash) => `<line clip-path="url(#gc)" x1="${l[0][0]}" y1="${l[0][1]}" x2="${l[1][0]}" y2="${l[1][1]}" stroke="${c}" stroke-width="3" ${dash ? 'stroke-dasharray="7 5"' : ""}/>`;
    const guide = ([x, y], lab, c) => `<path d="M50,${y} H${x} V280" fill="none" stroke="${c}" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="5" fill="${c}"/>` + txt(44, y + 5, lab, { size: 13, anchor: "end", color: c });
    const E = X(D, S);
    let body = `<clipPath id="gc"><rect x="52" y="15" width="290" height="263"/></clipPath><line x1="50" y1="280" x2="340" y2="280" stroke="#333" stroke-width="2" marker-end="url(#ah)"/><line x1="50" y1="280" x2="50" y2="15" stroke="#333" stroke-width="2" marker-end="url(#ah)"/>`
      + txt(340, 300, "数量", { size: 13 }) + txt(30, 20, "価格", { size: 13 })
      + line(D, "#d9534f") + line(S, "#3b6fd1") + guide(E, "P", "#333")
      + txt(D[1][0] + 4, D[1][1] - 8, "需要曲線", { size: 13, color: "#d9534f", anchor: "start" }) + txt(S[1][0] - 8, S[1][1] - 4, "供給曲線", { size: 13, color: "#3b6fd1", anchor: "end" });
    let note = [`交点 E で決まる価格 ＝ ${T("均衡価格")}`];
    if (shift) {
      const dx = shift.endsWith("+") ? 60 : -60, isS = shift[0] === "S";
      const L2 = mv(isS ? S : D, dx), E2 = isS ? X(D, L2) : X(S, L2);
      body += line(L2, isS ? "#3b6fd1" : "#d9534f", 1) + arrow(isS ? 200 : 140, isS ? 120 : 110, (isS ? 200 : 140) + dx * 0.8, isS ? 120 : 110, "")
        + guide(E2, E2[1] < E[1] ? "P₁" : "P₂", "#e08a00");
      note = [`${isS ? "供給" : "需要"}曲線が${dx > 0 ? "右" : "左"}へ移動`, `→ 価格は ${E2[1] < E[1] ? "上がる ↑" : "下がる ↓"}`, `→ 取引量は ${E2[0] > E[0] ? "増える ↑" : "減る ↓"}`];
    }
    if (steep) note.push("需要曲線が立っている", "＝価格弾力性が小さい", "（生活必需品など）");
    return svg(310, body + txt(E[0] + 10, E[1] - 8, "E", { size: 14, bold: 1, anchor: "start" })
      + note.map((n, i) => txt(370, 80 + i * 30, n, { anchor: "start", size: 16, bold: i === 0 })).join(""));
  },

  flow: () => svg(300,
    box(250, 10, 140, 55, ["政府（財政）"], "#e8eef8")
    + box(20, 210, 140, 60, ["企業（生産）"], "#fff4e0") + box(480, 210, 140, 60, ["家計（消費）"], "#e8f2e2")
    + arrow(478, 222, 162, 222, T("労働力・資本・土地"), { ly: 216 })
    + arrow(162, 258, 478, 258, "賃金・利子・地代", { ly: 252 })
    + arrow(90, 208, 250, 50, "租税", { lx: 150, ly: 120 }) + arrow(550, 208, 390, 50, "租税", { lx: 490, ly: 120 })
    + arrow(270, 65, 130, 205, "公共サービス", { lx: 230, ly: 140 }) + arrow(370, 65, 510, 205, "公共サービス", { lx: 410, ly: 140 })
    + txt(320, 292, "企業→家計：財・サービス　／　家計→企業：代金", { size: 13, color: "#555" })),
};

const MECENAT = () => F.icons([["🎨🎻", T("メセナ"), "芸術・文化への支援活動"], ["🤝🏫", T("フィランソロピー"), "社会的貢献活動"]]);
const ESG = () => F.icons([["🌍", "E", "Environment（環境）"], ["👷", "S", "Social（社会）"], ["⚖️", "G", T("Governance（企業統治）")]], T("ESG投資"));

// [問題文に含まれる語句, 図, 問題中に隠す語句（null＝解答後のみ表示）]
const FIGMAP = [
  // 3 現代の企業
  ["会社事業の基本方針を決定し", () => F.company(), ["株主総会"]],
  ["会社業務の執行を決定し責任", () => F.company(), ["取締役会"]],
  ["取締役の業務を監査・調査", () => F.company(), ["監査役"]],
  ["本来、取締役会は代表取締役を監視", () => F.company(true), ["社外取締役"]],
  ["株式会社の株主がもつ権利", () => F.company(), null],
  ["会社法に定められた会社の四つの種類", F.kinds, null],
  ["新たに創設された、有限責任社員", F.kinds, ["合同会社"]],
  ["会社の債務に全責任を負う出資者", F.kinds, ["無限責任社員"]],
  ["無限責任社員だけからなる会社", F.kinds, ["合名会社", "合資会社"]],
  ["無限責任社員と有限責任社員からなる会社", F.kinds, ["合名会社", "合資会社"]],
  ["最大でも出資した分だけを負担", F.kinds, null],
  ["社債を発行したり金融機関から借り入れ", F.capital, ["自己資本", "他人資本"]],
  ["株式の発行によって集めた資金", F.capital, ["自己資本", "他人資本"]],
  ["企業の売上高から何を差し引いた", F.profit, ["経費", "人件費・原材料費", "減価償却費"]],
  ["耐用年数が過ぎれば更新", F.profit, ["減価償却費"]],
  ["株主に分配されるものを", F.profit, ["配当", "内部留保"]],
  ["資本の所有者ではない経営者", F.own, ["所有（資本）と経営の分離"]],
  ["経営者を監督することを何というか", F.own, ["コーポレート・ガバナンス", "ディスクロージャー"]],
  ["企業情報の開示", F.own, ["コーポレート・ガバナンス", "ディスクロージャー"]],
  ["株主のことを英語で", F.stake, null],
  ["企業の利害関係者を何というか", F.stake, ["ステークホルダー（利害関係者）"]],
  ["株主が企業に期待するもの", F.stake, null],
  ["業務の一部を外部に委託", () => F.icons([["🏢", "自社", "業務の一部を…"], ["➡️", T("アウトソーシング"), "外部委託でコスト削減"], ["🏭", "外部の会社", "…委託する"]]), ["アウトソーシング"]],
  ["企業の合併・買収", () => F.icons([["🏢＋🏢", "合併", "2つの会社が1つになる"], ["🏢→💰", "買収", "他社の株式を買い取る"]], T("M&A")), ["M&A"]],
  ["他の会社の株式を保有する会社", F.holding, ["持株会社"]],
  ["多くの産業部門に活動を広げる", () => F.icons([["🏭🍔🏨🎬", T("コングロマリット"), "いろいろな業種に進出"], ["🌏", "多国籍企業", "複数の国にまたがる"]]), ["コングロマリット"]],
  ["活動が複数の国にまたがる", () => F.icons([["🏭🍔🏨🎬", "コングロマリット", "いろいろな業種に進出"], ["🌏", T("多国籍企業"), "複数の国にまたがる"]]), ["多国籍企業"]],
  ["芸術・文化への支援活動", MECENAT, ["メセナ", "フィランソロピー"]],
  ["生活向上のための社会的貢献活動", MECENAT, ["メセナ", "フィランソロピー"]],
  ["企業統治の問題に、その企業が適切に", ESG, ["ESG投資"]],
  ["ESG投資の「G」", ESG, ["Governance（企業統治）"]],
  ["事業資金をどのように集め", F.bs, ["バランスシート（貸借対照表）"]],
  ["右側（総資本）に記載", F.bs, null],
  ["左側（総資産）に記載", F.bs, null],
  ["自己資本比率は何％か", F.bs, ["自己資本比率＝20÷100＝20％"]],
  ["銀行からの借入れは、バランスシート", F.bs, ["負債＝他人資本", "純資産＝自己資本"]],
  ["自己資本比率が高いことは", F.bs, []],
  ["土地・建物・機械（70億円）", F.bs, ["流動資産", "固定資産"]],
  // 2 市場のしくみ
  ["交点で決まる価格", () => F.sd(), ["均衡価格"]],
  ["需要曲線と供給曲線の形", () => F.sd(), null],
  ["技術革新で生産コストが下がる", () => F.sd({ shift: "S+" }), null],
  ["所得の増大などによって需要が増える", () => F.sd({ shift: "D+" }), null],
  ["原料価格が高騰した場合", () => F.sd({ shift: "S-" }), null],
  ["好みが弱まった場合", () => F.sd({ shift: "D-" }), null],
  ["ある商品の価格が上がり、取引量は減った", () => F.sd({ shift: "S-" }), null],
  ["生活必需品の需要の価格弾力性", () => F.sd({ steep: true }), null],
  ["天候不順で野菜が不作", () => F.sd({ steep: true, shift: "S-" }), null],
  ["家計が企業に提供するもの", F.flow, ["労働力・資本・土地"]],
  ["三つの経済主体の組み合わせ", F.flow, null],
];

function figHTML(item, inQuestion) {
  const f = FIGMAP.find(([m]) => item.q.includes(m));
  if (!f || (inQuestion && f[2] === null)) return "";
  HIDE = new Set(inQuestion ? f[2] : []);
  const out = f[1]();
  HIDE = new Set();
  return `<div class="fig">${out}</div>`;
}
