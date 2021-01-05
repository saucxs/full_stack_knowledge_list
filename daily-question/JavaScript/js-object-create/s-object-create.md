
# 【每日一题】面试官问：谈谈你对JS对象的创建和引申

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 14 题：【每日一题】面试官问：谈谈你对JS对象的创建和引申

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 13 题[[每日一题]面试官问：['1', '2', '3'].map(parseInt)输出，原因，以及延伸？](https://mp.weixin.qq.com/s/DJ6Av4tQgJpqa8hKAPk_uA)

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

## 二、概览

- [创建对象的方法](#new)
  - [对象字面量](#new-first)
  - [工厂模式](#new-factory)
  - [构造函数方法](#new-constructor)
  - [原型模式](#new-prototype)
  - [构造函数与原型模式相结合](#new-hybrid)
- [创建对象引申的知识点](#other)
  - [new操作符做的事情](#other-new)
  - [遍历对象属性的所有方法](#forin)
  - [对象、构造函数、原型对象理解](#other-concept)
  - [原型链的理解](#prototype)
  - [对象属性与操作属性的方法](#other-features)
  - [对于可枚举](#enumerable)

## 三、详细说明
### <a name="new"></a>创建对象的方法
#### <a name="new-first"></a>对象字面量
如：
```
let obj = {
    a: 1
}
```

#### <a name="new-factory"></a>工厂模式
使用一个可以返回对象函数来创建对象，如：
```
function foo (name) {
    let o = new Object()
    o.name = name
    o.getName = function () {
        return this.name
    }
    return o
}
let obj1 = foo('ming')
let obj2 = foo('tian')
```

#### <a name="new-constructor"></a>构造函数方法
使用new操作符与构造函数的形式，创建对象，如：
```
function Foo (name) {
  this.name = name
  this.age = 20
  this.getAge = function () {
    return this.age
  }
}
let obj1 = new Foo('ming')
let obj2 = new Foo('tian')

console.log(obj1 instanceof Object); //true
console.log(obj1 instanceof Foo); // true
console.log(obj2 instanceof Object); // true
console.log(obj2 instanceof Foo); // true
```
与工厂模式相比，可以清晰的知道对象的类型。

#### <a name="new-prototype"></a>原型模式
构造函数模式，创建对象有一个缺点，那就是每个方法都需要在每个新对象上创建一次。
```
function Foo () {}
Foo.prototype.age = 20
Foo.prototype.getAge = function () {
    return this.age
}
let obj1 = new Foo()
let obj2 = new Foo()
obj2.age = 22
console.log(obj1.getAge()); // 20
console.log(obj2.getAge()); // 22
```

#### <a name="new-hybrid"></a>构造函数与原型模式相结合
```
function Foo (name) {
    this.name = name
}
Foo.prototype.age = 20
Foo.prototype.getAge = function () {
    return this.age
}
let obj1 = new Foo('ming')
let obj2 = new Foo('tian')
obj2.age = 22
console.log(obj1.name); // ming
console.log(obj2.name); // tian
```
原型上定义公共的方法与属性，构造函数上定义实例的属性。

### <a name="other"></a>创建对象引申的知识点
#### <a name="other-new"></a>new操作符做的事情
在使用new初始化类时，会调用类中的构造函数，这个过程自动执行了以下操作：
- 创建一个新对象
- 将构造函数中的作用域赋给新对象，即`this`指向新对象
- 执行构造函数中的代码
- 返回一个新对象

在函数内部有两个不同的内部方法：`[[Call]]`、`[[Construct]]`：
- 当使用new关键字调用函数时，执行`[[Construct]]`函数，负责创建一个实例，然后执行函数体，将this绑定到实例上；此时new.target被赋值为new操作符的目标，也就是新创建的实例。
- 非new调用的函bb数，执行`[[Call]]`函数，直接执行函数体；new.target值undefined。

####  <a name="forin"></a>遍历对象属性的所有方法
- for...in，循环遍历`自身`以及`继承`的所有可枚举属性，不包括Symbols；
- object.keys(obj)，返回一个包含`自身`所有可枚举属性键名的数组，不包含Symbols以及继承的属性；
- Object.getOwnPropertyNames(obj)，返回一个包含`自身`所有属性的数组，包括可枚举、不可枚举的属性，不包含Symbols；
- Object.getOwnPropertySymbols(obj)，返回一个包含`自身`所有Symbols属性的数组
- Reflect.ownKeys(obj)，返回一个包含`自身所有`的属性的数组，不区分是否是Symbols，是否可枚举。

**ES6中规定了枚举的顺序**
- 1、先遍历数字键，按照升序排序
- 2、再遍历字符串键，按照加入对象的顺序
- 3、遍历Symbols键，按照加入对象的顺序
**注意**：
- 明确规定会影响的有`Object.getOwnPropertyNames`和`Reflect.ownKeys(obj)`方法；
- 对于`for...in`，不同的浏览器行为不同，所以顺序不能明确，另外`object.keys(obj)`与`JSON.stringify()`方法均指明，枚举顺序与`for...in`相同。


#### <a name="other-concept"></a>构造函数、实例、原型对象的理解
- 对于构造函数来说除了本身的方法和属性外，只要创建了新的函数，就会自动创建一个`prototype`属性
- `prototype`属性指向函数的原型对象，而所有的原型对象都会自动获得一个`constructor`(构造函数)属性，这个属性包含一个指向prototype属性所在函数的指针
- 至于原型对象上的其他方法和属性，均从Object继承而来
- 当使用构造函数创建一个新实例后，实例内部存在一个`[[prototype]]`内部属性，指向构造函数的原型对象

简单来说：每一个构造函数都有一个原型对象，每个原型对象又包含指向构造函数的指针，而每一个实例又包含一个指向构造函数原型对象的内部属性。

#### <a name="prototype"></a>原型链的理解
每个对象都有一个`[[prototype]]`内部指针，指向自己的原型对象；而原型对象也有一个`[[prototype]]`内部指针，指向原型的原型对象，就这样通过`[[prototype]]`内部指针这个内部指针，可以一直找到Object的原型，这就是原型链。


### <a name="other-features"></a>对象属性与操作属性的方法
包括`数据属性`、`访问器属性`

#### 数据属性
特性     | 具体含义
---------|-------
`[[Configurable]]`| 默认true, 能否通过delete删除或修改属性
`[[Enumerable]]`| 默认true, 能否通过for-in循环返回属性
`[[writable]]`|默认true, 能否修改属性的值
`[[value]]`| 默认undefined, 属性的数据值

注意：
`writable: false`时，不能通过简单的赋值操作再修改属性的值，只能通过`definedProperty`等的方式修改值。

#### 访问器属性
特性     | 具体含义
---------|-------
`[[Configurable]]`| 默认true, 能否通过delete删除或修改属性
`[[Enumerable]]`| 默认true, 能否通过for-in循环返回属性
`[[Get]]`|默认undefined, 设置读取属性时调用的函数
`[[Set]]`| 默认undefined, 设置写入属性时调用的函数

注意：
- 访问器属性不能直接定义，必须使用`Object.defineProperty`
- 不一定非要同时指定`getter`，`setter`, 但是只指定getter意味着只读

#### Object.defineProperty方法
用于设置或者修改属性的默认特性，接收三个参数：对象, 属性名称, 描述符对象。如：
```
let obj = {}
Object.defineProperty(obj, 'name', {
    value: 'ming',
    writable: false
})
```
上述例子中，修改obj.name不会生效，在严格模式下，会抛出错误

注意：`configurable`特性，一旦被修改为false，不可以配置，就不能再变回可配置了。

#### Object.defineProperties方法
用于设置或者修改`多个属性`的默认特性，接收两个参数：对象, 属性与特性要修改的内容。如：
```
let obj = {}
Object.definePropert(obj, {
    name: {
        value: 'ming',
        writable: false
    },
    _age: {
        value: 10'
    },
    age: {
        get: function () {
            return this._age
        }
    }
})
```

#### Object.getOwnPropertyDescriptor方法
用于获取对象指定属性的描述符，接收两个参数：对象, 属性名。如：
```
// 接上个例子的代码
Object.getOwnPropertyDescriptor(obj, 'name')
```

###  <a name="enumerable"></a>对于可枚举
- for...in 循环，只可以遍历对象自身和继承的可枚举属性
- Object.keys()，返回自身所有可枚举的属性的键
- JSON.stringify()，只串行化对象自身可枚举的属性
- Object.assign()，只拷贝对象自身可枚举的属性，不包括访问器属性
- ES6中规定，所有calss原型的方法均不可枚举


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


