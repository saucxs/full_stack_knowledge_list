## 【手把手学习flutter】flutter的状态管理

### 一、前言
响应式编程框架中，有一个永恒的主题：**状态管理**，无论是react/vue，都是支持响应式编程的web开发框架，在flutter中，问题和解决思路是一致的。

我们先来说一下，StatefulWidget的状态应该被谁管理？widget本身，父widget，还是另外一个对象？

状态管理常见方法：
+ widget管理自己的状态
+ widget管理子widget状态
+ 混合管理（父widget和子widget管理状态）

官方给出一些原则，决定使用哪种发方法：
+ 状态是用户数据，比如复选框的选中，滑块的位置，则该状态最好由父widget管理
+ 状态时有关界面外观效果的，比如颜色，动画，name状态最好由widget本身来管理
+ 如果某一个状态是不同widget共享的最好由他们共同的父widget管理

widget内部管理状态封装性会好点，而在父widget中管理比较灵活。如果不确定使用哪种管理状态，推荐首选在父widget中管理，灵活更重要。

### 二、实现的需求
我们创建三个简单示例StateMangementA，StateMangementB，StateMangementC来说明管理状态的不同方式。

实现功能：创建一个正方形盒子，当点击页面时候，盒子的背景色会在绿色与灰色之间切换。_active确定颜色：true为绿色，false为灰色。

![状态管理](http://static.chengxinsong.cn/image/flutter/flutter_state_management_1.jpg)

![状态管理](http://static.chengxinsong.cn/image/flutter/flutter_state_management_2.jpg)

### 三、widget管理自身状态
_StateMangementAState类：
+ 管理 StateManagementA 的状态
+ 定义 _active : 确定盒子的当前颜色的布尔值
+ 定义 _handleTap() : 该函数在点击盒子时更新 _active，并调用setState() 更新UI
+ 实现widget的所有的交互行为

```
// StateManagementA 管理自身状态
class StateMangementA extends StatefulWidget {
  StateMangementA({Key key}) : super(key: key);
  @override
  _StateMangementAState createState() => new _StateMangementAState();
}

class _StateMangementAState extends State<StateMangementA> {
  bool _active = false;
  void _handleTap() {
    setState(() {
      _active = !_active;
    });
  }

  Widget build(BuildContext context) {
    return new GestureDetector(
      onTap: _handleTap,
      child: new Container(
        color: Colors.white,
        child: new Center(
           child: new ClipRRect(
            borderRadius: const BorderRadius.all(const Radius.circular(30.0)),
            child: new Container(
              width: 180.0,
              height: 180.0,
              color: _active ? Colors.lightGreen[700] : Colors.grey[600],
              child: new Center(
                child: new Text(
                  _active ? 'Active' : 'Inactive',
                  style: new TextStyle(fontSize: 32.0, color: Colors.white),
                )
              )
            ),
          ),
        ),
      ),
    );
  }
}

```


### 四、widget管理子widget状态
父widget来说，管理状态并告诉子widget何时更新通常是比较好的方式。

示例中，StateMangementB通过回调将其状态导出到其父组件，状态由父组件管理，因此它的父组件为StateFulWidget，但是由于StateMangementB不管理任何状态，所以StateMangementB为StatelessWidget。

ParentWidget类：
+ 为 StateMangementB 管理 _active 状态
+ 实现 _handleTapboxChanged ,当盒子被点击时调用的方法
+ 当状态改变时，调用setState()更新UI

StateMangementB类：
+ 继承 StatelessWidget 类，因为所有状态都是由父组件处理
+ 当检测到点击时，会回调触发父组件

```
// 父widget 为 StateMangementB 管理状态
class ParentWidget extends StatefulWidget {
  @override
  _ParentWidgetState createState() => new _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  bool _active = false;
  void _handleTapboxChanged(bool newValue) {
    setState(() {
      _active = newValue;
    });
  }
  @override
  Widget build(BuildContext context) {
    return new Container(
      child: new StateMangementB(
        active: _active,
        onChanged: _handleTapboxChanged,
      )
    );
  }
}


// StateMangementB
class StateMangementB extends StatelessWidget {
  StateMangementB({ Key key, this.active: false, @required this.onChanged }) : super(key: key);
  final bool active;
  final ValueChanged<bool> onChanged;

  void _handleTap() {
    onChanged(!active);
  }

 Widget build(BuildContext context) {
    return new GestureDetector(
      onTap: _handleTap,
      child: new Container(
        color: Colors.white,
        child: new Center(
           child: new ClipRRect(
            borderRadius: const BorderRadius.all(const Radius.circular(30.0)),
            child: new Container(
              width: 180.0,
              height: 180.0,
              color: active ? Colors.lightGreen[700] : Colors.grey[600],
              child: new Center(
                child: new Text(
                  active ? 'Active' : 'Inactive',
                  style: new TextStyle(fontSize: 32.0, color: Colors.white),
                )
              )
            ),
          ),
        ),
      ),
    );
  }

}
```

路由
```
 routes: {
  "state_management_A": (context) => StateMangementA(),
  "state_management_B": (context) {
    return ParentWidget();
  },
 }
```


### 五、管理「混合」状态
对于一些组件中，混合管理更加常用的。意思：组件管理一些内部状态，而父组件管理一些其他外部状态。

下面 StateMangementC 中，新增功能：手指按下，盒子出现一个深绿色的边框，抬起来，边框消失。点击整个完成后，盒子的颜色改变。StateMangementC将其 _active 状态导出到其父组件中，但是内部管理 _highlight 状态。实例有两个状态对象 _ParentWidgetStateC 和 _StateMangementCState。

_ParentWidgetStateC 类：
+ 管理 _active 状态
+ 实现 _handleTapboxChanged() ，当盒子被点击时调用
+ 当点击盒子并且 _active 状态改变时调用setState() 更新UI

_StateManagementCState 对象：
+ 管理 _highlight 状态
+ GestureDetector 监听所有的tap事件。当用户点下时，他添加高亮（深绿色边框）;当用户释放时，移除高亮。
+ 当按下，抬起，或者取消点击时更新 _highlight 状态，调用setState() 更新UI。
+ 当点击时，将状态的改变传递给父组件。

```

// 管理「混合」状态  StateManagementC
class ParentWidgetC extends StatefulWidget {
  @override
  _ParentWidgetCState createState() => new _ParentWidgetCState();
}

class _ParentWidgetCState extends State<ParentWidgetC> {
  bool _active = false;
  void _handleTapboxChanged(bool newValue) {
    setState(() {
      _active = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Container(
      child: new StateManagementC(
        active: _active,
        onChanged: _handleTapboxChanged,
      ),
    );
  }
}


// StateManagementC
class StateManagementC extends StatefulWidget {
  StateManagementC({ Key key, this.active: false, @required this.onChanged}) : super(key: key);
  final bool active;
  final ValueChanged<bool> onChanged;
  @override
  _StateManagementCState createState() => new _StateManagementCState();
}

class _StateManagementCState extends State<StateManagementC> {
  bool _highlight = false;

  void _handleTapDown(TapDownDetails details) {
    setState(() {
      print('$_highlight down');
      _highlight = true;
    });
  }
  void _handleTapUp(TapUpDetails details) {
    setState(() {
       print('$_highlight up');
      _highlight = false;
    });
  }
  void _handleTapCancel() {
    setState(() {
      _highlight = false;
    });
  }
  void _handleTap() {
    widget.onChanged(!widget.active);
  }

  BoxDecoration myBoxDecoration(_active, _highlight) {
  return BoxDecoration(
    color: _active ? Colors.lightGreen[700] : Colors.grey[600],
     borderRadius: const BorderRadius.all(const Radius.circular(30.0)),
    border: _highlight ? new Border.all( color: Colors.teal[700], width: 10.0,) : null,
  );
}

  Widget build(BuildContext context) {
    return new GestureDetector(
      onTapDown: _handleTapDown, // 处理按下事件
      onTapUp: _handleTapUp, // 处理抬起事件
      onTap: _handleTap,
      onTapCancel: _handleTapCancel,
      child: new Container(
        color: Colors.white,
        child: new Center(
           child: new ClipRRect(
            borderRadius: const BorderRadius.all(const Radius.circular(30.0)),
            child: new Container(
              width: 180.0,
              height: 180.0,
              decoration: myBoxDecoration(widget.active, _highlight),
              child: new Center(
                child: new Text(
                  widget.active ? 'Active' : 'Inactive',
                  style: new TextStyle(fontSize: 32.0, color: Colors.white),
                )
              )
            ),
          ),
        ),
      ),
    );
  }

}

```

![状态管理](http://static.chengxinsong.cn/image/flutter/flutter_state_management_1.jpg)

![状态管理](http://static.chengxinsong.cn/image/flutter/flutter_state_management_2.jpg)

按下时候的状态展示深绿色边框，放开时候，深绿色边框消失：

![状态管理](http://static.chengxinsong.cn/image/flutter/flutter_state_management_3.jpg)

开发人员只会关系该边框是否处于Active状态，而不在乎高亮显示是如何管理，所以子组件内处理这些逻辑。

### 六、全局状态管理
当应用中需要一些跨组件(跨路由)的状态需要同步时，上面介绍的三种方式就比较难解决了。比如有这样的场景业务：

我们有一个设置页，里面可以设置应用的语言，我们为了让设置实时生效，我们期望在语言状态发生改变时，App中依赖应用语言的组件能够重新build，这些依赖应用语言的组件和设置页并不在一起，所以这种情况下用上面的方法很难管理。这时候，正确的做法：**通过一个全局状态管理器来处理这种相聚较远的组件之间的通信**：

+ 1、实验一个全局的事件总线，将语言状态改变对应为一个事件，然后在APP中依赖应用语言的组件的initState方法中订阅语言改变的事件。当用户在设置页切换语言后，我们发布语言改变事件，而订阅此事件的组件就会收到通知，收到通知后调用setState方法重新build自身。
+ 2、在一些专门用于状态管理的包，如Provider,redux等。后边再介绍全局事件总线。

