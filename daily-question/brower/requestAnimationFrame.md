# [每日一题]requestAnimationFrame不香吗？

关注「松宝写代码」，精选好文，每日一题

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

>作者：saucxs ｜ songEagle


## 一、前言

2020.12.23 日刚立的 flag，每日一题，题目类型不限制，可以是：算法题，面试题，阐述题等等。

本文是「每日一题」第 9 题：[每日一题]面试官问：谈谈你对requestAnimationFrame的理解

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

## 二、简介一下
在JS中，我们可以使用 setTimeout 和 setIntarval 实现动画，但是 H5 的出现，让我们又多了两种实现动画的方式，分别是 CSS 动画（transition、animation）和 H5的canvas 实现。

除此以外，H5还提供了一个专门用于请求动画的API，让 DOM 动画、canvas动画、svg动画、webGL动画等有一个专门的刷新机制。

## 三、requestAnimationFrame是什么？
requestAnimationFrame 方法会告诉**浏览器希望执行动画并请求浏览器在下一次重绘之前调用回调函数来更新动画**。

```
window.requestAnimationFrame(callback)
```

+ callback：下一次重绘之前更新动画帧所调用的函数，callback仅有一个参数，为DOMHighResTimeStamp参数，表示requestAnimationFrame()开始执行回调函数的时刻。
+ 返回值：一个 long 类型整数，唯一标志元组在列表中的位置，你可以传这个值给cancelAnimationFrame() 以取消动画。

在使用和实现上， requestAnimationFrame 与 setTimeout 类似。我们看个例子：

```
let count = 0;
let rafId = null;
// requestAnimationFrame 调用该函数时，自动传入的一个时间
function requestAnimation(time) {
  console.log(time); // 打印执行requestAnimation函数的时刻
  // 动画没有执行完，则递归渲染
  if (count < 10) {
    count++;
    // 渲染下一帧
    rafId = window.requestAnimationFrame(requestAnimation);
  }
}
// 渲染第一帧
window.requestAnimationFrame(requestAnimation);
```

## 四、requestAnimationFrame怎么执行的？
+ 1、首先判断 document.hidden 属性是否可见（true），可见状态下才能继续执行以下步骤

+ 2、浏览器清空上一轮的动画函数

+ 3、requestAnimationFrame 将回调函数追加到动画帧请求回调函数列表的末尾

我们需要注意的是：当执行 requestAnimationFrame(callback)的时候，不会立即调用 callback 回调函数，只是将其放入回调函数队列而已，同时注意，每个 callback回调函数都有一个 cancelled 标志符，初始值为 false，并对外不可见。

+ 4、当页面可见并且动画帧请求callback回调函数列表不为空时，浏览器会定期将这些回调函数加入到浏览器 UI 线程的队列中（由系统来决定回调函数的执行时机）。当浏览器执行这些 callback 回调函数的时候，会判断每个元组的 callback 的cancelled标志符，只有 cancelled 为 false 时，才执行callback回调函数。

## 五、requestAnimationFrame优点有啥？

+ 1、requestAnimationFrame 自带函数节流功能，采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间的过短，造成过度绘制，增加页面开销，也不会因为间隔时间过长，造成动画卡顿，不流程，影响页面美观。

  - 浏览器的重绘频率一般会和显示器的刷新率保持同步。大多数采用 W3C规范，浏览器的渲染页面的标准频率也为 60 FPS（frames/per second）即每秒重绘60次，requestAnimationFrame的基本思想是 让页面重绘的频率和刷新频率保持同步，即每 1000ms / 60 = 16.7ms执行一次。

  - 通过 requestAnimationFrame 调用回调函数引起的页面重绘或回流的时间间隔和显示器的刷新时间间隔相同。所以 requestAnimationFrame 不需要像 setTimeout 那样传递时间间隔，而是浏览器通过系统获取并使用显示器刷新频率。例如在某些高频事件（resize，scroll 等）中，使用 requestAnimationFrame 可以防止在一个刷新间隔内发生多次函数执行，这样保证了流程度，也节省了开销

+ 2、该函数的延时效果是精确的，没有setTimeout或setInterval不准的情况（JS是单线程的，setTimeout 任务被放进异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列的任务是否需要开始执行，造成时间延时）。

  - setTimeout的执行只是在内存中对图像属性进行改变，这个改变必须要等到下次浏览器重绘时才会被更新到屏幕上。如果和屏幕刷新步调不一致，就可能导致中间某些帧的操作被跨越过去，直接更新下下一帧的图像。即 掉帧

  - 使用 requestAnimationFrame 执行动画，最大优势是能保证回调函数在屏幕每一次刷新间隔中只被执行一次，这样就不会引起丢帧，动画也就不会卡顿

+ 3、节省资源，节省开销

  - 在之前介绍requestAnimationFrame执行过程，我们知道只有当页面激活的状态下，页面刷新任务才会开始，才执行 requestAnimationFrame，当页面隐藏或最小化时，会被暂停，页面显示，会继续执行。节省了 CPU 开销。

  - 注意：当页面被隐藏或最小化时，定时器setTimeout仍在后台执行动画任务，此时刷新动画是完全没有意义的（实际上 FireFox/Chrome 浏览器对定时器做了优化：页面闲置时，如果时间间隔小于 1000ms，则停止定时器，与requestAnimationFrame行为类似。如果时间间隔>=1000ms，定时器依然在后台执行）

```
// 在浏览器开发者工具的Console页执行下面代码。
// 当开始输出count后，切换浏览器tab页，再切换回来，可以发现打印的值从离开前的值继续输出
let count = 0;
function requestAnimation() {
    if (count < 150) {
        count++;
        console.log(count);
        requestAnimationFrame(requestAnimation);
    }
}
requestAnimationFrame(requestAnimation);
```

+ 4、能够在动画流刷新之后执行，即上一个动画流会完整执行


## 六、requestAnimationFrame实现setInterval及 setTimeout？
这个问题就比较容易考察到，我们可以使用 requestAnimationFrame 实现setInterval及 setTimeout。

下面是 setInterval 实现

```
// setInterval实现
function setInterval(callback, interval) {
    let timer
    const now = Date.now
    let startTime = now()
    let endTime = startTime
    const loop = () => {
        timer = window.requestAnimationFrame(loop)
        endTime = now()
        if (endTime - startTime >= interval) {
            startTime = endTime = now()
            callback(timer)
        }
    }
    timer = window.requestAnimationFrame(loop)
    return timer
}

let a = 0
setInterval(timer => {
    console.log(a)
    a++
    if (a === 3) window.cancelAnimationFrame(timer)
}, 1000)
// 0
// 1
// 2
```


下面是 setTimeout 实现：
```
// setTimeout 实现
function setTimeout(callback, interval) {
    let timer
    const now = Date.now
    let startTime = now()
    let endTime = startTime
    const loop = () => {
        timer = window.requestAnimationFrame(loop)
        endTime = now()
        if (endTime - startTime >= interval) {
            callback(timer)
            window.cancelAnimationFrame(timer)
        }
    }
    timer = window.requestAnimationFrame(loop)
    return timer
}

let a = 0
setTimeout(timer => {
    console.log(a)
    a++
}, 1000)
// 0
```


## 各种福利

#### 1、字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

#### 2、学习资料福利
回复「算法」获取算法学习资料

#### 3、每日一题
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

2、作者昵称：saucxs，songEagle，松宝写代码。字节跳动的一枚前端工程师，一个正在努力学习成长的作者，星辰大海，未来可期，**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，每日一道面试题，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)
