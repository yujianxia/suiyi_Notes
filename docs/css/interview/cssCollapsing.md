#
# 外边距重叠

块的[上外边距(margin-top)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-top)和[下外边距(margin-bottom)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-bottom)有时合并(折叠)为单个边距，其大小为单个边距的最大值(或如果它们相等，则仅为其中一个)，这种行为称为**边距折叠**。

> 注意有设定[float](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)和[position=absolute](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#absolute)的元素不会产生外边距重叠行为。

## 同一层相邻元素之间

相邻的两个元素之间的外边距重叠，除非后一个元素加上[clear-fix清除浮动](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)。

```html
<style>
p:nth-child(1){
  margin-bottom: 13px;
}
p:nth-child(2){
  margin-top: 87px;
}
</style>

<p>下边界范围会...</p>
<p>...会跟这个元素的上边界范围重叠。</p>
```

* 结果描述
这个例子如果以为边界会合并的话，理所当然会猜测上下2个元素会合并一个100px的边界范围，但其实会发生边界折叠，只会挑选最大边界范围留下，所以这个例子的边界范围其实是87px。

## 没有内容将父元素和后代元素分开

 如果没有边框[border](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)，内边距[padding](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding)，行内内容，也没有创建块[级格式上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)或[清除浮动](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)来分开一个块级元素的上边界[margin-top](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-top) 与其内一个或多个后代块级元素的上边界[margin-top](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-top)；或没有边框，内边距，行内内容，高度[height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)，最小高度[min-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min-height)或 最大高度[max-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/max-height) 来分开一个块级元素的下边界[margin-bottom](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-bottom)与其内的一个或多个后代后代块元素的下边界[margin-bottom](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-bottom)，则就会出现父块元素和其内后代块元素外边界重叠，重叠部分最终会溢出到父级块元素外面。

```html
<style type="text/css">
    section    {
        margin-top: 13px;
        margin-bottom: 87px;
    }

    header {
        margin-top: 87px;
    }

    footer {
        margin-bottom: 13px;
    }
</style>

<section>
    <header>上边界重叠 87</header>
    <main></main>
    <footer>下边界重叠 87 不能再高了</footer>
</section>
```

## 空的块级元素

当一个块元素上边界[margin-top](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-top) 直接贴到元素下边界[margin-bottom](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-bottom)时也会发生边界折叠。这种情况会发生在一个块元素完全没有设定边框[border](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)、内边距`paddng`、高度[height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)、最小高度[min-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min-height) 、最大高度[max-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/max-height) 、内容设定为inline或是加上[clear-fix](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)的时候。

```html
<style>
​​​​​​p {
  margin: 0;
}
div {
  margin-top: 13px;
  margin-bottom: 87px;
}
</style>

<p>上边界范围是 87 ...</p>
<div></div>
<p>... 上边界范围是 87</p>
```

注意的地方：

* 上述情况的组合会产生更复杂的外边距折叠。

* 即使某一外边距为0，这些规则仍然适用。因此就算父元素的外边距是0，第一个或最后一个子元素的外边距仍然会“溢出”到父元素的外面。

* 如果参与折叠的外边距中包含负值，折叠后的外边距的值为最大的正边距与最小的负边距（即绝对值最大的负边距）的和,；也就是说如果有-13px 8px 100px叠在一起，边界范围的技术就是 100px -13px的87px。

* 如果所有参与折叠的外边距都为负，折叠后的外边距的值为最小的负边距的值。这一规则适用于相邻元素和嵌套元素。

## 示例

[HTML](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing#html)

```html
<p>The bottom margin of this paragraph is collapsed …</p>
<p>… with the top margin of this paragraph, yielding a margin of <code>1.2rem</code> in between.</p>

<div>This parent element contains two paragraphs!
  <p>This paragraph has a <code>.4rem</code> margin between it and the text above.</p>
  <p>My bottom margin collapses with my parent, yielding a bottom margin of <code>2rem</code>.</p>
</div>

<p>I am <code>2rem</code> below the element above.</p>
```

[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing#css)

```css
div {
  margin: 2rem 0;
  background: lavender;
}

p {
  margin: .4rem 0 1.2rem 0;
  background: yellow;
}
```

<a data-fancybox title="结果示例" href="/notes/assets/css/1616565585(1).jpg">![结果示例](/notes/assets/css/1616565585(1).jpg)</a>

# 间距类型

CSS中的间距有两种类型，一种在元素外部，另一种在元素内部。对于本文，将其称为**outer**和**inner**。假设有一个元素，它内部的间距是**inner**，外部的间距是**outer**。

<a data-fancybox title="示例" href="/notes/assets/css/1591002553846591.jpg">![示例](/notes/assets/css/1591002553846591.jpg)</a>

在CSS中，间距可以如下：

```css
.element {
  padding: 1rem;
  margin-bottom: 1rem;
}
```

## margin 折叠
---

当两个垂直元素具有margin，并且其中一个元素的margin大于另一个元素时，发生边距折叠。在这种情况下，将使用更大的margin，而另一个将被忽略。

<a data-fancybox title="示例" href="/notes/assets/css/1591002565162440.jpg">![示例](/notes/assets/css/1591002565162440.jpg)</a>

在上面的模型中，一个元素有 `margin-bottom`，另一个元素有 `margin-top`，边距较大的元素获胜。

为避免此类问题，建议按照本文使用单向边距。此外，CSS Tricks还在页边距底部和页边距顶部之间进行了投票。61%的开发者更喜欢 `margin-bottom` 而不是 `margin-top`。

请在下面查看如何解决此问题：

```css
.element:not(:last-child) {
  margin-bottom: 1rem;
}
```

使用 `:not` CSS选择器，您可以轻松地删除最后一个子元素的边距，以避免不必要的间距。

另一个与边距折叠相关的例子是子节点和父节点。让假设如下:

```html
<div class="parent">
  <div class="child">I'm the child element</div>
</div>
```

```css
.parent {
  margin: 50px auto 0 auto;
  width: 400px;
  height: 120px;
}

.child {
  margin: 50px0;
}
```

<a data-fancybox title="示例" href="/notes/assets/css/1591002573806167.jpg">![示例](/notes/assets/css/1591002573806167.jpg)</a>

请注意，子元素固定在其父元素的顶部。那是因为它的边距折叠了。根据W3C，以下是针对该问题的一些解决方案：

* 在父元素上添加 border

* 将子元素显示更改为 inline-block

一个更直接的解决方案是将 padding-top 添加到父元素。

<a data-fancybox title="示例" href="/notes/assets/css/1591002580112619.jpg">![示例](/notes/assets/css/1591002580112619.jpg)</a>

## 负margin
---

它可以与四个方向一起使用以留出余量，在某些用例中非常有用。让假设以下内容：

<a data-fancybox title="示例" href="/notes/assets/css/1591002586596486.jpg">![示例](/notes/assets/css/1591002586596486.jpg)</a>

父节点具有 `padding:1rem`，这导致子节点从顶部、左侧和右侧偏移。但是，子元素应该紧贴其父元素的边缘。负margin可以助你一臂之力。

```css
.parent {
  padding: 1rem
}

.child {
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: -1rem;
}
```

## padding 内部间距
---

如前所述，padding在元素内部增加了一个内间距。它的目标可以根据使用的情况而变化。

例如，它可以用于增加链接之间的间距，这将导致链接的可点击区域更大。

<a data-fancybox title="示例" href="/notes/assets/css/1591002597512161.jpg">![示例](/notes/assets/css/1591002597512161.jpg)</a>

必须提出的是，垂直方向的padding对于那些具有 `display:inline` 的元素不适用，比如 `<span>` 或 `<a>`。如果添加了内边距，它不会影响元素，内边距将覆盖其他内联元素。

这只是一个友好的提醒，应该更改内联元素的 `display` 属性。

```css
.elementspan {
  display: inline-block;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
```

## CSS Grid 间隙
---

在CSS网格中，可以使用 `grid-gap` 属性轻松在列和行之间添加间距。这是行和列间距的简写。

<a data-fancybox title="示例" href="/notes/assets/css/1591002603669597.jpg">![示例](/notes/assets/css/1591002603669597.jpg)</a>

```css
.element {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px; /* 为行和列都增加了16px的间隙。*/
}
```

gap属性可以使用如下:

```css
.element {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 24px;
  grid-column-gap: 16px;
}
```

## CSS Flexbox 间隙
---

`gap` 是一个提议的属性，将用于CSS Grid和flexbox，撰写本文时，它仅在Firefox中受支持。

```css
.element {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
```

## CSS 定位
---

它可能不是直接的元素间距方式，但在一些设计案例中却起到了一定的作用。例如，一个绝对定位的元素需要从其父元素的左边缘和上边缘定位 `16px`。

考虑以下示例，带有图标的卡片，其图标应与其父对象的左上边缘隔开。在这种情况下，将使用以下CSS：

```css
.category {
  position: absolute;
  left: 16px;
  top: 16px;
}
```

# 用例和实际示例

## header 组件
---

<a data-fancybox title="图片示例" href="/notes/assets/css/1591002624937425.jpg">![图片示例](/notes/assets/css/1591002624937425.jpg)</a>

在这种情况下，标题具有logo，导航和用户个人资料

```html
<header class="c-header">
  <h1 class="c-logo"><a href="#">Logo</a></h1>
  <div class="c-header__nav">
    <nav class="c-nav">
      <ul>
        <li><a href="#">...</a></li>
      </ul>
    </nav>
    <a href="#" class="c-user">
      <span>Ahmad</span>
      <img class="c-avatar" src="shadeed.jpg" alt="">
    </a>
  </div>
</header>
```

<a data-fancybox title="示例" href="/notes/assets/css/1591002630404607.jpg">![示例](/notes/assets/css/1591002630404607.jpg)</a>

> Header的左侧和右侧都有padding，这样做的目的是防止内容物紧贴在边缘上。

```css
.c-header {
  padding-left: 16px;
  padding-right: 16px;
}
```

> 对于导航，每个链接在垂直和水平侧均应具有足够的填充，因此其可单击区域可以很大，这将增强可访问性。

```css
.c-nava {
  display: block;
  padding: 16px8px;
}
```

> 对于每个项目之间的间距，您可以使用 `margin` 或将 `<li>` 的 `display` 更改为 `inline-block`。内联块元素在它的兄弟元素之间添加了一点空间，因为它将元素视为字符。

```css
.c-navli {
  /* 这将创建你在骨架中看到的间距 */
  display: inline-block;
}
```

> 最后，头像（avatar）和用户名的左侧有一个空白。

```css
.c-userimg,
.c-userspan {
  margin-left: 10px;
}
```

> 请注意，如果你要构建多语言网站，建议使用如下所示的CSS逻辑属性。

```css
.c-userimg,
.c-userspan {
  margin-inline-start: 1rem;
}
```

<a data-fancybox title="示例" href="/notes/assets/css/1591002649744326.jpg">![示例](/notes/assets/css/1591002649744326.jpg)</a>

> **产生的问题**：请注意，分隔符周围的间距现在相等，原因是导航项没有特定的宽度，而是具有`padding`。结果，导航项目的宽度基于其内容。以下是解决方案：

* 设置导航项目的最小宽度

* 增加水平`padding`

* 在分隔符的左侧添加一个额外的`margin`

最简单，更好的解决方案是第三个解决方案，即添加 `margin-left`。

```css
.c-user {
  margin-left: 8px;
}
```

## 网格系统中的间距：Flexbox
---

<a data-fancybox title="示例" href="/notes/assets/css/1591002658968135.jpg">![示例](/notes/assets/css/1591002658968135.jpg)</a>

> 间距应在列和行之间。考虑以下HTML标记：

```html
<div class="wrapper">
  <div class="grid grid--4">
    <div class="grid__item">
      <article class="card"><!-- Card content --></article>
    </div>
    <div class="grid__item">
      <article class="card"><!-- Card content --></article>
    </div>
    <!-- And so on.. -->
  </div>
</div>
```

> 通常，更喜欢将组件封装起来，并避免给它们增加边距。由于这个原因，有 `grid__item`元素，的card组件将位于其中。

```css
.grid--4 {
  display: flex;
  flex-wrap: wrap;
}

.grid__item {
  flex-basis: 25%;
  margin-bottom: 16px;
}
```

> 使用上述CSS，每行将有四张卡片。这是在它们之间添加空格的一种可能的解决方案：

```css
.grid__item {
  flex-basis: calc(25% - 10px);
  margin-left: 10px;
  margin-bottom: 16px;
}
```

通过使用`CSS calc()` 函数，可以从 `flex-basis` 中扣除边距。如你所见，这个方案并不是那么简单。比较喜欢的是下面这个办法。

* 向网格项目添加 `padding-left`

* 在网格父节点上增加一个负值 `margin-left`，其 `padding-left` 值相同。

> 从CSS Wizardy那里学到了上述解决方案

```css
.grid--4 {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
}

.grid__item {
  flex-basis: 25%;
  padding-left: 10px;
  margin-bottom: 16px;
}
```

描述：之所以用了负 `margin-left`，是因为第一张卡有 `padding-left`，而实际上不需要。所以，它将把 `.wrapper` 元素推到左边，取消那个不需要的空间。

<a data-fancybox title="示例" href="/notes/assets/css/1591002691201353.jpg">![示例](/notes/assets/css/1591002691201353.jpg)</a>

```css
.wrapper {
  margin-left: -4px;
  margin-right: -4px;
}

.story {
  padding-left: 4px;
  padding-right: 4px;
}
```

## 网格系统中的间距：CSS Grid
---

```css
.grid--4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
}
```

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

## Card组件
---

<a data-fancybox title="示例" href="/notes/assets/css/1591002788366119.jpg">![示例](/notes/assets/css/1591002788366119.jpg)</a>

```html
<article class="card">
  <a href="#">
    <div class="card__thumb"><img src="food.jpg" alt=""></div>
    <div class="card__content">
      <h3 class="card__title">Cinnamon Rolls</h3>
      <p class="card__author">Chef Ahmad</p>
      <div class="card__rating"><span>4.9</span></div>
      <div class="card__meta"><!-- --></div>
    </div>
  </a>
</article>
```

```css
.card__content {
  padding: 10px;
}
```

上面的 `padding` 将向其中的所有子元素添加一个偏移量。然后，将添加所有边距。

```css
.card__title,
.card__author,
.card__rating {
  margin-bottom: 10px;
}
```

对于评分和 `.car__meta` 元素之间的分隔线，将添加它作为边框。

```css
.card__meta {
  padding-top: 10px;
  border-top: 1px solid #e9e9e9;
}
```

> 产生的问题：由于对父元素 `.card__content` 进行了填充，因此边框没有粘在边缘上。

<a data-fancybox title="示例" href="/notes/assets/css/1591002811826084.jpg">![示例](/notes/assets/css/1591002811826084.jpg)</a>

> 解决方案 负边距

```css
.card__meta {
  padding-top: 10px;
  border-top: 1px solid #e9e9e9;
  margin: 0 -10px;
}
```

> 产生的问题：内容粘在边缘

<a data-fancybox title="示例" href="/notes/assets/css/1591002820823963.jpg">![示例](/notes/assets/css/1591002820823963.jpg)</a>

> 解决方案 ： 内容应该从左右两边加垫

```css
.card__meta {
  padding: 10px10px010px;
  border-top: 1px solid #e9e9e9;
  margin: 0 -10px;
}
```

<a data-fancybox title="示例" href="/notes/assets/css/1591002830309328.jpg">![示例](/notes/assets/css/1591002830309328.jpg)</a>

## 文章内容
---

```html
<div class="wrapper">
  <h1>Spacing Elements in CSS</h1>
  <p><!-- content --></p>
  <h2>Types of Spacing</h2>
  <img src="spacing-1.png" alt="">
  <p><!-- content --></p>
  <p><!-- content --></p>
  <h2>Use Cases</h2>
  <p><!-- content --></p>
  <h3>Card Component</h3>
  <img src="use-case-card-2.png" alt="">
</div>
```

```css
h1, h2, h3, h4, h5 {
  margin: 2.75rem01.05rem;
}

h1 {
  margin-top: 0;
}

img {
  margin-bottom: 0.5rem;
}
```

<a data-fancybox title="示例" href="/notes/assets/css/1591002843592255.jpg">![示例](/notes/assets/css/1591002843592255.jpg)</a>

如果一个 `<p>` 后面有一个标题，例如“Types of Spacing”，那么 `<p>` 的 `margin-bottom` 将被忽略。你猜到了，那是因为页边距折叠。

## Just In Case Margin
---

<a data-fancybox title="模型图" href="/notes/assets/css/1591002852805831.jpg">![模型图](/notes/assets/css/1591002852805831.jpg)</a>

当元素靠近的时候，它们看起来并不好看。是用flexbox搭建的。这项技术称为“对齐移位包装”，从CSS Tricks中学到了它的名称。

```css
.element {
  display: flex;
  flex-wrap: wrap;
}
```

当视口尺寸较小时，它们的确以新行结尾。见下文：

<a data-fancybox title="示例" href="/notes/assets/css/1591002861926291.jpg">![示例](/notes/assets/css/1591002861926291.jpg)</a>

> 倾向于向元素添加一个 `margin-right`，这样可以防止它们相互接触，从而加快 `flex-wrap` 的工作速度。

<a data-fancybox title="示例" href="/notes/assets/css/1591002867318794.jpg">![示例](/notes/assets/css/1591002867318794.jpg)</a>

## CSS 书写模式
---

> `writing-mode` CSS属性设置了文本行是水平还是垂直排列，以及块的前进方向。

<a data-fancybox title="示例" href="/notes/assets/css/1591002876294756.jpg">![示例](/notes/assets/css/1591002876294756.jpg)</a>

```css
.wrapper {
  /* 使标题和食谱在同一行 */
  display: flex;
}

.title {
  writing-mode: vertical-lr;
  margin-right: 16px;
}
```

结果表明，基于 `writing-mode` 的页边距工作得非常好。

## 组件封装
---

<a data-fancybox title="示例" href="/notes/assets/css/1591002898332287.jpg">![示例](/notes/assets/css/1591002898332287.jpg)</a>

```html
<button class="button">Save Changes</button>
<button class="button button-outline">Discard</button>
```

```css
.button + .button {
  margin-left: 1rem;
}
```

## 使用抽象组件
---

> 解决上述问题的一种方法是使用抽象的组件，其目标是托管其他组件，就像Max Stoiber所说的那样，这是将管理边距的责任移到了父元素上，让以这种思维方式重新思考以前的用例。

<a data-fancybox title="示例" href="/notes/assets/css/1591002910985555.jpg">![示例](/notes/assets/css/1591002910985555.jpg)</a>

```html
<div class="list">
  <div class="list__item">
    <button class="button">Save Changes</button>
  </div>
  <div class="list__item">
    <button class="button button-outline">Discard</button>
  </div>
</div>
```

> **注意**，添加了一个包装器，并且每个按钮现在都包装在其自己的元素中。

```css
.list {
  display: flex;
  align-items: center;
  margin-left: -1rem; /* 取消第一个元素的左空白 */
}

.list__item {
  margin-left: 1rem;
}
```

> 使用示例

```jsx
<List>
  <Button>Save Changes</Button>
  <Button outline>Discard</Button>
</List>
```

## 间隔组件
---

假设一个区域需要从左到右24px的空白，并记住这些限制：

* `margin`不能直接用于组件，因为它是一个已经构建的设计系统。

* 它应该是灵活的。间距可能在`X`页上，但不在`Y`页上。

<a data-fancybox title="示例" href="/notes/assets/css/1591002925174702.jpg">![示例](/notes/assets/css/1591002925174702.jpg)</a>

那是一个 `<div>`，内联样式宽度：`16px`，它唯一的作用是在左边缘和包装器之间增加一个空白空间。

> 但在现实世界中，确实需要组件之外的间距来合成页面和场景，这就是`margin`渗入组件代码的地方：用于组件的间距组合。

## 间隔组件的挑战
---

产生的问题

* 间隔组件如何在父级内部取其宽度或高度？在水平布局和垂直布局中，它将如何工作？

* 是否应该根据其父项的显示类型（Flex，Grid）对它们进行样式设置

## 调整间隔组件的大小
---

> 创建隔板

```jsx
<Header />
<Spacer mb={4} />
<Section />
```

> 一个间隔器在logo和导航之间建立一个自动间隔。

```jsx
<Flex>
  <Logo />
  <Spacer m="auto" />
  <Link>Beep</Link>
  <Link>Boop</Link>
</Flex>
```

> 可以做一个叫 `grow` 的prop，可以计算成 `flex-grow:1` 在CSS中。

```jsx
<Flex>
  <Spacer grow="1" />
</Flex>
```

## 使用伪元素
---

> 使用伪元素创建间隔符。

```css
.element:after {
	content: "";
	display: block;
	height: 32px;
}
```

> 可以选择通过一个伪元素而不是一个单独的元素来添加间隔器

```jsx
<Header spacer="below" type="pseudo" length="32">
  <Logo />
  <Link>Home</Link>
  <Link>About</Link>
  <Link>Contact</Link>
</Header>
```

## CSS数学函数：Min()，Max()，Clamp()
---

> 动态间距

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: min(2vmax, 32px);
}
```

下面是 `min(2vmax，32px)` 的意思：使用一个等于 `2vmax` 的间隙，但不能超过 `32px`。

<a data-fancybox title="示例" href="/notes/assets/css/1591002963675813.jpg">![示例](/notes/assets/css/1591002963675813.jpg)</a>