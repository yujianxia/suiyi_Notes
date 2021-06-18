# 虚拟DOM和DOM-diff

## 神奇的虚拟DOM

首先神奇不神奇的我们先不去关注，先来简单说说何为虚拟DOM

**虚拟DOM**简而言之就是，用JS去按照DOM结构来实现的树形结构对象，你也可以叫做**DOM对象**

好了，一句话就把这么伟大的东西给解释了，那么不再耽误时间了，赶紧进入主环节吧

当然，这里还有整个项目的[地址](https://github.com/chenhongdong/article/tree/develop/%E8%99%9A%E6%8B%9Fdom/dom-diff)方便查看

### 实现一下虚拟DOM

在亲自上阵之前，我们让粮草先行，先发个图，来看一下整个目录结构是什么样子的

<a data-fancybox title="demo" href="/notes/assets/react/1699a54e3737e10c.png">![demo](/notes/assets/react/1699a54e3737e10c.png)</a>

这个目录结构是用**create-react-app脚手架**直接生成的，也是为了方便编译调试

```
// 全局安装
npm i create-react-app -g
// 生成项目
create-react-app dom-diff
// 进入项目目录
cd dom-diff
// 编译
npm run start
```

现在我们开始正式写吧，从创建虚拟DOM及渲染DOM起步吧

### 创建虚拟DOM

在`element.js`文件中要实现如何创建`虚拟DOM`以及将创建出来的`虚拟DOM`渲染成`真实的DOM`

首先实现一下如何创建`虚拟DOM`，看代码：

```js
// element.js

// 虚拟DOM元素的类，构建实例对象，用来描述DOM
class Element {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}
// 创建虚拟DOM，返回虚拟节点(object)
function createElement(type, props, children) {
    return new Element(type, props, children);
}

export {
    Element,
    createElement
}
```

写好了方法，我们就从`index.js`文件入手来看看是否成功吧

### 调用createElement方法

在主入口文件里，我们主要做的操作就是来创建一个`DOM`对象，渲染`DOM`以及通过diff后去打补丁更新`DOM`，不啰嗦了，直接看代码：

```js
// index.js

// 首先引入对应的方法来创建虚拟DOM
import { createElement } from './element';

let virtualDom = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['周杰伦']),
    createElement('li', {class: 'item'}, ['林俊杰']),
    createElement('li', {class: 'item'}, ['王力宏'])
]);

console.log(virtualDom);
```

`createElement`方法也是`vue`和`react`用来创建`虚拟DOM`的方法，我们也叫这个名字，方便记忆。接收三个参数，分别是**type**，**props**和**children**

* 参数分析

    * **type**: 指定元素的标签类型，如'li', 'div', 'a'等

    * **props**: 表示指定元素身上的属性，如class, style, 自定义属性等

    * **children**: 表示指定元素是否有子节点，参数以数组的形式传入

下面来看一下打印出来的`虚拟DOM`，如下图

<a data-fancybox title="demo" href="/notes/assets/react/1698eae05b555be0.png">![demo](/notes/assets/react/1698eae05b555be0.png)</a>

到目前为止，已经轻而易举的实现了创建`虚拟DOM`。那么，接下来进行下一步，将其渲染为`真实的DOM`，别犹豫，继续回到`element.js`文件中

### 渲染虚拟DOM

```js
// element.js

class Element {
    // 省略
}

function createElement() {
    // 省略
}

// render方法可以将虚拟DOM转化成真实DOM
function render(domObj) {
    // 根据type类型来创建对应的元素
    let el = document.createElement(domObj.type);
    
    // 再去遍历props属性对象，然后给创建的元素el设置属性
    for (let key in domObj.props) {
        // 设置属性的方法
        setAttr(el, key, domObj.props[key]);
    }
    
    // 遍历子节点
    // 如果是虚拟DOM，就继续递归渲染
    // 不是就代表是文本节点，直接创建
    domObj.children.forEach(child => {
        child = (child instanceof Element) ? render(child) : document.createTextNode(child);
        // 添加到对应元素内
        el.appendChild(child);
    });

    return el;
}

// 设置属性
function setAttr(node, key, value) {
    switch(key) {
        case 'value':
            // node是一个input或者textarea就直接设置其value即可
            if (node.tagName.toLowerCase() === 'input' ||
                node.tagName.toLowerCase() === 'textarea') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        case 'style':
            // 直接赋值行内样式
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}

// 将元素插入到页面内
function renderDom(el, target) {
    target.appendChild(el);
}

export {
    Element,
    createElement,
    render,
    setAttr,
    renderDom
};
```

既然写完了，那就赶快来看看成果吧

### 调用render方法

再次回到`index.js`文件中，修改为如下代码

```js
// index.js

// 引入createElement、render和renderDom方法
import { createElement, render, renderDom } from './element';

let virtualDom = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['周杰伦']),
    createElement('li', {class: 'item'}, ['林俊杰']),
    createElement('li', {class: 'item'}, ['王力宏'])
]);

console.log(virtualDom);

// +++
let el = render(virtualDom); // 渲染虚拟DOM得到真实的DOM结构
console.log(el);
// 直接将DOM添加到页面内
renderDom(el, document.getElementById('root'));
// +++
```

通过调用`render`方法转为`真实DOM`，并调用`renderDom`方法直接将`DOM`添加到了页面内

下图为打印后的结果：

<a data-fancybox title="demo" href="/notes/assets/react/16990900e15871dd.png">![demo](/notes/assets/react/16990900e15871dd.png)</a>

截止目前，已经实现了`虚拟DOM`并进行了**渲染**`真实DOM`到页面中。

## DOM-diff闪亮登场

说到`DOM-diff`那一定要清楚其存在的意义，给定任意两棵树，采用**先序深度优先遍历**的算法找到最少的转换步骤

`DOM-diff`比较两个**虚拟DOM**的区别，也就是在比较两个对象的区别。

**作用**： 根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁用来`更新DOM`

已经了解到`DOM-diff`是干嘛的了，那就没什么好说的了，继续往下写吧

```js
// diff.js

function diff(oldTree, newTree) {
    // 声明变量patches用来存放补丁的对象
    let patches = {};
    // 第一次比较应该是树的第0个索引
    let index = 0;
    // 递归树 比较后的结果放到补丁里
    walk(oldTree, newTree, index, patches);

    return patches;
}

function walk(oldNode, newNode, index, patches) {
    // 每个元素都有一个补丁
    let current = [];

    if (!newNode) { // rule1
        current.push({ type: 'REMOVE', index });
    } else if (isString(oldNode) && isString(newNode)) {
        // 判断文本是否一致
        if (oldNode !== newNode) {
            current.push({ type: 'TEXT', text: newNode });
        }

    } else if (oldNode.type === newNode.type) {
        // 比较属性是否有更改
        let attr = diffAttr(oldNode.props, newNode.props);
        if (Object.keys(attr).length > 0) {
            current.push({ type: 'ATTR', attr });
        }
        // 如果有子节点，遍历子节点
        diffChildren(oldNode.children, newNode.children, patches);
    } else {    // 说明节点被替换了
        current.push({ type: 'REPLACE', newNode});
    }
    
    // 当前元素确实有补丁存在
    if (current.length) {
        // 将元素和补丁对应起来，放到大补丁包中
        patches[index] = current;
    }
}

function isString(obj) {
    return typeof obj === 'string';
}

function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    // 判断老的属性中和新的属性的关系
    for (let key in oldAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key]; // 有可能还是undefined
        }
    }

    for (let key in newAttrs) {
        // 老节点没有新节点的属性
        if (!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }
    return patch;
}

// 所有都基于一个序号来实现
let num = 0;

function diffChildren(oldChildren, newChildren, patches) {
    // 比较老的第一个和新的第一个
    oldChildren.forEach((child, index) => {
        walk(child, newChildren[index], ++num, patches);
    });
}

// 默认导出
export default diff;
```

代码虽然又臭又长，但是这些代码就让我们实现了`diff算法`了，所以大家先不要盲动，不要盲动，且听风吟，让我一一道来

### 比较规则

* 新的`DOM节点`不存在`{type: 'REMOVE', index}`

* 文本的变化`{type: 'TEXT', text: 1}`

* 当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包`{type: 'ATTR', attr: {class: 'list-group'}}`

* 节点类型不相同，直接采用替换模式`{type: 'REPLACE', newNode}`

根据这些**规则**，我们再来看一下**diff代码**中的**walk方法**这位关键先生

`walk`方法都做了什么？

* 每个元素都有一个补丁，所以需要创建一个放当前补丁的数组

* 如果没有`new节点`的话，就直接将`type`为`REMOVE`的类型放到当前补丁里

```js
if (!newNode) {
    current.push({ type: 'REMOVE', index });
}
```

* 如果新老节点是文本的话，判断一下文本是否一致，再指定类型`TEXT`并把新节点放到当前补丁

```js
else if (isString(oldNode) && isString(newNode)) {
    if (oldNode !== newNode) {
        current.push({ type: 'TEXT', text: newNode });
    }
}
```

* 如果新老节点的类型相同，那么就来比较一下他们的属性`props`

    * 属性比较

        * `diffAttr`

            * 去比较新老`Attr`是否相同
            
            * 把`newAttr`的键值对赋给`patch`对象上并返回此对象
        
    * 然后如果有子节点的话就再比较一下子节点的不同，再调一次`walk`

        * `diffChildren`

            * 遍历`oldChildren`，然后递归调用`walk`再通过`child`和`newChildren[index]`去`diff`

```js
else if (oldNode.type === newNode.type) {
    // 比较属性是否有更改
    let attr = diffAttr(oldNode.props, newNode.props);
    if (Object.keys(attr).length > 0) {
        current.push({ type: 'ATTR', attr });
    }
    
    // 如果有子节点，遍历子节点
    diffChildren(oldNode.children, newNode.children, patches);
}
```

* 上面三个如果都没有发生的话，那就表示节点单纯的被替换了，`type`为`REPLACE`，直接用`newNode`替换即可

```js
else {
    current.push({ type: 'REPLACE', newNode});
}
```

* 当前补丁里确实有值的情况，就将对应的补丁放进大补丁包里

```js
if (current.length > 0) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = current;
}
```

以上就是关于`diff算法`的分析过程了，没太明白的话没关系，再反复看几遍试试，意外总是不期而遇的

diff已经完事了，那么最后一步就是大家所熟知的**打补丁**了

## patch补丁更新

打补丁需要传入两个参数，`一个是要打补丁的元素`，`另一个就是所要打的补丁了`，那么直接看代码

```js
import { Element, render, setAttr } from './element';

let allPatches;
let index = 0;  // 默认哪个需要打补丁

function patch(node, patches) {
    allPatches = patches;
    
    // 给某个元素打补丁
    walk(node);
}

function walk(node) {
    let current = allPatches[index++];
    let childNodes = node.childNodes;

    // 先序深度，继续遍历递归子节点
    childNodes.forEach(child => walk(child));

    if (current) {
        doPatch(node, current); // 打上补丁
    }
}

function doPatch(node, patches) {
    // 遍历所有打过的补丁
    patches.forEach(patch => {
        switch (patch.type) {
            case 'ATTR':
                for (let key in patch.attr) {
                    let value = patch.attr[key];
                    if (value) {
                        setAttr(node, key, value);
                    } else {
                        node.removeAttribute(key);
                    }
                }
                break;
            case 'TEXT':
                node.textContent = patch.text;
                break;
            case 'REPLACE':
                let newNode = patch.newNode;
                newNode = (newNode instanceof Element) ? render(newNode) : document.createTextNode(newNode);
                node.parentNode.replaceChild(newNode, node);
                break;
            case 'REMOVE':
                node.parentNode.removeChild(node);
                break;
            default:
                break;
        }
    });
}

export default patch;
```

看完代码还需要再来简单的分析一下

### patch做了什么？

* 用一个变量来得到传递过来的所有补丁`allPatches`

* `patch`方法接收两个参数(`node`, `patches`)

    * 在方法内部调用`walk`方法，给某个元素打上补丁

* `walk`方法里获取所有的子节点

    * 给子节点也进行先序深度优先遍历，递归`walk`

    * 如果当前的补丁是存在的，那么就对其打补丁(`doPatch`)

* `doPatch`打补丁方法会根据传递的`patches`进行遍历

    * 判断补丁的类型来进行不同的操作
        
        1. 属性`ATTR for in`去遍历`attrs`对象，当前的`key`值如果存在，就直接设置属性`setAttr`； 如果不存在对应的`key`值那就直接删除这个`key`键的属性
        
        2. 文字`TEXT`直接将补丁的`text`赋值给`node`节点的`textContent`即可
        
        3. 替换`REPLACE`新节点替换老节点，需要先判断新节点是不是`Element`的实例，是的话调用`render`方法渲染新节点；不是的话就表明新节点是个文本节点，直接创建一个文本节点就OK了。之后再通过调用父级`parentNode`的`replaceChild`方法替换为新的节点
        
        4. 删除`REMOVE`直接调用父级的`removeChild`方法删除该节点

* 将`patch`方法默认导出方便调用

## 回归

```js
// index.js

import { createElement, render, renderDom } from './element';
// +++ 引入diff和patch方法
import diff from './diff';
import patch from './patch';
// +++

let virtualDom = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['周杰伦']),
    createElement('li', {class: 'item'}, ['林俊杰']),
    createElement('li', {class: 'item'}, ['王力宏'])    
]);

let el = render(virtualDom);
renderDom(el, window.root);

// +++
// 创建另一个新的虚拟DOM
let virtualDom2 = createElement('ul', {class: 'list-group'}, [
    createElement('li', {class: 'item active'}, ['七里香']),
    createElement('li', {class: 'item'}, ['一千年以后']),
    createElement('li', {class: 'item'}, ['需要人陪'])    
]);
// diff一下两个不同的虚拟DOM
let patches = diff(virtualDom, virtualDom2);
console.log(patches);
// 将变化打补丁，更新到el
patch(el, patches);
// +++
```

将修改后的代码保存，会在浏览器里看到`DOM`被更新了，如下图

<a data-fancybox title="demo" href="/notes/assets/react/1699e25ae746c36d.png">![demo](/notes/assets/react/1699e25ae746c36d.png)</a>

## 总结

整个**DOM-diff**的过程

1. 用`JS`对象模拟`DOM`（**虚拟DOM**）

1. 把此`虚拟DOM`转成`真实DOM`并插入页面中（**render**）

1. 如果有事件发生修改了`虚拟DOM`，比较两棵`虚拟DOM树`的差异，得到差异对象（**diff**）

1. 把差异对象应用到真正的`DOM树`上（**patch**）