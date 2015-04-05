---
title: Android代码片二
type: snippet
---

```java
StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
long sdAvailSize = (long)stat.getAvailableBlocks()
               * (long)stat.getBlockSize();
long sdTotalSize =  (long)stat.getBlockCount()
                * (long)stat.getBlockSize()
```
