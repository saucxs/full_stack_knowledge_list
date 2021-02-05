# 【每日一题】(40题)关于script标签，你可能不知道的地方？

关注「松宝写代码」，精选好文，每日一题

> 作者： saucxs

愿努力拼搏的你，都能在前进的道路上有所收获！

***

## 主要内容
+ 1、script标签默认会阻塞页面解析，并按照它们出现的顺序执行
+ 2、script标签的async和defer 属性
+ 3、type为module的script标签
+ 4、script标签的integrity属性
+ 5、script标签的crossorigin属性
+ 6、动态导入script
+ 7、script标签的onerror
+ 8、script标签与innerHTML


script标签用来在网页中执行JavaScript，它可以直接包含JavaScript代码，也可以直接通过src指向一个同域或者不同域的外链。

## 一、script标签默认会阻塞页面解析，并按照它们出现的顺序执行

```
<script src="a.js"></script>
<script>
  console.log('b')
</script>
<script src="b.js"></script>
```

浏览器在解析到上面的script标签时会阻止页面解析，并平行下载a.js, b.js，依次执行a.js, console.log('b'), b.js 后，再继续解析渲染页面。这也是为什么你会经常看到一些建议将需要DOM操作的js要放在body的最后，不阻塞页面html的解析。

## 二、script标签的async和defer 属性
async 仅适用于外链，规定脚本异步执行

下载不会阻塞页面解析

不会按照出现的顺序执行，先下载完成哪个就先执行哪个

执行的时候，有可能页面还没解析完成

defer仅适用于外链，规定脚本延迟执行

不会阻塞页面解析

在html解析完成后, DOMContentLoaded之前执行

会按照出现的顺序执行

## 三、type为module的script标签
相比传统script，<script type="module"></script>将被当作一个JavaScript模块对待，被称为module script，且不受charset和defer属性影响。

```
// app.js
import { assign } from "./utils.js"

var obj = Object.create(
  { foo: 1 }, 
  {
    bar: { value: 2 },
    baz: { value: 3, enumerable: true }
  },
)
var copy = assign({}, obj)
console.log(copy)
<script type="module" src="app.js"></script>
<script nomodule src="classic-app-bundle.js"></script>
```

上面的代码，可以这么理解：

支持module script的浏览器，不会执行拥有nomodule属性的script

不支持module script的浏览器，会忽略未知的type="module"的script，同时也会忽略传统script中不认识的nomodule属性，进而执行传统的bundle.js代码
module script以及其依赖所有文件（源文件中通过import声明导入的文件）都会被下载，一旦整个依赖的模块树都被导入，页面文档也完成解析，app.js将会被执行
但是如果module script里有async属性，比如<script type="module" src="util.js" async></script>，module script及其所有依赖都会异步下载，待整个依赖的模块树都被导入时会立即执行，而此时页面有可能还没有完成解析渲染。

传统script和module script如何被下载执行可以用下图来概括：

![script](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/javascript-label/script.jpg)

## 四、script标签的integrity属性

```
<script crossorigin="anonymous" integrity="sha256-PJJrxrJLzT6CCz1jDfQXTRWOO9zmemDQbmLtSlFQluc=" src="https://assets-cdn.github.com/assets/frameworks-3c926bc6b24bcd3e820b3d630df4174d158e3bdce67a60d06e62ed4a515096e7.js"></script>
```

integrity属性是资源完整性规范的一部分，它允许你为script提供一个hash，用来进行验签，检验加载的JavaScript文件是否完整。

上面的代码来自github源码， integrity="sha256-PJJrxrJLzT6CCz1jDfQXTRWOO9zmemDQbmLtSlFQluc="告诉浏览器，使用sha256签名算法对下载的js文件进行计算，并与intergrity提供的摘要签名对比，如果二者不一致，就不会执行这个资源。

intergrity的作用有：

+ 减少由【托管在CDN的资源被篡改】而引入的XSS 风险
+ 减少通信过程资源被篡改而引入的XSS风险（同时使用https会更保险）
+ 可以通过一些技术手段，不执行有脏数据的CDN资源，同时去源站下载对应资源

> 注意：启用 SRI 策略后，浏览器会对资源进行 CORS 校验，这就要求被请求的资源必须同域，或者配置了 Access-Control-Allow-Origin 响应头

## 五、script标签的crossorigin属性
crossorigin的属性值可以是anonymous、use-credentials，如果没有属性值或者非法属性值，会被浏览器默认做anonymous。crossorigin的作用有三个：

+ crossorigin会让浏览器启用CORS访问检查，检查http相应头的Access-Control-Allow-Origin
+ 对于传统script需要跨域获取的js资源，控制暴露出其报错的详细信息
+ 对于module script，控制用于跨域请求的[凭据模式](https://fetch.spec.whatwg.org/#concept-request-credentials-mode)

我们在收集错误日志的时候，通常会在window上注册一个方法来监测所有代码抛出的异常：

```
window.addEventListener('error', function(msg, url, lineno, colno, error) {
  var string = msg.toLowerCase()
  var substring = "script error"
  if (string.indexOf(substring) > -1){
    alert('Script Error: See Browser Console for Detail')
  } else {
    var message = {
      Message: msg,
      URL:  url,
      Line: lineNo,
      Column: columnNo,
      'Error object': JSON.stringify(error)
    }
    // send error log to server
    record(message)
  }
  return false
})
```

但是对于跨域js来说，只会给出很少的报错信息：'error: script error'，通过使用crossorigin属性可以使跨域js暴露出跟同域js同样的报错信息。但是，资源服务器必须返回一个Access-Control-Allow-Origin的header，否则资源无法访问。

## 六、动态导入script

```
function loadError (error) {
  throw new URIError(`The script ${error.target.src}  is not accessible.`)
}

function importScript (src, onLoad) {
  var script = document.createElement('script')
  script.onerror = loadError
  script.async = false
  if (onLoad) { script.onload = onLoad }
  document.header.appendChild(script)
  script.src = src
}
```

> 可以上面的方法动态加载js资源，但是要注意的是，默认append到文档中的script会异步执行（可以理解为默认拥有async属性，如果需要加载的js按顺序执行，需要设置async为false）

## 七、script标签的onerror
+ JavaScript运行时的错误（抛出的语法错误和异常）发生时，实现了ErrorEvent接口的error事件在window上触发，并且调用window.onerror(或者window.addEventListener('error, cb))的回调函数

+ 当资源（如 `<img>` 或 `<script>`）无法加载，或者启用SRI策略资源不完整时，使用Event接口的error事件在会在该资源元素处触发，元素上的onerror回调函数被调用

## 八、script标签与innerHTML
通过 innerHTML 动态添加到页面上的 script 标签则不会被执行

document.head.innerHTML += `<script>alert('不会执行')</script>`

## 参考资料：
+ [whatwg scripting](https://html.spec.whatwg.org/multipage/scripting.html)
+ [js-modules](https://blog.whatwg.org/js-modules)
+ [subResource intergrity](https://imququ.com/post/subresource-integrity.html)
+ [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)
+ [ErrorEvent](https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent)


## 往期「每日一题」

### 1、JavaScript && ES6

+ 第 39 题：[【每日一题】(39题)谈谈JS的函数扩展？](https://mp.weixin.qq.com/s/X8fgfydIjb2eOrVCAc3sDA)

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
