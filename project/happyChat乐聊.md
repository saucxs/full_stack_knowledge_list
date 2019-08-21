# [happyChat乐聊](https://chat.chengxinsong.cn)
一款聊天的技术产品，支持PC端，无线端，桌面端和安卓端。支持文件，emoji表情，支持https和http2.0
，全局使用Router.beforeEach实现数据埋点。技术栈：vue+vuex+koa2+websocketIO+mysql+redis。
桌面端使用electron实现，安卓端采用cordova实现。


思考：
### 1、websocket实现原理？
http协议有个缺陷，通信只能客户端发起，然后服务端返回查询结果，http协议做不到服务端主动向客户端推送消息，这是单向请求。
如果要知道服务端的连续变化，我们可以使用**轮询**：每隔一段时间发送一个请求。
轮询的效率低，浪费资源（http不断连接）。

websocket协议08年诞生，11年成为标准。websocket协议是持久化协议，而http是非持久协议。

websocket特点：服务器可以主动向客户端推送信息，客户端也可以主动向服务端发送信息，数据双向通信。

其他特点：
+ 建立在TCP协议之上，服务端实现比较容易。
+ 与http协议有良好的兼容性，默认端口80和443，握手阶段采用http协议，能够通过各种http代理服务器。
+ 数据格式比较轻量，性能开销小，通信高效。
+ 可以发送文本，也可以发送二进制数据。
+ 没有同源限制，客户端可以与任意服务器通信。
+ 协议标识ws，如果是加密，为wss。

**深入**：

**1、请求和发送过程理解？**

+ 在http握手的时候，请求头和响应头中都有字段upgrade使用websocket，字段connection使用upgrade。告诉代理服务器使用websocket协议，

客户端：
 > + 会产生一个sec-websocket-key，是一个base64 encode的值，是浏览器随机生成，用来验证是不是websocket来处理。
 > + 会产生一个sec-websocket-protocol，用户自定义的字符串，用来区分具体给谁发信息。
 > + 会产生一个sec-websocket-version告诉服务器使用协议版本，现在基本上是13，代表

服务端：
  > + 对应产生一个websocket-accept，表示服务器确定，值为加密过后的websocket-key。
  > + websocket-protocol表示，最终使用的协议

**2、websocket的帧和数据分片传输**

http协议：发送数据是分包转发，也就是将大数据根据报文形式分隔成一小块一小块发送到服务端，服务端接收到发送的报文后，再将小块数据拼接组装。
websocket协议：帧（frame）是websocket发送数据的基本单位。客户端将消息切割成多个帧，然后发送给服务端，服务端接受到消息帧后，并将关联的帧从新组装成完整的消息。

区别：
 
+ websocket协议中，客户端的发送的数据分片是有序的，http协议数据分片是无序的。

**3、websocket连接保持和心跳检测**
心脏检测是为了检测客户端与服务端连接是否存活。
+ （1）心脏检查包由客户端定时向服务端约定好消息格式，告诉服务端在线，服务端收到消息后立即返回消息，告诉客户端长连接正常。
+ （2）心脏检测用来检测后端是否正常，如果在连接正常情况下，服务端未能在设定事件内返回特定消息，说明前后端异常，不可用时，客户端重新建立websocket连接重试。


### 2、项目中如何在移动端的适配？
获取屏幕dpr（设备像素比）和初始化屏幕比例，使用flex布局和rem做布局适配。js添加屏幕标识以便调整字体大小。

**其他移动端适配方案：**
+ 使用vw，vw是viewPort视窗的长度单位，视窗指的是浏览器可视化的区域，对应的是window.innerWidth和window.innerHeight。
+ 单位：vw，vh，vmin，vmax，1vw = window.innerWidth的1%。vmin是当前vw和vh中较小的值。
+ 对于设计图中px转换成vw，可以使用postcss的插件postcss-px-to-viewport，我们写px，编译后是vw。

我理解的最佳实践：
+ 用户体验很高的页面，活动页这些应该以用户体验优先，使用vw实现页面适配，通过postcss插件postcss-px-to-viewport把px转换为vw。
有插件实现长宽比，有插件实现1px的问题。
+ 在其他页面不缩放，使用rem做布局适配，js添加屏幕标识以便调整字体大小。

### 3、项目中如何在移动端的图片高清？
主要是：1、css像素和物理像素，正常是1:1，retina屏幕是1:4。2、物理像素和图像像素，正常是1:1，retina屏幕是1:4
所以出现两种问题：
+ 1、border的1px的问题，我们可以使用transform：scaleY(0.5)进行缩放或者使用js判断当前浏览器是否支持border的0.5px，支持就在html上添加一个class名。
+ 2、图片的高清问题，图片长宽的两倍，图片容器缩小50%。这样不是最优的方案，可以在不同的dpr下，加载不同尺寸的图片。


### 3、讲一下https和http2.0
#### http
http是个无状态的协议，不会保存状态。
##### http里的get请求和post请求
get请求多用于无副作用的场景，post请求多用于有副作用的场景。
区别：
+ get请求能缓存，post请求不能缓存
+ post请求比get请求安全，因为get请求都包含url里，会被浏览器保存历史记录，post不会。
+ post请求request body传输比get更多的数据，get没有
+ URL长度限制。是因为浏览器和服务器的限制，而不是http限制。比如谷歌浏览器的URL的8182个字符，
IE浏览器URL最大限制是2083个字符，等等，所以URL长度不要超过IE规定的最大长度2083个字符。
中文的utf8的最终编码的字符长度是9个字符。
+ post类型支持更多的编码类型且不对数据类型限制
##### http首部
###### 通用字段
+ Cache-Control：控制缓存行为
+ Connection：浏览器想要优先使用的连接类型，比如keep-alive，服务器配置和客户端支持
+ Data：创建报文时间
+ Pragma：报文指令
+ Via：代理服务器相关信息
+ Transfer-Encoding：传输编码方式
+ Upgrade：要求客户端升级协议
+ Warning：内容中可能存在错误

###### 请求字段
+ Accept：能正确接收的媒体类型
+ Accept-Charset：能正确接收的字符集
+ Accept-Encoding：能正确接收的编码格式列表，比如gzip
+ Host：服务器域名
+ If-Match：两端资源标记比较
+ If-Modified-Since：本地资源未修改返回304（比较时间）
+ If-None-Match：本地资源未修改返回304（比较标记）
+ User-Agent：客户端信息
+ Referer：浏览器访问的前一个页面

###### 响应字段
+ Age：资源在dialing缓存中存在的时间
+ Etag：资源标识
+ Server：服务器名字

###### 实体字段
+ Allow：资源正确的请求方式
+ Content-Encoding：内容的编码格式
+ Content-Length：request body长度
+ Expires：内容的过期时间
+ Last-modified：内容最后的修改时间


#### https
https还是通过http传输信息，但是信息是通过TLS协议进行加密。

五层网络协议：
+ 1、应用层（DNS，HTTP）：DNS解析成IP，并发送http请求，
+ 2、传输层（TCP，UDP）：建立TCP连接，
+ 3、网络层（IP，ARP）：IP寻址，
+ 4、数据链路层（PPP）：封装成帧
+ 5、物理层：传输介质

TLS协议位于应用层下，传输层上。

TLS1.2首次进行TLS协议传输需要两个RTT，接下来通过缓存会减少一个RTT。
TLS1.3首次建立只需要一个RTT，后面恢复连接不需要RTT。

TLS中使用两种加密技术，分别为：对称加密和非对称加密。

#### http2.0
http2.0位于应用层
为啥引入http2.0原因：浏览器限制同一个域名下的请求数量，当页面有需要请求很多资源的时候，
队头阻塞会导致达到最大请求数量，剩余资源要等到其他资源加载完毕后才能发起请求。

http2.0核心：
+ 二进制传输：之前传输方式文本传输，http2.0新的编码机制，传输数据都被分隔，并采用二进制格式编码。
+ 多路复用：在一个TCP中可以存在多个流，就是多个请求公用同一个TCP连接，本质是：通过帧中的标识知道属于哪个请求，避免了队头阻塞问题，极大提高传输性能。
+ Header压缩：对传输的haeder进行压缩，两端维护索引表，记录出现的header，通过键名找到对应的值。
+ QUIC协议：基于UDP实现的传输层协议，替换TCP协议。


### 4、讲一下electron？
用html，css，js来构建跨平台桌面程序的一个库。依赖于谷歌浏览器的内核的渲染库和V8引擎

electron进程
+ 主进程：主要是负责GUI部分的构建
+ 渲染进程：负责页面显示的构建

主进程和渲染进行的通信？
+ 进程之间共享数据，在主程序和渲染程序中可以得到数据。提供IPC系统共享数据。
+ 不同页面共享数据：storage indexDB都可以
+ electron通信：通过发布监听模式实现的，和vue中父子组件通信emit和on有点像。


### 5、讲一下cordova？
cordova使用html+css+js构建移动应用平台，把cordova是一个容器，用于将我们web应用程序与本机移动功能连接。
核心东西：H5和原生的交互原理，bridge，定义解析规则。

cordova是先获取config.xml的setting，保存下来，初始化一些类为webview加载提供需要，
webview加载链接时候会注入cordova的一些js，还有一些原生的cordova类。
