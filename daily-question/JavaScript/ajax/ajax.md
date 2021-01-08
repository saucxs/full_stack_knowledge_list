# 【每日一题】(18题)面试官问：JS中的 Ajax 跨域与扩展Comet？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！


## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 18 题：【每日一题】面试官问：JS中的 Ajax 跨域与扩展 Comet ？

这是一道很宽泛的题目，如何回答更有亮点？

昨天的题目号码写错了，在这里做个说明。

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)


## Ajax的核心
`Ajax`的核心是`XMLHttpRequest`对象

- XMLHttpRequest对象，后边我们可以讲一下这个对象
- 跨域资源共享问题
- Ajax的扩展Comet
- SSE
- 与服务器进行全双工、双向通讯的信道---Web Sockets

### 跨域资源共享问题
通过XMLHttpRequest实现Ajax通讯有一个主要限制，来源于跨域安全策略。默认情况下，只能访问同一个域中的资源。

#### 方案一 CORS 跨源资源共享
是W3C的一个工作草案，定一个在比如访问跨源资源时，服务器与浏览器如何沟通

基本思想：使用自定义HTTP头，让浏览器与服务器进行沟通，从而决定请求或响应是否应该成功。

下面是一段兼容浏览器的CORS代码，支持IE10+
```
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest()
  if ('withCredentials' in xhr) { // Firfox3.5+ Safari4+ Chrome IE10+
    xhr.open(method, url, true)
  } else if (typeof xDomainRequest !== 'undefined') { // IE8
    xhr = new xDomainRequest()
    xhr.open(method, url)
  } else {
    return null
  }
  return xhr
}
```

#### 方案二 图片
如：
```
var img = new Image()
img.onload = img.onerror = function () {
  console.log('Done')
}
img.src = 'http://example.com?name=test'
```

缺点：
- 只能是get请求
- 单向通信，不能访问服务器的响应文本
- 容易被浏览器缓存

#### 方案三 JSONP
(JSON width padding) (填充式JSON、参数式JSON)，与JSON类似，是被包含在函数调用中的JSON，目前很少会用了。

由两部分组成，毁掉函数和数据，需要借助script标签实现，如：
```
function handleResponse (res) {
  console.log(res)
}
var script = document.createElement('script')
script.src = 'http://example.com?callback=handleResponse'
document.body.insertBefore(script, document.body.firstChild)
```

- 与图片方式相比较，优点是可以获取响应数据
- 缺点1：是在其他域中执行，有可能加带恶意代码
- 缺点2：确定JSONP是否失败困难，可使用window.onerror方法，但需要注意兼容性问题
- 缺点3：只能发送get请求

#### 方案四 Web Sockets
我们后边再讲

### Ajax的扩展Comet
Ajax是一种从页面向服务器请求数据的技术，Comet是一种服务器向页面推送数据的技术，能够让信息近乎实时的被推送到页面上。

实现Comet方式：`长轮询`，`流`
#### 长轮询
类似与短轮询的翻版。页面发起一个到服务器的请求，然后服务器一直保持连接打开，知道有数据可以发送。发送完数据之后，浏览器关闭连接，之后又发送一个到服务器的新的请求。这个持续的过程就是长轮询。

无论是短轮询还是长轮询，都要先发起对浏览器的连接。两者最大的区别是服务器如何发送数据。短轮询是服务器立即响应，而长轮询则是等待发送响应。

轮询的优势是所有的浏览器都可以实现，使用XHR与setTimeout()就可以实现

#### HTTP流
与轮询不同，整个过程只是用一个HTTP连接。浏览器向服务器发送一个请求，而服务器保持连接代开，然后周期性的向浏览器发送数据。实际上就是后端进行轮询。

在Firfox Safari Chrome Opera中，可以通过监听readyStateChange事件并检测readyState的值是否为3，就可以实现HTTP流。
- 当readyState为3时，说明收到新的数据，但是仍未结束，此时可以记录上一次的位置，来获取最新的数据。
- 当readyState为4时，表示结束

如：
```
function createStreamingClient(url, progress, finished) {
  var xhr = new XMLHttpRequest(), received = 0
  xhr.open('get', url, true)
  xhr.onreadyStateChange = function () {
    var result;
    if (xhr.readyState === 3) {
      result = xhr.responseText.substring(received)
      received += result.length
      progress(result)
    } else if (xhr.readyState === 4) {
      finished(xhr.responseText)
    }
  }
  return xhr
}

var client = createStreamingClient('example.php', function(data){
  console.log('progress', data)
}, function(data){
  console.log('Done', data)
})
```

### SSE(Server-Sent Events 服务器发送事件)
SSE API用于创建到服务器的单向连接，服务器通过这个连接可以发送任意数量的数据。支持短轮询、长轮询、HTTP流。

服务器响应的MIME必须是`text/event-stram`

#### 使用
1、创建新的EventSource对象
```
var source = new EventSource('example.php')
```
EventSource实例有一个readyState属性：
- 0 正在连接服务器
- 1 连接打开
- 2 连接关闭

提供三个事件
- open 在建立连接时触发
- message 在接触到新事件时触发，存在event对象，返回的数据以文本的形式存在event.data中
- error无法建立连接时触发

如：
```
source.onmessage = function (event) {
  console.log(event.data)
}
```

当断开连接时，会自动重新连接。

使用`close()` 可以立即断开连接且不能重新连接

## 谢谢支持

1、喜欢的话**可以「分享，点赞，在看」三连**哦。

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