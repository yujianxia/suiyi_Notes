# ES9新特性（2018）

* 异步迭代

* Promise.finally()

* Rest/Spread 属性

* [正则表达式命名捕获组](http://esnext.justjavac.com/proposal/regexp-named-groups.html)（Regular Expression Named Capture Groups）

* [正则表达式反向断言](https://segmentfault.com/a/1190000006824133)（lookbehind）

* 正则表达式dotAll模式

* [正则表达式 Unicode 转义](https://juejin.im/post/6844903622870827022#heading-1)

* [非转义序列的模板字符串](https://juejin.im/post/6844903622870827022#heading-1)

## 1.异步迭代

在`async/await`的某些时刻，你可能尝试在同步循环中调用异步函数。例如：

```js
async function process(array) {
  for (let i of array) {
    await doSomething(i);
  }
}
```

这段代码不会正常运行，下面这段同样也不会：

```js
async function process(array) {
  array.forEach(async i => {
    await doSomething(i);
  });
}
```

这段代码中，循环本身依旧保持同步，并在在内部异步函数之前全部调用完成。

ES2018引入异步迭代器（asynchronous iterators），这就像常规迭代器，除了`next()`方法返回一个`Promise`。因此`await`可以和`for...of`循环一起使用，以串行的方式运行异步操作。例如：

```js
async function process(array) {
  for await (let i of array) {
    doSomething(i);
  }
}
```

## 2.Promise.finally()

一个`Promise`调用链要么成功到达最后一个`.then()`，要么失败触发`.catch()`。在某些情况下，你想要在无论`Promise`运行成功还是失败，运行相同的代码，例如清除，删除对话，关闭数据库连接等。

`.finally()`允许你指定最终的逻辑：

```js
function doSomething() {
  doSomething1()
  .then(doSomething2)
  .then(doSomething3)
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    // finish here!
  });
}
```

## 3.Rest/Spread 属性

ES2015引入了[Rest参数](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FFunctions%2FRest_parameters)和[扩展运算符](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FOperators%2FSpread_syntax)。三个点（...）仅用于数组。Rest参数语法允许我们将一个不定数量的参数表示为一个数组。

```js
restParam(1, 2, 3, 4, 5);

function restParam(p1, p2, ...p3) {
  // p1 = 1
  // p2 = 2
  // p3 = [3, 4, 5]
}
```

展开操作符以相反的方式工作，将数组转换成可传递给函数的单独参数。例如`Math.max()`返回给定数字中的最大值：

```js
const values = [99, 100, -1, 48, 16];
console.log( Math.max(...values) ); // 100
```

`ES2018`为对象解构提供了和数组一样的`Rest`参数（）和展开操作符，一个简单的例子：

```js
const myObject = {
  a: 1,
  b: 2,
  c: 3
};

const { a, ...x } = myObject;
// a = 1
// x = { b: 2, c: 3 }
```

或者你可以使用它给函数传递参数：

```js
restParam({
  a: 1,
  b: 2,
  c: 3
});

function restParam({ a, ...x }) {
  // a = 1
  // x = { b: 2, c: 3 }
}
```

跟数组一样，`Rest`参数只能在声明的结尾处使用。此外，它只适用于每个对象的顶层，如果对象中嵌套对象则无法适用。

扩展运算符可以在其他对象内使用，例如：

```js
const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { ...obj1, z: 26 };
// obj2 is { a: 1, b: 2, c: 3, z: 26 }
```

可以使用扩展运算符拷贝一个对象，像是这样`obj2 = {...obj1}`，但是 **这只是一个对象的浅拷贝**。另外，如果一个对象A的属性是对象B，那么在克隆后的对象cloneB中，该属性指向对象B。

## 4.正则表达式命名捕获组

`JavaScript`正则表达式可以返回一个匹配的对象——一个包含匹配字符串的类数组，例如：以`YYYY-MM-DD`的格式解析日期：

```js
const
  reDate = /([0-9]{4})-([0-9]{2})-([0-9]{2})/,
  match  = reDate.exec('2018-04-30'),
  year   = match[1], // 2018
  month  = match[2], // 04
  day    = match[3]; // 30
```

这样的代码很难读懂，并且改变正则表达式的结构有可能改变匹配对象的索引。

ES2018允许命名捕获组使用符号`?<name>`，在打开捕获括号`(`后立即命名，示例如下：

```js
const
  reDate = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/,
  match  = reDate.exec('2018-04-30'),
  year   = match.groups.year,  // 2018
  month  = match.groups.month, // 04
  day    = match.groups.day;   // 30
```

任何匹配失败的命名组都将返回`undefined`。

命名捕获也可以使用在`replace()`方法中。例如将日期转换为美国的 `MM-DD-YYYY` 格式：

```js
const
  reDate = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/,
  d      = '2018-04-30',
  usDate = d.replace(reDate, '$<month>-$<day>-$<year>');
```

## 5.正则表达式反向断言

目前`JavaScript`在正则表达式中支持先行断言（`lookahead`）。这意味着匹配会发生，但不会有任何捕获，并且断言没有包含在整个匹配字段中。例如从价格中捕获货币符号：

```js
const
  reLookahead = /\D(?=\d+)/,
  match       = reLookahead.exec('$123.89');

console.log( match[0] ); // $
```

`ES2018`引入以相同方式工作但是匹配前面的反向断言（`lookbehind`），这样我就可以忽略货币符号，单纯的捕获价格的数字：

```js
const
  reLookbehind = /(?<=\D)\d+/,
  match        = reLookbehind.exec('$123.89');

console.log( match[0] ); // 123.89
```

以上是 **肯定反向断言**，非数字`\D`必须存在。同样的，还存在 **否定反向断言**，表示一个值必须不存在，例如：

```js
const
  reLookbehindNeg = /(?<!\D)\d+/,
  match           = reLookbehind.exec('$123.89');

console.log( match[0] ); // null
```

## 6.正则表达式dotAll模式

正则表达式中点.匹配除回车外的任何单字符，标记`s`改变这种行为，允许行终止符的出现，例如：

```js
/hello.world/.test('hello\nworld');  // false
/hello.world/s.test('hello\nworld'); // true
```

## 7.正则表达式 Unicode 转义

到目前为止，在正则表达式中本地访问 `Unicode` 字符属性是不被允许的。`ES2018`添加了 `Unicode` 属性转义——形式为`\p{...}`和`\P{...}`，在正则表达式中使用标记 `u` (unicode) 设置，在`\p`块儿内，可以以键值对的方式设置需要匹配的属性而非具体内容。例如：

```js
const reGreekSymbol = /\p{Script=Greek}/u;
reGreekSymbol.test('π'); // true
```

此特性可以避免使用特定 `Unicode` 区间来进行内容类型判断，提升可读性和可维护性。

## 8.非转义序列的模板字符串

之前，`\u`开始一个 unicode 转义，`\x`开始一个十六进制转义，`\`后跟一个数字开始一个八进制转义。这使得创建特定的字符串变得不可能，例如Windows文件路径 `C:\uuu\xxx\111`。更多细节参考[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)。

