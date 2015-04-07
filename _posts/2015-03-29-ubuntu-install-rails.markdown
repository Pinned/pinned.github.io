---
layout: post
styles: [syntax]
title: Ubuntu 下安装Rails
category: 工具
tags: Tools Ruby
---

> Rails 是使用 Ruby 语言编写的网页程序开发框架，目的是为开发者提供常用组件，简化网页程序的开发。
> 只需编写较少的代码，就能实现其他编程语言或框架难以企及的功能。

## 安装Ruby

在Ubuntu系统中，默认已经安装了Ruby， 但是其版本很低，要装`Ruby for rails`，就必须得装Ruby
升级到1.9.3及以上

安装Ruby, 使用[Brightbox 维护的 Ruby PPA](https://www.brightbox.com/docs/ruby/ubuntu/)

```bash
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.2 ruby2.2-dev
```

安装完毕过后，可以查看Ruby的版本和Gem的版本,如下：

```bash
~$ ruby -v
ruby 2.2.0p0 (2014-12-25 revision 49005) [x86_64-linux-gnu]
~$ gem -v
2.4.5
```
## 安装SQLite3

在这里，我使用的是`LinuxBrew`来进行安装的

> **LinuxBrew**: Linuxbrew is a fork of Homebrew, the Mac OS package manager, for Linux.
> 地址：https://github.com/Homebrew/linuxbrew

我直接将安装方法贴在这里来：

```html
1. 先安装依赖

sudo apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev

2. 下载LinuxBrew的源码

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/linuxbrew/go/install)"
OR
git clone https://github.com/Homebrew/linuxbrew.git ~/.linuxbrew

3. 配置环境变量

添加到你的.bashrc文件中
export PATH="$HOME/.linuxbrew/bin:$PATH"
export MANPATH="$HOME/.linuxbrew/share/man:$MANPATH"
export INFOPATH="$HOME/.linuxbrew/share/info:$INFOPATH"
```

LinuxBrew安装完成过后，你就可以直接安装`Sqlite3`

```bash
brew install sqlite3
```

## 安装Rails

首先，修改ruby的源到taobao的源上去

```bash
gem sources --remove http://rubygems.org/
gem sources -a http://ruby.taobao.org/
gem sources -l
# 请确保只有 ruby.taobao.org
```

然后安装Rails

```bash
# 添加verbose会在控制台显示安装
sudo gem install rails --verbose

# 查看rails版本
rails -v
```

## 参考资料

1. [Ubuntu 上安装 Ruby 最新版的最佳方法](http://chloerei.com/2014/07/13/the-best-way-to-install-the-latest-version-of-ruby-on-ubuntu/): http://chloerei.com/2014/07/13/the-best-way-to-install-the-latest-version-of-ruby-on-ubuntu/
