# @charset

# 概述

 `@charset` <u>CSS @规则</u>  指定样式表中使用的字符编码。它必须是样式表中的第一个元素，而前面不得有任何字符。因为它不是一个<u>嵌套语句</u>，所以不能在<u>@规则条件组</u>中使用。如果有多个 `@charset` <u>@规则</u>被声明，只有第一个会被使用，而且不能在HTML元素或HTML页面的字符集相关 `<style>` 元素内的样式属性内使用。

1. 文件的开头的 `Unicode byte-order` 字符值。

2. 由Content-Type：HTTP header 中的 charset 属性给出的值或用于提供样式表的协议中的等效值。

3. `CSS` <u>@规则</u>  `@charset`。

4. 使用参考文档定义的字符编码： `<link>` 元素的 charset 属性。 该方法在 HTML5 标准中已废除，无法使用。

5. 假设文档是 UTF-8。

## 语法

```
@charset "UTF-8";
@charset "iso-8859-15";
```

**charset**

它是一个 `<string>` 表示字符编码被使用。它必须是在被 <u>IANA-registry</u> 声明过的 web-safe 字符编码中的一个, 还必须被双引号包围, 遵循一个空格字符 (U+0020)，并且立即以分号结束。 如果有多个相关的编码名字，只有被标记为 preferred  的那个才会被使用。

**语法格式**

```
@charset "<charset>";
```

## 例子

```css
@charset "UTF-8";
@charset "utf-8"; /*大小写不敏感*/
/* 设置css的编码格式为Unicode UTF-8 */
@charset 'iso-8859-15'; /* 无效的, 使用了错误的引号 */
@charset 'UTF-8';       /* 无效的, 使用了错误的引号 */
@charset  "UTF-8";      /* 无效的, 多于一个空格 */
 @charset "UTF-8";      /* 无效的, 在at-rule之前多了一个空格 */
@charset UTF-8;         /* Invalid, without ' or ", the charset is not a CSS <string> */
```

## 浏览器兼容性

<a data-fancybox title="demo" href="/notes/assets/mozillaCss/1617783332(1).jpg">![demo](/notes/assets/mozillaCss/1617783332(1).jpg)</a>