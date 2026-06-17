# 02 · 三套配色 token

结构一致（见 [01-design-system.md](./01-design-system.md)），仅以下 token 随配色变化。在 [`templates/card-base.html`](../templates/card-base.html) 中对应 `.theme-mint` / `.theme-acid` / `.theme-maillard` 三个主题类。

## B · 清新薄荷（Swiss 基线）· `theme-mint`

雾蓝白底 + 单色信任蓝锚点。冷静、专业、可读。

| token | 色值 | 含义 |
|---|---|---|
| `--c-page` | `#D7E1EC` | 展厅底 |
| `--c-card` | `#F4F8FC` | 卡片底 |
| `--c-card-2` | `#EAF1F9` | 次级面 |
| `--c-ink` | `#161B22` | 主墨 |
| `--c-ink-2` | `#5A6675` | 次级 |
| `--c-ink-3` | `#8B97A6` | 弱化 / 出处 |
| `--c-anchor` | `#2D7FF9` | 锚点·信任蓝 |
| `--c-anchor-d` | `#1F6FE5` | 锚点深色 |
| `--c-hair` | `#C9D5E3` | 衡线 |

## C · 酸性·多巴胺霓虹 · `theme-acid`

炭黑底 + 多色霓虹渐变锚点。高能、年轻、抳眼。

| token | 色值 | 含义 |
|---|---|---|
| `--c-page` | `#0A0A0C` | 展厅底 |
| `--c-card` | `#141418` | 卡片底·炭黑 |
| `--c-card-2` | `#1E1E26` | 次级面 |
| `--c-ink` | `#F5F5F7` | 主墨·近白 |
| `--c-ink-2` | `#9A9AA8` | 次级 |
| `--c-ink-3` | `#62626E` | 弱化 |
| `--c-anchor` | `#FF2D9B` | 单色锚点（小件） |
| `--grad` | `linear-gradient(100deg,#C6FF3A 0%,#16E0FF 46%,#FF2D9B 100%)` | 霓虹渐变（大字/序号/数据） |
| `--c-hair` | `#2C2C36` | 衡线 |

- 霓虹渐变仅用于 Display / Index / Num / 封面重点字 / recap 序号 / CTA 重点字，配 `drop-shadow` 软晕发光。
- 数据块左缘 4px 霓虹色边；单位 `em` 用纯电青 `#16E0FF`。
- 为发光可读，此版大字采用 600 重（唯一与「越大越细」不同之处）。

## D · 美拉德×莫兰迪 · `theme-maillard`

暖奶油底 + 赤陶/鼠尾草锚点。柔和、静谧、去饱和。

| token | 色值 | 含义 |
|---|---|---|
| `--c-page` | `#E3DACB` | 展厅底·暖米 |
| `--c-card` | `#F3ECDF` | 卡片底·奶油 |
| `--c-card-2` | `#EADFCC` | 次级面 |
| `--c-ink` | `#2F2820` | 主墨·暖棕 |
| `--c-ink-2` | `#6E6253` | 次级·棕灰 |
| `--c-ink-3` | `#9C907E` | 弱化·出处 |
| `--c-anchor` | `#B05E3B` | 主锚点·赤陶 |
| `--c-anchor-2` | `#7E8C6A` | 次锚点·鼠尾草 |
| `--c-hair` | `#D6C9B4` | 衡线 |

- 低对比、去饱和；严格遵守「越大越细」、无圆角无阴影。
- 数据块左缘 4px 鼠尾草；数据单位 / 重点用赤陶。
