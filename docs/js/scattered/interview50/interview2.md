#
# 写一个方法去掉字符串中的空格

## 概述

* 可以全部去掉字符串中的空格

    * 也可以仅去掉前面的空格

    * 也可以仅去掉中间的空格

    * 也可以仅去掉后面的空格

## 思路

可以用正则的方式，也可以使用js的方法

## 方法1 正则

```js
var trim = function(str){
return str.replace(/\s*/g,"");
}
str.replace(/\s*/g,""); //去除字符串内所有的空格
str.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
str.replace(/^\s*/,""); //去除字符串内左侧的空格
str.replace(/(\s*$)/g,""); //去除字符串内右侧的空格
```

**通用性设置**

```js
const str = '  s t  r  '

const POSITION = Object.freeze({
  left: Symbol(),
  right: Symbol(),
  both: Symbol(),
  center: Symbol(),
  all: Symbol(),
})

function trim(str, position = POSITION.both) {
  if (!!POSITION[position]) throw new Error('unexpected position value')
  
  switch(position) {
      case(POSITION.left):
        str = str.replace(/^\s+/, '')
        break;
      case(POSITION.right):
        str = str.replace(/\s+$/, '')
        break;
      case(POSITION.both):
        str = str.replace(/^\s+/, '').replace(/\s+$/, '')
        break;
      case(POSITION.center):
        while (str.match(/\w\s+\w/)) {
          str = str.replace(/(\w)(\s+)(\w)/, `$1$3`)
        }
        break;
      case(POSITION.all):
        str = str.replace(/\s/g, '')
        break;
      default: 
  }
  
  return str
}

const result = trim(str)

console.log(`|${result}|`) //  |s t  r| 
```

## 方法2 js

```js
function removeSpace (str, type) {
    if (type === 'before') {
        // 递归去除字符串前面的空格
        return (str && str[0] === ' ')? removeSpace(str.substring(1), type): str;
    } else if (type === 'after') {
        // 递归去除字符串后面的空格
        return (str && str[0] && str[str.length - 1] === ' ')? removeSpace(str.substring(0, str.length-1), type): str;
    } else if (type === 'before-after') {
        // 递归去除字符串前后的空格
        return (str = removeSpace(str, 'before')) && (str = removeSpace(str, 'after'));
    } else if (type === 'between') {
        // 递归去除字符串中间的空格
        // 首先找到 'x y'类型的字符位置
        let x = y = 0;
        outer:
        for (let i = 0; i < str.length - 1; i ++) {
            if (str[i] !== ' ' && str[i+1] === ' ') {
                x = i;
                let j = i + 2;
                while(j < str.length && str[j] === ' ') {
                    j++;
                }
                if (j < str.length) {
                    y = j;
                }
                break outer;
            }
        }
        return y !== 0? removeSpace(str.substring(0, x + 1) + str.substring(y), type): str;
    } else {
        throw new Error('类型错误!');
    }
}
```

<a data-fancybox title="demo" href="/notes/assets/js/1618196824(1).jpg">![demo](/notes/assets/js/1618196824(1).jpg)</a>