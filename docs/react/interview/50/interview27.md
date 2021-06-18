如果只调用了`super()`，那么`this.props`在`super()`和构造函数结束之间仍是`undefined`。

```jsx
class Button extends React.Component {
  constructor(props) {
    super(); // 没有传 props
    console.log(props);      // {}
    console.log(this.props); // undefined 
  }
  // ...
}
```

react 中的class 是基于es6的规范实现的, 继承是使用extends关键字实现继承的，子类必须在constructor()中调用super() 方法否则新建实例就会报错，报错的原因是 子类是没有自己的this对象的，它只能继承父类的this对象，然后对其进行加工，而super()就是将父类中的this对象继承给子类的，没有super() 子类就得不到this对象。

* 如果使用了`constructor`就必须写`super()` 这个是用来初始化this的，可以绑定事件到this上

* 如果想要在`constructor`中使用`this.props`,就必须给`super`添加参数 `super(props)`

* 注意，无论有没有 `constructor`，在render中的`this.props`都是可以使用的，这是react自动附带的

* 如果没有用到`constructor` 是可以不写的，react会默认添加一个空的`constroctor`.