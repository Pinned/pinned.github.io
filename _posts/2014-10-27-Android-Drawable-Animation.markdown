---
layout: post
styles: [syntax]
title: Android Drawable Animation
category: 安卓
tags: Android
---

ProgressBar是一个经常使用的组件，但很多时候，它的外观看起来并不能满足我们的需求。
对它进行自定义也很麻烦。

有一个很简单的解决办法就是用GIF动画，不使用系统提供的ProgressBar。

有关显示GIF动画，网上有很多例子，这里只介绍将GIF动态图按每一帧切出来，然后在使用
Frame Animation将它展示出来。

先上代码`loading.xml`：

```html
<?xml version="1.0" encoding="utf-8"?>
<animation-list android:id="@+id/loading_animation" android:oneshot="false"
  xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_00" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_01" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_02" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_03" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_04" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_05" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_06" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_07" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_08" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_09" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_10" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_11" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_12" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_13" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_14" />
    <item android:duration="@integer/loading_frame_interval" android:drawable="@drawable/loading_15" />
</animation-list>
```

其中:

```html
<integer name="loading_frame_interval">30</integer>
```

在使用的时候，因为网上说的种种bug，我直接自定义了一个`ImageView`，用来显示Loading View。 看源码：

```java
package cn.lovecluo.widget;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.AnimationDrawable;
import android.util.AttributeSet;
import android.widget.ImageView;

/**
 * Create by luozc at Aug 21, 2014
 */
public class CustomeImageView extends ImageView {

    public CustomeImageView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        this.initView();
    }

    public CustomeImageView(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.initView();
    }

    public CustomeImageView(Context context) {
        super(context);
        this.initView();
    }

    private void initView() {
        this.setImageResource(R.drawable.loading);
    }
    
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        this.loading();
    }   
    public void loading() {
        AnimationDrawable drawable = (AnimationDrawable) this.getDrawable();
        drawable.start();
    }
}
```

使用的时候也很简单，在XML中添加这个`CustomeImageView`即可，代码如下：

```html
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    style="@style/fillall"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin" >
    <cn.lovecluo.widget.CustomeImageView 
        style="@style/wrap"
        android:layout_centerInParent="true" />
</RelativeLayout>
```

当然使用场景并不仅仅是这么简单，有时候， 我们会需要在一个Button后面添加一`loading`动画,
就比如说在登录的时候，当然你可以定义几个组件，用代码控制每个组件的显示，但是这样子过于的麻烦。

就上述情况，我们还是用上面定义的`loading.xml`的动画效果来做展示:
在TextView中有这么几个属性:`drawableLeft`、`drawableRight`、`drawableTop`、`drawableBottom`

在这里，我们要动态控制，所以不能将这些写到xml中去，所以只能写代码了。

```java
Drawable drawable= mContext.getResources().getDrawable(R.drawable.loading);
/// 这一步必须要做,否则不会显示.
drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());
mSubmitBtn.setCompoundDrawables(drawable, null, null, null);
AnimationDrawable loadingAnimation = (AnimationDrawable) mSubmitBtn.getCompoundDrawables()[0];
loadingAnimation.start();
```

是不是很简单，当然，如果你觉得图片和文字离的太近，你可以在xml中加上`android:drawablePadding="8dip"`

看XML代码 ：

```html
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/submit_framelayout"
    style="@style/fillx"
    android:background="@drawable/add_service_input_btn_bg"
    android:clickable="true"
    android:padding="@dimen/activity_horizontal_margin" >

    <Button
        android:id="@+id/submit_btn"
        style="@style/wrap"
        android:layout_gravity="center"
        android:background="@null"
        android:drawablePadding="@dimen/dp8"
        android:text="@string/submit"
        android:textColor="@color/white"
        android:textSize="@dimen/textsize_medium" />

</FrameLayout>
```

看了代码，你就会觉得特别的简单。