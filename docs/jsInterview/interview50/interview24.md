# 第24天 如何快速让一个数组乱序，写出来

## 思路一

使用`array.sort()`进行乱序存在一定问题，增大样本进行实验之后可以发现这种乱序方案并不是完全随机的（所有元素会大概率停留在自己的初始位置）（v8处理排序是小于10个是插入排序，大于10个是快排，排序算法复杂度介于O(n)与O(n2)之间，也就是存在两个元素都没有比较的机会，因此不是完全随机），这里可以使用Fisher–Yates shuffle（洗牌算法）

```js
Array.prototype.shuffle = function() {
    var input = this;
    for (var i = input.length-1; i >=0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}
var tempArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
tempArray.shuffle();
console.log(tempArray);
```

## 思路二

为什么楼上要用三元运算符，直接这样不就完事了。。
```js
arr.sort((a, b) => Math.random() - .5)
```

不过我们team随机算法也用的洗牌算法，思路就是从后往前遍历，然后随机(0, i+1)，交换

```js
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    [array[i], array[j]] = [array[j], array[i]]
  }
}
```

前面有些, 为啥发之前不先测试下...
加个判断吧.
```javascript
function shuffle (arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    let j = Math.floor(Math.random() * len)
    if (i !== j) [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

console.log(shuffle([1,2,3,4,5,6,7,8,9,0]))
```
<a data-fancybox title="image" href="https://user-images.githubusercontent.com/10903843/61680936-0b429000-ad3e-11e9-971d-02d90647eeb3.png">![image](https://user-images.githubusercontent.com/10903843/61680936-0b429000-ad3e-11e9-971d-02d90647eeb3.png)</a>

## 思路三

```javascript
function messArr(arr) {
  let newIndex = [];
  let newArr = [];
  while (newIndex.length < arr.length) {
    let num = Math.floor(Math.random() * arr.length);
    if (!newIndex.includes(num)) {
      newIndex.push(num);
    }
  }
  for (let index in newIndex) {
    newArr.push(arr[newIndex[index]]);
  }
  return newArr
}
var arr = ['广西', '上海', '北京', '云南'];
console.log(messArr(arr));
```

## 思路四

```js
Array.prototype.shuffle = function () {
    let _this = this
    for(let i = _this.length - 1; i >= 0; i--){
    let randomIndex = Math.floor(Math.random() * (_this.length - 1))
    let temp = _this[randomIndex]
    _this[randomIndex] = _this[i]
    _this[i] = temp
    }
    return _this
}
var tempArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
tempArray.shuffle();
console.log(tempArray);
```

照着上面的大佬敲了一遍，感觉randomIndex这里一直用数组的长度-1会不会好一点啊

## 思路五

```js
function shuffle(arr){
  return arr.sort(() => {
    return Math.random() - 0.5
  })
}

function shuffle2(arr){
  const a = [...arr]
  const res = []

  while (a.length) {
    const idx = Math.floor(Math.random() * a.length)

    res.push(...a.splice(idx, 1))
  }

  return res
}

const arr = [1,2,3,4,5,6,7,8]

console.log(shuffle(arr))
console.log(shuffle2(arr))

// [ 7, 2, 1, 5, 6, 4, 3, 8 ]
// [ 2, 8, 1, 5, 3, 6, 4, 7 ]
```