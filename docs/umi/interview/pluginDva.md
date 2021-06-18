### @umijs/plugin-dva
---

整合 dva 数据流

#### 启用方式

配置开启

**1. 介绍**
---

* **内置 dva**，默认版本是 `^2.6.0-beta.20`，如果项目中有依赖，会优先使用项目中依赖的版本。

* **约定式的 model 组织方式**，不用手动注册 model

* **文件名即 namespace**，model 内如果没有声明 namespace，会以文件名作为 namespace

* **内置 dva-loading**，直接 connect loading 字段使用即可

* **支持 immer**，通过配置 `immer` 开启

#### 约定式的 model 组织方式

符合以下规则的文件会被认为是 model 文件

* `src/models` 下的文件

* `src/pages` 下，子目录中 models 目录下的文件

* `src/pages` 下，所有 model.ts 文件

比如：

```file
+ src
  + models/a.ts
  + pages
    + foo/models/b.ts
    + bar/model.ts
```

其中 `a.ts`，`b.ts` 和 `model.ts` 如果其内容是有效 dva model 写法，则会被认为是 model 文件

#### dva model 校验

默认，上一小节的找到的文件，会做一次校验，校验通过后，才会被添加到最终到 dva model 列表

```javascript
// 通过
export default { namespace: 'foo' };
export default { reducers: 'foo' };

// 通过
const model = { namespace: 'foo' };
export default model;

// 通过，支持 dva-model-extend
import dvaModelExtend from 'dva-model-extend';
export default dvaModelExtend(baseModel, {
  namespace: 'foo',
});

// 通过
export default <Model>{ namespace: 'foo' };

// 不通过
export default { foo: 'bar' };

```

**2. 配置**
---

```javascript
export default {
  dva: {
    immer: true,
    hmr: false,
  },
}
```

#### skipModelValidate

* Type: `boolean`

* Default: `false`

是否跳过 model 验证

#### extraModels

* Type: `string[]`

* Default: `[]`

配置额外到 dva model

#### immer

* Type: `boolean`

* Default: `false`

表示是否启用 immer 以方便修改 reducer

#### hmr

* Type: `boolean`

* Default: `false`

表示是否启用 dva model 的热更新

**3. dva 运行时配置**

通过 `src/app.tsx` 文件配置 dva 创建时的参数

```javascript
import { createLogger } from 'redux-logger';
import { message } from 'antd';

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      message.error(e.message, 3);
    },
  },
};
```

**4. umi 接口**

常用方法可从 umi 直接 import

```javascript
import { connect } from 'umi';
```

#### connect

绑定数据到组件

#### getDvaApp

获取 `dva` 实例，即之前的 `window.g_app`

#### useDispatch

hooks 的方式获取 `dispatch`，dva 为 2.6.x 时有效

#### useSelector

hooks 的方式获取部分数据，dva 为 2.6.x 时有效

#### useStore

hooks 的方式获取 store，dva 为 2.6.x 时有效

**3. 命令**

#### umi dva list model

```shell
umi dva list model
```

**4. 类型**

通过 umi 导出类型：`ConnectRC`，`ConnectProps`，`Dispatch`，`Action`，`Reducer`，`ImmerReducer`，`Effect`，`Subscription`，和所有 `model` 文件中导出的类型

#### model 用例

```javascript
import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export interface IndexModelState {
  name: string;
}

export interface IndexModelType {
  namespace: 'index';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'index',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query',
          })
        }
      });
    }
  }
};

export default IndexModel;
```

#### page 用例

```javascript
import React, { FC } from 'react';
import { IndexModelState, ConnectProps, Loading, connect } from 'umi';

interface PageProps extends ConnectProps {
  index: IndexModelState;
  loading: boolean;
}

const IndexPage: FC<PageProps> = ({ index, dispatch }) => {
  const { name } = index;
  return <div >Hello {name}</div>;
};

export default connect(({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
  index,
  loading: loading.models.index,
}))(IndexPage);
```

或者

```javascript
import React from 'react';
import { IndexModelState, ConnectRC, Loading, connect } from 'umi';

interface PageProps {
  index: IndexModelState;
  loading: boolean;
}

const IndexPage: ConnectRC<PageProps> = ({ index, dispatch }) => {
  const { name } = index;
  return <div >Hello {name}</div>;
};

export default connect(({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
  index,
  loading: loading.models.index,
}))(IndexPage);
```