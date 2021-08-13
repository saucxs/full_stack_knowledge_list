# 【每日一题】谈谈AMD、CMD、CommonJS的区别和差异？

## 前言
AMD、CMD、CommonJS是目前最常用的三种模块化书写规范，该篇文章主要是来介绍这些规范以及分析三种规范之前的差别。

## AMD
AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"，AMD的具体实现是RequireJs，它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行

AMD也采用require加载模块，加载两个参数, 第一个参数为需要加载的模块，第二个参数为回调函数，等模块加载完成后回调函数才会运行。

```js
require(['math'], function (math) {
　math.add(2, 3);
});
```

AMD由于是异步加载，浏览器不会发生假死，所以比较适合浏览器环境

## CMD
CMD 即Common Module Definition通用模块定义，玉伯实现SeaJS时遵循他提出的CMD规范。在 CMD 规范中，一个模块就是一个文件。
示例：

```js
define(function(require, exports, module) {
  // 模块代码
});
```

require是可以把其他模块导入进来的一个参数;而exports是可以把模块内的一些属性和方法导出的;module 是一个对象，上面存储了与当前模块相关联的一些属性和方法。

AMD和CMD的区别：

+ AMD是依赖关系前置,在定义模块的时候就要声明其依赖的模块;
+ CMD是按需加载依赖就近,只有在用到某个模块的时候再去require

示例：
```js
// CMD
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  // 此处略去 100 行
  var b = require('./b') // 依赖可以就近书写
  b.doSomething()
  // ... 
})

// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
  a.doSomething()
  // 此处略去 100 行
  b.doSomething()
  ...
})
```

## CommonJs
CommonJS是服务器端模块的规范，node.js的模块系统，就是参照CommonJS规范实现的。

CommonJS定义的模块分为:{模块引用(require)} {模块定义(exports)} {模块标识(module)}

require()用来引入外部模块；exports对象用于导出当前模块的方法或变量，唯一的导出口；module对象就代表模块本身。

示例：

```js
// sum.js
exports.add = function(a, b){return a + b};
// index.js
var math = require('sum');
math.add(2,3); // 5
```

CommonJs更适用于服务端，因为服务器端一般采用同步加载文件，也就是说需要某个模块，服务器端便停下来，等待它加载再执行。但是浏览器不行，采用CommonJs规范来加载模块非常容易造成假死状态，因此浏览器更需要异步加载模块。

## 总结
AMD与CMD、CommonJS的区别与优缺点：

+ CommonJs主要针对服务端，AMD/CMD主要针对浏览器端
+ AMD/CMD区别，虽然都是并行加载js文件，但还是有所区别，AMD是预加载，在并行加载js文件同时，还会解析执行该模块（因为还需要执行，所以在加载某个模块前，这个模块的依赖模块需要先加载完成）；而CMD是懒加载，虽然会一开始就并行加载js文件，但是不会执行，而是在需要的时候才执行
+ AMD优点：加载快速，尤其遇到多个大文件，因为并行解析，所以同一时间可以解析多个文件
+ AMD缺点：并行加载，异步处理，加载顺序不一定，可能会造成一些困扰，甚至为程序埋下大坑
+ CMD优点：因为只有在使用的时候才会解析执行js文件，因此，每个JS文件的执行顺序在代码中是有体现的，是可控的
+ CMD缺点：执行等待时间会叠加。因为每个文件执行时是同步执行（串行执行），因此时间是所有文件解析执行时间之和，尤其在文件较多较大时，这种缺点尤为明显。

## 相关链接
+ [Javascript模块化编程（二）：AMD规范](http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html)
+ [理解前端模块化（CommonJs,AMD和CMD）](https://www.php.cn/js-tutorial-360130.html)
+ [使用 AMD、CommonJS 及 ES Harmony 编写模块化的 JavaScript](https://justineo.github.io/singles/writing-modular-js/)



#### 更多优选文章
+ [npm的原理](https://mp.weixin.qq.com/s/PSlUfdX3KGqvXdkC0xQ97w)

+ [快速学习Gulp并接入到项目中（一）](https://mp.weixin.qq.com/s/QQWzNvrXcqq_w3QKKvJagA)

+ [diff算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)

#### AB实验

+ [AB实验：MAB多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

+ [AB实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

#### 每日一题

+ [【每日一题】(58题)算法题：接雨水问题](https://mp.weixin.qq.com/s/OtCI6SjtLCI608LOQMFQ3A)

+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)


#### 总结

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


#### 更多内推
+ [【字节急招】南京-广告算法工程师](https://mp.weixin.qq.com/s/aFCsLiFShaE2pE17NTrOUQ)

+ [【字节急招】深圳-后台开发工程师-Client Infra](https://mp.weixin.qq.com/s/t_WvJuuvwZ2efAiZjKSsdw)

+ [【提前批】「松宝写代码」内推字节跳动2022校招研发提前批](https://mp.weixin.qq.com/s/lKsgF_PlemOdW6TJrVF84w)

+ [【字节急招】多地-前端开发工程师-抖音（北京/深圳/上海/杭州）](https://mp.weixin.qq.com/s/KpWtFVQsUgind9jugevFtg)

+ [【字节急招】多地-前端研发工程师-Data](https://mp.weixin.qq.com/s/1yhT4aon2qXXlcXSK-rbuA)

+ [【字节急招】南京-前端开发工程师—数据可视化](https://mp.weixin.qq.com/s/DY1b53FvcIM5CzbAFpj_Fw)

+ [【汇总】值得关注的内推：字节内推「社招，校招及提前批，实习生」](https://mp.weixin.qq.com/s/J73JMIQpOtddnwEVNE8q3g)

+ 校招内推码：8J5ZSB8


## 感谢支持
> 松宝，「松宝写代码」公众号作者，也用saucxs混迹于江湖，watermark-dom包700+ star，曾在ACM校队，在字节做AB实验，担任面试官，出校招编程题，爱好折腾，致力于全栈，喜欢挑战自己。公众号有精选文章，进阶学习，每日一题，实验室，AB实验，字节内推等模块，欢迎关注和咨询，和松宝一起写代码，冲冲冲！

