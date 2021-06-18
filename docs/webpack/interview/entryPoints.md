### 入口起点(entry points)

**单个入口（简写）语法**
---

用法：`entry: string | [string]`

> webpack.config.js

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

`entry` 属性的单个入口语法，参考下面的简写：

> webpack.config.js

```javascript
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```

也可以将一个文件路径数组传递给 `entry` 属性，这将创建一个所谓的 **"multi-main entry"**。在想要一次注入多个依赖文件，并且将它们的依赖关系绘制在一个 "chunk" 中时，这种方式就很有用

> webpack.config.js

```javascript
module.exports = {
  entry: [ 
    './src/file_1.js',
    './src/file_2.js'
  ],
  output: {
    filename: 'bundle.js'
  }
};
```

希望通过一个入口（例如一个库）为应用程序或工具快速设置 webpack 配置时，单一入口的语法方式是不错的选择。然而，使用这种语法方式来扩展或调整配置的灵活性不大

**对象语法**
---

用法：`entry: { <entryChunkName> string | [string] } | {}`

> webpack.config.js

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
};
```

> * **“webpack 配置的可扩展”** 是指，这些配置可以重复使用，并且可以与其他配置组合使用。这是一种流行的技术，用于将关注点从环境(environment)、构建目标(build target)、运行时(runtime)中分离。然后使用专门的工具（如 webpack-merge）将它们合并起来。*

> *当通过插件生成入口时，可以传递空对象 `{}` 给 `entry`*

**常见场景**
---

**1. 分离 app(应用程序) 和 vendor(第三方库) 入口**
---

> webpack.config.js

```javascript
module.exports = {
  entry: {
    main: './src/app.js',
    vendor: './src/vendor.js'
  }
};
```

> webpack.prod.js

```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].bundle.js'
  }
};
```

> webpack.dev.js

```javascript
module.exports = {
  output: {
    filename: '[name].bundle.js'
  }
};
```

就可以在 vendor.js 中存入未做修改的必要 library 或文件（例如 Bootstrap, jQuery, 图片等），然后将它们打包在一起成为单独的 chunk。内容哈希保持不变，这使浏览器可以独立地缓存它们，从而减少了加载时间。

> *在 webpack < 4 的版本中，通常将 vendor 作为一个单独的入口起点添加到 entry 选项中，以将其编译为一个单独的文件（与 `CommonsChunkPlugin` 结合使用）。*

> *而在 webpack 4 中不鼓励这样做。而是使用 `optimization.splitChunks` 选项，将 vendor 和 app(应用程序) 模块分开，并为其创建一个单独的文件。**不要** 为 vendor 或其他不是执行起点创建 entry。*

**2. 多页面应用程序**
---

> webpack.config.js

```javascript
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

在多页面应用程序中，server 会拉取一个新的 HTML 文档给的客户端。页面重新加载此新文档，并且资源被重新下载。然而，这给了特殊的机会去做很多事，例如使用 `optimization.splitChunks` 为页面间共享的应用程序代码创建 bundle。由于入口起点数量的增多，多页应用能够复用多个入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益。