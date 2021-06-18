**术语 “`render prop`” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术**

具有 `render prop` 的组件接受一个返回 `React` 元素的函数，并在组件内部通过调用此函数来实现自己的渲染逻辑。

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

# 使用 Render Props 来解决横切关注点（Cross-Cutting Concerns）

组件是 React 代码复用的主要单元，但如何将一个组件封装的状态或行为共享给其他需要相同状态的组件并不总是显而易见。

例如，以下组件跟踪 Web 应用程序中的鼠标位置：

```jsx
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>移动鼠标!</h1>
        <p>当前的鼠标位置是 ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

当光标在屏幕上移动时，组件在 `<p>` 中显示其（x，y）坐标。

现在的问题是：如何在另一个组件中复用这个行为？换个说法，若另一个组件需要知道鼠标位置，能否封装这一行为，以便轻松地与其他组件共享它？？

由于组件是 React 中最基础的代码复用单元，现在尝试重构一部分代码使其能够在 `<Mouse>` 组件中封装需要共享的行为。

```jsx
// <Mouse> 组件封装了需要的行为...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...但如何渲染 <p> 以外的东西? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>移动鼠标!</h1>
        <Mouse />
      </>
    );
  }
}
```

现在 `<Mouse>` 组件封装了所有关于监听 mousemove 事件和存储鼠标 (x, y) 位置的行为，但其仍不是真正的可复用。

举个例子，假设有一个 `<Cat>` 组件，它可以呈现一张在屏幕上追逐鼠标的猫的图片。或许会使用 `<Cat mouse={{ x, y }}` prop 来告诉组件鼠标的坐标以让它知道图片应该在屏幕哪个位置。

首先, 或许会像这样，尝试在 `<Mouse>` 内部的渲染方法渲染 `<Cat>` 组件：:

```jsx
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          可以在这里换掉 <p> 的 <Cat>   ......
          但是接着需要创建一个单独的 <MouseWithSomethingElse>
          每次需要使用它时，<MouseWithCat> 是不是真的可以重复使用.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

这种方法适用于的特定用例，但还没有达到以可复用的方式真正封装行为的目标。现在，每当想要鼠标位置用于不同的用例时，必须创建一个新的组件（本质上是另一个 `<MouseWithCat>` ），它专门为该用例呈现一些东西.

这也是 render prop 的来历：相比于直接将 `<Cat>` 写死在 `<Mouse>` 组件中，并且有效地更改渲染的结果，可以为 `<Mouse>` 提供一个函数 prop 来动态的确定要渲染什么 —— 一个 `render prop`。

```jsx
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          使用 `render`prop 动态决定要渲染的内容，
          而不是给出一个 <Mouse> 渲染结果的静态表示
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

现在，提供了一个 `render` 方法 让 `<Mouse>` 能够动态决定什么需要渲染，而不是克隆 `<Mouse>` 组件然后硬编码来解决特定的用例。

更具体地说，**render prop 是一个用于告知组件需要渲染什么内容的函数 prop**。

这项技术使共享行为非常容易。要获得这个行为，只要渲染一个带有 `render prop` 的 `<Mouse>` 组件就能够告诉它当前鼠标坐标 (x, y) 要渲染什么。

关于 render prop 一个有趣的事情是可以使用带有 render prop 的常规组件来实现大多数[高阶组件 (HOC)]()。 例如，如果更喜欢使用 `withMouse` HOC而不是 `<Mouse>` 组件，可以使用带有 render prop 的常规 `<Mouse>` 轻松创建一个：

```jsx
// 如果出于某种原因真的想要 HOC，那么可以轻松实现
// 使用具有 render prop 的普通组件创建一个！
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

# 使用 Props 而非 render

重要的是要记住，render prop 是因为模式才被称为 `render prop` ，不一定要用名为 `render` 的 `prop` 来使用这种模式。事实上， ***任何被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”***.

尽管之前的例子使用了 `render`，也可以简单地使用 `children prop`！

```jsx
<Mouse children={mouse => (
  <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>
```

记住，`children prop` 并不真正需要添加到 JSX 元素的 `“attributes”` 列表中。相反，***可以直接放置到元素的内部***！

```jsx
<Mouse>
  {mouse => (
    <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
  )}
</Mouse>
```

由于这一技术的特殊性，当在设计一个类似的 API 时，或许会要直接地在的 `propTypes` 里声明 `children` 的类型应为一个函数。

```jsx
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

# 注意事项

## 将 Render Props 与 React.PureComponent 一起使用时要小心

如果在 `render` 方法里创建函数，那么使用 `render prop` 会抵消使用 `React.PureComponent` 带来的优势。因为浅比较 `props` 的时候总会得到 false，并且在这种情况下每一个 `render` 对于 `render prop` 将会生成一个新的值。

例如，继续之前使用的 `<Mouse>` 组件，如果 `Mouse` 继承自 `React.PureComponent` 而不是 `React.Component`，的例子看起来就像这样：

```jsx
class Mouse extends React.PureComponent {
  // 与上面相同的代码......
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          这是不好的！
          每个渲染的 `render` prop的值将会是不同的。
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

在这样例子中，每次 `<MouseTracker>` 渲染，它会生成一个新的函数作为 `<Mouse render>` 的 prop，因而在同时也抵消了继承自 `React.PureComponent` 的 `<Mouse>` 组件的效果！

为了绕过这一问题，有时可以定义一个 prop 作为实例方法，类似这样：

```jsx
class MouseTracker extends React.Component {
  // 定义为实例方法，`this.renderTheCat`始终
  // 当在渲染中使用它时，它指的是相同的函数
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

如果无法静态定义 `prop`（例如，因为需要关闭组件的 `props` 和/或 `state`），则 `<Mouse>` 应该继承自 `React.Component`。