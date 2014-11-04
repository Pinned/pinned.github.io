---
layout: post
styles: [syntax]
title: Andorid UI注入工具的使用(ButterKnife)
category: android
---

一个Android项目中，必不可少有很多UI，并且`Activity`要控制这些UI，当然，我们会用到以下代码:

```java
// 获取View的引用
Button mBtn = (Button) this.findViewById(R.id.btn);
// 给Button添加事件
mBtn.setOnClickListener(new OnClickListener() {
    @Override
    public void onClick(View view) {
        // TODO 做一些你自己要做的事情 
    }
})
```

每一个Activity都要做类似的事情，这是一个相当蛋疼的事情。

如果你可以像如下代码来实现View的初始画以及事件监听以及其它的，你还会用以前的代码么？

代码如下:

```java
@InjectView(R.id.user) EditText username;
@InjectView(R.id.pass) EditText password;
@OnClick(R.id.submit) void submit() {
    // TODO 实现submit这个Btn的点击事件
}
```


用上面的注解会更加简单的组织我们的代码结构，代码量更少。
在这里我使用[Butter Knife](http://jakewharton.github.io/butterknife/)

### 使用步骤

1. 去GitHub下载ButterKnife的源码或者jar包  -->  [传送门](https://github.com/JakeWharton/butterknife)
2. 在这里，我是去下载的jar包，将jar包添加到项目的`libs`文件夹下面就可以使用了

先上代码,一个很简单的布局文件:

```html
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    android:orientation="vertical">

    <TextView
        android:id="@+id/tv"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:text="@string/hello_world" />
    
    <Button 
        android:id="@+id/btn"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Change Text"/>

</LinearLayout>
```

简单到不能在简单的布局了，一个`TextView`， 一个`Button`

看Activity的代码，如下：

```java
public class MainActivity extends Activity {

	@InjectView(R.id.tv) TextView mShowTv;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		ButterKnife.inject(this);
		mShowTv.setText("Default Text");
	}
	@OnClick(R.id.btn) void changeText() {
		mShowTv.setText("Change Text:" + System.currentTimeMillis());
	}
	
}
```

就是这么简单的代码，可是就是用不起来，怎么破，在

```java
mShowTv.setText("Default Text")
```

这儿报了一个空指针。如下图：

![Alt text](http://pinned.github.io/assets/posts/file-2014-11-4/inject_nullpoint.png)

### 解决办法

因为使用注解，编译的时候，要进行相应的设置，才可以正常的编译,步骤如下：

右键`项目`，选择`Properities`,然后选择`Java Compiler`下的`Annotation Processing`。
可是我找了半天，也没有找到它的踪影。不要着急，更新一下`Eclipse Java Development Tools`就可以了

![Install Eclipse Java Development Tools](http://pinned.github.io/assets/posts/file-2014-11-4/install_eclipse_tools.png)

等到安装完成过后，你就可以进行如下设置了:

![Step 01](http://pinned.github.io/assets/posts/file-2014-11-4/eclipse_setting_01.png)

![Step 02](http://pinned.github.io/assets/posts/file-2014-11-4/eclipse_setting_02.png)

![Step 03](http://pinned.github.io/assets/posts/file-2014-11-4/eclipse_setting_03.png)

![Step 04](http://pinned.github.io/assets/posts/file-2014-11-4/eclipse_setting_04.png)

### 参考资料

 + [ButterKnife Android程序员的一大利器](http://www.it165.net/pro/html/201404/12375.html)
 + [ButterKnife Doc](http://jakewharton.github.io/butterknife/)





