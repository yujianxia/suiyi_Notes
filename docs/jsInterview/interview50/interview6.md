# 第6天 写一个去除制表符和换行符的方法
---

## 思路一

使用正则进行匹配

### 解法一

```js
/**
 * \f  匹配换页字符。
 * \n  匹配换行字符。
 * \r  匹配回车符字符。
 * \t  匹配制表字符。
 * \v  匹配垂直制表符。
 * \b 退格符 backspace
 * @param str
 * @returns {void | string}
 */
const removeEmpty = (str) => str.replace(/[\t\n\v\r\f\b]/g, "");

console.log(removeEmpty(`|
  
   
|`))
```