---
title: Android TextView 设置字体大小
type: snippet
---

```java
/**
 * Set the default text size to the given value, interpreted as "scaled
 * pixel" units.  This size is adjusted based on the current density and
 * user font size preference.
 *
 * @param size The scaled pixel size.
 *
 * @attr ref android.R.styleable#TextView_textSize
 */
@android.view.RemotableViewMethod
public void setTextSize(float size) {
    setTextSize(TypedValue.COMPLEX_UNIT_SP, size);
}

/**
 * Set the default text size to a given unit and value.  See {@link
 * TypedValue} for the possible dimension units.
 *
 * @param unit The desired dimension unit.
 * @param size The desired size in the given units.
 *
 * @attr ref android.R.styleable#TextView_textSize
 */
public void setTextSize(int unit, float size) {
    Context c = getContext();
    Resources r;

    if (c == null)
        r = Resources.getSystem();
    else
        r = c.getResources();

    setRawTextSize(TypedValue.applyDimension(
            unit, size, r.getDisplayMetrics()));
}

private void setRawTextSize(float size) {
    if (size != mTextPaint.getTextSize()) {
        mTextPaint.setTextSize(size);

        if (mLayout != null) {
            nullLayouts();
            requestLayout();
            invalidate();
        }
    }
}
```


以上代码是`Android TextView`设置字体的源码。可以看出来，使用`setTextSize(float size)`的时候，默认单位为`sp`

如果你自己从`xml`中读的时候，最好使用`setTextSize(int unit, float size)`这个方法。