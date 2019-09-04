### display: none, visibility: hidden 和 opacity: 0的比较

1、是否脱离文档流

+ display:none会是元素脱离文档流，不占据原来的空间，会引起重排。
+ visibility:hidden不会脱离文档流，元素不可见
+ opacity:0 不会脱离文档流，元素不可见

2、是否能继承

+ display:none 子元素不会继承，但是子元素无法脱离父文档显示。
+ opacity:0 子元素不会继承，但是子元素无法脱离父文档显示。
+ visibility:hidden 不会继承，但是子元素可以脱离父文档显示。


3、是否事件触发

+ display:none 脱离文档流，不占据原来空间，事件触发不了。
+ visibility:hidden 不脱离文档流，元素不可见，事件也触发不了。
+ opacity:0 不脱离文档流，元素不可见，事件可以触发


3、是否transition
+ display:none 无法使用动画
+ visibility:hidden 能使用transition动画
+ opacity: 0 能使用transition动画
