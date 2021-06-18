# 元素选择器

# 概述

CSS元素选择器(也称为类型选择器)通过node节点名称匹配元素. 因此,在单独使用时,寻找特定类型的元素时,元素选择器都会匹配该文档中所有此类型的元素.

# 语法

```
元素 {样式声明 }
```

# 示例

> CSS

```css
span {
  background-color: DodgerBlue;
  color: #ffffff;
}
```

> HTML

```html
<span>这里是由 span 包裹的一些文字.</span>
<p>这里是由 p 包裹的一些文字.</p>
```

> 效果

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617672836(1).jpg">![demo](/notes/assets/mozillaCss/1617672836(1).jpg)</a>

