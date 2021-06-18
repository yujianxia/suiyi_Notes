
# 事件监听句柄
---

**IE:** `dom.attachEvent();`
**标准浏览器：** `dom.addEventListener(‘click',function(event){},false);`

标准浏览器采用事件捕获的方式对应IE的事件冒泡机制（即标准`由最外元素至最内元素或者IE由最内元素到最外元素`）最后标准方亦觉得IE这方面的比较合理，所以便将事件冒泡纳入了标准，这也是`addEventListener`第三个参数的由来，而且事件冒泡作为了默认值第三值默认false，表示事件冒泡方式。

在`IE9`之前，必须使用`attachEvent`而不是使用标准方法`addEventListener`来注册元素的监听器，事件兼容的问题，通常需要会封装一个适配器的方法，过滤事件句柄绑定、移除。

```js
 var handler = {}

 //绑定事件
 handler.on = function(target, type, handler) {
 	if(target.addEventListener) {
 		target.addEventListener(type, handler, false);
 	} else {
 		target.attachEvent("on" + type,
 			function(event) {
 				return handler.call(target, event);
 		    }, false);
 	}
 };

 //取消事件监听
 handler.remove = function(target, type, handler) {
 	if(target.removeEventListener) {
 		target.removeEventListener(type, handler);
 	} else {
 		target.detachEvent("on" + type,
 	    function(event) {
 			return handler.call(target, event);
 		}, true);
     }
};
```

# 阻止默认行为
---

`W3C`推荐的阻止默认行为的方式是`event.preventDefault()`，此方法只会阻止默认行为而不会阻止事件的传播。`IE9`之前的浏览器阻止默认行为需要使用`window.event.returnValue = false`。直接在事件处理函数中`return false`也能阻止默认行为，只在`DOM0`级模型中有效。此外，在`jQuery`中使用`return false`会同时阻止默认行为与事件传播，通常也会封装一个方法来实现默认行为的阻止。

```js
handler.preventDefault = function(event) {
    event = event || window.event;
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}
```

# 阻止事件冒泡
---

`W3C`推荐的阻止冒泡的方法是`event.stopPropagation()`，`IE9`之前则是使用`window.event.cancelBubble = true;`，通常也会封装一个方法来实现阻止事件冒泡。

```js
handler.stopPropagation = function(event) {
    event = event || window.event;
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = false;
    }
}
```

# 滚动高度
---

获取窗口的滚动高度`scrollTop`需要采用兼容性写法，即使声明`<DOCTYPE>`浏览器对于文档的处理也会有所不同。

```js
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
```

# 日期时间
---

使用`new Date()`构造函数生成日期时间对象，对于`new Date("2020-06-29")`语法在一些早期的浏览器会输出`invalid date`，这主要是因为早期浏览器不支持表达日期的`-`，而`/`才是被广泛支持的，所以在处理早期浏览器的兼容性时需要将`-`替换为`/`。

```js
new Date("2020-06-29".replace(/-/g, "/"));
```

# document
---

> `event`事件对象问题

```js
document.onclick=function(ev){//谷歌火狐的写法，IE9以上支持，往下不支持；
    var e=ev;
    console.log(e);
}
document.onclick=function(){//谷歌和IE支持，火狐不支持；
    var e=event;
    console.log(e);
}
document.onclick=function(ev){//兼容写法；
    var e=ev||window.event;
    var mouseX=e.clientX;//鼠标X轴的坐标
    var mouseY=e.clientY;//鼠标Y轴的坐标
}
```

# event.srcElement(事件源对象)问题
---

**IE：** `event`对象有`srcElement`属性，但是没有`target`属性；
**Firefox:** `event`对象有`target`属性，但是没有`srcElement`属性。

**解决方法：**

```js
srcObj = event.srcElement?event.srcElement:event.target;
```

# 获取元素的非行间样式值
---

**IE:** `dom.currentStyle['width']` 获取元素高度
**标准浏览器：** `window.getComputedStyle(obj, null)['width'];`

**跨浏览器兼容解决方法：**

```js
// 获取元素属性值的兼容写法
function getStyle(obj,attr){
    if(obj.currentStyle){
        //兼容IE
 　　　　obj.currentStyle[attr];
        return obj.currentStyle[attr];
    }else{
        //非IE，
 　　　  return window.getComputedStyle(obj, null)[attr]; 
 　 }
}
```

# ajax兼容问题
---

**IE：** `ActiveXObject`
**其他：** `xmlHttpReuest`

> 在`IE6`以前不是用`XMLHttpRequest`创建的，所以要兼容`ie6`以前的浏览器要判断他有没有`XMLHttpRequest()`

**跨浏览器兼容解决方法：**

```html
<script>
	window.onload = function(){
		var oBtn = document.getElementById('btn');
		oBtn.onclick = function(){
			//1.创建ajax对象
			//只支持非IE6浏览器
			var oAjax = null;
			if(window.XMLHttpRequest){
				oAjax = new XMLHttpRequest();				
				//alert(new XMLHttpRequest());
			}else{
				//只支持IE6浏览器
				oAjax = new ActiveXObject("Microsoft.XMLHTTP");	
			}
			//2.连接服务器,这里加个时间参数,每次访问地址都不一样,浏览器就不用浏览器里的缓冲了,但
			//	但服务器那端是不解析这个时间的
			oAjax.open("get","a.txt?t=" + new Date().getTime(),true);
			//3.发送
			oAjax.send(null);		
			//4.接受信息
			oAjax.onreadystatechange = function(){
				//浏览器与服务器之间的交互,进行到哪一步了,当等于4的时候,代表读取完成了
				if(oAjax.readyState==4){
					//状态码,只有等于200,代表接受完成,并且成功了
					if(oAjax.status==200){
						alert("成功" + oAjax.responseText);	
					}else{
						alert("失败");	
					}	
				}	
			};
				
		};
	};
</script>
```