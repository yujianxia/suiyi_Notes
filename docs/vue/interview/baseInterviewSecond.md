#
# vue的优点

* 轻量级框架：只关注视图层，是一个构建数据的视图集合，大小只有几十kb；

* 简单易学：国人开发，中文文档，不存在语言障碍 ，易于理解和学习；

* 双向数据绑定：保留了angular的特点，在数据操作方面更为简单；

* 组件化：保留了react的优点，实现了html的封装和重用，在构建单页面应用方面有着独特的优势；

* 视图，数据，结构分离：使数据的更改更为简单，不需要进行逻辑代码的修改，只需要操作数据就能完成相关操作；

* 虚拟DOM：dom操作是非常耗费性能的，不再使用原生的dom操作节点，极大解放dom操作，但具体操作的还是dom不过是换了另一种方式；

# vue生命周期

总共分为8个阶段创建前/后，载入前/后，更新前/后，销毁前/后。

> 创建前/后： 在`beforeCreate`阶段，vue实例的挂载元素el和数据对象data都为undefined，还未初始化。
> 在`created`阶段，vue实例的数据对象data有了，el为undefined，还未初始化。

> 载入前/后：在`beforeMount`阶段，vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换。
> 在`mounted`阶段，vue实例挂载完成，data.message成功渲染。

> 更新前/后：当data变化时，会触发`beforeUpdate`和`updated`方法

> 销毁前/后：在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在

# computed和watch的区别

## 计算属性computed：

* 支持缓存，只有依赖数据发生改变，才会重新进行计算

* 不支持异步，当computed内有异步操作时无效，无法监听数据的变化

* computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data中声明过或者父组件传递的props中的数据通过计算得到的值

* 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，是一个多对一或者一对一，一般用computed

* 如果computed属性属性值是函数，那么默认会走get方法；函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个set方法，当数据变化时，调用set方法。

## 侦听属性watch：

* 不支持缓存，数据变，直接会触发相应的操作；

* watch支持异步；

* 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；

* 当一个属性发生变化时，需要执行对应的操作；一对多；

* 监听数据必须是data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数：

> `immediate`：组件加载立即触发回调函数执行

```js
watch: {
  firstName: {
    handler(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName;
    },
    // 代表在wacth里声明了firstName这个方法之后立即执行handler方法
    immediate: true
  }
}
```

> `deep`: `deep`的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，但是这样性能开销就会非常大了，任何修改obj里面任何一个属性都会触发这个监听器里的 `handler`

```js
watch: {
  obj: {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    deep: true
  }
}
```

> 优化：可以使用字符串的形式监听

```js
watch: {
  'obj.a': {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    // deep: true
  }
}
```

# vue-loader是什么？使用它的用途有哪些？

vue文件的一个加载器，跟`template`/`js`/`style`转换成js模块。

# $nextTick是什么？

vue实现响应式并不是数据发生变化后`dom`立即变化，而是按照一定的策略来进行`dom`更新。

> `nextTick` 是在下次 `DOM` 更新循环结束之后执行延迟回调，在修改数据之后使用`nextTick`，则可以在回调中获取更新后的 `DOM`

# v-for key的作用

当`Vue`用 `v-for` 正在更新已渲染过的元素列表是，它默认用“就地复用”策略。如果数据项的顺序被改变，`Vue`将不是移动`DOM`元素来匹配数据项的改变，而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。

为了给`Vue`一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 `key` 属性。`key`属性的类型只能为 `string`或者`number`类型。

`key` 的特殊属性主要用在Vue的虚拟`DOM`算法，在新旧`nodes`对比时辨识`VNodes`。如果不使用 `key`，`Vue`会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。使用`key`，它会基于`key`的变化重新排列元素顺序，并且会移除 `key` 不存在的元素。

# Vue的双向数据绑定原理是什么？

`vue.js` 是采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

> 1、需要`observe`的数据对象进行递归遍历，包括子属性对象的属性，都加上`setter`和`getter`这样的话，给这个对象的某个值赋值，就会触发`setter`，那么就能监听到了数据变化

> 2、`compile`解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

> 3、`Watcher`订阅者是`Observer`和`Compile`之间通信的桥梁，主要做的事情是:
> 
> * ①在自身实例化时往属性订阅器(dep)里面添加自己
> 
> * ②自身必须有一个update()方法
> 
> * ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

> 4、`MVVM`作为数据绑定的入口，整合`Observer`、`Compile`和`Watcher`三者，通过`Observer`来监听自己的`model`数据变化，通过`Compile`来解析编译模板指令，最终利用`Watcher`搭起`Observer`和`Compile`之间的通信桥梁，**达到数据变化** -> **视图更新；视图交互变化(input)** -> **数据model变更的双向绑定效果**。

# 组件传值

## 父传子

> 通过props传递

```js
父组件： <child value = '传递的数据' />

子组件: props['value'],接收数据,接受之后使用和data中定义数据使用方式一样
```

## 子传父

> 在父组件中给子组件绑定一个自定义的事件，子组件通过`$emit()`触发该事件并传值。

```js
父组件： <child @receive = 'receive' />

子组件: this.$emit('receive','传递的数据')
```

## 兄弟组件传值

* 通过中央通信 let bus = new Vue()

```js
A：methods :{ 函数{bus.$emit(‘自定义事件名’，数据)} 发送
```

```js
B：created （）{bus.$on(‘A发送过来的自定义事件名’，函数)} 进行数据接收
```

* 通过vuex

# prop 验证，和默认值

父组件给子组件传值的时候，可以指定该`props`的默认值及类型，当传递数据类型不正确的时候，`vue`会发出警告

```js
props: {
    visible: {
        default: true,
        type: Boolean,
        required: true
    },
},
```

# 请说下封装 vue 组件的过程

使用`Vue.extend`方法创建一个组件，然后使用`Vue.component`方法注册组件。子组件需要数据，可以在`props`中接受定义。而子组件修改好数据后，想把数据传递给父组件。可以采用`emit`方法。

# Vue.js的template编译

简而言之，就是先转化成`AST`树，再得到的`render`函数返回`VNode`（Vue的虚拟DOM节点），详细步骤如下：

> 首先，通过`compile`编译器把`template`编译成`AST`语法树（abstract syntax tree 即 源代码的抽象语法结构的树状表现形式），`compile`是`createCompiler`的返回值，`createCompiler`是用以创建编译器的。另外`compile`还负责合并`option`。

> 然后，`AST`会经过`generate`（将AST语法树转化成render funtion字符串的过程）得到`render`函数，`render`的返回值是`VNode`，`VNode`是Vue的虚拟DOM节点，里面有（标签名、子节点、文本等等）

# scss是什么？在vue.cli中的安装使用步骤是？有哪几大特性？

css的预编译,使用步骤如下：

* 第一步：用npm 下三个loader（sass-loader、css-loader、node-sass）

* 第二步：在build目录找到webpack.base.config.js，在那个extends属性中加一个拓展.scss

* 第三步：还是在同一个文件，配置一个module属性

* 第四步：然后在组件的style标签加上lang属性 ，例如：lang=”scss”

特性主要有:

* 可以用变量

* 可以用混合器

* 可以嵌套

# 常用的事件修饰符

在事件处理程序中调用 `event.preventDefault()` 或 `event.stopPropagation()` 是非常常见的需求。

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
```

> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止**所有的点击**，而 v`-on:click.self.prevent` 只会阻止对元素自身的点击。

> 2.1.4 新增

```html
<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>
```

不像其它只能对原生的 DOM 事件起作用的修饰符，`.once` 修饰符还能被用到自定义的**组件事件**上。

> 2.3.0 新增

Vue 还对应 **`addEventListener` 中的 `passive` 选项**提供了 `.passive` 修饰符。

```html
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

这个 `.passive` 修饰符尤其能够提升移动端的性能。

> 不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，`.passive` 会告诉浏览器你不想阻止事件的默认行为。

# 按键修饰符

Vue 允许为 `v-on` 在监听键盘事件时添加按键修饰符：

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

## 按键码

> `keyCode` 的事件用法**已经被废弃了**并可能不会被最新的浏览器支持。

```html
<input v-on:keyup.13="submit">
```

* `.enter`

* `.tab`

* `.delete (捕获“删除”和“退格”键)`

* `.esc`

* `.space`

* `.up`

* `.down`

* `.left`

* `.right`

> 有一些按键 (`.esc `以及所有的方向键) 在 IE9 中有不同的 `key` 值, 如果你想支持 IE9，这些内置的别名应该是首选。

可以通过全局 `config.keyCodes` 对象自定义按键修饰符别名：

```js
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

# 系统修饰键

> 2.1.0 新增

可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。

* `.ctrl`

* `.alt`

* `.shift`

* `.meta`

> **注意：在 Mac 系统键盘上，meta 对应 command 键 (⌘)。在 Windows 系统键盘 meta 对应 Windows 徽标键 (⊞)。在 Sun 操作系统键盘上，meta 对应实心宝石键 (◆)。在其他特定键盘上，尤其在 MIT 和 Lisp 机器的键盘、以及其后继产品，比如 Knight 键盘、space-cadet 键盘，meta 被标记为“META”。在 Symbolics 键盘上，meta 被标记为“META”或者“Meta”。**

例如：

```html
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>
```

> 请注意修饰键与常规按键不同，在和 `keyup` 事件一起用时，事件触发时修饰键必须处于按下状态。换句话说，只有在按住 `ctrl` 的情况下释放其它按键，才能触发 `keyup.ctrl`。而单单释放 `ctrl` 也不会触发事件。如果你想要这样的行为，请为 `ctrl` 换用 `keyCode`：`keyup.17`。

## .exact 修饰符

> 2.5.0 新增

`.exact` 修饰符允许你控制由精确的系统修饰符组合触发的事件。

```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

## 鼠标按钮修饰符

> 2.2.0 新增

* `.left`

* `.right`

* `.middle`

这些修饰符会限制处理函数仅响应特定的鼠标按钮。

# vue如何获取dom

先给标签设置一个ref值，再通过this.$refs.domName获取，例如：

```js
<div ref="test"></div>

const dom = this.$refs.test
```

# assets和static的区别

两者的区别：

* `assets`中的文件在运行`npm run build`的时候会打包，简单来说就是会被压缩体积，代码格式化之类的。打包之后也会放到static中。

* `static`中的文件则不会被打包。

> 建议：将图片等未处理的文件放在`assets`中，打包减少体积。而对于第三方引入的一些资源文件如iconfont.css等可以放在static中，因为这些文件已经经过处理了。

# vue初始化页面闪动问题

使用vue开发时，在vue初始化之前，由于div是不归vue管的，所以写的代码在还没有解析的情况下会容易出现花屏现象，看到类似于`{{message}}`的字样，虽然一般情况下这个时间很短暂，但是还是有必要让解决这个问题的。

```css
[v-cloak] {
    display: none;
}
```

如果没有彻底解决问题，则在根元素加上`style="display: none;"` `:style="{display: 'block'}"`

# 状态管理（vuex）

## vuex是什么

`Vuex` 是一个专为 Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。`Vuex` 也集成到 `Vue` 的官方调试工具 `devtools` `extension`，提供了诸如零配置的 `time-travel` 调试、状态快照导入导出等高级调试功能。

## 怎么使用vuex

> 第一步安装

```shell
npm install vuex -S
```

> 第二步创建store

```js
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//不是在生产环境debug为true
const debug = process.env.NODE_ENV !== 'production';
//创建Vuex实例对象
const store = new Vuex.Store({
    strict:debug,//在不是生产环境下都开启严格模式
    state:{
    },
    getters:{
    },
    mutations:{
    },
    actions:{
    }
})
export default store;
```

> 第三步注入vuex

```js
import Vue from 'vue';
import App from './App.vue';
import store from './store';
const vm = new Vue({
    store:store,
    render: h => h(App)
}).$mount('#app')
```

## vuex中有几个核心属性，分别是什么？

一共有5个核心属性，分别是:

* `state` 唯一数据源,`Vue` 实例中的 `data` 遵循相同的规则

* `getters` 可以认为是 `store` 的计算属性,就像计算属性一样，`getter` 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。Getter 会暴露为 `store.getters` 对象，你可以以属性的形式访问这些值.

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

* `mutation` 更改 `Vuex` 的 `store` 中的状态的唯一方法是提交 `mutation`,非常类似于事件,通过`store.commit` 方法触发

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})

store.commit('increment')
```

* `action` Action 类似于 `mutation`，不同在于`Action` 提交的是 `mutation`，而不是直接变更状态，`Action` 可以包含任意异步操作

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

* `module` 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，`store` 对象就有可能变得相当臃肿。为了解决以上问题，`Vuex` 允许将 `store` 分割成模块（module）。

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

## ajax请求代码应该写在组件的methods中还是vuex的actions中

如果请求来的数据是不是要被其他组件公用，仅仅在请求的组件内使用，就不需要放入`vuex` 的`state`里。

如果被其他地方复用，这个很大几率上是需要的，如果需要，请将请求放入`action`里，方便复用。

## 从vuex中获取的数据能直接更改吗？

从vuex中取的数据，不能直接更改，需要浅拷贝对象之后更改，否则报错；

## vuex中的数据在页面刷新后数据消失

> vuex中的数据在页面刷新后数据消失

```js
存储： sessionStorage.setItem( '名', JSON.stringify(值) )
使用： sessionStorage.getItem('名') ---得到的值为字符串类型，用JSON.parse()去引号；
```

也可以引入插件vuex-persist，使用方法如下：

* 安装

```shell
npm install --save vuex-persist
or
yarn add vuex-persist
```

* 引入

```js
import VuexPersistence from 'vuex-persist'
```

* 先创建一个对象并进行配置

```js
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
```

* 引入进vuex插件

```js
const store = new Vuex.Store({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  plugins: [vuexLocal.plugin]
}) 
```

通过以上设置，在图3中各个页面之间跳转，如果刷新某个视图，数据并不会丢失，依然存在，并且不需要在每个 `mutations` 中手动存取 `storage` 。

## Vuex的严格模式是什么,有什么作用,怎么开启？

在严格模式下，无论何时发生了状态变更且不是由mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

在`Vuex.Store` 构造器选项中开启,如下

```js
const store = new Vuex.Store({
    strict:true,
})
```

## 组件中重复使用mutation

使用`mapMutations`辅助函数,在组件中这么使用

```js
import { mapMutations } from 'vuex'
methods:{
    ...mapMutations({
        setNumber:'SET_NUMBER',
    })
}
```

然后调用`this.setNumber(10)`相当调用`this.$store.commit('SET_NUMBER',10)`

## mutation和action有什么区别

* `action` 提交的是 `mutation`，而不是直接变更状态。`mutation`可以直接变更状态

* `action` 可以包含任意异步操作。`mutation`只能是同步操作

* 提交方式不同

```
action 是用this.store.dispatch('ACTION_NAME',data)来提交。
mutation 是用this.$store.commit('SET_NUMBER',10)来提交
```

* 接收参数不同，`mutation`第一个参数是`state`，而`action`第一个参数是`context`，其包含了

```js
{
    state,      // 等同于 `store.state`，若在模块中则为局部状态
    rootState,  // 等同于 `store.state`，只存在于模块中
    commit,     // 等同于 `store.commit`
    dispatch,   // 等同于 `store.dispatch`
    getters,    // 等同于 `store.getters`
    rootGetters // 等同于 `store.getters`，只存在于模块中
}
```

## 在v-model上怎么用Vuex中state的值？

需要通过computed计算属性来转换。

```js
<input v-model="message">
// ...
computed: {
    message: {
        get () {
            return this.$store.state.message
        },
        set (value) {
            this.$store.commit('updateMessage', value)
        }
    }
}
```

# 路由页面管理（vue-router）

## 什么是vue-router

`Vue Router` 是 `Vue.js` 官方的路由管理器。它和 `Vue.js` 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

* 嵌套的路由/视图表

* 模块化的、基于组件的路由配置

* 路由参数、查询、通配符

* 基于 Vue.js 过渡系统的视图过渡效果

* 细粒度的导航控制

* 带有自动激活的 CSS class 的链接

* HTML5 历史模式或 hash 模式，在 IE9 中自动降级

* 自定义的滚动条行为

## 怎么使用vue-router

### 第一步安装

```shell
npm install vue-router -S
```

### 第二步在main.js中使用Vue Router组件

<a data-fancybox title="demo" href="/notes/assets/vue/1734d65dc240568e.jpg">![demo](/notes/assets/vue/1734d65dc240568e.jpg)</a>

### 第三步配置路由

* 定义 (路由) 组件

> 路由组件可以是直接定义，也可以是导入已经定义好的组件。这里导入已经定义好的组件。如下

<a data-fancybox title="demo" href="/notes/assets/vue/1734d65dc2668cc8.jpg">![demo](/notes/assets/vue/1734d65dc2668cc8.jpg)</a>

* 定义路由（路由对象数组）

> 定义路由对象数组。对象的`path`是自定义的路径（即使用这个路径可以找到对应的组件），`component`是指该路由对应的组件。如下：

<a data-fancybox title="demo" href="/notes/assets/vue/1734d65dc3da62ed.jpg">![demo](/notes/assets/vue/1734d65dc3da62ed.jpg)</a>

* 实例化Vue Router对象

> 调用Vue Router的构造方法创建一个Vue Router的实例对象，将上一步定义的路由对象数组作为参数对象的值传入。如下

<a data-fancybox title="demo" href="/notes/assets/vue/1734d65dc48e8bf4.jpg">![demo](/notes/assets/vue/1734d65dc48e8bf4.jpg)</a>

* 挂载根实例

<a data-fancybox title="demo" href="/notes/assets/vue/1734d65dcb5f42d7.jpg">![demo](/notes/assets/vue/1734d65dcb5f42d7.jpg)</a>

### 第四步在App.vue中使用路由

在`App.vue`中使用标签来显示路由对应的组件，使用标签指定当点击时显示的对应的组件，`to`属性就是指定组件对应的路由。如下：

<a data-fancybox title="demo" href="/notes/assets/vue/1734d65dc512c1e6.jpg">![demo](/notes/assets/vue/1734d65dc512c1e6.jpg)</a>

## 怎么定义vue-router的动态路由？怎么获取传过来的动态参数？

在`router`目录下的`index.js`文件中，对`path`属性加上`/:id`。使用`router`对象的`params.id`获取动态参数

## vue-router的导航钩子

常用的是`router.beforeEach(to,from,next)`，在跳转前进行权限判断。一共有三种：

* 全局导航钩子：`router.beforeEach(to,from,next)`

* 组件内的钩子

* 单独路由独享组件

## vue路由传参

> 使用`query`方法传入的参数使用`this.$route.query`接受

> 使用`params`方式传入的参数使用`this.$route.params`接受

## router和route的区别

> `route`为当前`router`跳转对象里面可以获取`name`、`path`、`query`、`params`等

> `router`为`VueRouter`实例，想要导航到不同`URL`，则使用`router.push`方法

## 路由 TypeError: Cannot read property 'matched' of undefined 的错误问题

找到入口文件`main.js`里的`new Vue()`，必须使用`router`名，不能把`router`改成`Router`或者其他的别名

```js
// 引入路由
import router from './routers/router.js'

new Vue({
    el: '#app',
    router,    // 这个名字必须使用router
    render: h => h(App)
});
```

## 路由按需加载

随着项目功能模块的增加，引入的文件数量剧增。如果不做任何处理，那么首屏加载会相当的缓慢，这个时候，路由按需加载就闪亮登场了。

```js
webpack< 2.4 时
{ 
    path:'/', 
    name:'home',
    components:resolve=>require(['@/components/home'],resolve)
} 
webpack> 2.4 时
{ 
    path:'/', 
    name:'home', 
    components:()=>import('@/components/home')
}
```

`import()`方法是由`es6`提出的，动态加载返回一个`Promise`对象，`then`方法的参数是加载到的模块。类似于`Node.js`的`require`方法，主要`import()`方法是异步加载的。

## Vue里面router-link在电脑上有用，在安卓上没反应怎么解决

`Vue`路由在`Android`机上有问题，`babel`问题，安装`babel polypill`插件解决

## Vue2中注册在router-link上事件无效解决方法

使用`@click.native`。原因：`router-link`会阻止`click`事件，`.native`指直接监听一个原生事件

## RouterLink在IE和Firefox中不起作用（路由不跳转）的问题

* 只用`a`标签，不使用`button`标签

* 使用`button`标签和`Router.navigate`方法