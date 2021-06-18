#
# 布局和包含块

## 确定包含块

确定一个元素的包含块的过程完全依赖于这个元素的 [position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 属性：

1. 如果 position 属性为 `static` 、 `relative` 或 `sticky`，包含块可能由它的最近的祖先**块元素**（比如说inline-block, block 或 list-item元素）的内容区的边缘组成，也可能会建立格式化上下文(比如说 a table container, flex container, grid container, 或者是 the block container 自身)。

2. 如果 position 属性为 **absolute** ，包含块就是由它的最近的 position 的值不是 `static` （也就是值为`fixed`, `absolute`, `relative` 或 `sticky`）的祖先元素的内边距区的边缘组成。

3. 如果 position 属性是 **fixed**，在连续媒体的情况下(continuous media)包含块是 viewport ,在分页媒体(paged media)下的情况下包含块是分页区域(page area)。

4. 如果 position 属性是 **absolute** 或 **fixed**，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：
 
    1. [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform) 或 [perspective](https://developer.mozilla.org/zh-CN/docs/Web/CSS/perspective) 的值不是 `none`
 
    2. [will-change](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change) 的值是 `transform` 或 `perspective`
 
    3. [filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter) 的值不是 `none` 或 `will-change` 的值是 `filter`(只在 Firefox 下生效).
 
    4. [contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) 的值是 `paint` (例如: `contain: paint;`)

> **注意**: 根元素(`<html>`)所在的包含块是一个被称为**初始包含块**的矩形。他的尺寸是视口 viewport (for continuous media) 或分页媒体 page media (for paged media).

## 包含块计算百分值

1. 要计算 height top 及 bottom 中的百分值，是通过包含块的 height 的值。如果包含块的 height 值会根据它的内容变化，而且包含块的 position 属性的值被赋予 relative 或 static ，那么，这些值的计算值为 auto。

2. 要计算 width, left, right, padding, margin 这些属性由包含块的 width 属性的值来计算它的百分值。

# 示例

```html
<body>
  <section>
    <p>This is a paragraph!</p>
  </section>
</body>
```

## Example 1

这个示例中，P 标签设置为静态定位，所以它的包含块为 `<section>` ，因为距离最近的父节点即是她的包含块。

```css
body {
  background: beige;
}

section {
  display: block;
  width: 400px;
  height: 160px;
  background: lightgray;
}

p {
  width: 50%;   /* == 400px * .5 = 200px */
  height: 25%;  /* == 160px * .25 = 40px */
  margin: 5%;   /* == 400px * .05 = 20px */
  padding: 5%;  /* == 400px * .05 = 20px */
  background: cyan;
}
```

<a data-fancybox title="结果描述" href="/notes/assets/css/1616568208(1).jpg">![结果描述](/notes/assets/css/1616568208(1).jpg)</a>

## Example 2

在这个示例中，P 标签的包含块为 `<body>` **元素**，因为 `<section>` 不再是一个块容器，所以并没有形成一个格式上下文。

```css
body {
  background: beige;
}

section {
  display: inline;
  background: lightgray;
}

p {
  width: 50%;     /* == half the body's width */
  height: 200px;  /* Note: a percentage would be 0 */
  background: cyan;
}
```

<a data-fancybox title="结果描述" href="/notes/assets/css/1616568332(1).jpg">![结果](/notes/assets/css/1616568332(1).jpg)</a>

## Example 3

这个示例中，P 元素的包含块是 `<section>`，因为 `<section>` 的 `position` 为 `absolute` 。P 元素的百分值会受其包含块的 `padding` 所影响。不过，如果包含块的 [box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing) 值设置为 `border-box` ，就没有这个问题。

```css
body {
  background: beige;
}

section {
  position: absolute;
  left: 30px;
  top: 30px;
  width: 400px;
  height: 160px;
  padding: 30px 20px;
  background: lightgray;
}

p {
  position: absolute;
  width: 50%;   /* == (400px + 20px + 20px) * .5 = 220px */
  height: 25%;  /* == (160px + 30px + 30px) * .25 = 55px */
  margin: 5%;   /* == (400px + 20px + 20px) * .05 = 22px */
  padding: 5%;  /* == (400px + 20px + 20px) * .05 = 22px */
  background: cyan;
}
```

<a data-fancybox title="结果描述" href="/notes/assets/css/1616568460(1).jpg">![结果](/notes/assets/css/1616568460(1).jpg)</a>

## Example 4

这个示例中，P 元素的 `position` 为 `fixed`，所以它的包含块就是初始包含块（在屏幕上，也就是 viewport）。这样的话，P 元素的尺寸大小，将会随着浏览器窗框大小的变化，而变化。

```css
body {
  background: beige;
}

section {
  width: 400px;
  height: 480px;
  margin: 30px;
  padding: 15px;
  background: lightgray;
}

p {
  position: fixed;
  width: 50%;   /* == (50vw - (width of vertical scrollbar)) */
  height: 50%;  /* == (50vh - (height of horizontal scrollbar)) */
  margin: 5%;   /* == (5vw - (width of vertical scrollbar)) */
  padding: 5%;  /* == (5vw - (width of vertical scrollbar)) */
  background: cyan;
}
```

<a data-fancybox title="结果描述" href="/notes/assets/css/1616568574.jpg">![结果](/notes/assets/css/1616568574.jpg)</a>

## Example 5

这个示例中，P 元素的 `position` 为 `absolute`，所以它的包含块是 `<section>`，也就是距离它最近的一个 `transform` 值不为 `none` 的父元素。

```css
body {
  background: beige;
}

section {
  transform: rotate(0deg);
  width: 400px;
  height: 160px;
  background: lightgray;
}

p {
  position: absolute;
  left: 80px;
  top: 30px;
  width: 50%;   /* == 200px */
  height: 25%;  /* == 40px */
  margin: 5%;   /* == 20px */
  padding: 5%;  /* == 20px */
  background: cyan;
}
```

<a data-fancybox title="结果描述" href="/notes/assets/css/1616568667(1).jpg">![结果](/notes/assets/css/1616568667(1).jpg)</a>