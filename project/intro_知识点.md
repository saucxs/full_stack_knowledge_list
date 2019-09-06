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

###### 8、聊聊webpack4.0
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


