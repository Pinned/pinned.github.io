---
title: TextView之代码设置`DrawableLeft`
type: snippet
---

```java
Drawable drawable = getResources().getDrawable(R.drawable.drawable);  
/// 这一步必须要做,否则不会显示.  
drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());  
myTextview.setCompoundDrawables(drawable,null,null,null);
```