# 管理资源

> dist/index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>管理资源</title>
    </head>
    <body>
        <script src="main.js"></script>
        <script src="bundle.js"></script>
    </body>
</html>
```

> webpack.config.js

```javascript
const path = require('path');
 
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
```

**加载 CSS**
---

```javascript
npm install --save-dev style-loader css-loader
```

> webpack.config.js

```javascript
const path = require('path');
 
module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
+  module: {
+    rules: [
+      {
+        test: /\.css$/i,
+        use: ['style-loader', 'css-loader'],
+      },
+    ],
+  },
};
```

模块 loader 可以链式调用。链中的每个 loader 都将对资源进行转换。链会逆序执行。第一个 loader 将其结果（被转换后的资源）传递给下一个 loader，依此类推。最后，webpack 期望链中的最后的 loader 返回 JavaScript。

应保证 loader 的先后顺序：`'style-loader'` 在前，而 `'css-loader'` 在后。如果不遵守此约定，webpack 可能会抛出错误

> *webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这个示例中，所有以 .css 结尾的文件，都将被提供给 style-loader 和 css-loader*

> project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- style.css
    |- index.js
  |- /node_modules
```

> src/style.css

```css
.hello {
  color: red;
}
```

> src/index.js

```javascript
import _ from 'lodash';
+import './style.css';
 
 function component() {
   const element = document.createElement('div');
 
   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+  element.classList.add('hello');
 
   return element;
 }
 
 document.body.appendChild(component());
```

> 运行 build 命令

注意，在多数情况下，也可以进行 `压缩 CSS`，以便在生产环境中节省加载时间。最重要的是，现有的 loader 可以支持任何可以想到的 CSS 风格 - `postcss`, `sass` 和 `less` 等。

**加载 images 图像**
---

> webpack.config.js

```javascript
const path = require('path');
 
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
+           {
+               test: /\.(png|svg|jpg|jpeg|gif)$/i,
+               type: 'asset/resource',
+           },
        ],
    },
};
```

现在，在 `import MyImage from './my-image.png'` 时，此图像将被处理并添加到 `output` 目录，并且 `MyImage` 变量将包含该图像在处理后的最终 url。在使用 `css-loader` 时，如前所示，会使用类似过程处理的 CSS 中的 `url('./my-image.png')`。loader 会识别这是一个本地文件，并将 `'./my-image.png'` 路径，替换为 `output` 目录中图像的最终路径。而 `html-loader` 以相同的方式处理 `<img src="./my-image.png" />`。

> project

```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

> src/index.js

```javascript
import _ from 'lodash';
+ import './style.css';
import Icon from './icon.png';
 
 function component() {
   const element = document.createElement('div');
 
   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.classList.add('hello');
 
+  // 将图像添加到已经存在的 div 中。
+  const myIcon = new Image();
+  myIcon.src = Icon;
+
+  element.appendChild(myIcon);

   return element;
 }
 
 document.body.appendChild(component());
```

> src/style.css

```css
.hello {
   color: red;
+  background: url('./icon.png');
}
```

> 重新构建


现在应该看到的 icon 图标成为了重复的背景图，以及 `Hello webpack` 文本旁边的 `img` 元素。如果检查此元素，将看到实际的文件名已更改为 `29822eaa871e8eadeaa4.png`。这意味着 webpack 在 `src` 文件夹中找到的文件，并对其进行了处理！

**加载 fonts 字体**
---

> webpack.config.js

```javascript
 const path = require('path');
 
 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
   module: {
     rules: [
       {
         test: /\.css$/i,
         use: ['style-loader', 'css-loader'],
       },
       {
         test: /\.(png|svg|jpg|jpeg|gif)$/i,
         type: 'asset/resource',
       },
+      {
+        test: /\.(woff|woff2|eot|ttf|otf)$/i,
+        type: 'asset/resource',
+      },
     ],
   },
 };
```

> project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- my-font.woff
+   |- my-font.woff2
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

配置好 loader 并将字体文件放在合适的位置后，可以通过一个 `@font-face` 声明将其混合。本地的 `url(...)` 指令会被 webpack 获取处理，就像它处理图片一样：

> src/style.css

```css
+@font-face {
+  font-family: 'MyFont';
+  src: url('./my-font.woff2') format('woff2'),
+    url('./my-font.woff') format('woff');
+  font-weight: 600;
+  font-style: normal;
+}

 .hello {
   color: red;
*  font-family: 'MyFont';
   background: url('./icon.png');
 }
```

> 重新构建

**加载数据**
---

可以加载的有用资源还有数据，如 JSON 文件，CSV、TSV 和 XML。类似于 NodeJS，JSON 支持实际上是内置的，也就是说 `import Data from './data.json'` 默认将正常运行。要导入 CSV、TSV 和 XML，可以使用 `csv-loader` 和 `xml-loader`。让处理加载这三类文件

```shell
npm install --save-dev csv-loader xml-loader
```

> webpack.config.js

```javascript
const path = require('path');
 
 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
   module: {
     rules: [
       {
         test: /\.css$/i,
         use: ['style-loader', 'css-loader'],
       },
       {
         test: /\.(png|svg|jpg|jpeg|gif)$/i,
         type: 'asset/resource',
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/i,
         type: 'asset/resource',
       },
+      {
+        test: /\.(csv|tsv)$/i,
+        use: ['csv-loader'],
+      },
+      {
+        test: /\.xml$/i,
+        use: ['xml-loader'],
+      },
     ],
   },
 };
```

> project

```
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- data.xml
+   |- data.csv
    |- my-font.woff
    |- my-font.woff2
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

> src/data.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Mary</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Call Cindy on Tuesday</body>
</note>
```

> src/data.csv

```
to,from,heading,body
Mary,John,Reminder,Call Cindy on Tuesday
Zoe,Bill,Reminder,Buy orange juice
Autumn,Lindsey,Letter,I miss you
```

可以 `import` 这四种类型的数据(`JSON`, `CSV`, `TSV`, `XML`)中的任何一种，所导入的 `Data` 变量，将包含可直接使用的已解析 JSON：

> src/index.js

```javascript
 import _ from 'lodash';
 import './style.css';
 import Icon from './icon.png';
+import Data from './data.xml';
+import Notes from './data.csv';
 
 function component() {
   const element = document.createElement('div');
 
   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.classList.add('hello');
 
   // Add the image to our existing div.
   const myIcon = new Image();
   myIcon.src = Icon;
 
   element.appendChild(myIcon);
 
+  console.log(Data);
+  console.log(Notes);

   return element;
 }
 
 document.body.appendChild(component());
```

重新执行 `npm run build` 命令，然后打开 `dist/index.html`。查看开发者工具中的控制台，应该能够看到导入的数据会被打印出来！

> 只有在使用 JSON 模块默认导出时会没有警告。

```javascript
// 没有警告
import data from './data.json';

// 显示警告，规范不允许这样做。
import { foo } from './data.json';
```

**自定义 JSON 模块 parser**
---

假设在 `src` 文件夹下有一个 `data.toml`、一个 `data.yaml` 以及一个 `data.json5` 文件：

> src/data.toml

```toml
title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
organization = "GitHub"
bio = "GitHub Cofounder & CEO\nLikes tater tots and beer."
dob = 1979-05-27T07:32:00Z
```

> src/data.yaml

```yaml
title: YAML Example
owner:
  name: Tom Preston-Werner
  organization: GitHub
  bio: |-
    GitHub Cofounder & CEO
    Likes tater tots and beer.
  dob: 1979-05-27T07:32:00.000Z
```

> src/data.json5

```json5
{
  // comment
  title: "JSON5 Example",
  owner: {
    name: "Tom Preston-Werner",
    organization: "GitHub",
    bio: "GitHub Cofounder & CEO\n\
Likes tater tots and beer.",
    dob: "1979-05-27T07:32:00.000Z"
  }
}
```

首先安装 `toml`，`yamljs` 和 `json5` 的 packages：

```shell
npm install toml yamljs json5 --save-dev
```

> webpack.config.js

```javascript
const path = require('path');
+const toml = require('toml');
+const yaml = require('yamljs');
+const json5 = require('json5');
 
 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
   module: {
     rules: [
       {
         test: /\.css$/i,
         use: ['style-loader', 'css-loader'],
       },
       {
         test: /\.(png|svg|jpg|jpeg|gif)$/i,
         type: 'asset/resource',
       },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/i,
         type: 'asset/resource',
       },
       {
         test: /\.(csv|tsv)$/i,
         use: ['csv-loader'],
       },
       {
         test: /\.xml$/i,
         use: ['xml-loader'],
       },
+      {
+        test: /\.toml$/i,
+        type: 'json',
+        parser: {
+          parse: toml.parse,
+        },
+      },
+      {
+        test: /\.yaml$/i,
+        type: 'json',
+        parser: {
+          parse: yaml.parse,
+        },
+      },
+      {
+        test: /\.json5$/i,
+        type: 'json',
+        parser: {
+          parse: json5.parse,
+        },
+      },
     ],
   },
 };
```

> src/index.js

```javascript
 import _ from 'lodash';
 import './style.css';
 import Icon from './icon.png';
 import Data from './data.xml';
 import Notes from './data.csv';
+import toml from './data.toml';
+import yaml from './data.yaml';
+import json from './data.json5';

+console.log(toml.title); // output `TOML Example`
+console.log(toml.owner.name); // output `Tom Preston-Werner`

+console.log(yaml.title); // output `YAML Example`
+console.log(yaml.owner.name); // output `Tom Preston-Werner`

+console.log(json.title); // output `JSON5 Example`
+console.log(json.owner.name); // output `Tom Preston-Werner`
 
 function component() {
   const element = document.createElement('div');
 
   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.classList.add('hello');
 
   // Add the image to our existing div.
   const myIcon = new Image();
   myIcon.src = Icon;
 
   element.appendChild(myIcon);
 
   console.log(Data);
   console.log(Notes);
 
   return element;
 }
 
 document.body.appendChild(component());
```

**全局资源**
---

无需依赖于含有全部资源的 /assets 目录，而是将资源与代码组合在一起使用

```
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

假如想在另一个项目中使用 `/my-component`，只需将其复制或移动到 `/components` 目录下。只要已经安装过全部_外部依赖_，并且_已经在配置中定义过相同的 loader_，那么项目应该能够良好运行。