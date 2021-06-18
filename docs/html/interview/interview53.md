### 网站 favicon 图标

favicon.ico 一般用于作为缩略的网站标志，它显示在浏览器的地址栏或者标签上。目前主要的浏览器都支持 favicon.ico 图标。

#### 1、制作favicon图标

- 把图标切成 `png` 图片
- 把 `png` 图片转换为 `ico` 图标，这需要借助于第三方转换网站，例如比特虫：http://www.bitbug.net/

#### 2、使用favicon图标

- favicon图标放到网站根目录下
- HTML页面引入favicon图标

在html 页面里面的 元素之间引入代码

```html
 <link rel="shortcut icon" href="favicon.ico"  type="image/x-icon"/> 
```

常用尺寸：`16*16 32*32 48*48`

[挖矿](https://juejin.im/pin/5a88f2d96d6def49864b74f4)