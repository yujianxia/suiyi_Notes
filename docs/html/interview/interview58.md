1.定义：H5中新标签，配合 “自动完成”的特性，给用户的选项列表

2.使用：中排列选项，并与input绑定（中list与中id选项值相同）

3.兼容：ie9以上

```html
<input list="browsers">
<datalist id="browsers">
  <option value="Internet Explorer">
  <option value="Firefox">
  <option value="Chrome">
  <option value="Opera">
  <option value="Safari">
</datalist>
```

`datalist`是html5新增的元素，与input输入框搭配使用，类似select下拉框，支持模糊搜索选项，支持键盘上下键操作，回车键可以触发`onchange` 事件，选中option可以触发onchange事件

```html
<input list="list" onchange="ahri(event)">
<datalist id="list">
	<option value="ahri">
	<option value="annie">
	<option value="akali">
	<option value="leona">
	<option value="dianna">
</datalist>
<script>
function ahri(e) {
	console.log(e.target.value)
}
</script>
```