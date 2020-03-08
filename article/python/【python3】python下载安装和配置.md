### python简介
python是一种计算机程序设计语言，一种相当高级的语言。

比如：完成一个功能，C语言要1000行，java需要100行，python只需要20行。

代码少的代价：运行速度慢，C语言运行1秒，java原型2秒，python运行10秒。

python并不是万能的，比如写个操作系统，需要用C语言写，写手机应用，用swift或者objecttive-c，
安卓使用java，写3D游戏，最好用c或者c++。

龟叔给Python的定位是“优雅”、“明确”、“简单”，
所以Python程序看上去总是简单易懂，初学者学Python，
不但入门容易，而且将来深入下去，可以编写那些非常非常复杂的程序。

### python应用
+ 1、网络应用：网站，后台服务等
+ 2、日常需要的小工具，包括系统管理员需要的脚本任务等等
+ 3、把其他语言开发的程序封装起来

### python缺点
+ 1、第一个缺点就是运行速度慢，和C程序相比非常慢，
因为Python是解释型语言，你的代码在执行时会一行一行地翻译成CPU能理解的机器码，
这个翻译过程非常耗时，所以很慢。而C程序是运行前直接编译成CPU能执行的机器码，所以非常快。
+ 2、第二个缺点就是代码不能加密。如果要发布你的Python程序，实际上就是发布源代码，
这一点跟C语言不同，C语言不用发布源代码，只需要把编译后的机器码（也就是你在Windows上常见的xxx.exe文件）发布出去。


### python安装
1、在python的官网下载python对应版本：https://www.python.org/downloads/windows/ 
```
     64位下载Windows x86-64 executable installer 版本
     32位下载Windows x86 executable installer 版本
```
打开链接如下图，版本会一直更新，选择任意一个适合自己电脑的版本就好

![下载对应的版本](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/下载对应的版本.png?raw=true)

2、勾选add python to path 添加路径

安装界面点击Customize installation 自定义安装

![安装1](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装1.png?raw=true)

3、不改变默认进行Next下一步

![安装2](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装2.png?raw=true)

4、选择一个自己喜欢的安装位置

![安装3](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装3.png?raw=true)

5、等待进度条加载完毕

![安装4](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装4.png?raw=true)

6、安装完毕，点击Close关闭

若方框位置出现管理员字样则点击授权再关闭
  
![安装5](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装5.png?raw=true)

### python安装验证
进入到自己的安装目录下和任何一个目录下，运行语句：python -V

若显示出Python对应版本则表示安装成功

![安装6](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装6.png?raw=true)

### python第一行代码
在搜索路径搜python，选择IDLE

![安装7](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装7.png?raw=true)

依次按下 print('welcome,程新松，saucxs')，当你看到下界面就是安装完毕了。
```python
print('welcome,程新松，saucxs')
```
![安装8](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/python/安装8.png?raw=true)
