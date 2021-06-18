# 类选择器

# 概述

在一个HTML文档中，CSS类选择器会根据元素的类属性中的内容匹配元素。`类属性被定义为一个以空格分隔的列表项，在这组类名中，必须有一项与类选择器中的类名完全匹配，此条样式声明才会生效。`

# 语法

```
.类名 {样式声明 }
```

注意它与下面的语句等价  `attribute selector`:

```
[class~=类名] {样式声明 }
```

# 示例

```css
span.classy {
  background-color: DodgerBlue;
}
```

> 上面的CSS作用于下面的HTML代码:

```html
<span class="classy">Here's a span with some text.</span>
<span>Here's another.</span>
```

> 则会产生这样的效果:

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617673047(1).jpg">![demo](/notes/assets/mozillaCss/1617673047(1).jpg)</a>