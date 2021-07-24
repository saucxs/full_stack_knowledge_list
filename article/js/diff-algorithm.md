# diff 算法深入一下？

## 一、前言

在后台看到有小伙伴留言：能否详细说一下 diff 算法。

![](./diff.jpeg)

## 二、为什么要说这个 diff 算法？

因为 diff 算法是在理解 vue2.x ， vue3.x 以及 react 中关键核心点，理解diff算法，更有助于理解各个框架本质。

说到「diff 算法」，不得不说「虚拟 Dom」，因为这两个息息相关。

比如：

- vue2.x 数据变化，更新 DOM，谈谈这种响应式原理？
- vue2.x 文件中 template 文件是如何被编译的？
- 介绍一下 Virtual Dom 算法？
- 为什么不直接修改 dom 而需要加一层 virtual dom 呢？
- diff 算法复杂度以及最大的特点？
- vue2.x 的 diff 算法中节点比较的 5 种情况？
  等等

## 三、介绍虚拟 dom 的 diff 算法

我们先来说说虚拟 Dom，就是通过 JS 模拟实现 DOM ，接下来难点就是如何判断旧对象和新对象之间的差异。

Dom 是多叉树结构，如果需要完整的对比两棵树的差异，那么算法的时间复杂度 O(n ^ 3)，这个复杂度很难让人接收，尤其在 n 很大的情况下，于是 React 团队优化了算法，实现了 O(n) 的复杂度来对比差异。

实现 O(n) 复杂度的关键就是只对比同层的节点，而不是跨层对比，这也是考虑到在实际业务中很少会去跨层的移动 DOM 元素。

虚拟 DOM 差异算法的步骤分为 2 步：

- 首先从上至下，从左往右遍历对象，也就是树的深度遍历，这一步中会给每个节点添加索引，便于最后渲染差异
- 一旦节点有子元素，就去判断子元素是否有不同

## 四、为什么不直接修改 dom，而是使用虚拟 dom？

很多时候手工优化 dom 确实会比 virtual dom 效率高，对于比较简单的 dom 结构用手工优化没有问题，但当页面结构很庞大，结构很复杂时，手工优化会花去大量时间，而且可维护性也不高，不能保证每个人都有手工优化的能力。至此，virtual dom 的解决方案应运而生。

virtual dom 是“解决过多的操作 dom 影响性能”的一种解决方案。

virtual dom 很多时候都不是最优的操作，但它具有普适性，在效率、可维护性之间达平衡。

**virutal dom 的意义：**

- 1、提供一种简单对象去代替复杂的 dom 对象，从而优化 dom 操作
- 2、提供一个中间层，js 去写 ui，ios 安卓之类的负责渲染，就像 reactNative 一样。

## 五、diff 算法的复杂度，以及最大的特点？

vue2.x 的 diff 位于 patch.js 文件中，该算法来源于 snabbdom，复杂度为 O(n)。了解 diff 过程可以让我们更高效的使用框架。react 的 diff 其实和 vue 的 diff 大同小异。

最大特点：比较只会在同层级进行, 不会跨层级比较。

```js
<!-- 之前 -->
<div>              <!-- 层级1 -->
  <p>              <!-- 层级2 -->
    <b> aoy </b>   <!-- 层级3 -->
    <span>diff</Span>
  </p>
</div>

<!-- 之后 -->
<div>             <!-- 层级1 -->
  <p>              <!-- 层级2 -->
    <b> aoy </b>   <!-- 层级3 -->
  </p>
  <span>diff</Span>
</div>
```

对比之前和之后：可能期望将<span>直接移动到<p>的后边，这是最优的操作。

但是实际的 diff 操作是：

- 1、移除<p>里的<span>；
- 2、在创建一个新的<span>插到<p>的后边。 因为新加的<span>在层级 2，旧的在层级 3，属于不同层级的比较。

实际diff算法比较中，节点比较有5种情况的比较

vue代码地址：https://github.com/vuejs/vue/blob/8a219e3d4cfc580bbb3420344600801bd9473390/src/core/vdom/patch.js#L424


```
1、if (oldVnode === vnode)，他们的引用一致，可以认为没有变化。

2、if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)，文本节点的比较，需要修改，则会调用Node.textContent = vnode.text。

3、if( oldCh && ch && oldCh !== ch ), 两个节点都有子节点，而且它们不一样，这样我们会调用updateChildren函数比较子节点，这是diff的核心，后边会讲到。

4、else if (ch)，只有新的节点有子节点，调用createEle(vnode)，vnode.el已经引用了老的dom节点，createEle函数会在老dom节点上添加子节点。

5、else if (oldCh)，新节点没有子节点，老节点有子节点，直接删除老节点。
```



## 六、通过 vue2.x 中 template 模板文件是如何被编译渲染的？

通过这个问题，我们可以很好的掌握，diff 算法在整个编译过程中，哪个环节，做了哪些操作，然后使用 diff 算法后输出什么？

![模板渲染过程](../../image/font-end-image/vue-template.png)

解释：

### 1、mount 函数
mount函数主要是获取 template，然后进入 compileToFunctions 函数。

### 2、compileToFunction 函数
compileToFunction 函数主要是将 template 编译成 render 函数。首先读取缓存，没有缓存就调用 compile方法拿到 render 函数的字符串形式，在通过 new Function 的方式生成 render 函数。

```js
// 有缓存的话就直接在缓存里面拿
const key = options && options.delimiters ? String(options.delimiters) + template : template;
if (cache[key]) {
    return cache[key]
};
const res = {};
const compiled = compile(template, options); // compile 后面会详细讲
res.render = makeFunction(compiled.render); //通过 new Function 的方式生成 render 函数并缓存
const l = compiled.staticRenderFns.length;
res.staticRenderFns = new Array(l);
for (let i = 0; i < l; i++) {
    res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i])
};

// ......

return (cache[key] = res); // 记录至缓存中
```

### 3、compile 函数
compile 函数将 template 编译成 render 函数的字符串形式。后面我们主要讲解 render

完成 render 方法生成后，会进入到 mount 进行 DOM 更新。该方法核心逻辑如下：

```js
// 触发 beforeMount 生命周期钩子
callHook(vm, 'beforeMount');
// 重点：新建一个 Watcher 并赋值给 vm._watcher
vm._watcher = new Watcher(
  vm,
  function updateComponent() {
    vm._update(vm._render(), hydrating);
  },
  noop,
);
hydrating = false;
// manually mounted instance, call mounted on self
// mounted is called for render-created child components in its inserted hook
if (vm.$vnode == null) {
  vm._isMounted = true;
  callHook(vm, 'mounted');
}
return vm;
```

+ 首先会 new 一个 watcher 对象（主要是将模板与数据建立联系），在 watcher 对象创建后，

+ 会运行传入的方法 vm.\_update(vm.\_render(), hydrating) 。
其中的 vm.\_render()主要作用就是运行前面 compiler 生成的 render 方法，并返回一个 vNode 对象。

+ vm.update() 则会对比新的 vdom 和当前 vdom，并把差异的部分渲染到真正的 DOM 树上。（watcher 背后的实现原理：vue2.x 的响应式原理）

上面提到的 compile 就是将 template 编译成 render 函数的字符串形式。核心代码如下：

```js
export function compile(template: string, options: CompilerOptions): CompiledResult {
  const AST = parse(template.trim(), options); //1. parse
  optimize(AST, options); //2.optimize
  const code = generate(AST, options); //3.generate
  return {
    AST,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
}
```

compile 这个函数主要有三个步骤组成：
 + parse，
 + optimize 
 + generate

分别输出一个包含 
+ AST字符串
+ staticRenderFns的对象字符串
+ render 函数 的字符串。


parse 函数：主要功能是**将 template 字符串解析成 AST（抽象语法树）**。
  前面定义的 ASTElement 的数据结构，parse 函数就是将 template 里的结构（指令，属性，标签）
  转换为 AST 形式存进 ASTElement 中，最后解析生成 AST。

optimize 函数（src/compiler/optomizer.js）:主要功能是**标记静态节点**。
  后面 patch 过程中对比新旧 VNode 树形结构做优化。被标记为 static 的节点在后面的 diff 算法中会被直接忽略，不做详细比较。

generate 函数（src/compiler/codegen/index.js）:主要功能**根据 AST 结构拼接生成 render 函数的字符串**。

```js
const code = AST ? genElement(AST) : '_c("div")';
staticRenderFns = prevStaticRenderFns;
onceCount = prevOnceCount;
return {
  render: `with(this){return ${code}}`, //最外层包一个 with(this) 之后返回
  staticRenderFns: currentStaticRenderFns,
};
```

其中 genElement 函数（src/compiler/codgen/index.js）是根据 AST 的属性调用不同的方法生成字符串返回。

**总之：**

就是 compile 函数中三个核心步骤介绍，

compile 之后我们得到 render 函数的字符串形式，

后面通过 new Function 得到真正的渲染函数。

数据发生变化后，会执行 watcher 中的_update 函数（src/core/instance/lifecycle.js），_update 函数会执行这个渲染函数，输出一个新的 VNode 树形结构的数据。

然后调用 patch 函数，拿到这个新的 VNode 与旧的 VNode 进行对比，只有反生了变化的节点才会被更新到新的真实 DOM 树上。

### 4、patch 函数
patch 函数 就是新旧 VNode 对比的 diff 函数，主要是为了优化 dom，通过算法使操作 dom 的行为降低到最低，
diff 算法来源于 snabbdom，是 VDOM 思想的核心。snabbdom 的算法是为了 DOM 操作跨级增删节点较少的这一目标进行优化，
它只会在同层级进行，不会跨层级比较。

**总结一下**：
- compile 函数主要是将 template 转换为 AST，优化 AST，再将 AST 转换为 render 函数的字符串形式。
- 再通过 new Function 得到真正的 render 函数，render 函数与数据通过 Watcher 产生关联。
- 在数据反生变化的时候调用 patch 函数，执行 render 函数，生成新的 VNode，与旧的 VNode 进行 diff，最终更新 DOM 树。


## 七、vue2.x和vue3.x中的diff有区别吗？
总的来说：

+ vue2.x的核心diff算法采用双端比较的算法，同时从新旧children的两端开始进行比较，借助key可以复用的节点。

+ vue3.x 借鉴了一些别的算法inferno(https://github.com/infernojs/inferno)解决：1、处理相同的前置和后置元素的预处理；2、一旦需要进行DOM移动，我们首先要做的就是找到source的最长递增子序列。在创建VNode就确定类型，以及在mount/patch的过程中采用位运算来判断一个VNode的类型，在这个优化的基础上再配合Diff算法，性能得到提升。可以看一下vue3.x的源码：https://github.com/vuejs/vue/blob/8a219e3d4cfc580bbb3420344600801bd9473390/src/core/vdom/patch.js


## 八、diff算法的源头snabbdom算法
snabbdom算法：https://github.com/snabbdom/snabbdom

定位：一个专注于简单性、模块化、强大功能和性能的虚拟 DOM 库。

### 1、snabbdom中定义Vnode的类型
snabbdom中定义Vnode的类型(https://github.com/snabbdom/snabbdom/blob/27e9c4d5dca62b6dabf9ac23efb95f1b6045b2df/src/vnode.ts#L12)

```
export interface VNode {
  sel: string | undefined; // selector的缩写
  data: VNodeData | undefined; // 下面VNodeData接口的内容
  children: Array<VNode | string> | undefined; // 子节点
  elm: Node | undefined; // element的缩写，存储了真实的HTMLElement
  text: string | undefined; // 如果是文本节点，则存储text
  key: Key | undefined; // 节点的key，在做列表时很有用
}

export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  class?: Classes;
  style?: VNodeStyle;
  dataset?: Dataset;
  on?: On;
  attachData?: AttachData;
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: any[]; // for thunks
  is?: string; // for custom elements v1
  [key: string]: any; // for any other 3rd party module
}
```

### 2、init函数分析
init函数的地址：
https://github.com/snabbdom/snabbdom/blob/27e9c4d5dca62b6dabf9ac23efb95f1b6045b2df/src/init.ts#L63

init() 函数接收一个模块数组 modules 和可选的 domApi 对象作为参数，返回一个函数，即 patch() 函数。

domApi 对象的接口包含了很多 DOM 操作的方法。

### 3、patch函数分析
源码：https://github.com/snabbdom/snabbdom/blob/27e9c4d5dca62b6dabf9ac23efb95f1b6045b2df/src/init.ts#L367

+ init() 函数返回了一个 patch() 函数
+ patch() 函数接收两个 VNode 对象作为参数，并返回一个新 VNode。

### 4、h函数分析
源码：https://github.com/snabbdom/snabbdom/blob/27e9c4d5dca62b6dabf9ac23efb95f1b6045b2df/src/h.ts#L33

h() 函数接收多种参数，其中必须有一个 sel 参数，作用是将节点内容挂载到该容器中，并返回一个新 VNode。



#### 更多内推
+ [【字节急招】深圳-后台开发工程师-Client Infra](https://mp.weixin.qq.com/s/t_WvJuuvwZ2efAiZjKSsdw)

+ [【提前批】「松宝写代码」内推字节跳动2022校招研发提前批](https://mp.weixin.qq.com/s/lKsgF_PlemOdW6TJrVF84w)

+ [【字节急招】多地-前端开发工程师-抖音（北京/深圳/上海/杭州）](https://mp.weixin.qq.com/s/KpWtFVQsUgind9jugevFtg)

+ [【字节急招】多地-前端研发工程师-Data](https://mp.weixin.qq.com/s/1yhT4aon2qXXlcXSK-rbuA)

+ [【字节急招】南京-前端开发工程师—数据可视化](https://mp.weixin.qq.com/s/DY1b53FvcIM5CzbAFpj_Fw)

#### 更多阅读
+ [AB实验：MAB多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

+ [AB实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)

+ [【每日一题】(55题)算法题：实现数组的全排列](https://mp.weixin.qq.com/s/0KKYgUXJpnJ2yIQ9DY8eJA)

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)



## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位**。

3、关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～


![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/image/songbao.png?raw=true)

> 点击「阅读原文」，跳转到github文章中