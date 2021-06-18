`Shadow DOM` 可以想象成在 Vue 或者 React 中使用的一个个组件，是一种将 HTML 结构、Style 封装起来的结构。熟悉的 `<video>` 标签，其实就是 `Shadow DOM` 的封装

可以看到 `Shadow DOM` 允许在 DOM 文档中插入一个 DOM 的子树。`Shadow Tree` 会挂在 `Shadow host` 对应的 DOM 上。之后，`Shadow DOM` 与外层 DOM 不会相互影响，因此可以放心用来做组件。

具体的例子可以参考 MDN 给出的案例`<popup-info-box>`

这个例子告诉可以利用 Shadow DOM 封装自己的 tag 标签，并且可以在网页中使用。

[mdn使用 shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)
[凹凸实验室对于Shadow DOM的解读](https://aotu.io/notes/2016/06/24/Shadow-DOM/index.html)