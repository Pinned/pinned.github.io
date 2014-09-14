---
layout: post
styles: [syntax]
title: 安装Ubuntu单系统
category: ubuntu
---

## 安装Ubuntu单系统

### 背景介绍

本人是一个程序员，但是由于各种原因，使用的是Windows操作系统。一次偶然的机会，使用了Linux Ubuntu系统，才发现，还是一个很不错的东东。从那个时候开始就开始使用Ubuntu系统。但是鉴于Ubuntu不怎么会用，所以安装的是Windows和Linux的双系统。上班的时候，在公司拿了一张Ubuntu 13.04的系统安装光盘，虽然不怎么会使用Linux系统，但是一次尝试也是未尝不可的啊。于是开始安装起了我的系统。

### 安装过程

+ 安装过程非常的简单。很快就装上了Ubuntu 13.04的系统。安装上和系统，第一件事是什么？那还用说，当然是装输入法咯。可是，问题来了。也不知道是怎么回事，输入法死活就安不上，什么修改软件源什么的。反正搞了一大堆，就是装不上。百度上也没得好多关于13.04的信息，于是呼，我就把系统升级了。

+ 经过了一个很漫长的过程，终于，将系统升级到13.10。输入法很快的就装好了。什么软件环境也快装好了。重启了一下系统，一个重大bug来了。花屏。我擦，你没看错，就是花屏。一看到这个样子，我就知道，肯定是显卡驱动的问题，于是装了一下显卡驱动。我去，彻底的bug了。开机都开不起了。唉，没办法，拿出手机各种百度。找了办天，还是没有找到解决办法。最后，索性把系统在一次重装了。

+ 系统重装到了13.04,我什么事情都没干，直接一个劲的把系统升级到14.04了。又出现了一个大大的问题。非常的严重。还好找到了解决办法。
 + 问题： 升级到了14.04后，开机卡屏，连鼠标都不能动，这怎么能行呢。然后我重启进了recovy模式，有一个选项好像是`图形安全模式`，进去看了一下，报了个`显卡驱动`的错误。查找百度，最后还是找到了解决方案。
 + 添加swap: 
 > + ` sudo dd if=/dev/zero of=/swap bs=1024 count=8`(从/分区中分出8×1024M大小的空间，挂在/swap分区中)
 > + ` mkswap /swap` (格式化成/swap格式)
 > + ` swapon /swap` (激活/swap，加入到swap分区中)
 > 
 > 执行以上步骤只会在这一次生效配置，如果要永久生效还须进行修改
 > + ` sudo vim /etc/fstab`(添加swap分区到开机启动中)
 >  --> `/swap swap swap defaults  0 0 ` (添加到文件中的语句)
 + 安装显卡驱动和配置
 > 开机启动，在输入密码的界面停住，按`ctrl + alt + F2`进入控制台中：
 > 1. 重新安装fgirx
 > `sudo apt-get install fglrx`
 > `sudo reboot`
 > 或者 `sudo apt-get install --reinstall ubuntu-desktop` 
 > 重启过后，无效。继续后面的方法
 > 2. 桌面文件授权
 > ` sudo chown lightdm:lightdm -R /var/lib/lightdm`
 > ` sudo chown avahi-autoipd:avahi-autoipd -R /var/lib/avahi-autoipd`
 > ` sudo chown colord:colord -R /var/lib/colord`
 > 使用无效
 > 3. 重装显示驱动
 > 对于新的Nvidia二进制驱动：
 > `sudo add-apt-repository ppa:ubuntu-x-swat/x-updates`
 > `sudo apt-get update `
 > `sudo apt-get install nvidia-current nvidia-settings`
 > 重启，系统成功运行，无卡顿现象

### 记录
+ 对于新的ATI/AMD二进制驱动：
 > `sudo add-apt-repository ppa:ubuntu-x-swat/x-updates`
 > `sudo apt-get update `
 > `sudo apt-get install fglrx`

+ 如果机器上之前有一个老版本，请按如下来做
 > Nvidia 和 ATI/AMD 显卡的命令都一样：
 > `sudo add-apt-repository ppa:ubuntu-x-swat/x-updates`
 > `sudo apt-get update `
 > `sudo apt-get upgrade`
