# public 设置

> 问题产生

都是在 `index.html` 文件中手动引入所有资源，然而随着应用程序增长，并且一旦开始 在文件名中使用 `hash` 并输出 多个 `bundle`，如果继续手动管理 `index.html` 文件，就会变得困难起来

省略对于js文件的修改

> webpack.config.js

```javascript
const path = require('path');
 
 module.exports = {
-  entry: './src/index.js',
+  entry: {
+    index: './src/index.js',
+    print: './src/print.js',
+  },
   output: {
-    filename: 'bundle.js',
+    filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

**设置 HtmlWebpackPlugin**
---

> 安装插件

```shell
npm install --save-dev html-webpack-plugin
```

> webpack.config.js

```javascript
 const path = require('path');
+const HtmlWebpackPlugin = require('html-webpack-plugin');
 
 module.exports = {
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
+  plugins: [
+    new HtmlWebpackPlugin({
+      title: '管理输出',
+    }),
+  ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

**设置 clean-webpack-plugin**
---

> 问题产生

`/dist` 文件夹显得相当杂乱。webpack 将生成文件并放置在 `/dist` 文件夹中，但是它不会追踪哪些文件是实际在项目中用到的

> 解决方案

在每次构建前清理 `/dist` 文件夹，这样只会生成用到的文件。让实现这个需求

> 安装插件

```shell
npm install --save-dev clean-webpack-plugin
```

> webpack.config.js

```javascript
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
+const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
 module.exports = {
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
   plugins: [
+    new CleanWebpackPlugin(),
     new HtmlWebpackPlugin({
       title: 'Output Management',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

**设置 webpack-manfiest-plugin**
---

> 问题产生

入口文件与原文件的映射可以通过插件进行追踪

> 解决方案

通过 WebpackManifestPlugin 插件，可以将 manifest 数据提取为一个容易使用的 json 文件

> 安装插件

```shell
npm install webpack-nano webpack-manifest-plugin --save-dev
```

> webpack.config.js

```javascript
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const options = { ... };

module.exports = {
	// an example entry definition
	entry: [ 'app.js'	],
  ...
  plugins: [
    new WebpackManifestPlugin(options)
  ]
};
```

会建立 `manifest.json` 用来标识文件哈希映射

```json
{
  "dist/batman.js": "dist/batman.1234567890.js",
  "dist/joker.js": "dist/joker.0987654321.js"
}
```

> 参数设置

1. **basePath**

    Type: `String`

    Default: `''`

    为json中的所有键指定路径前缀。用于在json中包含输出路径。

2. **fileName**

    Type: `String`

    Default: `manifest.json`

    指定用于生成清单的文件名。默认情况下，插件将发出清单.json到输出目录。将绝对路径传递给fileName选项将覆盖文件名和路径。

3. **filter**

    Type: `Function`

    Default: `undefined`

    允许筛选构成清单的文件。传递的函数应该与`（file:FileDescriptor）=> Boolean`的签名匹配。返回true保留文件，返回false删除文件。

4. **generate**

    Type: `Function`

    Default: `undefined`

    用于创建清单的自定义函数。传递的函数应该与`（seed:Object，files:FileDescriptor[]，entries:string[]）=> Object`对象的签名匹配，并且可以返回任何可以由`JSON.stringify`文件.

5. **map**

    Type: `Function`

    Default: `undefined`

    允许修改构成清单的文件。传递的函数应该匹配`（file:FileDescriptor）=>FileDescriptor`的签名，其中返回与`FileDescriptor`匹配的对象。

6. **publicPath**

    Type: `String`

    Default: `<webpack-config>.output.publicPath`

    将添加到清单值的路径前缀。

7. **removeKeyHash**

    Type: `RegExp | Boolean`

    Default: `/([a-f0-9]{32}\.?)/gi`

    如果设置为有效的RegExp，则从清单键中移除哈希。例如

    ```json
{
    "index.c5a9bff71fdfed9b6046.html": "index.c5a9bff71fdfed9b6046.html"
}
    ```

    ```json
{
    "index.html": "index.c5a9bff71fdfed9b6046.html"
}
    ```

    此选项的默认值是一个以Webpack的默认md5哈希为目标的正则表达式。要针对其他哈希函数/算法，请将此选项设置为适当的`RegExp`。要禁用替换关键字名称中的哈希值，请将此选项设置为`false`。

8. **seed**

    Type: `Object`

    Default: `{}`

    用于对清单进行种子设定的键/值对缓存。这可能包括一组要包含在清单中的自定义键/值对，也可能用于在多编译器模式下跨编译组合清单。要组合清单，请将共享种子对象传递给每个编译器的`WebpackManifestPlugin`实例。

9. **serialize**

    Type: `Function(Object) => string`

    Default: `undefined`

    一个函数，可以利用它以不同于json的格式序列化清单。例如 `yaml`。

10. **sort**

    Type: `Function`

    Default: `undefined`

    允许对构成清单的文件进行排序。传递的函数应该与`（fileA:FileDescriptor，fileB:FileDescriptor）=>Number`的签名匹配。返回`0`表示没有更改，`-1`表示文件应移到较低的索引，`1`表示文件应移到较高的索引。

11. **useEntryKeys**

    Type: `Boolean`

    Default: `false`

    如果为true，则entry属性中指定的键将用作清单中的键。不会添加任何文件扩展名（除非指定为条目属性键的一部分）。

12. **writeToFileEmit**

    Type: `Boolean`

    Default: `false`

    如果为true，将向生成目录和内存发出清单，以与`webpack-dev-server`兼容

**使用 source map**
---

> 问题产生

如果将三个源文件（`a.js`, `b.js` 和 `c.js`）打包到一个 bundle（`bundle.js`）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会直接指向到 `bundle.js`

> 解决方案

使用 `source maps` 功能，可以将编译后的代码映射回原始源代码

> webpack.config.js

```javascript
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
+  devtool: 'inline-source-map',
   plugins: [
     new CleanWebpackPlugin(),
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

**使用 watch mode(观察模式)**
---

> package.json

```json
 {
   "name": "webpack-demo",
   "version": "1.0.0",
   "description": "",
   "private": true,
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
 +   "watch": "webpack --watch",
     "build": "webpack"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "clean-webpack-plugin": "^3.0.0",
     "html-webpack-plugin": "^4.5.0",
     "webpack": "^5.4.0",
     "webpack-cli": "^4.2.0"
   },
   "dependencies": {
     "lodash": "^4.17.20"
   }
 }
```

如果不想在 watch 触发增量构建后删除 `index.html` 文件，可以在 `CleanWebpackPlugin` 中配置

> 设置

```javascript
new CleanWebpackPlugin({
    // 模拟删除文件
    //
    // default: false
    dry: true,

    // 写入控制台日志
    // (当 enabled 为真时始终启用)
    //
    // default: false
    verbose: true,

    // 重建时自动删除所有未使用的网页包资产
    //
    // default: true
    cleanStaleWebpackAssets: false,

    // 不允许删除当前网页包资产
    //
    // default: true
    protectWebpackAssets: false,

    // **WARNING**
    //
    // 以下选项的注释：
    //
    // 它们是不安全的...因此最初要进行干燥测试：正确。
    //
    // 相对于网页包的输出路径目录.
    // 如果在webpack的output.path目录之外，
    //    使用完整路径。 path.join（process.cwd（），'build / ** / *'）
    //
    // 这些选项扩展了del的模式匹配API。
    // See https://github.com/sindresorhus/del#patterns
    //    用于模式匹配文档

    // 在Webpack编译之前删除文件一次
    //   不包括在重建中（监视模式）
    //
    // 使用!negative排除文件
    //
    // default: ['**/*']
    cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],
    cleanOnceBeforeBuildPatterns: [], // 禁用cleanOnceBeforeBuildPatterns

    // 在每个与此模式匹配的构建（包括监视模式）之后删除文件。
    // 用于非Webpack直接创建的文件。
    //
    // 使用!negative排除文件
    //
    // default: []
    cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],

    // 允许在process.cwd（）之外使用干净的模式
    //
    // 需要明确设置干选项
    //
    // default: false
    dangerouslyAllowCleanPatternsOutsideProject: true,
});
```

**使用 webpack-dev-server**
---

> 问题产生

本地需要搭建http 服务用以运行文件运行时的打包文件

> 解决方案

`webpack-dev-server` 为提供了一个简单的 `web server`，并且具有 `live reloading`(实时重新加载) 功能

> 安装

```shell
npm install --save-dev webpack-dev-server
```

> webpack.config.js

```javascript
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
   devtool: 'inline-source-map',
+  devServer: {
+    contentBase: './dist',
+  },
   plugins: [
     new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

以上配置告知 `webpack-dev-server`，将 `dist` 目录下的文件 `serve` 到 `localhost:8080` 下。（译注：serve，将资源作为 server 的可访问文件）

> *`webpack-dev-server` 在编译之后不会写入到任何输出文件。而是将 `bundle` 文件保留在内存中，然后将它们 `serve` 到 `server` 中，就好像它们是挂载在 `server` 根路径上的真实文件一样。如果的页面希望在其他不同路径中找到 `bundle` 文件，则可以通过 `dev server` 配置中的 `publicPath` 选项进行修改*

> package.json

```json
{
   "name": "webpack-demo",
   "version": "1.0.0",
   "description": "",
   "private": true,
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
     "watch": "webpack --watch",
+    "start": "webpack serve --open",
     "build": "webpack"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "clean-webpack-plugin": "^3.0.0",
     "html-webpack-plugin": "^4.5.0",
     "webpack": "^5.4.0",
     "webpack-cli": "^4.2.0",
     "webpack-dev-server": "^3.11.0"
   },
   "dependencies": {
     "lodash": "^4.17.20"
   }
 }
```

在命令行中运行 `npm start`，会看到浏览器自动加载页面。如果更改任何源文件并保存它们，`web server` 将在编译代码后自动重新加载

**使用 webpack-dev-middleware**
---

> 问题产生

使用 webpack-dev-server 确实是可以本地搭建出http 服务 对打包后的文件进行服务渲染，但是本地开发对于server 的设置没有分离有些耦合

> 解决方案

分离 server 并终止耦合配置

> 安装 `express` 和 `webpack-dev-middleware`

```shell
npm install --save-dev express webpack-dev-middleware
```

> webpack.config.js

```javascript
const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 
 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
   devtool: 'inline-source-map',
   devServer: {
     contentBase: './dist',
   },
   plugins: [
     new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
+    publicPath: '/',
   },
 };
```

将会在 `server` 脚本使用 `publicPath`，以确保文件资源能够正确地 `serve` 在 `http://localhost:3000` 下，稍后会指定 `port number`(端口号)

> project

```javascript
  webpack-demo
  |- package.json
  |- webpack.config.js
+ |- server.js
  |- /dist
  |- /src
    |- index.js
    |- print.js
  |- /node_modules
```

> server.js

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

添加一个 `npm script`，以使更方便地运行 `server`：

> package.json

```json
 {
   "name": "webpack-demo",
   "version": "1.0.0",
   "description": "",
   "private": true,
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
     "watch": "webpack --watch",
     "start": "webpack serve --open",
+    "server": "node server.js",
     "build": "webpack"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "clean-webpack-plugin": "^3.0.0",
     "express": "^4.17.1",
     "html-webpack-plugin": "^4.5.0",
     "webpack": "^5.4.0",
     "webpack-cli": "^4.2.0",
     "webpack-dev-middleware": "^4.0.2",
     "webpack-dev-server": "^3.11.0"
   },
   "dependencies": {
     "lodash": "^4.17.20"
   }
 }
```