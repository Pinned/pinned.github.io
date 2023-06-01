---
title: iTerm2 常用配置
styles: [syntax]
category: 工具
tags: Terminal
---

工欲善其事，必先利其器。当我们拿到一台新电脑，为了让自己的效率更高，当然需要做一些配置。本文将介绍对于终端的一些配置。


## 1. 安装 iTerm2

Mac OS 有自己自带的终端软件 Terminal ，但其功能相对较弱。在 Mac 上，有一个三方终端 iTerm2 可以使用。当拿到新电脑时，当然是第一时间装上这个软件。

iTerm2 下载地址：[https://www.iterm2.com/](https://www.iterm2.com/)

对于 iTerm2 来说，我有一个非常常用的功能就是分屏，快捷键为 `command + D`



## 2. 安装 HomeBrew

HomeBrew 是 Mac OS 上一个非常常用的软件包管理工具。它包含安装、卸载、更新、查看、搜索等很多实用的功能。使用简单的 `install`指令，就可以实现软件包安装，软件包的各种依赖和文件路径都会帮你处理好，十分方便快捷。因此，这也是“利其器”首选工具。

HomeBrew 官方网站：[https://brew.sh](https://brew.sh) , [https://github.com/Homebrew/brew](https://github.com/Homebrew/brew)

安装可以使用如下命令：

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

等待下载安装完成即可。

但是，在国内，你懂的，基本下载不下来，此处使用科大源安装，详细教程可直接参考原文：

[使用科大源安装 Homebrew / Linuxbrew: https://mirrors.ustc.edu.cn/help/brew.git.html#homebrew-linuxbrew](https://mirrors.ustc.edu.cn/help/brew.git.html#homebrew-linuxbrew)

此处仅记录关键步骤：

### 2.1 配置环境变量

首先在命令行运行如下几条命令设置环境变量，这些环境变量是 `brew` 的安装脚本里面使用，用它们替换原 github.com 上的仓库地址：

```shell
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
```

### 2.2 使用  jsDelivr CDN 中的 `install.sh` 进行安装

 直接使用下面脚本进行安装：

```shell 
/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/Homebrew/install@HEAD/install.sh)"
```

等待脚本执行完成即可。



## 3. 安装 zsh

在 Mac OS 中，默认使用的是 `/bin/bash` 作为默认终端工具。而在这里，我喜欢使用 `zsh` 来替换，它支持更多的扩展。安装命令如下： 

```shell
brew install zsh	
```

安装好了 zsh， 下面接着安装 `oh-my-zsh`，让你的终端更好看。安装命令：

```shell
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

但是，在国内，你懂的，基本下载不下来。而 `oh-my-zsh`是使用 git 来管理，并且是直接下载代码使用的。所以可以使用 `gitcode.net` 中的镜像库进行下载，配置方式：

```
git config --global url."https://gitcode.net/mirrors/".insteadOf https://github.com
```

> 上面命令最终会在 ~/.gitconfig 中添加对应配置，使用完成后手动删除即可。



## 4. 安装 oh-my-zsh plugin 

在我使用的 oh-my-zsh 中，我有几个常用的 plugin ， 需要安装一下：

### 4.1 zsh-autosuggestions

a. 将 zsh-autosuggestions 的代码下载到 on-my-zsh 的 plugins 文件夹中

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

b. 在 `~/.zshrc` 中添加到 `plugins` 列表中

```
plugins=( 
    # other plugins...
    zsh-autosuggestions
)
```



### 4.2 zsh-syntax-highlighting

a. 将 zsh-syntax-highlighting 的代码下载到 on-my-zsh 的 plugins 文件夹中

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

b. 在 `~/.zshrc` 中添加到 `plugins` 列表中

```
plugins=( 
    # other plugins...
    zsh-syntax-highlighting
)
```



## 5. 更改 ZSH_THEME

在使用终端的时候，我喜欢能够一眼直接看到当前的路径。而 `oh-my-zsh` 默认使用的是 `robbyrussell`。经过测试，我想要的主题是 `apple`，只需要在 `.zshrc` 中配置对应主题为 apple 就可以，示例如下：

![主题修改示例](https://img-blog.csdnimg.cn/cdf5701da677489d8effbe2a15b8b9fb.png)



## 6. 配置自己的 `profile` 文件

环境变量是一个经常修改的东西，我们当然可以直接修改 `.profile` 或者直接修改 `.zshrc` 文件，但是，这些配置文件里面都会存在一些原有的配置。 我的习惯是创建一个我自己的 profile 文件来配置我自己的环境变量。

因为前面使用的是 zsh， 因此默认使用的环境变量在 `.zshrc` 中，在`.zshrc`文件中添加我自己文件的引用，代码如下： 

```shell
# 添加自己的环境变量文件
if [ -f "$HOME/.lzcrc" ]; then
   source $HOME/.lzcrc
fi
```

添加完成并保存文件，并使用 source 命令使配置生效：

```shell
source ~/.zshrc
```



## 7. 配置自己的命令

在日常工作中，会有一些常用的工具命令使用，比如我常用的 `base64`。

在系统中，可以使用 `openssl` 进行 base64 的编码，实现命令如下：

```shell
//.将 LZC 编码成 base64
echo -n 'LZC' | openssl base64 ; echo
```

使用起来还是很方便的，但是还是有点复杂，因此，我在 `~/.lzcrc` 添加 `base64_encode` 函数，将这个长长的命令封装起来，如下所示：

```shell
# base64 tools

base64_decode () {
	echo "$1" | base64 -D ; echo
}

base64_encode () {
	echo -n "$1" | openssl base64 ; echo
}
```

使用如下：

![base64 编码示例](https://img-blog.csdnimg.cn/7000c6905d684d48baf6de60afb5a97e.png)



## 8. 写在最后

一个好的环境，能够帮助我们提高工作中的效率，也能让自己的电脑使用起来更加的舒心。当然在使用电脑的过程中，也需要不断优化自己的环境，让电脑更加方便使用。

