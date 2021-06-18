`<label>`的作用
---

表示用户界面中某个元素的说明
增加命中区域，屏幕阅读器可以读出标签。使使用辅助技术的用户更容易理解输入 哪些数据

用法
---

单击关联标签激活input，需给input一个id属性，给label一个for属性，设为同一个值

注意事项
---

一个 input 可以与多个标签相关联。
标签本身并不与表单直接相关。它们只通过与它们相关联的控件间接地与表单相关联。
当点击或者触碰（tap）一个与表单控件相关联的 时，关联的控件的 click 事件也会触发。

具体实例
---

1. 利用`label`"模拟"`button`来解决不同浏览器原生`button`样式不同的问题

```html
<input type="button" id="btn">
<label for="btn">Button</label>

<style>
input[type='button'] {
  display: none;
}

label {
  display: inline-block;
  padding: 10px 20px;
  background: #456;
  color: #fff;
  cursor: pointer;
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,.3);
  border-radius: 2px;
}
</style>
```

2. 结合`checkbox`、`radio`表单元素实现纯CSS状态切换，这样的实例就太多了。比如控制CSS动画播放和停止

```html
<input type="checkbox" id="controller">
<label class="icon" for="controller">
  <div class="play"></div>
  <div class="pause"></div>
</label>
<div class="animation"></div>

<style>
...
#controller:checked ~ .animation {
  animation-play-state: paused;
}
...
</style>
```

3. `input`的`focus`事件会触发锚点定位，可以利用`label`当触发器实现选项卡切换效果

```html
<div class="box">
  <div class="list"><input id="one" readonly>1</div>
  <div class="list"><input id="two" readonly>2</div>
  <div class="list"><input id="three" readonly>3</div>
  <div class="list"><input id="four" readonly>4</div>
</div>
<div class="link">
  <label class="click" for="one">1</label>
  <label class="click" for="two">2</label>
  <label class="click" for="three">3</label>
  <label class="click" for="four">4</label>
</div>

<style>
.box {
  width: 20em;
  height: 10em;
  border: 1px solid #ddd;
  overflow: hidden;
}
.list {
  height: 100%;
  background: #ddd;
  text-align: center;
  position: relative;
}
.list > input { 
  position: absolute; top:0; 
  height: 100%; width: 1px;
  border:0; padding: 0; margin: 0;
  clip: rect(0 0 0 0);
}
</style>
```

lable可以关联控件，可以和表单元素结合，使表单元素获得焦点。有两个属性，for和accesskey。
for 属性用来关联表单，accesskey属性设置快捷键。

for属性：

```html
<label for="username">姓名</label><input id="username" type="text">

<input type="checkbox" id="a" value="haha" name="cn">
<label for="a" >haha </label>
<input type="checkbox" id="b" value="hehe" name="cm">
<label for="b" >hehe </label>
```

accesskey属性:

```html
<label for="username" accesskey＝"N">姓名</label><input id="username" type="text">
```