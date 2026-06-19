# 05 · 控件规格（Components）

> 本文件是 md2red 所有控件的「规格事实来源」（规则）；**CSS 事实来源**是代码：皮肤在 `templates/card-base.css`，组件在 `templates/components.css`。
> 重梳后（2026-06-19）采用**三层正交**：皮肤 SKIN（颜色/字号 band）× 组件 COMPONENTS（内容结构）× DECK（语义组合）。
> 活预览：`templates/components-gallery.html`（全部组件 × 三主题）。配色 token 见 `02-palettes.md`；怎么拼装见 `04-layouts.md`；变体路由见 `04-templates.md`。

---

## 1. 画布与预览

| Token | 值 | 说明 |
| --- | --- | --- |
| `--canvas-w` | `1080px` | 小红书 3:4 出图宽 |
| `--canvas-h` | `1440px` | 出图高（1080×1440 = 3:4）|
| `--margin` | `88px` | 卡片内边距（`.pad`）|
| `--hair-w` | `2px` | 所有分隔线宽度 |
| `--s` | `0.42` | 预览缩放比（`.frame` 用，导出时不参与）|

- 真实卡片永远是 `1080×1440`。预览靠 `.frame` 把 `.canvas` `transform:scale(var(--s))` 缩小排列，**不影响导出尺寸**。
- 导出尺寸由 `index.html` 的 print CSS 锁定（`@page{size:1080px 1440px}`）。

---

## 2. 字号刻度（结构 token，配色无关）

| 角色 | Token | 值 | 典型字重 | 用在 |
| --- | --- | --- | --- | --- |
| 页眉编号 | `--t-eyebrow` | `25px` | 600 | `.h-left` |
| 导语/要点 | `--t-lead` | `36px` | 300 | `.cover .sub` / 各组件 `.lead` / `.close .cta` |
| 正文 | `--t-body` | `30px` | 400 | 通用正文 |
| 数据数字 | `--t-num` | `150px` | `--big-weight` | `.stat .num` |
| 注解/品牌脚 | `--t-cap` | `26px` | 500 | `.cap` / `.topic` / `.brandfoot` |
| 出处/次要 | `--t-source` | `22px` | — | `.src` / `.h-right` / `.data .src-line` |
| （预留） | `--t-display` `--t-h1` `--t-index` | 104 / 60 / 128 | — | 现不直接用；组件各自写标题字号 |

> 多数组件的标题/序号字号直接写在 `components.css` 里（如 `.cover .title` 128 / `.data .topline h2` 56 / `.close .h` 54 / `.finding .mega` 300）——它们是视觉锚点，不走通用刻度。

### 字重规则（硬规则）
- **大字越大越细**：封面主标 `font-weight:250`（三主题一致）；各组件大数字（`.stat .num` / `.ledger .idx` / `.finding .mega`）用 `--big-weight`。
- `--big-weight`：B/D = `250`，**C = `600`**（霓虹渐变需要更实的字形托住描边）。
- 最小可读：`22px` 是底线，任何文字不得再小。塞不下就删内容，不缩字号。

---

## 3. 间距刻度

| Token | 值 | 典型用途 |
| --- | --- | --- |
| `--s1` | `8px` | 最紧凑间隙 |
| `--s2` | `16px` | `.stat` 内部 gap |
| `--s3` | `24px` | 页眉下内距、分隔线上内距 |
| `--s4` | `32px` | 标题与正文之间 |
| `--s5` | `48px` | 区块大间隔（最常用）|
| `--s6`/`--s7`/`--s8` | 64/96/120 | — |

只用这些 token，不要写裸 px，否则多张卡间距会飘。

---

## 4. 字体栈

| Token / 用途 | 栈 |
| --- | --- |
| 正文（body）| `"Helvetica Neue","PingFang SC",-apple-system,"Segoe UI","Noto Sans SC",Arial,sans-serif` |
| `--font-mono` | `ui-monospace,"SF Mono","JetBrains Mono","Roboto Mono",Menlo,Consolas,monospace` |

等宽栈用于：封面主标里的数字 `.cover .title .d`、各组件的 mono 序号/来源行（`.ledger .idx` / `.data .topline .idx` / `.step .snum` / `.finding .src-line`）。其余正文用主字体栈。

---

## 5. 控件目录

### 5.1 皮肤层（card-base.css）

| 控件 | 作用 | 关键样式 |
| --- | --- | --- |
| `.canvas` | 一张卡的实体（1080×1440）| `background:var(--c-card)`；`flex column`；`overflow:hidden` |
| `.pad` | 卡内容区 | `padding:var(--margin)`；`flex:1` |
| `.header` | 页眉 | `space-between` + 底部 2px 线；`.h-left`（25/600/大写/anchor-ink）+ `.h-right`（22/ink-3，可嵌 `.dots`）|
| `.dots i` / `i.on` | 进度点 | 10px 灰点；`on` 变 30px 方条 + dot-on 色 |
| `.brandfoot` | 品牌脚 | `margin-top:auto` 钉底（禁 absolute），右对齐，26/500，固定 `@津玉不良言` |
| `.frame`/`.label`/`.gallery`/`.toolbar`/`.switch`/`.spacer` | 预览脚手架 | 仅 demo，导出不需 |

> 真正出图只需要 `.canvas`（含其内部）。

### 5.2 封面 `cover`（components.css）

| 子控件 | 样式 | 说明 |
| --- | --- | --- |
| `.topic` | `26px / ink-2` | 话题标签 |
| `.title` | `128px / 250 / lh 1.24` | 主标，三主题同字重 |
| `.title .d` | `mono / 1.8em / 400 / anchor` | 主标里的数字 |
| `.sub` | `36px / 300 / 顶 2px 线 / max-w 760` | 导语 |
| `.content` | `flex column / justify flex-end` | 文字沉下半部 |
| `.aura` / `.ghost` | 默认 `display:none` | **仅 C 主题**显示（§6）|

### 5.3 数据块 `.stat`（共享基元，被 `data` 复用）

| 子控件 | 样式 |
| --- | --- |
| `.stat` | `bg card-2 / padding s5 s5 s4` |
| `.num` | `150 / big-weight / baseline` |
| `.num em` | `46 / 500 / anchor / 正体`（单位/百分号）|
| `.cap` | `26 / ink-2` |
| `.src` | `22 / ink-3`，未核标「示例数据·待核」|

### 5.4 八个内容组件（components.css）

#### `ledger` 重型账本
`.lead`（导语）· `.rows > .row`（min-h 150 / 上下 2px 线）· `.idx`（mono 80 / big-weight / anchor）· `.col`· `.lbl`（40/500）· `.csq`（28/300，`b` = anchor-ink）。

#### `check` 轻型清单
`.lead` · `.rows > .row`（上下 hair-2 线）· `.mk`（34 / anchor / 600）· `.col`· `.txt`（38/400）· `.why`（26/300/ink-3）。

#### `data` 数据条目 File Card
`.topline`（`.idx` mono 36 anchor + `h2` 56/500 同行）· `.lead`（36/300）· `.stat`（§5.3，全页唯一焦点）· `.how`（`b` 标签 + tip）· `.pull`（无数字时用，50/300，左 4px anchor 边）· `.src-line`（22）。

#### `step` 步骤/流程
`.lead` · `.list > .item`（带连接竖线表先后）· `.snum`（圆形 80 / 描边 anchor / mono 38）· `.col`· `.act`（44/500）· `.res`（28/300，`b` = anchor-ink）。

#### `finding` 单点强论（+ 配套 `doing`）
`.center`（居中）· `.quote`（80/300，`b` = anchor-ink）或 `.mega`（300 / big-weight，`em` 64 anchor）· `.cap`（36/300）· `.srcwrap` + `.src-line`（mono 22）。配套 `.doing`：`h2`（60/500）+ `.row`（`.mk` mono / `.txt` 40 / `.why` 26）。

#### `matrix` 对比矩阵（+ 配套 `pick`）
`.lead` · `.grid`（CSS grid：`170px repeat(3,1fr)`）· `.corner` / `.colhead`（30/600/anchor-ink）/ `.rowhead`（24/500）/ `.cell`（25/300）。配套 `.pick`：`h2` + `.row`（`.tag` 30/600 / `.desc` 30/300）。

#### `close` 收尾（旧 `.end`）
`.h`（54 / 250）· `.recap > .it`（32/400，上下 hair-2 线）· `.recap .n`（26/600/anchor/w46）· `.cta`（36/300，`b` = anchor-ink）。

---

## 6. 主题差异（只列与 §5 不同处）

配色 token 全表见 `02-palettes.md`。组件层差异都在 `components.css` 末尾的主题覆盖区：

### B · 清新薄荷（`theme-mint`，默认）
- `.stat .num em`：字重降 `400`、用深蓝 `--c-anchor-ink`。无数据条边框、无封面光效。

### D · 美拉德×莫兰迪（`theme-maillard`）
- `.stat`：左侧 `4px` 鼠尾草色边框（`--c-anchor-2`）。其余同 B。

### C · 酸性霓虹（`theme-acid`，唯一戏剧化主题）
- 封面 `.canvas.cover` 用深底 `--c-page`；`.aura` + `.ghost` 显示；`.cover .title .d` 渐变描字。
- 渐变描字（`--grad`）应用到：`.stat .num` / `.ledger .idx` / `.check .mk` / `.finding .mega` / `.matrix .colhead` / `.close .recap .n` / `.close .cta b`。
- 霓虹重点色（`--c-anchor-2` 青）：`.stat .num em` / `.ledger .csq b` / `.step .res b` / `.finding .quote b` / `.pick .tag`。
- `.stat` 左侧 `4px` 品红边框（`--c-neon-2`）；`.data .pull` 左边线同色；`.step .snum` 描边 neon-2。

---

## 7. 硬规则（违反基本都是错的）

1. 卡片永远 `1080×1440`，内容用 `flex` 撑满，**禁止 `vw/vh`**。
2. 封面主标 `.cover .title` 字重恒为 `250`，三主题不变。
3. 大数字（`.stat .num` / `.ledger .idx` / `.finding .mega`）走 `--big-weight`，不单独写死字重。
4. 分隔线一律 `2px`（`--hair-w`）。
5. 间距只用 `--s1..s8`，不写裸 px。
6. 品牌脚靠 `margin-top:auto` 钉底，**禁止 `position:absolute`**。
7. 一张 `data` 页最多一个 `.stat`。
8. 文字最小 `22px`，塞不下先删内容，不缩字号。
9. 光晕/幽灵数字/渐变描字是 **C 主题专属**，B/D 不得使用。
10. 不编造数据，未核一律标「示例数据·待核」。
11. **组件与皮肤正交**：新增/调试的组件落到 `components.css`（不填进 card-base.css、也不散在各 deck 内联）；deck 只放本篇专属微调。
