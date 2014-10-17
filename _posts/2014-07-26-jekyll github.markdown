---
layout: post
styles: [syntax]
title: 使用Jekyll在Github上搭建博客
---

使用vb虚拟机复制新虚拟机 ，新ubuntu虚拟机中的网卡MAC变更，导致找不到eth0，提示：Cannot find device "eth0"

> 解决方法 编辑 /etc/udev/rules.d/70-persistent-net.rules 文件将旧MAC对应条目删除（全部删除），重启系统即可

Jekyll是一个使用Ruby编写的静态站点生成工具，使用Liquid模板渲染引擎，支持Markdown和Textile标记语言，并且可以为所有以 .html、.markdown、.textile扩展名结尾的文件使用YAML配置，内置语法高亮功能。而Github的Pages服务可以为每个Github主机上的仓库提供静态页面服务，并且Pages服务支持Jekyll。因为Github Pages有两种Pages，分别是用户页面和项目页面，所以我们可以使用用户页面来创建自己的Blog。

在开始前，请确保你已经有了Github账号一枚和Git的正确配置。没有的朋友可以先移步[Github注册](https://github.com/plans)并[安装配置Git](http://help.github.com/win-set-up-git/)。

首先，创建你的 Blog 仓库 username(请确保跟你的账号名相同).github.com:

```shell
$ mkdir username.github.com
$ cd username.github.com
```

新建一个 index.html 文件，像下面这样:

```html
<!doctype html>
<html>
<head>
<title>Hello</title>
</head>

<body>
<h1>Hello!</h1>
</body>
</html>
```

初始化仓库、提交并push到Github:

```shell
$ git init
$ git add .
$ git commit -a -m 'init commit.'
$ git remote add origin
$ git push origin master
```

现在你打开 username.github.com 就可以看到刚才新建的页面了，就是这么简单。当然也可以为你的Blog仓库绑定独立域名，具体做法就是：

1. 在你的仓库中新建内容为 www.youdomain.com 的 CNAME 文件；
2. 在你的域名管理页或者是DNS解析的地方，增加一个记录，记录类别为CNAME(Alias)类型.

> Note：如果你在CNAME中填写的是顶级域名，就得设置DNS的记录类别为A(Host)型，并设置主机为207.97.227.245。详细介绍请移步Github的[Pages](http://pages.github.com)页面。</p>

接下来我们只需要按照自己的喜好设计页面。首先认识下Jekyll的文件及目录配置:

```shell
  |-- _includes
  |-- _plugins
  |-- _layout
  |   |-- default.html
  |   `-- post.html
  |-- _post
  |   |-- yyyy-mm-dd-title.markdown
  |   `-- yyyy-mm-dd-title.markdown
  |-- _site
  |-- _config.yml
  |-- index.html
```

## _includes
存放你需要在模板文件中包含的文件，你可以使用Liquid标签 <code>\{&permil; include file.ext &permil;\}</code> 来引用相应的文件。

## _plugins
可以增加你自己的插件

## _layout
存放布局模板，请参考<https://github.com/taberhuang/taberhuang.github.com/tree/master/_layouts>

## _post
存放文章列表，文件命名一定要遵循 yyyy-mm-dd-title.html|markdown|textile 规则，请参考<https://github.com/taberhuang/taberhuang.github.com/tree/master/_posts>

## _site
Jekyll自动生成的，所以可以忽略，如果你有在本地安装Jekyll并预览了的话，可以使用.gitignore设置Git停止对本目录的跟踪。

## _config.yml
设置经常使用的配置选项，这样在本地启动预览时就不用每次都手动输入了。

## index.html 和所有的 HTML/Markdown/Textile 文件
所有的HTML/Markdown/Textile文件都可以包含 YAML 配置，这类文件都会被Jekyll解析。

现在你可以在自己的仓库中配置好你自己的目录及文件，也可以clone我的仓库，然后修改。
