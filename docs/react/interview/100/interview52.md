# `<div onClick={handlerClick}>单击</div>`和`<div onClick={handlerClick(1)}>单击</div>`有什么区别

绑定函数有三种方法
1、constructor绑定 
`constructor(props) {`
`super``(props);`
`this``.handleClick =` `this``.handleClick.bind(``this``);` `//构造函数中绑定`
`}`
`//然后可以`
`<p onClick={``this``.handleClick}>`
2. 使用时绑定 
`<``p` `onClick={this.handleClick.bind(this)}>`
3. 使用箭头函数 这种最简单 不用考虑this的指向问题 (但是会造成额外的渲染)

以上三种方法，第一种最优。

因为第一种构造函数只在组件初始化的时候执行一次，

第二种组件每次render都会执行

第三种在每一次render时候都会生成新的箭头函数。例：Test组件的click属性是个箭头函数，组件重新渲染的时候Test组件就会

因为这个新生成的箭头函数而进行更新，从而产生Test组件的不必要渲染。