# 相邻兄弟选择器

**相邻兄弟选择器** (`+`) 介于两个选择器之间，当第二个元素紧跟在第一个元素之后，并且两个元素都是属于同一个`父元素`的子元素，则第二个元素将被选中。

```css
/* 图片后面紧跟着的段落将被选中 */
img + p {
  font-style: bold;
}
```

# 语法

```
former_element + target_element { style properties }
```

# 示例

> CSS

```css
li:first-of-type + li {
  color: red;
}
```

> HTML

```html
<ul>
  <li>One</li>
  <li>Two!</li>
  <li>Three</li>
</ul>
```

# 结果

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617678864(1).jpg">![demo](/notes/assets/mozillaCss/1617678864(1).jpg)</a>

# 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617678910(1).jpg">![demo](/notes/assets/mozillaCss/1617678910(1).jpg)</a>
