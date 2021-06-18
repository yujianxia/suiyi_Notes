# 子选择器

# 概述

当使用  `>` 选择符分隔两个元素时,它只会匹配那些作为第一个元素的**直接后代**(子元素)的第二元素. 与之相比, 当两个元素由 `后代选择器` 相连时, 它表示匹配存在的所有由第一个元素作为祖先元素(但不一定是父元素)的第二个元素, 无论它在 DOM 中"跳跃" 多少次.

# 语法

```
元素1 > 元素2 {样式声明 }
```

# 示例

> CSS

```css
span { background-color: white; }
div > span {
  background-color: DodgerBlue;
}
```

> HTML

```html
<div>
  <span>Span 1. In the div.
    <span>Span 2. In the span that's in the div.</span>
  </span>
</div>
<span>Span 3. Not in a div at all</span>
```

# 结果

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617679332(1).jpg">![demo](/notes/assets/mozillaCss/1617679332(1).jpg)</a>