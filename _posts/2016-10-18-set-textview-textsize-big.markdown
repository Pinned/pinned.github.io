---
title: Android TextView setTextSize
type: snippet
---

Android TextView 在设置TextSize 值很大的时候，会报如下错误`Font size too large to fit in cache`。 修改方法如下：

```java
TextView bigText = (TextView) findViewById(R.id.bigtext);
bigText.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
```