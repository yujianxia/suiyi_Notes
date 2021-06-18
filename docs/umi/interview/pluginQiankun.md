### @umijs/plugin-qiankun
---

**1. 启用方式**
---

1. `yarn add @umijs/plugin-qiankun -D`

2. 配置 `qiankun` 开启

#### 介绍

Umi 应用一键开启 `qiankun` 微前端模式

#### Examples

导航是主应用，App1/App2 是子应用，App1/App2 也支持单独打开。主应用可以嵌套 APP1 和 APP2，App1 也可以嵌套 App2

<a data-fancybox title="demo" href="https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*TroZSp_cH0MAAAAAAAAAAAAAARQnAQ">![demo](https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*TroZSp_cH0MAAAAAAAAAAAAAARQnAQ)</a>

```shell
$ yarn
$ yarn build
$ cd packages/plugin-qiankun && yarn start
```

**2. Features**
---

* ✔︎ 基于 qiankun

* ✔︎ 支持主应用和子应用都用 umi

* ✔︎ 支持通过 `<MicroApp />` 组件引入子应用

* ✔︎ 父子应用通讯

* ✔︎ 子应用运行时配置自定义 `bootstrap()`、`mount()` 和 `unmount()`

* ✔︎ 主应用、子应用联调

* ✔︎ 嵌套子应用

**3. Usage**
---

3.1. 主应用配置
---

3.1.1. 第一步：注册子应用
---

##### a. 插件构建期配置子应用

```javascript
export default {
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'app1', // 唯一 id
          entry: '//localhost:7001', // html entry
        },
        {
          name: 'app2', // 唯一 id
          entry: '//localhost:7002', // html entry
        },
      ],
    },
  },
};
```

##### b. 运行时动态配置子应用（src/app.ts 里开启）

```javascript
// 从接口中获取子应用配置，export 出的 qiankun 变量是一个 promise
export const qiankun = fetch('/config').then(({ apps }) => ({
  // 注册子应用信息
  apps,
  // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
  lifeCycles: {
    afterMount: props => {
      console.log(props);
    },
  },
  // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
}));
```

3.1.2 第二步：装载子应用
---

子应用的装载有两种方式，**二选一即可**：

##### a. 使用路由绑定的方式

> 建议使用这种方式来引入自带路由的子应用

假设的系统之前有这样的一些路由：

```javascript
export default {
    routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        {
          path: '/app1',
          component: './app1/index.js',
          routes: [
            {
              path: '/app1/user',
              component: './app1/user/index.js',
            },
          ],
        },
        {
          path: '/',
          component: './index.js',
        },
      ],
    },
  ],
}
```

现在想在 `/app1/project` 和 `/app2` 这两个路径时分别加载微应用 app1 和 app2，只需要增加这样一些配置即可：

```javascript
export default {
    routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        {
          path: '/app1',
          component: './app1/index.js',
          routes: [
            {
              path: '/app1/user',
              component: './app1/user/index.js',
            },
+            // 配置微应用 app1 关联的路由
+            {
+              path: '/app1/project',
+              microApp: 'app1',
+            },
          ],
        },
+       // 配置 app2 关联的路由
+       {
+         path: '/app2',
+         microApp: 'app2'
+       },
        {
          path: '/',
          component: './index.js',
        },
      ],
    },
  ],
}
```

微应用路由也可以配置在运行时，通过 src/app.ts 添加：

```javascript
export const qiankun = fetch('/config').then(({ apps }) => {
  return {
    apps,
    routes: [
      {
        path: '/app1',
        microApp: 'app1',
      }    
    ]
  }
});
```

运行时注册的路由会自动关联到配置的根路由下面，比如的路由是这样的：

```javascript
export default {
  routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        {
          path: '/test',
          component: './test.js',
        },
      ],
    },
  ]
}
```

完成了上面的运行时微应用路由配置后，的路由结构会合自动并成这样的：

```javascript
export default {
  routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
+       {
+         path: '/app1',
+         microApp: 'app1',
+       },
        {
          path: '/test',
          component: './test.js',
        },
      ],
    },
  ]
}
```

##### b. 使用 `<MicroApp />` 组件的方式

> 建议使用这种方式来引入不带路由的子应用。 否则请自行关注微应用依赖的路由跟当前浏览器 url 是否能正确匹配上，否则很容易出现微应用加载了，但是页面没有渲染出来的情况。

可以直接使用 React 标签的方式加载已注册过的子应用：

```javascript
import { MicroApp } from 'umi';

export function MyPage() {
  
  return (
    <div>
      <div>
+        <MicroApp name="app1" />
      </div>
    </div>
  )
}
```

##### loading 动画与组件样式

可以通过配置 `autoSetLoading` 的方式，开启微应用的 `loading` 动画

```javascript
import { MicroApp } from 'umi';

export function MyPage() {
  
  return (
    <div>
      <div>
         <MicroApp name="app1" autoSetLoading />
      </div>
    </div>
  )
}
```

如果需要定制自己的 loading 动画，或者修改组件的样式，可以这样处理：

```javascript
import { MicroApp } from 'umi';

export function MyPage() {
  
  return (
    <div>
      <MicroApp
        name="app1"
        autoSetLoading
        // 设置自定义 loading 动画
        loader={loading => <div>loading: {loading}</div>}
        // 微应用容器 class
        className="myContainer"
        // wrapper class，仅开启 loading 动画时生效
        wrapperClassName="myWrapper"
      />
    </div>
  )
}
```

路由模式下，可以这样设置一些静态配置开启 loading 动画：

```javascript
{
  path: '/user',
  microApp: 'user',
  microAppProps: {
    autoSetLoading: true,
    className: 'myContainer',
    wrapperClassName: 'myWrapper',
  }
}
```

或者，可以通过设置 autoSetLoading false 来关闭自动的 loading 动画：

```javascript
import { MicroApp } from 'umi';

export function MyPage() {
  
  return (
    <div>
      <div>
         <MicroApp 
           name="app1"
           // 关闭 loading 动画
           autoSetLoading={false}
         />
      </div>
    </div>
  )
}
```

3.2. 子应用配置
---

3.2.1. 第一步：插件注册（config.js）
---

```javascript
export default {
  qiankun: {
    slave: {}
  }
}
```

3.2.1. 第二步：配置运行时生命周期钩子（可选）
---

插件会自动为创建好 qiankun 子应用需要的生命周期钩子，但是如果想在生命周期期间加一些自定义逻辑，可以在子应用的 `src/app.ts` 里导出 `qiankun` 对象，并实现每一个生命周期钩子，其中钩子函数的入参 `props` 由主应用自动注入

```javascript
export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('app1 bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props) {
    console.log('app1 mount', props);
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('app1 unmount', props);
  },
};
```

##### 环境变量配置

为了获得更好地本地开发及调试体验，建议您提前在子应用中指定应用启动的具体端口号，如通过.env指定

```javascript
PORT=8081
```

3.3. 父子应用通讯
---

3.3.1. 配合 `useModel` 使用（推荐）

> 需确保已安装 `@umijs/plugin-model` 或 `@umijs/preset-react`

1. 主应用使用下面任一方式透传数据：

    1. 如果用的 MicroApp 组件模式消费微应用，那么数据传递的方式就跟普通的 react 组件通信是一样的，直接通过 props 传递即可：

    ```javascript
    function MyPage() {
        const [name, setName] = useState(null);
        return <MicroApp name={name} onNameChange={newName => setName(newName)} />
    }
    ```

    2. 如果用的 `路由绑定式` 消费微应用，那么需要在 `src/app.ts` 里导出一个 `useQiankunStateForSlave` 函数，函数的返回值将作为 `props` 传递给微应用，如：

    ```javascript
    // src/app.ts
    export function useQiankunStateForSlave() {
        const [masterState, setMasterState] = useState({});
        
        return {
            masterState,
            setMasterState,
        }
    }
    ```
2. 微应用中会自动生成一个全局 model，可以在任意组件中获取主应用透传的 props 的值

```javascript
import { useModel } from 'umi';

function MyPage() {
  const masterProps = useModel('@@qiankunStateFromMaster');
  return <div>{ JSON.strigify(masterProps) }</div>;
}
```

或者可以通过高阶组件 connectMaster 来获取主应用透传的 props

```javascript
import { connectMaster } from 'umi';

function MyPage(props) {
  return <div>{ JSON.strigify(props) }</div>;
}

export default connectMaster(MyPage);
```

3. 和 `<MicroApp />` 的方式一同使用时，会额外向子应用传递一个 setLoading 的属性，在子应用中合适的时机执行 `masterProps.setLoading(false)`，可以标记微模块的整体 loading 为完成状态

3.3.2. 基于 `props` 传递
---

类似 react 中组件间通信的方案

1. 主应用中配置 apps 时以 props 将数据传递下去（参考主应用运行时配置一节）

```javascript
// src/app.js

export const qiankun = fetch('/config').then(config => {
  return {
    apps: [
      {
        name: 'app1',
        entry: '//localhost:2222',
        props: {
          onClick: event => console.log(event),
          name: 'xx',
          age: 1,
        },
      },
    ],
  };
});
```

2. 子应用在生命周期钩子中获取 props 消费数据（参考子应用运行时配置一节）

3.4. 嵌套子应用
---

除了导航应用之外，App1 与 App2 均依赖浏览器 url，为了让 App1 嵌套 App2，两个应用同时存在，需要在运行时将 App2 的路由改为 memory 类型。

3.4.1. 在 App1 中加入 master 配置

```javascript
export default {
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'app2', // 唯一 id
          entry: '//localhost:7002', // html entry
        },
      ],
    },
  },
};
```

3.4.2. 通过 `<MicroAppWithMemoHistory />` 引入 App2

```javascript
import { MicroAppWithMemoHistory } from 'umi';

export function MyPage() {
  
  return (
    <div>
      <div>
+        <MicroAppWithMemoHistory name="app2" url="/user" />
      </div>
    </div>
  )
}
```

**4. API**
---

4.1. MasterOptions
---

| 配置 | 说明 | 类型 | 是否必填	| 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| apps | 子应用配置 | App[] | 是 | - |
| routes | 子应用运行时需要注册的微应用路由	| Route[] | 否 | N/A |
| sandbox | 是否启用沙箱 | boolean | 否	| false |
| prefetch | 是否启用 prefetch 特性 | boolean & 'all'	| 否 | true |

4.2. App
---

| 配置 | 说明 | 类型 | 是否必填	| 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| name | 子应用唯一 id | string | 是 | |
| entry | 子应用 html 地址 | string & { script: string[], styles: [] } | 是 | |
| props | 主应用传递给子应用的数据 | object | 否 | {} |

4.2. Route
---

| 配置 | 说明 | 类型 | 是否必填	| 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| path | 路由 path | string | 是 | |
| microApp | 关联的微应用名称	| string | 是 | |
| microAppProps | 微应用配置 | {autoSetLoading: boolean, className: string, wrapperClassName: string} | 否 | {} |

**5. 升级指南**
---

> v2.3.0 完全兼容 v2 之前的版本

5.1. 移除无必要的应用配置
---

```javascript
export default {
  qiankun: {
    master: {
      apps: [
        {
          name: 'microApp',
          entry: '//umi.dev.cnd/entry.html',
-         base: '/microApp',
-         mountElementId: 'root-subapp',
-         history: 'browser',
        }
      ]
    }
  }
}
```

5.2. 移除无必要的全局配置
---

```javascript
export default {
  qiankun: {
    master: {
      apps: [],
-     defer: true,
    }
  }
}
```

5.3. 移除不必要的挂载容器
---

```javascript
-export default MyContainer() {
-  return (
-    <div>
-      <div id="root-subapp"></div>
-    </div>
-  )
-}
```

5.4. 关联微应用

> 之前配置了微应用名为 `microApp` 的 base 为 `/microApp` ，mountElementId 为 `subapp-container`， 那么只需要（二选一）：

  a. 增加 `/microApp` 的路由

  ```javascript
  export default {
    routes: [
      ...,
      { path: '/microApp', microApp: 'microApp' }
    ]
  }
  ```

**使用路由关联模式时，不再需要微应用的 base 配置必须跟主应用中的保持一致了**

  b. 在 `/microApp` 路由对应的组件里使用 `MicroApp`

  ```javascript
  export default {
    routes: [
      ...,
      { path: '/microApp', component: 'MyPage' }
    ]
  }
  ```

5.5. 与 @umijs/plugin-qiankun 2.3.0 之前版本的变化
---

* 主应用注册子应用时不再需要手动配置 `base` 和 `mountElementId`。

> 这类方式会导致很多关联问题，最典型的是如果需要将子应用挂载到某一个具体的子路由下时，常出现由于挂载点还未初始化或已被销毁导致的问题

> 现在只需要在注册完子应用后，在期望的路由下指定需要挂载的子应用的 name 即可

* 可以直接通过 `<MicroApp />` 组件的方式在任意位置挂载自己的子应用

* 不再支持主应用是 `browser` 路由模式，子应用是 `hash` 路由的混合模式。如果有场景需要可以通过自己使用 `<MicroApp />`组件加载子应用

* 移除了 `base`、`mountElementId`、`defer` 等配置，现在有更好的方式来解决这类问题，参见第一条

* rename `jsSandbox` -> `sandbox`，来自 qiankun2.0 的升级

* 完全兼容 1.x 插件

5.6. Roadmap
---

* 动态 history type 支持（即将到来 🎉），依赖 umi: ^3.2.7, @umijs/plugin-qiankun: ^2.4.0

> 通过运行时设置微应用 props 的方式，修改微应用 history 相关配置，从而解耦微应用配置，如：

```javascript
// HistoryOptions 配置见 https://github.com/ReactTraining/history/blob/master/docs/api-reference.md
type HistoryProp = { type: 'browser' | 'memory' | 'hash' } & HistoryOptions;

<MicroApp history={{ type: 'browser', basename: '/microApp' }} />
```

* 运行时统一，针对多层嵌套微应用场景

* 微应用自动 `mountElementId`，避免多个 `umi` 子应用 `mountElementId` 冲突

* 自动 `loading`

* 本地集成开发支持