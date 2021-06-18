1. png24位的图片在iE6浏览器上出现背景

`解决方案`：做成PNG8，也可以引用一段脚本处理。

2. 浏览器默认的margin和padding不同

`解决方案`：加一个全局的*{margin:0;padding:0;}来统一。

3. IE6双边距bug：在IE6下，如果对元素设置了浮动，同时又设置了margin-left或margin-right，margin值会加倍。

```css
#box{float:left;width:10px;margin:00010px;}
```

这种情况之下IE会产生20px的距离

`解决方案`：在float的标签样式控制中加入_display:inline;将其转化为行内属性。(_这个符号只有ie6会识别)

4. 渐进识别的方式，从总体中逐渐排除局部。
首先，巧妙的使用"\9"这一标记，将IE游览器从所有情况中分离出来。
接着，再次使用"+"将IE8和IE7、IE6分离开来，这样IE8已经独立识别。

```css
.bb{
    background-color:#f1ee18;/*所有识别*/
    .background-color:#00deff\9;/*IE6、7、8识别*/
    +background-color:#a200ff;/*IE6、7识别*/
    _background-color:#1e0bd1;/*IE6识别*/
}
```

5. IE下，可以使用获取常规属性的方法来获取自定义属性，也可以使用getAttribute()获取自定义属性；Firefox下，只能使用getAttribute()获取自定义属性

`解决方法`：统一通过getAttribute()获取自定义属性。

6. IE下，event对象有x、y属性，但是没有pageX、pageY属性;Firefox下，event对象有pageX、pageY属性，但是没有x、y属性。

`解决方法`：（条件注释）缺点是在IE浏览器下可能会增加额外的HTTP请求数。

7. Chrome中文界面下默认会将小于12px的文本强制按照12px显示

* `解决方法`：

    1. 可通过加入CSS属性-webkit-text-size-adjust:none;解决。但是，在chrome更新到27版本之后就不可以用了。

    2. 还可以使用-webkit-transform:scale(0.5);注意-webkit-transform:scale(0.75);收缩的是整个span的大小，这时候，必须要将span转换成块元素，可以使用display：block/inline-block/...；

8. 超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了

`解决方法`：改变CSS属性的排列顺序L-V-H-A

9. 怪异模式问题：漏写DTD声明，Firefox仍然会按照标准模式来解析网页，但在IE中会触发怪异模式。为避免怪异模式给带来不必要的麻烦，最好养成书写DTD声明的好习惯。