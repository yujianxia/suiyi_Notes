### demo

```html
<a href="tel:139xxxxxxxx">一键拨打号码</a>
<a href="mailto:yuojian@163.com">一键发送邮件</a>
<a href="sms:139xxxxxxx">一键发送短信</a>
```

顺便想起来 `input` 也有几个类型来影响键盘弹出的样式
```html
<input type="text" placeholder="请输入文字"/>
<input type="number" pattern="[0-9]*" placeholder="请输入qq号"/> 
//type="number"限定输入数字，pattern="[0-9]*"限制数字范围
<input type="tel" placeholder="请输入电话"/>
<input type="date" placeholder="请输入日期"/>
<input type="datetime-local" placeholder="请输入时间"/>
```