# 深入源码剖析componentWillXXX为什么UNSAFE

从`v16.3.0`开始如下三个生命周期钩子被标记为`UNSAFE`。

* componentWillMount

* componentWillRecieveProps

* componentWillUpdate

究其原因，有如下两点：

* 这三个钩子经常被错误使用，并且现在出现了更好的替代方案（这里指新增的`getDerivedStateFromProps`与`getSnapshotBeforeUpdate`）。

* `React`从`Legacy`模式迁移到`Concurrent`模式后，这些钩子的表现会和之前不一致。

## 被误用的钩子
---

我们先来探讨第一点，这里我们以`componentWillRecieveProps`举例。

我们经常在`componentWillRecieveProps`内处理`props`改变带来的影响。有些同学认为这个钩子会在每次`props`变化后触发。

真的是这样么？让我们看看源码。

这段代码出自`updateClassInstance`方法：

```js
if (
  unresolvedOldProps !== unresolvedNewProps ||
  oldContext !== nextContext
) {
  callComponentWillReceiveProps(
    workInProgress,
    instance,
    newProps,
    nextContext,
  );
}
```

> 你可以从[这里](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberClassComponent.new.js#L1034)看到这段源码

其中`callComponentWillReceiveProps`方法会调用`componentWillRecieveProps`。

可以看到，是否调用的关键是比较`unresolvedOldProps`与 `unresolvedNewProps`是否全等，以及`context`是否变化。

其中`unresolvedOldProps`为组件上次更新时的`props`，而`unresolvedNewProps`则来自`ClassComponent`调用`this.render`返回的`JSX`中的`props`参数。

可见他们的`引用`是不同的。所以他们`全等比较`为`false`。

基于此原因，**每次父组件更新都会触发当前组件的`componentWillRecieveProps`。**

想想你是否也曾误用过？

## 模式迁移
---

让我们再看第二个原因：

> `React`从`Legacy`模式迁移到`Concurrent`模式后，这些钩子的表现会和之前不一致。

我们先了解下什么是模式？不同模式有什么区别？

### 从Legacy到Concurrent

从`React15`升级为`React16`后，源码改动如此之大，说`React`被重构可能更贴切些。

正是由于变动如此之大，使得一些特性在新旧版本`React`中表现不一致，这里就包括上文谈到的三个生命周期钩子。

为了让开发者能平稳从旧版本迁移到新版本，`React`推出了三个模式：

* `legacy模式` -- 通过`ReactDOM.render`创建的应用会开启该模式。这是当前`React`使用的方式。这个模式可能不支持一些新功能。

* `blocking模式` -- 通过`ReactDOM.createBlockingRoot`创建的应用会开启该模式。开启部分`concurrent`模式特性，作为迁移到`concurrent`模式的第一步。

* `concurrent模式` -- 通过`ReactDOM.createRoot`创建的应用会开启该模式。面向未来的开发模式。

> 你可以从[这里](https://zh-hans.reactjs.org/docs/concurrent-mode-adoption.html#why-so-many-modes)看到不同模式的特性支持情况

`concurrent模式`相较我们当前使用的`legacy模式`最主要的区别是**将同步的更新机制重构为异步可中断的更新。**

接下来我们来探讨`React`如何实现`异步更新`，以及为什么`异步更新`情况下钩子的表现和`同步更新`不同。

## 同步更新
---

我们可以用`代码版本控制`类比`更新机制`。

在没有`代码版本控制`前，我们在代码中逐步叠加功能。一切看起来井然有序，直到我们遇到了一个紧急线上bug（红色节点）。

<a data-fancybox title="demo" href="/notes/assets/react/1733205a461f6f92.png">![demo](/notes/assets/react/1733205a461f6f92.png)</a>

为了修复这个bug，我们需要首先将之前的代码提交。

在`Reac`t中，所有通过`ReactDOM.render`创建的应用都是通过类似的方式更新状态。

即所有`更新`同步执行，没有`优先级`概念，新来的`高优更新`（红色节点）也需要排在其他`更新`后面执行。

# 异步更新

当有了`代码版本控制`，有紧急线上bug需要修复时，我们暂存当前分支的修改，在`master分支`修复bug并紧急上线。

<a data-fancybox title="demo" href="/notes/assets/react/173320743bcd3794.png">![demo](/notes/assets/react/173320743bcd3794.png)</a>

bug修复上线后通过`git rebase`命令和`开发分支`连接上。`开发分支`基于修复bug的版本继续开发。

<a data-fancybox title="demo" href="/notes/assets/react/1733207d00f2307e.png">![demo](/notes/assets/react/1733207d00f2307e.png)</a>

在`React`中，通过`ReactDOM.createBlockingRoot`和`ReactDOM.createRoot`创建的应用在任务未过期情况下会采用异步的方式更新状态。

`高优更新`（红色节点）中断正在进行中的`低优更新`（蓝色节点），先完成渲染流程。

待`高优更新`完成后，`低优更新`基于`高优更新`的`部分`或者`完整`结果重新更新。

## 深入源码
---

在`React`源码中，每次发起`更新`都会创建一个`Update`对象，同一组件的多个`Update`（如上图所示的A -> B -> C）会以`链表`的形式保存在`updateQueue`中。

首先了解下他们的`数据结构`。

`Update`有很多字段，当前我们关注如下三个字段：

```js
const update: Update<*> = {
    // ...省略当前不需要关注的字段
    lane,
    payload: null,
    next: null
};
```

> `Update`由`createUpdate`方法返回，你可以从[这里](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactUpdateQueue.old.js#L189)看到`createUpdate`的源码

* **lane**：代表优先级。即图中`红色`节点与`蓝色`节点的区别。

* **payload**：更新挂载的数据。对于`this.setState`创建的`更新`，`payload`为`this.setState`的传参。

* **next**：与其他`Update`连接形成链表。

`updateQueue`结构如下：

```js
const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
    },
    // 其他参数省略...
};
```

> `UpdateQueue`由`initializeUpdateQueue`方法返回，你可以从[这里](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactUpdateQueue.new.js#L157)看到`initializeUpdateQueue`的源码

* `baseState`：`更新`基于哪个`state`开始。上图中`版本控制`的例子中，高优bug修复后提交`master`，其他`commit`基于`master`分支继续开发。这里的`master`分支就是`baseState`。

* `firstBaseUpdate`与`lastBaseUpdate`：`更新`基于哪个`Update`开始，由`firstBaseUpdate`开始到`lastBaseUpdate`结束形成链表。这些`Update`是在上次`更新`中由于`优先级`不够被留下的，如图中`A B C`。

* `shared.pending`：本次更新的单或多个`Update`形成的链表。

其中`baseUpdate` + `shared.pending`会作为本次更新需要执行的`Update`。

## 例子
---

了解了`数据结构`，接下来我们模拟一次`异步中断更新`，来揭示本文探寻的秘密 —— `componentWillXXX`为什么`UNSAFE`。

在某个组件`updateQueue`中存在四个`Update`，其中`字母`代表该`Update`要更新的字母，`数字`代表该`Update`的优先级，数字越小`优先级`越高。

```js
baseState = '';

A1 - B2 - C1 - D2
```

首次渲染时，`优先级`1。`B D`优先级不够被跳过。

为了保证`更新`的连贯性，第一个被跳过的`Update`（`B`）及其后面所有`Update`会作为第二次渲染的`baseUpdate`，无论他们的`优先级`高低，这里为`B C D`。

```js
baseState: ''
Updates: [A1, C1]
Result state: 'AC'
```

接着第二次渲染，`优先级`2。

由于`B`在第一次渲染时被跳过，所以在他之后的`C`造成的渲染结果不会体现在第二次渲染的`baseState`中。所以`baseState`为`A`而不是上次渲染的`Result state AC`。这也是为了保证`更新`的连贯性。

```js
baseState: 'A'          
Updates: [B2, C1, D2]  
Result state: 'ABCD'
```

我们发现，`C`同时出现在两次渲染的`Updates`中，他代表的`状态`会被更新两次。

如果有类似的代码：

```js
componentWillReceiveProps(nextProps) {
    if (!this.props.includes('C') && nextProps.includes('C')) {
        // ...do something
    }
}
```

则很有可能被调用两次，这与`同步更新`的`React`表现不一致！

基于以上原因，`componentWillXXX`被标记为`UNSAFE`。