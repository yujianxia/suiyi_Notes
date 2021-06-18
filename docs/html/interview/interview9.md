`viewport` 就是视区窗口，也就是浏览器中显示网页的部分。PC 端上基本等于设备显示区域，但在移动端上 viewport 会超出设备的显示区域（即会有横向滚动条出现）。
设备默认的 `viewport` 在 980 - 1024 之间。

为了让移动端可以很好地显示页面，因此需要对 viewport 进行设置。相关的设置值如下：

| 属性名 | 取值	| 描述 |
| ---- | ---- | ---- |
| width | 正整数 & device-width	| 定义视口的宽度，单位为像素 |
| height | 正整数 & device-height | 定义视口的高度，单位为像素，一般不用 |
| initial-scale	| [0.0-10.0] | 定义初始缩放值 |
| minimum-scale	| [0.0-10.0] | 定义缩小最小比例，它必须小于或等于maximum-scale设置 |
| maximum-scale	| [0.0-10.0] | 定义放大最大比例，它必须大于或等于minimum-scale设置 |
| user-scalable	| yes & no | 定义是否允许用户手动缩放页面，默认值yes |

`viewport` 是在 `meta` 标签内进行控制。

```html
// width=device-width, initial-scale=1.0 是为了兼容不同浏览器
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
/>
```

相关的衍生知识： dpr 与 CSS 像素。CSS 像素的 1px 在 PC 端上与设备的物理像素基本一致，而到手机端就会有两个物理像素对应一个 CSS 像素的情况出现（如 iPhone 的视网膜屏）。
所以 iPhone 上的 dpr = 2 即 2 个物理像素 / 一个 CSS 像素（独立像素）