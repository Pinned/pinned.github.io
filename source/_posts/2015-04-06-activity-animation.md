---
title: Android 去掉Activtiy之间的切换动画
type: snippet
---

```xml
<style name="NoAnimationTheme">
    <item name="android:windowAnimationStyle">@style/Animation</item>
</style>
<style name="Animation">
    <item name="android:activityOpenEnterAnimation">@null</item>
    <item name="android:activityOpenExitAnimation">@null</item>
    <item name="android:activityCloseEnterAnimation">@null</item>
    <item name="android:activityCloseExitAnimation">@null</item>
    <item name="android:taskOpenEnterAnimation">@null</item>
    <item name="android:taskOpenExitAnimation">@null</item>
    <item name="android:taskCloseEnterAnimation">@null</item>
    <item name="android:taskCloseExitAnimation">@null</item>
    <item name="android:taskToFrontEnterAnimation">@null</item>
    <item name="android:taskToFrontExitAnimation">@null</item>
    <item name="android:taskToBackEnterAnimation">@null</item>
    <item name="android:taskToBackExitAnimation">@null</item>
</style>
```

在使用的时候，只需将不需要动画的Activity的`style`设置成这个就可以了