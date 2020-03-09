## mysql如何设置支持emoji表情储存

### 一、前言
服务器的很多配置没有搞到位，而且之前服务器的一些配置没有记录，导致项目迁移过来后，访问变慢，项目有时候出现bug。

这回happyChat项目的emoji表情发送失败，想起来是数据库不能存储emoji表情，需要修改mysql的配置，将字符类型修改为utf8mb4。

### 二、原理
mysql的utf-8编码的一个字符最多3个字节，但是一个emoji表情为4个字节，所以utf-8不支持储存emoji表情，但是utf-8的超集utf8mb4一个字符最多能有4个字节，所以能够支持emoji的表情存储。

linux中mysql配置文件为my.cnf。
```
[root@iZmenZ ~]# whereis my.cnf
my: /etc/my.cnf
```

### 三、修改mysql的配置文件
找到/etc/mysql路径下有my.cnf文件，添加如下的配置：
```
[client]
default-character-set=utf8mb4

[mysqld]
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'

[mysql]
default-character-set=utf8mb4
```

然后重启mysql的服务：
```
[root@iZenZ ~]# service mysqld restart
Redirecting to /bin/systemctl restart mysqld.service
```

然后就OK

![mysql-emoji](./images/mysql-emoji.png)