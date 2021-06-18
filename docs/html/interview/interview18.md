**在html中，帧元素（frameset）的优先级最高，表单元素比非表单元素的优先级要高。**

* 表单元素

    * 文本输入框，密码输入框，单选框，复选框，文本输入域，列表框等等

* 非表单元素

    * 链接（a），div, table, span 等等

**有窗口元素比无窗口元素的优先级高**

* 有窗口元素

    * select元素，object元素，以及frames元素等等

* 无窗口元素

    * 大部分html元素都是无窗口元素


> 另外 z-index 属性也可以改变显示优先级，但只对同种类型的元素才有效。如果两个元素分别为 表单元素 和 非表单元素 那么 z-index 是无效的

`在这个例子中可以看到，select 就是在 div 的上面，尽管 div 设置了 z-index:100;`

```html
<style>
    .f12{
        font-size: 12px;
    }
    .wrapper{
        width: 300px;
        border:1px solid lightblue;
        background: lightcoral;
    }
    .f10{
        display: inline-block;
        font-size: 20px;
        background: lightgreen;
        transform:scale(0.5, 0.5) translatex(-50%);
    }

    .z1{
        width: 200px;
        line-height:300px;
        margin-top: -30px;
        background: lightcyan;
        z-index: 100;
    }

    .title {
        color: red;
    }

    .title {
        /* 真正生效的是这个 */
        color: green;
    }

    .opacity{
        width: 100px;
        height: 100px;
        background: red;
        opacity: .5;
    }

    .rgba{
        width: 100px;
        height: 100px;
        background: rgba(0, 0 ,255, .2);
    }
</style>

<div class="f12">1234</div>
<div class="wrapper">
  <span class="f10">1234</span>
  <span>2222</span>
</div>
<select>
  <option value ="volvo">Volvo</option>
  <option value ="saab">Saab</option>
  <option value="opel">Opel</option>
  <option value="audi">Audi</option>
</select>
<div class="z1">55555555</div>

<div>
  <input type="text" readonly  value='2333' onclick="console.log('focused readonly')" />
</div>

<div>
  <input type="text" name="name" value="xxx" disabled="true" onclick="console.log('focused disable')"/>
</div>
<h1 class="title">2333</h1>

<div class="opacity">
  123
  <span>233</span>
</div>

<div class="rgba">
  123
  <span>233</span>
</div>
```