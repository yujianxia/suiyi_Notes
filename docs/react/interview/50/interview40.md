# 引用

[官网](https://zh-hans.reactjs.org/docs/codebase-overview.html)

#  源码概览

## 项目根目录

当克隆 `React` 仓库之后，将看到项目根目录的信息

* `packages` 包含元数据（比如 `package.json`）和 React 仓库中所有 package 的源码（子目录 `src`）。**如果需要修改源代码, 那么每个包的 src 子目录是最需要花费精力的地方**。

* `fixtures` 包含一些给贡献者准备的小型 React 测试项目。

* `build` 是 React 的输出目录。源码仓库中并没有这个目录，但是它会在克隆 React 并且第一次构建它之后出现。

## 共置测试

没有单元测试的顶层目录。而是将它们放置在所需测试文件的相同目录下的 `__tests__` 的目录之中。

比如，一个用于 `setInnerHTML.js` 的测试文件，会存放在 `__tests__/setInnerHTML-test.js`，就在它同级目录下。

## warning 和 invariant

React 代码库直接使用 `console.error` 来展示 warnings：

```jsx
if (__DEV__) {
  console.error('Something is wrong.');
}
```

warning 仅在开发环境中启用。在生产环境中，他们会被完全剔除掉。如果需要在生产环境禁止执行某些代码，请使用 `invariant` 模块代替 `warning`：

```jsx
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**当 invariant 判别条件为 false 时，会将 invariant 的信息作为错误抛出**

“Invariant” 用于声明 “这个条件应总为 true”。可以把它当成一种断言。

保持开发和生产环境的行为相似是十分重要的，因此 `invariant` 在开发和生产环境下都会抛出错误。不同点在于在生产环境中这些错误信息会被自动替换成错误代码，这样可以让输出库文件变得更小。

## 开发环境与生产环境

可以在代码库中使用 `__DEV__` 这个伪全局变量，用于管理开发环境中需运行的代码块

这在编译阶段会被内联，在 CommonJS 构建中，转化成 `process.env.NODE_ENV !== 'production'` 这样的判断。

对于独立构建来说，在没有 minify 的构建中，它会变成 `true`，同时在 minify 的构建中，检测到的 `if` 代码块会被完全剔除。

```jsx
if (__DEV__) {
  // 仅在开发环境下执行的代码
}
```

## Flow

最近将 `Flow` 引入源码，用于类型检查。在许可证头部的注释中，标记为 `@flow` 注释的文件是已经经过类型检查的。

接受`添加 Flow 注释到现有代码`。Flow 注释看上去像这样：

```jsx
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

如果可以的话，新代码应尽量使用 Flow 注释。 可以运行 `yarn flow`，用 Flow 本地检查的代码。

## Multiple Packages

React 采用 [monorepo](https://danluu.com/monorepo/) 的管理方式。仓库中包含多个独立的包，以便于更改可以一起联调，并且问题只会出现在同一地方。

## React Core

React “Core” 中包含所有`全局 React API`，比如：

* React.createElement()

* React.Component

* React.Children

**React 核心只包含定义组件必要的 API**。它不包含协调算法或者其他平台特定的代码。它同时适用于 React DOM 和 React Native 组件。

React 核心代码在源码的 `packages/react` 目录中。在 npm 上发布为 `react` 包。相应的独立浏览器构建版本称为 `react.js`，它会导出一个称为 `React` 的全局对象。

## 渲染器

React 最初只是服务于 DOM，但是这之后被改编成也能同时支持原生平台的 React Native。因此，在 React 内部机制中引入了“渲染器”这个概念。

**渲染器用于管理一棵 React 树，使其根据底层平台进行不同的调用**。

渲染器同样位于 `packages/` 目录下：

* `React DOM Renderer` 将 React 组件渲染成 DOM。它实现了全局 `ReactDOMAPI`，这在npm上作为 `react-dom` 包。这也可以作为单独浏览器版本使用，称为 `react-dom.js`，导出一个 `ReactDOM` 的全局对象.

* `React Native Renderer` 将 React 组件渲染为 Native 视图。此渲染器在 React Native 内部使用。

* `React Test Renderer` 将 React 组件渲染为 JSON 树。这用于 `Jest` 的`快照测试`特性。在 npm 上作为 `react-test-renderer` 包发布。

另外一个官方支持的渲染器的是 `react-art`。它曾经是一个独立的 `GitHub 仓库`，但是现在将此加入了主源代码树。

> **注意**:
> 
> 严格说来，`react-native-renderer` 实现了 React 和 React Native 的连接。真正渲染 Native 视图的平台特定代码及组件都存储在 `React Native 仓库`中。

## reconcilers

即便 React DOM 和 React Native 渲染器的区别很大，但也需要共享一些逻辑。特别是协调算法需要尽可能相似，这样可以让声明式渲染，自定义组件，state，生命周期方法和 refs 等特性，保持跨平台工作一致。

为了解决这个问题，不同的渲染器彼此共享一些代码。称 React 的这一部分为 “reconciler”。当处理类似于 `setState()` 这样的更新时，reconciler 会调用树中组件上的 `render()`，然后决定是否进行挂载，更新或是卸载操作。

Reconciler 没有单独的包，因为他们暂时没有公共 API。相反，它们被如 React DOM 和 React Native 的渲染器排除在外。

## Fiber reconciler

“fiber” reconciler 是一个新尝试，致力于解决 stack reconciler 中固有的问题，同时解决一些历史遗留问题。Fiber 从 React 16 开始变成了默认的 reconciler。

它的主要目标是：

* 能够把可中断的任务切片处理。

* 能够调整优先级，重置并复用任务。

* 能够在父元素与子元素之间交错处理，以支持 React 中的布局。

* 能够在 render() 中返回多个元素。

* 更好地支持错误边界。

源代码在 `packages/react-reconciler` 目录下

## 事件系统

React 在原生事件基础上进行了封装，以抹平浏览器间差异。其源码在 `packages/react-dom/src/events` 目录下