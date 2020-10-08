## 前言
传统的web项目，可能大部分要部署到web容器中，比如Tomcat。然而SpringBoot提供了一种超级简单的部署方式，就是直接将应用打包成jar包，在生产上只需要执行java pjar就可以运行。

## 打包的步骤
### 1、在pom.xml添加spring-bbot-maven-plugin

```
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 2、执行命令打包
保存pom.xml，进入pom.xml所在的目录，运行命令打包。
```
mvn clean package -Dmaven.test.skip=true
```

执行成功：

```
chengxinsongdeMacBook-Pro:xianhe-server chengxinsong$ mvn clean -Dmaven.test.skip=true
[INFO] Scanning for projects...
[INFO] 
[INFO] -----------------< com.xianhe:spring-boot-api-starter >-----------------
[INFO] Building xianhe-server 1.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ spring-boot-api-starter ---
[INFO] Deleting /Users/chengxinsong/Desktop/coding/xianhe-server/target
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.457 s
[INFO] Finished at: 2020-09-13T23:02:30+08:00
[INFO] ------------------------------------------------------------------------

```

### 3、使用java -jar命令运行应用
打包完成，进入Target目录，使用java -jar命令，运行应用

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
