不只是域名，这种问题针对的是不同环境的个性化环境变量如何设置的问题。
解决思路：打包时通过nodejs来设置环境变量

以下为`create-react-app`中如何处理该问题的示例

```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:staging": "export REACT_APP_STAGE=dev && npm run build"
  }
}
```

```js
// in react component
const stage = process.env.REACT_APP_STAGE
```

如果是CRA的项目的话，可以使用`.env` `.env.development` `.env.production`文件来区分不同的环境；
比如生产环境域名`http://www.prod.com`，开发环境域名`http://www.deve.com`，
则可以分别设置`REACT_APP_BASE_URL = 'http://www.prod.com'`和`REACT_APP_BASE_URL = 'http://www.deve.com'`，
然后在程序中使用`process.env.REACT_APP_BASE_URL`来获取基础路径，此时打包的时候会根据不同的环境打包不同的域名