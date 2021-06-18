# device

[网上的API文档](https://www.dcloud.io/docs/api/zh_cn/device.html)

> `Device`模块管理设备信息，用于获取手机设备的相关信息，如`IMEI`、`IMSI`、`型号`、`厂商`等。通过`plus.device`获取设备信息管理对象。

## 属性

* `imei: ` 设备的国际移动设备身份码

* `imsi: ` 设备的国际移动用户识别码

* `model: ` 设备的型号

* `vendor: ` 设备的生产厂商

* `uuid: ` 设备的唯一标识

## 方法

* `dial:` 拨打电话

* `beep:` 发出蜂鸣声

* `vibrate:` 设备振动

* `setWakelock:` 设置应用是否保持唤醒（屏幕常亮）状态

* `isWakelock:` 获取程序是否一直保持唤醒（屏幕常亮）状态

* `setVolume:` 设置设备的系统音量

* `getVolume:` 获取设备的系统音量

## 对象

* `screen:` Screen模块管理设备屏幕信息

* `display:` Display模块管理应用可使用的显示区域信息

* `networkinfo:` Device模块用于获取网络信息

* `os:` OS模块管理操作系统信息

## 模块

5+功能模块（permissions）

```json
{
    // ...
    "permissions":{
        // ...
        "Device": {
            "description": "设备信息"
        }
    }
}
```

## imei

设备的国际移动设备身份码

```js
plus.device.imei;
```

### 说明：

`String` 类型 只读属性

调用此属性获取设备的国际移动设备身份码。 如果设备不支持则返回空字符串。 如果设备存在多个身份码，则以“,”字符分割拼接，如“862470039452950,862470039452943”。

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 4.5+ (不支持): iOS设备不支持获取imei值，返回空字符串。

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "IMEI: " + plus.device.imei );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取设备的国际移动设备身份码
	</body>
</html>
```

## uuid

设备的唯一标识

```js
plus.device.uuid;
```

### 说明：

`String` 类型 只读属性

调用此属性获取设备的唯一标识号。

### 平台支持：

* Android - 2.2+ (支持): 与设备的imei号一致。注意：如果无法获取设备imei则使用设备wifi的mac地址，如果无法获取设备mac地址则随机生成设备标识号，确保不同App在同一台设备上获取的值一致。

* iOS - 4.5+ (支持): 根据包名随机生成的设备标识号。注意：在设备重置后会重新生成。

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "uuid: "+plus.device.uuid );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取设备的唯一标识号
	</body>
</html>
```

## dial

拨打电话

```js
void plus.device.dial( number, confirm );
```

### 说明：

调用系统程序拨打电话。

### 参数：

* `number`: ( String ) 必选 要拨打的电话号码

* `confirm`: ( Boolean ) 可选 是否需要用户确认后开始拨打电话

设置为true表示打开系统拨打电话界面，需用户点击拨号按钮后才开始拨打电话，false则无需确认直接拨打电话，默认值为true。

### 返回值：

void : 无

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 5.1+ (支持): 忽略confirm参数，调用直接拨打电话。

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
        function dialTest() {
            plus.device.dial( "10086", false );
        }
	</script>
	</head>
	<body>
		拨打电话<br/>
		<button onclick="dialTest()">Dial</button>
	</body>
</html>
```

## beep

发出蜂鸣声

```js
void plus.device.beep( times );
```

### 说明：

调用此方法使得设备发出蜂鸣声。

### 参数：

* times: ( `Number` ) 可选 蜂鸣声重复的次数，默认发出一次蜂鸣声

### 返回值：

`void` : 无

### 平台支持：

* Android - 2.2+ (支持): 播放系统设置中指定的默认通知铃声

* iOS - 4.3+ (支持): 忽略times参数，播放系统的通知铃声

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            plus.device.beep( 3 );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		发出蜂鸣声<br/>
	</body>
</html>
```

## vibrate

设备振动

```js
plus.device.vibrate( milliseconds );
```

### 说明：

调用此方法使得设备振动。

### 参数：

* milliseconds: ( `Number` ) 必选 设备振动持续的时间

数值类型，单位为ms，默认为500ms。

### 返回值：

void : 无

### 平台支持：

* Android - 2.2+ (支持): 振动指定的时长

* iOS - 4.3+ (支持): 不支持milliseconds参数，使用系统默认振动时长，仅iPhone设备支持，iPad和iTouch设备不支持，调用此接口无任何效果。 **注意：如果在系统设置中关闭振动功能则无法调用设备振动（设置->声音->振动）。**

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            plus.device.vibrate( 2000 );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		设备振动<br/>
	</body>
</html>
```

# screen

Screen模块管理设备屏幕信息

## 属性：

* `resolutionHeight:` 设备屏幕高度分辨率

* `resolutionWidth:` 设备屏幕宽度分辨率

* `scale:` 逻辑分辨率与实际分辨率的比例

* `dpiX:` 设备屏幕水平方向的密度

* `dpiY:` 设备屏幕垂直方向的密度

## 方法：

* `setBrightness:` 设置屏幕亮度

* `getBrightness:` 获取屏幕亮度值

* `lockOrientation:` 锁定屏幕方向

* `unlockOrientation:` 解除锁定屏幕方向

## resolutionHeight

设备屏幕高度分辨率

```js
plus.screen.resolutionHeight;
```

### 说明：

`Number` 类型 只读属性

设备屏幕区域包括系统状态栏显示区域和应用显示区域，screen获取的是设备屏幕总区域的逻辑分辨率，单位为px。 如果需要获取实际分辨率则需要乘以比例值scale。

## 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "Screen height: " + plus.screen.resolutionHeight*plus.screen.scale + "px" );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		设备屏幕高度分辨率<br/>
	</body>
</html>
```

## resolutionWidth

设备屏幕宽度分辨率

```js
plus.screen.resolutionWidth;
```

### 说明：

`Number` 类型 只读属性

设备屏幕区域包括系统状态栏显示区域和应用显示区域，screen获取的是设备屏幕总区域的分辨率，单位为px。 如果需要获取实际分辨率则需要乘以比例值scale。

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "Screen width: " + plus.screen.resolutionWidtht*plus.screen.scale + "px" );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		设备屏幕宽度分辨率<br/>
	</body>
</html>
```

## scale

逻辑分辨率与实际分辨率的比例

```js
plus.screen.scale;
```

### 说明：

`Number` 类型 只读属性

屏幕分辨率分逻辑分辨率率和实际分辨率，在html页面中使用的像素值都是相对于逻辑分辨率，此值就是逻辑分辨率和实际分辨率的比例，实际分辨率=逻辑分辨率*比例。

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 4.3+ (支持)

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "Screen resolution: " + plus.screen.resolutionWidth*plus.screen.scale + " x " + plus.screen.resolutionHeight*plus.screen.scale );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		逻辑分辨率与实际分辨率的比例<br/>
	</body>
</html>
```

## dpiX

设备屏幕水平方向的密度

```js
plus.screen.dpiX;
```

### 说明：

`Number` 类型 只读属性

设备屏幕的密度为每英寸所显示的像素点数，密度越高显示清晰度越高，单位为dpi。

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 4.3+ (支持)

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "Screen dip in X: " + plus.screen.dpiX );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		设备屏幕水平方向的密度<br/>
	</body>
</html>
```

## dpiY

设备屏幕垂直方向的密度

```js
plus.screen.dpiY;
```

### 说明：

`Number` 类型 只读属性

设备屏幕的密度为每英寸所显示的像素点数，密度越高显示清晰度越高，单位为dpi。

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 4.3+ (支持)

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "Screen dip in Y: " + plus.screen.dpiY );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		设备屏幕垂直方向的密度<br/>
	</body>
</html>
```

# networkinfo

Device模块用于获取网络信息

## 常量：

* `CONNECTION_UNKNOW:` 网络连接状态未知

* `CONNECTION_NONE:` 未连接网络

* `CONNECTION_ETHERNET:` 有线网络

* `CONNECTION_WIFI:` 无线WIFI网络

* `CONNECTION_CELL2G:` 蜂窝移动2G网络

* `CONNECTION_CELL3G:` 蜂窝移动3G网络

* `CONNECTION_CELL4G:` 蜂窝移动4G网络

## 方法：

* `getCurrentType:` 获取设备当前连接的网络类型

## getCurrentType

获取设备当前连接的网络类型

```js
Number plus.networkinfo.getCurrentType();
```

### 说明：

获取当前设备连接的网络类型，返回值为网络类型常量，可取值CONNECTION_*常量。

### 参数：

无

### 返回值：

`Number` : 设备当前网络类型

### 平台支持：

* Android - 2.3+ (支持)

* iOS - 4.3+ (支持): 无法区分蜂窝移动网络类型，在蜂窝移动网络环境下均返回CONNECTION_CELL2G。

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            var types = {}; 
            types[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection"; 
            types[plus.networkinfo.CONNECTION_NONE] = "None connection"; 
            types[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection"; 
            types[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection"; 
            types[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection"; 
            types[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection"; 
            types[plus.networkinfo.CONNECTION_CELL4G] = "Cellular 4G connection"; 

            alert( "Network: " + types[plus.networkinfo.getCurrentType()] );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取设备当前连接的网络类型<br/>
	</body>
</html>
```

# os

OS模块管理操作系统信息

## 属性：

* `language:` 系统语言信息

* `version:` 系统版本信息

* `name:` 系统的名称

* `vendor:` 系统的供应商信息

## language

系统语言信息

```js
plus.os.language;
```

### 说明：

`String` 类型 只读属性

获取当前操作系统设置的系统语言，字符串类型数据。

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 4.3+ (支持)

示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "OS language: " + plus.os.language );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取系统语言信息<br/>
	</body>
</html>
```

## version

系统版本信息

```js
plus.os.version;
```

### 说明：

`String` 类型 只读属性

获取当前操作系统的版本信息，字符串类型数据。

### 平台支持：

* Android - 2.2+ (支持)

* iOS - 4.3+ (支持)

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "OS version: " + plus.os.version );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取系统版本信息<br/>
	</body>
</html>
```

## name

系统的名称

```js
plus.os.name;
```

### 说明：

`String` 类型 只读属性

获取当前操作系统的名称，字符串类型数据。

### 平台支持：

* Android - 2.2+ (支持): 返回字符串“Android”

* iOS - 4.3+ (支持): 返回字符串“iOS”

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "OS name: " + plus.os.name );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取系统的名称<br/>
	</body>
</html>
```

## vendor

系统的供应商信息

```js
plus.os.vendor;
```

### 说明：

`String` 类型 只读属性

获取当前操作系统的供应商名称，字符串类型数据。

### 平台支持：

* Android - 2.2+ (支持): 返回字符串“Google”

* iOS - 4.3+ (支持): 返回字符串“Apple”

### 示例：

```html
<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8">
	<title>Device Example</title>
	<script type="text/javascript">
        // H5 plus事件处理
        function plusReady(){
            alert( "OS name: " + plus.os.vendor );
        }
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
	</script>
	</head>
	<body>
		获取系统的供应商信息<br/>
	</body>
</html>
```