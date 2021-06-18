# 概念

[Class.contextType](/react/interview/interview7?id=classcontexttype)

定义当前组件要使用哪一个context

```jsx
const MyContext = React.createContext(defaultValue);

class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
}
MyClass.contextType = MyContext;
```

# childContextTypes

childContextTypes用来定义context数据类型，该api从16.3开始已被废弃

```jsx
class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    return <div>MessageList</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```