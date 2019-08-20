# [songEagle](http://www.chengxinsong.cn)
支持服务端渲染SSR的博客，技术栈nuxt+vue+vuex+websocket+mysql+redis+nginx+jwt。
包含文章，实验室，按照类别和标签分类，文章支持github第三方登陆，首页的视觉采用threejs+webGLRender
实现网状波浪和三菱锥的动态效果，后台使用jwt做鉴权认证登录，支持markdown写文章，文章实时保存等功能。

思考：
### 1、什么是服务端渲染（SSR）？
通过服务端生成html字符串，再发送到浏览器。
+ 单页面应用，html中的body中为空，之后执行js将html结构注入body中，结合css显示。通俗的说：DOM元素在客户端根据js动态生成。
+ 使用服务端渲染，html的body中有首页的html结构，结合css显示出来。通俗的说：DOM元素在服务端生成。

**进阶**：
SSR优势：
+ （1）更利于SEO。不同爬虫工作原理类似，只会爬取源码，不会致辞那个网站的任何脚本。
+ （2）更利于首屏渲染。大型单页，文件体积较大，首页会有一个很长时间的白屏等待时间。

SSR缺点：
+ （1）服务端压力较大，高并发的情况下，会占用服务端CPU资源。
+ （2）开发条件受限，执行到mounted之前的生命周期。
+ （3）学习成本较高。项目构建和部署更加复杂。

SSR耗时比较：
+ 数据请求：服务端在内网进行请求，数据响应快。
+ HTML渲染：服务端渲染不需要等待js代码下载完成并请求数据，就可以返回一个已有完整数据的首屏页面。

生成html字符串原理：
**依靠vue-server-render这个库的createRender(),，然后调用renderToString()方法。**


### 2、什么是JWT授权认证登录？
JWT（JSON WEB Token）本质就是一个token，在前后端进行传递进行相应的校验。

过程：
+ 发起登录请求，后端服务端校验成功之后，使用sign签发token生成JWT认证信息。
+ 前端接收到JWT后进行存储。
+ 前端每次调用接口发送HTTP请求的时候，会将JWT放到HTTP中的headers参数的authorization中一起发给后端。
+ 后端接收请求后会根据JWT的信息，使用verify来校验当前用户是不是具有访问权限，访问权限交给服务端继续处理，没有直接返回401。


### 3、实时保存文章实现思路？
不小心退出导致数据丢失，所以必须有这个实时保存文章的功能。
+ 使用websocket来进行浏览器和服务器之间实时通信。
+ 服务端使用redis缓存实时编辑文章，编辑文章会出现频繁改动，频繁读写数据库不是科学合理方案。
+ 服务端使用定时任务，将redis缓存的数据存储到mysql中。
+ 浏览器初次进入到新增文章页面，使用websocket从服务器获取数据，首先从redis中查找数据，没有就去mysql中查找。
+ 浏览器初次进入到编辑页面，不需要从服务端获取数据，这样避免请求接口时间上浪费。
+ 使用vue的watch方式来监听写文章的页面变化，变化时使用websocket向服务端保存到redis中
+ 文章保存的时候，清空redis和向mysql保存数据。

### 4、threejs的理解
threejs是一个webGL为基础的库，对webGL的3D渲染工具方法与渲染循环封装的js库，省去繁琐的底层接口的交互，
通过threejs可以快速生成三维模型。

要创建模型，需要场景（scene）：3D对象的容器；相机（camera）：透视相机和非透视相机；和渲染器（render）：渲染3D场景并转换给网页可视化模块输出。

传统的三维图像制作，开发人员需要使用openGL图像程序接口进行开发，
从而实现了高性能，极具冲击力的高视觉表现力图形处理软件开发。
openGL不适合浏览器运行，在openGL为基础上，webGL统一标准，跨平台的openGL接口。
webGL可以为HTML5 canvas提供硬件三维加速渲染，web开发人员借助显卡在浏览器里更流畅展示三维场景和模型，
还能创建复杂的导航和数据可视化。

**进阶**：
+ 材质相关，有哪几种材质，区别
    > (1)meshBasicMaterial：为几何体赋予一种简单的颜色，或者显示几何体的线框。不考虑光照影响，
    参数有color(颜色)，wireframe(是否开启控制线框)，wireframeLinewidth(线段宽度),shading(着色模式，可选值)，fog：全局雾化效果
    设置的方式：
    + 构造函数：var meshMaterial = new THREE.MeshBasicMaterial({color:0xffccff});
    + 属性：meshMaterial.visible = false;
    > (2)MeshDeptMaterial：外观不由光照或者某种材质属性决定，而是物体到照相机距离决定。
    > (3)联合材质
+ 相机相关：4种相机（PerspectiveCamera透视相机:接近自然视图，符合近大远小的规律， OrthographicCamera正交相机，cubeCamera立体相机或者全景相机，StereoCamera3D相机
    > var camera = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,1000);
    fov视场，人有180视场，推荐默认值45，可以使用60-90的视场。aspect长宽比，默认值上面，near近面，见上，far远面，默认值见上。
+ 对灯光的感应程度
+ 面相关，如何镂空一个面，镂空面加uv
+ uv相关，
+ 几何变化
+ webgl和canvas的坐标转换
+ 模型围绕一个点运动
+ 波浪的实现：是一个MAth.sin实现的。planeGeometry平面体和网格mesh
+ 四面体（三菱锥）：TetrahedronGeometry 四面体和网格mesh
+ 渲染：使用requestAnimationFrame，重绘前插入节点
+ 避免内存泄露


### 5、markdown的原理？
项目中使用的是marked，自定义为解析markdown的低级编译器，轻量，
+ markdown原理：语法解析器。
+ nakdown语法解析最基本：正则和exec方法。
+ exec方法：用来检索字符串中的与正则匹配的内容，返回的是匹配的数组，否则返回null，
精准的去修改或者拼接字符串。rgExp.exec(str)
+ 基本正则方法，比如匹配html标签，自动字段 headers,list,代码块，图片等。 \n换行，\r回车，\r\n回车换行
+ 配置了1、sanitize对输出过滤，忽略已经输入的html代码（标签）。2、支持配置xhtml
