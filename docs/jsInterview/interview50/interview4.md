# 第4天 写一个方法把下划线命名转成大驼峰命名
---

## 思路一

使用正则进行查找并对复合条件的使用相应方法

### 解法一

> **注意：**循环正则，因正则仅能匹配出一个

```js
function toCamel(str) {
  str = str.replace(/(\w)/, (match, $1) => `${$1.toUpperCase()}`)
  while(str.match(/\w_\w/)) {
    str = str.replace(/(\w)(_)(\w)/, (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`)
  }
  return str
}

console.log(toCamel('a_c_def')) // ACDef 
```

## 思路二

使用js,进行数组标的再在个数组中寻找第一个字母大写

### 解法一

```js
function toCamelCase(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str
    .split('_')
    .map(item => item.charAt(0).toUpperCase() + item.substr(1, item.length))
    .join('');
}
```

### 解法二

```js
function changeStr(str){
    if(str.split('_').length==1)return;
    str.split('_').reduce((a,b)=>{
        return a+b.substr(0,1).toUpperCase() + b.substr(1)
    })
}
```

## 思路三

如果出现多个连续下划线

### 解法一

```js
const toCamel = str =>
  str
    .split("_")
    .filter(s => !!s)
    .map((s, index) => (index === 0 ? s : s[0].toUpperCase() + s.slice(1)))
    .join("");

console.log(toCamel("a_bc_d"));
console.log(toCamel("bc_d"));
console.log(toCamel("bc___________ed"));
console.log(toCamel("_______a_bc_d__"));

// 顺便写的驼峰转下划线
const toSnake = str => {
  const target = str[0].toLowerCase() + str.slice(1);
  let result = target;
  (target.match(/[A-Z]/g) || []).forEach(word => {
    result = result.replace(word, `_${word.toLowerCase()}`);
  });
  return result;
};

console.log(toSnake("aBcDeFg"));
console.log(toSnake("ABCDEFG"));
```

## 思路四

大驼峰&小驼峰

```js
// 大驼峰

function toPascal(str) {
    return str.replace(/(^|_)([a-z])/g, (match, $1, $2) => `${$2.toUpperCase()}`)
        .replace(/_/g, '');
}

console.log(toPascal("a_bc_d"));            //ABcD
console.log(toPascal("a_c_def"));           //ACDef
console.log(toPascal("bc_d"));              //BcD
console.log(toPascal("bc___________ed"));   //BcEd
console.log(toPascal("_______a__bc_d__"));  //ABcD
console.log(toPascal("ac_______a_bc_d__")); //AcABcD
```

```js
// 小驼峰

function toCamel(str) {
    str = str
        .replace(/(?<=_)([a-z])/g, (match, $1) => `${$1.toUpperCase()}`)
        .replace(/_/g, '')
        .replace(/(^[A-Z])/, (match, $1) => `${$1.toLowerCase()}`);
    return str
}

console.log(toCamel("a_bc_d"));   //aBcD
console.log(toCamel("a_c_d"));     //aCD
console.log(toCamel("bc_d"));      //bcD
console.log(toCamel("bc___________ed"));  //bcEd
console.log(toCamel("_______a_bc_d__"));  //aBcD
```