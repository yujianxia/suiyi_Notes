#
# 可能不需要使用派生 state

> **注意**
> 
> 下面所有的反面模式中，`componentWillReceiveProps` 和 `getDerivedStateFromProps` 都是通用的。

# 什么时候使用派生 state

`getDerivedStateFromProps` 的存在只有一个目的：让组件在 **props 变化**时更新 state。上一个 blog 展示了一些示例，比如 `props 的 offset 变化时，修改当前的滚动方向`和`根据 props 变化加载外部数据`。

因为有**保守使用派生 state** 这个规则。大部分使用派生 state 导致的问题，不外乎两个原因：

1. 直接复制 props 到 state 上；

2. 如果 props 和 state 不一致就更新 state。下面的示例包含了这两种情况。

如果你只是为了缓存（memoize）基于当前 props 计算后的结果的话，你就没必要使用派生 state。可以使用`memoization`

# 派生 state 的常见 bug

名词`“受控”`和`“非受控”`通常用来指代表单的 inputs，但是也可以用来描述数据频繁更新的组件。用 props 传入数据的话，组件可以被认为是`受控`（因为组件被父级传入的 props 控制）。数据只保存在组件内部的 state 的话，是`非受控`组件（因为外部没办法直接控制 state）。

常见的错误就是把两者混为一谈。当一个派生 state 值也被 `setState` 方法更新时，这个值就不是一个单一来源的值了。加载外部数据示例描述的行为和这个类似，但是有很重要的区别。在加载外部数据示例中，数据 `source` 和 `loading` 都有非常清晰并且唯一的数据来源。当 prop 改变时，`loading` 的状态**一定**会改变。相反，state 只有在 prop 改变时才会改变，除非组件内部还有其他行为改变这个状态。

# 反面模式: 直接复制 prop 到 state

最常见的误解就是 `getDerivedStateFromProps` 和 `componentWillReceiveProps` 只会在 props “改变”时才会调用。实际上只要父级重新渲染时，这两个生命周期函数就会重新调用，不管 props 有没有“变化”。所以，在这两个方法内直接复制（unconditionally）props 到 state 是不安全的。**这样做会导致 state 后没有正确渲染**。

重现一下这个问题。这个 `EmailInput` 组件复制 props 到 state：

```jsx
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // 这会覆盖所有组件内的 state 更新！
    // 不要这样做。
    this.setState({ email: nextProps.email });
  }
}
```

乍看之下还可以。 state 的初始值是 props 传来的，当在 `<input>` 里输入时，修改 state。但是如果父组件重新渲染，输入的所有东西都会丢失！(`查看这个示例`)，即使在重置 state 前比较 `nextProps.email !== this.state.email` 仍然会导致更新。

这个小例子中，使用 `shouldComponentUpdate` ，比较 props 的 email 是不是修改再决定要不要重新渲染。但是在实践中，一个组件会接收多个 prop，任何一个 prop 的改变都会导致重新渲染和不正确的状态重置。加上行内函数和对象 prop，创建一个完全可靠的 `shouldComponentUpdate` 会变得越来越难。而且 `shouldComponentUpdate` 的最佳实践是用于性能提升，而不是改正不合适的派生 state。

# 反面模式: 在 props 变化后修改 state

继续上面的示例，可以只使用 `props.email` 来更新组件，这样能防止修改 state 导致的 bug：

```jsx
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // 只要 props.email 改变，就改变 state
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```

> **注意**
> 
> 示例中使用了 `componentWillReceiveProps` ，使用 `getDerivedStateFromProps` 也是一样。

现在组件只会在 prop 改变时才会改变。

> 产生的问题：`页面上的多数据操作的同一个单向数据流在页面上的展示会互相影响`

有两个方案能解决这些问题。**这两者的关键在于，任何数据，都要保证只有一个数据来源，而且避免直接复制它**。

## 解决方案1：完全可控的组件

阻止上述问题发生的一个方法是，从组件里删除 state。如果 prop 里包含了 email，就没必要担心它和 state 冲突。甚至可以把 EmailInput 转换成一个轻量的函数组件：

```jsx
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

> 这样能用最简单的方式完成需要的组件。但是如果仍然想要保存临时的值，则需要父组件手动执行保存这个动作。

## 解决方案2：有 key 的非可控组件

另外一个选择是让组件自己存储临时的 email state。在这种情况下，组件仍然可以从 prop 接收“初始值”，但是更改之后的值就和 prop 没关系了：

```jsx
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

在这密码管理器的例子中，为了在不同的页面切换不同的值，可以使用 key 这个特殊的 React 属性。当 key 变化时， React 会`创建一个新的而不是更新一个既有的组件`。

Keys 一般用来渲染动态列表，但是这里也可以使用。在这个示例里，当用户输入时，使用 user ID 当作 key 重新创建一个新的 email input 组件：

```jsx
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

每次 ID 更改，都会重新创建 `EmailInput` ，并将其状态重置为最新的 `defaultEmail` 值。使用此方法，不用为每次输入都添加 `key`，在整个表单上添加 `key` 更有位合理。每次 key 变化，表单里的所有组件都会用新的初始值重新创建。

> **注意**
> 
> 这听起来很慢，但是这点的性能是可以忽略的。如果在组件树的更新上有很重的逻辑，这样反而会更快，因为省略了子组件 diff。

## 选项一：用 prop 的 ID 重置非受控组件

如果某些情况下 `key` 不起作用（可能是组件初始化的开销太大），一个麻烦但是可行的方案是在 `getDerivedStateFromProps` 观察 `userID` 的变化：

```jsx
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 只要当前 user 变化，
    // 重置所有跟 user 相关的状态。
    // 这个例子中，只有 email 和 user 相关。
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

> **注意**
> 
> 上面的示例使用了 `getDerivedStateFromProps`，用 `componentWillReceiveProps` 也一样。

## 选项二：使用实例方法重置非受控组件

更少见的情况是，即使没有合适的 `key`，也想重新创建组件。一种解决方案是给一个随机值或者递增的值当作 `key`，另外一种是用实例方法强制重置内部状态：

```jsx
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

> **然后父级组件可以使用 ref 调用这个方法**
> 
> React 支持一个特殊的、可以附加到任何组件上的 `ref` 属性。此属性可以是一个由 `React.createRef()` 函数创建的对象、或者一个回调函数、或者一个字符串（遗留 API）。当 `ref` 属性是一个回调函数时，此函数会（根据元素的类型）接收底层 DOM 元素或 class 实例作为其参数。这能够让你直接访问 DOM 元素或组件实例。

## 概括

不要直接复制（mirror） props 的值到 state 中，而是去实现一个**受控**的组件，然后在父组件里合并两个值。比如，不要在子组件里被动的接受 `props.value` 并跟踪一个临时的 `state.value`，而要在父组件里管理 `state.draftValue` 和 `state.committedValue`，直接控制子组件里的值。这样数据才更加明确可预测。

对于**不受控**的组件，当你想在 prop 变化（通常是 ID ）时重置 state 的话，可以选择以下几种方式：

* **建议: 重置内部所有的初始 state，使用 key 属性**

* 选项一：仅更改某些字段，观察特殊属性的变化（比如 `props.userID`）。

* 选项二：使用 `ref` 调用实例方法。

# memoization

上面用到了————仅在输入变化时，重新计算 render 需要使用的值————这个技术叫做 memoization

这里有个示例，组件使用一个 prop ————一个列表————并在用户输入查询条件时显示匹配的项，可以使用派生 state 存储过滤后的列表：

```jsx
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // 注意：这个例子不是建议的方法。
  // 下面的例子才是建议的方法。
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // 列表变化或者过滤文本变化时都重新过滤。
    // 注意要存储 prevFilterText 和 prevPropsList 来检测变化。
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

这个实现避免了重复计算 `filteredList`，但是过于复杂。因为它必须单独追踪并检测 prop 和 state 的变化，才能及时的更新过滤后的 list。可以使用 `PureComponent`，把过滤操作放到 `render` 方法里来简化这个组件

```jsx
// PureComponents 只会在 state 或者 prop 的值修改时才会再次渲染。
// 通过对 state 和 prop 的 key 做浅比较（ shallow comparison ）来确定有没有变化。
class Example extends PureComponent {
  // state 只需要保存 filter 的值：
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // PureComponent 的 render 只有
    // 在 props.list 或 state.filterText 变化时才会调用
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

上面的方法比派生 state 版本更加清晰明了。只有在过滤很大的列表时，这样做的效率不是很好。当有 prop 改变时 `PureComponent` 不会阻止再次渲染。为了解决这两个问题，可以添加 `memoization` 帮助函数来阻止非必要的过滤：

```jsx
import memoize from "memoize-one";

class Example extends Component {
  // state 只需要保存当前的 filter 值：
  state = { filterText: "" };

  // 在 list 或者 filterText 变化时，重新运行 filter：
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // 计算最新的过滤后的 list。
    // 如果和上次 render 参数一样，`memoize-one` 会重复使用上一次的值。
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

这样更简单，而且和派生 state 版本一样好！

在使用 `memoization` 时，请记住这些约束：

1. 大部分情况下， **每个组件内部都要引入 memoized 方法**，已免实例之间相互影响。

2. 一般情况下，会**限制 memoization 帮助函数的缓存空间**，以免内存泄漏。（上面的例子中，使用 `memoize-one` 只缓存最后一次的参数和结果）。

3. 如果每次父组件都传入新的 `props.list` ，那本文提到的问题都不会遇到。在大多数情况下，这种方式是可取的。