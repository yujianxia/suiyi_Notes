# 代码分离

> 产生问题

js 编译(es6|es7|ts => js) 合并的js文件过大 加载速度过慢

> 初步解决问题方案

使用gZip 在服务端进行配置, 在不进行代码改动的情况下增加js文件下载速度起到网站访问速度的基础

> 彻底解决问题

代码分离是 webpack 中最引人注目的特性之一。
此特性能够把代码分离到不同的 `bundle` 中，然后可以按需加载或并行加载这些文件。
代码分离可以用于获取更小的 `bundle`，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

常用的代码分离方法有三种：

* **入口起点**：使用 `entry` 配置手动地分离代码。

* **防止重复**：使用 `Entry dependencies` 或者 `SplitChunksPlugin` 去重和分离 `chunk`

* **动态导入**：通过模块的内联函数调用来分离代码

**入口起点(entry point)**
---

先来看看如何从 main bundle 中分离 another module(另一个模块)：

> project

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- another-module.js
|- /node_modules
```

> another-module.js

```javascript
import _ from 'lodash';

console.log(_.join(['Another', 'module', 'loaded!'], ' '));
```

> webpack.config.js

```javascript
 const path = require('path');
 
 module.exports = {
 - entry: './src/index.js',
 + mode: 'development',
 + entry: {
 +   index: './src/index.js',
 +   another: './src/another-module.js',
 + },
   output: {
 -   filename: 'main.js',
 +   filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

> 构建结果

```
...
[webpack-cli] Compilation finished
asset index.bundle.js 553 KiB [emitted] (name: index)
asset another.bundle.js 553 KiB [emitted] (name: another)
runtime modules 2.49 KiB 12 modules
cacheable modules 530 KiB
  ./src/index.js 257 bytes [built] [code generated]
  ./src/another-module.js 84 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
webpack 5.4.0 compiled successfully in 245 ms
```

> 产生的隐患

* 如果入口 `chunk` 之间包含一些重复的模块，那些重复模块都会被引入到各个 `bundle` 中

* 这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来

**防止重复(prevent duplication)**
---

> 入口依赖声明

配置 dependOn option 选项，这样可以在多个 chunk 之间共享模块

> Option 选项

默认情况下，每个入口 `chunk` 保存了全部其用的模块(`modules`)。使用 `dependOn` 选项可以与另一个入口 `chunk` 共享模块:

```javascript
module.exports = {
  //...
  entry: {
    app: { import: './app.js', dependOn: 'react-vendors' },
    'react-vendors': ['react', 'react-dom', 'prop-types']
  }
};
```

`app` 这个 chunk 就不会包含 `react-vendors` 拥有的模块了.

`dependOn` 选项的也可以为字符串数组

```javascript
module.exports = {
  //...
  entry: {
    moment: { import: 'moment-mini', runtime: 'runtime' },
    reactvendors: { import: ['react', 'react-dom'], runtime: 'runtime' },
    testapp: {
      import: './wwwroot/component/TestApp.tsx',
      dependOn: ['reactvendors', 'moment'],
    },
  },
};
```

还可以使用数组为每个入口指定多个文件：

```javascript
module.exports = {
  //...
  entry: {
    app: { import: ['./app.js', './app2.js'], dependOn: 'react-vendors' },
    'react-vendors': ['react', 'react-dom', 'prop-types']
  }
};
```

> webpack.config.js (回到从入口依赖声明)

```javascript
 const path = require('path');
 
 module.exports = {
   mode: 'development',
   entry: {
 -   index: './src/index.js',
 -   another: './src/another-module.js',
 +   index: {
 +     import: './src/index.js',
 +     dependOn: 'shared',
 +   },
 +   another: {
 +     import: './src/another-module.js',
 +     dependOn: 'shared',
 +   },
 +   shared: 'lodash',
   },
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

如果要在一个 HTML 页面上使用多个入口时，还需设置 optimization.runtimeChunk: 'single'

> webpack.config.js

```javascript
 const path = require('path');
 
 module.exports = {
   mode: 'development',
   entry: {
     index: {
       import: './src/index.js',
       dependOn: 'shared',
     },
     another: {
       import: './src/another-module.js',
       dependOn: 'shared',
     },
     shared: 'lodash',
   },
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 + optimization: {
 +   runtimeChunk: 'single',
 + },
 };
```

> 构建结果

```
...
[webpack-cli] Compilation finished
asset shared.bundle.js 549 KiB [compared for emit] (name: shared)
asset runtime.bundle.js 7.79 KiB [compared for emit] (name: runtime)
asset index.bundle.js 1.77 KiB [compared for emit] (name: index)
asset another.bundle.js 1.65 KiB [compared for emit] (name: another)
Entrypoint index 1.77 KiB = index.bundle.js
Entrypoint another 1.65 KiB = another.bundle.js
Entrypoint shared 557 KiB = runtime.bundle.js 7.79 KiB shared.bundle.js 549 KiB
runtime modules 3.76 KiB 7 modules
cacheable modules 530 KiB
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
  ./src/another-module.js 84 bytes [built] [code generated]
  ./src/index.js 257 bytes [built] [code generated]
webpack 5.4.0 compiled successfully in 249 ms
```

由上可知，除了生成 `shared.bundle.js`，`index.bundle.js` 和 `another.bundle.js` 之外，还生成了一个 `runtime.bundle.js` 文件

尽管可以在 webpack 中允许每个页面使用多入口，应尽可能避免使用多入口的入口：`entry: { page: ['./analytics', './app'] }`。如此，在使用 async 脚本标签时，会有更好的优化以及一致的执行顺序

**SplitChunksPlugin**
---

`SplitChunksPlugin` 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。让使用这个插件，将之前的示例中重复的 `lodash` 模块去除：

> webpack.config.js

```javascript
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
 +  optimization: {
 +    splitChunks: {
 +      chunks: 'all',
 +    },
 +  },
  };
```

使用 `optimization.splitChunks` 配置选项之后，现在应该可以看出，`index.bundle.js` 和 `another.bundle.js` 中已经移除了重复的依赖模块。
需要注意的是，插件将 `lodash` 分离到单独的 chunk，并且将其从 main bundle 中移除，减轻了大小。

> `npm run build`

```shell
...
[webpack-cli] Compilation finished
asset vendors-node_modules_lodash_lodash_js.bundle.js 549 KiB [compared for emit] (id hint: vendors)
asset index.bundle.js 8.92 KiB [compared for emit] (name: index)
asset another.bundle.js 8.8 KiB [compared for emit] (name: another)
Entrypoint index 558 KiB = vendors-node_modules_lodash_lodash_js.bundle.js 549 KiB index.bundle.js 8.92 KiB
Entrypoint another 558 KiB = vendors-node_modules_lodash_lodash_js.bundle.js 549 KiB another.bundle.js 8.8 KiB
runtime modules 7.64 KiB 14 modules
cacheable modules 530 KiB
  ./src/index.js 257 bytes [built] [code generated]
  ./src/another-module.js 84 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
webpack 5.4.0 compiled successfully in 241 ms
```

**webpack 4 import 和 CommonJs**
---

* **Source**：包含`import()`方法的模块

* **Target**：`import()`方法所引用的目标模块

* **non-ESM**：没有设置`esModule`为true的Commonjs或AMD模块

* **transpiled-ESM**：设置`esModule`为true的Commonjs模块（是由ES6模块转化过来的）

* **ESM**：通常所说的ES6模块 + strict-ESM：相对更严格的ES6模块(如nodejs的ES6模块)

* **JSON**：json文件

> 复杂情况

* (A) Source: non-ESM, transpiled-ESM 或 ESM

* (B) Source: strict-ESM (mjs)

* (1) Target: non-ESM

* (2) Target: transpiled-ESM (__esModule)

* (3) Target: ESM or strict-ESM (mjs)

* (4) Target: JSON

> demo

```javascript
// (A) source.js
import("./target").then(result => console.log(result));
// (B) source.mjs
import("./target").then(result => console.log(result));
// (1) target.js
exports.name = "name";
exports.default = "default";
// (2) target.js
exports.__esModule = true;
exports.name = "name";
exports.default = "default";
// (3) target.js or target.mjs
export const name = "name";
export default "default";
// (4) target.json
{ name: "name", default: "default" }
```

**A3 and B3: import(ESM)**

> ESM规范实际上已经涵盖了这种情况。 列子里的（A）或（B）中通过import()方法引入（3）将会返回一个带命名空间（namespace）的对象，为了考虑到兼容性在命名空间（`namespace`）对象里引入了`__esModule`属性使其可被import()导入 （A）或（B）打印的结果如下：

```javascript
{ __esModule: true, name: "name", default: "default" }
```

**A1: import(CommonJS)**

当import一个Commonjs模块时，webpack 3 仅仅是解析为module.exports的值，而webpack 4会为import的commonjs模块创造一个带命名空间的对象，以此来让import()导入的结果统一为带命名空间的对象

CommonJs模块的默认导出始终是module.exports的值，webpack还允许通过import { property } from "commonjs"从commonjs模块中导入某个属性，所以允许import()方法也可以这样做。

> 注意：在这种情况下，默认情况下defalut属性被隐藏在webpack生成的default对象里

```javascript
// webpack 3
{ name: "name", default: "default" }
// webpack 4
{ name: "name", default: { name: "name", default: "default" } }
```

**B1: 在nodejs .mjs(es6模块)文件中import(CommonJS)**

在strict-ESM中不允许通过import仅导入某个属性，只允许导入non-ESM的默认导出值

```javascript
{ default: { name: "name", default: "default" } }
```

**A2: import(transpiled-ESM)**

webpack支持通过import()导入已经转换为ES6模块的commonjs模块

```javascript
{ __esModule: true, name: "name", default: "default" }
```

**B2: 在nodejs .mjs(es6模块)文件中import(transpiled-ESM)**

在strict-ESM中不识别__esModule这样的标记，可以把它理解为一种破坏行为，但至少与node.js一致

```javascript
{ default: { __esModule: true, name: "name", default: "default" } }
```

**A4 and B4: import(json)**

import(json)是支持导入部分属性的，包括在strict-ESM中，json也会暴露完整的对象作为默认导出

```javascript
{ name: "name", default: { name: "name", default: "default" } }
```

所以总结下来只有一种情况发生了改变，导出对象时没有任何问题，有问题的是导出的不是对象，如：

```javascript
module.exports = 42;
```

在webpack4中通过import()导入后，需要通过result.default来获取结果：

```javascript
// webpack 3打印的结果
42
// webpack 4打印的结果
{ default: 42 }
```

**动态导入(dynamic import)**
---

* 第一种，也是推荐选择的方式是，使用符合 `ECMAScript 提案` 的 `import() 语法` 来实现动态导入

* 第二种，则是 webpack 的遗留功能，使用 webpack 特定的 `require.ensure`

> 注意：`import()` 调用会在内部用到 *promises*。如果在旧版本浏览器中（例如，IE 11）使用 `import()`，记得使用一个 polyfill 库（例如 *es6-promise* 或 *promise-polyfill*），来 *shim Promise*。

> 注意：之所以需要 `default`，是因为 webpack 4 在导入 `CommonJS` 模块时，将不再解析为 `module.exports` 的值，而是为 `CommonJS` 模块创建一个 `artificial namespace` 对象

```javascript
-import _ from 'lodash';
-
-function component() {
+function getComponent() {
   const element = document.createElement('div');
 
-  // Lodash, now imported by this script
-  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+  return import('lodash')
+    .then(({ default: _ }) => {
+      const element = document.createElement('div');
+
+      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
 
-  return element;
+      return element;
+    })
+    .catch((error) => 'An error occurred while loading the component');
}
 
-document.body.appendChild(component());
+getComponent().then((component) => {
+  document.body.appendChild(component);
+});
```

执行 webpack，查看 lodash 是否会分离到一个单独的 bundle：

```
...
[webpack-cli] Compilation finished
asset vendors-node_modules_lodash_lodash_js.bundle.js 549 KiB [compared for emit] (id hint: vendors)
asset index.bundle.js 13.5 KiB [compared for emit] (name: index)
runtime modules 7.37 KiB 11 modules
cacheable modules 530 KiB
  ./src/index.js 434 bytes [built] [code generated]
  ./node_modules/lodash/lodash.js 530 KiB [built] [code generated]
webpack 5.4.0 compiled successfully in 268 ms
```

> 优化

由于 import() 会返回一个 promise，因此它可以和 async 函数一起使用。下面是如何通过 async 函数简化代码：

```javascript
-function getComponent() {
+async function getComponent() {
   const element = document.createElement('div');
+  const { default: _ } = await import('lodash');
 
-  return import('lodash')
-    .then(({ default: _ }) => {
-      const element = document.createElement('div');
+  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
 
-      element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-      return element;
-    })
-    .catch((error) => 'An error occurred while loading the component');
+  return element;
 }
 
 getComponent().then((component) => {
   document.body.appendChild(component);
 });
```

**预获取/预加载模块(prefetch/preload module)**
---

在声明 `import` 时，使用下面这些内置指令，可以让 webpack 输出 `"resource hint(资源提示)"`，来告知浏览器：

* `prefetch`(预获取)：将来某些导航下可能需要的资源

* `preload`(预加载)：当前导航下可能需要资源

有一个 `HomePage` 组件，其内部渲染一个 `LoginButton` 组件，然后在点击后按需加载 `LoginModal` 组件。

> LoginButton.js

```javascript
//...
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```

这会生成 `<link rel="prefetch" href="login-modal-chunk.js">` 并追加到页面头部，指示着浏览器在闲置时间预取 `login-modal-chunk.js` 文件

> *只要父 chunk 完成加载，webpack 就会添加 prefetch hint(预取提示)*

与 prefetch 指令相比，preload 指令有许多不同之处：

* `preload chunk` 会在父 `chunk` 加载时，以并行方式开始加载。`prefetch chunk` 会在父 `chunk` 加载结束后开始加载

* `preload chunk` 具有中等优先级，并立即下载。`prefetch chunk` 在浏览器闲置时下载

* `preload chunk` 会在父 `chunk` 中立即请求，用于当下时刻。`prefetch chunk` 会用于未来的某个时刻

* 浏览器支持程度不同

有一个 `Component`，依赖于一个较大的 `library`，所以应该将其分离到一个独立的 `chunk` 中

> 假想这里的图表组件 `ChartComponent` 组件需要依赖体积巨大的 `ChartingLibrary` 库。它会在渲染时显示一个 `LoadingIndicator(加载进度条)` 组件，然后立即按需导入 `ChartingLibrary`：

```javascript
//...
import(/* webpackPreload: true */ 'ChartingLibrary');
```

在页面中使用 `ChartComponent` 时，在请求 ChartComponent.js 的同时，还会通过 `<link rel="preload">` 请求 `charting-library-chunk`。假定 page-chunk 体积很小，很快就被加载好，页面此时就会显示 `LoadingIndicator(加载进度条)` ，等到 `charting-library-chunk` 请求完成，LoadingIndicator 组件才消失。启动仅需要很少的加载时间，因为只进行单次往返，而不是两次往返。尤其是在高延迟环境下

> **注意： 不正确地使用 webpackPreload 会有损性能，请谨慎使用**

bundle 分析(bundle analysis)

* `webpack-chart`: webpack stats 可交互饼图。

* `webpack-visualizer`: 可视化并分析的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。

* `webpack-bundle-analyzer`：一个 plugin 和 CLI 工具，它将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式。

* `webpack bundle optimize helper`：这个工具会分析的 bundle，并提供可操作的改进措施，以减少 bundle 的大小。

* `bundle-stats`：生成一个 bundle 报告（bundle 大小、资源、模块），并比较不同构建之间的结果。
