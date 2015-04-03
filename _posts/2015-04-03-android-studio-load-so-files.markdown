---
layout: post
styles: [syntax]
title: Android Studio 中加载so库文件
category: 工具
tags: Tools Android
---

在使用第三方库的时候，经常会遇到一些第三方的so库文件。

以前在`Eclipse`中，只需要将`*.so` 的文件放到`libs`文件目录下就行了。

可是在使用`Android Studio`的时候，却出了点小问题。记录一下，以备后面查阅:

首先，还是将`*.so`文件导入到`libs`文件目录下面。Android Studio使用的是`gradle`进行编译的。在`bulid.gradle`文件里面，你可以很清晰的看到如下代码：

```html
dependencies {
    compile fileTree(include: ['*.jar'], dir: 'libs')
}
```

所以我很直觉的加入so库的编译依赖，如下:

```html
    compile fileTree(include: ['*.so'], dir: 'libs')
```

可是，这样子并不能正确的执行so的加载。运行的时候会报错。

经查阅，在`gradle`中编译`.so`只有在特定目录下才能生效，所以我们进行如下配置:

```html
sourceSets {
    main {
        jniLibs.srcDirs = ['libs']
    }
}
```

将上述代码放到

```html
android{
	sourceSets {
	    main {
	        jniLibs.srcDirs = ['libs']
	    }
	}
}
```
