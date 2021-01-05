# [每日一题]面试官问：JS引擎的执行过程（二）
关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 12 题：[每日一题]面试官问：JS引擎的执行过程（二）

我们把这个分为2篇文章讲。

本篇讲：语法分析和预编译阶段。

下一篇讲：执行阶段。

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 11 题[[每日一题]面试官问：JS引擎的执行过程（一）](https://mp.weixin.qq.com/s/Lhd5N5a1b8fAstWn5H3B3Q)

+ 第 10 题[[每日一题]面试官问：详细说一下JS数据类型](https://mp.weixin.qq.com/s/wm0EGVXTTHoHMcdUxMQmKA)

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)



## 二、概述

js引擎执行过程主要分为三个阶段，分别是语法分析，预编译和执行阶段，上篇文章我们介绍了语法分析和预编译阶段，那么我们先做个简单概括，如下：

1、语法分析： 分别对加载完成的代码块进行语法检验，语法正确则进入预编译阶段；不正确则停止该代码块的执行，查找下一个代码块并进行加载，加载完成再次进入该代码块的语法分析阶段。

2、预编译：通过语法分析阶段后，进入预编译阶段，则创建变量对象（创建arguments对象（函数运行环境下），函数声明提前解析，变量声明提升），确定作用域链以及this指向。

如果对语法分析和预编译，还有疑问：javascript引擎执行的过程的理解--语法分析和预编译阶段（https://mp.weixin.qq.com/s/Lhd5N5a1b8fAstWn5H3B3Q）


本文主要分析js引擎执行的第三个阶段–执行阶段，在分析之前我们先思考以下两个问题：

1、js是单线程的，为了避免代码解析阻塞使用了异步执行，那么它的异步执行机制是怎么样的？

答：通过事件循环（Event Loop），理解了事件循环的原理就理解了js的异步执行机制，本文主要介绍。

2、js是单线程的，那么是否代表参与js执行过程的线程就只有一个？

答：不是的，会有四个线程参与该过程，但是永远只有JS引擎线程在执行JS脚本程序，其他的三个线程只协助，不参与代码解析与执行。参与js执行过程的线程分别是：

（1）JS引擎线程： 也称为JS内核，负责解析执行Javascript脚本程序的主线程（例如V8引擎）。

（2）事件触发线程： 归属于浏览器内核进程，不受JS引擎线程控制。主要用于控制事件（例如鼠标，键盘等事件），当该事件被触发时候，事件触发线程就会把该事件的处理函数推进事件队列，等待JS引擎线程执行。

（3）定时器触发线程：主要控制计时器setInterval和延时器setTimeout，用于定时器的计时，计时完毕，满足定时器的触发条件，则将定时器的处理函数推进事件队列中，等待JS引擎线程执行。

注：W3C在HTML标准中规定setTimeout低于4ms的时间间隔算为4ms。

（4）HTTP异步请求线程：通过XMLHttpRequest连接后，通过浏览器新开的一个线程，监控readyState状态变更时，如果设置了该状态的回调函数，则将该状态的处理函数推进事件队列中，等待JS引擎线程执行。

注：浏览器对同一域名请求的并发连接数是有限制的，Chrome和Firefox限制数为6个，ie8则为10个。

总结：永远只有JS引擎线程在执行JS脚本程序，其他三个线程只负责将满足触发条件的处理函数推进事件队列，等待JS引擎线程执行。


## 三、执行阶段

先分析一个典型的例子（来自Tasks, microtasks, queues and schedules，建议英文基础好的阅读，非常不错的文章）：

```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

直接划分例子的代码结构，简单描述分析执行过程；

暂不解释该过程中的概念和原理，概念和原理将会在下面具体讲解如下：

### 1、宏任务（macro-task）

宏任务（macro-task），宏任务又按执行顺序分为同步任务和异步任务

（1）同步任务

```
console.log('script start');
console.log('script end');
```

（2）异步任务

```
setTimeout(function() {
  console.log('setTimeout');
}, 0);
```

### 2、微任务（micro-task）

```
Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
```

在JS引擎执行过程中，进入执行阶段后，代码的执行顺序如下：

宏任务(同步任务) --> 微任务 --> 宏任务(异步任务)

输出结果：

```
script start
script end
promise1
promise2
setTimeout
```

进入ES6或Node环境中，JS的任务分为两种，分别是宏任务（macro-task）和微任务（micro-task），在最新的ECMAScript中，微任务称为jobs，宏任务称为task，他们的执行顺序如上。可能很多人对上面的分析并不理解，那么我们接下来继续对上面例子进行详细分析。



#### 2.1宏任务

宏任务（macro-task）可分为同步任务和异步任务：

1、同步任务指的是在JS引擎主线程上按顺序执行的任务，只有前一个任务执行完毕后，才能执行后一个任务，形成一个执行栈（函数调用栈）。

2、异步任务指的是不直接进入JS引擎主线程，而是满足触发条件时，相关的线程将该异步任务推进任务队列(task queue)，等待JS引擎主线程上的任务执行完毕，空闲时读取执行的任务，例如异步Ajax，DOM事件，setTimeout等。

理解宏任务中同步任务和异步任务的执行顺序，那么就相当于理解了JS异步执行机制–事件循环（Event Loop）。

##### 2.1.1事件循环

事件循环可以理解成由三部分组成，分别是：

1、主线程执行栈

2、异步任务等待触发

3、任务队列

任务队列(task queue)就是以队列的数据结构对事件任务进行管理，特点是先进先出，后进后出。



这里直接引用一张著名的图片(参考自Philip Roberts的演讲《Help, I’m stuck in an event-loop》)，帮助我们理解，如下：

![image](https://www.mwcxs.top/static/upload/pics/2019/1/302T7m1q_zH78gXviekTwJFXO0.png)


在JS引擎主线程执行过程中：

1、首先执行宏任务的同步任务，在主线程上形成一个执行栈，可理解为函数调用栈。

2、当执行栈中的函数调用到一些异步执行的API（例如异步Ajax，DOM事件，setTimeout等API），则会开启对应的线程（Http异步请求线程，事件触发线程和定时器触发线程）进行监控和控制。

3、当异步任务的事件满足触发条件时，对应的线程则会把该事件的处理函数推进任务队列(task queue)中，等待主线程读取执行。

4、当JS引擎主线程上的任务执行完毕，则会读取任务队列中的事件，将任务队列中的事件任务推进主线程中，按任务队列顺序执行

5、当JS引擎主线程上的任务执行完毕后，则会再次读取任务队列中的事件任务，如此循环，这就是事件循环（Event Loop）的过程。



如果还是不能理解，那么我们再次拿上面的例子进行详细分析，该例子中宏任务的代码部分是：

```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

console.log('script end');
```

代码执行过程如下：

1、JS引擎主线程按代码顺序执行，当执行到console.log('script start');，JS引擎主线程认为该任务是同步任务，所以立刻执行输出script start，然后继续向下执行。

2、JS引擎主线程执行到setTimeout(function() { console.log('setTimeout'); }, 0);，JS引擎主线程认为setTimeout是异步任务API，则向浏览器内核进程申请开启定时器线程进行计时和控制该setTimeout任务。由于W3C在HTML标准中规定setTimeout低于4ms的时间间隔算为4ms，那么当计时到4ms时，定时器线程就把该回调处理函数推进任务队列中等待主线程执行，然后JS引擎主线程继续向下执行。

3、JS引擎主线程执行到console.log('script end');，JS引擎主线程认为该任务是同步任务，所以立刻执行输出script end。

4、JS引擎主线程上的任务执行完毕（输出script start和script end）后，主线程空闲，则开始读取任务队列中的事件任务，将该任务队里的事件任务推进主线程中，按任务队列顺序执行，最终输出setTimeout，所以输出的结果顺序为script start script end setTimeout。     

以上便是JS引擎执行宏任务的整个过程。



理解该过程后，我们做一些拓展性的思考：

我们都知道setTimeout和setInterval是异步任务的定时器，需要添加到任务队列等待主线程执行，那么使用setTimeout模拟实现setInterval，会有区别吗？

答案是有区别的，我们不妨思考一下：

1、setTimeout实现setInterval只能通过递归调用。

2、setTimeout是在到了指定时间的时候就把事件推到任务队列中，只有当在任务队列中的setTimeout事件被主线程执行后，才会继续再次在到了指定时间的时候把事件推到任务队列，那么setTimeout的事件执行肯定比指定的时间要久，具体相差多少跟代码执行时间有关。

3、setInterval则是每次都精确的隔一段时间就向任务队列推入一个事件，无论上一个setInterval事件是否已经执行，所以有可能存在setInterval的事件任务累积，导致setInterval的代码重复连续执行多次，影响页面性能。

综合以上的分析，使用setTimeout实现计时功能是比setInterval性能更好的。当然如果不需要兼容低版本的IE浏览器，使用requestAnimationFrame是更好的选择。



我们继续再做进一步的思考，如下：

高频率触发的事件（例如滚动事件）触发频率过高会影响页面性能，甚至造成页面卡顿，我们是否可以利用计时器的原理进行优化呢？

是可以的，我们可以利用setTimeout实现计时器的原理，对高频触发的事件进行优化，实现点在于将多个触发事件合并成一个，这就是防抖和节流，本文先不做具体讲解，大家可以自行研究，有机会我再另开文章分析。



#### 2.2微任务

微任务是在es6和node环境中出现的一个任务类型，如果不考虑es6和node环境的话，我们只需要理解宏任务事件循环的执行过程就已经足够了，但是到了es6和node环境，我们就需要理解微任务的执行顺序了。微任务（micro-task）的API主要有:Promise， process.nextTick

这里我们直接引用一张流程图帮助我们理解，如下：

![image](https://www.mwcxs.top/static/upload/pics/2019/1/30as_YLbQ_GNfBH-15-dlOARpf.png)

在宏任务中执行的任务有两种，分别是同步任务和异步任务，因为异步任务会在满足触发条件时才会推进任务队列（task queue），然后等待主线程上的任务执行完毕，再读取任务队列中的任务事件，最后推进主线程执行，所以这里将异步任务即任务队列看作是新的宏任务。执行的过程如上图所示：

1、执行宏任务中同步任务，执行结束。

2、检查是否存在可执行的微任务，有的话执行所有微任务，然后读取任务队列的任务事件，推进主线程形成新的宏任务；没有的话则读取任务队列的任务事件，推进主线程形成新的宏任务。

3、执行新宏任务的事件任务，再检查是否存在可执行的微任务，如此不断的重复循环。

这就是加入微任务后的详细事件循环，如果还没有理解，那么们对一开始的例子做一个全面的分析，如下：


```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```
执行过程如下：

1、代码块通过语法分析和预编译后，进入执行阶段，当JS引擎主线程执行到console.log('script start');，JS引擎主线程认为该任务是同步任务，所以立刻执行输出script start，然后继续向下执行。

2、JS引擎主线程执行到setTimeout(function() { console.log('setTimeout'); }, 0);，JS引擎主线程认为setTimeout是异步任务API，则向浏览器内核进程申请开启定时器线程进行计时和控制该setTimeout任务。由于W3C在HTML标准中规定setTimeout低于4ms的时间间隔算为4ms，那么当计时到4ms时，定时器线程就把该回调处理函数推进任务队列中等待主线程执行，然后JS引擎主线程继续向下执行。

3、JS引擎主线程执行到Promise.resolve().then(function() { console.log('promise1'); }).then(function() { console.log('promise2'); });，JS引擎主线程认为Promise是一个微任务，这把该任务划分为微任务，等待执行。

4、JS引擎主线程执行到console.log('script end');，JS引擎主线程认为该任务是同步任务，所以立刻执行输出script end。

5、主线程上的宏任务执行完毕，则开始检测是否存在可执行的微任务，检测到一个Promise微任务，那么立刻执行，输出promise1和promise2

6、微任务执行完毕，主线程开始读取任务队列中的事件任务setTimeout，推入主线程形成新宏任务，然后在主线程中执行，输出setTimeout

最后输出结果：
```
script start
script end
promise1
promise2
setTimeout
```

## 四、总结

以上便是JS引擎执行的全部过程，JS引擎的执行过程其实并不复杂，只要多思考多研究就可以理解，理解该过程后可以在一定程度上提高对JS的认识。



## 五、参考文献

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)



## 六、参考

你不知道的javascript(上卷)


## 各种福利

#### 1、字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

#### 2、学习资料福利
回复「算法」获取算法学习资料

#### 3、每日一题

+ 第 11 题[[每日一题]面试官问：JS引擎的执行过程（一）](https://mp.weixin.qq.com/s/Lhd5N5a1b8fAstWn5H3B3Q)

+ 第 10 题[[每日一题]面试官问：详细说一下JS数据类型](https://mp.weixin.qq.com/s/wm0EGVXTTHoHMcdUxMQmKA)

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## 谢谢支持
1、喜欢的话可以「分享，点赞，在看」三连哦。

2、作者昵称：saucxs，songEagle，松宝写代码。字节跳动的一枚前端工程师，一个正在努力成长的作者，星辰大海，未来可期，**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，每日一道面试题，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)
