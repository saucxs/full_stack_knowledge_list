# 【每日一题】(23题)面试官问：详细描述事件循环Event Loop？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是：【每日一题】(23题)面试官问：详细描述事件循环Event Loop？

这个时候并没有说是node的事件循环还是浏览器的事件循环，这个需要跟面试官确认一下，大多数是需要回答顺序：
+ 浏览器事件循环
+ Node事件循环
+ 一道输出值面试题

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)


## 二、浏览器的事件循环
### 1、宏任务（Macro-Task）队列和微任务（Micro-Task）队列
浏览器事件循环中的异步队列有两种：macro（宏任务）队列和micro（微任务）队列。宏任务队列可以是多个，微任务队列只有一个。

+ 常见的macro-task：script代码块，setTimeout，setInterval，setImmediate，requestAnimationFrame，I/O操作，UI rendering渲染页面等。
+ 常见的micro-task：process.nextTick，MutationObserver监听（h5新特性），Promise.then，async/await，ajax，axios，catch finally，Object.observe(方法废弃)等。

### 2、详细过程：
+ 1、浏览器按照js的顺序加载script标签分隔的代码块。
+ 2、script代码块加载完毕，首先进行语法分析，一旦语法错误，就会跳出当前的script代码块。
+ 3、语法分析正确之后，立即进行预编译阶段。
+ 4、预编译阶段：1、创建变量对象（创建arguments对象，函数声明提前，变量声明提升）；2、确定作用域链；3、this指向。
+ 5、然后进入执行阶段。
+ 6、当前执行栈为空，执行栈是一个函数调用的栈结构，先进后出的原则。微任务队列为空。宏任务队列只有一个script代码块。
+ 7、全局上下文被推入执行栈，同步代码执行。执行过程中，会判断同步还是异步，通过一些接口调用和定时器，I/O等，产生新的宏任务和微任务，然后分别推进各自的任务队列中。
同步代码执行完了，script代码块会被移出宏任务队列。这个过程就是队列的宏任务的执行和出队列过程。
+ 8、上一个出队是一个宏任务，这一步我们开始处理微任务。注意点：宏任务出队时，任务是**一个一个**执行，而微任务出队，任务是一队一队的执行。因此，我们开始处理微任务队列，会逐个执行队列中的任务，知道微任务队列被清空。
+ 9、执行渲染操作，更新页面。
+ 10、检查是否有web worker任务，如果有，对其处理。
+ 11、重复执行6--10过程，直到两个队列都被清空。
+ 12、重复执行1--11过程，直到所有代码块执行完毕。


## 三、Node的事件循环
### 1、简介
Node的事件循环和浏览器的事件循环是完全不同的东西。Node是采用v8作为js的解析引擎，而I/O处理也是使用自己设计的libuv库。
libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统的一些底层特性，对外提供统一的接口API，事件循环机制也是libuv里面的实现。

![node的运行机制](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/node的EventLoop.png?raw=true)

Node的运行机制：
+ V8引擎解析JavaScript脚本。
+ 解析代码后，调用Node API。
+ libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务结果返回给V8引擎。
+ V8引擎再将结果返回给用户。

### 2、过程六个阶段
事件循环分为6个阶段，会按照顺序反复运行。每进入到某一个阶段，都会从对应的回调队列中取出函数去执行。
当队列为空或者执行的回调函数数量达到系统设定的阈值，就会进入到下一阶段。

![Event Loop的6个阶段](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/EventLoop的6个阶段.png?raw=true)

#### （1）node事件循环的顺序：

+ 外部输入数据 --》轮询阶段（poll）--》检查阶段（check）--》关闭事件回调阶段（close callback）--》定时器检测阶段（timers）--》I/O事件回调阶段（I/O callbacks）--》闲置阶段（idle，prepare）--》轮询阶段（按照顺序反复运行）

说明：
+ timers阶段：这个阶段执行timer（setTimeout，setInterval等）回调。
+ I/O callbacks阶段：处理一些上一轮循环中的少数未执行的I/O回调。
+ idle，prepare阶段： 仅node内部使用。
+ poll阶段：获取新的I/O事件，适当条件下node将阻塞在这里。
+ check阶段：执行setImmediate()的回调。
+ close callbacks阶段：执行socket的close事件回调。

注意：6个阶段不包括process.nextTick()

日常开发中，主要是timers阶段，poll阶段，check阶段包含了绝大部分异步任务。

#### （2）定时器检测阶段-timers阶段

timers阶段会执行setTimeout和setInterval回调，并且由轮询poll阶段控制。同样，在Node中定时器指定的时间也不是准确时间，只能尽快执行。

#### （3）轮询阶段--poll阶段

轮询poll阶段是一个重要阶段，主要做两件事情：

+ 1、回到timers阶段执行回调
+ 2、执行I/O回调

进入到这个阶段如果没有设定timer的话，会做个判断：

+ 1、如果poll队列不为空，会遍历回调队列并同步执行，知道队列为空或者达到系统限制。
+ 2、如果队列为空，会做个判断：
    + 如果有setImmediate回调需要执行，poll阶段会停止并且进入到check阶段执行回调。
    + 如果没有setImmediate回调，会等待回调被加入到队列中并立即执行回调，这里会有个超时时间设置防止一直等待下去

当然设定了timer，并且poll队列为空，会判断是否有timer超时，如果有的话回到timer阶段执行回调。

#### （4）检查阶段--check阶段
setImmediate的回调会被加到check队列中，从EventLoop阶段图知道，check阶段的执行顺序是在poll阶段之后。

我们看个栗子，更容易让我们理解：
```js
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
// start, 
// end, 
// promise3,  
// timer1,  
// timer2,  
// promise1,  
// promise2 
```
分析：
+ 1、一开始执行栈的同步任务（宏任务），执行完毕后，依次打出 start和end，并将2个timer依次放入timers队列。
+ 2、然后去执行微任务（和浏览器有点像），打印出promise3。
+ 3、然后进入到timers阶段，执行timer1的回调函数，打印timer1，并将promise.then回调放入微任务队列，同样的步骤执行timer2，打印timer2。(这个和浏览器差别最大的地方)，**timers阶段**有几个setTimeout/setInterval都会依次执行，并不像浏览器端，没执行一个宏任务后就去执行一个微任务队列。


### 3、node的微任务和宏任务

Node端事件循环中的异步队列也是这两种：macro（宏任务）队列和 micro（微任务）队列。
+ 1、常见的 macro-task 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等。
+ 2、常见的 micro-task 比如: process.nextTick、new Promise().then(回调)等。

### 4、注意点
#### （1）setTimeout和setImmediate
二者比较相似，区别：调用的时机不同。
+ 1、setImmediate：设计在poll阶段完成时执行，也就是在check阶段执行。
+ 2、setTimeout：设计在poll阶段空闲的时候，设定的时间达到后执行，也就是在timer阶段执行。

```js
setTimeout(function timeout () {
    console.log('timeout');
},0);
setImmediate(function immediate () {
    console.log('immediate');
});
```
分析上述代码：
+ 执行之后，发现：setTimeout可能执行在前，也有可能执行在后。
+ 源码中，setTimeout(fn, 0) === setTimeout(fn, 1)，进入事件循环也是需要成本的，如果在准备时候花费大于1ms，timer阶段就会直接执行setTimeout回调。
+ 如果准备时间花费小于1ms，那么就setImmediate回调先执行。

但是如果两者在异步I/O callback内部调用，总是先执行setImmediate，再执行setTimeout。
```js
const fs = require('fs')
fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate');
    })
})
// immediate
// timeout
```


#### （2）process.nextTick
process.nextTick这个函数其实是独立于Event Loop之外的，有自己的队列。当每个阶段完成后，如果存在nextTick队列，就会清空队列中的所有回调函数，并且优先于其他microtask执行。
```js
Promise.resolve().then(function() {
    console.log('promise0')
})

setTimeout(() => {
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 100)

process.nextTick(() => {
    console.log('nextTick')
    process.nextTick(() => {
        console.log('nextTick')
        process.nextTick(() => {
            console.log('nextTick')
            process.nextTick(() => {
                console.log('nextTick')
            })
        })
    })
})

setTimeout(() => {
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 1)

Promise.resolve().then(function() {
    console.log('promise3')
})


//  nextTick
//  nextTick
//  nextTick
//  nextTick
//  promise0
//  promise3
//  timer2
//  promise2
//  timer1
//  promise1
```


Node的事件循环与浏览器差异
+ 浏览器的Event loop是在HTML5中定义的规范，而node中则由libuv库实现。
+ 浏览器环境中，微任务的任务队列是在每一个宏任务执行完成之后执行。node中，微任务会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行微任务队列的任务。

![node与浏览器的事件循环的差异](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/浏览器的EventLoop与Node的EventLoop.png?raw=true)

我们看一个栗子，来说明两者区别：
```js
setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

#### 1、浏览器端运行情况
输出：
```js
// timer1
// promise1
// timer2
// promise2
```
浏览器端处理过程

![浏览器处理过程](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/brower_eventloop.gif?raw=true)


#### 2、Node端运行情况
node端运行需要分为两种情况：
+ 如果node11版本及之后，一旦执行一个阶段里的宏任务(setTimeout,setInterval,setImmediate)就会立刻执行微任务队列，跟浏览器端运行一致。最后结果：
```js
// timer1
// promise1
// timer2
// promise2
```
+ 如果是node10及之前版本，要看第一个定时器执行完，第二定时器是否在完成队列中。
    - 如果第二个计时器未在完成队列中，结果为：
    ```js
    // timer1
    // promise1
    // timer2
    // promise2
    ```
     - 如果第二个计时器已经在完成队列中，结果为：
      ```js
         // timer1
         // timer2
         // promise1
         // promise2
      ```

我们来分析一下第二个计时器不在任务队列中的情况：

1、全局脚本main执行，将2个timer依次放入timer队列，main执行完后，调用栈为空闲，任务队列开始执行。

2、首先会进入timers阶段，执行timer1的回调函数，打印timer1，并将promsie1.then回调放入微任务队列。
同样的步骤执行timer2，打印timer2。

3、至此，timer阶段执行结束，EventLoop进入下一阶段之前，执行微任务队列的所有任务，依次打印promise1，promise2。

node端处理过程：

![NODE端处理过程](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/node的事件循环过程.gif)


## 五、一道输出值面试题
看个栗子

浏览器端和node端执行输出：
```js
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```
输出：1,7,6,8,2,4,3,5,9,11,10,12

一共三轮事件循环：

**第一轮**：

宏任务：输出1；new Promise同步任务，输出7。

微任务队列中：process.nextTick属于微任务，输出6；然后输出8。

第一轮结束，输出1,7,6,8

**第二轮**：

宏任务：输出2；new Promise同步任务，输出4。

微任务队列中：process.nextTick属于微任务，输出3；然后输出5。

**第三轮**：

宏任务：输出9；new Promise同步任务，输出11。

微任务队列中：process.nextTick属于微任务，输出10；然后输出12。

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

### 4、算法

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 5、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

