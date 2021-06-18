# 第3天 去除字符串中最后一个指定的字符

## 思路一

使用js进行最后一个字符的位置确定然后再字符串中进行操作

### 解法一

```js
function delLast (str,del) {
    if (typeof str !== 'string') {
        alert('请确认要删除的对象为字符串！');
        retrun false;
    } else {
        let index = str.lastIndexOf(del);
        return str.substring(0,index ) + str.substring(index+1,str.length);
    }
}
```

## 思路二

使用正则进行匹配进而对原字符串进行操作

```js
function delLast(str,target) {
    let reg =new RegExp(`${target}(?=([^${target}]*)$)`)
    return str.replace(reg,'')
}
```