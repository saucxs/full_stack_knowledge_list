# 【每日一题】面试官问：JS中如何进行客户端检测？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！


## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 15 题：【每日一题】面试官问：JS类型判断有哪几种方法？

## 二、客户端检测的方法
客户端检测是一种补救措施，也是一种行之有效的开发策略。主要用来规避或者突破不同浏览器之间的差异。

完整的判断当前引擎、浏览器、平台的检测代码，

### 1、目录
- 能力检测
- 怪癖检测
- 用户代理检测

### 2、能力检测
又称特性检测。不是检测浏览器的类型，而是检测浏览器具备哪些能力。

能力检测需要注意的问题
- 1、先检测达成目的最常用的特性
- 2、检测某个或者某几个特性并不能确定浏览器，根据浏览器的不同将能力组合起来才是更可取的方式(如判断浏览器是否支持DOM1级规定的能力等)。
- 3、必须检测实际要用到的特性，即一个特性存在，不意味着另一个特性也存在，如下例子：

```
function getWindowWidth () {
  if (document.all) { // 假设IE浏览器
    return document.documentElement.clientWidth
  } else {
    return window.innerWidth
  }
}
```
上述例子中，存在的问题是：Opera同时支持`document.all`、`window.innerWidth`

### 3、怪癖检测
和能力检测不同，怪癖检测用来识别浏览器的特殊行为，即检测浏览器存在测缺陷。

如IE8以及更早的版本中，如果某个实例属性与`[[Enumerable]]`标记为false的某个原型属性同名，则该实例属性不会出现在`for-in`循环中。可使用以下代码检测是否存在此问题：
```
var hasDontEnumQuirk =function () {
  var o = {toString: function () {}}
  for (var key in o) {
    if (key == 'toString') {
      return false
    }
  }
  return true
}
```

另一个经常需要检测的问题，Safari3之前的版本会枚举被隐藏的属性，可使用下面代码检测该问题：
```
var hasEnumShadowsQuirk =function () {
  var o = {toString: function () {}}
  var count = 0
  for (var key in o) {
    if (key == 'toString') {
      count++
    }
  }
  return (count > 1)
}
```

### 4、用户代理检测
通过检测用户代理字符串来确定实际使用的浏览器。

在每一次的HTTP请求中，用户代理字符串是作为响应首部发送的，且该字符串可通过JavaScript的`navigator.userAgent`属性访问。

在客户端，用户代理检测一般被当作一种万不得已才用的做法，其优先级排在能力检测或怪癖检测之后。

奉上检测工具的全部代码:

```
/**
 * 判断当前引擎、浏览器、平台
 *
 * 均存在指定变量中，除了当前使用的被保存了浮点数形式的版本号，其他属性值将保持为0
 *
 * ----------引擎判断 engine---------
 * - Opera
 * 检测window.opera，Opera5以及更高版本都存在该对象，version()记录Opera的版本号
 * - WebKit
 * 由于webkit的用户代理字符串中包含'Gecko'和'KHTML'子字符串，所以先检测webkit再检测gecko和khtml
 * 通过检测用户代理字符串中'AppleWebkit'来确定是否是webkit引擎
 * - KHTML
 * 由于khtml的用户代理字符串中也包含'Gecko'子字符串，所以先检测khtml再检测gecko
 * - Gecko
 * Gecko的版本号不会出现在字符串'Gecko'后面，而是位于字符串'rv:'与一个闭括号之间，且还需判断'Gecko/'后是否跟8个数字
 * - IE
 * IE的版本号位于字符串'MSIE'的后面，一个分号的前面
 *
 * ----------浏览器判断 browser---------
 * - 对于IE、Opera来说，browser中的值等于engine对象中的值
 * - 对于Konqueror来说，browser.konq = engine.khtml，browser.ver = engine.ver
 *
 * */


var client = function () {
  // 保存引擎以及具体的版本号
  var engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,
    ver: null
  }

  // 保存主要浏览器属性
  var browser = {
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,
    ver: null
  }

  // 保存主要浏览器属性
  var system = {
    win: false,
    mac: false,
    x11: false, // Unix Linux
    // 移动设备
    iphone: false,
    ipod: false,
    ipad: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,
    // 游戏系统
    wii: false,
    ps: false
  }

  // -----检测 引擎和浏览器 -----
  let ua = navigator.userAgent

  if (window.opera) {
    // opera
    engine.ver = browser.ver = window.opera.version()
    engine.opera = browser.opera = parseFloat(engine.ver)
  } else if (/AppleWebkit\/(\S+)/.test(ua)) {
    // webkit
    engine.ver = RegExp[$1]
    engine.webkit = parseFloat(engine.ver)

    // 确定是Chrome还是Safari
    if (/Chrome\/(\S+)/.test(ua)) {
      browser.ver = RegExp[$1]
      browser.chrome = parseFloat(browser.ver)
    } else if (/Version\/(\S+)/.test(ua)) {
      browser.ver = RegExp[$1]
      browser.safari = parseFloat(browser.ver)
    } else {
      // 近似确定版本号
      var safariVersion = 1
      if (engine.webkit < 100) {
        safariVersion = 1
      } else if (engine.webkit < 312) {
        safariVersion = 1.2
      } else if (engine.webkit < 412) {
        safariVersion = 1.3
      } else {
        safariVersion = 2
      }
      browser.safari = browser.ver = safariVersion
    }
  } else if (/KHTML\/(\S+)/.test(ua)) {
    // khtml
    engine.ver = browser.ver = RegExp[$1]
    engine.khtml = browser.konq = parseFloat(engine.ver)
  } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    // opera
    engine.ver = RegExp[$1]
    engine.gecko = parseFloat(engine.ver)

    // 确定是不是Firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp[$1]
      browser.firefox = parseFloat(browser.ver)
    }
  } else if (/MSIE ([^;]+)/.test(ua)) {
    // ie
    engine.ver = browser.ver = RegExp[$1]
    engine.ie = browser.ie = parseFloat(engine.ver)
  }

  // -----检测 平台 -----
  var p = navigator.platform
  system.win = p.indexOf('Win') === 0
  system.mac = p.indexOf('Mac') === 0
  system.x11 = (p.indexOf('X11') === 0 ) || (p.indexOf('Linux') === 0)

  // 检测windows操作系统
  if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
      if (RegExp['$1'] == 'NT') {
        switch (RegExp['$2']) {
          case '5.0':
            system.win = '2000'
            break
          case '5.1':
            system.win = 'XP'
            break
          case '6.0':
            system.win = 'Vista'
            break
          case '6.1':
            system.win = '7'
            break
          default:
            system.win = 'NT'
            break
        }
      } else if (RegExp['$1'] == '9x') {
        system.win = 'ME'
      } else {
        system.win = RegExp['$1']
      }
    }
  }
  // 移动设备、 windows mobile、iOS、android
  system.iphone = ua.indexOf('iPhone') > -1
  system.ipod = ua.indexOf('iPod') > -1
  system.ipad = ua.indexOf('iPad') > -1
  system.nokiaN = ua.indexOf('NokiaN') > -1

  if (system.win == 'CE') {
    system.winMobile = system.win
  } else if (system.win == 'Ph') {
    if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
      system.win = 'Phone'
      system.winMobile = parseFloat(RegExp['$1'])
    }
  }

  if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:Phone)?OS (\d+_\d+)/.test(ua)){
      system.ios = parseFloat(RegExp.$1.replace('_', '.'))
    } else {
      system.ios = 2
    }
  }

  if (/Android (\d+.\d+)/.test(ua)){
    system.android = parseFloat(RegExp.$1)
  }

  // 游戏设备
  system.wii = ua.indexOf('Wii') > -1
  system.ps = /playstation/i.test(ua)

  return {
    engine: engine,
    browser: browser,
    system: system
  }
}
```

如果上面代码格式乱码，可以查看下面图片：

![代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/client-tool/carbon.png)


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

