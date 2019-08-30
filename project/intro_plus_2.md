##### js
###### 8、JS模块化Commonjs,AMD,CMD,UMD规范的了解，以及ES6的模块化跟其他几种的区别，以及出现的意义。
模块化的历史：原始开发方式-->commonjs-->AMD-->CMD-->UMD-->ES6Module

(1)commmonjs(同步加载模块)： 以服务器第一原则，同步加载模块，模块无需包装，BravoJS遵循commonjs规范。
命令：require加载其他模块，module.exports或者exports输出，输出的一个值的拷贝，输出后不可改变，会被缓存。

(2)AMD(异步加载模块)：以浏览器第一原则，异步加载模块，requirejs是前端模块管理工具库，遵循AMD规范。
所有依赖某些模块的语句放在回调函数中，定义一个全局变量define的函数。
命令：require加载其他模块，return规范模块对外的接口。

(3)CMD(通用模块)：一个模块就是一个文件，在Node和浏览器都可以运行，seajs遵循CMD规范。
命令：require加载其他模块，exports向外提供接口。

(4)UMD：AMD+commonjs，希望解决AMD和commonJs不能通用的问题，还支持老式的全局变量规范，
先判断是否支持Node(exports是否存在)，则使用commonjs规范同步加载模块；
然后判断是否支持AMD(define是否存在)，则使用AMD规范异步加载模块。

(5)ES6Module：新的模块加载方式。
+ 它是标准，很方便在浏览器中使用。
+ 兼容Node环境。
+ 模块通过export和import来确定。
+ 可以和commonjs混合使用
+ commonjs输出值拷贝，ES6Module输出是值的引用，加载时做静态优化。
+ commonjs运行加载确定输出接口，ES6Module编译时确定输出接口。

```js
// 正常命令
import { name, year } from './module.js' //后缀.js不能省略

// 如果遇到export default命令导出的模块
import ed from './export-default.js'
```

AMD与CMD的区别：
+ 对模块依赖，AMD提前执行（requirejs2.0可以配置延迟执行），CMD是延迟执行。
+ AMD推荐依赖前置，CMD推荐依赖就近
+ AMD的API，一个当多个用。CMD的API严格区分，职责单一。

Commonjs与ES6Module区别：
+ commonjs导出的是值的拷贝，ES6Module导出的是引用的拷贝。
+ commonjs只能一次导出一个值，ES6Module导出可以是多个
+ commonjs是动态语法，ES6Module是静态语法
+ commonjs的this是当前模块，ES6Module的this是undefined
