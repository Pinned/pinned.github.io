---
layout: post
styles: [syntax]
title: Android 粘贴板的使用
category: 安卓
tags: Android
---

## Android 粘贴板的使用

记录一下今天使用Android粘贴板的代码：

```java
ClipboardManager cmb =(ClipboardManager) this.getSystemService(Context.CLIPBOARD_SERVICE);
 ClipData clip = ClipData.newPlainText("simple text","fdaskjfksad");
cmb.setPrimaryClip(clip);
```

```java
newPlainText("label","text");
// 使用这个可以添加一个内容到粘贴板上，粘贴板上的内容是text, 我们可以使用label来取这个内内容，如果是在同一个ClipData中，默认情况下去最后添加的那一个。
```

有关ClipboardManager使用的详细信息，请直接跳转到
[copy and paste](http://developer.android.com/guide/topics/text/copy-paste.html)
