# JavaScript系列

## 1、手动实现一个new
理解new的详细过程：
1、新生成一个对象obj；
2、新建一个构造函数Con；
3、这个新对象链接到新构造函数的原型上，obj.__proro__ = Con..prototype;
4、绑定this，执行构造函数
5、确保new出来的是个对象

```js
function createNew(){
    /*1、创建一个空的对象*/
    let obj = new Object();
    /*2、新建构造函数*/
    let Con = [].shift.call(arguments);
    /*3、链接到原型*/
    obj.__proro__ = Con.prototype;
    /*4、绑定this，执行构造函数*/
    let result = Con.apply(obj, arguments);
    /*5、确保new返回出来的是对象*/
    return typeof result === 'object' ? result : obj;
}
```
我们来检测一下这个createNew方法。
```js
function Student(name, age){
    this.name = name;
    this.age = age;
};
Student.prototype.present = function(){
  console.log('我是'+ this.name + '，今年' + this.age + '。');  
};
function createNew(){
    /*1、创建一个空的对象*/
    let obj = new Object();
    /*2、新建构造函数*/
    let Con = [].shift.call(arguments);
    /*3、链接到原型*/
    obj.__proro__ = Con.prototype;
    /*4、绑定this，执行构造函数*/
    let result = Con.apply(obj, arguments);
    /*5、确保new返回出来的是对象*/
    return typeof result === 'object' ? result : obj;
}
/*我们测试一下我们手动写的new操作：*/
const saucxs = createNew(Student, 'saucxs', '18');
saucxs.__proro__.present()
```


## 2、手动实现一个instanceof
正确判断对象的类型，内部机制：通过判断对象的原型链中是否可以找到构造函数的原型。
```js
instance.[__proto__] === instance.constructor.prototype
```
举个例子
```js
console.log(instance instanceof Object);
```

我们手动实现一个
```js
function instanceofSame(left, Right){
    /*获取构造函数原型*/
    let rightPrototype = Right.prototype;
    /*对象的原型*/
    left = left.__proto__;
    while(true){
        if(left === rightPrototype) return true;
        if(left === null) return false;
        left = left.__proto__;
    }
}
```
我们来检测一下
```js
let saucxs = {name: 'saucxs'};
console.log(instanceofSame(saucxs, Object));   // true
```


## 3、继承
js的继承通常指的是原型链的继承，通过指定原型，并可以通过原型链继承原型的属性和方法。

### 3.1 原型链继承
思想：父类的实例作为子类的原型。（或者说：子类的原型指向父类的实例）
```js
function Father() {
  this.colors = ['red','blue','green'];
}

function Son() {};
Son.prototype = new Father();

var s1 = new Son();
s1.colors.push('black');
console.log(s1.colors); // 'red,blue,green,black'

var s2 = new Son();
console.log(s2.colors);  // 'red,blue,green,black'
```

缺点：

1、原型链中引用类型值的原型，被所有的实例共享

2、子类创建实例的时候，不能向超类的构造函数传递参数


### 3.2 经典继承(构造函数继承)
思想：不使用原型，在子类型的构造函数中调用超类型的构造函数。
```js
function Father() {
  this.colors = ['red','blue','green'];
};
function Son() {
  Father.call(this); //继承Father，向父类型传递参数
};
var s1 = new Son();
s1.colors.push('black');
console.log(s1.colors); //'red,blue,green,black'

var s2 = new Son();
console.log(s2.colors); //'red,blue,green'
```
优点：

1、保证了原型链中引用类型值的原型，不被所有实例共享。

2、子类型创建实例对象时，可以向超类型的构造函数传递参数。

缺点：

1、方法都定义在构造函数中，函数复用不可用。。


### 3.3 组合继承 (最常用的继承模式)
思想：原型链继承+构造函数继承，通过原型链实现原型属性和方法的继承，通过构造函数实现实例化对象属性的继承。
```js
function Father(name) {
  this.name = name;
  this.colors = ['red','blue','green'];
};
Father.prototype.sayName = function() {
  console.log(this.name);
};

function Son(name, age) {
  Father.call(this, name);  //继承实例属性，第一次调用Father()
  this.age = age;
};
Son.prototype = new Father();  //继承父类方法，第二次调用Father()
Son.prototype.sayAge = function() {
  console.log(this.age);
};

var s1 = new Son('saucxs',18);
s1.colors.push('black');
console.log(s1.colors); // 'red,blue,green,black'
s1.sayName();  // saucxs
s1.sayAge();  // 18

var s2 = new Son('gmw', 15);
console.log(s2.colors); // 'red,blue,green'
s2.sayName(); //gmw
s2.sayAge(); // 15
```
优点：

1、原型上定义方法实现函数复用

2、实例都有自己独立的属性

缺点：

1、调用了两次父类构造函数

2、父类的实例属性和方法在子类的实例中，又在子类的原型中。


### 3.4 原型式继承
思想：直接将某一个对象赋值给构造函数的原型。
```js
    /*object方法将传入的对象执行一次浅复制，将F的原型指向传入的对象*/
function objcetSame(obj) {
  function F() {};
  F.prototype = obj;
  return new F();
}

var person = {
    name: 'saucxs',
    friends: ['gmw', 'cc', 'cxs']
};

var p1 = objcetSame(person)
p1.name = 'SAUCXS';
p1.friends.push('ROB');
console.log(p1)  
// name: "SAUCXS"
// __proto__:
//    friends: (4) ["gmw", "cc", "cxs", "ROB"]
//    name: "saucxs"

var p2 = objcetSame(person);
p2.name = 'LINDA';
p2.friends.push("HEIHEI");
console.log(p2)  
// name: "LINDA"
// __proto__:
//    friends: (5) ["gmw", "cc", "cxs", "ROB", "HEIHEI"]
//    name: "saucxs"

console.log(person)  
// friends: (5) ["gmw", "cc", "cxs", "ROB", "HEIHEI"]
// name: "saucxs"
```
ES5中有Object.create()方法，替代上面objcetSame方法

缺点：

1、原型链上继承多个实例的引用类型，存在篡改的可能

2、子类创建实例的时候，无法向父类构造函数传递参数


### 3.5 寄生式继承
思想：在原型式继承的基础上，增强对象，返回构造函数。

```js
function creatwAnother(original) {
  var clone = Object.create(original);  // ES5的创建一个新对象
  clone.sayName = function(name) {     // 增强这个对象
    console.log(name)
  };
  return clone;
};

var person = {
    name: 'saucxs',
    friends: ['gmw', 'cc', 'cxs']
};

var p1 = creatwAnother(person);
p1.sayName(person.name);
```
缺点：

1、原型链继承多个实例的引用类型属性指向相同，存在篡改的可能

2、子类创建的时候，无法传递参数


### 3.6 寄生组合式继承
思想：结合构造函数传递参数+寄生式继承。
```js
function inheritPrototype(S1, F1) {
  var prototype = Object.create(F1.prototype);   // 创建对象
  prototype.constructor = S1;                    // 增强对象
  S1.prototype = prototype;                      // 指定对象
};

// 父类初始化实例属性和方法
function Father(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
};
Father.prototype.sayName = function() {
  console.log(this.name);
};

// 借用构造函数床底增强子类实例属性
function Son(name, age){
    Father.call(this, name);
    this.age = age;
};

// 父类原型指向子类
inheritPrototype(Son, Father);

// 新增子类原型属性
Son.prototype.sayAge = function() {
  console.log(this.age);
};

var s1 = new Son('saucxs', 18);
s1.colors.push('black');
console.log(s1);   
// age: 18
// colors: (4) ["red", "blue", "green", "black"]
// name: "saucxs"
// __proto__: Father


var s2 = new Son('gmw', 15);
s2.colors.push('orange');
console.log(s2);

// age: 15
// colors: (4) ["red", "blue", "green", "orange"]
// name: "gmw"
// __proto__: Father
```
寄生组合继承集合了前面几种继承优点，几乎避免了上面继承方式的所有缺陷，是执行效率最高也是应用面最广的.

也是现在库实现的方法。


### 3.7 ES6类的extend方式
```js
// 长方形类
class Rectangle {
    /*constructor*/
    constructor(height,width){
        this.height = height;
        this.width = width;
    }
    
    /*getter*/
    get area() {
        return this.calcArea();
    }
    
    /*method*/
    calcArea(){
        return this.height * this.width;
    }
}

const rec = new Rectangle(10, 20);
console.log(rec.area);   //200

// 继承
class Square extends Rectangle {
    constructor(length){
        super(length, length);
         // 如果子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
         this.name = 'Square';
    }
    
     get area() {
        return this.height * this.width;
      }
}
const square = new Square(10);
console.log(square.area);   // 100
```



## 4、闭包
例题1
```
function f1(){
　　　　var n=999;
　　　　nAdd=function(){n+=1}

　　　　function f2(){
　　　　　　alert(n);
　　　　}
　　　　return f2;
　　}

　　var result=f1();
　　result(); // 999
　　nAdd();
　　result(); // 1000
```

例题2
```
　　var name = "The Window";

　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
　　　　　　return function(){
　　　　　　　　return this.name;
　　　　　　};
　　　　}
　　};
　　alert(object.getNameFunc()());
```

例题3
```
var name = "The Window";

　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
　　　　　　var that = this;
　　　　　　return function(){
　　　　　　　　return that.name;
　　　　　　};
　　　　}
　　};
　　alert(object.getNameFunc()());
```


## 5、深浅拷贝
### 5.1 浅拷贝实现
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

### 5.2 深拷贝实现
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


## 6、类型判断
+ 基本类型(null): 使用 String(null)
+ 基本类型(string / number / boolean / undefined) + function: 直接使用 typeof即可
+ 其余引用类型(Array / Date / RegExp Error): 调用toString后根据[object XXX]进行判断
很稳的判断封装:
```js
let class2type = {}
'Array Date RegExp Object Error'.split(' ').forEach(e => class2type[ '[object ' + e + ']' ] = e.toLowerCase()) 

function type(obj) {
    if (obj == null) return String(obj)
    return typeof obj === 'object' ? class2type[ Object.prototype.toString.call(obj) ] || 'object' : typeof obj
}
```


## 7、模块化
```js
//传统CommonJS写法
module.export = {
  field1: value1,
  field2: function(){
    //implements
  }
}
//ES6写法
//exportDefault.js
export default {
   field1: value1,
   field2: function(){
     //implements
   }
};
```

## 8、防抖和节流
### 8.1 防抖
防抖就是讲多次高频操作优化为只在最后一次执行，通常的场景是：用户输入完成之后，校验一下。
```js
// fn 回调函数， wait是时间间隔
function debounce(fn, wait, immediate) {
    /*缓存一个定时器*/
  let timer = null;
  return function() {
    let args = arguments;
    let context = this;
    
    if(immediate && !timer){
        fn.apply(context, args);
    }
    
    if(timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
        fn.apply(context, args)
    }, wait)
    
  }
}
```
总结一下：
+ 对于按钮防点击来说：（1）如果函数立即执行的，立即调用；（2）如果函数是延迟执行的，就缓存上下文和参数，放到延迟函数中执行，一旦定时器开始了，我每点击一次都会重新计时，等你点累了，定时器时间到了，定时器重置为null，就可以再次点击。
+ 对于延迟执行函数来说：清除定时器，如果是延迟调用就调用函数。


### 8.2 节流
每隔一段时间后执行一次，就是降低频率，将高频操作有华为低频操作，通常使用场景：滚动条事件，或者resize事件，通常每隔100-500ms执行一次。
```js
function throttle(fn, wait, immediate) {
  let timer = null;
  let callNow = immediate;
  return function() {
    let context = this;
    let args = arguments;
    
    if(immediate){
        fn.apply(context, args);
        callNow = false;
    }
    
    if(!timer){
        timer = setTimeout(() => {
            fn.apply(context, args);
            timer = null;
        }, wait)
    }
    
  }
}
```


## 9、函数柯里化
在一个函数中，首先填充几个参数，然后再返回一个新的函数的技术，称为函数的柯里化。通常可用于在不侵入函数的前提下，为函数 预置通用参数，供多次重复调用。
```js
const add = function add(x) {
	return function (y) {
		return x + y
	}
}

const add1 = add(1)

add1(2) === 3
add1(20) === 21
```

## 10、数组扁平化
### 10.1 es6的flat方法
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
arr.flat(Infinity);   // [1, 2, 3, 4, 5, 6, 7, 8]
```

### 10.2 parse+stringify+正则
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');   // [1, 2, 3, 4, 5, 6, 7, 8]
```

### 10.3 toString()+split
es6的flat实现原理
```js
Array.prototype.flat = function() {
    return this.toString().split(',').map(item => +item )
}
```

```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
arr.toString().split(',').map(item => +item);  // [1, 2, 3, 4, 5, 6, 7, 8]
```

### 10.4 concat+递归
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
function flatten(arr1){
    var res = [];
    for(let i = 0; i < arr1.length; i++){
        if(Array.isArray(arr1[i])){
            res = res.concat(flatten(arr1[i]));
        }else{
            res.push(arr1[i]);
        }
    }
    return res;
}
flatten(arr);    // [1, 2, 3, 4, 5, 6, 7, 8]
```

### 10.5 concat+reduce+递归
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
function flatten(arr1) {
  return arr1.reduce((prev, cur) => prev.concat(Array.isArray(cur)?flatten(cur):cur),[])
}
flatten(arr);    // [1, 2, 3, 4, 5, 6, 7, 8]
```

## 11、为啥try中放return，finally还会执行？内部机制
try中，try将**返回结果**放置到局部变量中，执行到finally之后，从局部变量中取出**返回结果**。

因此需要对返回结果进行区分是否为基本类型和引用类型：

1、返回结果是基本类型，使用栈保存，即使在finally中操作了数值，返回值不会发生改变。

2、返回结果是引用类型，使用堆保存，在finally中操作了值，返回类型会发生变化。

总结：

1、影响返回结果，前提：非finally中有return，且为非基本类型

2、不影响返回结果，前提：非finally中有return，且为基本类型

**3、基本类型在栈中存储，返回的是真实的值，引用类型在堆存储，返回的是堆的地址**
### 11.1 返回结果是基本类型值
```js
// return 执行了但是没有立即返回，而是先执行了finally
function func(){
  var a = 'saucxs';
  try{
    a = 'gmw';
    return a;
  } catch(err) {
    console.log(err, 'error')
  } finally {
    a = 'test';
    console.log(a, 'finally');
  }
}
console.log(func(), 'console'); 
// test finally  
// gmw console
```

```js
// finally 中的 return 覆盖了 try 中的 return。
function func(){
  var a = 'saucxs';
  try{
    a = 'gmw'; 
    return a;
  } catch(err) {
    console.log(err, 'error')
  } finally {
    a = 'test'  
    return a;
  }
}

console.log(func(), 'console'); 
//  test console
```

### 11.2 返回结果是引用类型的值
```js
// return 执行了但是没有立即返回，而是先执行了finally
function func(){
  var obj = {name: 'saucxs'};
  try{
    obj.name = 'gmw';
    return obj;
  } catch(err) {
    console.log(err)
  } finally {
    obj.name = 'test';
    console.log(obj, 'finally');
  }
}
console.log(func(), 'console'); 
// {name: 'test'} finally  
// {name: 'test'} console
```

```js
// finally 中的 return 覆盖了 try 中的 return。
function func(){
  var obj = {name: 'saucxs'};
  try{
    obj.name = 'gmw'; 
    return obj;
  } catch(err) {
    console.log(err, 'error')
  } finally {
    obj.name = 'test'  
    return obj;
  }
}

console.log(func(), 'console'); 
// {name: 'test'} console
```

## 12、详细描述事件循环Event Loop
### 12.1 浏览器的事件循环
#### 1、宏任务（Macro-Task）队列和微任务（Micro-Task）队列
浏览器事件循环中的异步队列有两种：macro（宏任务）队列和micro（微任务）队列。宏任务队列可以是多个，微任务队列只有一个。

+ 常见的macro-task：script代码块，setTimeout，setInterval，setImmediate，requestAnimationFrame，I/O操作，UI rendering渲染页面等。
+ 常见的micro-task：process.nextTick，MutationObserver监听（h5新特性），Promise.then，async/await，ajax，axios，catch finally，Object.observe(方法废弃)等。

### 2、详细过程：
+ 1、浏览器按照js的顺序加载script标签分隔的代码块。
+ 2、script代码块加载完毕，首先进行语法分析，一旦语法错误，就会跳出当前的script代码块。
+ 3、语法分析正确之后，立即进行预编译阶段。
+ 4、预编译阶段：1、创建变量对象（创建arguments对象，函数声明提前，变量声明提升）；2、确定作用域链；3、this指向。
+ 5、然后进入执行阶段。
+ 6、当前执行栈为空，执行栈是一个函数调用的栈结构，先进后出的原则。微任务队列为空。宏任务队列只有一个script代码块。
+ 7、全局上下文被推入执行栈，同步代码执行。执行过程中，会判断同步还是异步，通过一些接口调用和定时器，I/O等，产生新的宏任务和微任务，然后分别推进各自的任务队列中。
同步代码执行完了，script代码块会被移出宏任务队列。这个过程就是队列的宏任务的执行和出队列过程。
+ 8、上一个出队是一个宏任务，这一步我们开始处理微任务。注意点：宏任务出队时，任务是**一个一个**执行，而微任务出队，任务是一队一队的执行。因此，我们开始处理微任务队列，会逐个执行队列中的任务，知道微任务队列被清空。
+ 9、执行渲染操作，更新页面。
+ 10、检查是否有web worker任务，如果有，对其处理。
+ 11、重复执行6--10过程，直到两个队列都被清空。
+ 12、重复执行1--11过程，直到所有代码块执行完毕。


### 12.2 Node的事件循环
#### 1、简介
Node的事件循环和浏览器的事件循环是完全不同的东西。Node是采用v8作为js的解析引擎，而I/O处理也是使用自己设计的libuv库。
libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统的一些底层特性，对外提供统一的接口API，事件循环机制也是libuv里面的实现。

![node的运行机制](../image/font-end-image/node的EventLoop.png)

Node的运行机制：
+ V8引擎解析JavaScript脚本。
+ 解析代码后，调用Node API。
+ libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务结果返回给V8引擎。
+ V8引擎再将结果返回给用户。

#### 2、过程六个阶段
事件循环分为6个阶段，会按照顺序反复运行。每进入到某一个阶段，都会从对应的回调队列中取出函数去执行。
当队列为空或者执行的回调函数数量达到系统设定的阈值，就会进入到下一阶段。

![Event Loop的6个阶段](../image/font-end-image/EventLoop的6个阶段.png)

##### （1）node事件循环的顺序：

+ 外部输入数据 --》轮询阶段（poll）--》检查阶段（check）--》关闭事件回调阶段（close callback）--》定时器检测阶段（timers）--》I/O事件回调阶段（I/O callbacks）--》闲置阶段（idle，prepare）--》轮询阶段（按照顺序反复运行）

说明：
+ timers阶段：这个阶段执行timer（setTimeout，setInterval等）回调。
+ I/O callbacks阶段：处理一些上一轮循环中的少数未执行的I/O回调。
+ idle，prepare阶段： 仅node内部使用。
+ poll阶段：获取新的I/O事件，适当条件下node将阻塞在这里。
+ check阶段：执行setImmediate()的回调。
+ close callbacks阶段：执行socket的close事件回调。

注意：6个阶段不包括process.nextTick()

日常开发中，主要是timers阶段，poll阶段，check阶段包含了绝大部分异步任务。

##### （2）定时器检测阶段-timers阶段

timers阶段会执行setTimeout和setInterval回调，并且由轮询poll阶段控制。同样，在Node中定时器指定的时间也不是准确时间，只能尽快执行。

##### （3）轮询阶段--poll阶段

轮询poll阶段是一个重要阶段，主要做两件事情：

+ 1、回到timers阶段执行回调
+ 2、执行I/O回调

进入到这个阶段如果没有设定timer的话，会做个判断：

+ 1、如果poll队列不为空，会遍历回调队列并同步执行，知道队列为空或者达到系统限制。
+ 2、如果队列为空，会做个判断：
    + 如果有setImmediate回调需要执行，poll阶段会停止并且进入到check阶段执行回调。
    + 如果没有setImmediate回调，会等待回调被加入到队列中并立即执行回调，这里会有个超时时间设置防止一直等待下去

当然设定了timer，并且poll队列为空，会判断是否有timer超时，如果有的话回到timer阶段执行回调。

##### （4）检查阶段--check阶段
setImmediate的回调会被加到check队列中，从EventLoop阶段图知道，check阶段的执行顺序是在poll阶段之后。

我们看个栗子，更容易让我们理解：
```js
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
// start, 
// end, 
// promise3,  
// timer1,  
// timer2,  
// promise1,  
// promise2 
```
分析：
+ 1、一开始执行栈的同步任务（宏任务），执行完毕后，依次打出 start和end，并将2个timer依次放入timers队列。
+ 2、然后去执行微任务（和浏览器有点像），打印出promise3。
+ 3、然后进入到timers阶段，执行timer1的回调函数，打印timer1，并将promise.then回调放入微任务队列，同样的步骤执行timer2，打印timer2。(这个和浏览器差别最大的地方)，**timers阶段**有几个setTimeout/setInterval都会依次执行，并不像浏览器端，没执行一个宏任务后就去执行一个微任务队列。


#### 3、node的微任务和宏任务

Node端事件循环中的异步队列也是这两种：macro（宏任务）队列和 micro（微任务）队列。
+ 1、常见的 macro-task 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等。
+ 2、常见的 micro-task 比如: process.nextTick、new Promise().then(回调)等。

#### 4、注意点
##### （1）setTimeout和setImmediate
二者比较相似，区别：调用的时机不同。
+ 1、setImmediate：设计在poll阶段完成时执行，也就是在check阶段执行。
+ 2、setTimeout：设计在poll阶段空闲的时候，设定的时间达到后执行，也就是在timer阶段执行。

```js
setTimeout(function timeout () {
    console.log('timeout');
},0);
setImmediate(function immediate () {
    console.log('immediate');
});
```
分析上述代码：
+ 执行之后，发现：setTimeout可能执行在前，也有可能执行在后。
+ 源码中，setTimeout(fn, 0) === setTimeout(fn, 1)，进入事件循环也是需要成本的，如果在准备时候花费大于1ms，timer阶段就会直接执行setTimeout回调。
+ 如果准备时间花费小于1ms，那么就setImmediate回调先执行。

但是如果两者在异步I/O callback内部调用，总是先执行setImmediate，再执行setTimeout。
```js
const fs = require('fs')
fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate');
    })
})
// immediate
// timeout
```


##### （2）process.nextTick
process.nextTick这个函数其实是独立于Event Loop之外的，有自己的队列。当每个阶段完成后，如果存在nextTick队列，就会清空队列中的所有回调函数，并且优先于其他microtask执行。
```js
Promise.resolve().then(function() {
    console.log('promise0')
})

setTimeout(() => {
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 100)

process.nextTick(() => {
    console.log('nextTick')
    process.nextTick(() => {
        console.log('nextTick')
        process.nextTick(() => {
            console.log('nextTick')
            process.nextTick(() => {
                console.log('nextTick')
            })
        })
    })
})

setTimeout(() => {
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 1)

Promise.resolve().then(function() {
    console.log('promise3')
})


//  nextTick
//  nextTick
//  nextTick
//  nextTick
//  promise0
//  promise3
//  timer2
//  promise2
//  timer1
//  promise1
```


### 12.3 Node的事件循环与浏览器差异
+ 浏览器的Event loop是在HTML5中定义的规范，而node中则由libuv库实现。
+ 浏览器环境中，微任务的任务队列是在每一个宏任务执行完成之后执行。node中，微任务会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行微任务队列的任务。

![node与浏览器的事件循环的差异](../image/font-end-image/浏览器的EventLoop与Node的EventLoop.png)

我们看一个栗子，来说明两者区别：
```js
setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

#### 1、浏览器端运行情况
输出：
```js
// timer1
// promise1
// timer2
// promise2
```
浏览器端处理过程

![浏览器处理过程](../image/font-end-image/浏览器的事件循环.gif)


#### 2、Node端运行情况
node端运行需要分为两种情况：
+ 如果node11版本及之后，一旦执行一个阶段里的宏任务(setTimeout,setInterval,setImmediate)就会立刻执行微任务队列，跟浏览器端运行一致。最后结果：
```js
// timer1
// promise1
// timer2
// promise2
```
+ 如果是node10及之前版本，要看第一个定时器执行完，第二定时器是否在完成队列中。
    - 如果第二个计时器未在完成队列中，结果为：
    ```js
    // timer1
    // promise1
    // timer2
    // promise2
    ```
     - 如果第二个计时器已经在完成队列中，结果为：
      ```js
         // timer1
         // timer2
         // promise1
         // promise2
      ```

我们来分析一下第二个计时器不在任务队列中的情况：

1、全局脚本main执行，将2个timer依次放入timer队列，main执行完后，调用栈为空闲，任务队列开始执行。

2、首先会进入timers阶段，执行timer1的回调函数，打印timer1，并将promsie1.then回调放入微任务队列。
同样的步骤执行timer2，打印timer2。

3、至此，timer阶段执行结束，EventLoop进入下一阶段之前，执行微任务队列的所有任务，依次打印promise1，promise2。

node端处理过程：

![NODE端处理过程](../image/font-end-image/node的事件循环过程.gif)


### 12.4 看看面试题
看个栗子

浏览器端和node端执行输出：
```js
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```
输出：1,7,6,8,2,4,3,5,9,11,10,12

一共三轮事件循环：

**第一轮**：

宏任务：输出1；new Promise同步任务，输出7。

微任务队列中：process.nextTick属于微任务，输出6；然后输出8。

第一轮结束，输出1,7,6,8

**第二轮**：

宏任务：输出2；new Promise同步任务，输出4。

微任务队列中：process.nextTick属于微任务，输出3；然后输出5。

**第三轮**：

宏任务：输出9；new Promise同步任务，输出11。

微任务队列中：process.nextTick属于微任务，输出10；然后输出12。


## 13、使用promise实现串行
什么是串行？依次有序的执行，应该可以理解成同步执行。

Promise串行队列一般情况下用的不多，因为串行会阻塞，用户交互是并行的。并行发请求，前端按串行顺序接收数据。

本质上：回调的串联。

### 13.1 async/await方案
```js
async function runPromiseByAwait(myPromise){
    for(let item of myPromise){
        await item();
    }
};
```
我们测试一下：
```js
async function runPromiseByAwait(myPromise){
    for(let item of myPromise){
        await item();
    }
};
const createPromise = (time, id) => () => new Promise(solve => setTimeout(() => {
    console.log('promise',id);
    solve();
}, time))

runPromiseByAwait([
  createPromise(3000, 1),
  createPromise(2000, 2),
  createPromise(1000, 3)
]);
```
输出结果：
```js
// promise 1
// promise 2
// promise 3
```

总结：async/await利用自身改造成一个异步函数，等待每一个promise执行完毕。



### 13.2 reduce方案
原理：每次reduce的返回值会作为下次reduce回调函数的第一个参数，知道队列循环完毕。
```js
function runPromiseByReduce(myPromise) {
  myPromise.reduce(
      (previousPromise, nextPromise) => previousPromise.then(() => nextPromise()),Promise.resolve()
  )
}
```
分析一下：当上一个Promise开始执行(previousPromise.then)，当其执行完毕后再调用下一个Promise，并作为一个新的Promise返回，下次迭代会继续这个循环。

```js
function runPromiseByReduce(myPromise) {
  myPromise.reduce(
      (previousPromise, nextPromise) => previousPromise.then(() => nextPromise()),Promise.resolve()
  )
}

const createPromise = (time, id) => () => new Promise(solve => setTimeout(() => {
    console.log('promise',id);
    solve();
}, time))

runPromiseByReduce([
  createPromise(3000, 1),
  createPromise(2000, 2),
  createPromise(1000, 3)
]);
```
输出结果：
```js
// promise 1
// promise 2
// promise 3
```
分析：reduce是同步执行，在一个事件循环中就会完成，在内存中快速构建Promise执行队列。
```js
new Promise((resolve, reject) => {
    resolve();
}).then(result => {
    return result;
}).then(result => {
    return result;
});
```
reduce作用就是在内存中生成上述的队列，这样精简了代码。

总结：reduce函数整体是个同步函数，自己先执行完毕构造Promise队列，然后在内存中异步执行。


## 14、如何保证页面运行流畅的情况下处理海量数据

### 14.1 根据可视区域进行渲染（懒加载）


### 14.2 documentFragment+requestAnimation+事件委托
比如：
```
10w 条记录的数组，一次性渲染到页面上，如何处理可以不冻结UI？
```
具体：页面上有个空的无序列表节点 ul ，其 id 为 list-with-big-data ，现需要往列表插入 10w 个 li ，每个列表项的文本内容可自行定义，且要求当每个 li 被单击时，通过 alert 显示列表项内的文本内容。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>页面加载海量数据</title>
</head>

<body>
  <ul id="list-with-big-data">100000 数据</ul>
  <script>
    // 此处添加你的代码逻辑
  </script>
</body>

</html>
```
分析：获取 ul 元素，然后新建 li 元素，并设置好 li 的文本内容和监听器绑定，然后在循环里对 ul 进行 append 操作。

```js
(function() {
  const ulBox = document.getElementById("list-width-big-data");
  if(!ulBox){
      return ;
  }
  for(let i = 0; i < 10000; i++){
      const liItem = document.createElement("li");
      liItem.innnerText = i + 1;
      liItem.addEventListener("click",function() {
        alert(this.innnerText)
      });
      ulBox.appendChild(liItem);
  }
})();
```
我们发现卡顿严重，原因：每次循环的饿时候，都会修改dom结构，数据量大，导致循环时间过长，浏览器渲染帧过低。

优化方向：

+ 减少dom操作次数。
+ 缩短循环时间，减少主线程阻塞的时间。

方案：

+ documentFragment，减少dom操作次数，降低回流对性能的影响。
+ requestAnimationFrame，分治的思想，分批插入到页面中，通过requestAnimationFrame在页面重绘前插入新的节点。
+ 时间绑定，使用时间委托，而不是使用事件监听，从而减少dom事件注册数量。

```js
(function() {
  const ulBox = document.getElementById("list-width-big-data");
  if(!ulBox) return ;
  const total = 100000;  // 数据总数
  const batchNum = 10;   // 每次插入节点数，数越小，页面卡顿感下降
  const batchCount = total/batchNum;   //批处理的次数
  let batchDone = 0;
  function appendItems() {
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < batchNum; i++){
        const liItem = document.createElement("li");
        liItem.innerText = batchDone * batchNum + i + 1;
        fragment.appendChild(liItem);
    }
    /*每次批处理只修改一次dom*/
    ulBox.appendChild(fragment);
    batchDone++;
    doAppendBatch();
  };
  function doAppendBatch() {
    if(batchDone < batchCount){
        /*重绘之前。分批插入新节点*/
        window.requestAnimationFrame(appendItems)
    }
  };
  doAppendBatch();
  /*使用事件委托*/
  ulBox.addEventListener("click",function(e) {
    const target = e.target;
    if(target.tagName === "LI"){
        alert(target.innerText);
    }
  })
})
```

## 14、正则

### 1、邮箱
```
邮箱由英文字母，数字，英文句号，下划线，中划线组成，若干个
邮件名称：[a-zA-Z0-9_-]+
域名规则：【N级域名】【三级域名.】二级域名.顶级域名。等同于**.**.**.**
邮箱规则：名称@域名
最终 /^[\w+-]+@[\w+-]+(\.[\w+-]+)+$/

如果允许汉字，汉字在正则：[\u4e00-\u9fa5]
```


### 2、url解析
```
1、协议匹配(http://和https://): 
^(https|https):\/\/
2、主机名匹配(xxx.xxx.xxx 或 xxx.xxx 2种形式 由字母或数字组成。如：www.baidu.com  baidu.com  127.0.0.1)：
([0-9a-zA-Z.]+)
3、端口匹配（冒号开头+数值或者不显示，如：127.0.0.1:8080  127.0.0.0）：
(:[0-9]+)?
4、路径匹配（路径由字母，数字，斜杆，点，组成。但是首页是没有路径的。如：/xxx/xxxx/xxx.html 、 /xxx/xxx）：
([/0-9a-zA-Z.]+)?
5、查询字符串匹配（格式为：?xxx=1&ddd=2或者?xx=2）。这个不是必须项。
(\?[0-9a-zA-Z&=]+)?
6、信息片断匹配（信息片段由#，字母，数值组成，也不是必须项）
(#[0-9a-zA-Z]+)?
最终：/^(http|https):\/\/([0-9a-zA-Z.]+)(:[0-9]+)?([/0-9a-zA-Z.]+)?(\?[0-9a-zA-Z&=]+)?(#[0-9a-zA-Z]+)?/i
```

### 3、千分号
```
1、最后一个逗号：(?=\d{3}$)
2、多个逗号：(?=(\d{3})+$)
3、匹配的位置不能是开头：(?!^)(?=(\d{3})+$)
4、支持其他开头的，把^和结尾$，修改成\b：(?!\b)(?=(\d{3})+\b)
最终：/(?!\b)(?=(\d{3})+\b)/g
```


### 4、去重
主要是对字符串去重
```
/(.).*\1/g
```
```js
var demo="ababbba";
demo = demo.split(''); //把字符串转换为数组
demo = demo.sort().join(''); //首先进行排序，这样结果会把相同的字符放在一起，然后再转换为字符串
demo.replace(/(.).*\1/g,"$1")
```

## 15、ES6的数组方法
### 15.1 Array.from()
将set，map，array，字符串，类数组等转换为数组的功能。
语法：`Array.from(arrayLike[, mapFn[, thisArg]])``
#### 1、Map转换数组
```js
let map1 = new Map();
map1.set('a','程');
map1.set('b','新');
map1.set('c','松');
console.log(Array.from(map1));
//[["a","程"],["b","新"],["c","松"]]
```
#### 2、Set转换数组
```js
let set1 = new Set();
set1.add(1).add(2).add(3);
console.log(Array.from(set1));
// [1,2,3]
```
### 3、字符串转换数组
```js
console.log('%s', Array.from('hello world'));
// ["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]
```
### 4、类数组对象转换
一个类数组对象必须有length属性，且它的属性名必须是数值或者可以转换成数值的字符。
```js
let obj = {
              0: '0',
              1: '1',
              3: '3',
              length:4
          };
console.log(Array.from(obj));
// ["0", "1", undefined, "3"]
```
1、属性名为数组的索引号，没有的话，就转成undefined

```js
let obj = {
              0: '0',
              1: '1',
              3: '3',
          };
console.log(Array.from(obj));
// []
```
2、不带length属性，数组为空

```js
let obj = {
              a: '0',
              b: '1',
              d: '3',
          };
console.log(Array.from(obj));
// []
```
3、对象书香门不能转换成索引，为空

### 5、mapFn函数转换

```js
function double(arr) {
    return Array.from(arguments, function(elem) {
        return elem * 2;
    });
}
const result = double(1, 2, 3, 4);
console.log(result);
// [2, 4, 6, 8]
```
### 6、处理dom对象的应用
处理Dom对象，针对对象进行循环迭代处理.dom对象是类数组，而非真实数组，我们通过Array.from转成数组处理。
```js
const arr = document.querySelectorAll('div');
/* arr.forEach( item => console.log(item.tagName) ) */ // => wrong
Array.from(arr).forEach( item => console.log(item.tagName) );
// correct”
```

### 15.2 Array.of()
在ES6之前，我们使用 Array(...)方法声明一个数组，此方法接收一个参数，即此参数代表数组的长度而不是一个包含此值的数组，声明后会构建一个此长度的空数组，有时候会产生难以发现的错误。

因此ES6推出了Array.of()用于解决此问题，成为数组的**推荐函数构造器**
```js
let arr1 = Array(2);
console.log(arr1.length);  //  2
console.log(arr1);         // [ <2 empty items> ]

let arr2 = Array.of(1,2,3);  
console.log(arr2.length);  // 3 
console.log(arr2);         // [1,2,3]
```

### 15.3 Array.fill()
将数值填充到指定数组的开始位置和结束位置，改变原数组。

语法：`Array.prototype.fill(value[, start[, end]])``

+ value：要填充的数值，必填
+ start：填充的开始位置，选填
+ end：填充的结束位置，不包含此项，选填

注意：
+ 1、如果只有value参数，数组中多有内容为此项
+ 2、没有end，默认长度是数组长度
+ 3、start或者end为负数，对应值为 当前数值+ 数组长度
```js
let arr1 = [1,2,3,4,5]
console.log(arr1.fill(6));   // [6,6,6,6,6]

let arr2 = [1,2,3,4,5]
console.log(arr2.fill(6, 3));   //[1,2,3,6,6]

let arr3 = [1,2,3,4,5]
console.log(arr3.fill(6, 3, 4));   //[1,2,3,6,5]

let arr4 = [1,2,3,4,5]
console.log(arr4.fill(6, -3, -1));   //[1,2,6,6,5]

let arr5 = [1,2,3,4,5]
console.log(arr5.fill(6, -3, -4));   //[1,2,3,4,5]
```


### 15.4 Array.inclues()
用来判断数组中是否含有某元素，如果存在返回true，否则false。
```js
const arr = [0, 1, 1, 2, 3, 5, 8, 13];
arr.includes(0); // true
arr.includes(13); // true
arr.includes(21); // false
```
这个与indexOf()方法的区别？

+ indexOf()如果存在返回的是数组的索引位置，如果不存在就返回-1。
+ indeOf()使用严格匹配(===)判断

```js
const arr = ['Some elements I like', NaN, 1337, true, false, 0017];
console.log(arr.includes(NaN));
// true
console.log(arr.indexOf(NaN) >= 0);
// false
```
我们看一下NaN
```js
console.log(NaN == NaN);   // false
console.log(NaN === NaN);  //false

```

### 15.5 Array.find() && Array.findIndex()
#### 1、Array.find()
只要找到一项内容就返回。数组中查找目标元素，找到就返回该元素，找到一个就返回，找不到返回undefined。

语法： `arr.find(callback[,thisArg]);`
+ callback：回调函数。
+ thisArg：执行回调时候的this指向，可选。
在callback回调函数上一共有三个参数：
+ element：每一次迭代查找的数组元素
+ index：每一次迭代查找的数组元素的索引
+ array： 数组本身

```js
const arr = [1, 2, 3, 4];
const result = arr.find(function(elem) { return elem > 2; });
console.log(result);
// 3
```


#### 2、Array.findIndex()
和find很类似，findIndex返回的是元素在数组中的索引。
```js
const arr = [1,2,3,4,5,6];
let index = arr.findIndex(item => item>=3);
console.log(index);  // 3的索引为2
// 2
```

### 15.6 Array.copyWithin()
浅复制数组的一部分到同一个数组的其他位置，覆盖原来位置的值。返回这个新数组，不会改变原数组长度。
语法：``arr.copyWithin(target[,start[,end]])`
+ 1、target：定义从什么位置开始复制的索引。数组大于数组长度，不会复制。
+ 2、start：选择要复制数组内动的起始索引。为负值，当前值+数组长度。
+ 3、end：选取要复制数组的结束索引，不包含此项内容。负值也是当前值+数组长度，可选，默认数组的长度。

![Array.copyWithin()方法](../image/font-end-image/copyWithin.png)
```js
const arr1 = [1,2,3,4,5];
console.log(arr1.copyWithin(1,3,4)); //[1,4,3,4,5]

const arr2 = [1,2,3,4,5];
console.log(arr2.copyWithin(1, -2, -3)); //[1,2,3,4,5]

const arr3 = [1,2,3,4,5];
console.log(arr3.copyWithin(1, -3, -2)); //[1,3,3,4,5]
```

### 15.6 Array.entries(),Array.keys(),Array.values()
+ Array.entries()返回一个Array Iterator对象，包含所有数组中每个索引的键值对，类似[key1,value1,key2,value2,key3,value3.....]
+ Array..keys()返回一个Array Iterator对象，包含所有的键。
+ Array.values()返回一个Array Iterator对象，包含所有的值。

```js
const arr = ['a', 'b', 'c'];
console.log(...arr.entries());   // [0, "a"] [1, "b"] [2, "c"]

console.log(...arr.keys());  // 0 1 2

console.log(...arr.values());  // a b c
```


## 16、npm的原理
npm成为世界最大的包管理器，原因：用户友好。

### 1、npm init
用来初始化一个简单的package.json文件。package.json文件用来定义一个package的描述文件。

**1、npm init的执行的默认行为**

执行`npm init --yes`，全部使用默认的值。

**2、 自定义npm init行为**

npm init命令的原理是：调用脚本，输出一个初始化的package.json文件。

获取用户输入使用prompt()方法。

### 2、依赖包安装
npm的核心功能：依赖管理。执行npm i从package.json中dependencies和devDependencies将依赖包安装到当前目录的node_modules文件夹中。

**1、package定义**

npm i <package>就可以安装一个包。通常package就是我们需要安装的包名，默认配置下npm会从默认的源（Registry）中查找该包名的对应的包地址，并且下载安装。
<package>还可以是一个指向有效包名的http url/git url/文件夹路径。

package的准确定义，符合以下a)到g)其中一个条件，他就是一个package：
![package的准确定义](../image/font-end-image/package的准确定义.png)

**2、安装本地包/远程git仓库包**

共享依赖包，并非非要把包发布到npm源上才能使用。

（1）场景1：本地模块引用

开发中避免不了模块之间调用，开发中，我们把频繁调用的配置模块放在根目录，然后如果有很多层级目录，后来引用

```
const config = require(''../../../../..config)
```
这样的路径引用不利于代码重构。这时候我们需要考虑把这个模块分离出来供其他模块共享。
比如config.js可以封装成一个package放到node_modules目录下。

不需要手动拷贝或者创建软连接到node_modules目录，npm 有自己的解决方案：

方案：

1、新增config文件夹，将config.js移入文件夹，名字修改为index.js，创建package.json定义config包

```json
{
    "name": "config",
    "main": "index.js",
    "version": "0.1.0"
}
```

2、在项目的package.json新增依赖项，然后执行npm i。
```json
{
  "dependencies": {
    "config":"file: ./config"
  }
}
```
查看 node_modules 目录我们会发现多出来一个名为 config，指向上层 config/ 文件夹的软链接。这是因为 npm 识别 file: 协议的url，得知这个包需要直接从文件系统中获取，会自动创建软链接到 node_modules 中，完成“安装”过程。

（2）场景2：私有git共享package

团队内会有一些代码/公用库需要在团队内不同项目间共享，但可能由于包含了敏感内容。

我们可以简单的将被依赖的包托管到私有的git仓库中，然后将git url保存到dependencies中。npm会直接调用系统的git命令从git仓库拉取包的内容到node_modules中。

npm支持的git url格式：
```
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
```
git 路径后可以使用 # 指定特定的 git branch/commit/tag, 也可以 #semver: 指定特定的 semver range.

比如：

```
git+ssh://git@github.com:npm/npm.git#v1.0.27
git+ssh://git@github.com:npm/npm#semver:^5.0
git+https://isaacs@github.com/npm/npm.git
git://github.com/npm/npm.git#v1.0.27

```

（3）场景3：开源package问题修复

此时我们可以手动进入 node_modules 目录下修改相应的包内容，也许修改了一行代码就修复了问题。但是这种做法非常不明智！

方案：

fork原作者的git库，在自己的repo修复问题，然后将dependencies中的相应依赖改为自己修复后版本的git url就可以解决问题。


### 3、npm install如何工作
npm i执行完毕，node_modules中看到所有的依赖包。开发人员无关注node_modules文件夹的结构细节，关注业务代码中引用依赖包。

理解node_modules结构帮助我们更好理解npm如何工作。npm2到npm5变化和改进。

#### 3.1 npm2
npm2在安装依赖包，采用的是简单的递归安装方法。每一个包都有自己的依赖包，每一个包的依赖都安装在自己的node_modules中，依赖关系层层递进，构成整个依赖树，这个依赖树与文件系统中的文件结构树一一对应。

最方便的**依赖树的方式**在根目录下执行npm ls。

优点：
+ 1、层级结构明显，便于傻瓜式管理。

缺点：
+ 1、复杂工程，目录结构可能太深，深层的文件路径过长触发window文件系统中文件路径不能超过260个字符长。
+ 2、部分被多个包依赖的包在很多地方重复安装，造成大量的冗余。

#### 3.2 npm3
npm3的node_modules目录改成更加扁平状层级结构。npm3在安装的时候遍历整个依赖树，计算最合理的文件夹安装方式，所有被重复依赖的包都可以去重安装。

npm来说，同名不同版本的包是两个独立的包。

npm3的依赖树结构不再与文件夹层级一一对应。

#### 3.3 npm5
沿用npm3的扁平化依赖包安装方式。最大的变化时增加package-lock.json文件。

package-lock.json作用：**锁定依赖安装结构，**发现node_modules目录文件层级结构是与json的结构一一对应。

npm5默认会在执行npm i后生成package-lock.json文件，提交到git/svn代码库。

要升级，不要使用 5.0版本。

注意：在 npm 5.0 中，如果已有 package-lock 文件存在，若手动在 package.json 文件新增一条依赖，再执行 npm install, 新增的依赖并不会被安装到 node_modules 中, package-lock.json 也不会做相应的更新。
  

### 4、依赖包版本管理
介绍依赖包升级管理相关知识。

#### 4.1 语义化版本semver
npm依赖管理的一个重要特性采用语义化版本（semver）规范，作为版本管理方案。

语义化版本号必须包含三个数字，格式：major.minor.patch。意思是：主版本号.小版本号.修改版本号。

我们需要在dependencies中使用semver约定的指定所需依赖包的版本号或者范围。

常用的规则如下图：

![semver语义化版本](../image/font-end-image/semver语义化版本.png)

**1、任意两条规则，用空格连接起来，表示“与”逻辑，即为两个规则的交集。**

如 >=2.3.1 <=2.8.0 可以解读为: >=2.3.1 且 <=2.8.0
+ 可以匹配 2.3.1, 2.4.5, 2.8.0
+ 但不匹配 1.0.0, 2.3.0, 2.8.1, 3.0.0

**2、任意两条规则，用||连接起来，表示“或”逻辑，即为两条规则的并集。**

如 ^2 >=2.3.1 || ^3 >3.2
+ 可以匹配 2.3.1, 2,8.1, 3.3.1
+ 但不匹配 1.0.0, 2.2.0, 3.1.0, 4.0.0

**3、更直观的表示版本号范围的写法**
+ * 或 x 匹配所有主版本
+ 1 或 1.x 匹配 主版本号为 1 的所有版本
+ 1.2 或 1.2.x 匹配 版本号为 1.2 开头的所有版本

**4、在 MAJOR.MINOR.PATCH 后追加 - 后跟点号分隔的标签，作为预发布版本标签**
通常被视为不稳定、不建议生产使用的版本。
+ 1.0.0-alpha
+ 1.0.0-beta.1
+ 1.0.0-rc.3

#### 4.2 依赖版本升级
在安装完一个依赖包之后有新的版本发布了，如何使用npm进行版本升级呢？
+ npm i或者npm update，但是不同的npm版本，不同的package.json和package-lock.json文件，安装和升级表现是不同的。

使用npm3的结论：
+ 如果本地 node_modules 已安装，再次执行 install 不会更新包版本, 执行 update 才会更新; 而如果本地 node_modules 为空时，执行 install/update 都会直接安装更新包。
+ npm update 总是会把包更新到符合 package.json 中指定的 semver 的最新版本号——本例中符合 ^1.8.0 的最新版本为 1.15.0
+ 一旦给定 package.json, 无论后面执行 npm install 还是 update, package.json 中的 webpack 版本一直顽固地保持 一开始的 ^1.8.0 岿然不动

使用npm5的结论：
+ 无论何时执行 install, npm 都会优先按照 package-lock 中指定的版本来安装 webpack; 避免了 npm 3 表中情形 b) 的状况;
+ 无论何时完成安装/更新, package-lock 文件总会跟着 node_modules 更新 —— (因此可以视 package-lock 文件为 node_modules 的 JSON 表述)
+ 已安装 node_modules 后若执行 npm update，package.json 中的版本号也会随之更改为 ^1.15.0


#### 4.3 最佳实践
我常用的node是8.11.x，npm是5.6.0。
+ 使用npm >= 5.1 版本，保持package-lock.json文件默认开启配置。
+ 初始化，npm i  <package>安装依赖包，默认保存^X.Y.Z，项目提交package.json和package-lock.json。
+ 不要手动修改package-lock.json
+ 升级依赖包：
    + 升级小版本，执行npm update升级到新的小版本。
    + 升级大版本，执行npm install <package-name>@<version> 升级到新的大版本。
    + 手动修改package.json中的版本号，然后npm i。
    + 本地验证升级新版本后没有问题，提交新的package.json和package-lock.json文件。
+ 降级依赖包：
    + 正确：npm i <package-name>@<version>验证没有问题后，提交package.json和package-lock.json文件。
    + 错误：修改package.json中的版本号，执行npm i不会生效。因为package-lock.json锁定了版本。
+ 删除依赖包：
    + A计划：npm uninstall <package>。提交package.json和package-lock.json。
    + B计划：在package.json中删除对应的包，然后执行npm i，提交package.json和package-lock.json。
       
       
       
### 5、npm的sctipts
#### 5.1 基本使用
npm scripts是npm的一个重要的特性。在package.json中scripts字段定义一个脚本。

比如：
```json
{
    "scripts": {
        "echo": "echo HELLO WORLD"
    }
}
```
我们可以通过npm run echo 命令执行这段脚本，就像shell中执行echo HELLO WOLRD，终端是可以看到输出的。

总结如下：
+ npm run 命令执行时，会把./node_modules/.bin目录添加到执行环境的PATH变量中。全局的没有安装的包，在node_modules中安装了，通过npm run 可以调用该命令。
+ 执行npm 脚本时要传入参数，需要在命令后加 -- 表明，比如 npm run test -- --grep="pattern" 可以将--grep="pattern"参数传给test命令。
+ npm 还提供了pre和post两种钩子的机制，可以定义某个脚本前后的执行脚本。
+ 运行时变量：npm run 的脚本执行环境内，可以通过环境变量的方式获取更多的运行相关的信息。可以通过process.env对象访问获得：
    + npm_lifecycle_event：正在运行的脚本名称
    + npm_package_<key>：获取当前package.json中某一个字段的匹配值：如包名npm_package_name
    + npm_package_<key>_<sub-key>：package中的嵌套字段。

#### 5.2 node_modules/.bin目录
保存了依赖目录中所安装的可供调用的**命令行包**。本质是一个可执行文件到指定文件源的映射。

例如 webpack 就属于一个命令行包。如果我们在安装 webpack 时添加 --global 参数，就可以在终端直接输入 webpack 进行调用。

上一节所说，npm run 命令在执行时会把 ./node_modules/.bin 加入到 PATH 中，使我们可直接调用所有提供了命令行调用接口的依赖包。所以这里就引出了一个最佳实践：

+ 将项目依赖的命令行工具安装到项目依赖文件夹中，然后通过 npm scripts 调用；而非全局安装

**于是 npm 从5.2 开始自带了一个新的工具 npx.** 

#### 5.3 npx

npx 的使用很简单，就是执行 npx <command> 即可，这里的 <command> 默认就是 ./node_modules 目录中安装的可执行脚本名。例如上面本地安装好的 webpack 包，我们可以直接使用 npx webpack 执行即可。

#### 5.4 用法
+ 1、传入参数
```json
"scripts": {
  "serve": "vue-cli-service serve",
  "serve1": "vue-cli-service --serve1",
  "serve2": "vue-cli-service -serve2",
  "serve3": "vue-cli-service serve --mode=dev --mobile -config build/example.js"
}
```
除了第一个可执行的命令，以空格分割的任何字符串都是参数，并且都能通过process.argv属性访问。

比如执行npm run serve3命令，process.argv的具体内容为：
```
[ '/usr/local/Cellar/node/7.7.1_1/bin/node',
  '/Users/mac/Vue-projects/hao-cli/node_modules/.bin/vue-cli-service',
  'serve',
  '--mode=dev',
  '--mobile',
  '-config',
  'build/example.js'
]
```

+ 2、多命令运行
在启动时可能需要同时执行多个任务，多个任务的执行顺序决定了项目的表现。

（1）串行执行

串行执行，要求前一个任务执行成功之后才能执行下一个任务。使用 && 服务来连接。
```
npm run scipt1 && npm run script2
```
> 串行执行命令，只要一个命令执行失败，整个脚本会中止的。

（2）并行执行

并行执行，就是多个命令同时平行执行，使用 & 符号来连接。
```
npm run script1 & npm run script2
```

+ 3、env 环境变量
在执行npm run脚本时，npm会设置一些特殊的env环境变量。其中package.json中的所有字段，都会被设置为以npm_package_ 开头的环境变量。


+ 4、指令钩子
在执行npm scripts命令（无论是自定义还是内置）时，都经历了pre和post两个钩子，在这两个钩子中可以定义某个命令执行前后的命令。
比如在执行npm run serve命令时，会依次执行npm run preserve、npm run serve、npm run postserve，所以可以在这两个钩子中自定义一些动作：

```json
"scripts": {
  "preserve": "xxxxx",
  "serve": "cross-env NODE_ENV=production webpack",
  "postserve": "xxxxxx"
}
```
+ 5、常用脚本示例
```
// 删除目录
"clean": "rimraf dist/*",

// 本地搭建一个http服务
"server": "http-server -p 9090 dist/",

// 打开浏览器
"open:dev": "opener http://localhost:9090",

// 实时刷新
"livereload": "live-reload --port 9091 dist/",

// 构建 HTML 文件
"build:html": "jade index.jade > dist/index.html",

// 只要 CSS 文件有变动，就重新执行构建
"watch:css": "watch 'npm run build:css' assets/styles/",

// 只要 HTML 文件有变动，就重新执行构建
"watch:html": "watch 'npm run build:html' assets/html",

// 部署到 Amazon S3
"deploy:prod": "s3-cli sync ./dist/ s3://example-com/prod-site/",

// 构建 favicon
"build:favicon": "node scripts/favicon.js",
```


### 6 npm配置
#### 6.1 npm config
+ 通过npm config ls -l 可查看npm 的所有配置，包括默认配置。
+ 通过npm config set <key> <value>，常见配置：
    + proxy，https-proxy：指定npm使用的代理
    + registry：指定npm下载安装包时的源，默认是https://registry.npmjs.org。可以指定私有的registry源。
    + package-lock.json：指定是否默认生成package-lock.json，建议保持默认true。
    + save ：true/false指定是否在npm i之后保存包为dependencies，npm5开始默认为true。
+ 通过npm config delete <key> 删除指定的配置项。    


#### 6.2 npmrc文件
可以通过删除npm config命令修改配置，还可以通过npmrc文件直接修改配置。
+ npmrc文件优先级由高到低，包括：
    + 工程内配置文件：项目根目录下的.npmrc文件
    + 用户级配置文件：用户配置里
    + 全局配置文件
    + npm内置配置文件
我们可以在自己的团队中在根目录下创建一个.npmrc文件来共享需要在团队中共享的npm运行相关配置。

比如：我们在公司内网下需要代理才能访问默认源：https://registry.npmjs.org源；或者访问内网的registry，就可以在工作项目下新增.npmrc文件并提交代码库。

示例配置：
```
proxy = http://proxy.example.com/
https-proxy = http://proxy.example.com/
registry = http://registry.example.com/
```
这种在工程内配置文件的优先级最高，作用域在这个项目下，可以很好的隔离公司项目和学习研究的项目两种不同环境。

**将这个功能与 ~/.npm-init.js 配置相结合，可以将特定配置的 .npmrc 跟 .gitignore, README 之类文件一起做到 npm init 脚手架中，进一步减少手动配置。**

#### 6.3 node版本约束
一个团队中共享了相同的代码，但是每个人开发机器不一致，使用的node版本也不一致，服务端可能与开发环境不一致。

+ 这就带来了不一致的因素----方案：声明式约束+脚本限制。

+ 声明：通过package.json的engines属性声明应用运行所需的版本要求。例如我呢项目中使用了async，await特性，得知[node查阅兼容表格](https://node.green/)得知最低支持版本是7.6.0.因此指定engines配置为：
```json
{
  "engines": {"node": ">=7.6.0"}
}
```
+ 强约束(可选)：需要添加强约束，需要自己写脚本钩子，读取并解析engines字段的semver range并与运行环境做比对校验并适当提醒。

### 总结
+ npm init初始化新项目
+ 统一项目配置：需要团队共享npm config配置项，固化到.npmrc文件中
+ 统一运行环境：统一package.json，统一package-lock.json文件。
+ 合理使用多样化的源安装依赖包
+ 使用npm版本：>= 5.2版本
+ 使用npm scripts和npx管理相应脚本
+ 安全漏洞检查：npm audit fix修复安全漏洞的依赖包（本质：自动更新到兼容的安全版本）



## 17、babel
babel对于大多数前端开发人员来说，不陌生，但是背后的原理海慧寺黑盒。

我们需要了解babel背后的原理在我们开发中广泛应用。

### 17.1 babel简单应用
```
[1,2,3].map(n => n+1);
```
经过babel转译之后，代码变成这样
```
[1,2,3].map(function(n){
  return n + 1;
})
```
那我们应该知道了babel定位：babel将ES6新引进的语法转换为浏览器可以运行的ES5语法。

### 17.2 babel背后
babel过程：解析----转换---生成。

![babel背后过程](../image/font-end-image/babel.png)

我们看到一个叫AST(抽象语法树)的东西。

主要三个过程：

+ 解析：将代码（字符串）转换为AST（抽象语法树）。
+ 转换：访问AST的节点进行变化操作生成新的AST。
+ 生成：以新的AST为基础生成代码

### 17.3 过程1：代码解析（parse）
代码解析（parse）将一段代码解析成一个数据结构。其中主要关键步骤：
+ 词法分析：代码（字符串）分割成token流。即语法单元组成的数组。
+ 语法分析：分析token流（生成的数组）生成AST。

#### 1.1词法分析
词法分析，首先明白JS中哪些属于语法单元？
+ 数字：js中科学计数法以及普通数组都是语法单元。
+ 括号：(和)只要出现，不管意义都算是语法单元。
+ 标识符：连续字符，常见变量，常量，关键字等等
+ 运算符：+，-，*，/等。
+ 注释和中括号。

我们来看一下简单的词法分析器（Tokenizer）
```
// 词法分析器,接收字符串返回token数组
export const tokenizer = (code) => {

    // 储存 token 的数组
    const tokens  = [];

    // 指针
    let current = 0;

    while (current < code.length) {
        // 获取指针指向的字符
        const char = code[current];

        // 我们先处理单字符的语法单元 类似于`;` `(` `)`等等这种
        if (char === '(' || char === ')') {
            tokens.push({
                type: 'parens',
                value: char,
            });

            current ++;

            continue;
        }

        // 我们接着处理标识符,标识符一般为以字母、_、$开头的连续字符
        if (/[a-zA-Z\$\_]/.test(char)) {
            let value = '';
            value += char;
            current ++;

            // 如果是连续字那么将其拼接在一起,随后指针后移
            while (/[a-zA-Z0-9\$\_]/.test(code[current]) && current < code.length) {
                value += code[current];
                current ++;
            }

            tokens.push({
                type: 'identifier',
                value,
            });

            continue;
        }


        // 处理空白字符
        if (/\s/.test(char)) {
            let value = '';
            value += char;
            current ++;

            //道理同上
            while (/\s]/.test(code[current]) && current < code.length) {
                value += code[current];
                current ++;
            }

            tokens.push({
                type: 'whitespace',
                value,
            });

            continue;
        }


        // 处理逗号分隔符
        if (/,/.test(char)) {

            tokens.push({
                type: ',',
                value: ',',
            });

            current ++;
            continue;
        }

        // 处理运算符
        if (/=|\+|>/.test(char)) {
            let value = '';
            value += char;
            current ++;

            while (/=|\+|>/.test(code[current])) {
                value += code[current];
                current ++;
            }

            // 当 = 后面有 > 时为箭头函数而非运算符
            if (value === '=>') {
                tokens.push({
                    type: 'ArrowFunctionExpression',
                    value,
                });
                continue;
            }

            tokens.push({
                type: 'operator',
                value,
            });

            continue;
        }

        // 如果碰到我们词法分析器以外的字符,则报错
        throw new TypeError('I dont know what this character is: ' + char);
    }

    return tokens;
};
```
上述的这个词法分析器：主要是针对例子的箭头函数。

#### 1.2语法分析
语法分析之所以复杂,是因为要分析各种语法的可能性,需要开发者根据token流(上一节我们生成的 token 数组)提供的信息来分析出代码之间的逻辑关系,只有经过词法分析 token 流才能成为有结构的抽象语法树.

做语法分析最好依照标准,大多数 JavaScript Parser 都遵循estree规范

1、语句(Statements): 语句是 JavaScript 中非常常见的语法,我们常见的循环、if 判断、异常处理语句、with 语句等等都属于语句。

2、表达式(Expressions): 表达式是一组代码的集合，它返回一个值,表达式是另一个十分常见的语法,函数表达式就是一种典型的表达式,如果你不理解什么是表达式, MDN上有很详细的解释.

3、声明(Declarations): 声明分为变量声明和函数声明,表达式(Expressions)中的函数表达式的例子用声明的写法就是下面这样.

```
const parser = tokens => {
    // 声明一个全时指针，它会一直存在
    let current = -1;

    // 声明一个暂存栈,用于存放临时指针
    const tem = [];

    // 指针指向的当前token
    let token = tokens[current];

    const parseDeclarations = () => {

        // 暂存当前指针
        setTem();

        // 指针后移
        next();

        // 如果字符为'const'可见是一个声明
        if (token.type === 'identifier' && token.value === 'const') {
            const declarations = {
                type: 'VariableDeclaration',
                kind: token.value
            };

            next();

            // const 后面要跟变量的,如果不是则报错
            if (token.type !== 'identifier') {
                throw new Error('Expected Variable after const');
            }

            // 我们获取到了变量名称
            declarations.identifierName = token.value;

            next();

            // 如果跟着 '=' 那么后面应该是个表达式或者常量之类的,额外判断的代码就忽略了,直接解析函数表达式
            if (token.type === 'operator' && token.value === '=') {
                declarations.init = parseFunctionExpression();
            }

            return declarations;
        }
    };

    const parseFunctionExpression = () => {
        next();

        let init;
        // 如果 '=' 后面跟着括号或者字符那基本判断是一个表达式
        if (
            (token.type === 'parens' && token.value === '(') ||
            token.type === 'identifier'
        ) {
            setTem();
            next();
            while (token.type === 'identifier' || token.type === ',') {
                next();
            }

            // 如果括号后跟着箭头,那么判断是箭头函数表达式
            if (token.type === 'parens' && token.value === ')') {
                next();
                if (token.type === 'ArrowFunctionExpression') {
                    init = {
                        type: 'ArrowFunctionExpression',
                        params: [],
                        body: {}
                    };

                    backTem();

                    // 解析箭头函数的参数
                    init.params = parseParams();

                    // 解析箭头函数的函数主体
                    init.body = parseExpression();
                } else {
                    backTem();
                }
            }
        }

        return init;
    };

    const parseParams = () => {
        const params = [];
        if (token.type === 'parens' && token.value === '(') {
            next();
            while (token.type !== 'parens' && token.value !== ')') {
                if (token.type === 'identifier') {
                    params.push({
                        type: token.type,
                        identifierName: token.value
                    });
                }
                next();
            }
        }

        return params;
    };

    const parseExpression = () => {
        next();
        let body;
        while (token.type === 'ArrowFunctionExpression') {
            next();
        }

        // 如果以(开头或者变量开头说明不是 BlockStatement,我们以二元表达式来解析
        if (token.type === 'identifier') {
            body = {
                type: 'BinaryExpression',
                left: {
                    type: 'identifier',
                    identifierName: token.value
                },
                operator: '',
                right: {
                    type: '',
                    identifierName: ''
                }
            };
            next();

            if (token.type === 'operator') {
                body.operator = token.value;
            }

            next();

            if (token.type === 'identifier') {
                body.right = {
                    type: 'identifier',
                    identifierName: token.value
                };
            }
        }

        return body;
    };

    // 指针后移的函数
    const next = () => {
        do {
            ++current;
            token = tokens[current]
                ? tokens[current]
                : { type: 'eof', value: '' };
        } while (token.type === 'whitespace');
    };

    // 指针暂存的函数
    const setTem = () => {
        tem.push(current);
    };

    // 指针回退的函数
    const backTem = () => {
        current = tem.pop();
        token = tokens[current];
    };

    const ast = {
        type: 'Program',
        body: []
    };

    while (current < tokens.length) {
        const statement = parseDeclarations();
        if (!statement) {
            break;
        }
        ast.body.push(statement);
    }
    return ast;
};
```

### 17.4 过程2：代码转换
+ 代码解析和代码生成是babel。
+ 代码转换是babel插件

比如taro就是用babel完成小程序语法转换。

代码转换的关键是根据当前的抽象语法树，以我们定义的规则生成新的抽象语法树。转换的过程就是新的抽象语法树生成过程。

代码转换的具体过程：
+ 遍历抽象语法树（实现遍历器traverser）
+ 代码转换（实现转换器transformer）


### 17.5 过程3：代码转换生成代码（实现生成器generator）
生成代码这一步实际上是根据我们转换后的抽象语法树来生成新的代码,我们会实现一个函数, 他接受一个对象( ast),通过递归生成最终的代码

### 17.6 核心原理
Babel 的核心代码是 babel-core 这个 package，Babel 开放了接口，让我们可以自定义 Visitor，在AST转换时被调用。所以 Babel 的仓库中还包括了很多插件，真正实现语法转换的其实是这些插件，而不是 babel-core 本身。


## 18、webpack

可以参考这个：http://www.chengxinsong.cn/post/57


