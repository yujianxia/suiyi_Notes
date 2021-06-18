#
# 块格式化上下文

**块格式化上下文（Block Formatting Context，BFC）** 是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

下列方式会创建**块格式化上下文**：

* 根元素（`<html>`）

* 浮动元素（元素的 [float](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 不是 `none`）

* 绝对定位元素（元素的 [position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 为 `absolute` 或 `fixed`）

* 行内块元素（元素的 [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `inline-block`）

* 表格单元格（元素的 [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table-cell`，HTML表格单元格默认为该值）

* 表格标题（元素的 [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table-caption`，HTML表格标题默认为该值）

* 匿名表格单元格元素（元素的 [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table`、`table-row`、 `table-row-group`、`table-header-group`、`table-footer-group`（分别是HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）

* [overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow) 计算值(Computed)不为 `visible` 的块元素

* [display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 值为 [flow-root](https://drafts.csswg.org/css-display/#valdef-display-flow-root) 的元素

* [contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) 值为 `layout`、`content` 或 `paint` 的元素

* 弹性元素（[display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `flex` 或 `inline-flex` 元素的直接子元素）

* 网格元素（[display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `grid` 或 `inline-grid` 元素的直接子元素）

* 多列容器（元素的 [column-count](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-count) 或 [column-width](https://developer.mozilla.org/en-US/docs/Web/CSS/column-width) (en-US) 不为 `auto`，包括 `column-count` 为 1）

* `column-span` 为 `all` 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中

块格式化上下文对浮动定位（参见 [float](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)）与清除浮动（参见 [clear](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)）都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一BFC的块级元素之间。

# 范例

## 让浮动内容和周围的内容等高

在下面的例子中，让 `<div>` 元素浮动，并给它一个边框效果。`<div>` 里的内容现在已经在浮动元素周围浮动起来了。由于浮动的元素比它旁边的元素高，所以 `<div> `的边框穿出了浮动。

**使用`overflow: auto`**

创建一个会包含这个浮动的 BFC，通常的做法是设置父元素 `overflow: auto` 或者设置其他的非默认的 `overflow: visible` 的值。

设置 `overflow: auto` 创建一个新的BFC来包含这个浮动。的 `<div>` 元素现在变成布局中的迷你布局。任何子元素都会被包含进去。

使用 `overflow` 来创建一个新的 BFC，是因为 `overflow` 属性告诉浏览器你想要怎样处理溢出的内容。当你使用这个属性只是为了创建 BFC 的时候，你可能会发现一些不想要的问题，比如滚动条或者一些剪切的阴影，需要注意。另外，对于后续的开发，可能不是很清楚当时为什么使用 `overflow`。所以你最好添加一些注释来解释为什么这样做。

**使用`display: flow-root`**

一个新的 `display` 属性的值，它可以创建无副作用的 BFC。在父级块中使用 `display: flow-root` 可以创建新的 BFC。

给 `<div>` `display: flow-root` 属性后，`<div>` 中的所有内容都会参与 BFC，浮动的内容不会从底部溢出。

关于值 `flow-root`的这个名字，当你明白你实际上是在创建一个行为类似于根元素 （浏览器中的`<html>`元素） 的东西时，就能发现这个名字的意义了——即创建一个上下文，里面将进行 flow layout。

> HTML

```html
<div class="blue"></div>
<div class="red-outer">
  <div class="red-inner">red inner</div>
</div>
```

```css
.blue, .red-inner {
  height: 50px;
  margin: 10px 0;
}

.blue {
  background: blue;
}

.red-outer {
  overflow: hidden;
  background: red;
}
```

> HTML

```html
<div class="box">
    <div class="float">I am a floated box!</div>
    <p>I am content inside the container.</p>
</div>
```

> CSS

```css
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}
```

<a data-fancybox title="结果" href="/notes/assets/css/1616572894(1).jpg">![结果](/notes/assets/css/1616572894(1).jpg)</a>

> HTML

```html
<div class="box">
    <div class="float">I am a floated box!</div>
    <p>I am content inside the container.</p>
</div>
```

> CSS

```css
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
    overflow: auto;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}
```

<a data-fancybox title="结果" href="/notes/assets/css/1616572977(1).jpg">![结果](/notes/assets/css/1616572977(1).jpg)</a>

> HTML

```html
<div class="box">
    <div class="float">I am a floated box!</div>
    <p>I am content inside the container.</p>
</div>
```

```css
.box {
    background-color: rgb(224, 206, 247);
    border: 5px solid rebeccapurple;
    display: flow-root;
}

.float {
    float: left;
    width: 200px;
    height: 150px;
    background-color: white;
    border:1px solid black;
    padding: 10px;
}
```

<a data-fancybox title="结果" href="/notes/assets/css/1616573057(1).jpg">![结果](/notes/assets/css/1616573057(1).jpg)</a>

## 外边距塌陷

创建新的 `BFC` 避免两个相邻 `<div>` 之间的 [外边距合并](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing) 问题

> HTML

```html
<div class="blue"></div>
<div class="red-outer">
  <div class="red-inner">red inner</div>
</div>
```

> CSS

```css
.blue, .red-inner {
  height: 50px;
  margin: 10px 0;
}

.blue {
  background: blue;
}

.red-outer {
  overflow: hidden;
  background: red;
}
```