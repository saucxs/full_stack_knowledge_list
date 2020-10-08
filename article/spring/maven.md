# Mac 安装 maven
## 下载maven
首先从 Maven 官方地址：http://maven.apache.org/download.cgi 下载最新版本apache-maven-xxx-bin.tar.gz

![image](http://static.chengxinsong.cn/image/spring/maven-install-file-list.jpg)

加下来将下载的文件解压到 /usr/local/maven 下。

![image](http://static.chengxinsong.cn/image/spring/maven-install-file-path.jpg)


## 配置环境变量
```bash
vi ~/.bash_profile
```
!image(http://static.chengxinsong.cn/image/spring/bash-profile.jpg)

添加如下的maven配置：
```
export M3_HOME=/usr/local/maven/apache-maven-3.6.3
export PATH=$M3_HOME/bin:$PATH
```

执行如下命令使配置的环境变量生效：
```
source ~/.bash_profile
```

## 测试Maven是否安装成功
可以先输出 Maven 环境地址
```
echo $M3_HOME
echo $PATH
```
!image(http://static.chengxinsong.cn/image/spring/maven-check.jpg)

说明配置没有问题

接下来我们使用maven的命令来查看maven版本，鉴定maven是否安装成功。

```
mvn -version
```

成功时候，输出以下日志：

```
chengxinsongdeMacBook-Pro:~ chengxinsong$ mvn -version
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /usr/local/maven/apache-maven-3.6.3
Java version: 1.8.0_241, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk1.8.0_241.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.15.5", arch: "x86_64", family: "mac"
```

这样，Mac 下 Maven 的环境就配置成功。

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
