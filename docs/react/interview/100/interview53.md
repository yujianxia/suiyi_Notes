#
# constructor和getInitialState

* constructor

    * 用于class中的state初始化
    * 只能用于es6

* getInitialState

    * 用于es5中的state初始化
    * 算是兼容性写法需要引用createReactClass

# 引入本地图片

## 方式一、非背景图片引入方式

- 直接在img标签内部src中使用

```jsx
< img src={require('图片路径')} />
```

- import导入

```jsx
import imgSrc from '图片路径'

< img src={imgSrc} />
```

## 方式二、图片作为背景引入

- render()方法内定义为对象

```jsx
const bgGround {
    display: 'inline-block',
    height: '40px',
    width: '40px',
    background: `url(${require("图片路径")})`
}

// 在return中使用
<span style={bgGround}>xxxxx</span>
```

- import引入

```jsx
import imgUrl from '图片路径'

// render()中定义为对象

const bgGround = {
    display: 'inline-block',
    height: '40px',
    width: '40px',
    backgroundImage: 'url(' + imgUrl + ')'
}

//在return中使用
<span style={bgGround}>xxxxx</span>
```