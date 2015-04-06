---
title: Android文字颜色选择器
type: snippet
---

```xml
//在这个地方，应该使用
//android:textColor="@drawable/text_color"

// text_color.xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:color="@color/click_blue_color"></item>
    <item android:color="@color/blue_color"></item>
</selector>
```