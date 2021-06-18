# 伪类

# 概述

CSS **伪类** 是添加到选择器的关键字，指定要选择的元素的特殊状态。例如，`:hover` 可被用于在用户将鼠标悬停在按钮上时改变按钮的颜色。

```css
/* 所有用户指针悬停的按钮 */
button:hover {
  color: blue;
}
```

伪类连同伪元素一起，他们允许你不仅仅是根据文档 DOM 树中的内容对元素应用样式，而且还允许你根据诸如像导航历史这样的外部因素来应用样式（例如 `:visited`），同样的，可以根据内容的状态（例如在一些表单元素上的 `:checked`），或者鼠标的位置（例如 `:hover` 让你知道是否鼠标在一个元素上悬浮）来应用样式。

> **注意：** 与伪类相反，`pseudo-elements` 可被用于为一个元素的 *特定部分* 应用样式。

# 语法

```
selector:pseudo-class {
  property: value;
}
```

# /:active

CSS **`:active`** 伪类匹配被用户激活的元素。它让页面能在浏览器监测到激活时给出反馈。当用鼠标交互时，它代表的是用户按下按键和松开按键之间的时间。

```css
/* Selects any <a> that is being activated */
a:active {
  color: red;
}
```

`:active` 伪类一般被用在 `<a>` 和 `<button>` 元素中. 这个伪类的一些其他适用对象包括包含激活元素的元素，以及可以通过他们关联的`<label>`标签被激活的表格元素。

这个样式可能会被后声明的其他链接相关的伪类覆盖，这些伪类包括 `:link`，`:hover` 和 `:visited`。为保证样式生效，需要把 `:active` 的样式放在所有链接相关的样式之后。这种链接伪类先后顺序被称为 **LVHA** 顺序：`:link` — `:visited` — `:hover` — `:active`。

> **注意:** 在有多键鼠标的系统中，CSS 3 规定 `:active` 伪类必须只匹配主按键；对于右手操作鼠标来说，就是左键。

## 语法

```
:active
```

## 示例

**激活链接**

```html
<p>This paragraph contains a link:
  <a href="#">This link will turn red while you click on it.</a>
  The paragraph will get a gray background while you click on it or the link.
</p>
```

```css
a:link { color: blue; }          /* 未访问链接 */
a:visited { color: purple; }     /* 已访问链接 */
a:hover { background: yellow; }  /* 用户鼠标悬停 */
a:active { color: red; }         /* 激活链接 */

p:active { background: #eee; }   /* 激活段落 */
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617758373(1).jpg">![demo](/notes/assets/mozillaCss/1617758373(1).jpg)</a>

**激活表单元素**

```html
<form>
  <label for="my-button">My button: </label>
  <button id="my-button" type="button">Try Clicking Me or My Label!</button>
</form>
```

```css
form :active {
  color: red;
}

form button {
  background: white;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617758477(1).jpg">![demo](/notes/assets/mozillaCss/1617758477(1).jpg)</a>

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617758527(1).jpg">![demo](/notes/assets/mozillaCss/1617758527(1).jpg)</a>

# /:checked

## 概述

`:checked` CSS 伪类选择器表示任何处于选中状态的**radio**(`<input type="radio">`), **checkbox** (`<input type="checkbox">`) 或("select") 元素中的**option** HTML元素("option")。

```css
/* 匹配任意被勾选/选中的radio(单选按钮),checkbox(复选框),或者option(select中的一项) */
:checked {
  margin-left: 25px;
  border: 1px solid blue;
} 
```

用户通过勾选/选中元素或取消勾选/取消选中，来改变该元素的 :checked 状态。

> 因为浏览器经常将`<option>`视为**可替换元素**,因此不同的浏览器通过`:checked`伪类渲染出来的效果也不尽相同.

## 语法

```
:checked
```

## 示例

**基础示例**

```html
<div>
  <input type="radio" name="my-input" id="yes">
  <label for="yes">Yes</label>

  <input type="radio" name="my-input" id="no">
  <label for="no">No</label>
</div>

<div>
  <input type="checkbox" name="my-checkbox" id="opt-in">
  <label for="opt-in">Check me!</label>
</div>

<select name="my-select" id="fruit">
  <option value="opt1">Apples</option>
  <option value="opt2">Grapes</option>
  <option value="opt3">Pears</option>
</select>
```

```css
div,
select {
  margin: 8px;
}

/* Labels for checked inputs */
input:checked + label {
  color: red;
}

/* Radio element, when checked */
input[type="radio"]:checked {
  box-shadow: 0 0 0 3px orange;
}

/* Checkbox element, when checked */
input[type="checkbox"]:checked {
  box-shadow: 0 0 0 3px hotpink;
}

/* Option elements, when selected */
option:checked {
  box-shadow: 0 0 0 3px lime;
  color: red;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617758995(1).jpg">![demo](/notes/assets/mozillaCss/1617758995(1).jpg)</a>

**借用隐藏的checkbox来切换元素的样式（显示/隐藏）**

```html
<input type="checkbox" id="expand-toggle" />

<table>
  <thead>
    <tr><th>Column #1</th><th>Column #2</th><th>Column #3</th></tr>
  </thead>
  <tbody>
    <tr class="expandable"><td>[more text]</td><td>[more text]</td><td>[more text]</td></tr>
    <tr><td>[cell text]</td><td>[cell text]</td><td>[cell text]</td></tr>
    <tr><td>[cell text]</td><td>[cell text]</td><td>[cell text]</td></tr>
    <tr class="expandable"><td>[more text]</td><td>[more text]</td><td>[more text]</td></tr>
    <tr class="expandable"><td>[more text]</td><td>[more text]</td><td>[more text]</td></tr>
  </tbody>
</table>

<label for="expand-toggle" id="expand-btn">Toggle hidden rows</label>
```

```css
/* Hide the toggle checkbox */
#expand-toggle {
  display: none;
}

/* Hide expandable content by default */
.expandable {
  visibility: collapse;
  background: #ddd;
}

/* Style the button */
#expand-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 5px 11px;
  background-color: #ff7;
  border: 1px solid;
  border-radius: 3px;
}

/* Show hidden content when the checkbox is checked */
#expand-toggle:checked ~ * .expandable {
  visibility: visible;
}

/* Style the button when the checkbox is checked */
#expand-toggle:checked ~ #expand-btn {
  background-color: #ccc;
}
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617759350(1).jpg">![demo](/notes/assets/mozillaCss/1617759350(1).jpg)</a>

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617761077.jpg">![demo](/notes/assets/mozillaCss/1617761077.jpg)</a>

# /:default

## 概述

 **`:default`** `CSS` `pseudo-class` 表示一组相关元素中的默认表单元素。

该选择器可以在 `<button>`, `<input type="checkbox">`, `<input type="radio">`, 以及 `<option>` 上使用。

```css
/* Selects any default <input> */
input:default {
  background-color: lime;
}
```

允许多个选择的分组元素也可以具有多个默认值，即，它们可以具有最初选择的多个项目。在这种情况下，所有默认值都使用 `:default` 伪类表示。例如，您可以在一组复选框之间设置默认复选框。

## 语法

```
:default
```

## 示例

```html
<input type="radio" name="season" id="spring">
<label for="spring">Spring</label>

<input type="radio" name="season" id="summer" checked>
<label for="summer">Summer</label>

<input type="radio" name="season" id="fall">
<label for="fall">Fall</label>

<input type="radio" name="season" id="winter">
<label for="winter">Winter</label>
```

```css
input:default {
  box-shadow: 0 0 2px 1px coral;
}

input:default + label {
  color: coral;
}
```

## 结果

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617763059(1).jpg">![demo](/notes/assets/mozillaCss/1617763059(1).jpg)</a>

# /:defined

## 概念

`:defined` `CSS` 伪类 表示任何已定义的元素。这包括任何浏览器内置的标准元素以及已成功定义的自定义元素 (例如通过 `CustomElementRegistry.define()` 方法)。

```css
/* 选择所有已定义的元素 */
:defined {
  font-style: italic;
}

/* 选择指定自定义元素的任何实例 */
simple-custom:defined {
  display: block;
}
```

## 语法

```
:defined
```

## 示例

```js
customElements.define('simple-custom',
  class extends HTMLElement {
    constructor() {
      super();

      let divElem = document.createElement('div');
      divElem.textContent = this.getAttribute('text');

      let shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(divElem);
  }
})
```

> 然后在文档中插入一个该元素的副本，以及一个标准的 `<p>` 标签:

```html
<simple-custom text="Custom element example text"></simple-custom>

<p>Standard paragraph example text</p>
```

> 在 CSS 中首先包含以下规则:

```css
// 为两个元素设置不同的背景色
p {
  background: yellow;
}

simple-custom {
  background: cyan;
}

// 将自定义元素和内置元素的字体都设为斜体
:defined {
  font-style: italic;
}
```

> 然后提供以下两个规则来隐藏未定义的自定义元素的所有实例，并显示被定义为块级元素的实例：

```css
simple-custom:not(:defined) {
  display: none;
}

simple-custom:defined {
  display: block;
}
```

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617763540(1).jpg">![demo](/notes/assets/mozillaCss/1617763540(1).jpg)</a>