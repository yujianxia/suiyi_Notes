打包优化的问题解决思路：

* 代码压缩：[`UglifyjsWebpackPlugin`](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/)

* 代码分组 [`commonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin/), [`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/)

* 网络传输压缩gzip: [`CompressionWebpackPlugin`](https://www.webpackjs.com/plugins/compression-webpack-plugin/)

* 抽取css代码：[`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin)

* 组件动态加载：[`react-loadable`](https://github.com/jamiebuilds/react-loadable)