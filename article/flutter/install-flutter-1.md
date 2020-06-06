## mac安装flutter

### 一、下载flutter
#### 1、第一种方式git repo方式
执行下列命令下载最新的flutter代码（系统请先安装Git）
```git
git clone -b beta https://github.com/flutter/flutter.git
```

#### 2、第二种方式官方网站
flutter官网下载其最新可用的安装包，转到[下载页](https://flutter.dev/docs/get-started/install)。


### 二、安装flutter，环境配置，依赖项检查
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


### 三、第一个Flutter App
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

### 四、欢迎关注
show me code：https://github.com/saucxs/flutter_learning/tree/master/hellotest

后续会出更多知识体系构建，技术分享，项目实战，实验室等，欢迎关注本公众号:**[松宝写代码]**

![欢迎关注](http://static.chengxinsong.cn/image/author/intro.jpg?width=600)

>微信公众号：**[松宝写代码]**
songEagle开发知识体系构建，技术分享，项目实战，实验室，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。

>微信群：**【写代码】研发进阶群**
一个成长交流的产研群，帮忙拉产研的同学们进群，聚聚人气😘😘。
每一个开发同学都应该形成自己的[知识体系](https://github.com/saucxs/full_stack_knowledge_list)，做到提纲挈领🧐🧐🧐

### 五、各种福利
关注微信公众号：**[松宝写代码]**，有各种福利。

**「字节跳动」内推福利：**

#### 1、社招内推
![社招内推](http://static.chengxinsong.cn/image/neitui/neitui_1.jpg)

#### 2、实习生内推
![实习生内推](http://static.chengxinsong.cn/image/neitui/shixisheng_neitui_1.jpg)

#### 3、校招内推
官网地址，投递时候填写内推码：8J5ZSB8