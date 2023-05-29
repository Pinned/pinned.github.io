---
title: Android 截取EditText输入的Emoji表情
type: snippet
---

```java
public String subInputText(String inputText,int index) {
	int unicode = Character.codePointAt(text, index);
    int skip = Character.charCount(unicode);
    mInputSquares[textCount++].setText(text.substring(index, index+skip));
}
```