# 快速学习Gulp并接入到项目中（一）

本文主要介绍：

+ gulp定位
+ gulp初始化
+ 项目中使用gulp
+ gulp基本转化流程
+ 逐渐废弃gulp.task()
+ task任务
+ 异步执行

## 一、gulp定位
> gulp是基于流（stream）的自动化构建工具。

## 二、初始化

如果之前已经全局安装了 gulp ，请通过运行以下命令来删除旧安装:

```js
npm rm --global gulp
```

然后通过以下命令安装独立的gulp-cli

```js
npm i --global gulp-cli
```

为什么废弃gulp，而改用gulp-cli？

想将cli和gulp进行解耦，处理只位于gulp-cli中。目的：
+ 主要是想在减少安全安装包的大小。
+ 与主包gulp分开，在不影响gulp-cli流程的情况下进行gulp的功能和bug修复
+ 为后续的sips主题，以及向任务中添加自定义元数据和配置文件。

看一下安装的版本2.x

```js
gulp -v
CLI version: 2.3.0
Local version: Unknown
```

## 三、项目中使用gulp
进入到项目中，安装gulp

```js
npm i --save-dev gulp
```

执行gulp -v

```js
chengxinsong$ gulp -v
CLI version: 2.3.0
Local version: 4.0.2
```

在项目的根目录下创建gulpfile.js文件，在文件中输入以下内容：

```js
function defaultTask(cb) {
  cb();
}
exports.default = defaultTask;
```

## 四、gulp基本转化流程
+ 1、找到src目录下的所有js文件
+ 2、压缩这些js文件
+ 3、将压缩js代码输出到dist/js目录下

```js
const gulp = require('gulp');
const uglify = require('gulp-uglify');

gulp.task('gulpSaucxs', function(done) {
  gulp.src('src/*.js')   // dist与src在共同目录下
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));   // 相对路径
  done();
})
```

上面代码中，task方法接收的是任务代码，接收的必须有回调函数，`gulp.src()`方法去找src目录下的js文件，`.pipe`是接收一个流的结果，并返回一个处理后流的结构，`pipe`方法中执行`uglifg()`方法用来压缩js代码。`gulp.dest()`方法输出到指定相对目录下。`done()`方法就是回调函数执行。

+ gulp.task('任务名'， 回调函数)，任务名也是后续gulp 任务名，执行这个任务，回调函数中处理这个任务需要处理的代码。
+ src() 方法读取文件生成一个Node流（stream），它将所有匹配的文件读取到内存中并通过流（stream）进行处理。
+ Node流（stream）所提供的主要API方法pipe()方法。
+ dest()方法接收一个输出目录作为参数，将文件内容以及文件属性写入到指定的目录中。

我们在src下新建一个`index.js`文件，我们来写最长递增子序列的方法。

```js
// 最长递增子序列
function lis(n) {
  if (n.length === 0) return 0
  // 创建一个和参数相同大小的数组，并填充值为 1
  let array = new Array(n.length).fill(1)
  // 从索引 1 开始遍历，因为数组已经所有都填充为 1 了
  for (let i = 1; i < n.length; i++) {
    for (let j = 0; j < i; j++) {
      if (n[i] > n[j]) {
        array[i] = Math.max(array[i], 1 + array[j])
      }
    }
  }
  let res = 1
  for (let i = 0; i < array.length; i++) {
    res = Math.max(res, array[i])
  }
  return res
}
```

输出的已经通过gulp处理的`index.js`的方法

我们在与gulpfile.js的同级目录下执行gulp task的名称

```js
gulp gulpSaucxs
```

gulp后面跟着的是任务的名称，不输入任务名称的话会默认找default任务，找不到会报错

然后在与src同级新增dist/js，然后生成压缩之后index.js文件。


## 五、逐渐废弃gulp.task()
官网说是这个task的API不再是推荐的模式。

那还是简单提2句，这个api伴随着开发而消失。

```js
gulp.task(name[, deps], fn) 
```
+ name 为任务名
+ deps 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可省略这个参数
+ fn 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。

## 六、task任务
每个gulp任务task都是一个异步的js函数。接收一个回调函数作为参数，或者是一个返回 stream，promise，event emitter、child process 或 observable 类型值的函数。

我们继续改写上面 gulpSaucxs 的任务。

```js
const gulp = require('gulp');
const uglify = require('gulp-uglify');

function gulpSaucxs(done) {
  gulp.src('src/*.js')   // dist与src在共同目录下
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));   // 相对路径
  done();
}

exports.gulpSaucxs = gulpSaucxs;   // gulpSaucxs函数被exports导出是公开任务，可以直接被gulp命令直接调用。
```

导出的 gulpSaucxs 我们可以直接使用gulp命令来执行。

```js
gulp gulpSaucxs
```
输出跟最初是一致的。

### 导出任务
被gulpfile导出export的任务为公开任务，未被导出的任务会被认为是私有任务。

还是在刚才的代码中，我们新增privateTask方法和导出组合任务。

```js
const gulp = require('gulp');
const uglify = require('gulp-uglify');

function gulpSaucxs(done) {
  gulp.src('src/*.js')   // dist与src在共同目录下
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));   // 相对路径
  done();
}

// 新增的私有任务
function privateTask(done) {
  console.log('hello 「松宝写代码」')
}

exports.gulpSaucxs = gulpSaucxs;   // gulpSaucxs函数被exports导出是公开任务，可以直接被gulp命令直接调用。
exports.composeTask = gulp.series(gulpSaucxs, privateTask);  // 导出组合任务
```

上面的代码中，privateTask 方法就是没有被直接导出的方法，称为私有任务；gulpSaucxs 方法是被导出的方法，称为公共任务。

私有任务的设计主要是为了内部的使用，通常作为gulp.series()和gulp.paralle()组合的组成部分。

这时候我们执行

```js
gulp composeTask
```

执行结果

```js
gulp-test chengxinsong$ gulp composeTask
[16:14:52] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[16:14:52] Starting 'composeTask'...
[16:14:52] Starting 'gulpSaucxs'...
[16:14:52] Finished 'gulpSaucxs' after 8.32 ms
[16:14:52] Starting 'privateTask'...
hello 「松宝写代码」
[16:14:52] Finished 'privateTask' after 1.21 ms
[16:14:52] Finished 'composeTask' after 12 ms
```

我们看日志，series方法是按照顺序执行，同步执行。

+ 先启动公共任务 composeTask，
+ 开启 gulpSaucxs 任务方法
+ 完成 gulpSaucxs 任务方法
+ 然后8.32毫秒之后
+ 开启 privateTask 任务方法
+ 输出 hello 「松宝写代码」
+ 完成 privateTask 任务方法
+ 然后1.21毫秒之后
+ 完成 公共任务 composeTask，

### 组合任务
gulp提供了2个强大的组合方法：series() 和 parallel()，允许将多个独立的任务组合为一个更强大的操作。

特点：
+ 都可以接受任意数目的任务Task函数或者已经组合的操作
+ series()方法和parallel()方法 可以相互嵌套任意深度

我们把上面的例子的series方法换成parallel。

```js
const gulp = require('gulp');
const uglify = require('gulp-uglify');

function gulpSaucxs(done) {
  gulp.src('src/*.js')   // dist与src在共同目录下
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));   // 相对路径
  done();
}

// 新增的私有任务
function privateTask(done) {
  console.log('hello 「松宝写代码」');
  done();
}

exports.gulpSaucxs = gulpSaucxs;   // gulpSaucxs函数被exports导出是公开任务，可以直接被gulp命令直接调用。
exports.composeTask = gulp.parallel(gulpSaucxs, privateTask);  // 导出组合任务，以最大的并发来运行
```

执行

```js
gulp cpmposeTask
```

执行结果

```js
chengxinsong$ gulp composeTask
[18:24:35] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[18:24:35] Starting 'composeTask'...
[18:24:35] Starting 'gulpSaucxs'...
[18:24:35] Starting 'privateTask'...
[18:24:35] Finished 'gulpSaucxs' after 8.24 ms
hello 「松宝写代码」
[18:24:35] Finished 'privateTask' after 9.71 ms
[18:24:35] Finished 'composeTask' after 12 ms
```

我们可以输出日志，可以知道parallel方法是并行的执行任务

+ 先启动公共任务 composeTask，
+ 开启 gulpSaucxs 任务方法
+ 开启 privateTask 任务方法
+ 完成 gulpSaucxs 任务方法
+ 然后8.24毫秒之后
+ 输出 hello 「松宝写代码」
+ 完成 privateTask 任务方法
+ 然后9.71毫秒之后
+ 完成 公共任务 composeTask


## 七、异步执行
当从任务（task）中返回 stream、promise、event emitter、child process 或 observable 时，成功或错误值将通知 gulp 是否继续执行或结束。如果任务（task）出错，gulp 将立即结束执行并显示该错误。

### 1、返回stream流

```js
const gulp = require('gulp');
const uglify = require('gulp-uglify');

function streamTask(done) {
  return gulp.src('src/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
  done();
}
exports.streamTask = streamTask;
```

输出：dist/js/index.js


### 2、返回promise

看一个返回promise的例子。

```js
const gulp = require('gulp');

function promiseTask(done) {
  Promise.resolve('返回的值');
  done();
}
exports.promiseTask = promiseTask;
```

输出：

```js
chengxinsong$ gulp promiseTask
[19:20:37] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[19:20:37] Starting 'promiseTask'...
[19:20:37] Finished 'promiseTask' after 1.55 ms
返回的值 「松宝写代码」公众号
```

### 3、返回 eventEmitter 事件发射器

看一个返回 eventEmitter 的例子。

```js
// 返回event emitter
const { EventEmitter } = require('events');
function eventEmitterTask(done) {
  const emitter = new EventEmitter();
  setTimeout(() => {
    emitter.emit('data')
    console.log(emitter, '松宝写代码')
  }, 500);
  done();
}
exports.eventEmitterTask = eventEmitterTask;
```

执行 gulp eventEmitterTask，结果如下：

```js
chengxinsong$ gulp eventEmitterTask
[21:42:26] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[21:42:26] Starting 'eventEmitterTask'...
[21:42:26] Finished 'eventEmitterTask' after 1.77 ms
EventEmitter {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  [Symbol(kCapture)]: false
} 松宝写代码
```

### 4、返回 child process 子进程

看一个返回 childProcess 的例子。

```js
// 返回child_process 子进程
const { exec } = require('child_process');
function childProcessTask(done) {
  exec('data');
  console.log('松宝写代码')
  done();
}
exports.childProcessTask = childProcessTask;
```

执行 gulp childProcessTask ，结果如下：

```js
chengxinsong$ gulp childProcessTask
[21:48:32] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[21:48:32] Starting 'childProcessTask'...
松宝写代码
[21:48:32] Finished 'childProcessTask' after 7.02 ms
```

### 5、返回 RxJS observable 观察对象

看一个返回 observable 的例子。

```js
// 返回 observable 观察对象
const Observable = require('rx').Observable;
function observableTask(done) {
  Observable.return('松宝写代码');
  console.log('松宝写代码')
  done();
}
exports.observableTask = observableTask;
```

执行 gulp observableTask ，结果如下：

```js
chengxinsong$ gulp observableTask
[21:53:14] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[21:53:14] Starting 'observableTask'...
松宝写代码
[21:53:14] Finished 'observableTask' after 2.28 ms
```


### 6、使用 callback 回调函数

看一个使用 callback 回调函数 的例子。

如果任务（task）不返回任何内容，则必须使用 callback 来指示任务已完成。

如需通过 callback 把任务（task）中的错误告知 gulp，将 Error 作为 callback 的参数。

```js
// 返回 callback 回调函数
function callbackTask(done) {
  console.log('松宝写代码')
  done(new Error('抛出错误了'));
}
exports.callbackTask = callbackTask;

```

执行 gulp callbackTask 结果

```js
chengxinsong$ gulp callbackTask
[21:58:22] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[21:58:22] Starting 'callbackTask'...
松宝写代码
[21:58:22] 'callbackTask' errored after 2.09 ms
[21:58:22] Error: 抛出错误了
    at callbackTask
```

### 7、使用 async/await

看一个使用 async/await 异步函数 的例子。

可以将任务（task）定义为一个 async 函数，它将利用 promise 对你的任务（task）进行包装。这将允许你使用 await 处理 promise，并使用其他同步代码。

```js
// 使用 async/await 回调函数
const fs = require('fs');
async function asyncTask(done) {
  const { version } = fs.readFileSync('package.json');
  console.log(version, 'version=====')
  const data = await Promise.resolve('松宝写代码');
  console.log(data, '松宝写代码=========')
  done();
}
exports.asyncTask = asyncTask;
```

执行 gulp asyncTask 结果

```js
chengxinsong$ gulp asyncTask
[22:26:06] Using gulpfile ~/Desktop/coding/full_stack_knowledge_list/article/gulp/gulp-test/gulpfile.js
[22:26:06] Starting 'asyncTask'...
undefined version=====
松宝写代码 松宝写代码=========
[22:26:06] Finished 'asyncTask' after 2.02 ms
```

## 八、我们来看一个实例

比如我们需要
+ 首先清空dist目录，使用series处理
+ 然后 压缩css和压缩js 并行进行处理，使用parallel处理
+ 输出到dist/js和dist/css

```js
// 实例
const minifycss = require('gulp-minify-css'); //压缩css
const del = require('del'); // 删除目录

// 清空目录
function clean(done) {
  del(['dist/**']);
  done();
}

// 压缩css
function minifyCss(done) {
  gulp.src('src/*.css')
  .pipe(minifycss())
  .pipe(gulp.dest('dist/css'));
  done()
}

// 压缩js
function uglifyJs(done) {
  gulp.src('src/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
  done();
}

exports.exampleGulpTask = gulp.series(clean, gulp.parallel(minifyCss, uglifyJs));   // 执行顺序 clean => 并行执行 css js 压缩
```


#### 更多阅读

- [AB 实验：MAB 多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

- [AB 实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

- [AB 实验基础-AB 是什么？AB 的价值？为什么使用 AB 实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

- [【每日一题】(57 题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

- [【每日一题】(56 题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)

- [【每日一题】(55 题)算法题：实现数组的全排列](https://mp.weixin.qq.com/s/0KKYgUXJpnJ2yIQ9DY8eJA)

- [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


#### 更多内推
+ [【字节急招】南京-广告算法工程师](https://mp.weixin.qq.com/s/aFCsLiFShaE2pE17NTrOUQ)

+ [【字节急招】深圳-后台开发工程师-Client Infra](https://mp.weixin.qq.com/s/t_WvJuuvwZ2efAiZjKSsdw)

+ [【提前批】「松宝写代码」内推字节跳动2022校招研发提前批](https://mp.weixin.qq.com/s/lKsgF_PlemOdW6TJrVF84w)

+ [【字节急招】多地-前端开发工程师-抖音（北京/深圳/上海/杭州）](https://mp.weixin.qq.com/s/KpWtFVQsUgind9jugevFtg)

+ [【字节急招】多地-前端研发工程师-Data](https://mp.weixin.qq.com/s/1yhT4aon2qXXlcXSK-rbuA)

+ [【字节急招】南京-前端开发工程师—数据可视化](https://mp.weixin.qq.com/s/DY1b53FvcIM5CzbAFpj_Fw)


## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位**。

3、关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～


![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/image/songbao.png?raw=true)

> 点击「阅读原文」，跳转到Github文章地址