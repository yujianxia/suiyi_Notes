#
# 获取localStorage和sessionStorage当前已存储大小

## 代码

```js
function get_cache_size(t){
    t = t == undefined ? "l" : t;
    var obj = "";
    if(t==='l'){
        if(!window.localStorage) {
            console.log('浏览器不支持localStorage');
        }else{
            obj = window.localStorage;
        }
    }else{
        if(!window.sessionStorage) {
            console.log('浏览器不支持sessionStorage');
        }else{
            obj = window.sessionStorage;
        }
    }
    if(obj!==""){
        var size = 0;
        for(item in obj) {
            if(obj.hasOwnProperty(item)) {
                // 第一种
                // size += obj.getItem(item).length;
                // 第二种
                size += unescape(encodeURIComponent(obj.getItem(item))).length;
            }
        }
        console.log('当前已用存储：' + (size / 1024).toFixed(2) + 'KB');
    }
}
get_cache_size('l');//localStorage当前大小
get_cache_size('s');//sessionStorage当前大小
```

## 结果

1. 第一种

**str.length**

直接字符串 length 获取存储空间

```js
str.length
```

<a data-fancybox title="demo" href="/notes/assets/browser/1618191151(1).jpg">![demo](/notes/assets/browser/1618191151(1).jpg)</a>

<a data-fancybox title="demo" href="/notes/assets/browser/1618191246(1).jpg">![demo](/notes/assets/browser/1618191246(1).jpg)</a>

内容大小相差过大原因是字符串存储并非按字符串进行存储因此如果直接统计字符串大小则会表现失真

2. 第二种

**encodeURIComponent()**

`encodeURIComponent()`函数通过将一个，两个，三个或四个表示字符的UTF-8编码的转义序列替换某些字符的每个实例来编码

举个栗子
```js
// encodes characters such as ?,=,/,&,:
console.log(`?x=${encodeURIComponent('test?')}`);
// expected output: "?x=test%3F"

console.log(`?x=${encodeURIComponent('шеллы')}`);
// expected output: "?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"
```

`encodeURIComponent()` 和 `encodeURI` 有以下几个不同点：

```js
var set1 = ";,/?:@&=+$";  // 保留字符
var set2 = "-_.!~*'()";   // 不转义字符
var set3 = "#";           // 数字标志
var set4 = "ABC abc 123"; // 字母数字字符和空格

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)
```

**unescape**

`unescape()` 函数可对通过 `escape()` 编码的字符串进行解码。

该函数的工作原理是这样的：通过找到形式为 %xx 和 %uxxxx 的字符序列（x 表示十六进制的数字），用 Unicode 字符 \u00xx 和 \uxxxx 替换这样的字符序列进行解码。

<a data-fancybox title="demo" href="/notes/assets/browser/1618192263(1).jpg">![demo](/notes/assets/browser/1618192263(1).jpg)</a>

<a data-fancybox title="demo" href="/notes/assets/browser/1618192308(1).jpg">![demo](/notes/assets/browser/1618192308(1).jpg)</a>

## 结论

字符串的存储不像字符串展示一样，因为编码解码的缘故会解析为固定编码才能进行存储，因此在获取存储大小不应简单使用表现出的编码来直接进行计算