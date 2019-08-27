##### 十七、异步编程
核心目的：降低异步编程的复杂性。
###### 1、Promise
+ 原理：promise内部有一个状态管理器，只有三种状态：等待中（pending），已完成（resolved），拒绝（refected）。
+ 特点：1、一旦从等待中状态变成其他状态就永远不能更改状态；2、Promise解决回调地狱的问题；
3、实现链式调用；4、Promise的then方法的参数期望是函数，传入非函数则会发生值穿透
5、 Promise 构造函数只执行一次。6、支持多个并发请求。
+ 缺点：无法取消Promise，错误需要通过回调函数捕获。
+ Promise构造函数和then函数区别：构造函数内部是宏任务中的同步任务，then函数是微任务。
+ Promise实现链式调用的原理：每一个调用then函数之后都会返回一个全新的Promise，如果你在then中使用return，return的值会被Promise.resolve()包装。
+ 方法：1、then方法是回调函数，2、catch方法捕获then中发生的异常，3、resolve方法返回resolved状态的promise，reject方法返回rejected状态的promise；
4、all方法，一旦有一个状态为rejected，返回值为rejected，当所有状态都resolved时，返回一个数组。
5、race方法，一旦有一个状态改变，就会返回该状态的值
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
function Promise(fn){
  var status = 'pending'
  function successNotify(){
      status = 'fulfilled'//状态变为fulfilled
      toDoThen.apply(undefined, arguments)//执行回调
  }
  function failNotify(){
      status = 'rejected'//状态变为rejected
      toDoThen.apply(undefined, arguments)//执行回调
  }
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
  var successArray = []
  var failArray = []
  fn.call(undefined, successNotify, failNotify)
  return {
      then: function(successFn, failFn){
          successArray.push(successFn)
          failArray.push(failFn)
          return undefined // 此处应该返回一个Promise
      }
  }
}
```

###### 2、async和await
js的异步的终极解决方案。

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

##### 十八、常用的定时器函数
setTimeout、setInterval、requestAnimationFrame 各有什么特点？

+ setTimeout并不是多久后执行，而是多久后会将执行回调加入到任务队列中。
+ setInterval，和setTimeout一样并不能保证逾期的时间执行，他存在执行积累的问题。
+ requestAnimationFrame，循环定时器的需求，自带节流功能，基本可以保证在16.6毫秒内执行一次，延时效果是精确的。


##### 十九、call，apply，bind方法的作用和区别？
+ 共同点：改变函数的this的指向，改变函数的执行上下文。
+ 不同点：1、call和apply是对象的方法，通过调用方法间接调用函数；2、bind是将方法绑定在某个对象上。

##### 二十、Node.js
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

+ egg企业框架，阿里才推出的，按照约定进行开发，约定大于配置，基于koa2开发，async避免回调地狱，洋葱式中间件架构更容易后置逻辑，
内置多进程管理帮助更好利用服务器性能。

###### 5、说说RestfulAPI的规范

