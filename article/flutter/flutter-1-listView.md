## 【flutter】手把手写flutter入门的例子：无限滚动ListView

### 1、Hello world
我使用的是macbook pro的，编辑器VS。
+ 按F1(有touchbar的机子按住fn可见F1)呼出命令输入框；
+ 输入字符Flutter，在命令候选列表中选择Flutter: New Project；
+ 随后让你填写项目名称和选择项目存放路径。


### 2、在屏幕的中心显示“Hello World”
目标：在屏幕的中心显示“Hello World”
+ 替换 lib/main.dart.

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'welcome to start name Demo',
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('你好，saucxs'),
        ),
        body: new Center(
          child: new Text('Hello world'),
        )
      )
    );
  }
}
```

+ 运行之后的页面

![flutter](http://static.chengxinsong.cn/image/flutter/flutter_learning.jpg)

+ 分析
 - 创建的是一个Material APP。Material是一种标准的移动端和web
端的视觉设计语言。flutter提供了一套丰富的Material widgets。
 - main函数使用了`=>`符号，Dart中单行函数或者方法的简写
 - MyApp继承了StatelessWidget，这将使应用本身也成为一个widget。在flutter中，大多数的都是widget，包括对齐的alignment，填充padding，布局layout。
 - scaffold是material library中提供的一个widget，他提供了默认的导航栏appBar，标题和包含主屏幕widget树的body属性。widget树可以很复杂。
 - widget的主要工作就是提供一个build方法来描述如何根据其他较低级别的widget来显示自己。
 - 本例子中的body的widget树中包含了一个center widget，center widget又包含了一个text子的widget。center widget可以将其子widget树对齐到屏幕中心


### 3、如何使用外部包
开始使用一个名为english_words的开源软件包 ，其中包含数千个最常用的英文单词以及一些实用功能。

可以在pub.dartlang.org上找到一些包，比如english_words软件包

+ pubspec文件管理Flutter应用程序的assets(比如图片，package等)。在pubspec.yaml中，将english_words(3.1.0及以上)添加到依赖列表中，比如

![flutter](http://static.chengxinsong.cn/image/flutter/flutter_learning1.jpg)

+ 在lib/main.dart中，引入`english_words`

```
import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';
```

+ 使用english worlds 包生成文本来替换字符串
使用的是驼峰命名法，表示字符串中每个单词都以大写字母开头。

```
import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    final wordPair = new WordPair.random();
    return new MaterialApp(
      title: 'welcome to start name Demo',
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('你好，saucxs'),
        ),
        body: new Center(
          // child: new Text('Hello world'),
          child: new Text(wordPair.asPascalCase),
        )
      )
    );
  }
}
```
PS: 每一次热重启，都是生成不同的英文。

### 4、添加一个有状态的部件（stateful widget）
Stateless widget 是不可变的，意味着属性不能改变，所有的值都是最终的值。

**Stateful widget 持有的状态可能在widget生命周期中发生变化，实验一个 stateful widget至少需要两个类。**

+ 一个StatefulWidget类
+ 一个State类。StatefulWidget类本身是不变的，但是State类在widget生命周期中始终存在。

我们先添加一个有状态的widget-RandomWords，它创建其State类RandomWordsState。State类将最终为widget维护建议的和喜欢的单词对。

+ 第一步：添加有状态的RandomWords widget到main.dart。也可以是MyApp之外的文件的任何位置，但是我们首先放在文件的底部。RandomWords widget除了创建State类之外几乎没有其他任何东西。

```
class RandomWords extends StatefulWidget {
 @override
createState() => new RandomWordsState();
}
```

+ 第二步：添加RandomWordsState类。程序大部分代码在这个类中，该类持有RandomWords widget的状态。这个类将保存随着用户滚动而无线增长的生成的单词对，以及喜欢的单词对，用户通过重复覅按季心形图表来将他们从列表中添加和删除。

新建这样一个类，首先，通过添加高亮显示代码创建一个最小的类。

```
class RandomWordsState extends State<RandomWords> {

}
```

+ 第三步：在添加状态类后，接下来我们添加一个基本的build方法，该方法通过将生成的单词对的代码从MyApp移动到RandomWordsState来生成单词对。

将build方法添加到RandomWordState中，代码如下：

```
class RandomWordsState extends State<RandomWords> {
 @override
 Widget build(BuildContext context) {
  final wordPair = new WordPair.random();
  return new Text(wordPair.asPascalCase);
 }
}
```

+ 第四步：通过修改MyApp类，将生成单词对的代码从MyApp中移动到RandomWordsState中。

```
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    // final wordPair = new WordPair.random();
    return new MaterialApp(
      title: 'welcome to start name Flutter Demo',
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('你好，saucxs'),
        ),
        body: new Center(
          // child: new Text('Hello world'),
          // child: new Text(wordPair.asPascalCase),
          child: new RandomWords(),
        )
      )
    );
  }
}
```
重新启动应用程序。跟之前的一样，每一次热重载，都会生成新的单词。

### 5、创建一个无限滚动ListView
上述中的RandomWordsState类，我们继承这个类，并生成显示单词对列表。当用户滚动时，ListView中显示的列表将无限的增长。ListView的build工厂构造函数允许按需建立一个懒加载的列表视图。

+ 第一步：向RandomWordsState类中添加一个_suggestions列表中保存建议的单词对。**对变量以下划线_开头的，Dart语言中使用下划线前缀的标识符，会强制变成私有的。**

另外，添加一个`biggerFont`变量来增大字体大小。

```
class RandomWordsState extends State<RandomWords> {
 final _suggestions = <WordPair>[];
 final _biggerFont = const TextStyle(fontSize: 18.0);
...
}
```

+ 第二步：向RandomWordsState类中添加一个`_buildSuggestion()`函数，此方法构建显示建议单词对的ListView。

ListView类提供了一个builder属性，itemBuilder值是一个匿名回调函数，接受两个参数：BuildContext和迭代器i。迭代器从0开始，没调用一次该函数，i就会自增1，对于每个建议单词对都会执行一次。该模型允许建议的单词对列表在用户滚动时无限增长。

代码如下：

```
class RandomWordsState extends State<RandomWords> {
  final _suggestions = <WordPair>[];
  final _biggerFont = const TextStyle(fontSize: 18.0);
  Widget _buildSuggestions() {
    return new ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemBuilder: (context, i){
        if (i.isOdd) return new Divider();
        final index = i ~/ 2;
        if (index >= _suggestions.length) {
          _suggestions.addAll(generateWordPairs().take(10));
        }
        return _buildRow(_suggestions[index]);
      }
    );
  }
}
```

+ 第三步：对于每一个单词对，_buildSuggestions函数都会调用一次_buildRow。这个函数在ListTile中显示每个新词对，这样在下一步中可以生成更漂亮的显示行。

在RandomWordsState中添加一个_buildRow函数：

```
class RandomWordsState extends State<RandomWords> {
 ...
Widget _buildRow(WordPair pair) {
  return new ListTile(
   title: new Text(
    pair. asPascalCase,
    style: _biggerFont,
   ),
  );
 }
}
```

+ 第四步：更新RandomWordsState的build方法以使用_buildSuggestions()，而不是直接调用单词生成库。更改如下：

```
class RandomWordsState extends State<RandomWords> {
  ...
  @override
  Widget build(BuildContext context) {
    return new Scaffold (
      appBar: new AppBar(
        title: new Text('Startup Name Generator'),
      ),
      body: _buildSuggestions(),
    );
  }
  ...
}
```

+ 第五步：更新MyApp的build方法。从MyApp中删除Scaffold和AppBar实例。
这些将由RandomWordsState管理，这使得用户在下一步的从一个屏幕导航到另一个屏幕，可以轻松的更改导航栏中的路由名称。

替换最初的build方法：

```
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'welcome to start name Flutter Demo',
      home: new RandomWords(),
    );
  }
}
```
重启应用程序，你可以看到一个单词对列表。尽可能的向下滚动，将继续看到新的单词对。

![flutter](http://static.chengxinsong.cn/image/flutter/flutter_learning3.jpg)

### 6、欢迎关注
show me code：https://github.com/saucxs/flutter_learning/tree/master/hellotest

后续会出更多知识体系构建，技术分享，项目实战，实验室等，欢迎关注本公众号:**[松宝写代码]**

![欢迎关注](http://static.chengxinsong.cn/image/author/intro.jpg?width=600)

>微信公众号：**[松宝写代码]**
songEagle开发知识体系构建，技术分享，项目实战，实验室，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。

>微信群：**【写代码】研发进阶群**
一个成长交流的产研群，帮忙拉产研的同学们进群，聚聚人气😘😘。
每一个开发同学都应该形成自己的[知识体系](https://github.com/saucxs/full_stack_knowledge_list)，做到提纲挈领🧐🧐🧐

### 7、各种福利
关注微信公众号：**[松宝写代码]**，有各种福利。

**「字节跳动」内推福利：**

#### 1、社招内推
![社招内推](http://static.chengxinsong.cn/image/neitui/neitui_1.jpg)

#### 2、实习生内推
![实习生内推](http://static.chengxinsong.cn/image/neitui/shixisheng_neitui_1.jpg)

#### 3、校招内推
官网地址，投递时候填写内推码：8J5ZSB8