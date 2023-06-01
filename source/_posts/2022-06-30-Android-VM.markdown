---
layout: post
styles: [syntax]
title: 这么多年，Android 虚拟机到底干了些什么？
category: 安卓
tags: Android
---

在 Android 操作系统中，有一个非常重要的核心部分： Android Runtime。说到这个，我相信很多人都听到过 **Dalvik**、**ART**、**JIT** 以及 **AOT**。或许好多人也和我之前一样，并不了解这些名词，以及这些名词背后做了些什么事情。本文从笔者了解到的信息，记录了 Android Runtime 中设计的一些概念，以及应用。

## 1. 虚拟机 

在了解上面提到的名词之前，我们需要先知道什么是**虚拟机**， 它和 Android 又有什么样的渊源。

在 2017 年的 Google I/O 大会上，Google 正式宣布 Kotlin-fist，Kotlin 正式成为 Android 的主要开发语言。在这之前， Android 开发者们都是使用 Java 来进行 Android 应用程序开发的。 Kotlin 和 Java 都是基于 JVM 的 **CLASS格式** 实现的语言，开发者通过他们编写出来的源代码都会被编译成 CLASS 文件。在 Android 中，也有相似的流程。

“一次编写，到处运行” 是 Java 的宣传口号，而 JVM 正是实现此目标的关键所在。 JVM 即 Java 虚拟机，它将物理机器中的资源（CPU、内存、输入输出等）进行抽象 ，实现相同的代码，可以在不同的硬件资源上进行执行。

在 Android 开发中，我们使用 Java/Kotlin 写的代码，会先编译成 class 文件，在通过 dx 工具转换成 `classes.dex`，运行时，在 Android 系统中，也使用了`虚拟机`来执行 APK 文件中的代码的。



## 2. Dalvik

在 Android 5.0 以前，Android Runtime 叫 Dalvik， 用于 Android 运行 APK 的虚拟机，开发者写的所有代码都是通过它进行执行的。 

DVM 的基本思想与 JVM 大体相同，但是在早期，Android 的智能手机只有很小的内存，因此 DVM 被设计用于手机端时，进行了很多独有的优化措施，其中最主要的目标就是减少内存使用。 

> DVM是基于寄存器架构（register-based） ，JVM 是基于堆栈的架构（stack-based）。

因此， Android APP 在运行的时候，不会将所有的代码都进行编译成机器码，而当代码需要运行的时候，才会去进行小范围的编译，这种方式被叫做 **JIT** （Just In Time compilation）。这种方式有点像解释器模式，能够节约大量的内存出来，让应用程序能够正常执行。但是，这也对应用程序运行时的性能带来一定的影响。当然，为了提高性能，DVM 也会将经常用到的代码缓存下来，降低重复编译引起的性能消耗。

随着 Android 手机的发展，内存也越来越大，内存已经不再是限制。并且，各大应用厂商开发的应用程序体积也越来越大，JIT 编译带来的性能瓶颈愈来愈明显。因此， 在 Android 5.0 过后，就不再使用 Dalvik 作为  Android 的运行环境了。



## 3. ART

在 Android 5.0 及以后，Google 使用 ART 替换了 Dalvik，使用新的 Android Runtime。 ART 在设计上与 Dalvik完全不同，它引入了 **AOT** （Ahead of Time compilation）模式，在应用程序安装的时候，AOT 的过程是使用系统自带的 **dex2oat** 工具将 APK 中的 dex 文件进行编译，将编译出来的机器码放入磁盘空间中，应用程序运行的时候，直接运行，极大的提高了性能，但也引起了新的问题，应用的安装时间会变得更长，也需要更大的磁盘空间来进行存储。 还依稀记得 2015 的时候，好多人还在为安装新的应用程序而把不常用的应用卸载掉。 

> 在国内，有很多插件化框架，通过插件化框架，可以从网络上动态下载代码来实现应用程序运行时更新。 在 RePlugin 中，下载下来的插件也是 APK 文件，在 RePlugin 的代码中，就有对 dex 文件进行编译的处理逻辑，感兴趣的同学可以去看看。 

这种 AOT 的模式，一直持续到 Android 6 的系统，在 Android 7.0 后，又进行了一次较大的升级。



## 4. Hybrid: AOT + JIT

从前面可以看到， AOT 和 JIT 的优缺点是反过来的，因此 Google 将这两种方式进行了结合，搞了一个混合编译的方案。ART 下的 JIT 架构如下：

![AOT+JIT 架构](https://img-blog.csdnimg.cn/6374c0794d554ed481e471398bd97a40.png)



从整个流程可以看到， 未经过编译的代码，如果是非热点代码，会直接进行解释执行，如果是热点代码，会经过 JIT 编译成机器码，再进行执行。JIT编译而来的机器码是存储到内存中的，不是在硬盘上。所以，在应用重新启动时，所有的热点代码也都需要使用 JIT 重新编译成机器码。代码在整个 ART 虚拟机中的执行流程如下图所示：

![JIT 工作流程](https://img-blog.csdnimg.cn/55b4f782f5b943b1a00c6f7e9e01dae5.png)

在上图中，可以看到，没有经过编译的函数调用，在首次执行的时候，会直接使用 JIT 解释执行，并且会对相应的代码执行进行采样，统计出热点代码，并将统计出来的信息存放到 `/data/misc/profiles/cur/0/packageName/primary.prof` 下，这个文件有什么用呢？ 在上图中，可以看到了 JIT 的整个运行流程，但没有 .oat 文件编译生成的流程。既然是  AOT 与 JIT 混合模式，那肯定还是有 AOT 相关的流程， AOT 编译的守护进程会在设备空闲以及充电的时候，使用生成的 `primary.prof` 文件进行部分代码编译。



## 5. Baseline Profiles

在前面的流程中，已经可以知道 Profile 的配置信息，可以帮助 AOT 编译，提高应用程序性能。但是，应用程序需要在本地运行一段时间后，才能统计出热点代码。而 Baseline Profiles 的原理就是让开发者自己将热点代码统计出来生成配置文件，在 APP 运行的时候，将配置写入到指定位置，帮助 AOT 编译出热点代码的机器码。更好地提高使用效率。

1. 生成 profile 

按照官方文档，可以使用 Jetpack 当中的 [Macrobenchmark](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.android.com%2Fstudio%2Fprofile%2Fmacrobenchmark-intro)，生成 `Baseline Profile 配置文件`，按如下代码就可以生成了：

```java
@ExperimentalBaselineProfilesApi
@RunWith(AndroidJUnit4::class)
class BaselineProfileGenerator {
    @get:Rule val baselineProfileRule = BaselineProfileRule()

    @Test
    fun startup() =
        baselineProfileRule.collectBaselineProfile(packageName = "com.example.app") {
            pressHome()
            // This block defines the app's critical user journey. Here we are interested in
            // optimizing for app startup. But you can also navigate and scroll
            // through your most important UI.
            startActivityAndWait()
        }
}
```

> PS: 需要一台 Android 9.0 及以上，开启 userdebug 或者  root 过的设备。

2. 接入 ProfileInstaller 

```groovy
dependencies {
    implementation("androidx.profileinstaller:profileinstaller:1.2.0-beta01")
}
```

> PS:  **com.android.tools.build:gradle** 需要使用 7.1.0-alpha01 及以上的版本，官方推荐使用 7.3.0-beta01 以上的版本。

3. 将第一步生成的 proflie 文件重命名为 `baseline-prof.txt` 放入到 `src/main` 目录下，与 AndroidManifest.xml 文件统计。

简单几步就能使用 Baseline Profile能力了。让应用程序运行性能更好。 


---

以上为 Android 操作系统中虚拟机的进化过程，以及开发者可以在加速 APP 运行可以做的事情。