---
layout: post
styles: [syntax]
title: Android Studio Gradle Download Error
category: 安卓
tags: Android Gradle
---

自从使用Android Studio 开始，就一直存在一个问题，那就是Gradle下载不下来。不仅如此，JCtener 与 mavenCentral 也是被墙了。

1. 我们先来解决gradle 下载的问题

   用浏览器挂上vpn， 将你需要的[gralde-version.zip](https://services.gradle.org/distributions/gradle-2.8-all.zip)文件下载下来，放到本地。打开你的项目，找到当前目录下 `gradle -> wrapper -> gradle-wrapper.properties` , 打开这个文件，将最后一行的地址修改为如下：`distributionUrl=file:///Users/pinned/Downloads/gradle-2.7-all.zip`

   然后在同步一下，就可以正常使用Gradle


2. 下载lib库

   这个得感谢网友[henjue](http://www.j99.io/)给我们提供的服务, 具体使用参考：[向大家提供一个jcenter镜像
](http://www.j99.io/2015/06/19/%E5%90%91%E5%A4%A7%E5%AE%B6%E6%8F%90%E4%BE%9B%E4%B8%80%E4%B8%AAjcenter%E9%95%9C%E5%83%8F/)