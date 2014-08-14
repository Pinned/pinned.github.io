---
layout: post
styles: [syntax]
title: Android ListView中Adapter的使用
category: android
---

在Android开发过程中，在一个小小的屏幕上要展示很多的东西，不能像Web网站上那样来展示。在Android中会经常使用到ListView，一个非常灵活的东西。有一些开源的组件，是基于ListView来修改的，可以很容易的使用。用的比较多的有下拉刷新，这是一个很常用的组件，在Github上，搜索一下，排在前面的就是了。在这里我也就不贴他的地址。

下面记录一下我在Android中使用ListView的用法。

- 创建一个项目
	
	命名就叫ListViewDemo吧。只一个Activity。（PS：这个地方只是简单的做个Demo而已，没有什么复杂的界面和数据结构）
	
	- 下面来看一下主Activity的布局
	
```xml

<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical" >

    <ListView
        android:id="@+id/list_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="15dp" >
    </ListView>

</LinearLayout>

```

这个地方的ListView已经定义好了，下面进行第二步

- 创建Adapter

	Android中有好多定义好的Adapter，如ArrayAdapter等等... 但是我还是比较自己写Adapter，继承于BaseAdapter，然后重写方法，代码如下：

```java
package org.nightweaver.listviewdemo;

import java.util.List;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class MyListAdapter extends BaseAdapter {

	private Context mContext;
	public List<Item> datas;

	public MyListAdapter(Context context, List<Item> datas) {
		this.mContext = context;
		this.datas = datas;
	}

	@Override
	public int getCount() {
		if (datas != null) {
			return datas.size();
		}
		return 0;
	}

	@Override
	public Item getItem(int arg0) {
		if (datas != null) {
			return datas.get(arg0);
		}
		return null;
	}

	@Override
	public long getItemId(int arg0) {
		return arg0;
	}

	@Override
	public View getView(int position, View contentView, ViewGroup parent) {
		ViewHolder holder;
		if (contentView == null) {
			contentView = LayoutInflater.from(mContext).inflate(R.layout.item_layout, null);
			holder = new ViewHolder();
			holder.showValue = (TextView) contentView.findViewById(R.id.show_value);
			contentView.setTag(holder);
		} else {
			holder = (ViewHolder) contentView.getTag();
		}
		Item item = this.datas.get(position);
		holder.showValue.setText(item.getName());
		return contentView;
	}

	class ViewHolder {
		TextView showValue;
	}

}
 
```

- 现在给ListView设置一下Adapter就可以了

	代码如下：
	
```java
private void initData() {
		datas = new ArrayList<Item>();
		for (int i = 0; i < 100; i++) {
			Item item = new Item();
			item.setName("Item " + i);
			datas.add(item);
		}
	}

	private void setListView() {
		this.mListAdapter = new MyListAdapter(this, datas);
		this.mListView.setAdapter(mListAdapter);
	}
```

Android中Adapter使用非常的简单，也非常的好用。建议好好研究一下Adapter。