描述
---

`enctype`属性规定在将表单数据发送到服务器之前如何对其进行编码

注意：只有`method = "post"`时才使用`enctype`属性。

语法
---

```html
<form enctype="value"></form>
```

属性值
---

| 值 | 描述 |
| ---- | ---- |
| application/x-www-form-urlencoded | 默认。在发送前对所有字符进行编码（将空格转换为 "+" 符号，特殊字符转换为 ASCII HEX 值）。|
| multipart/form-data | 不对字符编码。当使用有文件上传控件的表单时，该值是必需的。|
| text/plain | 将空格转换为 "+" 符号，但不编码特殊字符。 |

1. 当指定了`method = "post"`时，就会用到`enctype`属性，这个属性可以设置三 种类型的值。如果没有设置`enctyp`的值，那么它将会使用默认值`application/x-www-form-urlencoded`

2. `application/x-www-form-urlencoded`编码类型：

    * 在不指定 `enctype` 属性时 `application/x-www-form-urlencoded` 是默认属性。

    * 会将表单中发送到服务器之前都会进行编码(空格转换为 `"+"` 加号，特殊符号转换为 ASCII HEX 值)，数据编码成键值对的形式

    * 当表单的`action`为`post`时，它会把`form`数据封装到 `http body` 中，然后发送到服务器；

    * 当表单的`action`为`get`时，它会把表单中发送的数据转换成一个字符串(如：`a=1&b=2&c=3`)并使用`?`连接到 `url` 后面。

3. `multipart/form-data`：它不对字符进行编码，在使用包含文件(如图片、mp4等文件)上传控件的表单时必须使用该值

4. `text/plain`：数据以纯文本格式进行编码，空格转换为`'+'`号，但不对特殊字符编码

**示例**

HTML代码如下：

```html
<body>
    <form action="" enctype="application/x-www-form-urlencoded">
        First name: <input type="text" name="fname">
        Last name: <input type="text" name="lname">
        <input type="submit" value="提交">
    </form>
</body>
```

注意：

1. `form`的提交行为需要通过`type=submit`实现

1. `form`中的`method`属性不指定时，默认的提交方式为`get`请求，那么也就是说如果不指定`method`为`post`，那么是不会使用`enctype`属性的。

1. `form`表单的`enctype`属性是`application/x-www-form-urlencoded`

提交：

* 表单中含有的空格被转换成了`+`号

* 当表单的`action`为`get`时，表单中发送的数据被通过`?`连接，连接到原`url`后面