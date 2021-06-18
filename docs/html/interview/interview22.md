描述
---

原本 HTML 也允许自定义 `attributes` 因此在早期前端，为了将数据塞在标签中，往往会采用自定义属性存放数据的方法。

而 `data-` 便是 HTML 5 中用来存放数据的标签。使用 `data-*` 时，**需要注意，`data-` 之后的单词必须是小写的，但是可以用多个 `-` 连接**。而在对应的 DOM 方法中，可以通过 `ele.dataset[属性名]` 进行访问。在这里的属性名可以使用驼峰（转换规则和 vue 的组件名称转换一样）。

相比之前的自定义属性存放数据，使用 `data-*` 的方法，在数据的获取上会比较方便。

使用：

1. 可以通过`dataset`对象去获取到数据属性，需要获取属性名中`data-`之后的部分(如果以破折号连接的名称需要改写为驼峰命名，例如`index-number`转换为`indexNumber`)

```html
<div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe</div>
```

```javascript
const el = document.querySelector('#user');

// el.id === 'user'
// el.dataset.id === '1234567890'
// el.dataset.user === 'johndoe'
// el.dataset.dateOfBirth === ''

// set the data attribute
el.dataset.dateOfBirth = '1960-10-03'; 
// Result: el.dataset.dateOfBirth === 1960-10-03

delete el.dataset.dateOfBirth;
// Result: el.dataset.dateOfBirth === undefined

// 'someDataAttr' in el.dataset === false
el.dataset.someDataAttr = 'mydata';
// Result: 'someDataAttr' in el.dataset === true
```

2. 可以通过`getAttribute()`配合它们完整的HTML名称去读取它们

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <article id="electriccars" data-column="3" data-index-number="1234" data-parent="cars">
        语法非常简单。所有在元素上以data-开头的属性为数据属性。比如说有一篇文章，
        而又想要存储一些不需要显示在浏览器上的额外信息。请使用data属性：
    </article>
</body>

<script>
    var article = document.querySelector('#electriccars');
    
    // 1. 通过getAttribut()方法获取属性值
    console.log(article.getAttribute('data-columns'));
    console.log(article.getAttribute('data-index-number'));
    console.log(article.getAttribute('data-parent'));
</script>

</html>
```

**通过`CSS`访问属性**

data设定为HTML属性，它们同样能被CSS访问。

1. 使用`attr()`函数来显示`data-parent`的内容

```css
/* 双冒号表示伪元素 */
article::after {
    /* 在article元素后添加内容，内容为通过attr()函数获取的data-parent属性的值 */
    content: attr(data-parent);
    color: red;
}
```

通过`attr()`函数获取到`data-parent`属性的值，然后作为伪元素添加到`article`元素的后边。

2. 通过属性选择器设置样式

```css
article[data-column='3'] {
    background-color: deepskyblue;
    width: 50%;
}
```