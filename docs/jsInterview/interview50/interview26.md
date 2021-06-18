# 第26天 说说bind、call、apply的区别？并手写实现一个bind的方法

## 思路一

`call`和`apply`都是为了解决改变`this`的指向。作用都是相同的，只是传参的方式不同。

除了第一个参数外，`call`可以接收一个参数列表，`apply`只接受一个参数数组。 `bind`绑定完之后返回一个新的函数，不执行。

```js
Function.prototype.myCall = function (context = window) {
  context.fn = this;

  var args = [...arguments].slice(1);

  var result = context.fn(...args);
  // 执行完后干掉
  delete context.fn;
  return result;
}
```

```js
Function.prototype.myApply = function (context = window) {
  context.fn = this;

  var result
  // 判断 arguments[1] 是不是 undefined
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn
  return result;
```

```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var _this = this
  var args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```

## 思路二

## bind

bind() 方法不会调用函数，他会绑定其他元素，当其他元素触发事件时改变 this 的指向

语法：`fun.bind(thisArg, arg1, arg2, ...)`
参数：

- thisArg：在 fun 函数运行时指定的 this 值
- arg1，arg2：传递的其他参数
- 可以传参数，但是不会调用，可以赋值给其他元素

注意：

- 返回值改变 this 的指向
- 他不会调用函数，因此在不需要立即执行的事件上很好用

**实现 bind 方法**

```js
Function.prototype._bind = function() {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable'
    )
  }
  let self = this
  // 需要传入self的参数
  let args = Array.prototype.slice.call(arguments, 1)
  return function() {
    return self.apply(self, args)
  }
}
Function.prototype._bind = Function.prototype._bind || function() {}
```

---

## call() 方法

call() 方法调用一个函数。简单理解为调用函数的方式，但是它可以改变函数的 this 指向

语法：`fun.call(thisArg, arg1, arg2, ...)`
参数：

- thisArg：在 fun 函数运行时指定的 this 值
- arg1，arg2：传递的其他参数

注意：

- 返回值就是函数的返回值，因为它就是调用函数
- 因此当我们想改变 this 指向，同时想调用这个函数的时候，可以使用 call，比如继承
- call()无参数 / call(null) / call(undefined);这三种 this 都指向 window

**实现 call 方法**

```js
Function.prototype._call = function() {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable'
    )
  }
  let self = this
  let pointTo = arguments[0] || window
  // 需要传入self的参数
  let args = Array.from(arguments).slice(1)
  pointTo.fn = self
  pointTo.fn(...args)
  // 需要传入self的参数
}
Function.prototype._call = Function.prototype._call || function() {}
```

---

## apply 方法

apply() 方法调用一个函数。简单理解为调用函数的方式，但是它可以改变函数的 this 指向，参数为数组形式

语法：`fun.apply(thisArg, [arg1, arg2, ...])`
参数：

- thisArg：在 fun 函数运行时指定的 this 值
- arg1，arg2：传递的其他参数放在中括号内

注意：

- 因此 apply 主要跟数组有关系，比如使用 Math.max() 求数组的最大值
- 和 call()的区别就是，apply()的参数放在中括号内
  **实现 call 方法**

```js
Function.prototype._apply = function() {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable'
    )
  }
  let self = this
  let pointTo = arguments[0] || window
  // 需要传入self的参数
  let [args] = Array.from(arguments).slice(1)
  pointTo.fn = self
  pointTo.fn(...args)
  // 需要传入self的参数
}
Function.prototype._apply = Function.prototype._apply || function() {}
```

## 思路三

```js
const run = function(x,y){ return x + y + this.z }
const obj = {z: 3}
const res = run.bind(obj, 1, 2)
console.log(res())

Function.prototype.myBind = function(){
  if (typeof this !== 'function') {
    throw new TypeError('not funciton')
  }
  const [context, ...args] = arguments
  const symbolFn = Symbol('fn')
  context.symbolFn = this

  return function() {
    const res = context.symbolFn(...args)
    delete context.symbolFn
    return res
  }
}

console.log(run.myBind(obj, 4, 5)())


Function.prototype.mybind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let _this = this
  let arg = [...arguments].slice(1)
  return function F() {
    // 处理函数使用new的情况
    if (this instanceof F) {
      console.log(this)
      return new _this(...arg, ...arguments)
    } else {
      console.log(arguments)
      return _this.apply(context, arg.concat(...arguments))
    }
  }
}
```
