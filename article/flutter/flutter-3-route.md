## flutter的路由管理

### 一、前言
VS Code创建一个新的Flutter工程，命名为"first_flutter_app"。创建好后，就会得到一个计数器应用的Demo。

我们先运行创建的工程，效果如图2-1所示：
 
![计时器](http://static.chengxinsong.cn/image/flutter/flutter-8.jpg)

主要Dart代码是在 lib/main.dart 文件中，下面是它的源码：
```
import 'package:flutter/material.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Flutter Demo',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title),
      ),
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            new Text(
              'You have pushed the button this many times:',
            ),
            new Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline,
            ),
          ],
        ),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: new Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
```

### 二、路由管理
flutter中的路由指的是页面，与web开发中route概念基本一样，router在安卓中通常指的是一个activity，在ios中指的viewController。

所谓的路由管理，就是管理页面之间如果跳转。flutter中的路由管理与原生开发类似，无论是android还是ios，路由管理都会维护一个路由栈，路由栈push操作对应打开一个新页面，路由出栈pop操作对应的关闭操作，路由管理主要是指如何管理路由栈。

在上面的计数器的基础上

#### 2.1一个简单例子

##### 1、创建新路由
创建新路由，命名为”newRoutePage“。
```
// 新路由
class NewRoutePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("新页面1"),
      ),
      body: Center(
        child: Text('这是一个新页面1'),
      ),
    );
  }
}
```
新路由继承StatelessWidget，界面里居中写”这是一个新页面1“，title为”新页面“

##### 2、添加新链接按钮
在_MyHomePageState.build方法中的column的子widget中添加一个按钮FlatButton。

```
class _MyHomePageState extends State<MyHomePage> {
  ...
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title),
      ),
      body: new Center(
        child: new Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            new Text(
              'You have pushed the button this many times:',
            ),
            new Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline,
            ),
            FlatButton(
              child: Text('打开新页面'),
              textColor: Colors.blue,
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (context){
                  return NewRoutePage();
                }));
              },
            )
          ],
        ),
      ),
      floatingActionButton: new FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: new Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
```
这样我们添加一个新开路由的按钮，并将文字颜色设置为蓝色，打开新路由页面。

![新路由管理](http://static.chengxinsong.cn/image/flutter/flutter_new_route_1.jpg)

![新路由管理](http://static.chengxinsong.cn/image/flutter/flutter_new_route_2.jpg)

#### 2.2 MaterialPageRoute类
MaterialPageRoute继承PageRoute类，pageRoute类是一个抽象类，表示占有整个屏幕空间的一个「模态路由页面」，他还定义了路由构建及切换时过渡动画的相关接口及属性。

MaterialPageRoute是Material组件库提供的组件，它可以针对不同平台，实现与平台页面切换动画一致的路由切换动画：
+ 对于android：当打开新页面时，新的页面会从屏幕底部滑动到屏幕顶部；当关闭页面时，当期页面会从屏幕顶部滑动到屏幕底部后消失，同时上一个页面会显示到屏幕上。
+ 对于ios：当打开页面时，新的页面会从屏幕右侧边缘一致滑动到屏幕左边，直到新页面全部显示到屏幕上，而上一个页面则会从当前屏幕滑动到屏幕左侧而消失；当关闭页面时，正好相反，当前页面会从屏幕右侧滑出，同时上一个页面会从屏幕左侧滑入。

我们看一下MaterialPageRoute构造函数的各个参数的意义。
```
MaterialPageRoute({
  WidgetBuilder builder,
  RouteSettings settings,
  bool maintainState = true,
  bool fullscreenDialog = false,
})
```

+ builder 是一个WidgetBuilder类型的回调函数，它的作用是侯建路由页面的具体内容，返回值是一个widget。我们通常要实现此回调，返回新路由的实例。
+ settings 包含路由的配置信息，如路由的名称，是否初始路由(首页)。
+ maintainState： 默认情况下，当入栈一个新路由的时候，原来的路由仍会被保存在内存中，如果想在路由没有用的时候释放其所占的所有资源，可以设置maintainState为false。
+ fullscreenDialog 表示新的路由页面是否是一个全屏的模态框，在ios中，如果fullscreenDialog为true，新页面会从屏幕底部滑入（而不是水平方向）。

#### 2.3 Navigator
Navigator是一个路由管理的组件，提供路由打开的方法。

Navigator通过一个栈来管理活动路由集合。通常当前屏幕显示的页面时栈顶的路由，Navigator提供一系列的方法管理路由栈，常见的方法： 
+ push
Future push(BuildContext context, Route route) 将给定的路由入栈（即打开新页面），返回一个Future对象，接收新路由出栈时的返回数据。
+ pop
bool pop(BuildContext context, [result])将栈顶路由出栈，result为页面关闭时返回给上一个页面的数据。
+ 其他
比如，Navigator.replace， Navigator.popUntil等

#### 2.4 路由传值
路由跳转的时候，我们需要在路由上携带一些参数，比如打开商品详情页，我们需要携带一个商品id，这样商品详情页才知道展示哪个商品信息；等等

我们先来一个简单的例子，需求：
+ 我们从RouterParamsTestA(简称：A页面)跳到RouterParamsTestB(B页面)，即A跳到B。
+ A跳到B，需要携带参数`页面传参值， A->B`
+ B页面有个返回按钮，返回到A页面，返回参数`返回值saucxs，B->A`

```
import 'package:flutter/material.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Flutter Demo',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new RouterParamsTestA(),
    );
  }
}

// 新路由Test
class RouterParamsTestA extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: RaisedButton(
        onPressed: () async {
        var result = await Navigator.push(
          context,
          MaterialPageRoute(builder: (context){
            return RouterParamsTestB(params: '页面传参值， A->B',);
          })
        );
        print('路由返回值：$result');
      },
      child: Text('打开提示页RouterParamsTestB'),
      ),
    );
  }
}

// 新路由 路由传值
class RouterParamsTestB extends StatelessWidget {
  RouterParamsTestB({
    Key key,
    @required this.params,    // 接收一个text参数
  }) : super(key: key);
  final String params;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('提示'),),
      body: Padding(
        padding: EdgeInsets.all(18),
        child: Center(
          child: Column(children: <Widget>[
            Text(params),
            RaisedButton(
              onPressed: () => Navigator.pop(context, '返回值saucxs，B->A'),
              child: Text('返回A页面'),
              )
          ],)
        ),
      ),
    );
  }
}
```

运行上面代码，点击「打开提示页RouterParamsTestB」按钮跳到B页面，在B页面点击「返回A页面」按钮跳转回到A页面。

![路由携带参数](http://static.chengxinsong.cn/image/flutter/flutter_new_route_3.jpg)

![路由携带参数](http://static.chengxinsong.cn/image/flutter/flutter_new_route_4.jpg)

说明一下：
+ B页面文案“页面传参值， A->B'”是A页面通过params参数传递给新路由页B。我们可以通过等待Navigator.push(…)返回的Future来获取新路由的返回数据。
+ B页面有两种返回方式，第一种是直接点击导航栏上的返回箭头，第二种点解页面的「返回A页面」按钮。这两种方式区别是前者不会返回数据给上一个路由，后者会。

```
Restarted application in 887ms.
I/flutter ( 5465): 路由返回值：null   
I/flutter ( 5465): 路由返回值：返回值saucxs，B->A
```

介绍的是非命名路由的传值方式，命名路由的传值方式会有所不同。