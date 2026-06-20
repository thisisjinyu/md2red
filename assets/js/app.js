(function () {
  const CARD = { w: 1080, h: 1440 }; // 固定 3:4 竖版

  // 每个风格的封面配图默认版式（下拉选 auto 时生效）
  const COVER_LAYOUT = {
    gallery: "top", kinfolk: "top", swiss: "top", editorial: "frame", wabi: "module",
    aero: "bg", glass: "bg",
    bauhaus: "split", mondrian: "module", brutalism: "module", artdeco: "frame",
    memphis: "none", vaporwave: "bg", cyberpunk: "bg", riso: "top",
    acid: "bg", y2k: "none", anti: "none",
  };

  const SAMPLE = `# 少吃一口糖\n你的身体会谢谢你\n\n> 真正的自律，不是和食物对抗，而是重新认识它。\n\n## 三个温柔的开始\n\n- 把含糖饮料换成**气泡水 + 柠檬**\n- 主食里掺一半**糙米与豆类**\n- 嘴馋时先喝一杯水，==等十分钟==\n\n---\n\n## 为什么有效\n\n血糖平稳了，*情绪和精力*也会跟着稳。\n\n1. 减少胰岛素的剧烈波动\n2. 延长饱腹感，自然少吃\n3. 让味觉慢慢变得敏锐\n\n> 改变不必剧烈，坚持才会发光。`;

  const $ = (id) => document.getElementById(id);
  const input = $("input");
  const card = $("card");
  const frame = $("frame");
  const stage = $("stage");
  const counter = $("counter");

  let pages = [];
  let index = 0;

  // 图片取色缓存：url -> 631 调色板 | null(失败)
  const colorCache = {};

  function splitPages(md) {
    const parts = md.split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : [""];
  }

  function setSize() {
    card.style.setProperty("--card-w", CARD.w + "px");
    card.style.setProperty("--card-h", CARD.h + "px");
  }

  function fit() {
    const pad = 48;
    const availW = stage.clientWidth - pad;
    const availH = stage.clientHeight - pad;
    const scale = Math.min(availW / CARD.w, availH / CARD.h, 1);
    card.style.transform = `scale(${scale})`;
    frame.style.width = CARD.w * scale + "px";
    frame.style.height = CARD.h * scale + "px";
  }

  function escapeAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
  }

  /* ---------- 颜色工具 ---------- */
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  }
  function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }
  function hslToHex(h, s, l) {
    h = ((h % 1) + 1) % 1;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
    }
    const to = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
    return "#" + to(r) + to(g) + to(b);
  }

  // 从图片提取主色调 → 生成 6:3:1 调色板
  // 6（主色/大面积背景）与 3（辅助/文字）= 提取色同色相处理
  // 1（点睛）= 提取色的相反色（补色）加对比度
  function extractPalette(img) {
    const w = 64, h = 64;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const buckets = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 125) continue;
      const key = (r >> 4) + "-" + (g >> 4) + "-" + (b >> 4);
      let bk = buckets[key];
      if (!bk) bk = buckets[key] = { r: 0, g: 0, b: 0, n: 0 };
      bk.r += r; bk.g += g; bk.b += b; bk.n++;
    }
    const arr = Object.values(buckets).map((b) => ({
      r: b.r / b.n, g: b.g / b.n, b: b.b / b.n, n: b.n,
    }));
    if (!arr.length) return null;
    arr.sort((a, b) => b.n - a.n);
    // 主色调：在合理明度内选 饱和度 × 覆盖量 最高的颜色
    let base = null, best = -1;
    for (const c2 of arr) {
      const hsl = rgbToHsl(c2.r, c2.g, c2.b);
      if (hsl[2] < 0.12 || hsl[2] > 0.9) continue;
      const score = hsl[1] * Math.log(c2.n + 1);
      if (score > best) { best = score; base = c2; }
    }
    if (!base) base = arr[0];
    const [bh, bs0] = rgbToHsl(base.r, base.g, base.b);
    const bs = clamp(bs0, 0.35, 0.8); // 保证足够色相表达

    // 6：大面积浅色调背景（同色相）
    const bg  = hslToHex(bh, Math.min(bs * 0.42, 0.22), 0.94);
    const bg2 = hslToHex(bh, Math.min(bs * 0.38, 0.18), 0.965);
    // 3：辅助/文字（同色相加深加饱和，保证与 6 的对比）
    const ink = hslToHex(bh, Math.min(bs * 0.75, 0.5), 0.20);
    const dim = hslToHex(bh, Math.min(bs * 0.5, 0.35), 0.46);
    const rule = hslToHex(bh, Math.min(bs * 0.42, 0.3), 0.72);
    // 1：点睛 = 补色（色相 +180°）加对比度
    const ch = bh + 0.5;
    const cs = clamp(bs0 * 1.3, 0.6, 0.92);
    const accent = hslToHex(ch, cs, 0.46);
    const accentSoft = hslToHex(ch, Math.min(cs, 0.7), 0.6);

    return { bg, bg2, ink, dim, rule, accent, accentSoft };
  }

  function ensureColors(url) {
    if (!url) return Promise.resolve(null);
    if (url in colorCache) return Promise.resolve(colorCache[url]);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try { colorCache[url] = extractPalette(img); }
        catch (e) { colorCache[url] = null; }
        resolve(colorCache[url]);
      };
      img.onerror = () => { colorCache[url] = null; resolve(null); };
      img.src = url;
    });
  }

  const PAL_VARS = ["--card-bg", "--card-bg-2", "--card-ink", "--card-dim", "--card-rule", "--card-accent"];
  function applyColorsToCard() {
    const on = $("autoColor").checked;
    const url = $("imageUrl").value.trim();
    const pal = on && url ? colorCache[url] : null;
    if (pal) {
      card.style.setProperty("--card-bg", pal.bg);
      card.style.setProperty("--card-bg-2", pal.bg2);
      card.style.setProperty("--card-ink", pal.ink);
      card.style.setProperty("--card-dim", pal.dim);
      card.style.setProperty("--card-rule", pal.rule);
      card.style.setProperty("--card-accent", pal.accent);
    } else {
      PAL_VARS.forEach((v) => card.style.removeProperty(v));
    }
  }

  function renderPage(i) {
    const total = pages.length;
    index = Math.max(0, Math.min(i, total - 1));
    setSize();

    const theme = $("theme").value;
    const choice = $("imageLayout").value;
    const imgUrl = $("imageUrl").value.trim();
    const isCover = index === 0;

    let layout = "none";
    if (isCover && imgUrl) {
      layout = choice === "auto" ? (COVER_LAYOUT[theme] || "top") : choice;
    }
    const useImg = layout !== "none" && !!imgUrl && isCover;

    const cls = ["card", isCover ? "role-cover" : "role-body"];
    if (useImg) { cls.push("has-img", "layout-" + layout); }
    card.className = cls.join(" ");
    card.setAttribute("data-theme", theme);

    const eyebrow = $("eyebrow").value.trim();
    const brand = $("brand").value.trim();
    const no = String(index + 1).padStart(2, "0");
    const tot = String(total).padStart(2, "0");

    const eyebrowHtml = eyebrow ? `<div class="card-eyebrow">${escapeAttr(eyebrow)}</div>` : "";
    const md = window.mdToHtml(pages[index]);
    const bodyHtml = `<div class="card-body">${md}</div>`;
    const footHtml = `<div class="card-foot"><span>${escapeAttr(brand)}</span><span class="page-no">${no} / ${tot}</span></div>`;
    const media = useImg
      ? `<div class="card-media"><img src="${escapeAttr(imgUrl)}" crossorigin="anonymous" alt="" /></div>`
      : "";

    let inner;
    if (!useImg) {
      inner = eyebrowHtml + bodyHtml + footHtml;
    } else if (layout === "module") {
      inner = eyebrowHtml + `<div class="card-body">${media}${md}</div>` + footHtml;
    } else if (layout === "frame") {
      inner = media + eyebrowHtml + bodyHtml + footHtml;
    } else if (layout === "bg") {
      inner = media + `<div class="li-content"><div class="li-panel">${eyebrowHtml}${bodyHtml}</div>${footHtml}</div>`;
    } else if (layout === "bottom") {
      inner = `<div class="li-content">${eyebrowHtml}${bodyHtml}${footHtml}</div>` + media;
    } else {
      inner = media + `<div class="li-content">${eyebrowHtml}${bodyHtml}${footHtml}</div>`;
    }
    card.innerHTML = inner;
    applyColorsToCard();

    counter.textContent = `${no} / ${tot}`;
    fit();
  }

  function refresh() {
    const on = $("autoColor").checked;
    const url = $("imageUrl").value.trim();
    if (on && url && !(url in colorCache)) {
      ensureColors(url).then(() => renderPage(index));
    } else {
      renderPage(index);
    }
  }

  function rebuild(keepIndex) {
    pages = splitPages(input.value);
    const on = $("autoColor").checked;
    const url = $("imageUrl").value.trim();
    if (on && url && !(url in colorCache)) {
      ensureColors(url).then(() => renderPage(keepIndex ? index : 0));
    } else {
      renderPage(keepIndex ? index : 0);
    }
  }

  async function capture() {
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    const prev = card.style.transform;
    card.style.transform = "none";
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
    card.style.transform = prev;
    fit();
    return canvas;
  }

  function download(canvas, name) {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function exportOne() {
    if ($("autoColor").checked) { await ensureColors($("imageUrl").value.trim()); renderPage(index); }
    const canvas = await capture();
    download(canvas, `xhs-${String(index + 1).padStart(2, "0")}.png`);
  }

  async function exportAll() {
    if ($("autoColor").checked) { await ensureColors($("imageUrl").value.trim()); }
    const total = pages.length;
    const start = index;
    for (let i = 0; i < total; i++) {
      renderPage(i);
      await new Promise((r) => setTimeout(r, 120));
      const canvas = await capture();
      download(canvas, `xhs-${String(i + 1).padStart(2, "0")}.png`);
      await new Promise((r) => setTimeout(r, 200));
    }
    renderPage(start);
  }

  input.addEventListener("input", () => rebuild(true));
  $("theme").addEventListener("change", () => renderPage(index));
  $("imageLayout").addEventListener("change", () => renderPage(index));
  $("imageUrl").addEventListener("input", () => refresh());
  $("autoColor").addEventListener("change", () => refresh());
  $("eyebrow").addEventListener("input", () => renderPage(index));
  $("brand").addEventListener("input", () => renderPage(index));
  $("prev").addEventListener("click", () => renderPage(index - 1));
  $("next").addEventListener("click", () => renderPage(index + 1));
  $("exportOne").addEventListener("click", exportOne);
  $("exportAll").addEventListener("click", exportAll);
  $("loadSample").addEventListener("click", () => { input.value = SAMPLE; rebuild(false); });
  window.addEventListener("resize", fit);

  input.value = SAMPLE;
  rebuild(false);
})();
