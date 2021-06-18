# updateFragment

什么是`Fragment`，那就是`React.Fragment`。或者不知道各位有没有看过一种写法

```jsx
<>
  <Child1>
  <Child2>
</>
```

`Fragment`对应`Node`，因为他不是一个单独的DOM节点（或者Fiber节点），而是一组片段。对于`Fragment`来说，他本身没什么作用，所以只需要处理其`Children`

在`reconcileChildFibers`里面有这么一段代码：

```js
const isUnkeyedTopLevelFragment =
  typeof newChild === 'object' &&
  newChild !== null &&
  newChild.type === REACT_FRAGMENT_TYPE &&
  newChild.key === null;
if (isUnkeyedTopLevelFragment) {
  newChild = newChild.props.children;
}
```

也就是说如果你使用`Fragment`并且没有给他加`key`，则会变成直接处理他的`children`

```js
function updateFragment(current, workInProgress) {
  const nextChildren = workInProgress.pendingProps;
  if (hasLegacyContextChanged()) {
    // Normally we can bail out on props equality but if context has changed
    // we don't do the bailout and we have to reuse existing props instead.
  } else if (workInProgress.memoizedProps === nextChildren) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress);
  }
  reconcileChildren(current, workInProgress, nextChildren);
  memoizeProps(workInProgress, nextChildren);
  return workInProgress.child;
}
```