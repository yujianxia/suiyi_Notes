> **注意**: 文档树中元素的[接近度（Proximity of elements）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity#%e6%97%a0%e8%a7%86dom%e6%a0%91%e4%b8%ad%e7%9a%84%e8%b7%9d%e7%a6%bb)对优先级没有影响。

# 选择器类型

1. [类型选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)（例如，`h1`）和伪元素（例如，`::before`）

2. [类选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors) (例如，`.example`)，属性选择器（例如，`[type="radio"]`）和伪类（例如，`:hover`）

3. [ID 选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)（例如，`#example`）。

**通配选择符**（universal selector）（[*](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)）**关系选择符**（combinators）（`+`, `>`, `~`, `' '`, `||`）和 **否定伪类**（negation pseudo-class）（`:not()`）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）

给元素添加的**内联样式** (例如，`style="font-weight:bold"`) 总会覆盖外部样式表的任何样式 ，因此可看作是具有最高的优先级。

# !important 例外规则

* **一定**要优先考虑使用样式规则的优先级来解决问题而不是 `!important`

* **只有**在需要覆盖全站或外部 CSS 的特定页面中使用 `!important`

* **永远不要**在你的插件中使用 `!important`

* **永远不要**在全站范围的 CSS 代码中使用 `!important`

# !important 优化流程

1. 更好地利用 CSS 级联属性

2. 使用更具体的规则。在您选择的元素之前，增加一个或多个其他元素，使选择器变得更加具体，并获得更高的优先级。

```html
<div id="test">
  <span>Text</span>
</div>
```

```css
div#test span { color: green; }
div span { color: blue; }
span { color: red; }
```

无论 c​ss 语句的顺序是什么样的，文本都会是绿色的（green），因为这一条规则是最有针对性、优先级最高的。（同理，无论语句顺序怎样，蓝色 blue 的规则都会覆盖红色 red 的规则）

3. 对于（2）的一种特殊情况，当您无其他要指定的内容时，请复制简单的选择器以增加特异性。

```css
#myId#myId span { color: yellow; }
.myClass.myClass span { color: orange; }
```

# 使用 `!important` 情况

## 覆盖内联样式

```html
<div class="foo" style="color: red;">What color am I?</div>
```

```css
.foo[style*="color: red"] {
  color: firebrick !important;
}
```

许多JavaScript框架和库都添加了内联样式。 有时候可以用`!important`与优先级高的选择器一起使用，以重写覆盖这些内联样式。

## 覆盖优先级高的选择器

```css
#someElement p {
  color: blue;
}

p.awesome {
  color: red;
}
```

在外层有 `#someElement` 的情况下，你怎样能使 `awesome` 的段落变成红色呢？这种情况下，如果不使用 `!important` ，第一条规则永远比第二条的优先级更高

# 覆盖 `!important`

1. 只需再添加一条 带 `!important` 的CSS规则，再给这个给选择器更高的优先级（添加一个标签，ID或类）；或是添加一样选择器，把它的位置放在原有声明的后面（总之，最后定义一条规则比胜）。

> 更高优先级的例子

```css
   table td { height: 50px !important; }
.myTable td { height: 50px !important; }
#myTable td { height: 50px !important; }
```

2. 或者使用相同的选择器，但是置于已有的样式之后：

```css
td { height: 50px !important; }
```

3. 改写原来的规则，以避免使用 `!important`。

```css
[id="someElement"] p {
  color: blue;
}

p.awesome {
  color: red;
}
```

# :is() 和 :not() 例外规则

`:not` 否定伪类在优先级计算中不会被看作是伪类。事实上，在计算选择器数量时还是会把其中的选择器当做普通选择器进行计数。

有如下 CSS 样式声明:

```css
div.outer p {
  color: orange;
}

div:not(.outer) p {
  color: blueviolet;
}
```

HTML 时：

```html
<div class="outer">
  <p>This is in the outer div.</p>
  <div class="inner">
    <p>This text is in the inner div.</p>
  </div>
</div>
```

<a data-fancybox title="示例" href="/notes/notes/assets/css/1616564455(1).jpg">![示例](/notes/notes/assets/css/1616564455(1).jpg)</a>

# :where() 例外规则

> css

```css
div:where(.outer) p {
  color: orange;
}

div p {
  color: blueviolet;
}
```

> html

```html
<div class="outer">
  <p>This is in the outer div.</p>
  <div class="inner">
    <p>This text is in the inner div.</p>
  </div>
</div>
```

# 基于形式的优先级

`优先级是基于选择器的形式进行计算的`。在下面的例子中，尽管选择器*[id="foo"] 选择了一个ID，但是它还是作为一个**属性选择器**来计算自身的优先级。

> css

```css
*#foo {
  color: green;
}

*[id="foo"] {
  color: purple;
}
```

> html

```html
<p id="foo">I am a sample text.</p>
```

虽然匹配了相同的元素，但是 **ID 选择器拥有更高的优先级**。所以第一条样式声明生效。

# 无视DOM树中的距离

> css

```css
body h1 {
  color: green;
}

html h1 {
  color: purple;
}
```

> html

```html
<html>
  <body>
    <h1>Here is a title!</h1>
  </body>
</html>
```

# 直接添加样式 vs. 继承样式

> 为目标元素直接添加样式，永远比继承样式的优先级高，无视优先级的遗传规则。

```css
#parent {
  color: green;
}

h1 {
  color: purple;
}
```

```html
<html>
  <body id="parent">
    <h1>Here is a title!</h1>
  </body>
</html>
```