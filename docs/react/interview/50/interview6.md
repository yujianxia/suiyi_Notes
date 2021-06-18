类似于 `angular` 以及 `vue` 中的 过滤器

React-intl提供了两种使用方法，一种是**直接调取API**，另一种是**引用React组件**

React-intl提供的**调取API**方法如下：

1. 导入`injectIntl`

```js
import { injectIntl, FormattedMessage } from 'react-intl'
```

2. 在组件中注入

```js
export default connect(state => {
  return {
    ...state
  };
})(injectIntl(App));
```

或

```js
export default connect(mapStateToProps,mapActionCreators)(injectIntl(App))
```

3. 使用`intl`对象

通过第二步的注入，现在在在 组件的`props` 上会得到一个 intl 对象，它提供的方法和咱们上边介绍的组件基本相对应，这时候想要显示字符串，可以使用`formatMessage`方法：

<a data-fancybox title="如图" href="https://upload-images.jianshu.io/upload_images/3360256-11c2399f9141d31b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp">![如图](https://upload-images.jianshu.io/upload_images/3360256-11c2399f9141d31b.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)</a>

```js
const {intl} = this.props;
　　
let demo = intl.formatMessage({id: 'intl.name'});
```

4. 应用

```js
<Input placeholder={formatMessage(demo.placeholder)}/>
```

或使用`defineMessages`，来进行转换成字符串

* 1. 导入`injectIntl`和`defineMessages`

```js
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
```

* 2. 在组件中注入`injectIntl`

```js
export default connect(state => {
  return {
    ...state
  };
})(injectIntl(App));
```

或

```js
export default connect(mapStateToProps,mapActionCreators)(injectIntl(App))
```

3.使用`defineMessages`定义和`intl`对象

```js
const {intl: { formatMessage }} = this.props;
const demo = defineMessages({
    placeholder: {
        id: "modal.invite.placeholder",
        defaultMessage: "请输入邀请人昵称",
    },
});
```

* 4. 应用

```js
<Input placeholder={formatMessage(demo.placeholder)}/>
```

**React-intl**提供的**React组件**有如下几种：

`<IntlProvider />`包裹在需要语言国际化的组建的最外层，为包含在其中的所有组建提供包含id和字符串的键值对。

**日期时间**
---

1. `<FormattedDate />` 用于格式化日期，能够将一个时间戳格式化成不同语言中的日期格式。

传入时间戳作为参数：

```jsx
<FormattedDate 
    value={new Date(1459832991883)}
/>
```

输出结果：

```jsx
<span>4/5/2016</span>
```

2. `<FormattedTime>` 用于格式化时间，效果与`<FormattedDate />`相似。

传入时间戳作为参数：

```jsx
<FormattedTime 
   value={new Date(1459832991883)}
/>
```

输出结果：

```jsx
<span>1:09 AM</span>
```

3.`<FormattedRelative />` 通过这个组件可以显示传入组件的某个时间戳和当前时间的关系，比如 "10 minutes ago" 。

传入时间戳作为参数：

```jsx
<FormattedRelative 
    value={Date.now()}
/>
```

输出结果:

```jsx
<span>now</span>
```

**数字量词**
---

1. `<FormattedNumber />`这个组件最主要的用途是用来给一串数字标逗号，比如10000这个数字，在中文的语言环境中应该是1,0000，是每隔4位加一个逗号，而在英语的环境中是10,000，每隔3位加一个逗号。

传入数字作为参数：

```jsx
<FormattedNumber 
    value={1000}
/>
```

输出结果：

```jsx
<span>1,000</span>
```

2. `<FormattedPlural />` 这个组件可用于格式化量词，在中文的语境中，其实不太会用得到，比如说一个鸡腿，那么量词就是‘个’，说两个鸡腿，量词还是‘个’，不会发生变化。但是在英文的语言环境中，描述一个苹果的时候，量词是apple，当苹果数量为两个时，就会变成apples，这个组件的作用就在于此。

传入组件的参数中，value为数量，其他的为不同数量时对应的量词，在下面的例子中，一个的时候量词为message，两个的时候量词为messages。实际上可以传入组件的量词包括 zero, one, two, few, many, other 已经涵盖了所有的情况。

```jsx
<FormattedPlural
    value={10}
    one='message'
    other='messages'/>
```

传入组件的量词参数可以是一个字符串，也可以是一个组件，可以选择传入`<FormattedMessage />`组件，就可以实现量词的不同语言的切换。

输出结果：

```jsx
<span>messages</span>
```

**字符串的格式化**
---

1. `<FormattedMessage />` 这个组件用于格式化字符串，是所有的组件中使用频率最高的组件，因为基本上，UI上面的每一个字符串都应该用这个组件替代。

比如在locale配置文件中写了如下内容：

```js
const zhCn = {
  hello:"好，世界！",
};
export default zhCn;
```

使用这个组件的时候，这么写：

```jsx
<FormattedMessage
    id='hello'
    description='问好'
    defaultMessage='好，世界!'
    />
```

id指代的是这个字符串在`locale`配置文件中的属性名，`description`指的是对于这个位置替代的字符串的描述，便于维护代码，不写的话也不会影响输出的结果，当在`locale`配置文件中没有找到这个id的时候，输出的结果就是`defaultMessage`的值。

输出的结果：

```jsx
<span>好，世界!</span>
```

2. `<FormattedHTMLMessage />`这个组件的用法和`<FormattedMessage />`完全相同，唯一的不同就是输出的字符串可以包含HTML标签，但是官方不太推荐使用这个方法，这个组件的用法就不举例了。

**1. 安装**
---

```shell
npm install react-intl -save
```

**注意**：为了兼容Safari各个版本，需要同时安装 intl，intl在大部分的『现代』浏览器中是默认自带的，但是Safari和IE11以下的版本就没有了，这里需要注意一下。

安装intl需要在终端中输入以下指令：

```shell
npm install intl --save
```

**2. 引用**
---

```js
import { FormattedMessage } from 'react-intl'
```

```js
require ReactIntl from 'react-intl'
```

**3. 创建locale配置文件**
---

在zh_CN.js编写如下代码：

```js
const zhCn = {
  hello:"好，世界！",
};
export default zhCn;
```

在en_US.js编写如下代码：

```js
const enUs = {
  hello:"Hello, world!",
};
export default enUs;
```

**4. 使用<IntlProvider />**
---

使用`<IntlProvider />`组件包裹住需要您需要进行语言国际化的组件，用法和React-redux的`<Provider />`差不多，当`<IntlProvider />`包裹住某个组件的时候，这个组件本身和组件内部包含的子组件就可以获得所有React-intl提供的接口以及在`<IntlProvider />`中引入的locale配置文件的内容。

* `addLocaleData`：引入本地的 localedata
* `IntlProvider`：包裹需要翻译的组件，用来传递给子类语言信息
* `FormattedMessage` ：包裹需要实现多国语言的文字

```js
import React from "react";
import PropTypes from "prop-types";
import { IntlProvider, addLocaleData } from "react-intl";
import zh from "react-intl/locale-data/zh";
import en from "react-intl/locale-data/en";
import ja from "react-intl/locale-data/ja";
import ko from "react-intl/locale-data/ko";
import { chooseLocale, getLanguage } from "./../../lib/tools/utils.js";

const Intl = ({ children }) => {

  addLocaleData([...zh, ...en, ...ja, ...ko]);

  const defaultLang = getLanguage();

  return (
    <IntlProvider locale={defaultLang} messages={chooseLocale()}>
      {children}
    </IntlProvider>
  );
};

Intl.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Intl;
```

`locale`是传递需要国际化的语言的缩写，通过这个参数可以确定格式化日期，数字，量词的时候按照哪一种语言的规则，这个是规则是`intl`提供的，一般浏览器会内置这个库，但是在Safari和IE11之前需要自己安装，安装的方法前面已经提及，请自己翻阅。
`messages`是用于传递刚刚在第3步中定义的配置文件的，从示例代码中可以看出，首先使用Import语句引入了配置文件，然后将配置文件的内容传递给了`messages`这个参数，此时`<App />`组件中的所有组件都可以拿到配置文件中的内容了。

首先，先获取`localStorage`中存储的语言，如果没有设置过，那么就获取浏览器的语言`navigator.language`，如果设置过，那么就从`localStorage`中获取到选择的语言。

```js
import enUs from "./../locale/en_US";
import zhCn from "./../locale/zh_CN";
import jaJp from "./../locale/ja_JP";
import koKr from "./../locale/ko_KR";

// 获取语言
export function getLanguage() {
  const lang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
  const localStorageLang = localStorage.getItem("lang");
  const defaultLang = localStorageLang || lang;
  return defaultLang;
}

// 修改html.lang显示
export function changeHtmlLang(lang) {
  return document.getElementById("lang").lang = lang;
}

// 设置语言
export function setLanguage(lang) {
  const defaultLang = localStorage.setItem("lang", lang);
  return defaultLang;
}

// 匹配语言
export function chooseLocale() {
  switch (getLanguage()) {
  case "en":
    changeHtmlLang(getLanguage());
    return enUs;
  case "zh":
    changeHtmlLang(getLanguage());
    return zhCn;
  case "ja":
    changeHtmlLang(getLanguage());
    return jaJp;
  case "ko":
    changeHtmlLang(getLanguage());
    return koKr;
  default:
    changeHtmlLang(getLanguage());
    return zhCn;
  }
}
```