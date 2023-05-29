---
layout: post
styles: [syntax]
title: ListView & RecyclerView
category: 安卓
tags: Android
---

1. RecyclerView 作消息列表滚动到最后面

```java
// 添加一条数据，滚动到最后面
if(mDatas.size > 0) {
	mListView.scrollToPosition(mDatas.size() - 1);
}
```

2 . RecyclerView & LinearLayoutManager

```java
// 显示的时候，按照整个RecyclerView的大小，从后往前显示，数据也是从最后一条开始展示
LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
linearLayoutManager.setStackFromEnd(true);
mListView.setLayoutManager(linearLayoutManager);
```
