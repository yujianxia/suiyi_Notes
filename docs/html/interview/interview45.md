该行为由 CSS white-space 控制，其默认值 normal 的表现即为多个空格压缩成一个。

**定义和用法**
---
`white-space` 属性设置如何处理元素内的空白。

这个属性声明建立布局过程中如何处理元素中的空白符。值 pre-wrap 和 pre-line 是 CSS 2.1 中新增的。

| 默认值： | normal |
| ---- | ---- |
| 继承性： | yes |
| 版本： | CSS1 |
| JavaScript 语法： | object.style.whiteSpace="pre" |

**可能的值**
---

| 值 | 描述 |
| ---- | ---- |
| normal | 默认。空白会被浏览器忽略。 |
| pre | 空白会被浏览器保留。其行为方式类似 HTML 中的 `<pre>` 标签。 |
| nowrap | 文本不会换行，文本会在在同一行上继续，直到遇到 `<br>` 标签为止。 |
| pre-wrap | 保留空白符序列，但是正常地进行换行。 |
| pre-line | 合并空白符序列，但是保留换行符。 |
| inherit | 规定应该从父元素继承 white-space 属性的值。 |
