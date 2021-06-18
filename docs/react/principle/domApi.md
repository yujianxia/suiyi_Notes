# react-dom

## 概述

<a data-fancybox title="demo" href="/notes/assets/react/23d877cf3a5b417ba6162f0c259b1c45_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/23d877cf3a5b417ba6162f0c259b1c45_tplv-k3u1fbpfcp-watermark.image)</a>

## render
---

`render` 是最常用的`react-dom`的 `api`，用于渲染一个`react`元素，一般`react`项目都用它，渲染根部容器`app`。

```js
ReactDOM.render(element, container[, callback])
```

**使用**

```js
ReactDOM.render(
    < App / >,
    document.getElementById('app')
)
```

`ReactDOM.render`会控制`container`容器节点里的内容，但是不会修改容器节点本身。

## hydrate
---

服务端渲染用`hydrate`。用法与 `render()` 相同，但它用于在 `ReactDOMServer` 渲染的容器中对 `HTML` 的内容进行 `hydrate` 操作。

```js
ReactDOM.hydrate(element, container[, callback])
```

## createPortal
---

`Portal` 提供了一种将子节点渲染到存在于父组件以外的 `DOM` 节点的优秀的方案。`createPortal` 可以把当前组件或 `element` 元素的子节点，渲染到组件之外的其他地方。

那么具体应用到什么场景呢？

比如一些全局的弹窗组件`model`,`<Model/>`组件一般都写在的组件内部，倒是真正挂载的`dom`，都是在外层容器，比如`body`上。此时就很适合`createPortalAPI`。

`createPortal`接受两个参数：


```js
ReactDOM.createPortal(child, container)
```

第一个： `child` 是任何可渲染的 `React` 子元素 第二个： `container`是一个 `DOM` 元素。

接下来实践一下：

```js
function WrapComponent({ children }){
    const domRef = useRef(null)
    const [ PortalComponent, setPortalComponent ] = useState(null)
    React.useEffect(()=>{
        setPortalComponent( ReactDOM.createPortal(children,domRef.current) )
    },[])
    return <div> 
        <div className="container" ref={ domRef } ></div>
        { PortalComponent }
     </div>
}

class Index extends React.Component{
    render(){
        return <div style={{ marginTop:'50px' }} >
             <WrapComponent>
               <div  >hello,world</div>
            </WrapComponent>
        </div>
    }
}
```

**效果**

<a data-fancybox title="demo" href="/notes/assets/react/1842abaa8cb840108f6a5c90cb349aac_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/1842abaa8cb840108f6a5c90cb349aac_tplv-k3u1fbpfcp-watermark.image)</a>

可以看到，`children`实际在`container` 之外挂载的，但是已经被`createPortal`渲染到`container`中。

## unstable_batchedUpdates
---

在`react-legacy`模式下，对于事件，`react`事件有批量更新来处理功能,但是这一些非常规的事件中，批量更新功能会被打破。所以可以用`react-dom`中提供的`unstable_batchedUpdates` 来进行批量更新。

**一次点击实现的批量更新**

```js
class Index extends React.Component{
    constructor(props){
       super(props)
       this.state={
           numer:1,
       }
    }
    handerClick=()=>{
        this.setState({ numer : this.state.numer + 1 })
        console.log(this.state.numer)
        this.setState({ numer : this.state.numer + 1 })
        console.log(this.state.numer)
        this.setState({ numer : this.state.numer + 1 })
        console.log(this.state.numer)
    }
    render(){
        return <div  style={{ marginTop:'50px' }} > 
            <button onClick={ this.handerClick } >click me</button>
        </div>
    }
}
```

**效果**

<a data-fancybox title="demo" href="/notes/assets/react/29b6f884f2c147ee9a20400ad7477e77_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/29b6f884f2c147ee9a20400ad7477e77_tplv-k3u1fbpfcp-watermark.image)</a>

渲染次数一次。

**批量更新条件被打破**

```js
handerClick=()=>{
    Promise.resolve().then(()=>{
        this.setState({ numer : this.state.numer + 1 })
        console.log(this.state.numer)
        this.setState({ numer : this.state.numer + 1 })
        console.log(this.state.numer)
        this.setState({ numer : this.state.numer + 1 })
        console.log(this.state.numer)
    })
}
```

**效果**

<a data-fancybox title="demo" href="/notes/assets/react/4b799b2b8f514ae183382d5ed875d0e9_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/4b799b2b8f514ae183382d5ed875d0e9_tplv-k3u1fbpfcp-watermark.image)</a>

渲染次数三次。

**unstable_batchedUpdate助力**

```js
handerClick=()=>{
    Promise.resolve().then(()=>{
        ReactDOM.unstable_batchedUpdates(()=>{
            this.setState({ numer : this.state.numer + 1 })
            console.log(this.state.numer)
            this.setState({ numer : this.state.numer + 1 })
            console.log(this.state.numer)
            this.setState({ numer : this.state.numer + 1 })
            console.log(this.state.numer)
        }) 
    })
}
```

渲染次数一次,完美解决批量更新问题。

## flushSync
---

`flushSync` 可以将回调函数中的更新任务，放在一个较高的优先级中。知道`react`设定了很多不同优先级的更新任务。如果一次更新任务在`flushSync`回调函数内部，那么将获得一个较高优先级的更新。比如

```js
ReactDOM.flushSync(()=>{
    /* 此次更新将设置一个较高优先级的更新 */
    this.setState({ name: 'alien'  })
})
```

为了让大家理解`flushSync`，这里做一个`demo`奉上，

```js
/* flushSync */
import ReactDOM from 'react-dom'
class Index extends React.Component{
    state={ number:0 }
    handerClick=()=>{
        setTimeout(()=>{
            this.setState({ number: 1  })
        })
        this.setState({ number: 2  })
        ReactDOM.flushSync(()=>{
            this.setState({ number: 3  })
        })
        this.setState({ number: 4  })
    }
    render(){
        const { number } = this.state
        console.log(number) // 打印什么？？
        return <div>
            <div>{ number }</div>
            <button onClick={this.handerClick} >测试flushSync</button>
        </div>
    }
}
```

**结果**

<a data-fancybox title="demo" href="/notes/assets/react/f7eba600db1c44cb956e380cb922226d_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/f7eba600db1c44cb956e380cb922226d_tplv-k3u1fbpfcp-watermark.image)</a>

打印 0 3 4 1 ，相信不难理解为什么这么打印了。

* 首先 `flushSync` `this.setState({ number: 3 })`设定了一个高优先级的更新，所以3 先被打印

* 2 4 被批量更新为 4

相信这个`demo`让更深入了解了`flushSync`。

## findDOMNode
---

`findDOMNode`用于访问组件`DOM`元素节点，`react`推荐使用`ref`模式，不期望使用`findDOMNode`。

```js
ReactDOM.findDOMNode(component)
```

注意的是：

* 1. `findDOMNode`只能用在已经挂载的组件上。

* 2. 如果组件渲染内容为 `null` 或者是 `false`，那么 `findDOMNode`返回值也是 `null`。

* 3. `findDOMNode` 不能用于函数组件。

接下来让看一下，`findDOMNode`具体怎么使用的：

```js
class Index extends React.Component{
    handerFindDom=()=>{
        console.log(ReactDOM.findDOMNode(this))
    }
    render(){
        return <div style={{ marginTop:'100px' }} >
            <div>hello,world</div>
            <button onClick={ this.handerFindDom } >获取容器dom</button>
        </div>
    }
}
```

**效果：**

<a data-fancybox title="demo" href="/notes/assets/react/f9acc582f69e461caf0887f49d710a35_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/f9acc582f69e461caf0887f49d710a35_tplv-k3u1fbpfcp-watermark.image)</a>

完全可以将外层容器用`ref`来标记，获取捕获原生的`dom`节点。

## unmountComponentAtNode
---

从 `DOM` 中卸载组件，会将其事件处理器和 `state` 一并清除。 如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 `true` ，如果没有组件可被移除将会返回 `false` 。

**`unmountComponentAtNode`使用**

```js
function Text(){
    return <div>hello,world</div>
}

class Index extends React.Component{
    node = null
    constructor(props){
       super(props)
       this.state={
           numer:1,
       }
    }
    componentDidMount(){
        /*  组件初始化的时候，创建一个 container 容器 */
        ReactDOM.render(<Text/> , this.node )
    }
    handerClick=()=>{
       /* 点击卸载容器 */ 
       const state =  ReactDOM.unmountComponentAtNode(this.node)
       console.log(state)
    }
    render(){
        return <div  style={{ marginTop:'50px' }}  > 
             <div ref={ ( node ) => this.node = node  }  ></div>  
            <button onClick={ this.handerClick } >click me</button>
        </div>
    }
}
```

**效果**

<a data-fancybox title="demo" href="/notes/assets/react/15ebcd1a23e64561ae6346d4be7e958a_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/15ebcd1a23e64561ae6346d4be7e958a_tplv-k3u1fbpfcp-watermark.image)</a>