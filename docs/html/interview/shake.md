demo

```js
this.deviceMotionHandler = function(eventData) {        
    var acceleration = eventData.acceleration;   
    var curTime = new Date().getTime();         
    //检测频率：每100ms一次
    if ((curTime - that.last_update) > 100) {     
        var diffTime = curTime - that.last_update;      
        that.last_update = curTime;     
        that.x = acceleration.x;            
        that.y = acceleration.y;         
        that.z = acceleration.z;      
        var speed = Math.abs(that.x + that.y + that.z - that.last_x - that.last_y - that.last_z) / diffTime * 10000;            
        if (speed > that.SHAKE_THRESHOLD) {  
            //do something
            that.shakeAudio.play();        //摇一摇音效
            window.navigator.vibrate(200);    //振动效果
            that.shakeEffect.className = 'shake-box shaking';    //摇一摇图片动态
            clearTimeout(shakeTimeout);         
            var shakeTimeout = setTimeout(function() {
                that.shakeEffect.className = 'shake-box';
            },4000);           
        }    
        that.last_x = that.x;      
        that.last_y = that.y;               
        that.last_z = that.z;         
    }        
};
```

> **原理：**  以100ms的间隔去扫描加速度计，当检测到加速度发生突变（变化率大于阀值）时，就可以认为此时在甩动手机。由公式可以看到，这里检测的是3个方向的加速度，所以无论往什么方向甩都可以触发摇一摇效果。

> **注意点：** 这里加了一个摇一摇的音效，移动端关于音频的坑太多，想必各位也是碰到不少。本次的坑是即使调用了play也无法播放，解决办法是让用户操作第一次播放或者加载，具体来说就是绑定一个事件，如下。而且加载需要一定时间，这里本来应该再做缓冲处理，但我没有，所以第一次播放会有很明显的延迟。

```js
window.addEventListener('touchstart',function () {
    if ( !shake1.audioLoaded ) {
        shake1.shakeAudio.load();  //load事件必须由用户触发
        shake1.audioLoaded = true;
    }
}, false);
```

> **布局方面：** 布局方面尝试使用了CSS3的弹性盒子，但是万万没想到先进的X5内核居然仅支持 display: -webkit-box; 所以这里需要多写一套兼容的样式。动态效果本来想用 transition 凑合一下，看了效果还是过不了自己这关，最后还是换成 animation 实现。transition的问题是撑开和收缩时边框的行为不对，用动画就比较好解决了。布局需要注意的是：背景图的上半部需要多加一层嵌套实现自适应。另外，微信的边框还有阴影，这些细节咱们暂时先忽略了。HTML结构如下：

```html
<div class="bodymask"><h2>准备好了吗？<br />点击屏幕开始"摇"!</h2></div>
<div class="shake-box">
    <div class="shake-upside">
        <div class="shake-upside-inner"></div>
    </div>
    <div class="shake-backimage">
        <a href="http://www.cnblogs.com/qieguo/"><img id="id-shake-image" src="source/000.png"/></a>
    </div>
    <div class="shake-downside"></div>
</div>
```