---
layout: post
styles: [syntax]
title: Android 用命令行更新SDK
category: 工具
tags: Tools Android
---

#### 基本使用

在使用桌面系统的时候，我们都是用的`SDK Manager`, 如果现在要你部署一台CI服务器呢。

我擦，ssh上去，没有界面，怎么破。

查找了一下，Android SDK更新是支持命令的

如下：

```bash
android update sdk --no-ui
```

上面的方法虽然可以更新SDK，但是他会把所有的内容都下载下来，很明显我们并不想这样子。

查看命令帮助可以看到有一个`--filter`属性，如下使用

```bash
android update sdk --filter <component> --no-ui
```

其中`<component>` 可以是名字，也可以是数字。查看数字的方式如下：

```bash
ndroid list sdk --no-ui
```
所以你可以如下使用：

```bash
android update sdk --filter 1 --no-ui
```

#### 代理服务

当然，还有一个问题，就是GFW, 还好我们有学校提供的镜像服务

我们可以这样子使用：

```bash
android update sdk --no-ui --proxy-host "mirrors.opencas.cn" --proxy-port 80 -t 2 -s
```

#### 参考资料

1. [Is there a way to automate the android sdk installation?](http://stackoverflow.com/questions/4681697/is-there-a-way-to-automate-the-android-sdk-installation?answertab=active#tab-top)

2. [Android Tools](https://github.com/inferjay/AndroidDevTools)
