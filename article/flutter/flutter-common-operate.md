# flutter中一些常见操作

## 前言
在刚开始学习flutter的开发中，有些操作：经常需要使用一些package包，等需要单独设置和执行，所以做一下记录。

## 1、新增加依赖包并安装到本地
在项目的pubspec.yaml中，在dependencies下添加依赖的包。

比如我们需要添加http的包。

```
dependencies:
  http: ^0.12.2
```
然后我们使用命令行，执行`flutter pub get`安装到本地。

## 2、遇到问题
```
Target of URI doesn't exist: 'package:flutter/material.dart'.
```
拿不到packages，因为拿不到External Libraries中的Dart Packages文件夹不存在，我们进行下面的操作，重新拿到Dart Packages文件夹里的包。

```
flutter/flutter-intellij#2184 (comment)
You can solve it by following these steps：

exit Android Studio IDE

delete the hosted folder of .pub-cache in flutter SDK directory

 cd path/to/flutter_sdk_directory
 rm -rf .pub-cache/hosted
delete the .packages file in the project root directory

 cd path/to/project_root_directory
 rm -rf .packages
get packages for the project

cd path/to/project_root_directory
flutter pub get
open the project with Android Studio IDE

done~
```
但是这样操作后Dart Packages文件夹出现了，但是项目中还是不行。

然后我执行flutter doctor

```
chengxinsongdeMacBook-Pro:flutter_datatester chengxinsong$ flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 1.20.3, on Mac OS X 10.15.7 19H2, locale zh-Hans-CN)
[✓] Android toolchain - develop for Android devices (Android SDK version 29.0.3)
[!] Xcode - develop for iOS and macOS (Xcode 12.0.1)
    ✗ CocoaPods not installed.
        CocoaPods is used to retrieve the iOS and macOS platform side's plugin code that responds to your plugin usage on the Dart side.
        Without CocoaPods, plugins will not work on iOS or macOS.
        For more info, see https://flutter.dev/platform-plugins
      To install:
        sudo gem install cocoapods
[!] Android Studio (version 4.1)
    ✗ Flutter plugin not installed; this adds Flutter specific functionality.
    ✗ Dart plugin not installed; this adds Dart specific functionality.
[!] IntelliJ IDEA Ultimate Edition (version 2019.2.3)
    ✗ Flutter plugin not installed; this adds Flutter specific functionality.
    ✗ Dart plugin not installed; this adds Dart specific functionality.
 
[✓] Connected device (1 available)  
```

发现Android Studio (version 4.1)配置有点问题。
+ ✗ Flutter plugin not installed; this adds Flutter specific functionality.
+ ✗ Dart plugin not installed; this adds Dart specific functionality.

解决方案
需要安装两个插件:

Flutter插件： 支持Flutter开发工作流 (运行、调试、热重载等).
Dart插件： 提供代码分析 (输入代码时进行验证、代码补全等).

要安装这些:
启动Android Studio.

打开插件首选项 (Preferences>Plugins on macOS, File>Settings>Plugins on Windows & Linux).
选择 Browse repositories…, 选择 Flutter 插件并点击 install.
重启Android Studio后插件生效.

网上说的丢包错误，然后重新构建，情况解决。

## 3、RangeError (index): Invalid value: Valid value range is empty: 0
提示这个信息，意思是说：


## 4、SDK location not found.
```
 What went wrong:
Could not determine the dependencies of task ':compileReleaseAidl'.
> SDK location not found. Define location with an ANDROID_SDK_ROOT environment variable or by setting the sdk.dir path in your project's local properties file at '/Users/chengxinsong/Desktop/Tool/flutter/.pub-cache/git/flutter_components-96fe5673bfc6a191aa94eb474c1f5c4212a7417f/barcode_scan-3.0.1/android/local.properties'.

```