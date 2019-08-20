你好，我叫程新松，目前就职于东方财富南京研发中心
曾就职于苏宁IT总部数据云，现在是苏宁科技数据云。

一个喜欢折腾的工程师，致力于全栈开发。技术栈：vue+vuex+ssr+jq+koa+thinkjs+nginx+redis+websocket+mysql+小程序等

做过一个比较难的项目。数据云要做一个品加商城，项目难点：TOC的场景，购物车和选商品环节操作业务复杂，浏览器兼容到IE10，时间紧。
最终前端的方案：
+ 考虑到TOC场景，以及浏览器兼容性，使用thinkjs3+jq+artTemplate做基础页面，
+ 考虑到购物车和选商品参数业务复杂，使用vue嵌入，双向数据绑定页面更流畅，
+ 考虑到高并发，将node的框架thinkjs作为中间层，路由转发，拦截，数据组装发给中台系统。

我收获到，根据不同的业务场景，node作为中间层是有必要的，IO操作是线程池做，计算任务是主线程做。
node优势就是把I/O操作放到主线程外，这样主线程才能腾出手处理更多的请求。node线程池基于libuv这个库，这个库提供跨平台，线程池，事件池，异步I/O等。

最终团队加班，项目快速实现了0-1，按时完成上线，最后拿了个季度优。


### 1、你觉得你做过的项目或者优化最有价值的是哪个？为什么？对业务帮助？优势什么？
+ 最有价值：watermark-dom水印插件，其实可以设置成隐水印。因为这个使用最广，而且苏宁的一些内部管理系统也是使用这个，有一种成就感。
+ 业务上帮助：主要是避免有些人拍照或者截图将一些管理系统敏感数据发到社交，这样谁泄露谁负责，而且可以设置成隐水印。
对比现有的方案：
+ qq音乐前端团队：他们使用canvas或者svg生成base64图片。
+ 阿里月饼知道隐水印，轻松还原截图：他们利用的是对RGB中最低位进行操作，
+ 优势：（1）简单易操作，配置容易，支持本地引用和npm引入。（2）避免截屏，拍照，都可以追回。（3）使用setInterval可以实现避免删除dom元素。

### 2、你做的东西可以复用与其他团队吗？
因为这个watermark-dom使用起来很简单，支持本地引用，支持UMD，支持commonjs，支持es6，支持amd。

### 3、js面向对象的理解和感悟？
#### 1、什么是面向对象，面向对象的特点及解释？
+ 定义：万物皆对象，任何事物都有自己的特征（属性）和动作（方法），面向对象就是使用对象，使用对象开发封装属性和方法。
+ 特点（特性）：
（1）抽象性：用对象描述数据，抽象对象的核心属性和方法。
（2）封装性：用对象将数据和功能组合在一起
（3）继承性：自己没有的但是别人有，拿过来就是集成，集成是实现代码复用的一种手段。

#### 2、继承方式有哪些？
js的继承通常指的是原型链的继承，通过指定原型，可以通过原型链继承原型的属性和方法。

##### 2.1 原型链继承
原理：父类的实例作为子类的原型
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
+ 1、引用类型值的原型，被所有的实例共享
+ 2、子类创建实例，不能向超类构造函数传递参数

##### 2.2 构造函数继承（经典继承）
原理：不使用原型，在子类型的构造函数中调用超类构造函数。
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
缺点：
+ 1、方法都定义在构造函数中，函数不可复用。

##### 2.3 组合继承（最常用继承）
原理：原型链继承+构造函数继承，通过原型链实现原型的属性和方法继承，通过构造函数实现实例化对象属性的继承。
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
缺点：
+ 1、调用了两次父类构造函数
+ 2、父类的实例属性和方法在子类的实例中，鱼仔子类的原型中。

##### 2.4 原型式继承
原理：直接将对象赋值给构造函数的原型。
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
ES5中有Object.create()方法，替代上面objcetSame方法。

缺点：
+ 1、引用类型值的原型，被所有的实例共享
+ 2、子类创建实例时，无法向父类构造函数传递参数

##### 2.5 寄生式继承
原理：原型式继承基础上，增强对象，返回构造函数。
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
+ 1、引用类型值的原型，被所有的实例共享
+ 2、子类创建实例时，无法向父类构造函数传递参数

##### 2.6 寄生式组合继承
原理：构造函数继承传递阐述+寄生式继承
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

库的实现方式


##### 2.7 ES6的类式继承
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

#### 总结
因为有了面向对象编程，代码更加整洁，易维护，实现了代码的复用，
这也是前端开发中需要设计的高内聚，低耦合的原则。



### 4、浏览器输入 url 到页面的展现，发生了哪些事情？
参考这个：http://www.chengxinsong.cn/post/63



### 5、需要监听那种频繁发生的事件，你有那些优化么？
+ 使用防抖或者节流。


### 6、埋点的实现思路？




### 7、文件上传断点，续传？



### 8、我比较在意自己的技术方向和职业发展，能够简单介绍下如果我面试上贵公司职位，我以后的工作内容和在团队的价值么？



### 8、了解下公司对于前端的重视程度以及在大前端时代，团队对于技术的思考
