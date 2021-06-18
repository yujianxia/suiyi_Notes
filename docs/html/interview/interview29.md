标准盒模型：

* 元素内容宽度=width，元素实际宽度=margin2+border2+padding2+width

怪异盒模型：

* 元素内容宽度=width-border2-padding2，元素实际宽度=margin2+border2+padding2+width=margin2+width

其实没啥用：

* 可以看到很多网站都使用 * { box-sizing: border-box; } 这个样式，因为浏览器默认是标准模式，也就是 content-box , 而大家其实更习惯使用怪异模式