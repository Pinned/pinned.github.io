---
title: Android 混淆记录
type: snippet
---

```bash
--keep class cn.knero.model.*{
    public <methods>; // 不混淆public的方法
}


# Google Gson
#---------------Begin: proguard configuration for Gson  ----------
# Gson uses generic type information stored in a class file when working with fields. Proguard
# removes such information by default, so configure it to keep all of it.
-keepattributes Signature
# Gson specific classes
-keep class sun.misc.Unsafe { *; }
#-keep class com.google.gson.stream.** { *; }
# Application classes that will be serialized/deserialized over Gson
-keep class com.google.gson.examples.android.model.** { *; }
-keep class com.google.** { *; }
-keep class * extends com.google.gson.reflect.TypeToken
-keep class com.google.gson.reflect.TypeToken
##---------------End: proguard configuration for Gson  ----------


#混淆某个方法
-keepclassmembers class cn.knero.fragment.BaseContentFragment {
    public android.view.View refreshError();
    public android.view.View onLoading();
}

```