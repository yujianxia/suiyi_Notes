# 伪元素

# 概述

伪元素是一个附加至选择器末的关键词，允许你对被选择元素的特定部分修改样式。下例中的 `::first-line` 伪元素可改变段落首行文字的样式。

```css
/* 每一个 <p> 元素的第一行。 */
p::first-line {
  color: blue;
  text-transform: uppercase;
}
```

> **注意：**与伪元素比较，`pseudo-classes` 能够根据状态改变元素样式。

# 语法

```
selector::pseudo-element {
  property: value;
}
```

> 一个选择器中只能使用一个伪元素。伪元素必须紧跟在语句中的简单选择器/基础选择器之后。
> 
> **注意：**按照规范，应该使用双冒号（`::`）而不是单个冒号（`:`），以便区分伪类和伪元素。但是，由于旧版本的 W3C 规范并未对此进行特别区分，因此目前绝大多数的浏览器都同时支持使用这两种方式来表示伪元素。

# /::after (:after)

## 概述

CSS伪元素`::after`用来创建一个伪元素，作为已选中元素的最后一个子元素。通常会配合`content`属性来为该元素添加装饰内容。这个虚拟元素默认是行内元素。

```css
/* Add an arrow after links */
a::after {
  content: "→";
}
```

> Firefox 3.5之前版本仅实现了CSS 2.0版本的语法 `:after`. 且不允许在 `position`, `float`, `list-style-*` 等属性中使用。Firefox 3.5开始没有了这项限制。

## 语法

```
element:after  { style properties }  /* CSS2 语法 */

element::after { style properties }  /* CSS3 语法 */
```

`::after`表示法是在CSS 3中引入的，::符号是用来区分`伪类`和`伪元素`的。支持CSS3的浏览器同时也都支持CSS2中引入的表示法`:after`。

> **注:** IE8仅支持`:after`。

## 示例

**简单用法**

让创建两个类：一个无趣的和一个有趣的。可以在每个段尾添加伪元素来标记他们。

```html
<p class="boring-text">这是些无聊的文字</p>
<p>这是不无聊也不有趣的文字</p>
<p class="exciting-text">在MDN上做贡献简单又轻松。
按右上角的编辑按钮添加新示例或改进旧示例！</p>
```

```css
.exciting-text::after {
  content: "<- 让人兴兴兴奋!";
  color: green;
}

.boring-text::after {
   content:    "<- 无聊!";
   color:      red;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617764370(1).jpg">![demo](/notes/assets/mozillaCss/1617764370(1).jpg)</a>

**装饰用法**

几乎可以用想要的任何方法给`content`属性里的文字和图片的附加样式。

```html
<span class="ribbon">Notice where the orange box is.</span>
```

```css
.ribbon {
  background-color: #5BC8F7;
}

.ribbon::after {
  content: "Look at this orange box.";
  background-color: #FFBA10;
  border-color: black;
  border-style: dotted;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617765740(1).jpg">![demo](/notes/assets/mozillaCss/1617765740(1).jpg)</a>

**提示用法**

接下来的示例展示了用`::after` `伪元素`，`attr()`CSS表达式和一个<u>自定义数据属性</u> `data-descr` 创建了一个纯CSS，词汇表提示工具。在<u>单独页面</u>看这个例子。

```html
<p>这是上面代码的实现<br />
  有一些 <span data-descr="collection of words and punctuation">文字</span> 有一些
  <span data-descr="small popups which also hide again">提示</span>。<br />
  把鼠标放上去<span data-descr="not to be taken literally">看看</span>.
</p>
```

```css
span[data-descr] {
  position: relative;
  text-decoration: underline;
  color: #00F;
  cursor: help;
}

span[data-descr]:hover::after {
  content: attr(data-descr);
  position: absolute;
  left: 0;
  top: 24px;
  min-width: 200px;
  border: 1px #aaaaaa solid;
  border-radius: 10px;
  background-color: #ffffcc;
  padding: 12px;
  color: #000000;
  font-size: 14px;
  z-index: 1;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617765999(1).jpg">![demo](/notes/assets/mozillaCss/1617765999(1).jpg)</a>

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617772337(1).jpg">![demo](/notes/assets/mozillaCss/1617772337(1).jpg)</a>

# ::before (:before)

## 概述

CSS中，`::before` 创建一个<u>伪元素</u>，其将成为匹配选中的元素的第一个子元素。常通过 `content` 属性来为一个元素添加修饰性的内容。此元素默认为行内元素。

```css
/* Add a heart before links */
a::before {
  content: "♥";
}
```

> **注意:** 由`::before` 和`::after` 生成的伪元素 `包含在元素格式框内`， 因此不能应用在**替换元素**上， 比如`<img>`或`<br>` 元素。

## 语法

```
/* CSS3 语法 */
element::before { 样式 }

/* （单冒号）CSS2 过时语法 (仅用来支持 IE8) */
element:before  { 样式 }

/* 在每一个p元素前插入内容 */
p::before { content: "Hello world!"; } 
```

CSS3 引入 `::before` 是为了将<u>伪类</u>和<u>伪元素</u>区别开来。浏览器也接受由CSS 2 引入的 `:before` 写法。

## 示例

**加入引用标记**

使用 `::before` 伪元素的一个简单示例就是用于加入引号。此处同时使用了 `::before` 和 

来插入引用性文本。

```html
<q>一些引用</q>, 他说, <q>比没有好。</q>.
```

```css
q::before {
  content: "«";
  color: blue;
}
q::after {
  content: "»";
  color: red;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617773106(1).jpg">![demo](/notes/assets/mozillaCss/1617773106(1).jpg)</a>

**修饰实例**

```html
<span class="ribbon">Notice where the orange box is.</span>
```

```css
.ribbon {
   background-color: #5BC8F7;
}

.ribbon::before {
   content:          "Look at this orange box.";
   background-color: #FFBA10;
   border-color:     black;
   border-style:     dotted;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783650(1).jpg">![demo](/notes/assets/mozillaCss/1617783650(1).jpg)</a>

**待办列表**

```html
<ul>
  <li>Buy milk</li>
  <li>Take the dog for a walk</li>
  <li>Exercise</li>
  <li>Write code</li>
  <li>Play music</li>
  <li>Relax</li>
</ul>
```

```css
li {
  list-style-type: none;
  position: relative;
  margin: 2px;
  padding: 0.5em 0.5em 0.5em 2em;
  background: lightgrey;
  font-family: sans-serif;
}

li.done {
  background: #CCFF99;
}

li.done::before {
  content: '';
  position: absolute;
  border-color: #009933;
  border-style: solid;
  border-width: 0 0.3em 0.25em 0;
  height: 1em;
  top: 1.3em;
  left: 0.6em;
  margin-top: -1em;
  transform: rotate(45deg);
  width: 0.5em;
}
```

```javascript
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if( ev.target.tagName === 'LI') {
     ev.target.classList.toggle('done');
  }
}, false);
```

下面展示的是最终得到的结果。请注意没有使用任何图标，对勾标识实际上是使用 CSS 定义了样式的 `::before` 伪元素。接下来建立几个待办事项来完成它们吧。

## 结果

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783707(1).jpg">![demo](/notes/assets/mozillaCss/1617783707(1).jpg)</a>

**注释**

```html
<div class="example">
<span id="floatme">"Floated Before" should be generated on the left of the
viewport and not allow overflow in this line to flow under it. Likewise
should "Floated After" appear on the right of the viewport and not allow this
line to flow under it.</span>
</div>
```

```css
#floatme { float: left; width: 50%; }

/* To get an empty column, just indicate a hex code for a non-breaking space: \a0 as the content (use \0000a0 when following such a space with other characters) */
.example::before {
  content: "Floated Before";
  float: left;
  width: 25%
}
.example::after {
  content: "Floated After";
  float: right;
  width:25%
}

/* For styling */
.example::before, .example::after{
  background: yellow;
  color: red;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783858(1).jpg">![demo](/notes/assets/mozillaCss/1617783858(1).jpg)</a>

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783892(1).jpg">![demo](/notes/assets/mozillaCss/1617783892(1).jpg)</a>

# /::selection

## 概述

`::selection` CSS伪元素应用于文档中被用户高亮的部分（比如使用鼠标或其他选择设备选中的部分）。

```css
::selection {
  background-color: cyan;
}
```

## 允许属性

只有一小部分CSS属性可以用于`::selection` 选择器：

* color

* background-color

* cursor

* caret-color

* outline and its longhands

* text-decoration and its associated properties

* text-emphasis-color (en-US)

* text-shadow

> 要特别注意的是，`background-image` 会如同其他属性一样被忽略。

## 语法

```
/* Legacy Firefox syntax (version 61 and below) */
::-moz-selection

    ::selection
```

## 示例

```html
This text has special styles when you highlight it.
<p>Also try selecting text in this paragraph.</p>
```

```css
::-moz-selection {
  color: gold;
  background-color: red;
}

p::-moz-selection {
  color: white;
  background-color: blue;
}
```

```css
/* 选中的文本是红色背景，金黄色的字体 */
::selection {
  color: gold;
  background-color: red;
}

/*选中的是蓝色背景，白色的字体的段落*/
p::selection {
  color: white;
  background-color: blue;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783858(1).jpg">![demo](/notes/assets/mozillaCss/1617783858(1).jpg)</a>

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783892(1).jpg">![demo](/notes/assets/mozillaCss/1617783892(1).jpg)</a>

# /::slotted()

## 概述

`:slotted()` <u>CSS 伪元素</u> 用于选定那些被放在 HTML模板 中的元素 (更多请查看 使用模板和插槽).

这个伪类选择器仅仅适用于 <u>影子节点树(Shadow Dom)</u>. 并且只会选择实际的元素节点， 而不包括文本节点.

```css
/* Selects any element placed inside a slot */
::slotted(*) {
  font-weight: bold;
}

/* Selects any <span> placed inside a slot */
::slotted(span) {
  font-weight: bold;
}
```

## 语法

```
::slotted( <compound-selector-list> )
```

## 例子

```html
<template id="person-template">
  <div>
    <h2>Personal ID Card</h2>
    <slot name="person-name">NAME MISSING</slot>
    <ul>
      <li><slot name="person-age">AGE MISSING</slot></li>
      <li><slot name="person-occupation">OCCUPATION MISSING</slot></li>
    </ul>
  </div>
</template>
```

> 自定义元素 `<person-details>` 的定义如下:

```javascript
customElements.define('person-details',
  class extends HTMLElement {
    constructor() {
      super();
      let template = document.getElementById('person-template');
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({mode: 'open'});

      let style = document.createElement('style');
      style.textContent = 'div { padding: 10px; border: 1px solid gray; width: 200px; margin: 10px; }' +
                           'h2 { margin: 0 0 10px; }' +
                           'ul { margin: 0; }' +
                           'p { margin: 10px 0; }' +
                           '::slotted(*) { color: gray; font-family: sans-serif; } ';

      shadowRoot.appendChild(style);
      shadowRoot.appendChild(templateContent.cloneNode(true));
  }
})
```

为了更好地区分**未被成功填充的插槽**和**成功填充的插槽**, 在CSS中选择了所有的插槽元素(`::slotted(*)`), 并填充了不一样的颜色和字体. 结果也是如此.

元素就像如下被填充了起来:

```html
<person-details>
  <p slot="person-name">Dr. Shazaam</p>
  <span slot="person-age">Immortal</span>
  <span slot="person-occupation">Superhero</span>
</person-details>
```

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617782663(1).jpg">![demo](/notes/assets/mozillaCss/1617782663(1).jpg)</a>