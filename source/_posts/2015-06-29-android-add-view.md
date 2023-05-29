---
layout: post
styles: [syntax]
title: Android加载子View
category: 安卓
tags: Android
---

Android的一个View界面都是通过ViewGroup 加上很多子View来实现的，即`viewGroup.addView(view)`。

让我一起来看看源码是如何执行的。

**addView(view)**

```java
public void addView(View child) {
    addView(child, -1);
}
public void addView(View child, int index) {
    if (child == null) {
        throw new IllegalArgumentException("Cannot add a null child view to a ViewGroup");
    }
    LayoutParams params = child.getLayoutParams();
    if (params == null) {
        params = generateDefaultLayoutParams();
        if (params == null) {
            throw new IllegalArgumentException("generateDefaultLayoutParams() cannot return null");
        }
    }
    addView(child, index, params);
}
```

从上面的代码可以看出，如果我们直接执行的`addView`将会设置默认`index`为 -1。然后读取子View的`LayoutParams`。如果子View没有设置相应的LayoutParams,则生成一个默认的LayoutParams来使用

接着往下面看：

```java
public void addView(View child, int index, LayoutParams params) {
    if (DBG) {
        System.out.println(this + " addView");
    }

    if (child == null) {
        throw new IllegalArgumentException("Cannot add a null child view to a ViewGroup");
    }

    // addViewInner() will call child.requestLayout() when setting the new LayoutParams
    // therefore, we call requestLayout() on ourselves before, so that the child's request
    // will be blocked at our level
    requestLayout();
    invalidate(true);
    addViewInner(child, index, params, false);
}
private void addViewInner(View child, int index, LayoutParams params,
        boolean preventRequestLayout) {

    if (mTransition != null) {
        // Don't prevent other add transitions from completing, but cancel remove
        // transitions to let them complete the process before we add to the container
        mTransition.cancel(LayoutTransition.DISAPPEARING);
    }

    if (child.getParent() != null) {
        throw new IllegalStateException("The specified child already has a parent. " +
                "You must call removeView() on the child's parent first.");
    }

    if (mTransition != null) {
        mTransition.addChild(this, child);
    }

    if (!checkLayoutParams(params)) {
        params = generateLayoutParams(params);
    }

    if (preventRequestLayout) {
        child.mLayoutParams = params;
    } else {
        child.setLayoutParams(params);
    }

    if (index < 0) {
        index = mChildrenCount;
    }

    addInArray(child, index);

    // tell our children
    if (preventRequestLayout) {
        child.assignParent(this);
    } else {
        child.mParent = this;
    }

    if (child.hasFocus()) {
        requestChildFocus(child, child.findFocus());
    }

    AttachInfo ai = mAttachInfo;
    if (ai != null && (mGroupFlags & FLAG_PREVENT_DISPATCH_ATTACHED_TO_WINDOW) == 0) {
        boolean lastKeepOn = ai.mKeepScreenOn;
        ai.mKeepScreenOn = false;
        child.dispatchAttachedToWindow(mAttachInfo, (mViewFlags&VISIBILITY_MASK));
        if (ai.mKeepScreenOn) {
            needGlobalAttributesUpdate(true);
        }
        ai.mKeepScreenOn = lastKeepOn;
    }

    if (child.isLayoutDirectionInherited()) {
        child.resetRtlProperties();
    }

    onViewAdded(child);

    if ((child.mViewFlags & DUPLICATE_PARENT_STATE) == DUPLICATE_PARENT_STATE) {
        mGroupFlags |= FLAG_NOTIFY_CHILDREN_ON_DRAWABLE_STATE_CHANGE;
    }

    if (child.hasTransientState()) {
        childHasTransientStateChanged(child, true);
    }

    if (child.getVisibility() != View.GONE) {
        notifySubtreeAccessibilityStateChangedIfNeeded();
    }
}
``` 
就是如此的Easy，就把View添加到视图中去了。
