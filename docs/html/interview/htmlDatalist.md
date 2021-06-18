#
# HTML 5 datalist 标签

## 定义和用法

`<datalist>` 标签定义选项列表。请与 `input` 元素配合使用该元素，来定义 `input` 可能的值。

`datalist` 及其选项不会被显示出来，它仅仅是合法的输入值列表。

请使用 `input` 元素的 `list` 属性来绑定 `datalist`。

---

## 实例

> 下面是一个 input 元素，datalist 中描述了其可能的值：

```html
<input id="myCar" list="cars" />
<datalist id="cars">
  <option value="BMW">
  <option value="Ford">
  <option value="Volvo">
</datalist>
```

**浏览器支持**

目前只有 Firefox 和 Opera 支持 `<datalist>` 标签。

---

HTML 4.01 与 HTML 5 之间的差异
`<datalist>` 标签是 HTML 5 中的新标签。

**全局属性**

`<datalist>` 标签支持 HTML 5 中的全局属性。

**事件属性**

`<datalist>` 标签支持 HTML 5 中的事件属性。