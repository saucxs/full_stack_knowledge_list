# Grid布局，你会了吗？
## 一、前言
之前一直觉得flex弹性盒布局已经很可以了，缺点是浏览器兼容性差，IE9及以上。

## 二、各种布局的梳理
### 1、静态布局
静态布局也就是传统的布局，屏幕宽或者高变化的时候，盒子使用横向或者纵向滚动条来查看遮挡，
也就是说，不管浏览器的视窗大小变化，都是按照html语义标签排列的布局来布置。

### 2、弹性布局
css3引入的弹性盒布局，flex布局，优点：入手很快，格局flex布局很容易达到布局效果，
缺点：浏览器兼容差，IE9及以上。

### 3、自适应布局
分别为不同屏幕分辨率定义布局，每一个布局中，页面元素不随窗口大小的调整而发生改变。
当窗口达到一定分辨率时候变化一次。

### 4、流式布局
页面元素的宽度按照屏幕的进行适配调整，元素的位置不变，大小变化。

### 5、响应式布局
在head中加入meta标签

```html
<meta name="viewport" content="device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
```

页面元素宽度随着窗口调整自动适配。
解释：
+ name="vieport"，名称为视图。
+ width=device-width，页面宽度等于设备宽度。
+ initial-scale-初始化缩放比例。
+ minimum-scale-允许用户缩放的最小比例。
+ maxmum-scale-允许用户缩放的最大比例。
+ user-scalable-知否支持用户手动缩放

### 6、网格布局Grid
二维布局系统，随意的定义每行每列的数目和大小，非常方便，兼容性还不错。

![grid布局](../../image/font-end-image/grid布局.png)

从上图可以知道：
+ PC端：chrome，edge，firefox，IE，Opera，Safari
+ 移动端：android，chrome for android，edge Mobile，Firefox for android，opera，ios safari。

## 三、基本概念
我们小时候学着写字的时候，网格。

![grid布局](../../image/font-end-image/grid布局_1.png)

我们简单介绍一下基本概念：
+ Container:网格容器，设置display：grid，这个容器就变成网格容器。
+ Item：网各项，设置网格容器的每一个子元素都是网格项。
+ Line：网格线，网格之间的分界线。
+ Track：网格轨道，两条相邻的网格线之间的空间。
+ Cell：网格单元，两个相邻的行列之间的区域，就好似上面每一个小格子
+ Area：网格区域，四条网格线包围起来的区域。

## 三、基本用法
我们先来看一个简单的

```html
<head>
    <meta charset="UTF-8">
    <title>Grid布局 | saucxs | songEagle</title>
    <style>
        body{
            background: #ccc;
        }
        .container{
            display: grid;
            grid-template-columns: 120px 120px 120px;
            grid-template-rows: 60px 60px;
        }
        .container > div{
            font-size: 30px;
            color: #fff;
            text-align: center;
            background: #666666;
        }
        .container > div:nth-child(2n){
            background: #336666;
        }
        .container > div:nth-child(4n){
            background: #f37e70;
        }
    </style>
</head>
<body>
    <div class="container">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
    </div>
</body>
```

![grid_布局](../../image/font-end-image/grid布局_2.png)

分析：
+ grid-template-columns: 120px 120px 120px 将容器画成三列，每列120px。
+ grid-template-rows: 50px 50px 将画成2行，每行50px。

上面的这两个属性将容器加上了两条横线，三条竖线，这样就画好格子了，里面有6个格子，如果再加一个div呢？
最后变成这样

![grid布局](../../image/font-end-image/grid布局_3.png)

**其实grid里，有一个隐式网络轨道**，意思就是：当我们的网格项没有处于我们定义的网格部分，会有一个默认值。
通过grid-auto-columns和grid-auto-rows来定义行和列。

现在我们来定义一下隐式网络轨道

```css
.container{
   // 新增加
   grid-auto-columns: 300px;
   grid-auto-rows: 100px
}
```

![grid布局](../../image/font-end-image/grid布局_4.png)

发现隐式网格的宽度是300px没有生效。不知道原因？

发现可以使用minmax函数来自适应

```css
.container{
   // 新增加
   grid-auto-columns: minmax(300px, auto);
   grid-auto-rows: minmax(100px, auto)
}
```

格子之间紧紧挨着，加上间隔，我们可以使用grid-gap: 4px 6px。

```css
.container{
   // 新增加
   grid-gap: 4px 6px
}
```

![grid布局](../../image/font-end-image/grid布局_5.png)


## 四、fr单位和repeat
**grid中的一个单位值fr**
fr表示自由空间中分配的一个单位，和flex的属性flex属性:flex-grow flex-shrink flex-basis，等分剩余空间。

比如说：容器宽度1000px，加入设置了grid-template-columns：200px 1fr 1fr 2fr。
这就表示分为4列，第一列200px，剩下的800px的剩余空间，800px/4=200px，2fr等于200px。

如果有多个重复的内容，我们可以使用repeat。
比如：

```css
 .container{
 // 修改
 grid-template-columns: 120px 120px 120px repeat(3, 1fr);
}
```

## 五、网格线的应用
如果我们要实现一个三栏布局，左右200px，中间自适应

```html
<head>
    <meta charset="UTF-8">
    <title>Grid布局 | saucxs | songEagle</title>
    <style>
        body{
            background: #ccc;
        }
        .container{
            display: grid;
            grid-template-columns: 200px 1fr 200px;
            grid-template-rows: 300px;
            grid-auto-columns: minmax(300px, auto);
            grid-auto-rows: minmax(100px, auto);
            grid-gap: 4px 6px;

        }
        .container > div{
            font-size: 30px;
            color: #fff;
            text-align: center;
            background: #666666;
        }
        .container > div:nth-child(2n){
            background: #336666;
        }
        .container > div:nth-child(4n){
            background: #f37e70;
        }
    </style>
</head>
<body>
    <div class="container">
        <div>Left</div>
        <div>Main</div>
        <div>Right</div>
    </div>
</body>
```

![grid布局](../../image/font-end-image/grid布局_7.png)

如果现在要改需求，需要再加一个header和footer，宽度是main的宽度。

可以使用网格线名称，grid-template-columns属性和grid-template-rows属性追踪使用方括号[]，指定网格线的名称，方便引用。

首先修改html

```html
<div class="container">
  <div class="header">Header</div>
  <div class="left">Left</div>
  <div class="main">Main</div>
  <div class="right">Right</div>
  <div class="footer">Footer</div>
</div>
```

然后修改css

```css
.container{
  display: grid;
  grid-template-columns: [index-start] 200px [main-satrt] 1fr [main-end] 200px [index-end];
  grid-template-rows: 100px 500px 100px;
  grid-gap: 4px 6px;
  grid-auto-columns: minmax(300px, auto);
  grid-auto-rows: minmax(100px, auto);
}
.header {
  grid-column: index-start / index-end;
}
.left {
  grid-column: index-start / main-satrt;
}
.main {
  grid-column: main-satrt / main-end;
}
.right {
  grid-column: main-end / index-end;
}
.footer {
  grid-column: index-start / index-end;
}
```

现在网格线来布局，横向布局4条网格线，纵向4条网格线，默认网格会为编号，从1开始，也可以自己命名网格线，

![grid布局](../../image/font-end-image/grid布局_8.png)

**同样可以使用横向向网格线。**

使用网格线将元素固定到它该有的位置上

最后说一下两个属性：
+ grid-column: 纵向网格名/纵向网格名
+ grid-row: 横向网格名/纵向网格名


## 六、网格区域的应用
我们先来说一下两个属性
+ grid-template-areas
+ grid-area
我们还可以通过另外一种创建网格的方式来定位元素，和画图一样，上面的例子

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 50px 300px 50px;
  grid-template-areas:
    '. h .'
    'l m r'
    '. f .';
  grid-gap: 4px 6px;
}

.header {
  grid-area: h;
}
.left {
  grid-area: l;
}
.right {
  grid-area: r;
}
.main {
  grid-area: m;
}
.footer {
  grid-area: f;
}
```
通过这种方式，我们也可以实现上面的需求。在grid-template-areas中的'.'代表这个位置空着。


## 七、repeat进阶
上面有使用repeat方法，创建网格时重复指定的次数，有时候我不想指定次数，希望自动填充。

我们考虑使用auto-fill和auto-fit。

我们先使用repeat把格子搭建起来：

```css
.container{
    display: grid;
    grid-tempalte-columns: repeat(9, 1fr);
    grid-template-rows: 50px;
    grid-gap: 4px 6px;
}
```
![grid布局](../../image/font-end-image/grid布局_9.png)

这样我们就建立了9列的网格系统，随着视窗不断变小，流式布局有点像，
**如果我们不希望每一个变得非常窄**，怎么处理？

grid中有一个minmax函数，一个最大值，一个最小值，保证元素在这个范围内改变。

```css
.container{
    display: grid;
    grid-tempalte-columns: repeat(9, minmax(250px, 1fr));
    grid-template-rows: 50px;
    grid-gap: 4px 6px;
}
```
每一列的宽度都会在 250px 到 1fr 之间，但是我们会发现，
他装不下这些格子，但是它也没有换行，因为你告诉它有 9 列，于是出现了滚动条。
```css
.container {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```
就会让浏览器去处理列宽和换行的问题，如果你给的容器宽度不够，它就会换行。

那auto-fill和auto-fit的区别？

+ auto-fill倾向于容纳更多的列。
+ auto-fit倾向于使用最小的列占满当前行空间。



## 优选文章
### 1、技术文章
+ [babel背后到底执行了什么？](https://mp.weixin.qq.com/s/Jd7sX1yNYdXPgepwlq-XLw)

+ [npm的原理](https://mp.weixin.qq.com/s/PSlUfdX3KGqvXdkC0xQ97w)

+ [快速学习Gulp并接入到项目中（一）](https://mp.weixin.qq.com/s/QQWzNvrXcqq_w3QKKvJagA)

+ [diff算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)

### 2、AB实验

+ [AB实验：MAB多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

+ [AB实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

### 3、每日一题

+ [【每日一题】(58题)算法题：接雨水问题](https://mp.weixin.qq.com/s/OtCI6SjtLCI608LOQMFQ3A)

+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)


### 4、总结

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


## 字节内推
+ [job Hunting 内推](https://mp.weixin.qq.com/s/8cydS51GUepGcebYI-NkLA)
+ [【北京】字节内推](https://www.yuque.com/docs/share/abbfa5de-51f1-4804-8654-4faddcf87616)
+ [【上海】字节内推](https://www.yuque.com/docs/share/69ec76e9-d36d-4f11-8ddf-55c6ffbeec28)
+ [【南京】字节内推](https://www.yuque.com/docs/share/1be5a1b8-8254-48a3-a76b-a6dcf399579a)
+ [【成都】字节内推](https://www.yuque.com/docs/share/0e0a07f1-7e10-4324-b654-b28850c07042)

## 个人微信

![个人微信](https://cdn.nlark.com/yuque/0/2021/png/276016/1629471940324-1389ccfc-2eb1-4c2d-834c-4f02afbea9a9.png)
## 感谢支持
> 松宝，「松宝写代码」公众号作者，也用saucxs混迹于江湖，watermark-dom包700+ star，曾在ACM校队，在字节做AB实验，担任面试官，出校招编程题，爱好折腾，致力于全栈，喜欢挑战自己。公众号有精选文章，进阶学习，每日一题，实验室，AB实验，字节内推等模块，欢迎关注和咨询，和松宝一起写代码，冲冲冲！
