---
layout: post
styles: [syntax]
title: Android 5.0设备中，Notification小图标是白色的
category: 安卓
tags: Android
---

## 问题描述

在使用消息推送，在通知栏中展示通知，我们会有两个图标，一个是在状态栏展示的小图标，一个是打开通知中心，展示的大图标
我在我自己的测试设备中，小图标始终显示为一个白色的空白图标。

## 问题解决

 > 原文地址：[Notification bar icon turns white in Android 5 Lollipop](http://stackoverflow.com/questions/28387602/notification-bar-icon-turns-white-in-android-5-lollipop?answertab=active#tab-top)


在这里，我把文章中说的东西抄一遍：

在Android中用来展示Notification图标的代码如下：

```java
// android_frameworks_base/packages/SystemUI/src/com/android/systemui/
//   statusbar/BaseStatusBar.java

if (entry.targetSdk >= Build.VERSION_CODES.LOLLIPOP) {
    entry.icon.setColorFilter(mContext.getResources().getColor(android.R.color.white));
} else {
    entry.icon.setColorFilter(null);
}
```

所以，我们将target sdk 的版本设置成`<21`的就可以了 

在`build.gradle`中修改成如下：

```bash
defaultConfig {
    targetSdkVersion 20
}
```

