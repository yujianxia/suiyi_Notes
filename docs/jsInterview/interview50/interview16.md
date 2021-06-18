# 第16天 返回到顶部的方法有哪些？把其中一个方法出来

## 方法总结

### 方案一

利用 `a` 标签的锚点。在顶部放一个 `a` 标签 `<a name="top">顶部</a>`，在需要回到顶部的位置放置一个 `a` 标签，地址为 `top`。 `<a href="#top">回到顶部</a>`。要做成隐藏的锚点，可以把内部的内容去掉，`name` 是必须的。

### 方案二

利用 `#`，在 url 后增加 `#` 不会让页面刷新，并且可以回到顶部。可以对 `location.href` 进行设置 `location.href += '#'`。当这个方法执行多次即有多个 `#` 时，页面不会有响应。（这种方式其实不好）


### 方案三

利用 `javascript` 设置 `scrollTop = 0`，一般设置在最外层，即 `document.documentElement.scrollTop = 0` 就可以返回顶部。

### 方案四

利用`JavaScript`回到顶部`<s/a>`

例子：

```html
<a href="javascript:scroll(0,0)">JavaScript回到顶部<s/a>
```

## 衍生内容

### 动画需求

当回到顶部需要有滚动条的动画以及页面的执行动画

### 解法 1

使用递归进行延时（js执行页面io操作均有异步延时效果）执行，每次执行部分距离则当执行完毕会产生有动画的错觉

### 示例 1

```js
var st = document.documentElement.scrollTop, speed = st / 10;
var funScroll = function () {
    st -= speed;
    if (st <= 0) { 
        st = 0; 
    }
    window.scrollTo(0, st);
    if (st > 0) {
        setTimeout(funScroll, 10); 
    }
};
funScroll()
```

### 示例 2

```js
var timer = requestAnimationFrame(function fn(){
    var oTop = document.body.scrollTop || document.documentElement.scrollTop;
    if(oTop > 0){
        document.body.scrollTop = document.documentElement.scrollTop = oTop - 50;
        timer = requestAnimationFrame(fn);
    }else{
        cancelAnimationFrame(timer);
    }    
});
```

## 关于 document.documentElement 和 document.body

### document.body

返回`html` `dom`中的`body`节点 即`<body>`

### document.documentElement

返回`html` `dom`中的`root` 节点 即`<html>`

### document.documentElement 与 document.body的应用场景

> 获取 `scrollTop` 方面的差异

```文案说明
在chrome(版本 52.0.2743.116 m)下获取scrollTop只能通过document.body.scrollTop,而且DTD是否存在,不会影响 document.body.scrollTop的获取。

通过console查看结果：

demo 1 with doctype : http://jsbin.com/cisacam 

demo 2 without doctype: http://jsbin.com/kamexad/16
```

```文案说明
在firefox(47.0)及 IE(11.3)下获取scrollTop，DTD是否存,会影响document.body.scrollTop 与 document.documentElement.scrollTop的取值

在firefox(47.0)

页面存在DTD，使用document.documentElement.scrollTop获取滚动条距离；

页面不存在，使用document.body.scrollTop 获取滚动条距离

demo 1 with doctype : http://jsbin.com/cisacam 

demo 2 without doctype: http://jsbin.com/kamexad/16
```

```文案说明
IE(11.3)

页面存在DTD，使用document.documentEelement.scrollTop获取滚动条距离

页面不存在DTD,使用document.documentElement.scrollTop 或 document.body.scrollTop都可以获取到滚动条距离

demo 1 with doctype : http://jsbin.com/cisacam 

demo 2 without doctype: http://jsbin.com/kamexad/16
```

### 兼容解决方案：

```js
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
```