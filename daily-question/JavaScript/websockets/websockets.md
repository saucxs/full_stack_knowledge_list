# 【每日一题】(20题)面试官问：谈谈JS中的 webSockets 的理解？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 20 题：【每日一题】面试官问：谈谈JS中的 webSockets 的理解？

这是一道很宽泛的题目，如何回答更有亮点？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)


## 三、Web Sockets封装案例

Web Sockets封装案例:

这个是Event代码：

![Web Sockets封装案例的Event](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/websockets/carbon_1.png)

这个是实现代码：

![Web Sockets封装案例的Index](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/websockets/carbon.png)

Web Sockets的目标：在一个单独的持续连接上提供全双工、双向通信

Web Sockets使用自定义的协议，与http一样，是应用层的协议

好处是：
- 能够在客户端、服务端发送非常少量的数据，不必担心`HTTP字节级`的开销
- 传递数据包小，更适用于移动端，对于移动端，带宽和网络延迟是一个关键问题

`坏处是：制定协议的时间比制定JS API的时间都长`

与HTTP的不同之处：
- http只能由客户端发起，而webSocket是双向的
- webSocket传输的数据包相对于http而言很小，很适合移动端使用
- 没有同源限制，可以跨域共享资源

支持的浏览器：Firfox6+ Safari5+ Chrome IOS 4+版本的Safari

## 四、WebSockets使用
1、创建WebSockets实例
```
var ws = new WebSockets('ws://example.com')
```
需要注意的是：
- URL的模式：`ws://`，加密情况下为：`wss://`
- 必须是绝对URL，也就是完整的URL

2、创建实例后，会立即尝试连接，与XMLHttpRequest类似，存在一个readyState属性表示当前状态。
- WebSocket.OPENING(0) 正在建立连接
- WebSocket.OPEN(1) 已经建立连接
- WebSocket.CLOSEING(2) 正在关闭连接
- WebSocket.CLOSE(3) 已经关闭连接

3、发送数据与接收数据
使用send()方法发送数据，接收到的数据时会触发message事件
```
ws.send('hello')
ws.onmessage = function (event) {
  console.log(event.data)
}
```
注意：
- send发送数据时，数据必须是纯文本的格式
- message返回的数据也是字符串的格式
- WebSocket对象不支持DOM2级事件侦听器，必须使用DOM0级 对每个事件分别处理

其他事件
- open 成功建立连接时触发
- error 发生错误时触发，连接不能继续
- close 连接关闭时触发，只要close的event对象有格外的信息
  - wasClean 是否明确关闭
  - code 服务器返回的数值状态码
  - reason 字符串，包含服务端返回的信息


## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)


## 字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

## 学习资料福利
回复「算法」获取算法学习资料

## 往期「每日一题」

### 1、JavaScript && ES6

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

### 4、算法

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 5、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

