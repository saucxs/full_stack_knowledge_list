# [sau交流学习社区](https://www.mwcxs.top/)
sau交流学习社区，一个技术分享和技术谈论的社区，技术栈：thinkjs2+jq+nunjucks+mysql+redis+nginx，个人全栈开发。
拥有文章管理，微型bbs社区，防止csrf攻击，权限管理，定时任务，页面后台配置，github第三方登陆，从中学会了使用
thinkjs后端开发，redis缓存频繁查库的信息，nginx处理静态文件，设计网站安全，优化网站渲染速度。

思考：
### 1、thinkjs2和thinkjs3的区别？
（1）thinkjs1.0在14年发布，360团队的李成银设计和开发，借鉴了thinkphp框架。
thinkjs2.0在15年发布，具备了可扩展性，支持ES6/ES7，支持TypeScript，性能提升。
框架是否出色，一看支持功能，二看性能，thinkjs更适合大型项目，功能和复杂度远超过express和koa，
但是性能不比他们逊色多少。
（2）thinkjs2主要特点：
+ 支持TypeScript
+ 升级babel到6
+ 多级控制器（controller可以建立子目录，目录的深度根据项目复杂度来定）
+ 支持postgreSQL，（目前支持4种数据库，mysql，SQLite，MongoDB，postgreSQL）
（3）thinkjs3.0在17年发布
最大改变时底层架构基于koa2.0重构，koa2.0稳定，koa2.0的洋葱模型的中间件更能满足多维度的需求，thinkjs3兼容koa的中间件，可以说是站在koa这个巨人的肩膀上做的更好。
koa2.0使用更优雅的async/await解决异步问题。node8.0后async/await被原生支持，不用借助babel转译。
+ 2内置很多功能，3不再提供丰富的功能，而是提供最基本核心，通过扩展和适配器可以满足不同需求。
+ 多进程模型，新增think-cluster模块内置多进程模型，最大限度的利用多核CPU提高响应速度，同时提供一套进程之间通信方式，
比如：通知其他进程执行某一个任务，代码更新后会重启所有的子进程。
+ 智能的错误提示。差错和定位问题，尤其是使用babel转译后，所以新增think-trace模块追踪错误问题，显示错误堆栈信息。
+ 强化定时任务功能，新增think-crontab模块。
+ 重构日志功能，基于think-logger3构建日志系统
+ 重构框架操作数据库操作逻辑

### 2、nunjucks模板引擎
nunjucks是Mozilla开发的一个纯js编写的模板引擎，可以运行在node端，又可以运行在浏览器端。nunjucks借鉴用python写的jinja2模板引擎。
我们知道flask框架下的jinja2模板引擎，jinjia2是由python实现的模板语言，设计思想来源于Django模板引擎，是flask框架内置模板语言。

使用模板好处：
+ 视图函数只负责业务逻辑处理和数据处理（业务逻辑方面）
+ 模板取到视图函数的数据结果进行展示（视图展示方面）
+ 代码结构清晰，耦合度低

### 3、项目如何具体防止csrf攻击
csrf是跨站请求伪造，本质是网站对浏览器的信任。简单说，就是利用用户的登陆状态发起恶意请求。

我在系统中做的是所有的接口请求都加csrf，thinkjs有针对csrf的配置，我们举个简单例子：

在页面初始化的时候，后端从session中获取csrf值，然后传到前台页面，前台页面整个影藏域存放csrf值。在base.js中统一assign，这样所有页面都有这个值。
然后发送接口的时候，传输数据添加csrf参数；然后验证这个csrf参数，并且请求时附带验证码或者token。

### 4、还有其他的csrf攻击防御措施吗？
+ 尽量使用post请求，限制使用get请求，get请求不修改数据。post不是万无一失的，攻击者需要伪装一个form，增加了csrf暴露的可能性。
+ 将cookie设置为httpOnly。这样通过程序就无法读取到cookie信息，避免了攻击者伪造cookie情况。
+ 将cookie设置为sameSite属性，不随着跨域请求发送。
+ 请求参数中附带验证信息，比如随机token或者验证码，后端进行校验
+ 通过HTTP头部字段Referer识别，阻止第三方网站访问请求接口。这个字段referer记录http请求的来源地址。


### 5、如何实现github第三方登陆？
第三方登陆实质是OAuth授权。
说一个具体场景：想登陆A网站，A网站让用户提供第三方的数据证明自己的身份。获取第三方网站的身份数据，这就需要Oauth授权。

流程：
+ A网站让用户跳转到Github
+ Github要求用户登陆，然后询问“A网站要求获得XX权限，你是否同意？”
+ 用户同意，Github会重定向回A网站，同时发送一个授权码
+ A网站使用授权码，向Github请求令牌
+ Github返回令牌
+ A网站使用令牌，向Github请求用户数据

