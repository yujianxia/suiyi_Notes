### Vue模板渲染的原理

**vue 2.0 模板编译原理**
---
***

**概述**
---

vue中的模板`template`无法被浏览器解析并渲染，因为这不属于浏览器的标准，不是正确的HTML语法，所有需要将`template`转化成一个`JavaScript`函数，这样**浏览器就可以执行这一个函数并渲染出对应的HTML元素**，就可以让视图跑起来了，这一个转化的过程，就成为模板编译。

* `parse阶段`：使用大量的正则表达式对template字符串进行解析，将`标签`、`指令`、`属性`等转化为抽象`语法树AST`。

    * 将 `模板字符串` 转换成 `element ASTs（解析器）`

* `optimize阶段`：`遍历AST`，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行diff比较时，直接跳过这一些静态节点，优化runtime的性能。

    * 对 `AST` 进行静态节点标记，主要用来做虚拟DOM的渲染优化（优化器）

* `generate阶段`：将最终的`AST`转化为`render`函数字符串。

    * 使用 `element ASTs` 生成 `render 函数代码字符串（代码生成器）`

**解析器**
---

解析器主要干的事是将 `模板字符串` 转换成 `element ASTs`，例如：

```javascript
<div>
    <p>{{name}}</p>
</div>
```

上面这样一个简单的 `模板` 转换成 `element AST` 后是这样的：

```javascript
{
    tag: "div"
    type: 1,
    staticRoot: false,
    static: false,
    plain: true,
    parent: undefined,
    attrsList: [],
    attrsMap: {},
    children: [
        {
            tag: "p"
            type: 1,
            staticRoot: false,
            static: false,
            plain: true,
            parent: {tag: "div", ...},
            attrsList: [],
            attrsMap: {},
            children: [{
                type: 2,
                text: "{{name}}",
                static: false,
                expression: "_s(name)"
            }]
        }
    ]
}
```

先用这个简单的例子来说明这个解析器的内部究竟发生了什么。

这段模板字符串会扔到 `while` 中去循环，然后 **一段一段** 的截取，把截取到的 **每一小段字符串** 进行解析，直到最后截没了，也就解析完了。

上面这个简单的模板截取的过程是这样的：

```javascript
<div>
    <p>{{name}}</p>
</div>

<p>{{name}}</p>
```

只要判断模板字符串是不是以 < 开头就可以知道接下来要截取的这一小段字符串是 `标签` 还是 `文本`。

`<div></div>` 这样的一段字符串是以 `<` 开头的，那么通过正则把 `<div>` 这一部分 `match` 出来，就可以拿到这样的数据：

```javascript
{
    tagName: 'div',
    attrs: [],
    unarySlash: '',
    start: 0,
    end: 5
}
```

好奇如何用正则解析出 `tagName` 和 `attrs` 等信息的同学可以看下面这个demo代码：

```javascript
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
let html = `<div></div>`
let index = 0
const start = html.match(startTagOpen)

const match = {
    tagName: start[1],
    attrs: [],
    start: 0
}
html = html.substring(start[0].length)
index += start[0].length
let end, attr
while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
    html = html.substring(attr[0].length)
    index += attr[0].length
    match.attrs.push(attr)
}
if (end) {
    match.unarySlash = end[1]
    html = html.substring(end[0].length)
    index += end[0].length
    match.end = index
}
console.log(match)
```

**Stack**
---

用正则把 `开始标签` 中包含的数据（`attrs`, `tagName` 等）解析出来之后还要做一个很重要的事，就是要维护一个 `stack`。

那这个 `stack` 是用来干什么的呢？

**这个 `stack` 是用来记录一个层级关系的，用来记录DOM的深度。**

更准确的说，当解析到一个 `开始标签` 或者 `文本`，无论是什么， `stack` 中的最后一项，永远是当前正在被解析的节点的 `parentNode` 父节点。

通过 `stack` 解析器就可以把当前解析到的节点 `push` 到 父节点的 `children` 中。

也可以把当前正在解析的节点的 `parent` 属性设置为 父节点。

事实上也确实是这么做的。

但并不是只要解析到一个标签的开始部分就把当前标签 `push` 到 `stack` 中。

因为在 HTML 中有一种 `自闭合标签`，比如 `input`。

`<input />` 这种 `自闭合的标签` 是不需要 `push` 到 `stack` 中的，因为 `input` 并不存在子节点。

所以当解析到一个标签的开始时，**要判断当前被解析的标签是否是自闭合标签，如果不是自闭合标签才 `push` 到 `stack` 中**。

```javascript
if (!unary) {
    currentParent = element
    stack.push(element)
}
```

现在有了 DOM 的层级关系，也可以解析出DOM的 `开始标签`，这样每解析一个 `开始标签` 就生成一个 `ASTElement` (**存储当前标签的attrs，tagName 等信息的object**）

并且把当前的 `ASTElement` push 到 `parentNode` 的 `children` 中，同时给当前 `ASTElement` 的 `parent` 属性设置为 `stack` 中的最后一项

```javascript
currentParent.children.push(element)
element.parent = currentParent
```

**`<` 开头的几种情况**
---

但并不是所有以 `<` 开头的字符串都是 `开始标签`，以 `<` 开头的字符串有以下几种情况：

* 开始标签 `<div>`

* 结束标签 `</div>`

* HTML注释 `<!-- 是注释 -->`

* Doctype `<!DOCTYPE html>`

* 条件注释

当然解析器在解析的过程中遇到的最多的是 `开始标签` `结束标签` 和 `注释`

**截取文本**
---

继续上面的例子解析，`div` 的 `开始标签` 解析之后剩余的模板字符串是下面的样子：

```javascript
    <p>{{name}}</p>
</div>
```

这一次在解析发现 模板字符串 不是以 < 开头了。

那么如果模板字符串不是以 < 开头的怎么处理呢？？

其实如果字符串不是以 < 开头可能会出现这么几种情况：

```html
是text <div></div>

或者：

是text </p>
```

不论是哪种情况都会将标签前面的文本部分解析出来，截取这段文本其实并不难，看下面的例子：

```javascript
// 可以直接将本 demo 放到浏览器 console 中去执行
const html = '是text </p>'
let textEnd = html.indexOf('<')
const text = html.substring(0, textEnd)
console.log(text)
```

当然 vue 对文本的截取不只是这么简单，vue对文本的截取做了很安全的处理，如果 `<` 是文本的一部分，那上面 DEMO 中截取的内容就不是想要的，例如这样的：

```javascript
a < b </p>
```

如果是这样的文本，上面的 demo 肯定就挂了，截取出的文本就会遗漏一部分，而 vue 对这部分是进行了处理的，看下面的代码：

```javascript
let textEnd = html.indexOf('<')
let text, rest, next
if (textEnd >= 0) {
    rest = html.slice(textEnd)
    // 剩余部分的 HTML 不符合标签的格式那肯定就是文本
    // 并且还是以 < 开头的文本
    while (
        !endTag.test(rest) &&
        !startTagOpen.test(rest) &&
        !comment.test(rest) &&
        !conditionalComment.test(rest)
    ) {
        // < in plain text, be forgiving and treat it as text
        next = rest.indexOf('<', 1)
        if (next < 0) break
        textEnd += next
        rest = html.slice(textEnd)
    }
    text = html.substring(0, textEnd)
    html = html.substring(0, textEnd)
}
```

这段代码的逻辑是如果文本截取完之后，剩余的 `模板字符串` 开头不符合标签的格式规则，那么肯定就是有没截取完的文本

这个时候只需要循环把 `textEnd` 累加，直到剩余的 `模板字符串` 符合标签的规则之后在一次性把 `text` 从 `模板字符串` 中截取出来就好了。

继续上面的例子，当前剩余的 `模板字符串` 是这个样子的：

```html
  <p>{{name}}</p>
</div>
```

截取之后剩余的 `模板字符串` 是这个样子的：

```html
<p>{{name}}</p>
</div>
```

被截取出来的文本是这样的：

```javascript
"\n        "
```

截取之后就需要对文本进行解析，不过在解析文本之前需要进行预处理，也就是先简单加工一下文本，vue 是这样做的：

```javascript
const children = currentParent.children
text = inPre || text.trim()
    ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
    // only preserve whitespace if its not right after a starting tag
    : preserveWhitespace && children.length ? ' ' : ''
```

这段代码的意思是：

* 如果文本不为空，判断父标签是不是`script`或`style`，

    * 如果是则什么都不管，

    * 如果不是需要 `decode` 一下编码，使用github上的 he 这个类库的 `decodeHTML` 方法

* 如果文本为空，判断有没有兄弟节点，也就是 `parent.children.length` 是不是为 0

    * 如果大于0 返回 `' '`

    * 如果为 0 返回 `''`

结果发现这一次的 text 正好命中最后的那个 `''`，所以这一次就什么都不用做继续下一轮解析就好

继续上面的例子，现在的 `模板字符串` 变是这个样子：

```html
<p>{{name}}</p>
</div>
```

接着解析 `<p>`，解析流程和上面的 `<div>` 一样就不说了，直接继续：

```html
{{name}}</p>
</div>
```

通过上面写的文本的截取方式这一次截取出来的文本是这个样子的 `"{{name}}"`

**解析文本**
---

其实解析文本节点并不难，只需要将文本节点 `push` 到 `currentParent.children.push(ast)` 就行了。

但是带变量的文本和不带变量的纯文本是不同的处理方式。

带变量的文本是指 `Hello {{ name }}` 这个 `name` 就是变量。

不带变量的文本是这样的 `Hello Berwin` 这种没有访问数据的纯文本。

纯文本比较简单，直接将 文本节点的ast `push` 到 `parent` 节点的 `children` 中就行了，例如：

```javascript
children.push({
    type: 3,
    text: '是纯文本'
})
```

而带变量的文本要多一个解析文本变量的操作：

```javascript
const expression = parseText(text, delimiters) // 对变量解析 {{name}} => _s(name)
children.push({
    type: 2,
    expression,
    text
})
```

上面例子中 `"{{name}}"` 是一个带变量的文本，经过 `parseText` 解析后 `expression` 是 `_s(name)`，所以最后 `push` 到 `currentParent.children` 中的节点是这个样子的：

```javascript
{
    expression: "_s(name)",
    text: "{{name}}",
    type: 2
}
```

**结束标签的处理**
---

现在文本解析完之后，剩余的 `模板字符串` 变成了这个样子：

```html
</p>
</div>
```

这一次还是用上面说的办法，`html.indexOf('<') === 0`，发现是 `<` 开头的，然后用正则去 `match` 发现符合 `结束标签的格式`，把它截取出来。

并且还要做一个处理是用当前标签名在 `stack` 从后往前找，将找到的 `stack` 中的位置往后的所有标签全部删除（意思是，已经解析到当前的结束标签，那么它的子集肯定都是解析过的，试想一下**当前标签都关闭**了，它的**子集肯定也都关闭**了，所以需要把当前标签位置往后从 `stack`中都清掉）

结束标签不需要解析，只需要将 `stack` 中的当前标签删掉就好。

虽然不用解析，但 `vue` 还是做了一个优化处理，`children` 中的最后一项如果是空格 `" "`，则删除最后这一项：

```javascript
if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
    element.children.pop()
}
```

因为最后这一项空格是没有用的，举个例子：

```html
<ul>
    <li></li>
</ul>
```

上面例子中解析成 `element ASTs`之后 `ul` 的结束标签 `</ul>` 和 `li` 的结束标签 `</li>` 之间有一个空格，这个空格也属于文本节点在 `ul` 的 `children` 中，这个空格是没有用的，把这个空格删掉每次渲染dom都会少渲染一个文本节点，可以节省一定的性能开销。

现在剩余的 `模板字符串` 已经不多了，是下面的样子：

```html
</div>
```

然后解析文本，就是一个其实就是一个空格的文本节点。

然后再一次解析结束标签 `</div>`

```html
</div>
```

解析完毕退出 `while` 循环。

解析完之后拿到的 `element ASTs` 就是文章开头写的那样。

**总结一下**
---

其实这样一个模板解析器的原理不是特别难，主要就是两部分内容，一部分是 `截取` 字符串，一部分是对截取之后的字符串做 `解析`

每截取一段标签的开头就 `push` 到 `stack`中，解析到标签的结束就 pop 出来，当所有的字符串都截没了也就解析完了。

**优化器**
---

优化器的目标是找出那些静态节点并打上标记，而静态节点指的是 `DOM` 不需要发生变化的节点，例如：

```html
<p>是静态节点，不需要发生变化</p>
```

标记静态节点有两个好处：

1. 每次重新渲染的时候不需要为静态节点创建新节点

2. 在 `Virtual DOM` 中 `patching` 的过程可以被跳过

优化器的实现原理主要分两步：

* `第一步`：用递归的方式将所有节点添加 `static` 属性，标识是不是静态节点

* `第二步`：标记所有静态根节点

什么是静态根节点？ 答：子节点全是静态节点的节点就是静态根节点，例如：

```html
<ul>
    <li>是静态节点，不需要发生变化</li>
    <li>是静态节点2，不需要发生变化</li>
    <li>是静态节点3，不需要发生变化</li>
</ul>
```

ul 就是静态根节点。

**如何将所有节点标记 `static` 属性？**

vue 判断一个节点是不是静态节点的做法其实并不难：

1. 先根据自身是不是静态节点做一个标记 `node.static = isStatic(node)`

1. 然后在循环 `children`，如果 `children` 中出现了哪怕一个节点不是静态节点，在将当前节点的标记修改成 `false`： `node.static = false`。

**如何判断一个节点是不是静态节点？**

也就是说 `isStatic` 这个函数是如何判断静态节点的？

```javascript
function isStatic (node: ASTNode): boolean {
    if (node.type === 2) { // expression
        return false
    }
    if (node.type === 3) { // text
        return true
    }
    return !!(node.pre || (
        !node.hasBindings && // no dynamic bindings
        !node.if && !node.for && // not v-if or v-for or v-else
        !isBuiltInTag(node.tag) && // not a built-in
        isPlatformReservedTag(node.tag) && // not a component
        !isDirectChildOfTemplateFor(node) &&
        Object.keys(node).every(isStaticKey)
    ))
}
```

先解释一下，在上文讲的解析器中将 `模板字符串` 解析成 `AST` 的时候，会根据不同的文本类型设置一个 `type`：

| type | 说明 |
| ---- | ---- |
|  1   | 元素节点 |
|  2   | 带变量的动态文本节点 |
|  3   | 不带变量的纯文本节点 |

所以上面 `isStatic` 中的逻辑很明显，如果 `type === 2` 那肯定不是 `静态节点` 返回 `false`，如果 `type === 3` 那就是静态节点，返回 `true`。

那如果 `type === 1`，就有点复杂了，元素节点判断是不是静态节点的条件很多，咱们先一个个看。

首先如果 `node.pre` 为 `true` 直接认为当前节点是静态节点

* v-pre

    * **用法**：
    跳过这个元素和它的子元素的编译过程。可以用来显示原始 `Mustache` 标签。跳过大量没有指令的节点会加快编译。

    * **示例**：
    ```html
    <span v-pre>{{ this will not be compiled }}</span>
    ```

**其次 `node.hasBindings` 不能为 `true`。**

`node.hasBindings` 属性是在解析器转换 `AST` 时设置的，如果当前节点的 `attrs` 中，有 `v-`、`@`、`:`开头的 `attr`，就会把 `node.hasBindings` 设置为 `true`。

```javascript
const dirRE = /^v-|^@|^:/
if (dirRE.test(attr)) {
    // mark element as dynamic
    el.hasBindings = true
}
```

**并且元素节点不能有 `if` 和 `for`属性。**

`node.if` 和 `node.for` 也是在解析器转换 `AST` 时设置的。

在解析的时候发现节点使用了 `v-if`，就会在解析的时候给当前节点设置一个 `if` 属性。

就是说元素节点不能使用 `v-if` `v-for` `v-else` 等指令。

**并且元素节点不能是 `slot` 和 `component`。**

**并且元素节点不能是组件。**

例如：

```javascript
<List></List>
```

不能是上面这样的自定义组件

**并且元素节点的父级节点不能是带 v-for 的 template**不能被认定为静态节点

**并且元素节点上不能出现额外的属性。**不能被认定为静态节点

额外的属性指的是不能出现 `type` `tag` `attrsList` `attrsMap` `plain` `parent` `children` `attrs` `staticClass` `staticStyle` 这几个属性之外的其他属性，如果出现其他属性则认为当前节点不是静态节点。

**如何标记所有节点？**

上面讲如何判断单个节点是否是静态节点，`AST` 是一棵树，如何把所有的节点都打上标记（`static`）呢？

还有一个问题是，判断 `元素节点`是不是`静态节点`不能光看它自身是不是`静态节点`，如果它的`子节点`不是`静态节点`，那就算它自身符合上面讲的`静态节点`的条件，它也不是`静态节点`。

所以在 vue 中有这样一行代码：

```javascript
for (let i = 0, l = node.children.length; i < l; i++) {
    const child = node.children[i]
    markStatic(child)
    if (!child.static) {
        node.static = false
    }
}
```

`markStatic` 可以给节点标记，规则上面刚讲过，`vue.js` 通过循环 `children` 打标记，然后每个不同的子节点又会走相同的逻辑去循环它的 `children` 这样递归下来所有的节点都会被打上标记。

然后在循环中判断，如果某个子节点不是 `静态节点`，那么讲当前节点的标记改为 `false`。

这样一圈下来之后 `AST` 上的所有节点都被准确的打上了标记。

**如何标记静态根节点？**

标记静态根节点其实也是递归的过程。

vue 中的实现大概是这样的：

```javascript
function markStaticRoots (node: ASTNode, isInFor: boolean) {
    if (node.type === 1) {
        // For a node to qualify as a static root, it should have children that
        // are not just static text. Otherwise the cost of hoisting out will
        // outweigh the benefits and it's better off to just always render it fresh.
        if (node.static && node.children.length && !(
            node.children.length === 1 &&
            node.children[0].type === 3
        )) {
            node.staticRoot = true
            return
        } else {
            node.staticRoot = false
        }
        if (node.children) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                markStaticRoots(node.children[i], isInFor || !!node.for)
            }
        }
    }
}
```

当前节点是`静态节点`，并且有`子节点`，并且`子节点`不是单个`静态文本节点`这种情况会将当前节点标记为`根静态节点`。

换句话说是文本节点的频繁和静态性不用作为根静态节点的标识

上面标记 `静态节点` 的时候有一段逻辑是只有所有 `子节点` 都是 `静态节点`，当前节点才是真正的 `静态节点`。

所以这里如果发现一个节点是 `静态节点`，那就能证明它的所有 `子节点` 也都是静态节点，而要标记的是 `静态根节点`，所以如果一个静态节点只包含了`一个文本节点`那就不会被标记为 `静态根节点`。

**总结**

整体逻辑其实就是递归 `AST` 这颗树，然后将 `静态节点` 和 `静态根节点` 找到并打上标记。

**代码生成器**
---
***

代码生成器的作用是使用 `element ASTs` 生成 `render` 函数代码字符串。

使用本文开头举的例子中的模板生成后的 `AST` 来生成 `render` 后是这样的：

```javascript
{
  render: `with(this){return _c('div',[_c('p',[_v(_s(name))])])}`
}
```

格式化后是这样的：

```javascript
with(this){
    return _c(
        'div',
        [
        _c(
            'p',
            [
                _v(_s(name))
            ]
        )
        ]
    )
}
```

生成后的代码字符串中看到了有几个函数调用 `_c`，`_v`，`_s`。

`_c` 对应的是 `createElement`，它的作用是创建一个元素。

1. 第一个参数是一个HTML标签名

2. 第二个参数是元素上使用的属性所对应的数据对象，可选项

3. 第三个参数是 `children`

例如：

一个简单的模板：

```html
<p title="Berwin" @click="c">1</p>
```

生成后的代码字符串是：

```javascript
`with(this){return _c('p',{attrs:{"title":"Berwin"},on:{"click":c}},[_v("1")])}`
```

格式化后：

```javascript
with(this){
    return _c(
        'p',
        {
            attrs:{"title":"Berwin"},
            on:{"click":c}
        },
        [_v("1")]
    )
}
```

`_v` 的意思是创建一个文本节点。

`_s` 是返回参数中的字符串。

代码生成器的总体逻辑其实就是使用 `element ASTs` 去递归，然后拼出这样的 `_c('div',[_c('p',[_v(_s(name))])])` 字符串。

```javascript
function genElement (el: ASTElement, state: CodegenState) {
    const data = el.plain ? undefined : genData(el, state)
    const children = el.inlineTemplate ? null : genChildren(el, state, true)
        
    let code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
    }${
        children ? `,${children}` : '' // children
    })`
    
    return code
}
```

因为 `_c` 的参数需要 `tagName`、`data` 和 `children`。

所以上面这段代码的主要逻辑就是用 `genData` 和 `genChildren` 获取 `data` 和 `children`，然后拼到 `_c` 中去，拼完后把拼好的 `"_c(tagName, data, children)"` 返回。

重点的两个问题:

1. `data` 如何生成的（`genData` 的实现逻辑）？

1. `children` 如何生成的（`genChildren` 的实现逻辑）？

先看 `genData` 是怎样的实现逻辑：

```javascript
function genData (el: ASTElement, state: CodegenState): string {
    let data = '{'
    // key
    if (el.key) {
        data += `key:${el.key},`
    }
    // ref
    if (el.ref) {
        data += `ref:${el.ref},`
    }
    if (el.refInFor) {
        data += `refInFor:true,`
    }
    // pre
    if (el.pre) {
        data += `pre:true,`
    }
    // ... 类似的还有很多种情况
    data = data.replace(/,$/, '') + '}'
    return data
}
```

可以看到，就是根据 `AST` 上当前节点上都有什么属性，然后针对不同的属性做一些不同的处理，最后拼出一个字符串~

然后在看看 `genChildren` 是怎样的实现的：

```javascript
function genChildren (
    el: ASTElement,
    state: CodegenState
): string | void {
    const children = el.children
    if (children.length) {
        return `[${children.map(c => genNode(c, state)).join(',')}]`
    }
}

function genNode (node: ASTNode, state: CodegenState): string {
    if (node.type === 1) {
        return genElement(node, state)
    } if (node.type === 3 && node.isComment) {
        return genComment(node)
    } else {
        return genText(node)
    }
}
```

从上面代码中可以看出，生成 `children` 的过程其实就是循环 `AST` 中当前节点的 `children`，然后把每一项在重新按不同的节点类型去执行 `genElement` `genComment` `genText`。如果 `genElement` 中又有 `children` 在循环生成，如此反复递归，最后一圈跑完之后能拿到一个完整的 `render` 函数代码字符串，就是类似下面这个样子。

```javascript
"_c('div',[_c('p',[_v(_s(name))])])"
```

最后把生成的 `code` 装到 `with` 里。

```javascript
export function generate (
    ast: ASTElement | void,
    options: CompilerOptions
): CodegenResult {
    const state = new CodegenState(options)
    // 如果ast为空，则创建一个空div
    const code = ast ? genElement(ast, state) : '_c("div")'
    return {
        render: `with(this){return ${code}}`
    }
}
```

**总结**
---

* 解析器（parser）的作用是将 `模板字符串` 转换成 `element ASTs`。

* 优化器（optimizer）的作用是找出那些静态节点和静态根节点并打上标记。

* 代码生成器（code generator）的作用是使用 `element ASTs` 生成 render函数代码（generate render function code from element ASTs）。

<a data-fancybox title="流程图" href="https://camo.githubusercontent.com/0920aad6c6ccef524f2cbe808e85729960974f78/687474703a2f2f70332e7168696d672e636f6d2f743031393264303939313237633832396561392e706e67">![流程图](https://camo.githubusercontent.com/0920aad6c6ccef524f2cbe808e85729960974f78/687474703a2f2f70332e7168696d672e636f6d2f743031393264303939313237633832396561392e706e67)</a>

解析器（parser）的原理是一小段一小段的去截取字符串，然后维护一个 `stack` 用来保存DOM深度，每截取到一段标签的开始就 `push` 到 `stack` 中，当所有字符串都截取完之后也就解析出了一个完整的 `AST`。

优化器（optimizer）的原理是用递归的方式将所有节点打标记，表示是否是一个 `静态节点`，然后再次递归一遍把 `静态根节点` 也标记出来。

代码生成器（code generator）的原理也是通过递归去拼一个函数执行代码的字符串，递归的过程根据不同的节点类型调用不同的生成方法，如果发现是一颗元素节点就拼一个 `_c(tagName, data, children)` 的函数调用字符串，然后 `data` 和 `children` 也是使用 `AST` 中的属性去拼字符串。

如果 `children` 中还有 `children` 则递归去拼。

最后拼出一个完整的 `render` 函数代码。

**vue 3.0 模板编译原理**
---
***

Vue 的编译模块包含 4 个目录：

`compiler-core`

`compiler-dom` // 浏览器

`compiler-sfc` // 单文件组件

`compiler-ssr` // 服务端渲染

其中 `compiler-core` 模块是 Vue 编译的核心模块，并且是平台无关的。而剩下的三个都是在 `compiler-core` 的基础上针对不同的平台作了适配处理。

**Parse**
---

Vue 在解析模板字符串时，可分为两种情况：以 `<` 开头的字符串和不以 `<` 开头的字符串。

不以 `<` 开头的字符串有两种情况：它是文本节点或 `{{ exp }}` 插值表达式。

而以 < 开头的字符串又分为以下几种情况：

1. 元素开始标签 `<div>`

2. 元素结束标签 `</div>`

3. 注释节点 `<!-- 123 -->`

4. 文档声明 `<!DOCTYPE html>`

用伪代码表示，大概过程如下：

```javascript
while (s.length) {
    if (startsWith(s, '{{')) {
        // 如果以 '{{' 开头
        node = parseInterpolation(context, mode)
    } else if (s[0] === '<') {
        // 以 < 标签开头
        if (s[1] === '!') {
            if (startsWith(s, '<!--')) {
                // 注释
                node = parseComment(context)
            } else if (startsWith(s, '<!DOCTYPE')) {
                // 文档声明，当成注释处理
                node = parseBogusComment(context)
            }
        } else if (s[1] === '/') {
            // 结束标签
            parseTag(context, TagType.End, parent)
        } else if (/[a-z]/i.test(s[1])) {
            // 开始标签
            node = parseElement(context, ancestors)
        }
    } else {
        // 普通文本节点
        node = parseText(context, mode)
    }
}
```

在源码中对应的几个函数分别是：

1. `parseChildren()`，主入口。

2. `parseInterpolation()`，解析双花插值表达式。

3. `parseComment()`，解析注释。

4. `parseBogusComment()`，解析文档声明。

5. `parseTag()`，解析标签。

6. `parseElement()`，解析元素节点，它会在内部执行 `parseTag()`。

7. `parseText()`，解析普通文本。

8. `parseAttribute()`，解析属性。

每解析完一个标签、文本、注释等节点时，Vue 就会生成对应的 AST 节点，**并且会把已经解析完的字符串给截断**。

对字符串进行截断使用的是 `advanceBy(context, numberOfCharacters)` 函数，`context` 是字符串的上下文对象，`numberOfCharacters` 是要截断的字符数。

用一个简单的例子来模拟一下截断操作：

```html
<div name="test">
    <p></p>
</div>
```

首先解析 `<div`，然后执行 `advanceBy(context, 4)` 进行截断操作（内部执行的是 `s = s.slice(4)`），变成：

```html
name="test">
  <p></p>
</div>
```

再解析属性，并截断，变成：

```html
  <p></p>
</div>

同理，后面的截断情况为：

></p>
</div>

</div>

<!-- 所有字符串已经解析完 -->
```

**AST 节点**

所有的 `AST` 节点定义都在 `compiler-core/ast.ts` 文件中，下面是一个元素节点的定义：

```javascript
export interface BaseElementNode extends Node {
    type: NodeTypes.ELEMENT // 类型
    ns: Namespace // 命名空间 默认为 HTML，即 0
    tag: string // 标签名
    tagType: ElementTypes // 元素类型
    isSelfClosing: boolean // 是否是自闭合标签 例如 <br/> <hr/>
    props: Array<AttributeNode | DirectiveNode> // props 属性，包含 HTML 属性和指令
    children: TemplateChildNode[] // 字节点
}
```

一些简单的要点已经讲完了，下面再从一个比较复杂的例子来详细讲解一下 `parse` 的处理过程。

```html
<div name="test">
    <!-- 这是注释 -->
    <p>{{ test }}</p>
    一个文本节点
    <div>good job!</div>
</div>
```

上面的模板字符串假设为 `s`，第一个字符 `s[0]` 是 `<` 开头，那说明它只能是刚才所说的四种情况之一。

这时需要再看一下 `s[1]` 的字符是什么：

1. 如果是 `!`，则调用字符串原生方法 `startsWith()` 看看是以 `'<!--'` 开头还是以 `'<!DOCTYPE'` 开头。虽然这两者对应的处理函数不一样，但它们最终都是解析为注释节点。

2. 如果是 `/`，则按结束标签处理。

3. 如果不是 `/`，则按开始标签处理。

从的示例来看，这是一个 `<div>` 开始标签。

这里还有一点要提一下，Vue 会用一个栈 stack 来保存解析到的元素标签。当它遇到开始标签时，会将这个标签推入栈，遇到结束标签时，将刚才的标签弹出栈。**它的作用是保存当前已经解析了，但还没解析完的元素标签。这个栈还有另一个作用，在解析到某个字节点时，通过 `stack[stack.length - 1]` 可以获取它的父元素。**

从的示例来看，它的出入栈顺序是这样的：

```
1. [div] // div 入栈
2. [div, p] // p 入栈
3. [div] // p 出栈
4. [div, div] // div 入栈
5. [div] // div 出栈
6. [] // 最后一个 div 出栈，模板字符串已解析完，这时栈为空
```

接着上文继续分析的示例，这时已经知道是 `div` 标签了，接下来会把已经解析完的 `<div` 字符串截断，然后解析它的属性。

`Vue` 的属性有两种情况：

1. `HTML` 普通属性

2. `Vue` 指令

根据属性的不同生成的节点不同，HTML 普通属性节点 type 为 6，Vue 指令节点 type 为 7。

所有的节点类型值如下：

```javascript
ROOT,  // 根节点 0
ELEMENT, // 元素节点 1
TEXT, // 文本节点 2
COMMENT, // 注释节点 3
SIMPLE_EXPRESSION, // 表达式 4
INTERPOLATION, // 双花插值 {{ }} 5
ATTRIBUTE, // 属性 6
DIRECTIVE, // 指令 7
```

属性解析完后，`div` 开始标签也就解析完了，`<div name="test">` 这一行字符串已经被截断。现在剩下的字符串如下：

```html
    <!-- 这是注释 -->
    <p>{{ test }}</p>
    一个文本节点
    <div>good job!</div>
</div>
```

注释文本和普通文本节点解析规则都很简单，直接截断，生成节点。注释文本调用 `parseComment()` 函数处理，文本节点调用 `parseText()` 处理。

双花插值的字符串处理逻辑稍微复杂点，例如示例中的 `{{ test }}`：

1. 先将双花括号中的内容提取出来，即 `test`，再对它执行 `trim()`，去除空格。

1. 然后会生成两个节点，一个节点是 `INTERPOLATION`，type 为 5，表示它是双花插值。

1. 第二个节点是它的内容，即 `test`，它会生成一个 `SIMPLE_EXPRESSION` 节点，type 为 4。

```javascript
return {
    type: NodeTypes.INTERPOLATION, // 双花插值类型
    content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        isStatic: false, // 非静态节点
        isConstant: false,
        content,
        loc: getSelection(context, innerStart, innerEnd)
    },
    loc: getSelection(context, start)
}
```

剩下的字符串解析逻辑和上文的差不多，就不解释了，最后这个示例解析出来的 AST 如下所示：

<a data-fancybox title="示例图" href="https://camo.githubusercontent.com/e7c48876b208e006024c399586e31981d92d8183/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f63343764383037663062396434333037393631306635343162316139633934637e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765">![示例图](https://camo.githubusercontent.com/e7c48876b208e006024c399586e31981d92d8183/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f63343764383037663062396434333037393631306635343162316139633934637e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765)</a>

从 AST 上，还能看到某些节点上有一些别的属性：

1. `ns`，`命名空间`，一般为 HTML，值为 0。

2. `loc`，它是一个`位置信息`，表明这个节点在源 HTML 字符串中的位置，包含行，列，偏移量等信息。

3. `{{ test }}` 解析出来的节点会有一个 `isStatic` 属性，值为 false，表示这是一个动态节点。如果是静态节点，则只会生成一次，并且在后面的阶段一直复用同一个，不用进行 `diff` 比较。

另外还有一个 tagType 属性，它有 4 个值：

```javascript
export const enum ElementTypes {
    ELEMENT, // 0 元素节点
    COMPONENT, // 1 组件
    SLOT, // 2 插槽
    TEMPLATE // 3 模板
}
```

主要用于区分上述四种类型节点。

**Transform**
---

在 `transform` 阶段，Vue 会对 `AST` 进行一些转换操作，主要是根据不同的 `AST` 节点添加不同的选项参数，这些参数在 `codegen` 阶段会用到。下面列举一些比较重要的选项：

**cacheHandlers**

如果 `cacheHandlers` 的值为 `true`，则表示开启事件函数缓存。例如 `@click="foo"` 默认编译为 `{ onClick: foo }`，如果开启了这个选项，则编译为

```javascript
{ onClick: _cache[0] || (_cache[0] = e => _ctx.foo(e)) }
```

**hoistStatic**

**hoistStatic 是一个标识符，表示要不要开启静态节点提升**。如果值为 true，静态节点将被提升到 `render()` 函数外面生成，并被命名为 `_hoisted_x` 变量。

例如 `一个文本节点` 生成的代码为 `const _hoisted_2 = /*#__PURE__*/_createTextVNode(" 一个文本节点 ")`。

下面两张图，前者是 `hoistStatic = false`，后面是 `hoistStatic = true`

[网站地址](https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%5Cr%5Cn%22%2C%22options%22%3A%7B%22mode%22%3A%22module%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup%22%2C%22foo%22%3A%22setup%22%2C%22bar%22%3A%22props%22%7D%7D%7D)

<a data-fancybox title="示例图1" href="https://camo.githubusercontent.com/d81b9663a841909b491a49d5e66e41666e64f660/68747470733a2f2f70392d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f35626466386535656130643734306236393765376233653864643031316565657e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765">![示例图1](https://camo.githubusercontent.com/d81b9663a841909b491a49d5e66e41666e64f660/68747470733a2f2f70392d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f35626466386535656130643734306236393765376233653864643031316565657e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765)</a>

<a data-fancybox title="示例图2" href="https://camo.githubusercontent.com/f7bc66fd01b821fbdd718ef2036251736af996aa/68747470733a2f2f70332d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f34363137396236396338396334346334393966613062393530343963656264317e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765">![示例图2](https://camo.githubusercontent.com/f7bc66fd01b821fbdd718ef2036251736af996aa/68747470733a2f2f70332d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f34363137396236396338396334346334393966613062393530343963656264317e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765)</a>

**prefixIdentifiers**

这个参数的作用是用于代码生成。例如 `{{ foo }}` 在 module 模式下生成的代码为 `_ctx.foo`，而在 function 模式下是 `with (this) { ... }`。因为在 module 模式下，默认为严格模式，不能使用 `with` 语句。

**PatchFlags**

`transform` 在对 `AST` 节点进行转换时，会打上 `patchflag` 参数，这个参数主要用于 `diff` 比较过程。当 `DOM` 节点有这个标志并且大于 0，就代表要更新，没有就跳过。

来看一下 patchflag 的取值范围：

```javascript
export const enum PatchFlags {
    // 动态文本节点
    TEXT = 1,

    // 动态 class
    CLASS = 1 << 1, // 2

    // 动态 style
    STYLE = 1 << 2, // 4

    // 动态属性，但不包含类名和样式
    // 如果是组件，则可以包含类名和样式
    PROPS = 1 << 3, // 8

    // 具有动态 key 属性，当 key 改变时，需要进行完整的 diff 比较。
    FULL_PROPS = 1 << 4, // 16

    // 带有监听事件的节点
    HYDRATE_EVENTS = 1 << 5, // 32

    // 一个不会改变子节点顺序的 fragment
    STABLE_FRAGMENT = 1 << 6, // 64

    // 带有 key 属性的 fragment 或部分子字节有 key
    KEYED_FRAGMENT = 1 << 7, // 128

    // 子节点没有 key 的 fragment
    UNKEYED_FRAGMENT = 1 << 8, // 256

    // 一个节点只会进行非 props 比较
    NEED_PATCH = 1 << 9, // 512

    // 动态 slot
    DYNAMIC_SLOTS = 1 << 10, // 1024

    // 静态节点
    HOISTED = -1,

    // 指示在 diff 过程应该要退出优化模式
    BAIL = -2
}
```

从上述代码可以看出 `patchflag` 使用一个 11 位的位图来表示不同的值，每个值都有不同的含义。Vue 在 `diff` 过程会根据不同的 `patchflag` 使用不同的 `patch` 方法。

下图是经过 `transform` 后的 `AST`：

<a data-fancybox title="示例图" href="https://camo.githubusercontent.com/966c1e5e051d6afcd506c8c8cf25d14b46cd4c88/68747470733a2f2f70392d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f36626163383830323465616434636363613161396265356533323236303836617e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765">![示例图](https://camo.githubusercontent.com/966c1e5e051d6afcd506c8c8cf25d14b46cd4c88/68747470733a2f2f70392d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f36626163383830323465616434636363613161396265356533323236303836617e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765)</a>

可以看到 `codegenNode`、`helpers` 和 `hoists` 已经被填充上了相应的值。**`codegenNode` 是生成代码要用到的数据**，**`hoists` 存储的是静态节点**，**`helpers` 存储的是创建 VNode 的函数名称（其实是 Symbol）**。

在正式开始 `transform` 前，需要创建一个 `transformContext`，即 `transform` 上下文。和这三个属性有关的数据和方法如下：

```javascript
helpers: new Set(),
hoists: [],

// methods
helper(name) {
    context.helpers.add(name)
    return name
},
helperString(name) {
    return `_${helperNameMap[context.helper(name)]}`
},
hoist(exp) {
    context.hoists.push(exp)
    const identifier = createSimpleExpression(
        `_hoisted_${context.hoists.length}`,
        false,
        exp.loc,
        true
    )
    identifier.hoisted = exp
    return identifier
},
```

来看一下具体的 `transform` 过程是怎样的，用 `<p>{{ test }}</p>` 来做示例。

这个节点对应的是 `transformElement()` 转换函数，由于 `p` 没有绑定动态属性，没有绑定指令，所以重点不在它，而是在 `{{ test }}` 上。`{{ test }}` 是一个双花插值表达式，所以将它的 `patchFlag` 设为 1（动态文本节点），对应的执行代码是 `patchFlag |= 1`。然后再执行 `createVNodeCall()` 函数，它的返回值就是这个节点的 `codegenNode` 值。

```javascript
node.codegenNode = createVNodeCall(
    context,
    vnodeTag,
    vnodeProps,
    vnodeChildren,
    vnodePatchFlag,
    vnodeDynamicProps,
    vnodeDirectives,
    !!shouldUseBlock,
    false /* disableTracking */,
    node.loc
)
```

`createVNodeCall()` 根据这个节点添加了一个 `createVNode` `Symbol` 符号，它放在 `helpers` 里。其实就是要在代码生成阶段引入的帮助函数。

```javascript
// createVNodeCall() 内部执行过程，已删除多余的代码
context.helper(CREATE_VNODE)

return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    loc
}
```

**hoists**

一个节点是否添加到 `hoists` 中，主要看它是不是静态节点，并且需要将 `hoistStatic` 设为 `true`。

```html
<div name="test"> // 属性静态节点
    <!-- 这是注释 -->
    <p>{{ test }}</p>
    一个文本节点 // 静态节点
    <div>good job!</div> // 静态节点
</div>
```

可以看到，上面有三个静态节点，所以 `hoists` 数组有 3 个值。并且无论静态节点嵌套有多深，都会被提升到 `hoists` 中。

**type 变化**

从上图可以看到，最外层的 `div` 的 `type` 原来为 1，经过 `transform` 生成的 `codegenNode` 中的 `type` 变成了 13。
这个 13 是代码生成对应的类型 `VNODE_CALL`。另外还有:

```javascript
// codegen
VNODE_CALL, // 13
JS_CALL_EXPRESSION, // 14
JS_OBJECT_EXPRESSION, // 15
JS_PROPERTY, // 16
JS_ARRAY_EXPRESSION, // 17
JS_FUNCTION_EXPRESSION, // 18
JS_CONDITIONAL_EXPRESSION, // 19
JS_CACHE_EXPRESSION, // 20
```

刚才提到的例子 `{{ test }}`，它的 `codegenNode` 就是通过调用 `createVNodeCall()` 生成的：

```javascript
return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    loc
}
```

可以从上述代码看到，`type` 被设置为 `NodeTypes.VNODE_CALL`，即 13。

每个不同的节点都由不同的 `transform` 函数来处理，由于篇幅有限，具体代码请自行查阅。

**Codegen**
---

代码生成阶段最后生成了一个字符串，把字符串的双引号去掉，看一下具体的内容是什么：

```javascript
const _Vue = Vue
const { createVNode: _createVNode, createCommentVNode: _createCommentVNode, createTextVNode: _createTextVNode } = _Vue

const _hoisted_1 = { name: "test" }
const _hoisted_2 = /*#__PURE__*/_createTextVNode(" 一个文本节点 ")
const _hoisted_3 = /*#__PURE__*/_createVNode("div", null, "good job!", -1 /* HOISTED */)

return function render(_ctx, _cache) {
    with (_ctx) {
        const { createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, createVNode: _createVNode, createTextVNode: _createTextVNode, openBlock: _openBlock, createBlock: _createBlock } = _Vue

        return (_openBlock(), _createBlock("div", _hoisted_1, [
            _createCommentVNode(" 这是注释 "),
            _createVNode("p", null, _toDisplayString(test), 1 /* TEXT */),
            _hoisted_2,
            _hoisted_3
        ]))
    }
}
```

**代码生成模式**

可以看到上述代码最后返回一个 `render()` 函数，作用是生成对应的 `VNode`。

其实代码生成有两种模式：`module` 和 `function`，由标识符 `prefixIdentifiers` 决定使用哪种模式。

`function` 模式的特点是：使用 `const { helpers... } = Vue` 的方式来引入帮助函数，也就是是 `createVode()` `createCommentVNode()` 这些函数。向外导出使用 `return` 返回整个 `render()` 函数。

`module` 模式的特点是：使用 `es6` 模块来导入导出函数，也就是使用 `import` 和 `export`。

**静态节点**

另外还有三个变量是用 `_hoisted_` 命名的，后面跟着数字，代表这是第几个静态变量。

再看一下 parse 阶段的 HTML 模板字符串：

```html
<div name="test">
    <!-- 这是注释 -->
    <p>{{ test }}</p>
    一个文本节点
    <div>good job!</div>
</div>
```

这个示例只有一个动态节点，即 `{{ test }}`，剩下的全是静态节点。从生成的代码中也可以看出，生成的节点和模板中的代码是一一对应的。静态节点的作用就是只生成一次，以后直接复用。

细心的网友可能发现了 `_hoisted_2` 和 `_hoisted_3` 变量中都有一个 `/*#__PURE__*/` 注释。

这个注释的作用是表示这个函数是纯函数，没有副作用，主要用于 `tree-shaking`。压缩工具在打包时会将未被使用的代码直接删除（shaking 摇掉）。

再来看一下生成动态节点 `{{ test }}` 的代码： `_createVNode("p", null, _toDisplayString(test), 1 /* TEXT */)`。

其中 `_toDisplayString(test)` 的内部实现是：

```javascript
return val == null
    ? ''
    : isObject(val)
        ? JSON.stringify(val, replacer, 2)
        : String(val)
```

代码很简单，就是转成字符串输出。

而 `_createVNode("p", null, _toDisplayString(test), 1 /* TEXT */)` 最后一个参数 1 就是 `transform` 添加的 `patchflag` 了。

**帮助函数 helpers**

在 `transform`、`codegen` 这两个阶段，都能看到 `helpers` 的影子，到底 `helpers` 是干什么用的？

```javascript
// Name mapping for runtime helpers that need to be imported from 'vue' in
// generated code. Make sure these are correctly exported in the runtime!
// Using `any` here because TS doesn't allow symbols as index type.
export const helperNameMap: any = {
    [FRAGMENT]: `Fragment`,
    [TELEPORT]: `Teleport`,
    [SUSPENSE]: `Suspense`,
    [KEEP_ALIVE]: `KeepAlive`,
    [BASE_TRANSITION]: `BaseTransition`,
    [OPEN_BLOCK]: `openBlock`,
    [CREATE_BLOCK]: `createBlock`,
    [CREATE_VNODE]: `createVNode`,
    [CREATE_COMMENT]: `createCommentVNode`,
    [CREATE_TEXT]: `createTextVNode`,
    [CREATE_STATIC]: `createStaticVNode`,
    [RESOLVE_COMPONENT]: `resolveComponent`,
    [RESOLVE_DYNAMIC_COMPONENT]: `resolveDynamicComponent`,
    [RESOLVE_DIRECTIVE]: `resolveDirective`,
    [WITH_DIRECTIVES]: `withDirectives`,
    [RENDER_LIST]: `renderList`,
    [RENDER_SLOT]: `renderSlot`,
    [CREATE_SLOTS]: `createSlots`,
    [TO_DISPLAY_STRING]: `toDisplayString`,
    [MERGE_PROPS]: `mergeProps`,
    [TO_HANDLERS]: `toHandlers`,
    [CAMELIZE]: `camelize`,
    [CAPITALIZE]: `capitalize`,
    [SET_BLOCK_TRACKING]: `setBlockTracking`,
    [PUSH_SCOPE_ID]: `pushScopeId`,
    [POP_SCOPE_ID]: `popScopeId`,
    [WITH_SCOPE_ID]: `withScopeId`,
    [WITH_CTX]: `withCtx`
}

export function registerRuntimeHelpers(helpers: any) {
    Object.getOwnPropertySymbols(helpers).forEach(s => {
        helperNameMap[s] = helpers[s]
    })
}
```

其实帮助函数就是在代码生成时从 `Vue` 引入的一些函数，以便让程序正常执行，从上面生成的代码中就可以看出来。而 `helperNameMap` 是默认的映射表名称，这些名称就是要从 `Vue` 引入的函数名称。

另外，还能看到一个注册函数 `registerRuntimeHelpers(helpers: any())`，它是干什么用的呢？

知道编译模块 `compiler-core` 是平台无关的，而 `compiler-dom` 是浏览器相关的编译模块。为了能在浏览器正常运行 `Vue` 程序，就得把浏览器相关的 `Vue 数据和函数导入进来`。
`registerRuntimeHelpers(helpers: any()` 正是用来做这件事的，从 compiler-dom 的 runtimeHelpers.ts 文件就能看出来：

```javascript
registerRuntimeHelpers({
    [V_MODEL_RADIO]: `vModelRadio`,
    [V_MODEL_CHECKBOX]: `vModelCheckbox`,
    [V_MODEL_TEXT]: `vModelText`,
    [V_MODEL_SELECT]: `vModelSelect`,
    [V_MODEL_DYNAMIC]: `vModelDynamic`,
    [V_ON_WITH_MODIFIERS]: `withModifiers`,
    [V_ON_WITH_KEYS]: `withKeys`,
    [V_SHOW]: `vShow`,
    [TRANSITION]: `Transition`,
    [TRANSITION_GROUP]: `TransitionGroup`
})
```

它运行 `registerRuntimeHelpers(helpers: any()`，往映射表注入了浏览器相关的部分函数。

**helpers 是怎么使用的呢?**

在 parse 阶段，解析到不同节点时会生成对应的 type。

在 `transform` 阶段，会生成一个 `helpers`，它是一个 `set` 数据结构。每当它转换 `AST` 时，都会根据 `AST` 节点的 `type` 添加不同的 `helper` 函数。

例如，假设它现在正在转换的是一个注释节点，它会执行 `context.helper(CREATE_COMMENT)`，内部实现相当于 `helpers.add('createCommentVNode')`。然后在 `codegen` 阶段，遍历 `helpers`，将程序需要的函数从 `Vue` 里导入，代码实现如下：

```javascript
// 这是 module 模式
`import { ${ast.helpers
    .map(s => `${helperNameMap[s]} as _${helperNameMap[s]}`)
    .join(', ')} } from ${JSON.stringify(runtimeModuleName)}\n`
```

**如何生成代码？**

从 codegen.ts 文件中，可以看到很多代码生成函数：

```javascript
generate() // 代码生成入口文件
genFunctionExpression() // 生成函数表达式
genNode() // 生成 Vnode 节点
...
```

生成代码则是根据不同的 AST 节点调用不同的代码生成函数，最终将代码字符串拼在一起，输出一个完整的代码字符串。

老规矩，还是看一个例子：

```javascript
const _hoisted_1 = { name: "test" }
const _hoisted_2 = /*#__PURE__*/_createTextVNode(" 一个文本节点 ")
const _hoisted_3 = /*#__PURE__*/_createVNode("div", null, "good job!", -1 /* HOISTED */)
```

看一下这段代码是怎么生成的，首先执行 `genHoists(ast.hoists, context)`，将 `transform` 生成的静态节点数组 `hoists` 作为第一个参数。`genHoists()` 内部实现：

```javascript
hoists.forEach((exp, i) => {
    if (exp) {
        push(`const _hoisted_${i + 1} = `);
        genNode(exp, context);
        newline();
    }
})
```

从上述代码可以看到，遍历 `hoists` 数组，调用 `genNode(exp, context)`。`genNode()` 根据不同的 `type` 执行不同的函数。

```javascript
const _hoisted_1 = { name: "test" }
```

这一行代码中的 `const _hoisted_1 =` 由 `genHoists()` 生成，`{ name: "test" }` 由 `genObjectExpression()` 生成。
同理，剩下的两行代码生成过程也是如此，只是最终调用的函数不同。