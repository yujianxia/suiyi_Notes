## Sticky Footer，完美的绝对底部

## 什么是 “Sticky Footer”

它指的就是一种网页效果：

如果页面内容不足够长时，页脚固定在浏览器窗口的底部；如果内容足够长时，页脚固定在页面的最底部。
总而言之，就是页脚一直处于最底，效果大致如图所示：

<a data-fancybox title="图片地址" href="https://misc.aotu.io/liqinuo/sticky_02.png">![图片地址](https://misc.aotu.io/liqinuo/sticky_02.png)</a>

# html 结构

```html
<div class="wrapper">
    <div class="content"><!-- 页面主体内容区域 --></div>
    <div class="footer"><!-- 需要做到 Sticky Footer 效果的页脚 --></div>
</div>
```

## 实现方案一：absolute

通过绝对定位处理应该是常见的方案，只要使得页脚一直定位在主容器预留占位位置。

```css
html, body {
    height: 100%;
}
.wrapper {
    position: relative;
    min-height: 100%;
    padding-bottom: 50px;
    box-sizing: border-box;
}
.footer {
    position: absolute;
    bottom: 0;
    height: 50px;
}
```

这个方案需指定 html、body 100% 的高度，且 content 的 padding-bottom 需要与 footer 的 height 一致。

## 实现方案二：calc

通过计算函数 calc 计算（视窗高度 - 页脚高度）赋予内容区最小高度，不需要任何额外样式处理，代码量最少、最简单。

```css
.content {
    min-height: calc(100vh - 50px);
}
.footer {
    height: 50px;
}
```

不需考虑 calc() 以及 vh 单位的兼容情况，这是个很理想的实现方案。

同样的问题是 footer 的高度值需要与 content 其中的计算值一致。

## 实现方案三：table

通过 table 属性使得页面以表格的形态呈现

```css
html, body {
    height: 100%;
}
.wrapper {
    display: table;
    width: 100%;
    min-height: 100%;
}
.content {
    display: table-row;
    height: 100%;
}
```

使用 table 方案存在一个比较常见的样式限制，通常 margin、padding、border 等属性会不符合预期

## 实现方案四：Flexbox

Flexbox 是非常适合实现这种效果的，使用 Flexbox 实现不仅不需要任何额外的元素，而且允许页脚的高度是可变的。

```css
html {
    height: 100%;
}
body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}
.content {
    flex: 1;
}
```