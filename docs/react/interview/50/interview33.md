# 概念

`useEffect`是一个用来执行副作用hook，第一个参数传入一个函数，每一次render之后执行副作用和清除上一次副作用，该函数的返回值就是清除函数。第二个参数是一个数组，传入内部的执行副作用函数需要的依赖，当这几个依赖有一个要更新，effect里面也会重新生成一个新的副作用并执行副作用。如果没有更新，则不会执行。如果第二个参数不传，那么就是没有说明自己有没有依赖，那就是每次render该函数组件都执行。

很明显，`useEffect`第一个参数可以模仿`didmount`、`didupdate`，它的返回值可以模仿`willunmount`

[**博客解读链接**](https://cloud.tencent.com/developer/article/1426847)
[**博客解读链接**](https://www.jianshu.com/p/99df10f46198)


# class组件生命周期模拟

>  "模仿生命周期，useEffect第二个参数传个空数组，无依赖，只执行一次，相当于didmount。如果要区分生命周期，不传第二个参数，每次都会跑，相当于didupdate。加个mount标记一下，里面用if判断一下，即可以达到模拟生命周期的效果"

很多人都会想到这个办法模拟，于是试一下看看：

```jsx
let mount;
function useForceUpdate() {
  const [_, forceUpdate] = useState(0);
  return () => forceUpdate(x => x + 1);
}

function UnmountTest() {
  useEffect(() => {
    if (!mount) {
      mount = true;
      console.log('did mount')
    } else {
      console.log('did update')
    }
    return () => {
      mount = false;
      console.log('unmount')
    }
  })
  const forceUpdate = useForceUpdate();
  return (<div>
    是随时被抛弃的
    <button onClick={forceUpdate}>强制更新</button>
  </div>);
}

function State() {
  const [count, setCount] = useState(20);

  const handleCount = useCallback(() => {
    setCount(count => count + 1)
  }, [])
  return (
    <div>
      {count}
      <button onClick={handleCount}>count+1</button>
      {(count % 2) && <UnmountTest />}
    </div>
  )
}
```

当count是奇数，那就展示`UnmountTest`，组件里面也有一个更新组件的方法。按照逻辑，`useEffect`不传第二个参数，保证每次渲染都执行。然后加一个标记，标记第一次是挂载。于是运行一波看看

* 点一下count+1，展示组件，打印didmount

* 再点一下count，删掉组件，打印unmount

符合预期，?

* 点一下count+1，展示组件，打印didmount

* 点一下强制更新，打印unmount、didmount，再点，还是一样

>  useEffect是用来执行副作用，每一次render，将会清除上一次副作用、执行本次副作用（如果有依赖或者不传入依赖数组）这个hook是以一个副作用为单位，当然也可以多次使用

这样子说，每一次都是`unmount`、`didmount`，的确是符合这个逻辑，和"想当然"的那种模拟生命周期是有点不一样的。这样子，拆成两个`useEffect`调用，就可以解决问题：

```jsx
function UnmountTest() {
  useEffect(() => {
      if (mount) {
          console.log('did update')
      }
  });
  useEffect(() => {
      if (!mount) {
          console.log('did mount')
          mount = true;
      }
      return () => {
          console.log('unmount')
          mount = false;
      }
  }, []);
  const forceUpdate = useForceUpdate();
  return (<div>
    是随时被抛弃的
    <button onClick={forceUpdate}>强制更新</button>
  </div>);
}
```

# useEffect & useLayoutEffect区别

> useEffect是异步的，useLayoutEffect是同步的

<a data-fancybox title="图片地址" href="/notes/assets/react/fra5f7sqje.png">![图片地址](/notes/assets/react/fra5f7sqje.png)</a>

从左到右表示时间线，红色的是异步的，红色框内是同步的，从上到下执行。`useEffect`是异步的，所谓的异步就是利用`requestIdleCallback`，在浏览器空闲时间执行传入的callback。大部分情况下，用哪一个都是一样的，如果副作用执行比较长，比如大量计算，如果是`useLayoutEffect`就会造成渲染阻塞。这只是一个case，可以看一下这个神奇的定时器：

点击开始，开始计时，点击暂停就暂停。点击清0，暂停并且数字清零

```jsx
function LYE() {
  const [lapse, setLapse] = React.useState(0)
  const [running, setRunning] = React.useState(false)

  useEffect(
    () => {
      if (running) {
        const startTime = Date.now() - lapse
        const intervalId = setInterval(() => {
          setLapse(Date.now() - startTime)
        }, 2)
        console.log(intervalId)
        return () => clearInterval(intervalId)
      }
    },
    [running],
  )

  function handleRunClick() {
    setRunning(r => !r)
  }

  function handleClearClick() {
    setRunning(false)
    setLapse(0)
  }

  return (
    <div>
      <label>{lapse}ms</label>
      <button onClick={handleRunClick}>
        {running ? '暂停' : '开始'}
      </button>
      <button onClick={handleClearClick}>
        暂停并清0
      </button>
    </div>
  )
}
```

于是，点击清零居然不清0，只是停下来了，而且点开始也是继续开始。这里只要把它改成`useLayoutEffect`就可以了，点清0马上变成0并停止。另外，在使用`useEffect`下，把interval的时间改成大于16，有概率成功清0，如果更大一点是绝对清零。都说`useEffect`是异步，那么问题很有可能出现在异步这里。

`useLayoutEffect`是同步的，所以整个流程完全符合的预期，一切在掌控之中。基于两点： `useEffect`里面的interval延迟太小并没有清除计时结果、`useEffect`把interval延迟调到大于16后有概率解决。从这两点出发，梳理一下`useEffect`执行时机：

<a data-fancybox title="示例" href="/notes/assets/react/7k651uh5a8.png">![示例](/notes/assets/react/7k651uh5a8.png)</a>

这种情况是没有清除定时器结果的，注意中间那块：interval1 =》 render =》 clean useEffect1。 clean useEffect1之前又跑了一次interval1，interval1触发render，展示的是当前计时结果。前面的stop操作，`setRunning(false)`和`setLapse(0)`的确是跑了，但是interval1又设置了当前计时结果，所以`setLapse(0)`就是白搞了。

> 把interval延迟调大

<a data-fancybox title="示例" href="/notes/assets/react/a9em7va745.png">![示例](/notes/assets/react/a9em7va745.png)</a>

这种情况是正常的，显然全部都在预期之内。经过多次测试，延迟临界点是16ms。

> 为什么就是16ms？

有问题，很自然想到异步，说到异步又想到了`requestIdleCallback`，这个函数就是浏览器空闲的时候执行callback。类似于`requestAnimationFrame`，只是`requestIdleCallback`把优先级放低了。说到`requestAnimationFrame`就想到了平均60fps，接着1000/60 就是16.66666，所以每一帧的间隔大约是16ms左右。最后，问题来源就这样暴露出来了，当interval间隔大于屏幕一帧时间，用`useEffect`此定时器不会有问题，反之则是interval会在useEffect之前多执行一次造成问题的出现。


# 第二个博客

[官方地址](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)

<a data-fancybox title="官方doc" href="/notes/assets/react/13562167-ec54900541447ab4.webp">![官方doc](/notes/assets/react/13562167-ec54900541447ab4.webp)</a>

## redux-react-hook 中的使用

`redux-react-hook`库中有段代码使用了`useLayoutEffect`，用来避免组件`render`两次。这里的`useIsomorphicLayoutEffect`就是`useLayoutEffect`（因为库要区分是浏览器还是SSR，所以上面做了处理）

```jsx
// We use useLayoutEffect to render once if we have multiple useMappedState. 
// We need to update lastStateRef synchronously after rendering component,
// With useEffect we would have:
// 1) dispatch action
// 2) call subscription cb in useMappedState1, call forceUpdate
// 3) rerender component
// 4) call useMappedState1 and useMappedState2 code
// 5) calc new derivedState in useMappedState2, schedule updating lastStateRef, return new state, render component
// 6) call subscription cb in useMappedState2, check if lastStateRef !== newDerivedState, call forceUpdate, rerender.
// 7) update lastStateRef - it's too late, we already made one unnecessary render
useIsomorphicLayoutEffect(() => {
  lastStateRef.current = derivedState;
  memoizedMapStateRef.current = memoizedMapState;
});
```

## 模拟场景简化

<a data-fancybox title="例子1" href="/notes/assets/react/13562167-61010d74f29dd4a9.webp">![例子1](/notes/assets/react/13562167-61010d74f29dd4a9.webp)</a>

有一个数据store（对redux的store），一个组件App，组件中使用了useA和useB两个自定义hook（这对应两次调用redux-react-hook的useMappedState）。

当一个操作，改变store时候，去调用订阅者即A和B，A和B改变会触发App重新render。这里有个问题，A和B都是订阅者，会触发两次App重新render，作者想避免，所以会在use的时候做下处理，使用useEffect的话，会出现bug，无法如愿，下面就来模拟这个过程。

## 代码实现

```jsx
function App() {
  console.log('%c App render--start-->', 'color:blue')
  const a = useA();
  const b = useB();
  
  function doSomething() {
    // dispatch();
    setTimeout(dispatch, 0)
  }
  console.log('%c App render--end-->', 'color:red')
  return (
    <div>
      <p>a: {a}</p>
      <p>b: {b}</p>
      <p><button onClick={doSomething}>dispatch</button></p>
      
    </div>
  )
}
```

```jsx
function useA() {
  console.log('---a--hook-->')
  const [trigger, setTrigger] = useState(0);
  useEffect(() => {
    console.log('--useA--useEffect-->')
    memoStore = store;
  });
  useEffect(() => {
    const fn = subsriber(() => {
      console.log('--useA--注册函数--->', memoStore, store);
      if(store !== memoStore) {
        setTrigger(Math.random())
      }
    });
    return () => unSubsriber(fn);
  }, []);
  return store;
}
```

```jsx
function useB() {
  console.log('---b--hook-->')
  const [trigger, setTrigger] = useState(0);
  useEffect(() => {
    console.log('--useA--useEffect-->')
    memoStore = store
  });
  useEffect(() => {
    const fn = subsriber(() => {
      console.log('--useB--注册函数--->', memoStore, store);
      if(store !== memoStore) {
        setTrigger(Math.random())
      }
    });
    return () => unSubsriber(fn);
  }, []);
  return store;
}
```

> 简化的redux:

```jsx
let store = 6;
let memoStore = 6;
const newStore = 8;

const subsriberList = new Set();
function subsriber(fn) {
  subsriberList.add(fn);
  return fn;
}
function unSubsriber(fn) {
  subsriberList.delete(fn)
}
function dispatch() {
  memoStore = store;
  store = newStore;
  subsriberList.forEach(fn => fn())
}
```

> 这里有一个非常重要的关键点，就是App组件中的doSometing中，dispatch一定要写在**setTimeout**中，否则react自动帮优化了，模拟不出来想要的场景。

## 分析

点击按钮时候，改变了store: 6 -> 8，触发了订阅者自定义hook A和B的订阅事件。按理会触发两次App render，但是做了优化，在useA和useB的时候，会用新状态去覆盖旧状态，然后在订阅事件中，会对比新老状态，一致的话，就不去触发自定义hook改变了，也就不会触发App render了。

但是使用effect的话，实际执行过程是这样的：

<a data-fancybox title="使用effect的代码执行流程" href="/notes/assets/react/13562167-52766170dd7fef31.webp">![使用effect的代码执行流程](/notes/assets/react/13562167-52766170dd7fef31.webp)</a>

<a data-fancybox title="控制台" href="/notes/assets/react/13562167-779a90e1da23a64c.webp">![控制台](/notes/assets/react/13562167-779a90e1da23a64c.webp)</a>

> **结论**

可以看到，App依旧render了两次，其中主要问题就出在useEffect注册的函数在什么时候执行，从流程图中可以看到，其不是在App组件树 render结束后立即执行的（也不知道什么时候执行，还请哪位大佬指点），js会继续执行后面的代码（B的订阅），这个时候old=new还没有执行，所以依旧触发了第二次App组件render。

## 更改useEffect为useLayoutEffect

> useA

```jsx
...
  useLayoutEffect(() => {
    console.log('--useA--useLayoutEffect-->')
    memoStore = store;
  });
...
```

> useB

```jsx
...
  useLayoutEffect(() => {
    console.log('--useA--useLayoutEffect-->')
    memoStore = store
  });
...
```

<a data-fancybox title="useLayoutEffect执行流程" href="/notes/assets/react/13562167-473a86d749566c57.webp">![useLayoutEffect执行流程](/notes/assets/react/13562167-473a86d749566c57.webp)</a>

<a data-fancybox title="控制台" href="/notes/assets/react/13562167-6cf5978cafaf980b.webp">![控制台](/notes/assets/react/13562167-6cf5978cafaf980b.webp)</a>

可以看见关键点是，layoutEffect队列在组件树render结束后，会立刻同步执行（个人感觉是的），所以在第一次App render结束后，old和new就相同了，在执行B订阅时候，就会根据条件，不再触发App render了。

## 总结

```jsx
// 一定要加setTimeout模拟异步操作，否则实验不出来上面的流程的
  setTimeout(()=>{
    renderApp1(); // 一些会条件性触发组件重新render的代码
    exeLayoutEffectList(); // 组件树构建完毕，会同步执行useLayoutEffect中的代码
    code1(); // 一些js代码
    code2(); // 一些js代码
    // 所有代码都执行完毕后，浏览器渲染结束后，会调用useEffect中的代码
    // 或者接到下一次组件刷新（re-render）指令，会将上一次effect队列执行完毕。根据试验猜的
    exeEffectList(); 
    renderApp2(); // 一些会条件性触发组件重新render的代码
  }, 0)
```

主要就是effect和layoutEffect队列的执行阶段，layout会在组件树构建完毕或者刷新完毕后同步立刻执行。effect会等其他js代码执行完毕后执行（或者遇到下一次刷新任务前）

回过头再看react关于useLayoutEffect的官方文档：

> The signature is identical to useEffect, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.
> Prefer the standard useEffect when possible to avoid blocking visual updates.


* 和useEffect相同，是指他们都在组件树构建完毕之后执行的

* 但是useLayout是在DOM突变之后立即执行的，突变是指什么？是指类似组件构建完毕之后，appendChild(reactTree)这种操作吗?

* 可以肯定的是，是在组件树构建完毕后同步执行，之后才会去执行后面的js代码

* 使用他来读取DOM布局尺寸，倒感觉应该是写成设定DOM布局尺寸，这样可以防抖动，同步读取DOM布局尺寸想不懂有什么用

* useLayoutEffect队列中的任务，会在浏览器paint之前执行（可以用来防抖）

* 尽可能使用useEffect来避免阻塞视觉更新（见上条，阻碍paint）