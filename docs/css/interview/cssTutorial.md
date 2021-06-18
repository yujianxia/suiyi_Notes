#
# css优先级：

!important > 行内样式 > ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性。

# 常用的css不可继承的属性

`display`：规定元素应该生成的框的类型

`text-decoration`：规定添加到文本的装饰

`text-shadow`：文本阴影效果

`white-space`：空白符的处理

盒子模型的属性：`width`、`height`、`margin` `、``border`、`padding`

背景属性：`background`

定位属性：`float`、`clear`、`position`、`top`、`right`、`bottom`、`left`、`min-width`、`min-height`、`max-width`、`max-height`、`overflow`、`clip`、`z-index`

# 常用的css可继承的属性：

`font`：组合字体

`font-family`：规定元素的字体系列

`font-weight`：设置字体的粗细

`font-size`：设置字体的尺寸

`font-style`：定义字体的风格

`text-indent`：文本缩进

`text-align`：文本水平对齐

`line-height`：行高

`color`：文本颜色

`visibility`：元素可见性

光标属性：`cursor`

# 所有元素可以继承的

1. 元素可见性：`visibility`

2. 光标属性：`cursor`

# 内联元素可以继承的属性

1. `字体`系列属性

2. 除`text-indent`、`text-align`之外的文本系列属性

# 块级元素可以继承的属性

`text-indent`、`text-align`

# inherit（继承）值

每一个属性可以指定值为“`inherit`”，即：对于给定的元素，该属性和它父元素相对属性的计算值取一样的值。继承值通常只用作后备值，它可以通过显式地指定“`inherit`”而得到加强，例如：

```css
p { font-size: inherit; }
```

# 继承的局限性

继承虽然减少了重复定义的麻烦，但是，有些属性是不能继承的，例如`border（边框）`、`margin（边距）`、`padding（补白）`和背景等。

这样设定是有道理的，例如，为一个设定了边框，如果此属性也继承的话，那么在这个

内所有的元素都会有边框，这无疑会产生一个让人眼花缭乱的结果。同样的，影响元素位置的属性，例如`margin（边距）`和`padding（补白）`，也不会被继承。

同时，浏览器的缺省样式也在影响着继承的结果。例如：

```css
body { font-size: 12px; }
```

`<h2>`2级标题的文字不是12px。//`</h2>`H2中文字将是标题2样式的文字而非12px大小的文字。

这是因为浏览器的缺省样式设定了的CSS规则。

同时，有些老版本的浏览器可能对继承支持的不太好，例如某些浏览器当遇到`<table>`的时候，就会丢失所有的继承的属性。

**css属性一旦继承了不能被取消，只能重新定义样式。**

## CSS哪些属性可以继承？

css继承特性主要是指文本方面的继承，盒模型相关的属性基本没有继承特性。

## 不可继承的：

`display`、`margin`、`border`、`padding`、`background`、`height`、`min-height`、`max-height`、`width`、`min-width`、`max-width`、`overflow`、`position`、`top`、`bottom`、`left`、`right`、`z-index`、`float`、`clear`、` table-layout`、`vertical-align`、`page-break-after`、`page-bread-before`和`unicode-bidi`。

## 所有元素可继承的：

`visibility`和`cursor`

## 终极块级元素可继承的：

`text-indent`和`text-align`

## 内联元素可继承的：

`letter-spacing`、`word-spacing`、`white-space`、`line-height`、`color`、`font`、`font-family`、`font-size`、`font-style`、`font-variant`、`font-weight`、`text-decoration`、`text-transform`、`direction`

## 列表元素可继承的：

`list-style`、`list-style-type`、`list-style-position`、`list-style-image`