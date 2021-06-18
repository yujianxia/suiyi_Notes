# 选择器列表

CSS**选择器列表**（`,`）选择所有匹配的节点。

```css
/* Selects all matching elements */
span,
div {
  border: red 2px solid;
}
```

为了减少样式表的大小，可以将选择器组合在以逗号分隔的列表中。

# 句法

```
element, element, element { style properties }
```

# 例子

## 单线分组

使用逗号分隔的列表将选择器分组在一行中。

```css
h1, h2, h3, h4, h5, h6 { font-family: helvetica; }
```

## 多线分组

使用逗号分隔的列表将选择器分为多行。

```css
#main,
.content,
article {
  font-size: 1.1em;
}
```

## 选择器列表无效

使用选择器列表的不利之处在于以下内容不等效：

```css
h1 { font-family: sans-serif }
h2:maybe-unsupported { font-family: sans-serif }
h3 { font-family: sans-serif }
```

```css
h1, h2:maybe-unsupported, h3 { font-family: sans-serif }
```

这是因为选择器列表中单个不受支持的选择器使整个规则无效。

为了解决这个问题，可以使用`:is()`or `:where()`选择器，它们接受宽容的选择器列表。这将忽略列表中的无效选择器，但接受有效的选择器。

```css
h1 { font-family: sans-serif }
h2:maybe-unsupported { font-family: sans-serif }
h3 { font-family: sans-serif }
```

```css
:is(h1, h2:maybe-unsupported, h3) { font-family: sans-serif }
```

# 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617674781(1).jpg">![demo](/notes/assets/mozillaCss/1617674781(1).jpg)</a>