---
layout: post
styles: [syntax]
title: Android 中方法重载遇到的问题
category: 安卓
tags: Android
---

## 问题描述

 今天在使用的一个第三方库，执行的是一个异步下载，有一个封装`DownloadInfo`的类，在下载的`Task`中，通过`DownloadInfo`
 获取真实的下载地址。但是由于粗心，库中的`getRealUrl`方法，没有加任何方法修饰词。我在使用的时候，重写了`DownloadInfo`
 和`getRealUrl`方法。在测试中出现了一个问题，在Android 4.4中按照预期的执行，但是在Android 5.0中，却没有按照预期的
 效果执行。

## 详细代码

1. DownloadInfo

```java
package com.testoverloading.net;
public class DownloadInfo {
    String getRealUrl() {
        return "DownloadInfo real url";
    }
}
```

2. 实现类:CustomDownloadInfo

```java
import com.testoverloading.net.DownloadInfo;
public class CustomDownloadInfo extends DownloadInfo{
//    加不加修饰词都一样，在Android 4.4都是执行的这个类的方法，而在Andorid 5.0却是执行的是父类的方法
//    String getRealUrl() {
//        return "customDownloadInfo real url";
//    }
    public String getRealUrl() {
        return "customDownloadInfo real url";
    }
}
```

3. Task

```java
package com.testoverloading.net;
public class Task {

    private DownloadInfo mInfo;

    public Task(DownloadInfo info) {
        mInfo = info;
    }

    public String excute() {
        return mInfo.getRealUrl();
    }
}
```

4. MainActivity

```java
package com.testoverloading;
// button 的点击事件
public void showText(View view) {
    CustomDownloadInfo downloadInfo = new CustomDownloadInfo();
    this.mShow.setText(new Task(downloadInfo).excute());
}
```

## 总结

**重写**

> Method overriding, in object oriented programming, is a language feature that allows a subclass or child class to provide a specific implementation of a method that is already provided by one of its superclasses or parent classes. The implementation in the subclass overrides (replaces) the implementation in the superclass by providing a method that has same name, same parameters or signature, and same return type as the method in the parent class. The version of a method that is executed will be determined by the object that is used to invoke it. If an object of a parent class is used to invoke the method, then the version in the parent class will be executed, but if an object of the subclass is used to invoke the method, then the version in the child class will be executed. Some languages allow a programmer to prevent a method from being overridden.

上面是[Wikipedia](http://en.wikipedia.org/wiki/Method_overriding#Java)上给出的文档。

> 个人理解，子类中定义某方法与其父类有相同的名称和参数，我们说该方法被重写 (Overriding）

**访问访问控制修饰符**

> Java中，可以使用访问控制符来保护对类、变量、方法和构造方法的访问。Java支持4种不同的访问权限。
>
> 1. 默认的，也称为default，在同一包内可见，不使用任何修饰符。
>
> 2. 私有的，以private修饰符指定，在同一类内可见。
>
> 3. 共有的，以public修饰符指定，对所有类可见。
>
> 4. 受保护的，以protected修饰符指定，对同一包内的类和所有子类可见。

上面例子中，应该是这两个的交叉点，Android 5.0和Android 4.4中的执行策略不一样而引起的问题
