置换元素（Replaced Element）
---

> 简单来说，置换元素可以设置宽 高,他们有自己的属性，和inline-block有一样的属性

* 主要是指 img、input、textarea、select、object 等这类默认就有 CSS 格式化外表范围的元素。

* 浏览器根据元素的标签和属性，来决定元素的具体显示内容

* 例如：浏览器根据标签的src属性显示图片。根据type属性决定显示输入框还是按钮

    script
    img
    video
    audio
    picture
    iframe

非置换元素（non-Replaced Element）:
---

* 就是除了 img、input、textarea、select、object 等置换元素以外的元素。

* 内容直接展示给浏览器。例如标签，标签里的内容会被浏览器直接显示给用户