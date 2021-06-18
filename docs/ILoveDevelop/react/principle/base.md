<a data-fancybox title="图片demo" href="/notes/assets/reactIloveDeveplo/2019-06-01-032355.png">![图片demo](/notes/assets/reactIloveDeveplo/2019-06-01-032355.png)</a>

**React.createElement**
---

JSX 代码会被 Babel 编译为 `React.createElement`，不引入 React 的话就不能使用 `React.createElement` 了。

```jsx
;<div id="1">1</div>
// 上面的 JSX 会被编译成这样
React.createElement(
  'div',
  {
    id: '1'
  },
  '1'
)
```

定位到 **ReactElement.js** 文件阅读下 `createElement` 函数的实现

```js
export function createElement(type, config, children) {}
```

首先 `createElement` 函数接收三个参数，具体代表着什么相信大家可以通过上面 JSX 编译出来的东西自行理解。

然后是对于 `config` 的一些处理：

<a data-fancybox title="config示例" href="/notes/assets/reactIloveDeveplo/2019-06-01-032356.png">![config示例](/notes/assets/reactIloveDeveplo/2019-06-01-032356.png)</a>

首先把第二个参数之后的参数取出来，然后判断长度是否大于一。大于一的话就代表有多个 `children`，这时候 `props.children` 会是一个数组，否则的话只是一个对象。**因此需要注意在对 `props.children` 进行遍历的时候要注意它是否是数组**，当然你也可以利用 `React.Children` 中的 API，下文中也会对 `React.Children` 中的 API 进行讲解。

最后就是返回了一个 `ReactElement` 对象

<a data-fancybox title="ReactElement示例" href="/notes/assets/reactIloveDeveplo/2019-06-01-032359.png">![ReactElement示例](/notes/assets/reactIloveDeveplo/2019-06-01-032359.png)</a>

内部代码很简单，**核心**就是通过 `$$typeof` 来帮助识别这是一个 `ReactElement`，后面可以看到很多这样类似的类型。另外需要注意一点的是：通过 JSX 写的 `<APP />` 代表着 `ReactElement`，APP 代表着 React Component。

以下是这一小节的流程图内容：

<a data-fancybox title="执行流程图" href="/notes/assets/reactIloveDeveplo/2019-06-01-032401.png">![执行流程图](/notes/assets/reactIloveDeveplo/2019-06-01-032401.png)</a>

**ReactBaseClasses**
---

上文中讲到了 `APP` 代表着 `React Component`，那么这一小节就来阅读组件相关也就是 **ReactBaseClasses.js** 文件下的代码。

其实在阅读这部分源码之前，以为代码会很复杂，可能包含了很多组件内的逻辑，结果内部代码相当简单。这是因为 React 团队将复杂的逻辑全部丢在了 react-dom 文件夹中，你可以把 react-dom 看成是 React 和 UI 之间的**胶水层**，这层胶水可以兼容很多平台，比如 Web、RN、SSR 等等。

该文件包含两个基本组件，分别为 `Component` 及 `PureComponent`，先来阅读 `Component` 这部分的代码。

<a data-fancybox title="demo" href="/notes/assets/reactIloveDeveplo/2019-06-01-032402.png">![demo](/notes/assets/reactIloveDeveplo/2019-06-01-032402.png)</a>

构造函数 `Component` 中需要注意的两点分别是 `refs` 和 `updater`，前者会在下文中专门介绍，后者是组件中相当重要的一个属性，可以发现 `setState` 和 `forceUpdate` 都是调用了 `updater` 中的方法，但是 `updater` 是 react-dom 中的内容，会在之后的文章中学习到这部分的内容。

另外 `ReactNoopUpdateQueue` 也有一个单独的文件，但是内部的代码看不看都无所谓，因为都是用于报警告的。

接下来来阅读 `PureComponent` 中的代码，其实这部分的代码基本与 `Component` 一致

<a data-fancybox title="示例demo" href="/notes/assets/reactIloveDeveplo/2019-06-01-032404.png">![示例demo](/notes/assets/reactIloveDeveplo/2019-06-01-032404.png)</a>

`PureComponent` 继承自 `Component`，继承方法使用了很典型的寄生组合式。

**Refs**
---

refs 其实有好几种方式可以创建：

* 字符串的方式，但是这种方式已经不推荐使用

* `ref={el => this.el = el}`

* `React.createRef`

定位到 **ReactCreateRef.js** 文件

<a data-fancybox title="demo" href="/notes/assets/reactIloveDeveplo/2019-06-01-032405.png">![demo](/notes/assets/reactIloveDeveplo/2019-06-01-032405.png)</a>

内部实现很简单，如果想使用 `ref`，只需要取出其中的 `current` 对象即可。

另外对于函数组件来说，是不能使用 `ref` 的，如果你不知道原因的话可以直接阅读 文档。

当然在之前也是有取巧的方式的，就是通过 `props` 的方式传递 `ref`，但是现在有了新的方式 `forwardRef` 去解决这个问题。

具体代码见 **forwardRef.js** 文件，同样内部代码还是很简单

<a data-fancybox title="代码实现" href="/notes/assets/reactIloveDeveplo/2019-06-01-032407.png">![代码实现](/notes/assets/reactIloveDeveplo/2019-06-01-032407.png)</a>

这部分代码最重要的就是可以在参数中获得 `ref` 了，因此如果想在函数组件中使用 `ref` 的话就可以把代码写成这样：

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))
```

**ReactChildren**
---

定位到 **ReactChildren.js** 文件，这部分代码中只会介绍关于 `mapChildren` 函数相关的内容，因为这部分代码基本就贯穿了整个文件了。
[文档](https://reactjs.org/docs/react-api.html#reactchildren)

对于 `mapChildren` 这个函数来说，通常会使用在组合组件设计模式上。如果你不清楚什么是组合组件的话，可以看下 Ant-design，它内部大量使用了这种设计模式，比如说 `Radio.Group`、`Radio.Button`，另外这里也有篇 [文档](https://react-cn.github.io/react/docs/multiple-components.html) 介绍了这种设计模式。

先来看下这个函数的一些神奇用法

```js
React.Children.map(this.props.children, c => [[c, c]])
```

对于上述代码，`map` 也就是 `mapChildren` 函数来说返回值是 `[c, c, c, c]`。不管你第二个参数的函数返回值是几维嵌套数组，`map` 函数都能帮你摊平到一维数组，并且每次遍历后返回的数组中的元素个数代表了同一个节点需要复制几次。

如果文字描述有点难懂的话，就来看代码吧：

```jsx
<div>
  <span>1</span>
  <span>2</span>
</div>
```

对于上述代码来说，通过 `c => [[c, c]]` 转换以后就变成了

```jsx
<span>1</span>
<span>1</span>
<span>2</span>
<span>2</span>
```

接下里进入正题，来看看 `mapChildren` 内部到底是如何实现的。

<a data-fancybox title="代码实现" href="/notes/assets/reactIloveDeveplo/2019-06-01-032408.png">![代码实现](/notes/assets/reactIloveDeveplo/2019-06-01-032408.png)</a>

这段代码有意思的部分是引入了对象重用池的概念，分别对应 `getPooledTraverseContext` 和 `releaseTraverseContext` 中的代码。当然这个概念的用处其实很简单，就是维护一个大小固定的对象重用池，每次从这个池子里取一个对象去赋值，用完了就将对象上的属性置空然后丢回池子。维护这个池子的用意就是提高性能，毕竟频繁创建销毁一个有很多属性的对象会消耗性能。

接下来来学习 `traverseAllChildrenImpl` 中的代码，这部分的代码需要分为两块来讲

<a data-fancybox title="代码描述" href="/notes/assets/reactIloveDeveplo/2019-06-01-032411.png">![代码描述](/notes/assets/reactIloveDeveplo/2019-06-01-032411.png)</a>

这部分的代码相对来说简单点，主体就是在判断 `children` 的类型是什么。如果是可以渲染的节点的话，就直接调用 `callback`，另外你还可以发现在判断的过程中，代码中有使用到 `$$typeof` 去判断的流程。这里的 `callback` 指的是 `mapSingleChildIntoContext` 函数，这部分的内容会在下文中说到。

<a data-fancybox title="代码描述" href="/notes/assets/reactIloveDeveplo/2019-06-01-032412.png">![代码描述](/notes/assets/reactIloveDeveplo/2019-06-01-032412.png)</a>

这部分的代码首先会判断 `children` 是否为数组。如果为数组的话，就遍历数组并把其中的每个元素都递归调用 `traverseAllChildrenImpl`，也就是说必须是单个可渲染节点才可以执行上半部分代码中的 `callback`。

如果不是数组的话，就看看 `children` 是否可以支持迭代，原理就是通过 `obj[Symbol.iterator]` 的方式去取迭代器，返回值如果是个函数的话就代表支持迭代，然后逻辑就和之前的一样了。

讲完了 `traverseAllChildrenImpl` 函数，最后再来阅读下 `mapSingleChildIntoContext` 函数中的实现。

<a data-fancybox title="代码示例" href="/notes/assets/reactIloveDeveplo/2019-06-01-032414.png">![代码示例](/notes/assets/reactIloveDeveplo/2019-06-01-032414.png)</a>

`bookKeeping` 就是从对象池子里取出来的东西，然后调用 `func` 并且传入节点（此时这个节点肯定是单个节点），此时的 `func` 代表着 `React.mapChildren` 中的第二个参数。

接下来就是判断返回值类型的过程：如果是数组的话，还是回归之前的代码逻辑，注意这里传入的 `func` 是 `c => c`，因为要保证最终结果是被摊平的；如果不是数组的话，判断返回值是否是一个有效的 Element，验证通过的话就 clone 一份并且替换掉 `key`，最后把返回值放入 `result` `中，result` 其实也就是 `mapChildren` 的返回值。

至此，`mapChildren` 函数相关的内容已经解析完毕，还不怎么清楚的同学可以通过以下的流程图再复习一遍。

<a data-fancybox title="流程图" href="/notes/assets/reactIloveDeveplo/2019-06-01-032416.png">![流程图](/notes/assets/reactIloveDeveplo/2019-06-01-032416.png)</a>

