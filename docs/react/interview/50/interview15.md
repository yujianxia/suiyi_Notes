# Consumer向上找不到Provider的时候怎么办

找不到会取用默认值，注意`provider`的`value`设置为`undefined`不会覆盖默认值

# Consumer

`Consumer`主要用来在使用`context`的过程中，来获取上层`provider`的值，通过定义组件c`ontextType`的值来指定要获取的是哪个`context`，找到当前`context`对应的最近的一个`provider`，取到`value`属性的值，如果没有定义，那么就会取到创建当前`context`时的传入值