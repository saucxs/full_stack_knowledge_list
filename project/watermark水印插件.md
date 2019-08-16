# [watermark-dom水印插件](https://github.com/saucxs/watermark-dom)
水印插件给B/S系统加水印的，主要是简单易上手，支持多属性配置，支持本地导入和npm包导入。
目前有3个全局API方法。原理：css3的pointer-events事件穿透属性和opacity透明属性，使用shadow DOM(影子DOM)封装水印内容，随机插入到body里。


思考：
### 1、pointer-events属性？
+ 一句话：整个元素及其子元素事件穿透，也就是父元素设置这个属性值none，父元素不再监听鼠标事件。
+ 解释：一共10个属性值，普通元素是none和auto，其他8个属性值为SVG元素准备。
+ 兼容性：IE11+，其他浏览器。


### 2、opacity属性？
+ 一句话：整个元素及其子元素都会透明
+ 取值：0-1
+ 兼容性：IE9+，有替代方案filter属性


### 3、shadow DOM(影子DOM)属性？
+ 一句话：影子DOM是一个规范，允许开发人员封装自定义html，css和特定的js形成自定义标签。
+ 通过element.createShadowRoot()创建目标容器，后来官网方法要废弃，然后改用attachShadow方法，优势shadowDOM与主DOM样式互不影响，兼容性查的问题，做一个正常DOM。还可以使用template标签实现shadowDOM
+ shadowDOM事件绑定到宿主对象上，shadowDOM里面节点绑定事件，能正常触发，冒泡事件会正常向上传递。

### 4、支持commonjs和ES6，那什么是模块规范？
目前主流的模块规范：
+ UMD通用模块:AMD+commonjs+全局变量组合规范，很多前端库都是使用UMD模块规范。
+ commonjs
+ es6 module


```js
//传统CommonJS写法,是Node的规范
module.export = {
  field1: value1,
  field2: function(){
    //implements
  }
}
//ES6写法
//exportDefault.js
export default {
   field1: value1,
   field2: function(){
     //implements
   }
};
```
