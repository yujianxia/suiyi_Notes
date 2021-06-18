
[下方图片引用地址](https://www.jianshu.com/p/eba2b76b290b)

# 对Context的理解

## Context当做组件作用域

使用React的开发者都知道，一个React App本质就是一棵React组件树，每个React组件相当于这棵树上的一个节点，除了App的根节点，其他每个节点都存在一条父组件链。

<a data-fancybox title="示例" href="/notes/assets/react/1457831-ca45b0f51cf449ca.webp">![示例](/notes/assets/react/1457831-ca45b0f51cf449ca.webp)</a>

例如上图，`<Child />`的父组件链是`<SubNode />` -- `<Node />` -- `<App />`，`<SubNode />`的父组件链是`<Node />` -- `<App />`，`<Node />`的父组件链只有一个组件节点，就是`<App />`。

这些以树状连接的组件节点，实际上也组成了一棵`Context`树，每个节点的`Context`，来自父组件链上所有组件节点通过`getChildContext()`所提供的`Context`对象组合而成的对象。

<a data-fancybox title="示例" href="/notes/assets/react/1457831-16cf66bdd55511b1.webp">![示例](/notes/assets/react/1457831-16cf66bdd55511b1.webp)</a>

有了解JS作用域链概念的开发者应该都知道，JS的代码块在执行期间，会创建一个相应的作用域链，这个作用域链记录着运行时JS代码块执行期间所能访问的活动对象，包括变量和函数，JS程序通过作用域链访问到代码块内部或者外部的变量和函数。

假如以JS的作用域链作为类比，React组件提供的`Context`对象其实就好比一个提供给子组件访问的作用域，而`Context`对象的属性可以看成作用域上的活动对象。由于组件的`Context`由其父节点链上所有组件通过`getChildContext()`返回的Context对象组合而成，所以，组件通过`Context`是可以访问到其父组件链上所有节点组件提供的`Context`的属性。

所以，借鉴了JS作用域链的思路，把`Context`当成是**组件的作用域**来使用。

React App的组件是树状结构，一层一层延伸，父子组件是一对多的线性依赖。随意的使用`Context`其实会破坏这种依赖关系，导致组件之间一些不必要的额外依赖，降低组件的复用性，进而可能会影响到App的可维护性。

<a data-fancybox title="示例" href="/notes/assets/react/1457831-731a1ebbe244b0fe.webp">![示例](/notes/assets/react/1457831-731a1ebbe244b0fe.webp)</a>

通过上图可以看到，原本线性依赖的组件树，由于子组件使用了父组件的`Context`，导致`<Child />`组件对`<Node />`和`<App />`都产生了依赖关系。一旦脱离了这两个组件，`<Child />`的可用性就无法保障了，减低了`<Child />`的复用性。

<a data-fancybox title="示例" href="/notes/assets/react/1457831-89e9fca854376012.webp">![示例](/notes/assets/react/1457831-89e9fca854376012.webp)</a>

**通过`Context`暴露数据或者API不是一种优雅的实践方案**，尽管react-redux是这么干的。因此需要一种机制，或者说约束，去降低不必要的影响。

## 用Context作为共享数据的媒介

官方所提到`Context`可以用来进行跨组件的数据通信。而，把它理解为，好比一座桥，作为一种作为媒介进行数据共享。数据共享可以分两类：**App级**与**组件级**。

* **App级的数据共享**

App根节点组件提供的`Context`对象可以看成是App级的全局作用域，所以，利用App根节点组件提供的`Context`对象创建一些App级的全局数据。现成的例子可以参考react-redux，以下是`<Provider />`组件源码的核心实现：

```jsx
export function createProvider(storeKey = 'store', subKey) {
    const subscriptionKey = subKey || `${storeKey}Subscription`

    class Provider extends Component {
        getChildContext() {
          return { [storeKey]: this[storeKey], [subscriptionKey]: null }
        }

        constructor(props, context) {
          super(props, context)
          this[storeKey] = props.store;
        }

        render() {
          return Children.only(this.props.children)
        }
    }

    // ......

    Provider.propTypes = {
        store: storeShape.isRequired,
        children: PropTypes.element.isRequired,
    }
    Provider.childContextTypes = {
        [storeKey]: storeShape.isRequired,
        [subscriptionKey]: subscriptionShape,
    }

    return Provider
}

export default createProvider()
```

App的根组件用`<Provider />`组件包裹后，本质上就为App提供了一个全局的属性`store`，相当于在整个App范围内，共享`store`属性。当然，`<Provider />`组件也可以包裹在其他组件中，在组件级的全局范围内共享`store`。

* **组件级的数据共享**

如果组件的功能不能单靠组件自身来完成，还需要依赖额外的子组件，那么可以利用`Context`构建一个由多个子组件组合的组件。例如，`react-router`。

`react-router`的`<Router />`自身并不能独立完成路由的操作和管理，因为导航链接和跳转的内容通常是分离的，因此还需要依赖`<Link />`和`<Route />`等子组件来一同完成路由的相关工作。为了让相关的子组件一同发挥作用，`react-router`的实现方案是利用`Context`在`<Router />`、`<Link />`以及`<Route />`这些相关的组件之间共享一个`router`，进而完成路由的统一操作和管理。

下面截取`<Router />`、`<Link />`以及`<Route />`这些相关的组件部分源码，以便更好的理解上述所说的。

```jsx
// Router.js

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  static contextTypes = {
    router: PropTypes.object
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        ...this.context.router,
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      }
    };
  }
  
  // ......
  
  componentWillMount() {
    const { children, history } = this.props;
    
    // ......
    
    this.unlisten = history.listen(() => {
      this.setState({
        match: this.computeMatch(history.location.pathname)
      });
    });
  }

  // ......
}
```

尽管源码还有其他的逻辑，但`<Router />`的核心就是为子组件提供一个带有`router`属性的`Context`，同时监听`history`，一旦`history`发生变化，便通过`setState()`触发组件重新渲染。

```jsx
// Link.js

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
  
  // ......
  
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleClick = event => {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !this.props.target &&
      !isModifiedEvent(event)
    ) {
      event.preventDefault();
      // 使用<Router />组件提供的router实例
      const { history } = this.context.router;
      const { replace, to } = this.props;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };
  
  render() {
    const { replace, to, innerRef, ...props } = this.props;

    // ...

    const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;

    const href = history.createHref(location);
    return (
      <a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
    );
  }
}
```

`<Link />`的核心就是渲染`<a>`标签，拦截`<a>`标签的点击事件，然后通过`<Router />`共享的`router`对`history`进行路由操作，进而通知`<Router />`重新渲染。

```jsx
// Route.js

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  
  // ......
  
  state = {
    match: this.computeMatch(this.props, this.context.router)
  };

  // 计算匹配的路径，匹配的话，会返回一个匹配对象，否则返回null
  computeMatch(
    { computedMatch, location, path, strict, exact, sensitive },
    router
  ) {
    if (computedMatch) return computedMatch;
    
    // ......

    const { route } = router;
    const pathname = (location || route.location).pathname;
    
    return matchPath(pathname, { path, strict, exact, sensitive }, route.match);
  }
 
  // ......

  render() {
    const { match } = this.state;
    const { children, component, render } = this.props;
    const { history, route, staticContext } = this.context.router;
    const location = this.props.location || route.location;
    const props = { match, location, history, staticContext };

    if (component) return match ? React.createElement(component, props) : null;

    if (render) return match ? render(props) : null;

    if (typeof children === "function") return children(props);

    if (children && !isEmptyChildren(children))
      return React.Children.only(children);

    return null;
  }
}
```

`<Route />`有一部分源码与`<Router />`相似，可以实现路由的嵌套，但其核心是通过`Context`共享的`router`，判断是否匹配当前路由的路径，然后渲染组件。

通过上述的分析，可以看出，整个`react-router`其实就是围绕着`<Router />`的`Context`来构建的。

## 描述

`context`属于一种解决组件间层级过多传递数据的问题，避免了层层嵌套的通过props传递的形式，同时对于不需要使用到redux时，是一种解决方案，关于组件的复用性变差的问题，觉得是可以通过高阶组件和context配合来解决的，因为react-redux使用的就是这样的形式；

`主要的形式`：createContext(value)：创建一个context实例；其中的参数为当前数据的默认值，只有没在Provider中指定value时，才会生效；

`Context.Provider`：生产者，数据提供方；通过value属性来定义需要被传递的数据

`Context.Consumer`：消费者，数据获取方；根据是函数组件还是class组件，有不同的使用形式；class组件可以指定contextType来确定要使用哪一个context对象的值，函数组件需要使用回调函数的形式来获取context的值；需要显示的指定context对象；

## 使用

```jsx
import React, {Component} from 'react'

// 首先创建一个 context 对象这里命名为：ThemeContext
const ThemeContext = React.createContext('light')

// 创建一个祖先组件组件 内部使用Provier 这个对象创建一个组件 其中 value 属性是真实传递的属性
class App extends Component {
  render () {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    )
  }
}

// 渲染 button 组件的外层包裹的属性
function Toolbar () {
  return (
    <div>
      <ThemeButton />
    </div>
  )
}
// 在 Toolbar 中渲染的button 组件 返回一个 consumer （消费者）将组件组件的 value 值跨组件传递给 // ThemeButton 组件
function ThemeButton (props) {
  return (
    <ThemeContext.Consumer>
      { theme => <button {...props} theme={theme}>{theme}</button> }
    </ThemeContext.Consumer>
  )
}
```

## 缺点

1. Context目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在app中使用context。

2. 尽管不建议在app中使用context，但是独有组件而言，由于影响范围小于app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用context

3. 对于组件之间的数据通信或者状态管理，有效使用props或者state解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑context。

4. context的更新需要通过setState()触发，但是这并不是很可靠的，Context支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回false 那么不能保证Context的更新一定可以使用Context的子组件，因此，Context的可靠性需要关注