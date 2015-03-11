---
layout: post
styles: [syntax]
title: ListView & RecyclerView
category: 安卓
tags: Android
---

1. RecyclerView 作消息列表滚动到最后面

```java
// 使第一次展示的时候，滚动到最后面进行显示
LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
linearLayoutManager.setStackFromEnd(true);
mListView.setLayoutManager(linearLayoutManager);

// 添加一条数据，滚动到最后面
mListView.scrollToPosition(mDatas.size() - 1);
```
