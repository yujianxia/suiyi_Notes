# 第8天 写一个加密字符串的方法

## 思路一

自带的方法进行加密解密

### 解法一

仅支持浏览器端：

```js
function encode (str) {
	return btoa(encodeURIComponent(str));
}

function decode (str) {
	return decodeURIComponent(atob(str));
}
```

### 解法二

```js
// 利用 base64, 浏览器环境自带 btoa / atob 方法
// Node.js 需要引入相关库
const str = "abcdefg";

console.log(btoa(str));
console.log(atob(btoa(str)));

// 凯撒密码
const encodeCaesar = ({str = "", padding = 3}) =>
  !str
    ? str
    : str
        .split("")
        .map((s) => String.fromCharCode(s.charCodeAt() + padding))
        .join("");

const decodeCaesar = ({str = "", padding = 3}) =>
  !str
    ? str
    : str
        .split("")
        .map((s) => String.fromCharCode(s.charCodeAt() - padding))
        .join("");

console.log(encodeCaesar({str: "hello world"}));
console.log(decodeCaesar({str: "khoor#zruog"}));
```

## 思路三

随机密文字符串

### 特点:

每次生成的密文都不一样,解密后的文本一致

### 加密:

将字符串中的字符拆分成数组并将每个字符元素转为他的八进制Unicode码->反序->分割字符串->在字符串中随机加入小写字母->将分割符替换为随机大写字母

这样最终生成了 由`数字`/`小写字母`/`大写字母` 构成的随机密文

### 解密:

去掉小写字母->将大写字母替换成一个统一分割符并用分割符拆分字符串为数组->反序->将八进制Unicode码转字符串->将数组合并成字符串

### 使用场景:

隐藏一些不想让用户直接看见的参数, 比如 url中的 id 等参数,cookies中的信息等

> 生成动态密文的函数:

```js
function encodeStr(str) {
    if (!str) return;

    var random = function (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    };

    var arr = str.toString().split("").map(function (item) {
        return item.charCodeAt(0).toString(8)
    });

    arr.reverse();//反序数组
    arr = arr.join("_").split("");//暂时使用 _ 分割字符串;
    var num = 0;
    while (num < str.length) {
        var r = String.fromCharCode(random(97, 122));//生成用于混淆的  的 小写字母
        arr.splice(random(0, arr.length), 0, r);
        num++;
    }
    return arr.join("").replace(/_/ig, function (str) {
        return String.fromCharCode(random(65, 90));
    });//将分割符 _ 替换为随机的 大写字母

}
```

**效果:**

```
encodeStr("测试")
"105725C665q13q"
encodeStr("测试")
"1k05725Vn66513"
encodeStr("测试")
"105725E6c651y3"
```

> 解析动态密文的函数:

```js
function decodeStr(str) {
    if (!str) return;
    var temp = [];
    str.split("").forEach(function (item) {
        var code = item.charCodeAt(0);
        if (code <= 90 && code >= 65) {
            item = "_";//将作为分割用的 随机大写字母 统一为 _  以便切割
            temp.push(item);
        }else if (code <= 57 && code >= 48) {
            temp.push(item);//提取 数字
        }
    });
    temp = temp.join("").split("_");
    temp.reverse();
    var res = temp.map(function (item) {
        return String.fromCharCode(parseInt(item, 8));
    });

    return res.join("");

}
```