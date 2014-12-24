---
layout: post
styles: [syntax]
title: git checkout 的使用（一）
category: tools_using
---

在使用git的过程中，有很多好的点

其中，我们使用`git-flow`模型

我的小伙伴创建了一个`branch`
  > feature/branch_test
  
在这个地方，我想切换到`branch_test`分支

我使用如下命令：

```html
 git checkout remotes/origin/feature/branch_test
 
 git checkout origin/feature/branch_test
 
```

使用上面两句命令都不得行，都只创建了一个临时分支。输出如下：


```html

Note: checking out 'origin/feature/branch_test'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:

  git checkout -b new_branch_name

```

后面的解决办法是使用如下命令：


```html
git checkout reature/branch_test
```

不是什么高深的技术，只是记录一下。