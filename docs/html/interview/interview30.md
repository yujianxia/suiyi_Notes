主要是利用了 HTML5 提供的 contenteditable 属性，让普通的 div 可以进行编辑。
结合 CSS 可以做到拉伸、滚动等效果。

如果需要对输入的值进行处理，就还需要用上 JS。

添加一点，如果设置contenteditable="true" 属性后，如果直接复制html内容的话会出现把样式也复制进去。

如果不需要该需求的话可以设置 contenteditable="plaintext-only"就可以了，这个属性代表只可输入纯文本，但是复制的格式还是存在的。

contenteditable 属性可以设置这几个值："events", "caret", "typing", "plaintext-only", "true", and "false"

上面的代码实现了div变为可编辑状态,但是textarea标签可以在右下角自由拉伸

```html
<div class="edit" contenteditable="true" style="resize: both"></div>
```
