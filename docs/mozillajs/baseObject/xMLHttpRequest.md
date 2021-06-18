# XMLHttpRequest

`XMLHttpRequest`（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。XMLHttpRequest 在 AJAX 编程中被大量使用。

<a data-fancybox title="demo" href="/notes/assets/1619452522(1).jpg">![demo](/notes/assets/1619452522(1).jpg)</a>

尽管名称如此，`XMLHttpRequest` 可以用于获取任何类型的数据，而不仅仅是 `XML`。它甚至支持 `HTTP` 以外的协议（包括 `file://` 和 `FTP`），尽管可能受到更多出于安全等原因的限制。

如果您的通信流程需要从服务器端接收事件或消息数据，请考虑通过 [`EventSource`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource) 接口使用 [`server-sent events`](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)。对于全双工的通信， [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 可能是更好的选择。

# 构造函数

`XMLHttpRequest()`

该构造函数用于初始化一个 `XMLHttpRequest` 实例对象。在调用下列任何其他方法之前，必须先调用该构造函数，或通过其他方式，得到一个实例对象。

# 属性

> 此接口继承了 [`XMLHttpRequestEventTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget) 和 [`EventTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 的属性。

[`XMLHttpRequest.onreadystatechange`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/onreadystatechange)

当 `readyState` 属性发生变化时，调用的 [`EventHandler`](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers) (en-US)。

[`XMLHttpRequest.readyState`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState) **只读**

返回 一个无符号短整型（`unsigned short`）数字，代表请求的状态码。

[`XMLHttpRequest.response`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/response) **只读**

返回一个 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)、[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)，或 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，具体是哪种类型取决于 [`XMLHttpRequest.responseType`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType) 的值。其中包含整个响应实体（response entity body）。

[`XMLHttpRequest.responseText`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseText) **只读**

返回一个 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，该 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 包含对请求的响应，如果请求未成功或尚未发送，则返回 `null`。

[`XMLHttpRequest.responseType`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType)

一个用于定义响应类型的枚举值（enumerated value）。

[`XMLHttpRequest.responseURL`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseURL) **只读**

返回经过序列化（serialized）的响应 URL，如果该 URL 为空，则返回空字符串。

[`XMLHttpRequest.responseXML`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseXML) **只读**

返回一个 `Document`，其中包含该请求的响应，如果请求未成功、尚未发送或时不能被解析为 `XML` 或 `HTML`，则返回 `null`。

[`XMLHttpRequest.status`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/status) **只读**

返回一个无符号短整型（`unsigned short`）数字，代表请求的响应状态。

[`XMLHttpRequest.statusText`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/statusText) **只读**

返回一个 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，其中包含 `HTTP` 服务器返回的响应状态。与 [`XMLHTTPRequest.status`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/status) 不同的是，它包含完整的响应状态文本（例如，"200 OK"）。

> **注意：**根据 HTTP/2 规范（8.1.2.4 [`Response Pseudo-Header Fields`](https://http2.github.io/http2-spec/#HttpResponse)，响应伪标头字段），HTTP/2 没有定义任何用于携带 HTTP/1.1 状态行中包含的版本（version）或者原因短语（reason phrase）的方法。

[`XMLHttpRequest.timeout`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/timeout)

一个无符号长整型（`unsigned long`）数字，表示该请求的最大请求时间（毫秒），若超出该时间，请求会自动终止。

`XMLHttpRequestEventTarget.ontimeout`

当请求超时调用的 [`EventHandler`](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers) (en-US)。

[`XMLHttpRequest.upload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) **只读**

`XMLHttpRequestUpload`，代表上传进度。

[`XMLHttpRequest.withCredentials`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)

一个[`布尔值 (en-US)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，用来指定跨域 `Access-Control` 请求是否应当带有授权信息，如 cookie 或授权 header 头。

## 非标准属性

[`XMLHttpRequest.channel`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/channel) **只读**

一个 `nsIChannel`，对象在执行请求时使用的通道。

[`XMLHttpRequest.mozAnon`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/mozAnon) **只读**

一个布尔值，如果为真，请求将在没有 `cookie` 和身份验证 `header` 头的情况下发送。

[`XMLHttpRequest.mozSystem`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/mozSystem) **只读**

一个布尔值，如果为真，则在请求时不会强制执行同源策略。

[`XMLHttpRequest.mozBackgroundRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/mozBackgroundRequest)

一个布尔值，它指示对象是否是后台服务器端的请求。

## 事件处理器

作为 `XMLHttpRequest` 实例的属性之一，所有浏览器都支持 `onreadystatechange`。

后来，许多浏览器实现了一些额外的事件（`onload`、`onerror`、`onprogress` 等）。详见[`Using XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)。

更多现代浏览器，包括 Firefox，除了可以设置 `on*` 属性外，也提供标准的监听器 [`addEventListener()`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) API 来监听`XMLHttpRequest` 事件。

# 方法

[`XMLHttpRequest.abort()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort)

如果请求已被发出，则立刻中止请求。

[`XMLHttpRequest.getAllResponseHeaders()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)

以字符串的形式返回所有用 [`CRLF`](https://developer.mozilla.org/zh-CN/docs/Glossary/CRLF) 分隔的响应头，如果没有收到响应，则返回 `null`。

[`XMLHttpRequest.getResponseHeader()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/getResponseHeader)

返回包含指定响应头的字符串，如果响应尚未收到或响应中不存在该报头，则返回 `null`。

[`XMLHttpRequest.open()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open)

初始化一个请求。该方法只能在 `JavaScript` 代码中使用，若要在 `native code` 中初始化请求，请使用 [`openRequest()`](https://developer.mozilla.org/zh-CN/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIXMLHttpRequest)。

[`XMLHttpRequest.overrideMimeType()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/overrideMimeType)

覆写由服务器返回的 `MIME` 类型。

[`XMLHttpRequest.send()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send)

发送请求。如果请求是异步的（默认），那么该方法将在请求发送后立即返回。

[`XMLHttpRequest.setRequestHeader()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/setRequestHeader)

设置 HTTP 请求头的值。必须在 `open()` 之后、`send()` 之前调用 `setRequestHeader()` 方法。

## 非标准方法

`XMLHttpRequest.init()`

在 C++ 代码中初始化一个 `XHR` 对象。

> **警告：**该方法不能在 `JavaScript` 代码中使用。

[`XMLHttpRequest.openRequest()`](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/API/XMLHttpRequest/openRequest)

初始化一个请求。这个方法只能在原生 C++ 代码中使用；如果用 JavaScript 代码来初始化请求，使用 [`open()`](https://developer.mozilla.org/zh-cn/nsIXMLHttpRequest#open()) 代替。可参考 `open()` 的文档。

`XMLHttpRequest.sendAsBinary()`

`send()` 方法的变体，用来发送二进制数据。

# 事件

[`abort`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort_event)

当 request 被停止时触发，例如当程序调用 [`XMLHttpRequest.abort()`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort) 时。

也可以使用 [`onabort`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onabort) 属性。

[`error`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/error_event)

当 request 遭遇错误时触发。

也可以使用 [`onerror`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onerror) 属性

[`load`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/load_event)

[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)请求成功完成时触发。

也可以使用 [`onload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onload) 属性.

[`loadend`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/load_event)

当请求结束时触发, 无论请求成功 ([`load`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/load_event)) 还是失败 ([`abort`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort_event) 或 [`error`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/error_event))。

也可以使用 `onloadend` 属性。

[`loadstart`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/loadstart_event)

接收到响应数据时触发。

也可以使用 [`onloadstart`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onloadstart) 属性。

[`progress`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onloadstart)

当请求接收到更多数据时，周期性地触发。

也可以使用 [`onprogress`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onprogress) 属性。

[`timeout`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/timeout_event)

在预设时间内没有接收到响应时触发。

也可以使用 `ontimeout` 属性。