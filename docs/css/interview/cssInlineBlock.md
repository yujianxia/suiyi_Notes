# inline-block元素间间距

# 一、现象描述

真正意义上的`inline-block`水平呈现的元素间，换行显示或空格分隔的情况下会有间距，很简单的个例子：

```html
<input /> <input type="submit" />
```

<a data-fancybox title="示例" href="/notes/assets/css/2012-04-24_162919.png">![示例](/notes/assets/css/2012-04-24_162919.png)</a>

使用CSS更改非`inline-block`水平元素为`inline-block`水平，也会有该问题：

```css
.space a {
    display: inline-block;
    padding: .5em 1em;
    background-color: #cad5eb;
}
```

```html
<div class="space">
    <a href="##">惆怅</a>
    <a href="##">淡定</a>
    <a href="##">热血</a>
</div>
```

<a data-fancybox title="示例" href="/notes/assets/css/2012-04-24_163352.png">![示例](/notes/assets/css/2012-04-24_163352.png)</a>

[inline-block元素间间距demo](http://www.zhangxinxu.com/study/201204/inline-block-space-example.html)

# 二、方法之移除空格

元素间留白间距出现的原因就是标签段之间的空格，因此，去掉HTML中的空格，自然间距就木有了。考虑到代码可读性，显然连成一行的写法是不可取的，可以：

```html
<div class="space">
    <a href="##">
    惆怅</a><a href="##">
    淡定</a><a href="##">
    热血</a>
</div>
```

或者是：

```html
<div class="space">
    <a href="##">惆怅</a
    ><a href="##">淡定</a
    ><a href="##">热血</a>
</div>
```

或者是借助HTML注释：

```html
<div class="space">
    <a href="##">惆怅</a><!--
    --><a href="##">淡定</a><!--
    --><a href="##">热血</a>
</div>
```

# 三、使用margin负值

```css
.space a {
    display: inline-block;
    margin-right: -3px;
}
```

<a data-fancybox title="示例" href="/notes/assets/css/2012-04-24_205406.png">![示例](/notes/assets/css/2012-04-24_205406.png)</a>

例如，对于12像素大小的上下文，Arial字体的`margin`负值为`-3`像素，Tahoma和Verdana就是`-4`像素，而Geneva为`-6`像素。

由于外部环境的不确定性，以及最后一个元素多出的父margin值等问题，这个方法不适合大规模使用。

# 四、让闭合标签吃胶囊

如下处理：

```html
<div class="space">
    <a href="##">惆怅
    <a href="##">淡定
    <a href="##">热血</a>
</div>
```

注意，为了向下兼容IE6/IE7等喝蒙牛长大的浏览器，最后一个列表的标签的结束（闭合）标签不能丢。

在HTML5中，直接：

```html
<div class="space">
    <a href="##">惆怅
    <a href="##">淡定
    <a href="##">热血
</div>
```

[无闭合标签去除inline-block元素间距demo](http://www.zhangxinxu.com/study/201204/inline-block-space-skip-close-tag.html)

<a data-fancybox title="示例" href="/notes/assets/css/2012-04-24_211852.png">![示例](/notes/assets/css/2012-04-24_211852.png)</a>

# 五、使用font-size:0

类似下面的代码：

```css
.space {
    font-size: 0;
}
.space a {
    font-size: 12px;
}
```

这个方法，基本上可以解决大部分浏览器下inline-block元素之间的间距(IE7等浏览器有时候会有1像素的间距)。不过有个浏览器，就是Chrome, 其默认有最小字体大小限制，因为，考虑到兼容性，还需要添加：

类似下面的代码：

```css
.space {
    font-size: 0;
    -webkit-text-size-adjust:none;
}
```

[font-size:0清除换行符间隙demo](http://www.zhangxinxu.com/study/201011/img-font-size-clear-blank.html)

> **补充**：根据小杜在评论中中的说法，目前Chrome浏览器已经取消了最小字体限制。因此，上面的`-webkit-text-size-adjust:none;`代码估计时日不多了。

# 六、使用letter-spacing

类似下面的代码：

```css
.space {
    letter-spacing: -3px;
}
.space a {
    letter-spacing: 0;
}
```

> 注意：不过`Opera`浏览器下有蛋疼的问题：最小间距1像素，然后，`letter-spacing`再小就还原了。

# 七、使用word-spacing

类似下面代码：

```css
.space {
    word-spacing: -6px;
}
.space a {
    word-spacing: 0;
}
```

一个是字符间距(`letter-spacing`)一个是单词间距(`word-spacing`)，大同小异。据测试，`word-spacing`的负值只要大到一定程度，其兼容性上的差异就可以被忽略。因为，貌似，`word-spacing`即使负值很大，也不会发生重叠。

[word-spacing与元素间距去除demo](http://www.zhangxinxu.com/study/201204/inline-block-space-word-spacing.html)

与上面demo一样的效果，这里就不截图展示了。如果您使用Chrome浏览器，可能看到的是间距依旧存在。确实是有该问题，原因是不清楚，不过知道，可以添加`display: table;`或`display:inline-table;`让Chrome浏览器也变得乖巧。

```css
.space {
    display: inline-table;
    word-spacing: -6px;
}
```

# 八、其他方法

下面展示的是YUI 3 CSS Grids 使用`letter-spacing`和`word-spacing`去除格栅单元见间隔方法：

> **注意**，其针对的是block水平的元素，因此对IE8-浏览器做了hack处理

```css
.yui3-g {
    letter-spacing: -0.31em; /* webkit */
    *letter-spacing: normal; /* IE < 8 重置 */
    word-spacing: -0.43em; /* IE < 8 && gecko */
}

.yui3-u {
    display: inline-block;
    zoom: 1; *display: inline; /* IE < 8: 伪造 inline-block */
    letter-spacing: normal;
    word-spacing: normal;
    vertical-align: top;
}
```

```css
li {
    display:inline-block;
    background: orange;
    padding:10px;
    word-spacing:0;
    }
ul {
    width:100%;
    display:table;  /* 调教webkit*/
    word-spacing:-1em;
}

.nav li { *display:inline;}
```