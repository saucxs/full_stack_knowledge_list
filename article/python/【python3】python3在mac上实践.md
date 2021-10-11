## 前言
在mac下有多种安装方式，比如Homebrew，安装包安装等安装，推荐使用Homebrew安装。
1、下面我介绍一下Homebrew安装

## 一、Homebrew安装
Homebrew是Mac平台下强大的包管理工具，官网https://brew.sh/

### 1、执行命令安装Homebrew工具
```cmd
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
安装如下：
![python1](http://static.chengxinsong.cn/image/python3/python1.jpg)

![python1](http://static.chengxinsong.cn/image/python3/python2.jpg)

安装完成之后，就可以使用Homebrew来安装Python3和pip3:

### 2、执行命令安装python3
```
brew install python3
```
等待下载安装
![python1](http://static.chengxinsong.cn/image/python3/python3.jpg)

我们验证是否安装成功

输入
```
python3

pip3 -V
```
如下图所示

![python1](http://static.chengxinsong.cn/image/python3/python4.jpg)

说明mac下的安装成功了


### 3、MongoDB数据库安装
MongoDB数据库是C++语言编写的非关系型数据库，基于分布式文件存储的开源数据库系统，内容存储形式：JSON对象，字段值可以包含其他文档，数组，文档数组，非常灵活。

使用Homebrew安装

mongodb提供3种版本供安装：普通版、支持TLS/SSL版本和开发版，具体请参见mongodb官网。普通版本安装执行以下指令：

```
brew install mongodb
```

发现问题

![python1](http://static.chengxinsong.cn/image/python3/python5.jpg)

提示说没有可用的名叫 monggodb 的模块，真是见鬼了，通过一番了解，才知道，MongoDB 已经宣布不再开源，从2019年9月2日开始 ，HomeBrew 也从核心仓库 (#43770(https://github.com/Homebrew/homebrew-core/pull/43770)) 当中移除了mongodb 模块

不过想要继续使用 brew install mongodb 也是可以的，MongoDB 官方提供了一个单独的 HomeBrew 的社区版本安装：https://github.com/mongodb/homebrew-brew 。

先执行 brew tap mongodb/brew

这里直接安装默认的社区版本，执行：brew install mongodb-community 也可以参考文档安装指定的版本；

这个 brew tap 的源无法加速，是从 mongodb.org 官方下载的安装包，所以需要多耐心等待一下，这个速度是真的慢，果然放弃，使用之前安装的mysql。


### 4、存储库安装
介绍了数据库安装，那是存储数据，如果想py和mysql交互的话，需要安装py的一些存储库，比如mysql的pyMysql等。

使用pip3安装pymysql

```
pip3 install pymysql
```
![python1](http://static.chengxinsong.cn/image/python3/python6.jpg)

验证安装
```
python3
import pymysql
pymysql.VERSION
```
如下图所示

![python1](http://static.chengxinsong.cn/image/python3/python7.jpg)

说明安装成功了。


### 5、Flask库安装
web应用都是服务程序搭建而来，python同样可以实现，也有一些web服务程序，比如flask，django等，我们可以用它来开发网站和接口。

Flask库是一个轻量级的web服务程序，简单，主要是用来做一些API服务。

 我们使用pip3安装

执行命令

```
pip3 install flask
```
![python1](http://static.chengxinsong.cn/image/python3/python8.jpg)

验证安装是否成功

```
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello world"

if __name__ == "__main__":
  app.run()
```
注意：
+ 不要用===，用==

![python1](http://static.chengxinsong.cn/image/python3/python9.jpg)

浏览器运行结果：

![python1](http://static.chengxinsong.cn/image/python3/python10.jpg)
