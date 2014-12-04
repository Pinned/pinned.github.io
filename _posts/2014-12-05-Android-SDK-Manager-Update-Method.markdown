---
layout: post
styles: [syntax]
title: Android Sdk Manager无法更新问题解决办法
category: system
---

每次要更新Android SDK等信息的时候，总是非常蛋疼。

可以去下载大神们整理好的文件。这里附上下载地址：

[https://github.com/inferjay/AndroidDevTools](https://github.com/inferjay/AndroidDevTools)

现在，我们也可以不用这种方式，直接使用Android SDK Manager来更新：

方法如下：
+ 启动 Android SDK Manager ，打开主界面，依次选择「Tools」、「Options...」，弹出『Android SDK Manager - Settings』窗口；

+ 在『Android SDK Manager - Settings』窗口中，在「HTTP Proxy Server」和「HTTP Proxy Port」输入框内填入mirrors.neusoft.edu.cn和80，并且选中「Force https://... sources to be fetched using http://...」复选￼框。设置完成后单击「Close」按钮关闭『Android SDK Manager - Settings』窗口返回到主界面；
+ 依次选择「Packages」、「Reload」。

如下图：
![Alt text](/setting.png)


**参考资料**

[开源镜像站](http://mirrors.neusoft.edu.cn/configurations.we#android)