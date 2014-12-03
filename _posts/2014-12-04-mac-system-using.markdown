---
layout: post
styles: [syntax]
title: Mac系统使用记录（一）
category: system
---

1. Mac用户

本人小屌丝一个，装了个黑苹果，用的是类似Ghost一样的版本，只接还原就可以用，
什么也没有改。

在使用的过程中，有一个问题，就是使用的是Root用户，权限太高，感觉相当的不爽。

本人又不怎么会用，百度了一下。找到了关掉Root用户的方法：

如下：

![step1](http://pinned.github.io/assets/posts/img-2014-12-04/mac_clear_root_3.png)

![step2](http://pinned.github.io/assets/posts/img-2014-12-04/mac_clear_root_1.png)

![step3](http://pinned.github.io/assets/posts/img-2014-12-04/mac_clear_root_2.png)

![step4](http://pinned.github.io/assets/posts/img-2014-12-04/mac_clear_root_4.png)

这样子设置到是没有什么问题，当我重启的时候，我发现问题来了。
因为本机只有一个ROOT账号，root账号被我禁用了。就没有可以登陆的账号
心中有千万只草泥马奔腾而过，不过也没有办法，出问题了总得解决才行。

2. 解决办法

我们首先要做的事，用单用户登陆。

因为我安装的是黑苹果，所以我启动的时候加上了`-v -s`参数

启动过后，他进入了最高权限的bash中,然后使用如下命令解决：

```xml
fsck -fy 
mount -uw /
rm /var/db/.AppleSetupDone
reboot
```

正常重启过后，他会让你重新创建一个用户，创建成功过后，便可以登陆了。


3. 其他

给文件修改权限（chmod）：

```xml
chmod 777 file/Folder
chmod -R 777 Folder
```

修改文件owner/group（chown）:

```xml
chown username file
chown -R username Folder
```

当然，上面的命令你需要在root用户的权限下才可以用。