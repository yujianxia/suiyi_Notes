### 概念

**入口(entry)**
---

**入口起点(entry point)** 指示 webpack 应该使用哪个模块，来作为构建其内部 `依赖图(dependency graph)` 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的

默认值是 `./src/index.js`，但可以通过在 `webpack configuration` 中配置 entry 属性，来指定一个（或多个）不同的入口起点。例如：

> webpack.config.js

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

**输出(output)**
---

**output** 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中

可以通过在配置中指定一个 output 字段，来配置这些处理过程：

> webpack.config.js

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

通过 `output.filename` 和 `output.path` 属性，来告诉 webpack bundle 的名称，以及想要 bundle 生成(emit)到哪里。可能想要了解在代码最上面导入的 path 模块是什么，它是一个 **Node.js 核心模块**，用于操作文件路径

**loader**
---

**webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。** loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中

> 注意，loader 能够 import 导入任何类型的模块（例如 .css 文件），这是 webpack 特有的功能，其他打包程序或任务执行器的可能并不支持。认为这种语言扩展是很有必要的，因为这可以使开发人员创建出更准确的依赖关系图。

在更高层面，在 `webpack` 的配置中，`loader` 有两个属性：

1. `test` 属性，识别出哪些文件会被转换。

2. `use` 属性，定义出在进行转换时，应该使用哪个 `loader`。

> webpack.config.js

```javascript
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

以上配置中，对一个单独的 module 对象定义了 rules 属性，里面包含两个必须属性：test 和 use。这告诉 webpack 编译器(compiler) 如下信息：

> *“嘿，webpack 编译器，当碰到「在 require()/import 语句中被解析为 '.txt' 的路径」时，在对它打包之前，先 **use(使用)** raw-loader 转换一下。”*

**重要的是要记住，在 webpack 配置中定义 rules 时，要定义在 `module.rules` 而不是 `rules` 中。**

**请记住，使用正则表达式匹配文件时，不要为它添加引号。也就是说，`/\.txt$/` 与 `'/\.txt$/'` 或 `"/\.txt$/"` 不一样。前者指示 webpack 匹配任何以 .txt 结尾的文件，后者指示 webpack 匹配具有绝对路径 '.txt' 的单个文件; 这可能不符合的意图。**

**插件(plugin)**
---

loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

想要使用一个插件，只需要 `require()` 它，然后把它添加到 `plugins` 数组中。多数插件可以通过选项(option)自定义。也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new` 操作符来创建一个插件实例。

> webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

在上面的示例中，`html-webpack-plugin` 为应用程序生成一个 HTML 文件，并自动注入所有生成的 bundle。

**模式(mode)**
---

通过选择 `development`, `production` 或 `none` 之中的一个，来设置 `mode` 参数，可以启用 webpack 内置在相应环境下的优化。其默认值为 `production`。

```javascript
module.exports = {
  mode: 'production'
};
```

**浏览器兼容性(browser compatibility)**
---

webpack 支持所有符合 `ES5 标准` 的浏览器（不支持 IE8 及以下版本）。webpack 的 `import()` 和 `require.ensure()` 需要 `Promise`。如果想要支持旧版本浏览器，在使用这些表达式之前，还需要 **提前加载 polyfill**

**环境(environment)**
---

webpack 运行于 Node.js v8.x+ 版本