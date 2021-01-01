# [每日一题]面试官问：详细说一下JS数据类型

关注「松宝写代码」，精选好文，每日一题

​时间永远是自己的

每分每秒也都是为自己的将来铺垫和增值

>作者：saucxs ｜ songEagle


2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

![元旦快乐](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/new_year.jpg)


hello，大家好，我是「松宝写代码」的作者songEagle，今天是元旦，一元复始，万象更新。看到大家已经在写年终总结，我一般每年除夕左右的时候出年终总结，近期会去回顾这一年做了哪些，哪些做的不好，希望大家留言，可以给我提提意见。
​

## 一、前言

2020.12.23 日刚立的 flag，每日一题，题目类型不限制，可以是：算法题，面试题，阐述题等等。

本文是「每日一题」第 10 题：[每日一题]面试官问：详细说一下JS数据类型

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/title.png)

往期「每日一题」：

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

## 二、JS数据类型
我们在回答的时候，很容易把symbol这个类型说漏，之前有讲到过[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)。

数据类型：
+ 1、5种基本类型
+ 2、ES6的symbol类型
+ 3、引用类型

## 三、5种基本数据类型
### （一）Undefined
只有一个特殊值unfefined，变量在未初始化的情况下，值为undefined

出现undefined的情况：

+ 1、预编译阶段，进行变量提升时，只声明，未定义，变量值为undefined；
+ 2、函数无return，或者return后什么也没有时，默认返回值为undefined；
+ 3、函数定义的参数未传值时，默认为undefined；
+ 4、查到一个对象不存在的属性时，返回undefined；
+ 5、数组find方法中，没找到时，返回为undefined。


### （二）Null
只有一个特殊值null，表示空对象指针

出现null的情况：

+ 未获取到指定的dom元素对象时，返回为null；
+ Object.prototype.proto 值为null；
+ 正则捕获，无结果时，返回为null。


### （三） Boolean
包含两个字面值：`true`、`false`。

数据类型 | true | false
----|----|----
Boolean|true|false
String|任何非空字符串|空字符串
Number|任何非零数字值(包含正负无穷值)|NaN, 0
Object|任何非空对象|null
Undefined| |undefined

### （四） Number
* 十进制：如`let number = 12`
* 八进制：第一位为0，然后是八进制数字序列0-7，如：`let number = 012`，表示十进制的数字`10`。数值超出范围时，前导0将被忽略，后面的数值当成十进制处理。**严格模式无效**
* 十六进制：前两位为0x,=，然后是十六进制数字0-9及A-F/a-f，如：`let number = 0xA`，表示十进制的数字`10`。

#### 注意
* 浮点数：计算会产生误差

#### 常用方法、属性
* 浮点数：计算会产生误差
* Number.MIN_VALUE：ECMAScript可表示的最小值
* Number.MAX_VALUE：ECMAScript可表示的最大值
* +Infinity：超出范围的值，正无穷，如：`1/0`，返回`Infinity`。**不能参与计算**
* -Infinity：超出范围的值，负无穷，如：`-1/0`，返回`-Infinity`。**不能参与计算**
* isFinite( )：判断是否有穷值，在范围内的数值返回`true`
* NaN：特殊数值，非数值，用来表示本应返回数值的操作数未返回数值的情况，如：零除以零，返回NaN。特点：1. 任何涉及NaN的操作都返回NaN；2. NaN与任何值都不相等，包括自己本身。
* isNaN( )：判断参数是否不是数值，函数在接收到参数后，会先尝试将参数转成数值型，不能转成数值的参数会返回true；转成数值的部分，如果参数是NaN则返回true

#### 数值转换
 * `Number( )`：将**任何类型**参数转成数值

 数据类型 | 转换结果
 ----|----
 Number|number
 Boolean|true：1<br>false：0
 Undefined|NaN
 String|1. 只包含数字，忽略前导0，返回数值<br> 2. 包含有效浮点格式，忽略前导0，返回数值<br>3. 包含有效的十六进制格式，如：`0xA`， 返回对应的十进制数值<br>4. 空字符串，返回0<br>5.包含除上述格式之外字符，返回NaN
 Object|1. null：0<br>2. 非空，调用对象的valueOf( ) 方法，然后按照前面的规则返回相应值，如果返回结果为NaN，则再调用对象的toString( )方法，继续按照规则转换


 * `parseInt(args, [type])`：将**字符型**参数转成数值，忽略空格，提供两个参数，第一个表示要转换的参数，第二个用来指定转换基数

判断过程 | 转换结果
 ----|----
 第一个字符非负号，非数值|NaN
 字符串以"0x"开头|按照十六进制格式转换
 遇到非数字字符，包含小数点|停止解析，返回结果， 如`"22.5"`，返回22


* `parseFloat( )`：将**字符型**参数转成数值，忽略空格，与parseInt(
   )用法类似，只是只解析十进制，不提供第二个参数，且认为第一个小数点为有效的

### （五） String

特殊的字符字面量，转义序列，用于表示非打印序列

字面量 | 含义
----|----
\n|换行
\t|制表符，相当于tab键
\b|空格
\r|回车
\f|进纸换页
\\\\ |斜杠
\'|单引号，在单引号字符串使用，如：`let string = 'He say \'hi\'.'`
\"|双引号，在双引号字符串使用，如：`let string = "He say \"hi\"."`
\xnn|以十六进制nn表示的字符
\unnn|以十六进制nnnn表示的Unicode字符

#### 注意：

* 获取字符串长度时，`string.length`空格算1个字符，多个字符的转义序列算一个字符。
* `toString()`方法：转成字符型，数值、布尔值、对象和字符串都有该方法，**null和undefined**没有该方法，使用该方法会报错。对于数字的的转换，默认采用十进制，toString方法可以接受一个参数，来指定转换数字采用的进制类型。
* `String(arg)`方法：转成字符型，如果参数有toString()方法，则返回对应结果，如果null则返回null，undefined返回undefined。
* `toLowerCase()`方法：转成小写
* `toLocaleLowerCase()`方法：转成小写，针对特定地区
* `toUpperCase()`方法：转成大写
* `toLocaleUpperCase()`方法：转成大写，针对特定地区

## 二、ES6的symbol类型

之前有讲到过[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)。

## 三、引用类型
一组数据与功能的集合。

Object是所有它的实例的基础，即Object类型所具有的任何属性和方法也同样存在于更具象的实例中。

引用类型的值是保存在内存中的变量，即操作对象时，实际上操作的是对象的引用而不是对象的指针。

Object的每个实例都具有一下属性和方法

属性/方法 | 含义
----|----
`constructor`|构造函数，保存用于创建当前对象的函数，如：let o = new Object()， 则对象 o 的构造函数就是 Object（）
`hasOwnProperty(propertyName)`|用于检查给定的属性是否在当前实例中【而不是实例的原型中】，其中参数`propertyName`必须是字符串
`A.isPrototypeOf(B)`|用于A对象是否是B对象的原型
`obj.propertyIsEnumerable(propertyName)`|用于检查给定的属性能否使用for-in语句进行枚举，其中参数`propertyName`必须是字符串
`toLocaleString()`|返回对象的字符串表示，该字符串与执行环境的地区对应
`toString()`|返回对象的字符串表示
`valueOf()`|返回对象的字符串、数值或布尔值表示，通常与toString()返回结果一致

注意：
* 引用类型的复制，在操作结束以后，两个变量实际上将引用同一个对象，改变其中一个变量的值，也会影响另一个变量。
* 不管是基础类型还是引用类型，参数都是按值传递的

## 1. Object类型

* 可使用new操作符后面跟构造函数的方式，如 `let o = new Object()`
* 可使用对象字面量的形式创建， 如 `let o = {name: 'test'}`

## 2. Array类型
数组的每一项可以保存任意类型的数据，且数组的大小是可以动态调整的。

* 可使用new操作符后面跟Array构造函数的方式，如 `let a = new Array()`，也可以传递数值创建指定长度的数组，如 `let a = new Array(20)`， 也可以省略new操作符
* 可使用数组字面量的形式创建，如 `let a = [0, 1, 2]`

**数组常用方法**：

* `length`：返回数组的长度，且length非只读，可修改
* `Arrag.isArray(value)`： 用来确定value是不是数组
* `push()`：栈方法【先进后出】，添加到数组的末尾，并返回修改后数组的长度
* `pop()`：栈方法【先进后出】，移除数组的最后一项，并返回该项
* `shift()`：队列方法【先进先出】，移除数组的第一项，并返回该项
* `unshift()`：dailies方法【先进先出】，添加到数组的开头，并返回修改后数组的长度
* `reverse()`： 返回逆序后的数组
* `sort()`：按照字符编码排序，可指定排序规则，返回排序后的数组
* `concat()`：返回拼接后的新数组，原数组不变
* `slice(startiIdx, endIdx)`：返回根据位置创建的新数组，原数组不变。如果传递的参数中有负数，则用数组的长度加上该参数来确定相应的位置。如果end<start，则返回空数组
* `splice()`：可以对数组进行多种操作，插入、删除、替换
* `indexOf()`：两个参数第一个参数是查找项，第二个是查找的起点位置索引[可选]，返回查找项在数组中的位置，没查到的情况返回-1
* `lastIndexOf()`：两个参数第一个参数是查找项，第二个是查找的起点位置索引[可选]，返回查找项在数组中的位置，从数组的末尾开始查找，没查到的情况返回-1
* `every()`：对每一项执行指定函数，每一项都返回true，则返回true
* `filter()`：对每一项执行指定函数，返回该函数返回true 的项组成的数组
* `forEach()`：对每一项执行指定函数，无返回值
* `map()`：对每一项执行指定函数，返回每次调用结果组成的数组
* `some()`：对每一项执行指定函数，若函数中的任意一项都返回true，则返回true
* `reduce()`：从数组的第一项开始，迭代数组的所有项，返回最终值
* `reduceRight()`：从数组的最后一项开始，迭代数组的所有项，返回最终值

## 3. Date类型

* 可使用new操作符后面跟Date构造函数的方式，如 `let d = new Date()`，如果根据指定的时间创建日期对象，则参数必须是改日期的毫秒数【即从1970年1月1日午夜起到该日期的毫秒数】，如果直接在Date()传递日期字符串，则会在后台调用`Date.parse()`方法获取毫秒数。

**日期常用方法**：

* `Date.parse()`：返回指定日期毫秒数。接收表示日期的字符串做参数，如果字符串不能表示日期，则返回NAN，如：`let d2 = new Date(Date.parse(May 25, 2004))`
* `Date.UTC()`： 返回指定日期毫秒数。接收的参数与`Date.parse()`不同 如：`let d2 = new Date(Date.UTC(2000, 1, 2, 17, 55, 55))`
* `Date.now()`： 返回调用方法的日期的毫秒数

## 4. RegExp类型
* 可使用正则表达式字面量的方法创建正则表达式 `let expression = / pattern / flags`，其中pattern模式部分可以是任何简单或复杂的正则表达式，每个正则表达式都可带有一个或多个flags标志。
* 可使用new操作符后面跟RegExp构造函数的方式，如`let pattren = new RegExp("[bc]at", "i")`

**目前支持的标志有三种：**

* `g`: 表示全局模式，即该模式将被应用于所有的字符串
* `i`: 表示不区分大小写
* `m`: 表示可以匹配多行

**注意**

* 元字符在正则表达式中都有一种或多种用途，如果要匹配的字符串中包含这些字符，则需要对它们进行转义，元字符包括：`( [ { \ ^ $ | ) ? * + .]}`

**RegExp实例属性**

* `global`: 表示是否设置了g标志
* `ignoreCase`: 表示是否设置了i标志
* `lastIndex`: 表示开始搜索下一个匹配项的字符位置，从零开始
* `multiline`: 表示是否设置了m标志
* `source`: 正则表达式的字符串表示

**RegExp实例方法**

* `exec()`：参数为将要使用该模式匹配的字符串，返回第一个匹配项信息的数组。 exec每次只会返回一个匹配项，在全局的情况下，每次调用方法，都会在字符串种继续查找新的匹配项；非全局下，始终返回第一个匹配项。
* `test()`：参数为将要使用该模式匹配的字符串，匹配的情况返回true，反之 false。

## 5. Function类型
* 可使用`函数声明`语法定义，解析器会预先读取函数声明，可以在任何地方使用。如： `function a () {}`
* 可使用`函数表达式`的形式定义，必须解析过后才可以使用，如 `let a = function () {}`。这种情况下创建的函数为匿名函数，因为function关键字后面没有标识符，也称为拉姆达函数。
* 可使用构造函数的形式定义，如 `let a = new function () // 不推荐`

**注意**

* 函数无重载，即命名相同的函数，最后一个会覆盖掉之前的函数。

**函数内部属性**

* `this`：引用的是函数据以执行的环境对象，在全局作用域中调用函数时，this对象引用的就是window
* `arguements`：类数组对象，包含传入函数中的所有参数。**注意**，arguements下有一个属性`callee`，该属性是一个指针，指向拥有arguements对象的函数

**函数的属性和方法**

* `length`：接收的参数的个数
* `prototype`：不可枚举，保存所有实例方法的真正所在
* `apply()`：在指定的作用域中调用函数，即设置函数的this对象值，接收两个值，第一个值为运行函数的作用域，第二个值是参数数组[数组|arguments对象]
* `call()`：与apply()用法一致，只是第二个参数不能传递数组，需要将参数一个一个传递
* `bind()`：将this的值绑定到传给bind()函数的值

## 6. 内置对象--Global对象
所有在全局作用域种定义的属性和方法都是Global的属性。

**编码方法：**

* `encodeURI()`：对URI进行编码，将无效的字符使用utf-8编码替换，然后发送给浏览器，以便浏览器接受和理解。作用于整个URI，不会对本身属于URI的特殊字符编码。
* `encodeURIComponent()`：对URI的某一段进行编码，会对它认为的所有非标准字符进行编码。因此在使用过程中，**对整个URI使用encodeURI()，对附加在现有URI后的字符串使用encodeURIComponent()**
* `decodeURI()`：解码，只能解析encodeURI编码的部分
* `decodeURIComponent()`：解码，只能解析encodeURIComponent编码部分

### 7. 内置对象--Math对象
**Math对象的属性**

属性/方法 | 含义
----|----
`MATH.E`|自然对数的底数，即e的值
`MATH.LN10`|10的自然对数
`MATH.LN2`|2的自然对数
`MATH.LOG2E`|以2为底的对数
`MATH.LOG10E`|以10为底的对数
`MATH.PI`|2的自然对数
`MATH.SQRT1_2`|1/2的平方根
`MATH.SQRT2`|2的平方根
`max()`|获取最大值
`min()`|获取最小值
`ceil()`|向上舍入
`floor()`|向下舍入
`round()`|四舍五入
`random()`|返回0-1范围内的随机数
`abs()`|绝对值


## 各种福利

#### 1、字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

#### 2、学习资料福利
回复「算法」获取算法学习资料

#### 3、每日一题

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


## 谢谢支持
1、喜欢的话可以「分享，点赞，在看」三连哦。

2、作者昵称：saucxs，songEagle，松宝写代码。字节跳动的一枚前端工程师，一个正在努力成长的作者，星辰大海，未来可期，**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，每日一道面试题，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)
