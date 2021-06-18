BOM是Browser Object Model的缩写，即浏览器对象模型。DOM是Document Object Model的缩写，即文档对象模型。他们都是浏览器提供给JavaScript的API接口。

## BOM指 浏览器对象模型
Browser Object Model 的缩写。即浏览器对象模型，这并没有一套规定标准，每个浏览器都有自己的实现。但事实上在大部分主要的功能上都已经形成默契。
提供了独立于内容而与浏览器窗口进行交互的对象。描述了与浏览器进行交互的方法和接口，可以对浏览器窗口进行访问和操作，譬如可以弹出新的窗口，改变状态栏中的文本。

**常用的Bom属性**
---

<a data-fancybox title="示例" href="/notes/assets/html/2020102414322631.png">![示例](/notes/assets/html/2020102414322631.png)</a>

**navigator（浏览器对象）**

1. 如何检测浏览器的类型 (ua的问题)？

```js
//如何检测是否为Chrome浏览器
var ua = navigator.userAgent;
console.log(ua);
var isChrome =ua.indexOf('Chrome');
console.log(isChrome); // true为是，false为不是
```

<a data-fancybox title="示例" href="/notes/assets/html/2020102414370328.png">![示例](/notes/assets/html/2020102414370328.png)</a>

**screen（屏幕对象）**

```js
screen.width;//屏幕宽度
screen.height; //屏幕高度
```

**location (地址对象)**

* `location.href`-- 返回或设置当前文档的URL

* `location.search` -- 返回URL中的查询字符串部分。例如 http://www.dreamdu.com/dreamdu.php?id=5&name=dreamdu 返回包括(?)后面的内容?id=5&name=dreamdu

* `location.hash` -- 返回URL#后面的内容，如果没有#，返回空

* `location.host` -- 返回URL中的域名部分，例如www.dreamdu.com

* `location.hostname` -- 返回URL中的主域名部分，例如dreamdu.com

* `location.pathname` -- 返回URL的域名后的部分。例如 http://www.dreamdu.com/xhtml/ 返回/xhtml/

* `location.port` -- 返回URL中的端口部分。例如 http://www.dreamdu.com:8080/xhtml/ 返回8080

* `location.protocol` -- 返回URL中的协议部分。例如 http://www.dreamdu.com:8080/xhtml/ 返回(//)前面的内容http:

* `location.assign` -- 设置当前文档的URL

* `location.replace()` -- 设置当前文档的URL，并且在history对象的地址列表中移除这个URL location.replace(url);

* `location.reload()` -- 重载当前页面

**history(历史对象）**

* `history.go()` //前进或后退指定的页面数 history.go(num);

* `history.back()`// 后退一页

* `history.forward()` // 前进一页

## DOM指 文档对象模型
Document Object Model 的缩写。即文档对象模型，遵循 W3C 制定的标准。其本质就是 DOM 元素。
DOM 是针对 HTML 的基于树的 API。描述了处理网页内容的方法和接口，是 HTML 的API，DOM 把整个页面规划成由节点层级构成的文档。

注意: 只有 JS 的宿主环境是浏览器的时候才有 DOM 和 BOM ，在 Node 中是没有这两个对象的。

**DOM**
---

* JavaScript操作网页的接口，全称为“文档对象模型(Document Object Model)。 有这几个概念：文档、元素、节点

* 整个文档是一个文档节点

* 每个标签是一个元素节点

* 包含在元素中的文本是文本节点

* 元素上的属性是属性节点

* 文档中的注释是注释节点

**DOM本质 DOM树：**
---

> DOM树是结构，树是由DOM元素和属性节点组成的，DOM的本质是把html结构化成js可以识别的树模型；
> 
> 有了树模型，就有了层级结构，层级结构是指元素和元素之间的关系父子，兄弟。

<a data-fancybox title="示例" href="/notes/assets/html/20201024140711640.png">![示例](/notes/assets/html/20201024140711640.png)</a>

**DOM 节点操作**
---

* `新增节点`

* `查询子节点`

* `查询父节点`

* `删除节点`

```
1. 创建新节点  （document调用）

createDocumentFragment() //创建一个DOM片段
createElement() //创建一个具体的元素
createTextNode() //创建一个文本节点

2. 添加、移除、替换、插入  （父元素调用）

appendChild() //添加
removeChild() //移除
replaceChild() //替换
insertBefore() //插入

3. 查找 （document调用）

getElementsByTagName() //通过标签名称 一组元素
getElementsByName() //通过元素的Name属性的值 一组元素
getElementById() //通过元素Id，唯一性单个元素
getElementByClassName()//通过c元素lass获取  一组元素
qurySelectorAll('选择器') // 通过选择器获取一组元素
querySelector("选择器") // 通过选择器获取单个元素

4. 关系  （元素调用前三个父元素调用 ）

childNodes // 获取所有的子节点
children  // 获取所有的子元素节点 (常用)
firstElementChild   获取第一个元素
lastElementChild  获取最后一个元素
parentNode	获取当前节点的父节点
previousElementSibling	获取当前节点的前一个兄弟元素
nextElementSibling 获取当前节点的后一个兄弟元素
```

**Dom节点的Attribute和Property区别**
---

<!-- ![demo](/notes/assets/html/20201024141424441.png) -->
<a data-fancybox title="示例" href="/notes/assets/html/20201024141424441.png">![示例](/notes/assets/html/20201024141424441.png)</a>

<!-- ![demo](/notes/assets/html/20201024141451942.png) -->
<a data-fancybox title="示例" href="/notes/assets/html/20201024141451942.png">![示例](/notes/assets/html/20201024141451942.png)</a>

<!-- ![demo](/notes/assets/html/20201024141514206.png) -->
<a data-fancybox title="示例" href="/notes/assets/html/20201024141514206.png">![示例](/notes/assets/html/20201024141514206.png)</a>

<!-- ![demo](/notes/assets/html/20201024141631577.png) -->
<a data-fancybox title="示例" href="/notes/assets/html/20201024141631577.png">![示例](/notes/assets/html/20201024141631577.png)</a>

优化流程

<!-- ![demo](/notes/assets/html/20201024141702164.png) -->
<a data-fancybox title="示例" href="/notes/assets/html/20201024141702164.png">![示例](/notes/assets/html/20201024141702164.png)</a>