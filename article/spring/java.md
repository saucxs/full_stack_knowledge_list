
## 一、下载

### 1.1方案1打开url选择jdk1.8下载
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html

我选择linux x64版本：
![image](http://static.chengxinsong.cn/image/spring/java-down.jpg)


通过浏览器控制台，打开all，看到请求的url
![image](http://static.chengxinsong.cn/image/spring/java-down-url.jpg)

复制出url：
```
https://download.oracle.com/otn/java/jdk/8u261-b12/a4634525489241b9a9e1aa73d9e118e6/jdk-8u261-linux-x64.tar.gz?AuthParam=1600091044_31c1eb94fbbe8bda12225c3e79714b87
```

在centos中使用wget下载
```
wget https://download.oracle.com/otn/java/jdk/8u261-b12/a4634525489241b9a9e1aa73d9e118e6/jdk-8u261-linux-x64.tar.gz?AuthParam=1600091044_31c1eb94fbbe8bda12225c3e79714b87
```

发现提示403

![image](http://static.chengxinsong.cn/image/spring/down-load-error.jpg)

应该是没有权限
```
wget https://download.oracle.com/otn/java/jdk/8u261-b12/5b13a193868b4bf28bcb45c792fce896/jdk-8u261-linux-x64.tar.gz?AuthParam=1600091044_31c1eb94fbbe8bda12225c3e79714b87

```

模拟一个 User-Agent 请求头就可以解决了。User-Agent 可以直接复制浏览器 -> 开发者模式（F12或者 cmd + option + i） -> 网络-> 请求头 -> User-Agent 比如我的就是 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15。

```
wget -U 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15' -O '目标文件名.后缀名' 你的URL
```

### 1.2方案2使用yum安装

安装jdk
此次选择java-1.8.0-openjdk-devel.x86_64 : OpenJDK Development Environment

```
yum install java-1.8.0-openjdk-devel.x86_64
```

**推荐使用方案2：yum安装**

## 二、全局配置变量
### 2.1打开配置文件,配置java路径

```
vi /etc/profile
```

复制以下三行到文件中,下面路径根据自己的安装路径来。

```
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.171-8.b10.el6_9.x86_64
export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$PATH:$JAVA_HOME/bin
```

### 2.2全局变量立即生效

```
source /etc/profile
```

### 2.3查看安装是否成功
```
java -version
```

## 欢迎关注
show me code：https://github.com/saucxs/flutter_learning/tree/master/hellotest

后续会出更多相关的flutter学习和实战，欢迎关注本公众号

![欢迎关注](http://static.chengxinsong.cn/image/author/intro.jpg?width=600)

>微信公众号：**[松宝写代码]**
songEagle开发知识体系构建，技术分享，项目实战，项目实验室，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。

## 「字节跳动」内推福利
### 1、社招内推
![社招内推](http://static.chengxinsong.cn/image/neitui/bytedance_social.jpg)

### 2、实习生内推
![实习生内推](http://static.chengxinsong.cn/image/neitui/shixisheng_neitui_1.jpg)

### 3、校招内推
+ 官网地址，投递时候填写内推码：8J5ZSB8
+ 或者扫码直接投递：
![校招内推](http://static.chengxinsong.cn/image/neitui/bytedance_campus.jpg)
