#
# 用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值

**这一题是起源题**

## 这一题是起源题
描述：

1. 这是一道大题目，把考点拆成了4个小项；需要侯选人用递归算法实现（限制15行代码以内实现；限制时间10分钟内完成）：
   a) 生成一个长度为5的空数组arr。
   b) 生成一个（2－32）之间的随机整数rand。
   c) 把随机数rand插入到数组arr内，如果数组arr内已存在与rand相同的数字，则重新生成随机数rand并插入到arr内[需要使用递归实现，不能使用for/while等循环]
   d) 最终输出一个长度为5，且内容不重复的数组arr。

## 第一种解法

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

但是有个问题主要在于随机数，而且没有扩展

## 第二种解法

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

但是还是存在随机数的问题

* 另外用四舍五入也是不对的，因为最小值和最大值只有其它值概率的一半。

* 仔细一看，虽然自定义了最大最小参数，但是递归的时候没有传入，所以并没有卵用。i 参数的初衷是自定义从哪里开始插入，实用性也没有

## 第三种解法

```js
function buildArray(arr, length, min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!arr.includes(num)) { arr.push(num); }
    return arr.length === length ? arr : buildArray(arr, length, min, max);
}
var result = buildArray([], 5, 2, 32);
console.table(result);
```

**补充**：

题目要求”生成一个（2－32）之间的随机整数rand“，既然是随机，觉得意为取值到区间内各数的概率应该是相等的。所以像这样的写法是不严谨的：

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

解决了随机数的问题

## 第四种解法

```js
function getFiveRamdomSet(arr) {
    if(arr.length >= 5) return arr
    const randomNumber  = ~~ (Math.random() * 30 + 2)
    const newArr = Array.from(new Set(arr.concat(randomNumber)))
    return getFiveRamdomSet(newArr)
}
getFiveRamdomSet([])
```

**该种解法在于没有生成一个5位的空数组**

* a步骤并不是多余的, 其中影藏一个考点是不使用for,等循环语句, 来判断是否达到5个正确的值了, 以及当前产生的数字要放到数组的那个位置, 也还有就是生成 空数组的技巧. 

    * const arr = Array(5); 

    * const arr = new Array(5); 

    * const arr = [];

    * arr.length = 5; 

这几种方式都能生成空的, 长度为5的数组. 

## 第五种解法

```js
const arr = []
const obj = {}
const len = 100000
for (let i = 0; i <= len; i++) {
    arr.push(i)
    obj[i] = true
}
console.time('Array.includes')
for (let i = 0; i <= len; i++) {
    arr.includes(i)
}
console.timeEnd('Array.includes')
console.time('Obnject.keys')
for (let i = 0; i <= len; i++) {
    if (i === len) {
        Object.keys(obj).map(Number)
    }
}
console.timeEnd('Obnject.keys')
```

**结果**

<a data-fancybox title="demo" href="/notes/assets/js/1618194838(1).jpg">![demo](/notes/assets/js/1618194838(1).jpg)</a>

[Array.prototype.includes](https://www.ecma-international.org/ecma-262/7.0/#sec-array.prototype.includes) 规范，可以看出 includes 是通过遍历去查询是否存在 searchElement 元素的，这也是其速度不及 对象索引 快的原因了

