---
title: Andorid打开或关闭软键盘
type: snippet
---

```java

// 打开软键盘
InputMethodManager inputMethodManager =
        (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
inputMethodManager.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);

// 关闭软键盘
InputMethodManager imm =
        (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
imm.hideSoftInputFromWindow(mTextView.getWindowToken(), 0);
```