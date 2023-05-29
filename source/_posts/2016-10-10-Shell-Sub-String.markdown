---
layout: post
styles: [syntax]
title: Shell脚本8种字符串截取方法
category: 编程语言
tags: Shell
---

假设有变量： `var=http://blog.knero.cn/test.html`

## `#`号截取，删除左边字符，保留右边字符

**示例**
```shell
var=http://blog.knero.cn/test.html
sub=${var#*/}
echo $sub
```
**输出结果**
```shell
/blog.knero.cn/test.html
```
其中**var**是变量名，**#**号是运算符，***/** 表示从左边开始删除第一个**/**号及左边的所有字符
即删除**http:/**
结果是 ：/blog.knero.cn/test.html

**示例**
```shell
var=http://blog.knero.cn/test.html
sub=${var##*/}
echo $sub
```
**输出结果**
```shell
test.html
```
其中**var**是变量名，**##**号是运算符，***/** 表示从左边开始删除最后一个**/**号及左边的所有字符
即删除**http://blog.knero.cn/**
结果是 ：test.html

## `%`号截取，删除右边字符，保留左边字符

**示例**
```shell
var=http://blog.knero.cn/test.html
sub=${var%/*}
echo $sub
```
**输出结果**
```shell
http://blog.knero.cn
```
其中**var**是变量名，**%**号是运算符，**/*** 表示从右边开始删除第一个**/**号及右边的所有字符
即删除**test.html**
结果是 ：http://blog.knero.cn

**示例**
```shell
var=http://blog.knero.cn/test.html
sub=${var%%/*}
echo $sub
```
**输出结果**
```shell
http:
```
其中**var**是变量名，**%%**号是运算符，**/*** 表示从右边开始删除最后一个**/**号及右边的所有字符
即删除**//blog.knero.cn/test.html**
结果是 ：http:

## 从左边指定第几个字符开始截取

**示例**
```shell
var=http://blog.knero.cn/test.html
sub=${var:0:5}
echo $sub
sub=${var:7}
echo $sub
```

**输出结果**
```shell
http:
blog.knero.cn/test.html
```

`${var:0:5}`其中的**0**表示左边第一个字符开始, **5**表示字符的总个数。
结果是：**http:**

`${var:7}`指从左边index第几个字符开始到结束

## 从右边第几个字符开始截取

**示例**
```shell
var=http://blog.knero.cn/test.html
sub=${var:0-9:4}
echo $sub
sub=${var:0-9}
echo $sub
```

**输出结果**
```shell
test
test.html
```
`${var:0-9:4}`其中的**0-9**表示左边第9个字符开始, **4**表示截取字符个数，如果没有就是到结束


