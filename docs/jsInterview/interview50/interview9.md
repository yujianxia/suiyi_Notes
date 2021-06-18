# 第9天 写一个判断数据类型的方法
---

## 思路一

typeof 不能判读 数组 和 对象 以及null

因而使用toString()

### 产生的问题

原生`typeof`有很多不足如下所示：

```js
typeof null // object
typeof /a/ // object
typeof new String('') // object
function A () {}
typeof (new A) //  'object'
```

期望能返回下面：

```js
import type from '@careteen/type'
type(null) // null
type(/a/) // regexp
type(new String('')) // string
function A () {}
type(new A) //  A
```

### 解法一

使用正则匹配进行判断

```js
function type (obj) {
	return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g,'');
}

console.log(type([]))  //"Array"
console.log(type(1))  //"Number"
```

### 解法二

使用正则截取进行判断

```js
function myType(v){
    return Object.prototype.toString.call(v).replace(/^.{8}(.+)]$/,(m,$1)=> $1.toLowerCase());
}
```

### 解法三

使用字符串截取进行判断

`typeof` 只能判断基本类型 `string`,`number`,`boolean`,`undefined`,`object`

* `null` 会被判断成 `object`

比较全面的是使用 `Object.prototype.toString` 方法，只需要对返回值进行字符串分割即可

```js
const typeCheck = (obj) => {
  const typeStr = Object.prototype.toString.call(obj);
  return typeStr.toLowerCase().slice(8, typeStr.length - 1);
};

console.log(typeCheck("str"));
// string
console.log(typeCheck(1));
// number
console.log(typeCheck(() => null));
// function
console.log(typeCheck({a: 1}));
// object
console.log(typeCheck([1, 2, 3]));
// array
console.log(typeCheck(new Set([1,2,3])));
// set
console.log(typeCheck(null));
// null
console.log(typeCheck(undefined));
// undefined
```

### 解法四

使用正则的另一种类型判断

返回正则提取`Object.prototype.toString.call(obj)`, 匹配出来的字符串。

```js
function type(obj) {
     return /^\[object (\w*)]$/.test(Object.prototype.toString.call(obj)) ? RegExp.$1 : 'unknown';
}

console.log(type('hello'));
// String
console.log(type(1));
// Number
console.log(type(Number(1)));
// Number
console.log(type({}));
// Object
console.log(type([]));
// Array
console.log(type(new Date()));
// Date
console.log(type(Symbol()));
// Symbol
console.log(type(new RegExp()));
// RegExp
console.log(type(Math));
// Math
console.log(type(window));
// Window
console.log(type(null));
// Null
console.log(type(undefined));
// Undefined
console.log(type(new Error()));
// Error
console.log(type(Promise));
// Function
```

## 思路二

直接进行值类型的判断

### 解法一

直接根据类型抽离方法进行判断

```js
// 写一个判断类型的方法

const Type = (function () {
    const types = {};
    const supperTypes = [
        'String',
        'Number',
        'Boolean',
        'Null',
        'Undefined',
        'Object',
        'Function',
        'Array',
        'Date',
        'Symbol',
        'BigInt'
    ];

    for (let type of supperTypes) {
      types[`is${type}`] = function (data) {
        return Object.prototype.toString.call(data) === `[object ${type}]`;
      }
    }

    return types;
})();

let str = '我是字符串';
let num = 123;
let bol = false;
let arr = [1,2,3];
let obj = {};
let func = class {};

console.log(Type.isString(str));
console.log(Type.isNumber(num));
console.log(Type.isBoolean(bol));
console.log(Type.isArray(arr));
console.log(Type.isObject(obj));
console.log(Type.isFunction(func));

/**
 * true
 * true
 * true
 * true
 * true
 * true
 */
```