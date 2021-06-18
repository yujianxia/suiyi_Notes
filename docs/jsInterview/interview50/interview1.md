# 第1天 用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值
---

这一题是起源题
描述：

1.  这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）：
    a) 生成一个长度为5的空数组arr。
    b) 生成一个（2－32）之间的随机整数rand。
    c) 把随机数rand插入到数组arr内，如果数组arr内已存在与rand相同的数字，则重新生成随机数rand并插入到arr内[需要使用递归实现，不能使用for/while等循环]
    d) 最终输出一个长度为5，且内容不重复的数组arr。

## 解法一

```js
var arr = new Array(5);
var num = randomNumber();
var i = 0;
randomArr(arr,num);
function randomArr(arr,num) {
    if (arr.indexOf(num)< 0){
        arr[i] = num;
        i++;
    } else {
        num = randomNumber();
    }
    if (i>=arr.length){
        console.log(arr);
        return;
    }else{
        randomArr(arr,num)
    }
}
function randomNumber() {
    return Math.floor(Math.random()*31 + 2)
}
```

## 解法二

考虑一下扩展性

```js
function insertArr(arr, i = 0, min = 2, max = 32) {
  const num = Math.max(min, Math.ceil(Math.random() * max))
  if (!arr[arr.length - 1]) {
    if (!arr.includes(num)) { 
      arr[i++] = num
    }
    return insertArr(arr, i) 
  }
  return arr 
}
const arr = new Array(5);
const result = insertArr(arr)
```

这里的随机数算法是有问题的，另外用四舍五入也是不对的，因为最小值和最大值只有其它值概率的一半。

仔细一看，虽然自定义了最大最小参数，但是递归的时候没有传入，所以并没有卵用。i 参数的初衷是自定义从哪里开始插入，实用性也不算好。

## 解法三

```js
var arr = new Array(5);
function insertRandom(n) {
  if (n < 0) return
  let tmp = Math.floor(Math.random() * 31 + 2)
  if (arr.indexOf(tmp) !== -1) return insertRandom(n)
  arr[n] = tmp
  return insertRandom(n - 1)
}
insertRandom(arr.length - 1)
```

## 解法四

```js
// 6 行写完
function buildArray(arr, length, min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!arr.includes(num)) { arr.push(num); }
    return arr.length === length ? arr : buildArray(arr, length, min, max);
}
var result = buildArray([], 5, 2, 32);
console.table(result);
```

补充：
题目要求”生成一个（2－32）之间的随机整数rand“，既然是随机，我觉得意为取值到区间内各数的概率应该是相等的。所以像这样的写法是不严谨的：

```js
// 在 2 - 5 区间内生成随机数
var min = 2, max = 5;
var result = Math.max(min, Math.ceil(Math.random() * max));
// 参数一 param1 恒等于 2
// 参数二 param2 在 [0, 5] 之间等概取值
// 可能性见下
// param1 2 2 2 2 2 2
// param2 0 1 2 3 4 5
// result 2 2 2 3 4 5
```
可见 result 取到 2 的概率大于 3/4/5

## 解法五

```js
/***
 * 性能达到最优》考虑时间复杂度（避免使用Math.random去随机到不重复数字）
 * 最终优化,当如果取随机数为30个的时候，那么最后面几个数会很小几率随机到，优化思路，将随机 
 * 数初始时放置数组，取值后剔除
 */
function getRandom1(n, min = 2, max = 32) {
    //如果取值数量大于最大随机数，将最随机数最大值提高
    if (n > (max - min)) {
    max += n - (max - min);
    }
    //使用创建的指定数量空数组 keys 下标直接填充，避免 for循环填充
    var initArray = Array.from(new Array(max + 1).keys()).splice(min);

    return function insert(resArrayRandom) {
    if (resArrayRandom.length == n) {
        return resArrayRandom;
    }
    //获取剩余数组随机下标
    var indexRandom = parseInt(Math.random() * initArray.length);
    resArrayRandom.push(initArray[indexRandom]);
    initArray.splice(indexRandom, 1);
    return insert(resArrayRandom);
    }([])
}

let beginTime2 = new Date().getTime();
getRandom1(1000)
console.log("优化取随机数 后耗时：", new Date().getTime() - beginTime2)
```