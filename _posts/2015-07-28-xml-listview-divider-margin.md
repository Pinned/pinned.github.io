---
title: XML 实现 ListView divider margin
type: snippet
---
<?xml version="1.0" encoding="UTF-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:insetLeft="50dp"
    android:insetRight="50dp" >
    <shape>
        <solid android:color="@color/orange" />
        <corners android:radius="2.0dip" />
    </shape>
</inset>
```

参考：
  
  [How to assign padding to Listview item divider line](http://stackoverflow.com/questions/14054364/how-to-assign-padding-to-listview-item-divider-line?answertab=active#tab-top)