**Vue事件绑定**
---

**总结**:

* 原生事件绑定是通过`addEventListener`绑定给真实元素的，组件事件绑定是通过`Vue`自定义的`$on`实现的。

这是一个简单的 vue demo。

```javascript
let vue = new Vue({
    el: '#app',
    template: `
        <div @click="handleClick('abcd')"></div> 
    `,
    methods: {
        handleClick (a) {
            console.log(a)
        }
    }
})
```

从 Vue 的整个流程思考，看Vue是如何将事件进行绑定的。

1. vue 初始化

2. 模板编译

3. patch

**Vue初始化**
---

`vue` 初始化 `_init` 函数中，会调用 `initEvents` 初始化事件相关的动作。

```javascript
export function initEvents (vm: Component) {
    vm._events = Object.create(null)
    vm._hasHookEvent = false
    // init parent attached events
    const listeners = vm.$options._parentListeners
    if (listeners) {
        updateComponentListeners(vm, listeners)
    }
}
```

每一个 vue 实例，创建了一个 `_event` 对象，这个对象实际上是给虚拟事件用的，并不是真实的 DOM 事件，使用`$on`在对象中添加事件，`$emit`进行触发。紧跟着，从`options`中拿`_parentListeners`，然后进行更新。

由于当前例子只会产生一个 vue 实例，先暂时忽略 `_parentListeners`。

**模板编译**
---

由于给的是 `template`，vue 会将模板编译，产出 `AST` 和 `render` 函数

**ast**

```javascript
// 生成的 AST 对象
{
    attrsMap: { @click: "handleClick('abcd')"},
    events: {
        'click': {
            value: "handleClick('abcd')",
        }
    }
}
```

模板编译后得到抽象语法树，树里包含了实例化一个真实节点的所有信息。比如当前 `element` 的属性，子节点 `children` 等等。这里只截取了一部分属性。

在 `attrsMap` 中可以发现，的事件和 `style`、`class` 这些真实属性没有区别，只是`=`分割开来，前面是 `key`，后面是 `value`。

因为对 `html-parse` 阶段来说，`@click="handleclick('abcd')` 与 `class="a b"` 是没有区别的，都只是 `html` 中的属性，只是 `vue` 需要对这种属性做特殊的处理。

`vue` 通过正则`/^@|^v-on:/`判断，假如属性以`@` 或 `v-on`开头，就是要进行事件绑定了。在 `ast` 对象中加上了 `events` ，并将 `click` 加到里面。

另外，当将模板修改为`@click.once=handleclick('abcd')`的时候，`events` 中生成的属性会变成`~click`。

绑定属性中，`once` `stop` 这些称为 `modifier`。`vue` 针对`事件监听`中的`modifier`，做了特殊的处理，方便后续阶段进行相应的处理。

* capture -> !

* once -> ~

* passive -> &

**render**

```javascript
// render 字符串
with(this){return _c('div',{on:{"click":function($event){return handleClick('abcd')}}},[_v("fjskdflds")])}
```

字符串会通过 `new Function(code)` 的方式创建一个函数。

从字符串中可以看出，的`click 事件函数` 是 on 对象中的一个属性`click`。可以很自然的联想到，之后可能会用`addEventListener('click', fn)`去添加相应的函数（其实不是）。

同时，在渲染函数中，的代码有了一些变化。

`click`函数被包裹在一个带有`$event`变量的函数中。这也就不难理解，为什么可以在自己的模板字符串（如 `handleClick('abcd', $event)`）中使用`$event`，从而得到原生的事件对象了。因为创建函数以后，这个变量在函数的作用域上层。

通过修改字符串模板，最后创建出来真实的函数，这种方式很神奇。

**patch 阶段**
---

`render` 函数生成 `vnode`。根据 `vnode` 进行 `patch` 的过程中，定义了一些钩子函数，如 `create` `update`。在 `patch` 的不同阶段进行调用，事件就是通过这些钩子函数绑定上去的。

这些钩子函数在`/platforms/web/runtime/modules`文件夹中，现在只关心 `events.js`。

可以发现，在`create` `update`时，实际上都是将`vnode`传给`updateDOMListener`，这个函数负责了 DOM 事件的创建和更新。该函数实际上是`/src/core/vdom/helpers/update-listeners.js`。

**update-listener**

```javascript
export function updateListeners (
    on: Object,
    oldOn: Object,
    add: Function,
    remove: Function,
    createOnceHandler: Function,
    vm: Component
) {}
```

函数遍历 on 对象，通过`normalizeEvent`函数处理特殊的属性名，将其转为参数，也就是`once` `passive` 等。

然后根据新旧 `vnode` 对比，更新、替换、删除事件函数。

```javascript
// 最终的 vnode
{
	tag: 'div',
	data: {
		on: {
			click: function invoker() {}
		}
	},
}
```

实际上，事件函数会再被封装一次，包裹在一个名为 `invoker` 的函数中

* 该函数由`createFnInvoker`创建，将的函数包裹在一个异常处理代码块中执行。

* 的函数实际上实际上是`invoker`函数的一个属性`fns`，当事件触发时，调用的是 `invoker`，`invoker` 再找的函数。这样的话，当的事件函数变化时，只需要修改这个属性，不需要`removeEventListener`

**parentListeners**

回到之前初始化的例子，做一点修改

```javascript
Vue.component('child', {
    template: '<div>child</div>'
})
let vue = new Vue({
    el: '#app',
    template: `
        <child @click="handleClick('abcd')"></child> 
    `,
    methods: {
        handleClick (a) {
            console.log(a)
        }
    }
})
```

这个时候，的 click 事件是绑定在子组件上的。这就和真实 dom 元素的事件有区别了。

知道 `vue` 实例可以通过 `$emit` 触发事件，`$on` 绑定事件，父子组件之间可以进行通信，不需要使用浏览器的 `API`。

`_parentListeners` 就是父组件需要在子组件注册的函数。过程同样是调用`updateListeners`，区别就是后面的参数，`add` `remove`函数。之前的例子中，`add` 函数是 `addEventListener`，在这个例子中是 `$on`。

**其他问题**
---

**vnode是虚拟节点，什么时候将这个函数挂载到真实DOM节点中？**

patch的时候会根据vnode创建真实DOM节点，并且将其赋值为elm到vnode中，通过这个引用，添加函数

```javascript
function updateDOMListeners (oldVnode: VNodeWithData, vnode: VNodeWithData) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return
    }
    const on = vnode.data.on || {}
    const oldOn = oldVnode.data.on || {}
    target = vnode.elm
    normalizeEvents(on)
    updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)
    target = undefined
}
```

**函数调用的过程中，怎么保证this指向当前vue实例？**

在`init`阶段，`initMethods`过程中，如果判断属性是函数，会将其`bind`到当前实例。

```javascript
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
```