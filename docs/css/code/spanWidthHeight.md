```html
<div style="width:400px;height:200px;">
  <span style="float:left;width:auto;height:100%;">
    <i style="position:absolute;float:left;width:100px;height:50px;">hello</i>
  </span>
</div>
```

**思路**
---

首先，在W3C标准解析中，float 会使元素脱离文档流，并且浮动元素会生成一个块级框，而不论它是块级或者行内元素

对于这个块级框是这样理解的：它把这个元素变成了一个（类似）行内块级元素，也就是inline-block，当你把题中float: left; 替换为 display: inline-block;

你会发现，会有一样的结果，为什么说类似呢，因为inline-block 元素之间会默认产生空白符，而float 之间却没有

既然和inline-block 类似，那么当然可以设置宽高了，虽然float 使元素脱离文档流，但是并不影响div 仍然是它的父元素

因此.height: 100%;也就是继承了父元素的高度，200px

而width: auto;其实是坑人的，因为元素的默认width 就是auto，而inline-block 元素的宽是内容宽度

这个时候看子元素`<i>`,它设置了position: absolute;同样脱离的文档流，它并不会影响父元素，所以span 的width:0px;

> 简而言之： 给 span 添加 float:left 会触发浏览器 BFC