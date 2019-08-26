## react
+ react版本：16.8.6

以声明式编写UI，代码更可靠和方便调试；
组件逻辑使用js编写而不是模板，轻松传递数据，状态和DOM分离。
说白了，就是用于构建用户界面的js库。

#### 什么是JSX？为什么使用JSX？以及JSX特点？
JSX是JavaScript的语法扩展，具有js的全部功能。JSX可以更好描述UI交互的本质。

React认为渲染逻辑本质：与其他UI逻辑内在耦合。
react并没有采用将标题与逻辑分离到不同文件的分离方式，而是采用将两者共同存放在"组件"松耦合的单元中。

特点：
+ JSX中可以嵌入表达式
+ JSX本身就是一个表达式
+ JSX特定属性。jsx的class编程className
+ JSX指定子元素。
+ JSX防止注入攻击。渲染所有的输入内容之前都会进行转义。
+ JSX表示对象。babel会将JSX转译成一个名为React.createElement()

例子：
```js
const element = <h1>Hello, world!</h1>;
```


#### react元素渲染？
元素渲染中**元素**是构成**React应用的最小砖块**。

+ 1、如何将React+ 元素渲染到根DOM节点中？
+ 答：将React元素和根DOM节点一起传入ReactDOM.render()。

+ React如何更新已经渲染的元素？
+ 答：React元素是不可变元素，一旦创建，无法改变子元素或者属性。
更新UI的唯一方式：创建一个全新元素，并将其传入ReactDOM.render()

+ React如何更新需要更新的部分？
+ 答：将元素和子元素与他们之前的状态进行比较，只进行必要的更新来达到预期状态。
我们都会新建一个描述整个UI树的虚拟DOM，使用diff算法比较，根据reactDOM只会更新实际改变的内容。


#### 组件和Props
组件允许你将UI拆分为独立可复用的代码片段，并对每个片段进行独立构思。

组件类似于js的函数。接受入参props，并返回描述页面内容的React元素。

##### 函数组件和class组件
+ 定义组件最简单的方式就是编写js函数。
```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

+ 使用ES6的class类定义组件
```js
class Welcome extends React.Component {
    render() {
        return <h1>Hello，{this.props.name}</h1>
    }
}
```
函数组件和ES6的class组件是等效的，使用ES6的还有一些额外的特性。


##### 渲染组件
React元素为用户自定义的组件时，将JSX接收的属性转换为单个对象传递给组件，这个对象就是props对象。
```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```
**注意：**
组件名称必须以大写字母开头，因为React会将瞎写字母开头的组件视为原生DOM标签。

##### 组合组件
组件可以在其输出中引用其他组件，可以用同一个组件来抽象出任意层次的细节。
每一个新的React的**顶层组件都是App组件**。

##### 提取组件
将组件拆分为更小的组件，大型应用中，构建可复用的组件是完全值得的。

##### Props的只读性
组件无论是函数声明的组件还是ES6的class声明的组件，都不能修改自身的props。

**所有React组件都必须保护他们的props不被更改**

#### State和生命周期
State与Props类似，但是state是私有的，完全受控于当前组件。Props是传参，不要修改props。
##### 1、将函数组件转换为class组件
+ 使用函数组件方法：
```js
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```
封装Clock组件
```js
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

+ 将函数组件转为换class组件
步骤：
+ 1、创建一个同名的ES6 class，并且继承React.Component。
+ 2、添加一个空的render方法。
+ 3、将函数体移动到render方法中
+ 4、在render()方法中使用this.props替换props
+ 5、删除剩余的空函数声明
```js
class Clock extends Reaact.Component {
    render() {
         <div>
              <h1>Hello, world!</h1>
              <h2>It is {this.props.date.toLocaleDateString()}.</h2>
         </div>
    }
}
```

##### 2、向class组件中添加局部的state
将date从props移到state中，步骤：
+ 将render()方法中的this.props.date替换成this.state.date。
+ **添加一个class构造函数**，然后在函数中为this.state赋初值。
+ 移除组件元素中date属性
```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```
**class组件始终使用props参数来调用父类的构造函数**，也就是构造函数继承的一种。


##### 3、将生命周期方法添加到class中
为class组件声明一些特殊方法，当组件挂载或者卸载的时候会去执行的方法。
这些方法称为声明周期方法。

比如：
+ componentDidMount()方法：在组件已经渲染到DOM中之后运行。
+ componentWillUnmount()方法：组件在销毁之前执行方法
```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

##### 4、正确使用State
+ 不要直接修改State，构造函数唯一赋值的地方，必须使用setState方法修改
+ State的更新可能是异步的。setState接收的是一个函数而不是一个对象。
+ State的更新会被合并。


##### 5、数据是向下流动的
组件可以选择将他们的State作为props向下传递到其他组件中。

单向的数据流也叫“自上而下”的数据流。

任何State总是属于特定的组件，从该State派生出的任何数据护着UI只能影响低于他们的组件。

保证了每一个组件都是真正的独立。


#### 事件处理
React的事件处理和DOM的事件处理很相似，语法上有点区别：
+ React事件的命名采用小驼峰，而不是纯小写。
+ JSX语法需要传入一个函数作为事件处理函数，而不是一个字符串。
+ 不能通过返回false方式阻止默认行为，而必须显示使用preventDefault。
```js
<button onClick={activateLasers}>
  Activate Lasers
</button>
```
常规html
```js
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```
react中
```js
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```
上面的e是合成事件，根据W3C规范合成事件，不用担心跨浏览器兼容性问题。

需要谨慎对待JSX回调函数中的this，class的方法不会绑定this。
