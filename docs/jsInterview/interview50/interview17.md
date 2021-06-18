# 第17天 typeof('abc')和typeof 'abc'都是string, 那么typeof是操作符还是函数？

[抄录Mozilla 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)

## typeof

`typeof` 操作符返回一个字符串，表示未经计算的操作数的类型。

例子：

```js
console.log(typeof 42);
// expected output: "number"

console.log(typeof 'blubber');
// expected output: "string"

console.log(typeof true);
// expected output: "boolean"

console.log(typeof undeclaredVariable);
// expected output: "undefined"
```

## 语法

`typeof` 运算符后接操作数：

> typeof operand
> typeof(operand)

## 参数

* `operand`

一个表示对象或原始值的表达式，其类型将被返回。

## 描述

下表总结了 `typeof` 可能的返回值

| 类型 | 结果 |
| ---- | ---- |
| Undefined | "undefined" |
| Null | "object" |
| Boolean | "boolean" |
| Number | "number" |
| BigInt(ECMAScript 2020 新增) | "bigint" |
| String | "string" |
| Symbol (ECMAScript 2015 新增) | "symbol" |
| 宿主对象（由 JS 环境提供） | 取决于具体实现 |
| Function 对象 (按照 ECMA-262 规范实现 [[Call]]) | "function" |
| 其他任何对象 | "object" |

## 示例

```js
// 数值
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof(42) === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // 尽管它是 "Not-A-Number" (非数值) 的缩写
typeof Number(1) === 'number'; // Number 会尝试把参数解析成数值

typeof 42n === 'bigint';


// 字符串
typeof '' === 'string';
typeof 'bla' === 'string';
typeof `template literal` === 'string';
typeof '1' === 'string'; // 注意内容为数字的字符串仍是字符串
typeof (typeof 1) === 'string'; // typeof 总是返回一个字符串
typeof String(1) === 'string'; // String 将任意值转换为字符串，比 toString 更安全


// 布尔值
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(1) === 'boolean'; // Boolean() 会基于参数是真值还是虚值进行转换
typeof !!(1) === 'boolean'; // 两次调用 ! (逻辑非) 操作符相当于 Boolean()


// Symbols
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';


// Undefined
typeof undefined === 'undefined';
typeof declaredButUndefinedVariable === 'undefined';
typeof undeclaredVariable === 'undefined';


// 对象
typeof {a: 1} === 'object';

// 使用 Array.isArray 或者 Object.prototype.toString.call
// 区分数组和普通对象
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';
typeof /regex/ === 'object'; // 历史结果请参阅正则表达式部分


// 下面的例子令人迷惑，非常危险，没有用处。避免使用它们。
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String('abc') === 'object';

// 函数
typeof function() {} === 'function';
typeof class C {} === 'function'
typeof Math.sin === 'function';
```

### typeof null

```js
// JavaScript 诞生以来便如此
typeof null === 'object';
```

在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 `null` 代表的是空指针（大多数平台下值为 0x00），因此，`null` 的类型标签是 0，`typeof null` 也因此返回 `"object"`。

曾有一个 `ECMAScript` 的修复提案（通过选择性加入的方式），但被拒绝了。该提案会导致 `typeof null === 'null'`。

### 使用 new 操作符

```js
// 除 Function 外的所有构造函数的类型都是 'object'
var str = new String('String');
var num = new Number(100);

typeof str; // 返回 'object'
typeof num; // 返回 'object'

var func = new Function();

typeof func; // 返回 'function'
```

### 语法中的括号

```js
// 括号有无将决定表达式的类型。
var iData = 99;

typeof iData + ' Wisen'; // 'number Wisen'
typeof (iData + ' Wisen'); // 'string'
```

### 正则表达式

对正则表达式字面量的类型判断在某些浏览器中不符合标准：

```js
typeof /s/ === 'function'; // Chrome 1-12 , 不符合 ECMAScript 5.1
typeof /s/ === 'object'; // Firefox 5+ , 符合 ECMAScript 5.1
```

### 错误

在 ECMAScript 2015 之前，`typeof` 总能保证对任何所给的操作数返回一个字符串。即便是没有声明的标识符，`typeof` 也能返回 `'undefined'`。使用 `typeof` 永远不会抛出错误。

但在加入了块级作用域的 `let` 和 `const` 之后，在其被声明之前对块中的 `let` 和 `const` 变量使用 `typeof` 会抛出一个 `ReferenceError`。块作用域变量在块的头部处于`“暂存死区”`，直至其被初始化，在这期间，访问变量将会引发错误。

```js
typeof undeclaredVariable === 'undefined';

typeof newLetVariable; // ReferenceError
typeof newConstVariable; // ReferenceError
typeof newClass; // ReferenceError

let newLetVariable;
const newConstVariable = 'hello';
class newClass{};
```

### 例外

当前所有的浏览器都暴露了一个类型为 `undefined` 的非标准宿主对象 `document.all`。

```js
typeof document.all === 'undefined';
```

尽管规范允许为非标准的外来对象自定义类型标签，但它要求这些类型标签与已有的不同。`document.all` 的类型标签为 `'undefined'` 的例子在 Web 领域中被归类为对原 ECMA JavaScript 标准的“故意侵犯”。

### Real-world usage

`typeof` is very useful, but it's not as versatile as might be required. For example, `typeof([])` , is `'object'`, as well as `typeof(new Date())`, `typeof(/abc/)`, etc.

For greater specificity in checking types, a typeof wrapper for usage in production-level code would be as follows (provided `obj` exists):

```js
function type(obj, fullClass) {

    // get toPrototypeString() of obj (handles all types)
    // Early JS environments return '[object Object]' for null, so it's best to directly check for it.
    if (fullClass) {
        return (obj === null) ? '[object Null]' : Object.prototype.toString.call(obj);
    }
    if (obj == null) { return (obj + '').toLowerCase(); } // implicit toString() conversion

    var deepType = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
    if (deepType === 'generatorfunction') { return 'function' }

    // Prevent overspecificity (for example, [object HTMLDivElement], etc).
    // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
    // String.prototype.match is universally supported.

    return deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/) ? deepType :
       (typeof obj === 'object' || typeof obj === 'function') ? 'object' : typeof obj;
}
```

For checking non-existent variables that would otherwise throw a ReferenceError, use typeof nonExistentVar === 'undefined'.

<a data-fancybox title="demo" href="/notes/assets/mozillaJs/1622687364.jpg">![demo](/notes/assets/mozillaJs/1622687364.jpg)</a>