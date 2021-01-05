# [每日一题]面试官问：['1', '2', '3'].map(parseInt)输出，原因，以及延伸？
关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 13 题：[每日一题]面试官问：['1', '2', '3'].map(parseInt)输出，原因，以及延伸？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 12 题[[每日一题]面试官问：JS引擎的执行过程（二）](https://mp.weixin.qq.com/s/CCUsCM2vzb6S1wcwIsjQuA)

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
['1', '2', '3'].map(parseInt)

这是一道经典的面试题，很多面试官在考察的时候会拿出这道题，因为一道题考察的点
比较多：map方法，parseInt方法，有一定的教育意义。

其实主要是讲JavaScript的映射和解析。

在2013年，加里·伯恩哈德就在微博上发布了以下代码段:

```
['10','10','10','10','10'].map(parseInt);
// [10, NaN, 2, 3, 4]
```

### 三、parseInt方法
parseInt() 函数解析一个字符串参数，并返回一个指定基数的整数 (数学系统的基础)

```
const intValue = parseInt(string[, radix]);
```

+ string 要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用 ToString 抽象操作)。字符串开头的空白符将会被忽略。

+ radix 一个介于2和36之间的整数(数学系统的基础)，表示上述字符串的基数。默认为10。
返回值 返回一个整数或NaN

```
parseInt(100); // 100
parseInt(100, 10); // 100
parseInt(100, 2); // 4 -> converts 100 in base 2 to base 10
```

注意：
在radix为 undefined，或者radix为 0 或者没有指定的情况下，JavaScript 作如下处理：

+ 如果字符串 string 以"0x"或者"0X"开头, 则基数是16 (16进制).
+ 如果字符串 string 以"0"开头, 基数是8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用10，但是并不是所有的浏览器都遵循这个规定。因此，永远都要明确给出radix参数的值。
+ 如果字符串 string 以其它任何值开头，则基数是10 (十进制)。

更多详见parseInt | MDN（https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt）

### 四、map方法
map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

```
var new_array = arr.map(function callback(currentValue[,index[, array]]) {
 // Return element for new_array
 }[, thisArg])

```

可以看到callback回调函数需要三个参数, 我们通常只使用第一个参数 (其他两个参数是可选的)。

+ currentValue 是callback 数组中正在处理的当前元素。
+ index可选, 是callback 数组中正在处理的当前元素的索引。
+ array可选, 是callback map 方法被调用的数组。

另外还有thisArg可选, 执行 callback 函数时使用的this 值。

```
const arr = [1, 2, 3];
arr.map((num) => num + 1); // [2, 3, 4]
```

更多详见Array.prototype.map() | MDN（https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map）

### 五、我们回到题目上
回到我们真实的题目上

```
['1', '2', '3'].map(parseInt)
```

对于每个迭代map, parseInt()传递两个参数: 字符串和基数。

所以实际执行的的代码是：

```
['1', '2', '3'].map((item, index) => {
	return parseInt(item, index)
})
```

即返回的值分别为：

```
parseInt('1', 0) // 1
parseInt('2', 1) // NaN
parseInt('3', 2) // NaN, 3 不是二进制
```

所以：

```
['1', '2', '3'].map(parseInt)
// 1, NaN, NaN
```

由此，加里·伯恩哈德例子也就很好解释了，这里不再赘述

```
['10','10','10','10','10'].map(parseInt);
// [10, NaN, 2, 3, 4]
```

### 六、黑科技解决
实际开发中如果想要循环访问字符串数组，这时候我们要拿出我们武器？
map然后把它换成数字，使用Number。

```
['1','2','3'].map(Number);
// [1, 2, 3]
```

```
['10','10','10','10','10'].map(Number);
// [10, 10, 10, 10, 10]
```

## 七、参考

+ https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt

+ https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map



## 各种福利

#### 1、字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

#### 2、学习资料福利
回复「算法」获取算法学习资料

#### 3、往期每日一题

+ 第 12 题[[每日一题]面试官问：JS引擎的执行过程（二）](https://mp.weixin.qq.com/s/CCUsCM2vzb6S1wcwIsjQuA)

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
![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)

1、喜欢的话可以「分享，点赞，在看」三连哦。

2、作者昵称：saucxs，songEagle，松宝写代码。字节跳动的一枚前端工程师，一个正在努力成长的作者，星辰大海，未来可期，**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，每日一道面试题，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～


