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

知道了这些，useState的实现就一目了然了。

```
function useState(initialState) {
  let state = initialState;
  function dispatch = (newState, action) => {
    state = newState;
  }
  return [state, dispatch];
}
```

上面代码还是不能满足要求，Function Component在初始化、或者状态变更后都需要重新执行useState函数，并且要保障每一次useState被执行的时候state的状态时最新的。

所以我们需要一个新的数据结构来保存上一次的state和这一次的state，以便可以在初始化流程调用useState和更新流程调用useState可以取到对应的正确值。这个数据结构可以做如下设计，我们假定这个数据结构叫Hook。

```
type Hook {
  memoizedState: any,    // 上一次完整更新之后的最终状态值
  queue: UpdateQueue<any, any> | null;    // 更新队列
};
```

考虑到第一次组件mounting和后续的updating逻辑的差异，我们定义两个不同的useState函数的实现，分别叫做mountState和updateState。

```
function useState(initialState) {
  if (isMounting) {
    return mountState(initialState);
  }
  if (isUpdateing) {
    return updateState(initialState);
  }
}

// 第一次调用组件的 useState 时实际调用的方法
function mountState(initialState) {
  let hook = createNewHook();
  hook.memoizedState = initialState;
  return [hook.memorizedState, dispatchAction];
}

function dispatchAction (action) {
  // 使用数据结构存储所有的更新行为，以便 rerender 流程中计算最新的状态值
  storeUpdateActions(action);
  // 执行 fiber 渲染
  scheduleWork();
}

// 第一次执行之后，每一次执行 useState 时实际调用的方法
function updateState(initialState) {
  // 根据 dispatchAction 中存储的更新行为计算出新的状态值，并返回组件doReducerWork();
  return [hook.memoizedState, dispatchAction];
}
function createNewHook() {
  return {
    memoizedState: null,
    baseUpdate: null
  }
}
```
上面代码基本反映出我们的设计思路，但还是存在两个核心的问题需要解决：
+ 调用storeUpdateActions后将以什么方式把这次更新行为共享给doReducerWork进行最终状态的计算
+ 同一个 state ，在不同时间调用 mountState 和 updateState 时，如何实现hook对象的共享。


#### 4、更新逻辑的共享
更新逻辑是一个抽象的描述，我们首先需要根据实际的使用方式考虑清楚一次更新需要包含哪些必要的信息。实际上，在一次事件 handler 函数中，我们完全可以多次调用dispatchAction：
```
function Count() {
  const [count, setCount] = useState(0);
  const [countTime, setCountTime] = useState(null);
  function clickHandler() {
    // 多次调用 dispatchAction
    setCount(1);
    setCount(2);
    setCount(3);
    // ...
    setCountTime(Date().now());
  }
  return (
    <div>
      <div>{count} in  {countTime}</div>
      <button onClick={clickHandler}>Update Counter</button>
    </div>
  )
}
```
在执行setCount的3次调用中，我们并不希望Count组件会因此被渲染3次，而是会按照调用顺序实现最后调用的状态生效。因此如果考虑上述使用场景的话，我们需要同步执行完clickHandler中所有的dispatchAction后，并将其更新逻辑顺序存储，然后再触发fiber和re-render合并渲染。name多次多次对同一个dispatchAction的调用，我们如何来存储这个逻辑呢？

比较简单的方法是使用一个队列Queue来存储每一次更新逻辑Update的基本信息：
```
type Queue {
  last: update,  // 最后一次更新逻辑
  dispatch: any,
  lastRenderdState: any   // 最后一次渲染组件时的状态
}

type Update {
  action: any,   // 状态值
  next: Update   // 下一次 Update
}
```

这里使用的是单向链表结构来存储更新队列，有了这个数据结构之后，我们来改动一下代码：

```
function mountState(initialState) {
  let hook = createNewHook();
  hook.memoizedState = initialState;
  // 新建一个队列
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedState: null
  });
  // 通过闭包方式，实现队列的在不同函数中共享，前提是每次用dispatch函数式同一个
  const dispatch = dispatchAction.bind(null, queue);
  return [hook.memorizedState, dispatch];
}

function dispatchAction(queue, action) {
  // 使用数据结构存储所有的更新行为，以便 rerender 流程中计算最新的状态值
  const update = {
    action,
    next: null
  }
  let last = queue.last;
  if (last === null) {
    update.next = update;
  } else {
    // ... 更新循环链表
  }
  // 执行 fiber 的渲染
  scheduleWork();
}

function updateState(initialState) {
  // 获取当前正在工作中的hook
  const hook = updateWorkInProgressHook();
  // 根据 dispatchAction 中存储的更新行为计算出新的状态值，并返回给组件
  (function doReducerWork() {
    let newState = null;
    do {
      // 循环链表，执行每一次更新
    }while(...)
    hook.memoizedState = newState;
  })();
  return [hook.memoizedState, hook.queue.dispatch];
}
```
更新逻辑的共享，我们就已经解决了。
