---
layout: post
styles: [syntax]
title: Android Keyboard Show&Hiden
category: 安卓
tags: Android
---

## Android 中打开新的Activity,虚拟键盘的弹出与不弹出

打开Activity时，在不同的时候，弹出或隐藏虚拟键盘，会有不同的体验。

实现：

只需要在`AndroidMainfest.xml`的对应Activity中加入对应的参数：

1. 显示：

```xml
android:windowSoftInputMode = "stateVisible"
```  

2. 不显示:

```xml
android:windowSoftInputMode = "stateHidden"
```  
