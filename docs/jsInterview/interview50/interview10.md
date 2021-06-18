# 第10天 简要描述下什么是回调函数并写一个例子出来
---

## 思路

> 通常对于某一个具体形式的定义从其例子入手

### demo1

```js
dom.addEventerlisten('click',function(){
  // do something
})
```

### demo2

回调函数首先作为一个函数的参数传入，当这个函数执行后再执行的函数，往往会依赖前一个函数执行的结果。
在 `javascript` 中，对于 `I/O`、`HTTP` 请求等异步操作，为了控制执行的顺序就需要使用回调的方法。

```js
// 第三个参数就是回调函数
function func1(param1, param2, ..., callback){
  // To do some action
  // 往往会在最后调用 callback 并且传入操作过的参数
  callback(cbParam1, cbParam2, ...)
}

// 实际调用的时候
func1(param1, param2, ..., (cbParam1, cbParam2, ...) => {
  // To do some action
})
```

当有过个任务需要顺序执行时，如果采用回调函数的形式就会出现我们熟悉的“回调地狱”的情况。为了解决这个问题，在 ES6 中就有了 `Promise` 和 `async`/`await` 方法。
目前看来 `async`/`await` 在异步写法上较为优雅。

### demo3

> 回调是把一个函数作为参数传递给另一个函数，当该函数满足某个条件时触发该参数函数。
> 主要用于异步操作 例如网络请求 防止页面同步代码阻塞导致渲染线程停止

```js
function longTask(callback,timeout) {
  setTimeout(callback,timeout)
}
longTask(()=>{console.log("回调任务被执行了");},2000);
console.log("我是同步代码 不会阻塞我");
```

### demo4

回调函数一般用来解决异步请求：

> 给每一个任务（函数）传入一个或多个回调函数（callback），前一个任务结束后（比如请求接口），不是执行后一个任务，而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序的执行顺序与任务的排列顺序是不一致的、异步的。

```js
/**
 * 普通语法
 * @param scr:图片的url地址
 * @param callback：图片加载成功的回调函数
 * @param fail：图片加载失败的回调函数
 */
function loadImg(scr, callback, fail) {
    var img = document.createElement('img');

    // onload 事件在图片加载完成后立即执行,成功后执行callback函数,相当于一个回调函数。
    img.onload = function () {
        callback(img) // 图片加载成功执行的回调函数,传入img
    };
    // 图片加载失败执行这个函数
    img.onerror = function () {
        fail()  // 图片加载失败执行的回调函数,传入img
    };
    img.src = scr
}

var src = 'https://cdn.segmentfault.com/sponsor/20200202.png';

// 调用函数，传入2个回调函数，第一个是成功的回调，第二个是失败的回调。
loadImg(src, function (img) {
    console.log(img.width)  // 回调函数里打印图片的宽

}, function () {
    console.log('failed') // 这个是失败的回调函数
});
```

## 总结

> 回调函数就是一个通过函数指针调用的函数。如果你把函数的指针（地址）作为参数传递给另一个函数，当这个指针被用来调用其所指向的函数时，我们就说这是回调函数。回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应。

> 回调方法 是 任何一个 被 以该回调方法为其第一个参数 的 其它方法 调用 的方法。很多时候，回调是一个当某些事件发生时被调用的方法。