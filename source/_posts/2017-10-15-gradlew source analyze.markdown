---
layout: post
styles: [syntax]
title: gradlew 源码分析
category: 编程语言
tags: Android Gradle
---
# gradlew 源码分析

使用Android Studio 新建一个项目，会默认使用gradle编译项目。在编译的时候可以使用：`gradle assembleRelease`, 当然，如果没有安装`gradle`的时候，也可以使用项目文件夹下面的`gradlew`进行编译。

可以看到`gradlew`是一个shell脚本，他读取了系统的一些环境变量，并运行了**gradle/wrapper/gradle-wrapper.jar**文件的`org.gradle.wrapper.GradleWrapperMain`。执行编译。

## gradle-wrapper.jar
在**org.gradle.wrapper.GradleWrapperMain**的main如下：

```java
public static void main(String[] args) throws Exception {
	// 第一步
    File wrapperJar = wrapperJar();  // gradle-wrapper.jar 文件
    File propertiesFile = wrapperProperties(wrapperJar); // gradle-wrapper.properties
    File rootDir = rootDir(wrapperJar); // 项目根目录

    // 第二步
    CommandLineParser parser = new CommandLineParser();
    parser.allowUnknownOptions();
    parser.option(GRADLE_USER_HOME_OPTION, GRADLE_USER_HOME_DETAILED_OPTION).hasArgument();
    parser.option(GRADLE_QUIET_OPTION, GRADLE_QUIET_DETAILED_OPTION);

    SystemPropertiesCommandLineConverter converter = new SystemPropertiesCommandLineConverter();
    converter.configure(parser);
    // 读取gradlew assembleRelease [args]
    ParsedCommandLine options = parser.parse(args);

    Properties systemProperties = System.getProperties();
    systemProperties.putAll(converter.convert(options, new HashMap<String, String>()));
    // 第三步
    File gradleUserHome = gradleUserHome(options); // gradle 所在的文件夹

    addSystemProperties(gradleUserHome, rootDir);

    Logger logger = logger(options);

    // 第四步
    WrapperExecutor wrapperExecutor = WrapperExecutor.forWrapperPropertiesFile(propertiesFile, logger);
    wrapperExecutor.execute(
            args,
            new Install(logger, new Download(logger, "gradlew", wrapperVersion()), new PathAssembler(gradleUserHome)),
            new BootstrapMainStarter());
}
```

1. 先根据 **GradleWrapperMain** 这个类找到`gradle-wrapper.jar`,`gradle-wrapper.properties`,`root dir`
2. 读取系统环境的配置
3. 读取系统的gradle 配置的路径`gradle user home`
4. 检测gradle-launcher-version.jar（如果不存在，先下载）, 并运行`org.gradle.launcher.GradleMain`

## 读取系统的配置文件

1. 如果在使用`gradlew`编译的时候，参数中包含`g`, 则使用这个参数的值来作为`gradle user home`
2. 如果不存在`g`这个参数， 先读取`gradle.user.home`, 如果没有，读取环境变量中的`GRADLE_USER_HOME`，如果依然不存在，使用默认值`~/.gradle/`

```java
public class GradleUserHomeLookup {
    public static final String DEFAULT_GRADLE_USER_HOME = System.getProperty("user.home") + "/.gradle";
    public static final String GRADLE_USER_HOME_PROPERTY_KEY = "gradle.user.home";
    public static final String GRADLE_USER_HOME_ENV_KEY = "GRADLE_USER_HOME";

    public static File gradleUserHome() {
        String gradleUserHome;
        if ((gradleUserHome = System.getProperty(GRADLE_USER_HOME_PROPERTY_KEY)) != null) {
            return new File(gradleUserHome);
        }
        if ((gradleUserHome = System.getenv(GRADLE_USER_HOME_ENV_KEY)) != null) {
            return new File(gradleUserHome);
        }
        return new File(DEFAULT_GRADLE_USER_HOME);
    }
}
```

## gradle的检测与下载

从`gradle-wrapper.properties`中读取到`distributionUrl`,使用md5作为hash值，找到`gradleUserHome/gradle_dest_name/gradle_hash`的文件夹下

```java
final File markerFile = new File(localZipFile.getParentFile(), localZipFile.getName() + ".ok");
if (distDir.isDirectory() && markerFile.isFile()) {
    return getAndVerifyDistributionRoot(distDir, distDir.getAbsolutePath());
}
```
如果文件夹下面有`.ok`文件，说明下载成功，直接使用。
如果不存在，则执行下载任务，下载完成，解压，在使用。

