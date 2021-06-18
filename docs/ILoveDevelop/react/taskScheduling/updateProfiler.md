# updateProfiler

应该跟`timeoutComponent`一样是下个版本的功能，目前看不出有什么作用

```js
function updateProfiler(current, workInProgress) {
  const nextProps = workInProgress.pendingProps;
  if (enableProfilerTimer) {
    workInProgress.effectTag |= Update;
  }
  if (workInProgress.memoizedProps === nextProps) {
    return bailoutOnAlreadyFinishedWork(current, workInProgress);
  }
  const nextChildren = nextProps.children;
  reconcileChildren(current, workInProgress, nextChildren);
  memoizeProps(workInProgress, nextProps);
  return workInProgress.child;
}
```