**vue中：key的作用**
---
***

vue和react都实现了一套虚拟DOM，使可以不直接操作DOM元素，只操作数据便可以重新渲染页面。

**vue和react的虚拟DOM的Diff算法大致相同，其核心是基于两个简单的假设：**

1. **`两个相同的组件产生类似的DOM结构，不同的组件产生不同的DOM结构。`**

2. **`同一层级的一组节点，他们可以通过唯一的id进行区分。`**

基于以上这两点假设，使得虚拟DOM的Diff算法的复杂度从O(n^3)降到了O(n)。

<a data-fancybox title="复杂度示例图" href="https://upload-images.jianshu.io/upload_images/13201627-20effaf34ee5df0e.png?imageMogr2/auto-orient/strip|imageView2/2/w/377/format/webp">![复杂度示例图](https://upload-images.jianshu.io/upload_images/13201627-20effaf34ee5df0e.png?imageMogr2/auto-orient/strip|imageView2/2/w/377/format/webp)</a>

**当页面的数据发生变化时，Diff算法只会比较同一层级的节点：**

* 如果节点类型不同，直接干掉前面的节点，再创建并插入新的节点，不会再比较这个节点以后的子节点了。

* 如果节点类型相同，则会重新设置该节点的属性，从而实现节点的更新。

**当某一层有很多相同的节点时，也就是列表节点时，Diff算法的更新过程默认情况下也是遵循以上原则。**

比如一下这个情况：

<a data-fancybox title="情况示例图" href="https://upload-images.jianshu.io/upload_images/13201627-c3e12cdb02d59c24.png?imageMogr2/auto-orient/strip|imageView2/2/w/477/format/webp">![情况示例图](https://upload-images.jianshu.io/upload_images/13201627-c3e12cdb02d59c24.png?imageMogr2/auto-orient/strip|imageView2/2/w/477/format/webp)</a>

希望可以在B和C之间加一个F，Diff算法默认执行起来是这样的：

<a data-fancybox title="特别不理想执行情况" href="https://upload-images.jianshu.io/upload_images/13201627-9d6226c6268a341b.png?imageMogr2/auto-orient/strip|imageView2/2/w/572/format/webp">![特别不理想执行情况](https://upload-images.jianshu.io/upload_images/13201627-9d6226c6268a341b.png?imageMogr2/auto-orient/strip|imageView2/2/w/572/format/webp)</a>

即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？

所以需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。

<a data-fancybox title="key的作用" href="https://upload-images.jianshu.io/upload_images/13201627-d0b3a1577860fda9.png?imageMogr2/auto-orient/strip|imageView2/2/w/452/format/webp">![key的作用](https://upload-images.jianshu.io/upload_images/13201627-d0b3a1577860fda9.png?imageMogr2/auto-orient/strip|imageView2/2/w/452/format/webp)</a>

`所以一句话，**key的作用主要是为了高效的更新虚拟DOM**。另外vue中在使用相同标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，`

否则vue只会替换其内部属性而不会触发过渡效果。