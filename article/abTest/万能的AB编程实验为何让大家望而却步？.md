> AB实验是什么？为什么需要使用AB实验？如何科学的进行AB实验？

![image.png](https://cdn.nlark.com/yuque/0/2021/png/276016/1635243620952-974eae6e-0ad9-4f6e-acef-f5794c17622b.png#clientId=uf0ed33e2-e450-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=89&id=zlBB3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=177&originWidth=284&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35254&status=done&style=none&taskId=ud6db88b2-66fd-42ed-acd2-22872362609&title=&width=142)

一脸茫然的同学们可以先来看看一些基本概念和认知：

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://juejin.cn/post/6972181439123046408)
+ [AB实验基础-专有名词](https://juejin.cn/post/6973622831263252487)
+ [MAB多臂老虎机智能调优的基本原理](https://juejin.cn/post/6994466335707103269)

# 一、AB实验的冰山一角
![image.png](https://cdn.nlark.com/yuque/0/2021/png/276016/1635260333314-9e980861-e6d6-46f8-bc3c-e0fa92992b40.png#clientId=uf0ed33e2-e450-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=400&id=u4f6a5d46&margin=%5Bobject%20Object%5D&name=image.png&originHeight=799&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1644193&status=done&style=none&taskId=u1c77591d-bb58-40f1-b57e-6decc9aa299&title=&width=640)
你看到的AB实验，以及你没有看见的AB实验。你看见的AB实验仅仅是冰山一角。
> AB实验中编程实验为什么是万能的？
> 为什么万能编程实验却让很多人望而却步？
> 如何真正的开启一个编程实验？
> 如何配置实验，如何验证白名单生效？
> 如何验证AB分流？
> 如何真的开启AB实验？

带着这些问题，字节跳动资深专家带领我们一起探寻这些问题的答案！

# 二、大胆假设，小心求证
从最基础的AB专有名词引入，分享进行AB应用接入，验证数据上报，AB客户端编程实验，设计实验，详细配置，验证白名单生效，验证AB分流，AB开启实验等等，带你进入AB实验的世界，让小白也能轻松上手，让我们一起大胆假设，小心求证！精彩内容就在第9期AB大讲堂！
> 明晚（2021.10.26）直播和大家不见不散，欢迎「飞书直播/火山引擎抖音直播」交流和咨询～

海报👇
![20211026-104652.png](https://cdn.nlark.com/yuque/0/2021/png/276016/1635243479586-1fdb451c-8ca3-4f41-b151-331897ed3993.png#clientId=uf0ed33e2-e450-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=2850&id=ueba3e2d2&margin=%5Bobject%20Object%5D&name=20211026-104652.png&originHeight=5700&originWidth=1125&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3143371&status=done&style=none&taskId=u574d6a94-7efe-4818-b2bd-23ec8ce4ce1&title=&width=562.5)


# AB直播内容：万能的编程实验为何让大家都望而却步 
各位同学们和老板们，大家好，我是火山引擎AB测试的程新松，也可以叫我松宝写代码，为啥叫这个？谁还不是个宝呢。言归正传，今天我给大家带来了「万能的编程实验为何让大家都望而却步」。 

今天直播聚焦到：编程实验，干货有趣。
# 一、奇怪问题 
什么是编程实验？ 

为什么编程实验是万能的？

除了编程实验，还有哪些其他模式的实验？

为什么说是万能的编程实验？ 

编程实验难吗？ 

编程实验和其他模式实验的区别？ 

如何开启实验？ 

如何验证编程实验？ 

AB测试的道路上，大胆假设、小心求证。 
# 二、主要内容 
1、AB一些专有名词介绍。

2、AB应用接入，验证数据上报。 

3、AB客户端编程实验，设计实验，详细配置，验证白名单生效，验证AB分流，AB开启实验等。 

4、常见问题QA。 

# 三、专有名词 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024168-2147261e-27bd-4036-9c8e-d8b00a7f81b7.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u6b8fc124&margin=%5Bobject%20Object%5D&originHeight=566&originWidth=882&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3777f5f0-7d8c-402d-9a2f-735583d9bf1&title=)
其中一些专有名词 

**应用名称**：应用可以是web，安卓，IOS，小程序，桌面端等，比如：抖音，今日头条等。 

**appId**：每一个应用名称对应一个唯一的标识，表示该应用的Id。 

**实验：** 一个AB实验Flight，一个应用可以建立多个实验。 

**指标：** 主要是几个指标，根据上报的事件构成指标，便于数据计算统计和分析。比如：要分析注册按钮的点击率，直接在指标中可以选择按钮的点击事件和计算方式（算子）的【转化率】。 

**实验组：** 实验组Version，每个实验组都包含配置，代表要做实验的策略。 

**实验层**：layer，每个实验层都代表100%的线上流量。

**流量**：实验所占的线上流量Traffic，精度0.1%。 

**流量分配**：产品在快速迭代中，会有很多AB测试需要同时做，而且产品的流量有限，所以需要充分对流量进行分配。同样的一群用户，我们可以可以给他划分若干域，每一个域对应多个互斥层。 

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024054-5870d3b1-1d4a-4456-ae0f-cd514e824071.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uaad01533&margin=%5Bobject%20Object%5D&originHeight=401&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u37c94cb5-1b01-453c-ba29-6aad48e7903&title=)

**过滤条件**：实验过滤条件Filter，规定被实验命中的用户必须符合（或不符合）这些条件，进而达到缩小用户集群、精准找到用户的目的，只有满足条件的流量才会命中实验。 

**白名单**：在实验正式开启之前，通常需要先选择几名用户进入测试阶段，观察实验是否能够正常获取想要收集的数据。 

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024173-7cdb387c-6eae-4793-ba90-2bd702cd24a2.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u0c2e3410&margin=%5Bobject%20Object%5D&originHeight=937&originWidth=1500&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u06b2b4da-71da-4c15-b030-541c6eb9e3f&title=)

# 四、AB应用接入 
实例应用：HappyChat乐聊 
## 1、集团应用列表 
前提条件：用户注册了账号，已经在某一个集团下，开始接入应用。 
火山引擎AB测试地址：https://console.volcengine.com/datarangers 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024041-9c91676f-e9e6-444f-abac-b16446f5d300.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u90c78e02&margin=%5Bobject%20Object%5D&originHeight=452&originWidth=2006&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3d99d95b-2ade-4112-a350-9256347b527&title=)
集团应用列表主要是展示当前的集团和该集团下的应用列表 
支持：切换集团，搜索集团，选择集团 
## 2、接入AB新应用 
点击【新增接入】按钮 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024226-2a6a7298-bf11-496b-a42e-de546946cb51.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u544c657e&margin=%5Bobject%20Object%5D&originHeight=822&originWidth=3284&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0d4d56a6-6a6f-442d-b04d-61d48f348a8&title=)
选择A/B测试，点击【立即接入】按钮 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024790-124bdf27-41df-4c2d-b67f-7cc93d5e7b76.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ue6a89971&margin=%5Bobject%20Object%5D&originHeight=1086&originWidth=2760&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u11c9172b-dff2-4653-8a64-53f4e973ad6&title=)
### 2.1 创建应用 
输入应用名和App Name，这两项是必填项。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176024771-165cbd9a-2ea5-48e8-953a-e902c2f39110.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ua29b5c28&margin=%5Bobject%20Object%5D&originHeight=1074&originWidth=2798&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc9dd76b6-9fd3-4052-9fb5-a46fef7578e&title=)
说明一下： 
应用名：主要是用来显示应用的中文名称，以及大多数地方展示的名称 
App Name：主要是用来作为唯一标识，不支持修改 
统计时区：针对你的应用对应的时区，支持搜索。 
高级选项：默认不需要填写，不需要关注，web/H5/Wap的应用不需要打开，高级选项内容主要是用户规模，APP的IOS包名和Android包名。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176025248-faa9e3e0-efed-4d92-afd4-9cd8a3f6824d.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u00669717&margin=%5Bobject%20Object%5D&originHeight=400&originWidth=1302&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0f359433-4c10-450f-8f7f-cb2606aed33&title=)
### 2.2添加代码 
选择Web/JS的选项 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176025288-b12ce51e-4dd2-4b4c-bc76-645674a0b69a.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u36378985&margin=%5Bobject%20Object%5D&originHeight=1632&originWidth=2608&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc8af97da-dd65-44c8-9434-13726df34e0&title=)
初始化SDK，在每一个接入的页面的</head>标签前添加代码，最新的代码接入可以参考：https://www.volcengine.com/docs/6287/65803 
```
<script>    
    (function(win, export_obj) {
        win['TeaAnalyticsObject'] = export_obj;
        if (!win[export_obj]) {
            function _collect() {
                _collect.q.push(arguments);
            }
            _collect.q = _collect.q || [];
            win[export_obj] = _collect;            
        }
        win[export_obj].l = +new Date();
    })(window, 'collectEvent');
    </script>
    <script async src="https://lf3-data.volccdn.com/obj/data-static/log-sdk/collect/collect-autotrack-rangers.js"></script>
 <script> 
window.collectEvent('init', {
        app_id: 000000,   //  必须替换成申请的 app_id
        channel:'cn',   // 区域，国内还是海外
        log: true, // 开启调试日志，可用于查看ssid，web_id, 和user_unique_id， 上线请关闭
        enable_ab_test: true,   // boolean类型，是否开启A/B实验功能
        enable_ab_visual: false,  // boolean类型，按需开启，默认关闭，是否开启A/B实验的可视化编辑模式功能
        enable_multilink: false,    //boolean类型，按需开启，默认关闭，是否开启A/B实验的多链接实验功能，默认为false
        multilink_timeout_ms:3000。 //number类型，A/B实验的多链接实验中关闭遮罩层的时间，默认500毫秒
    });
    window.collectEvent('start');
 </script>
```

如果应用是Vue/React的单页应用下，只需要在html页面加入即可。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176025595-36510e0d-52f4-4005-a911-c532dad44611.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uff0ba106&margin=%5Bobject%20Object%5D&originHeight=1234&originWidth=2092&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u363e5ba1-e0fc-411f-9f46-748b9a00309&title=)
### 2.3上报行为事件 
可以在任意位置调用该函数上报事件，事件会等到添加代码中的window.collectEvent('start') 调用后，才真正发出。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176025700-1d301287-c8c6-4d96-8c8f-85e93f3099d2.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u42521905&margin=%5Bobject%20Object%5D&originHeight=1304&originWidth=1816&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9ce74b1f-a216-4173-8daf-9900848796b&title=)
示例代码如下 
```jsx
//这里的事件 play_video、属性 video_title 只是示例，请结合自己的需求进行自定义埋点。
window.collectEvent('play_video', {
  'video_title': 'the title here',
})
```

如果应用是Vue/React的单页应用下， 
方案一（更通用）：可以在html页面的window.collectEvent('start')进行数据上报测试。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176025707-a7797713-a9f8-4abc-b0b4-f0eef7a84e4d.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u823d932c&margin=%5Bobject%20Object%5D&originHeight=846&originWidth=1816&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7675107f-be5b-4453-b2ac-4c0922b591d&title=)
方案二：可以在其他页面或者在App.vue文件下的created或mounted方法下使用window.collectEvent上报行为事件。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176025769-46eacc2d-7e03-486d-bd36-4b831a0ce0f3.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u9a07398f&margin=%5Bobject%20Object%5D&originHeight=302&originWidth=1436&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u711b4338-542a-4a14-8498-5aa887af65c&title=)
### 2.4验证SDK初始化 
在本地调试AB测试接入的时候，谷歌Chrome浏览器按F12，看Application下的localstorage下找__tea_cache_tokens_{appId} 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176026195-b2ed9acb-ae76-45fc-a2a7-e05b6fbdfc53.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ue84cb5d1&margin=%5Bobject%20Object%5D&originHeight=794&originWidth=2686&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucb53cd35-a58c-4b84-9af3-b7854d31013&title=)
说明SDK初始化成功了，SDK默认分配了ssid和user_unique_id等。只要不清除localstorage中的__tea_cache_tokens等key，ssid大多数情况下是不变的。只有少数情况下ssid会变，这里我们不告诉大家，后边我们再讲这个。 
### 2.5验证SDK数据上报 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176026353-886eaa3a-30cf-4c67-9d76-fa09e3b075f9.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u9be08d66&margin=%5Bobject%20Object%5D&originHeight=1256&originWidth=2404&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua5184207-5f9e-4738-9df9-237dc4fa721&title=)
在本地调试AB测试SDK数据上报的时候，谷歌Chrome浏览器按F12，看Network下的list接口下找请求体body下的events下找自己的上报事件名称，比如之前上报行为示例写的是「事件 play_video、属性 video_title 只是示例」。 
### 2.6下一步完成应用接入 
进入到如下的页面，说明已经完成SDK初始化和SDK上报行为。 
点击开始AB实验，直接进入到AB实验平台中。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176026430-e7ba62ed-2095-4f0d-a989-52f5b743f31c.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u7898bdbb&margin=%5Bobject%20Object%5D&originHeight=1568&originWidth=2234&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc42b9df6-6262-4b15-bef5-bd91dba4722&title=)
### 2.7进入到AB测试平台 
⚠️注意：把实验列表页面添加书签🔖，便于后续经常需要用到该页面。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176026515-e444d59c-7f25-49e3-8b65-ccc02f89ee2c.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uca22005f&margin=%5Bobject%20Object%5D&originHeight=1114&originWidth=2724&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf68a1daa-f24d-4cda-ac9a-3e4f1c0acc2&title=)
# 五、AB客户端编程实验 
从上一步接入AB新应用最后一步，点击开启AB实验进入到AB的实验列表。 
## 1、简单设计AB实验 
我们先来做一个AB客户端编程实验。 
我们的目的：应用的留言反馈页面的AB实验。 
业务地址：https://chat.chengxinsong.cn/feedback 
业务背景：该留言反馈页面可以在未登录和登陆都可以看到，现在对这个页面AB，实验组使用新的UI，对照组使用之前的UI。我们来观察UI改版之后，把「点击留言按钮」的转化率设置为核心指标，观察核心指标的情况，看哪种UI下，用户的留言转化率更高，更置信，用户更偏爱。 
### 3.1实验前VS实验后 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176031597-00c5da6b-3174-4c50-ae15-ca96c1463bb3.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u98b24070&margin=%5Bobject%20Object%5D&originHeight=1276&originWidth=710&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u19c1af87-473f-49a5-a23c-61a4305bc56&title=)![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176027058-c02d92b8-5c3d-42b3-b431-fe8f4897458e.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u606fa5e2&margin=%5Bobject%20Object%5D&originHeight=1270&originWidth=714&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8f763d04-3c74-4ad2-a826-f7fd54e2acd&title=)
## 2、留言按钮转化率核心指标 
我们在代码中，留言反馈页面的提交按钮，点击的时候，上报事件feed_back_click，事件属性名submit，属性值设为ok，设置如下。 
```
 // 留言转化率 事件上报
window.collectEvent('feed_back_click', {
  'submit': 'ok'
});
```

本地添加事件上报之后，点击提交按钮，验证事件上报是否正常。 
如下截图说明事件上报正常。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176027188-2fbef6b1-bf72-426e-8745-67bc26241c09.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u3db2dddc&margin=%5Bobject%20Object%5D&originHeight=1154&originWidth=2424&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua36c796c-74fd-4a46-aff5-656745d6bde&title=)
## 3、新建AB的编程实验 
点击【新建实验】按钮 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176027283-5d557aee-6e60-4d5c-95df-824dbfe31994.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ud0926da2&margin=%5Bobject%20Object%5D&originHeight=1188&originWidth=2730&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6417ed1f-9be4-4125-a62b-a1989a1c321&title=)
有个弹窗，选择实验模式，我们先选编程实验。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176027403-9b270e26-1220-4d9e-b0f7-be294fccafc9.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=udf04baf5&margin=%5Bobject%20Object%5D&originHeight=1002&originWidth=1978&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uedd610de-17cd-4374-900d-acd31e12519&title=)
### **3.1 第一步基本信息**
点击「确定」按钮，进入到该实验的基本信息。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176027983-e8b0088d-ce66-44f3-9235-5d61d8f41688.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u43a0c295&margin=%5Bobject%20Object%5D&originHeight=1362&originWidth=2704&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9870b80f-10a7-4469-808f-b4209e07a4c&title=)
实验类型有客户端和服务端。我们选客户端实验。实验时长需要科学来估算的。 
高级设置我们先可以忽略。 
### **3.2 第二步新建选择关注指标**
点击【下一步】按钮，进入到选择关注指标，新建指标 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176028095-9e2d4b05-cfda-471b-914a-a5bd9b0057e0.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u42f7d691&margin=%5Bobject%20Object%5D&originHeight=1392&originWidth=2522&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uaaee081e-67ad-44f5-8533-ff9999e011a&title=)
新建指标弹窗，根据自己的业务场景，设置指标参数。 
选择指标类别：选择事件指标 
输入指标名称：定一个指标名称 
指标描述：指标的定义描述，更详细的说明 
指标类型：选择单一指标 
设置指标：留言反馈页面提交留言反馈的按钮，按钮点击的作为feed_back_click事件，统计口径使用转化率，也称为算子。 
数值格式：设置为百分比，小数位数4 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176028140-3fad1b4a-8e5f-4321-8688-c75bc0f18867.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u58f59d5a&margin=%5Bobject%20Object%5D&originHeight=1094&originWidth=1542&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uff800e70-b8f0-46d2-b488-983c01212ed&title=)
### **3.3 第三步实验版本**
点击下一步进入到实验版本配置， 
根据我们业务场景自行设定参数和参数值，参数设置为 poc ，对照版本使用参数值为 control ，实验版本1使用参数值为 experiment 。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176028412-809555e2-dc30-4cda-8116-5c22db53d933.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uc450dfb5&margin=%5Bobject%20Object%5D&originHeight=1680&originWidth=2634&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1098cd98-d87e-475c-a7f4-c47e6c82dfb&title=)
### **3.4 第四步设置目标受众**
步骤： 
1、设置流量100% 
2、把示例代码中Javascript中的copy到SDK初始化init方法下面 
3、设置「实验版本1」白名单的ssid 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176028877-afef720c-0dc2-4ecf-9a51-b3a8dbce3b7b.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u1c2e6f66&margin=%5Bobject%20Object%5D&originHeight=470&originWidth=1260&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5e21f714-1000-4821-9bb1-7eca62cb058&title=)
4、点击「开始调试」按钮 
5、进入到实验列表 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176028781-5baf72da-e4c4-48a5-8dce-af73185fd2c1.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u8d4fce1c&margin=%5Bobject%20Object%5D&originHeight=744&originWidth=3270&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc7301049-aeeb-4481-ab27-045a3051520&title=)
**如何在本地调试中获取ssid？**
我们在本地调试的时候，我们初始化在F12下，Application下localstorage，key为__tea_cache_tokens_{appId}的值，看到到 ssid 为 34839479-041a-4d8f-b21a-b00d8c1890fe。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176029096-d137b865-7b62-469b-9941-1fe7769c200e.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u0c79a2ad&margin=%5Bobject%20Object%5D&originHeight=722&originWidth=1900&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4b919985-65ca-4daf-bb3d-f9a29c0bfac&title=)
### 3.5获取实验配置 
#### 3.5.1客户侧代码修改 
「A/B 测试」通常在SDK 初始化后会向分流服务发送一个分流请求（request），在获取到分流服务的响应（response）后，客户端开发可以根据分流的结果参数完成代码分支的开发。 
文档中地址：https://www.volcengine.com/docs/6287/65803#_4-%E8%8E%B7%E5%8F%96%E5%AE%9E%E9%AA%8C%E5%8F%82%E6%95%B0 
文档中示例代码： 
```jsx
window.collectEvent('getVar', 'ab-key', 'ab-defalut-value', function(value) { 
        //ab-key 为实验参数的 key ，用户开发做代码分支，ab-defalut-value 为网络异常时的兜底方案，建议和对照组 value 一致
        document.getElementById('id1').innerText = value;
    })
```
根据「第四步把示例代码中Javascript中的代码」copy到SDK初始化init方法下面 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176029185-c15afc33-032a-48a0-936d-85a594c31c44.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ub5b4277a&margin=%5Bobject%20Object%5D&originHeight=1206&originWidth=1412&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uec68231e-0bc5-41f8-bc14-9c2d4dd832f&title=)
#### 3.5.2验证分流 
保存代码，刷新页面 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176029545-0fee92da-5fa5-4282-a362-e7fa3d6f40a3.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ub9f4cc45&margin=%5Bobject%20Object%5D&originHeight=1162&originWidth=2222&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud0e3690f-2fdc-48d4-aae3-6996f55cbf8&title=)
接口返回 
可以看到分流接口返回的是实验组。 
因为在白名单中「实验版本1」中配置了该匿名用户的ssid。 
然后刷新页面，分流接口返回的命中的实验不会发生变化
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176029636-8a026130-e12c-44ae-820f-75acb462c800.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=uaef332e7&margin=%5Bobject%20Object%5D&originHeight=338&originWidth=1846&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc07c4720-1c48-4557-8258-a87e7eb4e90&title=)
然后根据分流接口返回的进组情况，展示不同用户体验。 
#### 3.5.3实际业务修改 
比如是vue/react框架代码下，以接入的应用「聊天happyChat」为例子 
在SDK初始化的时候，请求分流接口 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176029992-9a2a076b-411b-4108-927e-2920585f4b16.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u50c6cf59&margin=%5Bobject%20Object%5D&originHeight=1218&originWidth=1484&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua0f5e523-93bb-4664-a3e0-dc2454d1ef1&title=)
然后在业务的反馈提交页面做判断。 
window对象需要在data中定义。 
如果是实验版本1，展示橘色背景的按钮。 
否则，展示默认的蓝色背景的按钮。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176029994-8ae36ca7-77a2-4fce-8555-facc84eff977.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ud04cf0ef&margin=%5Bobject%20Object%5D&originHeight=188&originWidth=2784&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud41d5f3d-51ed-45c0-b622-5e8c5151d4e&title=)
页面展示上 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176030453-392b4f25-f33a-48f8-8031-c085d9fc3f1b.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ua9250be7&margin=%5Bobject%20Object%5D&originHeight=1270&originWidth=714&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u499678fc-48b0-4a40-bca3-81d6c073266&title=)
综上所述，本地开发调试环境验证分流OK。白名单配置命中进入到对应的实验组中。 
### 3.6登陆调用 
如果您的产品体系中存在自己的用户体系，需要使用这个，如果不存在自己的用户体系，可以忽略这部分。 
文档中：如果您的产品中有账户体系，当用户登录后请立即设置uuid，以便保证用户登录前后口径一致性。 
实际：应用中有登陆体系，我们登陆的时候需要调用config方法设置user_unique_id，可以保证登陆前后口径一致。 
#### 3.6.1客户侧代码修改 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176030359-5a56dbb9-ae31-4145-ba21-3be7c9885e2d.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u1de24494&margin=%5Bobject%20Object%5D&originHeight=1348&originWidth=1456&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5e130203-efab-43f9-b548-6fd2685cbd3&title=)
#### 3.6.2验证登陆之后分流 
登陆的回调中，调用SDK的config方法，发现ssid没有发生变化，user_unique_id发生变化，变成你设置的用户id，唯一的标识。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176030656-5dc3db3e-38f6-4ec6-b685-28c3a85dde62.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u37733800&margin=%5Bobject%20Object%5D&originHeight=624&originWidth=2640&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1fb01108-713a-4250-ad8b-4b4c6c0e793&title=)
如果user_unique_id之前没有被config设置过，ssid不会发生变化 
如果user_unique_id之前被config设置过，ssid肯定会发生变化，变成之前user_unique_id对应的ssid。 
上述「**AB客户端编程实验**」所有操作，新建实验，新建核心指标，确定实验版本的参数和参数值，实验流量，示例代码，获取ssid，设置白名单ssid，开始调试实验，验证白名单生效，验证实验分流。 
### 3.7开启实验 
回到实验列表页面，操作项中有「开启实验icon」。 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176030899-5ee66924-b314-4b49-82a0-23b30c3f79ef.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u727b630d&margin=%5Bobject%20Object%5D&originHeight=542&originWidth=2886&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7209af73-2bcd-43d5-96d1-1028f163753&title=)
点击开始实验有个弹窗： 
开始实验后，进组用户可实时查看，指标置信度第二日产出。确实开始么？ 
![](https://cdn.nlark.com/yuque/0/2022/png/276016/1642176031074-f18e6c05-b88a-46e0-9118-deb59ddb8862.png#clientId=ue8ce1247-c1ce-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u19c2dcdf&margin=%5Bobject%20Object%5D&originHeight=366&originWidth=984&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7a288734-86b3-49f2-a913-4144d7ccbe0&title=)
点击确定之后，该实验就正式开启起来。 
访问到应用的用户，随机分组，如果配置了白名单，会根据配置的白名单进入到相应的组中。 
# 六、常见问题QA 
## 1、ssid发生变化的情况 
注意事项⚠️ 
ssid发生变化的情况：

- 清空localstorage，刷新页面，重新分配新的ssid 
- 登陆时候调用config方法，可能会修改ssid 
   - 如果user_unique_id之前没有被config设置过，ssid不会发生变化 
   - 如果user_unique_id之前被config设置过，ssid肯定会发生变化，变成之前user_unique_id对应的ssid。 
## 2、分流结果调用时机的情况 
目前SDK初始化的时候，会调用一次分流接口，拿到分流接口返回。 
分流接口调用：1、在SDK初始化的时候发生；2、登陆调用的时候发生 
只要不再调用的分流接口，页面拿到还是上次分流接口的结果。 
## 3、为什么分流接口abtest_config返回的是{} 
第1种情况：实验在草稿状态，或者没有创建实验 
第2种情况：实验在调试中状态，并且ssid没有记录到白名单中。 
## 4、ssid，user_unique_id，webid的区别？ 

- SDK的init初始化的时候，user_unique_id 与 web_id 相等的，ssid是根据user_unique_id等hash操作生成。 
- 当用户调用config方法的时候，可能会修改ssid，这时候user_unique_id 与 web_id 不想等，判断后端表中是否有该user_unique_id对应的ssid（也就是该user_unique_id是否调用了config方法）？ 
   - 如果有的话，返回后端表中ssid，会修改ssid。 
   - 如果没有的话，返回前端传给后端的ssid，并且这个ssid会和user_unique_id发生一对一绑定，写入到表中。 




## 关于「AB实验」
为团队建设贡献一份力量，世界会更加和平～

![](https://cdn.nlark.com/yuque/0/2021/png/276016/1634222782747-0da516b7-3a22-407d-9bb4-e292b62d7417.png#clientId=uf2680cc8-420e-4&from=paste&id=u598f6c64&margin=%5Bobject%20Object%5D&originHeight=306&originWidth=282&originalType=url&ratio=1&status=done&style=none&taskId=u313857f3-48bf-43b2-b9e5-cb68c7335cb#id=vH7sj&originHeight=306&originWidth=282&originalType=binary&ratio=1&status=done&style=none#crop=0&crop=0&crop=1&crop=1&id=Kefca&originHeight=306&originWidth=282&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

一句话简介：AB实验，大胆假设，小心求证。

标签：AB实验 数据驱动 统计学

介绍：AB实验基本架构、指标选取与数据分析等角度切入分析，摆脱猜测，用科学的实验衡量决策收益，打造更好的产品，让业务的每一步都通往增长。

联系作者：

![](https://cdn.nlark.com/yuque/0/2022/png/276016/1648915888637-309a620b-2f16-40a2-8a00-137cb7921979.png?x-oss-process=image%2Fresize%2Cw_900%2Climit_0)


## AB文章集锦
+ [MAB多臂老虎机智能调优的基本原理](https://juejin.cn/post/6994466335707103269)
+ [AB实验基础-专有名词](https://juejin.cn/post/6973622831263252487)
+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://juejin.cn/post/6972181439123046408)
