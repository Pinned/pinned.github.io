---
title: Android显示密码
type: snippet
---

```java

//  方法1：
if (mIsShowPsw) {
	mPswEdit.setTransformationMethod(HideReturnsTransformationMethod
			.getInstance());
} else {
	mPswEdit.setTransformationMethod(PasswordTransformationMethod
			.getInstance());
}

// 方法2：
int inputType  = mPswEdit.getInputType();
if (inputType == 129) {
    mPswEdit.setInputType(1);
} else {
    mPswEdit.setInputType(129);
}
```