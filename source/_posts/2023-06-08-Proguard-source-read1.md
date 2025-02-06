---
title: ProGuard 进阶系列（一）源码运行
category: 混淆
tags: ProGuard 
---
在前面的文章[深入 Android 混淆实践：ProGuard 通关秘籍](https://mp.weixin.qq.com/s/AIKuIfLnM-4DBMJa2jmzIw)和[深入 Android 混淆实践：多模块打包爬坑之旅](https://mp.weixin.qq.com/s/WDgwfkijoUpI70P8JVlSAQ)中，已经讲到了如何在 Android 中使用 ProGuard，以及如何自定义实现混淆规则的生成。为了更深入地理解 ProGuard 的细节，本系列文章从我感兴趣的点出发，记录在阅读 ProGuard 源码过程中的思考与启发，希望对你也有所帮助。本文为此系列文章的开篇，将最基础的讲起，使用 ProGuard 源码去实现代码混淆。

## 1. ProGuard 的使用

在之前的文章中，使用 ProGuard 的流程已经融入到 Android Gradle Tools 中了。除了自带的流程，我们也可以直接使用 `android-sdk/tools/proguard/libs` 里面的  `proguard.jar` 。在 `android-sdk/tools/proguard/bin` 下有 `proguard.sh` 这个可执行文件：

```shell
PROGUARD_HOME=`dirname "$0"`/..
java -jar $PROGUARD_HOME/lib/proguard.jar "$@"
```

可以看到，就是使用 `java -jar` 进行执行的，并且将参数直接透传。除了使用这个可执行脚本执行外，我们也可以直接使用如下命令直接运行：

```shell
java -jar proguard.jar [options ...]
```

根据使用混淆的经验，你应该可以想到，加固过程中，主要需要以下四部份内容：

+ 要被混淆的内容，如常见的 jar 包。
+ 被混淆内容的依赖库， 如 Android SDK。
+ 混淆的配置，哪些类、方法不被优化混淆处理。
+ 混淆后的输出内容。

在执行命令中，必须包含这些内容，我们可以使用以下几条参数来指定：

+ **-injars  classpath**，classpath 指定当前需要混淆的 jar 包，classpath 路径中支持 apk, aab, aar, war, ear, jmod, zip 以及文件夹，支持多个输入。
+ **-outjars classpath**，classpath 指定当前混淆后输出的 jar 包， 格式支持与 `-injars` 一致， 一般情况下，此处仅有一个可输出的 classpath 路径
+ **-libraryJars classpath**， classpath 指定依赖库，支持格式与`-injars` 一致，如有多个 library 依赖，写多行就可以指定
+ **-include filename，**filename 指定配置文件的路径，也可使用  `@filename`  替代

我们所编写的 `混淆配置` 通过 `-include filename` 即可指定。当然，`-injars`、`-outjars`、`-libraryJars` 和 `-keep 规则` 放到同一个配置文件中，运行时，指定对应配置文件即可，使用起来更方便，比如我将配置信息写到 `debug_proguard.pro` 文件中，即可按如下方式进行运行：

```shell
java -jar proguard.jar @debug_proguard.pro
```

当写好配置后，运行如上命令，就能将混淆后的内容输出到 `-outjars` 指定的路径中。

## 2. ProGuard 源码下载与运行配置

前面的内容中，可以了解到 ProGuard 的使用，而 ProGuard 是一个开源项目，它使用的是 GPL 协议，而其还依赖了`ProGuard-core` ，此项目也为开源项目。为了了解其实现细节，可以将代码下载下来，如下所示：

```shell
git clone git@github.com:Guardsquare/proguard.git
git clone git@gitcode.net:mirrors/Guardsquare/proguard.git
```

代码下载好后，可以直接使用 `Intellij IDEA` 打开它并且运行起来，这样我们就可以直接进行运行调试，能够更方便的去读懂  ProGuard 中的逻辑。

> 在 ProGuard 代码仓库中写到，要编译源码，需要使用 JDK 8 ， 此处需要注意你当前使用的 JDK 版本。

首先，要运行代码，就需要找到 `main()` 方法所在的类，才能执行运行。在第一节的内容中，使用 `java -jar proguard.jar` 就可以执行，从 jar 包中的 `MANIFEST.MF` 文件中，可以看到， `main()`  方法在 `proguard.ProGuard` 中， 如下图所示：

![proguard.jar 中的 MANIFEST.MF 文件](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/fd527c280bca4c7d85f0017749a1080a.png)

在源码中，我们也能看到 `proguard/ProGuard.java` 的类中，正好有一个 `main()` 方法。在 `Intellij IDEA` 可以直接运行此 `main` 方法:

![在 Intellij IDEA 直接运行](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/74acc10c353c4299a59bce7c62ffd902.png)

如果直接点击绿色的 <font color="green">▶︎</font> ，运行肯定会报错。在这里，我们还需要手动将第一部分中使用的 `debug_proguard.pro` 文件路径放到参数列表中去，具体操作方法如下图所示：

![Intellij IDEA 中参数配置](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/8f48291cc59f42ff973fa31f3c03fd9c.png)

配置完成后，直接点击 `Intellij IDEA` 中的  <font color="green">▶︎</font> ，输出的产物与用命令行执行出来的结果一致。 

## 3. 结语

当拿到源码后，第一步就是将源码跑起来，这能够有助于我们对源码理解，以及后续分析源码时进行调试。本文内容很简单，但纸上得来终觉浅，绝知此事要躬行。朋友们可以自己去将源码下载下来，并使用你所熟知的 `IDE` 将其运行起来，相信你也有很多的收获，也欢迎各位与我交流。