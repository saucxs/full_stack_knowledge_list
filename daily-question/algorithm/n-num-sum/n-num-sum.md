# [每日一题]面试官问：N数之和

关注「松宝写代码」，精选好文，每日一题

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

>作者：saucxs ｜ songEagle


## 一、前言

2020.12.23 日刚立的 flag，每日一题，题目类型不限制，可以是：算法题，面试题，阐述题等等。

本文是「每日一题」第 10 题：[每日一题]面试官问：N数之和

这是一道编程题

描述如下：

请用算法实现，从给定的无需、不重复的数组A中，取出N个数，使其相加和为M。输出所有的组合情况，并给出算法的时间、空间复杂度.

举个例子；

var arr = [1, 4, 7, 11, 9, 8, 10, 6];
N = 3;
M = 27;


输出:
[7, 11, 9], [11, 10, 6], [9, 8, 10]


![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)
