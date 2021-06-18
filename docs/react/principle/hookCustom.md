#
# 自定义hooks

# 设计规范

**逻辑+ 组件**

<a data-fancybox title="demo" href="/notes/assets/react/78400dbc2d54425aa0d37c2bf6f119f9_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/78400dbc2d54425aa0d37c2bf6f119f9_tplv-k3u1fbpfcp-watermark.image)</a>

hooks 专注的就是**逻辑复用**， 是的项目，不仅仅停留在组件复用的层面上。hooks让可以将一段通用的逻辑存封起来。将需要它的时候，开箱即用即可。

## 自定义hooks-驱动条件

`hooks`本质上是一个函数。函数的执行，决定与无状态组件组件自身的执行上下文。每次函数的执行(本质上就是组件的更新)就会执行自定义`hooks`的执行，由此可见组件本身执行和`hooks`的执行如出一辙。

那么`prop`的修改,`useState`,`useReducer`使用是无状态组件更新条件，那么就是驱动`hooks`执行的条件。 用一幅图来表示如上关系。

<a data-fancybox title="demo" href="/notes/assets/react/d9c1ad37d4d348dab0fb3b988197e7da_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/d9c1ad37d4d348dab0fb3b988197e7da_tplv-k3u1fbpfcp-watermark.image)</a>

## 自定义hooks-通用模式

设计的自定义`react-hooks`应该是长的这样的

<a data-fancybox title="demo" href="/notes/assets/react/c11c50afea3d4567af7fc8f424838d1c_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/c11c50afea3d4567af7fc8f424838d1c_tplv-k3u1fbpfcp-watermark.image)</a>

```js
const [ xxx , ... ] = useXXX(参数A,参数B...)
```

## 自定义hooks-条件限定
---

如果自定义`hooks`没有设计好，比如返回一个改变`state`的函数，但是没有加条件限定限定，就有可能造成不必要的上下文的执行，更有甚的是组件的循环渲染执行。

比如:写一个非常简单`hooks`来**格式化数组将小写转成大写**。

```js

import React , { useState } from 'react'
/* 自定义hooks 用于格式化数组将小写转成大写 */
function useFormatList(list){
   return list.map(item=>{
       console.log(1111)
       return item.toUpperCase()
   })
}
/* 父组件传过来的list = [ 'aaa' , 'bbb' , 'ccc'  ] */
function index({ list }){
   const [ number ,setNumber ] = useState(0)
   const newList = useFormatList(list)
   return <div>
       <div className="list" >
          { newList.map(item=><div key={item} >{ item }</div>) }
        </div>
        <div className="number" >
            <div>{ number }</div>
            <button onClick={()=> setNumber(number + 1) } >add</button>
        </div>
   </div>
}
export default index
```

<a data-fancybox title="demo" href="/notes/assets/react/e2cce99472ea416ab9aeb4ce32cea2ac_tplv-k3u1fbpfcp-zoom-1.image">![demo](/notes/assets/react/e2cce99472ea416ab9aeb4ce32cea2ac_tplv-k3u1fbpfcp-zoom-1.image)</a>

如上述问题，格式化父组件传递过来的`list`数组，并将小写变成大写，但是当点击`add`。 理想状态下数组不需要重新`format`，但是实际跟着执行`format`。无疑增加了性能开销。

**所以在设置自定义hooks的时候，一定要把条件限定-性能开销加进去。**

```js
function useFormatList(list) {
    return useMemo(() => list.map(item => {
        console.log(1111)
        return item.toUpperCase()
    }), [])
}
```

<a data-fancybox title="demo" href="/notes/assets/react/5a04434ebf1147c898e0b8ae8106fad9_tplv-k3u1fbpfcp-zoom-1.image">![demo](/notes/assets/react/5a04434ebf1147c898e0b8ae8106fad9_tplv-k3u1fbpfcp-zoom-1.image)</a>

所以一个好用的自定义hooks,一定要配合`useMemo` ,`useCallback` 等`api`一起使用。

# 自定义hooks实战
----

## 准备工作：搭建demo样式项目

[自定义hooks,demo项目](https://github.com/AlienZhaolin/customHooks)

**项目结构**

<a data-fancybox title="demo" href="/notes/assets/react/8903a5fbcf9c44b38666d19f36639747_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/8903a5fbcf9c44b38666d19f36639747_tplv-k3u1fbpfcp-watermark.image)</a>

`page`文件夹里包括自定义hooks展示`demo`页面，`hooks`文件夹里面是自定义hooks内容。

**展示效果**

<a data-fancybox title="demo" href="/notes/assets/react/2c11072aa876433a99592776d06bc05d_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/2c11072aa876433a99592776d06bc05d_tplv-k3u1fbpfcp-watermark.image)</a>

每个`listItem`记录每一个完成自定义hooks展示效果，陆续还有其他的`hooks`。接下来看看hooks具体实现。

## 实战一：控制滚动条-吸顶效果，渐变效果-useScroll

背景：一个h5项目，在滚动条滚动的过程中，需要控制 渐变 + 高度 + 吸顶效果。

**1实现效果**

<a data-fancybox title="demo" href="/notes/assets/react/e8026e8ab20d402c9cdf778fe54f8023_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/e8026e8ab20d402c9cdf778fe54f8023_tplv-k3u1fbpfcp-watermark.image)</a>

1. 首先红色色块有吸顶效果。粉色色块，是固定上边但是有少量偏移，加上逐渐变透明效果。

2. 自定义`useScroll`设计思路

需要实现功能：

1. 监听滚动条滚动。 

2. 计算吸顶临界值，渐变值，透明度。 

3. 改变state渲染视图。

好吧，接下来让用一个`hooks`来实现上述工作。

**页面**

```js
import React from 'react'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import useScroll from '../../hooks/useScroll'
import './index.less'
export default function Index() { 
    const [scrollOptions,domRef] = useScroll()
    /* scrollOptions 保存控制透明度 ，top值 ，吸顶开关等变量 */
    const { opacity, top, suctionTop } = scrollOptions
    return <View style={{ position: 'static', height: '2000px' }} ref={domRef} >
        <View className='white' />
        <View  id='box' style={{ opacity, transform: `translateY(${top}px)` }} >
            <Swiper
              className='swiper'
            >
                <SwiperItem className='SwiperItem' >
                    <View className='imgae' />
                </SwiperItem>
            </Swiper>
        </View>
        <View className={suctionTop ? 'box_card suctionTop' : 'box_card'}>
            <View
              style={{
                    background: 'red',
                    boxShadow: '0px 15px 10px -16px #F02F0F'
                }}
              className='reultCard'
            >
            </View>
        </View>
    </View>
}
```

通过一个`scrollOptions` 来保存透明度 ，`top`值 ，吸顶开关等变量，然后通过返回一个`ref`作为`dom`元素的采集器。接下来就是hooks如果实现的。

`useScroll`

```js
export default function useScroll() {
    const dom = useRef(null)
    const [scrollOptions, setScrollOptions] = useState({
        top: 0,
        suctionTop: false,
        opacity: 1
    })

    useEffect(() => {
        const box = (dom.current)
        const offsetHeight = box.offsetHeight
        const radio = box.offsetHeight / 500 * 20
        const handerScroll = () => {
            const scrollY = window.scrollY
            /* 控制透明度 */
            const computerOpacty = 1 - scrollY / 160
            /* 控制吸顶效果 */
            const offsetTop = offsetHeight - scrollY - offsetHeight / 500 * 84
            const top = 0 - scrollY / 5
            setScrollOptions({
                opacity: computerOpacty <= 0 ? 0 : computerOpacty,
                top,
                suctionTop: offsetTop < radio
            })
        }
        document.addEventListener('scroll', handerScroll)
        return function () {
            document.removeEventListener('scroll', handerScroll)
        }
    }, [])
    return [scrollOptions, dom]
}
```

**具体设计思路**

1. 用一个 `useRef`来获取需要元素 

2. 用 `useEffect` 来初始化绑定/解绑事件 

3. 用 `useState` 来保存要改变的状态，通知组件渲染。

**有关性能优化**

一个无关`hooks`本身的性能优化点，在改变`top`值的时候 ，尽量用改变`transform` `Y`值代替直接改变`top`值，原因如下

1. `transform` 是可以让GPU加速的`CSS3`属性，在性能方便优于直接改变`top`值。 

2. 在`ios`端，固定定位频繁改变`top`值，会出现闪屏兼容性。

## 实战二：控制表单状态-useFormChange

背景：但遇到例如 列表的表头搜索，表单提交等场景，需要逐一改变每个`formItem`的`value`值，需要逐一绑定事件是比较麻烦的一件事，于是在平时的开发中，来用一个`hooks`来统一管理表单的状态。

**1 获取表单**

<a data-fancybox title="demo" href="/notes/assets/react/b1ab5ca4df224e17ba276f9b244c2874_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/b1ab5ca4df224e17ba276f9b244c2874_tplv-k3u1fbpfcp-watermark.image)</a>

**2 重置表单**

<a data-fancybox title="demo" href="/notes/assets/react/2d577d2e98ac4211ad86628b72e09b6d_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/2d577d2e98ac4211ad86628b72e09b6d_tplv-k3u1fbpfcp-watermark.image)</a>

**自定义`useFormChange`设计思路**

需要实现功能

1. 控制每一个表单的值。

2. 具有表单提交，获取整个表单数据功能。

3. 点击重置，重置表单功能。

**页面**

```js
import useFormChange from '../../hooks/useFormChange'
import './index.less'
const selector = ['嘿嘿', '哈哈', '嘻嘻']
function index() {
    const [formData, setFormItem, reset] = useFormChange()
    const {
        name,
        options,
        select
    } = formData
    return <View className='formbox' >
        <View className='des' >文本框</View>
        <AtInput  name='value1' title='名称'  type='text' placeholder='请输入名称'  value={name} onChange={(value) => setFormItem('name', value)}
        />
        <View className='des' >单选</View>
        <AtRadio
          options={[
                { label: '单选项一', value: 'option1' },
                { label: '单选项二', value: 'option2' },
            ]}
          value={options}
          onClick={(value) => setFormItem('options', value)}
        />
        <View className='des' >下拉框</View>
        <Picker mode='selector' range={selector} onChange={(e) => setFormItem('select',selector[e.detail.value])} >
            <AtList>
                <AtListItem
                  title='当前选择'
                  extraText={select}
                />
            </AtList>
        </Picker>
        <View className='btns' >
            <AtButton type='primary' onClick={() => console.log(formData)} >提交</AtButton>
            <AtButton className='reset' onClick={reset} >重置</AtButton>
        </View>
    </View>
}
```

`useFormChange`

```js
/* 表单/表头搜素hooks */
function useFormChange() {
    const formData = useRef({})
    const [, forceUpdate] = useState(null)
    const handerForm = useMemo(()=>{
        /* 改变表单单元项 */
        const setFormItem = (keys, value) => {      
            const form = formData.current
            form[keys] = value
            forceUpdate(value)
        }
        /* 重置表单 */
        const resetForm = () => {
            const current = formData.current
            for (let name in current) {
                current[name] = ''
            }
            forceUpdate('')
        }
        return [ setFormItem ,resetForm ]
    },[])
  
    return [ formData.current ,...handerForm ]
}
```

具体流程分析： 

1. 用`useRef`来缓存整个表单的数据。

2. 用`useState`单独做更新，不需要读取`useState`状态。

3. 声明重置表单方法`resetForm` , 设置表单单元项`change`方法，

**用`useRef`来缓存`formData`数据**

* 原因一都知道当用`useMemo`,`useCallback`等API的时候，如果引用了`useState`，就要把`useState`值作为deps传入，否侧由于`useMemo`,`useCallback`缓存了`useState`旧的值，无法得到新得值，但是`useRef`不同，可以直接读取/改变`useRef`里面缓存的数据。

* 原因二**同步**`useState`在一次使用`useState`改变`state`值之后，是无法获取最新的`state`

如下demo

```js
function index(){
    const [ number , setNumber ] = useState(0)
    const changeState = ()=>{
        setNumber(number+1)
        console.log(number) //组件更新  -> 打印number为0 -> 并没有获取到最新的值
    }
   return <View>
       <Button onClick={changeState} >点击改变state</Button>
   </View>
}
```

用 `useRef` 和 `useState`达到同步效果

```js
function index(){
    const number = useRef(0)
    const [  , forceUpdate ] = useState(0)
    const changeState = ()=>{
        number.current++
        forceUpdate(number.current)
        console.log(number.current) //打印值为1，组件更新，值改变
    }
   return <View>
       <Button onClick={changeState} >点击改变state</Button>
   </View>
}
```

**性能优化** 用`useMemo`来优化`setFormItem` ,`resetForm`方法，避免重复声明，带来的性能开销。

## 实战三：控制表格/列表-useTableRequset

背景：当需要控制带分页，带查询条件的表格/列表的情况下。

**1 实现效果**

<a data-fancybox title="demo" href="/notes/assets/react/9ac645977fa14f70bd0694a30baf7b27_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/9ac645977fa14f70bd0694a30baf7b27_tplv-k3u1fbpfcp-watermark.image)</a>

1. 统一管理表格的数据，包括列表，页码，总页码数等信息 

2. 实现切换页码，更新数据。

**2 自定义`useTableRequset`设计思路**

1. 需要`state`来保存列表数据，总页码数，当前页面等信息。

2. 需要暴露一个方法用于，改变分页数据，从新请求数据。

**页面**

```js
function getList(payload){
    const query = formateQuery(payload)
    return fetch('http://127.0.0.1:7001/page/tag/list?'+ query ).then(res => res.json())
}
export default function index(){
    /* 控制表格查询条件 */
    const [ query , setQuery ] = useState({})
    const [tableData, handerChange] = useTableRequest(query,getList)
    const { page ,pageSize,totalCount ,list } = tableData
    return <View className='index' >
        <View className='table' >
            <View className='table_head' >
                <View className='col' >技术名称</View>
                <View className='col' >icon</View>
                <View className='col' >创建时间</View>
            </View>
            <View className='table_body' >
               {
                   list.map(item=><View className='table_row' key={item.id}  >
                        <View className='col' >{ item.name }</View>
                        <View className='col' > <Image className='col col_image'  src={Icons[item.icon].default} /></View>
                        <View className='col' >{ item.createdAt.slice(0,10) }</View>
                   </View>)
               }
            </View>
        </View>
        <AtPagination 
          total={Number(totalCount)} 
          icon
          pageSize={Number(pageSize)}
          onPageChange={(mes)=>handerChange({ page:mes.current })}
          current={Number(page)}
        ></AtPagination>
    </View>
}
```

`useTableRequset`

```js
 /* table 数据更新 hooks */
export default function useTableRequset(query, api) {
    /* 是否是第一次请求 */
    const fisrtRequest = useRef(false)
    /* 保存分页信息 */
    const [pageOptions, setPageOptions] = useState({
        page: 1,
        pageSize: 3
    })
    /* 保存表格数据 */
    const [tableData, setTableData] = useState({
        list: [],
        totalCount: 0,
        pageSize: 3,
        page:1,
    })
    /* 请求数据 ,数据处理逻辑根后端协调着来 */
    const getList = useMemo(() => {
        return async payload => {
            if (!api) return
            const data = await api(payload || {...query, ...pageOptions})
            if (data.code == 0) {
                setTableData(data.data)
                fisrtRequest.current = true
            } 
        }
    }, [])
    /* 改变分页，重新请求数据 */
    useEffect(() => {
        fisrtRequest.current && getList({
            ...query,
            ...pageOptions
        })
    }, [pageOptions])
    /* 改变查询条件。重新请求数据 */
    useEffect(() => {
        getList({
            ...query,
            ...pageOptions,
            page: 1
        })
    }, [query])
    /* 处理分页逻辑 */
    const handerChange = useMemo(() => (options) => setPageOptions({...options }), [])
  
    return [tableData, handerChange, getList]
}
```

具体设计思路：

因为是`demo`项目，用本地服务器做了一个数据查询的接口，为的是模拟数据请求。

1. 用一个`useRef`来缓存是否是第一次请求数据。

2. 用`useState` 保存返回的数据和分页信息。

3. 用两个`useEffect`分别处理，对于列表查询条件的更改，或者是分页状态更改，启动副作用钩子，重新请求数据，这里为了区别两种状态更改效果，实际也可以用一个`effect`来处理。

4. 暴露两个方法，分别是请求数据和处理分页逻辑。

**性能优化**

1. 用一个`useRef`来缓存是否是第一次渲染，目的是为了，初始化的时候，两个`useEffect`钩子都会执行，为了避免重复请求数据。

2. 对于请求数据和处理分页逻辑，避免重复声明，用`useMemo`加以优化。

**需要注意的是，这里把请求数据后处理逻辑连同自定义`hooks`封装在一起，在实际项目中，要看和后端约定的数据返回格式来制定属于自己的`hooks`。**

## 实战四：控制拖拽效果-useDrapDrop

背景：用`transform`和`hooks`实现了拖拽效果，无需设置定位。

**1 实现效果**

<a data-fancybox title="demo" href="/notes/assets/react/cb61492a9dff4e9f84579bfcf2454555_tplv-k3u1fbpfcp-watermark.image">![demo](/notes/assets/react/cb61492a9dff4e9f84579bfcf2454555_tplv-k3u1fbpfcp-watermark.image)</a>

独立`hooks`绑定独立的`dom`元素，使之能实现自由拖拽效果。

**2 `useDrapDrop`具体实现思路**

需要实现的功能：

1. 通过自定义`hooks`计算出来的 x ,y 值，通过将`transform`的`translate`属性设置当前计算出来的`x,y`实现拖拽效果。

2. 自定义`hooks`能抓取当前`dom`元素容器。

**页面**

```js
export default function index (){
    const [ style1 , dropRef ]= useDrapDrop()
    const [style2,dropRef2] = useDrapDrop()
    return <View className='index'>
        <View 
            className='drop1' 
            ref={dropRef}
            style={{transform:`translate(${style1.x}px, ${style1.y}px)`}} 
        >drop1</View>
        <View 
            className='drop2'   
            ref={dropRef2}
            style={{transform:`translate(${style2.x}px, ${style2.y}px)`}} 
        >drop2</View>
        <View 
            className='drop3'
        >drop3</View>
    </View>
}
```

**注意点：**没有用,`left`,和`top`来改变定位，`css3`的`transform`能够避免浏览器的重排和回流，性能优化上要强于直接改变定位的top,left值。
由于模拟环境考虑到是h5移动端，所以用 `webview`的 `touchstart` , `touchmove` ,`ontouchend` 事件来进行模拟。

**核心代码-`useDrapDrop`**

```js
/* 移动端 -> 拖拽自定义效果(不使用定位) */
function useDrapDrop() {
    /* 保存上次移动位置 */  
    const lastOffset = useRef({
        x:0, /* 当前x 值 */
        y:0, /* 当前y 值 */
        X:0, /* 上一次保存X值 */
        Y:0, /* 上一次保存Y值 */
    })  
    /* 获取当前的元素实例 */
    const currentDom = useRef(null)
    /* 更新位置 */
    const [, foceUpdate] = useState({})
    /* 监听开始/移动事件 */
    const [ ontouchstart ,ontouchmove ,ontouchend ] = useMemo(()=>{
        /* 保存left right信息 */
        const currentOffset = {} 
        /* 开始滑动 */
        const touchstart = function (e) {   
            const targetTouche = e.targetTouches[0]
            currentOffset.X = targetTouche.clientX
            currentOffset.Y = targetTouche.clientY
        }
        /* 滑动中 */
        const touchmove = function (e){
            const targetT = e.targetTouches[0]
            let x =lastOffset.current.X  + targetT.clientX - currentOffset.X
            let y =lastOffset.current.Y  + targetT.clientY - currentOffset.Y 	
            lastOffset.current.x = x
            lastOffset.current.y = y
            foceUpdate({
                x,y
            })
        }
        /* 监听滑动停止事件 */
        const touchend =  () => {
            lastOffset.current.X = lastOffset.current.x
            lastOffset.current.Y = lastOffset.current.y
        }
        return [ touchstart , touchmove ,touchend]
    },[])
    useLayoutEffect(()=>{
        const dom = currentDom.current
        dom.ontouchstart = ontouchstart
        dom.ontouchmove = ontouchmove
        dom.ontouchend = ontouchend
    },[])
    return [ { x:lastOffset.current.x,y:lastOffset.current.y } , currentDom]
}
```

具体设计思路：

1. 对于拖拽效果，需要实时获取`dom`元素的位置信息，所以需要一个`useRef`来抓取`dom`元素。

2. 由于用的是`transfrom`改变位置，所以需要保存一下当前位置和上一次`transform`的位置，所以用一个`useRef`来缓存位置。

3. 通过`useRef`改变x,y值,但是需要渲染新的位置，所以用一个`useState`来专门产生组件更新。

4. 初始化的时候需要给当前的元素绑定事件,因为在初始化的时候可能精确需要元素的位置信息，所以用`useLayoutEffect`钩子来绑定`touchstart` , `touchmove` ,`ontouchend`等事件。