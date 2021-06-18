执行顺序应该是：
- link
- hover
- active
- visited

因为存在样式层叠问题，所以书写顺序需要调整，把类似hover这种瞬时状态覆盖link这种常态
- link
- visited
- hover
- active

```css
link > visited > hover > active
```
简称 lvha(love-ha)

伪类的优先级是一样的，所以后出现的伪类会覆盖先出现的伪类（同时激活）

在这里，比如把 `hover` 放在 `active` 后面，那么实际在激活（`active`）链接的时候就触发了` hover` 伪类，`hover` 在后面覆盖了 `active` 的颜色，所以始终无法看到 `active` 的颜色
