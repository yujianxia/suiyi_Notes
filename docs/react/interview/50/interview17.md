# 总结

1、首先简单的介绍下react中的`插槽（Portals）`，通过`ReactDOM.createPortal(child, container)`创建，是ReactDOM提供的接口，可以实现将子节点渲染到父组件DOM层次结构之外的DOM节点。

2、第一个参数（`child`）是任何可渲染的 React 子元素，例如一个元素，字符串或 片段(`fragment`)。第二个参数（`container`）则是一个 DOM 元素。

3、对于 `portal` 的一个典型用例是当父组件有 overflow: hidden 或 z-index 样式，但需要子组件能够在视觉上 `“跳出(break out)”` 其容器。例如，对话框、hovercards以及提示框。所以一般react组件里的模态框，就是这样实现的。

# 官方文档

使用一个 `<script>` 标签引入 React，所有的顶层 API 都能在全局 `ReactDOM` 上调用。如果使用 npm 和 ES6，可以用 `import ReactDOM from 'react-dom'`。如果使用 npm 和 ES5，可以用 `var ReactDOM = require('react-dom')`。

## 概览

`react-dom` 的 package 提供了可在应用顶层使用的 DOM（DOM-specific）方法，如果有需要，可以把这些方法用于 React 模型以外的地方。不过一般情况下，大部分组件都不需要使用这个模块。

* [render()]()

* [hydrate()]()

* [unmountComponentAtNode()]()

* [findDOMNode()]()

* [createPortal()]()

## 浏览器支持

> React 支持所有的现代浏览器，包括 IE9 及以上版本，但是需要为旧版浏览器比如 IE9 和 IE10 引入相关的 polyfills 依赖。

# API

## render()

```jsx
ReactDOM.render(element, container[, callback])
```

在提供的 `container` 里渲染一个 React 元素，并返回对该组件的`引用（或者针对无状态组件返回 null）`

如果 React 元素之前已经在 `container` 里渲染过，这将会对其执行更新操作，并仅会在必要时改变 DOM 以映射最新的 React 元素。

如果提供了可选的回调函数，该回调将在组件被渲染或更新之后被执行。

> **注意**：
> 
> `ReactDOM.render()` 会控制传入容器节点里的内容。当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的更新。
> 
> `ReactDOM.render()` 不会修改容器节点（只会修改容器的子节点）。可以在不覆盖现有子节点的情况下，将组件插入已有的 DOM 节点中。
> 
> `ReactDOM.render()` 目前会返回对根组件 `ReactComponent` 实例的引用。 但是，目前应该避免使用返回的引用，因为它是历史遗留下来的内容，而且在未来版本的 React 中，组件渲染在某些情况下可能会是异步的。 如果真的需要获得对根组件 `ReactComponent` 实例的引用，那么推荐为根元素添加 `callback ref`。
> 
> 使用 `ReactDOM.render()` 对服务端渲染容器进行 hydrate 操作的方式已经被废弃，并且会在 React 17 被移除。作为替代，请使用 `hydrate(`)。

## hydrate()

```jsx
ReactDOM.hydrate(element, container[, callback])
```

与 `render()` 相同，但它用于在 `ReactDOMServer` 渲染的容器中对 HTML 的内容进行 hydrate 操作。React 会尝试在已有标记上绑定事件监听器。

React 希望服务端与客户端渲染的内容完全一致。React 可以弥补文本内容的差异，但是需要将不匹配的地方作为 bug 进行修复。在开发者模式下，React 会对 hydration 操作过程中的不匹配进行警告。但并不能保证在不匹配的情况下，修补属性的差异。由于性能的关系，这一点非常重要，因为大多是应用中不匹配的情况很少见，并且验证所有标记的成本非常昂贵。

如果单个元素的属性或者文本内容，在服务端和客户端之间有无法避免差异（比如：时间戳），则可以为元素添加 `suppressHydrationWarning={true}` 来消除警告。这种方式只在一级深度上有效，应只作为一种应急方案（escape hatch）。请不要过度使用！除非它是文本内容，否则 React 仍不会尝试修补差异，因此在未来的更新之前，仍会保持不一致。

如果执意要在服务端与客户端渲染不同内容，可以采用`双重（two-pass）渲染`。在客户端渲染不同内容的组件可以读取类似于 `this.state.isClient` 的 state 变量，可以在 `componentDidMount()` 里将它设置为 `true`。这种方式在初始渲染过程中会与服务端渲染相同的内容，从而避免不匹配的情况出现，但在 hydration 操作之后，会同步进行额外的渲染操作。注意，因为进行了两次渲染，这种方式会使得组件渲染变慢，请小心使用。

## unmountComponentAtNode()

```jsx
ReactDOM.unmountComponentAtNode(container)
```

从 DOM 中卸载组件，会将其`事件处理器（event handlers）`和 `state` 一并清除。如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 `true`，如果没有组件可被移除将会返回 `false`。

## findDOMNode()

> **注意**:
> 
> `findDOMNode` 是一个访问底层 DOM 节点的应急方案（escape hatch）。在大多数情况下，不推荐使用该方法，因为它会破坏组件的抽象结构。`严格模式下该方法已弃用`。

```jsx
ReactDOM.findDOMNode(component)
```

如果组件已经被挂载到 DOM 上，此方法会返回浏览器中相应的原生 DOM 元素。此方法对于从 DOM 中读取值很有用，例如获取表单字段的值或者执行 DOM 检测（performing DOM measurements）。**大多数情况下，可以绑定一个 ref 到 DOM 节点上，可以完全避免使用 findDOMNode**。

当组件渲染的内容为 `null` 或 `false` 时，`findDOMNode` 也会返回 `null`。当组件渲染的是字符串时，`findDOMNode` 返回的是字符串对应的 DOM 节点。从 React 16 开始，组件可能会返回有多个子节点的 fragment，在这种情况下，`findDOMNode` 会返回第一个非空子节点对应的 DOM 节点。

> **注意**:
> 
> `findDOMNode` 只在已挂载的组件上可用（即，已经放置在 DOM 中的组件）。如果尝试调用未挂载的组件（例如在一个还未创建的组件上调用 `render()` 中的 `findDOMNode()`）将会引发异常。
> 
> `findDOMNode` 不能用于函数组件。

## createPortal()

```jsx
ReactDOM.createPortal(child, container)
```

创建 `portal`。`Portal` 将提供一种将子节点渲染到 DOM 节点中的方式，该节点存在于 DOM 组件的层次结构之外