# 第7天 统计某一字符或字符串在另一个字符串中出现的次数
---

## 思路一

按照出现过就不能重复出现的思路

### 解法一

```js
function strCount(str, target) {
  let count = 0
  if (!target) return count
  while(str.match(target)) {
    str = str.replace(target, '')
    count++
  }
  return count
}

console.log(strCount('abcdef abcdef a', 'abc'))
```

### 解法二

```js
function substrCount(str, target) {
  let count = 0;
  while (str.includes(target)) {
    const index = str.indexOf(target);
    count++;
    str = str.substring(index + target.length);
  }
  return count;
}
```

### 解法三

```js
var childInNums = parent.split(child).length - 1;
```
