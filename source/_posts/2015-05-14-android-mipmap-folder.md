---
layout: post
styles: [syntax]
title: Android mipmap文件夹
category: 安卓
tags: Android
---

用Android Studio 创建项目的时候，默认创建`mipmap`文件夹，而不是`drawable`

查看了一下官方的解释，如下：

```html
drawable/
For bitmap files (PNG, JPEG, or GIF), 9-Patch image files, and XML files that describe Drawable shapes or Drawable objects that contain multiple states (normal, pressed, or focused). See the Drawable resource type.
```

```html
mipmap/
For app launcher icons. The Android system retains the resources in this folder (and density-specific folders such as mipmap-xxxhdpi) regardless of the screen resolution of the device where your app is installed. This behavior allows launcher apps to pick the best resolution icon for your app to display on the home screen. For more information about using the mipmap folders.

Different home screen launcher apps on different devices show app launcher icons at various resolutions. When app resource optimization techniques remove resources for unused screen densities, launcher icons can wind up looking fuzzy because the launcher app has to upscale a lower-resolution icon for display. To avoid these display issues, apps should use the mipmap/ resource folders for launcher icons. The Android system preserves these resources regardless of density stripping, and ensures that launcher apps can pick icons with the best resolution for display.

Make sure launcher apps show a high-resolution icon for your app by moving all densities of your launcher icons to density-specific res/mipmap/ folders (for example res/mipmap-mdpi/ and res/mipmap-xxxhdpi/). The mipmap/ folders replace the drawable/ folders for launcher icons. For xxhpdi launcher icons, be sure to add the higher resolution xxxhdpi versions of the icons to enhance the visual experience of the icons on higher resolution devices.
```