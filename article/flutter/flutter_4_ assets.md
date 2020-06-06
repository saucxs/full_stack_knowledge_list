## 【手把手学习flutter】flutter的资源管理

### 一、前言
Flutter App安装包中包含代码和assets(资源)两部分。assets是会打包到程序安装包中，可以在运行时候访问。

常见的类型的assets包括静态数据、配置文件、图标和图片(jpeg,webpg,gif,png，bmp，wbmp)等。

### 二、指定assets
flutter使用pubspec.yaml文件来管理应用程序所需的资源，举个例子：

```
flutter:
  assets:
    - assets/my_icon.png
    - assets/background.png
```

assets指定应包含在应用程序中的文件， 每个asset都通过相对于pubspec.yaml文件所在的文件系统路径来标识自身的路径。asset的声明顺序是无关紧要的，asset的实际目录可以是任意文件夹.

在构建期间，Flutter将asset放置到称为 asset bundle 的特殊存档中，应用程序可以在运行时读取它们（但不能修改）。


### 三、加载assets
可以通过AssetBundle对象访问其asset 。有两种主要方法允许从Asset bundle中加载字符串或图片（二进制）文件。

#### 1、加载文本assets
+ 通过rootBundle 对象加载：每个Flutter应用程序都有一个rootBundle对象， 通过它可以轻松访问主资源包，直接使用package:flutter/services.dart中全局静态的rootBundle对象来加载asset即可。
+ 通过 DefaultAssetBundle 加载：建议使用 DefaultAssetBundle 来获取当前BuildContext的AssetBundle。 这种方法不是使用应用程序构建的默认asset bundle，而是使父级widget在运行时动态替换的不同的AssetBundle，这对于本地化或测试场景很有用。

#### 2、加载图片
与原生开发相似，flutter可以为当前设备加载适合其分辨率的图片。

##### (1)声明分辨率相关的图片assets
AssetsImage可以将asset的请求逻辑映射到最接近当前设备像素比例（dpi）的asset。为了使这种映射起作用，必须根据特定的目录结构来保存asset：
```
…/image.png
…/Mx/image.png
…/Nx/image.png
…etc.
```

其中M和N是数字标识符，对应于其中包含的图像的分辨率，也就是说，它们指定不同设备像素比例的图片。

主资源默认对应于1.0倍的分辨率图片。看一个例子：

```
…/my_icon.png
…/2.0x/my_icon.png
…/3.0x/my_icon.png
```

在设备像素比率为1.8的设备上，.../2.0x/my_icon.png 将被选择。对于2.7的设备像素比率，.../3.0x/my_icon.png将被选择。

如果未在Image widget上指定渲染图像的宽度和高度，那么Image widget将占用与主资源相同的屏幕空间大小。 也就是说，如果.../my_icon.png是72px乘72px，那么.../3.0x/my_icon.png应该是216px乘216px; 但如果未指定宽度和高度，它们都将渲染为72像素×72像素（以逻辑像素为单位）。

pubspec.yaml中asset部分中的每一项都应与实际文件相对应，但主资源项除外。当主资源缺少某个资源时，会按分辨率从低到高的顺序去选择 ，也就是说1x中没有的话会在2x中找，2x中还没有的话就在3x中找。

##### (2)显示图片
要显示图片需要使用AssetImage类。

比如，我们可以从上面声明中加载背景图片

```
class BgPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new DecoratedBox(
    decoration: new BoxDecoration(
      image: new DecorationImage(
        image: new AssetImage('asset/images/bg.jpeg'),
      ),
    ),
  );
  }
}
```

需要注意的是：AssetImage并非是widget，实际上是一个ImageProvider，有时候你希望得到一个显示图片的widget，这样你可以使用Image.asset()方法，比如：

```
class BgPage2 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Image.asset('asset/images/bg.jpeg');
  }
}
```

使用默认的 asset bundle 加载资源时，内部会自动处理分辨率等，这些处理对开发者来说是无感知的。


### 四、特定平台assets
上面的资源都是flutter应用中的，这些资源只有在Flutter框架运行之后才能使用。

如果要给我们的应用设置APP图标或者添加启动图，那我们必须使用「特定平台的assets」。

#### 1、设置App的Icon
更新Flutter应用程序启动图标的方式与在本机Android或iOS应用程序中更新启动图标的方式相同。

##### (1)Android
在Flutter项目的根目录中，导航到.../android/app/src/main/res目录，里面包含了各种资源文件夹（如mipmap-hdpi已包含占位符图像“ic_launcher.png”）。只需按照[Android开发人员指南](https://material.io/design/iconography/product-icons.html)中的说明， 将其替换为所需的资源，并遵守每种屏幕密度（dpi）的建议图标大小标准。

> 注意: 如果您重命名.png文件，则还必须在您AndroidManifest.xml的<application>标签的android:icon属性中更新名称。


##### (2)IOS
在Flutter项目的根目录中，导航到.../ios/Runner。该目录中Assets.xcassets/AppIcon.appiconset已经包含占位符图片（见图2-9）， 只需将它们替换为适当大小的图片，保留原始文件名称。


#### 2、更新启动页
在Flutter框架加载时Flutter会使用本地平台机制启动页。此启动页「将持续到Flutter」渲染应用程序的第一帧时。

需要注意的地方：如果不在应用程序的main()方法中调用runApp函数。或者说，不调用window.render去响应window.onDrawFrame的话，启动屏幕将永远持续显示。

##### (1)Android
要将启动屏幕添加到Flutter应用程序，导航到.../android/src/main。

在res/drawable/launch_background.xml，通过自定义drawable来实现自定义启动页面。

![项目结构](http://static.chengxinsong.cn/image/flutter/flutter_asset_1.jpg)

```
<?xml version="1.0" encoding="utf-8"?>
<!-- Modify this file to customize your launch splash screen -->
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@android:color/white" />

    <!-- You can insert your own image assets here -->
    <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/bg" />
    </item>
</layer-list>
```
![项目结构](http://static.chengxinsong.cn/image/flutter/flutter_asset_2.jpg)


##### (2)IOS
要将图片添加到启动屏幕（splash screen）的中心，请导航至.../ios/Runner。在Assets.xcassets/LaunchImage.imageset， 拖入图片，并命名为LaunchImage.png、LaunchImage@2x.png、LaunchImage@3x.png。 如果你使用不同的文件名，那您还必须更新同一目录中的Contents.json文件，图片的具体尺寸可以查看苹果官方的标准。

您也可以通过打开Xcode完全自定义storyboard。在Project Navigator中导航到Runner/Runner然后通过打开Assets.xcassets拖入图片，或者通过在LaunchScreen.storyboard中使用Interface Builder进行自定义

### 五、欢迎关注
show me code：https://github.com/saucxs/flutter_learning/tree/master/hellotest

后续会出更多知识体系构建，技术分享，项目实战，实验室等，欢迎关注本公众号:**[松宝写代码]**

![欢迎关注](http://static.chengxinsong.cn/image/author/intro.jpg?width=600)

>微信公众号：**[松宝写代码]**
songEagle开发知识体系构建，技术分享，项目实战，实验室，带你一起学习新技术，总结学习过程，让你进阶到高级资深工程师，学习项目管理，思考职业发展，生活感悟，充实中成长起来。问题或建议，请公众号留言。

>微信群：**【写代码】研发进阶群**
一个成长交流的产研群，帮忙拉产研的同学们进群，聚聚人气😘😘。
每一个开发同学都应该形成自己的[知识体系](https://github.com/saucxs/full_stack_knowledge_list)，做到提纲挈领🧐🧐🧐

### 六、各种福利
关注微信公众号：**[松宝写代码]**，有各种福利。

**「字节跳动」内推福利：**

#### 1、社招内推
![社招内推](http://static.chengxinsong.cn/image/neitui/neitui_1.jpg)

#### 2、实习生内推
![实习生内推](http://static.chengxinsong.cn/image/neitui/shixisheng_neitui_1.jpg)

#### 3、校招内推
官网地址，投递时候填写内推码：8J5ZSB8