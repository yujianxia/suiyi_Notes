**Vue源码-slot**
---
***

Vue允许为组件自定义子模版，这部分内容会替换组件模版中`slot`标签，这就是插槽。那么子组件在渲染过程中是怎么获取到父组件对应的插槽模版的，现在就通过源码来分析。

**普通插槽**
---

来看一个普通插槽的例子:

```javascript
import Vue from 'vue';

const Child = {
    template:
        '<div class="container">' +
        '<header><slot name="header"></slot></header>' +
        '<main><slot>默认内容</slot></main>' +
        '<footer><slot name="footer"></slot></footer>' +
        '</div>'
};

new Vue({
    el: '#app',
    template:
        '<div>' +
        '<Child>' +
        '<h1 slot="header">{{title}}</h1>' +
        '<p>{{msg}}</p>' +
        '<p slot="footer">{{desc}}</p>' +
        '</Child>' +
        '</div>',
    data() {
        return {
            title: '是标题',
            msg: '是内容',
            desc: '其它信息'
        };
    },
    components: { Child }
});
```

在看源码前，带着几个疑问：

* 在编译阶段是怎么解析父组件的`slot`属性和子组件的`slot`标签

* 创建`slot`虚拟节点的代码是怎么样的

* 在运行时，子组件生成`slot`的虚拟节点是怎么获取到父组件对应的插槽模版

**父组件渲染函数**
---

在父组件的编译解析阶段，会在`src/compiler/parser/index.js`的`processSlotContent`方法解析带`slot`属性的标签。对于例子会命中该方法的下面逻辑:

```javascript
// slot="xxx"
const slotTarget = getBindingAttr(el, 'slot')
if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
    }
}
```

这个方法获取属性`slot`对应的值`slotTarget`，然后在对应`ast`的节点上增加`slotTarget`属性，并在`attrs`属性集合上增加对象`{name: 'slot', value: slotTarget}`。

在代码生成的`genData`会对`slotTarget`属性的`ast`节点进行处理：

```javascript
// only for non-scoped slots
if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
}
```

这个逻辑是在渲染函数代码的`data`加上`slot`属性，值就是该解析标签获取的`slotTarget`。所以例子的父组件的渲染函数代码为：

```javascript
with (this) {
    return _c(
        'div',
        [
            _c('Child', [
                _c('h1', { attrs: { slot: 'header' }, slot: 'header' }, [_v(_s(title))]),
                _c('p', [_v(_s(msg))]),
                _c('p', { attrs: { slot: 'footer' }, slot: 'footer' }, [_v(_s(desc))])
            ])
        ],
        1
    );
}
```

**子组件渲染函数**
---

子组件的解析阶段要对`slot`标签进行处理。在解析入口文件的`processSlotOutlet`方法中处理，它只是在对应的`ast`的节点加上`slotName`属性，值为设置的插槽`name`：

```javascript
function processSlotOutlet (el) {
    if (el.tag === 'slot') {
        el.slotName = getBindingAttr(el, 'name')
    }
}
```

在代码生成阶段，如果遇到`ast`节点的`tag`是`slot`的话，会调用`genSlot`函数进行统一处理

```javascript
// src/compiler/codegen/index.js

export function genElement (el: ASTElement, state: CodegenState): string {

// ...

else if (el.tag === 'slot') {
    return genSlot(el, state)
}
  
  // ...
}

function genSlot (el: ASTElement, state: CodegenState): string {
    const slotName = el.slotName || '"default"'
    const children = genChildren(el, state)
    let res = `_t(${slotName}${children ? `,${children}` : ''}`
    const attrs = el.attrs || el.dynamicAttrs
        ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
            // slot props are camelized
            name: camelize(attr.name),
            value: attr.value,
            dynamic: attr.dynamic
        })))
        : null
    const bind = el.attrsMap['v-bind']
    if ((attrs || bind) && !children) {
        res += `,null`
    }
    if (attrs) {
        res += `,${attrs}`
    }
    if (bind) {
        res += `${attrs ? '' : ',null'},${bind}`
    }
    return res + ')'
}
```

这个函数对于例子只会执行下面的关键逻辑：

```javascript
const slotName = el.slotName || '"default"'
const children = genChildren(el, state)
let res = `_t(${slotName}${children ? `,${children}` : ''}`
```

其他部分是获取`slot`标签的属性，这个是作用域插槽的处理，稍后再分析。`children`是插槽的默认内容的渲染代码，所以的`slot`标签的生成代码是使用`_t`函数包裹。最终，来看下子组件的渲染函数代码：

```javascript
with (this) {
    return _c('div', { staticClass: 'container' }, [
        _c('header', [_t('header')], 2),
        _c('main', [_t('default', [_v('默认内容')])], 2),
        _c('footer', [_t('footer')], 2)
    ]);
}
```

**运行时阶段**
---

父组件执行`render`函数和正常一样，在创建组件占位虚拟节点时，组件包裹的每个插槽`vnode`也会被创建。另外会把`children`作为占位节点的组件属性：

```javascript
const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
)
```

在子组件实例初始化合并配置中，会把组件的占位节点的`children`属性给实例配置的`_renderChildren`属性：

```javascript
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
    // ...
    const parentVnode = options._parentVnode
    const vnodeComponentOptions = parentVnode.componentOptions
    opts._renderChildren = vnodeComponentOptions.children
}
```

然后执行`initRender`方法进行渲染的初始化工作，这个方法中会调用`resolveSlots`方法获取组件实例的`vm.$slots`的值：

```javascript
vm.$slots = resolveSlots(options._renderChildren, renderContext)
```

`resolveSlots`方法定义在`src/core/instance/render-helpers/resolve-slots.js`中：

```javascript
// 获取组件实例的vm.$slots
export function resolveSlots (
    children: ?Array<VNode>,
    context: ?Component
): { [key: string]: Array<VNode> } {
    if (!children || !children.length) {
        return {}
    }
    const slots = {}
    for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i]
        const data = child.data
        // remove slot attribute if the node is resolved as a Vue slot node
        if (data && data.attrs && data.attrs.slot) {
            delete data.attrs.slot
        }
        // named slots should only be respected if the vnode was rendered in the
        // same context.
        if ((child.context === context || child.fnContext === context) &&
            data && data.slot != null
        ) {
            const name = data.slot
            const slot = (slots[name] || (slots[name] = []))
            if (child.tag === 'template') {
                slot.push.apply(slot, child.children || [])
            } else {
                slot.push(child)
            }
        } else {
            (slots.default || (slots.default = [])).push(child)
        }
    }
    // ignore slots that contains only whitespace
    // 删除空白的slot节点
    for (const name in slots) {
        if (slots[name].every(isWhitespace)) {
            delete slots[name]
        }
    }
    return slots
}
```

这个方法`children`是值组件标签包含的虚拟节点，也就是组件实例的`_renderChildren`属性值。这个方法循环`children`子节点，获取节点`data`属性的`slot`值作为返回结果对象的`key`，对应的值就是该子节点。所以这个方法就是构造`slot`名到虚拟节点映射对象，对于例子的结果是：

<a data-fancybox title="结果示例图" href="https://camo.githubusercontent.com/3937b43738502c44f24b64278d929c2def21f0e0/687474703a2f2f626c6f672e696e6f6f622e78797a2f706f7374732f32616430333165632f312e6a7067">![结果示例图](https://camo.githubusercontent.com/3937b43738502c44f24b64278d929c2def21f0e0/687474703a2f2f626c6f672e696e6f6f622e78797a2f706f7374732f32616430333165632f312e6a7067)</a>

接着子组件挂载并执行自身的`render`函数，对应`slot`节点在编译阶段知道它会用`_t`函数创建。这个函数是Vue虚拟节点的渲染辅助函数之一，它们的定义入口在`src/core/instance/render-helpers/index.js`:

```javascript
export function installRenderHelpers (target: any) {
    target._o = markOnce
    target._n = toNumber
    target._s = toString
    target._l = renderList
    target._t = renderSlot
    target._q = looseEqual
    target._i = looseIndexOf
    target._m = renderStatic
    target._f = resolveFilter
    target._k = checkKeyCodes
    target._b = bindObjectProps
    target._v = createTextVNode
    target._e = createEmptyVNode
    target._u = resolveScopedSlots
    target._g = bindObjectListeners
    target._d = bindDynamicKeys
    target._p = prependModifier
}
```

所以`_t`对应的就是`renderSlot`函数，在定义在`src/core/instance/render-helpers/render-slot.js`:

```javascript
export function renderSlot (
    name: string,
    fallback: ?Array<VNode>,
    props: ?Object,
    bindObject: ?Object
): ?Array<VNode> {
    const scopedSlotFn = this.$scopedSlots[name]
    let nodes
    if (scopedSlotFn) { // scoped slot
        // ...
    } else {
        nodes = this.$slots[name] || fallback
    }

    const target = props && props.slot
    if (target) {
        return this.$createElement('template', { slot: target }, nodes)
    } else {
        return nodes
    }
}
```

对应作用域插槽逻辑不看，它其实是通过`this.$slots[name]`那到对应`slot`名的虚拟节点，因为`vm.$slots`在初始化阶段已经处理。如果拿不到就取`fallback`，它是插槽节点的默认内容节点。最终，子组件就可以拿到对应的父组件插槽模版进行渲染，注意的是，插槽模版的虚拟节点是在父组件渲染完成的，所以模版的状态只能来自父组件实例，这也是和作用域插槽不同的一点。

**作用域插槽**
---

同样，先来看一下例子：

```javascript
import Vue from 'vue';

const Child = {
    template: `
        <div class="child">
            <slot text="Hello " :msg="msg"></slot>
        </div>`,
    data() {
        return {
            msg: 'Vue'
        };
    }
};

new Vue({
    el: '#app',
    template: `
        <div>
            <Child>
                <template slot-scope="props">
                    <p>Hello from parent</p>
                    <p>{{props.text + props.msg}}</p>
                </template>
            </Child>
        </div>
    `,
    components: { Child }
});
```

**父组件渲染函数**
---

在编译解析阶段处理`slot`属性的`processSlotContent`函数命中下面的逻辑：

```javascript
let slotScope
if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope')
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
} else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
    el.slotScope = slotScope
}
```

它会在对应的ast节点增加`slotScope`属性，值为设置的子组件提供的插槽数据，在例子就是`props`。然后在构造`ast`树的时候，对于有`slotScope`属性的节点，会执行下面的逻辑：

```javascript
if (element.slotScope) {
    const name = element.slotTarget || '"default"';
    (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
}
```

`currentParent`表示当前ast节点的父节点。这段代码是在作用域插槽节点的父节点上增加一个`scopedSlots`对象，这个对象是以插槽名为`key`，插槽`ast`节点为值的映射对象。在例子中，会把`template`的`ast`节点添加到`Child`节点的`scopedSlots`对象上：

<a data-fancybox title="solt 对象示例图" href="https://camo.githubusercontent.com/6686f11f0a27aab4110f46eaf0a885a87b946069/687474703a2f2f626c6f672e696e6f6f622e78797a2f706f7374732f32616430333165632f322e6a7067">![solt 对象示例图](https://camo.githubusercontent.com/6686f11f0a27aab4110f46eaf0a885a87b946069/687474703a2f2f626c6f672e696e6f6f622e78797a2f706f7374732f32616430333165632f322e6a7067)</a>

在代码生成阶段会对拥有`scopedSlots`属性的节点进行处理：

```javascript
// scoped slots
if (el.scopedSlots) {
    data += `${genScopedSlots(el, el.scopedSlots, state)},`
}
```

`genScopedSlots`方法就是对作用域插槽ast节点对象的处理：

```javascript
function genScopedSlots(
    el: ASTElement,
    slots: { [key: string]: ASTElement },
    state: CodegenState
): string { 
    const generatedSlots = Object.keys(slots)
        .map(key => genScopedSlot(slots[key], state))
        .join(',')

    return `scopedSlots:_u([${generatedSlots}])`
}
```

这个方法对每个具名插槽节点作为参数调用`genScopedSlot`方法生成代码，并且最后包含在数组里面作为`_u`的参数。来看下`genScopedSlot`的定义：

```javascript
unction genScopedSlot (
    el: ASTElement,
    state: CodegenState
): string {
    const slotScope = el.slotScope === emptySlotScopeToken
        ? ``
        : String(el.slotScope)
    const fn = `function(${slotScope}){` +
        `return ${el.tag === 'template'
        ? el.if && isLegacySyntax
            ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
            : genChildren(el, state) || 'undefined'
        : genElement(el, state)
        }}`

    return `{key:${el.slotTarget || `"default"`},fn:${fn}}`
}
```

这个方法主要是返回一个对象的代码。该对象的`key`具名插槽的名称，`fn`为构造的函数代码，`它的参数为自定义的获取子组件的数据对象`，函数体插槽节点的渲染代码。对于例子，最后得到的渲染代码为：

```javascript
with (this) {
    return _c(
        'div',
        [
            _c('Child', {
                scopedSlots: _u([
                {
                    key: 'default',
                    fn: function(props) {
                        return [
                            _c('p', [_v('Hello from parent')]),
                            _v(' '),
                            _c('p', [_v(_s(props.text + props.msg))])
                        ];
                    }
                }
                ])
            })
        ],
        1
    );
}
```

可以看出来这个和普通插槽的区别就是组件Child没有了`children`，而是在`data`增加了`scopedSlots`属性。它是每个具名插槽对应的模版获取函数，这个在运行时会用到。

**子组件渲染函数**
---

对于作用域插槽子组件的生成代码和普通插槽不同的是**它会去处理`slot`标签上的属性，它们合并成一个对象作为`_t`函数的第三个参数**。最终子组件的渲染代码为：

```javascript
with (this) {
    return _c(
        'div',
        { staticClass: 'child' },
        [_t('default', null, { text: 'Hello ', msg: msg })],
        2
    );
}
```

**运行时阶段**
---

对于父组件在执行`render`函数时，在创建`Child`虚拟节点时候会调用`_u`函数去创建`scopedSlots`属性的值。该函数定义在`src/core/instance/render-helpers/resolve-scoped-slots.js`的`resolveScopedSlots`方法：

```javascript
export function resolveScopedSlots (
    fns: ScopedSlotsData, 
    res?: Object,
    hasDynamicKeys?: boolean,
    contentHashKey?: number
): { [key: string]: Function, $stable: boolean } {
    res = res || { $stable: !hasDynamicKeys }
    for (let i = 0; i < fns.length; i++) {
        const slot = fns[i]
        if (Array.isArray(slot)) {
            resolveScopedSlots(slot, res, hasDynamicKeys)
        } else if (slot) {
            if (slot.proxy) {
                slot.fn.proxy = true
            }
            res[slot.key] = slot.fn
        }
    }
    if (contentHashKey) {
        (res: any).$key = contentHashKey
    }
    return res
}
```

这个函数把传入的插槽获取函数数据转换成一个`映射对象`。对象的`key`为插槽的名称，**值为插槽模版获取函数**。所以，例子的`Child`组件`vnode`的`scopedSlots`属性最终为：

```javascript
{ 
    "default": function(props) {
        return [
            _c('p', [_v('Hello from parent')]),
            _v(' '),
            _c('p', [_v(_s(props.text + props.msg))])
        ];
    }
}
```

在子组件执行`render`函数之前有下面一点逻辑：

```javascript
// 作用域插槽处理
if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
    )
}
```

这段主要就是把`Child`组件占位符虚拟节点的`scopedSlots`最终会赋值到组件实例的`$scopedSlots`属性上。然后在创建`slot`虚拟节点的时候执行`renderSlot`函数会走下面逻辑：

```javascript
const scopedSlotFn = this.$scopedSlots[name]
let nodes
if (scopedSlotFn) { // scoped slot
    props = props || {}
    nodes = scopedSlotFn(props) || fallback
} 
```

其中`props`是`_t`函数的第三个参数，也就是例子的`{ text: 'Hello ', msg: msg }`。**因为创建`slot`节点是在子组件环境，所以对应的msg也能取到正确的值。然后作为参数传给插槽模版获取函数`scopedSlotFn`，最终创建正确的插槽模版`vnode`**。

到现在，就在子组件中正确渲染插入的作用域模版了。会发现，父组件提供的插槽模版的vnode最终是在子组件执行创建的，也是因为模版中用到了子组件的状态，这是和普通插槽原理的最大区别。

**总结**
---

到现在，就知道了Vue两种插槽的实现原理。它们两个之间不同的是:

* **普通插槽是在`父组件编译和渲染`生成好插槽模版vnode，`在子组件渲染是直接获取父组件生成好的vnode`。**

* **作用域插槽在`父组件不会生成插槽模版vnode`，而是在组件`占位vnode`上用`scopedSlots保存这不同具名插槽的获取模版函数`，然后在子组件渲染的时候把prop对象作为参数`调用该函数获取正确的插槽模版vnode`。**

总之，插槽的实现就是要在子组件生成`slot`的虚拟节点是能够找到正确的 **`模版`**和 **`数据作用域`**。

**分类**

* `默认插槽`：又名匿名查抄，当slot没有指定name属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。

* `具名插槽`：带有具体名字的插槽，也就是带有name属性的slot，一个组件可以出现多个具名插槽。

* `作用域插槽`：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。