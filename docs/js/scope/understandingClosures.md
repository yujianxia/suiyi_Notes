### 【进阶2-2期】JavaScript深入之从作用域链理解闭包

**基本概念**
---

红宝书(p178)上对于闭包的定义：**闭包是指有权访问另外一个函数作用域中的变量的函数**

MDN 对闭包的定义为：**闭包是指那些能够访问自由变量的函数**

其中**自由变量**，指在函数中使用的，但既不是函数参数`arguments`也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。

使用上一篇文章的例子来说明下**自由变量**

```javascript
function getOuter(){
    var date = '1127';
    function getDate(str){
        console.log(str + date);  //访问外部的date
    }
    return getDate('今天是：'); //"今天是：1127"
}
getOuter();
```

其中`date`既不是参数`arguments`，也不是局部变量，所以`date`是自由变量。

总结起来就是下面两点：

* 1、是一个函数（比如，内部函数从父函数中返回）

* 2、能访问上级函数作用域中的变量（哪怕上级函数上下文已经销毁）

**执行流程分析**
---

首先来一个简单的例子

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope(); // foo指向函数f
foo();					// 调用函数f()
```

简要的执行过程如下：

1. 进入全局代码，创建全局执行上下文，全局执行上下文**压入执行上下文栈**

2. 全局执行**上下文初始化**

3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈

4. checkscope 执行**上下文初始化**，创建变量对象、作用域链、this等

5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈

7. f 执行**上下文初始化**，创建变量对象、作用域链、this等

8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

<a data-fancybox title="" href="https://camo.githubusercontent.com/2b271448ad38e8fde43f28db066af7dbe356cbb3/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31312f352f313636653235386531643032383161363f696d61676556696577322f302f772f313238302f682f3936302f666f726d61742f776562702f69676e6f72652d6572726f722f31">![](https://camo.githubusercontent.com/2b271448ad38e8fde43f28db066af7dbe356cbb3/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31312f352f313636653235386531643032383161363f696d61676556696577322f302f772f313238302f682f3936302f666f726d61742f776562702f69676e6f72652d6572726f722f31)</a>

那么问题来了， 函数f 执行的时候，checkscope 函数上下文已经被销毁了，那函数f是如何获取到scope变量的呢？

上文介绍过，函数f 执行上下文维护了一个作用域链，会指向指向checkscope作用域，作用域链是一个数组，结构如下。

```javascript
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}
```

所以指向关系是当前作用域 --> `checkscope作用域`--> 全局作用域，即使 checkscopeContext 被销毁了，但是 JavaScript 依然会让 checkscopeContext.AO（活动对象） 活在内存中，f 函数依然可以通过 f 函数的作用域链找到它，这就是闭包实现的**关键**。

**概念**
---

上面介绍的是实践角度，其实闭包有很多种介绍，说法不一。

* 1、从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。

* 2、从实践角度：以下函数才算是闭包：

    - * 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）

    - * 在代码中引用了自由变量

**面试必刷题**
---

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
    data[i] = function () {
        console.log(i);
    };
}

data[0]();
data[1]();
data[2]();
```

如果知道闭包的，答案就很明显了，都是3

循环结束后，全局执行上下文的VO是

```javascript
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

执行 `data[0]` 函数的时候，`data[0]` 函数的作用域链为：

```javascript
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

由于其自身没有i变量，就会向上查找，所有从全局上下文查找到i为3，`data[1]` 和 `data[2]` 是一样的。

**解决办法**

改成闭包，方法就是data[i]返回一个函数，并访问变量i

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
    data[i] = (function (i) {
        return function(){
            console.log(i);
        }
    })(i);
}

data[0]();	// 0
data[1]();	// 1
data[2]();	// 2
```

循环结束后的全局执行上下文没有变化。

执行 `data[0]` 函数的时候，`data[0]` 函数的作用域链发生了改变：

```javascript
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO, globalContext.VO]
}
```

匿名函数执行上下文的AO为：

```javascript
Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

因为闭包执行上下文中贮存了变量`i`，所以根据作用域链会在`globalContext.VO`中查找到变量`i`,并输出0。

**思考题**
---

上面必刷题改动一个地方，把for循环中的var i = 0，改成let i = 0。结果是什么，为什么？？？

```javascript
var data = [];

for (let i = 0; i < 3; i++) {
    data[i] = function () {
        console.log(i);
    };
}

data[0]();
data[1]();
data[2]();
```