## Mac更新系统后git: xcrun: error: invalid active developer path问题解决方法
## 前言
最近在学习flutter，需要弄ios的配置，需要下载xcode，发现需要升级系统，我当前系统是10.14.x，app store安装Xcode需要将系统升级到10.15.x以上，然后升级了，升级之后发现不好使

## 提示错误信息
```
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun
```
意思就是git使用不了，第一反应就是，重新安装一下。

安装Xcode工具包！即使您以前安装过它，也可能必须重新注册它或将其更新到最新版本。

然后打算重新安装一下

```
chBook-Pro:~ saucxs$ brew install git
Error: You have not agreed to the Xcode license. Please resolve this by running:
  sudo xcodebuild -license accept
```

发现还是不行

需要执行

```
xcode-select --instal
```

然后等待安装一下，就OK。

如果还是不行，需要执行

```
sudo xcode-select --reset
```