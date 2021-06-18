# Promise

## 描述

一个 `Promise` 对象代表一个在这个 `promise` 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 `promise`，以便在未来某个时候把值交给使用者。

一个 `Promise` 必然处于以下几种状态之一：

* 待定（`pending`）: 初始状态，既没有被兑现，也没有被拒绝。

* 已兑现（`fulfilled`）: 意味着操作成功完成。

* 已拒绝（`rejected`）: 意味着操作失败。

待定状态的 `Promise` 对象要么会通过一个值被兑现（`fulfilled`），要么会通过一个原因（`错误`）被拒绝（`rejected`）。当这些情况之一发生时，用 `promise` 的 `then` 方法排列起来的相关处理程序就会被调用。如果 `promise` 在一个相应的处理程序被绑定时就已经被兑现或被拒绝了，那么这个处理程序就会被调用，因此在完成异步操作和绑定处理方法之间不会存在竞争状态。

因为 [Promise.prototype.then](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 和  [Promise.prototype.catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 方法返回的是 `promise`， 所以它们可以被链式调用。

<a data-fancybox title="demo" href="/notes/assets/promises.png">![demo](/notes/assets/promises.png)</a>

> **不要和惰性求值混淆：** 有一些语言中有惰性求值和延时计算的特性，它们也被称为“promises”，例如 Scheme。JavaScript 中的 promise 代表的是已经正在发生的进程， 而且可以通过回调函数实现链式调用。 如果您想对一个表达式进行惰性求值，就考虑一下使用无参数的"箭头函数":  `f = () =>表达式` 来创建惰性求值的表达式，使用 `f()` 求值。

> **注意：** 如果一个 `promise` 已经被兑现（`fulfilled`）或被拒绝（`rejected`），那么也可以说它处于已敲定（`settled`）状态。您还会听到一个经常跟 `promise` 一起使用的术语：已决议（`resolved`），它表示 `promise` 已经处于已敲定(`settled`)状态，或者为了匹配另一个 `promise` 的状态被"锁定"了。Domenic Denicola 的 [States and fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) 中有更多关于 promise 术语的细节可以供您参考。

## Promise的链式调用

可以用 `promise.then()`，`promise.catch()` 和 `promise.finally()` 这些方法将进一步的操作与一个变为已敲定状态的 `promise` 关联起来。这些方法还会返回一个新生成的 `promise` 对象，这个对象可以被非强制性的用来做链式调用，就像这样：

```js
const myPromise =
  (new Promise(myExecutorFunc))
  .then(handleFulfilledA,handleRejectedA)
  .then(handleFulfilledB,handleRejectedB)
  .then(handleFulfilledC,handleRejectedC);

// 或者，这样可能会更好...

const myPromise =
  (new Promise(myExecutorFunc))
  .then(handleFulfilledA)
  .then(handleFulfilledB)
  .then(handleFulfilledC)
  .catch(handleRejectedAny);
```

过早地处理被拒绝的 `promise` 会对之后 `promise` 的链式调用造成影响。不过有时候因为需要马上处理一个错误也只能这样做。（有关应对影响的技巧，请参见下面示例中的 `throw -999` ）另一方面，在没有迫切需要的情况下，可以在最后一个.catch() 语句时再进行错误处理，这种做法更加简单。

这两个函数的签名很简单，它们只接受一个任意类型的参数。这些函数由您（编程者）编写。这些函数的终止状态决定着链式调用中下一个promise的"已敲定 （`settled`）"状态是什么。任何不是 `throw` 的终止都会创建一个"已决议（`resolved`）"状态，而以 `throw` 终止则会创建一个"已拒绝"状态。

```js
handleFulfilled(value)       { /*...*/; return nextValue;  }
handleRejection(reason)      { /*...*/; throw  nextReason; }
handleRejection(reason)      { /*...*/; return nextValue;  }
```

被返回的 `nextValue` 可能是另一个`promise`对象，这种情况下这个`promise`会被动态地插入链式调用。 

当 `.then()` 中缺少能够返回 `promise` 对象的函数时，链式调用就直接继续进行下一环操作。因此，链式调用可以在最后一个 `.catch()` 之前把所有的 `handleRejection` 都省略掉。类似地， `.catch()` 其实只是没有给 `handleFulfilled` 预留参数位置的 `.then()` 而已。

链式调用中的 `promise` 们就像俄罗斯套娃一样，是嵌套起来的，但又像是一个栈，每个都必须从顶端被弹出。链式调用中的第一个 `promise` 是嵌套最深的一个，也将是第一个被弹出的。

> (promise D, (promise C, (promise B, (promise A) ) ) )

当存在一个 `nextValue` 是 `promise` 时，就会出现一种动态的替换效果。`return` 会导致一个 `promise` 被弹出，但这个 `nextValue` promise 则会被推入被弹出 `promise` 原来的位置。对于上面所示的嵌套场景，假设与 "promise B" 相关的 `.then()` 返回了一个值为 "promise X" 的 `nextValue` 。那么嵌套的结果看起来就会是这样：

> (promise D, (promise C, (promise X) ) )

一个 `promise` 可能会参与不止一次的嵌套。对于下面的代码，`promiseA` 向"已敲定"（"`settled`"）状态的过渡会导致两个实例的 `.then` 都被调用。

```js
const promiseA = new Promise(myExecutorFunc);
const promiseB = promiseA.then(handleFulfilled1, handleRejected1);
const promiseC = promiseA.then(handleFulfilled2, handleRejected2); 
```

一个已经处于"已敲定"（"`settled`"）状态的 `promise` 也可以接收操作。在那种情况下，（如果没有问题的话，）这个操作会被作为第一个异步操作被执行。注意，所有的 `promise` 都一定是异步的。因此，一个已经处于"已敲定"（"`settled`"）状态的 `promise` 中的操作只有 `promise` 链式调用的栈被清空了和一个事件循环过去了之后才会被执行。这种效果跟 `setTimeout(action, 10)` 特别相似。

```js
const promiseA = new Promise( (resolutionFunc,rejectionFunc) => {
    resolutionFunc(777);
});
// 这时，"promiseA" 已经被敲定了。
promiseA.then( (val) => console.log("asynchronous logging has val:",val) );
console.log("immediate logging");

// produces output in this order:
// immediate logging
// asynchronous logging has val: 777
```

## 构造函数

[`Promise()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise)

创建一个新的 `Promise` 对象。该构造函数主要用于包装还没有添加 `promise` 支持的函数。

## 静态方法

[`Promise.all(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

这个方法返回一个新的`promise`对象，该`promise`对象在`iterable`参数对象里所有的`promise`对象都成功的时候才会触发成功，一旦有任何一个`iterable`里面的`promise`对象失败则立即触发该`promise`对象的失败。这个新的`promise`对象在触发成功状态以后，会把一个包含`iterable`里所有`promise`返回值的数组作为成功回调的返回值，顺序跟`iterable`的顺序保持一致；如果这个新的`promise`对象触发了失败状态，它会把`iterable`里第一个触发失败的`promise`对象的错误信息作为它的失败错误信息。`Promise.all`方法常被用于处理多个`promise`对象的状态集合。（可以参考`jQuery.when`方法---译者注）

[`Promise.allSettled(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

等到所有`promises`都已敲定（`settled`）（每个`promise`都已兑现（`fulfilled`）或已拒绝（`rejected`））。
返回一个`promise`，该`promise`在所有`promise`完成后完成。并带有一个对象数组，每个对象对应每个`promise`的结果。

[`Promise.any(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

接收一个`Promise`对象的集合，当其中的一个 `promise` 成功，就返回那个成功的`promise`的值。

[`Promise.race(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

当`iterable`参数里的任意一个子`promise`被成功或失败后，父`promise`马上也会用子`promise`的成功返回值或失败详情作为参数调用父`promise`绑定的相应句柄，并返回该`promise`对象。

[`Promise.reject(reason)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

返回一个状态为失败的`Promise`对象，并将给定的失败信息传递给对应的处理方法

[`Promise.resolve(value)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

返回一个状态由给定`value`决定的`Promise`对象。如果该值是`thenable`(即，带有`then`方法的对象)，返回的`Promise`对象的最终状态由`then`方法执行决定；否则的话(该`value`为空，基本类型或者不带`then`方法的对象),返回的`Promise`对象状态为`fulfilled`，并且将该`value`传递给对应的`then`方法。通常而言，如果您不知道一个值是否是`Promise`对象，使用`Promise.resolve(value)` 来返回一个`Promise`对象,这样就能将该`value`以`Promise`对象形式使用。

# Promise 原型

## 属性

`Promise.prototype.constructor`

返回被创建的实例函数.  默认为 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 函数.

## 方法

[`Promise.prototype.catch(onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

添加一个拒绝(`rejection`) 回调到当前 `promise`, 返回一个新的`promise`。当这个回调函数被调用，新 `promise` 将以它的返回值来`resolve`，否则如果当前`promise` 进入`fulfilled`状态，则以当前`promise`的完成结果作为新`promise`的完成结果.

[`Promise.prototype.then(onFulfilled, onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)

添加解决(`fulfillment`)和拒绝(`rejection`)回调到当前 `promise`, 返回一个新的 `promise`, 将以回调的返回值来`resolve`.

[`Promise.prototype.finally(onFinally)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)

添加一个事件处理回调于当前`promise`对象，并且在原`promise`对象解析完毕后，返回一个新的`promise`对象。回调会在当前`promise`运行完毕后被调用，无论当前`promise`的状态是完成(`fulfilled`)还是失败(`rejected`)

# 创建Promise

`Promise` 对象是由关键字 `new` 及其构造函数来创建的。该构造函数会把一个叫做“处理器函数”（`executor function`）的函数作为它的参数。这个“处理器函数”接受两个函数——`resolve` 和 `reject` ——作为其参数。当异步任务顺利完成且返回结果值时，会调用 `resolve` `函数；而当异步任务失败且返回失败原因（通常是一个错误对象）时，会调用reject` 函数。

```js
const myFirstPromise = new Promise((resolve, reject) => {
  // ?做一些异步操作，最终会调用下面两者之一:
  //
  //   resolve(someValue); // fulfilled
  // ?或
  //   reject("failure reason"); // rejected
});
```

想要某个函数拥有`promise`功能，只需让其返回一个`promise`即可。

```js
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};
```

# 示例

## 基础示例

```js
let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```

## 高级示例

本例展示了 `Promise` 的一些机制。 `testPromise()` 方法在每次点击 `<button>` 按钮时被调用，该方法会创建一个`promise` 对象，使用 `window.setTimeout()` 让`Promise`等待 1-3 秒不等的时间来填充数据（通过`Math.random()`方法）。

`Promise` 的值的填充过程都被日志记录（`logged`）下来，这些日志信息展示了方法中的同步代码和异步代码是如何通过`Promise`完成解耦的。

```js
'use strict';
var promiseCount = 0;

function testPromise() {
    let thisPromiseCount = ++promiseCount;

    let log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') 开始 (<small>同步代码开始</small>)<br/>');

    // 新构建一个 Promise 实例：使用Promise实现每过一段时间给计数器加一的过程，每段时间间隔为1~3秒不等
    let p1 = new Promise(
        // resolver 函数在 Promise 成功或失败时都可能被调用
       (resolve, reject) => {
            log.insertAdjacentHTML('beforeend', thisPromiseCount +
                ') Promise 开始 (<small>异步代码开始</small>)<br/>');
            // 创建一个异步调用
            window.setTimeout(
                function() {
                    // 填充 Promise
                    resolve(thisPromiseCount);
                }, Math.random() * 2000 + 1000);
        }
    );

    // Promise 不论成功或失败都会调用 then
    // catch() 只有当 promise 失败时才会调用
    p1.then(
        // 记录填充值
        function(val) {
            log.insertAdjacentHTML('beforeend', val +
                ') Promise 已填充完毕 (<small>异步代码结束</small>)<br/>');
        })
    .catch(
        // 记录失败原因
       (reason) => {
            console.log('处理失败的 promise ('+reason+')');
        });

    log.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Promise made (<small>同步代码结束</small>)<br/>');
}
```