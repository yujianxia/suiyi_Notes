描述
---

`React` 是 React 库的入口。如果通过使用 `<script>` 标签的方式来加载 React，则可以通过 `React` 全局变量对象来获得 React 的顶层 API。当使用 ES6 与 npm 时，可以通过编写 `import React from 'react'` 来引入它们。当使用 ES5 与 npm 时，则可以通过编写 `var React = require('react')` 来引入它们。


# 概览

## 组件

使用 React 组件可以将 UI 拆分为独立且复用的代码片段，每部分都可独立维护。可以通过子类 `React.Component` 或 `React.PureComponent` 来定义 React 组件。

* [React.Component]()

* [React.PureComponent]()

如果不使用 ES6 的 class，则可以使用 create-react-class 模块来替代

React 组件也可以被定义为可被包装的函数：

* [React.memo]()

## 创建 React 元素

建议使用 JSX 来编写的 UI 组件。每个 JSX 元素都是调用 `React.createElement()` 的语法糖。一般来说，如果使用了 JSX，就不再需要调用以下方法。

* [createElement()]()

* [createFactory()]()

## 转换元素

`React` 提供了几个用于操作元素的 API：

* [cloneElement()]()

* [isValidElement()]()

* [React.Children]()

## Fragments

`React` 还提供了用于减少不必要嵌套的组件。

* [React.Fragment]()

## Refs

* [React.createRef]()

* [React.forwardRef]()

## Suspense

`Suspense` 使得组件可以“等待”某些操作结束后，再进行渲染。目前，`Suspense` 仅支持的使用场景是：通过 `React.lazy` 动态加载组件。

* [React.lazy]()

* [React.Suspense]()

## Hook

Hook 是 React 16.8 的新增特性。它可以让在不编写 class 的情况下使用 `state` 以及其他的 `React` 特性。Hook 拥有专属文档章节和单独的 API 参考文档：

* 基础 Hook
    
    * useState
    
    * useEffect
    
    * useContext

* 额外的 Hook

    * useReducer

    * useCallback

    * useMemo

    * useRef

    * useImperativeHandle

    * useLayoutEffect

    * useDebugValue

# 参考

## React.Component

`React.Component` 是使用 ES6 classes 方式定义 React 组件的基类：

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## React.PureComponent

`React.PureComponent` 与 `React.Component` 很相似。两者的区别在于 `React.Component` 并未实现 `shouldComponentUpdate()`，而 `React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现了该函数。

如果赋予 React 组件相同的 props 和 state，`render()` 函数会渲染相同的内容，那么在某些情况下使用 `React.PureComponent` 可提高性能。

> **注意**
> 
> `React.PureComponent` 中的 `shouldComponentUpdate()` 仅作对象的浅层比较。如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果。仅在的 props 和 state 较为简单时，才使用 `React.PureComponent`，或者在深层数据结构发生变化时调用 `forceUpdate()` 来确保组件被正确地更新。也可以考虑使用 `immutable` 对象加速嵌套数据的比较。
>
> 此外，`React.PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 prop 更新。因此，请确保所有子组件也都是“纯”的组件。

## React.memo

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

`React.memo` 为高阶组件。

如果的组件在相同 props 的情况下渲染相同的结果，那么可以通过将其包装在 `React.memo` 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

`React.memo` 仅检查 props 变更。如果函数组件被 `React.memo` 包裹，且其实现中拥有 `useState` 或 `useContext` 的 Hook，当 context 发生变化时，它仍会重新渲染。

默认情况下其只会对复杂对象做浅层对比，如果想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```jsx
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

此方法仅作为**性能优化**的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

> **注意**
> 
> 与 class 组件中 `shouldComponentUpdate()` 方法不同的是，如果 props 相等，`areEqual` 会返回 `true`；如果 props 不相等，则返回 `false`。这与 `shouldComponentUpdate` 方法的返回值相反。

## createElement()

```jsx
React.createElement(
  type,
  [props],
  [...children]
)
```

创建并返回指定类型的新 `React 元素`。其中的类型参数既可以是标签名字符串（如 `'div'` 或 `'span'`），也可以是 `React 组件` 类型 （class 组件或函数组件），或是 `React fragment` 类型。

使用 `JSX` 编写的代码将会被转换成使用 `React.createElement()` 的形式。如果使用了 JSX 方式，那么一般来说就不需要直接调用 `React.createElement()`。请查阅不使用 JSX 章节获得更多信息。

## cloneElement()

```jsx
React.cloneElement(
  element,
  [props],
  [...children]
)
```

以 `element` 元素为样板克隆并返回新的 React 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。新的子元素将取代现有的子元素，而来自原始元素的 `key` 和 `ref` 将被保留。

`React.cloneElement()` 几乎等同于：

```jsx
<element.type {...element.props} {...props}>{children}</element.type>
```

但是，这也保留了组件的 `ref`。这意味着当通过 `ref` 获取子节点时，将不会意外地从祖先节点上窃取它。相同的 `ref` 将添加到克隆后的新元素中。

引入此 API 是为了替换已弃用的 `React.addons.cloneWithProps()`。

## createFactory()

```jsx
React.createFactory(type)
```

返回用于生成指定类型 React 元素的函数。与 `React.createElement()` 相似的是，类型参数既可以是标签名字符串（像是 `'div'` 或 `'span'`），也可以是 `React 组件` 类型 （class 组件或函数组件），或是 `React fragment` 类型。

此辅助函数已废弃，建议使用 JSX 或直接调用 `React.createElement()` 来替代它。

如果使用 JSX，通常不会直接调用 `React.createFactory()`。

## isValidElement()

```jsx
React.isValidElement(object)
```

验证对象是否为 React 元素，返回值为 `true` 或 `false`

## React.Children

`React.Children` 提供了用于处理 `this.props.children` 不透明数据结构的实用方法。

***React.Children.map***

```jsx
React.Children.map(children, function[(thisArg)])
```

在 `children` 里的每个直接子节点上调用一个函数，并将 `this` 设置为 `thisArg`。如果 `children` 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。如果子节点为 `null` 或是 `undefined`，则此方法将返回 `null` 或是 `undefined`，而不会返回数组。

> **注意**
> 
> 如果 `children` 是一个 `Fragment` 对象，它将被视为单一子节点的情况处理，而不会被遍历。

***React.Children.forEach***

```jsx
React.Children.forEach(children, function[(thisArg)])
```

与 `React.Children.map()` 类似，但它不会返回一个数组。

***React.Children.count***

```jsx
React.Children.count(children)
```

返回 `children` 中的组件总数量，等同于通过 `map` 或 `forEach` 调用回调函数的次数。

***React.Children.only***

```jsx
React.Children.only(children)
```

验证 `children` 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。

> **注意**：
> 
> `React.Children.only()` 不接受 `React.Children.map()` 的返回值，因为它是一个数组而并不是 React 元素。

***React.Children.toArray***

```jsx
React.Children.toArray(children)
```

将 `children` 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。当想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当想要在向下传递 `this.props.children` 之前对内容重新排序或获取子集时。

> **注意**：
> 
> `React.Children.toArray()` 在拉平展开子节点列表时，更改 key 值以保留嵌套数组的语义。也就是说，`toArray` 会为返回数组中的每个 key 添加前缀，以使得每个元素 key 的范围都限定在此函数入参数组的对象内。

## React.Fragment

`React.Fragment` 组件能够在不额外创建 DOM 元素的情况下，让 `render()` 方法中返回多个元素。

```jsx
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

也可以使用其简写语法 <></>

## React.createRef

`React.createRef` 创建一个能够通过 ref 属性附加到 React 元素的 `ref`。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

## React.forwardRef

`React.forwardRef` 会创建一个React组件，这个组件能够将其接受的 `ref` 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

* [转发 refs 到 DOM 组件]()

* [在高阶组件中转发 refs]()

`React.forwardRef` 接受渲染函数作为参数。React 将使用 `props` 和 `ref` 作为参数来调用此函数。此函数应返回 React 节点。

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

在上述的示例中，React 会将 `<FancyButton ref={ref}>` 元素的 `ref` 作为第二个参数传递给 `React.forwardRef` 函数中的渲染函数。该渲染函数会将 `ref` 传递给 `<button ref={ref}>` 元素。

因此，当 React 附加了 ref 属性之后，`ref.current` 将直接指向 `<button>` DOM 元素实例。

## React.lazy

`React.lazy()` 允许定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。

```jsx
// 这个组件是动态加载的
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

请注意，渲染 `lazy` 组件依赖该组件渲染树上层的 `<React.Suspense>` 组件。这是指定加载指示器（loading indicator）的方式。

> **注意**
> 
> 使用 `React.lazy` 的动态引入特性需要 JS 环境支持 `Promise`。在 IE11 及以下版本的浏览器中需要通过引入 polyfill 来使用该特性。

## React.Suspense

`React.Suspense` 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。目前，懒加载组件是 `<React.Suspense>` 支持的**唯一**用例：

```jsx
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

请注意，`lazy` 组件可以位于 `Suspense` 组件树的深处——它不必包装树中的每一个延迟加载组件。最佳实践是将 `<Suspense>` 置于想展示加载指示器（loading indicator）的位置，而 `lazy()` 则可被放置于任何想要做代码分割的地方。

虽然目前尚未支持其它特性，但未来计划让 `Suspense` 支持包括数据获取在内的更多场景。

> **注意**:
> 
> `React.lazy()` 和 `<React.Suspense>` 尚未在 `ReactDOMServer` 中支持。