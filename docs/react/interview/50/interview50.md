# 引入
在组内做了一次 React 状态管理的分享，总结了一些 redux 的问题，安利了一下 mobx 更方便的地方。整理成文字，便是此文。注：本文未整理完，大部分都是列的大纲，预计周二前整理完。ps: 应该整理不完

# 目录
* React 状态、通信
* Flux —Redux —Mobx
* redux，mobx 对比

# React 为什么需要状态管理
不妨先回忆一下 react 的特点。

## React 特点
* 专注 view 层

React 官网是这么简介的。JavaScript library for building user interfaces.专注 view 层 的特点决定了它不是一个全能框架，相比 angular 这种全能框架，React 功能较简单，单一。比如说没有前端路由，没有状态管理，没有一站式开发文档等。

* f(state) = view

react 组件是根据 state （或者 props）去渲染页面的，类似于一个函数，输入 state，输出 view。不过这不是完整意义上的 MDV（Model Driven View），没有完备的 model 层。顺便提一句，感觉现在的组件化和 MDV 在前端开发中正火热，大势所趋...

* state 自上而下流向、Props 只读

从最开始写 React 开始，就了解这条特点了。state 流向是自组件从外到内，从上到下的，而且传递下来的 props 是只读的，如果你想更改 props，只能上层组件传下一个包装好的 setState 方法。不像 angular 有 ng-model, vue 有 v-model， 提供了双向绑定的指令。React 中的约定就是这样，你可能觉得这很繁琐，不过 state 的流向却更清晰了，单向数据流在大型 spa 总是要讨好一些的。

这些特点决定了，React 本身是没有提供强大的状态管理功能的，那 React 组件是如何通信呢？原生大概是三种方式。

## React 组件通信
之前有总结过 [React 的通信问题](https://github.com/sunyongjian/blog/issues/27)，再次简单提一下，并说明它们存在的问题。其实大概就是两种方式，其一是状态提升，即把需要通信的 state 提升到两者共同的父组件，实现共享和 Reaction。不过状态提升又分为 Continer 组件定义和使用 Context 属性传递，这两者虽然都算是状态提升，但是实际不太一样，所以会分为三种方式。
<img alt="tx1" width="394" src="https://user-images.githubusercontent.com/18378034/34917562-2c68a1fe-f983-11e7-88d0-b92ddceb3676.png">

如图。A,B 组件下的 A1,B1 要实现 state 通信。

* Continer

<img alt="tx3" width="376" src="https://user-images.githubusercontent.com/18378034/34917565-3524b238-f983-11e7-905d-e6e6fd1af879.png">

在 A,B 之上增加一个 Container 组件，并把 A1，B1 需要共享的状态提升，定义到 Container，通过 props 传递 state 以及 changeState 的方法。
此方式存在的一个问题是，以后如果有一个 C 组件的 state，与 A 要做通信，就会再添加一个 Container 组件，如果是 A 的 state 要跟 C 共享，更是毁灭性打击，之前提升到 Container 的 state，还要再提升一层。这种无休止的状态提升问题，后期的通信成本非常高，几乎是重写。

* Context
  <a data-fancybox title="image" href="https://user-images.githubusercontent.com/18378034/34917764-630fb04c-f985-11e7-9b4c-31af22e36618.png">![image](https://user-images.githubusercontent.com/18378034/34917764-630fb04c-f985-11e7-9b4c-31af22e36618.png)</a>

乍一看，Context 像是一个好的方案，它解决了无限状态提升的问题，都统一放到定义 Context 的组件就好了。不过 React 官网倒是不建议用它 [Why Not To Use Context](https://reactjs.org/docs/context.html#why-not-to-use-context)，理由是它一个实验性的特性，未来可能移除。不过个人觉得已经不太可能移除了，因为基本 React 的 Provider 组件都是基于此做的。

下面是 Context 定义的一段代码：
<a data-fancybox title="image" href="https://user-images.githubusercontent.com/18378034/34917765-678b1b70-f985-11e7-8e44-92c5f1ae1162.png">![image](https://user-images.githubusercontent.com/18378034/34917765-678b1b70-f985-11e7-8e44-92c5f1ae1162.png)</a>

真正不要使用 Context 的原因是，它在状态更新通知组件方面存在缺陷。Context 的机制是这样的，假如 context 中定义存在变化的值，比如上图的 value，Context 组件会重新渲染(执行 SCU，willReceivedProps)，重新生成 context 对象。此举会使得 Context 下面的所有组件都重新 render，才可以接收到最新的 context 对象。

假如某一层，比如组件 A，没有 re-render，设置了 `shouldComponentUpdate = false`，或者是一个 pureComponent，都会阻碍 context 对象的传递，相当于在流向中加了一堵墙。

而解决这个问题的办法，就是使用发布订阅去改造。context 对象不再发生改变，而且子组件只第一次构建的时候接收 context 对象，这意味着 context 对象要内部实现订阅和发布的功能，即组件使用的时候订阅，对象属性变化的时候通知组件 render。关于此详细内容可以到[如何安全的使用 Context](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)查看（需要全局翻墙）

* 发布订阅

<img alt="listx" width="381" src="https://user-images.githubusercontent.com/18378034/34917569-417a2da6-f983-11e7-87a3-62d3d0f8747f.png">

这个没什么好说的，就是一个组件订阅，一个组件发布，了解观察者模式的都清除，[这里](https://github.com/sunyongjian/blog/issues/27) 也有详细的代码。想指出的是这种方式虽然解决了状态提升带来的问题，但是 state 保存在各个组件中，如果要做通信，需要写很多订阅/发布的代码，而且这部分代码也不好封装。最重要的是，数据流变得很乱，互相之间都有依赖，让代码维护起来比较困难。

其实在这里就会想到，假如说让 Event 中心统一管理状态，统一分发呢，然后每个组件只需要接收，订阅的工作交给 hoc 去处理，只需要告诉 hoc 要什么 state，它遍从 Event 中心去取。当 state 发生改变，Event 中心 pub 事件，hoc 去处理 re-render 的工作，感觉这就是目前状态管理 library 都在做的，大同小异。

### 问题
所以随着 spa 的增大，这些方式都会有一些问题，状态无休止提升，context 不好用，发布订阅数据流向混乱，跟组件的耦合性较高，数据流不清晰，
大型 spa 组件通信成本太高。
<img alt="statetx" width="385" src="https://user-images.githubusercontent.com/18378034/34917598-8922ea26-f983-11e7-9318-b2c277a6c7b6.png">

所有希望有一个独立管理的地方，像这样：
<img alt="storetx" width="351" src="https://user-images.githubusercontent.com/18378034/34917603-9d321a96-f983-11e7-8fea-e4764fef1010.png">

它可能会有一个 store 的概念，store 去存储数据和状态，还需要可以被订阅，即 store 中的状态发生变化要做到及时的通知。再进一步就是可以跟组件的交互，通信都交给 store 来处理。
还可以区分变化和副作用，做不同的处理。

目前社区中熟知的状态管理库就那几个，接下来按照这几个库的发布顺序介绍一下。

# Flux
Flux 是随着 React 的诞生，而提出的一种状态管理的解决方案。由于 MVC 模式在大型前端应用里变得流向复杂，以及 Model 和 View 的双向绑定问题。便提出了这样的结构：
<a data-fancybox title="flux" href="https://user-images.githubusercontent.com/18378034/34917580-58d83204-f983-11e7-804f-4b88caaf1e28.jpg">![flux](https://user-images.githubusercontent.com/18378034/34917580-58d83204-f983-11e7-804f-4b88caaf1e28.jpg)</a>

从 flux 开始，就是严格的数据流向，只能通过 actions 改变 store，actions 是借助 Dipatcher.dispatch
这样的 API 发出，然后再修改 store，由 store 去更新 view。

几个主要的概念：

* Dispatcher，处理动作的分发，修改 Store 上的数据。register，dispatch
* Store，负责存储数据和处理数据相关的逻辑.addChangeListener
* Action，驱动 Dipatcher 的 JS 对象
* VIew，视图部分，展示数据,react 组件的分层组合

flux 在 store 驱动组件这一层，没有做很好的支持，如果要做需要频繁的绑定事件。另外 action 也没有很好的异步方案。这些工作都需要用户自己去摸索处理。所以在 redux 去处理好这些问题，并且提出了更好的思想的时候，flux 很快就被替代了。不过 flux 为 redux 做了很好的借鉴，流程，action 对象，单向数据流。

# Redux
<a data-fancybox title="redux" href="https://user-images.githubusercontent.com/18378034/34917582-5c04bb28-f983-11e7-8fba-aa0f9b3b65dc.jpg">![redux](https://user-images.githubusercontent.com/18378034/34917582-5c04bb28-f983-11e7-8fba-aa0f9b3b65dc.jpg)</a>

如果说 flux 是一种思想的话，redux 就是对 flux 最好的实现。redux 把 flux 的多个 store 概念干掉了，只有一个 store，并且内部由 reducer 计算生成新的 state tree。把 dispatcher 跟 action 解耦，action 就是一个简单的 actionCreator。redux 也基于 koa 的中间件思想，丰富了自己的拓展性。

几个主要的概念：

* 一个 store，管理 state，并有 dispatch(action) ，subscribe 等方法。
* Reducers. Old =new state。纯函数，用于计算新的 state。
* 多了 Provider，store 的订阅者，通过它来与 react 等框架交互，比如 react-redux 中的 Provider。
* Actions。由 provider 创建并由用户事件触发。

如果你是 flux 的使用者，redux 出现的时候，你基本很容易接受这个思想，除了一些函数式的思维。内容方面在这不过多阐述了，这不是本次的主题，面向的也是使用过的同学。

## Redux 生命周期
* Store.dispatch(action)
* Reducer  执行
* 生成 state tree
* Store.subscribe(listener)

不过在源码里，都是在 createStore 初始化的时候，dispatch 方法里实现的。Redux 的 store，跟上面在“发布订阅”设想的一种思想就很契合了，store 不仅作为一个 state 的存储中心，还是事件中心。所有的订阅以及事件的分发，都在 store 里面处理了。而具体如何展示、计算数据（state），是用户传入的 reducer 决定的。关于 store 和 component 的结合，通过 react-redux 中的两个组件，就可以很好的解决了，connect 也的确是 hoc，你只需要告诉它你用什么属性，它就帮你自动处理 reaction 的 re-render。

## 特点
总结了几个：

* CQRS
  命令与查询职责分离，说实话这个概念跟 redux 有关是在知乎的某个问答看到的。当把 redux 的 store 看做一个 model 的时候，之前对 model 的查询、命令（增删改）对应的就像 redux 里 的 reducer、action 。不讨论这两者到底有何内在的联系，编程的思想本来就是相同的。如果你有兴趣，你也可以了解一下 Event Sourcing 和 DDD，都会找到跟 redux 相似的影子。[推荐](https://zhuanlan.zhihu.com/p/25383827)
* 单向数据流
  从 flux 开始提出，也是目前状态管理比较喜欢采用的，因为简单清晰的数据流向。
* 很多函数式的思想。比如 Reducer，Immutable Data，Pure Func，Redux 内部实现， compose 等。
* 通过 state 的引用变化，判断是否更新组件。
  既然 state 的不可变数据，基于此理论基础，使用最简单的比较数据引用，去判断是不是要更新 view。
* 天生支持时间回溯
  因为每次的 state 都是新的引用，上一次的 state 还可以保存，感觉上是有了基础，实际要做很多工作。可以借鉴 redux-devtools 。
* 中间件拓展
  redux 最强大的地方便在于中间件的拓展。有一句话叫“好的设计不如好的拓展性”。

## 一些问题
这是要提及的重点。在学习和使用 redux 的时候，遇到了很多的问题，总结来就是以下四点，相信大家也会碰到...

约定多、理解难

胶水代码

Effects

手动优化

## 约定
对于初学者来说，一堆的约定看着就头大，也不知道为啥这么写。大概列举几个：

* 三大原则，store 唯一，state 只读， reducer 纯函数。
  这个是学习 redux 初期就烂熟于心的概念了，几乎所有 redux 相关的入门教程，都会有这样的介绍，总之，就算不明白，也记住了。首先，store 设计成唯一的对象，一个对象能带来很多它简单的特点，比如所有的 reducer 计算都合并到这个 store，所有的组件修改，注入都是基于这一个对象；初始化同构应用的状态（服务端渲染）也更方便，服务端直接挂载一个 ` __ initalStore__` 就可以了。state 只读有函数式的感觉，另外也是单向数据流的关键，你不能直接修改 state 对象，只可以通过 action 去修改，这个跟 flux 是相似的思想。reducer 是纯函数，也来自于 FP。不能有副作用的操作，通常是 state 的一些重组，拷贝和计算。使用 redux，会有很多函数式的思想，所以很多人都会学一波函数式，比如说... [FP-Code](https://github.com/sunyongjian/FP-Code/tree/master/src)
* 建议用单独的文件存放 action；不要定义 action 对象，要用 actionCreator 创建。
  <img alt="dispatch" width="570" src="https://user-images.githubusercontent.com/18378034/35388243-ed9695ba-020d-11e8-8ff7-0a36df466aa2.png">
  为了不让子组件感受到 redux 的存在，通过 bindActionCreators 生成这种 ` () =dispatch(actionCreator);` 形式的 function。 如上图，最后可能就是 increase 这样的一个函数，然后组件内部去调用此方法，比如用 connect 这样的组件注入 actions 方法。最开始写 redux 的时候，见过很多人在组件内部调用 dispatch 方法的，因为 connect 的第二个参数 `MapDispatchToProps` 不传的时候，它会默认把 dispatch 方法传下来。然后就直接在组件内部写 `dispatch({ type: ’INCREASE‘})` 这样的代码，这跟使用 bindActionCreator 的就形成了不同的风格。另外，大项目中是不建议组件直接用 dispatch 方法的，redux 建议的是 smart + dumb，即有一个 container 组件跟 redux 做交易，下面的组件要做成可复用的，跟 redux 无强耦合的组件... 所以，理解的  actionCreator 的作用大概是这样。
* reducer 强调纯函数，计算。返回新的 state。
  返回新的 state（redux 中的 state 概念理解为 reducer 返回的计算结果），意味着不可变数据，不可变数据操作就设计到一个拷贝的问题。深浅拷贝的方法，深拷贝的性能问题，节约内存等。可能会引入 immutable 这样的库，又增加了代码复杂度，侵入性较强，而且不是 plainObject，存在转换问题，可能会引入 [redux-immutable](https://github.com/indexiatech/redux-immutablejs) 中的 combineReducers 去处理，内部做转换。。。总之解决的方案总是有，只是有一定的成本。redux 社区才人还是很多的。
* state 设计的尽量扁平，最多两三层。
  嵌套太多层的话，取值的时候比较麻烦，也需要有容错处理（当然来一个 lodash 就好了）。这只是某个 state 的层级设计问题。还有对整个 store 的设计，比如根据模块划分，共享的状态和私有的区分。谈到这，又引申出什么样的状态该放到 redux 中，大多数情况下，用 redux 很好的处理了复杂的异步逻辑问题，所以复杂的 Effect 推荐放到 redux。另外就是一些需要共享的，比如 userInfo，AppState，特殊的界面状态。

这里总结了一些使用 redux 的时候，官网和社区推荐的一些规范或者约定。如果遵守约定还好，如果风格不一的话，其实这些约定就失去了原本的意义了。其实更想表达的是，对于新手来说，学习成本真的挺高的。然后就是 Effects 的一些问题。

## Effects
这里的 Effects 主要指异步请求。最开始的方式是引入 redux-thunk，redux-promise 这样的中间件，去改造 store 的原生 dispatch 方法（compose 形成的函数调用链），使得它的参数不再局限于一个 action 对象，而是可以接收 function 或者 promise 对象，通过这一层把 Effect 影响去除，变成原来的 dispatch 一个 action 对象（代码层面就是经过函数调用链，最后执行原来的 dispatch 方法）。如下图：

<img alt="thunk1" width="683" src="https://user-images.githubusercontent.com/18378034/35396242-4bd19a12-0227-11e8-94e0-9420cc9f2b6e.png">

引入 thunk 后的数据流向大概是这样的。组件内部通过事件或者生命周期，去调用 hoc 注入进来的 actions 方法，通常是通过 actionCreator 创建的。由于中间件的机制，可以在 actionCreator 中 return 一个新的 function，自然而然的，异步代码和一些逻辑就写在了这里，也就是图中黄色标记的。比如 request 一个请求，当 response 的时候，再执行 dispatch 方法，把返回的 data 传递到 reducer。reducer 通过计算、拷贝，合并生成新的 state tree，然后会执行 listeners，无论你是通过 connect 还是订阅的方式，总之你的组件会 re-render 了，接收新的 state。大概的流程大家都很清楚了应该，问题在于实际业务中，actionCreator 这里会有很多逻辑代码，开始可能把最基本的 fetch，loading，error 的 catch 这样的东西通过 function 封装，去解决最通用的场景。不过涉及到复杂的业务，就会在 then 中出现很多的业务逻辑代码，比如有时候需要轮询的机制，有时候需要 dispatch 多个 action，处理起来不那么顺手，而且actionCreator 中的代码越来越多，不再是一个简单的 function，action 不再纯净，违背了它的原意。所以 saga 出现了。
<img alt="saga1" width="662" src="https://user-images.githubusercontent.com/18378034/35396246-4e606826-0227-11e8-8bb8-d606d3e203d7.png">

saga 全局下跑着 generator，需要 watch 的 actionType，通常是 async 的，用 takeEvery 或者 takeLatest 这样的方法做监听，如 `yield* takeEvery('FETCH_REQUESTED', fetchData)`，当 type 匹配到 `FETCH_REQUESTED`，就会进入 saga，执行 fetchData（saga 中每个异步任务被定义为 Effect），不匹配的就仍然走到 reducer。跟 thunk 不同的是异步代码写到了 saga 中，也是图中标黄的。整个流程看起来更清晰，每一部分的职责单一， actionCreator 和 Effect、业务逻辑也解耦了。多人开发的大型项目中，这样的代码组织的确是可读性更高，如果你对整个数据流比较清晰，便可以很快定位到代码。当然 saga 的优势不止这一点，它还封装了一些复杂的业务场景。比如某个异步任务调用多次的时候，saga 可以 takeLatest，也就是只保留最新的任务，而 thunk 是比较难处理的，之前的任务不容易取消。另外 saga 也提供了 cancel 的 API 可以取消 task。它还封装了一些 `promise.all, promise race` 的功能，也默认支持堵塞和非堵塞的调用。总之，异步处理的很多常见它都帮想到了，好好看看文档，你便可以很容易并且很优雅的写出相关代码。

不过 saga 也有一些问题。比如错误的 catch，基本需要每个 task 要加一个 try catch，不然最后 saga 抛出的错，你根本不知道是哪里出了问题，调试不尽人意，babel 的 source-map 有时也会定位失误。还有一个问题便是，redux 本来定义的文件就够多了，又出现了一个 saga，感觉像是把 actionCreator 里的异步代码换了个地方而已。另外，最开始的重复的代码也很多，重复的监听 saga 任务，call Effect，put action，便又需要封装一个通用的 fetchSaga 的方法，去处理常见的异步任务。引入 saga 的好处是优雅的处理的异步 action，提供的 API 也很强大。但是引入一方面是学习成本，一方面又是封装的时间成本，这都是项目选型需要考虑的。如果你的项目有大量的读取操作，轮询的状态，比较麻烦的异步任务，那引入 saga 带来的效果是比较明显的。反之，则是增加了开发和维护成本，还是要注意场景。对 saga 的研究也没有特别深入，不再过多赘述了，网上也有很多的文章，推荐几个：
[1.redux-saga 实践总结](https://zhuanlan.zhihu.com/p/23012870)， 2.

## 胶水代码
redux 的胶水代码也是开发时比较痛苦的地方。

* actions、reducers、actionTypes 都要定义
  在使用 redux 的项目中，当你要共享状态或者处理异步的时候，假如说放到 redux 中，就不得不定义一堆类似的文件。有的人觉得这是比较好的约束和规范，而有的人就觉得这种形式比较繁琐，这个问题就仁者见仁智者见智了。
* saga 里面的各种 yield  =封装

关于这一部分，社区也有很多方案，比较成熟的 dva， 封装的已经很好了，把 actions、reducers、actionTypes 以 model 的概念封装，尽管 redux 本来 model 的概念很弱。saga 的也封装到了 effects 中。

## 手动优化
跟大部分技术栈一样，redux 也需要手动调优，下面是总结的几个：

* mapStateToProps 采用 [Reselect](https://github.com/reactjs/reselect) 做缓存
  当你采用 connect 去给组件注入 state 的时候，需要 mapStateToProps 函数去指定你需要的 state。而这里有个问题，就是可能你这个组件只使用了某个 state，但是其他无关的 action 触发的时候，mapState 函数都会重新执行计算。在这里就踩过坑，比如的 mapState 是这样的：

```js
const mapStateToProps = (state) =({ data: state.data.toJS()  })
```

在 reducer 中把 data 通过 immutablejs 处理了，组件中使用的时候需要 toJS 转换成原生对象，而每次执行返回的都是新对象。所以每次包装后的组件做 shadowEqual 的时候，都认为 state 发生变化了，导致无关的 action 也会引发该组件的 re-render。这是由 connect 的机制决定的，hoc 内部调用 store 的 subscribe 函数，注册一个事件，当 dispatch 一个 action，所有 reducer 执行后，会 pub 这个事件，此事件就会对比两次 state 的引用是否变化，决定组件是否更新 state 以及 render。所以这里每次返回的某个 state 如果都是新引用，是有问题，并且 mapStateToProps 函数也不应该存放大量的计算代码。

reselect 就是用来解决上述重复计算的问题的，其实 reselect 可以理解为一个缓存函数，当你做过一次计算或者处理，该结果被缓存到哈希表（就是一个对象）中，下次遇到同样的输入，直接从缓存中调取，就不用重新计算了，也就不会有坑，效率也好一些。一个缓存函数类似于这样：

```js
const memoize = (f) ={
  const cache = {};
  return (str) ={
    if (!cache[str]) {
      cache[str] = f(str);
    }
    return cache[str];
  };
};

const capitalized = (str) =str.slice(0, 1).toUpperCase() + str.slice(1, str.length)

const memoCap = memoize(capitalized);
```

利用函数式的高阶函数和 js 的闭包就可以实现最基本的缓存函数，简单来说，reselect 就是这样的原理。当你 f 的结果需要的计算越多，执行的代码越多，缓存的意义就越大。

* 有时候需要 SCU 填 state 设计不合理的坑
  React 组件本身就拥有 shouldUpdate 的能力，比如组件 state 的引用是否变化。另外，React 也提供了 shouldComponentUpdate 这样的函数，让你可以自己控制 update 的细度。
  ------------------------------------------分割线------------------------------------------------
* pureComponent   shallowEqual
* [ ]  scu 的简化版，手动作浅层比较。
* state 的层次设计，拷贝、设值问题
* [ ]  对后端数据拆分

then，dva 去封装的思想或许是更好的选择。try mobx...

<img alt="mobx1" width="626" src="https://user-images.githubusercontent.com/18378034/34917637-563952c0-f984-11e7-8c5a-f5bfc18497b2.png">

# mobx
* [ ]  非常适合数据驱动的应用。

redux 还是遵循的 setState 一套流程，mobx 推出的时候，一个主张就是干掉 setState 的机制。

<a data-fancybox title="image" href="https://user-images.githubusercontent.com/18378034/34917660-6fb4fe8e-f984-11e7-90e3-d5d57d006b70.png">![image](https://user-images.githubusercontent.com/18378034/34917660-6fb4fe8e-f984-11e7-90e3-d5d57d006b70.png)</a>

## API
* [ ]  只有五个。
  Observable
  Computed
  Autonrun
  Action
  Observer

## 数据流
<a data-fancybox title="image" href="https://user-images.githubusercontent.com/18378034/34917669-86bd3f24-f984-11e7-9e4a-d4815726752b.png">![image](https://user-images.githubusercontent.com/18378034/34917669-86bd3f24-f984-11e7-9e4a-d4815726752b.png)</a>

## 依赖收集
* [ ]  mobx 核心点。

## 生命周期
* [ ]  只有一个 componentWillReact，当然也会有 didupdate didmount unmount。

## 优点
* [ ]  数据订阅颗粒度高，不用刻意维护性能
  oop 好上手，少些代码

## 思考🤔
* 什么时候用单例
* 什么时候用 class
* 什么时候注入到
* toJS
* observer 用的越多，效率越高，但是会强依赖 mobx

## Mobx 拓展
* https://egghead.io/lessons/javascript-sync-the-ui-with-the-app-state-using-mobx-observable-and-observer-in-react 教程
* https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e
* spy vs logger
* 时间回溯 https://github.com/mobxjs/mobx-state-tree
* 如何实现的依赖收集，React 生命周期禁用

# Mobx，Redux 比较
## 社区
<a data-fancybox title="image" href="https://user-images.githubusercontent.com/18378034/34917681-bf8dba22-f984-11e7-9d1f-713563827c24.png">![image](https://user-images.githubusercontent.com/18378034/34917681-bf8dba22-f984-11e7-9d1f-713563827c24.png)</a>

使用度关注度，redux 更多，社区 redux 也是完胜。

## 简单对比
* fp vs oop
* Elm vs 依赖收集 + 响应式
* 单一数据源 vs 多个 store
* Readonly vs read & write
* Plain objects vs observable data
* smart + dumb vs smart

## 总结
* mobx api 简单，样板代码少
* redux 需要注意的挺多，mobx 需要对依赖收集理解
* Redux 规范 state，mobx 不担心嵌套
* 性能方面。调优过的 redux 项目基本跟 mobx 打平。
* Effect。saga 封装的业务场景，mobx 没有中间件，不容易拓展。
* 社区。redux 完胜
  选哪个呢？

# 最后
虽然通过一些 redux 的问题，去引出 mobx，但是并不意味着 redux 就是不好的。首先每个技术栈都是根据场景，团队需要去选择的。另外，手动调优的工作不仅仅是 view 层的应用中，而是整个前端的链路都是需要的，也没有完美的、一劳永逸的方案，只有自己不断的学习和优化，才能更快的进步。

# 拓展
https://www.youtube.com/watch?v=xsSnOQynTHs redux 自此开始火

https://zhuanlan.zhihu.com/p/25989654 conf MobX vs Redux

[xufei/blog#47](https://github.com/xufei/blog/issues/47) 单页数据流方案探索，rxjs

#21 redux 中间件

https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076
