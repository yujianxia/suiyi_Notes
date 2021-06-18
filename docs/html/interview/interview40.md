新的form属性

*   autocomplete

*   novalidate

新的input属性

*   新类型：color，date，email，month，number，range，search，tel，time，week。

*   新属性：autocomplate，autofocus，list，placeholder

**autocomplete 属性**
---

`autocomplete` 属性规定 form 或 input 域应该拥有自动完成功能。

**注释**：autocomplete 适用于 `<form>` 标签，以及以下类型的 `<input>` 标签：`text`, `search`, `url`, `telephone`, `email`, `password`, `datepickers`, `range` 以及 `color`。

当用户在自动完成域中开始输入时，浏览器应该在该域中显示填写的选项：

**实例**

```html
<form action="demo_form.asp" method="get" autocomplete="on">
    First name: <input type="text" name="fname" /><br />
    Last name: <input type="text" name="lname" /><br />
    E-mail: <input type="email" name="email" autocomplete="off" /><br />
    <input type="submit" />
</form>
```

**注释**：在某些浏览器中，您可能需要启用自动完成功能，以使该属性生效。

**autofocus 属性**
---

`autofocus` 属性规定在页面加载时，域自动地获得焦点。

**注释**：autofocus 属性适用于所有 `<input>` 标签的类型。

**实例**

```html
User name: <input type="text" name="user_name"  autofocus="autofocus" />
```

**form 属性**
---

`form` 属性规定输入域所属的一个或多个表单。

**注释**：form 属性适用于所有 `<input>` 标签的类型。

form 属性必须引用所属表单的 id：

**实例**

```html
<form action="demo_form.asp" method="get" id="user_form">
    First name:<input type="text" name="fname" />
    <input type="submit" />
</form>
Last name: <input type="text" name="lname" form="user_form" />
```

**注释**：如需引用一个以上的表单，请使用空格分隔的列表。

**表单重写属性**
---

表单重写属性（form override attributes）允许您重写 form 元素的某些属性设定。

表单重写属性有：

* `formaction` - 重写表单的 action 属性

* `formenctype` - 重写表单的 enctype 属性

* `formmethod` - 重写表单的 method 属性

* `formnovalidate` - 重写表单的 novalidate 属性

* `formtarget` - 重写表单的 target 属性

**注释**：表单重写属性适用于以下类型的 `<input>` 标签：`submit` 和 `image`。

**实例**

```html
<form action="demo_form.asp" method="get" id="user_form">
E-mail: <input type="email" name="userid" /><br />
<input type="submit" value="Submit" />
<br />
<input type="submit" formaction="demo_admin.asp" value="Submit as admin" />
<br />
<input type="submit" formnovalidate="true" value="Submit without validation" />
<br />
</form>
```

**注释**：这些属性对于创建不同的提交按钮很有帮助。

**height 和 width 属性**
---

height 和 width 属性规定用于 image 类型的 input 标签的图像高度和宽度。

**注释**：height 和 width 属性只适用于 `image` 类型的 `<input>` 标签。

**实例**

```html
<input type="image" src="img_submit.gif" width="99" height="99" />
```

**list 属性**
---

`list` 属性规定输入域的 datalist。datalist 是输入域的选项列表。

**注释**：`list` 属性适用于以下类型的 `<input>` 标签：`text`, `search`, `url`, `telephone`, `email`, `date pickers`, `number`, `range` 以及 `color`。

**实例**

```html
Webpage: <input type="url" list="url_list" name="link" />
<datalist id="url_list">
<option label="W3Schools" value="http://www.w3school.com.cn" />
<option label="Google" value="http://www.google.com" />
<option label="Microsoft" value="http://www.microsoft.com" />
</datalist>
```

**min、max 和 step 属性**
---

min、max 和 step 属性用于为包含数字或日期的 input 类型规定限定（约束）。

`max` 属性规定输入域所允许的最大值。

`min` 属性规定输入域所允许的最小值。

`step` 属性为输入域规定合法的数字间隔（如果 step="3"，则合法的数是 -3,0,3,6 等）。

**注释**：min、max 和 step 属性适用于以下类型的 `<input>` 标签：`date pickers`、`number` 以及 `range`。

下面的例子显示一个数字域，该域接受介于 0 到 10 之间的值，且步进为 3（即合法的值为 0、3、6 和 9）：

**实例**

```html
Points: <input type="number" name="points" min="0" max="10" step="3" />
```

**multiple 属性**
---

`multiple` 属性规定输入域中可选择多个值。

**注释**：multiple 属性适用于以下类型的 `<input>` 标签：`email` 和 `file`。

**实例**

```html
Select images: <input type="file" name="img" multiple="multiple" />
```

**novalidate 属性**
---

`novalidate` 属性规定在提交表单时不应该验证 form 或 input 域。

注释：novalidate 属性适用于 `<form>` 以及以下类型的 `<input>` 标签：`text`, `search`, `url`, `telephone`, `email`, `password`, `date pickers`, `range` 以及 `color`.

**实例**

```html
<form action="demo_form.asp" method="get" novalidate="true">
E-mail: <input type="email" name="user_email" />
<input type="submit" />
</form>
```

**pattern 属性**
---

`pattern` 属性规定用于验证 input 域的模式（pattern）。

模式（pattern） 是正则表达式。

**注释**：pattern 属性适用于以下类型的 `<input>` 标签：`text`, `search`, `url`, `telephone`, `email` 以及 `password`。

下面的例子显示了一个只能包含三个字母的文本域（不含数字及特殊字符）：

**实例**

```html
Country code: <input type="text" name="country_code"
pattern="[A-z]{3}" title="Three letter country code" />
```

**placeholder 属性**
---

`placeholder` 属性提供一种提示（hint），描述输入域所期待的值。

**注释**：placeholder 属性适用于以下类型的 `<input>` 标签：`text`, `search`, `url`, `telephone`, `email` 以及 `password`。

提示（hint）会在输入域为空时显示出现，会在输入域获得焦点时消失：

**实例**

```html
<input type="search" name="user_search"  placeholder="Search W3School" />
```

**required 属性**
---

`required` 属性规定必须在提交之前填写输入域（不能为空）。

**注释**：required 属性适用于以下类型的 `<input>` 标签：`text`, `search`, `url`, `telephone`, `email`, `password`, `date pickers`, `number`, `checkbox`, `radio` 以及 `file`。

**实例**

```html
Name: <input type="text" name="usr_name" required="required" />
```