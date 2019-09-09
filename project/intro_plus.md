##### 十六、异步编程
核心目的：降低异步编程的复杂性。
###### 1、Promise
+ 原理：promise内部有一个状态管理器，只有三种状态：等待中（pending），已完成（resolved），拒绝（refected）。
+ 特点：1、一旦从等待中状态变成其他状态就永远不能更改状态；2、Promise解决回调地狱的问题；
3、实现链式调用；4、Promise的then方法的参数期望是函数，传入非函数则会发生值穿透
5、 Promise 构造函数只执行一次。
+ 缺点：无法取消Promise，错误需要通过回调函数捕获。
+ Promise构造函数和then函数区别：构造函数内部是宏任务中的同步任务，then函数是微任务。
+ Promise实现链式调用的原理：每一个调用then函数之后都会返回一个全新的Promise，如果你在then中使用return，return的值会被Promise.resolve()包装。
+ 方法：1、then方法是回调函数，2、catch方法捕获then中发生的异常，3、resolve方法返回resolved状态的promise，reject方法返回rejected状态的promise；
4、all方法，一旦有一个状态为rejected，返回值为rejected，当所有状态都resolved时，返回一个数组。
5、race方法，一旦有一个状态改变，就会返回该状态的值
+ 错误捕获问题：1、reject后一定会进入then中的第二个回调，如果没有第二回调，会进入到catch中。
2、resolve后一定会进入到第一个回调中，肯定不会进入到catch中。
3、网络异常（比如断网），会直接进入到catch中，而不会进入到then的第二个回调。
4、catch捕获不了异常：1、异步异常，2、未手动调用resolve或者reject

```js
new Promise((resolve, reject) => {
    reject('fail')
}).then(item => {
    console.log(item,'1')
},(err) => {
    console.log(err, '2')
})
```
链式调用
```js
var fn = new Promise(function (resolve, reject) {
  let num = Math.ceil(Math.random() * 10)
  if (num > 5) {
    resolve(num)
  } else {
    reject(num)
  }
})
// 第一次回调
fn.then((res)=>{
  console.log(`res==>${res}`)
  return new Promise((resolve,reject)=>{
    if(2*res>15){
      resolve(2*res)
    }else{
      reject(2*res)
    }
  })
},(err)=>{
  console.log(`err==>${err}`)
}).then((res)=>{ // 第二次回调
  console.log(res)
},(err)=>{
  console.log(`err==>${err}`)
})
```

+ 实现简单promise
```js
function PromiseA(fn){
  var status = 'pending';
  var successArray = []
  var failArray = []
  function successNotify(){
      status = 'fulfilled'//状态变为fulfilled
      toDoThen.apply(undefined, arguments)//执行回调
  }
  function failNotify(){
      status = 'rejected'//状态变为rejected
      toDoThen.apply(undefined, arguments)//执行回调
  }
  fn.call(undefined, successNotify, failNotify)
  function toDoThen(){
      setTimeout(()=>{ // 保证回调是异步执行的
          if(status === 'fulfilled'){
              for(let i =0; i< successArray.length;i ++)    {
                  successArray[i].apply(undefined, arguments)//执行then里面的回掉函数
              }
          }else if(status === 'rejected'){
              for(let i =0; i< failArray.length;i ++)    {
                  failArray[i].apply(undefined, arguments)//执行then里面的回掉函数
              }
          }
      })
  }
  return {
      then: function(successFn, failFn){
          successArray.push(successFn)
          failArray.push(failFn)
          return undefined // 此处应该返回一个Promise
      }
  }
}
```

+ 实现简单promise.all
promise.all接收的是一个数组为参数，当所有的Promise都为resolve的状态时，promise.all才会成功，若有一个事变，都会失败。
```js
var p1 = Promise.resolve('a');
var p2 = Promise.resolve('b');
var p3 = Promise.resolve('c');
Promise.all([p1, p2, p3]).then(value => {
    console.log(value);   // ['a', 'b', 'c']
})
```
在看一题
```js
var p1 = new Promise((resolve, reject) => {
    resolve('hello')
}).then(result => result)
.catch(e => e)

var p2 = new Promise((resolve,reject) => {
    throw new Error('出错了')
}).then(result => result)
.catch(e => e)

Promise.all([p1,p2]).then(value => {
    console.log(value); // ['hello', Error]
}).catch(e => e)
```
上面因为p2自己可以捕获到错误，所以在Promise.all（）方法里p1，p2两个Promise都是resolve的状态，因此会调用then方法指定的回调函数。

手动实现promise.all()
```js
function promiseAll(promiseArray) {
  return new Promise(function(resolve, reject) {
    if(!promiseArray instanceof Array){
        throw new TypeError('PromiseArray must be a array')
    }
    var length = promiseArray.length;
    var resolvedCount = 0;
    var resolvedArray = new Array(length);
    for(let i=0;i<length;i++){
        (function(i) {
          Promise.resolve(promiseArray[i]).then(value => {
              resolvedCount ++;
              resolvedArray[i] = value;
              if(resolvedCount === length){
                  return resolve(resolvedArray);
              }
          },(error) => {
              return reject(error)
          }).catch(error => {
              console.log(error)
          })
        })(i)
    }
  })
}
```


###### 2、async和await
js的异步的终极解决方案。
+ 基本原理：async的parrllel和waterfall实现
+ 本质：async函数返回值使用Promise。resolve()包裹，跟then处理返回值一样。

async函数是Generator函数的语法糖，函数内部使用await表示异步。

对比async和Generator？
+ Generator函数必须依赖执行器，async函数自带执行器
+ async和await比* yield更语义化
+ async返回的是promise对象，使用then更方便，Generator返回是Iterator对象

对比async和Promise？
+ 优势：在于处理then的调用链写一堆then也很烦。
+ 缺点：await将异步代码变成同步代码，会导致性能下降。

```js
fn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 2000)
  })
}
const Fn = async () => {
  await fn().then((res) => {
    console.log(res)
  })
}
Fn()
console.log(2)
```
先输出2,2秒后输出1

循环中使用await
```js
const nums = [1,2,3,4];
const getNumIndex = index =>{
    return new Promise(resolve => {
        setTimeout(() => resolve(nums[index]), 1000)
    })
}
```

在for循环中await
```js
async function for_await() {
  console.log('循环开始')
  for(let i = 0;i<nums.length;i++){
      var value = await getNumIndex(i);
      console.log(value)
  };
  console.log('循环结束')
}
```


##### 十七、常用的定时器函数
setTimeout、setInterval、requestAnimationFrame 各有什么特点？

+ setTimeout并不是多久后执行，而是多久后会将执行回调加入到任务队列中。
+ setInterval，和setTimeout一样并不能保证逾期的时间执行，他存在执行积累的问题。
+ requestAnimationFrame，循环定时器的需求，自带节流功能，基本可以保证在16.6毫秒内执行一次，延时效果是精确的。


##### 十八、call，apply，bind方法的作用和区别？
+ 共同点：改变函数的this的指向，改变函数的执行上下文。
+ 不同点：1、call和apply是对象的方法，通过调用方法间接调用函数；2、bind是将方法绑定在某个对象上。

##### 十九、Node.js
###### 1、如何实现高并发，讲讲异步I/O、事件循环以及其优先级
+ 实现高并发：主线程处理逻辑，线程池（IO线程）处理I/O，线程池是V8的libuv实现，主线程有更多的能力去处理更多的请求。
+ 异步I/O：I/O密集型处理是Node的强项。I/O请求主要有：sql查询请求，文件流操作，http请求等。主线程不用等待结果返回，只要发出指令，就可以继续做其他事情。
+ 事件循环：异步的执行机制，浏览器的时间循环和Node事件循环。
+ I/O操作开启多线程：所有的线程都是基于node服务进程开启的，并不能充分利用cpu资源。
+ pm2进程管理器：充分利用cpu资源,pm2是一个带有均衡负载的Node应用的进程管理器。

###### 2、Node后台影响性能的瓶颈，如何避免，如何实现扩展
+ Node的性能瓶颈：不擅长cpu密集型操作，比如复杂运算，图片操作等。因为是单线程所以不擅长。

###### 3、Node模块加载的机制
+ 模块加载会经历3个阶段：路径分析，文件定位，编译执行。
+ 按照模块分类，模块加载优先级：
1、**系统缓存**；
2、**系统模块**；省略路径分析，文件定位，直接加载内存中；
3、**文件模块**；优先加载 . 和 .. 和 /开头的
4、**目录作为模块**；
5、**node_module目录模块**；对于系统模块，路径模块都找不到，从


###### 4、选择用哪个框架的标准是什么？
node框架很多：express，koa，thinkjs，egg等

+ 1、express是使用最多的框架，适合新手入门框架。不对Node已有的特性进行二次封装，只扩展web应用所需基本功能：封装路由，静态资源托管，中间件。内置jade和ejs模板引擎。
适合小型项目，不适合大型企业项目。

+ 2、koa2，是expres原班人马打造。koa解决最大问题，利用async await新语法特性，解决回调地狱问题。
特点：（1）回调处理，koa是async await没有回调，expres是普通回调。
（2）koa是洋葱中间件模式，执行到next时候，会去调用下一个中间件，下一个中间件执行完再接着执行上个中间next下面代码。
（3）koa将request和response封装在同一个上下文对象content中

+ 3、thinkjs企业框架，360团队推出的，整合了大量项目最佳实践，框架底层是koa2.x实现，兼容koa2.x所有功能。

+ egg企业框架，阿里推出的，按照约定进行开发，约定大于配置，基于koa2开发，async避免回调地狱，洋葱式中间件架构更容易后置逻辑，
内置多进程管理帮助更好利用服务器性能。

##### 二十、网络
###### 1、说说RestfulAPI的规范
总结：用URL定位资源，用Http描述操作。

+ rest描述的是网络中客户端和服务端的一种交互形式，需要看如何设计RestFul API。
+ 服务端提供的Restful API中，URL中只能使用名词来指定资源，原则上不使用动词

为什么要用RestFul api结构呢？
+ 各种客户端层出不穷，restFul通过统一的接口为web，安卓，ios提供服务。

如何科学设计RestFul呢？
+ 设置在URL的根目录
+ URL使用名词不用动词
+ 保证HEAD和GET方法安全，不会对资源状态有所改变
+ 资源地址推荐使用嵌套结构
+ 返回结果明确易懂
+ 安全，使用https，https在无线网络中不稳定。


###### 2、讲一下https和http2.0协议
###### http
http是个无状态的协议，不会保存状态。
###### http里的get请求和post请求
get请求多用于无副作用的场景，post请求多用于有副作用的场景。
区别：
+ get请求能缓存，post请求不能缓存
+ post请求比get请求安全，因为get请求都包含url里，会被浏览器保存历史记录，post不会。
+ post请求request body传输比get更多的数据，get没有
+ URL长度限制。是因为浏览器和服务器的限制，而不是http限制。比如谷歌浏览器的URL的8182个字符，
IE浏览器URL最大限制是2083个字符，等等，所以URL长度不要超过IE规定的最大长度2083个字符。
中文的utf8的最终编码的字符长度是9个字符。
+ post类型支持更多的编码类型且不对数据类型限制
###### http首部
###### 通用字段
+ Cache-Control：控制缓存行为
+ Connection：浏览器想要优先使用的连接类型，比如keep-alive，服务器配置和客户端支持
+ Data：创建报文时间
+ Pragma：报文指令
+ Via：代理服务器相关信息
+ Transfer-Encoding：传输编码方式
+ Upgrade：要求客户端升级协议
+ Warning：内容中可能存在错误

###### 请求字段
+ Accept：能正确接收的媒体类型
+ Accept-Charset：能正确接收的字符集
+ Accept-Encoding：能正确接收的编码格式列表，比如gzip
+ Host：服务器域名
+ If-Match：两端资源标记比较
+ If-Modified-Since：本地资源未修改返回304（比较时间）
+ If-None-Match：本地资源未修改返回304（比较标记）
+ User-Agent：客户端信息
+ Referer：浏览器访问的前一个页面

###### 响应字段
+ Age：资源在dialing缓存中存在的时间
+ Etag：资源标识
+ Server：服务器名字

###### 实体字段
+ Allow：资源正确的请求方式
+ Content-Encoding：内容的编码格式
+ Content-Length：request body长度
+ Expires：内容的过期时间
+ Last-modified：内容最后的修改时间


###### https
https还是通过http传输信息，但是信息是通过TLS协议进行加密。

五层网络协议：
+ 1、应用层（DNS，HTTP）：DNS解析成IP，并发送http请求，
+ 2、传输层（TCP，UDP）：建立TCP连接，
+ 3、网络层（IP，ARP）：IP寻址，
+ 4、数据链路层（PPP）：封装成帧
+ 5、物理层：传输介质

TLS协议位于应用层下，传输层上。

TLS1.2首次进行TLS协议传输需要两个RTT，接下来通过缓存会减少一个RTT。
TLS1.3首次建立只需要一个RTT，后面恢复连接不需要RTT。

TLS中使用两种加密技术，分别为：对称加密和非对称加密。

###### http2.0
http2.0位于应用层
为啥引入http2.0原因：浏览器限制同一个域名下的请求数量，当页面有需要请求很多资源的时候，
队头阻塞会导致达到最大请求数量，剩余资源要等到其他资源加载完毕后才能发起请求。

http2.0核心：
+ 二进制传输：之前传输方式文本传输，http2.0新的编码机制，传输数据都被分隔，并采用二进制格式编码。
+ 多路复用：在一个TCP中可以存在多个流，就是多个请求公用同一个TCP连接，本质是：通过帧中的标识知道属于哪个请求，避免了队头阻塞问题，极大提高传输性能。
+ Header压缩：对传输的haeder进行压缩，两端维护索引表，记录出现的header，通过键名找到对应的值。
+ QUIC协议：基于UDP实现的传输层协议，替换TCP协议。

##### 二十一、规范

###### 1、用到哪些设计模式？
java是静态编译型语言。无法动态给已存在的对象添加职责，一般使用包装类实现装饰者模式。
js是动态解释型语言。给函数动态添加职责。

1、工厂模式

工厂模式创建对象是最常用的设计模式，不暴露对象具体逻辑，将逻辑封装在一个函数中。
这个函数就是一个工厂。分为：简单工厂

(1)简单工厂
+ 优点：只需要一个正确的参数，就可以获得你所需要的对象，不用关心创建细节。
+ 缺点：对象如果很复杂，这个创建函数会变得很庞大，难以维护。。

(2)抽象工厂方法
+ 实例化对象的工厂类，在原型中设置所有对象的构造函数。

2、单例模式

保证一个类只有一个实例，并且提供访问它的全局访问点。

+ 优点：1、划分命名空间，减少全局变量的数量。2、只能被实例化一次，再次实例化生成的也是第一个实例
+ 适合场景：线程池，全局缓存，window对象，各种浮窗等


3、代理模式

代理模式主要是为其他对象提供一种代理以控制对这个对象的访问，主要解决在直接访问上带来的问题。
代理模式最基本的形式：对访问进行控制。

虚拟代理用于对那种创建开销很大本体访问，本体的实例化推迟到方法被调用的时候。

+使用场景：图片的懒加载，使用的就是虚拟代理。

4、观察者模式

很多MVVM框架都使用观察者模式的思想，观察者模式也称为发布-订阅模式。

定义对象间的一对多的依赖关系，当一个对象的状态改变时，所有依赖于它的对象都将得到通知和更新，
观察者模式提供一个订阅模型，其中对象订阅事件并在发生时得到通知，有利于面向对象设计和编程。

+ 优点：时间上解耦，对象之间解耦

实现：

(1)指定好谁充当发布者；
(2)给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者；
(3)发布消息时，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数。

5、策略模式

将算法的实现和算法的使用分离开，避免多重判断条件，具有很好的扩展性


###### 2、设计模式的六大原则？
+ 1、开闭原则：扩展开放，修改关闭。
+ 2、里氏代换原则：是开闭原则的补充，实现关键步骤是抽象化。
+ 3、依赖倒装原则：是开闭原则的基础，针对接口编程，依赖于抽象而不依赖于具体。
+ 4、接口隔离原则：多个隔离的接口，比单个接口好，降低类之间的耦合度。强调降低依赖，降低耦合。
+ 5、最少知道原则：一个实体尽量少于其他实体之间发生相互作用，使功能模块相对独立。
+ 6、合成复用原则：尽量使用合成/聚合方式，而不是使用继承



##### 二十二、webpack
1、什么是webpack

打包模块化的工具，通过loader转换文件，通过plugin扩展功能，最终输出多个模块组合的文件。

2、webpack入口文件配置，多个入口怎么配置？

在entry配置入口文件，web-webpack-plugin插件的WebPlugin会为entry生成一个包含这个入口所有依赖文件的chunk。

单页面，需要配置一个entry指明执行入口

多页面，为每一个entry配置webPlugin太麻烦，配置页面入口目录。

3、代码分隔优化？

代码分隔优化对浏览器首屏效果提升很大。

首先将抽出基础库，与业务代码分离；
然后通过commonChunkPlugin提取多个代码块都依赖的代码为一个单独chunk。

4、什么是模块更新？

修改代码，不用手动刷新浏览器就可以更新。

原理：webpack-dev-server启动一个服务，使用watch监控文件变化，重新打包，通过websocket建立
浏览器和webpack服务的双向通信，根据新旧模块的hash值来进行模块热替换，然后通过jsonp请求获取
最新模块代码，然后浏览器进行热更新模块。如果热更新失败，会回退，进行浏览器刷新获取最新打包代码。。

5、webpack构建流程？（webpack原理）

webpack运行流程时一个串行过程。
+ (1)初始化参数：从配置文件和shell中读取合并参数，得到最终参数。
+ (2)开始编译：上一步参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法执行编译
+ (3)确定入口：根据配置的entry找到入口文件，开始解析文件构建AST语法树，找出依赖，递归执行。
+ (4)编译模块：从入口文件开始，调用所有配置的loader对模块进行编译，找出模块依赖的模块，再递归，
直到找到入口依赖文件都经过本步骤的处理。
+ (5)完成模块编译：编译模块结束后，得到每一个模块编译后的最终内容，以及他们之间的依赖关系。
+ (6)输出资源：根据入口和模块之间关系，组装一个个包含多个模块的chunk，再把chunk转换成单独的文件输出列表
+ (7)输出完成：确定好输出内容后，根据配置输出路径和文件名，吧输出列表内容写入到文件系统中。


6、如何利用webpack优化前端性能？

+ (1)压缩代码。使用uglifyPlugin和paralleUglifyPlugin压缩js，cssnano压缩css，webpack4使用production模式，自动开启代码压缩。
+ (2)利用CDN加速。将静态资源路径修改为CDN对应路径，修改loader的publicPath修改资源路径。
+ (3)Tree Shaking。使用webpack追加参数或者使用es6模块开启Tree Shaking
+ (4)优化图片，小图用base64，修饰图使用css实现
+ (5)按照路由拆分代码，实现按需加载，提取公共代码
+ (6)给打包出来文件名添加哈希，实现浏览器缓存文件。

7、如何提高webpack的构建速度？

+ (1)多入口，使用commonsChunkPlugin提取公共代码
+ (2)通过external配置提取常用库
+ (3)使用happypack实现多线程加速编译
+ (4)使用webpack-uglify-parallel提升uglifyPlugin压缩速度，因为uglify-parallel采用多核并行压缩提升速度。
+ (5)使用tree-shaking提出多余代码

8、webpack的loader的原理，plugin的原理？对比分析一下？
+ loader原理：
其实是一个nodejs的模块，导出一个函数，主要是使用正则进行转换。
功能：传入内容，转换内容，返回内容。webpack还提供了一些API给loader调用。
loader只能处理一个个单独的文件而不能处理代码块
```js
const sass = require('node-sass');
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  return sass(source);
};
```
+ plugin原理：
plugin在webpack的运行的生命周期中，监听事件，通过webpack提供API改变输出结果。
涉及到两个方法：（1）compiler存放webpack的配置。
（2）compilation：webpack监听文件变化自动编译机制。

+ 不同：
（1）作用不同
（2）用法不同：loader在rule中配置，类型是数组，每一项是Object；
plugin是单独配置，类型是数组，每一项都是plugin实例。

9、webpack的如何实现按需加载？
webpack提供了require.ensure()方法，
```js
require.ensure(dependencies:String[],callback:function(require),chunkName:String)
```
第一个参数为声明当前模块所以依赖的模块，它在回调函数加载前执行，第二个参数为所有模块加载完成后触发的回调函数，第三个为所声明的模块名

webpack提供了2种拆分代码
+ import()语法，实现动态导入（import会调用内部用到promise）
+ webpack特定的require,ensure
```js
 {
    path: '/home',
    name: 'home',
    component: resolve => require.ensure([], () => resolve(require('./views/home')), 'home')
  },
```
实际开发中，使用第一种。

+ (1)webpack中output的设置并不决定是否拆分代码。
+ (2)拆分代码决定因素在import语法上。
+ (3)webpack在扫描到代码中有import语法，才决定执行拆分代码。


10、webpack的plugin里的UglifyJsPlugin的作用？

压缩js，减少体积，但是会拖慢webpack编译速度，开发的时候关闭，部署时候再打开。

11、webpack中的webpack-bundle-analyzer插件作用？

查看项目打包后每一个包的体积，以及一些包里面的情况，然后从而找到需要优化的地方。

12、webpack-merge插件作用？

当项目变大的时候，需要进行配置分离，webpack-merge是用来合并配置分离的部分，连接数组，合并对象。

13、extract-text-webpack-plugin插件作用？

抽离css样式，防止样式打包在js中。

14、optimize-css-assets-webpack-plugin插件作用？

用于压缩优化css资源。

##### 二十三、babel
1、babel中将ES6转成ES5的原理是什么？
如果是转换新语法，主要是babel-preset-es2015。
如果是转换新API，新增原型方法，原生对象等，主要是babel-polyfill。

babel的工作原理：

babel的转译过程分为三个阶段：parsing（解析），transforming（转译），generating（生成）。

比如 ES6的转换为ES5：

ES6代码输入-->babylon进行词法解析，得到AST-->plugin用babel-traverse对AST进行遍历转译
-->得到新的AST-->用babel-generator通过AST生成ES5代码

+ plugins
所以这些plugin插件主要是咋子babel的第二阶段生效。

+ presets
自行配置转译麻烦，presets是babel官方预设的插件集。

+ polyfill
针对ES2015+环境的shim模拟。实际babel-polyfill把core-js和regenerator runtime包装。

+ babel核心包

(1)babel-core：babel转译器本身，提供babel的转译API，比如babel.transform。

(2)babylon：js的词法解析器

(3)babel-traverse：用于对AST的遍历，主要给plugin

(4)babel-generator：根据AST生成代码


2、babel的plugins里的transform-runtime以及stage-0，stage-1，stage-2的作用？

这个写在根目录的.babelrc文件里。

+ transform-runtime作用：babel转译后要实现源代码同样的功能需要借助一些帮助函数，这样导致编译后体积变大，
babel提供单独的包babel-runtime**供编译模块复用工具函数**。
+ stage-0作用：支持ES7的一些提案的支持；包含stage-0，1,2,3所有的功能，还支持一些插件。
+ stage-1作用：包含stage-2和3的所有功能，还支持一些插件，比如支持jsx的写if表达式，使用::操作符快速切换上下文。
+ stage-2作用：包含stage-3的所有功能，还支持一些插件，比如ES6的解构赋值扩展。尾逗号函数功能。
+ stage-3作用：支持async、await，支持**进行幂运算

3、babel的plugin里的babel-polyfill的作用？

babel默认只转新的js语法，不转新API。比如：Iterator，Generator，Set，Maps，Proxy，Reflect，Symbol，Promise等
全局对象和比如Object.assign等全局方法都不会转译。如果想用，可以使用babel-polyfill。




##### 二十四、js
###### 1、DOM事件的绑定的几种方式
事件捕获，目标事件，事件冒泡

+ html属性（onclick方法）
+ dom元素属性（onclick方法）DOM level 0
+ DOM level 2，比如addEventListener和jq的on，jq的click
+ DOM level 3，DOM2的基础上添加更多事件类型

###### 2、DOM事件中target和currentTarget的区别
+ event.target返回触发事件的元素
+ event.currentTarget返回绑定事件的元素

###### 3、平时自己怎么解决跨域的？
+ 1、nginx的代理跨域：add_header 为Access-Control-Allow-Origin *。同源策略是浏览器安全策略，不是htttp协议。服务端使用http协议，不会执行js脚本。
+ 2、跨域资源共享CORS：服务端设置Access-Control-Allow-Origin，如果需要cookie请求，前后端都需要设置。
+ 3、node中间件代理跨域：原理和nginx的相同，启动一个代理服务器，实现数据的转发。
+ 4、jsonp跨域：核心是动态添加，利用js标签的src这个属性有跨域特性，只能用get请求，
+ 5、postMessage跨域：H5中新增的API，postMessage(data,origin)方法接受两个参数
+ 6、webSocket协议跨域：H5的新协议，实现浏览器和服务器双向通信，允许跨域通讯，
websocket API使用不方便，使用socketio，很好封装webSocket，简单灵活的接口，提供了浏览器向下兼容。
+ 7、iframe跨域，可以document.domain，以及location.hash，以及window.name。

###### 4、类型判断
基本类型（**存储在栈中，按值访问**）：String、Number、Boolean、Symbol、Undefined、Null 

引用类型（**存储在堆中，按址访问**）：Object，还包括 Function 、Array、RegExp、Date 

(1)typeof
```js
typeof('saucxs')    //'string'
typeof 'saucxs'   //'string'
typeof function(){console.log('saucxs')}   //'function'
typeof ['saucxs','songEagle',1,2,'a']    //'object'
typeof {name: 'saucxs'}    //'object'
typeof 1   //'number'
typeof undefined     //'undefined'
typeof null    //'object'
typeof /^\d/   //'object'
typeof Symbol   // 'function'
typeof new Date()  // 'object'
typeof new Error()  // 'object'
```
(2)instanceof检测原型

用来检测对象类型。A instanceof B用来判断A是否为B的实例
```js
[] instanceof Array    //true
[] instanceof Object    //true
new Array([1,43,6]) instanceof Array    // true
new Array([1,43,6]) instanceof Object   // true

{} instanceof Object   // 原型上没有定义  Uncaught SyntaxError: Unexpected token instanceof
({})  instanceof Object;   //true
Object.create({'name': 'saucxs'}) instanceof  Object   //true
Object.create(null) instanceof  Object    //false  一种创建对象的方法，这种方法创建的对象不是Object的一个实例

new Date() instanceof Date   //true
new Date() instanceof Object   //true

'saucxs' instanceof Object   //false
'saucxs' instanceof String  //false
new String("saucxs") instanceof Object  //true
new String("saucxs") instanceof String  //true

1 instanceof Object   //false
1 instanceof Number   //false
new Number(1) instanceof Object  //true
new Number(1) instanceof Number  //true

true instanceof Object   //false
true instanceof Boolean   //false
new Boolean(true) instanceof Object  //true
new Boolean(true) instanceof Boolean   //true

null instanceof Object    //false
undefined instanceof Object  //false
Symbol() instanceof Symbol   //false
```
(3)数组检测

ES5 提供了 Array.isArray() 方法

(4)Object.prototype.toString

至少识别11种类型
```js
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]
Math    //[object Math]
JSON  //[object JSON]
```

(5)判断是不是DOM元素
```js
isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};
```

(6)判断空对象

for循环一旦执行，就说明有属性
```js
function isEmptyObject( obj ) {
        var name;
        for ( name in obj ) { return false; }
        return true;
}
```

(7)判断window对象

有一个window属性指向自身
```js
function isWindow(obj) {
    return !!(window && obj === window)
}
```

###### 5、数组方法
(1)不改变原数组
+ concat() 连接两个或者多个数组
+ join() 把数组中所有元素放到字符串中
+ slice() 开始到结束（不包括）浅拷贝到新数组
+ map() 创建新数组并返回
+ every() 对数组中每一个元素执行回调,直到返回false
+ some() 对数组中每一个元素执行回调,直到返回true
+ filter() 创建新数组，过滤

(2)改变原数组
+ forEach() 循环，会改变元素组
+ pop() 删除数组最后一个元素
+ push() 数组末尾添加元素
+ reverse() 颠倒数组中元素位置
+ shift() 删除数组中的第一个元素
+ unshift() 向数组开头添加元素
+ sort() 对数组进行排序
+ splice() 向数组添加/删除元素
```js
var a  = [1,2,3,4,5];
a.splice(0,1);     //删除从0位置开始的1个   返回[1]   a为[2,3,4,5] 
a.splice(1,0,99)   //在1的位置插入99   [2,99,3,4,5]
a.splice(1,1,88)   //99替换为88  [2,88,3,4,5]
```
+ for in 获取属性名，包括原型链
+ object.key() 获取属性名，不包括原型链
+ for of 获取属性值
+ object.values() 获取属性值，不包括原型链

(3)ES6新数组方法
+ Array.from() 将set，map，array，字符串，类数组等转换为数组的功能。
+ Array.of() 数组的**推荐函数构造器**
+ Array.fill() 将数值填充到指定数组的开始位置和结束位置，改变原数组。
+ Array.inclues()  用来判断数组中是否含有某元素
+ Array.find()  只要找到一项内容就返回。
+ Array.findIndex()  findIndex返回的是元素在数组中的索引。
+ Array.copyWithin()  浅复制数组的一部分到同一个数组的其他位置，覆盖原来位置的值,返回新数组。
+ Array.entries()返回一个Array Iterator对象，包含所有数组中每个索引的键值对，类似[key1,value1,key2,value2,key3,value3.....]
+ Array.keys()返回一个Array Iterator对象，包含所有的键。
+ Array.values()返回一个Array Iterator对象，包含所有的值。

######  5、深浅拷贝
浅拷贝方法：Object.assign()，展开语法Spread，Array.prototype.slice()，array.prototype.concat()。

深拷贝方法：JSON.parse(JSON.stringify(object))，对于undefined，symbol和函数的会直接忽略。
###### 5.1 浅拷贝实现
思想：遍历对象，然后把属性和属性值都放在一个新的对象里。
```
var shallowCopy = function(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```

######  5.2 深拷贝实现
思想：拷贝的时候判断一下属性值的类型，如果是对象，递归调用深拷贝函数。
```
var deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
```

######  6、什么是函数柯里化？JS的api哪些用到了函数柯里化的实现？
通俗的说：在一个函数中，首先传入一部分参数，然后再返回一个新的函数去处理剩下的参数的技术。

实际的应用：

+ 延迟计算
+ bind函数，promise实现。bind函数用来改变函数的执行上下文，本身不执行，本质还是延迟计算。
+ 动态创建函数。每次调用函数都需要进行一次判断，第一次判断之后，后续调用就不需要再次判断，实现：
第一次判断之后，动态创建一个新函数处理后续传入的参数，并返回这个新函数。
+ 参数复用。比如类型判断中Object.prototype.toString.call(obj)来判断，参数复用之后：
```js
const toStr = Function.prototype.call.bind(Object.prototype.toString);
toStr([1,2,3]) // "[Object Array]"
```

###### 7、ES6的箭头函数this问题，以及拓展运算符。
箭头函数this指向：在定义时执行器上下文的this的指向，忽略块级作用域中的this。

this指向的固化，并不是因为箭头函数内部又绑定this的机制，实际是箭头函数没有自己的this。
导致内部的this就是外层代码块的this，所以不能作为构造函数。

注意的问题：
+ 箭头函数不会在其作用域生成this。
+ 箭头函数没有prototype。
+ 箭头函数补发作为构造器（new构造）或者生成器（但是可以被async修饰）。
+ 箭头函数作用域内不会生成arguments

扩展运算符（...）
+ 化参数为数组
+ 化数组为参数
+ 化可迭代对象为数组
```js
//字符串转化为数组
[..."ABCDEFG"] //["A", "B", "C", "D", "E", "F", "G"]
//解构赋值也可以这么用
var [a,b,c] = [...'123']//a = 1;b = 2;c = 3
//一行去重数组ver2:
[...new Set([1,1,2,3,3,4,4,4])] //1 , 2 , 3 ,4
//倒序参数
function reverseArgs(){
  return [...arguments].reverse()//现在可以调用数组方法了
}
reverseArgs(1,2,3,4,5)//[5, 4, 3, 2, 1]
```
+ 扩展对象
```js
var o = {a:1,b:2}
var p = Object.assign({},o)
console.log(o === p) //false
```
