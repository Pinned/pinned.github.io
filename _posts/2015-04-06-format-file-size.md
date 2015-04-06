---
title: 格式化文件容量代码
type: snippet
---

```java
public static String formatSize(long size) {
    if (size < 1024) {
        return String.format("%dByte", size);
    } else if (size < 1024 * 1024) {
        return String.format("%.2fKb", size / 1024f);
    } else if (size < 1024 * 1024 * 1024) {
        return String.format("%.2fMb", size / 1024f / 1024f);
    } else {
        return String.format("%.2fGb", size / 1024f / 1024f / 1024f);
    }
}