1.WebSocket （可跨域）
---

2.postMessage（可跨域）
---

`window.postMessage()`方法安全地启用Window对象之间的跨源通信。

对将接收消息的窗口的引用，获得此类引用的方法包括：

1.iframe标签

`这里是发送代码 send.html`
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Post Message</title>
</head>
<body>
    <div style="width:200px; float:left;">
        <div id="color">Frame Color</div>
    </div>

    <div style="border:3px solid #0F0; width:100%; float:left">
    <p>这里是iframe</p>
        <iframe id="child" src="accept.html"></iframe>
    </div>

    <script type="text/javascript">

        window.onload=function(){
            //Window.frames +索引值（命名或数字）
            window.frames[0].postMessage({a:1},'*');

        }

        window.addEventListener('message',function(e){
            var color=e.data;
            document.getElementById('color').style.backgroundColor=color;
        },false);
    </script>
</body>
</html>
```

`//这里是接受代码 accept.html`
```html
<!doctype html>
<html>
<head>
    <meta charset='utf-8'>
<title>Post Message</title>
    <style type="text/css">
        html,body{
            height:100%;
            margin:0px;
        }
    </style>
</head>
<body style="height:100%;">
    <div id="container" onClick="changeColor();" style="widht:100%; height:100%; background-color:rgb(204, 102, 0);">
        click to change color
    </div>
    <script type="text/javascript">
        var container=document.getElementById('container');

        window.addEventListener('message',function(e){
            console.log(e);
            console.info("父页面传递来的消息",e.data);
            if(e.source!=window.parent) return;
            // var color=container.style.backgroundColor;
            // window.parent.postMessage(color,'*');//Window.parent（从嵌入式内部引用父窗口<iframe>）
        },false);

        function changeColor () {            
            var color=container.style.backgroundColor;
            if(color=='rgb(204, 102, 0)'){
                color='rgb(204, 204, 0)';
            }else{
                color='rgb(204,102,0)';
            }
            container.style.backgroundColor=color;
            window.parent.postMessage(color,'*');//Window.parent（从嵌入式内部引用父窗口<iframe>）
        }
    </script>
</body>
</html>
```

2.Window.open （生成一个新窗口然后引用它）

`这里是发送代码 index.html`
```html
<!DOCTYPE html >
<html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>window.open</title>
</head>
<body>
<input type="button" onClick="openweb()" value="开始发送信息">
</body>
</html>
<script>

var win=null;
function openweb()
{
setTimeout(
        function()
        {
            console.log("即将发送消息：'hello world'")
            win=window.open('child.html','child')
        }
    ,500)
setTimeout(
        function()
        {
            win.postMessage('hello world',"*")
        }
    ,3000)
}
</script>
```

`这里是接受代码child.html`
```html
<!DOCTYPE html >
<html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>window.open</title>
</head>

<body>

<div id="msg"></div>
</body>
</html>
<script>
window.addEventListener('message',function(e)
{
    console.log(e)
    document.getElementById("msg").innerHTML="信息来源："+e.origin+"<br>"+e.data

}
)
</script>
```

3.Window.opener （引用产生这个的窗口）

`这里是发送代码 index.html`
```html
<!DOCTYPE html >
<html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>window.opener</title>
</head>

<body>
<input type="button" onClick="openweb()" value="开始">

<div id="msg"></div>
</body>
</html>
<script>
window.addEventListener('message',function(e)
{
    console.log(e.origin,e.data);
    document.getElementById("msg").innerHTML=document.getElementById("msg").innerHTML+"<br>信息来源："+e.origin+"<br>"+e.data
})

function openweb(){
setTimeout(
    function()
    {
        window.open('child.html','child')
    }
,1000)}
</script>
```

`这里是接受代码child.html`
```html
<!DOCTYPE html >
<html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>window.open</title>
</head>

<body>

<div id="msg">信息已发送，请看父页面</div>
</body>
</html>
<script>
var domain='http://localhost:3333';

window.opener.postMessage("好是子页面","*")
</script>
```

3.SharedWorker
---

1.先说一下webworker，作为浏览器的一个新特性，可以提供一个额外的线程来执行一些js代码（真正的多线程），并且不会影响到浏览器用户界面，但是不能DOM操作。

```javascript
var w=null;
function startWorker()
{
if(typeof(Worker)!=="undefined")
  {
  if(w===null)
  {
  w=new Worker("demo_workers.js");
  }
  w.onmessage = function (event) {
    document.getElementById("result").innerHTML=event.data;
    };
  }
else
  {
  document.getElementById("result").innerHTML="Sorry, your browser does not support Web Workers...";
  }
}

function stopWorker()
{ 
    w.terminate();
    w=null;
}
```

`demo_workers.js`
```javascript
var i=0;
function timedCount()
{
i=i+1;
postMessage(i);
setTimeout("timedCount()",500);
}

timedCount();

console.log(self)//没有window对象，替代为self
console.log(self.fetch)//支持fetch
console.log(self.indexedDB)//支持indexedDB，不支持localStorage
```

2.SharedWorker可以被多个window共同使用，所以可以用来跨页面传输数据，但必须保证这些标签页都是同源的(相同的协议，主机和端口号)。

```html
<!DOCTYPE HTML>
<html>
<head>
<title>Shared workers: demo 2</title>
</head>
<body>
<div id="log"></div>
<input type="text" name="" id="txt">
<button id="get">get</button>
<button id="set">set</button>
<script>
    var worker = new SharedWorker('shared.js');
    var get = document.getElementById('get');
    var set = document.getElementById('set');
    var txt = document.getElementById('txt');
    var log = document.getElementById('log');
    worker.port.addEventListener('message', function(e) {
    log.innerText = e.data;
    }, false);
    worker.port.start(); // note: need this when using addEventListener
    set.addEventListener('click',function(e){
        worker.port.postMessage(txt.value);
    },false);
    get.addEventListener('click',function(e){
        worker.port.postMessage('get');
    },false);
</script>
</body>
</html>
```

4.Server-Sent Events
---

HTML5 服务器发送事件（server-sent event）允许网页获得来自服务器的更新。
Server-Sent 事件指的是网页自动获取来自服务器的更新。
以前也可能做到这一点，前提是网页不得不询问是否有可用的更新。通过服务器发送事件，更新能够自动到达。

```html
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Server-Sent</title>
</head>
<body>
<h1>Server-Sent开始</h1>
<div id="result"></div>

<h2>Server-Sent结束</h22>
</body>
</html>

<script>
if(typeof(EventSource)!=="undefined")
    {
    var source=new EventSource("demo_sse.asp");
    console.log(source)
    source.onmessage=function(event)
    {
    document.getElementById("result").innerHTML+=event.data + "<br />";
    };
    }
else
    {
    document.getElementById("result").innerHTML="抱歉，您的浏览器不支持 server-sent 事件 ...";
    }
</script>
```

**服务端** 事件流的对应MIME格式为text/event-stream，而且其基于HTTP长连接。针对HTTP1.1规范默认采用长连接，针对HTTP1.0的服务器需要特殊设置。

`demo_sse.asp`

```html
<%
Response.ContentType="text/event-stream"
Response.Expires=-1
Response.Write("data: " & now())
Response.Write(chr(13)&chr(10))
Response.Write(chr(13)&chr(10))
Response.Flush()
%>
```

5.localStorage（可以添加事件监听）
---

localstorage是浏览器多个标签共用的存储空间，所以可以用来实现多标签之间的通信(ps：session是会话级的存储空间，每个标签页都是单独的）。 直接在window对象上添加监听即可。

`在同源的两个页面中，可以监听 storage 事件`

```javascript
window.addEventListener("storage", function (e) {
    alert(e.newValue);
});
```

`在同一个页面中，对 localStorage 的 setItem 方法进行重写`

```javascript
var orignalSetItem = localStorage.setItem;
localStorage.setItem = function(key,newValue){
    var setItemEvent = new Event("setItemEvent");
    setItemEvent.newValue = newValue;
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this,arguments);
}
window.addEventListener("setItemEvent", function (e) {
    alert(e.newValue);
});
localStorage.setItem("name","wang");
```

6.Cookies
---

[Cookies在同一个域名内，并且目录也得相同，可以参考第三方库](https://github.com/js-cookie/js-cookie)

7.BroadcastChannel(Chrome商店的api)
---

这个方式，只要是在同一原始域和用户代理下，所有窗口、iframe之间都可以进行交互。这个感觉就有点类似于广播了

```javascript
//在一个页面上，触发事件，引发以下代码执行
//创建一个名字是mychannel的对象。记住这个名字，下面会用到
let cast = new BroadcastChannel('mychannel'); 
myObj = { from: "children1", content: "add" };
cast.postMessage(myObj);
```

```javascript
//在子页面上，定义以下代码(当前页面也可以接收消息)
//创建一个和刚才的名字一样的对象
let cast1 = new BroadcastChannel('mychannel');
cast1.onmessage = function (e) {
    alert(e)
};
```

运行后就会发现所有有上面代码的子页面都获得到了数据

[别人的总结](https://xv700.gitee.io/message-communication-for-web/#SharedWorker)