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
exports.composeTask = gulp.parallel(gulpSaucxs, privateTask);  // 导出组合任务


// 异步返回promise
function promiseTask(done) {
  Promise.resolve('返回的值').then(data => {
    console.log(data, '「松宝写代码」公众号')
  })
  done();
}
exports.promiseTask = promiseTask;


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

// 返回child_process 子进程
const { exec } = require('child_process');
function childProcessTask(done) {
  exec('data');
  console.log('松宝写代码')
  done();
}
exports.childProcessTask = childProcessTask;


// 返回 observable 观察对象
const Observable = require('rx').Observable;
function observableTask(done) {
  Observable.return('松宝写代码');
  console.log('松宝写代码')
  done();
}
exports.observableTask = observableTask;


// 使用 callback 回调函数
function callbackTask(done) {
  console.log('松宝写代码')
  done(new Error('抛出错误了'));
}
exports.callbackTask = callbackTask;


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

exports.exampleGulpTask = gulp.series(clean, gulp.parallel(minifyCss, uglifyJs));  // 执行顺序 clean => 并行执行 css js 压缩