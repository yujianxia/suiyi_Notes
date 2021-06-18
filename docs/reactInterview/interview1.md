# React 源码解析

## 基础概念

* **ReactElement**

    * 数据类，只包含 `props` `refs` `key` 等

    * 由 `React.creatElement(ReactElement.js)` 创建，`React.createClass` 中 `render` 中返回的实际也是个 `ReactElement`

* **ReactComponent**

    * 控制类，包含组件状态，操作方法等

    * 包括字符组件、原生 DOM 组件、自定义组件(和空组件)

    * 在挂载组件(`mountComponent`)的时候，会调用到 `instantiateReactComponent` 方法，利用工厂模式，通过不同的输入返回不同的 `component`

    * 代码(`instantiateReactComponent.js`)：

```js
function instantiateReactComponent(node, shouldHaveDebugID) {
    var instance;
    if (node === null || node === false) {
        instance = ReactEmptyComponent.create(instantiateReactComponent);
    } else if (typeof node === 'object') {
        var element = node;
        // Special case string values
        if (typeof element.type === 'string') {
            instance = ReactHostComponent.createInternalComponent(element);
        } else if (isInternalComponentType(element.type)) {
            // This is temporarily available for custom components that are not string
            // representation, we can drop this code path.
        } else {
            instance = new ReactCompositeComponentWrapper(element);
        }
    } else if (typeof node === 'string' || typeof node === 'number') {
        instance = ReactHostComponent.createInstanceForText(node);
    } else {
    }
    // These two fields are used by the DOM and ART diffing algorithms
    // respectively. Instead of using expandos on components, we should be
    // storing the state needed by the diffing algorithms elsewhere.
    instance._mountIndex = 0;
    instance._mountImage = null;
    return instance;
}
```

* `ReactDOMTextComponent` 只关心文本，`ReactDOMComponent` 会稍微简单一些，`ReactCompositeComponent` 需要关心的最多，包括得到原生 `DOM` 的渲染内容

* **ReactClass**

    * 这个比较特殊，对比 `ES5` 写法: `var MyComponent = React.createClass({})`，ES6写法：`class MyComponent extends React.Component`，为什么用`createClass`却得到了`Component`呢？通过源码来看，这两个 `api` 的实现几乎是一样的，也可以看到，`ES6` 的写法简洁的多，不用那些`getInitialState`等特定 `api`，`React` 在之后的版本也会抛弃`createClass`这个 `api`。并且，在此 `api` 中，`React` 进行了`autobind`。

    * ReactClass.js:

```js
var ReactClass = {
  createClass: function (spec) {
    // ensure that Constructor.name !== 'Constructor'
    var Constructor = identity(function (props, context, updater) {
      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
      this.state = null;
      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.
      var initialState = this.getInitialState ? this.getInitialState() : null;
      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];
    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));
    mixSpecIntoComponent(Constructor, spec);
    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }
    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }
    return Constructor;
  }
}
var ReactClassComponent = function () {};
_assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);
```

  * ReactComponent.js:

```js
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
ReactComponent.prototype.isReactComponent = {};
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};
```

## 对象池

* 开辟空间是需要一定代价的

* 如果引用释放而进入 `gc`，`gc` 会比较消耗性能和时间，如果内存抖动(大量的对象被创建又在短时间内马上被释放)而频繁 `gc` 则会影响用户体验

* 既然创建和销毁对象是很耗时的，所以要尽可能减少创建和销毁对象的次数

* 使用时候申请(`getPooled`)和释放(`release`)成对出现，使用一个对象后一定要释放还给池子(`释放时候要对内部变量置空方便下次使用`)

* 代码(`PooledClass.js`)：

```js
// 只展示部分
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};
var standardReleaser = function (instance) {
  var Klass = this;
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};
var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;
var addPoolingTo = function (CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};
var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};
module.exports = PooledClass;
```

* 使用例子(`ReactUpdate.js`)：

```js
var transaction = ReactUpdatesFlushTransaction.getPooled();
destructor: function () {
    this.dirtyComponentsLength = null;
    CallbackQueue.release(this.callbackQueue);
    this.callbackQueue = null;
    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
    this.reconcileTransaction = null;
  }
ReactUpdatesFlushTransaction.release(transaction);
```

* 可以看到，如果短时间内生成了大量的对象占满了池子，后续的对象是不能复用只能新建的

* 对比连接池、线程池：完成任务后并不销毁，而是可以复用去执行其他任务

## 事务机制

* `React` 通过事务机制来完成一些特定操作，比如 `merge state`，`update component`

* 示意图(`Transaction.js`)：

<a data-fancybox title="demo" href="/notes/assets/react/v2-e1dc82ada4fbbf5c366558532a6f6fca_720w.png">![demo](/notes/assets/react/v2-e1dc82ada4fbbf5c366558532a6f6fca_720w.png)</a>

* 代码(`Transaction.js`)：

```js
var TransactionImpl = {
  perform: function (method, scope, a, b, c, d, e, f) {
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {}
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },
  // 执行所有 wrapper 中的 initialize 方法
  initializeAll: function (startIndex) {
  },
  // 执行所有 wrapper 中的 close 方法
  closeAll: function (startIndex) {
  }
};
module.exports = TransactionImpl;
```

* 可以看到和后端的事务是有差异的(有点类似`AOP`)，虽然都叫`transaction`，并没有`commit`，而是自动执行，初始方法没有提供`rollback`，有二次封装提供的(`ReactReconcileTransaction.js`)

* 下文会提到事务机制的具体使用场景

## 事件分发

* 框图(`ReactBrowserEventEmitter.js`)

<a data-fancybox title="demo" href="/notes/assets/react/v2-35d1c1174231dd45f3fda05516ed0239_720w.png">![demo](/notes/assets/react/v2-35d1c1174231dd45f3fda05516ed0239_720w.png)</a>

* 组件上声明的事件最终绑定到了 `document` 上，而不是 `React` 组件对应的 `DOM` 节点，这样简化了 `DOM` 原生事件，减少了内存开销

* 以队列的方式，从触发事件的组件向父组件回溯，调用相应 `callback`，也就是 `React` 自身实现了一套事件冒泡机制，虽然 `React` 对合成事件封装了`stopPropagation`，但是并不能阻止自己手动绑定的原生事件的冒泡，所以项目中要避免手动绑定原生事件

* 使用对象池来管理合成事件对象的创建和销毁，好处在上文中有描述

* `ReactEventListener`：负责事件注册和事件分发

* `ReactEventEmitter`：负责事件执行

* `EventPluginHub`：负责事件的存储，具体存储在`listenerBank`

* `Plugin`: 根据不同的事件类型，构造不同的合成事件，可以连接原生事件和组件

* 当事件触发时，会调用`ReactEventListener.dispatchEvent`，进行分发：找到具体的 `ReactComponent`，然后向上遍历父组件，实现冒泡

* 代码较多，就不具体分析了，这种统一收集然后分发的思路，可以用在具体项目中

## 生命周期

* 整体流程:

<a data-fancybox title="demo" href="/notes/assets/react/v2-203bfc5510eb197d8117e53f75dbbae5_720w.png">![demo](/notes/assets/react/v2-203bfc5510eb197d8117e53f75dbbae5_720w.png)</a>

* 主要讲述`mount`和`update`，里面也有很多相类似的操作

* `componentWillMount`，`render`，`componentDidMount` 都是在 `mountComponent` 中被调用

* 分析 `ReactCompositeComponent.js` 中的`mountComponent`，发现输出是`@return {?string} Rendered markup to be inserted into the DOM`.

```js
mountComponent: function (transaction, hostParent, hostContainerInfo, context) {
    var _this = this;
    this._context = context;
    this._mountOrder = nextMountID++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;
    var publicProps = this._currentElement.props;
    var publicContext = this._processContext(context);
    var Component = this._currentElement.type;
    var updateQueue = transaction.getUpdateQueue();
    // Initialize the public class
    var doConstruct = shouldConstruct(Component);
    // 最终会调用 new Component()
    var inst = this._constructComponent(doConstruct, publicProps, publicContext, updateQueue);
    var renderedElement;
    // Support functional components
    if (!doConstruct && (inst == null || inst.render == null)) {
      renderedElement = inst;
      inst = new StatelessComponent(Component);
      this._compositeType = CompositeTypes.StatelessFunctional;
    } else {
      // 大家经常在用户端用到的 PureComponent，会对 state 进行浅比较然后决定是否执行 render
      if (isPureComponent(Component)) {
        this._compositeType = CompositeTypes.PureClass;
      } else {
        this._compositeType = CompositeTypes.ImpureClass;
      }
    }
    // These should be set up in the constructor, but as a convenience for
    // simpler class abstractions, we set them up after the fact.
    inst.props = publicProps;
    inst.context = publicContext;
    inst.refs = emptyObject;
    inst.updater = updateQueue;
    this._instance = inst;
    // Store a reference from the instance back to the internal representation
    // 以 element 为 key，存在了 Map 中，之后会用到
    ReactInstanceMap.set(inst, this);
    var initialState = inst.state;
    if (initialState === undefined) {
      inst.state = initialState = null;
    }
    this._pendingStateQueue = null;
    this._pendingReplaceState = false;
    this._pendingForceUpdate = false;
    var markup;
    if (inst.unstable_handleError) {
      markup = this.performInitialMountWithErrorHandling(renderedElement, hostParent, hostContainerInfo, transaction, context);
    } else {
      markup = this.performInitialMount(renderedElement, hostParent, hostContainerInfo, transaction, context);
    }
    if (inst.componentDidMount) {
       transaction.getReactMountReady().enqueue(inst.componentDidMount, inst);
    }
    return markup;
  }
function shouldConstruct(Component) {
  return !!(Component.prototype && Component.prototype.isReactComponent);
}
```

* 可以看到，`mountComponent` 先做实例对象的初始化(`props`, `state` 等)，然后调用`performInitialMount`挂载(`performInitialMountWithErrorHandling`最终也会调用`performInitialMount`，只是多了错误处理)，然后调用`componentDidMount`

* `transaction.getReactMountReady()`会得到`CallbackQueue`，所以只是加入到队列中，后续执行

* 我们来看`performInitialMount`(依然在 `ReactCompositeComponent.js` 中)

```js
performInitialMount: function (renderedElement, hostParent, hostContainerInfo, transaction, context) {
  var inst = this._instance;
  var debugID = 0;
  if (inst.componentWillMount) {
    inst.componentWillMount();
    // When mounting, calls to `setState` by `componentWillMount` will set
    // `this._pendingStateQueue` without triggering a re-render.
    if (this._pendingStateQueue) {
      inst.state = this._processPendingState(inst.props, inst.context);
    }
  }
  // If not a stateless component, we now render
  // 返回 ReactElement，这也就是上文说的 render 返回 ReactElement
  if (renderedElement === undefined) {
    renderedElement = this._renderValidatedComponent();
  }
  var nodeType = ReactNodeTypes.getType(renderedElement);
  this._renderedNodeType = nodeType;
  var child = this._instantiateReactComponent(renderedElement, nodeType !== ReactNodeTypes.EMPTY);
  this._renderedComponent = child;
  var markup = ReactReconciler.mountComponent(child, transaction, hostParent, hostContainerInfo, this._processChildContext(context), debugID);
  return markup;
}
```

* `performInitialMount` 中先调用`componentWillMount`，这个过程中 `merge state`，然后调用`_renderValidatedComponent`(最终会调用`inst.render()` )返回 `ReactElement`，然后调用`_instantiateReactComponent` 由 `ReactElement` 创建 `ReactComponent`，最后进行递归渲染。

* 挂载之后，可以通过`setState`来更新(机制较为复杂，后文会单独分析)，此过程通过调用`updateComponent`来完成更新。我们来看`updateComponent`(依然在 `ReactCompositeComponent.js` 中)

```js
updateComponent: function (transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
  var inst = this._instance;
  var willReceive = false;
  var nextContext;
  // context 相关，React 建议少用 context
  // Determine if the context has changed or not
  if (this._context === nextUnmaskedContext) {
    nextContext = inst.context;
  } else {
    nextContext = this._processContext(nextUnmaskedContext);
    willReceive = true;
  }
  var prevProps = prevParentElement.props;
  var nextProps = nextParentElement.props;
  // Not a simple state update but a props update
  if (prevParentElement !== nextParentElement) {
    willReceive = true;
  }
  // An update here will schedule an update but immediately set
  // _pendingStateQueue which will ensure that any state updates gets
  // immediately reconciled instead of waiting for the next batch.
  if (willReceive && inst.componentWillReceiveProps) {
    inst.componentWillReceiveProps(nextProps, nextContext);
  }
  var nextState = this._processPendingState(nextProps, nextContext);
  var shouldUpdate = true;
  if (!this._pendingForceUpdate) {
    if (inst.shouldComponentUpdate) {
      shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
    } else {
      if (this._compositeType === CompositeTypes.PureClass) {
        // 这里，就是上文提到的，PureComponent 里的浅比较
        shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState);
      }
    }
  }
  this._updateBatchNumber = null;
  if (shouldUpdate) {
    this._pendingForceUpdate = false;
    // Will set `this.props`, `this.state` and `this.context`.
    this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
  } else {
    // If it's determined that a component should not update, we still want
    // to set props and state but we shortcut the rest of the update.
    this._currentElement = nextParentElement;
    this._context = nextUnmaskedContext;
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;
  }
}
```

* `updateComponent`中，先调用`componentWillReceiveProps`，然后 `merge state`，然后调用`shouldComponentUpdate`判断是否需要更新，可以看到，如果组件内部没有自定义，且用的是 `PureComponent`，会对 `state` 进行浅比较，设置`shouldUpdate`，最终调用`_performComponentUpdate`来进行更新。而在`_performComponentUpdate`中，会先调用`componentWillUpdate`，然后调用`updateRenderedComponent`进行更新，最后调用`componentDidUpdate`(过程较简单，就不列代码了)。下面看一下`updateRenderedComponent`的更新机制(依然在 `ReactCompositeComponent.js` 中)

```js
_updateRenderedComponent: function (transaction, context) {
  var prevComponentInstance = this._renderedComponent;
  var prevRenderedElement = prevComponentInstance._currentElement;
  var nextRenderedElement = this._renderValidatedComponent();
  var debugID = 0;
  if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
    ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
  } else {
    var oldHostNode = ReactReconciler.getHostNode(prevComponentInstance);
    ReactReconciler.unmountComponent(prevComponentInstance, false);
    var nodeType = ReactNodeTypes.getType(nextRenderedElement);
    this._renderedNodeType = nodeType;
    var child = this._instantiateReactComponent(nextRenderedElement, nodeType !== ReactNodeTypes.EMPTY);
    this._renderedComponent = child;
    var nextMarkup = ReactReconciler.mountComponent(child, transaction, this._hostParent, this._hostContainerInfo, this._processChildContext(context), debugID);
    this._replaceNodeWithMarkup(oldHostNode, nextMarkup, prevComponentInstance);
  }
},
```

可以看到，如果需要更新，则调用`ReactReconciler.receiveComponent`，会递归更新子组件，否则直接卸载然后挂载。所以，重点是在`shouldUpdateReactComponent`的判断，`React` 为了简化 diff，所以有一个假设：`在组件层级`、`type`、`key 不变的时候`，才进行比较更新，否则先 `unMount` 然后重新 `mount`。来看`shouldUpdateReactComponent(shouldUpdateReactComponent.js)` :

```js
function shouldUpdateReactComponent(prevElement, nextElement) {
  var prevEmpty = prevElement === null || prevElement === false;
  var nextEmpty = nextElement === null || nextElement === false;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }
  var prevType = typeof prevElement;
  var nextType = typeof nextElement;
  // 如果前后两次都为文本元素，则更新
  if (prevType === 'string' || prevType === 'number') {
    return nextType === 'string' || nextType === 'number';
  } else {
    // 如果为 ReactDomComponent 或 ReactCompositeComponent，则需要层级 type 和 key 相同，才进行 update（层级在递归中保证相同）
    return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
  }
}
```

接下来是重头戏：**setState**，上文中已经提到了此 `api` 为:

```ts
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

可以看到这里只是简单的调用`enqueueSetState`放入队列中，而我们知道，不可能这么简单的。来看`enqueueSetState(ReactUpdateQueue.js中)`，`this.updater`会在 `mount` 时候赋值为`updateQueue`

```js
enqueueSetState: function (publicInstance, partialState) {
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  if (!internalInstance) {
    return;
  }
  // 获取队列，如果为空则创建
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  // 将待 merge 的 state 放入队列
  queue.push(partialState);
  // 将待更新的组件放入队列
  enqueueUpdate(internalInstance);
},
function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
      // 上文提到的以 element 为 key 存入 map，这里可以取到 component
  var internalInstance = ReactInstanceMap.get(publicInstance);
  if (!internalInstance) {
    return null;
  }
  return internalInstance;
}
```

再来看`enqueueUpdate(ReactUpdates.js)`：

```js
function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

* 可以看到，如果不处于`isBatchingUpdates`时，则调用`batchingStrategy.batchedUpdates`，如果处于的话，则将 `component` 放入 `dirtyComponents` 中等待以后处理。这样保证了避免重复 `render`，因为`mountComponent`和`updateComponent` `执行的开始，会将isBatchingUpdates` 设置为`true`，之后以事务的方式处理，包括最后时候将`isBatchingUpdates`置为`false`。

* 大家一定对 `batchingStrategy` 和 `dirtyComponents` 的定义，`batchingStrategy`由`ReactUpdates.injection` 注入，而`dirtyComponents` 是定义在 `ReactUpdates.js` 中，也就是说二者都为全局的

* 综上，在特定生命周期中，如 `getInitialState`，`componentWillMount`，`render`，`componentWillUpdate` 中调用`setState`，并不会引起`updateComponent`（`componentDidMount`、`componentDidUpdate` 中会）。来看`batchedUpdates`(`ReactDefaultBatchingStrategy.js`):

```js
batchedUpdates: function (callback, a, b, c, d, e) {
  var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
  ReactDefaultBatchingStrategy.isBatchingUpdates = true;
  // The code is written this way to avoid extra allocations
  if (alreadyBatchingUpdates) {
    return callback(a, b, c, d, e);
  } else {
    // 注意这里，上一个代码块中可以看到，当 isBatchingUpdates 为 false 时，callback 为 enqueueUpdate 自身
    // 所以即以事务的方式处理
    return transaction.perform(callback, null, a, b, c, d, e);
  }
}
var transaction = new ReactDefaultBatchingStrategyTransaction();
```

* 可以看到，当以事务的方式调用进入`enqueueUpdate`时，`isBatchingUpdates`已经为`true`，所以执行`dirtyComponents.push(component)`;。

* 注意到`callback`其实就是自身`enqueueUpdate`，当`isBatchingUpdates`为`false`时，也用`transaction.perform`调用`enqueueUpdate`，使得结果一样

* 详细介绍事务 `transaction` 的应用，上文中提到过，事务可以利用`wrapper`封装，开始和结束时会调用所有 `wrapper` 的相应方法，来看这两个`wrapper`: `RESET_BATCHED_UPDATES FLUSH_BATCHED_UPDATES`(`ReactDefaultBatchingStrategy.js`):

```js
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};
var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};
// flushBatchedUpdates 在 ReactUpdates.js 中
var flushBatchedUpdates = function () {
  // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
  // asapEnqueued 为提前执行回调，暂不分析
  while (dirtyComponents.length || asapEnqueued) {
    if (dirtyComponents.length) {
      var transaction = ReactUpdatesFlushTransaction.getPooled();
      transaction.perform(, null, transaction);
      ReactUpdatesFlushTransaction.release(transaction);
    }
    if (asapEnqueued) {
    }
  }
};
```

* 但是，仔细看上面的过程，把组件放入 `dirtyComponents` 后，事务结束马上就执行 `close` 方法进行了处理了，和之前理解的流程好像不太一致？这时候再回头看`mountComponent`和`updateComponent`，它们的参数：`@param {ReactReconcileTransaction} transaction`，也就是说整个过程都在`ReactReconcileTransaction`事务中(事件回调同理)，自然在其中的生命周期调用`setState`不用引起重复 `render`，只会将 `state` 放入队列和将组件放入 `dirtyComponents` 中，然后在结束后统一处理

* `ReactReconcileTransaction`中 `initialize` 用于清空回调队列；`close` 用于触发回调函数 `componentDidMount`、`componentDidUpdate` 执行

* 我开始一直比较疑惑的是`ReactDefaultBatchingStrategy.batchedUpdates`中的`ReactDefaultBatchingStrategyTransaction`和`ReactReconcileTransaction`到底是什么关系？我试图找出两个 `transaction` 中 `wrapper` 是否有 `merge` 的情况，发现没有。目前大概的理解和结论是这样的：**整个生命周期就是一个 `transaction`，即对应`ReactDefaultBatchingStrategy.batchedUpdates`，而`ReactReconcileTransaction`粒度较小，负责单个组件(所以也能看到，前者直接 `new`，而后者利用了对象池)。通过各自 `wrapper` 可以看到，前者([`FLUSH_BATCHED_UPDATES`, `RESET_BATCHED_UPDATES`])负责了全部组件更新 和 `callback`，后者([`SELECTION_RESTORATION`, `EVENT_SUPPRESSION`, `ON_DOM_READY_QUEUEING`)负责了各自组件自身的问题，如 `focus` 等。**

* 例证：`ReactDom` 中调用`render`(插入过程)，实际最终调用了 `ReactMount` 的`_renderNewRootComponent`，其中执行了`ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);`(注意出现了`batchedUpdates`)，而`batchedMountComponentIntoNode`中调用了`ReactUpdates.ReactReconcileTransaction.getPooled`，这样，嵌套关系就联系起来了

* 例证: `ReactEventListener` 的`dispatchEvent`，会调用`ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);` 和上述同理

* 熟悉 `React` 生命周期的同学一定对父子组件各生命周期的执行顺序很清晰(比如 `componentWillMount` 是从父到子)，以上述的理论，是如何保证的么？上文中可以看到，`FLUSH_BATCHED_UPDATES`的 `close`方法利调用了`runBatchedUpdates`，来看这个方法(`ReactUpdates.js`):

```js
function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;
  // reconcile them before their children by sorting the array.
  dirtyComponents.sort(mountOrderComparator);
  // Any updates enqueued while reconciling must be performed after this entire
  // batch. Otherwise, if dirtyComponents is [A, B] where A has children B and
  // C, B could update twice in a single batch if C's render enqueues an update
  // to B (since B would have already updated, we should skip it, and the only
  // way we can know to do so is by checking the batch counter).
  updateBatchNumber++;
  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, it will still
    // be here, but we assume that it has cleared its _pendingCallbacks and
    // that was is a noop.
    var component = dirtyComponents[i];
    // If performUpdateIfNecessary happens to enqueue any new updates, we
    // shouldn't execute the callbacks until the next render happens, so
    // stash the callbacks first
    var callbacks = component._pendingCallbacks;
    component._pendingCallbacks = null;
    ReactReconciler.performUpdateIfNecessary(component, transaction.reconcileTransaction, updateBatchNumber);
    if (callbacks) {
      for (var j = 0; j < callbacks.length; j++) {
        transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance());
      }
    }
  }
}
function mountOrderComparator(c1, c2) {
  return c1._mountOrder - c2._mountOrder;
}
```

* `flushBatchedUpdates`在事务`ReactUpdatesFlushTransaction`中，此事务是对`ReactReconcileTransaction`和`CallbackQueue`的封装，结束时置空 `dirtyComponents` 并通知回调

* `performUpdateIfNecessary`最终会调用`updateComponent`，进行更新

## diff 算法

* 传统对于树的 `diff` 算法，时间复杂度要达到 `o(n^3)`，这对于用户端显然是不能接受的。而 `React` 基于几个基础假设，将时间复杂度优化为 `o(n)`

* 假设(策略)

  * `Web UI` 中 `DOM` 节点跨层级的移动操作特别少，可以忽略不计

  * 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构

  * 对于同一层级的一组子节点，它们可以通过唯一 `id` 进行区分

* 场景

  * `tree diff`: 只对比同层级节点(注意前文中所有代码中，都是只比较`prevRenderedElement`和`nextRenderedElement`)

  * `component diff`: 如果类型相同则继续比较，如果类型不同则直接卸载再挂载，即上文中提到的`shouldUpdateReactComponent`(虽然当两个 `component` 是不同类型但结构相似时，`React diff` 会影响性能，但正如 `React` 官方博客所言：不同类型的 `component` 是很少存在相似 `DOM tree` 的机会，因此为这种极端情况而做太多比较是不值得的)

  * `element diff`: 当一组节点处于同一层级时，`React` 对于每个节点提供了三种操作，分别为`INSERT_MARKUP`(插入)、 `MOVE_EXISTING`(移动)、 `REMOVE_NODE`(删除)

  * 上文的代码中，除了关心 type，还关心 key，这也是 diff 算法的关键，如图

  <a data-fancybox title="demo" href="/notes/assets/react/v2-57807dd3d41b61ac6c7b3b3686df381b_720w.png">![demo](/notes/assets/react/v2-57807dd3d41b61ac6c7b3b3686df381b_720w.png)</a>

* 首先对新集合的节点进行循环遍历，`for (name in nextChildren)`，如果存在相同节点，则进行操作，是否移动是通过比较 `child._mountIndex < lastIndex`，符合则进行节点移动操作(即在老集合中的位置和 `lastIndex` 比较)，`lastIndex` 表示访问过的节点在老集合中最右的位置（即最大的位置）。这是一种顺序优化手段，`lastIndex` 一直在更新，表示访问过的节点在老集合中最右的位置，如果新集合中当前访问的节点比 `lastIndex` 大，说明当前访问节点在老集合中就比上一个节点位置靠后，则该节点不会影响其他节点的位置，因此不用添加到差异队列中，即不执行移动操作，只有当访问的节点比 `lastIndex` 小时，才需要进行移动操作。来看具体过程：

  * 从新集合中取得 `B`，判断老集合中存在相同节点 `B`，通过对比节点位置判断是否进行移动操作，`B` 在老集合中的位置 `B._mountIndex = 1`，此时 `lastIndex = 0`，不满足 `child._mountIndex < lastIndex` 的条件，因此不对 `B` 进行移动操作；更新 `lastIndex = Math.max(prevChild._mountIndex, lastIndex)`，其中 `prevChild._mountIndex` 表示 `B` 在老集合中的位置，则 `lastIndex ＝ 1`，并将 `B` 的位置更新为新集合中的位置`prevChild._mountIndex = nextIndex`，此时新集合中 `B._mountIndex = 0`，`nextIndex++` 进入下一个节点的判断

  * 从新集合中取得 `A`，判断老集合中存在相同节点 `A`，通过对比节点位置判断是否进行移动操作，`A` 在老集合中的位置 `A._mountIndex = 0`，此时 `lastIndex = 1`，满足 `child._mountIndex < lastIndex`的条件，因此对 `A` 进行移动操作 `enqueueMove(this, child._mountIndex, toIndex)`，其中 `toIndex` 其实就是 `x`，表示 `A` 需要移动到的位置；更新 `lastIndex = Math.max(prevChild._mountIndex, lastIndex)`，则 `lastIndex ＝ 1`，并将 `A` 的位置更新为新集合中的位置 `prevChild._mountIndex = nextIndex`，此时新集合中`A._mountIndex = 1`，`nextIndex++` 进入下一个节点的判断。

  * 从新集合中取得 `D`，判断老集合中存在相同节点 `D`，通过对比节点位置判断是否进行移动操作，`D` 在老集合中的位置 `D._mountIndex = 3`，此时 `lastIndex = 1`，不满足 `child._mountIndex < lastIndex`的条件，因此不对 `D` 进行移动操作；更新 `lastIndex = Math.max(prevChild._mountIndex, lastIndex)`，则 `lastIndex ＝ 3`，并将 `D` 的位置更新为新集合中的位置 `prevChild._mountIndex = nextIndex`，此时新集合中`D._mountIndex = 2`，`nextIndex++` 进入下一个节点的判断。

  * 从新集合中取得 `C`，判断老集合中存在相同节点 `C`，通过对比节点位置判断是否进行移动操作，`C` 在老集合中的位置 `C._mountIndex = 2`，此时 `lastIndex = 3`，满足 `child._mountIndex < lastIndex` 的条件，因此对 `C` 进行移动操作 `enqueueMove(this, child._mountIndex, toIndex)；`更新 `lastIndex = Math.max(prevChild._mountIndex, lastIndex)`，则 `lastIndex ＝ 3`，并将 `C` 的位置更新为新集合中的位置 `prevChild._mountIndex = nextIndex`，此时新集合中 `C._mountIndex = 3`，`nextIndex++` 进入下一个节点的判断，由于 `C` 已经是最后一个节点，因此 `diff` 到此完成。

  * 当有新的 `Component` 插入时，逻辑一致，不做具体分析了
  
  * 当完成集合中所有节点 `diff`，还需要遍历老集合，如果存在新集合中没有但老集合中有的节点，则删除

* 代码(`ReactMultiChild.js`)，针对 `element diff`(`tree diff` 和 `component diff` 在之前的代码中已经提到过)：

```js
_updateChildren: function (nextNestedChildrenElements, transaction, context) {
  var prevChildren = this._renderedChildren;
  var removedNodes = {};
  var mountImages = [];
  var nextChildren = this._reconcilerUpdateChildren(prevChildren, nextNestedChildrenElements, mountImages, removedNodes, transaction, context);
  if (!nextChildren && !prevChildren) {
    return;
  }
  var updates = null;
  var name;
  // `nextIndex` will increment for each child in `nextChildren`, but
  // `lastIndex` will be the last index visited in `prevChildren`.
  var nextIndex = 0;
  var lastIndex = 0;
  // `nextMountIndex` will increment for each newly mounted child.
  var nextMountIndex = 0;
  var lastPlacedNode = null;
  for (name in nextChildren) {
    if (!nextChildren.hasOwnProperty(name)) {
      continue;
    }
    var prevChild = prevChildren && prevChildren[name];
    var nextChild = nextChildren[name];
    if (prevChild === nextChild) {
      updates = enqueue(updates, this.moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex));
      lastIndex = Math.max(prevChild._mountIndex, lastIndex);
      prevChild._mountIndex = nextIndex;
    } else {
      if (prevChild) {
        // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
        lastIndex = Math.max(prevChild._mountIndex, lastIndex);
        // The `removedNodes` loop below will actually remove the child.
      }
      // The child must be instantiated before it's mounted.
      updates = enqueue(updates, this._mountChildAtIndex(nextChild, mountImages[nextMountIndex], lastPlacedNode, nextIndex, transaction, context));
      nextMountIndex++;
    }
    nextIndex++;
    lastPlacedNode = ReactReconciler.getHostNode(nextChild);
  }
  // Remove children that are no longer present.
  for (name in removedNodes) {
    if (removedNodes.hasOwnProperty(name)) {
      updates = enqueue(updates, this._unmountChild(prevChildren[name], removedNodes[name]));
    }
  }
  if (updates) {
    processQueue(this, updates);
  }
  this._renderedChildren = nextChildren;
},
```

## 一些其他的点

interface(ReactClass.js)

```js
var ReactClassInterface = {
  mixins: 'DEFINE_MANY',
  statics: 'DEFINE_MANY',
  propTypes: 'DEFINE_MANY',
  contextTypes: 'DEFINE_MANY',
  childContextTypes: 'DEFINE_MANY',
  // ==== Definition methods ====
  getDefaultProps: 'DEFINE_MANY_MERGED',
  getInitialState: 'DEFINE_MANY_MERGED',
  getChildContext: 'DEFINE_MANY_MERGED',
  render: 'DEFINE_ONCE',
  // ==== Delegate methods ====
  componentWillMount: 'DEFINE_MANY',
  componentDidMount: 'DEFINE_MANY',
  componentWillReceiveProps: 'DEFINE_MANY',
  shouldComponentUpdate: 'DEFINE_ONCE',
  componentWillUpdate: 'DEFINE_MANY',
  componentDidUpdate: 'DEFINE_MANY',
  componentWillUnmount: 'DEFINE_MANY',
  // ==== Advanced methods ====
  updateComponent: 'OVERRIDE_BASE'
};
function validateMethodOverride(isAlreadyDefined, name) {
  var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;
  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactClassMixin.hasOwnProperty(name)) {
    !(specPolicy === 'OVERRIDE_BASE') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
  }
  // Disallow defining methods more than once unless explicitly allowed.
  if (isAlreadyDefined) {
    !(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
  }
}
```

可以看到，和后端中`interface`(或是抽象类)还是有区别的，但是可以起到规范和检查的作用，实际项目中可以借鉴