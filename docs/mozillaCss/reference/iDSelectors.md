# ID 选择器

在一个HTML文档中,CSS ID 选择器会根据该元素的 ID 属性中的内容匹配元素,元素 ID 属性名必须与选择器中的 ID 属性名完全匹配，此条样式声明才会生效。

```css
/* The element with id="demo" */
#demo {
  border: red 2px solid;
}
```

# 语法

```
#id属性值 {样式声明 }
```

> 下面的`属性选择器`语句等价：

```
[id=id属性值] {样式声明 }
```

# 示例

> CSS

```css
span#identified {
  background-color: DodgerBlue;
}
```

> HTML

```HTML
<span id="identified">Here's a span with some text.</span>
<span>Here's another.</span>
```

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617673434(1).jpg">![demo](/notes/assets/mozillaCss/1617673434(1).jpg)</a>
