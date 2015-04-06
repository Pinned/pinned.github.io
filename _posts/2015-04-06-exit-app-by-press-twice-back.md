---
title: Android 按两次返回键退出应用程序
type: snippet
---

```java
public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_BACK) {
        if ((System.currentTimeMillis() - mExitTime) > 2000) {
            Object mHelperUtils;
            Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
            mExitTime = System.currentTimeMillis();

        } else {
            finish();
        }
        return true;
    }
    return super.onKeyDown(keyCode, event);
}
```