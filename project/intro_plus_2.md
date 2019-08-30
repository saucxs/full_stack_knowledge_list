##### 二十四、js
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

###### 8、事件委托（事件代理）理解
事件监听是addEventListener，这是在有确定的dom的时候使用。

事件委托的作用：
+ 支持同一个DOM元素注册多个同类型事件。
+ 可以分为事件捕获和事件冒泡。

事件委托的优点：
+ 提高性能。每一个函数都会占用内存空间，只需要添加一个事件处理程序，占用内存空间更少。
+ 动态监听。自动绑定动态添加的元素

```js
<script>
    window.onload = function(){
        let div = document.getElementById('div');
        div.addEventListener('click',function(e){
            console.log(e.target)
        })
        let div3 = document.createElement('div');
        div3.setAttribute('class','div3')
        div3.innerHTML = 'div3';
        div.appendChild(div3)
    }
</script>
<body>
    <div id="div">
        <div class="div1">div1</div>
        <div class="div2">div2</div>
    </div>
</body>
```

事件委托不是越靠近顶层越好，事件冒泡过程也需要耗时。


###### 9、正则
+ 邮箱
```
邮箱由英文字母，数字，英文句号，下划线，中划线组成，若干个
邮件名称：[a-zA-Z0-9_-]+
域名规则：【N级域名】【三级域名.】二级域名.顶级域名。等同于**.**.**.**
邮箱规则：名称@域名
最终 /^[\w+-]+@[\w+-]+(\.[\w+-]+)+$/

如果允许汉字，汉字在正则：[\u4e00-\u9fa5]
```
+ url解析
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
+ 千分号
```
1、最后一个逗号：(?=\d{3}$)
2、多个逗号：(?=(\d{3})+$)
3、匹配的位置不能是开头：(?!^)(?=(\d{3})+$)
4、支持其他开头的，把^和结尾$，修改成\b：(?!\b)(?=(\d{3})+\b)
最终：/(?!\b)(?=(\d{3})+\b)/g
```
+ 去重

主要是对字符串去重
```
/(.).*\1/g
```
```js
var demo="ababbba";
demo = demo.split(''); //把字符串转换为数组
demo = demo.sort().join(''); //首先进行排序，这样结果会把相同的字符放在一起，然后再转换为字符串
demo.replace(/(.).*\1/g,"$1")
```


##### 二十五、你怎么怎么权衡这vue react两个框架,分析一下。
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



