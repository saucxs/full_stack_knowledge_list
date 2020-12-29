# [每日一题]面试官问：谈谈你对ES6的proxy的理解？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle


## 一、前言

2020.12.23 日刚立的 flag，每日一题，题目类型不限制，可以是：算法题，面试题，阐述题等等。

本文是「每日一题」第 8 题：[每日一题]面试官问：谈谈你对ES6的proxy的理解

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)

往期「每日一题」：

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## 二、什么是Proxy？
Proxy，代理，是ES6新增的功能，可以理解为代理器（即由它代理某些操作）。

Proxy 对象用于定义或修改某些操作的自定义行为，可以在外界对目标对象进行访问前，对外界的访问进行改写。

### 1、Proxy定义

```
var proxy = new Proxy(target, handler)
```

new Proxy()表示生成一个 Proxy 实例

+ target：目标对象
+ handler：一个对象，其属性是当执行一个操作时定义代理的行为的函数。

注意：要实现拦截操作，必须是对 Proxy 实例进行操作，而不是针对目标对象 target 进行操作。

### 2、proxy拦截get和set操作
我们先来看一下proxy拦截get和set操作，示例代码如下：

```
let handler = {
    get: function(target, key, receiver) {
        console.log(`getter ${key}!`)
        return Reflect.get(target, key, receiver)
    },
    set: function(target, key, value, receiver) {
    	console.log(`setter ${key}=${value}`)
		return Reflect.set(target, key, value, receiver)
	}
}
var obj = new Proxy({}, handler)
obj.a = 1          // setter a=1
obj.b = undefined  // setter b=undefined

console.log(obj.a, obj.b) 
// getter a!
// getter b!
// 1 undefined

console.log('c' in obj, obj.c)	
// getter c!
// false undefined
```

### 3、proxy覆盖组件的原始行为

我们来看一下，示例代码如下：

```
let handler = {
    get: function(target, key, receiver) {
        return 1
    },
  	set: function (target, key, value, receiver) {
    	console.log(`setting ${key}!`);
    	return Reflect.set(target, key, value, receiver);
  	}
}
var obj = new Proxy({}, handler)
obj.a = 5       // setting 5!
console.log(obj.a);    // 1
```

由上面代码看出：Proxy 不仅是拦截了行为，更是用自己定义的行为覆盖了组件的原始行为。

**若handler = {}，则代表 Proxy 没有做任何拦截，访问 Proxy 实例就相当于访问 target 目标对象。**

## 三、Proxy handle方法
+ 1、get(target, key, receiver)：拦截 target 属性的读取
+ 2、set(target, key, value, receiver)：拦截 target 属性的设置
+ 3、has(target, key)：拦截 key in proxy 的操作，并返回是否存在（boolean值）
+ 4、deleteProperty(target, key)：拦截 delete proxy[key]的操作，并返回结果（boolean值）
+ 5、ownKeys(target)：拦截Object.getOwnPropertyName(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for ... in循环。并返回目标对象所有自身属性的属性名数组。注意：Object.keys()的返回结果数组中只包含目标对象自身的可遍历属性
+ 6、getOwnPropertyDescriptor(target, key)：拦截 Object.getOwnPropertyDescriptor(proxy, key)，返回属性的描述对象
+ 7、defineProperty(target, key, desc)：拦截Object.defineProperty(proxy, key, desc)、Object.defineProperties(proxy, descs)，返回一个 boolean 值
+ 8、preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个 boolean 值
+ 9、getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象
+ 10、isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个 boolean 值
+ 11、setPrototypeOf(target, key)：拦截Object.setPrototypeOf(proxy, key)，返回一个 boolean 值。如果目标对象是函数，则还有两种额外操作可以被拦截
+ 12、apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
+ 13、construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)

总共 13 个拦截方法，下面进行简要举例说明，更多可见阮一峰老师的 《ECMAScript 6 入门》（https://es6.ruanyifeng.com/#docs/proxy）

### 1、get方法和set方法

get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

set拦截 target 属性的设置，可以接受四个参数，依次为目标对象、属性名、value和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

```
let target = {foo: 1}
let proxy = new Proxy(target, {
    get(target, key, receiver) {
        console.log(`getter ${key}!`)
        return target[key]
    },
    set: function(target, key, value, receiver) {
        console.log(`setter ${key}!`)
        target[key] = value;
    }
})

let obj = Object.create(proxy)
console.log(obj.foo) 
// getter foo!
// 1
```

### 2、has方法
拦截 propKey in proxy 的操作，返回一个布尔值。

```
// 使用 has 方法隐藏某些属性，不被 in 运算符发现
var handler = {
    has (target, key) {
        if (key.startsWith('_')) {
            return false;
        }
        return key in target;
    }
};
var foo = { _name: 'saucxs', name: 'saucxs' };
var proxy = new Proxy(foo, handler);
console.log('_name' in proxy); // false
console.log('name' in proxy); // true
```

### 3、ownKeys方法
拦截自身属性的读取操作。并返回目标对象所有自身属性的属性名数组。具体返回结果可结合 MDN 属性的可枚举性和所有权

+ Object.getOwnPropertyName(proxy)
+ Object.getOwnPropertySymbols(proxy)
+ Object.keys(proxy)
+ for ... in循环

```
let target = {
  _foo: 'foo',
  _bar: 'bar',
  name: 'saucxs'
};

let handler = {
  ownKeys (target) {
    return Reflect.ownKeys(target).filter(key => key.startsWith('_'));
  }
};

let proxy = new Proxy(target, handler);
for (let key of Object.keys(proxy)) {
  console.log(target[key]);
}
// "saucxs"
```


### 4、apply方法

apply 拦截 Proxy 实例作为函数调用的操作，比如函数的调用（proxy(...args)）、call（proxy.call(object, ...args)）、apply（proxy.apply(...)）等。

```
var target = function () { return 'I am the target'; };
var handler = {
  apply: function () {
    return 'I am the saucxs proxy';
  }
};

var proxy = new Proxy(target, handler);

proxy();
// "I am the saucxs proxy"
```

更多可见阮一峰老师的 《ECMAScript 6 入门》（https://es6.ruanyifeng.com/#docs/proxy）


## 各种福利

#### 1、字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

#### 2、学习资料福利
回复「算法」获取算法学习资料

#### 3、每日一题
 + 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题 [[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 题[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)


+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)


+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## 谢谢支持
1、喜欢的话可以「分享，点赞，在看」三连哦。

2、songEagle是字节跳动数据平台的一枚前端工程师，一个正在努力学习成长的作者，星辰大海，未来可期，内推字节跳动各个部门各个岗位。

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，每日一道面试题，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，帮助更多的同学进入到「字节，阿里，百度，腾讯，滴滴」等大厂，希望下一个就是你！

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)
