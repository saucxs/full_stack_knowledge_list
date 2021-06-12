# Linux Centos7 服务器安装MongoDB，启动，远程管理

> 作者: 松宝写代码

年轻需要折腾，因为总在本地调试MongoDB，希望可以部署到服务器中，进行远程登陆管理。这回算是折腾上MongoDB的数据库。以下是详细的在Linux Centos7 服务器安装MongoDB，启动，远程管理数据库的教程。


## 一、前言
Linux Centos7 服务器安装MongoDB，启动，远程管理等功能。我们这次使用yum安装包的方式。

## 二、查看服务器的Centos的版本
```
cat /etc/os-release
```
输出
```
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https://www.centos.org/"
BUG_REPORT_URL="https://bugs.centos.org/"

CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"
```

可以看出来是Centos系统版本是 7

## 三、安装Mongodb
### 配置系统yum的源
#### 1. 创建.repo文件，生成mongodb的源
```
vi /etc/yum.repos.d/mongodb-org-4.2.repo
```

#### 2、添加配置信息
```
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
```
+ name：指的是名称
+ baseurl：获得下载的路径
+ gpgcheck：表示对从这个源下载的rpm包进行校验
+ enabled：表示启用这个源
+ gpgkey：gpg验证

#### 3、保存退出
```
:wq
```

### 使用yum安装Mongodb
#### 1、安装
```
sudo yum install -y mongodb-org
```
执行过程

```
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
base                                                     | 3.6 kB     00:00     
docker-ce-stable                                         | 3.5 kB     00:00     
epel                                                     | 4.7 kB     00:00     
extras                                                   | 2.9 kB     00:00     
google-chrome                                            | 1.3 kB     00:00     
mongodb-org-4.4                                          | 2.5 kB     00:00     
mysql-connectors-community                               | 2.6 kB     00:00     
mysql-tools-community                                    | 2.6 kB     00:00     
mysql56-community                                        | 2.6 kB     00:00     
updates                                                  | 2.9 kB     00:00     
正在解决依赖关系
--> 正在检查事务
---> 软件包 mongodb-org.x86_64.0.4.4.6-1.el7 将被 安装
--> 正在处理依赖关系 mongodb-org-shell = 4.4.6，它被软件包 mongodb-org-4.4.6-1.el7.x86_64 需要
--> 正在处理依赖关系 mongodb-org-tools = 4.4.6，它被软件包 mongodb-org-4.4.6-1.el7.x86_64 需要
--> 正在处理依赖关系 mongodb-org-server = 4.4.6，它被软件包 mongodb-org-4.4.6-1.el7.x86_64 需要
--> 正在处理依赖关系 mongodb-org-mongos = 4.4.6，它被软件包 mongodb-org-4.4.6-1.el7.x86_64 需要
--> 正在检查事务
---> 软件包 mongodb-org-mongos.x86_64.0.4.4.6-1.el7 将被 安装
---> 软件包 mongodb-org-server.x86_64.0.4.4.6-1.el7 将被 安装
---> 软件包 mongodb-org-shell.x86_64.0.4.4.6-1.el7 将被 安装
---> 软件包 mongodb-org-tools.x86_64.0.4.4.6-1.el7 将被 安装
--> 正在处理依赖关系 mongodb-org-database-tools-extra = 4.4.6，它被软件包 mongodb-org-tools-4.4.6-1.el7.x86_64 需要
--> 正在处理依赖关系 mongodb-database-tools，它被软件包 mongodb-org-tools-4.4.6-1.el7.x86_64 需要
--> 正在检查事务
---> 软件包 mongodb-database-tools.x86_64.0.100.3.1-1 将被 安装
--> 正在处理依赖关系 cyrus-sasl-gssapi，它被软件包 mongodb-database-tools-100.3.1-1.x86_64 需要
--> 正在处理依赖关系 cyrus-sasl-plain，它被软件包 mongodb-database-tools-100.3.1-1.x86_64 需要
--> 正在处理依赖关系 cyrus-sasl，它被软件包 mongodb-database-tools-100.3.1-1.x86_64 需要
---> 软件包 mongodb-org-database-tools-extra.x86_64.0.4.4.6-1.el7 将被 安装
--> 正在检查事务
---> 软件包 cyrus-sasl.x86_64.0.2.1.26-23.el7 将被 安装
---> 软件包 cyrus-sasl-gssapi.x86_64.0.2.1.26-23.el7 将被 安装
---> 软件包 cyrus-sasl-plain.x86_64.0.2.1.26-23.el7 将被 安装
--> 解决依赖关系完成

依赖关系解决

================================================================================
 Package                          架构   版本             源               大小
================================================================================
正在安装:
 mongodb-org                      x86_64 4.4.6-1.el7      mongodb-org-4.4 6.2 k
为依赖而安装:
 cyrus-sasl                       x86_64 2.1.26-23.el7    base             88 k
 cyrus-sasl-gssapi                x86_64 2.1.26-23.el7    base             41 k
 cyrus-sasl-plain                 x86_64 2.1.26-23.el7    base             39 k
 mongodb-database-tools           x86_64 100.3.1-1        mongodb-org-4.4  50 M
 mongodb-org-database-tools-extra x86_64 4.4.6-1.el7      mongodb-org-4.4  19 k
 mongodb-org-mongos               x86_64 4.4.6-1.el7      mongodb-org-4.4  17 M
 mongodb-org-server               x86_64 4.4.6-1.el7      mongodb-org-4.4  22 M
 mongodb-org-shell                x86_64 4.4.6-1.el7      mongodb-org-4.4  14 M
 mongodb-org-tools                x86_64 4.4.6-1.el7      mongodb-org-4.4 6.1 k

事务概要
================================================================================
安装  1 软件包 (+9 依赖软件包)

总计：103 M
总下载量：64 M
安装大小：413 M
Downloading packages:
Delta RPMs disabled because /usr/bin/applydeltarpm not installed.
警告：/var/cache/yum/x86_64/7/mongodb-org-4.4/packages/mongodb-database-tools-100.3.1.x86_64.rpm: 头V3 RSA/SHA1 Signature, 密钥 ID 90cfb1f5: NOKEY
mongodb-database-tools-100.3.1.x86_64.rpm 的公钥尚未安装
(1/3): mongodb-database-tools-100.3.1.x86_64.rpm           |  50 MB   00:24     
(2/3): mongodb-org-tools-4.4.6-1.el7.x86_64.rpm            | 6.1 kB   00:00     
(3/3): mongodb-org-shell-4.4.6-1.el7.x86_64.rpm            |  14 MB   06:30     
--------------------------------------------------------------------------------
总计                                               167 kB/s |  64 MB  06:32     
从 https://www.mongodb.org/static/pgp/server-4.4.asc 检索密钥
导入 GPG key 0x90CFB1F5:
 用户ID     : "MongoDB 4.4 Release Signing Key <packaging@mongodb.com>"
 指纹       : 2069 1eec 3521 6c63 caf6 6ce1 6564 08e3 90cf b1f5
 来自       : https://www.mongodb.org/static/pgp/server-4.4.asc
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  正在安装    : cyrus-sasl-2.1.26-23.el7.x86_64                            1/10 
  正在安装    : mongodb-org-database-tools-extra-4.4.6-1.el7.x86_64        2/10 
  正在安装    : cyrus-sasl-gssapi-2.1.26-23.el7.x86_64                     3/10 
  正在安装    : mongodb-org-shell-4.4.6-1.el7.x86_64                       4/10 
  正在安装    : cyrus-sasl-plain-2.1.26-23.el7.x86_64                      5/10 
  正在安装    : mongodb-database-tools-100.3.1-1.x86_64                    6/10 
  正在安装    : mongodb-org-tools-4.4.6-1.el7.x86_64                       7/10 
  正在安装    : mongodb-org-server-4.4.6-1.el7.x86_64                      8/10 
Created symlink from /etc/systemd/system/multi-user.target.wants/mongod.service to /usr/lib/systemd/system/mongod.service.
  正在安装    : mongodb-org-mongos-4.4.6-1.el7.x86_64                      9/10 
  正在安装    : mongodb-org-4.4.6-1.el7.x86_64                            10/10 
  验证中      : mongodb-database-tools-100.3.1-1.x86_64                    1/10 
  验证中      : mongodb-org-4.4.6-1.el7.x86_64                             2/10 
  验证中      : mongodb-org-mongos-4.4.6-1.el7.x86_64                      3/10 
  验证中      : mongodb-org-server-4.4.6-1.el7.x86_64                      4/10 
  验证中      : cyrus-sasl-plain-2.1.26-23.el7.x86_64                      5/10 
  验证中      : mongodb-org-shell-4.4.6-1.el7.x86_64                       6/10 
  验证中      : mongodb-org-tools-4.4.6-1.el7.x86_64                       7/10 
  验证中      : cyrus-sasl-gssapi-2.1.26-23.el7.x86_64                     8/10 
  验证中      : mongodb-org-database-tools-extra-4.4.6-1.el7.x86_64        9/10 
  验证中      : cyrus-sasl-2.1.26-23.el7.x86_64                           10/10 

已安装:
  mongodb-org.x86_64 0:4.4.6-1.el7                                              

作为依赖被安装:
  cyrus-sasl.x86_64 0:2.1.26-23.el7                                             
  cyrus-sasl-gssapi.x86_64 0:2.1.26-23.el7                                      
  cyrus-sasl-plain.x86_64 0:2.1.26-23.el7                                       
  mongodb-database-tools.x86_64 0:100.3.1-1                                     
  mongodb-org-database-tools-extra.x86_64 0:4.4.6-1.el7                         
  mongodb-org-mongos.x86_64 0:4.4.6-1.el7                                       
  mongodb-org-server.x86_64 0:4.4.6-1.el7                                       
  mongodb-org-shell.x86_64 0:4.4.6-1.el7                                        
  mongodb-org-tools.x86_64 0:4.4.6-1.el7                                        

完毕
```

#### 2、验证安装结果
执行命令，获取安装的包

```
rpm -qa | grep mongodb
```

执行命令，获取安装路径

```
rpm -ql mongodb-org-server
```

执行过程如下：

```
[renZ ~]# rpm -qa |grep mongodb
mongodb-org-shell-4.4.6-1.el7.x86_64
mongodb-org-server-4.4.6-1.el7.x86_64
mongodb-org-tools-4.4.6-1.el7.x86_64
mongodb-org-mongos-4.4.6-1.el7.x86_64
mongodb-org-database-tools-extra-4.4.6-1.el7.x86_64
mongodb-database-tools-100.3.1-1.x86_64
mongodb-org-4.4.6-1.el7.x86_64
[renZ ~]# rpm -ql mongodb-org-server
/etc/mongod.conf
/run/mongodb
/usr/bin/mongod
/usr/lib/systemd/system/mongod.service
/usr/share/doc/mongodb-org-server-4.4.6
/usr/share/doc/mongodb-org-server-4.4.6/LICENSE-Community.txt
/usr/share/doc/mongodb-org-server-4.4.6/MPL-2
/usr/share/doc/mongodb-org-server-4.4.6/README
/usr/share/doc/mongodb-org-server-4.4.6/THIRD-PARTY-NOTICES
/usr/share/man/man1/mongod.1.gz
/var/lib/mongo
/var/log/mongodb
/var/log/mongodb/mongod.log
```

#### 3、启动服务
启动MongoDB服务

```
systemctl start mongod.service
```

MongoDB默认端口是27017，查看是否开启

```
netstat -natp | grep 27017
```

检查数据库是否安装成功

```
ps -aux | grep mongod    # 查看数据库的进程是否存在
```

执行过程

```
[rZ ~]# systemctl start mongod.service
[rZ ~]# netstat -natp | grep 27017
tcp        0      0 127.0.0.1:27017         0.0.0.0:*               LISTEN      21255/mongod        
[rZ ~]# ps -aux | grep mongod
mongod   21255  3.3  3.4 1552004 65052 ?       Sl   13:20   0:05 /usr/bin/mongod -f /etc/mongod.conf
root     22373  0.0  0.0 112728   976 pts/1    S+   13:23   0:00 grep --color=auto mongod
[rZ ~]# 
```

#### 4、验证服务开启

```
mongo
```

执行过程

```
[rZ ~]# mongo
MongoDB shell version v4.4.6
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("cf367eda-8002-4dbb-9b14-493f251a31a6") }
MongoDB server version: 4.4.6
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
	https://docs.mongodb.com/
Questions? Try the MongoDB Developer Community Forums
	https://community.mongodb.com
---
The server generated these startup warnings when booting: 
        2021-05-24T13:20:26.974+08:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
        2021-05-24T13:20:44.935+08:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
        2021-05-24T13:20:44.936+08:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
        2021-05-24T13:20:44.936+08:00: /sys/kernel/mm/transparent_hugepage/defrag is 'always'. We suggest setting it to 'never'
---
---
        Enable MongoDB's free cloud-based monitoring service, which will then receive and display
        metrics about your deployment (disk utilization, CPU, operation statistics, etc).

        The monitoring data will be available on a MongoDB website with a unique URL accessible to you
        and anyone you share the URL with. MongoDB may use this information to make product
        improvements and to suggest MongoDB products and deployment options to you.

        To enable free monitoring, run the following command: db.enableFreeMonitoring()
        To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
---
> 

```

#### 5、常用命令清单
```
// 1、开启MongoDB
sudo service mongod start  或者 systemctl start mongod.service  # 开启MongoDB
sudo chkconfig mongod on  # 加入开机启动
sudo service mongod restart # 重启MongoDB

// 2、关闭MongoDB
sudo service mongod stop  # 关闭防火墙

// 3、卸载MongoDB
sudo yum erase $(rpm -qa | grep mongodb-org)    # 卸载MongoDB
sudo rm -r /var/log/mongodb  # 删除日志文件
sudo rm -r /var/lib/mongo    # 删除数据文件
```

## 四、远程连接Mongodb
### 1、修改配置文件mongodb.conf

```
vi /etc/mongod.conf
```

```
# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0  # Enter 0.0.0.0,:: to bind to all IPv4 and IPv6 addresses or, alternatively, use the net.bindIpAll setting.
```

修改绑定ip默认127.0.0.1只允许本地连接， 所以修改为bindIp:0.0.0.0, 退出保存

### 2、重启mongodb服务
```
sudo service mongod restart 
```
### 3、开放对外端口

```
iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 27017 -j ACCEPT
```
### 4、阿里云服务器安全端口
PS：其实发现这个打开之后，还需要在阿里云服务器上开启安全端口，这样才可以真是的对外访问，配置安全组规则。

### 5、mongoDB Compass 可视化操作


#### 更多阅读
+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)

+ [【每日一题】(55题)算法题：实现数组的全排列](https://mp.weixin.qq.com/s/0KKYgUXJpnJ2yIQ9DY8eJA)

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


## 往期「每日一题」

### 1、JavaScript && ES6
+ 第 57 题：[【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ 第 47 题：[【每日一题】(47题)JS中内存泄漏存在于哪几种场景中？](https://mp.weixin.qq.com/s/Gykkr_j3x_G-QVxTSsPzEA)

+ 第 46 题：[【每日一题】(46题)JavaScript中有哪些遍历方法？](https://mp.weixin.qq.com/s/MjeeMF42waWiba6GfHGQXw)

+ 第 41 题：[【每日一题】(41题)JS代码到底是如何被压缩的?](https://mp.weixin.qq.com/s/EIep9wMuM7d5QRAqAcDHBg)
 
+ 第 40 题：[【每日一题】(40题)关于script标签，你可能不知道的地方？](https://mp.weixin.qq.com/s/k42O6hbCD0TIc9IdC-sghg)

+ 第 39 题：[【每日一题】(39题)谈谈JS的函数扩展？](https://mp.weixin.qq.com/s/X8fgfydIjb2eOrVCAc3sDA)

+ 第 30 题：[【每日一题】(30题)面试官:ES6的解构赋值的理解？](https://mp.weixin.qq.com/s/-rWv24IAhGAq4WVqHY2jOg)

+ 第 28 题：[【每日一题】(28题)面试官:原型链与构造函数结合方法继承与原型式继承的区别？](https://mp.weixin.qq.com/s/uPUxo8gIGyHv-b_aWdgzaw)

+ 第 22 题：[【每日一题】(22题)面试官问：var与const,let的主要区别是什么？](https://mp.weixin.qq.com/s/wJ1cG7eQw85fpqpk_fHq7w)

+ 第 21 题：[【每日一题】(21题)面试官问：谈谈JS中的 this 的绑定？](https://mp.weixin.qq.com/s/WvDIjv_FNfDsD9OmB6SirA)

+ 第 20 题：[【每日一题】(20题)面试官问：谈谈JS中的 webSockets 的理解？](https://mp.weixin.qq.com/s/GA-Wl03ZDLhnBCAG0wTi0w)

+ 第 19 题：[【每日一题】面试官问：谈谈JS中的 XMLHttpRequest 对象的理解？](https://mp.weixin.qq.com/s/wxIEGJVmfxq0Q-8E4tbv1A)

+ 第 18 题：[【每日一题】面试官问：JS中的 Ajax 跨域与扩展 Comet ？](https://mp.weixin.qq.com/s/mb8TRlw1yzEOfDzMyYLW2g)

+ 第 17 题：[【每日一题】(17题)面试官问：JS中事件流，事件处理程序，事件对象的理解？](https://mp.weixin.qq.com/s/mb8TRlw1yzEOfDzMyYLW2g)

+ 第 16 题：[【每日一题】面试官问：JS中如何全面进行客户端检测？](https://mp.weixin.qq.com/s/-tNI1vwdK_SAxNGRQTCd1Q)

+ 第 15 题：[【每日一题】面试官问：JS类型判断有哪几种方法？](https://mp.weixin.qq.com/s/UwVgQMaVPg6Z0SVgn4kqwA)

+ 第 14 题：[【每日一题】面试官问：谈谈你对JS对象的创建和引申](https://mp.weixin.qq.com/s/-HTpVMFMRDu8sElNv-WqIw)

+ 第 13 题[[每日一题]面试官问：['1', '2', '3'].map(parseInt)输出，原因，以及延伸？](https://mp.weixin.qq.com/s/DJ6Av4tQgJpqa8hKAPk_uA)

+ 第 12 题[[每日一题]面试官问：JS引擎的执行过程（二）](https://mp.weixin.qq.com/s/CCUsCM2vzb6S1wcwIsjQuA)

+ 第 11 题[[每日一题]面试官问：JS引擎的执行过程（一）](https://mp.weixin.qq.com/s/Lhd5N5a1b8fAstWn5H3B3Q)

+ 第 10 题[[每日一题]面试官问：详细说一下JS数据类型](https://mp.weixin.qq.com/s/wm0EGVXTTHoHMcdUxMQmKA)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

### 2、浏览器

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)


### 3、Vue

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

### 4、React
+ 第 38 道[【每日一题】(38题)谈谈React Hooks 与Vue3.0 Function based API的对比？](https://mp.weixin.qq.com/s/7D8SvbS1r0oH60EjwowXSQ)

### 5、HTML5
+ 第 29 道[【每日一题】(29题)面试官:HTML-HTML5新增标签属性的理解？](https://mp.weixin.qq.com/s/Lx5-bF-xliB9TBuEtE7dLw)

### 6、算法
 + 第 56 题[【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)

+ 第 54 题[【每日一题】(54题)算法题：最大子序和](https://mp.weixin.qq.com/s/rqU8hZmmBXY5-9ycR7997g)

+ 第 53 题[【每日一题】(53题)算法题：数组中的 K-diff 数对](https://mp.weixin.qq.com/s/JziiqBhYHMw44DAR8FDzwA)

+ 第 52 道[【每日一题】(52题)算法题：合并两个有序数组](https://mp.weixin.qq.com/s/YHD1F0-evjwGjtkMdosioA)

+ 第 51 道[[【每日一题】(51题)算法题：最大子序和](https://mp.weixin.qq.com/s/OB8hS_HWyVnwq8EvIYR_Fg)

+ 第 50 道[【每日一题】(50题)算法题：只出现一次的数字III](https://mp.weixin.qq.com/s/lUsl_EFHbUgfohR23NGS7g)

+ 第 49 道[【每日一题】(49题)算法题：只出现一次的数字II](https://mp.weixin.qq.com/s/yfbkKD9YebTOGW5VTLZv_A)

+ 第 48 道[【每日一题】(48题)算法题：只出现一次的数字](https://mp.weixin.qq.com/s/yXXH_-qbJJYo3lOBSzr8Kg)

+ 第 45 道[【每日一题】(45题)编程题：如何实现strStr()](https://mp.weixin.qq.com/s/FF42G2ZV1N_dEYRXQnKp7g)

+ 第 44 道[【每日一题】(44题)编程题：分割回文字符串](https://mp.weixin.qq.com/s/aBv_wGVX1aKDBLf_ERtQIA)

+ 第 37 道[【每日一题】(37题)面试官:你对图论了解多少？(七)](https://mp.weixin.qq.com/s/ukPZLrfsPsCxJtOQko8EJg)

+ 第 36 道[【每日一题】(36题)面试官:你对图论了解多少？(六)](https://mp.weixin.qq.com/s/BReGF1JB05W5Ge2ZeaEEYw)

+ 第 35 道[【每日一题】(35题)面试官:你对图论了解多少？(五)](https://mp.weixin.qq.com/s/_ICHDWO4ma_CbEbbemkxZw)

+ 第 34 道[【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

+ 第 33 道[【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

+ 第 32 道[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

+ 第 31 道[[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)

+ 第 27 道[【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？](https://mp.weixin.qq.com/s/EY99dnyjjTvdBflpE5T2Fw)

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 7、Node

+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)

### 8、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

+ 第 42 题[【每日一题】(42题)谈谈你对Http2.0的理解?](https://mp.weixin.qq.com/s/rTKqfMtdvBrNCssN5qa_0Q)

+ 第 43 题 [【每日一题】(43题)如何在项目中使用Http2.0?](https://mp.weixin.qq.com/s/VBEXV6HqFW7ja9tB1a8E3Q)

### 9、年终总结
+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)



## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位**。

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)

