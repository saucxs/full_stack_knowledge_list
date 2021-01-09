# 【每日一题】(19题)面试官问：谈谈JS中的 XMLHttpRequest 对象的理解？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！


## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 19 题：【每日一题】面试官问：谈谈JS中的 XMLHttpRequest 对象的理解？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

## 二、该如何回答？
`Ajax`的核心是`XMLHttpRequest`对象

使用`XMLHttpRequest`对象要注意一个兼容性问题，`XMLHttpRequest`对象只支持IE7及以上版本。

- XMLHttpRequest对象的使用
- XMLHttpRequest对象使用的一些注意事项
- XMLHttpRequest对象 2级

### XMLHttpRequest对象的使用

1、创建XMLHttpRequest对象实例
```
var xhr = new XMLHttpRequest()
```
2、使用open()方法启动一个请求以备发送
```
xhr.open('get', 'example.php', false)
```
- 第一个参数是请求类型
- 第二个参数是请求的URL
- 第三个参数是是否为异步请求
3、使用send()方法将请求划分到服务器
```
xhr.send(null)
```
- 参数为请求主体发送的数据，为必填项，当不需要发送数据时，使用null

4、收到响应后，响应的数据会自动填充XMLHttpRequest对象的属性，相关属性如下：
- responseText 作为响应主体会返回的文本
- responseXML 如果响应内容类型为'text/xml'或者'application/xml'，则该属性保存包含响应数据的XML DOM文档
- status 响应的HTTP状态
- statusText HTTP状态说明

5、在多数情况下，请求为异步的，可检测XMLHttpRequest对象的`readystate`属性来判断当前阶段：
- 0 表示未初始化，尚未调用open()方法
- 1 启动，已经调用open()方法，还未调用send()
- 2 发送，已经调用send()方法，但未收到响应
- 3 接收，收到部分响应
- 4 完成，已经收到全部的响应数据，且可以在客户端使用了

可使用`onreadyStateChange`事件监听状态变化，注意为保证兼容性，要在open方法之前使用。

6、`abort()`方法，可以在接收到响应之前，取消异步请求。调用这个方法后，XMLHttpRequest对象会停止触发事件，且不再允许访问任何与响应有关的对象属性。

7、设置自定义请求头，可使用`setRequestHeader()`方法实现，方法要写在open()方法后，send()方法之前才可以。
8、获取响应头的信息
- getResponseHeader() 参数为头部字段的名称，可获取指定头部字段的值
- getAllResponseHeaders() 获取一个包含所有头部信息的长字符串

完整的示例如下：
```
var xhr = new XMLHttpRequest()
xhr.onreadyStateChange = function () {
  if (xhr.readystate === 4) {
    if (xhr.status === 304 || (xhr.status >= 200 && xhr.status < 300)) {
      console.log('type: success, result: ', xhr.responseText)
    } else {
      console.log('type: error, errCode:', xhr.status)
    }
  }
}
xhr.open('get', 'example.php', true)
xhr.·setRequestHeader('testHeader', 'testHeaderVal')
xhr.send(null)
```

### XMLHttpRequest对象使用的一些注意事项
#### get方法
需要注意URL后面参数的名称和值都必须经过encodeURIComponent才可以

#### post方法
如果需要发送整个表单数据，需要设定content-type，并借助serialize()函数来实现

如：
```
var xhr = new XMLHttpRequest()
xhr.onreadyStateChange = function () {
  if (xhr.readystate === 4) {
    if (xhr.status === 304 || (xhr.status >= 200 && xhr.status < 300)) {
      console.log('type: success, result: ', xhr.responseText)
    } else {
      console.log('type: error, errCode:', xhr.status)
    }
  }
}
xhr.open('post', 'example.php', true)
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencolde')
var form = document.getElementById('form')
xhr.send(serialize(form))
```

### XMLHttpRequest对象 2级
#### FormData类型
- 为序列化表单以及创建与表格格式相同的数据提供便利
- 不需要再设置请求头的信息，也不需要再借助serialize()函数
- 支持的浏览器：Firfox4+ Safari5+ Chrome ANdroid3+版本的WebKit

如上post的例子，可以修改为：
```
var xhr = new XMLHttpRequest()
xhr.onreadyStateChange = function () {
  if (xhr.readystate === 4) {
    if (xhr.status === 304 || (xhr.status >= 200 && xhr.status < 300)) {
      console.log('type: success, result: ', xhr.responseText)
    } else {
      console.log('type: error, errCode:', xhr.status)
    }
  }
}
xhr.open('post', 'example.php', true)
var form = document.getElementById('form')
xhr.send(new FormData(form))
```

#### 增加timeout超时属性
- 设定请求在等待响应多少毫秒后终止，IE8及之后版本增加了该属性。
- 同时提供ontimeout的监听函数，当规定时间内未完成响应时，触发该事件。

如上post的例子，可以修改为：
```
var xhr = new XMLHttpRequest()
xhr.onreadyStateChange = function () {
  if (xhr.readystate === 4) {
    try {
      if (xhr.status === 304 || (xhr.status >= 200 && xhr.status < 300)) {
        console.log('type: success, result: ', xhr.responseText)
      } else {
        console.log('type: error, errCode:', xhr.status)
      }
    } catch () {
      console,log('增加异常捕获')
    }
  }
}
xhr.open('post', 'example.php', true)
xhr.timeout = 1000
xhr.ontimeout = function () {
  console.log('超时处理')
}
var form = document.getElementById('form')
xhr.send(new FormData(form))
```

#### 在send()方法之前，open()方法使用overrideMinmeType()方法，可以重写响应的MIME类型
#### 增加进度事件
- loadstart 接收到响应的第一个字节时触发
- progress 接收响应期间持续不断的触发
- error 请求发生错误时触发
- abort 调用abort方法而终止连接时触发
- load 接收到完整响应数据时触发
- loadend 通讯完成或者在load\abort\error后触发

注意：
- 每个请求都从触发loadstart开始，各个事件的监听写在open()方法之前
- 支持前5个事件的浏览器：Firfox3.5+ Safari4+ Chrome ANdroid版本的WebKit IOS版本的Safari
- Opera11+ IE8+ 只支持load
- 目前没有浏览器支持loadend事件
- 使用load事件时，仍然要检测status属性，才能确保数据是否真的可用
- 使用progress事件时，event对象会增加三个额外的属性： 进度信息是否可用 `lengthComputable`，接收到的字节数 `position` ，根据Content-Length响应头确定的预计字节数 `totalSize`


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