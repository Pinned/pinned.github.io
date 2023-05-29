---
layout: post
styles: [syntax]
title: Android 项目中出现的奇葩bug, 数据NullPointExcption
category: 安卓
tags: Android
---

### 问题描述

在一个自定义的Form表单中，有各种控件，如文本输入框，时间选择器，城市选择器等。
在使用城市选择器的时候，城市的数据存储在`List`中
在定义的时候，我使用如下代码定义：

```java
private List<CityNode> mCitys = null;
```

经过数据初始化过后，在构造方法中使用`mCitys`是正常的，但是在其它方法中使用，
`mCitys`便成了空值.

这个结果让我非常的费解。

### 解决问题

一开始出现了这个空指针异常，排查了好久，根本就找不到任何原因，
因为代码本身没有任何的逻辑错误。不知道是运气好还是怎么的。我把那个`List`的
定义写成如下，代码竟然可以正常运行：

```java
private List<CityNode> mCitys;
```

看到上面贴出来的代码，我顿时就无语了，太奇怪了，这两个不应该是一样的么。
经过一系列的测试，以下是问题解决的步骤:

+ 反射

先上反射代码：

```java
Class<? extends BaseFormElement> clazz = model.getType().getValue();
BaseFormElement element = null;
try {
    Class[] parameterTypes = { Context.class, FormElementModel.class };
    //根据参数类型获取相应的构造函数
    Constructor<? extends BaseFormElement> constructor
    		= clazz.getConstructor(parameterTypes);
    //参数数组
    Object[] parameters = { mContext, model };
    //根据获取的构造函数和参数，创建实例
    element = (BaseFormElement)constructor.newInstance(parameters);
} catch (Exception e) {
    e.printStackTrace();
}
```

一开始，我以为是由于java的反射机制引起，导致局域变量初始化被执行了两次，
可是，有关反射的相关信息，查找了一遍，包括类加载的机制等信息，还是没有能
解释代码为什么执行了两次，所以觉得不怎么像是他引起的。后面和一个同事说到，
他看了一下代码，开始也没有找到原因,后面他说对象强转型引起的。

+ 强制转型

在使用反射的时候，`newInstance`创建一个对象，返回了一个父类型的变量，可是
根本就没有进行强制转换。

+ 构造方法的执行顺序

还是抱着局域变量的初始化被执行了两次，打印了一下日志，终于发现了问题的所在。
在初始化一个对象的时候，首先是执行父类的构造方法，如果还有父类，继续向上查找。

示例：

```java
public class A {
	{
		System.out.println("class a prarms init");
	}
	public A() {
		System.out.println("A constructor method excute");
	}
}
```

```java
public class B extends A {
	{
		System.out.println("class B params init");
	}
	public B() {
		System.out.println("B constructor method excute");
	}
}
```

```java
public class Main {

	public static void main(String[] args) {
		A a = new B();
	}
}
```

运行结果:

```html
class a prarms init
A constructor method excute
class B params init
B constructor method excute
```

### 总结

这一次的空指针的最根本原因是在父类的构造方法中执行了子类实例变量的初始化
操作，这是一个非常不合理的举动。如果子类属性中的东西应该在子类中进行初始化，
而不是在父类中调用初始化方法。

### 写在最后

~~代码木有上传上来，如果你想看看这个丑陋的代码是怎么写的，你可以邮件联系我：
lovecluo@nightweaver.org~~

更新代码地址：

 + [Bug版代码](http://pinned.github.io/assets/posts/file-2014-11-4/NullPointProject-bug.tar.gz)
 + [修改版本](http://pinned.github.io/assets/posts/file-2014-11-4/NullPointProject-更改.rar)
