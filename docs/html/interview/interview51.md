**html5shiv.js分析**
---

首先，先了解一下html5shiv.js是什么。

html5shiv.js是一套实现让ie低版本等浏览器支持html5标签的解决方案。

# 源码学习知识点

## Function

`Function`的使用，注意这里是首字母大写的。此处的使用请查看shivMethods方法。Function主要是用来实现动态执行。它可以实现跟eval一样的工作，但由于它在性能方面胜过eval，所以很多人都推荐使用Function。

`Function`的执行形式如下：
var 函数名 = new Function('argument1','argument2',...,'argumentN','函数体');
或者
var 函数名 = new Function('argument1,argument2,...,argumentN','函数体');
或者
new Function('执行体');

经测试发现new关键字可以省略

`Function` 需要执行，才能执行中间的执行体，上面类似于声明

## createDocumentFragment

createDocumentFragment即创建文档碎片节点的使用。创建文档碎片节点的目的是为了减少浏览器渲染的次数来提升性能。比如，当要往页面中添加一系列节点时，如果每次都实时向页面使用appendChild来添加节点时，那么每次浏览器都会渲染一次，而过多次数的渲染就会造成性能问题。如果先把要添加的节点都先加到文档碎片节点中去，完成后再一次添加到页面中去就只渲染一次

## json封装属性和方法

通过json的方式进行属性和方法的封装。可以大大减少全局变量的污染

## 通过将私有方法或属性赋值给全局对象的属性来将方法公开

通过将私有方法或属性赋值给全局对象的属性来将方法公开。比如当定义了许多方法或属性，但不想公开所有方法或属性，此时就可以通过闭包将方法私有化，然后再通过返回赋值给全局变量的方式公开部分属性和方法。如此处通过名字叫html5的全局对象的属性进行公开。