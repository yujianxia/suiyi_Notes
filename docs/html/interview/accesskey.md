# accesskey

## 概述

> 属于键盘操作的无障碍功能

`accesskey`属性目前是h5标准中的一个全局快捷键访问属性，通过在任意元素上注入`accesskey`属性值，在浏览器中触发相应的快捷键，即可实现对相应元素的`focus`或`click`；

### demo

```html

<div accesskey="z" onclick="this.style.color = 'red';">快捷键z：变红</div>
```

### mozilla 定义

> 注意：在`WHATWG`规范中，它说你可以指定多个空格分隔的字符，浏览器将使用它所支持的第一个字符。然而，这在大多数浏览器中是行不通的。在IE/Edge中，它将使用它支持的第一个没有问题的，只要没有与其他命令冲突。

激活 accesskey 的操作取决于浏览器及其平台。

<a data-fancybox title="" href="/notes/assets/html/1621998731(1).jpg">![](/notes/assets/html/1621998731(1).jpg)</a>

## 可访问性

除了糟糕的浏览器支持之外， `accesskey`属性还有很多问题：

* `accesskey` 值可能与系统或浏览器键盘快捷键或辅助技术功能相冲突。对于一个操作系统来说，辅助技术和浏览器组合可能无法与其他操作系统协同工作。

* 某些 `accesskey` 值可能不会出现在某些键盘上，特别是在国际化是一个问题的时候。

* 依赖于数字的 `accesskey` 值可能会让那些经历认知问题的人感到困惑，因为他们的数字与它触发的功能没有逻辑关联。

* 通知用户`accesskeys` 存在，这样他们就能意识到该功能。如果没有公开这些信息的方法，`accesskeys` 可能会被意外激活。

由于这些问题，一般建议不要在大多数通用的网站和web应用程序中使用`accesskey` 属性。

## 浏览器兼容性

<a data-fancybox title="" href="/notes/assets/html/1621998913(1).jpg">![](/notes/assets/html/1621998913(1).jpg)</a>

在windows操作系统下，按下`Alt` + `1`，IE浏览器只是让`<a>`元素获得焦点，但是其他所有浏览器都是直接触发`click`行为。在我看来，IE浏览器的这种行为是不友好的，对于普通的控件元素而言，还可以获得焦点后回车访问，但是，对于类似`<div>`这类元素，`accesskey`属性几乎是没有任何意义的，因为根本无法通过键盘触发`<div>`点击行为。而Chrome等浏览器就没有这个问题，如下HTML：

```html
<div accesskey="3" onClick="this.style.color='red';">测试</div>
```

此时，我在windows操作系统下，按下`Alt` + `3`，结果“测试”二字变成了红色，如下截图：

<a data-fancybox title="" href="/notes/assets/html/2017-05-14_203628.png">![](/notes/assets/html/2017-05-14_203628.png)</a>


## 隐藏的元素能否可以触发accesskey快捷访问？

一个元素，如果CSS `display`属性的计算值是`none`，是无法通过Tab键进行索引聚焦的。那设置的`accesskey`快捷访问是否可以访问呢？

根据我的测试，Chrome浏览器和Firefox浏览器是可以的，元素即使隐藏，只要设置了`accesskey`快捷访问，按下对应组合键的时候就能触发`click`行为。

```html
<a href="" accesskey="1" hidden>链接</a>
```

在windows操作系统Chrome浏览器下，按下`Alt` + `1`，页面会直接刷新。

但是对于`IE`浏览器，那就比较惨了，由于隐藏的元素是不能被`focus`聚焦的，于是`accesskey`快捷访问也跟着一起完蛋了，因为`IE`的组合键触发的只是`focus`行为。

## 多个元素使用相同的accesskey属性值会怎样？

```html
<div accesskey="1" tabindex="0" onClick="this.style.color='red';">测试1</div>
<div accesskey="1" tabindex="0" onClick="this.style.color='red';">测试2</div>
```

在`Chrome`浏览器下，上面一行`<div>`的`accesskey`属性设置会被忽略，作用的是后来居上的元素。

在`Firefox`浏览器下（版本53），则是两败俱伤，两行`<div>`进行快捷键匹配的时候都不能触发`click`点击事件，变成了单纯的`focus`索引，行为表现的和IE浏览器一样；

在`IE edge`下，原本就不支持`click`点击事件，自然现在也不支持，使用对应的组合快捷访问的行为也是单纯的依次`focus`索引