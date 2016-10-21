---
layout: post
styles: [syntax]
title: Ubuntu 安装 Tensorflow
category: 编程语言
tags: Python
---

首先贴一下官方**GET STARTED**地址： [传送门](https://www.tensorflow.org/versions/r0.11/get_started/os_setup.html#pip-installation)

安装步骤：

+ 安装python

```shell
sudo apt-get install python-pip python-dev
```

+ 按电脑配置环境变量

```shell
// Ubuntu/Linux 64-bit, CPU only, Python 2.7
export TF_BINARY_URL=https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.11.0rc0-cp27-none-linux_x86_64.whl
```
因为我使用的是虚拟机，所以就下了这个。

+ 安装Tensorflow

```shell
sudo pip install --upgrade $TF_BINARY_URL
```

我安装的时候一直提示**网络错误**。

我的解决方案：

1. 翻墙下载[tensorflow的安装文件](https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.11.0rc0-cp27-none-linux_x86_64.whl)
2. 配置pip国内镜像, 我使用的是[清华大学的源](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/), 按照文档自行配置

安装使用如下命令：

```shell
// 后面的whl地址，直接指向本地地址
sudo pip install --upgrade tensorflow-0.11.0rc0-cp27-none-linux_x86_64.whl
```

