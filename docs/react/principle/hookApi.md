#
# react-hooks

## 概述

对于`react-hooks`,已经写了三部曲，介绍了`react-hooks`使用，自定义hooks，以及`react-hooks`原理，感兴趣的同学可以去看看，文章末尾有链接，对于常用的`api`，这里参考了`react-hooks`如何使用那篇文章。并做了相应精简化和一些内容的补充。

<a data-fancybox title="demo" href="/notes/assets/react/978f814d97e441838bad1d654ba1ef42_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/978f814d97e441838bad1d654ba1ef42_tplv-k3u1fbpfcp-watermark.image)</a>

## useState
---

`useState`可以弥补函数组件没有`state`的缺陷。`useState`可以接受一个初识值，也可以是一个函数`action`，`action`返回值作为新的`state`。返回一个数组，第一个值为`state`读取值，第二个值为改变`state`的`dispatchAction`函数。

看一个例子：

```js
const DemoState = (props) => {
   /* number为此时state读取值 ，setNumber为派发更新的函数 */
   let [number, setNumber] = useState(0) /* 0为初始值 */
   return (<div>
       <span>{ number }</span>
       <button onClick={ ()=> {
         setNumber(number+1) /* 写法一 */
         setNumber(number=>number + 1 ) /* 写法二 */
         console.log(number) /* 这里的number是不能够即时改变的  */
       } } >num++</button>
   </div>)
}
```

## useEffect
---

`useEffect`可以弥补函数组件没有生命周期的缺点。可以在`useEffect`第一个参数回调函数中，做一些请求数据，事件监听等操作，第二个参数作为`dep`依赖项，当依赖项发生变化，重新执行第一个函数。

**useEffect可以用作数据交互。**

```js
/* 模拟数据交互 */
function getUserInfo(a){
    return new Promise((resolve)=>{
        setTimeout(()=>{ 
           resolve({
               name:a,
               age:16,
           }) 
        },500)
    })
}
const DemoEffect = ({ a }) => {
    const [ userMessage , setUserMessage ] :any= useState({})
    const div= useRef()
    const [number, setNumber] = useState(0)
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    /* useEffect使用 ，这里如果不加限制 ，会是函数重复执行，陷入死循环*/
    useEffect(()=>{
        /* 请求数据 */
       getUserInfo(a).then(res=>{
           setUserMessage(res)
       })
       /* 操作dom  */
       console.log(div.current) /* div */
       /* 事件监听等 */
        window.addEventListener('resize', handleResize)
    /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */
    },[ a ,number ])
    return (<div ref={div} >
        <span>{ userMessage.name }</span>
        <span>{ userMessage.age }</span>
        <div onClick={ ()=> setNumber(1) } >{ number }</div>
    </div>)
}
```

**useEffect可以用作事件监听，还有一些基于`dom`的操作**。,别忘了在`useEffect`第一个参数回调函数，返一个函数用于清除事件监听等操作。

```js
const DemoEffect = ({ a }) => {
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    useEffect(()=>{
       /* 定时器 延时器等 */
       const timer = setInterval(()=>console.log(666),1000)
       /* 事件监听 */
       window.addEventListener('resize', handleResize)
       /* 此函数用于清除副作用 */
       return function(){
           clearInterval(timer) 
           window.removeEventListener('resize', handleResize)
       }
    },[ a ])
    return (<div  >
    </div>)
}
```

## useMemo
---

`useMemo`接受两个参数，第一个参数是一个函数，返回值用于产生**保存值**。 第二个参数是一个数组，作为`dep`依赖项，数组里面的依赖项发生变化，重新执行第一个函数，产生**新的值**。

应用场景： 

* **1 缓存一些值，避免重新执行上下文**

```js
const number = useMemo(()=>{
    /** ....大量的逻辑运算 **/
   return number
},[ props.number ]) // 只有 props.number 改变的时候，重新计算number的值。
```

* **2 减少不必要的dom循环**

```js
/* 用 useMemo包裹的list可以限定当且仅当list改变的时候才更新此list，这样就可以避免selectList重新循环 */
 {useMemo(() => (
      <div>{
          selectList.map((i, v) => (
              <span
                  className={style.listSpan}
                  key={v} >
                  {i.patentName} 
              </span>
          ))}
      </div>
), [selectList])}
```

* **3 减少子组件渲染**

```js
/* 只有当props中，list列表改变的时候，子组件才渲染 */
const  goodListChild = useMemo(()=> <GoodList list={ props.list } /> ,[ props.list ])
```

## useCallback
---

`useMemo` 和 `useCallback` 接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，区别在于 `useMemo` 返回的是函数运行的结果， `useCallback` 返回的是函数。 返回的`callback`可以作为`props`回调函数传递给子组件。

```js
/* 用react.memo */
const DemoChildren = React.memo((props)=>{
   /* 只有初始化的时候打印了 子组件更新 */
    console.log('子组件更新')
   useEffect(()=>{
       props.getInfo('子组件')
   },[])
   return <div>子组件</div>
})
const DemoUseCallback=({ id })=>{
    const [number, setNumber] = useState(1)
    /* 此时usecallback的第一参数 (sonName)=>{ console.log(sonName) }
     经过处理赋值给 getInfo */
    const getInfo  = useCallback((sonName)=>{
          console.log(sonName)
    },[id])
    return <div>
        {/* 点击按钮触发父组件更新 ，但是子组件没有更新 */}
        <button onClick={ ()=>setNumber(number+1) } >增加</button>
        <DemoChildren getInfo={getInfo} />
    </div>
}
```

## useRef
---

`useRef`的作用：

* 一 是可以用来获取`dom`元素，或者`class`组件实例 。

* 二 `react-hooks原理`文章中讲过，创建`useRef`时候，会创建一个原始对象，只要函数组件不被销毁，原始对象就会一直存在，那么可以利用这个特性，来通过`useRef`保存一些数据。

```js
const DemoUseRef = ()=>{
    const dom= useRef(null)
    const handerSubmit = ()=>{
        /*  <div >表单组件</div>  dom 节点 */
        console.log(dom.current)
    }
    return <div>
        {/* ref 标记当前dom节点 */}
        <div ref={dom} >表单组件</div>
        <button onClick={()=>handerSubmit()} >提交</button> 
    </div>
}
```

## useLayoutEffect
---

* `useEffect`**执行顺序:** 组件更新挂载完成 -> 浏览器 `dom` 绘制完成 -> 执行 `useEffect` 回调。

* `useLayoutEffect`**执行顺序:** 组件更新挂载完成 ->  执行 `useLayoutEffect` 回调-> 浏览器`dom`绘制完成。

所以说 `useLayoutEffect` 代码可能会阻塞浏览器的绘制 。写的 `effect` 和 `useLayoutEffect`，`react`在底层会被分别打上`PassiveEffect`，`HookLayout`，在`commit`阶段区分出，在什么时机执行。

```js
const DemoUseLayoutEffect = () => {
    const target = useRef()
    useLayoutEffect(() => {
        /*需要在dom绘制之前，移动dom到制定位置*/
        const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
        animate(target.current,{ x,y })
    }, []);
    return (
        <div >
            <span ref={ target } className="animate"></span>
        </div>
    )
}
```

## useReducer
---

在`react-hooks`原理那篇文章中讲解到，`useState`底层就是一个简单版的`useReducer`

`useReducer` 接受的第一个参数是一个函数，可以认为它就是一个 `reducer` , `reducer` 的参数就是常规 `reducer` 里面的 `state` 和  `action` ,返回改变后的 `state` , `useReducer` 第二个参数为 `state` 的初始值 返回一个数组，数组的第一项就是更新之后 `state` 的值 ，第二个参数是派发更新的 `dispatch` 函数。

来看一下`useReducer`如何使用：

```js
const DemoUseReducer = ()=>{
    /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
   const [ number , dispatchNumbner ] = useReducer((state,action)=>{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case 'add':
               return state + 1
           case 'sub':
               return state - 1 
           case 'reset':
             return payload       
       }
       return state
   },0)
   return <div>
      当前值：{ number }
      { /* 派发更新 */ }
      <button onClick={()=>dispatchNumbner({ name:'add' })} >增加</button>
      <button onClick={()=>dispatchNumbner({ name:'sub' })} >减少</button>
      <button onClick={()=>dispatchNumbner({ name:'reset' ,payload:666 })} >赋值</button>
      { /* 把dispatch 和 state 传递给子组件  */ }
      <MyChildren  dispatch={ dispatchNumbner } State={{ number }} />
   </div>
}
```

## useContext
---

可以使用 `useContext` ，来获取父级组件传递过来的 `context` 值，这个当前值就是最近的父级组件 `Provider` 设置的 `value` 值，`useContext` 参数一般是由 `createContext` 方式引入 ,也可以父级上下文 `context` 传递 ( 参数为 `context` )。`useContext` 可以代替 `context.Consumer` 来获取 `Provider` 中保存的 `value` 值

```js
/* 用useContext方式 */
const DemoContext = ()=> {
    const value:any = useContext(Context)
    /* my name is alien */
return <div> my name is { value.name }</div>
}
/* 用Context.Consumer 方式 */
const DemoContext1 = ()=>{
    return <Context.Consumer>
         {/*  my name is alien  */}
        { (value)=> <div> my name is { value.name }</div> }
    </Context.Consumer>
}

export default ()=>{
    return <div>
        <Context.Provider value={{ name:'alien' , age:18 }} >
            <DemoContext />
            <DemoContext1 />
        </Context.Provider>
    </div>
}
```

## useImperativeHandle
---

`useImperativeHandle` 可以配合 `forwardRef` 自定义暴露给父组件的实例值。这个很有用，知道，对于子组件，如果是`class`类组件，可以通过`ref`获取类组件的实例，但是在子组件是函数组件的情况，如果不能直接通过`ref`的，那么此时`useImperativeHandle`和 `forwardRef`配合就能达到效果。

`useImperativeHandle`接受三个参数：

* 第一个参数**ref**: 接受 `forWardRef` 传递过来的 `ref`。

* 第二个参数 **createHandle** ：处理函数，返回值作为暴露给父组件的`ref`对象。

* 第三个参数 **deps**:依赖项 `deps`，依赖项更改形成新的`ref`对象。

**来模拟给场景，用`useImperativeHandle`，使得父组件能让子组件中的`input`自动赋值并聚焦。**

```js
function Son (props,ref) {
    console.log(props)
    const inputRef = useRef(null)
    const [ inputValue , setInputValue ] = useState('')
    useImperativeHandle(ref,()=>{
       const handleRefs = {
           /* 声明方法用于聚焦input框 */
           onFocus(){
              inputRef.current.focus()
           },
           /* 声明方法用于改变input的值 */
           onChangeValue(value){
               setInputValue(value)
           }
       }
       return handleRefs
    },[])
    return <div>
        <input
            placeholder="请输入内容"
            ref={inputRef}
            value={inputValue}
        />
    </div>
}

const ForwarSon = forwardRef(Son)

class Index extends React.Component{
    cur = null
    handerClick(){
       const { onFocus , onChangeValue } =this.cur
       onFocus()
       onChangeValue('let us learn React!')
    }
    render(){
        return <div style={{ marginTop:'50px' }} >
            <ForwarSon ref={cur => (this.cur = cur)} />
            <button onClick={this.handerClick.bind(this)} >操控子组件</button>
        </div>
    }
}
```

**效果:**

<a data-fancybox title="demo" href="/notes/assets/react/8e8c05f0c82c43719079d4db9536abc0_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/8e8c05f0c82c43719079d4db9536abc0_tplv-k3u1fbpfcp-watermark.image)</a>

## useDebugValue
---

`useDebugValue` 可用于在 `React` 开发者工具中显示自定义 `hook` 的标签。这个`hooks`目的就是检查自定义`hooks`


```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  // ...
  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> 不推荐你向每个自定义 Hook 添加 debug 值。当它作为共享库的一部分时才最有价值。在某些情况下，格式化值的显示可能是一项开销很大的操作。除非需要检查 Hook，否则没有必要这么做。因此，useDebugValue 接受一个格式化函数作为可选的第二个参数。该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。

## useTransition
---

`useTransition`允许延时由`state`改变而带来的视图渲染。避免不必要的渲染。它还允许组件将速度较慢的数据获取更新推迟到随后渲染，以便能够立即渲染更重要的更新。

```js
const TIMEOUT_MS = { timeoutMs: 2000 }
const [startTransition, isPending] = useTransition(TIMEOUT_MS)
```

* `useTransition` 接受一个对象， `timeoutMs`代码需要延时的时间。

* 返回一个数组。**第一个参数：** 是一个接受回调的函数。用它来告诉 `React` 需要推迟的 `state` 。 **第二个参数：** 一个布尔值。表示是否正在等待，过度状态的完成(延时`state`的更新)。

下面引入官网的列子，来了解`useTransition`的使用。

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " 加载中..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

在这段代码中，使用 `startTransition` 包装了的数据获取。这使可以立即开始获取用户资料的数据，同时推迟下一个用户资料页面以及其关联的 `Spinner` 的渲染 2 秒钟（ `timeoutMs`  中显示的时间）。

这个`api`目前处于实验阶段，没有被完全开放出来。