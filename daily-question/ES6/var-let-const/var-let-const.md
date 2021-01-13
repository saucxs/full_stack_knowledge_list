# 【每日一题】(22题)面试官问：var与const,let的主要区别是什么？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是：【每日一题】(22题)面试官问：`var`与`const` `let`的主要区别是什么？

这是一道很宽泛的题目，如何回答更有亮点？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

## 二、主要区别

我们先来看一下脑图，提纲挈领：

![主要区别](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/ES6/var-let-const/let.jpg)

所有变量声明的方式：
- 最常见变量声明：`var`、` function`；
- `全局变量`，如 a=2, 若未声明变量a, 则会直接创建在全局变量中；
- 在创建函数时，会默认声明`函数参数`；
- ES6中新增的声明方式：`let`、`const`、`import`、`calss`。

### `var`与`const` `let`的主要区别

#### 1、变量提升问题
- `var`声明的变量存在变量提升
- `let`与`const`声明的变量不存在变量提升，但存在`暂时性死区`

在预编译阶段，JavaScript引擎扫描代码时，遇到变量声明，会把`var`声明提到作用域的顶端，而`let` `const`声明，则会被放在`暂时性死区`中。

访问暂时性死区中的变量，会触发运行时错误，只有执行变量声明语句后，变量才会从暂时性死区中移除，才可正常访问。

#### 2、重复定义问题
- `var`声明的变量可以重复定义
- `let`与`const`声明的变量在`同一作用域`下不可重复声明

#### 3、全局变量问题
- `var`声明的变量可能会覆盖全局变量
- `let`与`const`声明的变量只可能会遮蔽全局变量，不会覆盖全局变量，即不会破坏全局作用域

#### 4、作用域问题
- 在ES6之前，只存在`全局作用域`、`函数作用域`：
    - 使用`var`声明变量，可能会出现内部变量覆盖外部变量的情况
    - 使用`var`声明变量，循环变量会泄漏为全局变量
    - ES5规定`函数声明`只能在全局作用域或者函数作用域中进行，但浏览器为了兼容旧代码，不会报错

- ES6中，除了全局作用域、函数作用域，引入了`块级作用域`的概念，如`{}, if{} for(){}`都会形成块级作用域：
    - 使用`let`、`const`声明变量时，循环变量不会泄漏成为全局变量。在for循环中，设置循环变量与循环体内部是两个单独的作用域。
    - 可以在块级作用域中进行`函数声明`，需要注意的是，块级作用域必须存在`{}`
    - 规定块级作用域中：
        - 在`严格模式`下，函数声明语句的行为类似于let，在块级作用域之外不可引用，且会被提升至块级作用域的顶部。如果是let定义的函数表达式，不会被提示。
        - 在`非严格模式`下，为了兼容旧代码，最终的函数声明语句的行为类似`var`, 声明会被提升到外围函数或全局作用域的顶部，而不是代码块的顶部。

### `let`与`const`的主要区别
`const`声明的是常量，在声明后，常量指向的`内存地址中保存的数据`不可改动。所以：
- 对于简单类型的数据，如数值、字符串等，声明后不可在修改；
- 对于引用类型的数据，只要保持指针不变即可。


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

