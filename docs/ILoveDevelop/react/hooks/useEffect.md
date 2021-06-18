#
# useEffect

`effect`也就是在React中常说的`side effect`，在React中类似像`componentDidMount`这样的生命周期方法中，因为可能会执行`setState`这样的方法而产生新的更新，称之为`side effect`即副作用。本身`FunctionalComponent`因为是`pure function`，所以不会产生任何的副作用，而`useEffect`和`useLayoutEffect`则是带给`FunctionalComponent`产生副作用能力的Hooks，他们的行为非常类似`componentDidMount`和`componentDidUpdate`

他们接受一个方法作为参数，该方法会在每次渲染完成之后被调用；其次还接受第二个参数，是一个数组，这个数组里的每一个内容都会被用来进行渲染前后的对比，如果没有变化，则不会调用该副作用。

```js
function createFunctionComponentUpdateQueue(): FunctionComponentUpdateQueue {
  return {
    lastEffect: null,
  };
}

function pushEffect(tag, create, destroy, inputs) {
  const effect: Effect = {
    tag,
    create,
    destroy,
    inputs,
    // Circular
    next: (null: any),
  };
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
```

不难发现这个过程其实就是往当前`Fiber`上增加一系列`effectTag`，并且会创建`updateQueue`，这跟`HostComponent`类似，这个`queue`会在`commit`阶段被执行。这里需要注意的是`useLayoutEffect`和`useEffect`增加的`effectTag`是不一样的，所以他们执行的时机也是不一样的。`effectTag`会有以下几种情况：

* `useLayoutEffect`增加`UpdateEffect`

* `useEffect`增加`UpdateEffect | PassiveEffect`

以上是增加在`Fiber`对象上的，而记录对应Hook对象的`effectTag`如下：

* `useLayoutEffect`增加`UnmountMutation | MountLayout`

* u`seEffect`增加`UnmountPassive | MountPassive`

* 如果`areHookInputsEqual`符合，则增加`NoHookEffect`

记住这些内容，去看`commit`阶段做了什么跟Hook有关的内容

> 源码

```js
export function useLayoutEffect(
  create: () => mixed,
  inputs: Array<mixed> | void | null,
): void {
  useEffectImpl(UpdateEffect, UnmountMutation | MountLayout, create, inputs);
}

export function useEffect(
  create: () => mixed,
  inputs: Array<mixed> | void | null,
): void {
  useEffectImpl(
    UpdateEffect | PassiveEffect,
    UnmountPassive | MountPassive,
    create,
    inputs,
  );
}

function useEffectImpl(fiberEffectTag, hookEffectTag, create, inputs): void {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber();
  workInProgressHook = createWorkInProgressHook();

  let nextInputs = inputs !== undefined && inputs !== null ? inputs : [create];
  let destroy = null;
  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (areHookInputsEqual(nextInputs, prevEffect.inputs)) {
      pushEffect(NoHookEffect, create, destroy, nextInputs);
      return;
    }
  }

  currentlyRenderingFiber.effectTag |= fiberEffectTag;
  workInProgressHook.memoizedState = pushEffect(
    hookEffectTag,
    create,
    destroy,
    nextInputs,
  );
}
```

# commit阶段Hook相关的内容

在以下三个阶段都会调用`commitHookEffectList`方法，来看一下：

* `commitWork`中`commitHookEffectList(UnmountMutation, MountMutation, finishedWork);`

* `commitBeforeMutationLifeCycles`中`commitHookEffectList(UnmountSnapshot, NoHookEffect, finishedWork);`

* `commitLifeCycles`中`commitHookEffectList(UnmountLayout, MountLayout, finishedWork);`

`commitHookEffectList`这个方法的内容就是根据传入的`unmountTag`和`mountTag`来判断是否需要执行对应的`destory`和`create`方法，这是在每个`Hook`对象的`effect`链上的。所以看这部分代码最重要的其实就是看他传入的`effectTag`和Hook对象上的`effectTag`的对比。

对比结果就是：

1. `useLayoutEffect`的`destory`会在`commitWork`的时候被执行；而他的`create`会在`commitLifeCycles`的时候被执行。

2. `useEffect`在这个流程中都不会被执行。

可以看出来`useLayoutEffect`的执行过程跟`componentDidMount`和`componentDidUpdate`非常相似，所以React官方也说了，如果你一定要选择一个类似于生命周期方法的Hook，那么`useLayoutEffect`是不会错的那个，但是推荐你使用`useEffect`，在你清除他们的区别的前提下，后者是更好的选择。

那么`useEffect`什么时候被调用呢？

答案在`commitRoot`的最后，他等其他`sideEffect`全部`commit`完了之后，会执行以下代码：

```js
if (
  enableHooks &&
  firstEffect !== null &&
  rootWithPendingPassiveEffects !== null
) {
  let callback = commitPassiveEffects.bind(null, root, firstEffect);
  passiveEffectCallbackHandle = Schedule_scheduleCallback(callback);
  passiveEffectCallback = callback;
}
```

`rootWithPendingPassiveEffects`是在`commitAllLifeCycles`的时候如果发现更新中有`passive effect`的节点的话，就等于`FiberRoot`。

```js
if (enableHooks && effectTag & Passive) {
  rootWithPendingPassiveEffects = finishedRoot;
}
```

这里如果有，则会发起一次`Schedule_scheduleCallback`，这个就是之前讲的异步调度模块`Scheduler`的方法，流程跟`PerformWork`类似，这里不再重复讲解。

但看到这里就清楚了，`useEffect`的`destory`和`create`都是异步调用的，所以他们不会影响本次更新的提交，所以不会因为在`effect`中产生了新的更新而导致阻塞DOM渲染的情况。

那么`commitPassiveEffects`做了啥呢？

```js
export function commitPassiveHookEffects(finishedWork: Fiber): void {
  commitHookEffectList(UnmountPassive, NoHookEffect, finishedWork);
  commitHookEffectList(NoHookEffect, MountPassive, finishedWork);
}
```

正好对应了`useEffect`设置的`sideEffect`。

> 源码

```js
function commitHookEffectList(
  unmountTag: number,
  mountTag: number,
  finishedWork: Fiber,
) {
  if (!enableHooks) {
    return;
  }
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  let lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & unmountTag) !== NoHookEffect) {
        // Unmount
        const destroy = effect.destroy;
        effect.destroy = null;
        if (destroy !== null) {
          destroy();
        }
      }
      if ((effect.tag & mountTag) !== NoHookEffect) {
        // Mount
        const create = effect.create;
        let destroy = create();
        if (typeof destroy !== 'function') {
          destroy = null;
        }
        effect.destroy = destroy;
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```