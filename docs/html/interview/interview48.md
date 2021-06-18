### demo

用 a 标签就可以，原理是使用 deeplink 。

```html
<a href="yourapp://page/xxx" ></a>
```

总结来说，Deeplink，又叫深度链接技术，是指在App/短信/广告里点击链接，能直接跳转到目标App具体位置的技术，深度链接打破了网站与App间的壁垒，成为实现网站与App相互跳转的桥梁。开发者不仅可以通过deeplink实现网站到App互相跳转，也可以实现从多个平台（QQ、微信、微博、Twitter、Facebook、短信、各大浏览器等）到App内指定页的跳转。例如用户将电商App内的一个详情页链接通过短信形式发送给其他亲友，用户点击短信内的链接就能打开对应的H5页面，然后直接跳转到电商App内的指定详情页，而不是App首页。如果用户并未安装App，那么就会跳转到App下载页面。等用户安装打开App后仍然能跳转到指定页面。Deeplink技术不仅可以实现场景快速还原，缩短用户使用路径，更重要的是能够用于App拉新推广场景，降低用户流失率。

1. URL Scheme——iOS9和安卓6以前

在iOS 9和安卓6（M）之前，移动端实现Deeplink的方式都是通过URL Scheme。URL，都很清楚，weixin://dl/moments就是一个 URL，也叫它链接或网址；Scheme，表示的是一个 URL 中最初始的位置，即 ://之前的那段字符，例如这个URL中的Scheme就是weixin。可以用Scheme来定位对应的App。例如淘宝的Scheme就是taobao、支付宝的Scheme就是alipay，新浪微博的Scheme是sinaweibo。

2. URL Scheme 协议格式

一般来说整段的URL Scheme是这种的形式：Scheme://host:port/path?query=xxxxxxx。其中path代表了想要跳转的指定页面，而query代表了想要传递的参数。

3. URL Scheme缺点

* 只能通过固定协议格式的链接来实现跳转，而且打开H5页面时，会出现一个提示框：“是否打开XXX”。用户确认了才会跳转到App中，增加了用户流程

* 微信、QQ等把URL Scheme 打开App这种方式给禁了，但是它们都各自维护着一个白名单，如果Scheme不在该白名单内，那么就不能在他们的App内打开这个App（如果被封锁了那么用户只能通过右上角浏览器内打开App）