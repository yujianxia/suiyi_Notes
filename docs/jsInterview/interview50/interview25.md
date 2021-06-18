# 第25天 写一个判断设备来源的方法

## 解法一

```js
let ua = navigator.userAgent;
  // 移动端
  isMobile: ("ontouchstart" in window || navigator.msMaxTouchPoints) ? true : false,
  // 微信
  isWechat: /micromessenger/gi.test(ua),
  // qq
  isQQ: /qq/gi.test(ua),
  // VV音乐
  isvvmusic: /vvmusic/gi.test(ua),
  // 安卓
  isAndroid: /android/gi.test(ua),
  // iOS
  isIOS: /iphone|ipad|ipod|itouch/gi.test(ua), // IOS
```

其实想说的只有判断移动端，有时候ua并不正确。所以我们会使用一些移动端的 api 来判断是不是移动端。

## 解法二

```js
function checkPlatform() {
    let userAgentInfo = navigator.userAgent;
    const Agents = ['Android', 'iPhone', 'SysbianOS', 'Windows Phone', 'iPad', 'iPod'];

    for (let i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
            return alert('当前为移动端设备，机型为：' + Agents[i]);
        }
    }
    return alert('当前为PC端');
}

checkPlatform();
```