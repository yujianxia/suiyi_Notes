# 第12天 写一个获取当前url查询字符串中的参数的方法

## 思路一

使用js方法或者正则对字符串进行切割并取得数据

### 解法一

使用js进行字符串分割以及url编码逆转

```js
function params() {
  const search = window.location.search;
  search = search.substr(1, search.length);
  const res = {};
  if (!search) return res;
  search.split('&').map(item => {
    const [key, value] = item.split('=');
    res[key] = decodeURIComponent(value);
  });
  return res;
}
```

### 解法二

使用正则进行匹配操作

```js
function urlParam(){
    const param = {};
    location.search.replace(/([^&=?]+)=([^&]+)/g,(m,$1,$2)=> param[$1] = $2);
    return param;
}
```

### 解法三

进行结构的形式进行拆分

```js
//第12天 写一个获取当前url查询字符串中的参数的方法

function params(url) {
  var kvs = url.substring(url.indexOf("?") + 1).split("&");
  var res = {};
  kvs.map(param => {
    var [key, value] = param.split("=");
    res[key] = value;
  });
  return res;
}

const url =
  "https://s.taobao.com/search?q=%E7%83%AD%E6%B0%B4%E5%A3%B6&imgfile=&commend=all&ssid=s5-e&search_type=item&sourceId=tb.index&spm=a21bo.2017.201856-taobao-item.1&ie=utf8&initiative_id=tbindexz_20170306";

const res = params(url);

console.log(res.ie);
```

### 解法四

使用正则取反的形式解析参数

```js
function getURLParams(search = '') {
    const params = Object.create(null);
    search.replace(/([^&=?]+)=([^&]+)/g, (m, $1, $2) => {
        console.log(m, $1, $2)
        params[$1] = $2;
    });
    return params;
}

console.log(getURLParams('?name=name&age=3'));
console.log(getURLParams('?name=name&&age=3'));
console.log(getURLParams('?'));
console.log(getURLParams(''));
```

> **注意**：`[^&=?]`中的`^`表示取反，意思是除了`&=?`外的其他字符