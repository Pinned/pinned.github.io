---
layout: post
styles: [syntax]
title: Android 动态修改菜单
category: 安卓
tags: Android
---

在一个Android创建菜单menu时，需要重写Activity的`onCreateOptionsMenu(Menu menu)`方法，这个方法只在第一次创建的时候调用一次，所以如果之后想对menu进行动态的修改，那么就不要再对`onCreateOptionsMenu`做什么手脚了。

动态修改菜单就要用到`onPrepareOptionsMenu(Menu menu)`方法了。`onPrepareOptionsMenu`与`onCreateOptionsMenu`不同的是，他在每次按下menu硬键之前会被调用，所以可以在这里动态的改变menu。如果需要创建一个全新的菜单,如下：

```java
public boolean onPrepareOptionsMenu(Menu menu) {
    super.onPrepareOptionsMenu(menu);
    menu.clear();
	// create new menu code     
    return true;
}
```

