### 你需要知道的for in和for of 的区别和原理
#### 一、前言
上次有人问我，for in 和for of的区别，我说：for in是获取属性名，for of获取属性值。
但是他说，你说的不对。害怕，果然都是大佬。

#### 二、我们先来看一些例子
首先我们先看一个对象遍历的例子
```js
var obj = {name: 'saucxs',age: 21,sex: 1};
for(key in obj){
    console.log(key, obj[key]);
    // name saucxs
    // age 21
    // sex 1
}
for(key of obj){
    console.log(key, obj[key]);
    // typeError :obj is not iterable报错
}
```
说明obj对象没有iterable属性报错，使用不了for of。

我们现在再看一个数组遍历的例子
```js
var array = ['a','b','c'];
for(var key in array){
    console.log(key, array[key]);
    // 0 a
    // 1 b
    // 2 c
}
for(var key of array){
    console.log(key, array[key]);
    // a undefined
    // b undefined
    // c undefined
}
```
这回没有报错，为什么呢？

我们再看一个例子：
```js
var array = ['a', 'b', 'c'];
array.name = 'saucxs'
for(key in array){
    console.log(key, array[key])
    // 0 a
    // 1 b
    // 2 c
    // name saucxs
}
```

#### 三、for in的特点
for in 循环返回的值都是数据结构的**键名**。

遍历对象返回的是对象的key值，遍历数组返回的是数组的下标。

还会遍历原型上的值和手动添加的值

总的来说：for in适合遍历对象。

#### 四、for of的特点
for of 循环获取一对键值中的**键值**。

一个数据结构只要部署了Symbol.iterator属性，就被视为具有iterator接口，可以使用for of。

for of不同于forEach，for of是可以break，continue，return配合使用，for of 循环可以随时退出循环。

总的来说：for of遍历所有数据结构的统一接口。

#### 五、哪些数据结构部署了Symbol.iterator属性？
以下数据结构的有iterator接口的：
+ 数组Array
+ Map
+ Set
+ String
+ arguments对象
+ Nodelist对象，类数组
凡是部署了iterator接口的数据结构都可以使用数组的扩展运算符(...)，和解构赋值等操作。

如果我非常想让对象用for of？

可以使用Object.keys()获取对象的key值集合，在用for of。

```js
var obj = {name: 'saucxs',age: 18, sex: 1};
for(var key of Object.keys(obj)){
    console.log(key, obj[key]);
    // name saucxs
    // age 21
    // sex 1
}
```
这样也可以给一个对象部署Symbol.iterator属性。
