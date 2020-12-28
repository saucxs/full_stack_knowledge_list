# [每日一题]面试官问：for in和for of 的区别和原理？

关注「松宝写代码」，精选好文，每日一题

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

>作者：saucxs ｜ songEagle


## 一、前言

2020.12.23 日刚立的 flag，每日一题，题目类型不限制，可以是：算法题，面试题，阐述题等等。

本文是「每日一题」第 7 题：[每日一题]面试官问：for in和for of 的区别和原理？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 6 题 [[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

## 二、for in和for of 的区别和原理？
这个题目本身不是特别难，只能说是作为社招的基础面试题，但是如果想回答好这道题也不是很容易。

不信接着往下看：

### 1、简单回答
很多人会去问：for in 和for of的区别，

我说：for in是获取属性名，for of获取属性值。

### 2、看一些例子
首先我们先看一个对象遍历的例子
```js
var obj = {name: 'saucxs',age: 21,sex: 1};
for(key in obj){
    console.log(key, obj[key]);
    // name saucxs
    // age 21
    // sex 1
}
for(key of obj){
    console.log(key, obj[key]);
    // typeError :obj is not iterable报错
}
```
说明obj对象没有iterable属性报错，使用不了for of。

我们现在再看一个数组遍历的例子
```js
var array = ['a','b','c'];
for(var key in array){
    console.log(key, array[key]);
    // 0 a
    // 1 b
    // 2 c
}
for(var key of array){
    console.log(key, array[key]);
    // a undefined
    // b undefined
    // c undefined
}
```
这回没有报错，为什么呢？

我们再看一个例子：
```js
var array = ['a', 'b', 'c'];
array.name = 'saucxs'
for(key in array){
    console.log(key, array[key])
    // 0 a
    // 1 b
    // 2 c
    // name saucxs
}
```

### 3、for in的特点
for in 循环返回的值都是数据结构的**键名**。

遍历对象返回的是对象的key值，遍历数组返回的是数组的下标。

还会遍历原型上的值和手动添加的值

总的来说：for in适合遍历对象。

### 4、for of的特点
for of 循环获取一对键值中的**键值**。

一个数据结构只要部署了Symbol.iterator属性，就被视为具有iterator接口，可以使用for of。

for of不同于forEach，for of是可以break，continue，return配合使用，for of 循环可以随时退出循环。

总的来说：for of遍历所有数据结构的统一接口。

### 5、深入探索
哪些数据结构部署了Symbol.iterator属性？

以下数据结构的有iterator接口的：
+ 数组Array
+ Map
+ Set
+ String
+ arguments对象
+ Nodelist对象，类数组
凡是部署了iterator接口的数据结构都可以使用数组的扩展运算符(...)，和解构赋值等操作。

如果我非常想让对象用for of？

可以使用Object.keys()获取对象的key值集合，在用for of。

```js
var obj = {name: 'saucxs',age: 18, sex: 1};
for(var key of Object.keys(obj)){
    console.log(key, obj[key]);
    // name saucxs
    // age 21
    // sex 1
}
```
这样也可以给一个对象部署Symbol.iterator属性。



## 各种福利
![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)

「松宝写代码」：开发知识体系构建，技术分享，项目实战，实验室，每日一题，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。


#### 1、字节内推福利

回复「校招」获取内推码

回复「社招」获取内推

回复「实习生」获取内推

后续会有更多福利


#### 2、学习资料福利
回复「算法」获取算法学习资料

#### 3、每日一题
+ 本文是「每日一题」第 7 题：面试官问：for in和for of 的区别和原理？

+ 第 6 题 [[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 题：[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)


+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)


+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## The End
如果你觉得这篇文章对你有帮助，有启发，可能帮助到更多的人，我想请你帮我几个小忙：

1、点个「在看」，让更多的人也能看到这篇文章内容。

2、点个「赞」，是对文章的肯定。

3、点个「分享」到朋友圈，是为了让更多的人知道你在学习提升自己。

4、关注「松宝写代码」，后台回复「加群」 加入我们一起学习。