---
title: Android 中compileSdk、minSdk、targetSdk 是干什么用的?
category: 安卓
tags: Android

---

作为多年 Android 开发的老司机， `compileSdk` 、`minSdk`、`targetSdk` 都是经常见到，但其具体含义是什么？ 它们都是在什么场景下去使用的。 回想起来还真不太能说得清楚。 

## 背景

要想说清楚它们是干什么的，那就不得不说一下主角 Android 操作系统。Android 操作系统在 2008 年发布了第一个版本，到今年已经发布了几十个版本：

![Android 版本历史（图源维基百科）](https://img-blog.csdnimg.cn/6c779843416e4334b72567061848ed8c.png)

在如此多的版本迭代更新的过程中，Android 操作系统中不断引入新的接口，也不断的对 App 添加一些新的限制。在这不断迭代的过程中，对于开发者来说，就会面临以下问题：

+ 虽然开发者希望自己的 App 可以触达到更多的用户，但开发的 App 不可能对所有手机都进行支持。
+ Android 发布新版本，会有新的 API 提供出来使用，那当前编译使用应该使用哪个版本的 Android SDK 呢？
+ 开发者开发的 APP 是以哪个系统版本为目标版本进行开发的？



## minSdk

Android 系统的更新，会逐步引入更多的新功能，这此功能不仅是软件上的，还有硬件上的更新。随着新版本的发布，老系统的用户也会越来越少。而针对低版本系统的功能开发者，可能会有非常多的兼容或者优化的处理。举一个例子（系统越老，手机也就越老，内存、CPU 等硬件也就越差）：比如我现在有一个很复杂的页面，其页面嵌套层级比较大，此页面在高版本手机中可以正常渲染，但在 Android 2.3  的系统中，却加载非常慢，甚至加载不出来。 为了能让 2.3 版本的系统中能够支持这个页面的显示，可能需要付出很大的努力，甚至于去重写布局，才能让页面渲染出来。

就如这个例子，为了那百分之零点几的用户去做兼容处理，对于一个资源有限的开发团队来说，是一件很不值当的事情。不再支持老版本的系统，可以让有限的资源去做更多的新功能的开发。 

为此，在项目中我们可以使用 `minSdk` 去指定当前项目支持的最低版本。编译产物 APK 文件中的 `AndroidManifest.xml` 文件中会标明最小支持的系统版本。 在安装时，如果当前系统版本不支持，则不能进行安装。

![APK 中 minSdkVersion 字段](https://img-blog.csdnimg.cn/34ea9cab78ce4f08b25be10e2759bbae.png)

## compileSdk

顾名思义，这个东西是用来指定当前编译环境的。作为老司机，你可能还配置过 `buildToolsVersion` ，这个也是在编译过程中需要用到的东西。

先来看一下 Android 官方给出的编译过程图：

![Android 编译流程](https://img-blog.csdnimg.cn/4c80e24292114740934229a282fe811f.png)

 整个过程比较复杂，我们只看其中的一部分内容，下面是 `javac` 编译的部分：

![Class 文件编译过程](https://img-blog.csdnimg.cn/338570ab4da74829a2a043644d186b57.png)

图中可以看到， `javac` 编译的过程，会将 `java` 代码转换成 `class` 文件。 在编译的过程中，有一个非常重要的东西，那就是 `android.jar` 文件，此文件为当前使用的 `Android SDK` 。使用 SDK Manager 可以下载不同版本的 SDK ，如下图所示：

![SDK 目录](https://img-blog.csdnimg.cn/13c53ab1ce4348749c2c61cc9c612049.png)

因此，我们在 `build.gradle` 文件中定义的 `compileSdkVersion` 简单理解就是用来指定 `android.jar` 的版本的。

当 Android Gradle Tools 版本为 `3.0.0` 及以上版本，另一个与编译相关的参数 `buildToolsVersion` 可以不用在设置了。如在 Android Gradle Tools 7.3.0 的版本中，默认使用的为 `30.0.3` 的版本：

![默认 Build Tools 版本](https://img-blog.csdnimg.cn/2ea8a91fe17845fdb4eb9aa2354dce3d.png)

> 官方文档传送门：
>
> [Android Gradle Tools 7.3 Release Note](https://developer.android.com/build/releases/past-releases/agp-7-3-0-release-notes?hl=zh-cn)
>
> [Android Gradle Tools Latest Release Note](https://developer.android.com/build/releases/gradle-plugin?hl=zh-cn)



## targetSdk

targetSdk 的直译名称就是目标版本，顾名思义，这个版本决定当前应用程序在什么哪个版本系统提供的 API。这样设计，在 Android 系统升级后，某些  API 行为发生改变时，就能根据 APK 中指定的目标版本，保证其业务特性不会发生影响。

举个例子，在 Android 7.0 中引入了一个新的安全策略 ，对文件访问加入了限制，直接使用 `Uri.parse()` 是无法直接访问外部存储中的文件。在后续的版本中都需要使用 FileProvider 类进行访问，并添加相应的配置。那么问题来了，手机中编写的应用程序发布时，系统的安全策略还没有发布，那老应用程序就不可用了吗？答案当是依然可用。7.0 的系统会对低版本兼容，保证业务还能按照之前的特性执行。 

按照如上做法，那是不是可以降低 targetSdk 版本，绕过安全策略，使用老 API 做需求呢？ 从技术原理上，这是没有问题的。Google 为了防止这种问题发生，会在应用上架去做限制，在新版本系统发布后，会给应用开发厂商一定的时间，去修改适配新的 API， 如果不改造，那么新版本的 APP 可能就无法上架，老应用也可能会被直接下架掉。
