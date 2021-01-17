# 【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！


## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http，算法等领域。

本文是：【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？

昨天发了文章[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)被人一顿吐槽，槽点太多了，比如：
+ 能不能给出最优解？
+ 不讲基础题目，能不能讲一下稍微难点的算法题？

哈哈，我以为没有人看呢？原来还是有人在看哈，简单说明一下：
+ 每一个问题背后有多种解决方案，我们可以从最初的解决方案出发，逐步优化，找出问题所在。
+ 基础题目有一定的道理，每一个算法可以融入到千变万化的场景中，从而就有了成千上万的题目，你需要从场景中抓住重点，提取信息，匹配到合适的算法，最终解决。

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)

## 二、题目
昨天我们还谈了很多基础问题，我们先来看一下我们说的基础题目，也就是常说的「爬楼梯问题」或者「跳一跳游戏」。

问题描述：

> 给定一个非负整数数组，你最初位于数组的第一个位置。数组中的每个元素代表你在该位置可以跳跃的最大长度。判断你是否能够到达最后一个位置。

例子1：

```
输入: [2,3,1,1,4]
输出: true
解释: 我们可以先跳 1 步，从位置 0 到达 位置 1, 然后再从位置 1 跳 3 步到达最后一个位置。
```

例子2: 

```
输入: [3,2,1,0,4]
输出: false
解释: 无论怎样，你总会到达索引为 3 的位置。但该位置的最大跳跃长度是 0 ， 所以你永远不可能到达最后一个位置。
```

## 三、解决方案
### 1、回溯方法
这是一个效率低的方案，其中我们尝试从第一个位置跳到最后一个位置上的跳跃方式。我们第一个位置开始，跳到所有可能达到的步数。我们重复这个过程，直到达到最后一个位置。当达不到的时候我们回溯。

```
var backtrackingJumpLittle = function (numbers, startIndex = 0, currentJumps = []) {
  if (startIndex === numbers.length - 1) {
    return true;
  }

  const maxJumpLength = Math.min(
    numbers[startIndex],
    numbers.length - 1 - startIndex,
  );

  for (let jumpLength = maxJumpLength; jumpLength > 0; jumpLength -= 1) {
    const nextIndex = startIndex + jumpLength;
    currentJumps.push(nextIndex);
    const isJumpSuccessful = backtrackingJumpLittle(numbers, nextIndex, currentJumps);
    if (isJumpSuccessful) {
      return true;
    }
    currentJumps.pop();
  }
  return false;
}
```
我们来分析一下时间复杂度和空间复杂度：

+ 时间复杂度：O(2^n)。从第一个位置到最后一个位置有2的n次方跳跃方式，其中narray的长度为nums。

+ 空间复杂度：O(n)。递归需要额外的内存用于堆栈。

### 2、自顶向下动规方法
自上而下的动态规划可以被认为是优化的回溯。它依赖于这样的观察：一旦我们确定某个台阶是可以达到终点，还是不能达到终点，那么这个结果将永远不会改变。这意味着我们可以存储结果，而不必每次都重新计算。

因此，对于数组中的每个位置，我们都记住该位置是好是坏。我们将这个其值设为以下之一：good，bad，unknow。

```
var dpTopDownJumpLittle = function (
  numbers,
  startIndex = 0,
  currentJumps = [],
  cellsGoodness = [],  // 用来存当前台阶的状态
) {
  if (startIndex === numbers.length - 1) {
    return true;
  }

  const currentCellsGoodness = [...cellsGoodness];
  if (!currentCellsGoodness.length) {
    numbers.forEach(() => currentCellsGoodness.push(undefined));
    currentCellsGoodness[cellsGoodness.length - 1] = true;
  }

  const maxJumpLength = Math.min(
    numbers[startIndex],
    numbers.length - 1 - startIndex,
  );

  for (let jumpLength = maxJumpLength; jumpLength > 0; jumpLength -= 1) {
    const nextIndex = startIndex + jumpLength;
    if (currentCellsGoodness[nextIndex] !== false) {
      currentJumps.push(nextIndex);
      const isJumpSuccessful = dpTopDownJumpLittle(
        numbers,
        nextIndex,
        currentJumps,
        currentCellsGoodness,
      );
      if (isJumpSuccessful) {
        return true;
      }
      currentJumps.pop();
      currentCellsGoodness[nextIndex] = false;
    }
  }
  return false;
}
```

+ 时间复杂度：：O(n^2)。对于数组中的每个元素，例如i，我们正在寻找nums[i]其右边的下一个元素，目的是寻找一个良好的索引。

+ 空间复杂度：O(2 * n) = O(n)。首先n起源于递归。其次n来自存储当前步数状态的用法。

### 3、自下向上动规方法
这一步骤为将来的优化打开了可能。通常通过尝试从上至下的方法颠倒步骤的顺序来消除递归。

```
var dpBottomUpJumpLittle = function(numbers) {
  const cellsGoodness = Array(numbers.length).fill(undefined);
  cellsGoodness[cellsGoodness.length - 1] = true;
  for (let cellIndex = numbers.length - 2; cellIndex >= 0; cellIndex -= 1) {
    const maxJumpLength = Math.min(
      numbers[cellIndex],
      numbers.length - 1 - cellIndex,
    );

    for (let jumpLength = maxJumpLength; jumpLength > 0; jumpLength -= 1) {
      const nextIndex = cellIndex + jumpLength;
      if (cellsGoodness[nextIndex] === true) {
        cellsGoodness[cellIndex] = true;
        break;
      }
    }
  }
  return cellsGoodness[0] === true;
}
```

+ 时间复杂度:: O(n^2)

+ 空间复杂度：O(n)

![贪心](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/algorithm/tanxin/jump-little/greedyJumpLittle.jpg)

### 4、贪心算法
一旦我们的代码处于自下而上的状态，我们就可以做最后一个重要的观察。从一个给定的位置，当我们试图看看是否能跳到一个好的位置时，我们只使用第一个。换句话说，最左边的一个。如果我们把这个最左边的好位置作为一个单独的变量来跟踪，我们可以避免在数组中搜索它。不仅如此，我们还可以完全停止使用数组。

```
var greedyJumpLittle = function(numbers) {
  let leftGoodPosition = numbers.length - 1;
  for (let numberIndex = numbers.length - 2; numberIndex >= 0; numberIndex -= 1) {
    const maxCurrentJumpLength = numberIndex + numbers[numberIndex];
    if (maxCurrentJumpLength >= leftGoodPosition) {
      leftGoodPosition = numberIndex;
    }
  }
  return leftGoodPosition === 0;
}
```

+ 时间复杂度：：O(n)。我们正在遍历nums数组，因此要遍历n，其中n的长度是array的长度nums。

+ 空间复杂度：O(1)。我们没有使用任何额外的内存。

我在leetcode上测试了一下，发现空间占用还是很大，运行时间76ms左右，内存消耗38MB左右。

![贪心](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/algorithm/tanxin/jump-little/tanxin_jumplittle.jpg)


## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)


## 字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

## 学习资料福利
回复「算法」获取算法学习资料

## 往期「每日一题」

### 1、JavaScript && ES6

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

### 4、算法

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 5、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

### 6、Node
+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)

