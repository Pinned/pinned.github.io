---
layout: post
styles: [syntax]
title: Android RelativeLayout 之 Gravity 的使用
category: 安卓
tags: Android
---

在xml中，ViewGroup用来控制view布局位置，我们可以使用`android:gravity="center"`来实现。但是很少会在RelativeLayout中使用，今天碰到了一个项目中的布局使用了这个属性。但是在印象中这个属性在RelativeLayout是不生效的。但是，在项目中，这个属性生效了，并且引起了一个问题。去百度了一下，好多人在博客里面写的这个属性在RelativeLayout不生效，在这里，我在强调一下，**RelativeLayout中andorid:gravity属性是<font color='red'>生效</font>的**

so，我们先来看一下，布局代码是怎么写的：

**activity_main.xml**

```xml
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="100dp"
    android:background="@android:color/holo_blue_bright"
    android:gravity="center"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/center_view"
        android:layout_width="100dp"
        android:layout_height="50dp"
        android:background="@android:color/holo_green_light"
        android:gravity="center"
        android:layout_centerInParent="true"
        android:text="@string/hello_world"/>

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:background="@android:color/holo_orange_light"
        android:layout_below="@id/center_view"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="6dp"
        android:padding="6dp"
        android:text="下面的文本"/>

</RelativeLayout>
```
代码很简单，那我们在来看一下他的运行效果：

![效果图](https://cloud.githubusercontent.com/assets/8403321/12022795/46c90190-adce-11e5-8cfd-f39a8d1fd4a1.png)

我那个擦，为什么下面那个TextView上的文字内容显示不完整，这尼玛什么情况，于是乎，我调整了一个`RelativeLayout`的高度，让他变高一点，改成`android:layout_height="125dp"`, run了一下，居然正常了，如下图：
![效果图](https://cloud.githubusercontent.com/assets/8403321/12022788/299ea278-adce-11e5-93c7-104e82cbf6fb.png)

我特么的惊呆了，内心中一万只草泥马奔腾而过，上面那个图中，RelativeLayout中明明还有空白，为什么会导致下面的TextView的高度不够呢。

带着疑惑，我去看了一下Android RelativeLayout的源码，才发现，RelativeLayout 先按照不写gravity属性的时候来计算子View的高度：

```html
在Nexcus下调试，得到控件的高度：
1.首先得到RelativeLayout的高度为200px
2.写Hello World!的TextView的height为100px
3.可以得到最下面的那个TextView 的高度为：
  height <= 200px / 2 - 100px / 2 - marginTop(12px) = 48px = 24dp
  很明显，24个dp不够显示TextView的内容
  
那加了gravity属性过后，RelativeLayout将所有的Content作为一个整体，作了个居中，如下：
得到两个了控件的高度过后，就得到RelativeLayout 的contentHeight:

contentHeight = 100px + 12px + 48px = 160px
就可以得到上下的宽度分别为20px
```
RelativeLayout中源码实现：

```java
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    
    // 1. 判断是否有水平gravity与垂直gravity属性
    // 2. 排序子View，并计算子View的大小
    if (horizontalGravity || verticalGravity) { //如果有
        final Rect selfBounds = mSelfBounds;
        selfBounds.set(mPaddingLeft, mPaddingTop, width - mPaddingRight,
                height - mPaddingBottom);

        final Rect contentBounds = mContentBounds;
        Gravity.apply(mGravity, right - left, bottom - top, selfBounds, contentBounds,
                layoutDirection);

        final int horizontalOffset = contentBounds.left - left;
        final int verticalOffset = contentBounds.top - top;
        if (horizontalOffset != 0 || verticalOffset != 0) {
            for (int i = 0; i < count; i++) {
                final View child = views[i];
                if (child.getVisibility() != GONE && child != ignore) {
                    final LayoutParams params = (LayoutParams) child.getLayoutParams();
                    if (horizontalGravity) {
                        params.mLeft += horizontalOffset;
                        params.mRight += horizontalOffset;
                    }
                    if (verticalGravity) {
                        params.mTop += verticalOffset;
                        params.mBottom += verticalOffset;
                    }
                }
            }
        }
    }
}
```

所以，虽然下面有空隙，TextView 也拿到到足够的空间进行展示，导致TextView中的内容显示不完整