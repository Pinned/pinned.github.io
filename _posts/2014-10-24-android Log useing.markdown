---
layout: post
styles: [syntax]
title: Android之使用Log打印日志
category: android
---

1. 使用

在编写Android App的时候，肯定会使用日志。虽然这个是一个很简单的东西，但是一个方便的
Log会提升不少的工作效率。

在一般情况下，我们会如下使用：

```java
public class MainActivity {
    private final String TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG,"This is a Log");
    }
}
```

从上面的代码，我们可以看出，要打印日志，需要进行两个步骤
+ 定义一个全局的TAG
+ 使用`Log.d(TAG,"This is a Log")`来输入日志

这样用起来不是特别麻烦，那要是让你在你的日志内容前加上`[MethodName]`格式的方法名呢?

简直蛋碎了一地。

2. 改进方法：

先看代码：

```java
import android.util.Log;
import cn.thering.ding.BuildConfig;

public class DebugLog{

    static String className;
    static String methodName;
    static int lineNumber;

    private DebugLog(){
        /* Protect from instantiations */
    }

    public static boolean isDebuggable() {
        return BuildConfig.DEBUG;
    }

    private static String createLog( String log ) {

        StringBuffer buffer = new StringBuffer();
        buffer.append("[");
        buffer.append(methodName);
        buffer.append(":");
        buffer.append(lineNumber);
        buffer.append("]");
        buffer.append(log);

        return buffer.toString();
    }

    private static void getMethodNames(StackTraceElement[] sElements){
        className = sElements[1].getFileName();
        className = className.substring(0, className.length() - 5);
        methodName = sElements[1].getMethodName();
        lineNumber = sElements[1].getLineNumber();
    }

    public static void e(String message){
        if (!isDebuggable())
            return;

        // Throwable instance must be created before any methods  
        getMethodNames(new Throwable().getStackTrace());
        Log.e(className, createLog(message));
    }

    public static void i(String message){
        if (!isDebuggable())
            return;

        getMethodNames(new Throwable().getStackTrace());
        Log.i(className, createLog(message));
    }



    public static void d(String message){
        if (!isDebuggable())
            return;

        getMethodNames(new Throwable().getStackTrace());
        Log.d(className, createLog(message));
    }

    public static void v(String message){
        if (!isDebuggable())
            return;

        getMethodNames(new Throwable().getStackTrace());
        Log.v(className, createLog(message));
    }

    public static void w(String message){
        if (!isDebuggable())
            return;

        getMethodNames(new Throwable().getStackTrace());
        Log.w(className, createLog(message));
    }

    public static void wtf(String message){
        if (!isDebuggable())
            return;

        getMethodNames(new Throwable().getStackTrace());
        Log.wtf(className, createLog(message));
    }
}
```

引入这个类，你就可以很方便的使用日志了，还打印了代码所在行，是不是很方便呢？

使用方法：

```java
// 在你需要添加日志的地方写上如下代码
DebugLog.d("This is a log");
```

是不简单多了呢？好东西就应该和小伙伴一起用。你说对不？
