---
layout: post
styles: [syntax]
title: Eclipse中快速打开文件夹
category: tools_using
---

## Navicat的安装

在使用Mysql的时候，一开始就喜欢使用Navicat，所以就想安装一个
Navicat来使用。

很简单，去Navicat官网下一个下来，解压就可以用了。

步骤如下：

1.  解压文件
 `tar -xzvf navicat_xxx.tar.gz`
2. 进入到解压好的文件夹中，运行就可以了`./start_navicat`

但是不知道为什么，运行没有任何反应。

在google上查找了一下，才知道是没有安装32位库和wine环境

打开**synaptic**,然后在**Setting->Repros**，打开界面中

选择其它软件源，添加:
`deb http://old-releases.ubuntu.com/ubuntu/ raring main restricted universe multiverse`

保存，退出。

然后执行命令:

```xml
sudo apt-get install libgtk2.0-0:i386
sudo apt-get -f install
sudo apt-get install wine
```
