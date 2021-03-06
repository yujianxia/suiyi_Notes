# 第5天 写一个把字符串大小写切换的方法
---

## 思路一

字母大小写在Unicode 中相差32位来计算

### 解法一

```js
function caseConvert(str) {
  return str.split('').map(s => {
    const code = s.charCodeAt();
    if (code < 65 || code > 122 || code > 90 && code < 97) return s;
    
    if (code <= 90) {
      return String.fromCharCode(code + 32)
    } else {
      return String.fromCharCode(code - 32)
    }
  }).join('')
}

console.log(caseConvert('AbCdE')) // aBcDe 

function caseConvertEasy(str) {
  return str.split('').map(s => {
    if (s.charCodeAt() <= 90) {
      return s.toLowerCase()
    }
    return s.toUpperCase()
  }).join('')
}

console.log(caseConvertEasy('AbCxYz')) // aBcXyZ 
```

## 思路二

正则判断

### 解法一

```js
function caseConvert(str){
    return str.replace(/([a-z]*)([A-Z]*)/g, (m, s1, s2)=>{
	    return `${s1.toUpperCase()}${s2.toLowerCase()}`
    })
}
caseConvert('AsA33322A2aa') //aSa33322a2AA
```