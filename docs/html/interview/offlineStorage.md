### 基础分类

* sessionStorage

* localStorage

* cookie

* webSql

* indexDB

客户端离线缓存使用manifest.appcache这种方式早就被废弃了

`Service Work` 现在已经完全普及，主流的Web框架都会集成该功能并做到开箱即用，例如 `create-react-app` 都已经集成到脚手架中，开发者不需要单独配置就可以使用离线文件缓存。

`Service Work` 工作原理是在客户端请求网站的时候，先注册`Service Work`，然后利用其拦截并缓存页面所需要的资源，当离线的时候，请求的资源会优先从`Service Work` 缓存的资源中返回。