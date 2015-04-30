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