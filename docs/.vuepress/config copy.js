module.exports = {
    base: '/',
    dest: 'dist',
    title: '前端 学习',
    port: 666,
    markdown: {
        lineNumbers: true
    },
    head: [
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }],
        ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js' }],
        ['link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css' }]
    ],
    plugins: [
        ['vuepress-plugin-code-copy', true],
    ],
    serviceWorker: false,
    themeConfig: {
        repo: '',
        editLinks: true,
        docsDir: 'docs',
        lastUpdated: '上次更新',
        nav: [
            {
                text: 'js',
                items: [
                    {
                        text: 'mozilla：基本对象',
                        items: [
                            { text: 'symbol', link: '/mozillajs/baseObject/symbol.md' },
                            { text: 'promise', link: '/mozillajs/baseObject/promise.md' },
                            { text: 'XMLHttpRequest', link: '/mozillajs/baseObject/xMLHttpRequest.md' }
                        ]
                    },
                    {
                        text: '基础面试题',
                        items: [
                            { text: '第一套js综合基础面试题', link: '/jsInterview/baseInterview.md' },
                            { text: 'hybrid 混合开发', link: '/jsInterview/hybrid.md' },
                            { text: 'baseWebpack 基础开发', link: '/jsInterview/baseWebpack.md' },
                            { text: 'loader 基础使用', link: '/jsInterview/webpackLoader.md' },
                            { text: 'public 基础使用', link: '/jsInterview/webpackPublic.md' },
                            { text: '代码分离', link: '/jsInterview/codeSeparation.md' },
                            { text: 'performance 性能', link: '/jsInterview/performance.md' },
                            { text: '服务器基础', link: '/jsInterview/baseServer.md' },
                            { text: 'spa', link: '/jsInterview/spa.md' },
                        ]
                    },
                    {
                        text: 'js 概念',
                        items: [
                            { text: '第 1 期：调用堆栈', link: '/js/stack/executionStack.md' },
                            { text: '第 2 期：作用域闭包', link: '/js/scope/scopeChain.md' },
                            { text: '第 3 期：this 全面解析', link: '/js/this/thisBind.md' },
                            { text: '第 4 期：深浅拷贝原理', link: '/js/clone/cloneIntroduction.md' },
                            { text: '第 5 期：原型Prototype', link: '/js/prototype/baseProyotype.md' },
                            { text: '第 6 期：高阶函数', link: '/js/high/baseHigh.md' },
                            { text: '第 7 期：防抖节流', link: '/js/antiShakeThrottling/throttle.md' },
                            { text: '第 8 期：框架用到的js API', link: '/js/interview/interview1.md' },
                            { text: 'js知识碎片', link: '/js/interview/jsCompatible.md' },
                            { text: 'js零碎题目', link: '/js/scattered/interview50/interview1.md' },
                            {
                                text: '第 1 期：调用堆栈',
                                items: [
                                    { text: '【进阶1-1期】理解JavaScript 中的执行上下文和执行栈', link: '/js/stack/executionStack.md' },
                                    { text: '【进阶1-2期】JavaScript深入之执行上下文栈和变量对象', link: '/js/stack/variableObject.md' },
                                    { text: '【进阶1-3期】JavaScript深入之内存空间详细图解', link: '/js/stack/memorySpace.md' },
                                    { text: '【进阶1-4期】JavaScript深入之带走进内存机制', link: '/js/stack/memoryMechanism.md' },
                                    { text: '【进阶1-5期】JavaScript深入之4类常见内存泄漏及如何避免', link: '/js/stack/memoryLeak.md' }
                                ]
                            },
                            {
                                text: '第 2 期：作用域闭包',
                                items: [
                                    { text: '【进阶2-1期】深入浅出图解作用域链和闭包', link: '/js/scope/scopeChain.md' },
                                    { text: '【进阶2-2期】JavaScript深入之从作用域链理解闭包', link: '/js/scope/understandingClosures.md' },
                                    { text: '【进阶2-3期】JavaScript深入之闭包面试题解', link: '/js/scope/closureInterview.md' }
                                ]
                            },
                            {
                                text: '第 3 期：this 全面解析',
                                items: [
                                    { text: '【进阶3-1期】JavaScript深入之史上最全--5种this绑定全面解析', link: '/js/this/thisBind.md' },
                                    { text: '【进阶3-2期】JavaScript深入之重新认识箭头函数的this', link: '/js/this/arrowFunctionThis.md' },
                                    { text: '【进阶3-3期】深度广度解析 call 和 apply 原理、使用场景及实现', link: '/js/this/callApply.md' },
                                    { text: '【进阶3-4期】深度解析bind原理、使用场景及模拟实现', link: '/js/this/bindSimulation.md' },
                                    { text: '【进阶3-5期】深度解析 new 原理及模拟实现', link: '/js/this/newSimulation.md' }
                                ]
                            },
                            {
                                text: '第 4 期：深浅拷贝原理',
                                items: [
                                    { text: '【进阶4-1期】详细解析赋值、浅拷贝和深拷贝的区别', link: '/js/clone/cloneIntroduction.md' },
                                    { text: '【进阶4-2期】Object.assign 原理及其实现', link: '/js/clone/objectAssign.md' },
                                    { text: '【进阶4-3期】面试题之如何实现一个深拷贝', link: '/js/clone/deepClone.md' },
                                    { text: '【进阶4-4期】Lodash是如何实现深拷贝的', link: '/js/clone/lodashDeepClone.md' }
                                ]
                            },
                            {
                                text: '第 5 期：原型Prototype',
                                items: [
                                    { text: '【进阶5-1期】重新认识构造函数、原型和原型链', link: '/js/prototype/baseProyotype.md' },
                                    { text: '【进阶5-2期】图解原型链及其继承优缺点', link: '/js/prototype/prototypeInherit.md' },
                                    { text: '【进阶5-3期】深入探究 Function & Object 鸡蛋问题', link: '/js/prototype/functionObjectResource.md' }
                                ]
                            },
                            {
                                text: '第 6 期：高阶函数',
                                items: [
                                    { text: '【进阶6-1期】JavaScript 高阶函数浅析', link: '/js/high/baseHigh.md' },
                                    { text: '【进阶6-2期】深入高阶函数应用之柯里化', link: '/js/high/currying.md' },
                                    { text: '【进阶6-3期】Array 原型方法源码实现大解密', link: '/js/high/arraySourceCode.md' }
                                ]
                            },
                            {
                                text: '第 7 期：防抖节流',
                                items: [
                                    { text: '【进阶7-1期】深入浅出节流函数 throttle', link: '/js/antiShakeThrottling/throttle.md' },
                                    { text: '【进阶7-2期】深入浅出防抖函数 debounce', link: '/js/antiShakeThrottling/debounce.md' },
                                    { text: '【进阶7-3期】Throttle 和 Debounce 在 React 中的应用', link: '/js/antiShakeThrottling/throttleDebounceReact.md' },
                                    { text: '【进阶7-4期】深入篇 | 阿里 P6 必会 Lodash 防抖节流函数实现原理', link: '/js/antiShakeThrottling/lodashPrinciple.md' },
                                    { text: '【进阶7-5期】浅出篇 | 7 个角度吃透 Lodash 防抖节流原理', link: '/js/antiShakeThrottling/lodashThrottleDebounce.md' }
                                ]
                            },
                            {
                                text: '第 8 期：框架用到的js API',
                                items: [
                                    { text: '【进阶8-1期】Object.is（）', link: '/js/interview/interview1.md' }
                                ]
                            },
                            {
                                text: 'js知识碎片',
                                items: [
                                    { text: 'js 兼容性', link: '/js/interview/jsCompatible.md' },
                                    { text: 'event loop', link: '/js/interview/eventLoop.md' },
                                    { text: 'Object.is', link: '/js/interview/interview1.md' },
                                    { text: 'js 细节整理', link: '/js/interview/baseInterview.md' }
                                ]
                            },
                            {
                                text: 'js零碎题目',
                                items: [
                                    { text: '用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值', link: '/js/scattered/interview50/interview1.md' },
                                    { text: '写一个方法去掉字符串中的空格', link: '/js/scattered/interview50/interview2.md' },
                                    { text: 'JavaScript实现双向链表', link: '/js/scattered/interview50/interview3.md' }
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                text: 'css',
                items: [
                    {
                        text: '第 1 期：CSS API',
                        items: [
                            { text: '通配选择器', link: '/mozillaCss/reference/universalSelectors.md' },
                            { text: '元素选择器', link: '/mozillaCss/reference/typeSelectors.md' },
                            { text: '类选择器', link: '/mozillaCss/reference/classSelectors.md' },
                            { text: 'ID 选择器', link: '/mozillaCss/reference/iDSelectors.md' },
                            { text: '属性选择器', link: '/mozillaCss/reference/attributeSelectors.md' },
                            { text: '组合选择器', link: '/mozillaCss/reference/selectorList.md' },
                            { text: '相邻兄弟选择器', link: '/mozillaCss/reference/adjacentSiblingCombinator.md' },
                            { text: '通用兄弟选择器', link: '/mozillaCss/reference/generalSiblingCombinator.md' },
                            { text: '子选择器', link: '/mozillaCss/reference/childCombinator.md' },
                            { text: '后代选择器', link: '/mozillaCss/reference/descendantCombinator.md' },
                            { text: '伪类', link: '/mozillaCss/reference/pseudoClasses.md' },
                            { text: '伪元素', link: '/mozillaCss/reference/pseudoElements.md' },
                            { text: '@charset', link: '/mozillaCss/reference/charset.md' }
                        ]
                    },
                    {
                        text: '零散记录',
                        items: [
                            { text: 'css基础面试', link: '/css/interview/baseCss.md' },
                            { text: 'css单位', link: '/css/interview/units.md' },
                            { text: 'css属性继承有哪些？css中可继承的属性和不可继承属性', link: '/css/interview/cssTutorial.md' },
                            { text: 'link 和 @import', link: '/css/interview/linkImport.md' },
                            { text: 'css hack', link: '/css/interview/cssHack.md' },
                            { text: 'css box modal', link: '/css/interview/cssBoxModal.md' },
                            { text: 'css Selector', link: '/css/interview/cssSelector.md' },
                            { text: 'css before after', link: '/css/interview/cssBeforeAfter.md' },
                            { text: 'css 优先级', link: '/css/interview/cssPriority.md' },
                            { text: 'css 外边距重叠', link: '/css/interview/cssCollapsing.md' },
                            { text: 'css 布局和包含块', link: '/css/interview/containingBlock.md' },
                            { text: 'css 层叠上下文', link: '/css/interview/stackingContext.md' },
                            { text: 'css 块格式化上下文(BFC)', link: '/css/interview/blockFormattingContext.md' },
                            { text: 'css 伪类和伪元素', link: '/css/interview/cssPseudo.md' },
                            { text: 'css Grid 网格布局教程', link: '/css/interview/cssGridLayout.md' },
                            { text: 'css flex布局', link: '/css/interview/cssFlexLayout.md' },
                            { text: 'css flex布局demo', link: '/css/interview/cssFlexDemo.md' },
                            { text: 'css 新伪类', link: '/css/interview/cssPseudoClass.md' },
                            { text: 'css inline-block元素间间距', link: '/css/interview/cssInlineBlock.md' },
                            { text: 'css 兼容性', link: '/css/interview/cssCompatible.md' },
                            { text: '代码题目-span width|height', link: '/css/code/spanWidthHeight.md' },
                        ]
                    }
                ]
            },
            {
                text: 'html',
                items: [
                    {
                        text: '零散记录',
                        items: [
                            { text: '第1天使用link和@import有什么区别？', link: '/html/interview/linkImport.md' },
                            { text: '第2天html的元素？', link: '/html/interview/htmlElement.md' },
                            { text: '第3天HTML全局属性(globalattribute)？', link: '/html/interview/globalAttr.md' },
                            { text: '第4天HTML5的文件离线储存？', link: '/html/interview/offlineStorage.md' },
                            { text: '第5天简述超链接target属性？', link: '/html/interview/interview5.md' },
                            { text: '第6天label都有哪些作用？', link: '/html/interview/interview6.md' },
                            { text: '第7天iframe框架都有哪些优缺点？', link: '/html/interview/interview7.md' },
                            { text: '第9天浏览器内多个标签页之间的通信方式？', link: '/html/interview/interview8.md' },
                            { text: '第10天viewport常见设置？', link: '/html/interview/interview9.md' },
                            { text: '第12天常见的浏览器内核？', link: '/html/interview/interview10.md' },
                            { text: '第13天html5中的form怎么关闭自动完成？', link: '/html/interview/interview11.md' },
                            { text: '第14天为什么HTML5只需要写<!DOCTYPEHTML>？', link: '/html/interview/interview12.md' },
                            { text: '第15天title与h1的区别、b与strong的区别、i与em的区别？', link: '/html/interview/interview13.md' },
                            { text: '第16天元素的alt和title有什么区别？', link: '/html/interview/interview14.md' },
                            { text: '第17天认为table的作用和优缺点？', link: '/html/interview/interview15.md' },
                            { text: '第18天怎样在页面上实现一个圆形的可点击区域？', link: '/html/interview/interview16.md' },
                            { text: '第19天html中的置换元素和非置换元素的理解？', link: '/html/interview/interview17.md' },
                            { text: '第20天请描述HTML元素的显示优先级？', link: '/html/interview/interview18.md' },
                            { text: '第21天input元素中readonly和disabled？', link: '/html/interview/interview19.md' },
                            { text: '第22天js放在html的`<body>`和`<head>`有什么区别？', link: '/html/interview/interview20.md' },
                            { text: '第23天关于`<form>`标签的enctype属性？', link: '/html/interview/interview21.md' },
                            { text: '第24天属性data-？', link: '/html/interview/interview22.md' },
                            { text: '第26天GBK和UTF-8，页面上产生乱码？', link: '/html/interview/interview23.md' },
                            { text: '第27天影子(Shadow)DOM？', link: '/html/interview/interview24.md' },
                            { text: '第28天`<meta>`标签？', link: '/html/interview/interview25.md' },
                            { text: '第30天网页上的验证码？', link: '/html/interview/interview26.md' },
                            { text: '第31天DOM和BOM？', link: '/html/interview/interview27.md' },
                            { text: '第33天html和html5？', link: '/html/interview/interview28.md' },
                            { text: '第34天Standards模式和Quirks模式？', link: '/html/interview/interview29.md' },
                            { text: '第35天用一个div模拟textarea的实现？', link: '/html/interview/interview30.md' },
                            { text: '第37天html5哪些标签可以优化SEO？', link: '/html/interview/interview31.md' },
                            { text: '第38天cookie和session？', link: '/html/interview/interview32.md' },
                            { text: '第39天title与h1、b与strong、i与em？', link: '/html/interview/interview33.md' },
                            { text: '第43天元素固定在页面底部？', link: '/html/interview/interview34.md' },
                            { text: '第44天video标签中预加载视频用到的属性？', link: '/html/interview/interview35.md' },
                            { text: '第49天target="_blank"安全性问题？', link: '/html/interview/interview36.md' },
                            { text: '第51天Form表单上传文件？', link: '/html/interview/interview37.md' },
                            { text: '第53天webworkers？', link: '/html/interview/interview38.md' },
                            { text: '第54天HTML5的地理定位？', link: '/html/interview/interview39.md' },
                            { text: '第55天HTML5中新添加的表单属性？', link: '/html/interview/interview40.md' },
                            { text: '第59天WebGL？', link: '/html/interview/interview41.md' },
                            { text: '第60天src、href、link的区别？', link: '/html/interview/interview42.md' },
                            { text: '第61天HTML拖放API？', link: '/html/interview/interview43.md' },
                            { text: '第64天空格实体（5种以上）？', link: '/html/interview/interview44.md' },
                            { text: '第65天html直接输入多个空格为什么只能显示一个空格？', link: '/html/interview/interview45.md' },
                            { text: '第66天HTML5如果不写`<!DOCTYPEhtml>`，页面还会正常工作么？', link: '/html/interview/interview46.md' },
                            { text: '第67天请写出唤醒拔打电话、发送邮件、发送短信的例子？', link: '/html/interview/interview47.md' },
                            { text: '第68天写个例子说明HTML5在移动端如何打开APP？', link: '/html/interview/interview48.md' },
                            { text: '第69天怎样禁止表单记住密码自动填充？', link: '/html/interview/interview49.md' },
                            { text: "第70天html的a标签属性rel='nofollow'有什么作用？", link: '/html/interview/interview50.md' },
                            { text: '第71天怎么在IE8及以下实现HTML5的兼容？', link: '/html/interview/interview51.md' },
                            { text: '第72天video和audio分别支持哪些格式？', link: '/html/interview/interview52.md' },
                            { text: '第73天favicon.ico有什么作用？怎么在页面中引用？常用尺寸有哪些？可以修改后缀名吗？', link: '/html/interview/interview53.md' },
                            { text: '第74天在a标签上的四个伪类执行顺序是什么？', link: '/html/interview/interview54.md' },
                            { text: '第75天web页面标签优化？', link: '/html/interview/interview55.md' },
                            { text: '第76天HTML5如何识别语音读出的内容和朗读指定的内容？', link: '/html/interview/interview56.md' },
                            { text: '第77天HTML5的img标签属性srcset和sizes的理解？', link: '/html/interview/interview57.md' },
                            { text: '第78天HTML5中的datalist标签吗？', link: '/html/interview/interview58.md' },
                            { text: '第79天HTML5的应用程序缓存与浏览器缓存有什么不同？', link: '/html/interview/interview59.md' },
                            { text: '第80天Canvas和SVG区别？', link: '/html/interview/canvasSvg.md' },
                            { text: '第81天html5datalist？', link: '/html/interview/htmlDatalist.md' },
                        ]
                    }
                ]
            },
            {
                text: '端',
                items: [
                    {
                        text: '基础浏览器',
                        items: [
                            { text: '第一套浏览器综合基础面试题', link: '/browser/interview/baseInterview.md' },
                            { text: 'Quirks模式是什么？它和Standards模式有什么区别?', link: '/browser/interview/quirksStandards.md' },
                            { text: '获取localStorage和sessionStorage当前已存储大小?', link: '/browser/interview/storageSpace.md' }
                        ],
                    },
                    {
                        text: '基础http',
                        items: [
                            { text: '第一套http综合基础面试题', link: '/http/interview/baseInterview.md' },
                            { text: 'Fetch API 教程', link: '/http/interview/fetch.md' },
                            { text: '跨域资源共享 CORS 详解', link: '/http/interview/cors.md' }
                        ]
                    }
                ]
            },
            {
                text: '工具',
                items: [
                    {
                        text: 'webpack',
                        items: [
                            { text: '整理1', link: '/webpack/interview/webpackInterview.md' },
                            { text: '基本概念', link: '/webpack/interview/baseInterview.md' },
                            { text: '配置', link: '/webpack/interview/configuration.md' },
                            { text: '入口起点(entrypoints)', link: '/webpack/interview/entryPoints.md' },
                            { text: '输出(output)', link: '/webpack/interview/output.md' },
                            { text: 'loader', link: '/webpack/interview/loader.md' },
                            { text: 'plugin', link: '/webpack/interview/plugin.md' },
                        ]
                    },
                    {
                        text: 'git',
                        items: [
                            { text: 'git基础面试', link: '/git/index.md' }
                        ]
                    }
                ]
            },
            {
                text: 'react',
                items: [
                    {
                        text: 'react 源码阅读 代码视角',
                        items: [
                            { text: '概念', link: '/ILoveDevelop/react/principle/base.md' },
                            { text: '基础', link: '/ILoveDevelop/react/basic/reactApi.md' },
                            { text: '创建更新', link: '/ILoveDevelop/react/createUpdate/reactDomRender.md' },
                            { text: '任务调度', link: '/ILoveDevelop/react/taskScheduling/globalVariable.md' },
                            { text: 'commit 阶段', link: '/ILoveDevelop/react/commit/commitRoot.md' },
                            { text: '功能', link: '/ILoveDevelop/react/features/context.md' },
                            { text: 'Hooks', link: '/ILoveDevelop/react/hooks/start.md' },
                        ]
                    },
                    {
                        text: 'react 源码阅读 思想视角',
                        items: [
                            { text: '第 1 期：React理念', link: '/react/preparation/idea.md' },
                            { text: '第 2 期：前置知识', link: '/react/preparation/file.md' },
                            { text: '第 3 期：render阶段', link: '/react/process/reconciler.md' },
                            { text: '第 4 期：commit阶段', link: '/react/renderer/prepare.md' },
                            { text: '第 5 期：Diff算法', link: '/react/diff/prepare.md' },
                            { text: '第 6 期：状态更新', link: '/react/state/prepare.md' },
                            { text: '第 7 期：Hooks', link: '/react/hooks/prepare.md' },
                            { text: '第 8 期：Concurrent Mode', link: '/react/concurrent/prepare.md' },
                            { text: '第 9 期：基础概念', link: '/react/principle/basePrinciple.md' },
                            { text: '第 10 期：基础面试题', link: '/react/interview/50/interview1.md' },
                        ]
                    },
                    {
                        text: 'umi',
                        items: [
                            { text: '@umijs/plugin-dva', link: '/umi/interview/pluginDva.md' },
                            { text: '@umijs/plugin-qiankun', link: '/umi/interview/pluginQiankun.md' }
                        ]
                    }
                ]
            },
            {
                text: 'vue',
                items: [
                    {
                        text: '第 1 期：源码解读-准备工作',
                        items: [
                            { text: 'flow', link: '/vue/prepare/flow.md' },
                            { text: '源码目录', link: '/vue/prepare/directory.md' },
                            { text: '源码构建', link: '/vue/prepare/build.md' },
                            { text: '入口', link: '/vue/prepare/entrance.md' },
                        ]
                    },
                    {
                        text: '第2期：源码解读-数据驱动',
                        items: [
                            { text: '概述', link: '/vue/data-driven/index.md' },
                            { text: 'newVue', link: '/vue/data-driven/new-vue.md' },
                            { text: '挂载实现', link: '/vue/data-driven/mounted.md' },
                            { text: 'render', link: '/vue/data-driven/render.md' },
                            { text: 'VirtualDOM', link: '/vue/data-driven/virtual-dom.md' },
                            { text: 'createElement', link: '/vue/data-driven/create-element.md' },
                            { text: 'update', link: '/vue/data-driven/update.md' },
                        ]
                    },
                    {
                        text: '第3期：源码解读-组件化',
                        items: [
                            { text: '概述', link: '/vue/components/index.md' },
                            { text: 'createComponent', link: '/vue/components/create-component.md' },
                            { text: 'patch', link: '/vue/components/patch.md' },
                            { text: '合并配置', link: '/vue/components/merge-option.md' },
                            { text: '生命周期', link: '/vue/components/lifecycle.md' },
                            { text: '组件注册', link: '/vue/components/component-register.md' },
                            { text: '异步组件', link: '/vue/components/async-component.md' },
                        ]
                    },
                    {
                        text: '第4期：源码解读-深入响应式原理',
                        items: [
                            { text: '概述', link: '/vue/reactive/index.md' },
                            { text: '响应式对象', link: '/vue/reactive/reactive-object.md' },
                            { text: '依赖收集', link: '/vue/reactive/getters.md' },
                            { text: '派发更新', link: '/vue/reactive/setters.md' },
                            { text: 'nextTick', link: '/vue/reactive/next-tick.md' },
                            { text: '检测变化的注意事项', link: '/vue/reactive/questions.md' },
                            { text: '计算属性VS侦听属性', link: '/vue/reactive/computed-watcher.md' },
                            { text: '组件更新', link: '/vue/reactive/component-update.md' },
                            { text: 'Props(v2.6.11)', link: '/vue/reactive/props.md' },
                            { text: '原理图', link: '/vue/reactive/summary.md' },
                        ]
                    },
                    {
                        text: '第5期：源码解读-编译',
                        items: [
                            { text: '概述', link: '/vue/compile/index.md' },
                            { text: '编译入口', link: '/vue/compile/entrance.md' },
                            { text: 'parse', link: '/vue/compile/parse.md' },
                            { text: 'optimize', link: '/vue/compile/optimize.md' },
                            { text: 'codegen', link: '/vue/compile/codegen.md' },
                        ]
                    },
                    {
                        text: '第6期：源码解读-扩展',
                        items: [
                            { text: '概述', link: '/vue/extend/index.md' },
                            { text: 'event', link: '/vue/extend/event.md' },
                            { text: 'v-model', link: '/vue/extend/v-model.md' },
                            { text: 'slot', link: '/vue/extend/slot.md' },
                            { text: 'keep-alive', link: '/vue/extend/keep-alive.md' },
                            { text: 'transition', link: '/vue/extend/tansition.md' },
                            { text: 'transition-group', link: '/vue/extend/tansition-group.md' },
                        ]
                    },
                    {
                        text: '第7期：源码解读-VueRouter',
                        items: [
                            { text: '概述', link: '/vue/vue-router/index.md' },
                            { text: '路由注册', link: '/vue/vue-router/install.md' },
                            { text: 'VueRouter对象', link: '/vue/vue-router/router.md' },
                            { text: 'matcher', link: '/vue/vue-router/matcher.md' },
                            { text: '路径切换', link: '/vue/vue-router/transition-to.md' },
                        ]
                    },
                    {
                        text: '第8期：源码解读-Vuex',
                        items: [
                            { text: '概述', link: '/vue/vuex/idex.md' },
                            { text: 'Vuex初始化', link: '/vue/vuex/init.md' },
                            { text: 'API', link: '/vue/vuex/api.md' },
                            { text: '插件', link: '/vue/vuex/plugin.md' },
                        ]
                    },
                    {
                        text: '第9期：基础面试题',
                        items: [
                            { text: '整理1', link: '/vue/interview/baseInterview.md' },
                            { text: '整理2', link: '/vue/interview/baseInterviewSecond.md' },
                            { text: '知识体系', link: '/vue/interview/knowledgeSystem.md' },
                            { text: '响应式详解', link: '/vue/interview/detailedResponsiveness.md' },
                            { text: '组件间通信', link: '/vue/interview/componentCommunication.md' },
                            { text: '事件绑定', link: '/vue/interview/eventBinding.md' },
                            { text: 'slot插槽', link: '/vue/interview/slot.md' },
                            { text: '模板编译', link: '/vue/interview/templateCompilation.md' },
                            { text: 'diff算法', link: '/vue/interview/diff.md' },
                            { text: 'key作用', link: '/vue/interview/key.md' },
                        ]
                    }
                ]
            },
            {
                text: '算法',
                items: [
                    {
                        text: '第 1 期：基础面试题',
                        items: [
                            { text: '第一套综合基础面试题', link: '/algorithm/interview/baseInterview.md' }
                        ]
                    }
                ]
            }
        ],
        sidebar: {
            '/jsInterview/': [
                {
                    title: '第 1 期：基础面试题',
                    children: [
                        '/jsInterview/baseInterview.md',
                        '/jsInterview/hybrid.md',
                        '/jsInterview/baseWebpack.md',
                        '/jsInterview/webpackLoader.md',
                        '/jsInterview/webpackPublic.md',
                        '/jsInterview/codeSeparation.md',
                        '/jsInterview/performance.md',
                        '/jsInterview/baseServer.md',
                        '/jsInterview/spa.md'
                    ]
                }
            ],
            '/mozillajs/': [
                {
                    title: '第 1 期：基本对象',
                    children: [
                        '/mozillajs/baseObject/symbol.md',
                        '/mozillajs/baseObject/promise.md',
                        '/mozillajs/baseObject/xMLHttpRequest.md'
                    ]
                }
            ],
            '/mozillaCss/': [
                {
                    title: '第 1 期：CSS API',
                    children: [
                        '/mozillaCss/reference/universalSelectors.md',
                        '/mozillaCss/reference/typeSelectors.md',
                        '/mozillaCss/reference/classSelectors.md',
                        '/mozillaCss/reference/iDSelectors.md',
                        '/mozillaCss/reference/attributeSelectors.md',
                        '/mozillaCss/reference/selectorList.md',
                        '/mozillaCss/reference/adjacentSiblingCombinator.md',
                        '/mozillaCss/reference/generalSiblingCombinator.md',
                        '/mozillaCss/reference/childCombinator.md',
                        '/mozillaCss/reference/descendantCombinator.md',
                        '/mozillaCss/reference/pseudoClasses.md',
                        '/mozillaCss/reference/pseudoElements.md',
                        '/mozillaCss/reference/charset.md'
                    ]
                },
            ],
            '/js/': [
                {
                    title: '第 1 期：调用堆栈',
                    children: [
                        '/js/stack/executionStack.md',
                        '/js/stack/variableObject.md',
                        '/js/stack/memorySpace.md',
                        '/js/stack/memoryMechanism.md',
                        '/js/stack/memoryLeak.md',
                    ]
                },
                {
                    title: '第 2 期：作用域闭包',
                    children: [
                        '/js/scope/scopeChain.md',
                        '/js/scope/understandingClosures.md',
                        '/js/scope/closureInterview.md'
                    ]
                },
                {
                    title: '第 3 期：this 全面解析',
                    children: [
                        { title: '【进阶3-1期】JavaScript深入之史上最全--5种this绑定全面解析', path: '/js/this/thisBind.md' },
                        { title: '【进阶3-2期】JavaScript深入之重新认识箭头函数的this', path: '/js/this/arrowFunctionThis.md' },
                        { title: '【进阶3-3期】深度广度解析 call 和 apply 原理、使用场景及实现', path: '/js/this/callApply.md' },
                        { title: '【进阶3-4期】深度解析bind原理、使用场景及模拟实现', path: '/js/this/bindSimulation.md' },
                        { title: '【进阶3-5期】深度解析 new 原理及模拟实现', path: '/js/this/newSimulation.md' }
                    ]
                },
                {
                    title: '第 4 期：深浅拷贝原理',
                    children: [
                        { title: '【进阶4-1期】详细解析赋值、浅拷贝和深拷贝的区别', path: '/js/clone/cloneIntroduction.md' },
                        { title: '【进阶4-2期】Object.assign 原理及其实现', path: '/js/clone/objectAssign.md' },
                        { title: '【进阶4-3期】面试题之如何实现一个深拷贝', path: '/js/clone/deepClone.md' },
                        { title: '【进阶4-4期】Lodash是如何实现深拷贝的', path: '/js/clone/lodashDeepClone.md' }
                    ]
                },
                {
                    title: '第 5 期：原型Prototype',
                    children: [
                        { title: '【进阶5-1期】重新认识构造函数、原型和原型链', path: '/js/prototype/baseProyotype.md' },
                        { title: '【进阶5-2期】图解原型链及其继承优缺点', path: '/js/prototype/prototypeInherit.md' },
                        { title: '【进阶5-3期】深入探究 Function & Object 鸡蛋问题', path: '/js/prototype/functionObjectResource.md' }
                    ]
                },
                {
                    title: '第 6 期：高阶函数',
                    children: [
                        { title: '【进阶6-1期】JavaScript 高阶函数浅析', path: '/js/high/baseHigh.md' },
                        { title: '【进阶6-2期】深入高阶函数应用之柯里化', path: '/js/high/currying.md' },
                        { title: '【进阶6-3期】Array 原型方法源码实现大解密', path: '/js/high/arraySourceCode.md' }
                    ]
                },
                {
                    title: '第 7 期：防抖节流',
                    children: [
                        { title: '【进阶7-1期】深入浅出节流函数 throttle', path: '/js/antiShakeThrottling/throttle.md' },
                        { title: '【进阶7-2期】深入浅出防抖函数 debounce', path: '/js/antiShakeThrottling/debounce.md' },
                        { title: '【进阶7-3期】Throttle 和 Debounce 在 React 中的应用', path: '/js/antiShakeThrottling/throttleDebounceReact.md' },
                        { title: '【进阶7-4期】深入篇 | 阿里 P6 必会 Lodash 防抖节流函数实现原理', path: '/js/antiShakeThrottling/lodashPrinciple.md' },
                        { title: '【进阶7-5期】浅出篇 | 7 个角度吃透 Lodash 防抖节流原理', path: '/js/antiShakeThrottling/lodashThrottleDebounce.md' }
                    ]
                },
                {
                    title: '第 8 期：框架用到的js API',
                    children: [
                        { title: '【进阶8-1期】Object.is（）', path: '/js/interview/interview1.md' }
                    ]
                },
                {
                    title: 'js知识碎片',
                    children: [
                        { title: 'js 兼容性', path: '/js/interview/jsCompatible.md' },
                        { title: 'event loop', path: '/js/interview/eventLoop.md' },
                        { title: 'Object.is', path: '/js/interview/interview1.md' },
                        { title: 'js 细节整理', path: '/js/interview/baseInterview.md' }
                    ]
                },
                {
                    title: 'js零碎题目',
                    children: [
                        { title: '用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值', path: '/js/scattered/interview50/interview1.md' },
                        { title: '写一个方法去掉字符串中的空格', path: '/js/scattered/interview50/interview2.md' },
                        { title: 'JavaScript实现双向链表', path: '/js/scattered/interview50/interview3.md' }
                    ]
                }
            ],
            '/css/': [
                {
                    title: '零散记录',
                    children: [
                        { title: 'css基础面试', path: '/css/interview/baseCss.md' },
                        { title: 'css单位', path: '/css/interview/units.md' },
                        { title: 'css属性继承有哪些？css中可继承的属性和不可继承属性', path: '/css/interview/cssTutorial.md' },
                        { title: 'css hack', path: '/css/interview/cssHack.md' },
                        { title: 'css box modal', path: '/css/interview/cssBoxModal.md' },
                        { title: 'css Selector', path: '/css/interview/cssSelector.md' },
                        { title: 'css before after', path: '/css/interview/cssBeforeAfter.md' },
                        { title: 'css 优先级', path: '/css/interview/cssPriority.md' },
                        { title: 'css 外边距重叠', path: '/css/interview/cssCollapsing.md' },
                        { title: 'css 布局和包含块', path: '/css/interview/containingBlock.md' },
                        { title: 'css 伪类和伪元素', path: '/css/interview/cssPseudo.md' },
                        { title: 'css Grid 网格布局教程', path: '/css/interview/cssGridLayout.md' },
                        { title: 'css flex布局', path: '/css/interview/cssFlexLayout.md' },
                        { title: 'css flex布局demo', path: '/css/interview/cssFlexDemo.md' },
                        { title: 'css 新伪类', path: '/css/interview/cssPseudoClass.md' },
                        { title: 'css inline-block元素间间距', path: '/css/interview/cssInlineBlock.md' },
                        { title: 'css 兼容性', path: '/css/interview/cssCompatible.md' },
                        { title: '代码题目-span width|height', path: '/css/code/spanWidthHeight.md' },
                    ]
                }
            ],
            '/html/': [
                {
                    title: 'html 知识点',
                    children: [
                        {
                            title: '零散记录',
                            children: [
                                { title: '第1天使用link和@import有什么区别？', path: '/html/interview/linkImport.md' },
                                { title: '第2天html的元素？', path: '/html/interview/htmlElement.md' },
                                { title: '第3天HTML全局属性(globalattribute)？', path: '/html/interview/globalAttr.md' },
                                { title: '第4天HTML5的文件离线储存？', path: '/html/interview/offlineStorage.md' },
                                { title: '第5天简述超链接target属性？', path: '/html/interview/interview5.md' },
                                { title: '第6天label都有哪些作用？', path: '/html/interview/interview6.md' },
                                { title: '第7天iframe框架都有哪些优缺点？', path: '/html/interview/interview7.md' },
                                { title: '第9天浏览器内多个标签页之间的通信方式？', path: '/html/interview/interview8.md' },
                                { title: '第10天viewport常见设置？', path: '/html/interview/interview9.md' },
                                { title: '第12天常见的浏览器内核？', path: '/html/interview/interview10.md' },
                                { title: '第13天html5中的form怎么关闭自动完成？', path: '/html/interview/interview11.md' },
                                { title: '第14天为什么HTML5只需要写<!DOCTYPEHTML>？', path: '/html/interview/interview12.md' },
                                { title: '第15天title与h1的区别、b与strong的区别、i与em的区别？', path: '/html/interview/interview13.md' },
                                { title: '第16天元素的alt和title有什么区别？', path: '/html/interview/interview14.md' },
                                { title: '第17天认为table的作用和优缺点？', path: '/html/interview/interview15.md' },
                                { title: '第18天怎样在页面上实现一个圆形的可点击区域？', path: '/html/interview/interview16.md' },
                                { title: '第19天html中的置换元素和非置换元素的理解？', path: '/html/interview/interview17.md' },
                                { title: '第20天请描述HTML元素的显示优先级？', path: '/html/interview/interview18.md' },
                                { title: '第21天input元素中readonly和disabled？', path: '/html/interview/interview19.md' },
                                { title: '第22天js放在html的`<body>`和`<head>`有什么区别？', path: '/html/interview/interview20.md' },
                                { title: '第23天关于`<form>`标签的enctype属性？', path: '/html/interview/interview21.md' },
                                { title: '第24天属性data-？', path: '/html/interview/interview22.md' },
                                { title: '第26天GBK和UTF-8，页面上产生乱码？', path: '/html/interview/interview23.md' },
                                { title: '第27天影子(Shadow)DOM？', path: '/html/interview/interview24.md' },
                                { title: '第28天`<meta>`标签？', path: '/html/interview/interview25.md' },
                                { title: '第30天网页上的验证码？', path: '/html/interview/interview26.md' },
                                { title: '第31天DOM和BOM？', path: '/html/interview/interview27.md' },
                                { title: '第33天html和html5？', path: '/html/interview/interview28.md' },
                                { title: '第34天Standards模式和Quirks模式？', path: '/html/interview/interview29.md' },
                                { title: '第35天用一个div模拟titlearea的实现？', path: '/html/interview/interview30.md' },
                                { title: '第37天html5哪些标签可以优化SEO？', path: '/html/interview/interview31.md' },
                                { title: '第38天cookie和session？', path: '/html/interview/interview32.md' },
                                { title: '第39天title与h1、b与strong、i与em？', path: '/html/interview/interview33.md' },
                                { title: '第43天元素固定在页面底部？', path: '/html/interview/interview34.md' },
                                { title: '第44天video标签中预加载视频用到的属性？', path: '/html/interview/interview35.md' },
                                { title: '第49天target="_blank"安全性问题？', path: '/html/interview/interview36.md' },
                                { title: '第51天Form表单上传文件？', path: '/html/interview/interview37.md' },
                                { title: '第53天webworkers？', path: '/html/interview/interview38.md' },
                                { title: '第54天HTML5的地理定位？', path: '/html/interview/interview39.md' },
                                { title: '第55天HTML5中新添加的表单属性？', path: '/html/interview/interview40.md' },
                                { title: '第59天WebGL？', path: '/html/interview/interview41.md' },
                                { title: '第60天src、href、link的区别？', path: '/html/interview/interview42.md' },
                                { title: '第61天HTML拖放API？', path: '/html/interview/interview43.md' },
                                { title: '第64天空格实体（5种以上）？', path: '/html/interview/interview44.md' },
                                { title: '第65天html直接输入多个空格为什么只能显示一个空格？', path: '/html/interview/interview45.md' },
                                { title: '第66天HTML5如果不写`<!DOCTYPEhtml>`，页面还会正常工作么？', path: '/html/interview/interview46.md' },
                                { title: '第67天请写出唤醒拔打电话、发送邮件、发送短信的例子？', path: '/html/interview/interview47.md' },
                                { title: '第68天写个例子说明HTML5在移动端如何打开APP？', path: '/html/interview/interview48.md' },
                                { title: '第69天怎样禁止表单记住密码自动填充？', path: '/html/interview/interview49.md' },
                                { title: "第70天html的a标签属性rel='nofollow'有什么作用？", path: '/html/interview/interview50.md' },
                                { title: '第71天怎么在IE8及以下实现HTML5的兼容？', path: '/html/interview/interview51.md' },
                                { title: '第72天video和audio分别支持哪些格式？', path: '/html/interview/interview52.md' },
                                { title: '第73天favicon.ico有什么作用？怎么在页面中引用？常用尺寸有哪些？可以修改后缀名吗？', path: '/html/interview/interview53.md' },
                                { title: '第74天在a标签上的四个伪类执行顺序是什么？', path: '/html/interview/interview54.md' },
                                { title: '第75天web页面标签优化？', path: '/html/interview/interview55.md' },
                                { title: '第76天HTML5如何识别语音读出的内容和朗读指定的内容？', path: '/html/interview/interview56.md' },
                                { title: '第77天HTML5的img标签属性srcset和sizes的理解？', path: '/html/interview/interview57.md' },
                                { title: '第78天HTML5中的datalist标签吗？', path: '/html/interview/interview58.md' },
                                { title: '第79天HTML5的应用程序缓存与浏览器缓存有什么不同？', path: '/html/interview/interview59.md' },
                                { title: '第80天Canvas和SVG区别？', path: '/html/interview/canvasSvg.md' },
                                { title: '第81天html5datalist？', path: '/html/interview/htmlDatalist.md' },
                            ]
                        }
                    ]
                }
            ],
            '/browser/': [
                {
                    title: '各平台记录',
                    children: [
                        {
                            title: '基础浏览器',
                            children: [
                                { title: '第一套浏览器综合基础面试题', path: '/browser/interview/baseInterview.md' },
                                { title: 'Quirks模式是什么？它和Standards模式有什么区别?', path: '/browser/interview/quirksStandards.md' },
                                { title: '获取localStorage和sessionStorage当前已存储大小?', path: '/browser/interview/storageSpace.md' }
                            ]
                        }
                    ]
                }
            ],
            '/http/': [
                {
                    title: '网络请求',
                    children: [
                        {
                            title: '基础http',
                            children: [
                                { title: '第一套http综合基础面试题', path: '/http/interview/baseInterview.md' },
                                { title: 'Fetch API 教程', path: '/http/interview/fetch.md' },
                                { title: '跨域资源共享 CORS 详解', path: '/http/interview/cors.md' }
                            ]
                        }
                    ]
                },
            ],
            '/ILoveDevelop/': [
                {
                    title: 'react 源码阅读 代码视角',
                    children: [
                        {
                            title: '概念',
                            children: [
                                { title: '基础', path: '/ILoveDevelop/react/principle/base.md' },
                                { title: '流程', path: '/ILoveDevelop/react/principle/renderProcess.md' },
                                { title: '调度', path: '/ILoveDevelop/react/principle/schedulingPrinciple.md' },
                                { title: '组件更新', path: '/ILoveDevelop/react/principle/componentUpdate.md' },
                                { title: 'diff策略', path: '/ILoveDevelop/react/principle/commpontDiff.md' },
                            ]
                        },
                        {
                            title: '基础',
                            children: [
                                { title: 'reactapi', path: '/ILoveDevelop/react/basic/reactApi.md' },
                                { title: 'ReactElementapi', path: '/ILoveDevelop/react/basic/reactElement.md' },
                                { title: 'ReactChildrenapi', path: '/ILoveDevelop/react/basic/reactChildren.md' },
                                { title: 'React中的数据结构', path: '/ILoveDevelop/react/basic/reactFiber.md' },
                            ]
                        },
                        {
                            title: '创建更新',
                            children: [
                                { title: 'ReactDOM.render', path: '/ILoveDevelop/react/createUpdate/reactDomRender.md' },
                                { title: 'setState&forceUpdate', path: '/ILoveDevelop/react/createUpdate/setStateForceUpdate.md' },
                                { title: 'expirationTime时间', path: '/ILoveDevelop/react/createUpdate/expirationTime.md' },
                            ]
                        },
                        {
                            title: '任务调度',
                            children: [
                                { title: '全局变量', path: '/ILoveDevelop/react/taskScheduling/globalVariable.md' },
                                { title: 'scheduleWork', path: '/ILoveDevelop/react/taskScheduling/scheduleWork.md' },
                                { title: 'reactScheduler', path: '/ILoveDevelop/react/taskScheduling/reactScheduler.md' },
                                { title: 'performWork', path: '/ILoveDevelop/react/taskScheduling/performWork.md' },
                                { title: 'performUnitOfWork', path: '/ILoveDevelop/react/taskScheduling/performUnitOfWork.md' },
                                { title: 'renderRoot', path: '/ILoveDevelop/react/taskScheduling/renderRoot.md' },
                                { title: 'throwException', path: '/ILoveDevelop/react/taskScheduling/throwException.md' },
                                { title: 'beginWork', path: '/ILoveDevelop/react/taskScheduling/beginWork.md' },
                                { title: 'mountIndeterminateComponent', path: '/ILoveDevelop/react/taskScheduling/mountIndeterminateComponent.md' },
                                { title: 'mountLazyCompont', path: '/ILoveDevelop/react/taskScheduling/mountLazyCompont.md' },
                                { title: 'updateFunctionalComponent', path: '/ILoveDevelop/react/taskScheduling/updateFunctionalComponent.md' },
                                { title: 'updateClassComponent', path: '/ILoveDevelop/react/taskScheduling/updateClassComponent.md' },
                                { title: 'updateHostRoot', path: '/ILoveDevelop/react/taskScheduling/updateHostRoot.md' },
                                { title: 'updateHostComponent', path: '/ILoveDevelop/react/taskScheduling/updateHostComponent.md' },
                                { title: 'updateHostText', path: '/ILoveDevelop/react/taskScheduling/updateHostText.md' },
                                { title: 'updateSuspenseComponent', path: '/ILoveDevelop/react/taskScheduling/updateSuspenseComponent.md' },
                                { title: 'updatePortalComponent', path: '/ILoveDevelop/react/taskScheduling/updatePortalComponent.md' },
                                { title: 'updateForwardRef', path: '/ILoveDevelop/react/taskScheduling/updateForwardRef.md' },
                                { title: 'updateFragment', path: '/ILoveDevelop/react/taskScheduling/updateFragment.md' },
                                { title: 'updateMode', path: '/ILoveDevelop/react/taskScheduling/updateMode.md' },
                                { title: 'updateProfiler', path: '/ILoveDevelop/react/taskScheduling/updateProfiler.md' },
                                { title: 'updateContextProvider', path: '/ILoveDevelop/react/taskScheduling/updateContextProvider.md' },
                                { title: 'updateContextConsumer', path: '/ILoveDevelop/react/taskScheduling/updateContextConsumer.md' },
                                { title: 'reconcileChildren', path: '/ILoveDevelop/react/taskScheduling/reconcileChildren.md' },
                                { title: 'reconcileSingleElement', path: '/ILoveDevelop/react/taskScheduling/reconcileSingleElement.md' },
                                { title: 'reconcileChildrenArray', path: '/ILoveDevelop/react/taskScheduling/reconcileChildrenArray.md' },
                            ]
                        },
                        {
                            title: 'commit 阶段',
                            children: [
                                { title: 'commitRoot', path: '/ILoveDevelop/react/commit/commitRoot.md' },
                                { title: 'invokeGuardedCallback', path: '/ILoveDevelop/react/commit/invokeGuardedCallback.md' },
                                { title: 'commitBeforeMutationLifecycles', path: '/ILoveDevelop/react/commit/commitBeforeMutationLifecycles.md' },
                                { title: 'commitAllHostEffects', path: '/ILoveDevelop/react/commit/commitAllHostEffects.md' },
                                { title: 'commitPlacement', path: '/ILoveDevelop/react/commit/commitPlacement.md' },
                                { title: 'commitWork', path: '/ILoveDevelop/react/commit/commitWork.md' },
                                { title: 'commitDeletion', path: '/ILoveDevelop/react/commit/commitDeletion.md' },
                                { title: 'commitAllLifeCycles', path: '/ILoveDevelop/react/commit/commitAllLifeCycles.md' },
                            ]
                        },
                        {
                            title: '功能',
                            children: [
                                { title: 'context', path: '/ILoveDevelop/react/features/context.md' },
                                { title: 'hydrate', path: '/ILoveDevelop/react/features/hydrate.md' },
                                { title: 'ref', path: '/ILoveDevelop/react/features/ref.md' },
                                { title: '事件系统初始化', path: '/ILoveDevelop/react/features/evenInit.md' },
                                { title: '事件绑定', path: '/ILoveDevelop/react/features/eventBind.md' },
                                { title: '事件触发', path: '/ILoveDevelop/react/features/eventDispath.md' },
                                { title: '事件对象生成', path: '/ILoveDevelop/react/features/eventCreateEventObject.md' },
                                { title: 'suspense', path: '/ILoveDevelop/react/features/suspense.md' },
                                { title: '挂起任务', path: '/ILoveDevelop/react/features/suspenseWork.md' },
                                { title: 'lazy组件', path: '/ILoveDevelop/react/features/suspenseLazy.md' },
                            ]
                        },
                        {
                            title: 'Hooks',
                            children: [
                                { title: '基础', path: '/ILoveDevelop/react/hooks/start.md' },
                                { title: 'useState', path: '/ILoveDevelop/react/hooks/useState.md' },
                                { title: 'useEffect', path: '/ILoveDevelop/react/hooks/useEffect.md' },
                                { title: '其他API', path: '/ILoveDevelop/react/hooks/hooksOther.md' },
                                { title: '通用API', path: '/ILoveDevelop/react/hooks/hooksCommon.md' },
                            ]
                        }
                    ]
                },
            ],
            '/webpack/': [
                {
                    title: 'webpack',
                    children: [
                        {
                            title: '第1期：基础概念笔记',
                            children: [
                                { title: '整理1', path: '/webpack/interview/webpackInterview.md' },
                                { title: '基本概念', path: '/webpack/interview/baseInterview.md' },
                                { title: '配置', path: '/webpack/interview/configuration.md' },
                                { title: '入口起点(entrypoints)', path: '/webpack/interview/entryPoints.md' },
                                { title: '输出(output)', path: '/webpack/interview/output.md' },
                                { title: 'loader', path: '/webpack/interview/loader.md' },
                                { title: 'plugin', path: '/webpack/interview/plugin.md' },
                            ]
                        }
                    ]
                }
            ],
            '/git/': [
                {
                    title: 'git 基础整理',
                    children: [
                        { title: 'git基础面试', path: '/git/index.md' }
                    ]
                }
            ],
            '/umi/': [
                {
                    title: 'umi',
                    children: [
                        {
                            title: 'umi 整理',
                            children: [
                                { title: '@umijs/plugin-dva', path: '/umi/interview/pluginDva.md' },
                                { title: '@umijs/plugin-qiankun', path: '/umi/interview/pluginQiankun.md' },
                            ]
                        }
                    ]
                }
            ],
            '/vue/': [
                {
                    title: 'vue',
                    children: [
                        {
                            title: '第 1 期：源码解读-准备工作',
                            children: [
                                { title: 'flow', path: '/vue/prepare/flow.md' },
                                { title: '源码目录', path: '/vue/prepare/directory.md' },
                                { title: '源码构建', path: '/vue/prepare/build.md' },
                                { title: '入口', path: '/vue/prepare/entrance.md' },
                            ]
                        },
                        {
                            title: '第2期：源码解读-数据驱动',
                            children: [
                                { title: '概述', path: '/vue/data-driven/new-vue.md' },
                                { title: 'newVue', path: '/vue/data-driven/new-vue.md' },
                                { title: '挂载实现', path: '/vue/data-driven/mounted.md' },
                                { title: 'render', path: '/vue/data-driven/render.md' },
                                { title: 'VirtualDOM', path: '/vue/data-driven/virtual-dom.md' },
                                { title: 'createElement', path: '/vue/data-driven/create-element.md' },
                                { title: 'update', path: '/vue/data-driven/update.md' },
                            ]
                        },
                        {
                            title: '第3期：源码解读-组件化',
                            children: [
                                { title: '概述', path: '/vue/components/outline.md' },
                                { title: 'createComponent', path: '/vue/components/create-component.md' },
                                { title: 'patch', path: '/vue/components/patch.md' },
                                { title: '合并配置', path: '/vue/components/merge-option.md' },
                                { title: '生命周期', path: '/vue/components/lifecycle.md' },
                                { title: '组件注册', path: '/vue/components/component-register.md' },
                                { title: '异步组件', path: '/vue/components/async-component.md' },
                            ]
                        },
                        {
                            title: '第4期：源码解读-深入响应式原理',
                            children: [
                                { title: '概述', path: '/vue/reactive/outline.md' },
                                { title: '响应式对象', path: '/vue/reactive/reactive-object.md' },
                                { title: '依赖收集', path: '/vue/reactive/getters.md' },
                                { title: '派发更新', path: '/vue/reactive/setters.md' },
                                { title: 'nextTick', path: '/vue/reactive/next-tick.md' },
                                { title: '检测变化的注意事项', path: '/vue/reactive/questions.md' },
                                { title: '计算属性VS侦听属性', path: '/vue/reactive/computed-watcher.md' },
                                { title: '组件更新', path: '/vue/reactive/component-update.md' },
                                { title: 'Props(v2.6.11)', path: '/vue/reactive/props.md' },
                                { title: '原理图', path: '/vue/reactive/summary.md' },
                            ]
                        },
                        {
                            title: '第5期：源码解读-编译',
                            children: [
                                { title: '概述', path: '/vue/compile/outline.md' },
                                { title: '编译入口', path: '/vue/compile/entrance.md' },
                                { title: 'parse', path: '/vue/compile/parse.md' },
                                { title: 'optimize', path: '/vue/compile/optimize.md' },
                                { title: 'codegen', path: '/vue/compile/codegen.md' },
                            ]
                        },
                        {
                            title: '第6期：源码解读-扩展',
                            children: [
                                { title: '概述', path: '/vue/extend/outline.md' },
                                { title: 'event', path: '/vue/extend/event.md' },
                                { title: 'v-model', path: '/vue/extend/v-model.md' },
                                { title: 'slot', path: '/vue/extend/slot.md' },
                                { title: 'keep-alive', path: '/vue/extend/keep-alive.md' },
                                { title: 'transition', path: '/vue/extend/tansition.md' },
                                { title: 'transition-group', path: '/vue/extend/tansition-group.md' },
                            ]
                        },
                        {
                            title: '第7期：源码解读-VueRouter',
                            children: [
                                { title: '概述', path: '/vue/vue-router/outline.md' },
                                { title: '路由注册', path: '/vue/vue-router/install.md' },
                                { title: 'VueRouter对象', path: '/vue/vue-router/router.md' },
                                { title: 'matcher', path: '/vue/vue-router/matcher.md' },
                                { title: '路径切换', path: '/vue/vue-router/transition-to.md' },
                            ]
                        },
                        {
                            title: '第8期：源码解读-Vuex',
                            children: [
                                { title: '概述', path: '/vue/vuex/idex.md' },
                                { title: 'Vuex初始化', path: '/vue/vuex/init.md' },
                                { title: 'API', path: '/vue/vuex/api.md' },
                                { title: '插件', path: '/vue/vuex/plugin.md' },
                            ]
                        },
                        {
                            title: '第9期：基础面试题',
                            children: [
                                { title: '整理1', path: '/vue/interview/baseInterview.md' },
                                { title: '整理2', path: '/vue/interview/baseInterviewSecond.md' },
                                { title: '知识体系', path: '/vue/interview/knowledgeSystem.md' },
                                { title: '响应式详解', path: '/vue/interview/detailedResponsiveness.md' },
                                { title: '组件间通信', path: '/vue/interview/componentCommunication.md' },
                                { title: '事件绑定', path: '/vue/interview/eventBinding.md' },
                                { title: 'slot插槽', path: '/vue/interview/slot.md' },
                                { title: '模板编译', path: '/vue/interview/templateCompilation.md' },
                                { title: 'diff算法', path: '/vue/interview/diff.md' },
                                { title: 'key作用', path: '/vue/interview/key.md' },
                            ]
                        }
                    ]
                }
            ],
            '/react/': [
                {
                    title: 'react 源码阅读 思想视角',
                    children: [
                        {
                            title: '第 1 期：React理念',
                            children: [
                                { title: 'React理念', path: '/react/preparation/idea.md' },
                                { title: '老的React架构', path: '/react/preparation/oldConstructure.md' },
                                { title: '新的React架构', path: '/react/preparation/newConstructure.md' },
                                { title: 'Fiber架构的心智模型', path: '/react/process/fiber-mental.md' },
                                { title: 'Fiber架构的实现原理', path: '/react/process/fiber.md' },
                                { title: 'Fiber架构的工作原理', path: '/react/process/doubleBuffer.md' },
                                { title: '总结', path: '/react/preparation/summary.md' },
                            ]
                        },
                        {
                            title: '第2期：前置知识',
                            children: [
                                { title: '源码的文件结构', path: '/react/preparation/file.md' },
                                { title: '调试源码', path: '/react/preparation/source.md' },
                                { title: '深入理解JSX', path: '/react/preparation/jsx.md' },
                            ]
                        },
                        {
                            title: '第3期：render阶段',
                            children: [
                                { title: '流程概览', path: '/react/process/reconciler.md' },
                                { title: 'beginWork', path: '/react/process/beginWork.md' },
                                { title: 'completeWork', path: '/react/process/completeWork.md' },
                            ]
                        },
                        {
                            title: '第4期：commit阶段',
                            children: [
                                { title: '流程概览', path: '/react/renderer/prepare.md' },
                                { title: 'beforemutation阶段', path: '/react/renderer/beforeMutation.md' },
                                { title: 'mutation阶段', path: '/react/renderer/mutation.md' },
                                { title: 'layout阶段', path: '/react/renderer/layout.md' },
                            ]
                        },
                        {
                            title: '第5期：Diff算法',
                            children: [
                                { title: '概览', path: '/react/diff/prepare.md' },
                                { title: '单节点Diff', path: '/react/diff/one.md' },
                                { title: '多节点Diff', path: '/react/diff/multi.md' },
                            ]
                        },
                        {
                            title: '第6期：状态更新',
                            children: [
                                { title: '流程概览', path: '/react/state/prepare.md' },
                                { title: '心智模型', path: '/react/state/mental.md' },
                                { title: 'Update', path: '/react/state/update.md' },
                                { title: '深入理解优先级', path: '/react/state/priority.md' },
                                { title: 'ReactDOM.render', path: '/react/state/reactdom.md' },
                                { title: 'this.setState', path: '/react/state/setstate.md' },
                            ]
                        },
                        {
                            title: '第7期：Hooks',
                            children: [
                                { title: 'Hooks理念', path: '/react/hooks/prepare.md' },
                                { title: '极简Hooks实现', path: '/react/hooks/create.md' },
                                { title: 'Hooks数据结构', path: '/react/hooks/structure.md' },
                                { title: 'useState与useReducer', path: '/react/hooks/usestate.md' },
                                { title: 'useEffect', path: '/react/hooks/useeffect.md' },
                                { title: 'useRef', path: '/react/hooks/useref.md' },
                                { title: 'useMemo与useCallback', path: '/react/hooks/usememo.md' },
                            ]
                        },
                        {
                            title: '第8期：ConcurrentMode',
                            children: [
                                { title: '概览', path: '/react/concurrent/prepare.md' },
                                { title: 'Scheduler的原理与实现', path: '/react/concurrent/scheduler.md' },
                                { title: 'lane模型', path: '/react/concurrent/lane.md' },
                                { title: '深入源码剖析componentWillXXX为什么UNSAFE', path: '/react/concurrent/componentWillXXX.md' },
                            ]
                        },
                        {
                            title: '第9期：基础概念',
                            children: [
                                { title: '概述', path: '/react/principle/basePrinciple.md' },
                                { title: '组件类-api', path: '/react/principle/componentApi.md' },
                                { title: '工具类-api', path: '/react/principle/toolApi.md' },
                                { title: 'hooks-api', path: '/react/principle/hookApi.md' },
                                { title: 'react-dom-api', path: '/react/principle/domApi.md' },
                                { title: 'react-hook使用', path: '/react/principle/hookUse.md' },
                                { title: 'react-hook自定义', path: '/react/principle/hookCustom.md' },
                                { title: 'react-hook原理', path: '/react/principle/hookPrinciple.md' },
                                { title: '深入hoc', path: '/react/principle/hoc.md' },
                                { title: 'React-redux源码', path: '/react/principle/reactRedux.md' },
                                { title: 'react缓存页面', path: '/react/principle/reactKeeplive.md' },
                                { title: 'react-router路由原理', path: '/react/principle/reactRouter.md' },
                            ]
                        },
                        {
                            title: '第10期：基础面试题',
                            children: [
                                { title: '什么时候使用状态管理器?', path: '/react/interview/50/interview1.md' },
                                { title: 'render函数中return如果没有使用()会有什么问题?', path: '/react/interview/50/interview2.md' },
                                { title: 'componentWillUpdate可以直接修改state的值吗?', path: '/react/interview/50/interview3.md' },
                                { title: '说说对React的渲染原理的理解?', path: '/react/interview/50/interview4.md' },
                                { title: '什么渲染劫持？', path: '/react/interview/50/interview5.md' },
                                { title: 'ReactIntl？', path: '/react/interview/50/interview6.md' },
                                { title: 'Context？', path: '/react/interview/50/interview7.md' },
                                { title: 'Context实例？', path: '/react/interview/50/interview12.md' },
                                { title: 'RenderProps？', path: '/react/interview/50/interview8.md' },
                                { title: '高阶组件？', path: '/react/interview/50/interview9.md' },
                                { title: 'Refs转发？', path: '/react/interview/50/interview10.md' },
                                { title: 'React顶层API？', path: '/react/interview/50/interview11.md' },
                                { title: 'contextType？', path: '/react/interview/50/interview13.md' },
                                { title: '除了实例的属性可以获取Context外哪些地方还能直接获取Context？', path: '/react/interview/50/interview14.md' },
                                { title: 'Consumer？', path: '/react/interview/50/interview15.md' },
                                { title: 'windowing？', path: '/react/interview/50/interview16.md' },
                                { title: 'ReactDOM-React的插槽(Portals)？', path: '/react/interview/50/interview17.md' },
                                { title: 'React的插槽(Portals)？', path: '/react/interview/50/interview18.md' },
                                { title: '构造函数？', path: '/react/interview/50/interview19.md' },
                                { title: 'React拆分组件？', path: '/react/interview/50/interview20.md' },
                                { title: 'React的严格模式？', path: '/react/interview/50/interview21.md' },
                                { title: 'relay？', path: '/react/interview/50/interview22.md' },
                                { title: '捕获错误？', path: '/react/interview/50/interview23.md' },
                                { title: '如果组件的属性没有传值，那么它的默认值是什么？', path: '/react/interview/50/interview24' },
                                { title: 'React的表单库？', path: '/react/interview/50/interview25.md' },
                                { title: 'suspense组件？', path: '/react/interview/50/interview26.md' },
                                { title: '`super()`和`super(props)`？', path: '/react/interview/50/interview27.md' },
                                { title: '动态导入组件？', path: '/react/interview/50/interview28.md' },
                                { title: '给非控组件设置默认的值？', path: '/react/interview/50/interview29.md' },
                                { title: '使用Hooks获取服务端数据？', path: '/react/interview/50/interview30.md' },
                                { title: 'render方法的原理？', path: '/react/interview/50/interview31.md' },
                                { title: '使用Hooks？', path: '/react/interview/50/interview32.md' },
                                { title: 'useEffect和useLayoutEffect？', path: '/react/interview/50/interview33.md' },
                                { title: '自定义组件时render是否为可选的？', path: '/react/interview/50/interview34.md' },
                                { title: 'React必须使用JSX？', path: '/react/interview/50/interview35.md' },
                                { title: '需要把keys设置为全局唯一？', path: '/react/interview/50/interview36.md' },
                                { title: '怎么定时更新一个组件？', path: '/react/interview/50/interview37.md' },
                                { title: '使用webpack打包React项目优化？', path: '/react/interview/50/interview38.md' },
                                { title: 'React根据不同的环境打包？', path: '/react/interview/50/interview39.md' },
                                { title: '遍React的源码', path: '/react/interview/50/interview40.md' },
                                { title: 'React.forwardRef', path: '/react/interview/50/interview41.md' },
                                { title: 'React事件', path: '/react/interview/50/interview42.md' },
                                { title: 'React的reconciliation（一致化算法）', path: '/react/interview/50/interview43.md' },
                                { title: 'Fragment|DOM元素|安全注入', path: '/react/interview/50/interview44.md' },
                                { title: 'React中如何监听state', path: '/react/interview/50/interview45.md' },
                                { title: '为什么props复制给state会产生bug', path: '/react/interview/50/interview46.md' },
                                { title: 'React为什么不要直接修改state|ReactFiber', path: '/react/interview/50/interview47.md' },
                                { title: '装饰器(Decorator)React', path: '/react/interview/50/interview48.md' },
                                { title: 'react手动清除|for和htmlFor', path: '/react/interview/50/interview49.md' },
                                { title: 'React状态管理', path: '/react/interview/50/interview50.md' },
                                { title: 'React新特性', path: '/react/interview/100/interview51.md' },
                                { title: 'React事件引用', path: '/react/interview/100/interview52.md' },
                                { title: 'constructor和getInitialState|引入本地图片', path: '/react/interview/100/interview53.md' },
                                { title: 'ImmutableData', path: '/react/interview/100/interview54.md' },
                                { title: '提高组件的渲染效率', path: '/react/interview/100/interview55.md' },
                                { title: 'react推行函数式组件', path: '/react/interview/100/interview56.md' },
                            ]
                        }
                    ]
                }
            ],
            '/algorithm/': [
                {
                    title: '算法整理',
                    children: [
                        {
                            title: '第 1 期：基础面试题',
                            children: [
                                { title: '第一套综合基础面试题', path: '/algorithm/interview/baseInterview.md' }
                            ]
                        }
                    ]
                }
            ]
        },
        sidebarDepth: 3
    }
}