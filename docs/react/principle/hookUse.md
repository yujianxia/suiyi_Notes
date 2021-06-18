#
# react-hooks 使用

## 概述

> react-hooks是**react16.8**以后，react新增的钩子API

* 优点：

* 1.  react-hooks可以让的代码的逻辑性更强，可以**抽离**公共的方法，公共组件。

* 2.  react-hooks思想更趋近于**函数式编程**。用函数声明方式代替class声明方式，虽说class也是es6构造函数语法糖，但是react-hooks写起来更有函数即组件，无疑也提高代码的开发效率（无需像class声明组件那样写声明周期，写生命周期render函数等）

* 3.  react-hooks可能把庞大的class组件，化整为零成很多小组件，`useMemo`等方法让组件或者变量制定一个适合自己的**独立的渲染空间**，一定程度上可以提高性能，减少渲染次数。

## useState 数据存储，派发更新
---

* `useState`出现，使得react无状态组件能够像有状态组件一样，可以拥有自己state,useState的参数可以是一个具体的值，也可以是一个函数用于判断复杂的逻辑，函数返回作为初始值

* `usestate` 返回一个数组，数组`第一项用于读取此时的state值` ，`第二项为派发数据更新`，组件渲染的函数，函数的参数即是需要更新的值。

> `useState`和`useReduce` 作为能够触发组件重新渲染的`hooks`,在使用`useState`的时候要特别注意的是，`useState`派发更新函数的执行，就会让**整个function组件从头到尾执行一次**，所以需要配合`useMemo`，`usecallback`等api配合使用

```js
const DemoState = (props) => {
   /* number为此时state读取值 ，setNumber为派发更新的函数 */
   let [number, setNumber] = useState(0) /* 0为初始值 */
   return (<div>
       <span>{ number }</span>
       <button onClick={ ()=> {
         setNumber(number+1)
         console.log(number) /* 这里的number是不能够即使改变的  */
       } } ></button>
   </div>)
}
```

> 上边简单的例子说明了`useState` ,但是当在调用更新函数之后，`state`的值是不能即时改变的，只有当下一次上下文执行的时候，`state`值才随之改变。

```js
const a =1 
const DemoState = (props) => {
   /*  useState 第一个参数如果是函数 则处理复杂的逻辑 ，返回值为初始值 */
   let [number, setNumber] = useState(()=>{
      // number
      return a===1 ? 1 : 2
   }) /* 1为初始值 */
   return (<div>
       <span>{ number }</span>
       <button onClick={ ()=>setNumber(number+1) } ></button>
   </div>)
}
```

## 2 useEffect 组件更新副作用钩子
---

如果你想在function组件中，当组件完成挂载，dom渲染完成，做一些操纵dom,请求数据，那么useEffect是一个不二选择，如果需要在组件初次渲染的时候请求数据，那么useEffect可以充当class组件中的 componentDidMount

**但是特别注意的是，如果不给`useEffect`执行加入限定条件，函数组件每一次更新都会触发effect ,那么也就说明每一次state更新，或是props的更新都会触发useEffect执行，此时的effect又充当了`componentDidUpdate`和`componentwillreceiveprops`，所以说合理的用于useEffect就要给effect加入限定执行的条件，也就是useEffect的第二个参数，这里说是限定条件，也可以说是上一次useeffect更新收集的某些记录数据变化的记忆，在新的一轮更新，`useeffect会拿出之前的记忆值和当前值做对比，如果发生了变化就执行新的一轮useEffect的副作用函数，useEffect第二个参数是一个数组，用来收集多个限制条件` 。**

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

const Demo = ({ a }) => {
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

> 如果需要在组件销毁的阶段，做一些取消dom监听，清除定时器等操作，那么可以在useEffect函数第一个参数，结尾返回一个函数，用于清除这些副作用。相当与`componentWillUnmount`。

```js
const Demo = ({ a }) => {
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

**异步 async effect**

> `useEffect`是不能直接用 `async await` 语法糖的

```js
/* 错误用法 ，effect不支持直接 async await 装饰的 */
 useEffect(async ()=>{
        /* 请求数据 */
      const res = await getUserInfo(payload)
    },[ a ,number ])
```

> 如果想要用 `async effect` 可以对`effect`进行一层包装


```js
const asyncEffect = (callback, deps)=>{
   useEffect(()=>{
       callback()
   },deps)
}
```

## 3 useLayoutEffect 渲染更新之前的 useEffect
---

`useEffect` 执行顺序 组件更新挂载完成 -> 浏览器`dom` 绘制完成 -> 执行`useEffect`回调 。

`useLayoutEffect` 执行顺序 组件更新挂载完成 -> 执行`useLayoutEffect`回调-> 浏览器`dom` 绘制完成

**所以说`useLayoutEffect` 代码可能会阻塞浏览器的绘制  如果在`useEffect` 重新请求数据，渲染视图过程中，肯定会造成画面闪动的效果,而如果用`useLayoutEffect` ，回调函数的代码就会阻塞浏览器绘制，所以可定会引起画面卡顿等效果，那么具体要用 `useLayoutEffect` 还是 `useEffect` ，要看实际项目的情况，大部分的情况 `useEffect` 都可以满足的。**

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

## 4 useRef 获取元素 ,缓存数据

和传统的`class`组件`ref`一样，`react-hooks` 也提供获取元素方法 `useRef`,它有一个参数可以作为缓存数据的初始值，返回值可以被`dom`元素`ref`标记，可以获取被标记的元素节点.

```jsx
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

**高阶用法 缓存数据**

**当然`useRef`还有一个很重要的作用就是缓存数据，知道`usestate` ,`useReducer` 是可以保存当前的数据源的，但是如果它们更新数据源的函数执行必定会带来整个组件从新执行到渲染，如果在函数组件内部声明变量，则下一次更新也会重置，如果想要悄悄的保存数据，而又不想触发函数的更新，那么`useRef`是一个很棒的选择。**

> ** const currenRef = useRef(InitialData)

获取 `currenRef.current` 改变 `currenRef.current = newValue`

`useRef`可以第一个参数可以用来初始化保存数据，这些数据可以在`current`属性上获取到 ，当然也可以通过对`current`赋值新的数据源。

**下面通过react-redux源码来看看useRef的巧妙运用**

（`react-redux` 在`react-hooks`发布后，用`react-hooks`重新了其中的`Provide`,`connectAdvanced`）核心模块，可以见得 `react-hooks`在限制数据更新，高阶组件上有这一定的优势，其源码大量运用`useMemo`来做数据判定

```js
/* 这里用到的useRef没有一个是绑定在dom元素上的，都是做数据缓存用的 */
/* react-redux 用userRef 来缓存 merge之后的 props */
const lastChildProps = useRef()
//  lastWrapperProps 用 useRef 来存放组件真正的 props信息
const lastWrapperProps = useRef(wrapperProps)
//是否储存props是否处于正在更新状态
const renderIsScheduled = useRef(false)
```

> 这是`react-redux`中用`useRef` 对数据做的缓存，那么怎么做更新的呢 ，接下来看

```js
//获取包装的props 
function captureWrapperProps(
  lastWrapperProps,
  lastChildProps,
  renderIsScheduled,
  wrapperProps,
  actualChildProps,
  childPropsFromStoreUpdate,
  notifyNestedSubs
) {
   //要捕获包装props和子props，以便稍后进行比较
  lastWrapperProps.current = wrapperProps  //子props 
  lastChildProps.current = actualChildProps //经过  merge props 之后形成的 prop
  renderIsScheduled.current = false

}
```

通过上面可以看到 ，`react-redux` 用重新赋值的方法，改变缓存的数据源，避免不必要的数据更新，**如果选用useState储存数据，必然促使组件重新渲染 所以采用了useRef解决了这个问题**

## 5 useContext 自由获取context
---

可以使用`useContext` ，来获取父级组件传递过来的`context`值，这个当前值就是最近的父级组件 `Provider` 设置的`value`值，`useContext`参数一般是由 `createContext` 方式引入 ,也可以父级上下文`context`传递 ( 参数为`context` )。`useContext` 可以代替 `context.Consumer` 来获取`Provider`中保存的`value`值

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

## 6 useReducer 无状态组件中的redux
---

`useReducer` 是`react-hooks`提供的能够在无状态组件中运行的类似`redux`的功能`api`

可以通过中间件的方式来增强`dispatch` `redux-thunk` `redux-sage` `redux-action` `redux-promise`都是比较不错的中间件，可以把**同步**reducer编程**异步**的reducer。

useReducer 接受的第一个参数是一个函数，可以认为它就是一个reducer ,reducer的参数就是常规reducer里面的state和action,返回改变后的state, useReducer第二个参数为state的初始值 返回一个数组，**数组的第一项就是更新之后`state`的值** ，**第二个参数是派发更新的`dispatch`函数** 。

**`dispatch` 的触发会触发组件的更新，这里能够促使组件从新的渲染的一个是`useState`派发更新函数，另一个就 `useReducer`中的`dispatch`**

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

## 7 useMemo 小而香性能优化
---

无状态组件的更新是从头到尾的更新

**`class`声明的组件可以用`componentShouldUpdate`来限制更新次数，那么`memo`就是无状态组件的`ShouldUpdate` ， 而`useMemo`就是更为细小的`ShouldUpdate`单元**

先来看看`memo` ,`memo`的作用结合了`pureComponent`纯组件和 `componentShouldUpdate`功能，会对传进来的`props`进行一次对比，然后根据第二个函数返回值来进一步判断哪些`props`需要更新

```js
/* memo包裹的组件，就给该组件加了限制更新的条件，是否更新取决于memo第二个参数返回的boolean值， */
const DemoMemo = connect(state =>
    ({ goodList: state.goodList })
)(memo(({ goodList, dispatch, }) => {
    useEffect(() => {
        dispatch({
            name: 'goodList',
        })
    }, [])
    return <Select placeholder={'请选择'} style={{ width: 200, marginRight: 10 }} onChange={(value) => setSeivceId(value)} >
        {
            goodList.map((item, index) => <Option key={index + 'asd' + item.itemId} value={item.itemId} > {item.itemName} </Option>)
        }
    </Select>
    /* 判断之前的goodList 和新的goodList 是否相等，如果相等，
    则不更新此组件 这样就可以制定属于自己的渲染约定 ，让组件只有满足预定的下才重新渲染 */
}, (pre, next) => is(pre.goodList, next.goodList)))
```

* `useMemo`的应用理念和`memo`差不多，都是判定是否满足当前的限定条件来决定是否执行`useMemo`的`callback`函数，而`useMemo`的第二个参数是一个`deps`数组，数组里的参数变化决定了`useMemo`是否更新回调函数，`useMemo`返回值就是经过判定更新的结果。

* 它可以应用在元素上，应用在组件上，也可以应用在上下文当中。如果又一个循环的`list`元素，那么`useMemo`会是一个不二选择，接下来一起探寻一下`useMemo`的优点

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

**1 useMemo可以减少不必要的循环，减少不必要的渲染**

```js
 useMemo(() => (
    <Modal
        width={'70%'}
        visible={listshow}
        footer={[
            <Button key="back" >取消</Button>,
            <Button
                key="submit"
                type="primary"
             >
                确定
            </Button>
        ]}
    > 
     { /* 减少了PatentTable组件的渲染 */ }
        <PatentTable
            getList={getList}
            selectList={selectList}
            cacheSelectList={cacheSelectList}
            setCacheSelectList={setCacheSelectList} />
    </Modal>
), [listshow, cacheSelectList])
```

**2 useMemo可以减少子组件的渲染次数**

```js
const DemoUseMemo=()=>{
  /* 用useMemo 包裹之后的log函数可以避免了每次组件更新再重新声明 ，可以限制上下文的执行 */
    const newLog = useMemo(()=>{
        const log =()=>{
            console.log(6666)
        }
        return log
    },[])
    return <div onClick={()=>newLog()} ></div>
}
```

**3 `useMemo`让函数在某个依赖项改变的时候才运行，这可以避免很多不必要的开销（这里要注意⚠️⚠️⚠️的是如果被`useMemo`包裹起来的上下文,形成一个独立的`闭包`，会缓存之前的`state`值,如果没有加相关的更新条件，是获取不到更新之后的`state`的值的，如下边👇⬇️）**

```js
const DemoUseMemo=()=>{
    const [ number ,setNumber ] = useState(0)
    const newLog = useMemo(()=>{
        const log =()=>{
            /* 点击span之后 打印出来的number 不是实时更新的number值 */
            console.log(number)
        }
        return log
      /* [] 没有 number */  
    },[])
    return <div>
        <div onClick={()=>newLog()} >打印</div>
        <span onClick={ ()=> setNumber( number + 1 )  } >增加</span>
    </div>
}
```

**`useMemo`很不错，`react-redux` 用`react-hooks`重写后运用了大量的`useMemo`情景，为大家分析两处**

`useMemo` 通过 `store`  `didStoreComeFromProps`  `contextValue` 属性制定是否需要重置更新订阅者`subscription` ，这里就不为大家讲解`react-redux`了，有兴趣的同学可以看看`react-redux`源码，看看是怎么用`useMemo`的

```js
const [subscription, notifyNestedSubs] = useMemo(() => {
  if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY

  const subscription = new Subscription(
    store,
    didStoreComeFromProps ? null : contextValue.subscription // old 
  )
  
  const notifyNestedSubs = subscription.notifyNestedSubs.bind(
    subscription
  )

  return [subscription, notifyNestedSubs]
}, [store, didStoreComeFromProps, contextValue])
```

> `react-redux`通过 判断 `redux store`的改变来获取与之对应的`state`

```js
const previousState = useMemo(() => store.getState(), [store])
```

**如果应用useMemo根据依赖项合理的颗粒化的组件，能起到很棒的优化组件的作用。**

## 8 useCallback useMemo版本的回调函数
---

useMemo和useCallback接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，

区别在于

* `useMemo`返回的是函数运行的结果，

* `useCallback`返回的是函数，这个回调函数是经过处理后的也就是说父组件传递一个函数给子组件的时候，产生的问题`由于是无状态组件每一次都会重新生成新的props函数，这样就使得每一次传递给子组件的函数都发生了变化，这时候就会触发子组件的更新`，这些更新是没有必要的，此时就可以通过`usecallback`来处理此函数，然后作为props传递给子组件

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

**这里应该提醒的是，useCallback ，必须配合 react.memo pureComponent ，否则不但不会提升性能，还有可能降低性能**