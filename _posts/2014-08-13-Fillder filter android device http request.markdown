---
layout: post
styles: [syntax]
title: 使用Fidder来拦截Android发送的HTTP请求
category: android
---

### Fidder  

Fiddler是一个http调试代理，它能够记录所有的你电脑和互联网之间的http通讯，Fiddler可以也可以让你检查所有的http通讯，
设置断点，以及Fiddler所有的“进出”的数据（指cookie,html,js,css等文件，这些都可以让你胡乱修改的意思）。 
Fiddler 要比其他的网络调试器要更加简单，因为它仅仅暴露http通讯还有提供一个用户友好的格式。

有关Fiddler的使用教程请移步：[Fiddler 教程](http://kb.cnblogs.com/page/130367/)

### Fiddler Android模拟器抓包

1. 当然，第一件事情就是要确保你电脑上安装了Fiddler,如没有，请下载安装.[下载地址](http://www.telerik.com/download/fiddler)

2. 打开你的Android模拟器，依次点击 Setting -> More... -> Mobile networks -> Access Point Name
    ![step 1](../../../assets/img/2014-08-13/step_01.png)
    ![step 2](../../../assets/img/2014-08-13/step_02.png)
    ![step 3](../../../assets/img/2014-08-13/step_03.png)
    ![step 4](../../../assets/img/2014-08-13/step_04.png)
    ![step 5](../../../assets/img/2014-08-13/step_05.png)

   上面这个是模拟器设置，如果你用的是Genymotion的模拟器，便和真机设置一样;
   ![step 6](../../../assets/img/2014-08-13/step_06.png)
   ![step 7](../../../assets/img/2014-08-13/step_07.png)
   ![step 8](../../../assets/img/2014-08-13/step_08.png)
   
   > PS：如果用真机，要保证真机和PC在同一个局域网类（在这里，我用的是Wifi）

3. 设置Fiddler
	这一步是非常重要的一步，打开Fiddler, 选择`Tools -> Fiddler Options...` ，然后选择`Connections`选项卡,勾选`Allow remote computers to connect`,
	重启Fiddler就可以了。如下图所示:

    ![step 9](../../../assets/img/2014-08-13/step_09.png)