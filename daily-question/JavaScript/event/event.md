# 【每日一题】(17题)面试官问：JS中事件流，事件处理程序，事件对象的理解？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！


## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 17 题：【每日一题】面试官问：JS中如何全面进行客户端检测？

这是一道很宽泛的题目，如何回答更有亮点？

昨天的题目号码写错了，在这里做个说明。

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)


## 二、目录
- 事件流
- 事件处理程序
  - HTML事件处理程序
  - DOM0级事件处理程序
  - DOM2级事件处理程序
  - IE事件处理程序
  - 跨浏览器实现事件处理程序
- 事件对象 Event
  - DOM中的事件对象
  - IE中的事件对象
  - 跨浏览器的事件对象

### 1、事件流
事件流描述的是从页面中接收事件的顺序。
#### 事件冒泡流
IE的事件流叫做事件冒泡(event bubbling)，即事件开始时由最具体的元素接收，然后逐级向上传播到较为不具体的节点。所有的现代浏览器都支持事件冒泡。
#### 事件捕获流
Netscape Communicator团队提出的事件流叫做事件捕获(event capturing)，即事件开始时由不太具体的节点接收，而最具体的节点应该最后收到事件。
#### DOM2级事件
DOM2级事件规定事件流分为三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。

### 2、事件处理程序
响应事件的函数称为事件处理程序。
#### HTML事件处理程序
在元素中使用事件处理程序，如：
```
<input id="btn" type="button" value="Button" onclick="alert(event.type)">
```
- 使用该方式绑定的事件，在事件函数中存在一个局部变量`event`，用来保存事件对象。
- 该方式存在的缺点：
  - 1、JavaScript与HTML加载顺序的不确定性，可能在JavaScript未加载完成之前就触发相应的事件，产生错误。
  - 2、作用域连在不同的浏览器中会导致不同的结果。
  - 3、JavaScript与HTML代码的紧密耦合，如果需要更换事件处理程序，则需要更改两个地方。

#### DOM0级事件处理程序
第四代web浏览器中出现的方法，现在仍被个浏览器所支持。实现方式为将函数赋值给一个事件处理程序属性。

```
<input id="btn" type="button" value="Button">

let btn = document.getElementById('btn')
// 添加事件，多次定义后，最后一个将覆盖之前的定义
btn.onclick = function () {
  alert(this.id)
}
// 删除事件
btn.onclick = null
```
使用该方式绑定的事件，在事件函数中可以使用`this`访问元素的任何属性和方法，且在事件流的冒泡阶段被处理。

#### DOM2级事件处理程序
提供了两个方法`addEventListener()`、`removeEventListener()`分别用来指定和删除事件处理程序。所有的DOM节点都包含这两个方法。

接收三个参数：
- 事件名
- 事件处理程序的函数
- 布尔值，默认值为false。 `true`: 在捕获阶段调用事件处理程序; `false`: 冒泡阶段调用事件处理程序

```
<input id="btn" type="button" value="Button">

let btn = document.getElementById('btn')

function fn ( ) {
   alert('This is a function')
}

// 添加事件，可以定义多个，按照顺序执行
btn.addEventListener('click', function () {
  alert('click1')
}, false)
btn.addEventListener('click', fn, false)

// 删除事件
btn.removeEventListener('click', fn)
```
- 使用addEventListener添加的事件处理程序只能由removeEventListener删除，移除时与传入的三个参数必须完全相同。
- removeEventListener无法移除匿名函数。

#### IE事件处理程序
与DOM2级类似，也提供了两个方法`attachEvent()`、`detachEvent()`分别用来指定和删除事件处理程序。所有的DOM节点都包含这两个方法。

使用attachEvent()添加的事件处理程序，均在冒泡阶段被处理。

接收两个参数：
- 事件名
- 事件处理程序的函数

```
<input id="btn" type="button" value="Button">

let btn = document.getElementById('btn')

function fn ( ) {
   alert('This is a function')
}

// 添加事件，可以定义多个，按照相反的顺序执行
btn.attachEvent('onclick', function () {
  alert('click1')
})
btn.attachEvent('onclick', fn)

// 删除事件
btn.detachEvent('onclick', fn)
```
与其他类型方法的区别
- 1、主要区别是事件处理程序的作用域。在使用attachEvent()方法的情况下，事件处理程序会在全局作用域中进行，this等于window。
- 2、第一个参数必须是`on + 事件名`的形式。
- 3、添加多个事件处理程序时，不是按照顺序依次执行，而是以相反的顺序执行。

#### 跨浏览器实现事件处理程序
- 创建一个EventUtil对象
- 为EventUtil对象实现两个方法：addHandler()、removeHandler()
- 以下示例的方法，还需要注意作用域的问题

```
let EventUtil = {
  addHandler: function (el, type, handler) {
    if (el.addEventListener) {
       el.addEventListener(type, handler, false)
    } else if (el.attachEvent) {
       el.attachEvent('on' + type, handler)
    } else {
       el['on' + type] = handler
    }
  },
  removeHandler: function (el, type, handler) {
    if (el.addEventListener) {
         el.removeEventListener(type, handler, false)
      } else if (el.attachEvent) {
         el.detachEvent('on' + type, handler)
      } else {
         el['on' + type] = null
      }
  }
}
```

### 3、事件对象 Event
触发DOM事件时，会产生一个事件对象`event`，这个对象包含着所有与事件相关的信息。包括导致事件的元素、事件类型以及其他与特定事件相关联的信息。

#### DOM中的事件对象
兼容DOM的浏览器会将`event`对象传入到事件处理器中。触发的事件类型不一样，可以用的方法和属性也不一样。

所有的事件的event对象都包含以下属性和方法：

属性／方法 | 类型 | 读／写   | 说明
----|----|-------|-----
bubbles|Boolean|只读|事件是否冒泡
cancelable|Boolean|只读|是否可以取消事件的默认行为
currentTarget|Element|只读|事件处理程序当前正在处理的元素
defaultPrevented|Boolean|只读|为true时，表示已经调用了`preventDefault()`
detail|Integer|只读|与事件相关的细节信息
eventPhase|Integer|只读|调用事件处理程序的阶段：1 捕获阶段；2：目标阶段；3：冒泡阶段
preventDefault|Function|只读|取消事件的默认行为，`cancelable === true`时，可使用该方法
stopImmediatePropagation()|Function|只读|取消事件的进一步捕获或者冒泡，同时阻止任何事件处理程序被调用
stopPropagation()|Function|只读|取消事件的进一步捕获或者冒泡， `bubbles === true`时，可以使用该方法
target|Element|只读|事件的目标
trusted|Element|只读|true: 事件由浏览器生成；false：开发人员通过JS创建
type|String|只读|事件的类型
view|AbstractView|只读|与事件关联的抽象试图。等同于发生事件的window对象

**说明**
- target 触发事件的真是目标
- currentTarget 事件处理程序内部 `this===currentTarget`
- 只有在事件处理程序执行期间，event对象才会存在；一旦事件处理程序执行完成，event对象就会被销毁。

#### IE中的事件对象
指定事件处理程序的方法不同，获取event对象的方式也不同。

- `DOM0级` 使用`window.event`获取event对象
- 使用`attachEvent()`方式添加，会有一个event对象作为参数被传入事件处理程序，当然在这种情况下，也可以通过window对象来获取event对象。

所有的事件的event对象都包含以下属性和方法：

属性／方法 | 类型 | 读／写 | 说明
----|----|----|-----
cancelBubbles|Boolean|读／写|默认false，true：可以取消事件冒泡，与DOM中的`stopPropagation()`方法相同
returnValue|Boolean|读／写|默认true，false：取消事件的默认行为，与DOM中的`preventDefault()`方法相同
srcElement|Element|只读|事件的目标，与DOM中的`target`属性相同
type|String|只读|事件的类型

**说明**
- 因为事件处理程序的作用域是根据指定它的方式来确定的，所以最好使用`srcElement`来确定事件目标。

#### 跨浏览器的事件对象
针对IE与DOM事件的差异，可以继续补充前面创建的`EventUtil`对象，解决兼容性问题。
```
let EventUtil = {
  addHandler: function (el, type, handler) {
    if (el.addEventListener) {
       el.addEventListener(type, handler, false)
    } else if (el.attachEvent) {
       el.attachEvent('on' + type, handler)
    } else {
       el['on' + type] = handler
    }
  },
  removeHandler: function (el, type, handler) {
    if (el.addEventListener) {
         el.removeEventListener(type, handler, false)
      } else if (el.attachEvent) {
         el.detachEvent('on' + type, handler)
      } else {
         el['on' + type] = null
      }
  },
  // ------- 新增加的关于事件对象的兼容性处理 --------
  getEvent: function (event) {
    return event ? event : window.event
  },
  getTarget: function (event) {
    return event.target || event.srcElement
  },
  preventDefault: function (event) {
    // 阻止事件的默认行为
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = true
    }
  },
  stopPropagation: function (event) {
    // 阻止冒泡
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubbles = true
    }
  }
}
```



## 谢谢支持
![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)

1、喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

## 字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

## 学习资料福利
回复「算法」获取算法学习资料

## 往期「每日一题」

### 1、JavaScript && ES6

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

