# Symbol

**symbol** 是一种基本数据类型 （[primitive data type](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)）。`Symbol()`函数会返回**symbol类型**的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："`new Symbol()`"。

每个从`Symbol()`返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的

> 示例代码

```js
const symbol1 = Symbol();
const symbol2 = Symbol(42);
const symbol3 = Symbol('foo');

console.log(typeof symbol1);
// expected output: "symbol"

console.log(symbol2 === 42);
// expected output: false

console.log(symbol3.toString());
// expected output: "Symbol(foo)"

console.log(Symbol('foo') === Symbol('foo'));
// expected output: false
```

## 语法

> Symbol([description])

**参数**

**description 可选**

可选的，字符串类型。对symbol的描述，可用于调试但不是访问symbol本身。

## 描述

直接使用`Symbol()`创建新的symbol类型，并用一个可选的字符串作为其描述。

```js
var sym1 = Symbol();
var sym2 = Symbol('foo');
var sym3 = Symbol('foo');
```

上面的代码创建了三个新的symbol类型。 注意，`Symbol("foo")` 不会强制将字符串 “foo” 转换成symbol类型。它每次都会创建一个新的 symbol类型：

```js
Symbol("foo") === Symbol("foo"); // false
```

下面带有 `new` 运算符的语法将抛出 `TypeError` 错误：

```js
var sym = new Symbol(); // TypeError
```

这会阻止创建一个显式的 `Symbol` 包装器对象而不是一个 `Symbol` 值。围绕原始数据类型创建一个显式包装器对象从 `ECMAScript 6` 开始不再被支持。 然而，现有的原始包装器对象，如 `new Boolean`、`new String`以及`new Number`，因为遗留原因仍可被创建。

创建一个 `Symbol 包装器对象 (Symbol wrapper object)`，你可以使用 `Object()` 函数：

```js
var sym = Symbol("foo");
typeof sym;     // "symbol"
var symObj = Object(sym);
typeof symObj;  // "object"
```

## 全局共享的 `Symbol`

上面使用`Symbol()` 函数的语法，不会在你的整个代码库中创建一个可用的全局的`symbol`类型。 要创建跨文件可用的`symbol`，甚至跨域（每个都有它自己的全局作用域） , 使用 [Symbol.for()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) 方法和  [Symbol.keyFor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor) 方法从全局的`symbol`注册表设置和取得`symbol`。

## 在对象中查找 `Symbol` 属性

[Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) 方法让你在查找一个给定对象的符号属性时返回一个symbol类型的数组。`注意，每个初始化的对象都是没有自己的symbol属性的，因此这个数组可能为空，除非你已经在对象上设置了symbol属性。`

## 属性

`Symbol.length`

长度属性，值为0。

[Symbol.prototype](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/JavaScript/Reference/Global_Objects/Symbol)

`symbol`构造函数的原型。

# 内置的 symbols

JavaScript还内建了一些在ECMAScript 5 之前没有暴露给开发者的symbol，它们代表了内部语言行为

## 迭代 symbols

[Symbol.iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

一个返回一个对象默认迭代器的方法。被 [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) 使用。

[Symbol.asyncIterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)

一个返回对象默认的异步迭代器的方法。被 [for await of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) 使用。

## 正则表达式 symbols

[Symbol.match](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match)

一个用于对字符串进行匹配的方法，也用于确定一个对象是否可以作为正则表达式使用。被 [String.prototype.match()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match) 使用。

[Symbol.replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace)

一个替换匹配字符串的子串的方法. 被 [String.prototype.replace()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 使用。

[Symbol.search](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/search)

一个返回一个字符串中与正则表达式相匹配的索引的方法。被[String.prototype.search()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search) 使用。

[Symbol.split](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)

一个在匹配正则表达式的索引处拆分一个字符串的方法.。被 [String.prototype.split()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split) 使用。

## 其他 symbols

[Symbol.hasInstance](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)

一个确定一个构造器对象识别的对象是否为它的实例的方法。被 [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 使用。

[Symbol.isConcatSpreadable](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable)

一个布尔值，表明一个对象是否应该flattened为它的数组元素。被 [Array.prototype.concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) 使用。

[Symbol.unscopables](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables)

拥有和继承属性名的一个对象的值被排除在与环境绑定的相关对象外。

[Symbol.species](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species)

一个用于创建派生对象的构造器函数。

[Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)

一个将对象转化为基本数据类型的方法。

[Symbol.toStringTag](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)

用于对象的默认描述的字符串值。被 [Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 使用。

## 方法

[Symbol.for(key)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)

使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol。

[Symbol.keyFor(sym)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor)

从全局symbol注册表中，为给定的symbol检索一个共享的?symbol key。

# Symbol 原型

所有 Symbols 继承自 [Symbol.prototype](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/JavaScript/Reference/Global_Objects/Symbol).

## 属性

`Symbol.prototype.constructor`

返回创建实例原型的函数. 默认为 [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 函数。

[Symbol.prototype.description](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/description)

一个包含symbol描述的只读字符串。

## 方法

[Symbol.prototype.toSource()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toSource)

返回包含[Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 对象源码的字符串。覆盖[Object.prototype.toSource()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toSource) 方法。

[Symbol.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toString)

返回包含Symbol描述符的字符串。 覆盖[Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法。

[Symbol.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/valueOf)

返回 [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 对象的初始值.。覆盖 [Object.prototype.valueOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf) 方法。

[Symbol.prototype[@@toPrimitive]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/@@toPrimitive)

返回[Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)对象的初始值。

# 示例

## 对 symbol 使用 typeof 运算符

[typeof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)运算符能帮助你识别 symbol 类型

```js
typeof Symbol() === 'symbol'
typeof Symbol('foo') === 'symbol'
typeof Symbol.iterator === 'symbol'
```

## Symbol 类型转换

当使用 symbol 值进行类型转换时需要注意一些事情：

* 尝试将一个 symbol 值转换为一个 number 值时，会抛出一个 [TypeError](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 错误  (e.g. `+sym` or `sym | 0`).

* 使用宽松相等时， `Object(sym) == sym` returns `true`.

* 这会阻止你从一个 symbol 值隐式地创建一个新的 string 类型的属性名。例如，`Symbol("foo") + "bar" 将抛出一个` [TypeError](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) (can't convert symbol to string).

* ["safer" String(sym) conversion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) 的作用会像symbol类型调用 [Symbol.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toString) 一样，但是注意 `new String(sym)` 将抛出异常。

## Symbols 与 for...in 迭代

Symbols 在 [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) 迭代中不可枚举。另外，[Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) 不会返回 symbol 对象的属性，但是你能使用 [Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) 得到它们。

```js
var obj = {};

obj[Symbol("a")] = "a";
obj[Symbol.for("b")] = "b";
obj["c"] = "c";
obj.d = "d";

for (var i in obj) {
   console.log(i); // logs "c" and "d"
}
```

## Symbols 与 JSON.stringify()

当使用 JSON.stringify() 时，以 symbol 值作为键的属性会被完全忽略：

```js
JSON.stringify({[Symbol("foo")]: "foo"});
// '{}'
```

## Symbol 包装器对象作为属性的键

当一个 Symbol 包装器对象作为一个属性的键时，这个对象将被强制转换为它包装过的 symbol 值：

```js
var sym = Symbol("foo");
var obj = {[sym]: 1};
obj[sym];            // 1
obj[Object(sym)];    // still 1
```

## es6 中 Symbol 数组的遍历接口

<a data-fancybox title="demo" href="/notes/assets/1616482376(1).png">![数组默认Symbol.iterator](/notes/assets/1616482376(1).png)</a>