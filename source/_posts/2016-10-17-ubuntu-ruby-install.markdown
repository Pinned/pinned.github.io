---
layout: post
styles: [syntax]
title: Ubuntu中安装Ruby的一些注意事项
category: 编程语言
tags: Ruby Ubuntu
---

## 使用RVM安装Ruby

安装RVM

```shell
curl -L get.rvm.io | bash -s stable
//若提示找不到公钥，执行下边语句
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
//然后，重新执行，安装完rvm之后，需配置终端，以便下次打开终端能直接只用rvm。更改终端配置方法：参见https://rvm.io/integration/gnome-terminal
curl -L get.rvm.io | bash -s stable
//至此，rvm安装完成，下边我们手动为终端配置rvm环境，否则以后在终端中可能每次都要手动加载rvm环境
//更改终端配置方法：工具栏--编辑--配置文件首选项--标题和命令--命令--选中“以登录shell方式运行命令”
//然后，我们手动加载rvm环境，将服务器资源改为淘宝的
///////$ source ~/.rvm/scripts/rvm 官方的加载rvm环境命令，我们就不执行了
//临时加载rvm环境，参考：https://rvm.io/integration/gnome-terminal
source ~/.bashrc
source ~/.bash_profile
```

使用RVM安装Ruby:

```shell
rvm install 2.2.1
```

## 设置GEM Sources

以前使用淘宝的Gem sources, 但是现在以经停止维护了。现在可以使用: [http://gems.ruby-china.org/](http://gems.ruby-china.org/)

使用见官网。

