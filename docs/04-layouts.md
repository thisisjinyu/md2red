# 04 · 布局配方（Layouts）

> 重梳后（2026-06-19）改为**三层正交模型**：皮肤 SKIN / 组件 COMPONENTS / DECK。
> - **皮肤** = `templates/card-base.css`：token、三主题、预览外壳、共享页眉/页脚/dots。只管「长什么色、什么字号 band」。
> - **组件** = `templates/components.css`（单一事实来源）：8 个内容组件，只管「内容长什么结构」。
> - **DECK** = `decks/<slug>/index.html`：同时 `<link>` 两个 CSS，按语义把组件拼成帧。
> 想看全部组件 × 三主题的活预览：`templates/components-gallery.html`。
> 字号 / token 见 `05-components.md`；配色见 `02-palettes.md`；内容→组件映射见 `03-content-mapping.md`；变体选择见 `04-templates.md`。

---

## 总则

- 一套图文 = **封面 cover ×1 + 正文组件 ×N + 收尾 close ×1**。
- 所有卡同一个 `1080×1440` 画布、同一个 `.header` + `.brandfoot`（皮肤层提供）。
- **主题唯一**：一套图文只用一个主题（B/C/D 三选一，`body` 的 class），不混搭。皮肤换色，组件结构不变。
- **密度 ≥75%，且靠真内容吃满**：不靠 `.spacer` / `flex:1` 占空。留白只有 finding 形态例外（见 04-templates）。每页脚 `.brandfoot` 靠 `margin-top:auto` 钉底。

---

## 8 个内容组件（components.css）

| 组件 | 角色 | 何时用 |
| --- | --- | --- |
| `cover` | 封面 | 第一张，钩子 |
| `ledger` | 重型账本 | 编号清单·每条带后果/代价 |
| `check` | 轻型清单 | 编号清单·可执行·无重后果 |
| `data` | 数据条目 File Card | 每条带数字/研究（复用 `.stat`）|
| `step` | 步骤/流程 | 有先后顺序 |
| `finding` | 单点强论 | 一个金句/大数字撑全篇（配套 `doing`）|
| `matrix` | 对比矩阵 | 多项横向对照（配套 `pick`）|
| `close` | 收尾 | 最后一张，回顾 + 号召 |

> 一篇 deck 不是套一个固定模版，而是 cover + 从正文组件里按语义挑 1+ 个（可混用）+ close。详见 `04-templates.md`。

---

## L1 · 封面 cover

**适用**：第一张，钩子。

**结构**：`.header`（左 `.h-left` 编号·系列 + 右「向右滑 →」）→ `.content`（`justify-content:flex-end`，文字沉下半场）：`.topic` 话题 → `.title` 主标 → `.sub` 导语 → `.brandfoot`。

**规则**：主标里第一个数字包 `<span class="d">`（等宽放大）；手动换行用 `<br>`。主标默认 `128px`，字多靠换行，**不缩字号**，建议 ≤2 行。C 主题额外显示 `.aura` 光晕 + `.ghost` 幽灵数字（右下出血，= 主标首个数字）。

```html
<div class="canvas cover">
  <div class="aura"></div>          <!-- 仅 C 主题显示 -->
  <div class="ghost">6</div>        <!-- 仅 C，= 主标首个数字 -->
  <div class="pad">
    <div class="header">
      <span class="h-left">HE-0001 · 晨间仪式</span>
      <span class="h-right">向右滑 →</span>
    </div>
    <div class="content">
      <div class="topic">健康饮食与生活方式</div>
      <div class="title">改变人生的<br><span class="d">6</span>个晨间仪式</div>
      <div class="sub">不靠意志力，靠系统。把早晨的前 60 分钟交给固定动作。</div>
    </div>
    <div class="brandfoot">@津玉不良言</div>
  </div>
</div>
```

---

## L2 · 正文（从组件里挑）

> 正文不再有「一个通用 body」组件——按内容形态挑 ledger / check / data / step / finding / matrix 之一（或混用）。
> 每个组件的 slots / 密度 / 边界见 `04-templates.md` §4，类样式见 `05-components.md` §5，全部结构看 `templates/components-gallery.html`。下面给两个最常用骨架。

### data · 数据条目（HE-0001 同款）

```html
<div class="canvas"><div class="pad">
  <div class="header"><span class="h-left">晨间仪式</span>
    <span class="h-right"><span class="dots"><i class="on"></i><i></i><i></i></span></span></div>
  <div class="data">
    <div class="topline"><span class="idx">01</span><h2>去晒晨光</h2></div>
    <div class="lead">一句承上启下。</div>
    <div class="stat">
      <div class="num">20–30 <em>分钟</em></div>
      <div class="cap">机制 / 为什么有效。</div>
      <div class="src">来源 · 待核</div>
    </div>
    <div class="how"><b>怎么做</b><span>可执行动作。</span></div>
  </div>
  <div class="brandfoot">@津玉不良言</div>
</div></div>
```

### ledger · 重型账本（WL-0001 同款）

```html
<div class="canvas"><div class="pad">
  <div class="header">...</div>
  <div class="ledger">
    <div class="lead">一句导语。</div>
    <div class="rows">
      <div class="row"><div class="idx">01</div><div class="col">
        <div class="lbl">标签</div><div class="csq">后果，重点<b>加粗</b>。</div></div></div>
      <!-- 4-6 条 -->
    </div>
  </div>
  <div class="brandfoot">@津玉不良言</div>
</div></div>
```

---

## L3 · 收尾 close

> 旧名 `.end` 已更名 `.close`（M07：标题 ≤54px，4–6 条 recap，一个收尾块）。

```html
<div class="canvas"><div class="pad">
  <div class="header"><span class="h-left">晨间仪式</span><span class="h-right">回顾 · RECAP</span></div>
  <div class="close">
    <div class="h">明早，<br>挑一个先开始。</div>
    <div class="recap">
      <div class="it"><span class="n">01</span><span>一句回顾</span></div>
      <!-- = 正文页数 -->
    </div>
    <div class="cta">觉得有用，<b>收藏 + 关注</b>。</div>
  </div>
  <div class="brandfoot">@津玉不良言</div>
</div></div>
```

---

## 行数 / 密度上限（防翻车）

| 位置 | 推荐 | 硬上限 | 超出怎么办 |
| --- | --- | --- | --- |
| 封面主标 `.title` | 2 行 | 3 行 | 先缩文案，不缩字号 |
| `data` 每页 `.stat` | 0–1 个 | 1 个 | 多出的数据另起一页 |
| `ledger`/`check` 条数 | ≤6 / ≤8 | 超了拆分屏或分两套 | 见 04-templates 选择依据 |
| `step` 步数 | 3–5 | ≥3 且必带结果 | 不足加料或换形态 |
| `close` `.recap` | = 正文页数 | 8 条 | 8+ 考虑拆两套图文 |

> 密度靠真内容吃满，不靠 spacer 占空（finding 形态例外，但须保留顶 kicker + hairline + 来源行三锚点）。
