---
layout: post
styles: [syntax]
title: [转]Android打开与关闭软键盘
category: 安卓
tags: Android
---

1. 方法一(如果输入法在窗口上已经显示，则隐藏，反之则显示)
 
 ```java
 InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
 imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS); 
 ```

2. 方法二(View为接受软键盘输入的视图)

 ```java
 InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
 imm.showSoftInput(view,InputMethodManager.SHOW_FORCED);  

 imm.hideSoftInputFromWindow(view.getWindowToken(), 0); //强制隐藏键盘  
 ```

3. 调用隐藏系统默认的输入法

 ```java
 ((InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(WidgetSearchActivity.this.getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);  //(WidgetSearchActivity是当前的Activity)
 ```

4. 获取输入法打开的状态

 ```java
 InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
 boolean isOpen=imm.isActive();//isOpen若返回true，则表示输入法打开  
 ```


 ---

 **转载地址：** [Android 手动显示和隐藏软键盘](http://blog.csdn.net/h7870181/article/details/8332991)