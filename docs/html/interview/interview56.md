**Web Speech 的概念及用法**
---

* 语音识别通过 `SpeechRecognition` 接口进行访问，它提供了识别从音频输入（通常是设备默认的语音识别服务）中识别语音情景的能力。一般来说，将使用该接口的构造函数来构造一个新的 `SpeechRecognition` 对象，该对象包含了一些列有效的对象处理函数来检测识别设备麦克风中的语音输入。`SpeechGrammar` 接口则表示了应用中想要识别的特定文法。文法则通过 JSpeech Grammar Format (JSGF.) 来定义。

* 语音合成通过 `SpeechSynthesis` 接口进行访问，它提供了文字到语音（TTS）的能力，这使得程序能够读出它们的文字内容（通常使用设备默认的语音合成器）。不同的声音类类型通过 `SpeechSynthesisVoice` 对象进行表示，不同部分的文字则由 `SpeechSynthesisUtterance` 对象来表示。可以将它们传递给 `SpeechSynthesis.speak()` 方法来产生语音。

# Web Speech 的 API 接口

## 语音识别

`SpeechRecognition`

* 语音识别服务的控制器接口；它也处理由语音识别服务发来的 `SpeechRecognitionEvent` 事件。

`SpeechRecognitionAlternative`

* 表示由语音识别服务识别出的一个词汇。

`SpeechRecognitionError`

* 表示语音识别服务发出的报错信息。

`SpeechRecognitionEvent`

* result 和 nomatch 的事件对象，包含了与语音识别过程中间或最终结果相关的全部数据。

`SpeechGrammar`

* 将要交由语音识别服务进行识别的词汇或者词汇的模式。

`SpeechGrammarList`

* 表示一个由 `SpeechGrammar` 对象构成的列表。

`SpeechRecognitionResult`

* 表示一次识别中的匹配项，其中可能包含多个 `SpeechRecognitionAlternative` 对象。

`SpeechRecognitionResultList`

* 表示包含 `SpeechRecognitionResult` 对象的一个列表，如果是以 `continuous` 模式捕获的结果，则是单个对象。

## 语音合成

`SpeechSynthesis`

* 语音合成服务的控制器接口，可用于获取设备上可用的合成语音，开始、暂停以及其它相关命令的信息。

`SpeechSynthesisErrorEvent`

* 包含了在发音服务处理 SpeechSynthesisUtterance 对象过程中的信息及报错信息。

`SpeechSynthesisEvent`

* 包含了经由发音服务处理过的 SpeechSynthesisUtterance 对象当前状态的信息。

`SpeechSynthesisUtterance`

* 表示一次发音请求。其中包含了将由语音服务朗读的内容，以及如何朗读它（例如：语种、音高、音量）。

`SpeechSynthesisVoice`

* 表示系统提供的一个声音。每个 SpeechSynthesisVoice 都有与之相关的发音服务，包括了语种、名称 和 URI 等信息。

`Window.speechSynthesis`

* 由规格文档指定的，被称为 SpeechSynthesisGetter 的 [NoInterfaceObject] 接口的一部分，在 Window 对象中实现，speechSynthesis 属性可用于访问 SpeechSynthesis 控制器，从而获取语音合成功能的入口。