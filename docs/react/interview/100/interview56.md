# 关于 React Hooks

* react 16.8后新增，可选api，完全向后兼容，不取代class

# class、函数组件存在哪些问题

* class组件：

1. 大型组件难拆分、重构，很难测试；

2. 相同业务逻辑，分散到各个方法中，逻辑混乱（didmount、willUpdate都要调接口等）；

3. 复用逻辑变得复杂，如Mixins（已废弃）、HOC、Render Prop；

* 函数组件没有实例、没有生命周期、没有state和setState，只能接收props

* React组件更易用函数表达：

1. React提倡函数式编程，view=fn（props）

2. 函数更灵活，更易拆分，更易测试

3. 函数组件需要增强----Hooks

# State Hook ： 将state功能“钩”到纯函数中

* 默认函数组件没有state，函数组件是一个纯函数，执行完即销毁，无法存储state

* 规范：规定hooks以use开头，自定义hook有以use开头，其他地方不用use开头

# useEffect 让函数组件模拟生命周期，同时也让纯函数有了副作用（如全局定时任务）

```jsx
// 模拟didmount、didupate
useEffect(()=>{
  console.log('Ajax 调用接口')
})

// 模拟didmount,第二个参数传入空数组[]
useEffect(()=>{
  console.log('加载完了，Ajax 调用接口')
},[])

// 模拟didUpdate,第二个参数传入会变化的数组[]
useEffect(()=>{
  console.log('更新了，Ajax 调用接口')
},[count,name])

// 模拟didmount和willUnmount
useEffect(()=>{
  let timerId = window.setInterval(()=>{
    console.log(Date.now())
  },1000)
  
  // 返回一个模拟willUnMount的函数（不完全等同willUnMount)
  // props发生变化，即更新（didupdate），也会执行
  // 即：返回的函数，会在下一次effect执行之前，被执行
  return ()=>{
    window.clearInterval(timerId)
  }
})
```

* useEffect依赖[],组件销毁是执行fn，等于willUnMount

* useEffect无依赖或依赖[a,b],组件更新时执行fn

* 即，下一次执行useEffect之前，就会执行fn，无论更新或卸载

# useRef :获取dom节点

```jsx
const themes = {
  light:{background:#000},
  dark:{background:#fff}
}

const ThemeContext = React.createContext(themes.light)

function ThemeButton(){
  cosnt theme = useContext(ThemeContext)
  
  return <button style={{backgournd:theme.background}}>hello world </button>
}

function Toolbar(){
  return <div><ThemeButton/></div>
}

function App(){
  return <ThemeContext.Provider value={themes.dark}>
    <Toobbar/>
  </ThemeContext.Provider>
}

export default App
```

# useReducer // 借鉴了redux，但只是一个复杂版的useEffect

* `useReducer` 是 `useState`的代替方案，用于`state`复杂变化

* `useReducer` 是单个组件状态管理，组件通讯还需要props

* `redux` 是全局的状态管理，多组件共享数据

```jsx
const initialState = {count:0}
cosnt reducer = (state,action)=>{
  switch(action.type){
    case 'increment':
      return {count:state.count + 1} 
    case 'decrement':
      return {count:state.count - 1}
    default:
      return state
  }
}

function App(){
  const [state,dispatch] = useReducer(reducer,initialState)
  return <div>
    count:{state.count}
    <button onClick={()=>dispatch({type:increment})}>++</button>
    <button onClick={()=>dispatch({type:decrement})}>--</button>
  </div>
}
```

# useMemo 性能优化,子组件通过进行对props进行浅比较，确定是否更新 useCallback 优化函数性能

* 父组件更新后子组件无条件更新，class中使用scu、React.pureComponent

```jsx
import React,{useState,memo,useMemo,useCallback} from 'react'
// 1. 使用memo初始化子组件，类似class PureComponent
const child = memo(({userInfo})=>{
  console.log('child render',userInfo)
})

// 父组件
function App(){
  console.log('parent render ....')
  // 用useMemo缓存数据，有依赖
  const userInfo = useMemo(()=>{
    return {name,age:21}
  },[name])
  
  // 用useCallback缓存数据，不需要依赖
  const onChange = useCallback(e=>{
    console.log(e.target.value) 
  },[])
  
  return <div>
    <button onClick={()=>setCount(count+1)}>click</button>
    <Child userInfo={useInfo}  onChange={onChange}></Child>
  </div>
}
```

# 自动义Hook

* 封装通用功能

* 开发和使用第三方hooks

* 自定义hook带来了无限的扩展性，解耦代码

```jsx
// 自定义useAxios
- npm i axios
import {useSate,useEffect} from 'react'
import axios from 'axios'

// axios 发送网络请求的自定义 Hook
function useAxios(url){
  const [loading,setLoading] = useState(false)
  const [data,setData] = useState()
  const [error,setError] = useState()
  useEffect(()=>{
    // 利用 axios 发送网络请求
    setLoading(true)
    axios.get(url)
      .then(res=>setData(res))
      .catch(err=>setError(err))
      .finally(()=>{setLoading(false)})
  },[url])
  
  return [loading,data,err]
}

export default useAxios
```

[react-hooks](https://link.zhihu.com/?target=https%3A//nikgraf.github.io/react-hooks/)

[umi-hooks](https://link.zhihu.com/?target=https%3A//github.com/umijs/hooks)

# Hooks使用规范

* 只能用于React函数组件和自定义Hook中，其他class等地方不可以用

* 只能用于顶层代码，不能在循环、判断中、return后使用Hooks（eslint-plugin-react-hooks可校验）

[demo](https://pic2.zhimg.com/80/v2-792dac8a33db01fb366a1a3bed972f3f_720w.jpg?source=1940ef5c)

# Hooks 调用顺序 为何那么重要

* 函数组件，纯函数，执行完即销毁，所以，无论组件初始化（render），还是组件更新（re-render），都会重新执行一次这个函数，获取最新的组件。这一点和class组件不一样

* useState等状态存在一个有顺序的数组里（Map），判断、循环会影响顺序，出现错误

* 无论时render还是re-render，Hooks调用顺序必须一致

* 如果hooks出现循环、判断里，则无法保证顺序一致

* react hooks严重依赖于调用顺序！

# React Hooks 组件逻辑复用

* class hoc 缺点：
    
    1. 改变组件结构（返回内容需要在被包裹组件外再包一层）,组件层级嵌套过多，不易渲染，不易调试； 
    
    2. 会出现参数劫持（给组件的参数必须约定好，不按约定就崩了）；

* class renderProp 缺点：
    
    1. 思路比较绕,学习成本高，不易理解；
    
    2. 只能传递函数组件，不配合hooks，纯函数功能有限

* mixins问题：
    
    1. 变量作用域来源不清；
    
    2. 属性重名；3.mixin引入过多会导致顺序冲突；

* hooks 组件逻辑复用，本质是自定义hook

```jsx
import {useState,useEffect} from 'react'
function useMousePosition(){
  let [x,setX] = useState(0)
  let [y,setY] = useState(0)
  
  useEffect(()=>{
    function onMouseMove (e){
      setX(e.clientX)
      setY(e.clientY)
    }
    
    document.body.addEventListener('mousemove',onMouseMove)
    return ()=>{
      document.body.removeEventListener('mousemove',onMouseMove)
    }
  },[])
  
  return [x,y]
}
```

* 优点：

    1. 完全符合hooks原有规则，没有其他要求，易理解记忆

    2. 变量作用域明确

    3. 不会产生组件嵌套

# React Hooks 注意事项（坑）

* useState初始化值，只有第一次有效；结合useEffect即可解决

* useEffect内部不能修改State（依赖为[]时，相当于一个假的didmount）

    1. 将第二个参数删掉或者引入对应state即可解决；

    2. 在外部定义非state变量并使用即可，但会打破纯函数规则。（不推荐）

    3. 使用useRef定义非state变量并使用

    4. 依赖为 [] 时： re-render 不会重新执行 effect 函数

    5. 没有依赖：re-render 会重新执行 effect 函数

* useEffect可能出现死循环（依赖里有对象、数组等引用类型，而react是通过Object.is()进行比较，两个不同引用地址的对象会判不同），可以通过将引用类型依赖打开，铺平成值类型，在使用时再拼接，即可解决

# 题目：

1. 为什么使用hooks

* 完善函数组件的能力，函数更适合react组件

* 组件逻辑复用，hooks表现更好（天生就是干这个的）；

    * 复用逻辑完全符合hooks原有规则，利于理解记忆

    * 变量作用域明确

    * 不会产生组件嵌套

* class复杂组件正在变得费解，不易拆解，不易测试，逻辑混乱

2. class组件中，相同的业务逻辑散落在各处

* didMount和DidUpdate中分别获取数据

* DidMount绑定事件，willUnMount解绑事件

* 使用Hooks，相同逻辑可分割到一个个useEffect中

3. react hooks 模拟组件声明周期

* didMount： useEffect 依赖[]

* didUpdate: useEffect 无依赖，或者依赖[a,b]

* willUnMount: useEffect 中返回一个函数fn（非真正willUnMount）:

    * 依赖[]时，组件销毁时执行fn，等同于willUnMount

    * 无依赖，或依赖[a,b]非空时，组件更新、卸载都会执行fn（下一次执行useEffect之前）