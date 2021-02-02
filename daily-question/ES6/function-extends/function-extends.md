# 【每日一题】(39题)谈谈JS的函数扩展？

关注「松宝写代码」，精选好文，每日一题

> 作者： saucxs

愿努力拼搏的你，都能在前进的道路上有所收获！

***

## 一、主要内容

主要内容
- 1、函数默认参数值会影响arguments
- 2、不定参数...
- 3、展开运算符
- 4、使用构造函数创建函数时，也支持不定参数与默认值
- 5、函数的name属性
- 6、new.target元属性
- 7、箭头函数
- 8、严格模式
- 9、双冒号运算符::

## 二、函数默认参数值会影响arguments

**注意，在使用函数默认参数时**：

- 不能使用同名参数
- length返回的长度会减去默认参数的个数以及不定参数，原因：length只会统计函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了


在ES5中，严格模式下，arguments对象与命名参数保持分离，如：

```
function foo (a, b) {
    'use strict'
    console.log(a === arguments[0]) // true
    console.log(b === arguments[1]) // true
    a = 2
    b = 3
    console.log(a === arguments[0]) // false
    console.log(b === arguments[1]) // false
}
foo()
```

在ES6中，如果使用了参数默认值，那么arguments对象的行为与ES5严格模式下保持一致，如：

```
function foo (a, b = 3) {
    console.log(a === arguments[0]) // true
    console.log(b === arguments[1]) // false
    a = 2
    b = 3
    console.log(a === arguments[0]) // false
    console.log(b === arguments[1]) // false
}
foo(1)
```

## 三、不定参数...
将多个独立的参数明，整合成数组来访问
- length只会统计预期会传入的命名参数的个数，所有不定参数不参与统计
- 函数参数中，不定参数只能放在末尾，且只能存在一个
- 不能用在setter中，因为setter有且只能有一个参数
- 不会影响arguments

## 四、展开运算符
指定一个数组，打散后作为各自独立的参数传入函数

```
let arr = [3, 10, 2, 39, 9]
console.log(Math.max(...arr)) // 39
```

## 五、使用构造函数创建函数时，也支持不定参数与默认值
如：

```
let foo = new Function("a = 0", "...args", "return args")
console.log(foo(1, 2, 3, 4, 5)) // [2, 3, 4, 5]
```

注意：构造函数接收的是字符串形式的参数

## 六、函数的name属性
- name优先级，函数本身的名字优先级高于函数被赋值的变量
- 对于bind方法生成的函数，会在名称前加上`bound`前缀
- 对于构造函数生成的函数，会在名称前加上`anonymous`前缀

对象内部方法：
- 对于get与set，会在名称前加上`get|set`前缀
- 对于bind方法生成的函数，会在名称前加上`bound`前缀
- 对于构造函数生成的函数，会在名称前加上`anonymous`前缀
- 如果对象的方法是一个symbol值, name属性返回Symbol值的描述

```
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```

## 七、new.target元属性
元属性指非对象的属性

在使用new初始化类时，会调用类中的构造函数，这个过程自动执行了以下操作：
- 创建一个新对象
- 将构造函数中的作用域赋给新对象，即`this`指向新对象
- 执行构造函数中的代码
- 返回一个新对象

在函数内部有两个不同的内部方法：`[[Call]]`、`[[Construct]]`：
- 当使用new关键字调用函数时，执行`[[Construct]]`函数，负责创建一个实例，然后执行函数体，将this绑定到实例上；此时new.target被赋值为new操作符的目标，也就是新创建的实例。
- 非new调用的函bb数，执行`[[Call]]`函数，直接执行函数体；new.target值undefined。

注意：在函数外使用new.target是一个语法错误

## 八、箭头函数
- 无this、super、arguments和new.target绑定，这些值均是由外围最近一层非箭头函数决定
- 不能通过new关键字调用，无[[contract]]内部方法
- 没有原型
- 不能改变this的绑定
- 不支持arguments对象，只能通过命名参数和不定参数访问函数的参数
- 无论是不是严格模式，均不支持重复命名的参数。传统的函数中，只有严格模式才不允许定义重复参数

## 九、严格模式
ES5规定：函数内部可以使用严格模式

ES6规定：只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

原因：函数内部的严格模式，同时作用于函数体和函数参数。在函数执行的时候，先执行函数参数，再执行函数体。但是只有从函数体之中，才能知道参数是否应该以严格模式执行。

## 十、双冒号运算符::
用来取代bind调用。

双冒号的左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境，绑定到右边的函数上面。

```
foo::bar(a)
等同于
bar.bind(foo, a)

foo::bar
等同于
bar.bind(foo)
```

## 往期「每日一题」

### 1、JavaScript && ES6

+ 第 30 题：[【每日一题】(30题)面试官:ES6的解构赋值的理解？](https://mp.weixin.qq.com/s/-rWv24IAhGAq4WVqHY2jOg)

+ 第 28 题：[【每日一题】(28题)面试官:原型链与构造函数结合方法继承与原型式继承的区别？](https://mp.weixin.qq.com/s/uPUxo8gIGyHv-b_aWdgzaw)

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

### 4、React
+ 第 38 道[【每日一题】(38题)谈谈React Hooks 与Vue3.0 Function based API的对比？](https://mp.weixin.qq.com/s/7D8SvbS1r0oH60EjwowXSQ)

### 5、HTML5
+ 第 29 道[【每日一题】(29题)面试官:HTML-HTML5新增标签属性的理解？](https://mp.weixin.qq.com/s/Lx5-bF-xliB9TBuEtE7dLw)

### 6、算法
+ 第 37 道[【每日一题】(37题)面试官:你对图论了解多少？(七)](https://mp.weixin.qq.com/s/ukPZLrfsPsCxJtOQko8EJg)

+ 第 36 道[【每日一题】(36题)面试官:你对图论了解多少？(六)](https://mp.weixin.qq.com/s/BReGF1JB05W5Ge2ZeaEEYw)

+ 第 35 道[【每日一题】(35题)面试官:你对图论了解多少？(五)](https://mp.weixin.qq.com/s/_ICHDWO4ma_CbEbbemkxZw)

+ 第 34 道[【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

+ 第 33 道[【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

+ 第 32 道[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

+ 第 31 道[[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)

+ 第 27 道[【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？](https://mp.weixin.qq.com/s/EY99dnyjjTvdBflpE5T2Fw)

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 7、Node

+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)

### 8、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位**。

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)
