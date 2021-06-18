# css 兼容性 整理

# 初始化样式
---

因浏览器兼容的问题，不同的浏览器对标签的默认样式值不同，如果不初始化会造成不同浏览器之间的显示差异，布局出现错乱，所以要初始化样式，达到统一的布局。
最粗暴的方案就是使用`*`初始化样式，但是其会对于所有的标签加载样式以及计算样式优先级，可能会对性能有所影响。

```css
* { 
    margin: 0;
    padding: 0;
}
```

通常使用`Normalize.css`抹平默认样式差异，当然也可以根据样式定制自己的`reset.css`。

> **备注**： 这个是最常见的也是最易解决的一个浏览器兼容性问题，所有的CSS文件开头都会用`样式重置`各个标签的内外补丁是0。

```html
<link href="https://cdn.bootcss.com/normalize/7.0.0/normalize.min.css" rel="stylesheet">
```

# 内核样式兼容
---

在`CSS3`标准还未确定时，部分浏览器已经根据最初草案实现了部分功能，为了与之后确定下来的标准进行兼容，所以每种浏览器使用了自己的私有前缀与标准进行区分，当标准确立后，各大浏览器将逐步支持不带前缀的`CSS3`新属性，目前已有很多私有前缀可以不写了，但为了兼容老版本的浏览器，可以仍沿用私有前缀和标准方法，逐渐过渡。

| 内核 | 代表浏览器 | 前缀 |
| ---- | ---- | ---- |
| Trident | IE浏览器 | -ms |
| Gecko | Firefox | -moz |
| Presto | Opera | -o |
| Webkit | Chrome、Safari | -webkit |

# 透明属性
---

用来设定元素透明度的`opacity`是`CSS 3`里的一个属性，现代浏览器都已经支持，对于老版本浏览器可以通过加入私有前缀来支持，对于`IE6-IE8`可以通过`filter`属性来支持，`IE4-IE9`都可以通过滤镜写法提供兼容支持。

```css
opacity: 0.5;
-moz-opacity:0.5;
filter: alpha(opacity = 50); //IE6-IE8
filter: progid:DXImageTransform.Microsoft.Alpha(style = 0, opacity = 50); //IE4-IE9
```

# 媒体查询
---

对于`IE9`以下浏览器不支持`CSS3`媒体查询的问题，通常使用`respond.js`来作为兼容性解决方案。

```html
<script type="text/javascript" src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
```

# HTML5标签
---

对于`IE9`以下浏览器不支持`HTML5`新标签的问题，可以使用`document.createElement`创建元素并设置其`CSS`样式即可，通常使用h`tml5shiv.js`来作为兼容性解决方案。

```html
<script>
    document.createElement('header');
</script>
<style>
    header{display: block;}
</style>
```

```html
<script type="text/javascript" src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
```

# placeholder兼容性
---

`placeholder`是`html5`新增的一个属性，当`input`或者`textarea`设置了该属性后，该值的内容将作为灰字提示显示在文本框中，当文本框获得焦点或输入内容时，提示文字消失。对于其兼容性首先需要判断`input`是否支持`placeholder`，然后在不支持的情况下可以通过`input`的`onfocus`与`onblur`事件监听来实现`placeholder`效果。

```html
<!-- 简单示例 -->
<input type="text" value="Tips" onFocus="this.value = '';" onBlur="if (this.value == '') {this.value = 'Tips';}">
```

# IE条件注释
---

`IE`专门提供的一种语法，只有IE能识别运行，其他浏览器只会作为注解。

```html
<!--[if lt IE 9]>
    <script type="text/javascript" src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <script type="text/javascript" src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
<![endif]-->
```

```html
<!--[if !IE]>  除IE外都可识别   <![endif]-->
<!--[if IE]>   所有的IE可识别   <![endif]-->
<!--[if IE 6]>   仅IE6可识别   <![endif]-->
<!--[if lt IE 6]>   IE6以及IE6以下版本可识别   <![endif]-->
<!--[if gte IE 6]>   IE6以及IE6以上版本可识别   <![endif]-->
<!--[if IE 7]>   仅IE7可识别   <![endif]-->
<!--[if lt IE 7]>   IE7以及IE7以下版本可识别   <![endif]-->
<!--[if gte IE 7]>   IE7以及IE7以上版本可识别   <![endif]-->
<!--[if IE 8]>   仅IE8可识别   <![endif]-->
<!--[if IE 9]>   仅IE9可识别   <![endif]-->
```

```html
<!-- 
    ! NOT运算符
    lt 小于运算符
    lte 小于或等于运算符
    gt 大于运算符
    gte 大于或等于运算符
    & AND运算符
    | OR运算符
    () 子表达式运算符 用于与布尔运算符创建更复杂的表达式
-->
```

# css3新属性，加浏览器前缀兼容早期浏览器
---

> `-moz-` /* 火狐浏览器 /
> `-webkit-` / Safari, 谷歌浏览器等使用Webkit引擎的浏览器 /
> `-o-` / Opera浏览器(早期) /
> `-ms-` / IE */

**哪些css3属性需要加：**

> 定义关键帧动画 @keyframes
> css3中的变形（transform）、过渡(transtion)、动画(animation)
> border-radius 圆角
> box-shadow  盒子阴影
> flex  弹性布局
> ....

**使用**

```css
.myClass {
	-webkit-animation-name: fadeIn;
	-moz-animation-name: fadeIn;
	-o-animation-name: fadeIn;
	-ms-animation-name: fadeIn;
	animation-name: fadeIn;  /* 不带前缀的放到最后 */
}
/* 复杂属性 keyframes */
@-webkit-keyframes fadeIn {
	0% { opacity: 0; } 100% { opacity: 0; }
}
@-moz-keyframes fadeIn {
	0% { opacity: 0; } 100% { opacity: 0; }
}
@-o-keyframes fadeIn {
	0% { opacity: 0; } 100% { opacity: 0; }
}
@-ms-keyframes fadeIn {
	0% { opacity: 0; } 100% { opacity: 0; }
}
/* 不带前缀的放到最后 */
@keyframes fadeIn {
	0% { opacity: 0; } 100% { opacity: 0; }
}
```

# IE margin 加倍
---

> 块属性标签`float`后，又有横行的`margin`情况下，IE 浏览器`margin`加倍的问题

**问题症状:** 常见症状是`IE6`中后面的一块被顶到下一行

**解决方案：** 设置为`float`的`div`在`ie`下设置的`margin`会加倍。这是一个`ie6`都存在的`bug`。解决方案是在这个`div`里面加上`display:inline`;

```html
相应的css为
<style>
    #imfloat{
        float:left;
        margin:5px;//IE下理解为10px
        display:inline;//IE下再理解为5px
    }
</style>
<div id='imfloat'>
    ...
</div>
```

**备注**： 最常用的就是`div+CSS`布局了，而`div`就是一个典型的块属性标签，横向布局的时候通常都是用`div` `float`实现的，横向的间距设置如果用`margin`实现，这就是一个必然会碰到的兼容性问题。

# IE 下显示高度超出设置高度
---

> 设置较小高度标签（一般小于10px），在IE6，IE7，遨游中高度超出自己设置高度

**问题症状：** 设置div高度小于10px，IE6、7和遨游里div的高度，超出自己设置的10px.

**碰到频率：** 60%

**解决方案：**
    
   1. 给超出高度的标签设置`overflow:hidden;`
    
   2. 或者设置行高`line-height` 小于你设置的高度。

**备注：** 这种情况一般出现在设置小圆角背景的标签里。出现这个问题的原因是IE8之前的浏览器都会给标签一个`最小默认的行高的高度`。即使你的标签是`空`的，这个标签的高度还是会达到`默认的行高`。

# IE 下显示间距超过设置间距
---

> 行内属性标签，设置`display:block`后采用`float`布局，又有横行的`margin`的情况，`IE6`间距`bug`

**问题症状：** IE6里的间距比超过设置的间距

**碰到几率：** 20%

**解决方案：** 在`display:block;`后面加入`display:inline;``display:table;`

**备注：** 行内属性标签，为了设置宽高，需要设置`display:block;`(除了`input/img`标签比较特殊)。在用`float`布局并有横向的`margin`后，在`IE6`下，他就具有了块属性`float后`的横向`margin`的`bug`。不过因为它本身就是行内属性标签，所以再加上`display:inline`的话，它的高宽就不可设了。这时候还需要在`display:inline`后面加入`display:talbe`

# IE 下最小宽度和高度
---

**问题症状：** IE浏览器div最小宽度和高度不生效

IE不认得`min-`这个定义，但实际上它把正常的`width`和`height`当作有`min`的情况来使。这样问题就大了，如果只用宽度和高度，正常的浏览器里这两个值就不会变，如果只用`min-width`和`min-height`的话，IE下面根本等于没有设置宽度和高度。

比如要设置背景图片，这个最小宽度是比较重要的。要解决这个问题，可以这样：

```css
#box{
  width: 80px;
  height: 35px;
}
html>body #box{
  width: auto;
  height: auto; 
  min-width: 80px; 
  min-height: 35px;
}
```

# 超链接访问过后hover样式就不出现的问题
---

被点击访问过的超链接样式不在具有`hover`和`active`了,很多人应该都遇到过这个问题,解决技巧是改变CSS属性的排列顺序: `L-V-H-A`

```html
<style type="text/css">

a:link {}
a:visited {}
a:hover {}
a:active {}

</style>
```

# 图片默认间距
---

**问题症状：** 几个`img`标签放在一起的时候，有些浏览器会有默认的间距，通配符清除间距也不起作用。

**碰到几率：** 20%

**解决方案：** 使用`float`属性为`img`布局(所有图片左浮)

**备注：** 因为`img`标签是行内属性标签，所以只要不超出容器宽度，`img`标签都会排在一行里，但是部分浏览器的`img`标签之间会有个间距。去掉这个间距使用`float`是正道。

# css hack解决浏览器兼容性
---

下面是css hack写法：

```css
background-color:yellow0; 0 是留给ie8的
+background-color:pink;   + ie7定了；
_background-color:orange; _专门留给神奇的ie6；
```

# 安卓浏览器背景图片模糊
---

`devicePixelRatio`作怪，因为手机分辨率太小，如果按照分辨率来显示网页，这样字会非常小，所以苹果当初就把`iPhone 4`的`960*640`分辨率，在网页里只显示了`480*320`，这样`devicePixelRatio＝2`。现在android比较乱，有1.5的，有2的也有3的。

# IOS移动端click事件300ms的延迟响应
---

> 移动设备上的web网页是有`300ms`延迟的，往往会造成按钮点击延迟甚至是点击失效。这是由于区分单击事件和双击屏幕缩放的历史原因造成的

IOS系统搭载的safari为了将适用于PC端上大屏幕的网页能比较好的展示在手机端上，使用了双击缩放(double tap to zoom)的方案，比如你在手机上用浏览器打开一个PC上的网页，你可能在看到页面内容虽然可以撑满整个屏幕，但是字体、图片都很小看不清，此时可以快速双击屏幕上的某一部分，你就能看清该部分放大后的内容，再次双击后能回到原始状态。

> 双击缩放是指用手指在屏幕上快速点击两次，iOS 自带的 Safari 浏览器会将网页缩放至原始比例

捕获第一次单击后，浏览器会先Hold一段时间t，如果在t时间区间里用户未进行下一次点击，则浏览器会做单击跳转链接的处理，如果t时间里用户进行了第二次单击操作，则浏览器会禁止跳转，转而进行对该部分区域页面的缩放操作。

**解决方案**：
> `fastclick`可以解决在手机上点击事件的`300ms`延迟 `zepto`的`touch`模块，`tap`事件也是为了解决在`click`的延迟问题
> 触摸事件的响应顺序为 `touchstart` --> `touchmove` --> `touchend` -->
> click,也可以通过绑定`ontouchstart`事件，加快对事件的响应，解决`300ms`延迟问题

# 对非可点击元素如(label,span)监听click事件，ios下不会触发
---

**解决方案**：
css增加`cursor:pointer`就搞定了

# h5底部输入框被键盘遮挡问题
---

h5页面有个很蛋疼的问题就是，当输入框在最底部，点击软键盘后输入框会被遮挡。可采用如下方式解决:

```js
var oHeight = $(document).height(); //浏览器当前的高度
   
$(window).resize(function(){

    if($(document).height() < oHeight){
        
        $("#footer").css("position","static");
    }else{
            
        $("#footer").css("position","absolute");
    }
    
});
```

# 不让 Android 手机识别邮箱
---

**解决方法**：
```html
<meta content="email=no" name="format-detection" />
```

# 禁止 iOS 识别长串数字为电话
---

**解决方法**：
```html
<meta content="telephone=no" name="format-detection" />
```

# 禁止 iOS 弹出各种操作窗口
---

**解决方法**：
```css
webkit-touch-callout:none
```

# 消除 transition 闪屏
---

**解决方法**：
```css
webkit-transform-style: preserve-3d;     /*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/
-webkit-backface-visibility: hidden;      /*(设置进行转换的元素的背面在面对用户时是否可见：隐藏)*/
```

# iOS 系统中文输入法输入英文时，字母之间可能会出现一个六分之一空格

**解决方法**
```js
// 可以通过正则去掉
this.value = this.value.replace(/\u2006/g, '');
```

# 禁止ios和android用户选中文字

**解决方法**
```css
webkit-user-select:none
```
