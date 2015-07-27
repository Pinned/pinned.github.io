---
layout: post
styles: [syntax]
title: Git 合并两个
category: 工具
tags: Git
---

### 问题：
 
 公司开始使用的是SVN进行项目管理的，现在有一个项目，有两个Project，其中一个是Application， 另一个是Library。现在要把SVN上面的项目迁移到Git服务器上去。但是Git服务器上面只有一个Proj，也就是说，现在需要将两个项目和在一起。想想，本来也应该把两个项目合在一起，不然，版本管理必然也会是一个大的问题。

### 解决方式 

 + 如果不需要保存SVN上的提交日志，那直接复制提交就行了。

 + 要保存提交日志

   首先要将SVN的项目迁移到GIT服务器上。我在本地搭了一个Git服务器。

   使用 `git clone svn svn://location/project1`
   
   将两个项目都迁移到git服务器上去。

   然后先将要合并后的那个proj clone 到本地。

   使用`git subtree` 将原来的两个工程添加到新的工程中，然后提交到服务器就可以了。


### 参考文档 

  + [git subtree 的用法](http://cssor.com/git-subtree-usage.html)

  + [SVN 迁移到 GIT](http://blog.163.com/pjt_ren/blog/static/188250602013101102615844/)


