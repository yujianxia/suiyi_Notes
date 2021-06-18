# 第30天 写一个方法判断字符串是否为回文字符串

把上边各位的答案做了一下总结

[题目链接](https://leetcode-cn.com/problems/valid-palindrome/)

> 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
> 说明：本题中，我们将空字符串定义为有效的回文串。
>
> 示例 1:
>
> 输入: "A man, a plan, a canal: Panama"
> 输出: true
> 示例 2:
>
> 输入: "race a car"
> 输出: false

这个题的关键点在于判断字符串（长度为`n`）的第`i`个字符和第`(n - 1) - i`字符是否相等

```
'1 2 3 4 3 2 1 '  =>  length -> 7
 0 1 2 3 4 5 6
 str[0] == str[6]
 str[1] == str[5]
 str[2] == str[4]
```

#### 方法一

使用for循环进行遍历

```js
/**
 * @description: 判断字符串是否是回文字符串
 * @param {string} str
 * @return {boolean} 
 */
function isPalindrome(str) {
    if (str.length === 1) return true;
    str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    for (let i = 0; i < str.length; i++) {
        if (str[i] != str[str.length - 1 - i]) {
            return false;
        }
    }
    return true;
}
```

#### 方法二

通过数组反转字符，然后再和原字符串进行比较

```js
/**
 * @description: 判断字符串是否是回文字符串
 * @param {string} str 
 * @return {boolean} 
 */
function isPalindrome(str) {
    if (str.length === 1) return true;
    str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const strReverse = str.split('').reverse().join('');
    return str == strReverse;
}
```

#### 方法三

双指针遍历，从两边向中间进行遍历。其实和第一种方法中的for循环中if语句的判断条件类似

```js
function isPalindrome(str) {
    if (str.length === 1) return true;
    str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    let lp = 0,
        rp = str.length - 1;
    while (lp <= rp) {
        // 这里lp再进行str[lp]运算,然后再自增
        if (str[lp++] != str[rp--]) {
            return false;
        }
    }
    return true;
}
```
