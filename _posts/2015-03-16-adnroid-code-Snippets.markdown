---
layout: post
styles: [syntax]
title: Android代码片段
category: 安卓
tags: Ubuntu Systems Tools
---

+ SD Card的大小和容量

```java
StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
long sdAvailSize = (long)stat.getAvailableBlocks()
               * (long)stat.getBlockSize();
long sdTotalSize =  (long)stat.getBlockCount()
                * (long)stat.getBlockSize()
```

格式化容量代码:

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
```

+ Android String 中的占位符

```xml
<!-- .2f表示的是保留三位小数的浮点数  -->
<string name="book">书名 (字符串)%1$s,作者(字符串)%2$s,编号(整数)%3$d,价格(浮点型)：%4$.2f</string>
```

+ 文字颜色选择器

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

+ 给TextView设置`DrawableLeft`

```java
Drawable drawable = getResources().getDrawable(R.drawable.drawable);  
/// 这一步必须要做,否则不会显示.  
drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());  
myTextview.setCompoundDrawables(drawable,null,null,null);
```

+ 在`values`中定义id

  在`values`文件夹中创建`ids.xml`文件， 文件目录为：`values/ids.xml`

  我们有时候，会在代码中定义一个组件，如`TextView`,但是我们想给他设置一个Id，又不知道该设置一个
  什么值比较好，就可以用上术方法来定义一个`id`, 具体代码如下:

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <values>
    <item name="custom_item_id" type="id"></item>
  </values>
  ```
+ Andorid打开或关闭软键盘

```java

// 打开软键盘
InputMethodManager inputMethodManager =
        (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
inputMethodManager.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);

// 关闭软键盘
InputMethodManager imm =
        (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
imm.hideSoftInputFromWindow(mTextView.getWindowToken(), 0);
```
