# 05 · 控件规格（Components）

> 本文件是 md2red 所有控件的「单一事实来源」。规则全部量化，可直接照着写 CSS / HTML。
> 数值抽取自已锁定的 `templates/card-base.html`，与 `prototype/` 三套定稿原型同步。
> 配色 token 见 `02-palettes.md`；卡片如何拼装见 `04-layouts.md`。

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
- 导出尺寸由 `index.html` 的 print CSS 锁定（`@page{size:1080px 1440px}`），不在本模板内。

---

## 2. 字号刻度（结构 token，配色无关）

| 角色 | Token | 值 | 典型字重 | 用在 |
| --- | --- | --- | --- | --- |
| 页眉编号 | `--t-eyebrow` | `25px` | 600 | `.h-left` |
| 备用大标 | `--t-display` | `104px` | — | 预留 |
| 正文主标 | `--t-h1` | `60px` | 500 | `.body h2` |
| 导语/要点 | `--t-lead` | `36px` | 300 | `.cover .sub` / `.point` / `.cta` |
| 正文 | `--t-body` | `30px` | 400 | 通用正文 |
| 正文序号 | `--t-index` | `128px` | `--big-weight` | `.body .index` |
| 数据数字 | `--t-num` | `150px` | `--big-weight` | `.stat .num` |
| 注解/品牌脚 | `--t-cap` | `26px` | 500 | `.cap` / `.topic` / `.brandfoot` |
| 出处/次要 | `--t-source` | `22px` | — | `.src` / `.h-right` |

> 封面主标 `.title` 与尾页 `.end .h` 直接写死字号（128px / 72px），不走刻度——它们是视觉锚点，见下。

### 字重规则（硬规则）

- **大字越大越细**：封面主标 `font-weight:250`（三主题一致）；正文序号 `.index`、数据数字 `.num` 用 `--big-weight`。
- `--big-weight`：B/D = `250`，**C = `600`**（霓虹渐变需要更实的字形托住描边）。
- 最小可读：`.src` / `.h-right` 的 `22px` 是底线，**任何文字不得再小**。塞不下就删内容，不缩字号。

---

## 3. 间距刻度

| Token | 值 | 典型用途 |
| --- | --- | --- |
| `--s1` | `8px` | 最紧凑间隙 |
| `--s2` | `16px` | `.stat` 内部 gap |
| `--s3` | `24px` | 页眉下内距、分隔线上内距 |
| `--s4` | `32px` | 标题与正文之间 |
| `--s5` | `48px` | 区块大间隔（最常用）|
| `--s6` | `64px` | — |
| `--s7` | `96px` | — |
| `--s8` | `120px` | — |

只用这些 token，不要写裸 px，否则多张卡间距会飘。

---

## 4. 字体栈

| Token / 用途 | 栈 |
| --- | --- |
| 正文（body）| `"Helvetica Neue","PingFang SC",-apple-system,"Segoe UI","Noto Sans SC",Arial,sans-serif` |
| `--font-mono` | `ui-monospace,"SF Mono","JetBrains Mono","Roboto Mono",Menlo,Consolas,monospace` |

等宽栈只用于：封面主标里的数字 `.title .d`。其余正文一律用主字体栈。

---

## 5. 控件目录

每个控件标注：作用 / 关键样式 / 主题差异。

### 5.1 容器骨架

| 控件 | 作用 | 关键样式 |
| --- | --- | --- |
| `.canvas` | 一张卡的实体（1080×1440）| `background:var(--c-card)`；`flex column`；`overflow:hidden` |
| `.pad` | 卡内容区 | `padding:var(--margin)`；`flex:1` 撑满 |
| `.frame` / `.label` | 预览用外框 + 文字标签 | 仅 demo，导出不需要 |
| `.gallery` / `.toolbar` / `.switch` | 预览页外壳 + 主题切换按钮 | 仅 demo |

> 真正出图只需要 `.canvas`（含其内部 `.pad` 等）。`.frame/.gallery/.toolbar/.switch` 是展示脚手架。

### 5.2 页眉 `.header`

- 结构：`justify-content:space-between`，底部 `2px` 分隔线，`margin-bottom:var(--s5)`。
- `.h-left`：编号·系列名。`25px / 600 / letter-spacing .2em / 大写 / color:var(--c-anchor-ink)`。
- `.h-right`：右侧辅助（「向右滑 →」/「回顾·RECAP」/进度点）。`22px / color:var(--c-ink-3)`。
- `.dots`：进度点。`i` 为 `10px` 灰点；`i.on` 变 `30px` 宽的方条、`background:var(--c-dot-on)`，表示当前页。

### 5.3 品牌脚 `.brandfoot`

- `margin-top:auto`（钉在卡片底部，**不用 absolute**），顶部 `2px` 分隔线，右对齐。
- `26px / 500 / color:var(--c-ink-2)`。固定内容 `@津玉不良言`。
- `.spacer`（`flex:1`）：正文卡里把内容顶上、数据块压到底时用。

### 5.4 封面控件 `.cover`

| 子控件 | 样式 | 说明 |
| --- | --- | --- |
| `.topic` | `26px / color:var(--c-ink-2)` | 话题标签 |
| `.title` | `128px / weight 250 / line-height 1.24 / letter-spacing -.015em` | 主标，三主题同字重 |
| `.title .d` | `font-mono / 1.8em / weight 400 / color:var(--c-anchor) / top:.05em` | 主标里的数字，等宽放大、基线微沉 |
| `.sub` | `36px / weight 300 / 顶部 2px 线 / max-width 760px` | 导语 |
| `.content` | `flex column / justify-content:flex-end` | 让封面文字沉到下半部 |
| `.aura` / `.ghost` | 默认 `display:none` | **仅 C 主题**显示，见 §6 |

### 5.5 正文控件 `.body`

| 子控件 | 样式 | 说明 |
| --- | --- | --- |
| `.index` | `128px / weight var(--big-weight) / color:var(--c-anchor)` | 大序号 |
| `h2` | `60px / 500 / line-height 1.18` | 正文主标 |
| `.point` | `36px / weight 300 / color:var(--c-ink-2) / max-width 860px` | 要点说明 |

### 5.6 数据块 `.stat`（一张正文卡最多一个）

| 子控件 | 样式 | 说明 |
| --- | --- | --- |
| `.stat` | `background:var(--c-card-2) / padding s5 s5 s4` | 容器 |
| `.num` | `150px / weight var(--big-weight) / baseline 对齐` | 大数字 |
| `.num em` | `46px / weight 500 / color:var(--c-anchor) / font-style:normal` | 单位/百分号（如 `% ↓`）|
| `.cap` | `26px / color:var(--c-ink-2)` | 数据解释 |
| `.src` | `22px / color:var(--c-ink-3)` | 出处，未核标「示例数据 · 待核」|

### 5.7 尾页控件 `.end`

| 子控件 | 样式 | 说明 |
| --- | --- | --- |
| `.h` | `72px / weight 250 / line-height 1.1` | 收尾大标 |
| `.recap .it` | `32px / weight 400 / 上下 2px 线 / padding s3 0` | 回顾行 |
| `.recap .n` | `26px / 600 / color:var(--c-anchor) / width 46px` | 行号 |
| `.cta` | `36px / weight 300 / color:var(--c-ink-2)` | 行动号召 |
| `.cta b` | `weight 500 / color:var(--c-anchor-ink)` | 号召里的重点词 |

---

## 6. 主题差异（只列与 §5 不同处）

配色 token 全表见 `02-palettes.md`。控件层面的差异：

### B · 清新薄荷（`theme-mint`，默认）
- `.stat .num em`：字重降到 `400`、用深蓝 `--c-anchor-ink`。
- 无数据条边框、无封面光效。最克制。

### D · 美拉德×莫兰迪（`theme-maillard`）
- `.stat`：左侧 `4px` 鼠尾草色边框（`--c-anchor-2` = `#7E8C6A`）。
- 其余同 B，克制。

### C · 酸性霓虹（`theme-acid`，唯一戏剧化主题）
- 封面 `.canvas.cover` 用深底 `--c-page`（#0A0A0C）。
- `.aura` + `.ghost` **显示**：光晕 + 右下出血的巨型幽灵数字（见 `04-layouts.md` 封面配方 + `01-design-system.md` 锁定 CSS）。
- 渐变描字（`--grad`）应用到：`.title .d` / `.body .index` / `.stat .num` / `.end .recap .n` / `.cta b`。
- `.stat` 左侧 `4px` 品红边框（`--c-neon-2`）。
- `.stat .num em` 例外：不渐变，用青色 `--c-anchor-2` 实色填充。

---

## 7. 硬规则（违反基本都是错的）

1. 卡片永远 `1080×1440`，内容用 `flex` 撑满，**禁止 `vw/vh`**。
2. 封面主标 `.title` 字重恒为 `250`，三主题不变。
3. 大数字（`.index` / `.num`）走 `--big-weight`，不要单独写死字重。
4. 分隔线一律 `2px`（`--hair-w`），不要随手改。
5. 间距只用 `--s1..s8`，不写裸 px。
6. 品牌脚靠 `margin-top:auto` 钉底，**禁止 `position:absolute`** 压在会增长的内容上。
7. 一张正文卡最多一个 `.stat`。
8. 文字最小 `22px`，塞不下先删内容，不缩字号。
9. 光晕/幽灵数字/渐变描字是 **C 主题专属**，B/D 不得使用。
10. 不编造数据，未核一律标「示例数据 · 待核」。
