### mac安装flutter

#### 一、下载flutter
##### 1、第一种方式git repo方式
执行下列命令下载最新的flutter代码（系统请先安装Git）
```git
git clone -b beta https://github.com/flutter/flutter.git
```

##### 2、第二种方式官方网站
flutter官网下载其最新可用的安装包，转到[下载页](https://flutter.dev/docs/get-started/install)。


#### 二、安装flutter，环境配置，依赖项检查
（1）目前接下来我的是使用官方网下载的zip压缩包。

（2）解压

（3）添加flutter相关工具到path中：
```bash
export PATH=`pwd`/flutter/bin:$PATH
```
这个命令只在当前命令行中设置PATH环境变量，要想永久将Flutter添加到PATH中请参考下面更新环境变量部分。

使用命令查看是否安装成功
```bash
./bin/flutter --v
```
[检查flutter是否安装成功](http://static.chengxinsong.cn/image/flutter/flutter-1.jpg)

（4）个人觉得还是使用永久的将flutter添加到path中

在用户文件夹下找到.bash_profile文件，如果没有就创建一个;

```text
export PUB_HOSTED_URL=https://pub.flutter-io.cn 
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn 
export PATH=/Users/chengxinsong/Desktop/Tool/flutter/bin:$PATH
```
添加保存后，执行下列命令刷新终端：
```
source $HOME/.bash_profile
```
运行下列命令检查flutter是否已经安装成功：
```bash
flutter -v
```
[检查flutter是否安装成功](http://static.chengxinsong.cn/image/flutter/flutter-2.jpg)

出现上述说明，安装成功。

（6）检查flutter的依赖项
```bash
flutter doctor
```
flutter会提示你那些东西是必须要的，需要执行什么命令进行安装，按照提示安装即可；
[检查flutter的依赖性](http://static.chengxinsong.cn/image/flutter/flutter-3.jpg)


#### 三、第一个Flutter App
打开VsCode

VsCode需要安装两个扩展：Dart和Flutter。

按F1(有touchbar的机子按住fn可见F1)呼出命令输入框；

输入字符Flutter，在命令候选列表中选择Flutter: New Project，
新建一个Flutter项目，随后让你填写项目名称和选择项目存放路径；

![flutter](http://static.chengxinsong.cn/image/flutter/flutter-5.jpg)

设置好flutter的安装路径的根目录。

项目创建好后，在VSCode右下角选择调试环境目标:

![flutter](http://static.chengxinsong.cn/image/flutter/flutter-6.jpg)

怎么启动?vscode已经提示f5启动项目。启动有点慢，等着就好了。

![flutter](http://static.chengxinsong.cn/image/flutter/flutter-7.jpg)

点击+号

![flutter](http://static.chengxinsong.cn/image/flutter/flutter-8.jpg)

