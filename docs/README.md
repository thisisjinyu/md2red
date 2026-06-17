# md2red · 设计系统文档

把长文内容转换成微信公众号 / 小红书风格图文卡片的设计规范。这套文档把「结构」与「配色」拆开：骨架一套，配色可换，从而在同一套排版纪律下继续表现不同质感。

## 目录

| 文档 | 内容 |
|---|---|
| [01-design-system.md](./01-design-system.md) | 结构与版式系统（配色无关的骨架：画布 / 栅格 / 页眉 / 卡片类型 / 字阶 / 间距 / 原则） |
| [02-palettes.md](./02-palettes.md) | 三套配色 token（清新薄荷 / 酸性霓虹 / 美拉德×莫兰迪） |
| [03-content-mapping.md](./03-content-mapping.md) | Markdown 内容 → 卡片映射规则 |

## 模板

- [`templates/card-base.html`](../templates/card-base.html) — 可切换主题的基础模板；顶部按钮实时切换三套配色，用于「边改边调」。

## 原型（定稿参考）

- [`prototype/he-0001-prototype.html`](../prototype/he-0001-prototype.html) — B 清新薄荷 / Swiss 基线
- [`prototype/c-acid-dopamine-prototype.html`](../prototype/c-acid-dopamine-prototype.html) — C 酸性·多巴胺霓虹
- [`prototype/d-maillard-morandi-prototype.html`](../prototype/d-maillard-morandi-prototype.html) — D 美拉德×莫兰迪

## 来源

规则基于 [guizang social-card skill](https://github.com/op7418/guizang-social-card-skill) 中的设计原则 + 「津玉不良言」文本风格生成。具体数值（字号/字重/间距/色值十六进制）为本项目实现时标定，可在迭代中调整。
