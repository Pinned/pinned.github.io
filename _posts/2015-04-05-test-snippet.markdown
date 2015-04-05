---
layout: post
styles: [syntax]
title: Android代码片段
category: 工具
---

```java
StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
long sdAvailSize = (long)stat.getAvailableBlocks()
               * (long)stat.getBlockSize();
long sdTotalSize =  (long)stat.getBlockCount()
                * (long)stat.getBlockSize()
```
