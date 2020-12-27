# 「每日一题」面试官问你对Promise的理解？可能是需要你能手动实现各个特性
关注公众号「松宝写代码」，精选好文，每日一题

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

>作者：saucxs ｜ songEagle

>来源：原创


## 一、前言

2020.12.23日刚立的flag，每日一题，题目类型不限制，可以是：算法题，面试题，阐述题等等。

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第2道[「[每日一题]ES6中为什么要使用Symbol？」(https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第1道[「一道面试题是如何引发深层次的灵魂拷问？」(https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

接下来是第3道：谈谈你对 promise 的理解？

## 二、谈谈你对 promise 的理解？

### 1、我们简单概括一下promise

Promise 是 ES6 新增的语法，解决了回调地狱的问题。

无论是ES6的Promise也好，jQuery的Promise也好，不同的库有不同的实现，但是大家遵循的都是同一套规范，所以，Promise并不指特定的某个实现，它是一种规范，是一套处理JavaScript异步的机制。

Promise 本质上就是一个绑定了回调的对象，而不是将回调传回函数内部。

所以，Promise在一定程度上解决了回调函数的书写结构问题，但回调函数依然在主流程上存在，只不过都放到了then(...)里面，和我们大脑顺序线性的思维逻辑还是有出入的。


### 2、我们说一下promise相关规范
+ 可以把 Promise 看成一个状态机。初始是 pending 状态，可以通过函数 resolve 和 reject ，将状态转变为 resolved 或者 rejected 状态，状态一旦改变就不能再次变化。

+ then 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 pending 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 then 调用就失去意义了。

+ then 方法可以被同一个 promise 调用多次。

+ 值穿透

## 三、promise 是如何实现的？

### 1、Promise的简单使用

![Promise的简单使用](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon.png)

我们通过这种使用构建Promise实现的最初版本

### 2、Promise的大致框架
大致框架有了，但是Promise状态，resolve函数，reject函数，以及then等回调没有详细处理

![Promise的大致框架](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_1.png)


### 3、Promise的链式存储

我们先看一个例子：

![Promise的链式存储](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_2.png)

每间隔1秒打印一个数字，哈哈，这个不是真实的间隔1秒，汪汪，

这个的输出是啥？

打印顺序：1、2、3

这里我们能确认的是：

+ 让a,b,c的只能在then的回调接收到
+ 在连续的异步调用中，如何保证异步函数的执行顺序

Promise一个常见的需求就是连续执行两个或者多个异步操作，这种情况下，每一个后来的操作都在前面的操作执行成功之后，带着上一步操作所返回的结果开始执行。这里用setTimeout来处理.

![Promise的链式存储](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_3.png)


### 4、Promise的状态机制和执行顺序
为了保证Promise的异步操作时的顺序执行，这里给Promise加上状态机制

![Promise的状态机制和执行顺序](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_4.png)


### 5、Promise的递归执行
每个Promise后面链接一个对象，该对象包含onresolved,onrejected,子promise三个属性.

当父Promise 状态改变完毕,执行完相应的onresolved/onrejected的时候，拿到子promise,在等待这个子promise状态改变，在执行相应的onresolved/onrejected。依次循环直到当前promise没有子promise。

![Promise的递归执行](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_5.png)


### 6、Promise的异常处理
每个Promise后面链接一个对象，该对象包含onresolved,onrejected,子promise三个属性.

当父Promise 状态改变完毕,执行完相应的onresolved/onrejected的时候，拿到子promise,在等待这个子promise状态改变，在执行相应的onresolved/onrejected。依次循环直到当前promise没有子promise。

![Promise的异常处理](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_6.png)

### 7、Promise的then的实现
then 方法是 Promise 的核心，这里做一下详细介绍。

```
promise.then(onFulfilled, onRejected)
```

一个 Promise 的then接受两个参数： onFulfilled和onRejected（都是可选参数，并且为函数，若不是函数将被忽略）

+ onFulfilled 特性：

当 Promise 执行结束后其必须被调用，其第一个参数为 promise 的终值，也就是 resolve 传过来的值
在 Promise 执行结束前不可被调用
其调用次数不可超过一次

+ onRejected 特性

当 Promise 被拒绝执行后其必须被调用，第一个参数为 Promise 的拒绝原因，也就是reject传过来的值
在 Promise 执行结束前不可被调用
其调用次数不可超过一次

+ 调用时机

onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用（平台代码指引擎、环境以及 promise 的实施代码）

+ 调用要求

onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值，在 严格模式（strict） 中，函数 this 的值为 undefined ；在非严格模式中其为全局对象。）

+ 多次调用

then 方法可以被同一个 promise 调用多次

当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调

+ 返回

then方法会返回一个Promise，关于这一点，Promise/A+标准并没有要求返回的这个Promise是一个新的对象，但在Promise/A标准中，明确规定了then要返回一个新的对象，目前的Promise实现中then几乎都是返回一个新的Promise(详情)对象，所以在我们的实现中，也让then返回一个新的Promise对象。

```
promise2 = promise1.then(onFulfilled, onRejected);
```

- 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
- 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
- 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
- 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的拒因

不论 promise1 被 reject 还是被 resolve ， promise2 都会被 resolve，只有出现异常时才会被 rejected。

每个Promise对象都可以在其上多次调用then方法，而每次调用then返回的Promise的状态取决于那一次调用then时传入参数的返回值，所以then不能返回this，因为then每次返回的Promise的结果都有可能不同。

![Promise的then的实现](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_7.png)


### 8、Promise的值穿透

![Promise的then的实现](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_8.png)

我们来看一下这个题的输出：

![Promise的then的实现](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_9.png)

最终打结果是1而不是2.

我们再来看一下这个题的输出：

![Promise的then的实现](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/promise/carbon_10.png)


## 各种福利
![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)

「松宝写代码」公众号：开发知识体系构建，技术分享，项目实战，实验室，每日一题，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。


### 1、字节内推福利

回复「校招」获取内推码

回复「社招」获取内推

回复「实习生」获取内推

后续会有更多福利


### 2、学习资料福利
回复「算法」获取算法学习资料

### 3、每日一题
+ 3、本文就是第3道：谈谈你对 promise 的理解？

+ 第2道[「[每日一题]ES6中为什么要使用Symbol？」(https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第1道[「一道面试题是如何引发深层次的灵魂拷问？」(https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## The End
如果你觉得这篇文章对你有帮助，有启发，可能帮助到更多的人，我想请你帮我几个小忙：

1、点个「在看」，让更多的人也能看到这篇文章内容。

2、点个「赞」，是对文章的肯定。

3、点个「分享」到朋友圈，是为了让更多的人知道你在学习提升自己。

4、关注「松宝写代码」，后台回复「加群」 加入我们一起学习。