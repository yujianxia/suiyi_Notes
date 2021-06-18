> 在componentDidMount中创建计时器，并在componentWillUnmount中回收它。
> 对于react hook，在useffect函数中创建一个计时器，使用[]作为useffect检查条件，这意味着这个钩子只在第一次渲染时运行，可以在useffect回调函数中循环使用计时器。

```jsx
class Clock extends React.Component{
        constructor(props){
            super(props);
            this.state={date:new Date()};
        }
        componentDidMount(){
            this.timerID=setInterval(()=>this.tick(),1000);
        }
        componentWillUnmount(){
            clearInterval(this.timerID);
        }
        tick(){
            this.setState({
                date:new Date()
            });
        }
        render(){
            return (
                <div>
                    <h2>Timer {this.state.date.toLocaleTimeString()}.</h2>
                </div>
            );
        }
    }
    ReactDOM.render(
        <Clock />,
        document.getElementById('root')
    );
}
```

`hooks 版本`

```jsx
import React, { useState, useEffect } from 'react'

export default function TimerHooks () {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    let timerId = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, []);

  return (
    <div>
      <p>时间: {date.toLocaleTimeString()}</p>
    </div>
  )
}
```