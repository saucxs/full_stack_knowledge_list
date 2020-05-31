## 【手把手学习flutter】flutter的widget简介

### 一、前言
Flutter中几乎所有的对象的都是1个Widget，与原生开发中的空间不同，flutter中widget概念更广泛，不仅仅是UI元素，还可以是一些**功能组件**，比如：手势检测的GestureDetector widget，APP主题数据传递的Theme等。原生开发中控件通常指的是UI元素。flutter中的组件，控件都是指的是widget，只是不同场景下的表述而已。

### 二、一些概念
#### 1、widget与element
在flutter中，widget的功能：描述一个UI元素的配置数据。也就是说widget并不是表示最终绘制在设备屏幕上的**显示元素**，而它只描述元素的一个**配置数据**。

实际上，Flutter真正的代表屏幕上显示元素的类是**Element**,也就说Widget是描述**Element的配置数据**，后边单独介绍element的类相关的。

我们需要知道的是：Widget只是UI元素的一个配置数据，并且一个Widget可以对应多个Element。因为同一个Widget对象可以被添加到UI树的不同部分，而真正的渲染时，UI树的每一个Element节点都会对应一个Widget对象。

总结一下：
+ Widget实际上就是Element的配置数据，Widget树其实一个配置树，而真正的UI渲染树是由Element构成，可以认为Widget树就是指的是UI控件树或者UI渲染树。
+ 一个Widget对象可以对应多个Element对象，根据同一份配置（Widget）可以创建多个实例Element。

#### 2、Widget主要接口
我们在dart源码看Widget类的声明：
```
@immutable
abstract class Widget extends DiagnosticableTree {
  const Widget({ this.key });
  final Key key;

  @protected
  Element createElement();

  @override
  String toStringShort() {
    return key == null ? '$runtimeType' : '$runtimeType-$key';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties.defaultDiagnosticsTreeStyle = DiagnosticsTreeStyle.dense;
  }

  static bool canUpdate(Widget oldWidget, Widget newWidget) {
    return oldWidget.runtimeType == newWidget.runtimeType
        && oldWidget.key == newWidget.key;
  }
}
```
+ Widget类继承DiagnosticableTree，主要是提供调试信息。
+ Key属性类似于react/vue中的key，主要决定是否在下一次build复用旧widget，决定条件在canUpdate()方法中。
+ createElement(): 1个widget可以对应多个Element，flutter framework在构建UI树，会先调用此方法生成对用的节点Element对象，Framework隐式调用，开发中基本不会调用。
+ debuugFillProperties复用父类的方法，主要是诊断树的一些特性。
+ canUpdate是一个静态方法，主要用于Widget树重新build时复用旧的widget，要newWidget与oldWidget的runtimeType和key同时相等时就会用newWidget去更新Element对象的配置，否则就会创建新的Element。

另外Widget类本身是一个抽象类，其中最核心的就是定义了createElement()接口，在Flutter开发中，我们一般都不用直接继承Widget类来实现一个新组件，相反，我们通常会通过继承StatelessWidget或StatefulWidget来间接继承Widget类来实现。StatelessWidget和StatefulWidget都是直接继承自Widget类，而这两个类也正是Flutter中非常重要的两个抽象类。


#### 3、StatelessWidget
StatelessWidget相对比较简单，它继承自Widget类，重写了createElement()方法：
```
@override
StatelessElement createElement() => new StatelessElement(this);
```
StatelessElement 间接继承自Element类，与StatelessWidget相对应（作为其配置数据）。

StatelessWidget用于不需要维护状态的场景，它通常在build方法中通过嵌套其它Widget来构建UI，在构建过程中会递归的构建其嵌套的Widget。


#### 4、Context
build方法中有一个context参数，是BuildContext类的一个实例，表示当前widget在widget树中的上下文，每一个widget都会对用一个context对象。实际上，context是当前widget树中位置中执行相关操作的钩子，比如它提供了当前widget开始向上遍历widget树以及按照widget类型查找父级widget的方法。

```
// Context
class Context1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Context测试-saucxs')),
      body: Container(
        child: Builder(builder: (context) {
          // 在Widget树中向上查找最近的父级Scaffold widget
          Scaffold scaffold = context.findAncestorWidgetOfExactType<Scaffold>();
          // 直接返回 AppBar的title，此处实际上Text('Context测试')
          return (scaffold.appBar as AppBar).title;
        }),
      ),
    );
  }
}
```
效果如下：
![images](http://static.chengxinsong.cn/image/flutter/flutter_context_1.jpg)

#### 5、StatefulWidget
和StatelessWidget一样，StatefulWidget也是继承Widget类，并重写了createElement()方法，不同的是返回的额Element对象并不相同，另外StatefulWidget类中添加一个新的接口createState()。

statefulWidget类的定义：
```
abstract class StatefulWidget extends Widget {
  const StatefulWidget({ Key key }) : super(key: key);

  @override
  StatefulElement createElement() => new StatefulElement(this);

  @protected
  State createState();
}
```
+ StatefulWidget间接继承Element类，与StatefulWidget相对应。
+ createState()用于创建和Stateful widget相关的状态，它与Stateful widget的生命周期中可能被多次调用。例如，当一个Stateful widget同时插入到widget树的多个位置时，Flutter framework就会调用该方法为每一个位置生成一个独立的State实例，其实，本质上就是一个StatefulElement对应一个State实例。

#### 6、State
一个StatefulWidget类会对应一个State类，State表示与其对应的StatefulWidget要维护的状态，State中的保存的状态信息可以是：
+ 在widget构建时可以被同步读取。
+ 在widget生命周期中可以改变，当State被改变时，可以手动调用其setState()方法通知Flutter framework 状态发生改变，flutter framework在收到消息后，会重新调用其build方法重新构建widget树，从而达到更新UI的目的。

State中有2个常用的属性：
+ widget。它表示与该State实例关联的widget实例，由Flutter framework动态设置。注意，这种关联不是永久的，因为在应用生命周期中，UI树上的某一个节点的widget实例在重新构建时可能会发生变化，单State实例只会在第一次插入到树中时被创建，当在重新构建时，如果widget被修改了，flutter framework 会动态设置State.widget为新的widget实例。
+ context。StatefulWidget对应的BuildContext，作用同StatelessWidget的BuildContext。

##### State生命周期
理解掌握State的生命周期对flutter开发很重要，我们需要一个实例来演示State的生命周期。

我们还是最初实现一个计数器widget，点击它可以使计数器加1，由于要保存计数器的数值状态，所以我们应该继承StateWidget，代码如下：
```
// State生命周期
class CounterWidget extends StatefulWidget {
  const CounterWidget({
    Key key,
    this.initValue: 0,
  });

  final int initValue;

  @override
  _CounterWidgetState createState() => new _CounterWidgetState();
}

// _CounterWidgetState
class _CounterWidgetState extends State<CounterWidget> {
  int _counter;

  @override
  void initState() {
    super.initState();
    // 初始化状态
    _counter=widget.initValue;
    print('initState');
  }

  @override
  Widget build(BuildContext context) {
    print('build');
    return Scaffold(
      body: Center(
        child: FlatButton(
          child: Text('$_counter'),
          // 点击后计数器自增
          onPressed: () => setState(() => ++_counter),
        )
      ),
    );
  }

  @override
  void didUpdateWidget(CounterWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    print('didUpdateWidget');
  }

  @override 
  void deactivate() {
    super.deactivate();
    print('deactivate');
  }

  @override
  void dispose() {
    super.dispose();
    print('dispose');
  }

  @override
  void reassemble() {
    super.reassemble();
    print('reassemble');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('didChangeDependencies');
  }

}
```

接下来，我们创建一个新路由，在新路由中，我们只显示一个CounterWidget：
```
 // 注册路由表
  routes: {
    "counter": (context) {
      return CounterWidget();
    },
    "/":(context) => MyHomePage(title: 'Fultter Demo'), //注册首页路由
  },
```

我们运行应用并打开该路由页面，在新路由页打开后，屏幕中央就会出现一个数字0，然后控制台日志输出：
```
Reloaded 1 of 478 libraries in 485ms.
I/flutter (22184): initState
I/flutter (22184): didChangeDependencies
I/flutter (22184): build
```
可以看到，在StatefulWidget插入到Widget树时首先initState方法会被调用。

然后我们点击⚡️按钮热重载，控制台输出日志如下：
```
I/flutter (22184): reassemble
I/flutter (22184): didUpdateWidget
I/flutter (22184): build
Reloaded 0 of 478 libraries in 132ms.
```
可以看到此时initState 和didChangeDependencies都没有被调用，而此时didUpdateWidget被调用。

接下来，我们在widget树中移除CounterWidget，将路由build方法改为：

```
 "counter": (context) {
    // return CounterWidget();
    return Text("saucxs");
  },
```

然后热重载，日志如下：
```
I/flutter ( 22184): reassemble
I/flutter ( 22184): deactive
I/flutter ( 22184): dispose
```

我们可以看到，在CounterWidget从widget树中移除时，deactive和dispose会依次被调用。

**State生命周期的总结：**
+ initState：当Widget第一次插入到Widget树会被调用，对于每一个State对象，Flutter framework只会调用一次该回调，所以在在回调中做一些一次性的操作，如状态初始化，订阅子树的事件通知等。
+ didChangeDependencies():当State对象的依赖发生变化时会被调用，比如：在之前build()中包含一个InheritedWidget，然后在之后的build()中InheritedWidget发生变化，那么此时InheritedWidget的子widget的didChangeDependencies()回调都会被调用。典型的场景是当系统语言Locale或者应用主题改变的时候，flutter framework会通知widget调用此回调。
+ build():主要是用于构建Widget子树的。如下场景被调用：
  - 在调用 initState() 之后
  - 在调用 didUpdateWidget() 之后
  - 在调用 setState() 之后
  - 在调用 didChangeDependencies() 之后
  - 在State对象从树中一个位置移除后（会调用deactivate）又重新插入到树的其它位置之后。
+ reassemble():此回调专门为开发调试而提供的，在热重载（hot reload）时候会被调用，此回调在release模式下永远不会被调用。
+ didUpdateWidget():在widget重新构建时，Flutter framework会调用Widget.canUpdate来检测Widget树中同一位置的新旧节点，然后决定是否需要更新，如果Widget.canUpdate返回true会调用此回调，否则不调用。
+ deactivate()：当State对象从树中被移除时，会调用此回调。在一些场景下，Flutter framework会将State对象重新插到树中，如包含此State对象的子树在树的一个位置移动到另一个位置时（可以通过GlobalKey来实现）。如果移除后没有重新插入到树中则紧接着会调用dispose()方法。
+ dispose()：当State对象从树中被永久移除时调用；通常在此回调中释放资源。

![flutter的state生命周期](http://static.chengxinsong.cn/image/flutter/flutter_widget_2.jpg)

### 三、总结
Flutter提供了丰富的组件，在实际的开发中你可以根据需要随意使用他们，不必担心引用过多的组件库会让你的应用安装包变大，这不是web开发，dart在编译的时候只会编译你使用的代码。

### 四、欢迎关注
show me code：https://github.com/saucxs/flutter_learning/tree/master/hellotest

后续会出更多知识体系构建，技术分享，项目实战，实验室等，欢迎关注本公众号:**[松宝写代码]**

![欢迎关注](http://static.chengxinsong.cn/image/author/intro.jpg?width=600)

>微信公众号：**[松宝写代码]**
songEagle开发知识体系构建，技术分享，项目实战，实验室，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。

>微信群：**【写代码】研发进阶群**
一个成长交流的产研群，帮忙拉产研的同学们进群，聚聚人气😘😘。
每一个开发同学都应该形成自己的[知识体系](https://github.com/saucxs/full_stack_knowledge_list)，做到提纲挈领🧐🧐🧐