---
title: 你不会到现在还不知道 Android 中的那些 JDK 配置吧？
category: Java
tags: Java

---
在做 Android 应用开发时，不可避免的要使用到 JDK 。在众多版本的 JDK 中， 项目代码的编译会使用哪个版本，开发者要如何指定使用的 JDK  版本？选择和指定 JDK 是一个非常重要的步骤，它会影响整个开发过程。

不论你在源码是用  Java 进行编写的，还是使用 Kotlin，或者是两者都有使用。在整个项目开发迭代周期中，都会有很多地方会涉及到  JDK 版本：

![JDK 关系图](https://img-blog.csdnimg.cn/c6fce0972a6240d1b0884febf0ef737f.png)



## Android Studio 的 JDK

「工欲善其事，必先利其器」， Android Studio 是我们的开发利器，它的运行需要使用 JDK 环境。 在运行 Android Stduio  的时候， 会按照以下顺序去查找 JVM  运行时环境：

1. **STUDIO_JDK**: 环境变量配置 JDK 路径，官方不建议配置

2. **studio.jdk**： 与 Android Studio 打包在一起， 在 Android Studio 的目录下（PS：我没有找到）

3. **JBR**: JetBrains Runtime ， 与 Android Studio 打包在一起，在新版本的安装目录下有这个文件夹。 官方推荐使用这个版本，Android Studio 是在这个版本下进行测试的，并且可能还存在一些特殊的优化用于支持 Android Studio 的某些增强功能。 

4. **JDK_HOME**: 环境变量
5. **JAVA_HOME**：环境变量
6. **PATH**： 在 PATH 环境变量中指定的 java 可执行文件

只要你没有配置 **STUDIO_JDK** 环境变量，当前 Android Studio 默认应该都是使用 **JBR** 中的 Java 

![Android Studio 目录下的 JBR 文件夹](https://img-blog.csdnimg.cn/81dc21c6e3944cc8950d4c5e065cc5c3.png)

## Gradle 使用的 JDK 版本

Android 应用程序进行编译时，都会使用 Gradle 进行编译。 基于 Android Studio 有两种方式可以编译 Android 应用程序：

1. 在 Android Studio 中直接点  <font color="green">▶︎</font> 运行

这两种运行方式，使用的 JDK 版本可能会存在不一致的情况。点  <font color="green">▶︎</font> 运行时，是使用 Android Studio 中设置的值 JDK 来运行：

![Android Studio 中 gradle 的设置](https://img-blog.csdnimg.cn/ff39a4ffa017464e852ee8ae6e3ee5c8.png)

在默认情况下，会直接使用 jbr 的版本。当然，你也可以手动配置为 `JAVA_HOME` 或者是 `GRADLE_LOCAL_JAVA_HOME`。 这个地方的配置最终会存储到 `.idea/gradle.xml` 文件中去，在 Android Studio 启动时会去读取这个文件。 

![gradleJVM 的存储信息](https://img-blog.csdnimg.cn/8d673842e2764f3f9d9fa5006cd59e53.png)

关于 Gralde JDK 的配置，官方建议使用 `GRADLE_LOCAL_JAVA_HOME` 配置，这个宏定义会优先使用在 `properties` 文件中定义的 `java.home` 变量，如果没找到会使用 JBR。 

> 需要注意的是， 这个 JDK 除了用于 Gradle 本身运行以外，还会用于我们自定插件以及包含在 `buildSrc` 下面的代码编译与运行。例如我们在使用 Android Gradle Tools 的版本为 8.x 时，此时就需要将 JDK 设置成 17 及以上的版本，否则就会编译报错 ：
>
> ![报错信息](https://img-blog.csdnimg.cn/7bc84abcb02749f38610747a70e3d683.png)



2. 在 Terminal 终端使用命令进行运行

这种方式就行简单了，因为运行是在终端，则会直接使用环境变量中定义的 JAVA_HOME 来运行。 

> 如果在编译的时候，使用了不用的 JDK 版本或者是 Gradle 版本， 会导致创建更多的守护进程，因此也会占用更多的 CPU 和内存



## Java 与 Kotlin 中 JDK 的配置

在进行 Java 源代码编译时，默认情况下，会直接使用 Gradle 所用的 JDK 版本。但在不同的环境中，可能使用的 JDK 版本存在不一致，我们可以通 Gradle 提供的 toolchain 来指定 JDK 的版本， 如果不存在，会直接下载配置中的版本：

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}
```

在不同的 Java 版本中，会存在不同的语法，比如 `lambda` 表达式只能在 Java 1.8 的版本及以上版本使用， 同时， Java 中还有一些功能是需要特定的库进行支持的。因此，我们可以通过 `sourceCompatibility` 指定使用 Java 的版本， 来保证源代码编译期间可以进行正常编译。

```groovy
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
    }
}
```

同时，在执行编译时，还可以指定输出的 `class` 文件使用哪个版本的文件格式。针对 Java 代码，使用 `targetCompatibility` 字段进行指定，而 Kotlin 使用 `jvmTarget` 字段进行指定。

```groovy
android {
    compileOptions {
        targetCompatibility JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget '17'
    }
}
```



## 在 Android 中可以调用哪些 Java API ?

代码除了在编译时需要关注 JDK 版本，在运行时也需要关注代码中使用的 Java API 。虽然在写代码的时候，使用的是 Java 的语法，但其运行时并不是 JVM ， 因此有一些 Java 的 API 在 Android 中并无法运行。 在 Android  SDK 中，定义了很多 Java 库函数实现的 API ，在绝大多数时后，开发者根本感知不到它的区别。我们可以通过 `compileSdk` 来指定当前 Andorid 项目支持的 Java API 的范围，具体信息如下图：

![Android 支持的 Java API 的范围](https://img-blog.csdnimg.cn/757f5c2064054832abe77fadc3c2cf14.png)

Android  项目中除了配置 `compileSdk` ， 还需要配置 `minSdk` 指定当前 APP 运行的最低手机版本，当代码中使用了高版本中方法（如 `String.isBlank()`  等 JDK 11 才提供的），就会导致低版本无法使用。此时为了兼容，R8 在编译的过程中，会对代码进行脱糖处理，将其转换成低版本就可用的代码。



## 写在最后

JDK 是在代码开发过程中经常会遇到的配置，如果版本不对，搞不好就会出现一些莫名其妙的错误，了解编译运行过程中的 JDK 版本，有助于更好的解决实际开发中遇到的问题。