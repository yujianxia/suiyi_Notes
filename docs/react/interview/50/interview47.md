# setState 执行流程

有时表现出异步,有时表现出同步

1. 在合成事件和钩子函数当中是异步的，在原生事件和`setTimeout`当中是同步的

2. 异步并不是说内部是由异步代码组成，本身的执行过程和代码都是同步的，只是合成事件和钩子函数的调用在更新之前，导致拿不到数据形成所谓的异步，可以通过`setState`的第二个参数(是个回调函数，拿到更新数据)

3. 批量优化也是建立在异步上面，在原生事件和定时事件中不会批量更新，

4. 合成事件(就是给那些元素绑定点击事件等等都属于合成事件)

# setState 执行原因

这样会破坏掉 `props` 和 `state` 之间的一致性，造成一些难以 debug 的问题。

这样会让一些正在实现的新功能变得无法实现。

# React Fiber它的目的是解决什么问题

React的`Reconciler` 层负责组建的生命周期运算，diff运算等， React15中被命名为`Stack Reconciler`，运行过程不能中断，当页面元素较多，执行时间过长，超过16ms的时候，就会出现掉帧的现象。

在React16中，Reconciler改成了Fiber Reconciler，使用了浏览器的`requestIdleCallback`这一API，用链表的形式来遍历组建树，能灵活的暂停、继续和丢弃执行的任务。使用fiber将任务分割执行，从框架层面降低了掉帧的概率。

> 历史原因

React 15 的 StackReconciler 方案由于递归不可中断问题，如果 Diff 时间过长（JS计算时间），会造成页面 UI 的无响应（比如输入框）的表现，vdom 无法应用到 dom 中。

为了解决这个问题，React 16 实现了新的基于 `requestIdleCallback` 的调度器（因为 `requestIdleCallback` 兼容性和稳定性问题，自己实现了 polyfill），通过任务优先级的思想，在高优先级任务进入的时候，中断 reconciler。

为了适配这种新的调度器，推出了 FiberReconciler，将原来的树形结构（vdom）转换成 Fiber 链表的形式（child/sibling/return），整个 Fiber 的遍历是基于循环而非递归，可以随时中断。

更加核心的是，基于 Fiber 的链表结构，对于后续（React 17 lane 架构）的异步渲染和 （可能存在的）worker 计算都有非常好的应用基础