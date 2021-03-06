# 第一套js综合基础面试题

**1. 原型 / 构造函数 / 实例**
---

* 原型(`prototype`): 一个简单的对象，用于实现对象的 **属性继承**。可以简单的理解成对象的爹。在 Firefox 和 Chrome 中，每个`JavaScript`对象中都包含一个`__proto__` (非标准)的属性指向它爹(该对象的原型)，可`obj.__proto__`进行访问。

* 构造函数: 可以通过`new`来 **新建一个对象** 的函数。

* 实例: 通过构造函数和`new`创建出来的对象，便是实例。 **实例通过**`__proto__`**指向原型，通过**`constructor`**指向构造函数**。

* **注意: 其实实例上并不是真正有 `constructor` 这个指针，它其实是从原型链上获取的**

以`Object`为例，常用的`Object`便是一个构造函数，因此可以通过它构建实例。

```javascript
// 实例
const instance = new Object()
```

则此时， **实例为**`instance`, **构造函数为**`Object`，知道，构造函数拥有一个`prototype`的属性指向原型，因此原型为:

```javascript
// 原型
const prototype = Object.prototype
```

三者的关系:

```javascript
实例.__proto__ === 原型

原型.constructor === 构造函数

构造函数.prototype === 原型

// 这条线其实是是基于原型进行获取的，可以理解成一条基于原型的映射线
// 例如: 
// const o = new Object()
// o.constructor === Object   --> true
// o.__proto__ = null;
// o.constructor === Object   --> false
// 注意: 其实实例上并不是真正有 constructor 这个指针，它其实是从原型链上获取的
//      instance.hasOwnProperty('constructor') === false
实例.constructor === 构造函数
```

<a data-fancybox title="原型示例图" href="/notes/assets/168e9d9b940c4c6f.png">![原型示例图](/notes/assets/168e9d9b940c4c6f.png)</a>

**2.原型链：**
---

**原型链是由原型对象组成**，每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型，`__proto__` 将对象连接起来组成了原型链。是一个用来**实现继承和共享属性**的有限的对象链。

* **属性查找机制**: 当查找对象的属性时，如果实例对象自身不存在该属性，则沿着原型链往上一级查找，找到时则输出，不存在时，则继续沿着原型链往上一级查找，直至最顶级的原型对象`Object.prototype`，如还是没找到，则输出 `undefined`；

* **属性修改机制**: 只会修改实例对象本身的属性，如果不存在，则进行添加该属性，如果需要修改原型的属性时，则可以用: `b.prototype.x = 2`；但是这样会造成所有继承于该对象的实例的属性发生改变。

**3. 执行上下文(EC)**
---

执行上下文可以简单理解为一个对象:

* 它包含三个部分:
    
    * 变量对象(VO)
    
    * 作用域链(词法作用域)
    
    * `this`指向

* 它的类型:

    * 全局执行上下文

    * 函数执行上下文

    * eval执行上下文

* 代码执行过程:

    * 创建 **全局上下文 (global EC)**

    * 全局执行上下文 (caller) 逐行 **自上而下** 执行。遇到函数时，**函数执行上下文 (callee)** 被`push`到执行栈顶层

    * 函数执行上下文被激活，成为 `active EC`, 开始执行函数中的代码，`caller` 被挂起

    * 函数执行完后，`callee` 被`pop`移除出执行栈，控制权交还**全局上下文 (caller)**，继续执行

**4.变量对象**
---

变量对象，是执行上下文中的一部分，可以抽象为一种 **数据作用域**，其实也可以理解为就是一个简单的对象，它存储着该执行上下文中的所有 **变量和函数声明(不包含函数表达式)**。

> 活动对象 (AO): 当变量对象所处的上下文为 active EC 时，称为活动对象。

**5. 作用域**
---

执行上下文中还包含作用域链。理解作用域之前，先介绍下作用域。作用域其实可理解为该上下文中声明的 **变量和声明的作用范围**。可分为 **块级作用域** 和 **函数作用域**

特性:

* **声明提前**: 一个声明在函数体内都是可见的, 函数优先于变量

* 非匿名自执行函数，函数变量为 **只读** 状态，无法修改

```javascript
let foo = function() { console.log(1) };
(function foo() {
    foo = 10  // 由于foo在函数中只为可读，因此赋值无效
    console.log(foo)
}()) 

// 结果打印：  ƒ foo() { foo = 10 ; console.log(foo) }
```

**6.作用域链**
---

可以在执行上下文中访问到父级甚至全局的变量，这便是作用域链的功劳。作用域链可以理解为一组对象列表，包含 **父级和自身的变量对象**，因此便能通过作用域链访问到父级里声明的变量或者函数。

* 由两部分组成:

    * `[[scope]]`属性: 指向父级变量对象和作用域链，也就是包含了父级的`[[scope]]`和`AO`

    * **AO**: 自身活动对象

如此 `[[scopr]]`包含`[[scope]]`，便自上而下形成一条 **链式作用域**。

**7. 闭包**
---

闭包属于一种特殊的作用域，称为 **静态作用域**。它的定义可以理解为: **父函数被销毁** 的情况下，返回出的子函数的`[[scope]]`中仍然保留着父级的单变量对象和作用域链，因此可以继续访问到父级的变量对象，这样的函数称为闭包。

* 闭包会产生一个很经典的问题:

    * 多个子函数的`[[scope]]`都是同时指向父级，是完全共享的。因此当父级的变量对象被修改时，所有子函数都受到影响。

* 解决:

    * 变量可以通过 **函数参数的形式** 传入，避免使用默认的`[[scope]]`向上查找

    * 使用`setTimeout`包裹，通过第三个参数传入

    * 使用 **块级作用域**，让变量成为自己上下文的属性，避免共享

**8.script 引入方式：**
---

* html 静态`<script>`引入

* js 动态插入`<script>`

* `<script defer>`: 延迟加载，元素解析完成后执行

* `<script async>`: 异步加载，但执行时会阻塞元素渲染

**9.对象的拷贝**
---

* 浅拷贝: 以赋值的形式拷贝引用对象，仍指向同一个地址，**修改时原对象也会受到影响**

    * `Object.assign`

    * 展开运算符(...)

* 深拷贝: 完全拷贝一个新对象，**修改时原对象不再受到任何影响**

    * `JSON.parse(JSON.stringify(obj))`: 性能最快

        * 具有循环引用的对象时，报错

        * 当值为函数、`undefined`、或`symbol`时，无法拷贝
    
    * 递归进行逐一赋值

**10.new运算符的执行过程**
---

* 新生成一个对象

* 链接到原型: `obj.__proto__ = Con.prototype`

* 绑定**this**: `apply`

* 返回新对象(如果构造函数有自己 **retrun** 时，则返回该值)

**11.instanceof原理**
---

能在实例的 **原型对象链** 中找到该构造函数的`prototype`属性所指向的 **原型对象**，就返回`true`。即:

```javascript
// __proto__: 代表原型对象链
instance.[__proto__...] === instance.constructor.prototype

// return true
```

**12.代码的复用**
---

* 函数封装

* 继承

* 复制`extend`

* 混入`mixin`

* 借用`apply/call`

**13.继承**
---

在 JS 中，继承通常指的便是 **原型链继承**，也就是通过指定原型，并可以通过原型链继承原型上的属性或者方法。

* 最优化: **圣杯模式**

```javascript
var inherit = (function(c,p){
	var F = function(){};
	return function(c,p){
		F.prototype = p.prototype;
		c.prototype = new F();
		c.uber = p.prototype;
		c.prototype.constructor = c;
	}
})();
```

* 使用 ES6 的语法糖 `class / extends`

**14.类型转换**
---

大家都知道 JS 中在使用运算符号或者对比符时，会自带隐式转换，规则如下:

* -、*、/、% ：一律转换成数值后计算

* +：
    
    * 数字 + 字符串 = 字符串， 运算顺序是从左到右
    
    * 数字 + 对象， 优先调用对象的`valueOf` -> `toString`
    
    * 数字 + `boolean/null` -> 数字
    
    * 数字 + `undefined` -> `NaN`

* `[1].toString() === '1'`

* `{}.toString() === '[object object]'`

* `NaN !== NaN` 、`+undefined` 为 NaN

**15.模块化**
---

模块化开发在现代开发中已是必不可少的一部分，它大大提高了项目的可维护、可拓展和可协作性。通常， **在浏览器中使用 ES6 的模块化支持，在 Node 中使用 commonjs 的模块化支持**。

* 分类:

    * es6: `import/export`

    * commonjs: `require/module.exports/exports`

    * amd: `require/defined`

* `require`与`import`的区别

    * `require`支持 **动态导入**，`import`不支持，正在提案 (babel 下可支持)

    * `require`是 **同步** 导入，`import`属于 **异步** 导入

    * `require`是 **值拷贝**，导出值变化不会影响导入值；`import`指向 **内存地址**，导入值会随导出值而变化

**16. 函数执行改变this**
---

由于 JS 的设计原理: 在函数中，可以引用运行环境中的变量。因此就需要一个机制来让可以在函数体内部获取当前的运行环境，这便是`this`。

因此要明白 `this` 指向，其实就是要搞清楚 函数的运行环境，说人话就是，谁调用了函数。例如:

* `obj.fn()`，便是 `obj` 调用了函数，既函数中的 `this === obj`

* `fn()`，这里可以看成 `window.fn()`，因此 `this === window`

但这种机制并不完全能满足的业务需求，因此提供了三种方式可以手动修改 `this` 的指向:

* `call: fn.call(target, 1, 2)`

* `apply: fn.apply(target, [1, 2])`

* `bind: fn.bind(target)(1,2)`

**17. ES6/ES7**
---

由于 **Babel** 的强大和普及，现在 **ES6/ES7** 基本上已经是现代化开发的必备了。通过新的语法糖，能让代码整体更为简洁和易读。

* 声明

    * `let/const`: 块级作用域、不存在变量提升、暂时性死区、不允许重复声明

    * `const`: 声明常量，无法修改

* 解构赋值

* `class/extend`: 类声明与继承

* `Set/Map`: 新的数据结构

* 异步解决方案:
    
    * `Promise`的使用与实现

    * `generator`:

        * `yield`: 暂停代码
        
        * `next()`: 继续执行代码

```javascript
function* helloWorld() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const generator = helloWorld();

generator.next()  // { value: 'hello', done: false }

generator.next()  // { value: 'world', done: false }

generator.next()  // { value: 'ending', done: true }

generator.next()  // { value: undefined, done: true }
```

    * `await/async`: 是`generator`的语法糖， babel中是基于`promise`实现。

```javascript
async function getUserByAsync(){
   let user = await fetchUser();
   return user;
}

const user = await getUserByAsync()
console.log(user)
```

**18. AST**
---

**抽象语法树 (Abstract Syntax Tree)**，是将代码逐字母解析成 **树状对象** 的形式。这是语言之间的转换、代码语法检查，代码风格检查，代码格式化，代码高亮，代码错误提示，代码自动补全等等的基础。例如:

```javascript
function square(n){
	return n * n
}
```

通过解析转化成的`AST`如下图:

<a data-fancybox title="AST流程图" href="/notes/assets/168e9d95910dd187.png">![AST流程图](/notes/assets/168e9d95910dd187.png)</a>

**19. babel编译原理**
---

* babylon 将 ES6/ES7 代码解析成 AST

* babel-traverse 对 AST 进行遍历转译，得到新的 AST

* 新 AST 通过 babel-generator 转换成 ES5

**20. 函数柯里化**
---

在一个函数中，首先填充几个参数，然后再返回一个新的函数的技术，称为函数的柯里化。通常可用于在不侵入函数的前提下，为函数 **预置通用参数**，供多次重复调用。

```javascript
const add = function add(x) {
	return function (y) {
		return x + y
	}
}

const add1 = add(1)

add1(2) === 3
add1(20) === 21
```

**21. 数组(array)**
---

* `map`: 遍历数组，返回回调返回值组成的新数组

* `forEach`: 无法`break`，可以用`try/catch`中`throw new Error`来停止

* `filter`: 过滤

* `some`: 有一项返回`true`，则整体为`true`

* `every`: 有一项返回`false`，则整体为`false`

* `join`: 通过指定连接符生成字符串

* `push / pop`: 末尾推入和弹出，改变原数组， `push` 返回数组长度, `pop` 返回原数组最后一项；

* `unshift / shift`: 头部推入和弹出，改变原数组，`unshift` 返回数组长度，`shift` 返回原数组第一项 ；

* `sort(fn) / reverse`: 排序与反转，改变原数组

* `concat`: 连接数组，不影响原数组， 浅拷贝

* `slice(start, end)`: 返回截断后的新数组，不改变原数组

* `splice(start, number, value...)`: 返回删除元素组成的数组，`value` 为插入项，改变原数组

* `indexOf / lastIndexOf(value, fromIndex)`: 查找数组项，返回对应的下标

* `reduce / reduceRight(fn(prev, cur)， defaultPrev)`: 两两执行，`prev` 为上次化简函数的`return`值，`cur` 为当前值
    
    * 当传入 `defaultPrev` 时，从第一项开始；
    
    * 当未传入时，则为第二项

* 数组乱序：

```javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.sort(function () {
    return Math.random() - 0.5;
});
```

* 数组拆解: flat: [1,[2,3]] --> [1, 2, 3]

```javascript
Array.prototype.flat = function() {
    return this.toString().split(',').map(item => +item )
}
```