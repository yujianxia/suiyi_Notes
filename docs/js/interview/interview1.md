# Object.is（）

该`Object.is()`方法确定两个值是否 相同

## 句法

> Object.is(value1, value2);

## 参数

`value1`
    要比较的第一个值。

`value2`
    要比较的第二个值。

## 返回值

`Boolean`
    表示两个参数是否是相同的值。

## 描述

`Object.is()`确定两个值是否相同。如果下列条件之一成立，则两个值相同：

* 两个都 undefined

* 两个都 null

* 两者true或两者false

* 两个长度相同且字符相同且顺序相同的字符串

* 两者都是同一个对象（意味着两个值都引用内存中的相同对象）

* 都是数字则：

    * 两个都 +0

    * 两个都 -0

    * 两个都 NaN

    * 或两者都不为零且两者均不NaN相同，且两者都具有相同的值

这并不相同 ==。该 ==运营商应用各种强制转换双方（如果它们不是同一类型）测试相等（导致这种行为像以前一样 "" == false是true），但Object.is不强迫任何一个值

这也不相同 ===。的 ===操作者（和==操作员以及）对待数值-0和+0为相等和并解决Number.NaN 为不等于NaN。

## 例子

```js
Object.is('foo', 'foo');     // true
Object.is(window, window);   // true

Object.is('foo', 'bar');     // false
Object.is([], []);           // false

var foo = { a: 1 };
var bar = { a: 1 };
Object.is(foo, foo);         // true
Object.is(foo, bar);         // false

Object.is(null, null);       // true

// Special Cases
Object.is(0, -0);            // false
Object.is(0n, -0n);          // true
Object.is(-0, -0);           // true
Object.is(NaN, 0/0);         // true
```

> Polyfill

```js
if (!Object.is) {
  Object.defineProperty(Object, "is", {
    value: function (x, y) {
      // SameValue algorithm
      if (x === y) { // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
  });
}
```