---
layout: post
styles: [syntax]
title: 在windos下面使用多个ssh_key
category: 工具
tags: SSH
---

### SSH Key

在使用git的时候会用到ssh key，但是，如果你想在你的电脑中使用多个SSH Key来分别进入公司的git 服务器和github服务器。

### 下面是转载：

> - 新增ssh的配置文件，并修改权限

>  - `touch ~/.ssh/config `
>  - `chmod 600 ~/.ssh/config  `

> - 修改config文件的内容

>  - `Host github.com`
>  - `IdentityFile ~/.ssh/id_rsa.github`
>  - `User git`

### Windwos 下配置

 当然，上面使用的是Linux系统或者就Mac OS，作为一个专业的程序员屌丝，我是买不起Mac的。在windos下面日配置其实是一样的，只是要修改文件路径而已.

 很简单，就是将上面的文件路径该一下位置：
 > 1. ssh 的路径是: `C:\Users\`**`Your user Name`**`\.ssh`

 > 2. 在上面的路径文件夹下创建`config`文件

 > 3. windows下面不用授权，所以直接修改内容如下：

>> `Host github.com`

>> `IdentityFile C:\Users\`**`Your user Name`**`\.ssh\id_rsa.github`

>> `User git`

### 测试

上面配置完成，便可以测试一下是否配置成功：

    `ssh -T git@github.com`

如果你连接成功，则可以看到:
    Hi Pinned! You've successfully authenticated, but GitHub does not provide shell access.


### 写在最后

生成`ssh key`

```bash
ssh-keygen -t rsa -C “lovecluo@gmail.com”
```

### 参考资料

1. [git 使用(ssh key创建和github使用)](http://blog.csdn.net/xuhaiyan8825/article/details/7707285)
