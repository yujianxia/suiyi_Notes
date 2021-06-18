#
# 改善 antd Table组件的渲染效率

## 前言

对于react 高阶组件。大家基本只知道定义和用法，在实际开发中，使用的可能并不多。项目组下来一个任务，重写某个由Antd Table渲染为主要功能的模块，这里发现一些问题，Antd `Table`在渲染时，即使没有改变`Table`的`props`，只是改变包裹`Table`的组件，`Table`组件也会重新渲染。

## 问题产生

```jsx
import { Table} from 'antd';
class TestRoot extends Component {
	change() {
	 		this.setState({
	            self_state: 2
	        });
	}
	render() {
	        const columns = [
	            {
	                title: '姓名',
	                dataIndex: 'name',
	                key: 'name',
	                render: (text, record, index) => {
	                    console.log('rerendered !!!')
	                    return <div>{text}</div>;
	                }
	            },
	            {
	                title: '年龄',
	                dataIndex: 'age',
	                key: 'age'
	            },
	            {
	                title: '住址',
	                dataIndex: 'address',
	                key: 'address'
	            }
	        ];
	        return (
	            <div>
	                <h1>{this.state.self_state}</h1>
	                <Table columns={columns} dataSource={this.state.data_arr} />
	            </div>
	        );
	    }
}
```

当的`TestRoot`组件自身状态发生改变时，会发现控制台不断的输出`rerendered !!!`这样的提示。证明`Table`表格内部做了重新渲染操作。

## 分析 & 解决

像`Antd` 这样的UI库，重复渲染问题是优化问题，一般来说库不会太过分做这些优化。要做的就是通过控制`Table`组件的`shouldComponentUpdate`来进行过滤非必要的状态渲染。这时候想到了利用高阶组件封装，采用反向继承的方式，注入到`Table`组件的渲染逻辑中：

```jsx
import { Table } from 'antd';
const withPure = (Comp) => {
    return class PureTable extends Comp {
        shouldComponentUpdate(nextProps, nextState) {
            //--在这里控制
            return true;
        }
        render() {
            return super.render();
        }
    };
};
export default withPure(Table)
```

使用方式,将原先直接使用`Table`换成使用`PureTable`。

```jsx
return (
          <div>
               <h1>{this.state.self_state}</h1>
               <PureTable columns={columns} dataSource={this.state.data_arr} />
           </div>
       );
```

> 这是高阶组件的第二种实现方式。采用的是继承源组件的形式，这样可以通过覆写源组件的一些方法，来实现控制渲染流程，是一种深度攻击注入。

## 1. 通过shallowCompare 进行第一层浅比较

有关`shallowCompare` 的用法，大家可以自行百度，就是一层浅比较。可以判断出state和props第一层的变化。但是无法判断深层次的引用对象。

```jsx
npm i react-addons-shallow-compare --save
```

```jsx
import { Table } from 'antd';
let shallowCompare = require('react-addons-shallow-compare');
const withPure = (Comp) => {
    return class PureTable extends Comp {
        shouldComponentUpdate(nextProps, nextState) {
           return !shallowCompare(this, nextProps, nextState);
        }
        render() {
            return super.render();
        }
    };
};
export default withPure(Table)
```

## 2.通过lodash _.isEqual进行深比较

上述代码测试后发现，改变`self_state`后，确实表格没有再渲染。但是很明显，当的`dataSource`进行变化时，`shallowCompare`并不会判断出来，禁止了表格的渲染。例如下面这个直接修改`dataSource`的例子：

```jsx
change3() {
    const { data_arr } = this.state;

    data_arr[0].name = '胡二狗';

    this.setState({
        data_arr
    });
}
```

这里大家有2个分支，第一个是根据业务情况，自行判断需要的`Table`的深`props`和`state`，比如`dataSource`属性，或者直接使用深比较，判断状态和`props`。第二种方式明显效率更低，但是可以保证表格的渲染不会受到影响。

```jsx
import { Table } from 'antd';
let shallowCompare = require('react-addons-shallow-compare');
const withPure = (Comp) => {
    return class PureTable extends Comp {
        shouldComponentUpdate(nextProps, nextState) {
           const is_sample = shallowCompare(this, nextProps, nextState);

           if(!is_sample) {return true;}

           const state_sample = _.isEqual(nextState, this.state);
           if(!state_sample) {return true;}

           
           const props_sample = _.isEqual(nextProps, this.props);
           if(!props_sample) {return true;}
           
           return false;
        }
        render() {
            return super.render();
        }
    };
};
export default withPure(Table)
```

到这里，理论上当只改变`Root`组件的自身状态时，不会在触发表格的渲染了。可是在`lodash`进行深比较时，还是有一个属性判断不一致，深度调试之后发现是两次`props`传递的`columns`属性中的`render`函数不同。这里发现一个表格写法问题。

```jsx
const columns = [
{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
        console.log('rerendered !!!')
        return <div>{text}</div>;
    }
},
{
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
},
{
    title: '住址',
    dataIndex: 'address',
    key: 'address'
}
];
return (
<div>
    <h1>{this.state.self_state}</h1>
    <Table columns={columns} dataSource={this.state.data_arr} />
</div>
);
```

大家注意姓名那一栏的`render`函数。这种写法会导致每次都创建一个新的`render`函数引用，导致lodash深比较的时候，判断不一致，导致表格重新渲染。

将render方法定义在类中，修改定义方式如下：

```jsx
//--省略
render_column_name = (text, record, index) => {
    console.log('column rendered!');
    return <TestColumnChild name={text} ></TestColumnChild>;
}
render() {
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: this.render_column_name
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age'
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address'
        }
    ];
)
```