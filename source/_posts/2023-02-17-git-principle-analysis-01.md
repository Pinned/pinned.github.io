---
title: Git 必知必会：原理剖析（一）
category: 工具
tags: Git
---

作为程序员，最常用的版本管理工具便是 Git。但我相信大多数人和我一样，从没有认真了解过其具体实现的原理。但了解 Git 的原理，能有助于我们工作更好的使用 Git。下面，让我们一起来了解 Git 中的一些概念，以及实现。

## 一、概念

Git 是一个分布式版本控制软件，在使用的过程中，与 CVS 类不同，不需要使用服务端，就可以实现版本控制。但在我们常用的使用过程中，依然会一个中间服务器作为 `original` 来实现代码的`托管`、`控制` 等，整个流程如下图所示：

![Git 中代码的流转过程](https://img-blog.csdnimg.cn/9c6738b207a34906bc451d2791b59aaf.png)

从图中可以看到，虽然有一个**远程仓库** ，但它仅仅是提供托管以及作为权威库存在，所有程序员仓库节点都可以不依赖这个远程仓库独立存在并使用。

在进行开发工作的时候，我们对代码的源文件进行修改，然后通过 `commit` 命令提交到本地仓库，在通过 `push` 命令将代码同步到远程仓库中。那图中的 `Git 本地仓库` 以及 `工作区` 指的分别是哪些东西呢？

相信熟悉 Git 的同学都知道，我们克隆到本地的项目中，都会有一个 `.git` 的隐藏文件夹，这个文件夹中的内容就是 `Git 本地仓库`， 而工作区就是我们看到的其它原代码。所以，对一个 `Git 仓库`  来说，最重要的便是 `.git` 文件夹里面的内容了。

## 二、Git 的工作原理

刚提到，在本地工程中，`.git` 文件夹为 Git 本地仓库，库目录结构如下：

![.git 文件目录](https://img-blog.csdnimg.cn/5519132d41224307812ce30bb61d1a93.png)

+ **hooks：** 存储钩子的文件夹，可以注入到 git 生命周期的所有流程
+ **objects：** 存放 git 对象，代码文件、目录等都会转换成对象存储到这个目录下中
+ **refs：** 存储分支以及TAG的指针文件。
+ **HEAD：** 当前工作区执行的代码分支的指针，一般指向 **refs** 下的某个文件。
+ **config：** 存储当前项目的一些配置，如 `remote url`、`用户信息`

在这些目录和文件中，其中最重要的为 `objects` 文件夹。在 Git 的设计中，所有的核心对象都会往里装。这些对象又分为：

+ **blob：** 而进制大对象，使用 **zlib**（一种无损压缩算法） 压缩算法对文件内容进行压缩后的结果。
+ **tree：** 对应于文件目录，用于存储文件名列表以及文件类型。
+ **commit：** 对应一个 `commit` ， 存储信息中包含 **顶层源目录的 tree hash值** 、**时间戳**、**commit 日志信息**、**0个或多个父commit hash值**

我在本地建了一个项目，添加了几个文件，以及两次提交。在 objects 目录下，存储的文件类容如下：

![objects 目录示例](https://img-blog.csdnimg.cn/106777ee76b54d3eb677e99bb78f53a0.png)

初看这个会一脸懵，其实很简单，以 `objects/78/ace89700a69e490c86f54fbe9d12f0cfb2dbdb` 这个文件为例，其中 `78ace89700a69e490c86f54fbe9d12f0cfb2dbdb` 这一串为这个文件的 Hash 值，计算时使用的是 SHA-1 的算法，其计算结果为 20 个字节组成，通常表示成 40 个 16 进制的形式的字符。对比 Hash 与文件结构可以看出，Git 使用的 Hash 前两个字符作为文件夹名称，后 38 个字符作为文件名，即表示为 `hash[0,2]/hash[2:]`  格式。在 git 中，也有相应的工具查看 Hash 文件存储的数据类型以及数据内容，可以使用如下命令进行查看：

```shell
# 查看文件类弄
git cat-file -t 78ace89700a69e490c86f54fbe9d12f0cfb2dbdb
# 查看文件内容
git cat-file -p 78ace89700a69e490c86f54fbe9d12f0cfb2dbdb
```

下面在来看一下各 Hash 值的计算：

### 计算 blob 的 Hash 

在 Git 中， Blob 的文件中，存储的内容格式如下：

```shell
blob <content length><NUL><content>
```

其中 **content length** 指的是源文件内容的长度，**NUL** 为 `\0` ，而 **content** 为源文件的内容。举个例子， 我在一个空仓库中，添加了一个文件 `Main.java` ，其内容如下：

```java
public class Main {
    public static void main(String [] args) {
        System.out.println("This is Main.java");
    }
}
```

因此，存储到 **objcets** 中的文件内容为：

```text
blob 122\0public class Main {
    public static void main(String [] args) {
        System.out.println("This is Main.java");
    }
}
```

为了更好的验证这个逻辑，我写了一段 `Java` 记算此 `Hash` 的测试代码，代码如下：

```java
public static HashData getBlobHash(File file) throws Exception {
    String content = new String(FileUtil.read(file));
    String header = "blob " + content.length() + "\0";
    return getHash(header + content);
}
```

运行出来的结果正好为 `78ace89700a69e490c86f54fbe9d12f0cfb2dbdb` ， 与 Git 中记算的结果一致。

### 计算 tree 的 hash

在存储 `Main.java` 文件类容中，并没有将文件名存储进去，那 Git 是在哪儿存储的呢？ 对，就是现在要讲的 **tree** 的结构。 先来看一下，我写的示例中的文件结构：

![文件目录结构](https://img-blog.csdnimg.cn/170f0911710a46928fdc1646f4e5fe20.png)

和 blob 类似， tree 也有对应的内容存储结构:

```shell
tree <content length><NUL><file mode> <file name><NUL><file hash>
```

其中 **content length** 指的后面`<file mode> <file name><NUL><file hash>`的长度，**NUL** 为 `\0`， **file mode** 指的是文件类型， 列举其中几种：

+ `0100000000000000` (`040000`): 文件夹
+ `1000000110100100` (`100644`): 常规非执行文件
+ `1000000110110100` (`100664`): 常规不可执行组可写文件
+ `1000000111101101` (`100755`): 常规可执行文件
+ `1010000000000000` (`120000`): 软链文件

**file name** 指的是文件名称， **file hash** 为 `blob` 或者 `tree` 的 hash 值，使用的是 20 位二进制值，非 40 位的 16 进制字符串。

具体来看上面例子中的信息，我们从最下面的 blob 文件往上看，通过上面的脚本， 可以计算出 `Main.java` 的 hash 为：`78ace89700a69e490c86f54fbe9d12f0cfb2dbdb`， `new.txt` 的 hash 为： `fa49b077972391ad58037050f2a75f74e3671e92`，因此，针对 `example` 这一级目录的文件类容如下：

```text
tree 72<NUL>
100644 Main.java<NUL>78ace89700a69e490c86f54fbe9d12f0cfb2dbdb
100644 new.txt<NUL>fa49b077972391ad58037050f2a75f74e3671e92
```

> PS：为了更好的阅读，上面的内容进行了换行处理，实际文件中并没有换行。格式中提到的 file hash 在此处为了便于展示，直接放了对应的 40 位的 16 进制字符串。

得到文件内容后，可以很方便的计算出 hash 为：`f6e2e8e5243c07191d0c1f4353448bd57785c39d`。也可以用 git 命令去验证：

```shell
➜ git cat-file -p f6e2e8e5243c07191d0c1f4353448bd57785c39d
100644 blob 78ace89700a69e490c86f54fbe9d12f0cfb2dbdb	Main.java
100644 blob fa49b077972391ad58037050f2a75f74e3671e92	new.txt
➜ git cat-file -t f6e2e8e5243c07191d0c1f4353448bd57785c39d
tree
```

当然，计算这个，我也用 Java 实现了一个简单的计算。看一下代码的实现：

```java
File[] allFiles = dir.listFiles();
//按文件名进行字典排序
SortedMap<File, HashData> allHash = new TreeMap<>(Comparator.comparing(File::getName));
for (File file : allFiles) {
    if (file.getName().equals(".git") || file.getName().equals(".DS_Store")) {
        continue;
    }
  	// 计算每一个文件的 hash
    allHash.put(file, calcHash(file));
}
// 拼接文件子文件的 hash 
byte[] allContent = new byte[0];
for (Map.Entry<File, HashData> item : allHash.entrySet()) {
    String header = getFileMode(item.getKey()) + " " + item.getKey().getName() + "\0";
    byte[] content = merge(header, item.getValue().originalData);
    byte[] tempContent = merge(allContent, content);
    allContent = tempContent;
}
String header = "tree " + allContent.length + "\0";
byte[] mergedArray = merge(header, allContent);
HashData hash = getHash(mergedArray, "SHA-1");
```

### 计算 commit 的 hash

与前面的 tree 和  blob 的相似，按照固定格式进行拼装即可：

```text
commit <content length><NUL>tree <tree hash>
parent <parent hash>
author <username> <email> <timestamp>
committer <username> <email> <timestamp>

<commit message>

```

需要注意的是，此格式中的 **tree hash** 与 **parent hash** 是 40 位的 16 进制值， 换行也是真实的换行。按照上面的格式进行拼装后，使用 SHA-1 可以很方便的计算出  Hash 值。

### Git 存储树结构

通过前面 blob 、tree、以及 commit 计算后，通过 commit 作为入口，就可以将所有的文件夹以及文件内容进行关联起来，构建一个树目录结构。还是前面提到的那个例子，一共执行了三次提交：

1. 在创建的 Git 项目中，添加 **Main.java** 后，并使用 `git commit -am "first commit"` 进行第一次提交
2. 继续在 **com/example** 文件夹下，添加 **new.txt** 文件， 并使用`git commit -am "add new file"` 进行第二次提交
3. 修改 **Main.java** 的内容， 并使用 `git commit -am "modify Main.java"` 进行第三次提交

在本例中， `.git/HEAD` 中指向的 `.git/refs/heads/main` 文件，此文件中存储了 `commit` 的  hash 值， 作为入口，可以将刚的三次提交，构建出一个树结构，如下图所示：

![仓库树结构示意图](https://img-blog.csdnimg.cn/fc934b817cea47a5b59d1b2b5445d15a.png)



## 三、Git LFS 二进制大文件处理

从上面的例子中，可以看到，**Main.java** 经过第一次的创建与后续的修改，创建了两个 blob ，虽然使用了 **zlib** 进行了压缩，但针对二进制文件文件，压缩率可以说很微小，这就会导致 objects 中存储的 blob 文件大小会快速增长。当我们首次克隆代码时，会把这些二进制的所有版本文件都下载下来，导致下载速度很慢。并且这些历史版本的文件，你可能永远也用不到，但是却不得不下载它。

![仓库大小变更](https://img-blog.csdnimg.cn/75e2085237d74f16a55fa10caae63e9d.png)

基于此，Git LFS 应运而生，它通过将大文件替换为一个很小的指针文件，并且在使用中，只会将当前需要使用到的二进制文件下载到本地即可。

### 安装配置 Git LFS 

在 mac 上，我喜欢使用 `Homebrew` 进行安装，使用如下命令就可以安装好 `git-lfs` ：

```shell
brew install git-lfs
```

安装好后，就可以对项目进行配置，在不支持 git-lfs 的项目目录下，执行如下命令：

```
git lfs install
```

此命令会更新 `.git/hooks/` 下的脚本，注入 `git` 命令的处理流程

![install 前后对比](https://img-blog.csdnimg.cn/ccbcaa7b39524af6ab003179aa95a834.png)

可以看到，在 `hooks` 文件夹中，多了 `post-checkout` 、`post-commit` 、`pre-push` 等脚本，根据这些脚本名称就知道其执行时间点。

下一步便是将我们要跟踪的二进制文件添加到跟踪目录中，使用如下命令：

```shell
git lfs track <file-type>
# 例如
# git lfs track "*.db"
```

执行后，会在项目根目录下创建 `.gitattributes` 文件，注意，需要将此文件上传到远程库中去。这个文件中的内容格式如下：

```
*.db filter=lfs diff=lfs merge=lfs -text
```

### Git LFS 指针转移

在这里，我随机生成了一个无序的二进制文件 `test.db`， 添加到项目中，并且执行 `git add .` 命令，会将此文件加入进去，从文件目录中可以看到，lfs 目录下新增了一个文件：

![LFS文件](https://img-blog.csdnimg.cn/b6a6f3c796094fa8abf52e85460745e7.png)

而在`f2bb0511bd0ce670c75a1ce4d52ecea91bad219b` 这个文件中存储的便是 lfs 的文件指针：

```
version https://git-lfs.github.com/spec/v1
oid sha256:d1ccb0fe6d165aab8c40c6b0aa796bf4f80011c050e168a625d3d2ab46b07306
size 41943040
```

通过此种方式，进行关联，降低代码库大小。最后，在看看官方图：

![官方图例](https://img-blog.csdnimg.cn/cdcc2ad0fa1340c586a85238db0e2889.png)



## 写到最后

创建于 2005 年的 Git 中，有很多知识点值得学习，建议有时间同学深入研究。最后，如果文中有错误和遗漏，欢迎与我联系。

