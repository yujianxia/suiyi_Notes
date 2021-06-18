#
# JavaScript实现双向链表
---

## 一、双向链表简介

**双向链表**：既可以**从头遍历到尾**，又可以**从尾遍历到头**。也就是说链表连接的过程是**双向**的，它的实现原理是：一个节点既有**向前连接的引用**，也有一个**向后连接的引用**。

### 双向链表的缺点：

* 每次在**插入或删除**某个节点时，都需要处理四个引用，而不是两个，实现起来会困难些；

* 相对于单向链表，所占**内存空间更大**一些；

* 但是，相对于双向链表的便利性而言，这些缺点微不足道。

### 双向链表的结构：

<a data-fancybox title="demo" href="/notes/assets/js/1.png">![demo](/notes/assets/js/1.png)</a>

* 双向链表不仅有**head**指针指向第一个节点，而且有**tail**指针指向最后一个节点；

* 每一个节点由三部分组成：**item**储存数据、**prev**指向前一个节点、**next**指向后一个节点；

* 双向链表的第一个节点的prev指向**null**；

* 双向链表的最后一个节点的next指向**null**；

### 双向链表常见的操作（方法）：

* `append（element）`：向链表尾部添加一个新的项；

* `inset（position，element）`：向链表的特定位置插入一个新的项；

* `get（element）`：获取对应位置的元素；

* `indexOf（element）`：返回元素在链表中的索引，如果链表中没有元素就返回-1；

* `update（position，element）`：修改某个位置的元素；

* `removeAt（position）`：从链表的特定位置移除一项；

* `isEmpty（）`：如果链表中不包含任何元素，返回`trun`，如果链表长度大于0则返回`false`；

* `size（）`：返回链表包含的元素个数，与数组的`length`属性类似；

* `toString（）`：由于链表项使用了`Node`类，就需要重写继承自`JavaScript`对象默认的`toString`方法，让其只输出元素的值；

* `forwardString（）`：返回正向遍历节点字符串形式；

* `backwordString（）`：返回反向遍历的节点的字符串形式；

## 二、封装双向链表类

### 2.0.创建双向链表类

先创建双向链表类`DoubleLinklist`，并添加基本属性，再实现双向链表的常用方法：

```js
//封装双向链表类
function DoubleLinklist(){
    //封装内部类：节点类
    function Node(data){
        this.data = data
        this.prev = null
        this.next = null
    }

    //属性
    this.head = null
    this.tail ==null
    this.length = 0
}
```

### 2.1.append(element)

**代码实现：**

```js
//append方法
DoubleLinklist.prototype.append = data => {
    //1.根据data创建新节点
    let newNode = new Node(data)

    //2.添加节点
    //情况1：添加的是第一个节点
    if (this.length == 0) {
        this.tail = newNode
        this.head = newNode 
    //情况2：添加的不是第一个节点
    }else {
        newNode.prev = this.tail
        this.tail.next = newNode
        this.tail = newNode
    }

    //3.length+1
    this.length += 1
}
```

### 过程详解：

添加节点时分为多种情况：

* 情况1：添加的是第一个节点：只需要让head和tail都指向新节点即可；

<a data-fancybox title="demo" href="/notes/assets/js/2.png">![demo](/notes/assets/js/2.png)</a>

* 情况2：添加的不是第一个节点，如下图所示：只需要改变相关引用的指向即可。
    
    * 通过：`newNode.prev = this.tail`：建立指向1；
    
    * 通过：`this.tail.next = newNode`：建立指向2；
    
    * 通过：`this.tail = newNode`：建立指向3

要注意改变变量指向的顺序，最后修改`tail`指向，这样未修改前`tail`始终指向原链表的最后一个节点。

<a data-fancybox title="demo" href="/notes/assets/js/3.png">![demo](/notes/assets/js/3.png)</a>

<a data-fancybox title="demo" href="/notes/assets/js/4.png">![demo](/notes/assets/js/4.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()

//2.测试append方法
list.append('aaa')
list.append('bbb')
list.append('ccc')
console.log(list);
```

**测试结果：**

* next方向：

<a data-fancybox title="demo" href="/notes/assets/js/5.png">![demo](/notes/assets/js/5.png)</a>

* prev方向：

<a data-fancybox title="demo" href="/notes/assets/js/6.png">![demo](/notes/assets/js/6.png)</a>

### 2.2.toString()汇总

**代码实现：**

```js
//将链表转变为字符串形式
//一.toString方法
DoubleLinklist.prototype.toString = () => {
    return this.backwardString()
}

//二.forwardString方法
DoubleLinklist.prototype.forwardString = () => {
    //1.定义变量
    let current =this.tail
    let resultString = ""

    //2.依次向前遍历，获取每一个节点
    while (current) {
        resultString += current.data + "--"
        current = current.prev 
    }
    return resultString
}

//三.backwardString方法
DoubleLinklist.prototype.backwardString = () => {
    //1.定义变量
    let current = this.head
    let resultString = ""

    //2.依次向后遍历，获取每一个节点
    while (current) {
        resultString += current.data + "--"
        current = current.next
    }
    return resultString
}
```

**过程详解：**

三种获取字符串的方法：**toString（）**、**forwardString（）**、**backwardString（）**实现原理相似，仅以`backWardString`方法为例：

* 定义`current`变量记录当前指向的节点。首先让`current`指向第一个节点，然后通过 `current = current.next` 依次向后遍历。在`while`循环中以(`current`)作为条件遍历链表，只要`current ！= null`就一直遍历，由此可获取链表所有节点的数据。

<a data-fancybox title="demo" href="/notes/assets/js/7.png">![demo](/notes/assets/js/7.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()

//2.测试字符串方法   
list.append('aaa')
list.append('bbb')
list.append('ccc')
console.log(list.toString());
console.log(list.forwardString());
console.log(list.backwardString());
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/8.png">![demo](/notes/assets/js/8.png)</a>

### 2.3.insert(position,element)

**代码实现：**

```js
//insert方法
DoubleLinklist.prototype.insert = (position, data) => {
    //1.越界判断
    if (position < 0 || position > this.length) return false

    //2.根据data创建新的节点
    let newNode = new Node(data)

    //3.插入新节点
    //原链表为空
        //情况1：插入的newNode是第一个节点
    if (this.length == 0) {
        this.head = newNode
        this.tail = newNode
    //原链表不为空
    }else {
        //情况2：position == 0
        if (position == 0) {
        this.head.prev = newNode
        newNode.next = this.head
        this.head = newNode
        //情况3：position == this.length 
        } else if(position == this.length){
        this.tail.next = newNode
        newNode.prev = this.tail
        this.tail = newNode
        //情况4：0 < position < this.length
        }else{
        let current = this.head
        let index = 0
        while(index++ < position){
            current = current.next
        }
        //修改pos位置前后节点变量的指向
        newNode.next = current
        newNode.prev = current.prev
        current.prev.next = newNode
        current.prev = newNode
        }
    }
    //4.length+1
    this.length += 1
    return true//返回true表示插入成功
}
```

**过程详解：**

插入节点可分为多种情况：

**当原链表为空时：**

* 情况1：插入的新节点是链表的第一个节点；只需要让`head`和`tail`都指向`newNode`即可。

<a data-fancybox title="demo" href="/notes/assets/js/9.png">![demo](/notes/assets/js/9.png)</a>

**当原链表不为空时：**

* 情况2：当`position == 0`，即在链表的首部添加节点：如下图所示：

    <a data-fancybox title="demo" href="/notes/assets/js/10.png">![demo](/notes/assets/js/10.png)</a>

    * 首先，通过：`this.head.prev = newNode`，改变指向1；

    * 然后，通过：`newNode.next = this.head`，改变指向2；

    * 最后，通过：`this.head = newNode`，改变指向3；

    <a data-fancybox title="demo" href="/notes/assets/js/11.png">![demo](/notes/assets/js/11.png)</a>

* 情况3：`position == this.length`，即在链表的尾部添加节点，如下图所示：

    <a data-fancybox title="demo" href="/notes/assets/js/12.png">![demo](/notes/assets/js/12.png)</a>

    * 首先，通过：`this.tail.next = newNode`，改变指向1；（注意这里使用this.tail指向原链表最后一个节点，而不是this.head。因为**当length>1时，this.head != this.tail**。）
    
    * 然后，通过：`newNode.prev = this.tail`，改变指向2；
    
    * 最后，通过：`this.tail = newNode`，改变指向3；

    <a data-fancybox title="demo" href="/notes/assets/js/13.png">![demo](/notes/assets/js/13.png)</a>

* 情况4：`0 < position < this.length`，即在链表的中间插入新节点，假设在`position = 1`的位置插入，如下图所示：

    <a data-fancybox title="demo" href="/notes/assets/js/14.png">![demo](/notes/assets/js/14.png)</a>

首先，需要定义变量`current`按照之前的思路，通过`while`循环找到`position`位置的后一个节点，循环结束后`index = position`

<a data-fancybox title="demo" href="/notes/assets/js/15.png">![demo](/notes/assets/js/15.png)</a>

如下图所示：当`position = 1`时，`current`就指向了`Node2`。这样操作`current`就等同于间接地操作`Node2`，还可以通过`current.prev`间接获取`Node1`。得到了`newNode`的前一个节点和后一个节点就可以通过改变它们的`prev`和`next`变量的指向来插入`newNode`了。

<a data-fancybox title="demo" href="/notes/assets/js/16.png">![demo](/notes/assets/js/16.png)</a>

* 通过：`newNode.next = current`，改变指向1；

* 通过：`newNode.prev = current.prev`，改变指向2；

* 通过：`current.prev.next = newNode`，改变指向3；

> 注意必须最后才修改`current.prev`的指向，不然就无法通过`current.prev`获取需要操作的`Node1`了。

* 通过：`current.prev = current`，改变指向4；

<a data-fancybox title="demo" href="/notes/assets/js/17.png">![demo](/notes/assets/js/17.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()

//2.测试insert方法
list.insert(0, '插入链表的第一个元素')
list.insert(0, '在链表首部插入元素')
list.insert(1, '在链表中间插入元素')
list.insert(3, '在链表尾部插入元素')
console.log(list);
alert(list)
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/18.png">![demo](/notes/assets/js/18.png)</a>

<a data-fancybox title="demo" href="/notes/assets/js/19.png">![demo](/notes/assets/js/19.png)</a>

### 2.4.get(position)

**代码实现：**

```js
//get方法
DoubleLinklist.prototype.get = position => {
    //1.越界判断
    if (position < 0 || position >= this.length) {//获取元素时position不能等于length
        return null
    }

    //2.获取元素
    let current = null
    let index = 0
    //this.length / 2 > position:从头开始遍历
    if ((this.length / 2) > position) {
        current = this.head
        while(index++ < position){
        current = current.next
    }
    //this.length / 2 =< position:从尾开始遍历
    }else{
        current = this.tail
        index = this.length - 1
        while(index-- > position){
            current = current.prev
        }
    }
    return current.data
}
```

**过程详解：**

定义两个变量`current`和`index`，按照之前的思路通过while循环遍历分别获取当前节点和对应的索引值`index`，直到找到需要获取的`position`位置后的一个节点，此时`index = pos =x`，然后`return current.data`即可。

如果链表的节点数量很多时，这种查找方式效率不高，改进方法为：

> 一定要通过this.length来获取链表的节点数否则就会报错。

* 当`this.length / 2 > position`：从头（head）开始遍历；

* 当`this.length / 2 < position`：从尾（tail）开始遍历；

<a data-fancybox title="demo" href="/notes/assets/js/20.png">![demo](/notes/assets/js/20.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()

//2.测试get方法
list.append('a')
list.append('b')
list.append('b1')
list.append('b2')
list.append('b3')
list.append('b4')
list.append('b5')
list.append('b6')
list.append('b7')
console.log(list.get(0));
console.log(list.get(7));
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/21.png">![demo](/notes/assets/js/21.png)</a>

### 2.5.indexOf(element)

**代码实现：**

```js
//indexOf方法
DoubleLinklist.prototype.indexOf = data => {
    //1.定义变量
    let current = this.head
    let index = 0

    //2.遍历链表，查找与data相同的节点
    while(current){
        if (current.data == data) {
            return index
        }
        current = current.next
        index += 1
    }
    return -1
}
```

**过程详解：**

以（`current`）作为条件，通过while循环遍历链表中的所有节点（停止条件为`current = null`）。在遍历每个节点时将`current`指向的当前节点的`data`和传入的`data`进行比较即可。

<a data-fancybox title="demo" href="/notes/assets/js/22.png">![demo](/notes/assets/js/22.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()

//2.测试indexOf方法
list.append('a')
list.append('b')
list.append('c')
console.log(list.indexOf('a'));
console.log(list.indexOf('c'));
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/23.png">![demo](/notes/assets/js/23.png)</a>

### 2.7.update(position,element)

**代码实现：**

```js
//update方法
DoubleLinklist.prototype.update = (position, newData) => {
    //1.越界判断
    if (position < 0 || position >= this.length) {
        return false
    }

    //2.寻找正确的节点
    let current = this.head
    let index = 0
    //this.length / 2 > position:从头开始遍历
    if (this.length / 2 > position) {
        while(index++ < position){
        current = current.next
    }
    //this.length / 2 =< position:从尾开始遍历
    }else{
        current = this.tail
        index = this.length - 1
        while (index -- > position) {
            current = current.prev
        }
    }

    //3.修改找到节点的data
    current.data = newData
    return true//表示成功修改
}
```

**过程详解：**

以（`index++ < position`）为条件，通过while循环遍历链表中的节点（停止条件为`index = position`）。循环结束后，`current`指向需要修改的节点。

<a data-fancybox title="demo" href="/notes/assets/js/24.png">![demo](/notes/assets/js/24.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()

//2.测试update方法
list.append('a')
list.append('b')
console.log(list.update(1, 'c'));
console.log(list);
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/25.png">![demo](/notes/assets/js/25.png)</a>

### 2.8.removeAt(position)

**代码实现：**

```js
//removeAt方法
DoubleLinklist.prototype.removeAt = position => {
    //1.越界判断
    if (position < 0 || position >= this.length) {
        return null
    }
    
    //2.删除节点
    //当链表中length == 1
    //情况1：链表只有一个节点
    let current = this.head//定义在最上面方便以下各种情况返回current.data
    if (this.length == 1) {
        this.head = null
        this.tail = null
    //当链表中length > 1
    } else{
        //情况2：删除第一个节点
        if (position == 0) {
        this.head.next.prev = null
        this.head = this.head.next
        //情况3：删除最后一个节点
        }else if(position == this.length - 1){
        current = this.tail//该情况下返回被删除的最后一个节点
        this.tail.prev.next = null
        this.tail = this.tail.prev
        }else{
        //情况4：删除链表中间的节点
        let index = 0
        while(index++ < position){
            current = current.next
        }
        current.next.prev = current.prev
        current.prev.next = current.next
        }
    }

    //3.length -= 1
    this.length -= 1
    return current.data//返回被删除节点的数据
}
```

**过程详解：**

删除节点时有多种情况：

**当链表的length = 1时：**

* 情况1：删除链表中的所有节点：只需要让链表的head和tail指向null即可。

    <a data-fancybox title="demo" href="/notes/assets/js/26.png">![demo](/notes/assets/js/26.png)</a>

**当链表的length > 1时：**

* 情况2：删除链表中的第一个节点：

    * 通过：`this.head.next.prev = null`，改变指向1；

    * 通过：`this.head = this.head.next`，改变指向2；

    * 虽然`Node1`有引用指向其它节点，但是没有引用指向`Node1`，那么`Node1`会被自动回收

    <a data-fancybox title="demo" href="/notes/assets/js/27.png">![demo](/notes/assets/js/27.png)</a>

* 情况3：删除链表中的最后一个节点：

    * 通过：`this.tail.prev.next = null`，修改指向1；

    * 通过：`this.tail = this.tail.prev`，修改指向2；

    <a data-fancybox title="demo" href="/notes/assets/js/28.png">![demo](/notes/assets/js/28.png)</a>

* 情况4：删除链表中间的节点：

    * 通过`while`循环找到需要删除的节点，比如`position = x`，那么需要删除的节点就是`Node(x+1)`，如下图所示：

    <a data-fancybox title="demo" href="/notes/assets/js/29.png">![demo](/notes/assets/js/29.png)</a>
    
    * 通过：`current.next.prev = current.prev`，修改指向1；
    
    * 通过：`current.prev.next = current.next`，修改指向2；
    
    * 这样就没有引用指向`Node(x+1)`了（`current`虽指向`Node(x+1)`，但`current`时临时变量，该方法执行完就会被销毁），随后`Node(x+1)`就会被自动删除。

    <a data-fancybox title="demo" href="/notes/assets/js/30.png">![demo](/notes/assets/js/30.png)</a>

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()	

//2.测试removeAt方法
list.append('a')
list.append('b')
list.append('c')
console.log(list.removeAt(1));
console.log(list);
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/31.png">![demo](/notes/assets/js/31.png)</a>

### 2.9.其他方法

其他方法包括：**remove(element)**、**isEmpty()**、**size()**、**getHead()**、**getTail()**

**代码实现：**

```js
/*--------------------其他方法-------------------*/
//八.remove方法
DoubleLinklist.prototype.remove = data => {
    //1.根据data获取下标值
    let index = this.indexOf(data)

    //2.根据index删除对应位置的节点
    return this.removeAt(index)
}

//九.isEmpty方法
DoubleLinklist.prototype.isEmpty = () => {
    return this.length == 0
}

//十.size方法
DoubleLinklist.prototype.size = () => {
    return this.length
}

//十一.getHead方法：获取链表的第一个元素
DoubleLinklist.prototype.getHead = () => {
    return this.head.data
}

//十二.getTail方法：获取链表的最后一个元素
DoubleLinklist.prototype.getTail = () => {
    return this.tail.data
}
```

**测试代码：**

```js
//测试代码
//1.创建双向链表
let list = new DoubleLinklist()	

/*------------其他方法的测试--------------*/
list.append('a')
list.append('b')
list.append('c')
list.append('d')
//remove方法
console.log(list.remove('a'));
console.log(list);
//isEmpty方法
console.log(list.isEmpty());
//size方法
console.log(list.size());
//getHead方法
console.log(list.getHead());
//getTead方法
console.log(list.getTail());
```

**测试结果：**

<a data-fancybox title="demo" href="/notes/assets/js/32.png">![demo](/notes/assets/js/32.png)</a>

### 2.10.完整实现

```js
//封装双向链表
function DoubleLinklist(){
  //封装内部类：节点类
  function Node(data){
    this.data = data
    this.prev = null
    this.next = null
  }

  //属性
  this.head = null
  this.tail ==null
  this.length = 0

  //常见的操作：方法
  //一.append方法
  DoubleLinklist.prototype.append = data => {
    //1.根据data创建新节点
    let newNode = new Node(data)

    //2.添加节点
    //情况1：添加的是第一个节点
    if (this.length == 0) {
      this.tail = newNode
      this.head = newNode 
    //情况2：添加的不是第一个节点
    }else {
      newNode.prev = this.tail
      this.tail.next = newNode
      this.tail = newNode
    }

    //3.length+1
    this.length += 1
  }

  //二.将链表转变为字符串形式
  //2.1.toString方法
  DoubleLinklist.prototype.toString = () => {
    return this.backwardString()
  }

  //2.2.forwardString方法
  DoubleLinklist.prototype.forwardString = () => {
    //1.定义变量
    let current =this.tail
    let resultString = ""

    //2.依次向前遍历，获取每一个节点
    while (current) {
      resultString += current.data + "--"
      current = current.prev 
    }
    return resultString
  }

  //2.3.backwardString方法
  DoubleLinklist.prototype.backwardString = () => {
    //1.定义变量
    let current = this.head
    let resultString = ""

    //2.依次向后遍历，获取每一个节点
    while (current) {
      resultString += current.data + "--"
      current = current.next
    }
    return resultString
  }

  //三.insert方法
  DoubleLinklist.prototype.insert = (position, data) => {
    //1.越界判断
    if (position < 0 || position > this.length) return false

    //2.根据data创建新的节点
    let newNode = new Node(data)

    //3.插入新节点
    //原链表为空
      //情况1：插入的newNode是第一个节点
    if (this.length == 0) {
      this.head = newNode
      this.tail = newNode
    //原链表不为空
    }else {
      //情况2：position == 0
      if (position == 0) {
        this.head.prev = newNode
        newNode.next = this.head
        this.head = newNode
      //情况3：position == this.length 
      } else if(position == this.length){
        this.tail.next = newNode
        newNode.prev = this.tail
        this.tail = newNode
        //情况4：0 < position < this.length
      }else{
        let current = this.head
        let index = 0
        while(index++ < position){
          current = current.next
        }
        //修改pos位置前后节点变量的指向
        newNode.next = current
        newNode.prev = current.prev
        current.prev.next = newNode
        current.prev = newNode
      }
    }
    //4.length+1
    this.length += 1
    return true//返回true表示插入成功
  }

  //四.get方法
  DoubleLinklist.prototype.get = position => {
    //1.越界判断
    if (position < 0 || position >= this.length) {//获取元素时position不能等于length
      return null
    }

    //2.获取元素
    let current = null
    let index = 0
    //this.length / 2 > position:从头开始遍历
    if ((this.length / 2) > position) {
      current = this.head
      while(index++ < position){
      current = current.next
    }
    //this.length / 2 =< position:从尾开始遍历
    }else{
      current = this.tail
      index = this.length - 1
      while(index-- > position){
      current = current.prev
    }
    }
    return current.data
  }

  //五.indexOf方法
  DoubleLinklist.prototype.indexOf = data => {
    //1.定义变量
    let current = this.head
    let index = 0

    //2.遍历链表，查找与data相同的节点
    while(current){
      if (current.data == data) {
        return index
      }
      current = current.next
      index += 1
    }
    return -1
  } 

  //六.update方法
  DoubleLinklist.prototype.update = (position, newData) => {
    //1.越界判断
    if (position < 0 || position >= this.length) {
      return false
    }

    //2.寻找正确的节点
    let current = this.head
    let index = 0
    //this.length / 2 > position:从头开始遍历
    if (this.length / 2 > position) {
      while(index++ < position){
      current = current.next
    }
    //this.length / 2 =< position:从尾开始遍历
    }else{
      current = this.tail
      index = this.length - 1
      while (index -- > position) {
        current = current.prev
      }
    }

    //3.修改找到节点的data
    current.data = newData
    return true//表示成功修改
  }

  //七.removeAt方法
  DoubleLinklist.prototype.removeAt = position => {
    //1.越界判断
    if (position < 0 || position >= this.length) {
      return null
    }
    
    //2.删除节点
    //当链表中length == 1
    //情况1：链表只有一个节点
    let current = this.head//定义在最上面方便以下各种情况返回current.data
    if (this.length == 1) {
      this.head = null
      this.tail = null
    //当链表中length > 1
    } else{
      //情况2：删除第一个节点
      if (position == 0) {
        this.head.next.prev = null
        this.head = this.head.next
      //情况3：删除最后一个节点
      }else if(position == this.length - 1){
        current = this.tail//该情况下返回被删除的最后一个节点
        this.tail.prev.next = null
        this.tail = this.tail.prev
      }else{
      //情况4：删除链表中间的节点
        let index = 0
        while(index++ < position){
          current = current.next
        }
        current.next.prev = current.prev
        current.prev.next = current.next
      }
    }

    //3.length -= 1
    this.length -= 1
    return current.data//返回被删除节点的数据
  }
  /*--------------------其他方法-------------------*/
  //八.remove方法
  DoubleLinklist.prototype.remove = data => {
    //1.根据data获取下标值
    let index = this.indexOf(data)
    
    //2.根据index删除对应位置的节点
    return this.removeAt(index)
  }

  //九.isEmpty方法
  DoubleLinklist.prototype.isEmpty = () => {
    return this.length == 0
  }

  //十.size方法
  DoubleLinklist.prototype.size = () => {
    return this.length
  }

  //十一.getHead方法：获取链表的第一个元素
  DoubleLinklist.prototype.getHead = () => {
    return this.head.data
  }

  //十二.getTail方法：获取链表的最后一个元素
  DoubleLinklist.prototype.getTail = () => {
    return this.tail.data
  }
}
```

## 三、链表结构总结

单向链表有`head`和`next`两个属性，双向链表有`head`、`tail`、`next`、`prev`四个属性。处理好它们的指向，相当于将它们正确地连接在一起，这样就组成了一条链，这就是简单链表的实现。

在实际开发中链表使用得非常多，比如Java中的**LinkList**就是双向链表。

### 3.1.注意点

* 在链表中`current = current.next` 可以从左往右看，看成是`current` --> `current.next`，即`current`指向`current`的下一个节点。

* 删除节点的原理：只要没有引用指向该对象，无论该对象是否有引用指向其他对象，该对象都会被回收（删除）。

* 参数中凡是有`position`的都要进行越界判断。

### 3.2.链表的增删改查

以双向链表为例：**链表的增删改查无非就是获取链表中相应的节点改变其中的prev和next两个变量的指向**。

* **情况一**：只需要`head`和`tail`两个变量就可以获取需要操作的变量（这里指的是能够轻松获取，当然你想通过`head.next.next...`或`tail.prev.prev...`来获取想要的节点也可以），在这种情况下链表的长度`length：0 <= length <=2`。

* **情况二**：不能靠`tail`和`head`来获取到需要操作的变量时，可采用while循环遍历的方式，找到需要操作的节点：

<a data-fancybox title="demo" href="/notes/assets/js/33.png">![demo](/notes/assets/js/33.png)</a>

在这种情况下，如果想要在链表的position = x的位置插入新节点，那么可以通过current获取position的后一个节点Node(x+1)，通过current.prev获取position位置的前一个节点Node(x)；之后修改Node(x+1)和Node(x)中的prev和next两个变量的指向即可在pos=x 的位置插入新节点。

<a data-fancybox title="demo" href="/notes/assets/js/34.png">![demo](/notes/assets/js/34.png)</a>

### 3.3.修改链表引用指向

**应先修改newNode引用的指向，再修改其他引用**

* **情况1：**通过head和tail引用就能获取需要操作的节点时，最后更改head或tail变量的指向（因为它们分别指向链表的第一个和最后一个节点，获取其他节点时可能需要用到它们）。

* **情况2：**使用current获取到需要操作的节点时，最后更改curren.next或current.prev的指向。因为current.next和current.prev表示的是Node(x+2)和Node(x)这两个节点，如下图所示，一旦变更它们的指向就无法获取Node(x)或Node(x+2)了，

<a data-fancybox title="demo" href="/notes/assets/js/35.png">![demo](/notes/assets/js/35.png)</a>


### 3.4.遍历链表

**积累两种遍历思路**

* 获取指定的position = x 位置的后一个节点和索引值：

    <a data-fancybox title="demo" href="/notes/assets/js/36.png">![demo](/notes/assets/js/36.png)</a>

    <a data-fancybox title="demo" href="/notes/assets/js/37.png">![demo](/notes/assets/js/37.png)</a>

    循环结束后`index = position = x`，变量`current`就指向了`Node(x+1)`，变量`index`的值为`Node(x+1)`的索引值x。

* 遍历链表中的所有节点：

    <a data-fancybox title="demo" href="/notes/assets/js/38.png">![demo](/notes/assets/js/38.png)</a>

    <a data-fancybox title="demo" href="/notes/assets/js/39.png">![demo](/notes/assets/js/39.png)</a>

    当`current.next = null`时停止循环，此时`current`指向链表的最后一个节点。