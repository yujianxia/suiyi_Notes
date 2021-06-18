## 传参

如果使用箭头函数声明函数，调用方式：
不传参：this.func1，如果不传参，事件参数默认会自己添加上
传参： (e) => {this.func1(e,'param1', 'param2')}，如果传参，事件参数需要手动传递过来
```js
    func1 = (e, param1, param2) => {
        console.log(e);
        console.log(param1);
        console.log(param2);
    }
```

如果不用箭头函数声明函数，那么调用的时候需要使用this.func2.bind(this)
不传参：this.func2.bind(this)
传参：this.func2.bind(this, 'param1', 'param2')  事件对象隐式的添加到最后一个形参上
```js
    func2 (param1, param2, e,) {
        console.log(param1);
        console.log(param2);
        console.log('event', e);
    }
```

## React的事件和普通的HTML事件

区别：

1. 对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰

2. 对于事件函数处理语法，原生事件为字符串，react 事件为函数

3. react 事件不能采用 return false 的方式来阻止浏览器的默认行为

4. 合成事件是 react 模拟原生 DOM 事件所有能力的一个事件对象

优点：

1. 兼容所有浏览器，更好的跨平台

2. 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）

3. 方便 react 统一管理和事务机制

事件的执行顺序为原生事件先执行，合成事件后执行，合成事件会冒泡绑定到 document 上，所以尽量避免原生事件与合成事件混用，如果原生事件阻止冒泡，可能会导致合成事件不执行，因为需要冒泡到document 上合成事件才会执行

## 阻止事件的默认行为

* event.preventDefault();阻止浏览器默认行为， 例如标签不跳转

* event.stopPropagation();阻止冒泡； 例如上级点击事件不生效