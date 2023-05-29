---
title: 在`values`中定义id
type: snippet
---

在`values`文件夹中创建`ids.xml`文件， 文件目录为：`values/ids.xml`

我们有时候，会在代码中定义一个组件，如`TextView`,但是我们想给他设置一个Id，又不知道该设置一个
什么值比较好，就可以用上术方法来定义一个`id`, 具体代码如下:

```xml
<?xml version="1.0" encoding="utf-8"?>
<values>
<item name="custom_item_id" type="id"></item>
</values>
```