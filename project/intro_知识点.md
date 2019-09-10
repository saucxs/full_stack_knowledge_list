##### 一、vue的理解
Vue框架的入口就是vue实例，其实是框架中的View Model ，他包含了页面中的业务处理逻辑，数据模型，生命周期中多个事件钩子。

Vue实例虽然没有完全遵循MVVM模型，但是收到MVVM的启发。

vue实际就是MVVM中的VM，就是ViewModel。

'#app'牵着View，data:{}牵着Model，而methods充当controller，可以修改Model的值。

##### 二、vue的生命周期
**简单的说：**
- 如果你说：beforCreate，created，beforeMount，mounted，beforeUpdate，updated，beforeDestroy，destroyed，
这8个生命周期的钩子函数。创建->挂载->更新->摧毁。

###### 1、init各种初始化
首先，我们需要创建一个实例，也就是new Vue()的对象的过程中，首先执行init（init是vue组件中默认去执行的）

+ (1)首先生命周期（init lifeCycle）：初始化vm实例上的一些参数
+ (2)事件监听的初始化（init Events）
+ (3)模板解析变量的初始化（initRender）
+ (4)执行beforeCreate方法
+ (5)父组件初始化注入（initInjections）：数据初始化之前
+ (6)初始化数据（initState） vm上的prop/data/computed/method/watch状态在初始化。初始化initData方法
+ (7)子组件初始化注入（initProvide）：数据初始化之后
+ (8)执行created方法

- 不要在beforeCreate中去修改data，因为数据还没有初始化，所以最早也要在created中修改data。

- vue1.0使用documentFragment进行模板解析， vue2.0使用的是HTML Parser将模板解析成都直接执行的render函数，模板预编译是服务端SSR前提。

###### 2、beforeMount和mounted

+ (1)判断是否有el的option选项

created完成之后，会去判断实例（instance）是否包含el的option选项，
如果没有，就会调用**vm.$mount(el)**这个方法挂载模板，然后执行下一步，
如果有，直接执行下一步。

+ (2)判断是否有template选项

判断玩el的options选项之后，会去判断是否含有实例内部template选项
如果有，将实例内部template解析成一个render function（渲染函数），是template编译过程，结果是解析成render函数的字符串形式。
如果没有，将调用外部html。

+ (3)beforeMount钩子函数：将已经完成的html挂载到对应的虚拟DOM上，$el还只是我们html里面写的节点。

+ (4)拟DOM替换真实DOM：也就是将编译好的html替换el属性指向的DOM。编译过程是render function（渲染函数）

+ (5)mounted钩子函数：完成真实DOM的挂载，做一些异步请求数据，mounted在实例中只执行一次。

我们在写.vue开发中，写template模板，经过vue-loader处理之后，变成render function（渲染函数），
最终放到vue-loader解析过的文件里。为啥要这样做，因为解析template变成render function过程，
非常耗时，vue-loader帮我们提前做了，这样页面执行vue代码，效率会变得更好。

mounted挂载完毕，这个实例算走完流程了。

**疑问**：
+ 1、为什么el属性判断在判断template之前？因为el属性是一个选择器，vue实例需要用这个选择器el去template中寻找对应的。
+ 2、vue实例中有一种render选项
+ 3、渲染优先级：render函数 > template属性 > 外部html
+ 4、vue的编译过程：将template编译成render函数过程
+ beforeMount到mounted过程：vue实例的$el去代替渲染函数中html内的el属性

###### 3、数据变化，更新DOM
这个更新过程：数据变化-->导致虚拟DOM改变-->调用这个两个钩子改变视图

+ （1）监听数据变化
+ （2）beforeUpdate钩子函数：数据更新之前
+ （3）渲染新的虚拟DOM，拿新的虚拟DOM与之前虚拟DOM比较，使用diff算法，然后更新视图
+ （4）updated钩子函数：更新视图之后

**关键**：Object.defineProperty。一个普通的js对象传给vue实例的data，
vue将遍历此对象的所有属性，并且使用Object.defineProperty把这些属性全部
转换为getter/setter。

**vue的响应式原理设计三个重要对象：Observer，Watcher，Dep。**
+ Observer对象：vue中的数据对象在初始化过程中转换为Observer对象。
+ Watcher对象：将模板和Observer对象结合在一起生成Watcher实例，Watcher是订阅者中的订阅者。
+ Dep对象：Watcher对象和Observer对象之间纽带，每一个Observer都有一个Dep实例，用来存储订阅者Watcher。

###### 4、实例销毁
+ （1）beforeDestroy钩子函数：实例销毁之前
+ （2）拆除数据监听，子组件，事件监听
+ （3）destroyed钩子函数：实例销毁完成后

###### 5、不常用的生命周期钩子
+ activated：当组件激活的时候调用
+ deactivated：组件停用的时候调用
+ errorCaptured：vue2.5之后出现，捕获子孙组件错误被调用

注意地方：
+ Vue还提供了了renderError方法，只有在开发的时候被调用，打包上线不会被调用。
+ beforecreate：全局加一个loading事件。
+ created：结束loading，初始化数据获取。

##### 三、vue的响应式设计

![vue的数据更新](../image/font-end-image/vue_data_intro.png)

1个关键方法：Object.defineProperty。

3个重要对象：Observe对象；Watcher对象；Dep对象。
+ Observe对象：vue中数据对象在初始化过程中转换为Obsever对象。
+ Watcher对象：模板和Observe对象结合生成Watcher实例对象，Watcher是订阅者中的订阅者。
+ Dep对象：Watcher对象和Observer对象之间的纽带，每一个Obserever对象都有一个Dep实例，用来存储订阅者中的Watcher对象。

具体实现：
+ 在生命周期的initState方法中将data，prop，method，computed，watch中的数据劫持，
通过observe方法与Object.defineProperty方法将相关对象转为换Observer对象，使用Object.defineProperty中的get进行依赖收集，在set中派发更新。
+ 在initRender方法中解析模板，通过Watcher对象，**Dep对象与观察者模式将模板中的
指令与对象的数据建立依赖关系，使用全局对象dep.target实现依赖收集**。
+ 当数据变化时，setter被调用，触发Object.defineProperty方法中的dep.notify方法，
这个方法会遍历该数据依赖(订阅者Watcher)列表，并向其发送消息，
执行器update方法通知Watcher进行视图更新。
+ 调用patch方法，生成新的VDom，使用diff算法，比较新老的VDom，计算出需要更新的dom，更新到视图上。

需要注意的地方：
+ vue是无法检测到对象属性的添加和删除，但是可以使用全局Vue.set方法（或vm.$set实例方法）。
+ vue无法检测利用索引设置数组，但是可以使用全局Vue.set方法（或vm.$set实例方法）。
+ 无法检测直接修改数组长度，但是可以使用splice


##### 四、vue的模板编译
两个关键函数：$mount函数，compileToFunction函数，compile函数。

1、$mount函数挂载实现：
+ 判断运行环境为浏览器
+ 调用工具方法查找到**el对应的Dom节点**
+ mountComponent方法来实现挂载

挂载之前处理问题：
+ 对于拥有render(JSX),组件可以直接挂载。
+ 如果使用template，调用compile方法，方法里包含了parse方法提取抽象语法树，需要提取AST渲染方法。


2、compileToFunction函数

主要是将template编译成render函数。
首先读取缓存，没有缓存就调用compile方法拿到render函数的字符串形式。

3、compile函数

将compile将template转换为AST，然后优化AST，再将AST转换为render函数的字符串。然后new function得到真正的渲染函数。

主要有三个步骤：

(1)parse方法：template字符串解析成AST。

(2)optimize方法：标记静态节点，为后边的patch过程中新旧VNode做优化，做静态标记的节点，后边不会做比较。

(3)generate方法：根据AST结构拼接生成render函数的字符串

4、patch函数

就是新旧VNode对比的diff函数，主要是优化dom，通过算法将操作dom行为降低到最低。

**总的来说：**
+ compile函数主要讲template转换成AST，优化AST，再将AST转换为render函数的额字符串形式。
+ 再通过new Function得到真正的render函数，render函数与数据通过Watcher产生关联。
+ 在数据发生变化的时候调用patch函数，执行render函数，生成新的VNode，与旧的VNode进行diff，最终更新DOM树。


##### 五、虚拟DOM
主要是解决问题：浏览器进行dom操作会带来较大的开销。

主要：
+ js本身运行速度很快。
+ js对象可以很准确描述出类似DOM树形结构。

过程：
+ vue初始化，首先js对象描述DOM树的结构。
+ 用这个描述树去构建真实DOM，并展示到页面中。
+ 一旦数据状态变更，重新构建一个新的DOM树。
+ 对比两棵树差别，找出最小的更新内容。
+ 并将最小差异内容更新到真实DOM上。

##### 六、diff算法
diff算法来源于snabbdom，是VDOM的思想核心，
snabbdom算法为了DOM操作跨级增删节点较少进行优化。
它只会同层级比较，不会跨级比较。

vue的diff算法位于patch.js文件中，复杂度O(n)。
```js
function patch (oldVnode, vnode){}
```
当两个节点值得比较时，会调用patchVnode函数。

有5种情况：
+ 引用一致，认为没有变化。
+ 文本节点比较，需要修改。
+ 两个都有子节点，且不一样，会调用updateChildren函数比较子节点。
+ 只有新节点有子节点，调用createEle添加子节点。
+ 新节点没有子节点，老节点有子节点，直接删除老节点。


##### 七、vue3.0开始用proxy
vue2.x里的检测机制不全，因为Object.defineProperty最大局限是只能针对单例属性做监听，
vue2.x中对data属性做了遍历和递归，为每一个属性设置getter和setter。

而proxy对目标对象设置一层拦截，外界对对象的访问，都必须通过这层拦截，
所以提供一种机制，对外界访问进行过滤和改写。
也就是说proxy监听一个对象，这个对象所有的操作都会监听，实现代理所有属性。

Object.defineProperty具体局限：
+ 对属性的添加，删除的检测
+ 对数组基于下标的修改，对.length修改检测
+ 对Map，Set，WeakMap，weakSet的支持

使用proxy监听
```js
  var data = {
        sum: 0
    }
    var proxy = new Proxy(data, {
        get(target, property) {
            return target[property]
        },
        set(target, property, value) {
            target[property] += value
        }
    })
```


##### 八、vuex的理解
vue在开发复杂的应用的时候，经常遇到多个组件共享一个状态，或者多个组件更新同一个状态。
系统庞大后，父组件通过props向下传递数据由于层级很深显得脆弱。

vuex是vue专门的状态管理库，将数据层和组件层抽离出来，把数据层放到全局形成单一的Store，以单例存放，
组件变得更薄，专门用来数据展示和操作。
所有数据必须经过全局Store进行，形成单向数据流。
同时利用vue的响应式机制来进行高效的状态管理和更新。

详细的说：
vuex实现的是单向的数据流，全局拥有一个State对象存放数据，所有修改State操作必须通过Mutation进行，
mutation同时提供订阅者模式对外部插件调用获取State数据的更新。
所有的异步接口必须走Action，常见于接口异步获取更新数据。
vuex的运行依赖于vue的内部数据响应机制。


##### 九、vue如何实现样式私有化，以及原理？
style的scope。

scope实现样式私有化的原理：**vue通过DOM结构以及css样式加唯一不重复标记，
以保证唯一**，达到样式私有化模块目的。

详细的说：
+ html的dom节点加上一个不重复的**data属性**表示唯一性。
+ 每个css选择器末尾加上当前组件的**data属性选择器**来私有化样式。
+ 如果当前组件内部包含其他组件，只会给其他组件最外层的标签加上当前组件的data属性。

理论上我们修改这个样式，我们需要更高权重去覆盖样式。


##### 十、vue的插槽slot
插槽是**组件的一块html模板**，父组件决定模板的显示与否。

slot插槽可以传递任何属性或者html元素，scope="任意字符串"。

模板分类： 1、非插槽模板；2、插槽模板。

插槽模板分为：1、单个插槽；2、具名插槽；3、作用域插槽
+ 单个插槽和具名插槽：不绑定数据，父组件提供模板包括样式和内容。
+ 作用域插槽：样式父组件决定，内容由子组件插槽绑定的。

##### 十一、v-if和v-show的区别
相同点：**判断dom节点是否显示**

不同：
+ 实现方式：v-if从dom上删除和重建节点；v-show是修改dom节点的display属性。
+ 编译过程：v-if局部编译和卸载，销毁和重建；v-show是简单css切换。
+ 编译条件：v-if是惰性的。条件为真的时候局部编译；v-show首次都会编译，然后缓存，dom元素始终保留。
+ 性能消耗：v-if有更高的切换性能，不适合做频繁切换；v-show有更高的初始化渲染消耗，适合做频繁切换。

##### 十二、vue的常用修饰符
+ 按键修饰符;delete                  <input class = 'aaa' v-model="inputValue" @keyup.delete="onKey"/>
+ 系统修饰符：ctrl，alt，shift
+ 鼠标修饰符：left，right，middle    <button @click.middle ="onClick">A</button>


##### 十三、vue全局API
###### 1、Vue.extend 返回的是扩展实例的构造器
服务于Vue.component，用来生成组件，一个全局组件。

###### 2、Vue.nextTick DOM的异步更新
DOM更新循环结束之后执行延迟回调，**获取更新后的DOM**。

应用场景：
+ vue生命周期的created函数进行DOM操作一定要放在Vue。nextTick回调函数中。
+ 数据变化要进行某个操作，这个操作会随着数据变化而变化的DOM结构，
这个操作必须放进Vue.nextTick()回调函数中。Vue异步执行DOM更新，
**只要观察数据变化，Vue会开启一个队列，并缓冲在同一个事件循环中发生的所有数据变化，
多个watcher被多次触发，只会被推入队列中一次，然后砸在下一个事件循环中，Vue刷新队列并执行实际工作。**


###### 3、Vue.set 对象新增属性
vue不允许在已经创建实例上动态添加新的根级响应式属性。

###### 4、Vue.delete 对象删除属性
对象时响应式，确保删除能触发更新视图。

###### 5、Vue.directive 自定义vue指令
**vue.directive是一种特殊的html元素属性**

提供两种注册方法：1、全局注册；2、局部注册。

###### 6、Vue.filter 自定义过滤器
过滤器用在两个地方：双花括号插值和v-bind表达式
```js
<!-- 在双花括号中 -->
{{ message | capitalize }}
<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```
###### 7、Vue.component 注册或获取全局组件
注册全局组件，注册还会自动使用给定id设置组件的名称。
**组件是可复用的Vue实例**

###### 8、Vue.use 安装vue插件
本质上执行install方法，由开发者定义。
install必须用在new Vue()之前被调用。

##### 十四、vueRouter实现原理
前端路由实现本质：监听url变化，然后匹配路由规则，显示相应页面，并且无需刷新。

路由的两种实现方式：1、hash模式；2、history模式。

hash模式下：
+ 当哈希值发生变化时，不向服务器请求数据，可以通过hashchange事件来监听URL变化，从而进行跳转页面。
+ 当手动刷新，不向服务器请求数据，不触发hashChange事件，通过load事件，从而解析url。

history模式下：
是H5新推出的功能，比hash更美观。
+ 浏览器动作，比如回退，触发popState事件
+ 点击跳转，调用pushState函数向浏览器添加状态，不向服务器请求
+ 刷新页面或者输入URL。会向服务器请求，需要后端配合重定向

源码会涉及到：
+ 1、Vue.use方法实现**路由注册**，实质是install函数，给组件混入钩子函数和全局注册两个路由组件router-link和router-view。
+ 2、Vue实例化，就是**创建一个路由匹配对象**，根据mode采用不同的路由方式。
+ 3、创建路由匹配对象，**实质是创建路由映射表**，然后通过闭包放肆addRouters和match函数使用映射表的几个对象，最终形成Matcher对象。
+ 4、路由初始化，**进行路由跳转，改变url然后渲染对应的组件。**
+ 5、路由跳转，核心就是：**判断需要跳转的路由是否存在于记录中，然后执行各种导航守卫函数**，最终完成URL的改变和组件的渲染。

##### 十五、事件循环EventLoop
异步编程的机制就是：事件循环。

Node版本11及之后，一个阶段的宏任务就会立刻执行微任务队列，跟浏览器端一致了。

###### 1、浏览器事件循环
浏览器的事件循环队列分为：宏任务队列和微任务队列。宏任务队列可以是多个，微任务队列只有一个。

常见的宏任务：script代码块，setTimeout，setInterval，setImmediate(Node)，requireAnimationFrame，I/O操作，UI页面渲染。

常见的微任务：promise.then，async/await，ajax，axios，catch finally，process.nextTick(Node)，MutationObserver监听(H5新特性)，object.observe(方法废弃)。

详细过程：
+ 1、浏览器按照js顺序加载script标签分隔的代码块。
+ 2、第一个script代码块加载完，首先进行语法分析，一旦语法错误，会跳出当前的script代码块。
+ 3、语法分析正确之后。立即进入到预编译阶段。
+ 4、预编译阶段：(1)创建变量对象(创建arguments对象，函数声明提前，变量申明提升)；(2)确定作用域链；(3)确定this指向。
+ 5、然后进入执行阶段，当前执行栈为空，先进后出原则；微任务队列为空。
+ 6、全局上下文被推入执行栈，同步代码执行。执行过程中，不同方法产生新的宏任务和微任务，然后分别推进各自的任务队列中。
+ 7、上一个宏任务出队列，然后开始处理微任务队列，把所有的微任务队列里所有的任务，直到微任务队列被清空。
+ 9、执行渲染操作，更新页面。
+ 10、检查是否有web Woker，有就处理。
+ 11、重复执行5-10，直到所有队列都被清空。
+ 12、重复执行1-11，直到所有代码执行完毕。

###### 2、Node事件循环
Node是采用V8作为js的解析引擎，I/O是libuv库，libuv是基于事件驱动的跨平台抽象层，事件循环机制在libuv里。

Node运行机制：
+ V8引擎解析js脚本。
+ 解析代码，调用node API。
+ libuv库负责Node API的执行，将不同任务分配不同线程，形成事件循环，以一部的方式将结果返回给V8引擎。
+ V8引擎再将结果返回给用户。

node事件循环的顺序：

外部输入数据 --》轮询阶段（poll）--》检查阶段（check）--》关闭事件回调阶段（close callback）
--》定时器检测阶段（timers）--》I/O事件回调阶段（I/O callbacks）--》闲置阶段（idle，prepare）
--》轮询阶段（按照顺序反复运行）

setTimeout和setImmediate二者比较相似。

区别：调用的时机不同

+ 1、setImmediate：设计在poll阶段完成时执行，也就是在check阶段执行。
+ 2、setTimeout：设计在poll阶段空闲的时候，设定的时间达到后执行，也就是在timer阶段执行。

process.nextTick其实是独立于Event Loop之外的，有自己的队列。

###### 3、Node的事件循环与浏览器差异
+ 浏览器的Event loop是在HTML5中定义的规范，而node中则由libuv库实现。
+ 浏览器环境中，微任务的任务队列是在每一个宏任务执行完成之后执行。node中，微任务会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行微任务队列的任务。


##### 十六、原型，原型链
每一个构造函数(constructor)都有一个原型对象(prototype)；
原型对象(prototype)都包含一个指向构造函数的指针;
实例都包含一个指向原型对象的内部指针。
![构造函数，原型，实例关系](https://www.mwcxs.top/static/upload/pics/2019/2/20z6l-KhouQIArgugtOoWo-OVC.png)

###### 1、什么是原型链？
每一个对象拥有一个原型对象，通过 __pro__ 指向上一个原型，从中继承方法和属性，
**原型对象**也可能拥有原型，一层层的，最终指向null；这种关系称为原型链。
```js
function Father() {
  this.fatherName = 'saucxs',
  this.age = 19;
  this.fatherInfo = {
      into: 'Father'
  }
}
Father.prototype.getFather = function(){
    return {
        name: this.fatherName,
        age: this.age
    }
}
function Son() {
  this.sonName = 'songEagle';
  this.age = 24;
  this.sonInfo = {
        into: 'Son'
    }
}
Son.prototype = new Father();
Son.prototype.getSon = function(){
    return {
        name: this.sonName,
        age: this.age
    }
}
var pSon = new Son();
console.log(pSon.getFather());  // {name: 'saucxs', age: 24}
```

###### 2、原型和实例的关系？
+ instanceof操作符
+ Object.prototype.isPropertyOf()方法

###### 3、原型链存在的问题？
+ 原型链中如果有引用类型值的时候，该引用类型值会被所有实例共享。
+ 创建子类型实例时，不能向超类型的构造函数中传递参数。

###### 4、如何避免属性原型链查找？
+ hasOwnProperty方法，**js中唯一一个处理属性不查找原型链的函数**。


##### 十七、js的面向对象理解，以及js继承的实现方式？
万物皆对象，每个对象都有自身的属性和方法。特点：（1）抽象性；（2）封装性；（3）继承性。

js继承指的就是原型链的继承，通过指定原型，通富哦原型链继承原型的属性和方法。

js继承方式：
+ 原型链继承。原理：父类实例作为子类的原型。Son.prototype = new Father();
+ 构造函数继承(经典继承)。原理：不使用原型，在子类的构造函数中调用超类构造函数。Father.call(this);
+ 组合继承(常用继承)。原理：原型链继承+构造函数继承，通过原型链实现原型属性和方法继承，通过构造函数实现实例化对象属性的继承。
+ 原型式继承。原理：直接将对象赋值给构造函数的原型。function F(){};F.prototype = obj; return new F();
+ 寄生式继承。原理：原型式继承基础上增强对象，返回构造函数。
+ 寄生式组合继承(很多库的实现)。原理：构造函数继承+寄生式继承。
+ ES6的类式继承。

总的来说，有面向对象编程，代码整洁，复用，前端也实现设计的高内聚，低耦合的原则。


##### 十八、作用域，作用域链
###### 1、作用域[[scope]]
js采用的是词法作用域，静态作用域。作用域就是**变量和函数的可访问范围**，控制着变量和函数的可见性和生命周期。

**变量的作用域**有：全局作用域，局部作用域，块级作用域(let和const)。

静态作用域(词法作用域)：在js引擎词法分析阶段确定了，不会改变。**变量的作用域**在定义的时候决定，而不是执行时候决定的。

动态作用域：动态作用域并不关心**函数声明**，只关心函数何处调用。

[[scope]] **就是我们所说的作用域，其中存储这执行上下文的集合。**

###### 2、作用域和上下文区别
+ 作用域指的是变量或者函数的可访问性
+ 上下文context是指this在同一作用域内的值。

改变上下文方法： call，apply，bind方法，箭头函数。

浏览器的全局作用域中，上下文始终是window对象。

Node的全局作用域中，上下文始终是Global对象。

###### 3、作用域链
通过js引擎进行语法分析，预编译，将**作用域属性指向函数定义时作用域中的所有对象的集合**，
集合被称为函数的作用域链。保证执行环境有权访问所有的变量和函数的有序访问。

###### 4、执行上下文
**JS引擎执行每个函数时，都会创建一个执行上下文和激活对象(AO)。**

执行上下文对象有自己的作用域链，在创建执行上下文时，这些值按照代码顺序复制到执行上下文作用域链中。

函数定义的作用域链对象是固定的，而执行上下文是根据运行环境变化而变化。

函数在执行的时候，每遇到一个变量，加到执行上下文作用域链的顶部，如果在第一个作用域链中找到，那就返回这个变量。
没有就继续向下查找，直到找到为止。


##### 十九、闭包
闭包定义：函数A返回函数B，并且函数B使用函数A中的变量，函数B被称为闭包。
```js
function A(){
    let a = 1;
    function B(){
        console.log(a)
    }
    return B;
}
```
为什么函数A已经弹出调用栈，为什么函数B还可以引用函数A中的变量？

因为函数A中的变量这时候存储在堆上的，JS引擎可以通过逃逸分析指导哪些变量存放在堆上，哪些需要存储在栈上。

##### 二十、模块化
###### 1、es6模块化
```js
// file a.js
export function a(){}
export function b() {}
  
// file b.js
export default function() {}

import {a,b} from './a.js'
import XXX from './b.js'
```
###### 2、commonjs
commonjs是node独有的规范，浏览器需要使用browerify解析。
```js
// a.js
module.exports = {
    a: 1
}
// or
exports.a = 1

// b.js
var module = require('./a.js')
module.a  // 1
```
其实module.exports和exports很容易混淆，内部实现：
```js
var module = require('./a.js');
module.a
// 这里其实包装了一个立即执行函数，这样不会污染全局变量，
// 重要的是module这里，module是node独有的一个变量
module.exports = {
    a: 1
}
// 基本实现
var module = {
    exports: {}   //exports是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function (module) {
    // 导出的东西
    var a = 1
    module.exports = a
    return module.exports
};
```
再来说说 module.exports 和 exports，用法其实是相似的，但是不能对 exports 直接赋值，不会有任何效果。

对于 CommonJS 和 ES6 中的模块化的两者区别是：
+ 前者支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案
+ 前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
+ 前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
+ 后者会编译成 require/exports 来执行

###### 3、AMD
amd是requirejs提出的
```js
// AMD
define(['./a', './b'], function(a, b) {
    a.do()
    b.do()
})
define(function(require, exports, module) {
    var a = require('./a')
    a.doSomething()
    var b = require('./b')
    b.doSomething()
})
```
##### 二十一、常用的定时器函数
setTimeout、setInterval、requestAnimationFrame 各有什么特点？
+ setTimeout并不是多久后执行，而是多久后会将执行回调加入到任务队列中。
+ setInterval，和setTimeout一样并不能保证逾期的时间执行，他存在执行积累的问题。
+ requestAnimationFrame，循环定时器的需求，自带节流功能，基本可以保证在16.6毫秒内执行一次，延时效果是精确的。

##### 二十二、call，apply，bind方法的作用和区别？
+ 共同点：改变函数的this的指向，改变函数的执行上下文。
+ 不同点：1、call和apply是对象的方法，通过调用方法间接调用函数；2、bind是将方法绑定在某个对象上。

##### 二十三、前端涉及到的设计模式
java是静态编译型语言。无法动态给已存在的对象添加职责，一般使用包装类实现装饰者模式。
js是动态解释型语言。给函数动态添加职责。
###### 1、工厂模式
工厂模式创建对象是最常用的设计模式，不暴露对象具体逻辑，将逻辑封装在一个函数中。
这个函数就是一个工厂。分为：简单工厂

(1)简单工厂
+ 优点：只需要一个正确的参数，就可以获得你所需要的对象，不用关心创建细节。
+ 缺点：对象如果很复杂，这个创建函数会变得很庞大，难以维护。。

(2)抽象工厂方法
+ 实例化对象的工厂类，在原型中设置所有对象的构造函数。

###### 2、单例模式
保证一个类只有一个实例，并且提供访问它的全局访问点。

+ 优点：1、划分命名空间，减少全局变量的数量。2、只能被实例化一次，再次实例化生成的也是第一个实例
+ 适合场景：线程池，全局缓存，window对象，各种浮窗等

###### 3、代理模式
代理模式主要是为其他对象提供一种代理以控制对这个对象的访问，主要解决在直接访问上带来的问题。
代理模式最基本的形式：对访问进行控制。

虚拟代理用于对那种创建开销很大本体访问，本体的实例化推迟到方法被调用的时候。

+使用场景：图片的懒加载，使用的就是虚拟代理。

##### 4、观察者模式
很多MVVM框架都使用观察者模式的思想，观察者模式也称为发布-订阅模式。

定义对象间的一对多的依赖关系，当一个对象的状态改变时，所有依赖于它的对象都将得到通知和更新，
观察者模式提供一个订阅模型，其中对象订阅事件并在发生时得到通知，有利于面向对象设计和编程。

+ 优点：时间上解耦，对象之间解耦

实现：

(1)指定好谁充当发布者；
(2)给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者；
(3)发布消息时，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数。

###### 5、策略模式
将算法的实现和算法的使用分离开，避免多重判断条件，具有很好的扩展性


##### 二十四、设计模式的设计原则
+ 1、开闭原则：扩展开放，修改关闭。
+ 2、里氏代换原则：是开闭原则的补充，实现关键步骤是抽象化。
+ 3、依赖倒装原则：是开闭原则的基础，针对接口编程，依赖于抽象而不依赖于具体。
+ 4、接口隔离原则：多个隔离的接口，比单个接口好，降低类之间的耦合度。强调降低依赖，降低耦合。
+ 5、最少知道原则：一个实体尽量少于其他实体之间发生相互作用，使功能模块相对独立。
+ 6、合成复用原则：尽量使用合成/聚合方式，而不是使用继承

##### 二十五、promise异步编程
###### 1、原理
promise内部有一个状态管理器，只有三种状态：等待中（pending），已完成（resolved），拒绝（refected）。
###### 2、特点
+ 1、一旦从等待中状态变成其他状态就永远不能更改状态；
+ 2、Promise解决回调地狱的问题；
+ 3、实现链式调用；
+ 4、Promise的then方法的参数期望是函数，传入非函数则会发生值穿透；
+ 5、 Promise 构造函数只执行一次。
###### 3、缺点
无法取消Promise，错误需要通过回调函数捕获。
###### 4、Promise构造函数和then函数区别
Promise构造函数是宏任务的同步任务，then函数是微任务。
###### 5、Promise实现链式调用原理
每调用一个then函数之后会返回一个全新的Promise，如果在then中使用return，return的值会被resolve方法包裹。
###### 6、promise的相关方法
+ then方法：回调函数
+ catch方法：捕获then中发生的异常
+ resolve方法：返回promise是resolved状态
+ reject方法：返回promise是rejected状态
+ all方法，一旦有一个rejected，返回值是rejected，当所有状态都resolved，返回一个数组的promise。
+ race方法，一旦有一个状态改变，就会返回该状态的值
###### 7、错误捕获问题？
+ reject后一定进入到then的第二个回调，如果没有第二个回调，会进入catch中。
+ resolv后一定会进入到第一个回调中，肯定是不会进入到then的第二个回调。
###### 8、catch捕获不到的异常
+ 异步异常
+ 未手动resolve、或者reject。
###### 9、手动实现一个简单promise
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
###### 10、手动实现一个简单promise.all
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
###### 11、例题
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


##### 二十六、async/await异步编程
异步编程核心目的：降低异步编程的复杂性。async/await异步的终极解决方案。

###### 1、基本原理
async函数是Generator的语法糖，async方法中parrllel和waterfall的实现，函数内部使用await表示异步。
###### 2、本质
async函数返回值使用Promise.resolve()包裹，跟then处理返回值一样。
###### 3、async与generaor区别？
+ generator函数必须依赖于执行器。async自带执行器
+ async的await比*的yield更语义化
+ async返回的是promise对象，使用then更方便，generaor返回的是iterator对象。
###### 3、async与promise区别？
+ 优势：在处理then的回调链，更优雅。
+ 缺点：await将异步代码变成了同步代码，性能会下降。
###### 4、例题
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

##### 二十七、webpack
###### 1、什么是webpack？
打包模块化工具，通过loader转换问价，通过plugin扩展功能，最终输出多个模块的组合文件。
###### 2、webpack多个入口怎么配置？
+ 单页面，需要配置一个enry文件
+ 多页面，直接配置页面**入口目录**
###### 3、代码分隔优化？
浏览器首屏渲染速度提升。
+ 首先抽出基础库，与业务代码分离。
+ 通过commonChunkPlugin提取多个代码块依赖为一个chunk。
###### 4、webpack的热更新原理？
修改代码，不用手动刷新就可以更新页面。

原理：webpack-dev-server启动一个服务，使用watch监控文件变化，重新打包，通过websocket建立
   浏览器和webpack服务的双向通信，根据新旧模块的hash值来进行模块热替换，然后通过jsonp请求获取
   最新模块代码，然后浏览器进行热更新模块。如果热更新失败，会回退，进行浏览器刷新获取最新打包代码。

###### 5、webpack构建流程？（原理）
webpack运行流程是一个串行过程。
+ (1)初始化参数：从配置文件和shell中读取合并参数，得到最终参数。
+ (2)开始编译：上一步参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法执行编译
+ (3)确定入口：根据配置的entry找到入口文件，开始解析文件构建AST语法树，找出依赖，递归执行。
+ (4)编译模块：从入口文件开始，调用所有配置的loader对模块进行编译，找出模块依赖的模块，再递归，
直到找到入口依赖文件都经过本步骤的处理。
+ (5)完成模块编译：编译模块结束后，得到每一个模块编译后的最终内容，以及他们之间的依赖关系。
+ (6)输出资源：根据入口和模块之间关系，组装一个个包含多个模块的chunk，再把chunk转换成单独的文件输出列表
+ (7)输出完成：确定好输出内容后，根据配置输出路径和文件名，吧输出列表内容写入到文件系统中。

###### 6、如何利用webpack优化前端性能？
+ 压缩代码，使用uglifyPlugin和paralleugifyPlugin压缩js，cssno压缩css，可以使用webpack4的production模式。
+ 利用CDN加速，将静态资源路径修改为CDN对应的路径，修改loader的publicPath修改资源路径。
+ 开启Tree Shaking，使用webpack最佳参数，或者es6模块开启tree shaking。
+ 优化图片，小图base64，修饰图用css实现。
+ 按路由拆分代码，实现按需加载，提取公共代码。
+ 给打包出来文件添加哈希值，实现浏览器缓存。

###### 7、webpack的如何实现路由按需加载？
+ webpack提供了require.ensure()方法
+ vue的异步组件：resolve => require(['../components/PromiseDemo'], resolve)
+ ES6提案的import()，实现动态导入：const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')

###### 8、webpack的loader的原理，plugin的原理？对比分析一下？
+ loader原理：
**是一个模块转换器**，其实是一个nodejs的模块，导出一个函数，主要是使用正则进行转换。

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
**plugin在webpack的运行的生命周期中，监听事件，扩展逻辑，改变构建结果，通过webpack提供API改变输出结果。**

涉及到两个方法：
+ compiler存放webpack的配置。
+ compilation：webpack监听文件变化自动编译机制。

+ 两种不同：
（1）作用不同
（2）用法不同：loader在rule中配置，类型是数组，每一项是Object；
plugin是单独配置，类型是数组，每一项都是plugin实例。

###### 9、webpack的相关css的Loader顺序和作用？
css最基本的编译依赖于这两个加载器：
+ 1、style-loader：主要将所有css模块依赖解析完后，将css插入到页面的style标签
+ 2、css-loader：主要是解析@import，url等引用资源进行处理
+ 3、postcss-loader：postcss的autoprefixer为了解决不同浏览器的前缀问题
+ 4、预处理器sass-loader：以最终生成css为终点的编程语言，比如sass-loader将sass文件编译成css。

css预处理器： less,scss,sass,stylus

css后处理器：postcss的autoprefixer

###### 10、webpack相关的plugin：静态资源处理器extract-text-webpack-plugin？
webpack打包的时候，会把所有模块，最红打包到一个文件中。

+ extrac-text-webpack-plugin：将css资源和js资源进行分割。


###### 11、聊聊webpack4.0
webpack4.0废弃commonChunkPlugin插件，使用optimization.splitChunks和optimization.runtimeChunk来代替。

新特点：
+ 零配置：两种模式：production模式和development模式
+ 废弃commonChunkPlugin，使用splitChunks。目的：优化chunk的拆分。
3.x存在的问题：(1)之前的chunk引入有重复代码；(2)无法优化异步chunk。
splitChunks思路是引入chunkGroup概念，3.x是父子关系。
+ 使用runtimeChunkPlugin，将基础函数库提取出来。
+ 3.x使用tree-shaking进行无用模块的消除，4.0灵活扩展对某模块开展无用代码检测。
+ 支持ES6+的代码，webpack4.0支持压缩ES6+代码


##### 二十八、babel
###### 1、babel中将ES6转成ES5的原理是什么？
如果是转换新语法，主要是babel-preset-es2015。
如果是转换新API，新增原型方法，原生对象等，主要是babel-polyfill。

###### 2、babel的工作原理：

babel的转译过程分为三个阶段：
+ parsing（解析）:将代码转换为AST；
+ transforming（转译）：访问AST节点进行变化操作，生成新AST；
+ generating（生成）:以新的AST为基础生成代码。

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


##### 二十九、类型判断
基本类型（**存储在栈中，按值访问**）：String、Number、Boolean、Symbol、Undefined、Null 

引用类型（**存储在堆中，按址访问**）：Object，还包括 Function 、Array、RegExp、Date 

+ 基本类型(null): 使用 String(null)
+ 基本类型(string / number / boolean / undefined) + function: 直接使用 typeof即可
+ 其余引用类型(Array / Date / RegExp Error): 调用toString后根据[object XXX]进行判断
很稳的判断封装:
```js

function type(obj) {
    let class2type = {};
    'Array Date RegExp Object Error'.split(' ').forEach(e => class2type[ '[object ' + e + ']' ] = e.toLowerCase());
    if (obj == null) return String(obj)
    return typeof obj === 'object' ? class2type[ Object.prototype.toString.call(obj) ] || 'object' : typeof obj
}
```

###### (1)typeof
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
###### (2)instanceof检测原型

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
###### (3)数组检测

ES5 提供了 Array.isArray() 方法

###### (4)Object.prototype.toString

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

###### (5)判断是不是DOM元素
```js
isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};
```

###### (6)判断空对象

for循环一旦执行，就说明有属性
```js
function isEmptyObject( obj ) {
        var name;
        for ( name in obj ) { return false; }
        return true;
}
```

###### (7)判断window对象

有一个window属性指向自身
```js
function isWindow(obj) {
    return !!(window && obj === window)
}
```

##### 三十、深浅拷贝
浅拷贝方法：Object.assign()；展开语法Spread；slice()，concat()

深拷贝：JSON.parse(JSON.stringify(object))，对于undefined，symbol，循环引用等不能正常。

###### 1、浅拷贝
遍历对象，将对象的key和value放到一个新的对象中。

```js
function shadowCopy(obj){
    if(typeof obj !== 'object') return ;
    var newObj = obj instanceof Array? []: {};
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```

###### 2、深拷贝
遍历对象，如果对象的属性值还是对象的话，递归调用自己。

第一版：
```js
function deepCopy(obj) {
  if(typeof obj !== 'object') return ;
  var newObj = obj instanceof Array?[]: {};
  for(var key in obj){
      if(obj.hasOwnProperty(key)){
          newObj[key] = typeof obj[key] === 'object'?deepCopy(obj[key]):obj[key]
      }
  }
  return newObj;
}
```

第二版：解决循环引用的问题
```js
function deepCopy(obj, map = new Map()) {
  if(typeof obj !== 'object') return ;
  var newObj = obj instanceof Array?[]: {};
  if(map.get(obj)){
      return map.get(obj)
  }
  map.set(obj, newObj);
  for(var key in obj){
      if(obj.hasOwnProperty(key)){
          newObj[key] = typeof obj[key] === 'object'?deepCopy(obj[key], map):obj[key]
      }
  }
  return newObj;
}
```

继续优化，可以使用weakMap代替map。

性能优化，可以使用其他循环for，while，来代替for in


##### 三十一、闭包
定义：函数A中返回函数B，并且函数B中使用函数A中的变量，函数B就称为闭包。
```js
function A(){
    let a = 1;
    function B(){
        console.log(a)
    }
    return B;
}
```
为什么函数A已经弹出调用栈，为什么函数B还可以引用函数A中的变量？

因为函数A中的变量这时候存储在堆上的，JS引擎可以通过逃逸分析指导哪些变量存放在堆上，哪些需要存储在栈上。

##### 三十二、手动实现new
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


##### 三十三、手动实现一个instanceof
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

##### 三十四、防抖和节流
###### 1、防抖
将多次高频操作优化为只执行一次，**任务触发间隔超过指定间隔才执行**。

使用场景：输入框输入后校验，登陆按钮
```js
function debounce(fn, wait, immediate) {
  let timer = null;
  return function() {
    let args = arguments;
    let context = this;
    if(immediate && !timer) {
        fn.apply(context, args);
    }
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
        fn.apply(context, args)
    }, wait)
  }
}
```
总结：
+ 对于按钮防抖来说：（1）如果函数是立即执行的，立即调用；（2）如果是延迟执行的，就缓存上下文，放到延迟执行函数中执行
+ 对于延迟执行函数：清除定时器，延迟调用函数。

###### 2、节流
每个一段时间后执行，将高频操作降低为低频操作。**指定时间间隔，间隔内只会执行一次任务。**

业务场景：图片懒加载，滚动条事件，resize事件。

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

##### 三十五、函数柯里化
将一个低阶函数转换为高阶函数，通俗的说，在一个函数中，首先填充几个参数，然后返回一个新函数的技术，称为函数柯里化。

不侵入函数的前提下，为函数预置通用参数，供多次重复调用。

```js
function add(x) {
  return function(y) {
    return x + y;
  }
}
const addFirst = add(1);
addFirst(2) === 3
addFirst(20) === 21
```

##### 三十六、函数式编程
函数式编程，是一种编程范式。更准确的说：使用函数作为重复使用的表达式，避免对状态进行修改，消除副作用，使用合成构建函数。

js通过闭包，匿名函数实现函数式编程。比如react也是函数式编程应用，lodashJS，underscoreJS库使用函数式编程。

+ 纯函数：函数的输出不受外部影响，同时不影响外部环境，只关注逻辑运算和数学运算。比如slice，map，toUpperCase等
+ 非纯函数：函数输出受外部影响。比如：Math.random，Date.now,splice等

**函数式编程应用：闭包，匿名函数，函数柯里化，高阶函数，函数组合等**

函数组合：解决函数嵌套过深，洋葱代码h(f(g(x)))；让多个函数像拼积木一样。

高阶函数：把函数作为参数，把传入函数做一个封装然后返回
```js
var add = function(a, b) {
  return a + b;
}
function math(fn,arr) {
  return fn(arr[0], arr[1])
}
math(add, [1,2])  // 3
```

##### 三十七、数组扁平化
###### 1、es6的flat方法
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
arr.flat(Infinity);   // [1, 2, 3, 4, 5, 6, 7, 8]
```

###### 2、parse+stringify+正则
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');   // [1, 2, 3, 4, 5, 6, 7, 8]
```

###### 3、toString()+split
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

###### 4、concat+递归
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

###### 5、concat+reduce+递归
```js
let arr = [1,2,[3,4],[5,[6,7,[8]]]];
function flatten(arr1) {
  return arr1.reduce((prev, cur) => prev.concat(Array.isArray(cur)?flatten(cur):cur),[])
}
flatten(arr);    // [1, 2, 3, 4, 5, 6, 7, 8]
```

##### 三十八、数组去重
###### 1、Object键值对
利用一个空的对象，数组的值存为对象的key，如果object[value]存在，说明重复了。实质是hasOwnProperty的hash表
```js
function unique(arr) {
  var obj = {};
  var res = arr.filter(function(item, index, arr) {
    if(obj.hasOwnProperty(item)) return false;
    else{
        return obj[item] = true;
    }
  })
  return res;
}
```
但是会把1和'1'不同，误判为相同，是因为**键值对中只能是字符串**，隐式转换。
```js
function unique(arr) {
  var obj = {};
  var res = arr.filter(function(item, index, arr) {
    if(obj.hasOwnProperty(typeof item + item)) return false;
    else {
        return obj[typeof item + item] = true;
    }
  })
  return res;
}
```
###### 2、reduce高阶函数
思路：使用includes方法来**判断一个数组是否包含一个指定的值。**
```js
function unique(arr) {
  var newArr = arr.reduce((prev, cur) => {
      if(!pre.includes(cur)){
          return pre.concat(cur)
      }else{
          return pre
      }
  }, []);
  return newArr;
}
```
缺点：对象数组不能使用includes检测。

###### 3、ES6的Set数据结构
```js
const unique = arr => [...new Set(arr)];
```
###### 4、ES6的Map数据结构
主要是解决Object键值对中key只能是字符串的问题
```js
function unique(arr) {
  var current = new Map();
  var res = arr.filter(function(item, index, arr) {
    if(current.has(item)){
        return false;
    }else{
        return current.set(item, 1)
    }
  })
  return res;
}
```

##### 三十九、数组方法
###### 1、不改变原数组
+ concat() 连接两个或者多个数组
+ join() 把数组中所有元素放到字符串中
+ slice() 开始到结束（不包括）浅拷贝到新数组
+ map() 创建新数组并返回
+ every() 对数组中每一个元素执行回调,直到返回false
+ some() 对数组中每一个元素执行回调,直到返回true
+ filter() 创建新数组，过滤

###### 2、改变原数组
+ forEach() 循环，会改变原数组
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

###### 3、ES6新数组方法
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


##### 四十、字符串方法
所有字符串方法都会返回新字符串。它们不会修改原始字符串。
###### 1、不改变字符串
+ length 字符串长度
+ indexOf() 查找字符串中首次出现的位置索引
+ search() 搜索指定值的字符串，返回位置
+ slice(index1, index2) 提取字符串的某部分，在新字符串中返回被提取部分
+ substring(index1, index2) 提取字符串的某部分，无法接受负的索引
+ substr(index, length) 提取字符串某部分，第二个参数是提取的长度
+ replace(str1, str2) 用另外值替换字符串中指定的值，只替换首个匹配；第一个参数如果是正则，不带引号，g表示全局
+ toUpperCase()  把字符串转换为大写
+ toLowerCase() 把字符串转换为小写
+ a.concat(" ", b) 连接两个或者多个字符串，等价于+运算符
+ trim() 删除字符串两端的空格
+ charAt() 返回指定位置的字符串，提取字符串字符的方法
+ charCodeAt() 返回字符中指定索引的字符unicode编码，提取字符串字符的方法
+ split() 通过split将字符串转换为数组

###### 2、属性访问
ECMAScript 5 允许字符串属性访问[]。

##### 四十一、正则
###### 1、邮箱
```
邮箱由英文字母，数字，英文句号，下划线，中划线组成，若干个
邮件名称：[a-zA-Z0-9_-]+
域名规则：【N级域名】【三级域名.】二级域名.顶级域名。等同于**.**.**.**
邮箱规则：名称@域名
最终 /^[\w+-]+@[\w+-]+(\.[\w+-]+)+$/

如果允许汉字，汉字在正则：[\u4e00-\u9fa5]
```

###### 2、url解析
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

###### 3、千分号
```
1、最后一个逗号：(?=\d{3}$)
2、多个逗号：(?=(\d{3})+$)
3、匹配的位置不能是开头：(?!^)(?=(\d{3})+$)
4、支持其他开头的，把^和结尾$，修改成\b：(?!\b)(?=(\d{3})+\b)
最终：/(?!\b)(?=(\d{3})+\b)/g
```

### 4、字符串去重
```
/(.).*\1/g
```
```js
var demo="ababbba";
demo = demo.split(''); //把字符串转换为数组
demo = demo.sort().join(''); //首先进行排序，这样结果会把相同的字符放在一起，然后再转换为字符串
demo.replace(/(.).*\1/g,"$1")
```

##### 四十二、平时自己怎么解决跨域的？
+ 1、nginx的代理跨域：add_header 为Access-Control-Allow-Origin *。同源策略是浏览器安全策略，不是htttp协议。服务端使用http协议，不会执行js脚本。
+ 2、跨域资源共享CORS：服务端设置Access-Control-Allow-Origin，如果需要cookie请求，前后端都需要设置。
+ 3、node中间件代理跨域：原理和nginx的相同，启动一个代理服务器，实现数据的转发。
+ 4、jsonp跨域：核心是动态添加，利用js标签的src这个属性有跨域特性，只能用get请求，
+ 5、postMessage跨域：H5中新增的API，postMessage(data,origin)方法接受两个参数
+ 6、webSocket协议跨域：H5的新协议，实现浏览器和服务器双向通信，允许跨域通讯，
websocket API使用不方便，使用socketio，很好封装webSocket，简单灵活的接口，提供了浏览器向下兼容。
+ 7、iframe跨域，可以document.domain，以及location.hash，以及window.name。


##### 四十三、讲一下https和http2.0协议
###### 1、http
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


###### 2、https
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

###### 3、http2.0
http2.0位于应用层
为啥引入http2.0原因：浏览器限制同一个域名下的请求数量，当页面有需要请求很多资源的时候，
队头阻塞会导致达到最大请求数量，剩余资源要等到其他资源加载完毕后才能发起请求。

http2.0核心：
+ 二进制传输：之前传输方式文本传输，http2.0新的编码机制，传输数据都被分隔，并采用二进制格式编码。
+ 多路复用：在一个TCP中可以存在多个流，就是多个请求公用同一个TCP连接，本质是：通过帧中的标识知道属于哪个请求，避免了队头阻塞问题，极大提高传输性能。
+ Header压缩：对传输的haeder进行压缩，两端维护索引表，记录出现的header，通过键名找到对应的值。
+ QUIC协议：基于UDP实现的传输层协议，替换TCP协议。

##### 四十四、浏览器输入 url 到页面的展现，发生了哪些事情？
主干流程：
+ （1）从浏览器接收url --> 开启网络请求线程（涉及到：浏览器机制，线程和进程关系等）
+ （2）开启网络请求线程 --> 发出一个完整的http请求（涉及到：DNS查询，TCP/IP请求。5层网络协议栈）
+ （3）服务器接收请求 --> 对应后台接收到请求（涉及到：均衡负载，安全拦截，后台内部处理）
+ （4）后台和前台交互（涉及到http头，响应码，报文结构，cookie等，cookie优化，编码解码如gzip压缩等）
+ （5）缓存问题：http缓存（涉及到http缓存头部，etag，expired，cache-control等）
+ （6）浏览器接收http数据包 --> 解析流程（涉及到：html词法分析，构建dom树，同时解析css生成css规则树，合成render树。然后布局layout，painting渲染，符合图层合成，GPU绘制，外链接处理，loaded等）
+ （7）css可视化格式模型（涉及到：元素渲染规则，比如：块，控制框，BFC等）
+ （8）js引擎执行过程（涉及到：js解释阶段，预处理阶段，执行阶段生成执行上下文，VO全局对象，作用域链，回收机制等）
+ （9）其他（扩展其他模块：跨域，web安全等） 

细节的地方，参考这个：http://www.chengxinsong.cn/post/63

##### 四十五、开发中性能优化的方案：
+ 1、网络性能优化：
    + (1)DNS预解析，预先获取域名对应的IP
    + (2)缓存：强缓存和协商缓存。
    + (3)强缓存：表示缓存期间不需要请求，通过响应头设置Expires和cache-control。
    + (4)协商缓存：如果缓存过期，我们需要使用协商缓存来解决问题，协商缓存需要请求，缓存有效返回304；协商缓存客户端和服务端共同实现；Etag和IF-None-Match，Etag类似
    指纹，有变动就将新资源返回。
    + (5)合适的缓存策略：大部分场景就可以使用强缓存配合协商缓存解决，还有特殊的缓存策略。比如不需要缓存的资源，使用cache-control：no-store。
    对于频繁变动的资源，cache-control：np-cache配合Etag使用，表示资源被缓存，但是每次都会发请求询问资源是都更新。
    + (6)使用htttp2.0：http1.1，每一个请求都需要建立和断开，消耗好几个RTT时间，并且由于TCP慢启动的原因，加载体积大的文件需要消耗更多时间。
    http2.0引入多路复用，能够让多个请求使用同一个TCP链接，极大的加快了网页的加载速度，支持header压缩，减少请求数据大小。
    + (7)预加载：比如有的资源不需要马上用，但是需要尽早获取，预加载其实是声明式的fetch，强制浏览器请求资源，并且不会阻塞onload事件。在link标签中使用rel属性preload。
    + (8)预渲染：将下载的文件预先在后台渲染，提高页面的加载速度。    
+ 2、渲染优化：
    + (1)减少DOM操作次数。比如vue和react的虚拟DOM，内存总进行diff算法比较，做到最小化操作真实DOM。
    + (2)减少重绘重排，比如img标签设置宽高
    + (3)懒执行：将某些逻辑延迟到使用时再计算。首屏优化，把耗时的逻辑不在首屏中使用，使用懒执行，一般通过定时器或者事件调用唤醒。
    + (4)懒加载：将不关键的资源延后加载。原理就是只加载自定义区域内需要加载的东西，比如常见图片懒加载和视频懒加载
+ 3、文件优化：
    + (1)图片大小优化：减少像素点和减少像素点能够显示的颜色
    + (2)图片加载优化：1、不用修饰类图片，使用css去代替。2、移动端图片，不用原图，用cdn加载，计算适配宽度，请求相应裁剪好的图片。3、小图使用base64格式。4、多个图标文件合并到一张图中。
    5、使用正确的图片格式，优先使用webp，小图使用png或者svg代替，照片使用jpg。
    + (3)其他文件优化：1、css放在head中。2、服务端开启文件压缩功能。3、script放在body底部，js执行会阻止渲染，价格defer会并行下载，但是不会执行，等到html解析完成后顺序执行，没有任何依赖的可以加async，表示渲染和js下载和执行并行进行。
    4、js代码过长会卡住渲染，可以考虑使用webworker,新开线程执行脚本不会影响渲染。    
     + (4)CDN：静态资源尽量使用CDN加载
+ 4、使用webpack优化项目：
    + webpack4，打包项目使用production模式，会自动开启代码压缩
    + 使用ES6的模块开启tree shaking，移除没有使用的代码
    + 优化图片，小图使用base64写入文件中
    + 按照路由拆分代码，实现按需加载
    + 给打包出来的文件名添加哈希，实现浏览器缓存文件


##### 四十六、代码习惯
+ codeView：阅读别人代码，以别人代码为镜，更好提高自己，同时提醒自己如何写好代码让别人读。
+ 项目直觉：根据项目的需求这块，希望自己的东西得到认可，不是一味的去做，而是去思考，产品经理的这样设计的是否合理并且提出自己的解决方案。
+ 代码精致简单：过渡封装，黑盒子都是调试的杀手
+ 编码之前先设计一下思路再写


##### 四十七、埋点的实现思路？
根据不同的需求采用不同的埋点方案。
+ 页面访问量：PV（人次），UV（人数）
+ 功能点击量

页面访问量，影响因素：内容，入口，页面位置，主页面深度。采集页面加载from，to获取用户的访问路径。

比如vue的单页面的时候，
方案一：使用Router.beforeEach方法，

方案二：全局注册混入beforeRouterEnter和beforeRouterLeave。

需要考虑的问题：
+ 应用关闭时候触发beforeRouterLeave方法。
+ 每一个页面都有这两个方法，如何合并
+ 涉及到子路由的页面，会调用2次，pv会翻倍。

如果是vue的多页面，封装公用的逻辑。免去重复构造entry成本。

如果是ssr应用，直接统计调用模板的次数就知道PV（人次）


##### 四十八、文件上传断点，续传？
上传大文件的时候，必须具备文件断点续传，不然用户体验会很差。

+ 传统的方法是使用formData文件整块的提交，服务端取到文件在转移，重命名。因此无法实时保存文件已上传的部分。

原因是：http协议下，浏览器无法与服务端长连接，不能以文件流的形式来提交。

方案：
+ 选择一个文件后，获取该文件在服务器上的大小，
+ 根据已上传文件大小切割文件，不断向服务器提交文件片，服务器不断追加文件内容。
+ 当上传文件大小达到文件总大小，上传结束。

+ 首先：文件分隔中，h5新增Blob数据类型，提供了分割数据方法slice，可以截取二进制文件的一部分。
+ 文件片保存和追加：后端使用node
+ 服务器端实时保存已上传文件大小，以便下次上传前准确切割

##### 四十九、你怎么怎么权衡这vue react两个框架,分析一下。
(1)react是facebook开源js UI框架，推广了虚拟DOM，**新语法JSX**。
(2)vue是尤雨溪开源js UI框架，**使用模板系统**。

相同点：
+ 创建UI的js框架
+ 快速轻便
+ 基于组件的架构
+ 虚拟DOM
+ 可以用于单个Html，也可以用于webpack打包的项目
+ 独立的路由器和状态管理库
+ 都有props校验机制

不同点（vue使用html模板文件，react使用jsx）：
+ vue组件分为全局注册和局部注册；react使用import导入组件。
+ vue的props是可以动态变化，子组件实时更新；react建议props输入和输出一致对应，不建议使用props来更改视图。
+ vue子组件需要显式调用props；react不必需。
+ vue实例实现了事件接口，方便父子组件通信；react必须自己实现。
+ vue有指令系统，让模板更丰富；react只能使用jsx语法。
+ vue中computed和watch方法；react需要自己写一套逻辑实现。
+ vue是双向绑定，声明式写法；react整体思路是函数式，推崇纯组件，单向数据流，双向数据流也可以实现

总的来说：

vue优势
+ 模板和渲染函数弹性选择
+ 简单语法和项目创建
+ 更快渲染速度和更小体积

react优势：
+ 更适合大型应用和更好的可测试性
+ 同时适合web端和原生APP
+ 更大的生态圈

想通部分：
+ 使用虚拟DOM实现快速渲染
+ 轻量级
+ 响应式组件
+ 服务端渲染
+ 集成路由工具，打包工具，状态管理工具
+ 优秀社区支持

##### 五十、ES6的箭头函数this问题，以及拓展运算符。
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

##### 五十一、js的sort实现
js的sort不稳定，各个浏览器js引擎不一致，导致sort实现不一致。

比如：
+ V8的是**插入排序（稳定**和**快排(不稳定)**，做了很多优化，递归过深会爆栈。数组长度小于22，用插入排序，大于用快排。
+ 火狐内核，sort传入的自定义函数作为参数，使用**归并排序**，不然使用的是**桶排序**
+ IE内核：IE9+使用快排，IE6,7,8：稳定排序

##### 五十二、js的精度问题
Js数字按照IEEE 754标准，使用64位双精度浮点型表示。

会出现的精度问题：
+ 浮点精度问题：0.1+0.2!==0.3
+ 大精度问题：9999 9999 9999 9999 == 1000 0000 0000 0000 1
+ toFixed四舍五入不准确： 1.335.toFixed(2) == 1.33

浮点精度和toFixed四舍五入属于一类问题：**浮点数无法精确表示引起的**。

大精度问题：**能精确表示的整数范围上限和下限**。

解决方案：
+ 每次浮点数运算，对结果进行制定精度的四舍五入，.toFixed(12)
+ 将浮点数转为整数运算，再对结果做除法，比如0.1+0.2，可以转换为（1+2）/3
+ 浮点数转换为字符串，模拟实际运算结果。很多成熟的库使用的就是这种方法，big.js，bignumber.js

##### 五十三、js的精度问题

##### 五十一、算法题（数组）
###### 1、数组去重
+ 双重循环
+ indexOf简化内层循环
```js
// 方法二：indexOf简化内层循环
var array = [1,1,'1','2','1',1,2]
function unique(arr){
    // res 存结果
    var res = [];
    for(var i = 0, length = arr.length; i < length; i++){
       var current = arr[i];
       if(res.indexOf(current) === -1){
           res.push(current);
       }
    }
    return res;
}
unique(array);   //[1, "1", "2", 2]
```
+ filter简化外层循环
```js
// 方法三：filter + indexOf
var array = [1,1,'1','2','1',1,2]
function unique(arr){
    // res 存结果
    var res = arr.filter(function(item, index, arr){
        return arr.indexOf(item) === index;
    })
    return res;
}
unique(array);   //[1, "1", "2", 2]
```
+ Object键值对
思路：利用一个空的Object对象，把数组的值存成Object的key，比如就是Object[value] = true;循环判断的时候，如果Object[value]存在，说明这个值重复了。
事件复杂度降到O(n)
Object键值对，实质是hasOwnProperty的hash表。
```js
function unique(arr){
    // obj 存对象
    var obj= {};
    var res = arr.filter(function(item, index, arr){
        if(obj.hasOwnProperty(typeof item + item)) return false;
        else {
            return obj[typeof item + item] = true;
        }
    })
    return res;
}
unique(array);   //[1, "1", "2", 2]
```
+ reduce高阶函数
存在问题：对象数组不能使用includes方法来检测
```js
var array = [1,1,'1','2','1',1,2]
function unique(arr){
    let newArr = arr.reduce((pre,cur)=>{
        if(!pre.includes(cur)){
            return pre.concat(cur)
        }else{
            return pre
        }
    },[]);
    return newArr;
}
console.log(unique(array));// [1, "1", "2", 2]
```
+ ES6的set数据结构
```js
var array = [1,1,'1','2','1',1,2]
const unique = arr => [...new Set(arr)];
unique(array);   //[1, "1", "2", 2]
```
目前时间复杂度到O(n)的方法：

（1）Object键值对，实质是hasOwnProperty的hash表。

（2）ES6的set，map的数据结构

（3）reduce高阶函数

###### 2、数组中查找重复元素

```js
var array = [1,2,4,4,3,3,1,5,3]
function unique(arr){
    // res 存去重结果   returnres 存重复的结果然后再去重。
   let res = []; 
   let returnres = [];
   for(let i=0;i<arr.length;i++){
       let current = arr[i];
       console.log(current, '00000000')
       if(res.indexOf(current) === -1){
           res.push(current)
       }else{
           returnres.push(current)
       }
   }
   console.log(returnres, '-==-=')
   return [...new Set(returnres)]
}
unique(array);   
```

###### 3、数组中最大值和最小值
思路：sort排序，

###### 4、数组中最大差值
思路：sort排序，
```js
function getMaxVal(arr) {
  let minPrice = arr[0];
  let maxPrice = arr[0];
  let maxVal = 0;
  for(let i = 0; i < arr.length; i++){
      let current = arr[i];
      minPrice = Math.min(minPrice, current);
      maxPrice = Math.max(maxPrice, current);
      maxVal = maxPrice - minPrice
  }
  return maxVal;
}
```

###### 5、斐波那契数列
```js
function fib(n) {
  let fibArr = [];
  let i = 0;
  while(i < n){
      if(i === 0 || i === 1 || i === 2){
          fibArr.push(i);
      }else{
          fibArr.push(fibArr[i - 1] + fibArr[i - 2])
      };
      i++;
  }
  return fibArr;
}
```

###### 6、数组扁平化
+ 递归调用
+ toString，数组内只能都是数字
+ reduce
```js
function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
```
+ ES6的扩展运算符...
```js
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```
+ ES6的flat方法
```js
arr.flat(Infinity);
```

###### 7、删除数组中所有的假值
js中的假值：false,null,0,"",undefined,NaN
```js
function bouncer(arr) {
  function isBigEnough(element) {
    if(element!==false || element!==null || element!==0 || element!=="" || element!==undefined || element!==NaN){
      return element;
    }
  }
  var filtered =arr.filter(isBigEnough);
  return filtered;
}
```

###### 8、判断数组是否存在重复
```js
var containsDuplicate = function(nums) {
    let hashMap = new Map();
    for(let i = 0; i < nums.length; i++) {
        if( hashMap.has(nums[i]) ) {
           return true;
        }
        hashMap.set(nums[i], 1);
    }
    return false;
};
```

###### 9、两个升序的数组合并成一个升序数组，不去重
```js
// 时间复杂度O(M+N)，空间复杂度O(M+N)
function merge(left, right){
    let result  = [],
        il      = 0,
        ir      = 0;
    while (il < left.length && ir < right.length) {
        result.push(left[il] < right[ir] ? left[il++] : right[ir++]);
    }
    return result.concat(left.slice(il)).concat(right.slice(ir));
}
```

```js
// 时间复杂度O(M+N)，空间复杂度O(1)
function merge(left, m, right,  n) {
    var i = m - 1, j = n - 1, writeIdx = m + n - 1;
    while (i >= 0 && j >= 0)
    left[writeIdx--] = left[i] > right[j]? left[i--] : right[j--];
    while (j >= 0)
    left[writeIdx--] = right[j--];
    return left;
}
```

###### 10、数组交集
```js
var intersect = function(nums1, nums2) {
    var map1 = new Map();
    var number = [];
    for(var i = 0; i < nums1.length; i++) {
        var map1Value = map1.get(nums1[i]);
        map1.set( nums1[i], ( map1Value ? map1Value : 0 ) + 1 );
    }
    for(var i = 0; i < nums2.length; i++) {
        if( map1.has(nums2[i]) && map1.get(nums2[i]) != 0 ) {
            number.push(nums2[i]);
            map1.set( nums2[i], map1.get(nums2[i]) - 1 );
        }
    }
    return number;
};
```

###### 11、数组转树状结构
```js
var list = [
　　{id:1,parentId:0,name:'一级'},
　　{id:2,parentId:1,name:'一级1'},
　　{id:3,parentId:1,name:'一级2'},
　　{id:4,parentId:2,name:'一级1-1'},
    {id:5,parentId:0,name:'二级'},
　　{id:6,parentId:5,name:'二级1'},
　　{id:7,parentId:6,name:'二级1-1'},
　　{id:8,parentId:7,name:'二级1-1-1'}
]
```
递归调用
```js
function filterArray(data, parentId = 0) {
  var tree = [];
  var temp;
  for(var i = 0,length = data.length;i < length;i++){
      if(data[i].parentId == parentId){
          temp = filterArray(data, data[i].id);
          console.log(temp, '0000000000')
          var obj = data[i];
          if(temp.length > 0){
              obj.children = temp;
          }
          tree.push(obj);
      }
  }
  return tree;
}
```
利用对象的key-value
```js
function filterArray(list = []) {
  var data = JSON.parse(JSON.stringify(list));
  var tree = [];
  if(!Array.isArray(data)) return tree;
  /*start*/
  var obj = {};
  data.forEach(item => {
      obj[item.id] = item;
  })
  console.log(obj, '00000')
  console.log(data, '11111')
  data.forEach(item => {
      var parent = obj[item.parentId]
      console.log(parent, '222222')
      if(parent){
          (parent.children || (parent.children = [])).push(item)
      }else{
          tree.push(item)
      }
      console.log(tree, '333333')
  })
  return tree;
}
```

###### 12、找出一个数组中只出现一次的数字
```js
// ^ 异或运算符
var singleNumber = function(nums) {
    
    let number = 0;
    for(let i = 0; i < nums.length; i++) {
        number ^= nums[i];
    }
    return number;
};
```

###### 13、约瑟夫环的问题
编号1-100，一百人围一个圈，以123123报数，数到3的自动退出圈子，剩下的继续报数，问最后剩下人的编号？

设n为总人数，报出环数字为k，i为第i次出现环。
当i = 1；f(n,k,i) = (n+k-1)%n
当i!=1；f(n,k,i) = (f(n-1,k,i-1)+k)%n；意思是：这一轮 = （上一轮 + k）% n

```js
 function josephus(n,k,i) {
    if(i==1){
        return (n+k-1)%n;
    }else{
        return (josephus(n-1, k,i-1) + k)%n;
    }    
}
```
或者设置一个浮标k，123的循环，指到3直接移除
```js
function josephus2 (n,k){
    var players = [];
    for(var i=1;i<=n;i++){   // 组成数组
        players.push(i);
    }
    var flag=0;
    while(players.length>1){
        var outNum = 0;  //本次循环已出局人数，便于定位元素位置
        var len = players.length;
        for(var i=0;i<len;i++){
            flag++;
            if(flag==k){
                flag=0;
                console.log("出局:"+players[i-outNum]+"本次循环已出局人数："+outNum);
                 // i循环时受数组长度影响 每从头开始时i变为0； 但flag始终是123..k  123..k 固定循环，不受数组影响  ，
                 players.splice(i-outNum,1);
                 outNum++;
             }
        }
    }
    return players[0];
}
console.log(josephus2(100,3));
```

###### 14、冒泡排序(稳定)
```js
function bubbleSort(arr){
    var low = 0;
    var high = arr.length - 1;
    var temp,j;
    while(low < high){
        for(j =low;j<high;++j){  //正向冒泡，找最大值
            if(arr[j] > arr[j+1]){
               temp = arr[j+1];arr[j+1] = arr[j]; arr[j] = temp; 
            }
        };
        --high;
        for(j =high;j>low;--j){
            if(arr[j] < arr[j-1]){
                temp = arr[j]; arr[j]=arr[j-1];arr[j-1]=temp;
            }
        };
        ++ low;
    }
    return arr;
}
```
最佳情况：O(n)（已经是正序的情况）

最坏情况：O(n*2)（已经是倒叙的情况）

平均情况：O(n*2)

###### 15、选择排序(不稳定)
```js
function selectSort(arr) {
  var length = arr.length;
  var minIndex,temp;
  for(var i = 0; i < length - 1; i++){
      minIndex = i;
      for(var j = i + 1; j < length; j++){
          if(arr[j] < arr[minIndex]){
              minIndex = j;
          }
      }
      temp = arr[i];arr[i] = arr[minIndex];arr[minIndex] = temp;
  }
  return arr;
}
```
最佳情况：O(n*2)

最坏情况：O(n*2)

平均情况：O(n*2)

###### 16、插入排序(稳定)
```js
// 改进的 二分查找
function insertSort(arr) {
  var length = arr.length;
  for(var i = 1; i < length; i++){
      var current = arr[i];
      var left = 0;
      var right = i - 1;
      while(left <= right){
          var middle = parseInt((left+right)/2);
          if(current < arr[middle]){
              right = middle - 1;
          }else{
              left = middle + 1;
          }
      }
      for(var j = i - 1;j >= left; j--){
          arr[j+1] = arr[j]
      }
      arr[left] = current;
  }
  return arr;
}
```
最佳情况：O(n)

最坏情况：O(n*2)

平均情况：O(n*2)

###### 17、归并排序(稳定)
```js
function mergeSort(arr){
    var length = arr.length;
    if(length<2){
        return arr;
    }
    var middle = Math.floor(length/2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right){
    var result = [];
    while(left.length && right.length){
        if(left[0] <= right[0]){
            result.push(left.shift());
        }else{
            result.push(right.shift());
        }
    }
    while(left.length){
        result.push(left.shift());
    }
    while(right.length){
        result.push(right.shift());
    }
    return result;
}
```
最佳情况：O(n)

最坏情况：O(nlogn)

平均情况：O(nlogn)

###### 18、快速排序(不稳定)
```js
function quickSort2(arr){
    if(arr.length <= 1){return arr}
    var xIndex = Math.floor(arr.length/2);
    var x = arr.splice(xIndex, 1)[0];
    var left = [];
    var right = [];
    for(var i=0;i<arr.length;i++){
        if(arr[i] < x){
            left.push(arr[i]);
        }else{
            right.push(arr[i]);
        }
    }
    return quickSort2(left).concat([x], quickSort2(right));
}
```
最佳情况：O(nlogn)

最坏情况：O(n*2)

平均情况：O(nlogn)

##### 五十二、算法题（字符串）
###### 1、统计字符串中出现最多的和次数
```js
function repeated(str) {
  let obj = {};
  for(let i = 0, length = str.length; i < length; i++){
      if(obj[str.charAt(i)]){
          obj[str.charAt(i)]++
      }else{
          obj[str.charAt(i)] = 1;
      }
  }
  let iMax = 0;
  let iIndex;
  console.log(obj, '0000000000000000')
  for(let j in obj){
      if(obj[j] > iMax){
          iMax = obj[j];
          iIndex = j;
      }
  }
  return {str: iIndex, num: iMax}
}
repeated('aaaaa33455aaaasfdfdsfdgdf')
```

###### 2、反转字符串
先把字符串转为数组，使用数组reverse翻转，然后数组转为字符
```js
function reverseString(str) {
  return str.split('').reverse().join('');
}
```

###### 3、回文字符串判断
如果字符串，忽略标点，大小写，空格，正读和反复一样，这样字符串就是回文字符串。
```js
function palind(str) {
  var astr = str.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  var bstr = astr.split('').reverse().join('');
  if(astr === bstr){
      return true
  }else{
      return false
  }
}
```

###### 4、英文句子中最长的单词，并计算长度
```js
function findLongestWord(str) {
  var astr = str.split('');
  var bstr = astr.sort(function(a, b) {
    return b.length - a.length
  })
  var lenMax = bstr[0].length;
  return lenMax;
}
```

###### 5、字符串中每个单词首字母大写，其他字母小写
```js
function titleCase() {
  var astr = str.toLOwerCase().split("");
  for(let i = 0; i < astr.length;i++){
      astr[i] = astr[i][0].toUpperCase() + astr[i].substring(1, astr[i].length);
  }
  var string = astr.join("");
  return string;
}
```

##### 五十三、算法题（数字）
###### 1、整数的阶乘
```js
function fac(num) {
  if(num < 0) return -1;
  else if(num === 0 || num === 1) return 1;
  else if(num > 1){
      return num * fac(num - 1);
  }
}
```


