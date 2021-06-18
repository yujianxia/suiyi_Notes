#
# 一、Webpack 原理
---

## 1、构建作用

构建工具就是将源代码转换成可执行的 `JavaScript`、`CSS`、`HTML` 代码，包括以下内容：

* **代码转换：** 将 `TypeScript` 编译成 `JavaScript`、将 `SCSS` 编译成 `CSS` 等；

* **文件优化：** 压缩 `JavaScript`、`CSS`、`HTML` 代码，压缩合并图片等；

* **代码分割：** 提取多个页面的公共代码，提取首屏不需要执行部分的代码，让其异步加载；

* **模块合并：** 在采用模块化的项目里会有很多个模块和文件，需要通过构建功能将模块分类合并成一个文件；

* **自动刷新：** 监听本地源代码的变化，自动重新构建、刷新浏览器；

* **代码校验：** 在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过；

* **自动发布：** 更新代码后，自动构建出线上发布代码并传输给发布系统；

## 2、核心概念

Webpack 有以下几个核心概念：

* **Entry：** 入口，Webpack 执行构建的第一步将从 `entry` 开始，可抽象成输入；

* **Module：** 模块，配置处理模块的规则；在 Webpack 里一切皆模块，一个模块对应一个文件；Webpack 会从配置的 `Entry` 开始递归找出所有依赖的模块；

* **Loader：** 模块转换器，用于将模块的原内容按照需求转换成新内容；

* **Resolve：** 配置寻找模块的规则；

* **Plugin：** 扩展插件，在 Webpack 构建流程中的特定时机会广播对应的事件，插件可以监听这些事情的发生，在特定的时机做对应的事情；

* **Output：** 输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果；

* **Chunk：** 代码块，一个 `Chunk` 由多个模块组合而成，用于代码合并与分割；

## 3、流程概述

（1）初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；

（2）开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，通过执行对象的 run 方法开始执行编译；

（3）确定入口：根据配置中的 entry 找出所有入口文件；

（4）编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；

（5）完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容及它们之间的依赖关系；

（6）输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再将每个 Chunk 转换成一个单独的文件加入输出列表中，这是可以修改输出内容的最后机会；

（7）输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，将文件的内容写入文件系统中；

在以上过程中，`Webpack` 会在特定的时间点广播特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `Webpack` 提供的 API 改变 `Webpack` 的运行结果；

# 二、Webpack 配置
---

## 1、Webpack 项目初始化

### 1、新建 Web 项目

新建一个目录，再进入项目根目录执行 `npm init` 来初始化最简单的采用了模块化开发的项目；最终生成 `package.json` 文件；

```shell
$ npm init
```

### 2、安装 Webpack 到本项目

（1）查看 Webpack 版本

运行以下命令可以查看 Webpack 的版本号

```shell
$ npm view webpack versions
```

（2）安装 Webpack

可以选择（1）步骤罗列得到的 Webpack 版本号，也可以安装最新稳定版、最新体验版本，相关命令如下所示，选择安装 4.28.2 版本（没有为什么，就想装个 4.x 的版本）；

```shell
// 安装指定版本
npm i -D webpack@4.28.2

// 安装最新稳定版
npm i -D webpack

// 安装最新体验版本
npm i -D webpack@beta
```

（3）安装 Webpack 脚手架

需要安装 `Webpack` 脚手架，才能在命令窗口执行 `Webpack` 命令，运行以下命令安装 `Webpack` 脚手架；

```shell
$ npm i -D webpack-cli
```

### 3、使用 Webpack

使用 Webpack 构建一个采用 `CommonJS` 模块化编写的项目；

（1）新建页面入口文件 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webpack</title>
</head>
<body>
<!--导入 Webpack 输出的 JavaScript 文件-->
<script src="./dist/bundle.js"></script>  
</body>
</html>
```

（2）新建需要用到的 JS 文件

> show.js 文件

```js
// 操作 DOM 元素，把 content 显示到网页上
function show(content) {
  window.document.getElementById('app').innerText = 'Hello,' + content;
}

// 通过 CommonJS 规范导出 show 函数
module.exports = show;
```

> main.js 文件

```js
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

（3）新建 Webpack 配置文件 webpack.config.js

```js
const path = require('path');

module.exports = {
  // JavaScript 执行入口文件
  entry: './main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

（4）执行 webpack 命令进行构建

在 `package.json` 文件中配置编译命令，如下所示：

```json
"scripts": {
    "build": "webpack --config webpack.config.js",
},
```

执行以下命令进行项目的 `Webpack` 编译，成功后会在项目根目录下生成编译目录 `dist` ；

```shell
$ npm run build
```

（5）运行 index.html

编译成功后，用浏览器打开 `index.html` 文件，能看到页面成功显示 “Hello Webpack”；

## 2、Loader 配置

本节通过为之前的例子添加样式，来尝试使用 `Loader`；

### （1）新建样式文件 main.css

```css
#app{
  text-align: center;
  color:'#999';
}
```

### （2）将 main.css 文件引入入口文件 main.js 中，如下所示：

```js
// 通过 CommonJS 规范导入 CSS 模块
require('./main.css');

// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

### （3）Loader 配置

以上修改后去执行 `Webpack` 构建是会报错的，因为 `Webpack` 不原生支持解析 `CSS` 文件。要支持非 `JavaScript` 类型的文件，需要使用 `Webpack` 的 `Loader` 机制；

（3.1）运行以下命令，安装 `style-loader` 和 `css-loader`，其中：

* `css-loader` 用于读取 `CSS` 文件；

* `style-loader` 把 `CSS` 内容注入到 `JavaScript` 中；

```shell
$ npm i -D style-loader css-loader
```

（3.2）进行以下配置

```js
module:{
    rules:[
        {
            // 用正则去匹配要用该 loader 转换的 CSS 文件
            test:/\.css$/,
            use:['style-loader','css-loader']
        }
    ]
}
```

### （4）查看结果

编译后，刷新 `index.html` ，查看刚刚的样式 `loader` 已经起作用；

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdeb77f673c.jpg">![demo](/notes/assets/webpack/16f8ccdeb77f673c.jpg)</a>

## 3、Plugin 配置

### （1）安装样式提取插件 extract-text-webpack-plugin

```shell
$ npm i -D extract-text-webpack-plugin@next
```

### （2）plugin 文件配置如下

```js
module:{
    rules:[
        {
            // 用正则去匹配要用该 loader 转换的 CSS 文件
            test:/\.css$/,
            use:ExtractTextPlugin.extract({
                use:['css-loader']
            }),
        }
    ]
},
plugins:[
    new ExtractTextPlugin({
        // 从 .js 文件中提取出来的 .css 文件的名称
        filename:`[name]_[hash:8].css`
    }),
]
```

### （3）查看结果

通过以上配置后，执行 `Webapack` 的执行命令，发现在 `dist` 目录下，生成对应的 `css` 文件；存在的坑点：

* 需要手动将生成的 `css` 文件引入到 `index.html` 中；

* 修改 `css` 文件后，会生成新的 `css` 文件，原先的不会删除；

## 4、使用 DevServer

### （1）执行以下命令安装 webpack-dev-server

```shell
$ npm i -D  webpack-dev-server
```

在 package.json 中配置启动命令

```json
"scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server",
},
```

运行命令后，就可以启动 `HTTP` 服务

```shell
$ npm run dev
```

启动结果如下所示，可以通过 `http://localhost:8080/` 访问的 `index.html` 的demo

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdec2f9318d.jpg">![demo](/notes/assets/webpack/16f8ccdec2f9318d.jpg)</a>

### （2）实时预览

在运行命令后面添加参数 `--watch` 实现实时预览，配置如下所示：

```json
"scripts": {
    "dev": "webpack-dev-server --watch"
},
```

> 在 `index.html` 中需要将 js 的路径修改为：

```html
<script src="bundle.js"></script>  
```

而不能是之前的（因为这个是编译生成的，并不是通过 `devServer` 生成放在内存的）

```html
<script src="./dist/bundle.js"></script> 
```

### （3）模块热替换

可以通过配置 `--hot` 进行模块热替换；

# 四、编写 Loader
---

## 1、Loader 要点总结

### （1）Loader 为模块转换器，用于将模块的原内容按照需求转换成新内容；

### （2）Loader 的职责是单一的，只需要完成一种转换，遵守单一职责原则；

### （3）Webpack 为 Loader 提供了一系列 API 供 Loader 调用，例如：

* `loader-utils.getOptions( this )` 获取用户传入的 options，

* `this.callback( )` 自定义返回结果，

* `this.async( )` 支持异步操作；

* `this.context` 当前文件所在的目录；

* `this.resource` 当前处理文件的完整请求路径；

## 2、编写 loader 源码

### （1）源码编写

在原有的项目底下，新建目录 `custom-loader` 作为编写 `loader` 的名称，执行 `npm init` 命令，新建一个模块化项目，然后新建 `index.js` 文件，相关源码如下：

```js
function convert(source){
  return source && source.replace(/hello/gi,'HELLO');
}

module.exports = function(content){
  return convert(content);
}
```

### （2）Npm link 模块注册

正常安装 `Loader` 是从 `Npm` 公有仓库安装，也即将 `Loader` 发布到 `Npm` 仓库，然后再安装到本地使用；但是可以使用 `Npm link` 做到在不发布模块的情况下，将本地的一个正在开发的模块的源码链接到项目的 `node_modules` 目录下，让项目可以直接使用本地的 `Npm` 模块；

在 `custom-loader` 目录底下，运行以下命令，将本地模块注册到全局：

```shell
$ npm link
```

成功结果如下：

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdeb2b4fa5e.jpg">![demo](/notes/assets/webpack/16f8ccdeb2b4fa5e.jpg)</a>

然后在项目根目录执行以下命令，将注册到全局的本地 `Npm` 模块链接到项目的 `node_modules` 下：

```shell
$ npm link custom-loader
```

成功结果如下，并且在 `node_modules` 目录下能查找到对应的 `loader`；

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdebc0fc0bb.jpg">![demo](/notes/assets/webpack/16f8ccdebc0fc0bb.jpg)</a>

## 3、Webpack 中配置编写的 loader

该配置跟第一章节的 `Webpack` 配置并没有任何区别，这里不再详述，配置参考如下：

```js
module:{
    rules:[
        {
            test:/\.js/,
            use:['custom-loader'],
            include:path.resolve(__dirname,'show')
        }
    ]
}
```

执行运行 `or` 编译命令，就能看到的 `loader` 起作用了。

# 五、编写 Plugin
---

## 1、Plugin 要点总结

* `Webpack` 在编译过程中，会广播很多事件，例如 `run`、`compile`、`done`、`fail` 等等，可以查看官网；

* `Webpack` 的事件流机制应用了观察者模式，编写的插件可以监听 `Webpack` 事件来触发对应的处理逻辑；

* 插件中可以使用很多 `Webpack` 提供的 `API`，例如读取输出资源、代码块、模块及依赖等；

## 2、编写 Plugin 源码

手写一个 `plugin` 源码，其功能是在 `Webpack` 编译成功或者失败时输出提示；当然这个 `plugin` 其实没啥实际意义，纯碎是为了写 `plugin` 而写 `plugin`；当然如果你实际业务有需要编写 `plugin` 需求，那就要反思这个业务的合理性，因为庞大的社区，一般合理的需求都能找到对应的 `plugin`。

### （1）源码编写

在原有的项目底下，新建目录 `custom-plugin` 作为编写 `plugin` 的名称，执行 `npm init` 命令，新建一个模块化项目，然后新建 `index.js` 文件，相关源码如下：

```js
class CustomPlugin{
    constructor(doneCallback, failCallback){
        // 保存在创建插件实例时传入的回调函数
        this.doneCallback = doneCallback;
        this.failCallback = failCallback;
    }
    apply(compiler){
        // 成功完成一次完整的编译和输出流程时，会触发 done 事件
        compiler.plugin('done',(stats)=>{
            this.doneCallback(stats);
        })
        // 在编译和输出的流程中遇到异常时，会触发 failed 事件
        compiler.plugin('failed',(err)=>{
            this.failCallback(err);
        })
    }
}
module.exports = CustomPlugin;
```

### （2）Npm link 模块注册

跟 `Loader` 注册一样，使用 `npm link` 进行注册；

在 `custom-plugin` 目录底下，运行以下命令，将本地模块注册到全局：

```shell
$ npm link
```

然后在项目根目录执行以下命令，将注册到全局的本地 `Npm` 模块链接到项目的 `node_modules` 下：

```shell
$ npm link custom-plugin
```

如果一切顺利，可以在 `node_modules` 目录下能查找到对应的 `plugin`；

## 3、Webpack 中配置编写的 plugin

```js
plugins:[
    new CustomPlugin(
        stats => {console.info('编译成功!')},
        err => {console.error('编译失败!')}
   ),
],
```

执行运行 `or` 编译命令，就能看到的 `plugin` 起作用了。

# 六、踩坑汇总
---

## 1、css-loader 以下配置

```js
rules:[
    {
        // 用正则去匹配要用该 loader 转换的 CSS 文件
        test:/\.css$/,
        use:['style-loader','css-loader?minimize']
    }
]
```

报以下错误:

```
 - options has an unknown property 'minimize'. These properties are valid:
   object { url?, import?, modules?, sourceMap?, importLoaders?, localsConvention?, onlyLocals?, esModule? }
```

**原因：**

`minimize` 属性在新版本已经被移除，

**解决：**

先去掉 `minimize` 选项；

## 2、ExtractTextPlugin 编译以下错误：

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdec2ef858f.jpg">![demo](/notes/assets/webpack/16f8ccdec2ef858f.jpg)</a>

**原因：**

`extract-text-webpack-plugin` 版本号问题

**解决：**

重新安装 `extract-text-webpack-plugin`

```shell
$ npm i -D extract-text-webpack-plugin@next
```

## 3、修复第2个坑之后，ExtractTextPlugin 编译继续报以下错误：

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdeb8188d88.jpg">![demo](/notes/assets/webpack/16f8ccdeb8188d88.jpg)</a>

**原因：**

不存在 `contenthash` 这个变量

**解决：**

更改 `extract-text-webpack-plugin` 的配置：

```js
plugins:[
    new ExtractTextPlugin({
       // 从 .js 文件中提取出来的 .css 文件的名称
       filename:`[name]_[hash:8].css`
    }),
]
```

## 4、添加 HappyPack 后，编译 CSS 文件时报以下错误：

<a data-fancybox title="demo" href="/notes/assets/webpack/16f8ccdf66204a16.jpg">![demo](/notes/assets/webpack/16f8ccdf66204a16.jpg)</a>

**原因：**

`css-loader` 版本的问题

**解决：**

重新安装 `css-loader@3.2.0`