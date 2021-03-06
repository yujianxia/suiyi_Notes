#
# Immutable Data

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。Immutable 实现的原理是 **Persistent Data Structure（持久化数据结构）**，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 **Structural Sharing（结构共享）**，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

<a data-fancybox title="demo" href="https://pic4.zhimg.com/80/2b4c801a7b40eefcd4ee6767fb984fdf_720w.jpg">![demo](https://pic4.zhimg.com/80/2b4c801a7b40eefcd4ee6767fb984fdf_720w.jpg)</a>

1. immutable.js

内部实现了一套完整的 Persistent Data Structure，还有很多易用的数据类型。像 `Collection`、`List`、`Map`、`Set`、`Record`、`Seq`。有非常全面的`map`、`filter`、`groupBy`、`reduce``find`函数式操作方法。同时 API 也尽量与 Object 或 Array 类似。

* **Map**：键值对集合，对应于 Object，ES6 也有专门的 Map 对象

* **List**：有序可重复的列表，对应于 Array

* **Set**：无序且不可重复的列表

2. seamless-immutable

`seamless-immutable` 并没有实现完整的 Persistent Data Structure，而是使用 `Object.defineProperty`（因此只能在 IE9 及以上使用）扩展了 JavaScript 的 Array 和 Object 对象来实现，只支持 Array 和 Object 两种数据类型，API 基于与 Array 和 Object 操持不变。代码库非常小，压缩后下载只有 2K。而 Immutable.js 压缩后下载有 16K。

```jsx
// 原来的写法
let foo = {a: {b: 1}};
let bar = foo;
bar.a.b = 2;
console.log(foo.a.b);  // 打印 2
console.log(foo === bar);  //  打印 true

// 使用 immutable.js 后
import Immutable from 'immutable';
foo = Immutable.fromJS({a: {b: 1}});
bar = foo.setIn(['a', 'b'], 2);   // 使用 setIn 赋值
console.log(foo.getIn(['a', 'b']));  // 使用 getIn 取值，打印 1
console.log(foo === bar);  //  打印 false

// 使用  seamless-immutable.js 后
import SImmutable from 'seamless-immutable';
foo = SImmutable({a: {b: 1}})
bar = foo.merge({a: { b: 2}})   // 使用 merge 赋值
console.log(foo.a.b);  // 像原生 Object 一样取值，打印 1

console.log(foo === bar);  //  打印 false
```

## Immutable 优点

1. Immutable 降低了 Mutable 带来的复杂度

可变（Mutable）数据耦合了 Time 和 Value 的概念，造成了数据很难被回溯。

比如下面一段代码：

```jsx
function touchAndLog(touchFn) {
  let data = { key: 'value' };
  touchFn(data);
  console.log(data.key); // 猜猜会打印什么？
}
```

> 在不查看 `touchFn` 的代码的情况下，因为不确定它对 `data` 做了什么，你是不可能知道会打印什么（这不是废话吗）。但如果 `data` 是 Immutable 的呢，你可以很肯定的知道打印的是 `value`。

2. 节省内存

`Immutable.js` 使用了 Structure Sharing 会尽量复用内存。没有被引用的对象会被垃圾回收。

```jsx
import { Map} from 'immutable';
let a = Map({
  select: 'users',
  filter: Map({ name: 'Cam' })
})
let b = a.set('select', 'people');

a === b; // false

a.get('filter') === b.get('filter'); // true
```

上面 a 和 b 共享了没有变化的 `filter` 节点。

3. `Undo/Redo`，`Copy/Paste`，甚至时间旅行这些功能做起来小菜一碟

因为每次数据都是不一样的，只要把这些数据放到一个数组里储存起来，想回退到哪里就拿出对应数据即可，很容易开发出撤销重做这种功能。

4. 并发安全

传统的并发非常难做，因为要处理各种数据不一致问题，因此『聪明人』发明了各种锁来解决。但使用了 `Immutable` 之后，数据天生是不可变的，**并发锁就不需要了**。

5. 拥抱函数式编程

`Immutable` 本身就是函数式编程中的概念，纯函数式编程比面向对象更适用于前端开发。因为只要输入一致，输出必然一致，这样开发的组件更易于调试和组装。

## 使用 Immutable 的缺点

1. 需要学习新的 API

2. 增加了资源文件大小

3. 容易与原生对象混淆

这点是使用 Immutable.js 过程中遇到最大的问题。写代码要做思维上的转变。

虽然 Immutable.js 尽量尝试把 API 设计的原生对象类似，有的时候还是很难区别到底是 Immutable 对象还是原生对象，容易混淆操作。

Immutable 中的 Map 和 List 虽对应原生 Object 和 Array，但操作非常不同，比如你要用 `map.get('key')` 而不是 `map.key`，`array.get(0)` 而不是 `array[0]`。另外 Immutable 每次修改都会返回新对象，也很容易忘记赋值。

当使用外部库的时候，一般需要使用原生对象，也很容易忘记转换。

下面给出一些办法来避免类似问题发生：

* 使用 Flow 或 TypeScript 这类有静态类型检查的工具

* 约定变量命名规则：如所有 Immutable 类型对象以 `$$` 开头。

* 使用 `Immutable.fromJS` 而不是 `Immutable.Map` 或 `Immutable.List` 来创建对象，这样可以避免 Immutable 和原生对象间的混用。

## 更多认识

1. Immutable.is

两个 immutable 对象可以使用 `===` 来比较，这样是直接比较内存地址，性能最好。但即使两个对象的值是一样的，也会返回 `false`：

```jsx
let map1 = Immutable.Map({a:1, b:1, c:1});
let map2 = Immutable.Map({a:1, b:1, c:1});
map1 === map2;             // false
```

为了直接比较对象的值，immutable.js 提供了 `Immutable.is` 来做『值比较』，结果如下：

```jsx
Immutable.is(map1, map2);  // true
```

`Immutable.is` 比较的是两个对象的 `hashCode` 或 `valueOf`（对于 JavaScript 对象）。由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 `hashCode` 相等，值就是一样的。这样的算法避免了深度遍历比较，性能非常好。

后面会使用 `Immutable.is` 来减少 React 重复渲染，提高性能。

2. 与 Object.freeze、const 区别

`Object.freeze` 和 ES6 中新加入的 `const` 都可以达到防止对象被篡改的功能，但它们是 shallowCopy 的。对象层级一深就要特殊处理了。

3. Cursor 的概念

这个 Cursor 和数据库中的游标是完全不同的概念。

由于 Immutable 数据一般嵌套非常深，为了便于访问深层数据，Cursor 提供了可以直接访问这个深层数据的引用。

```jsx
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';

let data = Immutable.fromJS({ a: { b: { c: 1 } } });
// 让 cursor 指向 { c: 1 }
let cursor = Cursor.from(data, ['a', 'b'], newData => {
  // 当 cursor 或其子 cursor 执行 update 时调用
  console.log(newData);
});

cursor.get('c'); // 1
cursor = cursor.update('c', x => x + 1);
cursor.get('c'); // 2
```

## 实践

1. 与 React 搭配使用，Pure Render

熟悉 React 的都知道，React 做性能优化时有一个避免重复渲染的大招，就是使用 `shouldComponentUpdate()`，但它默认返回 `true`，即始终会执行 `render()` 方法，然后做 Virtual DOM 比较，并得出是否需要做真实 DOM 更新，这里往往会带来很多无必要的渲染并成为性能瓶颈。

当然也可以在 `shouldComponentUpdate()` 中使用使用 deepCopy 和 deepCompare 来避免无必要的 `render()`，**但 deepCopy 和 deepCompare 一般都是非常耗性能的**。

**Immutable 则提供了简洁高效的判断数据是否变化的方法**，只需 `===` 和 `is` 比较就能知道是否需要执行 `render()`，而这个**操作几乎 0 成本**，所以可以极大提高性能。修改后的 `shouldComponentUpdate` 是这样的：

```jsx
import { is } from 'immutable';

shouldComponentUpdate: (nextProps = {}, nextState = {}) => {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }

  for (const key in nextProps) {
    if (thisProps[key] !== nextProps[key] || ！is(thisProps[key], nextProps[key])) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key] || ！is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
}
```

使用 Immutable 后，如下图，当红色节点的 state 变化后，不会再渲染树中的所有节点，而是只渲染图中绿色的部分：

<a data-fancybox title="示例" href="https://pic3.zhimg.com/80/005a24678dc39c202dbf3d1df96da13e_720w.jpg">![示例](https://pic3.zhimg.com/80/005a24678dc39c202dbf3d1df96da13e_720w.jpg)</a>

**setState 的一个技巧**

React 建议把 `this.state` 当作 Immutable 的，因此修改前需要做一个 deepCopy，显得麻烦：

```jsx
import '_' from 'lodash';

const Component = React.createClass({
  getInitialState() {
    return {
      data: { times: 0 }
    }
  },
  handleAdd() {
    let data = _.cloneDeep(this.state.data);
    data.times = data.times + 1;
    this.setState({ data: data });
    // 如果上面不做 cloneDeep，下面打印的结果会是已经加 1 后的值。
    console.log(this.state.data.times);
  }
}
```

使用 Immutable 后：

```jsx
getInitialState() {
    return {
        data: Map({ times: 0 })
    }
},
handleAdd() {
    this.setState({ data: this.state.data.update('times', v => v + 1) });
    // 这时的 times 并不会改变
    console.log(this.state.data.get('times'));
}
```

上面的 `handleAdd` 可以简写成：

```jsx
handleAdd() {
    this.setState(({data}) => ({
        data: data.update('times', v => v + 1) })
    });
}
```

2. 与 Flux 搭配使用

由于 Flux 并没有限定 Store 中数据的类型，使用 Immutable 非常简单。

现在是实现一个类似带有添加和撤销功能的 Store：

```jsx
import { Map, OrderedMap } from 'immutable';
let todos = OrderedMap();
let history = [];  // 普通数组，存放每次操作后产生的数据

let TodoStore = createStore({
  getAll() { return todos; }
});

Dispatcher.register(action => {
  if (action.actionType === 'create') {
    let id = createGUID();
    history.push(todos);  // 记录当前操作前的数据，便于撤销
    todos = todos.set(id, Map({
      id: id,
      complete: false,
      text: action.text.trim()
    }));
    TodoStore.emitChange();
  } else if (action.actionType === 'undo') {
    // 这里是撤销功能实现，
    // 只需从 history 数组中取前一次 todos 即可
    if (history.length > 0) {
      todos = history.pop();
    }
    TodoStore.emitChange();
  }
});
```

## 总结

`Immutable` 可以给应用带来极大的性能提升，但是否使用还要看项目情况。由于侵入性较强，新项目引入比较容易，老项目迁移需要评估迁移。对于一些提供给外部使用的公共组件，最好不要把 `Immutable` 对象直接暴露在对外接口中。

如果 JS 原生 `Immutable` 类型会不会太美，被称为 React API 终结者的 Sebastian Markbåge 有一个这样的提案，能否通过现在还不确定。不过可以肯定的是 `Immutable` 会被越来越多的项目使用。