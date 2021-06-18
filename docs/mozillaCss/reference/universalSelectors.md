# 通配选择器

# 概述

在CSS中,一个星号(`*`)就是一个通配选择器.它可以匹配任意类型的HTML元素.在配合其他简单选择器的时候,省略掉通配选择器会有同样的效果.比如,`*.warning` 和`.warning` 的效果完全相同.

在CSS3中,星号(`*`)可以和命名空间组合使用:

* `ns|*` - 会匹配ns命名空间下的所有元素

* `*|*` - 会匹配所有命名空间下的所有元素

* `|*` - 会匹配所有没有命名空间的元素

# 示例

```css
*[lang^=en]{color:green;}
*.warning {color:red;}
*#maincontent {border: 1px solid blue;}
```

上面的CSS作用于下面的HTML:

```html
<p class="warning">
  <span lang="en-us">A green span</span> in a red paragraph.
</p>
<p id="maincontent" lang="en-gb">
  <span class="warning">A red span</span> in a green paragraph.
</p>
```

则会产生这样的效果:

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617672495(1).jpg">![demo](/notes/assets/mozillaCss/1617672495(1).jpg)</a>

> 注: 笔者不推荐使用通配选择器,因为它是性能最低的一个CSS选择器