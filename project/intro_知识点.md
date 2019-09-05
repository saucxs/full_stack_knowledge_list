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

+ 在生命周期的initState方法中将data，prop，method，computed，watch中的数据劫持，
通过observe方法与Object.defineProperty方法将相关对象转为换Observer对象。
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
