# 第2天 写一个方法去掉字符串中的空格
---

## 思路一

使用正则表达式匹配

### 解法一

```js
var trim = function(str){
    return str.replace(/\s*/g,"");
}
str.replace(/\s*/g,""); //去除字符串内所有的空格
str.replace(/^\s*|\s*$/g,""); //去除字符串内两头的空格
str.replace(/^\s*/,""); //去除字符串内左侧的空格
str.replace(/(\s*$)/g,""); //去除字符串内右侧的空格
```

### 解法二

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

## 思路二

使用js方法替换空格

```js
string.split(' ').join('')
```