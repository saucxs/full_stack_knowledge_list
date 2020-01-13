## 一、前言
自己之前使用vue2.0开发，接着vuex来管理数据状态。现在开始了react开发，然后开始了react hook学习和使用，这个用来自己的总结在开发中遇到数据在组件中传递方案。

## 二、父组件调用有状态子组件的状态数据
场景：有三个组件，分别：组件A，组件B，组件C。包含关系：A -> B -> C。
即：A的子组件是B，B的子组件是C。
情况：B组件的按钮需要根据C组件中请求接口拿到的数据判断是否可点击。

举个例子：
在组件B中，定义一个函数getFlightNumber，使用react hook的useCallback方法。
```
  const [actualFlightNumber, setActualFlightNumber] = useState(0);
...
...
  const getFlightNumber = useCallback((num?: number) => {
    maxFlightNumber !== 0 && setActualFlightNumber(num);
  }, [maxFlightNumber]);
...
...
<C getFlightNumber={(flightNumber?: number) => getFlightNumber(flightNumber)} />
```

然后在C组件中，需要定义
```
 import _ from 'lodash';
...
...
 const {
    getFlightNumber = _.noop,
  } = props;
...
...
// data就是调用api获取的组件内的状态数据的值
useEffect(() => {
    getFlightNumber(data?.page.total_items);
  }, [data]);
```

总的来说：就是在父组件中定义一个回调函数，回调函数传递给子组件，然后子组件拿到子组件使用API接口获取的数据后调用回调函数。

## 三、总结
有时候在处理react hook一些数据的传递上，常用的方案：
+ 方案1、使用redux或者dva来管理数据状态，这样在各个组件中可以随便调用
  - 优点：使用简单，管理容易，比较好理解。
  - 缺点：在一些纯粹的业务组件中限制使用。
+ 方案2、可以使用useCallback的回调函数方法向下传递回调函数，从而拿到子组件的自有状态的数据。
  - 优点：适合在一些纯粹的业务组件中使用。
  - 缺点：使用不方便，调用复杂，遇到过深的组件嵌套会出现管理复杂。
