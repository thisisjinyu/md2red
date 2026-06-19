# 04 · 组件库（按内容形态 + 语义组合）

> 核心原则：
> 1. 组件按**内容形态**归类，与题材无关（guizang「风格与内容解耦」）。
> 2. **同一形态不是一个死模版**——哪怕都是数字标题 + 条目内容，表达的内容、受众、细节决定正文用哪个组件。
> 3. 生成时 AI 按**语义**判断，挑出最合适的 **封面 + 正文 + 收尾 组合**。
>
> HE / WL / MB 只是嗂进系统的语料；同一组件可承接任意品类，只要内容形态匹配。

> **调整必须落规则**：凡是调试过、确认可用的形态 / 版式，必须写进本文件 + 落为 `templates/components.css` 里的可复用组件，让以后每次生成都照调整后的来，**不靠任何一次会话的记忆**。

> **三层架构（重梳·2026-06-19）**：皮肤 `card-base.css`（颜色/字号 band）× 组件 `components.css`（内容结构，单一事实来源）× DECK `decks/<slug>/index.html`（语义组合）。组件按结构命名，已去掉 L-/T- 前缀。全部组件的活预览：`templates/components-gallery.html`。

## 1. 形态 → 候选组件（1:N，不是 1:1）

路由不输出「一个模版」，而是输出**候选组件 + 选择依据**，由 AI 按语义挑。

### 编号清单体（主力）→ 组件族

| 组件 | 用在什么内容 | 触发信号 | 源 recipe | 组件（components.css）|
| --- | --- | --- | --- | --- |
| **ledger 重型账本** | 原因 / 雷区 / 代价，每条带后果 | 条目 ≤6 且每条有「后果/代价」 | M08 | `.ledger` ✅ |
| **check 轻型清单** | 法则 / 习惯 / 技巧，可执行 | 每条是 do/don't，无重后果 | M05 | `.check` ✅ |
| **data 数据条目** | 每条带数字 / 研究数据 | 条目自带 stat | S09 / S11 | `.data`（复用 `.stat`）✅ |
| **L-LONG 长清单分屏** | N 很大，一屏放不下 | 条目 >6~7 | M05 压缩 + 分屏 | 待建（拟入 components.css）|
| **L-STACK 堆叠+符号** | 标签 + 子句 + 标记 | 条目 = label + sub | S11 | 待建 |

### 其他形态

| 形态 | 组件 | 源 recipe | 组件（components.css）|
| --- | --- | --- | --- |
| 步骤/流程体 | step（线性编号阶梯）| M14 / M15 | `.step`（+`.list`/`.item`）✅ |
| 单点强论体 | finding（大金句 / 大数字 KPI）| M04 / KPI | `.finding`（+配套 `.doing`）✅ |
| 对比/测评体 | matrix（对照矩阵）| S12 / S10 | `.matrix`（+配套 `.pick`）✅ |

## 2. 选择依据（AI 语义判断的输入）

挑组件不看题材，看这些语义信号：

- **条目数 N**：≤6 单屏 ledger；>6~7 → 分屏 L-LONG 或压缩 check
- **每条是否带后果/代价**：有 → 重型 ledger；无（纯可执行）→ 轻型 check
- **每条是否带数字/数据**：有 → data
- **是否有先后顺序**：有 → 其实是步骤形态 step
- **受众语气**：反共识 / 警示 → 深色 + 重字重；种草 / 轻松 → 浅色 + 轻字重
- **是否横向对比**：有 → 对比形态 matrix
- **是否单点结论撑全篇**：有（一个研究/一个秘诀）→ 单点强论 finding

## 3. Deck = 语义组合（封面 + 正文 + 收尾）

生成不是套一个固定模版，而是 AI 按语义**拼一套**：

- **封面 cover**：期号封面 / 金句封面 / 大数字封面 / 主图封面
- **正文**：从命中形态的组件里挑 1+ 个，**可混用**（例：重型 ledger 正文 + 一张 data）
- **收尾 close**：小结账本 / 金句收尾 / CTA 收尾

组合由内容语义 + 受众决定，**不写死**。

> **期号封面·标准结构（已锁定·2026-06-19）**：
> `.cover > .aura + .ghost + .pad(.header[h-left 编号·栏目 / h-right 「向右滑 →」] + .content[.topic / .title（含 .d 大数字）/ .sub] + .brandfoot)`。
> 一旦某篇封面被用户确认，后续生成**逐字复用该结构与文案**（冻结基准见 docs/07 §G）。

## 4. 正文组件规格（id / from / role / slots / density / skin）

> 类样式统一在 `templates/components.css`；预览在 `templates/components-gallery.html`；成品实例在 `decks/`。

### ledger · 重型账本（from M08）✅
- **slots**：`.lead` 导语 → `.rows` 内 4-6 条 `.row`，每行 = `.idx`（大序号）+ `.col`（`.lbl` 标签 + `.csq` 后果/代价）
- **density**：每行 min-h 150px；≥4 行；不能只占中间三分之一；整页 ≥75% 吃满；禁 `flex:1`/`.spacer`，脚靠 `margin-top:auto`
- **成品实例**：`decks/wl-0001/`（《越减越胖 5 大原因》）

### check · 轻型清单（from M05）✅
- **slots**：`.lead` → `.rows` 内 4-8 条 `.row`，每条 = `.mk`（勾选/序号）+ `.col`（`.txt` 动作 + `.why` 一句说明）
- **density**：避免圆角卡片堆叠，用行 + 分隔线；≥75% 吃满
- **skin**：浅色主题（mint / maillard），轻字重

### data · 数据条目（from S09/S11 · 数字主导 File Card）✅
- **slots（每条目成页）**：`.topline`（`.idx` mono 36 + `h2` 56 同行，标题 = 「动词+对象」无数字）→ `.lead` 一句承上 → `.stat`（大数字 + em 单位 + cap 机制 + src 来源，全页唯一焦点）→ `.how`（「怎么做」+ actionable tip）
- **混用**：某条无真实数字 → 走文字主导：`.topline` + `.lead` + `.pull`（M04 金句，50px，左 4px anchor 边）+ `.how` + `.src-line`
- **density**：≥75% 吃满；留白只能用真字段（机制/做法/来源）补；禁 spacer / flex:1；一页一焦点（序号小、数字大）
- **成品实例**：`decks/he-0001/`（《6 个晨间仪式》）；acid 下 `.pull` 左边线用 neon-2

### step · 步骤/流程（from M14）✅
- **slots**：`.lead` 一句承上 → `.list` 内 3-5 个 `.item`，每步 = `.snum`（圆形序号，左侧连接竖线表先后）+ `.col`（`.act` 动作 + `.res` 结果）
- **density**：≥3 步；每步必带结果说明；≥75% 吃满；禁 spacer
- **与清单的边界**：清单可乱序、步骤不可。命中「有先后顺序」才走 step。
- 历史演示语料：HE-0009《4 步戳掉重盐口味》

### finding · 单点强论（from M04 / KPI）✅
- **slots（finding 页）**：header 顶 kicker（锚点 1）→ `.center` 居中放 **大金句 `.quote`** 或 **大数字 `.mega` + em 单位 + `.cap` 机制**（全页唯一焦点）→ `.srcwrap` hairline（锚点 2）+ `.src-line` 来源（锚点 3）
- **配套**：finding 页之外补一页可执行 `.doing`（动词清单 + 为什么），给收尾 recap 提供 grounded 素材
- **density**：**唯一允许 ≤60% 留白的形态**，但三锚点（顶 kicker + hairline + 来源行）必须齐全；每套 deck ≤1-2 张 finding 页
- 历史演示语料：WL-0008《减肥的头号秘诀》

### matrix · 对比/测评（from S12 / S10）✅
- **slots**：`.lead` → `.grid`（CSS grid：1 行标题列 + 3 指标列；首行 `.colhead` 指标名，左列 `.rowhead` 维度，交叉 `.cell`）；再补一页 `.pick` 给「怎么选」结论
- **density**：cell 字号 ≥24；短语为主；hairline 分隔，不靠卡片堆叠
- **禁**：异质单位（分钟 / 倍 / %）塞进同一张图表伪造可比性（见 docs/07 §E）。matrix 只做维度对照，不做跨指标打分塔。
- 历史演示语料：HE-0010《BMI vs 体脂率 vs 腰臀比》

### close · 收尾（from M07）✅
- **slots**：`.h` 标题（≤2 行，**字号 ≤54px**）→ `.recap` 4-6 条 grounded 回顾（逐条对应正文）→ **一个**收尾块 `.cta`（金句/CTA/旁注，一句行动话）
- **署名**：只在页脚 `.brandfoot` 出现一次；收尾块不再放署名块
- **density**：禁「3 句短话收尾」= FAIL；禁销售腔

## 5. 字号 / 密度下限（禁缩字）

- 最小可读：body 28 / lead 30 / caption·kicker 20 / cell title 24 / 数字注解 22
- 中文标题字数 band：1 行 ≤6 字 → 132 / 7-10 字 → 108 / 2 行 ≤8 字 → 96 / 2 行 9-12 字 → 84 / 3 行 → 72
- 任何段 >216px = FAIL；不够吃满就加料或换组件，不靠留白

## 6. 示例输入（仅作语料，演示同形态走不同组件）

| 走向组件 | 示例文章 | 为什么 |
| --- | --- | --- |
| data 数字主导 | HE-0001 6个晨间仪式 | 每条带研究数据，走数字主导 File Card |
| ledger 重型 | WL-0001 越减越胖5大原因 / WL-0007 便当雷区 | 每条是「原因/代价」，带后果 |
| check 轻型 | WL-0002 甜品生存法则 | 每条是可执行习惯/法则，无重后果、无研究数据 |
| L-LONG 长清单 | HE-0003 11种治愈坏心情的食物 | N=11，需分屏压缩 |
| step | HE-0009 4步戳盐瘾 / MB-0002 晨练流程 | 有先后顺序 |
| finding | WL-0008 减肥头号秘诀 / MB-0004 走路的意外副作用 | 单点结论撑全篇 |
| matrix | HE-0010 BMI vs 体脂率 vs 腰臀比 | 多项横向对比 |

> 同为「编号清单体」，HE-0001 走 data 数字主导（每条带研究数据）、WL-0001 走 ledger 重型（每条带后果）、WL-0002 走 check 轻型（纯可执行）——这就是「不固定死模版」。

## 7. 进展与待办

1. ✅ 八个结构组件已抽入 `components.css` 单一事实来源；cover/ledger/check/data/step/finding/matrix/close。
2. ✅ 两篇成品 deck 跑通新模型：`decks/he-0001/`（data 数字主导）、`decks/wl-0001/`（ledger 重型），各 link card-base.css + components.css。
3. ✅ 统一预览 `templates/components-gallery.html`（三主题切换 + 8 组件），已退役原 6 个 T-/L- 预览文件 + card-base.html。
4. 待用户启用 GitHub Pages 后验收渲染 / 尺寸 / 密度（≥75%），确认后把 step/finding/matrix 从「首版·待验收」转为「已冻结」（docs/07 §G）。
5. 待补：L-LONG / L-STACK 长清单族；各形态前后对比（M15）/ 打分表（S10）二级组件；可选移植密度校验脚本。
