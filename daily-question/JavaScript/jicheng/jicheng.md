# 【每日一题】(28题)面试官:原型链与构造函数结合方法继承与原型式继承的区别？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

***

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http，算法等领域。

本文是：【每日一题】(28题)面试官:原型链与构造函数结合方法继承与原型式继承的区别？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)

## 二、继承的目的

继承的目的：将父级【Super】的属性变成自己的属性，且实例之间不会互相影响；共用父级原型【Super.prototype】中的方法。

- [原型链与构造函数结合方法继承](#prototype)
- [原型式继承](#create)

## 三、原型链与构造函数结合方法继承

### <a name="prototype">1、原型链与构造函数结合方法继承</a>
1）原型链的方式直接实现继承
```
function Super () {
  this.type = 'super'
  this.colors = ['red', 'blue', 'black']
}
function Child (name) {
  this.type = 'child'
  this.name = name
}
Child.prototype = new Super()
Child.prototype.constructor = Child
var child1 = new Child('cat')
var child2 = new Child('dog')

// 问题一：引用类型值的原型属性会被所有实例共享，所以当其中一个修改时，其他实例也会接收到变化
child2.colors.push('pink')
console.log(child1.colors) // [ 'red', 'blue', 'black', 'pink' ]
console.log(child2.colors) // [ 'red', 'blue', 'black', 'pink' ]

// 问题二：没法向父级构造函数【Super】传递参数
```
2）构造函数的方式实现继承

使用call或者apply的方式获取到父级元素的属性和方法。
```
function Super () {
  this.type = 'super'
  this.colors = ['red', 'blue', 'black']
}
function Child (name) {
  Super.call(this)
  this.type = 'child'
  this.name = name
}
var child = new Child('cat')

// 优势一：call或者apply的方式，可以传递参数，可以解决原型链中无法传递参数的问题
// 问题一：只能在父级构造函数中定义方法，所以函数无法复用
// 问题二：不能继承原型中的方法
```

**3）使用原型链与构造函数相结合的方式实现继承**
```
function Super () {
  this.type = 'super'
  this.colors = ['red', 'blue', 'black']
}
function Child (name) {
  Super.call(this)
  this.type = 'child'
  this.name = name
}
Child.prototype = new Super()
Child.prototype.constructor = Child
var child1 = new Child('cat')
var child2 = new Child('dog')

child2.colors.push('pink')
console.log(child1.colors) // [ 'red', 'blue', 'black' ]
console.log(child2.colors) // [ 'red', 'blue', 'black', 'pink' ]
```

### <a name="create">2、原型式继承Object.create()</a>

**ES6中，Class使用extends关键字继承的原理**

通过Object.create()可以继承到Super.prototype的方法，在使用call或者apply获取到Super的属性
```
function Super () {
  this.type = 'super'
  this.colors = ['red', 'blue', 'black']
}
function Child (name) {
  Super.call(this)
  this.type = 'child'
  this.name = 'name'
}
Child.prototype = Object.create(Super.prototype)
Child.prototype.constructor = Child
var child = new Child('cat')
```

**注意：**
其中
```
Child.prototype = Object.create(Super.prototype)```
```
可以使用以下方法代替：
```
Object.setPrototypeOf(Child.prototype, Super.prototype)
Child.prototype.__proto__ = Super.prototype
```

**Object.create()**
接收两个参数：新对象原型的对象；[可选]新对象定义额外属性的对象

当只传递一个参数时，Object.create()相当于做了以下事情：
```
function object (o) {
  function F () {}
  F.prototype = o
  return new F()
}
```
第二个参数为【新对象定义额外属性的对象】，对象中的每一个属性都是通过自己的描述符定义的，与Object.defineProperties()的第二个参数格式相同。且以这种方式指定的属性会覆盖原型对象上的原始属性。

如：
```
var person = {
  name: 'test',
  age: 20
}

var newPerson = Object.create(person, {
  name: {
    value: 'newName'
  }
})
```

***

## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)


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
+ 第 27 道[【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？](https://mp.weixin.qq.com/s/EY99dnyjjTvdBflpE5T2Fw)

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 5、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

### 6、Node
+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)
