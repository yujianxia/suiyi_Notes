`navigator.geolocation.getCurrentPosition(success, error, options)`

支持IE9+

## Geolocation.getCurrentPosition()

`Geolocation.getCurrentPosition()` 方法用来获取设备当前位置。

**语法**
---

> navigator.geolocation.getCurrentPosition(success, error, options)

**参数**
---

* success

    成功得到位置信息时的回调函数，使用`Position` 对象作为唯一的参数。

* error 可选

    获取位置信息失败时的回调函数，使用 `PositionError` 对象作为唯一的参数，这是一个可选项。 

* options 可选

    一个可选的`PositionOptions` 对象。

**实例**
---

```js
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

navigator.geolocation.getCurrentPosition(success, error, options);
```