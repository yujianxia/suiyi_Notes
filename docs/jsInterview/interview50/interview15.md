# 第15天 写一个数组去重的方法（支持多维数组）

## 思路

数组去重，可以使用es6最新的api new Set(), 但是多维数组去重可能会导致多维数组维度坍塌

### 解法一

使用递归整合多维数组

```js
function flat(arr, target) {
  arr.forEach(item => {
    if (Array.isArray(item)) {
      flat(item, target)
    } else {
      target.push(item)
    }
  })
}

function flatArr(arr) {
  let result = []
  
  flat(arr, result)
  
  return result
}

function uniqueArr(arr) {
  return [...new Set(flatArr(arr))]
}

const result = uniqueArr([1, 2, 3, 4, [3, 4, [4, 6]]])

console.log(result) // 1,2,3,4,6
```

[flat](/mozillajs/baseObject/arrayFlat.md)

### 解法二

```js
function uniqueArr(arr) {
  return [...new Set(arr.flat(Infinity))]
}
```

### 解法三

使用reduce方法使数组扁平化

```js
function dup(list) {
    let arr = flatten(list);
    let res = simple(arr);
    return res;
}
//先把他扁平化
function flatten(list) {
    const res = list.reduce((prev, current) => {
        let temp = current instanceof Array ? flatten(current) : current;
        return prev = prev.concat(temp);
    }, []);
    return res;
}

function simple(arr) {
    let res = new Set(arr);
    return [...res];
}
dup([1,2,3, [1,3,4]]);
```

### 解法四

适应复杂数组的情况

```js
function flattenArray(originArray) {
    let tempArr = [];
    for (let item of originArray) {
        if (Object.prototype.toString.call(item) === "[object Array]") {
            tempArr = [...tempArr, ...flattenArray(item)]
        } else {
            tempArr.push(item);
        }
    }
    return tempArr;
}

function removeDuplicatesFromArray(originArray) {
    if (Object.prototype.toString.call(originArray) !== "[object Array]") {
        return [originArray];
    }

    let flattenedArr = flattenArray(originArray);
    return [...new Set(flattenedArr)]
}

let arr = [
    1, 2, 3, 4, "Allen",
    { name: "Tom" },
    [2, 5, 6],
    [10, 5, [2, 6, 7]]
];

console.log(removeDuplicatesFromArray(arr));
```

## 思路二

进行字符串转换然后进行操作

### 解法一

```js
const uniqueArr = (arr) => [...new Set(arr.toString().split(','))]


console.log(uniqueArr([1, 2, 3, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1, 5, 6]));
console.log(uniqueArr([1, 2, 3, 4, 4, 3, 2, 1, [1, 2, 3, [4, 3, 2, 1]]]));
console.log(
  uniqueArr([
    1,
    2,
    3,
    [1, 2, 3, [1, 2, 3, [1, 2, 3, [1, 2, 3, [1, 2, 3, [1, 2, 3]]]]]]
  ])
);

// [ '1', '2', '3', '4', '5', '6' ]
// [ '1', '2', '3', '4' ]
// [ '1', '2', '3' ]
```