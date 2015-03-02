---
layout: post
styles: [syntax]
title: Android Studio 使用 -- 最佳实践
category: 工具
tags: Tools
---

## 修改为Darcula主题

File --> Settings --> Appearance ; 找到Theme， 选择`Darcula`， 重启Android Studio即可


## 快速注释

File --> Setting --> Keymap ；然后搜索`Fix doc comment`， 添加快捷键`Alt + Shift + D`


## 局域变量前缀加m

在使用Android编写代码的时候，会有一个习惯，就是在定义的变量前面加上前缀上加`m`，使用`Alt + Insert`的时候，生成的构造方法和get，set方法会在参数和方法名上加上`m`， 很是不爽。解决办法：

File --> Setting --> Code Style --> Java --> Code Generation ; 然后在 `Field` 那一行的`Name Prefix`上写上`m`。就这么简单


