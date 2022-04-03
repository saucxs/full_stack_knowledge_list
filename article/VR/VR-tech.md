# VR领域知识分享-VR技术介绍

hello，大家好，我是「松宝写代码」。

近期给大家带来了「VR领域」分享，主要大纲如下：

> VR发展史 - VR技术介绍 - VR行业数据 - VR未来发展路线 - 更全面了解VR

今天我们带来的是**VR技术介绍**，欢迎关注，留言交流学习。

## VR技术介绍
其实VR眼镜的概念很简单：**​把一个显示器罩在人的眼睛上，人向哪里看，就在显示器里显示对应方向的景物，从而让人感觉自己身处一个无限大的虚拟空间中。​**

要实现这个概念，需要如下几个基础结构：

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648651427084-c02ffd4e-70d8-4cb8-985d-70a5f8b0113e.png)

**1. 处理器​**
计算的核心，用来生成图像，根据陀螺仪数据计算姿态定位 等。为了防止眩晕，VR眼镜要求图像刷新率达到90Hz。这对运算速度要求很高。所以，一个VR眼镜的处理器芯片性能指标至关重要。​

**2. 显示器**
​分别向左右眼睛显示图像。一般当我们说 2k 屏幕的VR眼镜 时，是指一整块屏幕的长边的尺寸，比如 2k*1k 尺寸。但如果说：单眼2k，则是指屏幕短边的尺寸是2k。2020年，市场上主流的配置是 单眼2k左右。屏幕分辨率越高，要求配备的处理器也越强大。​

**3. 凸透镜片**
​如果把显示器直接贴在人眼前，人眼是很难聚焦这么近的物体的。凸透镜片的目的，就是通过折射光线，将显示器上的画面成像拉近到视网膜位置，使人的眼睛能轻松看清几乎贴在眼前的显示屏。

​**4. 陀螺仪​**
显示器里的景象，如果要随着人头部的运动而实时产生变化。则必须知道人头部的朝向，比如，当带着VR眼镜的人，向上看时，眼睛里的显示器，需要实时的显示虚拟的天空，而这个“向上看”的动作，就需要 陀螺仪 来检测。具体陀螺仪的原理就不介绍，大家只要知道，它是能检测到物体在空间中的姿态/朝向 即可。

有了如上4个基本结构，一个基本VR眼镜就成型了。

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648651886833-3caffc26-9fdc-46cb-aba5-be608117da61.png?x-oss-process=image%2Fresize%2Cw_502%2Climit_0)

### 1、VR眼镜的分类

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648651970158-2be61dff-b042-48f8-9773-e9524a05cb5e.png?x-oss-process=image%2Fresize%2Cw_1500%2Climit_0)

### 2、定位技术：3dof 与 6dof

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652048217-90ab61ce-e38b-4e34-8214-00a5e6b774ba.png?x-oss-process=image%2Fresize%2Cw_1023%2Climit_0)

#### (1)头部6Dof定位
+ ​外置激光定位​通过外置的激光发射器对设备进行定位，HTC vive 便是用了此种方式（ Lighthouse 技术，由 Valve 公司研制 ）。
+ ​优点：速度快，位置准，不易被干扰
+ ​缺点：成本高，配置复杂。

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652122923-94d2ff02-4741-4933-a547-f0c257162fe0.png)

**外置图像处理定位**

​通过外部放置摄像头，拍摄 头盔/手柄 上的光点，来进行定位，Oculus（红外线） 和 PSVR (可见光）都是使用这种方式。

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652176789-7c97aa0e-5703-47b9-9da4-a0c5eec6b9f5.png?x-oss-process=image%2Fresize%2Cw_554%2Climit_0)

**内置图像处理定位（ InsideOut 定位）​**

通过头盔上的摄像头拍摄画面的变化，来估计头盔运动。WMR、Pico Neo3 、 Quest 使用的是这种方式。它的优势是不需要额外架设设备。但是，定位精度上，比激光定位要差一些。

+ 优点：使用方便，成本低
+ ​缺点：对环境有要求（不能单色墙、不能过暗）

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652245008-6661fe1c-5a77-4b79-bfc0-4d70f92ae96d.png?x-oss-process=image%2Fresize%2Cw_1080%2Climit_0)

#### (2)手部6dof定位​
+ 外部定位的头盔：与头盔同样的方式
+ ​InsideOut的头盔：​

**视觉**

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652381767-9890e8ba-3650-45d4-802d-fbbb29431584.png?x-oss-process=image%2Fresize%2Cw_661%2Climit_0)


**超声：Pico Neo 1**

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652467170-bcb9032e-6425-4115-86ab-ede5c064b241.png?x-oss-process=image%2Fresize%2Cw_1280%2Climit_0)

**电磁：Pico Neo 2**

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652510267-8313ea58-f142-41c6-abc3-528b33fdd1cc.png?x-oss-process=image%2Fresize%2Cw_1280%2Climit_0)


### 3、VR 屏幕分辨率

#### (1)PPD：清晰度的黄金标准​

说到 清晰度，大家都会想到 视网膜分辨率（裸眼分辨不出像素颗粒）。对于手机来说，苹果把 视网膜分辨率的屏定义为：300 PPI（Pixel Per Inch）。也就是 每 inch 300个像素，用户在使用这样的手机时，是看不到像素颗粒的。​但是这个分辨率的屏幕，在VR眼镜里，却远远不够用。因为VR眼镜，相当于用一个放大镜看屏幕。​

这里需要引入一个更加跨平台、与使用场景无关的通用概念：PPD（ Pixel Per Degree），即，每一度视场角的像素数。相比于 PPI，PPD才是一个万用的与使用场景无关的黄金标准。

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652620853-366f7cb6-b0d4-478a-bbac-7b046139a14c.png)

业内比较流行的说法是达到 60 PPD 的图像，才能算得上是视网膜分辨率。​但这个60PPD的标准，是在非常严格的测试场景下，比如 观察边缘锐利的静止文字。其实观看动态的视频时，只要达到 30PPD左右时，人眼就注意不到像素颗粒，大约就是你在 20cm处，使用 iPhone4 手机的感觉。


#### (2)VR眼镜的PPD

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652689494-210a0f32-98c3-42d2-b7ee-6c2d16819ec5.png?x-oss-process=image%2Fresize%2Cw_861%2Climit_0)

目前，提到VR眼镜的分辨率，一般直接说屏幕是双眼 几K 屏。这是因为，目前的眼镜普遍的视场角都在100度左右，所以，眼镜的K数越大，基本上也越清晰。

​比如，2019年流行的是双眼4K屏。那么，每个眼睛看到的就是 2K 的屏幕。而现在主流VR眼镜的FOV（视场角）一般100度左右。所以它的 PPD就是 20PPD 左右。这比我们上面说的看视频时注意不到颗粒感的 30PPD 还是要小一些，但是已经没有纱窗感。​

### 4、VR 视频

#### 视频的 3dof 与 6dof​
传统VR视频都是 3dof。包括 2D/3D、180度/360度​

下图：4K 360度 2D VR视频

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652799085-bb3d748b-24c9-47b4-8e63-25f551f0fe6c.png?x-oss-process=image%2Fresize%2Cw_724%2Climit_0)

6dof 视频：容积摄影、体三维摄影

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648652893726-43fed258-c84b-4bec-9b47-217253bd4eb7.png?x-oss-process=image%2Fresize%2Cw_1280%2Climit_0)


#### 4K屏的VR眼镜，可以播放怎样分辨率的VR视频？
一个4k 的 360度视频，它的等效PPD 只有 11。也就是每个视场角只有 11个像素，远远低于 30PPD 的标准，甚至低于4K屏幕的 20PPD 的屏幕分辨精度。

​而一个 20PPD 的 360度视频，需要 20x360=7200 的横向像素数。所以大约需要8K视频才能充分利用4K屏的分辨率。

### 5、串流 与 云VR

在使用 本地VR 时，VR系统的整个渲染流程包括：

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648653008031-13c1c610-efdf-4c24-a1fd-6a4f5ca3b57a.png)

整个过程加起来，行业标准是需要小于 16ms

#### (1)串流时

​额外需要增加 编码 解码 过程，以及 WIFI传输 过程。整个流程下来，大约会有 50ms左右的延迟。

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648653074373-c71864e7-76e0-4766-a788-255458deb733.png?x-oss-process=image%2Fresize%2Cw_978%2Climit_0)

#### (2)云VR
​因为有个 网络传送 ，所以 云VR 要比 串流 延迟再增加 20ms以上。

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648653136850-e91bde4d-d22c-4476-9271-57f05b9ad67c.png?x-oss-process=image%2Fresize%2Cw_1100%2Climit_0)

就2021年的网络基础条件来说，具有良好体验的云VR，还很难实现。



# 关于「松宝写代码」

一句话简介：松宝写的不止是代码。

标签：不止是代码 深度与视野 字节同学

介绍：松宝写的不止是代码，saucxs昵称，watermark-dom水印开源900+Star的作者，曾ACM校队，现字节工程师，喜欢挑战自己，担任面试官和校招编程题。一个「有价值为你助力」的博主。

个人Github地址：https://github.com/saucxs

# 2022文章集锦
## LowCode
+ [【研究】低代码_无代码的深入浅出研究](https://mp.weixin.qq.com/s/v9lYrT7Y9RB3howH5RA4HQ)
+ [【唠唠】低代码_无代码的界定](https://mp.weixin.qq.com/s/bVrE-ldjNmQgA2LORPWQCw)

## AB实验
+ [观点 | 为什么在数据驱动的路上，AB实验值得信赖？（下）](https://mp.weixin.qq.com/s/4aTsDE3VEpMX4euitd7Opw)
+ [观点 | 为什么在数据驱动的路上，AB实验值得信赖？（上）](https://mp.weixin.qq.com/s/0203I2D1-exudGIhGOZgwg)


## 总结
+ [2021年，内推字节1w+](https://mp.weixin.qq.com/s/5J9oDUXmkD5ShxkEvcrduA)
+ [松宝写代码2022年立的Flag](https://mp.weixin.qq.com/s/FLcjhDbtZ1vminrLsrcxRg)
+ [松宝写代码2021年总结：突破重围](https://mp.weixin.qq.com/s/ei8x0HlWXi7LOCh4unESlg)

## VR
+ [看VR发展史，技术成熟度曲线的趋势是？](https://mp.weixin.qq.com/s/3AIaqi37tiaGSWvsSS9hOQ)

## 活动
+ [集中隔离了，程序员该干点啥呢？](https://mp.weixin.qq.com/s/o-cIYCrKuxueVMOG5pv51g)
+ [松宝集中隔离日志](https://mp.weixin.qq.com/s/axgKk_MJbh6_z4Yns5upSg)
+ [开工第一天，年后再说的事情来袭～](https://mp.weixin.qq.com/s/Dn7CxvR3iH3KkvQJgVYq6g)
+ [萌虎打Call](https://mp.weixin.qq.com/s/TSEnLD55y4WGvMBl5vbvzw)
+ [预料之中，意料之外，字节跳动春节红包来了](https://mp.weixin.qq.com/s/mSBp5wqXUHMZBUb86_-2lg)
+ [「松宝写代码」红包封面来了](https://mp.weixin.qq.com/s/ajEKSqs9eOOmutsO831wsg)

## 内推
+ [【兴趣电商】字节国际化电商在杭州招人啦！](https://mp.weixin.qq.com/s/l5wtA6xhodDbLP5Ke0wQ0A)
+ [【字节跳动】研发实习生闪电内推正式开启，无笔试可转正！](https://mp.weixin.qq.com/s/9jjyGSVEg1qf0913_5-3Uw)

## 转载
+ [字节跳动CEO梁汝波：使命是我们前进的动力 | 10周年演讲全文](https://mp.weixin.qq.com/s/xUGksSu53vK30pIZ5bdtnw)
+ [照片变画像，现在已经有了最新的技术，文末有Demo试玩](https://mp.weixin.qq.com/s/XQquyukl4br1Uy3emvSjxQ)