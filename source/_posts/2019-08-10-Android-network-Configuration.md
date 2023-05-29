---
layout: post
styles: [syntax]
title:  Android 网络配置
category: 安卓
tags: Android Network
---
# HTTP 与 HTTPS 

自2017年1月1日开始，苹果要求所有的APP都要使用 HTTPS 进行网络请求，否则无法上架。但是 HTTPS 在 2000 年就已经确定下来。10多年过去，现在依然还有很多网站使用着 HTTP 协议。

HTTP协议以明文方式发送内容，不提供任何方式的数据加密，如果攻击者截取了Web浏览器和网站服务器之间的传输报文，就可以直接读懂其中的信息。为了数据传输的安全，HTTPS在HTTP的基础上加入了SSL协议，SSL依靠证书来验证服务器的身份，并为浏览器和服务器之间的通信加密。

Android 也从 Android 9.0 开始限制 HTTP 的网路请求。

# Android 网络安全配置

在 Android App 的开发过程中，测试服务器部署到内网服务器，没有配置 HTTPS 证书，导致我们的 APP 在 Android 9.0 上进行运行测试。

**解决方案**

1. 在 res/xml 文件中创建 `network_security_config.xml` (文件名可修改)，并按如下写入

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <network-security-config>
       <base-config cleartextTrafficPermitted="true">
           <trust-anchors>
               <certificates src="system" />
               <certificates src="user" />
           </trust-anchors>
       </base-config>
   </network-security-config>
   ```

2. 在 `AndroidManifest.xml` 的 **application** 标签中添加网络设置

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <manifest xmlns:android="http://schemas.android.com/apk/res/android"
       package="com.knero.network.example">
   <application xmlns:tools="http://schemas.android.com/tools"
   		android:networkSecurityConfig="@xml/network_security_config">
   </application>
   ```

到此，在Android 9.0 上，所有的 HTTP 网络请求都可以进行访问了。



# Android 默认网络配置

在 Android 9.0（API Level 28）或者更高的版本，网络配置默认如下：

```xml
<base-config cleartextTrafficPermitted="false">
    <trust-anchors>
        <certificates src="system" />
    </trust-anchors>
</base-config>
```

在 Android 7.0 (API level 24) 到 Android 8.1 (API level 27) 中，网络默认配置如下：

```xml
<base-config cleartextTrafficPermitted="true">
    <trust-anchors>
        <certificates src="system" />
    </trust-anchors>
</base-config>
```

在 Android 6.0（API Level 23）或者以下版本，网络默认配置如下： 

```xml
<base-config cleartextTrafficPermitted="true">
    <trust-anchors>
        <certificates src="system" />
        <certificates src="user" />
    </trust-anchors>
</base-config>
```



> PS: 在 Android 7.0 （API level 24）以上， 手机系统安装第三方证书也不能抓包，就是因为 trust-anchors 配置了只支持系统的，如果要实现抓包，可修改配置为 Android 6.0 的版本。



# 参考文档

+ [Network security configuration](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)

  
