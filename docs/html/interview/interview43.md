**HTML 拖放 API**
---

**HTML 拖放（Drag and Drop）**接口使应用程序能够在浏览器中使用拖放功能。例如，用户可使用鼠标选择可拖拽（draggable）元素，将元素拖拽到可放置（droppable）元素，并释放鼠标按钮以放置这些元素。拖拽操作期间，会有一个可拖拽元素的半透明快照跟随着鼠标指针。

## 拖拽事件

HTML 的 drag & drop 使用了 `DOM event model` 以及从 `mouse events` 继承而来的 `drag events` 。一个典型的拖拽操作是这样的：用户选中一个可拖拽的（draggable）元素，并将其拖拽（鼠标不放开）到一个可放置的（droppable）元素，然后释放鼠标。

在操作期间，会触发一些事件类型，有一些事件类型可能会被多次触发（比如`drag` 和 `dragover` 事件类型）。

所有的 `拖拽事件类型` 有一个对应的 `拖拽全局属性`。每个拖拽事件类型和拖拽全局属性都有对应的描述文档。下面的表格提供了一个简短的事件类型描述，以及一个相关文档的链接。

| 事件 | On型事件处理程序 | 触发时刻 |
| ---- | ---- | ---- |
| drag | ondrag | 当拖拽元素或选中的文本时触发。 |
| dragend | ondragend | 当拖拽操作结束时触发 (比如松开鼠标按键或敲“Esc”键). (见结束拖拽) |
| dragenter | ondragenter | 当拖拽元素或选中的文本到一个可释放目标时触发（见 指定释放目标）。 |
| dragexit | ondragexit | 当元素变得不再是拖拽操作的选中目标时触发。 |
| dragleave | ondragleave | 当拖拽元素或选中的文本离开一个可释放目标时触发。 |
| dragover | ondragover | 当元素或选中的文本被拖到一个可释放目标上时触发（每100毫秒触发一次）。 |
| dragstart | ondragstart | 当用户开始拖拽一个元素或选中的文本时触发（见开始拖拽操作）。 |
| drop | ondrop | 当元素或选中的文本在可释放目标上被释放时触发（见执行释放）。 |

**注意**：当从操作系统向浏览器中拖拽文件时，不会触发 **dragstart** 和**dragend** 事件。

## 接口

HTML 的拖拽接口有 `DragEvent`, `DataTransfer`, `DataTransferItem` 和`DataTransferItemList`。

`DragEvent` 接口有一个构造函数和一个 `DataTransfer` 属性，`DataTransfer` 属性是一个 `DataTransfer` 对象。

`DataTransfer` 对象包含了拖拽事件的状态，例如拖拽事件的类型（如拷贝 copy 或者移动 move），拖拽的数据（一个或者多个项）和每个拖拽项的类型（MIME类型）。 `DataTransfer` 对象也有向拖拽数据中添加或删除项目的方法。

给应用程序添加 HTML 拖放功能，`DragEvent` 和 `DataTransfer` 接口应该是唯二需要的接口（Firefox 给 `DataTransfer` 添加了一些 Gecko 专有的扩展功能，但这些扩展只在 Firefox 上可用）。

每个 `DataTransfer` 都包含一个  items 属性，这个属性是 `DataTransferItem` 对象的 list。一个 `DataTransferItem` 代表一个拖拽项目，每个项目都有一个 kind 属性（`string` 或 `file`） 和一个表示数据项目 MIME 类型的 type 属性。`DataTransferItem` 对象也有获取拖拽项目数据的方法。

`DataTransferItemList` 对象是 `DataTransferItem` 对象的列表。这个列表对象包含以下方法：向列表中添加拖拽项，从列表中移除拖拽项和清空列表中所有的拖拽项。

`DataTransfer` 和 `DataTransferItem` 接口的一个主要的不同是前者使用同步的 getData() 方法去得到拖拽项的数据，而后者使用异步的 getAsString() 方法得到拖拽项的数据。

注意: `DragEvent` 和 `DataTransfer` 接口是所有桌面浏览器都支持的。但是， `DataTransferItem` 和`DataTransferItemList` 接口并不被所有浏览器支持。

**确定什么是可拖拽的**
---

让一个元素被拖拽需要添加 `draggable` 属性，再加上全局事件处理函数`ondragstart`，如下面的示例代码所示：

```html
<script>
  function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
  }

  window.addEventListener('DOMContentLoaded', () => {
    // Get the element by id
    const element = document.getElementById("p1");
    // Add the ondragstart event listener
    element.addEventListener("dragstart", dragstart_handler);
  });
</script>

<p id="p1" draggable="true">This element is draggable.</p>
```

**定义拖拽数据**
---

应用程序可以在拖拽操作中包含任意数量的数据项。每个数据项都是一个 `string` 类型，典型的 **MIME** 类型，如：**text/html**。

每个 `drag event` 都有一个`dataTransfer` 属性，其中保存着事件的数据。这个属性（`DataTransfer` 对象）也有管理拖拽数据的方法。`setData`() 方法为拖拽数据添加一个项，如下面的示例代码所示：

```js
function dragstart_handler(ev) {
  // 添加拖拽数据
  ev.dataTransfer.setData("text/plain", ev.target.innerText);
  ev.dataTransfer.setData("text/html", ev.target.outerHTML);
  ev.dataTransfer.setData("text/uri-list", ev.target.ownerDocument.location.href);
}
```

**定义拖拽图像**
---

拖拽过程中，浏览器会在鼠标旁显示一张默认图片。当然，应用程序也可以通过 `setDragImage()` 方法自定义一张图片，如下面的例子所示。

```js
function dragstart_handler(ev) {
  // Create an image and then use it for the drag image.
  // NOTE: change "example.gif" to a real image URL or the image
  // will not be created and the default drag image will be used.
  var img = new Image();
  img.src = 'example.gif';
  ev.dataTransfer.setDragImage(img, 10, 10);
}
```

**定义拖拽效果**
---

`dropEffect` 属性用来控制拖放操作中用户给予的反馈。它会影响到拖拽过程中浏览器显示的鼠标样式。比如，当用户悬停在目标元素上的时候，浏览器鼠标也许要反映拖放操作的类型。

有 3 个效果可以定义：

1. copy 表明被拖拽的数据将从它原本的位置拷贝到目标的位置。

2. move 表明被拖拽的数据将被移动。

3. link 表明在拖拽源位置和目标位置之间将会创建一些关系表格或是连接。

在拖拽过程中，拖拽效果也许会被修改以用于表明在具体位置上具体效果是否被允许，如果允许，在该位置则被允许放置。

以下例子表明如何使用该属性。

```js
function dragstart_handler(ev) {
  ev.dataTransfer.dropEffect = "copy";
}
```

**定义一个放置区**
---

当拖拽一个项目到 HTML 元素中时，浏览器默认不会有任何响应。想要让一个元素变成可释放区域，该元素必须设置 `ondragover` 和 `ondrop` 事件处理程序属性，下面的例子通过简单的事件处理展示了如何使用这些属性：

```html
<script>
function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
 ev.preventDefault();
 // Get the id of the target and add the moved element to the target's DOM
 var data = ev.dataTransfer.getData("text/plain");
 ev.target.appendChild(document.getElementById(data));
}
</script>

<p id="target" ondrop="drop_handler(event)" ondragover="dragover_handler(event)">Drop Zone</p>
```

注意每个处理程序调用 `preventDefault()` 来阻止对这个事件的其它处理过程（如触点事件或指针事件）。

**处理放置效果**
---

`drop` 事件的处理程序是以程序指定的方法处理拖拽数据。一般，程序调用 `getData()` 方法取出拖拽项目并按一定方式处理。程序意义根据 `dropEffect` 的值与/或可变更关键字的状态而不同

下面的例子展示了一个处理程序，从拖拽数据中获取事件源元素的 `id` 然后根据 `id` 移动源元素到目标元素：

```html
<script>
function dragstart_handler(ev) {
 // Add the target element's id to the data transfer object
 ev.dataTransfer.setData("application/my-app", ev.target.id);
 ev.dataTransfer.dropEffect = "move";
}
function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
 ev.preventDefault();
 // Get the id of the target and add the moved element to the target's DOM
 var data = ev.dataTransfer.getData("application/my-app");
 ev.target.appendChild(document.getElementById(data));
}
</script>

<p id="p1" draggable="true" ondragstart="dragstart_handler(event)">This element is draggable.</p>
<div id="target" ondrop="drop_handler(event)" ondragover="dragover_handler(event)">Drop Zone</div>
```

**拖拽结束**
---

拖拽操作结束时，在源元素（开始拖拽时的目标元素）上触发 `dragend` 事件。不管拖拽是完成还是被取消这个事件都会被触发。`dragend` 事件处理程序可以检查`dropEffect` 属性的值来确认拖拽成功与否。