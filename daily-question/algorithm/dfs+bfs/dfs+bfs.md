
# 💼【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？

## 一、前言

每日一题这不仅仅是一份用于求职面试的攻略，也是一份前端er用来检视自己。 

> 作者：松宝写代码

学习算法目的：
+ 技术进阶，提升自身代码编程能力和逻辑能力，锻炼思维增加编写代码都思路。
+ 为面试做准备，不少大厂面试都会考察算法和数据结构，为了进入心仪都公司，学习数据结构与算法是不会错的。

歪个楼：

2021春招开始了

校招内推码：8J5ZSB8

校招流程：https://jobs.bytedance.com/campus/invite?referral_code=8J5ZSB8

**内推字节跳动**：https://mp.weixin.qq.com/s/J73JMIQpOtddnwEVNE8q3g


## 二、两种遍历算法：
+ 深度优先遍历
+ 广度优先遍历

### 1、深度优先遍历（DFS）
深度优先遍历（Depth-First-Search），是搜索算法的一种，它沿着树的深度遍历树的节点，尽可能深地搜索树的分支。当节点v的所有边都已被探寻过，将回溯到发现节点v的那条边的起始节点。

这一过程一直进行到已探寻源节点到其他所有节点为止，如果还有未被发现的节点，则选择其中一个未被发现的节点为源节点并重复以上操作，直到所有节点都被探寻完成。

简单的说，DFS就是从图中的一个节点开始追溯，直到最后一个节点，然后回溯，继续追溯下一条路径，直到到达所有的节点，如此往复，直到没有路径为止。

DFS 可以产生相应图的拓扑排序表，利用拓扑排序表可以解决很多问题，例如最大路径问题。一般用堆数据结构来辅助实现DFS算法。

注意：深度DFS属于盲目搜索，无法保证搜索到的路径为最短路径，也不是在搜索特定的路径，而是通过搜索来查看图中有哪些路径可以选择。

步骤：

访问顶点v

依次从v的未被访问的邻接点出发，对图进行深度优先遍历；直至图中和v有路径相通的顶点都被访问

若此时途中尚有顶点未被访问，则从一个未被访问的顶点出发，重新进行深度优先遍历，直到所有顶点均被访问过为止

实现：
```js
Graph.prototype.dfs = function() {
    var marked = []
    for (var i=0; i<this.vertices.length; i++) {
        if (!marked[this.vertices[i]]) {
            dfsVisit(this.vertices[i])
        }
    }
    
    function dfsVisit(u) {
        let edges = this.edges
        marked[u] = true
        console.log(u)
        var neighbors = edges.get(u)
        for (var i=0; i<neighbors.length; i++) {
            var w = neighbors[i]
            if (!marked[w]) {
                dfsVisit(w)
            }
        }
    }
}
```

测试：

```js
graph.dfs()
// 1
// 4
// 3
// 2
// 5
```
测试成功

### 2、广度优先遍历（BFS）
广度优先遍历（Breadth-First-Search）是从根节点开始，沿着图的宽度遍历节点，如果所有节点均被访问过，则算法终止，BFS 同样属于盲目搜索，一般用队列数据结构来辅助实现BFS

BFS从一个节点开始，尝试访问尽可能靠近它的目标节点。本质上这种遍历在图上是逐层移动的，首先检查最靠近第一个节点的层，再逐渐向下移动到离起始节点最远的层

步骤：

创建一个队列，并将开始节点放入队列中

若队列非空，则从队列中取出第一个节点，并检测它是否为目标节点

若是目标节点，则结束搜寻，并返回结果

若不是，则将它所有没有被检测过的字节点都加入队列中

若队列为空，表示图中并没有目标节点，则结束遍历

实现：
```js
Graph.prototype.bfs = function(v) {
    var queue = [], marked = []
    marked[v] = true
    queue.push(v) // 添加到队尾
    while(queue.length > 0) {
        var s = queue.shift() // 从队首移除
        if (this.edges.has(s)) {
            console.log('visited vertex: ', s)
        }
        let neighbors = this.edges.get(s)
        for(let i=0;i<neighbors.length;i++) {
            var w = neighbors[i]
            if (!marked[w]) {
                marked[w] = true
                queue.push(w)
            }
        }
    }
}
```

测试：
```js
graph.bfs(1)
// visited vertex:  1
// visited vertex:  4
// visited vertex:  3
// visited vertex:  2
// visited vertex:  5
```

#### 更多阅读
+ [【每日一题】(55题)算法题：实现数组的全排列](https://mp.weixin.qq.com/s/0KKYgUXJpnJ2yIQ9DY8eJA)

+ [【每日一题】(54题)算法题：最大子序和](https://mp.weixin.qq.com/s/rqU8hZmmBXY5-9ycR7997g)

+ [【每日一题】(53题)算法题：数组中的 K-diff 数对](https://mp.weixin.qq.com/s/JziiqBhYHMw44DAR8FDzwA)

+ [【每日一题】(52题)算法题：合并两个有序数组](https://mp.weixin.qq.com/s/YHD1F0-evjwGjtkMdosioA)

+ [【每日一题】(51题)算法题：最大子序和](https://mp.weixin.qq.com/s/OB8hS_HWyVnwq8EvIYR_Fg)

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


## 往期「每日一题」

### 1、JavaScript && ES6
+ 第 47 题：[【每日一题】(47题)JS中内存泄漏存在于哪几种场景中？](https://mp.weixin.qq.com/s/Gykkr_j3x_G-QVxTSsPzEA)

+ 第 46 题：[【每日一题】(46题)JavaScript中有哪些遍历方法？](https://mp.weixin.qq.com/s/MjeeMF42waWiba6GfHGQXw)

+ 第 41 题：[【每日一题】(41题)JS代码到底是如何被压缩的?](https://mp.weixin.qq.com/s/EIep9wMuM7d5QRAqAcDHBg)
 
+ 第 40 题：[【每日一题】(40题)关于script标签，你可能不知道的地方？](https://mp.weixin.qq.com/s/k42O6hbCD0TIc9IdC-sghg)

+ 第 39 题：[【每日一题】(39题)谈谈JS的函数扩展？](https://mp.weixin.qq.com/s/X8fgfydIjb2eOrVCAc3sDA)

+ 第 30 题：[【每日一题】(30题)面试官:ES6的解构赋值的理解？](https://mp.weixin.qq.com/s/-rWv24IAhGAq4WVqHY2jOg)

+ 第 28 题：[【每日一题】(28题)面试官:原型链与构造函数结合方法继承与原型式继承的区别？](https://mp.weixin.qq.com/s/uPUxo8gIGyHv-b_aWdgzaw)

+ 第 22 题：[【每日一题】(22题)面试官问：var与const,let的主要区别是什么？](https://mp.weixin.qq.com/s/wJ1cG7eQw85fpqpk_fHq7w)

+ 第 21 题：[【每日一题】(21题)面试官问：谈谈JS中的 this 的绑定？](https://mp.weixin.qq.com/s/WvDIjv_FNfDsD9OmB6SirA)

+ 第 20 题：[【每日一题】(20题)面试官问：谈谈JS中的 webSockets 的理解？](https://mp.weixin.qq.com/s/GA-Wl03ZDLhnBCAG0wTi0w)

+ 第 19 题：[【每日一题】面试官问：谈谈JS中的 XMLHttpRequest 对象的理解？](https://mp.weixin.qq.com/s/wxIEGJVmfxq0Q-8E4tbv1A)

+ 第 18 题：[【每日一题】面试官问：JS中的 Ajax 跨域与扩展 Comet ？](https://mp.weixin.qq.com/s/mb8TRlw1yzEOfDzMyYLW2g)

+ 第 17 题：[【每日一题】(17题)面试官问：JS中事件流，事件处理程序，事件对象的理解？](https://mp.weixin.qq.com/s/mb8TRlw1yzEOfDzMyYLW2g)

+ 第 16 题：[【每日一题】面试官问：JS中如何全面进行客户端检测？](https://mp.weixin.qq.com/s/-tNI1vwdK_SAxNGRQTCd1Q)

+ 第 15 题：[【每日一题】面试官问：JS类型判断有哪几种方法？](https://mp.weixin.qq.com/s/UwVgQMaVPg6Z0SVgn4kqwA)

+ 第 14 题：[【每日一题】面试官问：谈谈你对JS对象的创建和引申](https://mp.weixin.qq.com/s/-HTpVMFMRDu8sElNv-WqIw)

+ 第 13 题[[每日一题]面试官问：['1', '2', '3'].map(parseInt)输出，原因，以及延伸？](https://mp.weixin.qq.com/s/DJ6Av4tQgJpqa8hKAPk_uA)

+ 第 12 题[[每日一题]面试官问：JS引擎的执行过程（二）](https://mp.weixin.qq.com/s/CCUsCM2vzb6S1wcwIsjQuA)

+ 第 11 题[[每日一题]面试官问：JS引擎的执行过程（一）](https://mp.weixin.qq.com/s/Lhd5N5a1b8fAstWn5H3B3Q)

+ 第 10 题[[每日一题]面试官问：详细说一下JS数据类型](https://mp.weixin.qq.com/s/wm0EGVXTTHoHMcdUxMQmKA)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

### 2、浏览器

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)


### 3、Vue

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

### 4、React
+ 第 38 道[【每日一题】(38题)谈谈React Hooks 与Vue3.0 Function based API的对比？](https://mp.weixin.qq.com/s/7D8SvbS1r0oH60EjwowXSQ)

### 5、HTML5
+ 第 29 道[【每日一题】(29题)面试官:HTML-HTML5新增标签属性的理解？](https://mp.weixin.qq.com/s/Lx5-bF-xliB9TBuEtE7dLw)

### 6、算法
+ 第 54 题[【每日一题】(54题)算法题：最大子序和](https://mp.weixin.qq.com/s/rqU8hZmmBXY5-9ycR7997g)

+ 第 53 题[【每日一题】(53题)算法题：数组中的 K-diff 数对](https://mp.weixin.qq.com/s/JziiqBhYHMw44DAR8FDzwA)

+ 第 52 道[【每日一题】(52题)算法题：合并两个有序数组](https://mp.weixin.qq.com/s/YHD1F0-evjwGjtkMdosioA)

+ 第 51 道[[【每日一题】(51题)算法题：最大子序和](https://mp.weixin.qq.com/s/OB8hS_HWyVnwq8EvIYR_Fg)

+ 第 50 道[【每日一题】(50题)算法题：只出现一次的数字III](https://mp.weixin.qq.com/s/lUsl_EFHbUgfohR23NGS7g)

+ 第 49 道[【每日一题】(49题)算法题：只出现一次的数字II](https://mp.weixin.qq.com/s/yfbkKD9YebTOGW5VTLZv_A)

+ 第 48 道[【每日一题】(48题)算法题：只出现一次的数字](https://mp.weixin.qq.com/s/yXXH_-qbJJYo3lOBSzr8Kg)

+ 第 45 道[【每日一题】(45题)编程题：如何实现strStr()](https://mp.weixin.qq.com/s/FF42G2ZV1N_dEYRXQnKp7g)

+ 第 44 道[【每日一题】(44题)编程题：分割回文字符串](https://mp.weixin.qq.com/s/aBv_wGVX1aKDBLf_ERtQIA)

+ 第 37 道[【每日一题】(37题)面试官:你对图论了解多少？(七)](https://mp.weixin.qq.com/s/ukPZLrfsPsCxJtOQko8EJg)

+ 第 36 道[【每日一题】(36题)面试官:你对图论了解多少？(六)](https://mp.weixin.qq.com/s/BReGF1JB05W5Ge2ZeaEEYw)

+ 第 35 道[【每日一题】(35题)面试官:你对图论了解多少？(五)](https://mp.weixin.qq.com/s/_ICHDWO4ma_CbEbbemkxZw)

+ 第 34 道[【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

+ 第 33 道[【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

+ 第 32 道[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

+ 第 31 道[[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)

+ 第 27 道[【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？](https://mp.weixin.qq.com/s/EY99dnyjjTvdBflpE5T2Fw)

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 7、Node

+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)

### 8、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

+ 第 42 题[【每日一题】(42题)谈谈你对Http2.0的理解?](https://mp.weixin.qq.com/s/rTKqfMtdvBrNCssN5qa_0Q)

+ 第 43 题 [【每日一题】(43题)如何在项目中使用Http2.0?](https://mp.weixin.qq.com/s/VBEXV6HqFW7ja9tB1a8E3Q)

### 9、年终总结
+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)



## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位**。

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)

