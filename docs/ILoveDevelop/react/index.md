### React 源码解析

[学习链接](https://react.jokcy.me/book/flow/render-root.html)

`React Fiber`中关于`TypeOfMode`的设计的时候

```js
export const NoContext = 0b000;
export const AsyncMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;
```

**React 的调度过程**：
---

<a data-fancybox title="React 的调度过程" href="https://k2facq.dm.files.1drv.com/y4moYVQixfYY02TZJM_jIqaj5ynq3-40CaJedwTfjeVz3H19UKoFIhbFI5ws8RJhCE4KJk73oF_EpFnR56ylk6KI6NYxA0UBIWGNfYceY0hm06ITSqniDIRBF-7LUiut5TUfEMiFvNzepHsF7PAQR4n3uWCsofOouwaIVXuiSlA1YisHyb70dffwYh64SaeYqYC4ENuEWYqm_qjg9KDjCnoTw?width=1763&height=1694&cropmode=none">![React 的调度过程](https://k2facq.dm.files.1drv.com/y4moYVQixfYY02TZJM_jIqaj5ynq3-40CaJedwTfjeVz3H19UKoFIhbFI5ws8RJhCE4KJk73oF_EpFnR56ylk6KI6NYxA0UBIWGNfYceY0hm06ITSqniDIRBF-7LUiut5TUfEMiFvNzepHsF7PAQR4n3uWCsofOouwaIVXuiSlA1YisHyb70dffwYh64SaeYqYC4ENuEWYqm_qjg9KDjCnoTw?width=1763&height=1694&cropmode=none)</a>

**渲染更新的过程**:
---

<a data-fancybox title="渲染更新的过程" href="https://jgfacq.dm.files.1drv.com/y4mlappMlJu85m_1P4H0wcoQBX_N8AyZoYJxw5JT19hm1sJ6dsblS5ZQOmdtHtFklf3l-lRtmX1nGaw31EUda8tOy9116LJPQlOpjHMOssHTq4Xue4eIiG7MSyp5MZ0KOeWP8fxvJCOsoStnEw8rbSlDjxjdO-I9faPAUQtIklI1zA-qvENd8J8D8y8fiks23W2j3Ur-KoxYu__6fsgCbXzHA?width=1923&height=1793&cropmode=none">![渲染更新的过程](https://jgfacq.dm.files.1drv.com/y4mlappMlJu85m_1P4H0wcoQBX_N8AyZoYJxw5JT19hm1sJ6dsblS5ZQOmdtHtFklf3l-lRtmX1nGaw31EUda8tOy9116LJPQlOpjHMOssHTq4Xue4eIiG7MSyp5MZ0KOeWP8fxvJCOsoStnEw8rbSlDjxjdO-I9faPAUQtIklI1zA-qvENd8J8D8y8fiks23W2j3Ur-KoxYu__6fsgCbXzHA?width=1923&height=1793&cropmode=none)</a>