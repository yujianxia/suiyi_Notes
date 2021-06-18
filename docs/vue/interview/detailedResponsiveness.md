### vue响应式详解（重学前端-vue篇1）

**Vue响应式**
---

数据发生变化后，会重新对页面渲染，这就是Vue响应式

<a data-fancybox title="流程图" href="https://user-gold-cdn.xitu.io/2020/7/12/17343bec8052a2ff?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">![流程图](https://user-gold-cdn.xitu.io/2020/7/12/17343bec8052a2ff?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)</a>

**流程**
---

* 侦测数据的变化`数据劫持 / 数据代理`

* 收集视图依赖了哪些数据`依赖收集`

* 数据变化时，自动“通知”需要更新的视图部分，并进行更新`发布订阅模式`

**侦测数据的变化**
---

**1 Object.defineProperty实现**
---

Vue通过设定对象属性的 `setter/getter` 方法来监听数据的变化，通过`getter`进行依赖收集，而每个`setter`方法就是一个`观察者`，在`数据变更`的时候通知`订阅者`更新视图。


```javascript
function render () {
    //set的时候会走这里，重新渲染
    console.log('模拟视图渲染')
}
let data = {
    name: '浪里行舟',
    location: { x: 100, y: 100 }
}
observe(data)
```

定义核心函数

```javascript
function observe (obj) { // 来用它使对象变成可观察的
    // 判断类型
    if (!obj || typeof obj !== 'object') {
        return
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
    function defineReactive (obj, key, value) {
        // 递归子属性
        observe(value)
        Object.defineProperty(obj, key, {
        enumerable: true, //可枚举（可以遍历）
        configurable: true, //可配置（比如可以删除）
        get: function reactiveGetter () {
            console.log('get', value) // 监听
            return value
        },
        set: function reactiveSetter (newVal) {
            observe(newVal) //如果赋值是一个对象，也要递归子属性
            if (newVal !== value) {
                console.log('set', newVal) // 监听
                render()
                value = newVal
            }
        }
        })
    }
}
```

`改变`data的属性，会出发`set`；然后`获取`data的属性，会触发`get`

```javascript
data.location = {
    x: 1000,
    y: 1000
} //打印     set {x: 1000,y: 1000} 模拟视图渲染
data.name //打印   get 浪里行舟

```

`「上面这段代码的主要作用在于：」`

observe这个函数传入一个 `obj（需要被追踪变化的对象）`，通过遍历所有属性的方式对该对象的每一个属性都通过 `defineReactive` 处理,给每个属性加上`set`和`get`方法,以此来达到实现侦测对象变化。值得注意的是，`observe` 会进行递归调用。


`「那如何侦测Vue中data 中的数据，其实也很简单：」`

```javascript
class Vue {
    /* Vue构造类 */
    constructor(options) {
        this._data = options.data;
        observer(this._data);
    }
}
```

这样只要 new 一个 Vue 对象，就会将 data 中的数据进行追踪变化。

`「但是发现一个问题，上面的代码无法检测到对象属性的添加或删除(如data.location.a=1,增加一个a属性)。」`

这是因为 Vue 通过Object.defineProperty来将对象的key转换成getter/setter的形式来追踪变化，但getter/setter只能追踪一个数据`是否被修改`，`无法追踪新增属性和删除属性`。如果是删除属性，可以用`vm.$delete`实现，那如果是新增属性，该怎么办呢？

1. 可以使用 `Vue.set(location, a, 1)` 方法向嵌套对象添加响应式属性;

2. 也可以给这个对象重新赋值，比如`data.location = {...data.location,a:1}`

`Object.defineProperty` 不能监听数组的变化，需要进行数组方法的重写

**2.Proxy实现**
---

Proxy 是 `JavaScript 2015` 的一个新特性。`Proxy` 的代理是针对整个对象的，而不是对象的某个属性，因此不同于 `Object.defineProperty` 的必须遍历对象每个属性，`Proxy` 只需要做`一层代理`就可以监听`同级结构`下的所有属性变化，当然对于`深层结构`，递归还是需要进行的。此外Proxy支持代理`数组`的变化。

```javascript
function render() {
    console.log('模拟视图的更新')
}
let obj = {
    name: '前端工匠',
    age: { age: 100 },
    arr: [1, 2, 3]
}
let handler = {
    get(target, key) {
        // 如果取的值是对象就再对这个对象进行数据劫持
        if (typeof target[key] == 'object' && target[key] !== null) {
            return new Proxy(target[key], handler)
        }
        return Reflect.get(target, key)
    },
    set(target, key, value) {
    //key为length时，表示遍历完了最后一个属性
        if (key === 'length') return true
        render()
        return Reflect.set(target, key, value)
    }
}

let proxy = new Proxy(obj, handler)
proxy.age.name = '浪里行舟' // 支持新增属性
console.log(proxy.age.name) // 模拟视图的更新 浪里行舟
proxy.arr[0] = '浪里行舟' //支持数组的内容发生变化
console.log(proxy.arr) // 模拟视图的更新 ['浪里行舟', 2, 3 ]
proxy.arr.length-- // 无效
```

**收集依赖**
---

***之所以要观察数据，其目的在于当数据的属性发生变化时，可以通知那些曾经使用了该数据的地方。比如例子中，模板中使用了location 数据，当它发生变化时，要向使用了它的地方发送通知。***

```javascript
let globalData = {
    text: '浪里行舟'
};
let test1 = new Vue({
    template:
        `<div>
            <span>{{text}}</span> 
        <div>`,
    data: globalData
});
let test2 = new Vue({
    template:
        `<div>
            <span>{{text}}</span> 
        <div>`,
    data: globalData
});
```

如果执行下面这条语句：

```javascript
globalData.text = '前端工匠';
```

此时需要通知 `test1` 以及 `test2` 这两个Vue实例进行视图的`更新`,只有通过`收集依赖`才能知道哪些地方依赖的数据，以及数据更新时`派发更新`。那依赖收集是如何实现的？其中的核心思想就是“事件发布订阅模式”。接下来先介绍两个重要角色-- `订阅者 Dep`和`观察者 Watcher` ，然后阐述收集依赖的如何实现的。

**订阅者 Dep**
---

**`「为什么引入 Dep:」`**

收集依赖需要为依赖找一个存储依赖的地方，为此创建了Dep,它用来`收集依赖`、`删除依赖`和`向依赖发送消息`等。

于是先来实现一个`订阅者 Dep 类`，用于`解耦属性`的依赖收集和派发更新操作，`「说得具体点」`:它的主要作用是用来`存放 Watcher 观察者对象`。可以把Watcher理解成一个`中介`的角色，`数据发生变化`时通知它，然后它再通知`其他地方`。

**`「Dep的简单实现:」`**

```javascript
class Dep {
    constructor () {
        /* 用来存放Watcher对象的数组 */
        this.subs = [];
    }
    /* 在subs中添加一个Watcher对象 */
    addSub (sub) {
        this.subs.push(sub);
    }
    /* 通知所有Watcher对象更新视图 */
    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
```

以上代码主要做两件事情：

* 用 `addSub` 方法可以在目前的 `Dep` 对象中增加一个 `Watcher` 的订阅操作；

* 用 `notify` 方法通知目前 `Dep` 对象的 `subs` 中的所有 `Watcher` 对象触发更新操作。所以当需要依赖收集的时候调用 `addSub`，当需要派发更新的时候调用 `notify`。

调用也很简单：

```javascript
let dp = new Dep()
dp.addSub(() => {//依赖收集的时候
    console.log('emit here')
})
dp.notify()//派发更新的时候
```

**观察者 Watcher**
---

**引入Watcher**

Vue 中定义一个 Watcher 类来表示`观察订阅依赖`。至于为啥引入Watcher，《深入浅出vue.js》给出了很好的解释:

当`属性`发生变化后，要通知`用到数据`的地方，而使用这个数据的地方有很多，而且类型还不一样，既有可能是模板，也有可能是用户写的一个watch,这时需要抽象出一个能`集中处理`这些情况的类。然后，在依赖收集阶段只收集这个封装好的类的实例进来，通知也只通知它一个，再由它负责通知其他地方。

**`「依赖收集的目的是:」`** 将观察者 Watcher 对象存放到当前闭包中的订阅者 `Dep` 的 `subs` 中。形成如下所示的这样一个关系（图参考《剖析 Vue.js 内部运行机制》）。

<a data-fancybox title="剖析 Vue.js 内部运行机制" href="https://user-gold-cdn.xitu.io/2020/7/12/17343bec8082db69?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">![剖析 Vue.js 内部运行机制](https://user-gold-cdn.xitu.io/2020/7/12/17343bec8082db69?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)</a>

**Watcher的简单实现**

```javascript
class Watcher {
    constructor(obj, key, cb) {
        // 将 Dep.target 指向自己
        // 然后触发属性的 getter 添加监听
        // 最后将 Dep.target 置空
        Dep.target = this
        this.cb = cb
        this.obj = obj
        this.key = key
        this.value = obj[key]
        Dep.target = null
    }
    update() {
        // 获得新值
        this.value = this.obj[this.key]
        // 定义一个 cb 函数，这个函数用来模拟视图更新，调用它即代表更新视图
        this.cb(this.value)
    }
}
```

以上就是 `Watcher` 的简单实现，在执行构造函数的时候将 `Dep.target` 指向自身，从而使得收集到了对应的 `Watcher`，在派发更新的时候取出对应的 `Watcher` ,然后执行 `update` 函数。

**`「依赖的本质：」`**

所谓的依赖，其实就是`Watcher`。

至于如何收集依赖，总结起来就一句话:

在`getter`中收集依赖，在`setter`中触发依赖。先收集依赖，即把用到该数据的地方`收集起来`，然后等`属性发生变化`时，把之前收集好的`依赖循环触发`一遍就行了。

具体来说，当外界通过Watcher`读取数据`时，便会触发`getter`从而将`Watcher添加到依赖中`，哪个Watcher触发了getter，就把哪个Watcher收集到Dep中。**`当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。`**

最后对 `defineReactive` 函数进行改造，在自定义函数中添加依赖收集和派发更新相关的代码,实现了一个简易的数据响应式:

```javascript
function observe (obj) {
    // 判断类型
    if (!obj || typeof obj !== 'object') {
        return
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
    function defineReactive (obj, key, value) {
        observe(value)  // 递归子属性
        let dp = new Dep() //新增
        Object.defineProperty(obj, key, {
            enumerable: true, //可枚举（可以遍历）
            configurable: true, //可配置（比如可以删除）
            get: function reactiveGetter () {
                console.log('get', value) // 监听
                // 将 Watcher 添加到订阅
                if (Dep.target) {
                    dp.addSub(Dep.target) // 新增
                }
                return value
            },
            set: function reactiveSetter (newVal) {
                observe(newVal) //如果赋值是一个对象，也要递归子属性
                if (newVal !== value) {
                console.log('set', newVal) // 监听
                render()
                value = newVal
                // 执行 watcher 的 update 方法
                dp.notify() //新增
                }
            }
        })
    }
}

class Vue {
    constructor(options) {
        this._data = options.data;
        observer(this._data);
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher();
        console.log('模拟视图渲染');
    }
}
```

当 `render function` 被渲染的时候,`读取`所需对象的值，会触发 `reactiveGetter` 函数把当前的 `Watcher` 对象（存放在 `Dep.target` 中）收集到 Dep 类中去。之后如果`修改`对象的值，则会触发 `reactiveSetter` 方法，通知 Dep 类调用 `notify` 来触发所有 `Watcher` 对象的 `update` 方法更新对应视图。

**`「完整流程图：」`**

<a data-fancybox title="「完整流程图：」" href="https://user-gold-cdn.xitu.io/2020/7/12/17343bec82aa9093?imageView2/0/w/1280/h/960/format/webp/ignore-error/1">![「完整流程图：」](https://user-gold-cdn.xitu.io/2020/7/12/17343bec82aa9093?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)</a>

* 在 new Vue() 后， Vue 会调用`_init` 函数进行初始化，也就是`init` 过程，在 这个过程`Data`通过`Observer`转换成了`getter/setter`的形式，来对数据追踪变化，当被设置的对象`被`读取的时候会执行`getter` 函数，而在当`被`赋值的时候会执行 `setter`函数。

* 当外界通过`Watcher`读取数据时，会触发`getter`从而将`Watcher`添加到依赖中。

* 在修改对象的值的时候，会触发对应的`setter`， `setter`通知之前依赖收集得到的 `Dep` 中的每一个 `Watcher`，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 `Watcher`就会开始调用 `update` 来更新视图。

**`「最后完整的响应式代码：」`**

大概结构

```javascript
  //defineReactive是对Observer的抽离
  const defineReactive = function(obj, key) {
    // 以下代码省略
  }
  
  const Vue = function(options) {
    console.log("Vue",this)
    //打印1  
    // Vue {
    //     _data:{
    //         text: "123"
    //         get text: ƒ get()
    //         set text: ƒ set(newVal)
    //     },
    //     mount: ƒ (),
    //     render: ƒ ()
    // }
    // 以下代码省略
  }
  
  const Watcher = function(vm, fn) {
    console.log("Watcher",this)
    //打印3 Watcher  this是下面的Dep中subs的对象
    // 以下代码省略
  }
  
  const Dep = function() {
    console.log("Dep",this)
    //打印2  
    // Dep  { 
    //     target: null,
    //     subs: [
    //         {        //是一个Watcher实例
    //         subs: Array(1)
    //         0: Watcher
    //         vm: {    //是一个Vue实例
    //             _data:{
    //                 text: "123",//该属性有了get和set方法
    //                 get text: ƒ get(),
    //                 set text: ƒ set(newVal)
    //             },
    //             mount: ƒ (),
    //             render: ƒ ()
    //         },

    //         addDep: ƒ (dep),
    //         update: ƒ (),
    //         value: undefined
    //         }
    //     ],
    //     depend: ƒ (),
    //     addSub: ƒ (watcher),
    //     notify: ƒ ()
    // }

    // 以下代码省略
}
  
const vue = new Vue({
    data() {
        return {
            text: 'hello world'
        };
    }
})

vue.mount(); 
vue._data.text = '123';
```

详细代码

```javascript
const Observer = function(data) {
    console.log(1)   //开始4 new Vue的时候就会执行
    // 循环修改为每个属性添加get set
    for (let key in data) {
        defineReactive(data, key);
    }
}

const defineReactive = function(obj, key) {
    console.log(2)    //开始5 new Vue的时候就会执行
    // 局部变量dep，用于get set内部调用
    const dep = new Dep();
    // 获取当前值
    let val = obj[key];
    Object.defineProperty(obj, key, {
        
        // 设置当前描述属性为可被循环
        enumerable: true,
        // 设置当前描述属性可被修改
        configurable: true,
        get() {
            console.log(3)//开始10  开始19
            console.log('in get');
            // 调用依赖收集器中的addSub，用于收集当前属性与Watcher中的依赖关系
            dep.depend();
            return val;
        },
        set(newVal) {
            console.log(4)//开始15
            if (newVal === val) {
                return;
            }
            val = newVal;
            // 当值发生变更时，通知依赖收集器，更新每个需要更新的Watcher，
            // 这里每个需要更新通过什么断定？dep.subs
            dep.notify();
        }
    });
}

const observe = function(data) {
    console.log(5)  //开始3 new Vue的时候就会执行
    return new Observer(data);
}

const Vue = function(options) {
    console.log(6)//开始1 new Vue的时候就会执行
    const self = this;
    // 将data赋值给this._data，源码这部分用的Proxy所以用最简单的方式临时实现
    if (options && typeof options.data === 'function') {
        console.log(7)//开始2   new Vue的时候就会执行
        this._data = options.data.apply(this);
    }
    // 挂载函数
    this.mount = function() {
        console.log(8)  //开始7  new Vue以后，执行vue.mount()
        new Watcher(self, self.render);
    }
    // 渲染函数
    this.render = function() {
        console.log(9) //开始9 开始18  render函数执行后走到这里
        with(self) {
            _data.text;  //这里取data值的时候，就会走get方法
        }
    }
    // 监听this._data
    observe(this._data);  //new Vue的时候就会执行,这里执行完，就表示new Vue的过程执行完了
}

const Watcher = function(vm, fn) {
    console.log(10)  //开始8  执行vue.mount()以后会走到这里
    const self = this;
    this.vm = vm;
    // 将当前Dep.target指向自己
    Dep.target = this;
    // 向Dep方法添加当前Wathcer
    this.addDep = function(dep) {
        console.log(11) //开始13  
        dep.addSub(self);
    }
    // 更新方法，用于触发vm._render
    this.update = function() {
        console.log(12)//开始17
        console.log('in watcher update');
        fn();
    }
    // 这里会首次调用vm._render，从而触发text的get
    // 从而将当前的Wathcer与Dep关联起来
    this.value = fn();   //开始9  fn是render函数，这里fn()就会赋值的时候执行
    // 这里清空了Dep.target，为了防止notify触发时，不停的绑定Watcher与Dep，
    // 造成代码死循环
    Dep.target = null;
}

const Dep = function() {
    console.log(13)  //开始6  new Vue的时候就会执行到new Dep，然后执行到这里
    const self = this;
    // 收集目标
    this.target = null;
    // 存储收集器中需要通知的Watcher
    this.subs = [];
    // 当有目标时，绑定Dep与Wathcer的关系

    this.depend = function() {
        console.log(14)  //开始11   开始20 走了get获取属性后，就要进行依赖收集 
        if (Dep.target) {
            console.log(15)//开始12  
            // 这里其实可以直接写self.addSub(Dep.target)，
            // 没有这么写因为想还原源码的过程。
            Dep.target.addDep(self);
        }
    }
    // 为当前收集器添加Watcher
    this.addSub = function(watcher) {
        console.log(16)//开始14
        self.subs.push(watcher);
    }
    // 通知收集器中所的所有Wathcer，调用其update方法
    this.notify = function() {
        console.log(17) //开始16
        for (let i = 0; i < self.subs.length; i += 1) {
            self.subs[i].update();
        }
    }
}

const vue = new Vue({
    data() {
        return {
            text: 'hello world'
        };
    }
})

vue.mount(); // in get
vue._data.text = '123'; // in watcher update /n in get

```

**代码解析**
---

1. 一开始new Vue ，会走到46行执行Vue构造函数，打印6

2. 然后46行Vue的入参options实际上是127行的入参`{data(){}}`，是一个包含了`data`函数的对象，所以`options.data`是一个`data`函数，打印7。将vue中的`data`函数返回的数据赋值给`_data`。

3. 然后走到67行的`observe`，会继续往上走到41行定义它的地方。

4. 然后43行 `new Observer` 的时候会走到第一行`Observer(关键函数)`，打印1。发现`Observer`实际就是`给data数据都添加上get和set方法`，只不过添加的方法`defineReactive`给抽离出去了。

5. 然后走到第9行，执行`defineReactive`，打印2,然后15行给每个`属性`加上`get`和`set`方法。

6. 然后走到12行，`new Dep`的时候，会走到95行执行`Dep`，打印13。Dep函数剩下的代码都只是定义函数，都不会执行，会跳出Dep函数。然后会到`defineReactive`函数第13行，defineReactive剩下的代码中的函数也不会执行，所以会回到Observer，再回到67行，即`new Vue`的过程走完了。

7. 然后走到135行的vue.mount()，走到56行，打印8。

8. 然后执行new Watcher走到70行，打印10，然后**`「Dep.target = this」`**，这一步将watch`实例挂载`到了Dep的target属性上，从而关联起来。

9. 72行到88行只是定义，没有执行。89行this.value = fn()中：fn实际是传进来的 **`「render」`** 函数（看57行），然后后面又加了()就会立即执行。然后走到60行的render函数，打印9。`「Watcher就执行完了」`,然后，`「关键的来了」`：打印完9它会继续往下走，`「读取_data.text」`。那么，这一步就会触发get方法（这一步的目的就只是为了触发get，所以获取值就行了，并不需要做其他操作）。

10. 然后走到21行的get，打印3。

11. 然后走到25行，执行dep.depend()，再走到104行，打印14。

12. 这时候判断Dep.target，由于第8步将watch挂载到了Dep.target，这时候为true，所以打印15。

13. 然后走到110行，再跳到77行，打印11。

14. 79行执行后会跳到114行，打印16，完成了依赖收集，然后会回到Watch，执行最后一行，Dep.target = null，避免陷入死循环，然后Watch执行完了，**`「vue.mount()也执行完了」`**

15. 然后就是136行赋值操作了，这时候会走到28行的`set`，打印4。

16. 继续向下走，到36行，`dep.notify()`，然后走到119行，打印17。

17. 然后会走到122行，触发`update`，走到82行，打印12。

18. 然后执行fn()，即`render`函数，走到60行，打印9。

19. 然后走到63行，取`data`值，会走`get`，走到21，打印3。

20. 然后25行，会跳到104行，打印14。`Dep.target为null`，15不会打印