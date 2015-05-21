---
layout: post
styles: [syntax]
title: Android EditText软键盘显示隐藏以及“监听”
category: 安卓
tags: Android
---

+ 起因

本人在做类似于微信、易信等这样的输入框时，遇到了一个问题。聊天界面最下面一般有输入文字的EditText和表情按钮等。

 1. 点击表情会在这下面显示表情选择，如图2，如果之前点击输入框弹出了软键盘，那么还需要隐藏软键盘；

 2. 点击输入框，弹出软键盘，如果之前显示了表情选择，则还需要隐藏表情选择。

+ 解决办法

 1. 隐藏输入法

  ```java
   private boolean showKeyboard() {
      InputMethodManager imm = (InputMethodManager)mInputText.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
      boolean result = imm.showSoftInput(mInputText, 0);
      return result;
   }
  ```

  2. 点击输入框，隐藏表情选择框，使用`OnTouchEvent`

  ```
    mInputText.setOnTouchListener(new View.OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (motionEvent.getAction() == MotionEvent.ACTION_UP) {
                boolean result = showKeyboard();
                if (result) {
                    // TODO 隐藏表情选择框
                }
            }
            return false;
        }
    });
  ```
