---
layout: post
styles: [syntax]
title: Ubuntu 14.04 安装Atom编辑器
category: tools_using
---

## Ubuntu下安装Atom编辑器

重装了Ubuntu系统，没得什么好的文本编辑器。又不喜欢使用默认的编辑器。
所以装了一个Atom。用了一下，还可以。

1. Clone the Atom repository:
  ```shell
  git clone https://github.com/atom/atom
  cd atom
  ```
2. Build Atom
  ```shell
  script/build
  ```
  This will create the atom application at $TMPDIR/atom-build/Atom.

3. Install the atom and apm commands to /usr/local/bin by executing:
  ```shell
  sudo script/grunt install
  ```
4. Optionally, you may generate a .deb package at $TMPDIR/atom-build:
  ```shell
  script/grunt mkdeb
  ```

安装过程有一点小波折，但最终还是搞定了。

遇到了一个错误，信息如下：

`/usr/bin/env: node: No such file or directory`

***
**官方的方案**
***
> If you get this notice when attempting to script/build, you either do not have Node.js installed, or node isn't identified as Node.js on your machine. If it's the latter, entering sudo ln -s /usr/bin/nodejs /usr/bin/node into your terminal may fix the issue.

但是我还是没有解决，并且安装了Nodejs。后面才发现，原来是我安装的
Nodejs的位置的问题。

解决办法：
```shell
ln -s /usr/local/node/bin/node /usr/bin/node
```
