# 标准的 CSS 的盒子模型？低版本 IE 的盒子模型

1. 有两种盒子模型：`IE盒模型（border-box）`、`W3C标准盒模型（content-box）`

2. 盒模型：分为`内容（content）`、`填充（padding）`、`边界（margin）`、`边框（border）`四个部分

IE盒模型和W3C标准盒模型的区别：

1. W3C标准盒模型：属性`width`，`height`**只包含内容content，不包含border和padding**

2. IE盒模型：属性`width`，`height`**包含content、border和padding，指的是content**
+padding+border。

在ie8+浏览器中使用哪个盒模型可以由`box-sizing（CSS新增的属性）`控制，**默认值为content-box**，即标准盒模型；如果将`box-sizing`设为`border-box`则用的是IE盒模型。如果在ie6，7，8中DOCTYPE缺失会将盒子模型解释为IE盒子模型。若在页面中声明了DOCTYPE类型，所有的浏览器都会把盒模型解释为W3C盒模型。

盒模型都是由四个部分组成的，分别是`margin`、`border`、`padding`和`content`。

标准盒模型和IE盒模型的区别在于设置`width`和`heigh`t时，所对应的范围不同。标准盒模型的`width`和`height`属性的范围只包含了`content`，而IE盒模型的`width`和`height`属性的范围包含了`border`、`padding`和`content`。

一般来说，可以通过修改元素的`box-sizing`属性来改变元素的盒模型。