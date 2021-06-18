# Css 单位

CSS 有几种表示长度的不同单位。

许多 CSS 属性接受“长度”值，诸如 `width`、`margin`、`padding`、`font-size` 等。

长度是一个后面跟着长度单位的数字，诸如 `10px`、`2em` 等。

**实例**

```css
h1 {
  font-size: 60px;
}

p {
  font-size: 25px;
  line-height: 50px;
}
```

数字和单位之间不能出现空格。但是，如果值为 0，则可以省略单位。

对于某些 CSS 属性，允许使用负的长度。

长度单位有两种类型：**绝对单位**和**相对单位**。
---

## 绝对长度

绝对长度单位是固定的，用任何一个绝对长度表示的长度都将恰好显示为这个尺寸。

不建议在屏幕上使用绝对长度单位，因为屏幕尺寸变化很大。但是，如果已知输出介质，则可以使用它们，例如用于打印布局（print layout）。

| 单位 | 描述 |
| ---- | ---- |
| cm | 厘米	|
| mm | 毫米	|
| in | 英寸 (1in = 96px = 2.54cm) |
| px * | 像素 (1px = 1/96th of 1in)	|
| pt | 点 (1pt = 1/72 of 1in) |
| pc | 派卡 (1pc = 12 pt) |

* 像素（px）是相对于观看设备的。对于低 dpi 的设备，1px 是显示器的一个设备像素（点）。对于打印机和高分辨率屏幕，1px 表示多个设备像素。
---

## 相对长度

相对长度单位规定相对于另一个长度属性的长度。相对长度单位在不同渲染介质之间缩放表现得更好。

| 单位 | 描述 |
| ---- | ---- |
| em | 相对于元素的字体大小（font-size）（2em 表示当前字体大小的 2 倍）|
| ex | 相对于当前字体的 x-height(极少使用) |
| ch | 相对于 "0"（零）的宽度 |
| rem | 相对于根元素的字体大小（font-size）|
| vw | 相对于视口*宽度的 1%	|
| vh | 相对于视口*高度的 1%	|
| vmin | 相对于视口*较小尺寸的 1％ |
| vmax | 相对于视口*较大尺寸的 1％ |
| % | 相对于父元素 |

> **提示**：em 和 rem 单元可用于创建完美的可扩展布局！
>
> * 视口（Viewport）= 浏览器窗口的尺寸。如果视口宽 50 里面，则 1vw = 0.5cm。

## 浏览器支持

<a data-fancybox title="示例" href="/notes/assets/css/1616469359(1).jpg">![示例](/notes/assets/css/1616469359(1).jpg)</a>

> **拓展问题**：
> **fr**：剩余空间分配数
> fr单位被用于在一系列长度值中分配剩余空间，如果多个已指定了多个部分，则剩下的空间根据各自的数字按比例分配。

```css
border-parts:10px 1fr 10px;
border-parts:10px 1fr 10px 1fr 10px;
border-parts:10px 2fr 10px 2fr 10px;
```

> **拓展问题**：
> **gr**：网格数
> gr单位被用于在一系列长度值中网格数，如果多个已指定了多个部分，网格空间根据各自的数字按比例分配。

```css
img{
  float:top left multicol;
  float-offset:2gr;
  width:1gr;
}
```

## 按需定制
---

`CSS Grid` 关键 的地方是 `grid-gap` 只在需要的时候才会被应用。

<a data-fancybox title="示例" href="/notes/assets/css/1591002715973015.jpg">![示例](/notes/assets/css/1591002715973015.jpg)</a>

> 没有CSS网格，就不可能拥有这种灵活性

```css
.card:not(:last-child) {
  margin-bottom: 16px;
}

@media (min-width:700px) {
  .card:not(:last-child) {
    margin-bottom: 0;
    margin-left: 1rem;
  }
}
```

> 优化

```css
.card-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
}

@media (min-width:700px) {
  .card-wrapper {
    grid-template-columns: 1fr 1fr;
  }
}
```

## 处理底部margin
---

> 假设以下组件堆叠在一起，每个组件都有底边距。

<a data-fancybox title="示例" href="/notes/assets/css/1591002732984697.jpg">![示例](/notes/assets/css/1591002732984697.jpg)</a>

注意最后一个元素有一个空白，这是不正确的，因为边距只能在元素之间。

可以使用以下解决方案之一解决此问题：

**解决方案1-CSS `:not` 选择器**

```css
.element:not(:last-child) {
  margin-bottom: 16px;
}
```

**解决方案2：相邻兄弟组合器**

```css
.element + .element {
  margin-top: 16px;
}
```

虽然解决方案1具有吸引力，但它具有以下缺点：

* 它会导致CSS的特异性问题。在使用 `:not` 选择器之前不可能覆盖它。

* 万一设计中有不止一列，它将无法正常工作。参见下图。

<a data-fancybox title="示例" href="/notes/assets/css/1591002770894622.jpg">![示例](/notes/assets/css/1591002770894622.jpg)</a>

