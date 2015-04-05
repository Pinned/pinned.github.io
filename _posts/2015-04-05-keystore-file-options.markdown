---
layout: post
styles: [syntax]
title: Android Keystore 文件的密码修改
category: 工具
tags: Tools Android
---

+  修改keystore密码的命令(keytool为JDK带的命令行工具)

```bash
# my.keysotre 是你的签名文件
keytool -storepasswd -keystore my.keystore
```

+ 修改keystore的alias的密码

```bash
# my.keystore 是你的签名文件，debugalias为你alias名字
keytool -keypasswd -keystore my.keystore -alias debugalias
```
