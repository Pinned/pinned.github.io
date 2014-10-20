---
layout: post
styles: [syntax]
title: 使用Jekyll在Github上搭建博客
---

Jekyll是一个使用Ruby编写的静态站点生成工具，使用Liquid模板渲染引擎，支持Markdown和Textile标记语言，并且可以为所有以 .html、.markdown、.textile扩展名结尾的文件使用YAML配置，内置语法高亮功能。而Github的Pages服务可以为每个Github主机上的仓库提供静态页面服务，并且Pages服务支持Jekyll。因为Github Pages有两种Pages，分别是用户页面和项目页面，所以我们可以使用用户页面来创建自己的Blog。

在开始前，请确保你已经有了Github账号一枚和Git的正确配置。没有的朋友可以先移步[Github注册](https://github.com/plans)并[安装配置Git](http://help.github.com/win-set-up-git/)。


首先，创建你的 Blog 仓库 username(请确保跟你的账号名相同).github.com:

```xml
$ mkdir username.github.com
$ cd username.github.com
```
