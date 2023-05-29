---
title: java反射内部类
type: snippet
---

1. 在java中反射加载类的方法如下

```java
Class rClass = Class.forName("android.R");
```

2. 加载android.R.attr

```java
Class attrClass = Class.forName("android.R$attr");
```

> 内部类并不是像调用那样，使用`.`, 而是使用`$`