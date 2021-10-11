有小伙伴后台问我，为啥停更了，因为最近太忙了，没有时间来更新，后续尽量会在休息的时候准备好文章，合理安排时间，毕竟写作✏️是一件快乐的事情。

> 松宝写代码 ｜ songEagle

今天给大家带来的是之前reduce的「JavaScript数组reduce()方法详解及奇淫技巧」，觉得的确不错，意想不到。

![松宝写代码公众号](https://cdn.nlark.com/yuque/0/2021/png/276016/1629471862110-794e77db-1f7e-46aa-a07b-4b4acd2b5bbb.png?x-oss-process=image%2Fresize%2Cw_900%2Climit_0)

## 一、前言
reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

reduce() 可以作为一个高阶函数，用于函数的 compose。

reduce()方法可以搞定的东西，for循环，或者forEach方法有时候也可以搞定，那为啥要用reduce()？这个问题，之前我也想过，要说原因还真找不到，唯一能找到的是：通往成功的道路有很多，但是总有一条路是最捷径的，亦或许reduce()逼格更高。

## 二、语法
```js
arr.reduce(callback,initialValue)
```
返回最后一个值，reduce 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 reduce 的数组。

## 三、实例解析intialValue参数
1、第一个例子：
```js
var arr = [1, 2, 3, 4];
var sum = arr.reduce(function(prev, cur, index, arr) {
    console.log(prev, cur, index);
    return prev + cur;
})
console.log(arr, sum);
```

打印结果：

```
1 2 1
3 3 2
6 4 3
[1, 2, 3, 4] 10
```

2、第二个例子

```js
var  arr = [1, 2, 3, 4];
var sum = arr.reduce(function(prev, cur, index, arr) {
    console.log(prev, cur, index);
    return prev + cur;
}，0) //注意这里设置了初始值
console.log(arr, sum);
```

打印结果：

```
0 1 0
1 2 1
3 3 2
6 4 3
[1, 2, 3, 4] 10
```

这个例子index是从0开始的，第一次的prev的值是我们设置的初始值0，数组长度是4，reduce函数循环4次。

结论：如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。如果提供initialValue，从索引0开始。

注意：如果这个数组为空，运用reduce是什么情况？

```js
var  arr = [];
var sum = arr.reduce(function(prev, cur, index, arr) {
    console.log(prev, cur, index);
    return prev + cur;
})
//报错，"TypeError: Reduce of empty array with no initial value" 但是要是我们设置了初始值就不会报错，如下：

var  arr = [];
var sum = arr.reduce(function(prev, cur, index, arr) {
    console.log(prev, cur, index);
    return prev + cur;
}，0)
console.log(arr, sum); // [] 0
```

所以一般来说，提供初始值更加安全。

## 四、reduce简单用法
当然最简单的就是我们常用的数组求和，求乘积了。

```js
var  arr = [1, 2, 3, 4];
var sum = arr.reduce((x,y)=>x+y)
var mul = arr.reduce((x,y)=>x*y)
console.log( sum ); //求和，10
console.log( mul ); //求乘积，24
```

## 五、reduce高级用法
### （1）计算数组中每个元素出现的次数

```js
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

let nameNum = names.reduce((pre,cur)=>{
  if(cur in pre){
    pre[cur]++
  }else{
    pre[cur] = 1 
  }
  return pre
},{})
console.log(nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
```

### （2）数组去重
```js
let arr = [1,2,3,4,4,1]
let newArr = arr.reduce((pre,cur)=>{
    if(!pre.includes(cur)){
      return pre.concat(cur)
    }else{
      return pre
    }
},[])
console.log(newArr);// [1, 2, 3, 4]
```

### （3）将二维数组转化为一维
```js
let arr = [[0, 1], [2, 3], [4, 5]]
let newArr = arr.reduce((pre,cur)=>{
    return pre.concat(cur)
},[])
console.log(newArr); // [0, 1, 2, 3, 4, 5]
```

### （4）将多维数组转化为一维

```js
let arr = [[0, 1], [2, 3], [4,[5,6,7]]]
const newArr = function(arr){
   return arr.reduce((pre,cur)=>pre.concat(Array.isArray(cur)?newArr(cur):cur),[])
}
console.log(newArr(arr)); //[0, 1, 2, 3, 4, 5, 6, 7]
```

### （5）对象里的属性求和

```js
var result = [
    {
        subject: 'math',
        score: 10
    },
    {
        subject: 'chinese',
        score: 20
    },
    {
        subject: 'english',
        score: 30
    }
];

var sum = result.reduce(function(prev, cur) {
    return cur.score + prev;
}, 0);
console.log(sum) //60
```

### （6）将[1,3,1,4]转为数字1314
```js
function addDigitValue(prev,curr,curIndex,array){
    var exponent = (array.length -1) -curIndex;
    var digitValue = curr*Math.pow(10,exponent);
    return prev + digitValue;
}
var arr6 = [1,3,1,4];
var result7 = arr6.reduce(addDigitValue,0);
console.info('result7',result7);
```


## 优选文章
### 1、技术文章
+ [babel背后到底执行了什么？](https://mp.weixin.qq.com/s/Jd7sX1yNYdXPgepwlq-XLw)

+ [npm的原理](https://mp.weixin.qq.com/s/PSlUfdX3KGqvXdkC0xQ97w)

+ [快速学习Gulp并接入到项目中（一）](https://mp.weixin.qq.com/s/QQWzNvrXcqq_w3QKKvJagA)

+ [diff算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)

### 2、AB实验

+ [AB实验：MAB多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

+ [AB实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

### 3、每日一题

+ [【每日一题】(58题)算法题：接雨水问题](https://mp.weixin.qq.com/s/OtCI6SjtLCI608LOQMFQ3A)

+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)


### 4、总结

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


## 字节内推
+ [job Hunting 内推](https://mp.weixin.qq.com/s/8cydS51GUepGcebYI-NkLA)
+ [【北京】字节内推](https://www.yuque.com/docs/share/abbfa5de-51f1-4804-8654-4faddcf87616)
+ [【上海】字节内推](https://www.yuque.com/docs/share/69ec76e9-d36d-4f11-8ddf-55c6ffbeec28)
+ [【南京】字节内推](https://www.yuque.com/docs/share/1be5a1b8-8254-48a3-a76b-a6dcf399579a)
+ [【成都】字节内推](https://www.yuque.com/docs/share/0e0a07f1-7e10-4324-b654-b28850c07042)

## 个人微信

![个人微信](https://cdn.nlark.com/yuque/0/2021/png/276016/1629471940324-1389ccfc-2eb1-4c2d-834c-4f02afbea9a9.png)
## 感谢支持
> 松宝，「松宝写代码」公众号作者，也用saucxs混迹于江湖，watermark-dom包700+ star，曾在ACM校队，在字节做AB实验，担任面试官，出校招编程题，爱好折腾，致力于全栈，喜欢挑战自己。公众号有精选文章，进阶学习，每日一题，实验室，AB实验，字节内推等模块，欢迎关注和咨询，和松宝一起写代码，冲冲冲！
