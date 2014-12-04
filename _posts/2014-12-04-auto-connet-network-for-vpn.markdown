---
layout: post
styles: [syntax]
title: 科学上网（方便查资料）
category: tools_using
---


自从有了GFW这个东东，我妈妈就开始担心我上网的问题了。
为了不让妈妈担心，总得想个方法解决这个问题，不能上我们日渐老去的妈妈为我们担心。

还好，我还有一个强大的度娘，最后找到了解决办法。

+ **原理**

 说起原理，这个东西很简单，就是更改路由，修改电脑的路由表，只能切换你访问的方式 
 
+ **使用步骤**

 说起来，很简单，但是做起来也不是那么容易。
 你得有几个前提条件：
 1. 你得有台电脑（你这不是废话么，没有，还想上网。不过好像手机也可以，看完本篇文章，你可以去测试一下）
 2. 你得有一个可以访问某些网站的VPN
 
如果你满足以上条件，你可以继续往下面看：

上网址：

[https://code.google.com/p/chnroutes](https://code.google.com/p/chnroutes/)

[路由表](http://chnroutes-dl.appspot.com/)

下载下来就可以了。

在这里，我使用的是windows操作系统，即下载的`windows.zip`文件

解压后，你会得到如下两个文件：

```xml
vpnup.bat   // 修改路由表的脚本
vpndown.bat // 清理路由表的脚本
```
当然你可以按照官方文档写的，下载源码，自己去编译运行生成对应的路由表。

我热衷于轮子，但是有轮子的时候，我会更倾向于使用轮子。所以我直接使用已经做好了的东西。

用**管理员权限**运行`vpnup.bat`， 等到成功过后，关闭就行了。
然后连接你的VPN。

测试一下：

打开你的百度，输入ip，看下地址
在打开google，输入ip，在看下地址 

+ 参考资料

[https://github.com/GutenYe/chnroutes](https://github.com/GutenYe/chnroutes)
[openvpn使用方法](https://code.google.com/p/chnroutes/wiki/Usage)

