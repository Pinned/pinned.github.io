---
layout: post
styles: [syntax]
title: Ubuntu 解压zip，文件乱码
category: 工具
tags: Ubuntu Systems Tools
---

在windows上压缩的文件，是以系统默认编码中文来压缩文件。由于zip文件中没有声明其编码，所以linux上的unzip一般以默认编码解压，中文文件名会出现乱码。

解决方式：

```bash
unzip -O CP936 xxx.zip
// 用GBK, GB18030也可以
```
