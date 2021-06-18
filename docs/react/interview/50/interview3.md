react组件在每次需要重新渲染时候都会调用`componentWillUpdate()`,

例如，调用 `this.setState()`时候

在这个函数中之所以不调用`this.setState()`是因为该方法会触发另一个`componentWillUpdate()`,如果`componentWillUpdate()`中触发状态更改,将以无限循环结束.

看了大家的回答，觉得不够全面，基本意思是对的。

1. 首先能这么做，但是不建议，因为就像大家说的会造成无限渲染

2. 并不是说任何情况下不能在此生命周期方法中使用`this.setState()`，可以设置合理的条件，保证它不会在每次渲染的时候执行`this.setState()`，而只是在需要的情况下执行【这很重要】

3. 不止`componentWillUpdate`方法，比如`componentWillReceiveProps`也可以这样设置条件