## React Hook源码解读（一）
### 一、前言
- 背景：React Hook 新特性随 React v16.8.0 版本正式发布，React Hook还在快速的发展和更新迭代过程中，很多Class Component支持的特性，React Hook还并未支持，但这丝毫不影响社区的学习热情。
- 特点：
  - 上手简单，使用容易
  - 转变类组件写法的理念和思想
  - 参考Hook一些规则和eslint插件辅助

### 二、设计的初衷
了解整个React Hook的设计，大部分代码都在适配React Fiber架构理念上，这也是源码晦涩难懂的主要原因。我们今天先不看这个，先看纯碎的React Hook架构。

React Hook产生的初衷，解决痛点问题：
- 第一点：组件之间复用状态逻辑很难
  - 类组件方案：render props和高阶组件
  - 缺点：难理解，存在过多嵌套形成嵌套地狱。
- 第二点：复杂组件难以理解
  - 生命周期中充斥各种状态逻辑和副作用
  - 副作用难以理解
- 第三点：难以理解的Class
  - this指针问题
  - 组件预编译技术会在class中遇到优化失效的case
  - class不能很好的压缩
  - class在热重载会出现不稳定的情况。

### 三、设计方案
官网一段介绍：
为了解决上述问题，Hook是你在非class情况下可以使用更多的React特性，从概念上讲，React组件一直更像函数，而Hook则拥抱函数，同事没有牺牲React的原则，Hook提供了问题解决方案，无需学习复杂的函数式编程和响应式编程。
#### 1、设计目标和原则
Hook主要是为了解决以下问题：
- 无Class的复杂性
- 无生命周期的困扰
- 优雅复用
- 对齐class组件已经具备的能力

##### 无Class的复杂性
React 16.8发布之前，按照【是否拥有状态】的维护来划分，组件类型分为两种：
类组件Class Component：主要用于需要内部状态，以及包含副作用的复杂组件

```
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // ...
        }
    }
    //...
}
```

##### 函数组件 Function Component：主要是用于纯组件，不包含状态，相当于一个函数模板。

```
function Footer(links) {
    return (
        <footer>
            <ul>
                {links.map(({href, title}) => {
                    return <li><a href={href}>{title}</a></li>
                })
            </ul>
        </footer>
    )
}
```
如果设计目标是去掉Class，似乎选择只能落在改造Function Component，让函数组件拥有Class Component一样的能力上。

我们可以这样写「最终的支持状态」的函数组件代码：

```
function Counter() {
  let state = { count: 0 };
  function clickHander() {
    setState({count: state.count + 1});
  }
  return (
    <div>
      <span>{count}</span>
      <button onClick={clickHander}>+</button>
    </div>
  )
}
```
上面代码中，使用函数组件定义了一个计数器Counter，其中提供了状态state，以及改变状态setState函数。这些API对于Class Component来说无疑是非常熟悉，但是函数组件中遇到不同的挑战：
+ class 实例可以永久存储实例的状态，而函数不行，上述代码中Counter每次执行，state都会被重新赋值为0。
+ 每一个Class Component的实例都拥有一个成员函数this.setState用以改变自身的状态，而Function Component只是一个函数，并不能拥有this.setState这种用法，只能通过全局的setState方法，或者其他方法来实现。

所以上面的两个问题就是你选用Funtion Component所需要解决的问题。

#### 2、解决方案
在JS中，可以存储持久化状态的无非几种方法：
+ 类实例属性
```
class A() {
  constructor() {
    this.count = 0;
  }
  increate() {
    return this.count++;
  }
}
const a = new A();
a.increase();
```

+ 全局变量
```
const global = {count: 0};

function increase() {
  return global.count++;
}
```

+ DOM方式
```
const count = 0;
const $counter = $('#counter');
$counter.data('count', count);

function increase() {
  const newCount = parseInt($counter.data('count'), 10) + 1;
  $coubter.data('count', newCount);
  return newCount;
}
```

+ 闭包
```
const Counter = function() {
  let count = 0;
  return {
    increase: () => {
      return count++;
    }
  }
}();
Counter.increase();
```

+ 其他全局存储
indexDB，或者localStorage等等

Function Component对状态的诉求只是能存取，因此似乎以上方案都是可行的。但是还是需要考虑以下：使用简单，性能高效，可靠无副作用。

方案2（全局变量）和方案5（其他全局存储）显然不符合第三点

方案3（DOM方式）咋样都不会考虑

方案1是Class Component

所以方案4（闭包）称为唯一的选择

#### 3、闭包的实现方案
闭包，那么在使用上就得有所变化。

假设我们预期提供一个名叫useState的函数，这个函数可以使用闭包来存取组件的state，还可以提供一个dispatch函数来更新state，并通过初始调用时赋予一个初始值。

```
function Counter() {
  const [count, dispatch] = useState(0);

  return (
    <div>
      <span>{count}</span>
      <button onClick={dispatch(count + 1)}>+</button>
    </div>
  )
}
```
如果用过redux的话，这一幕是不是觉得很眼熟，没错，就是一个微缩版的redux单向数据流吗？

+ 给定一个初始state，然后通过dispatch一个action，再经由reducer改变state，再返回新的state，触发组件重新渲染。

知道了这些，useState的实验就一目了然了。



