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

