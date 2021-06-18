**响应式图片的几种解决方案**
---

提起响应式： 弹性布局， 弹性图片， 媒体查询。

1. js和服务端控制

```js
$(function(){
    function makeImageResponsive(){
        var img = $('.cotent img');
        var width = $(window).width();
        if(width <= 480){
            img.attr('src', '480.png');
        }else if(width <= 800){
            img.attr('src', '800.png');
        }else{
            img.attr('src', '1600.png');
        }
    }
    $(window).on('resize load', makeImageResponsive);
})
```

2. srcset属性

现在HTML5中对于img标签新增了一个srcset属性。
属性值为以逗号分隔的一个或多个字符串。每个字符串由以下组成：
a. 一个图像的URL。
b. 可选的， 空格后跟以下的其中一个

* ~ 一个宽度描述符，后面紧跟’w’符号。
* ~ 一个像素描述符，后面紧跟’x’符号。

当然这个属性可以配合sizes属性结合使用。

sizes属性可以设置一些类似媒体查询的规则。

例如：

> sizes='(max-width:300px) 200px, 400px'

这表示，如果满足小于300px的时候，图片宽度为200px，否则宽度为400px。
当然，这里用可以使用’x’ ‘calc’, ‘vw’等符号。

3. picture属性。

这个也是HTML5的新属性。
可以放置多个source标签，以指定不同的图像文件名，进而根据不同的条件进行加载。

用法：

* 创建标签。

* 里面放置标签用来展示可能用到的图像

* 对source添加srcset属性来指定图片URL，添加media属性，来规定媒体查询。

* 添加一个回退的元素

这个例子表示在大于800px的时候，展示ad002-l这个large图片。
在大于480px的时候，展示ad002-m这个medium图片。
否则，展示ad002小图片。

```html
<picture>
    <source srcset='src/img/ad002-l.png' media='(min-width: 50em)'/>
    <source srcset='src/img/ad002-m.png' media='(min-width: 30em)'/>
    <img src="src/img/ad002.png"/>
</picture>
```

现在很多浏览器对于picture这个标签还不支持，所以需要用到picturefill.js来解决。

4. svg图片

SVG图片不是一个简单的图像，而是一个规则。所以可是很好的响应式，不过因为比较复杂，所以一般都是对于一些简单的图像使用svg，对于复杂，颜色多的图片，不采用SVG。

**srcset、sizes属性, w描述符**
---

```html
<img src="128px.jpg"
     srcset="128px.jpg 128w, 256px.jpg 256w, 512px.jpg 512w"
     sizes="(max-width: 360px) 340px, 128px">

<img src="128px.jpg"
     srcset="128px.jpg 128w, 256px.jpg 256w, 512px.jpg 512w"
     sizes="(max-width: 360px) calc(100vw - 20px), 128px">
```

描述： 

    当`<img>`元素的宽度规格为128的时候，加载128px.jpg，宽度规格为256的时候，加载256px.jpg， 宽度规格为512的时候，加载512px.jpg。

    这里的宽度规格就是w描述符的另外一种理解，其与`sizes`属性设定和屏幕密度密切相关。

    上面的<img>元素设置的`sizes`属性值(max-width: 360px) 340px, 128px表示当视区宽度不大于360像素时候，图片的宽度限制为340像素；其他情况下，使用128像素。

    下面的<img>元素设置的`sizes`属性值(max-width: 360px) calc(100vw - 20px), 128px表示当视区宽度不大于360像素时候，图片的宽度限制为屏幕宽度减20像素；其他情况下，使用128像素。