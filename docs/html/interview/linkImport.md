**常规区别**
---

* 1.link是HTML标签，@import是css提供的。

* 2.link引入的样式页面加载时同时加载，@import引入的样式需等页面加载完成后再加载。

* 3.link没有兼容性问题，@import不兼容ie5以下。

* 4.link可以通过js操作DOM动态引入样式表改变样式，而@import不可以。

**从细节进行区分**
---

* 1）从属关系的区别：link属于XHTML标签，而@import是CSS提供的语法规则，link除了加载CSS，还可以定义RSS，定义rel连接属性等，@import就只能加载CSS。

* 2）加载顺序的区别：页面加载时，link会同时被加载，而@import引用的CSS会等页面被加载完后再加载。

* 3）兼容性的区别：@import只有IE5以上才能被识别，而link是XHTML标签，无兼容问题。

* 4）DOM可控性区别：通过js操作DOM,可以插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import方式插入样式

* 5）权重区别(争议)：`@import`一定要写在除`@charset`外的其他任何 CSS 规则之前，如果置于其它位置将会被浏览器忽略，而且，在`@import`之后如果存在其它样式，则`@import`之后的分号是必须书写，不可省略的。

**浏览器执行过程**
---

* **加载**：根据请求的URL进行域名解析，向服务器发送请求，接收响应文件（如 HTML、JS、CSS、图片等）。

* **解析**：对加载到的资源（HTML、JS、CSS等）进行语法解析，构建相应的内部数据结构（比如HTML的DOM树，JS对象的属性表，CSS的样式规则等）。

* **渲染**：构建渲染树，对各个元素进行位置计算、样式计算等，然后根据渲染树完成页面布局及绘制的过程（可以理解为“画”页面元素）。

**渲染**
---

`link`先于`@import`加载，是不是也先于`@import`渲染呢？

实际上，渲染的动作一般都会执行多次，最后一次渲染，一定是依据之前加载过的所有样式整合后的渲染树进行绘制页面的，已经被渲染过的页面元素，也会被重新渲染。

那么就可以把`@import`这种导入 CSS 文件的方式理解成一种替换，`CSS` 解析引擎在对一个 `CSS` 文件进行解析时，如在文件顶部遇到@import，将被替换为该`@import`导入的 CSS 文件中的全部样式。

峰回路转，柳暗花明，终于弄明白为何`@import`引入的样式，会被层叠掉了。其虽然后被加载，却会在加载完毕后置于样式表顶部，最终渲染时自然会被下面的同名样式层叠。

# css有四种引入方式

## 方式一： 内联样式

内联样式，也叫行内样式，指的是直接在 HTML 标签中的 style 属性中添加 CSS。

示例：

```html
<div style="display: none;background:red"></div>
```

## 方式二： 嵌入样式
嵌入方式指的是在 HTML 头部中的 `<style>` 标签下书写 CSS 代码

示例：

```html
<head>
    <style>

    .content {
        background: red;
    }

    </style>
</head>
```

## 方式三：链接样式

链接方式指的是使用 HTML 头部的 标签引入外部的 CSS 文件

示例：

```html
<head>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
```

这是最常见的也是最推荐的引入 CSS 的方式。使用这种方式，所有的 CSS 代码只存在于单独的 CSS 文件中，所以具有良好的可维护性。并且所有的 CSS 代码只存在于 CSS 文件中，CSS 文件会在第一次加载时引入，以后切换页面时只需加载 HTML 文件即可。

## 方式四：导入样式

导入方式指的是使用 CSS 规则引入外部 CSS 文件

```html
<style>
    @import url(style.css);
</style>
```

```css
@charset "utf-8";
@import url(style.css);
*{ margin:0; padding:0;}
.notice-link a{ color:#999;}
```