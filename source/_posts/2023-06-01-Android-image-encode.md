---
title: 安卓图片编码之必备技能
category: 安卓
tags: Android Image
---

在进行 Android 开发时，不可避免地会接触到许多图片格式，例如 JPEG、PNG 等。就以 JPEG 格式为例，它是一种有损压缩模式，使用 YCbCr 的颜色空间来保存色彩信息。当需要在屏幕上显示图片时，会将 JPEG 数据解码成 RGB 进行显示。本篇文章可能对初学者来说略显复杂。因此，建议读者具备一定的图像处理和 Android 开发基础知识。下面，一起来看看在 Android 中，如何使用图片编码以及对它们进行操作和处理。

##  NV21 中图片数据编码

首先，让我们来谈谈 NV21。在 Android 中，相机返回的图像格式默认使用的是 NV21，它属于 YUV420SP。YUV 是一种常见的颜色编码方法，经常用于影像处理的逻辑中。其中，**Y** 表示明亮度，**U** 和 **V** 表示色度和浓度。YUV 模型有很多种编码方式，其中 YUV420P 和 YUV420SP 最为常见。YUV420P 采用平面存储方式，即将 Y、U、V 三个分量分开存储，处理起来较为方便。而 YUV420SP 则采用分离存储方式，即将 Y 分量存储在一块连续的内存中，而 U 和 V 分量则交替存储在另一块连续内存中，有关这两种编码方式的区别，请参见下图：

![YUV420P 与 YUV420SP 的区别](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/3dfefc789ece48a2bb73e17363a4d6a1.png)

 YUV420P 与 YUV420SP 主要在 UV 的编码方式上。但是采样都是一样的数据。名字中的 `P` 与 `SP` 代表如下含义：

- P：指将 YUV 数据分为 3 个平面，Y/U/V 各占一个平面
- SP: Semi Planar二维平面，指 YUV 数据分为 2 个平面，Y 数据一个平面，UV 数据合用一个平面

YUV 的发明，是由于彩色电视与黑白电视的过渡时期。黑白电视中只有 Y，也就是只有灰阶值。而彩色电视中，把 UV 处理成彩度，如果忽略 UV，就只剩下 Y，这就和之前黑白电视信号相同，从而解决兼容问题。并且 YUV 在传输中只需要占极少的带宽。

讲了半天的 YUV，那么这个 YUV 和 RGB 编码的 bitmap 有什么关系呢？

![摸不着头脑](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/20211201001533871.png)



##  Bitmap 的编码格式

做过 Android 应该都体会过 OOM 带来的痛苦吧？在处理图片时，都会使用 `SampleSize` 进行缩放，来减少图片加载过程中占用的内存大小。图片在内存中按像素点进行加载，每个像素点中又包含着 A、R、G、B 四个通道，因此一张图的大小就相当于需要计算出像素点的个数，再乘以每个像素点所需要的内存大小。因此，一张图加载到内存中所占大小按如下方式进行计算：

```java 
width * height * size(ARGB)
```

前面提到的 `SampleSize` 进行缩放，就是修改了 width 和 height 的大小，来减小内存的大小。还有一种方式，就是减少每一个像素点所占的内存大小，来降低内存占用的总大小。

在 Android 中，RGB_565 、ARGB_8888、ARGB_4444 等编码方式，在这里，我介绍常用的前两个：

+ RGB_565：总共只占两个字节，Red 占 5 个 Bit，Green 占 6 个 Bit，Blue 占 5 个  Bit。
+ ARGB_8888：总共占四个字节，ARGB和占 1 个 Byte。

因此，如果图片使用的是 ARGB_8888 的方式加载，那么到内存中的大小为 **width * height * 4** 。Android 默认加载 Bitmap 时，也是使用这种编码格式。

ARGB_8888 很好理解，全量存储了 Alpha、Red 、Green、Blue。每一个值都取 0~255 的值。那么问题来了，在 RGB_565 中，R、G、B 三个颜色分量所占的位数都不够去存储全量的数据，所以在转换的过程中一定会存在数据丢失。 在实际的操作中，通常使用的办法就是将低位数据直接进行丢弃，这样 R/B 两通道分别能表示为 0 ~ 248 , 中间值间隔为 8 。 Green 能够显示更多信息。RGB_888 与 RGB_565 映射示例如下， 其中 RGB_888 的数据就被丢弃掉了：

![RGB_565 与 RGB_888 映射关系](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/20211204101817139.png)



## RGB 与 YUV 转换

在前面，介绍了 RGB 与 YUV 之间的存储区别，将 RGB 转成 YUV 格式的公式也已经存在很久了，只需要照抄公式就行了。

+ RGB 转 YUV

```cpp
Y = 0.299 * R + 0.587 * G + 0.114 * B
U = -0.169 * R - 0.331 * G + 0.5 * B + 128
V = 0.5 * R - 0.419 * G - 0.081 * B + 128
```

+ YUV 转 RGB 

```
R = Y + 1.13983 * (V - 128)
G = Y - 0.39465 * (U - 128) - 0.58060 * (V - 128)
B = Y + 2.03211 * (U - 128)
```

> PS， 以上公式摘抄于维基百科。



## YUV420SP  旋转

众所周知，Android 从相机中输出的图像是横向的。为了能够正常播放视频，需要将 NV21 格式的图像旋转 270 度。由于 Y 与像素点的对应关系为 1:1，因此旋转后的图像格式如下所示：

![YUV420SP 旋转 270 度 ](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/449c347f1c0647969c33e9dd18eaaae3.png)

如上图，所以旋转的代码如下： 

```java
public byte[] rotate270(byte[] original, int width, int height) {

  byte[] result = new byte[original.length];
  int resultPosition = 0;
  for (int i = 0; i < width; i++) {
    int originalPosition = width - i;
    for (int j = 0; j < height; j++) {
      result[resultPosition++] = original[originalPosition - 1];
      originalPosition += width;
    }
  }
  int uvHeight = height >> 1;
  int startPosition = width * height;

  for (int i = 0; i < width; i += 2) {
    int originalPosition = startPosition + width - i;
    for (int j = 0; j < uvHeight; j++) {
      result[resultPosition++] = original[originalPosition - 2];
      result[resultPosition++] = original[originalPosition - 1];
      originalPosition += width;
    }
  }
  return result;
}
```



## 缩小图片分辨率

在使用 Bitmap 时，我们可以使用 Matrix 进行缩放。那么，现在只有一个 NV21 的图片数据，要如何进行缩放呢？根据前面的内容，我们可以很容易地想到，直接对 NV21 的数据进行固定间隔取样就可以实现图像的缩放。根据缩放的比例，取对应点的 YUV 值。如下图所示，将 8 x 4 的图转换成 4 x 2 的大小：

![YUV 缩放](https://raw.githubusercontent.com/Pinned/pinned.github.io/refs/heads/awesome-picture/246dd71fcf9c45c9bfbc98bfe3b4df51.png)

当想明白这个图后，代码就很简单了，示例代码如下：

```java
public byte[] scaleYUV(byte[] yuv, int width, int height, int newWidth, int newHeight) {
    byte[] result = new byte[newWidth * newHeight * 3 / 2];
    float xStep =1f * width / newWidth;
    float yStep =1f * height / newHeight;
    int resultIndex = 0;
    for (int y = 0; y < newHeight; y ++) {
        for (int x = 0; x < newWidth; x ++) {
            int yuvIndex = (int)(yStep * y) * width + (int)(x * xStep);
            result[resultIndex] = yuv[yuvIndex];
            resultIndex++;
        }
    }

    // scale UV
    int uvIndex = 0;
    for (int y = 0; y < newHeight / 2; y ++) {
        for (int x = 0; x <  newWidth; x += 2) {
            int yuvIndex = width * height + (int)(yStep * y) * width + (int)(x * xStep);
            result[resultIndex + uvIndex] = yuv[yuvIndex];
            result[resultIndex + uvIndex + 1] = yuv[yuvIndex + 1];
            uvIndex += 2;
        }
    }

    return result;
}
```



## 写在最后

到目前为止，我们已经学会了在 Android 上使用图片编码并对其进行操作和处理的必要技能。希望这篇文章有助于您更好地理解 Android 中的图片编码，让您在开发时能够更加得心应手。

