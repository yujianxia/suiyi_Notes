### Configuration

**webpack 的配置文件是 JavaScript 文件，文件内导出了一个 webpack `配置的对象`**。 webpack 会根据该配置定义的属性进行处理。

由于 webpack 遵循 CommonJS 模块规范，因此，可以在配置中使用：

* 通过 `require(...)` 引入其他文件

* 通过 `require(...)` 使用 npm 下载的工具函数

* 使用 JavaScript 控制流表达式，例如 `?:` 操作符

* 对 value 使用常量或变量赋值

* 编写并执行函数，生成部分配置

**但还是应避免如下操作：**

* 当使用 webpack CLI 工具时，访问 CLI 参数

* 导出不确定的结果（两次调用 webpack 应产生相同的输出文件）

* 编写超长的配置（应将配置文件拆分成多个）

**基本配置**
---

> webpack.config.js

```javascript
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
```

**使用不同的配置文件**
---

如果出于某些原因，需要根据特定情况使用不同的配置文件，则可以通过在命令行中使用 `--config flag` 修改此配置文件名称。

> package.json

```json
"scripts": {
  "build": "webpack --config prod.config.js"
}
```

**选项**
---

> *注意整个配置中使用 Node 内置的 `path 模块`，并在它前面加上 `__dirname`这个全局变量。可以防止不同操作系统之间的文件路径问题，并且可以使相对路径按照预期工作。*

> webpack.config.js

```javascript
const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"
  // 选择模式告诉webpack相应地使用其内置优化。
  entry: "./app/entry", // string | object | array
  // 默认为 ./src
  // 这里应用程序开始执行
  // webpack 开始打包
  output: {
    // webpack 如何输出结果的相关选项
    path:path.resolve(__dirname, "dist"), // string (default)
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    filename: "[name].js", // string (default)
    // entry chunk 的文件名模板
    publicPath: "/notes/assets/", // string
    // 输出解析文件的目录，url 相对于 HTML 页面
    library: { // 这里有一种旧的语法形式可以使用（点击显示）
      type: "umd", // 通用模块定义
      // 导出库的类型
      name: "MyLibrary", // string | string[]
      // 导出库的名称

      /* 高级输出库配置 */
      chunkFilename: "[name].js",
      chunkFilename: "[id].js",
      chunkFilename: "[contenthash].js", // 长效缓存
      // 其他块的文件名模板
      assetModuleFilename: "[hash][ext][query]", // string
      // 资产模块的文件名模板
      webassemblyModuleFilename: "[hash].module.wasm", // string
      // wasm模块的文件名模板
      sourceMapFilename: "[file].map", // string
      sourceMapFilename: "sourcemaps/[file].map", // string
      // source map location 的文件名模板
      devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
      // devtool 模块的文件名模板
      devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
      // devtool 模块的文件名模板（用于冲突）
      crossOriginLoading: "use-credentials", // enum
      crossOriginLoading: "anonymous",
      crossOriginLoading: false,
      // 指定运行时如何发出跨源请求
      importFunctionName: "import", // string (default)
      // 使用import（）时调用的表达式
      // 可以更换以使用polyfills
      importMetaName: "import.meta", // string (default)
      // 使用import.meta时使用的表达式
      // 可以更换以使用polyfills
    },
    uniqueName: "my-application", // (默认为package.json“ name”)
    // 此版本的唯一名称，以避免与同一HTML中的其他版本冲突
    name: "my-config",
    // 配置名称，显示在输出中

    /* 高级输出配置 */
     chunkFilename: "[name].js",
      chunkFilename: "[id].js",
      chunkFilename: "[contenthash].js", // 长效缓存
      // 其他块的文件名模板
      assetModuleFilename: "[hash][ext][query]", // string
      // 资产模块的文件名模板
      webassemblyModuleFilename: "[hash].module.wasm", // string
      // wasm模块的文件名模板
      sourceMapFilename: "[file].map", // string
      sourceMapFilename: "sourcemaps/[file].map", // string
      // source map location 的文件名模板
      devtoolModuleFilenameTemplate: "webpack:///[resource-path]", // string
      // devtool 模块的文件名模板
      devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]?[hash]", // string
      // devtool 模块的文件名模板（用于冲突）
      crossOriginLoading: "use-credentials", // enum
      crossOriginLoading: "anonymous",
      crossOriginLoading: false,
      // 指定运行时如何发出跨源请求
      importFunctionName: "import", // string (default)
      // 使用import（）时调用的表达式
      // 可以更换以使用polyfills
      importMetaName: "import.meta", // string (default)
      // 使用import.meta时使用的表达式
      // 可以更换以使用polyfills
  },
  module: {
    // 模块配置相关
    rules: [
      // 模块规则（配置 loader、解析器等选项）
      {
        // Conditions 条件:
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        //这些是匹配条件，每个条件都接受正则表达式或字符串
        //测试和包含行为相同，两者必须匹配
        //排除项不得匹配（优先于测试并包含）
        //最佳做法：
        //-仅在测试中和文件名匹配中使用RegExp
        //-在include和exclude中使用绝对路径数组以匹配完整路径
        //-尽量避免排除，而希望包括
        //每个条件还可以接收具有“ and”，“ or”或“ not”属性的对象
        //这是条件数组。
        issuer: /\.css$/,
        issuer: path.resolve(__dirname, "app"),
        issuer: { and: [ /\.css$/, path.resolve(__dirname, "app") ] },
        issuer: { or: [ /\.css$/, path.resolve(__dirname, "app") ] },
        issuer: { not: [ /\.css$/ ] },
        issuer: [ /\.css$/, path.resolve(__dirname, "app") ], // like "or"
        // 发行人的条件（进口来源）
        /* 高级条件 */
        // https://webpack.docschina.org/configuration/#

        // Actions 操作:
        loader: "babel-loader",
        // 应该应用的 loader，它相对上下文解析
        options: {
          presets: ["es2015"]
        },
        // options for the loader 装载机的选项
        use: [
          // 应用多个加载程序和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              // ...
            }
          }
        ]
        type: "javascript/auto",
        // 指定模块类型

        /* Advanced actions  */
        enforce: "pre",
        enforce: "post",
        // 标记以应用这些规则，即使它们被覆盖
        generator: { /* ... */ },
        // 生成器的选项（取决于模块类型）
        parser: { /* ... */ },
        // 解析器的选项（取决于模块类型）
        resolve: { /* ... */ },
        // 解决选项（与配置中的“resolve”相同）
        sideEffects: false, // boolean
        // 覆盖package.json中的“sideEffects”
      },
      {
        oneOf: [
          // ... (rules)
        ]
        // 仅使用这些嵌套规则之一
      },
      {
        // ... (conditions)
        rules: [
          // ... (rules)
        ]
        // 使用所有这些嵌套规则（与条件结合使用）
      },
    ],


    /* 高级模块配置 */
    noParse: [
        /special-library\.js$/
    ],
    // 不解析这里的模块
    unknownContextRequest: ".",
    unknownContextRecursive: true,
    unknownContextRegExp: /^\.\/.*$/,
    unknownContextCritical: true,
    exprContextRequest: ".",
    exprContextRegExp: /^\.\/.*$/,
    exprContextRecursive: true,
    exprContextCritical: true,
    wrappedContextRegExp: /.*/,
    wrappedContextRecursive: true,
    wrappedContextCritical: false,
    // 指定动态请求的默认行为
  },
  resolve: {
    // 解决模块请求的选项
    // (不适用于装载机的解决)
    modules: ["node_modules",path.resolve(__dirname, "app")],
    // 查找模块的目录（按顺序）
    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名
    alias: {
      // 模块名称别名列表
      // 相对于当前上下文导入别名
      "module": "new-module",
      // 别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // 别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      "module": path.resolve(__dirname, "app/third"),
      // alias "module" -> "./app/third" and "module/file" -> "./app/third/file"
      [path.resolve(__dirname, "app/module.js")]: path.resolve(__dirname, "app/alternative-module.js"),
      // alias "./app/module.js" -> "./app/alternative-module.js"
    },

    /* 可供选择的别名语法（点击展示） */
    alias: [
      {
        name: "module",
        // 旧的 request
        alias: "new-module",
        // 新的 request
        onlyModule: true
        // 如果为 true，只有 "module" 是别名
        // 如果为 false，"module/inner/path" 也是别名
      }
    ],

    /* 高级解析选项（点击展示） */
    conditionNames: ["myCompanyCondition", "..."],
    // 描述文件中用于“导出”和“导入”字段的条件
    roots: [path.resolve(__dirname, "app/root")],
    // 解决服务器相对请求的位置（以“ /”开头）
    // 仅当请求不能解析为绝对路径时，才应用此行为
    fallback: { "events": path.resolve(__dirname, "events.js") },
    // 与别名相似，但仅在正常解析失败时适用
    mainFields: ["main"],
    // 从描述文件读取的属性
    // 当请求文件夹时
    restrictions: [ /\.js$/, path.resolve(__dirname, "app") ],
    // 要成功解决，结果必须符合这些条件
    cache: true, // boolean
    // 启用安全的解析缓存
    // 这是安全的，因为它可以跟踪并验证所有解决的依赖关系
    unsafeCache: true,
    unsafeCache: {},
    // 对已解决的请求启用不安全的缓存
    // 这是不安全的，因为没有验证
    // 但是性能提升确实很大
    plugins: [
    // ...
    ],
    // 应用于解析器的其他插件
  },
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map", // enum
  // 通过为浏览器调试工具提供极其详细的源映射的元信息来增强调试能力，
  // 但会牺牲构建速度。
  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 都相对于此目录解析
  target: "web", // 枚举
  // 捆绑软件应在其中运行的环境
  // 更改块加载行为，可用的外部模块
  // 并生成代码样式
  externals: ["react", /^@angular/],
  // 不要关注/捆绑这些模块，而是在运行时从环境中请求它们
  externalsType: "var", // (默认为output.library.type)
  // 外部类型，未在外部中内联指定时
  externalsPresets: { /* ... */ },
  // 外部预设
  ignoreWarnings: [/warning/],
  stats: "errors-only",
  stats: {
    // 使您可以精确控制显示哪些捆绑软件信息
    preset: "errors-only",
    // 统计预设

    /* 高级全局设置 */
    all: false,
    // 开启或关闭所有标志
    colors: true,
    // 开启和关闭颜色
    context: __dirname,
    // 所有路径都将相对于此目录
    ids: true,
    // 在输出中包含模块ID和块ID

    env: true,
    // 在输出中包括--env的值
    outputPath: true,
    // 在输出中包括绝对输出路径
    publicPath: true,
    // 在输出中包含公共路径

    assets: true,
    // 显示输出中的资产清单
    
    /* Advanced assets settings */

    entrypoints: true,
    // 显示入口点列表
    chunkGroups: true,
    // 显示命名块组列表

    /* 高级块组设置 */
    chunkGroupAuxiliary: true,
    // 显示入口点/组的辅助资产
    chunkGroupChildren
    // 显示入口点/块组的子块组
    chunkGroupMaxAssets: 5,
    // 达到此限制时，折叠组块资产列表

    chunks: true,
    // 显示输出中的块列表

    /* 高级块组设置 */
    chunksSort: "size",
    // 排序块列表
    chunkModules: true,
    // 显示每个块中包含的模块
    chunkOrigins: true,
    // 显示块的来源（为什么创建了该块）
    chunkRelations: true,
    // 显示与其他部分的关系（父母，孩子，兄弟姐妹）
    dependentModules: true,
    // 显示属于该块中其他模块的模块

    modules: true,
    // 显示输出中的模块列表

    /* 高级模块设置 */
    modulesSpace: 50,
    // 要显示的模块行数
    nestedModules: true,
    // 显示嵌套的模块（串联时）
    cachedModules: true,
    // 显示已缓存的模块
    orphanModules: true,
    // 显示在优化图中不再引用的模块
    excludeModules: /\.css$/,
    // 隐藏一些模块
    reasons: true,
    // 显示为什么包含模块的原因
    source: true,
    // 包括模块的源代码（仅在JSON中）

    /* Expert module settings */
     modulesSort: "size",
    // 排序模块列表
    groupModulesByPath: true,
    // 按资源路径对模块进行分组
    groupModulesByExtension: true
    // 通过扩展将模块分组
    groupModulesByAttributes: true
    // 按属性分组模块，例如是否具有错误/警告/资产
    // 或是可选的
    groupModulesByCacheStatus: true,
    // 对模块进行分组，具体取决于它们是构建的，生成的代码还是
    // 它们通常是可缓存的
    depth: true,
    // 在模块的模块图中显示深度
    moduleAssets: true,
    // 在模块列表中显示模块发出的资产
    runtimeModules: true,
    // 在模块列表中显示运行时模块

    /* 高级优化设置 */
    providedExports: true,
    // 显示模块提供的导出
    usedExports: true,
    // 显示模块使用哪些导出
    optimizationBailout: true,
    // 显示信息为什么对模块进行优化

    children: true
    // 显示子编译的统计信息

    logging: true,
    // 显示输出日志
    loggingDebug: /webpack/,
    // 显示某些记录器的调试类型记录
    loggingTrace: true,
    // 显示堆栈跟踪以记录日志输出中的警告和错误

    warnings: true
    // 显示警告

    errors: true,
    // 显示错误
    errorDetails: true,
    // 显示错误的详细信息
    errorStack: true,
    // 显示内部堆栈跟踪以查找错误
    moduleTrace: true,
    // 显示模块跟踪以查找错误
    // (为什么导致模块被引用)

    builtAt: true,
    // 在摘要中显示时间戳
    errorsCount: true,
    // 在摘要中显示错误计数
    warningsCount: true,
    // 显示警告摘要
    timings: true,
    // 汇总显示构建时间
    version: true,
    // 显示摘要中的webpack版本
    hash: true,
    // 在摘要中显示构建哈希
  },
  devServer: {
    proxy: { // 代理URL到后端开发服务器
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, 静态文件位置
    compress: true, // 启用gzip压缩
    historyApiFallback: true, // 对于404时index.html为true，多个路径为对象
    hot: true, // 热模块更换。 取决于HotModuleReplacementPlugin
    https: false, // 自签名为true，证书颁发机构为对象
    noInfo: true, // 仅错误并在热装时发出警告
    // ...
  },
  experiments: {
    asyncWebAssembly: true,
    // WebAssembly作为异步模块（建议）
    syncWebAssembly: true,
    // WebAssembly作为同步模块（不建议使用）
    outputModule: true,
    // 允许输出ESM
    topLevelAwait: true,
    // 允许在模块评估中使用等待（建议）
  }
  plugins: [
    // ...
  ],
  // 其他插件列表
  optimization: {
    chunkIds: "size",
    // 为块生成ID的方法
    moduleIds: "size",
    // 为模块生成ID的方法
    mangleExports: "size",
    // 重命名导出名称为短名称
    minimize: true,
    // 最小化输出文件
    minimizer: [new CssMinimizer(), "..."],
    // 用于输出文件的最小化器

    /* 高级优化 */
    concatenateModules: true,
    // 将多个模块合并为一个模块
    emitOnErrors: true,
    // 发出输出文件，即使有构建错误
    flagIncludedChunks: true,
    // 如果块完全包含在其中，请避免下载
    // 一个已经加载的块
    innerGraph: true,
    // 确定符号之间没有模块的引用
    mergeDuplicateChunks: true,
    // 如果相等则合并块
    nodeEnv: "production",
    // 模块内部的process.env.NODE_ENV的值
    portableRecords: true,
    // 在记录中使用相对路径
    providedExports: true,
    // 确定哪些出口由模块承担
    usedExports: true,
    // 确定模块使用哪些导出，并
    // 删除未使用的
    realContentHash: true,
    // 根据内容计算资产的内容哈希
    removeAvailableModules: true,
    // 运行额外的通行证以确定已经存在的模块
    // 父块并将其删除
    removeEmptyChunks: true,
    // 删除空的块
    runtimeChunk: "single",
    // 更改运行时代码的位置
    sideEffects: true,
    // 跳过使用重新导出时无副作用的模块

    splitChunks: {
      cacheGroups: {
        "my-name": {
          // 用特定的定义模块组
          // 缓存行为
          test: /\.sass$/,
          type: "css/mini-extract",

          /* 高级选择器 */
          chunks: "async",
          minChunks: 1,
          enforceSizeThreshold: 100000,
          minSize: 0,
          minRemainingSize: 0,
          usedExports: true,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,

          /* 进阶效果 */
          maxAsyncSize: 200000,
          maxInitialSize: 100000,
          maxSize: 200000,
          filename: "my-name-[contenthash].js",
          idHint: "my-name",
          name: false,
          hidePathInfo: true,
          automaticNameDelimiter: "-",
        }
      },

      fallbackCacheGroup: {
        automaticNameDelimiter: "-"
        minSize: 20000,
        maxAsyncSize: 200000,
        maxInitialSize: 100000,
        maxSize: 200000,
      }

      /* 高级选择器 */
      chunks: "all",
      // 选择应该优化的块
      usedExports: true,
      // 仅当使用的出口相等时才将模块视为相等
      minChunks: 1,
      // 模块必须位于的最小块数
      enforceSizeThreshold: 100000,
      // 当模块的大小遵循标准时忽略
      // 高于此阈值
      minSize: 20000,
      // 模块的大小必须高于此阈值
      minRemainingSize: 20000,
      // 从单个块中删除模块时
      // 剩余模块的大小
      // 必须高于此阈值
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      // 单个按需加载的并行请求数
      // 分别 入口点，但高于此阈值

      /* 进阶效果 */
      maxAsyncSize: 200000,
      maxInitialSize: 100000,
      maxSize: 200000,
      // 当新块中的模块大小大于此值时
      // 门槛，进一步分割
      filename: "[contenthash].js",
      // 给新块一个不同的文件名
      name: false, // false | string | (module, chunks, key) => string
      // 给新块起一个不同的名字
      // 使用现有名称时，将合并块
      // non-splitChunks块只能在
      // 所有选定模块的父级或同级块
      hidePathInfo: true,
      // 通过“ maxSize”分割时隐藏路径信息
      automaticNameDelimiter: "-",
      // 使用此分隔符将原始名称与路径信息分开
      // 通过“ maxSize”拆分时

      /* 专家设定 */
      defaultSizeTypes: ["javascript", "..."]
      // 使用数字表示尺寸时，请测量以下尺寸类型
      // minSize: { javascript: 10000 } 允许更具体
    }
  },
  
  /* 高级配置 */
  loader: { /* ... */ },
  // 向加载程序上下文添加自定义API或属性
  resolveLoader: { /* same as resolve */ }
  // 装载机的单独解决选项
  node: {
    // Polyfill和模拟程序可运行Node.js
    // 非节点环境中的环境代码。
    global: true, // boolean
    // 用output.globalObject替换“ global”
    __filename: "mock", // boolean | "mock" | "eval-only"
    __dirname: "mock", // boolean | "mock" | "eval-only"
    // true：包含真实路径
    // "mock": 包含伪造路径
    // "eval-only": 仅在编译时定义
    // false: 禁用所有处理
  },
  recordsPath: path.resolve(__dirname, "build/records.json"),
  recordsInputPath: path.resolve(__dirname, "build/records.json"),
  recordsOutputPath: path.resolve(__dirname, "build/records.json"),
  // 将ID存储到文件中，以使构建更具确定性

  /* 高级缓存配置 */
  cache: false, // boolean
  // 禁用/启用缓存
  snapshot: {
    managedPaths: [ path.resolve(__dirname, "node_modules") ],
    // 仅使用package.json名称和版本作为快照的路径
    immutablePaths: [ path.resolve(__dirname, ".yarn/cache") ],
    // 路径不需要更改，因为它们是不可变的
    module: { timestamp: true, hash: true },
    resolve: { timestamp: true, hash: false },
    resolveBuildDependencies: { timestamp: true, hash: false },
    buildDependencies: { timestamp: true, hash: true },
    // 不同操作的快照方法
  },
  watch: true, // boolean
  // 启用 watch 模式
  watchOptions: {
    aggregateTimeout: 1000, // 以毫秒为单位
    // 将多个修改聚合到单个 rebuild
    poll: true,
    poll: 500, // 以毫秒为间隔单位
    // 在 watch 模式中启用轮询
    // 必须用在不通知更改的文件系统中
    // 即 nfs shares
  },

  /* 高级构建配置 */
  infrastructureLogging: {
    level: "none",
    level: "error",
    level: "warn",
    level: "info", // (default)
    level: "log",
    level: "verbose",
    debug: true,
    debug: /webpack/,
    debug: [ "MyPlugin", /webpack/ ]
  },
  parallelism: 1, // number
  // 限制并行处理模块的数量
  profile: true, // boolean
  // 捕获定时信息
  bail: true, //boolean
  // 在第一个错误上失败而不是跳过它。
  dependencies: ["name"],
  // 当使用配置数组时，可以用来引用其他
  // 配置，并在初始构建时让此配置在其他配置之后运行
}
```