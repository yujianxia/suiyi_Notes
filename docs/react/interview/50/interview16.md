# 展示长列表

如果的应用会渲染大量的列表数据，建议使用一种称为`‘windowing’`的技术，这种技术下在任何给定的时间内只会渲染一小部分数据列表，并可以减少列表项的重复渲染（即再次渲染已经渲染过的数据）。

[`react-window`](https://react-window.now.sh/#/examples/list/fixed-size)和[`react-virtualized`](https://github.com/bvaughn/react-virtualized)都是流行的使用`windowing`技术的库，他们都提供了一系列可重用的组件，这些组件能够帮助以最好的性能展示列表以及表格数据
