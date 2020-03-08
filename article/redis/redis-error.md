## linux使用yum安装redis，redis 解决启动失败的问题

### 一、前言
最近换服务器后，有点没有上心搞这个，最近发现网站打开超慢，今天看看什么原因，最后排查到redis上，发现服务器上
redis就没有启动成功，然后报错信息：
```
Job for redis.service failed because the control process exited with error code. See "systemctl status redis.service" and "journalctl -xe" for details.
```
看描述的是启动的控制线程意外退出。

下面给出运行的命令service redis start和service redis status。

启动redis，错误描述：
```
[root@iZm5ehn5rqfkkytdj0n8enZ ~]# service redis start
Redirecting to /bin/systemctl start redis.service
Job for redis.service failed because the control process exited with error code. See "systemctl status redis.service" and "journalctl -xe" for details.
```

查看redis状态，错误描述
```
[root@iZm5ehn5rqfkkytdj0n8enZ etc]# service redis status
Redirecting to /bin/systemctl status redis.service
● redis.service - Redis persistent key-value database
   Loaded: loaded (/usr/lib/systemd/system/redis.service; enabled; vendor preset: disabled)
  Drop-In: /etc/systemd/system/redis.service.d
           └─limit.conf
   Active: failed (Result: exit-code) since 日 2020-03-08 10:24:55 CST; 10min ago
  Process: 29069 ExecStop=/usr/libexec/redis-shutdown (code=exited, status=0/SUCCESS)
  Process: 29068 ExecStart=/usr/bin/redis-server /etc/redis.conf --supervised systemd (code=exited, status=1/FAILURE)
 Main PID: 29068 (code=exited, status=1/FAILURE)

3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: Starting Redis persisten...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: redis.service: main proc...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29069]: awk: fatal: c...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29069]: awk: fatal: c...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29069]: awk: fatal: c...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29069]: awk: fatal: c...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29069]: NOAUTH Authen...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: Failed to start Redis pe...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: Unit redis.service enter...
3月 08 10:24:55 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: redis.service failed.
Hint: Some lines were ellipsized, use -l to show in full.
```

### 二、查找原因和解决方案
按照错误的提示，说输入“journalctl -xe”来查看详情，于是我输入后便显示：
```
-- Unit redis.service has begun starting up.
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ redis-server[29313]: 29313:C 08 Mar 11:01:54.283 # Fatal error, can't open config file '/e
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: redis.service: main process exited, code=exited, status=1/FAILURE
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29314]: awk: fatal: cannot open file `/etc/redis.conf' for reading (Permiss
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29314]: awk: fatal: cannot open file `/etc/redis.conf' for reading (Permiss
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29314]: awk: fatal: cannot open file `/etc/redis.conf' for reading (Permiss
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29314]: awk: fatal: cannot open file `/etc/redis.conf' for reading (Permiss
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ redis-shutdown[29314]: NOAUTH Authentication required.
3月 08 11:01:54 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: Failed to start Redis persistent key-value database.
-- Subject: Unit redis.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit redis.service has failed.
-- 
-- The result is failed.
```
发现原因：无法打开log file 因为没有权限访问，我们只需要把权限给这个文件就好了。
```
chown redis:redis /etc/redis.conf
```

再次启动redis
```
systemctl start redis
```

下面是服务器输入，然后OK。
```
[root@iZm5ehn5rqfkkytdj0n8enZ ~]# chown redis:redis /etc/redis.conf
[root@iZm5ehn5rqfkkytdj0n8enZ ~]# systemctl start redis
[root@iZm5ehn5rqfkkytdj0n8enZ ~]# service redis status
Redirecting to /bin/systemctl status redis.service
● redis.service - Redis persistent key-value database
   Loaded: loaded (/usr/lib/systemd/system/redis.service; enabled; vendor preset: disabled)
  Drop-In: /etc/systemd/system/redis.service.d
           └─limit.conf
   Active: active (running) since 日 2020-03-08 11:38:52 CST; 4s ago
  Process: 29464 ExecStop=/usr/libexec/redis-shutdown (code=exited, status=0/SUCCESS)
 Main PID: 29499 (redis-server)
   CGroup: /system.slice/redis.service
           └─29499 /usr/bin/redis-server *:6379

3月 08 11:38:52 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: Starting Redis persistent key-value database...
3月 08 11:38:52 iZm5ehn5rqfkkytdj0n8enZ systemd[1]: Started Redis persistent key-value database.
```