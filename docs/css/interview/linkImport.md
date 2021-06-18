#
# 结论

就结论而言，强烈建议使用`link`标签，慎用`@import`方式。

这样可以避免考虑`@import`的语法规则和注意事项，避免产生资源文件下载顺序混乱和http请求过多的烦恼。

# 区别

## 1.从属关系区别

* `@import`是 CSS 提供的语法规则，只有导入样式表的作用；

* `link`是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

## 2.加载顺序区别

> 加载页面时

* `link`标签引入的 CSS 被同时加载；

* `@import`引入的 CSS 将在页面加载完毕后被加载。

## 3.兼容性区别

* `@import`是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；

* `link`标签作为 HTML 元素，不存在兼容性问题。

## 4.DOM可控性区别

* 可以通过 JS 操作 DOM ，插入`link`标签来改变样式；

* 由于 DOM 方法是基于文档的，无法使用`@import`的方式插入样式。

## 5.权重区别(该项有争议，下文将详解)

`link`引入的样式权重大于`@import`引入的样式。

说到“权重”，有必要再解释一下：CSS 中的权重，指的是选择器的优先级。

CSS 选择器的权重高，即选择器的优先级高。
CSS 的优先级特性表现为，对同一 HTML 元素设置样式时，不同选择器的优先级不同，优先级低的样式将被高优先级的样式层叠掉。

CSS 权重优先级顺序简单表示为：

> !important > 行内样式 > ID > 类、伪类、属性 > 标签名 > 继承 > 通配符

数值假设分析：

| 选择器 | 权重 |
| ---- | ---- |
| 通配符 | 0 |
| 标签 | 1 |
| 类/伪类/属性 | 10 |
| ID | 100 |
| 行内样式 | 1000 |
| important | 1/0(无穷大) |

> 实例

> `green.css`
```css
/* `green.css` */
div {
    background-color: green;
    border: 3px solid red;
}

/* yellow.css */
div {
    background-color: yellow;
    border: 3px solid black;
}

/* blue.css */
`@import` url("`green.css`");
div{
    background-color: blue;
}
```

## 实例1：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!-- 实例1. `link`标签引入yellow.css，内联样式引入`green.css` -->
    <link rel="stylesheet" href="yellow.css">
    <style type="text/css">
        @import url("`green.css`");
    </style>
</head>
<body>
    <div style="width: 50px; height: 50px;"></div>
    <!-- 盒子为，绿色背景，红色边框，即`green.css`生效 -->
</body>
</html>
```

结果如下图：

<a data-fancybox title="示例" href="/notes/assets/css/1066727-20161129224109084-1675788619.png">![示例](/notes/assets/css/1066727-20161129224109084-1675788619.png)</a>

## 实例2：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!-- 实例2. 内联样式引入`green.css`，`link`标签引入yellow.css -->
    <style type="text/css">
        @import url("`green.css`");
    </style>
    <link rel="stylesheet" href="yellow.css">
</head>
<body>
    <div style="width: 50px; height: 50px;"></div>
    <!-- 盒子为黄色背景，黑色边框，即yellow.css生效 -->
</body>
</html>
```

结果如下图：

<a data-fancybox title="示例" href="/notes/assets/css/1066727-20161129224123287-1430983945.png">![示例](/notes/assets/css/1066727-20161129224123287-1430983945.png)</a>

对比实例1和实例2这两个正好相反的结果可知，`link`和`@import`并没有产生类似权重的效果，只是单纯的体现了CSS的层叠性，写在后面的样式，覆盖前面的样式。

## 实例3：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!-- 实例3. 内联样式引入`green.css`，内联样式中设置粉色背景 -->
    <style type="text/css">
        @import url("`green.css`");
        div {
            background-color: pink;
        }
    </style>
</head>
<body>
    <div style="width: 50px; height: 50px;"></div>
    <!-- 盒子为粉色背景，红色边框，即`green.css`已生效，但背景色被内联样式层叠为粉色 -->
</body>
</html>
```

结果如下图：

<a data-fancybox title="示例" href="/notes/assets/css/1066727-20161129224140756-131460175.png">![示例](/notes/assets/css/1066727-20161129224140756-131460175.png)</a>

## 实例4：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <!-- 实例4. `link`标签引入blue.css，blue.css中引入`green.css` -->
    <link rel="stylesheet" href="blue.css">
</head>
<body>
    <div style="width: 50px; height: 50px;"></div>
    <!-- 盒子为蓝色背景，红色边框，即`green.css`已生效，但背景色被blue.css层叠为蓝色 -->
</body>
</html>
```

结果如下图：

<a data-fancybox title="示例" href="/notes/assets/css/1066727-20161129224157912-969350911.png">![示例](/notes/assets/css/1066727-20161129224157912-969350911.png)</a>

分析实例3和实例4的结果可知：

对于实例3，看到红色边框，证明内联样式中使用`@import`引入的`green.css`已经生效，但其背景样式被内联样式中的粉色背景层叠掉，这个现象表明，`@import`不只是如看到的那样，处于内联样式顶部，其被引入的样式，在结构上，也确实是被置于内联样式之前，所以内联样式才能够层叠掉它。

同理，实例4中，在`link`标签引入的blue.css文件内，顶部同样存在`@import`引入的`green.css`，红色边框依然可以证明，`green.css`已经生效，但其背景样式被blue.css本身的蓝色背景层叠掉，`@import`引入的样式在blue.css中也是被置于它本身样式之前的。

到此为止，展开了大胆的猜想，“`link`引入的样式权重大于`@import`引入的样式”，这个结论的给出者，是想告诉大家：

在`link`标签引入的 CSS 文件中，使用`@import`时需注意，如果已经存在相同样式，`@import`引入的这个样式将被该 CSS 文件本身的样式层叠掉，表现出`link`标签引入的样式权重大于`@import`引入的样式这样的直观效果。

对于设想的结论，似乎挺能说通的，毕竟这是实践出的结果。

那些验证过此结论的前人，他们都是在一个 HTML 页面中，一前一后分别使用`link`和内联样式的`@import`去比较的，在实例1和实例2中也是如此做的，并不能反推出“`link`引入的样式权重大于`@import`引入的样式”这个结论，所以，不自量力的认为，这个结论其实最初只是丢了个已知条件而已。

那么一起把这个结论重新梳理一下：在`link`标签引入的 CSS 文件中使用`@import`时，相同样式将被该 CSS 文件本身的样式层叠。

## 细节

在《CSS权威指南》中写道：

`@import`一定要写在除`@charset`外的其他任何 CSS 规则之前，如果置于其它位置将会被浏览器忽略，而且，在`@import`之后如果存在其它样式，则`@import`之后的分号是必须书写，不可省略的。

到此为止，似乎事情都弄清楚了，但是突然又有个疑点浮现出来：

在讨论**区别**的时候，不是说加载页面时，`link`标签引入的 CSS 先于`@import`引入的 CSS 加载吗，那`link`标签引入的样式又怎会把`@import`引入的样式层叠掉呢？

* **加载**：根据请求的URL进行域名解析，向服务器发送请求，接收响应文件（如 HTML、JS、CSS、图片等）。

* **解析**：对加载到的资源（HTML、JS、CSS等）进行语法解析，构建相应的内部数据结构（比如HTML的DOM树，JS对象的属性表，CSS的样式规则等）。

* **渲染**：构建渲染树，对各个元素进行位置计算、样式计算等，然后根据渲染树完成页面布局及绘制的过程（可以理解为“画”页面元素）。

这几个过程不是完全孤立的，会有交叉，比如HTML加载后就会进行解析，然后拉取HTML中指定的CSS、JS等。`

现在，应该已经了解了加载和渲染的概念，明白它们是两个不同的过程，那么对上文中抛出的疑问继续追问：

`link`先于`@import`加载，是不是也先于`@import`渲染呢？

实际上，渲染的动作一般都会执行多次，最后一次渲染，一定是依据之前加载过的所有样式整合后的渲染树进行绘制页面的，已经被渲染过的页面元素，也会被重新渲染。

那么就可以把`@import`这种导入 CSS 文件的方式理解成一种替换，CSS 解析引擎在对一个 CSS 文件进行解析时，如在文件顶部遇到`@import`，将被替换为该`@import`导入的 CSS 文件中的全部样式。

峰回路转，柳暗花明，终于弄明白为何`@import`引入的样式，会被层叠掉了。其虽然后被加载，却会在加载完毕后置于样式表顶部，最终渲染时自然会被下面的同名样式层叠。

至此为止，“`link`引入的样式权重大于`@import`引入的样式”这个结论，终于为它圆了场。但愿此结论的作者，本意真如的猜测，否则若是多心而跑偏了的话，不敢想象这背后究竟隐藏着多大的秘密。