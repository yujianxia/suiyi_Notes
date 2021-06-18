map+area
---

```html
<html>
    <body>

        <p>请点击图像上的星球，把它们放大。</p>

        <img
        src="/i/eg_planets.jpg"
        border="0" usemap="#planetmap"
        alt="Planets" />

        <map name="planetmap" id="planetmap">

            <area
            shape="circle"
            coords="180,139,14"
            href ="/example/html/venus.html"
            target ="_blank"
            alt="Venus" />

            <area
            shape="circle"
            coords="129,161,10"
            href ="/example/html/mercur.html"
            target ="_blank"
            alt="Mercury" />

            <area
            shape="rect"
            coords="0,0,110,260"
            href ="/example/html/sun.html"
            target ="_blank"
            alt="Sun" />

        </map>

        <p><b>注释：</b>img 元素中的 "usemap" 属性引用 map 元素中的 "id" 或 "name" 属性（根据浏览器），所以同时向 map 元素添加了 "id" 和 "name" 属性。</p>

    </body>
</html>
```

圆角属性
---

```html
<html>
    <style>
        div {
            overflow: hidden;
            width: 50px;
            height: 50px;
            background: red;
            border-radius: 50%;
        }
        
        a {
            display: inline-block;
            width: 50px;
            height: 50px;
        }
    </style>
    <body>
        <div>
            <a href="http://www.baidu.com"></a>
        </div>
    </body>
</html>
```

判断圆心点和单击点的距离是不是在半径中。
---
获取圆心的点在获取鼠标点击的点的坐标位置

svg圆
---

```
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red" onclick="alert(3)" />
</svg>
```