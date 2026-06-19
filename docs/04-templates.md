# 04 · 模版库（按内容形态 + 语义组合）

> 核心原则（用户 2026-06-18 补充）：
> 1. 模版按**内容形态**归类，与题材无关（guizang「风格与内容解耦」）。
> 2. **同一形态不是一个死模版**——哪怕都是数字标题 + 条目内容，表达的内容、受众、细节决定正文版式有不同变体。
> 3. 生成时 AI 按**语义**判断，挑出最合适的 **封面 + 正文 + 尾页 组合**。
>
> HE / WL / MB 只是喂进系统的语料；同一模版可承接任意品类，只要内容形态匹配。

> **调整必须落规则（用户 2026-06-19 补充）**：凡是调试过、确认可用的形态 / 版式，必须写进本文件 + 落为 `templates/` 里的可复用模版文件，让以后一千次一万次生成都照调整后的来，**不靠任何一次会话的记忆**。

## 1. 形态 → 候选变体（1:N，不是 1:1）

路由不输出「一个模版」，而是输出**候选变体族 + 选择依据**，由 AI 按语义挑。

### 编号清单体（主力）→ 变体族

| 变体 | 用在什么内容 | 触发信号 | 源 recipe | 模版文件 |
| --- | --- | --- | --- | --- |
| **L-LEDGER 重型账本** | 原因 / 雷区 / 代价，每条带后果 | 条目 ≤6 且每条有「后果/代价」 | M08 | `L-LEDGER.html` |
| **L-CHECK 轻型清单** | 法则 / 习惯 / 技巧，可执行 | 每条是 do/don't，无重后果，可较多条 | M05 | `L-CHECK.html` |
| **L-DATA 数据条目** | 每条带数字 / 研究数据 | 条目自带 stat | S09 / S11 | `L-DATA.html` ✅ |
| **L-LONG 长清单分屏** | N 很大，一屏放不下 | 条目 >6~7 | M05 压缩 + 分屏 | 待建 |
| **L-STACK 堆叠+符号** | 标签 + 子句 + 标记 | 条目 = label + sub | S11 | 待建 |

### 其他形态（各自展开变体）

| 形态 | 模版/族 | 源 recipe | 模版文件 |
| --- | --- | --- | --- |
| 步骤/流程体 | T-STEP（线性编号阶梯 / 前后对比） | M14 / M15 | `T-STEP.html` ✅ |
| 单点强论体 | T-FINDING（大金句 / 大数字 KPI） | M04 / KPI | `T-FINDING.html` ✅ |
| 对比/测评体 | T-MATRIX（对照矩阵 / 打分表） | S12 / S10 | `T-MATRIX.html` ✅ |

## 2. 选择依据（AI 语义判断的输入）

挑变体不看题材，看这些语义信号：

- **条目数 N**：≤6 单屏 ledger；>6~7 → 分屏 L-LONG 或压缩 L-CHECK
- **每条是否带后果/代价**：有 → 重型 L-LEDGER；无（纯可执行）→ 轻型 L-CHECK
- **每条是否带数字/数据**：有 → L-DATA
- **是否有先后顺序**：有 → 其实是步骤形态 T-STEP
- **受众语气**：反共识 / 警示 → 深色 + 重字重；种草 / 轻松 → 浅色 + 轻字重
- **是否横向对比**：有 → 对比形态 T-MATRIX
- **是否单点结论撑全篇**：有（一个研究/一个秘诀）→ 单点强论 T-FINDING

## 3. Deck = 语义组合（封面 + 正文 + 尾页）

生成不是套一个固定模版，而是 AI 按语义**拼一套**：

- **封面变体**：期号封面 / 金句封面 / 大数字封面 / 主图封面
- **正文变体**：从命中形态的变体族里挑 1+ 个，**可混用**（例：重型 ledger 正文 + 一张数据 finding）
- **尾页变体**：小结账本 / 金句收尾 / CTA 收尾 / 署名收尾

组合由内容语义 + 受众决定，**不写死**。同一篇换个受众或侧重点，组合可以不同。

> **期号封面·标准结构（已锁定 · 2026-06-19）**：
> `.cover > .aura + .ghost + .pad(.header[h-left 编号·栏目 / h-right 「向右滑 →」] + .content[.topic 栏目线 / .title 主标题（含 .d 大数字）/ .sub 一句导语] + .brandfoot @署名)`。
> 一旦某篇封面被用户确认，后续生成**逐字复用该结构与文案**，不得凭记忆改写标题/副文/页眉（冻结基准见 docs/07 §G）。

## 4. 正文模版规格（字段：id / name / from / role / slots / density / skin）

### L-LEDGER · 重型账本（from M08）
- **slots**：header（章号 + 小节标题）→ 4-6 条全宽行，每行 = 左 index（大数字/序号）+ 右（标签 + 后果/代价 sub-line）
- **density**：每行 118-170px；≥4 行；不能只占中间三分之一；整页 ≥75% 吃满；禁 `flex:1` / `.spacer`，脚靠 `margin-top:auto`
- **skin**：蓝色大数字 + 点阵 dots + hairline 分隔

### L-CHECK · 轻型清单（from M05）
- **slots**：header → 4-8 条，每条 = 勾选/序号 + 可执行项（+ 可选一句说明）
- **density**：避免圆角卡片堆叠，用行 + 分隔线；≥75% 吃满
- **skin**：card-base 浅色主题（mint / maillard），轻字重

### L-DATA · 数据条目（from S09/S11 · 数字主导 File Card） ✅ 已实现
- **canonical 实现**：`templates/L-DATA.html`（链 card-base + 自带 .topline/.lead/.how/.pull/.src-line 结构样式）。已跟通的成品实例：`decks/he-0001/`。
- **slots（每条目成页）**：
  - `.topline` = 小序号（idx，mono 36px）+ 标题（h2 56px）**同行**（标题 = C 提炼出的「动词+对象」，无数字）
  - `.lead` = 一句承上启下（lead 36，ink-2）
  - `.stat` = 大数字 num（全页唯一焦点）+ em 单位 + cap（机制/为什么有效）+ src（来源）
  - `.how` = 「怎么做」标签 + 原文 actionable tip（用真字段补下方留白，不用 spacer）
- **混用**：某条无真实数字 → 改走文字主导页：`.topline` + `.lead` + `.pull`（M04 金句，50px，左 4px anchor 边）+ `.how` + `.src-line`
- **density**：≥75% 吃满；留白只能用真字段（机制/做法/来源）补；禁 spacer / flex:1；一页一焦点（序号小、数字大）
- **skin**：card-base 三主题（mint/acid/maillard）；acid 下 .pull 左边线用 neon-2

### T-STEP · 步骤/流程（from M14） ✅ 已落地（首版·待验收）
- **canonical 实现**：`templates/T-STEP.html`（链 card-base + 自带 .flow/.step/.snum 结构样式）。演示语料：HE-0009《4 步戒掉重盐口味》。
- **slots**：header（编号·栏目 + .dots）→ `.flow .lead` 一句承上 → `.flow .steps` 内 3-5 个 `.step`，每步 = `.snum`（圆形序号，左侧带连接竖线表先后）+ `.col`（`.act` 动作标题 + `.res` 结果说明）。
- **density**：≥3 步；每步必带结果说明，不能只剩动词；整页 ≥75% 吃满；禁 spacer / flex:1，脚靠 margin-top:auto。
- **与编号清单体的边界**：清单可乱序、步骤不可。命中「有先后顺序」信号才走 T-STEP。
- **skin**：card-base 三主题；acid 下 snum 描边用 neon-2、序号霓虹色。

### T-FINDING · 单点强论（from M04 / KPI） ✅ 已落地（首版·待验收）
- **canonical 实现**：`templates/T-FINDING.html`。演示语料：WL-0008《减肥的头号秘诀》。
- **slots（finding 页）**：header 顶 kicker（锚点 1）→ `.finding .center` 居中放 **大金句 `.quote`** 或 **大数字 `.mega` + em 单位 + `.cap` 机制**（全页唯一焦点）→ `.finding .srcwrap` hairline（锚点 2）+ `.src-line` 来源（mono 22px，锚点 3）。
- **混用**：finding 页之外补一页可执行 `.doing`（动词清单 + 一句为什么），给尾页 recap 提供 grounded 素材。
- **density**：**唯一允许 ≤60% 留白的形态**，但三锚点（顶 kicker + hairline + 来源行）必须齐全；每套 deck ≤1-2 张 finding 页。
- **skin**：card-base 三主题；acid 下金句重点词 / 大数字走渐变描字。

### T-MATRIX · 对比/测评（from S12 / S10） ✅ 已落地（首版·待验收）
- **canonical 实现**：`templates/T-MATRIX.html`。演示语料：HE-0010《BMI vs 体脂率 vs 腰臀比》。
- **slots**：header → `.matrix .lead` → `.matrix .grid`（CSS grid：1 行标题列 + 3 指标列；首行 `.colhead` 指标名，左列 `.rowhead` 维度：测什么 / 怎么测 / 看什么 / 局限，交叉 `.cell` 填对照内容）；再补一页 `.pick` 给「怎么选」结论。
- **density**：cell 字号 ≥24（cell title band）；短语为主，避免横向挤爆；hairline 分隔，不靠卡片堆叠。
- **禁**：异质单位（分钟 / 倍 / %）塞进同一张图表伪造可比性（见 docs/07 §E）。matrix 只做「维度对照」，不做跨指标打分塔。
- **skin**：card-base 三主题；acid 下 colhead 走渐变。

### T-CLOSE · 收尾（from M07）
- **slots**：标题（≤2 行，**字号 ≤ 正文 h2 量级 / 约 54px，不做超大标题**）→ 4-6 条 grounded recap（逐条对应正文，标题 + 一句后果/原因）→ **一个**收尾块（金句/CTA/旁注，三选一，一句行动话即可）
- **署名**：只在每页页脚 `.brandfoot` 出现一次；**收尾块不再放署名块**（否则一页两处署名）
- **density**：禁「3 句短话收尾」= FAIL；禁销售腔

## 5. 字号 / 密度下限（照搬 components，禁缩字）

- 最小可读：body 28 / lead 30 / caption·kicker 20 / cell title 24 / 数字注解 22
- 中文标题字数 band：1 行 ≤6 字 → 132 / 7-10 字 → 108 / 2 行 ≤8 字 → 96 / 2 行 9-12 字 → 84 / 3 行 → 72
- 任何段 >216px = FAIL；不够吃满就加料或换变体，不靠留白

## 6. 示例输入（仅作语料，演示同形态走不同变体）

| 走向变体 | 示例文章 | 为什么 |
| --- | --- | --- |
| L-DATA 数字主导 | HE-0001 6个晨间仪式 | 每条带研究数据（晨光/早起/燕麦…），走数字主导 File Card |
| L-LEDGER 重型 | WL-0001 越减越胖5大原因 / WL-0007 便当雷区 | 每条是「原因/代价」，带后果 |
| L-CHECK 轻型 | WL-0002 甜品生存法则 | 每条是可执行习惯/法则，无重后果、无研究数据 |
| L-LONG 长清单 | HE-0003 11种治愈坏心情的食物 | N=11，需分屏压缩 |
| T-STEP | HE-0009 4步戒盐瘾 / MB-0002 晨练流程 | 有先后顺序 |
| T-FINDING | WL-0008 减肥头号秘诀 / MB-0004 走路的意外副作用 | 单点结论撑全篇 |
| T-MATRIX | HE-0010 BMI vs 体脂率 vs 腰臀比 | 多项横向对比 |

> 同为「编号清单体」，HE-0001 走 L-DATA 数字主导（每条带研究数据）、WL-0001 走 L-LEDGER 重型（每条带后果）、WL-0002 走 L-CHECK 轻型（纯可执行）——这就是「不固定死模版」。

## 7. 跑通顺序

1. 已实现 **L-DATA**（HE-0001 跟通并冻结为模版）；**L-LEDGER + L-CHECK** 骨架已备（证明「同形态多版式」）
2. 写选择依据 rubric → 拿 **HE-0001**（每条带研究数据 → L-DATA 数字主导 File Card + 期号封面 + M07 小结尾页）走语义判断跟通 Extract → Classify → Route → Fill → Render
3. 再拿 **WL-0001**（原因/后果 → L-LEDGER 重型）走一遍，对比体现同形态不同版式
4. 逐步补 T-STEP / T-FINDING / T-MATRIX 及各自变体
5. **接替轮（2026-06-19）**：一次补齐 **T-STEP / T-FINDING / T-MATRIX** 三形态首版变体（HE-0009 / WL-0008 / HE-0010 各跑一篇占位 deck），落为 `templates/` 文件并登记本表 §1 / §4，待用户验收后冻结（docs/07 §G）。
6. 待补：L-LONG / L-STACK 长清单族；各形态前后对比（M15）/ 打分表（S10）二级变体。
