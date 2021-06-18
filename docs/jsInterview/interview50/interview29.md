# 第29天 写一个获取数组的最大值、最小值的方法

## 思路一

es6

```js
Math.max.apply(Array,[25,62,91,78,34,62]) //  91
Math.min.apply(Array,[27,64,90,78,34,62]) // 27
```

## 总结

- ES5
```js
Math.max.apply(null, array);
```
```js
array.sort((a, b) => a - b);
const max = array[array.length - 1],
      min = array[0];

```
- ES6
```js
Math.max(...array);
Math.min(...array);
```
```js
arr.reduce((prev, cur) => Math.max(prev, cur));
arr.reduce((prev, cur) => prev = prev > cur ? prev : cur);
```

## 思路二

# 1. 排序法

首先我们对数组进行排序，可以按照升序排序，也可以按照降序排序。排序之后的数组中的第一个和最后一个元素就是我们需要的最大值或最小值。

排序可以使用`sort()`方法

```js
// 方法一:排序法
arr.sort(function (a, b) {
    // 升序排序
    return a - b;
})

maxValue = arr[arr.length - 1];
minValue = arr[0];
console.log('最大值为:', maxValue); // 91
console.log('最小值为:', minValue); // 25
```

# 2. 假设法

可以假设数组中的第一个值是最大值，然后拿这个最大值和数组中的其他元素逐一比较，如果后面的某一个值比假设的值还大，说明假设错了，我们把假设的值进行替换，将这个值赋假设为新的最大值。循环结束后，拿到的结果就是我们想要的。最小值反之。

```js
// 假设第一个数组元素就是数组中的最大值
maxValue = arr[0];
for (let i = 0; i < arr.length; i++) {
    let cur = arr[i];
    // 如果当前元素的值比假设的最大值大，就设置当前值为最大值，继续和后面元素比较
    maxValue = cur > maxValue ? cur : maxValue;
}
console.log('最大值为:', maxValue);

// 假设第一个数组元素就是数组中的最小值
minValue = arr[0];
for (let i = 0; i < arr.length; i++) {
    let cur = arr[i];
     // 如果当前元素的值比假设的最小值小，就设置当前值为最小值，继续和后面元素比较
    minValue = cur < minValue ? cur : minValue;
}
console.log('最小值为:', minValue);
```

# 3. 使用`Math`对象中的`max/min`方法


`Math.max()`函数返回一组数中的最大值，例如：

```js
console.log(Math.max(1, 3, 2)); // 3
```

但是这个函数并不接受数组作为参数，且这个函数也不是数组对象中的方法，无法通过数组直接调用。这里我们可以使用`apply`来实现求数组中的最值，因为`apply()`方法接收的函数参数刚好是以数组方式进行传入的。

```js
// 使用apply方法,可以直接将数组作用参数传入
maxValue = Math.max.apply(null, arr);
minValue = Math.min.apply(null, arr);

console.log('最大值为:', maxValue); // 91
console.log('最小值为:', minValue); // 25
```

一个小问题：

为什么通过`apply`就可以实现数组求最值了呢？

看一下`apply`的`this`参数，上面代码中传递了一个null，也就是并没有将`Math.max()`方法绑定到其他对象上。这里只涉及到了两点：

- `Math.max()`需要传入的是多个数值
- `apply()`只需要把接收到的多个参数传递给`Math.max()`，只不过接收的多个参数是以数组形式接收的，刚好可以把数组传入，从而实现数组求最值。在`apply()`方法内部再将数组中的元素拆分成一个一个的参数值，传递给`Math.max()`即可。

# 4. 使用ES6的扩展运算符

扩展运算符可以展开数组，代替`apply()`将数组转化成函数参数的需求。

例如：

```js
function sum(x, y, z) {
    return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers)); // 6
```

那么正好可以使用这个运算符将数组展开，展开成多个数值，然后作为多个参数向`Math.max()`传入。

```js
console.log('最大值为:', Math.max(...arr)); // 91
console.log('最小值为:', Math.min(...arr)); // 25
```

[参考文章](https://www.cnblogs.com/zhouyangla/p/8482010.html)