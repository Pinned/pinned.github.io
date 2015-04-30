---
layout: post
styles: [syntax]
title: Mac Iterm2 zsh使用
category: 工具
tags: Android
---

## 安装zsh

```bash
brew install zsh
```

## 下载`oh my zsh`项目

```bash
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
```

## 设置zsh

```bash
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
chsh -s /bin/zsh
```
## VIM 的一些配置

```bash
syntax on                "语法高亮
set nu!                  "显示行号
set ai!                  "设置自动缩进
set ruler                "在编辑过程中，在右下角显示光标位置的状态行
set incsearch            "自动匹配单词的位置
set hlsearch             "高亮查找到的所有单词
```