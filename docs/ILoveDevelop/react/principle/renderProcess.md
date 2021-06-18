**render**
---

```js
ReactDOM.render(<APP />, document.getElementById('root')
```

React 应用想在容器中渲染出一个组件，这通常也是一个 React 应用的入口代码，接下来就来梳理整个 `render` 的流程

先定位到 **ReactDOM.js** 文件的第 702 行代码

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032240.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032240.png)</a>

这部分代码其实没啥好说的，唯一需要注意的是在调用 `legacyRenderSubtreeIntoContainer` 函数时写死了第四个参数 `forceHydrate` 为 `false`。这个参数为 `true` 时表明了是服务端渲染，因为分析的是客户端渲染，因此后面有关这部分的内容也不会再展开。

接下来进入 `legacyRenderSubtreeIntoContainer` 函数中，这部分代码分为两块来讲。第一部分是没有 `root` 之前首先需要创建一个 `root` 第二部分是有 `root` 之后的渲染流程

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032241.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032241.png)</a>

一开始进来函数的时候肯定是没有 `root` 的，因此需要去创建一个 `root`，大家可以发现这个 `root` 对象同样也被挂载在了 `container._reactRootContainer` 上，也就是的 DOM 容器上。 如果你手边有 React 项目的话，在控制台键入如下代码就可以看到这个 `root` 对象了。

```js
document.querySelector('#root')._reactRootContainer
```

<a data-fancybox title="root 对象实例" href="/notes/assets/reactIloveDeveplo/2019-06-01-032244.png">![root 对象实例](/notes/assets/reactIloveDeveplo/2019-06-01-032244.png)</a>

可以看到 `root` 是 `ReactRoot` 构造函数构造出来的，并且内部有一个 `_internalRoot` 对象，这个对象是本文接下来要重点介绍的 `fiber` 对象。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032245.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032245.png)</a>

首先还是和上文中提到的 `forceHydrate` 属性相关的内容，不需要管这部分，反正 `shouldHydrate` 肯定为 `false`。

接下来是将容器内部的节点全部移除，一般来说都是这样写一个容器的的

```js
<div id='root'></div>
```

这样的形式肯定就不需要去移除子节点了，这也侧面说明了一点那就是容器内部不要含有任何的子节点。一是肯定会被移除掉，二来还要进行 DOM 操作，可能还会涉及到重绘回流等等。

最后就是创建了一个 `ReactRoot` 对象并返回。接下来的内容中会看到好几个 `root`，可能会有点绕。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032247.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032247.png)</a>

在 `ReactRoot` 构造函数内部就进行了一步操作，那就是创建了一个 `FiberRoot` 对象，并挂载到了 `_internalRoot` 上。**和 DOM `树一样，fiber` 也会构建出一个树结构（每个 DOM 节点一定对应着一个 `fiber` 对象），`FiberRoot` 就是整个 `fiber` 树的根节点**，接下来的内容里将学习到关于 `fiber` 相关的内容。这里提及一点，`fiber` 和 Fiber 是两个不一样的东西，前者代表着数据结构，后者代表着新的架构。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032249.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032249.png)</a>

在 `createFiberRoot` 函数内部，分别创建了两个 `root`，一个 `root` 叫做 `FiberRoot`，另一个 `root` 叫做 `RootFiber`，并且它们两者还是相互引用的。

这两个对象内部拥有着数十个属性，现在没有必要一一去了解它们各自有什么用处，在当下只需要了解少部分属性即可，其他的属性会在以后的文章中了解到它们的用处。

对于 `FiberRoot` 对象来说，现在只需要了解两个属性，分别是 `containerInfo` 及 `current`。前者代表着容器信息，也就是的 `document.querySelector('#root')`；后者指向 `RootFiber`。

对于 `RootFiber` 对象来说，需要了解的属性稍微多点

```js
function FiberNode(
	tag: WorkTag,
	pendingProps: mixed,
	key: null | string,
	mode: TypeOfMode,
) {
	this.stateNode = null;
	this.return = null;
	this.child = null;
	this.sibling = null;
	this.effectTag = NoEffect;
	this.alternate = null;
}
```

`stateNode` 上文中已经讲过了，这里就不再赘述。

`return`、`child`、`sibling` 这三个属性很重要，它们是构成 `fiber` 树的主体数据结构。`fiber` 树其实是一个单链表树结构，`return` 及 `child` 分别对应着树的父子节点，并且父节点只有一个 `child` 指向它的第一个子节点，即便是父节点有好多个子节点。那么多个子节点如何连接起来呢？答案是 `sibling`，每个子节点都有一个 `sibling` 属性指向着下一个子节点，都有一个 `return` 属性指向着父节点。这么说可能有点绕，通过图来了解一下这个 `fiber` 树的结构。

```js
const APP = () => (
    <div>
        <span></span>
        <span></span>
    </div>
)
ReactDom.render(<APP/>, document.querySelector('#root'))
```

假如说需要渲染出以上组件，那么它们对应的 `fiber` 树应该长这样

<a data-fancybox title="流程图" href="/notes/assets/reactIloveDeveplo/2019-06-01-32250.png">![流程图](/notes/assets/reactIloveDeveplo/2019-06-01-32250.png)</a>

从图中可以看到，每个组件或者 DOM 节点都会对应着一个 `fiber` 对象。另外你手边有 React 项目的话，也可以在控制台输入如下代码，查看 `fiber` 树的整个结构。

```js
// 对应着 FiberRoot
const fiber = document.querySelector('#root')._reactRootContainer._internalRoot
```

另外两个属性在本文中虽然用不上，但是看源码的时候笔者觉得很有意思，就打算拿出来说一下。

在说 `effectTag` 之前，先来了解下啥是 `effect`，简单来说就是 DOM 的一些操作，比如增删改，那么 `effectTag` 就是来记录所有的 `effect` 的，但是这个记录是通过位运算来实现的，这里 是 `effectTag` 相关的二进制内容。

如果想新增一个 `effect` 的话，可以这样写 `effectTag |= Update`；如果想删除一个 `effect` 的话，可以这样写 `effectTag &= ~Update`。

最后是 `alternate` 属性。其实在一个 React 应用中，通常来说都有两个 `fiebr` 树，一个叫做 old tree，另一个叫做 workInProgress tree。前者对应着已经渲染好的 DOM 树，后者是正在执行更新中的 fiber tree，还能便于中断后恢复。两棵树的节点互相引用，便于共享一些内部的属性，减少内存的开销。毕竟前文说过每个组件或 DOM 都会对应着一个 `fiber` 对象，应用很大的话组成的 `fiber` 树也会很大，如果两棵树都是各自把一些相同的属性创建一遍的话，会损失不少的内存空间及性能。

当更新结束以后，workInProgress tree 会将 old tree 替换掉，这种做法称之为 double buffering，这也是性能优化里的一种做法

**总结**
---

<a data-fancybox title="示例图" href="/notes/assets/reactIloveDeveplo/2019-06-01-032252.png">![示例图](/notes/assets/reactIloveDeveplo/2019-06-01-032252.png)</a>

**ReactRoot.prototype.render**
---

当 ReactDom.render 执行时，内部会首先判断是否已经存在 root，没有的话会去创建一个 root。

> 先定位到代码的第 592 行

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-031954.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-031954.png)</a>

在上述的代码中调用了 `unbatchedUpdates` 函数，这个函数涉及到的知识其实在 React 中相当重要。

大家都知道多个 `setState` 一起执行，并不会触发 React 的多次渲染。

```js
// 虽然 age 会变成 3，但不会触发 3 次渲染
this.setState({ age: 1 })
this.setState({ age: 2 })
this.setState({ age: 3 })
```

这是因为内部会将这个三次 `setState` 优化为一次更新，术语是批量更新（batchedUpdate），在后续的内容中也能看到内部是如何处理批量更新的。

对于 `root` 来说其实没必要去批量更新，所以这里调用了 `unbatchedUpdates` 函数来告知内部不需要批量更新。

然后在 `unbatchedUpdates` 回调内部判断是否存在 `parentComponent`。这一步可以假定不会存在 `parentComponent`，因为很少有人会在 `root` 外部加上 `context` 组件。不存在 `parentComponent` 的话就会执行 `root.render(children, callback)`，这里的 `render` 指的是 `ReactRoot.prototype.render`。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-031956.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-031956.png)</a>

在 `render` 函数内部首先取出 `root`，这里的 `root` 指的是 `FiberRoot`。然后创建了 `ReactWork` 的实例，这块内容没有必要深究，功能就是为了在组件渲染或更新后把所有传入 `ReactDom.render` 中的回调函数全部执行一遍。

接下来来看 `updateContainer` 内部是怎么样的。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-031958.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-031958.png)</a>

先从 FiberRoot 的 `current` 属性中取出它的 fiber 对象，然后计算了两个时间。这两个时间在 React 中相当重要，因此需要单独用一小节去学习它们。

**时间**
---

首先是 `currentTime`，在 `requestCurrentTime` 函数内部计算时间的最核心函数是 `recomputeCurrentRendererTime`。

```js
function recomputeCurrentRendererTime() {
	const currentTimeMs = now() - originalStartTimeMs;
	currentRendererTime = msToExpirationTime(currentTimeMs);
}
```

`now()` 就是 `performance.now()`，如果你不了解这个 API 的话可以阅读下 相关文档，`originalStartTimeMs` 是 React 应用初始化时就会生成的一个变量，值也是 `performance.now()`，并且这个值不会在后期再被改变。那么这两个值相减以后，得到的结果也就是现在离 React 应用初始化时经过了多少时间。

然后需要把计算出来的值再通过一个公式算一遍，这里的` | 0 `作用是取整数，也就是说` 11 / 10 | 0 = 1`

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-031959.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-031959.png)</a>

假如 `originalStartTimeMs` 为 `2500`，当前时间为 `5000`，那么算出来的差值就是 `2500`，也就是说当前距离 React 应用初始化已经过去了 2500 毫秒，最后通过公式得出的结果为：

```js
currentTime = 1073741822 - ((2500 / 10) | 0) = 1073741572
```

接下来是计算 `expirationTime`，**这个时间和优先级有关，值越大，优先级越高**。并且同步是优先级最高的，它的值为 `1073741823`，也就是之前看到的常量 `MAGIC_NUMBER_OFFSET` 加一。

在 `computeExpirationForFiber` 函数中存在很多分支，但是计算的核心就只有三行代码，分别是：

```js
// 同步
expirationTime = Sync
// 交互事件，优先级较高
expirationTime = computeInteractiveExpiration(currentTime)
// 异步，优先级较低
expirationTime = computeAsyncExpiration(currentTime)
```

接下来就来分析 `computeInteractiveExpiration` 函数内部是如何计算时间的，当然 `computeAsyncExpiration` 计算时间的方式也是相同的，无非更换了两个变量。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032001.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032001.png)</a>

以上这些代码其实就是公式，把具体的值代入就能算出结果了。

```js
time = 1073741822 - ((((1073741822 - 1073741572 + 15) / 10) | 0) + 1) * 10 = 1073741552
```

另外在 `ceiling` 函数中的 `1 * bucketSizeMs / UNIT_SIZE` 是为了抹平一段时间内的时间差，在抹平的时间差内不管有多少个任务需要执行，他们的过期时间都是同一个，这也算是一个性能优化，帮助渲染页面行为节流。

最后其实这个计算出来的 `expirationTime` 是可以反推出另外一个时间的：

```js
export function expirationTimeToMs(expirationTime: ExpirationTime): number {
	return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}
```

如果将之前计算出来的 `expirationTime` 代入以上代码，得出的结果如下：

```js
(1073741822 - 1073741552) * 10 = 2700
```

这个时间其实和之前在上文中计算出来的 `2500` 毫秒差值很接近。因为 `expirationTime` 指的就是一个任务的过期时间，React 根据任务的优先级和当前时间来计算出一个任务的执行截止时间。只要这个值比当前时间大就可以一直让 React 延后这个任务的执行，以便让更高优先级的任务执行，但是一旦过了任务的截止时间，就必须让这个任务马上执行。

这部分的内容一直在算来算去，看起来可能有点头疼。当然如果你嫌麻烦，只需要记住任务的过期时间是通过当前时间加上一个常量（任务优先级不同常量不同）计算出来的。

另外其实你还可以在后面的代码中看到更加直观且简单的计算过期时间的方式，但是目前那部分代码还没有被使用起来。

**scheduleRootUpdate**
---

当计算出时间以后就会调用 `updateContainerAtExpirationTime`，这个函数其实没有什么好解析的，直接进入 `scheduleRootUpdate` 函数就好。

<a data-fancybox title="源代码" href="/notes/assets/reactIloveDeveplo/2019-06-01-032002.png">![源代码](/notes/assets/reactIloveDeveplo/2019-06-01-032002.png)</a>

首先会创建一个 `update`，**这个对象和 `setState` 息息相关**

```js
// update 对象的内部属性
expirationTime: expirationTime,
tag: UpdateState,
// setState 的第一二个参数
payload: null,
callback: null,
// 用于在队列中找到下一个节点
next: null,
nextEffect: null,
```

对于 `update` 对象内部的属性来说，需要重点关注的是 `next` 属性。因为 `update` 其实就是一个队列中的节点，这个属性可以用于帮助寻找下一个 `update`。对于批量更新来说，可能会创建多个 `update`，因此需要将这些 `update` 串联并存储起来，在必要的时候拿出来用于更新 `state`。

在 `render` 的过程中其实也是一次更新的操作，但是并没有 `setState`，因此就把 `payload` 赋值为 `{element}` 了。

接下来将 `callback` 赋值给 `update` 的属性，这里的 `callback` 还是 `ReactDom.render` 的第三个参数。

然后将刚才创建出来的 `update` 对象插入队列中，`enqueueUpdate` 函数内部分支较多且代码简单，这里就不再贴出代码了，有兴趣的可以自行阅读。函数核心作用就是创建或者获取一个队列，然后把 `update` 对象入队。

最后调用 `scheduleWork` 函数，这里开始就是调度相关的内容，这部分内容将在下一篇文章中来详细解析。

**总结**
---

<a data-fancybox title="总结流程图" href="/notes/assets/reactIloveDeveplo/2019-06-01-032003.png">![总结流程图](/notes/assets/reactIloveDeveplo/2019-06-01-032003.png)</a>