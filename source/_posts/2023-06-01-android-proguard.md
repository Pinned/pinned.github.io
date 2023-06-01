---
title: 深入 Android 混淆实践：ProGuard 通关秘籍
category: 安卓
tags: Android Proguard
---
使用 Java 编写的源代码在编译时会生成 `CLASS` 文件，而 `CLASS` 字节码的规则非常的标准，按照对应的格式能够很好的反编译出原代码。市面上也存在很多很好用的工具，来帮助我们进行反编译并阅读 `CLASS` 中的代码逻辑。为了更好的保护代码安全，混淆是最容易做的一件事情。

针对 java 的混淆，有一个开源项目 [ProGuard](https://github.com/Guardsquare/proguard) 就是常用的混淆工具。他可以对代码进行 `压缩`、`优化` 、`混淆`。本文将基于在使用过程中，用到的知识点进行记录。



## ProGuard 工作流程

在 ProGuard 执行的过程中，有 `shrink`、`optimize`、`obfuscate` 、`preverify` 四个步骤，每一个步骤的执行都是可选的，我们可以根据想要的流程去进行配置，但此四个步骤执行的顺序是固定的，不可更改的。

![ProGuard 工作流程](https://img-blog.csdnimg.cn/b948011a4512492393971baace169df9.png)

+ **shrink**  检查并删除没有使用的类、字段、方法、属性。
+ **optimize** 优化字节码，移除无用指令，或者进行指令优化。
+ **obfuscate** 进行代码混淆，将 Java 代码中的类名、方法名、字段名等名称使用无意义的名称进行替换，降低反编译代码的可读性
+ **preverify** 针对 Java 1.6 及以上版本进行预校验， 校验 StackMap /StackMapTable 属性。但是在  Android 中，编译产生的 Class 文件会被合并成 `dex` 文件，所以不需要进行预校验， 在编译时，可以关掉，提升打包速度。

能过上面的流程，可以对代码进行优化、压缩，删除不使用的类，减少包大小。 因为压缩是会删除没有被使用的类，如果我们有使用反射，ProGuard 是无法关联使用关系，默认情况下，反射的类可能会被删除掉，因此，我们需要在配置文件中 `keep` 反射中的类，防止被删除。

## Android 中使用 ProGuard

在 Android 中使用也非常的简单，只需要在 `build.gradle` 中加入相应的配置即可。 

```groovy
buildTypes {
  release {
    minifyEnabled true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
  }
}
```

配置中，使用 `minifEnabled = true` 表示开启混淆，而混淆配置文件使用的 `proguard-android-optimize.txt` 和自定义的 `proguard-rules.pro` 中定义的规则。

### 1. proguard-android-optimize.txt 的生成

在 Android 进行编译的时候，有一个 `extractProguardFiles` 的 Task， 它会生成三个默认 ProGuard 配置文件，并放到`build/intermediates/proguard-files/` 下面去。 这三个文件分别为:

+ `proguard-android.txt`
+ `proguard-android-optimize.txt`
+ `proguard-defaults.txt`

以 `proguard-android-optimize.txt` 为例，在 `extractProguardFiles` 的执行中，第一是需要先确定生成文件的地址：生成 proguard 配置文件路径的源代码如下（代码在 `com.android.build.gradle.ProguardFiles.getDefaultProguardFile`）：

```java 
FileUtils.join(
        buildDirectory.get().getAsFile(),
        AndroidProject.FD_INTERMEDIATES,
        "proguard-files",
        name + "-" + Version.ANDROID_GRADLE_PLUGIN_VERSION);
```

我当前使用的是 4.1.0 版本的 Gradle ，所以最终的产物地址为： 

`build/intermediates/proguard-files/proguard-android-optimize.txt-4.1.0`

第二步，就是在指定的文件中，按照指定的配置将对应的配置写入到文件中。

![proguard-android-optimize 生成](https://img-blog.csdnimg.cn/f12a5826f59748b09058678a4616a4e6.png)

从上图中的代码可以看到，在生成 proguard 的配置文件时，将 gradle.jar 中 `proguard-haader.txt`，  `proguard-optimizations.txt`， `proguard-common.txt` 按顺序写入目标文件。

### 2. Android Proguard 的默认配置解析

在默认配置中，写有 Android 中最长用的混淆规则。从这些规则中，也可以学习到一些之前不会注意到的知识点

#### 2.1 `-keepattributes *Annotation*` 

根据 [ProGuard 官方文档](https://www.guardsquare.com/manual/configuration/attributes)文档解释，`*` 是用来匹配属性名称的通配符，`*Annotation*` 会匹配到诸如： `RuntimeVisibleAnnotations`， `RuntimeInvisibleAnnotations` 等。  

此配置在网上的一些教程中，一般都会建议加上，那这个是干什么的呢？ 在官方文档上写了，在混淆的过程中，会将那些在执行中不必要的属性进行移除。

我们都知道，每一个注解，都有其应用的范围。 `RuntimeVisibleAnnotations` 就是表示的在运行时可见的注解， 这一类注解在代码执行的过程中，可通过反射去获取并使用。在混淆时，如果没有 `keep` ，就会直接删除掉，这就会导致运行时读取不了这个注解。

然而，这条规则是用来保持一个类中使用的 `Annotation` 不被删除，如果要保持 `Annotation` 不被混淆，还需要加另外一条规则，例如：

```
-keep class androidx.annotation.Keep
```



#### 2.2 使用注解实现类、方法、变量的 `keep `

为了让我们的代码能够正常运行，总会有一些类，一些方法是不能被 `keep` 的，但是，在编写代码之外，专门来写一些很精细化的规则处理，非常的麻烦，而且易出错。而 `ProGuard` 也支持用注解标记的类、方法、变量进行 `keep`，在 Android 的 support 包中，也有对应的注解， 定义如下：	

```java 
package androidx.annotation;

@Retention(CLASS)
@Target({PACKAGE, TYPE, ANNOTATION_TYPE, CONSTRUCTOR, METHOD, FIELD})
public @interface Keep {
}
```

在默认的规则中，也对 `@Keep` 修饰的类、方法、变量进行了 `keep` ，在写代码的时候，我们可以直接使用这个注解。下面也可以看看规则是如何编写的：

```proguard
# 1. 让使用的注解类不被混淆
-keep class androidx.annotation.Keep

# 2. keep 由 @Keep 修饰的所有类
-keep @androidx.annotation.Keep class * {*;}

# 3. keep 由 @Keep 修饰的所有方法
-keepclasseswithmembers class * {
    @androidx.annotation.Keep <methods>;
}
# 4. keep 由 @Keep 修饰的所有变量
-keepclasseswithmembers class * {
    @androidx.annotation.Keep <fields>;
}
# 4. keep 由 @Keep 修饰的所有构造方法
-keepclasseswithmembers class * {
    @androidx.annotation.Keep <init>(...);
}
```

如果，你有自己定义的注解类，也可以按照上面的规则去编写自己的 keep 规则。当然，对于绝大部分项目应该都引入了 `support 包`， 所以建议直接使用 `support 包`中定义的注解。

#### 2.3 View 及 Activity 相关配置

在 Android 底层运行中， Activity 以及 View 中，涉及到与 XML 关联的代码中，大多数方法调用都是使用反射来处理的。 因此，对于这些方法都需要进行 `keep` 的， 而在默认的配置中，有如下配置： 

```txt 
-keepclassmembers public class * extends android.view.View {
    void set*(***);
    *** get*();
}
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}
```

可以看到，默认配置中，对于 View 的子类，将所有继承 View 类中的 `get`、`set`  方法进行了 `keep`。 而对于 Activity，仅将方法中参数为 `android.view.View`，且返回值为 void 的方法进行了 `keep`， 这类方法大多为 XML 中定义的 `onClick` 的调用。

除了以上的 `keep` 规则，并没有对 View 类以及 Activity 类的其它 `keep` 规则， 在 `AndroidManifest.xml`  中所写的 Activity 名字，以及在 `layout` 中写的 View 的名字，都是通过反射构造的，而并没有相应的规则，这又是怎么回事呢？

### 3. 生成规则，aapt_rules.txt的用途

前面提到，在混淆规则中，并没有对 Activity 以及 View 的构造方法进行 `keep` 。但是我在打出来的 `release aar` 中， XML 中使用的 Activity 以及 View 被 keep 了， 没有被混淆。

为了进一步分析，我将项目中执行的 Task 的出参与入参打应了出来，打印代码如下：

```groovy
gradle.taskGraph.afterTask { task ->
    StringBuffer taskDetails = new StringBuffer()
    taskDetails << "-------------\n"
    taskDetails << "name:$task.name\n"
    taskDetails << "inputs:\n"
    task.inputs.files.each { it ->
        taskDetails << " ${it.absolutePath}\n"
    }
    taskDetails << "outputs:\n"
    task.outputs.files.each { it ->
        taskDetails << " ${it.absolutePath}\n"
    }

    taskDetails << "-------------"
    println taskDetails
}
```

经过分析 `minifyReleaseWithR8`  这个任务的入参，发现了一个可疑的配置： `build/intermediates/aapt_proguard_file/release/aapt_rules.txt`，打开这个文件，里面果然有 Activity 以及 View 的混淆规则。

从 Task 的出参中，也可以看出，`generateReleaseLibraryProguardRules` 会生成一个 aapt_rules.txt 文件。

```
-------------
name:generateReleaseLibraryProguardRules
inputs:
 /xxx/build/intermediates/packaged_res/release
 /xxx/build/intermediates/packaged_manifests/release
outputs:
 /xxx/build/intermediates/aapt_proguard_file/release/aapt_rules.txt
-------------
```

有兴趣的同学，也可以去看一下这个 Task 的原码，看看 aapt_rules.txt 文件的生成流程。 

### 4. 其它有用配置

#### 4.1 将混淆类移动到指定包中

本文中，混淆使用的是 R8 ， 而 R8 在混淆的时候，默认情况下，混淆后的类，会被放到根目录下，如下图所示：

![R8 输出默认 mapping](https://img-blog.csdnimg.cn/18bc36212e484d6181c1da9080a12015.png)

但在做 SDK 的时候，我们打包的是 aar 文件，这种直接放在跟目录下， 可能会出现与其它 `aar` 的混淆类冲突，所以可以将混淆类移动到指定包中去。

+ `-flattenpackagehierarchy packageName`

将重命名的包移动到指定的包名下，在 R8 中，编译后输出的 mapping 文件示例如下：

```
com.example.build.DeviceApi -> com.exampe.a1.i.a:
    int api -> a
com.example.build.inner.InnerClass -> com.exampe.a1.j.a:
    java.lang.String innerValue -> a
com.example.build.inner.sub.SubClass -> com.exampe.a1.k.a:
```

+ `-repackageclasses packageName` 

指定通过将所有重命名的类文件移动到单个给定包中来重新打包它们，所有的混淆类会打平放到指定的包中，优先级比 `-flattenpackagehierarchy` 高。 编译后输出的 mapping 文件示例如下：

```
com.example.build.DeviceApi -> com.exampe.a1.e:
    int api -> a
com.example.build.inner.InnerClass -> com.exampe.a1.h:
    java.lang.String innerValue -> a
com.example.build.inner.sub.SubClass -> com.exampe.a1.k:
```

#### 4.2 删除 `无副作用 `的方法调用 

相信很多同学都使用过 ProGuard 去删除 `android.util.Log` ， 配置规则很简单，如下所示：

```groovy
-assumenosideeffects class android.util.Log {   
    public *** d(...);       
    public *** e(...);    
    public *** i(...);    
    public *** v(...);   
    public *** println(...);
    public *** w(...);     
    public *** wtf(...);
}
```

通过如上配置，就可以把`android.util.Log` 的调用删掉，为了更有体感，我写了个示例，在没有删除 Log 时， 编译结果如下：

![删除前的结果](https://img-blog.csdnimg.cn/83d662a27d0741fd9ebc579afca84269.png)

添加对应删除的 ProGuard 规则后，结果如下图所示：

![删除后的结果](https://img-blog.csdnimg.cn/8904344995054bedaea388019330a5fe.png)

可以看到，编译后的 class 文件中，已经将 `Log.d` 的调用删除掉了，但是需要注意的是，代码中的 `"A" + info + "B"` 会被保留下来， 因为 ProGuard 无法判断此处代码删除是否对业务逻辑有影响，所以被保留了下来。


####  4.3 keep 类，但不允许混淆

在混淆的过程中， 第一步为 `shrink` ， 在执行过程中，会将未使用的类、方法、变量等进行优化删除，但如果你输出的是 SDK， 有一些接口类是不会被调用的。当然，你可以直接将接口类进行 `keep` ， 这样 `shrink` 的时候，就不会删除对应的类了。但如果你和我一样，即要不删除类，但是又希望混淆类名字，你可以进行如下配置实现：

```
-keep,allowobfuscation class com.example.TestApi {*;}
```



## 结语

ProGuard 是在打包过程中一个非常常用的功能，但其涉及点很多，少有去花时间深入了解其实现原理。文中也仅记录使用过程中遇到的知识点。当遇到问题，多去看看官方文档，可能会发现之前从未注意到的亮点。
