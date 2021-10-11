# Node 8 升级 12 存在 array.sort 表现不一致风险
各位小伙伴们，在最近的一次Node的升级中，发现array.sort表现很糟糕啊，又有很多问题的小明开始提问了：有哪些不一致的表现？为啥会出现这种情况，在自己写的代码中如何避免这种情况？

![松宝写代码内推字节跳动](https://cdn.nlark.com/yuque/0/2021/png/276016/1629471862110-794e77db-1f7e-46aa-a07b-4b4acd2b5bbb.png?x-oss-process=image%2Fresize%2Cw_900%2Climit_0%2Fresize%2Cw_900%2Climit_0)

## 具体表现
业务中 arrray.sort 的 compareFunction 直接返回 a > b ，在 node 8 和 node 12 版本表现不一致
```js
const compare = (a,b) => {
  console.log('a:', a);
  console.log('b:', b);
  return a > b;
}

// node version < 11
[2, 1].sort(compare) 
// a:2
// b:1
// output [1, 2]

// node version >= 11
[2, 1].sort(compare)
// a:1
// b:2
// output [2, 1]
```

https://github.com/nodejs/node/issues/24294

## 影响范围
node v11 更新的 v8 引擎 7.0 版本，从 node v8 / node v10 升级到 node v11 及以上时，存在 array.sort 表现不一致的风险

(浏览器端也存在同样风险，chrome V70 更新的 V8 7.0 版本，以及不同浏览器的底层 JS 引擎实现也可能不同)

## 具体原因
错误的使用了 array.sort 方法，在 ES 规范中只对 array.sort 的 compareFunction 返回小于0，等于0，和大于0的情况做了定义，没有对返回布尔值做定义，所以直接返回 a > b 是未定义行为

![](https://cdn.nlark.com/yuque/0/2021/png/276016/1632838418532-e2a2ca59-a923-44da-8f4a-07490b7ff4f2.png)

由于 Node v11 更新了 V8 引擎的版本，而 V8 在此次更新中更新了 array.sort 的排序算法 (由插入排序和快排的混合算法更改为 timesort 算法)，底层的实现发生变化，具体表现是 compareFunction 的对源数组的比较顺序发生了变化

![](https://cdn.nlark.com/yuque/0/2021/png/276016/1632838434393-f836b202-befd-4cc6-a897-1dbea03b1163.png)


![](https://cdn.nlark.com/yuque/0/2021/png/276016/1632838441502-e49e9c4a-0875-4cd6-9c22-731c8885cb25.png)


> 排序算法的更改参考 https://v8.dev/blog/array-sort (zh: https://s0v80dev.icopy.site/blog/array-sort)

> 不同浏览器也存在类似问题可参考 http://w3help.org/zh-cn/causes/SJ9013

## 正确用法
```js
// node any version
[2, 1].sort((a, b) => a - b)
// output [1, 2]

// node any version
[2, 1].sort((a, b) => {
  if (a < b ) return -1;
  if (a > b ) return 1;
  return 0;
})
// ouput [1, 2]
```

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort


## 🌟🌟🌟【社招实习生】内推
### 🙋1、内推对象 
优秀的同学们
### 🌟2、投递方式
（在线岗位即为在招，内推链接进入投递即为内推，同样无笔试哦）投递链接：https://job.toutiao.com/s/eohRQ1L


## 🌟🌟🌟【校招】内推
### ⏰1、校招时间 
简历投递时间：2021年7月8日-10月31日 
### 🙋2、内推对象 
校招：2022届技术校招生，毕业时间在2021年9月-2022年8月范围内。
### 📖3、注意事项
校招只允许候选人自己通过内推码上传简历
### 🌟4、内推码：**8J5ZSB8**
字节跳动校招内推码: 8J5ZSB8 
投递链接: [https://jobs.toutiao.com/s/dUuojYC](https://jobs.toutiao.com/s/dUuojYC)，一定记得填写内推码
​


## QA

### 1、为啥内推比自己投递更靠谱？

因为内推的话，内推人可以帮你联系HR，询问内推进度，以及面试不过的话可以问一下不足的地方。

### 2、为啥找「松宝写代码」内推呢？

因为内推的人数很多，入职人数也还行，内推比较有经验，而且本身就是一名面试官，会出一些校招面试题，如果有需要可以提帮忙看看简历。

### 3、字节进入真的难吗？

个人觉得不难，实力+运气，字节有时候是需要找更优秀的人，有时候找更符合岗位和团队的人才，但是宁缺毋滥，更需要我们的候选人基础扎实，动手能力强，项目经验丰富（不仅仅是数量上的），业务理解有深度，技术不设边界，业务场景有思考，不仅仅是技术思维，不仅仅是产品思维，多方面能力强。

## 个人微信

![个人微信](https://cdn.nlark.com/yuque/0/2021/png/276016/1629471940324-1389ccfc-2eb1-4c2d-834c-4f02afbea9a9.png)

## 感谢支持
> 松宝，「松宝写代码」公众号作者，也用saucxs混迹于江湖，watermark-dom包700+ star，曾在ACM校队，在字节做AB实验，担任面试官，出校招编程题，爱好折腾，致力于全栈，喜欢挑战自己。公众号有精选文章，进阶学习，每日一题，实验室，AB实验，字节内推等模块，欢迎关注和咨询，和松宝一起写代码，冲冲冲！

## 实时更新「字节内推」
+ [job Hunting 内推（yuque）](https://github.com/saucxs/job)
+ [【北京】字节内推](https://www.yuque.com/docs/share/abbfa5de-51f1-4804-8654-4faddcf87616)
+ [【上海】字节内推](https://www.yuque.com/docs/share/69ec76e9-d36d-4f11-8ddf-55c6ffbeec28)
+ [【南京】字节内推](https://www.yuque.com/docs/share/1be5a1b8-8254-48a3-a76b-a6dcf399579a)
+ [【成都】字节内推](https://www.yuque.com/docs/share/0e0a07f1-7e10-4324-b654-b28850c07042)
+ [job Hunting 内推（Github）](https://github.com/saucxs/job)
