- 表单元素依赖于状态(state)，表单元素需要默认值实时映射到状态的时候，就是受控组件
```jsx
<input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
```
- 不通过state控制表单元素，而是通过ref来控制的表单元素就是非受控组件
```jsx
<input name="username" type="text" ref={username=>this.username=username}/>
```

给非受控组件设置defaultValue属性，给定默认值
[官方文档](https://zh-hans.reactjs.org/docs/uncontrolled-components.html#default-values)

示例代码：
```js
import React from 'react'

export default class UnControlledComp extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  handleClick = () => {
    console.log(this.inputRef.current.value);
  }

  render () {
    return (
      <>
        <input defaultValue="default value" ref={this.inputRef}></input>
        <button onClick={this.handleClick}>点击</button>
      </>
    )
  }
}
```
